import { useEffect, useState } from "react";
import {
  Wallet,
  Plus,
  Trash2,
  CreditCard,
  Banknote,
  Building2,
  WalletCards,
  Loader2,
} from "lucide-react";
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
    const confirmed = window.confirm(
      "Are you sure you want to delete this account?"
    );

    if (!confirmed) return;

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

  const getAccountIcon = (type) => {
    switch (type) {
      case "Savings":
        return <Building2 size={22} />;
      case "Current":
        return <WalletCards size={22} />;
      case "Cash":
        return <Banknote size={22} />;
      case "Credit Card":
        return <CreditCard size={22} />;
      default:
        return <Wallet size={22} />;
    }
  };

  const totalBalance = accounts.reduce(
    (total, account) => total + Number(account.opening_balance || 0),
    0
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <Wallet size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Accounts
            </h1>
            <p className="text-sm text-slate-500">
              Manage your bank accounts, cash and cards
            </p>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-indigo-100">
              Total Account Balance
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              ₹{totalBalance.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
            <Wallet size={26} />
          </div>
        </div>
      </div>

      {/* Add Account */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Plus size={20} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Add Account
            </h2>
            <p className="text-sm text-slate-500">
              Add a new account to track your finances
            </p>
          </div>
        </div>

        <form
          onSubmit={addAccount}
          className="grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {/* Account Name */}
          <div>
            <label
              htmlFor="accountName"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Account Name
            </label>

            <input
              id="accountName"
              type="text"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="e.g. HDFC Savings"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Account Type */}
          <div>
            <label
              htmlFor="accountType"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Account Type
            </label>

            <select
              id="accountType"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">Select account type</option>
              <option value="Savings">Savings</option>
              <option value="Current">Current</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
            </select>
          </div>

          {/* Balance */}
          <div>
            <label
              htmlFor="balance"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Opening Balance
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                ₹
              </span>

              <input
                id="balance"
                type="number"
                min="0"
                step="0.01"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="Enter balance"
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-9 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="md:col-span-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
            >
              <Plus size={18} />
              Add Account
            </button>
          </div>
        </form>
      </div>

      {/* Accounts List */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              My Accounts
            </h2>
            <p className="text-sm text-slate-500">
              {accounts.length} account
              {accounts.length !== 1 ? "s" : ""} connected
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-12 shadow-sm">
            <div className="flex items-center gap-3 text-slate-500">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Loading accounts...</span>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && accounts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Wallet size={26} />
            </div>

            <h3 className="font-semibold text-slate-800">
              No accounts yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Add your first account using the form above.
            </p>
          </div>
        )}

        {/* Account Cards */}
        {!loading && !error && accounts.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {accounts.map((account) => (
              <div
                key={account.account_id}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      {getAccountIcon(account.account_type)}
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {account.account_name}
                      </h3>

                      <p className="text-xs text-slate-500">
                        {account.account_type}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteAccount(account.account_id)}
                    title="Delete account"
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Balance
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    ₹{Number(account.opening_balance).toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                  <span>Currency</span>
                  <span className="font-medium text-slate-600">
                    {account.currency || "INR"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Accounts;