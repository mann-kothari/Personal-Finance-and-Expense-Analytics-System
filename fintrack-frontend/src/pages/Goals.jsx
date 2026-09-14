import { useEffect, useState } from "react";
import {
  Target,
  Plus,
  Pencil,
  Trash2,
  CalendarDays,
  IndianRupee,
  X,
  Trophy,
  CircleDollarSign,
} from "lucide-react";
import api from "../services/api";
import { getUserIdFromToken } from "../utils/auth";

function Goals() {
  const userId = getUserIdFromToken();

  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    goal_name: "",
    target_amount: "",
    current_amount: "0",
    target_date: "",
    description: "",
    status: "ACTIVE",
  });

  const fetchGoals = async () => {
    try {
      const response = await api.get(`/goals?user_id=${userId}`);
      setGoals(response.data.goals || []);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to load savings goals"
      );
    }
  };

  useEffect(() => {
    if (userId) {
      fetchGoals();
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Please login again.");
      return;
    }

    if (Number(formData.target_amount) <= 0) {
      alert("Target amount must be greater than 0.");
      return;
    }

    if (Number(formData.current_amount) < 0) {
      alert("Current amount cannot be negative.");
      return;
    }

    const goalData = {
      user_id: userId,
      goal_name: formData.goal_name,
      target_amount: Number(formData.target_amount),
      current_amount: Number(formData.current_amount),
      target_date: formData.target_date || null,
      description: formData.description,
      status: formData.status,
    };

    try {
      if (editingId) {
        await api.put(`/goals/${editingId}`, goalData);

        alert("Savings goal updated successfully");
      } else {
        await api.post("/goals", goalData);

        alert("Savings goal created successfully");
      }

      resetForm();
      fetchGoals();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Savings goal operation failed"
      );
    }
  };

  const handleEdit = (goal) => {
    setEditingId(goal.goal_id);

    setFormData({
      goal_name: goal.goal_name || "",
      target_amount: String(goal.target_amount),
      current_amount: String(goal.current_amount),
      target_date: goal.target_date || "",
      description: goal.description || "",
      status: goal.status || "ACTIVE",
    });

    setShowForm(true);
  };

  const handleDelete = async (goalId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this savings goal?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/goals/${goalId}?user_id=${userId}`);

      alert("Savings goal deleted successfully");

      fetchGoals();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete savings goal"
      );
    }
  };

  const resetForm = () => {
    setFormData({
      goal_name: "",
      target_amount: "",
      current_amount: "0",
      target_date: "",
      description: "",
      status: "ACTIVE",
    });

    setEditingId(null);
    setShowForm(false);
  };

  const calculateProgress = (goal) => {
    if (!goal.target_amount) {
      return 0;
    }

    const progress =
      (Number(goal.current_amount) /
        Number(goal.target_amount)) *
      100;

    return Math.min(Math.max(progress, 0), 100);
  };

  const totalTarget = goals.reduce(
    (total, goal) => total + Number(goal.target_amount || 0),
    0
  );

  const totalSaved = goals.reduce(
    (total, goal) => total + Number(goal.current_amount || 0),
    0
  );

  const completedGoals = goals.filter(
    (goal) => goal.status === "COMPLETED"
  ).length;

  const getStatusClasses = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700";
      case "PAUSED":
        return "bg-amber-50 text-amber-700";
      default:
        return "bg-indigo-50 text-indigo-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <Target size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Savings Goals
            </h1>

            <p className="text-sm text-slate-500">
              Set targets and track your savings progress
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Close" : "Add Goal"}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Target
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                ₹
                {totalTarget.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Target size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Saved
              </p>

              <p className="mt-2 text-2xl font-bold text-emerald-600">
                ₹
                {totalSaved.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CircleDollarSign size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Completed Goals
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {completedGoals}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Trophy size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Goal Form */}
      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              {editingId ? "Edit Savings Goal" : "Create Savings Goal"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editingId
                ? "Update the details of your savings goal"
                : "Set a target and start tracking your progress"}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            {/* Goal Name */}
            <div>
              <label
                htmlFor="goal_name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Goal Name
              </label>

              <input
                id="goal_name"
                type="text"
                name="goal_name"
                value={formData.goal_name}
                onChange={handleChange}
                placeholder="e.g. New Laptop"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Target Amount */}
            <div>
              <label
                htmlFor="target_amount"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"
              >
                <IndianRupee size={16} />
                Target Amount
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  ₹
                </span>

                <input
                  id="target_amount"
                  type="number"
                  name="target_amount"
                  value={formData.target_amount}
                  onChange={handleChange}
                  min="1"
                  step="0.01"
                  required
                  placeholder="Enter target"
                  className="w-full rounded-xl border border-slate-300 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Current Amount */}
            <div>
              <label
                htmlFor="current_amount"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"
              >
                <IndianRupee size={16} />
                Current Amount
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  ₹
                </span>

                <input
                  id="current_amount"
                  type="number"
                  name="current_amount"
                  value={formData.current_amount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  placeholder="Amount saved"
                  className="w-full rounded-xl border border-slate-300 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Target Date */}
            <div>
              <label
                htmlFor="target_date"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"
              >
                <CalendarDays size={16} />
                Target Date
              </label>

              <input
                id="target_date"
                type="date"
                name="target_date"
                value={formData.target_date}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your goal"
                rows="4"
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="PAUSED">PAUSED</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                {editingId ? <Pencil size={18} /> : <Plus size={18} />}
                {editingId ? "Update Goal" : "Save Goal"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <X size={18} />
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Goals */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Your Savings Goals
          </h2>

          <p className="text-sm text-slate-500">
            Track how close you are to reaching your targets
          </p>
        </div>

        {goals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Target size={26} />
            </div>

            <h3 className="font-semibold text-slate-800">
              No savings goals found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Create your first savings goal to start tracking your progress.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {goals.map((goal) => {
              const progress = calculateProgress(goal);

              return (
                <div
                  key={goal.goal_id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  {/* Goal Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <Target size={22} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {goal.goal_name}
                        </h3>

                        <p className="text-xs text-slate-400">
                          Goal #{goal.goal_id}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                        goal.status
                      )}`}
                    >
                      {goal.status}
                    </span>
                  </div>

                  {/* Amounts */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Saved
                      </p>

                      <p className="mt-1 text-lg font-bold text-emerald-600">
                        ₹
                        {Number(
                          goal.current_amount
                        ).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Target
                      </p>

                      <p className="mt-1 text-lg font-bold text-slate-900">
                        ₹
                        {Number(
                          goal.target_amount
                        ).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-600">
                        Progress
                      </span>

                      <span className="text-sm font-bold text-indigo-600">
                        {progress.toFixed(1)}%
                      </span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">
                        Target Date
                      </span>

                      <span className="font-medium text-slate-700">
                        {goal.target_date || "No date set"}
                      </span>
                    </div>

                    {goal.description && (
                      <p className="mt-3 text-sm leading-5 text-slate-500">
                        {goal.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(goal)}
                      title="Edit goal"
                      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <Pencil size={17} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(goal.goal_id)}
                      title="Delete goal"
                      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={17} />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Goals;