import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:5000";

function Transactions() {
  const USER_ID = 1;
  const ACCOUNT_ID = 1;

  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    date: "",
    description: "",
    category: "",
    type: "Expense",
    amount: "",
  });

  // GET transactions
  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/transactions?user_id=${USER_ID}`
      );

      const data = await response.json();

      if (response.ok) {
        setTransactions(data.transactions);
      } else {
        alert(data.message || "Failed to load transactions");
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to Flask backend");
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Form input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ADD or UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const transactionData = {
      user_id: USER_ID,
      account_id: ACCOUNT_ID,
      category_id: Number(formData.category),
      transaction_type: formData.type.toUpperCase(),
      amount: Number(formData.amount),
      description: formData.description,
      transaction_date: formData.date,
    };

    try {
      let response;

      if (editingId) {
        // UPDATE
        response = await fetch(
          `${API_URL}/api/transactions/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(transactionData),
          }
        );
      } else {
        // ADD
        response = await fetch(`${API_URL}/api/transactions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transactionData),
        });
      }

      const data = await response.json();

      if (response.ok) {
        alert(
          editingId
            ? "Transaction updated successfully"
            : "Transaction added successfully"
        );

        resetForm();
        fetchTransactions();
      } else {
        alert(data.message || "Operation failed");
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to Flask backend");
    }
  };

  // EDIT button
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
      const response = await fetch(
        `${API_URL}/api/transactions/${transactionId}?user_id=${USER_ID}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Transaction deleted successfully");
        fetchTransactions();
      } else {
        alert(data.message || "Failed to delete transaction");
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to Flask backend");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      date: "",
      description: "",
      category: "",
      type: "Expense",
      amount: "",
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
        {showForm
          ? "Close"
          : "Add Transaction"}
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
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.transaction_id}>
              <td>{transaction.transaction_date}</td>

              <td>{transaction.description}</td>

              <td>{transaction.category_id}</td>

              <td>{transaction.transaction_type}</td>

              <td>₹{transaction.amount}</td>

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
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Transactions;