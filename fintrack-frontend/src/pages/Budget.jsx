import { useEffect, useState } from "react";
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
      const response = await api.get(
        `/budgets?user_id=${userId}`
      );

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
        await api.put(
          `/budgets/${editingId}`,
          budgetData
        );

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

  return (
    <div>
      <h1>Budget Management</h1>

      <button
        onClick={() => {
          if (showForm) {
            resetForm();
          } else {
            setShowForm(true);
          }
        }}
      >
        {showForm ? "Close" : "Add Budget"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Category ID</label>
            <input
              type="number"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div>
            <label>Budget Name</label>
            <input
              type="text"
              name="budget_name"
              value={formData.budget_name}
              onChange={handleChange}
              placeholder="e.g. Monthly Food Budget"
            />
          </div>

          <div>
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="1"
              step="0.01"
              required
            />
          </div>

          <div>
            <label>Start Date</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>End Date</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">
            {editingId
              ? "Update Budget"
              : "Save Budget"}
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

      <h2>Budgets</h2>

      {budgets.length === 0 ? (
        <p>No budgets found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Start</th>
              <th>End</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {budgets.map((budget) => (
              <tr key={budget.budget_id}>
                <td>
                  {budget.budget_name || "Unnamed"}
                </td>

                <td>{budget.category_id}</td>

                <td>
                  ₹{Number(budget.amount).toFixed(2)}
                </td>

                <td>{budget.start_date}</td>

                <td>{budget.end_date}</td>

                <td>
                  <button
                    onClick={() =>
                      handleEdit(budget)
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(budget.budget_id)
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Budget;