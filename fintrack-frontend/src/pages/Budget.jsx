import { useEffect, useState } from "react";
import {
  WalletCards,
  Plus,
  Pencil,
  Trash2,
  CalendarDays,
  Tag,
  IndianRupee,
  X,
} from "lucide-react";
import api from "../services/api";
import { getUserIdFromToken } from "../utils/auth";

function Budget() {
  const userId = getUserIdFromToken();

  const [budgets, setBudgets] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    category_id: "",
    budget_name: "",
    amount: "",
    start_date: "",
    end_date: "",
  });

  const fetchBudgets = async () => {
    try {
      const response = await api.get(`/budgets?user_id=${userId}`);
      setBudgets(response.data.budgets || []);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to load budgets"
      );
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBudgets();
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

    if (formData.end_date < formData.start_date) {
      alert("End date cannot be before start date.");
      return;
    }

    const budgetData = {
      user_id: userId,
      category_id: Number(formData.category_id),
      budget_name: formData.budget_name,
      amount: Number(formData.amount),
      start_date: formData.start_date,
      end_date: formData.end_date,
    };

    try {
      if (editingId) {
        await api.put(`/budgets/${editingId}`, budgetData);
        alert("Budget updated successfully");
      } else {
        await api.post("/budgets", budgetData);
        alert("Budget created successfully");
      }

      resetForm();
      fetchBudgets();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Budget operation failed"
      );
    }
  };

  const handleEdit = (budget) => {
    setEditingId(budget.budget_id);

    setFormData({
      category_id: String(budget.category_id),
      budget_name: budget.budget_name || "",
      amount: String(budget.amount),
      start_date: budget.start_date,
      end_date: budget.end_date,
    });

    setShowForm(true);
  };

  const handleDelete = async (budgetId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this budget?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/budgets/${budgetId}?user_id=${userId}`
      );

      alert("Budget deleted successfully");
      fetchBudgets();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete budget"
      );
    }
  };

  const resetForm = () => {
    setFormData({
      category_id: "",
      budget_name: "",
      amount: "",
      start_date: "",
      end_date: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  const totalBudget = budgets.reduce(
    (total, budget) => total + Number(budget.amount || 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <WalletCards size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Budget Management
            </h1>

            <p className="text-sm text-slate-500">
              Plan and manage your spending limits
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
          {showForm ? "Close" : "Add Budget"}
        </button>
      </div>

      {/* Summary */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-100">
              Total Planned Budget
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              ₹
              {totalBudget.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>

            <p className="mt-2 text-sm text-indigo-100">
              Across {budgets.length} budget
              {budgets.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="hidden h-12 w-12 items-center justify-center rounded-xl bg-white/10 sm:flex">
            <WalletCards size={26} />
          </div>
        </div>
      </div>

      {/* Budget Form */}
      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              {editingId ? "Edit Budget" : "Create New Budget"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editingId
                ? "Update the details of your budget"
                : "Set a spending limit for a category"}
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            {/* Category ID */}
            <div>
              <label
                htmlFor="category_id"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"
              >
                <Tag size={16} />
                Category ID
              </label>

              <input
                id="category_id"
                type="number"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                min="1"
                required
                placeholder="e.g. 1"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Budget Name */}
            <div>
              <label
                htmlFor="budget_name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Budget Name
              </label>

              <input
                id="budget_name"
                type="text"
                name="budget_name"
                value={formData.budget_name}
                onChange={handleChange}
                placeholder="e.g. Monthly Food Budget"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Amount */}
            <div>
              <label
                htmlFor="amount"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"
              >
                <IndianRupee size={16} />
                Budget Amount
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  ₹
                </span>

                <input
                  id="amount"
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="1"
                  step="0.01"
                  required
                  placeholder="Enter amount"
                  className="w-full rounded-xl border border-slate-300 py-3 pl-9 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Start Date */}
            <div>
              <label
                htmlFor="start_date"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"
              >
                <CalendarDays size={16} />
                Start Date
              </label>

              <input
                id="start_date"
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor="end_date"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700"
              >
                <CalendarDays size={16} />
                End Date
              </label>

              <input
                id="end_date"
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 md:col-span-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <Plus size={18} />
                {editingId ? "Update Budget" : "Save Budget"}
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

      {/* Budget List */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Your Budgets
          </h2>

          <p className="text-sm text-slate-500">
            Track and manage your spending limits
          </p>
        </div>

        {budgets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <WalletCards size={26} />
            </div>

            <h3 className="font-semibold text-slate-800">
              No budgets found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Create your first budget to start planning your expenses.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Budget
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Category
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Start
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      End
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {budgets.map((budget) => (
                    <tr
                      key={budget.budget_id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                            <WalletCards size={19} />
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              {budget.budget_name || "Unnamed"}
                            </p>

                            <p className="text-xs text-slate-400">
                              Budget #{budget.budget_id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                          Category {budget.category_id}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-900">
                          ₹
                          {Number(budget.amount).toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {budget.start_date}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {budget.end_date}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(budget)}
                            title="Edit budget"
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(budget.budget_id)
                            }
                            title="Delete budget"
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Budget;