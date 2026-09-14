import { useEffect, useState } from "react";
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
      const response = await api.get(
        `/goals?user_id=${userId}`
      );

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

    if (
      Number(formData.target_amount) <= 0
    ) {
      alert("Target amount must be greater than 0.");
      return;
    }

    if (
      Number(formData.current_amount) < 0
    ) {
      alert("Current amount cannot be negative.");
      return;
    }

    const goalData = {
      user_id: userId,
      goal_name: formData.goal_name,
      target_amount: Number(
        formData.target_amount
      ),
      current_amount: Number(
        formData.current_amount
      ),
      target_date:
        formData.target_date || null,
      description: formData.description,
      status: formData.status,
    };

    try {
      if (editingId) {
        await api.put(
          `/goals/${editingId}`,
          goalData
        );

        alert(
          "Savings goal updated successfully"
        );
      } else {
        await api.post("/goals", goalData);

        alert(
          "Savings goal created successfully"
        );
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
      target_amount: String(
        goal.target_amount
      ),
      current_amount: String(
        goal.current_amount
      ),
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
      await api.delete(
        `/goals/${goalId}?user_id=${userId}`
      );

      alert(
        "Savings goal deleted successfully"
      );

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

  return (
    <div>
      <h1>Savings Goals</h1>

      <button
        onClick={() => {
          if (showForm) {
            resetForm();
          } else {
            setShowForm(true);
          }
        }}
      >
        {showForm ? "Close" : "Add Goal"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Goal Name</label>
            <input
              type="text"
              name="goal_name"
              value={formData.goal_name}
              onChange={handleChange}
              placeholder="e.g. New Laptop"
              required
            />
          </div>

          <div>
            <label>Target Amount</label>
            <input
              type="number"
              name="target_amount"
              value={formData.target_amount}
              onChange={handleChange}
              min="1"
              step="0.01"
              required
            />
          </div>

          <div>
            <label>Current Amount</label>
            <input
              type="number"
              name="current_amount"
              value={formData.current_amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label>Target Date</label>
            <input
              type="date"
              name="target_date"
              value={formData.target_date}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your goal"
            />
          </div>

          <div>
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="ACTIVE">
                ACTIVE
              </option>
              <option value="COMPLETED">
                COMPLETED
              </option>
              <option value="PAUSED">
                PAUSED
              </option>
            </select>
          </div>

          <button type="submit">
            {editingId
              ? "Update Goal"
              : "Save Goal"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </form>
      )}

      <hr />

      <h2>Your Savings Goals</h2>

      {goals.length === 0 ? (
        <p>No savings goals found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Goal</th>
              <th>Target</th>
              <th>Saved</th>
              <th>Progress</th>
              <th>Target Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {goals.map((goal) => {
              const progress =
                calculateProgress(goal);

              return (
                <tr key={goal.goal_id}>
                  <td>{goal.goal_name}</td>

                  <td>
                    ₹
                    {Number(
                      goal.target_amount
                    ).toFixed(2)}
                  </td>

                  <td>
                    ₹
                    {Number(
                      goal.current_amount
                    ).toFixed(2)}
                  </td>

                  <td>
                    {progress.toFixed(1)}%
                  </td>

                  <td>
                    {goal.target_date || "—"}
                  </td>

                  <td>{goal.status}</td>

                  <td>
                    <button
                      onClick={() =>
                        handleEdit(goal)
                      }
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          goal.goal_id
                        )
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Goals;