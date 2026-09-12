import { useState } from "react";

function Accounts() {
  const [accounts, setAccounts] = useState([]);

  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("");
  const [balance, setBalance] = useState("");

  const addAccount = (e) => {
    e.preventDefault();

    if (!accountName.trim() || !accountType || balance === "") {
      alert("Please fill all fields.");
      return;
    }

    if (Number(balance) < 0) {
      alert("Balance cannot be negative.");
      return;
    }

    const newAccount = {
      id: Date.now(),
      name: accountName.trim(),
      type: accountType,
      balance: Number(balance),
    };

    setAccounts((prevAccounts) => [...prevAccounts, newAccount]);

    setAccountName("");
    setAccountType("");
    setBalance("");
  };

  const deleteAccount = (id) => {
    setAccounts((prevAccounts) =>
      prevAccounts.filter((account) => account.id !== id)
    );
  };

  return (
    <div>
      <h1>Accounts</h1>

      <h2>Add Account</h2>

      <form onSubmit={addAccount}>
        <div>
          <label htmlFor="accountName">Account Name</label>
          <br />
          <input
            id="accountName"
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="e.g. HDFC Savings"
          />
        </div>

        <br />

        <div>
          <label htmlFor="accountType">Account Type</label>
          <br />
          <select
            id="accountType"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
          >
            <option value="">Select account type</option>
            <option value="Savings">Savings</option>
            <option value="Current">Current</option>
            <option value="Cash">Cash</option>
            <option value="Credit Card">Credit Card</option>
          </select>
        </div>

        <br />

        <div>
          <label htmlFor="balance">Balance</label>
          <br />
          <input
            id="balance"
            type="number"
            min="0"
            step="0.01"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            placeholder="Enter balance"
          />
        </div>

        <br />

        <button type="submit">Add Account</button>
      </form>

      <hr />

      <h2>My Accounts</h2>

      {accounts.length === 0 ? (
        <p>No accounts added yet.</p>
      ) : (
        accounts.map((account) => (
          <div key={account.id}>
            <h3>{account.name}</h3>

            <p>Type: {account.type}</p>

            <p>
              Balance: ₹{account.balance.toFixed(2)}
            </p>

            <button onClick={() => deleteAccount(account.id)}>
              Delete
            </button>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Accounts;