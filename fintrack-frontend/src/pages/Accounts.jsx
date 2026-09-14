import { useEffect, useState } from "react";
import api from "../services/api";

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("");
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/accounts");
      setAccounts(response.data.accounts || []);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to load accounts."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const addAccount = async (e) => {
    e.preventDefault();

    if (!accountName.trim() || !accountType || balance === "") {
      alert("Please fill all fields.");
      return;
    }

    if (Number(balance) < 0) {
      alert("Balance cannot be negative.");
      return;
    }

    try {
      await api.post("/accounts", {
        account_name: accountName.trim(),
        account_type: accountType,
        opening_balance: Number(balance),
        currency: "INR",
      });

      setAccountName("");
      setAccountType("");
      setBalance("");

      await fetchAccounts();
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "Failed to add account."
      );
    }
  };

  const deleteAccount = async (accountId) => {
    try {
      await api.delete(`/accounts/${accountId}`);
      await fetchAccounts();
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "Failed to delete account."
      );
    }
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

      {loading && <p>Loading accounts...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && accounts.length === 0 && (
        <p>No accounts added yet.</p>
      )}

      {!loading &&
        accounts.map((account) => (
          <div key={account.account_id}>
            <h3>{account.account_name}</h3>

            <p>Type: {account.account_type}</p>

            <p>
              Balance: ₹{Number(account.opening_balance).toFixed(2)}
            </p>

            <button
              onClick={() => deleteAccount(account.account_id)}
            >
              Delete
            </button>

            <hr />
          </div>
        ))}
    </div>
  );
}

export default Accounts;