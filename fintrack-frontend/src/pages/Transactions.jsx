import { useEffect, useState } from "react";
import api from "../services/api";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    date: "",
    description: "",
    category: "",
    type: "Expense",
    amount: "",
    account: "",
  });

  // GET transactions
  const fetchTransactions = async () => {
    try {
      const response = await api.get("/transactions");

      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
      } else {
        alert(
          error.response?.data?.message ||
            "Failed to load transactions"
        );
      }
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Form input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ADD or UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const transactionData = {
      account_id: Number(formData.account),
      category_id: Number(formData.category),
      transaction_type: formData.type.toUpperCase(),
      amount: Number(formData.amount),
      description: formData.description,
      transaction_date: formData.date,
    };

    try {
      let response;

      if (editingId) {
        response = await api.put(
          `/transactions/${editingId}`,
          transactionData
        );
      } else {
        response = await api.post(
          "/transactions",
          transactionData
        );
      }

      alert(
        editingId
          ? "Transaction updated successfully"
          : "Transaction added successfully"
      );

      resetForm();
      fetchTransactions();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Transaction operation failed"
      );
    }
  };

  // EDIT
  const handleEdit = (transaction) => {
    setEditingId(transaction.transaction_id);

    setFormData({
      date: transaction.transaction_date,
      description: transaction.description || "",
      category: String(transaction.category_id),
      type:
        transaction.transaction_type === "INCOME"
          ? "Income"
          : "Expense",
      amount: String(transaction.amount),
      account: String(transaction.account_id),
    });

    setShowForm(true);
  };

  // DELETE
  const handleDelete = async (transactionId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(
        `/transactions/${transactionId}`
      );

      alert("Transaction deleted successfully");

      fetchTransactions();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete transaction"
      );
    }
  };

  // Reset
  const resetForm = () => {
    setFormData({
      date: "",
      description: "",
      category: "",
      type: "Expense",
      amount: "",
      account: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <h1>Transactions</h1>

      <button
        onClick={() => {
          if (showForm) {
            resetForm();
          } else {
            setShowForm(true);
          }
        }}
      >
        {showForm ? "Close" : "Add Transaction"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Description</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              required
            />
          </div>

          <div>
            <label>Account ID</label>
            <input
              type="number"
              name="account"
              value={formData.account}
              onChange={handleChange}
              placeholder="Enter account ID"
              min="1"
              required
            />
          </div>

          <div>
            <label>Category ID</label>
            <input
              type="number"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter category ID"
              min="1"
              required
            />
          </div>

          <div>
            <label>Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
            </select>
          </div>

          <div>
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              min="1"
              step="0.01"
              required
            />
          </div>

          <button type="submit">
            {editingId
              ? "Update Transaction"
              : "Save Transaction"}
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

      <h2>Transaction History</h2>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Account</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="7">
                No transactions found
              </td>
            </tr>
          ) : (
            transactions.map((transaction) => (
              <tr
                key={transaction.transaction_id}
              >
                <td>
                  {transaction.transaction_date}
                </td>

                <td>
                  {transaction.description}
                </td>

                <td>
                  {transaction.account_id}
                </td>

                <td>
                  {transaction.category_id}
                </td>

                <td>
                  {transaction.transaction_type}
                </td>

                <td>
                  ₹{transaction.amount}
                </td>

                <td>
                  <button
                    onClick={() =>
                      handleEdit(transaction)
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        transaction.transaction_id
                      )
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Transactions;