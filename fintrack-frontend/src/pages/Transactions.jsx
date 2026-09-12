import { useState } from "react";

function Transactions() {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      date: "2026-09-12",
      description: "Grocery Shopping",
      category: "Food",
      type: "Expense",
      amount: 1500,
    },
    {
      id: 2,
      date: "2026-09-10",
      description: "Monthly Salary",
      category: "Salary",
      type: "Income",
      amount: 30000,
    },
    {
      id: 3,
      date: "2026-09-08",
      description: "Bus Pass",
      category: "Transport",
      type: "Expense",
      amount: 500,
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    description: "",
    category: "",
    type: "Expense",
    amount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTransaction = {
      id: transactions.length + 1,
      date: formData.date,
      description: formData.description,
      category: formData.category,
      type: formData.type,
      amount: Number(formData.amount),
    };

    setTransactions([...transactions, newTransaction]);

    setFormData({
      date: "",
      description: "",
      category: "",
      type: "Expense",
      amount: "",
    });

    setShowForm(false);
  };

  const handleDelete = (id) => {
    setTransactions(
      transactions.filter((transaction) => transaction.id !== id)
    );
  };

  return (
    <div>
      <h1>Transactions</h1>

      <button onClick={() => setShowForm(!showForm)}>
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
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter category"
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

          <button type="submit">Save Transaction</button>
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
            <tr key={transaction.id}>
              <td>{transaction.date}</td>
              <td>{transaction.description}</td>
              <td>{transaction.category}</td>
              <td>{transaction.type}</td>
              <td>₹{transaction.amount}</td>
              <td>
                <button onClick={() => handleDelete(transaction.id)}>
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