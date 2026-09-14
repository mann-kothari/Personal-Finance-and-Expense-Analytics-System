import { useEffect, useState } from "react";
import {
  Plus,
  X,
  CalendarDays,
  FileText,
  Wallet,
  Tag,
  ArrowDownRight,
  ArrowUpRight,
  Pencil,
  Trash2,
  Receipt,
} from "lucide-react";
import api from "../services/api";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

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

  // GET accounts
  const fetchAccounts = async () => {
    try {
      const response = await api.get("/accounts");

      setAccounts(response.data.accounts || []);
    } catch (error) {
      console.error("Failed to load accounts:", error);
    }
  };

  // GET categories
  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");

      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchAccounts();
    fetchCategories();
  }, []);

  // Form input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // If transaction type changes, clear selected category
    if (name === "type") {
      setFormData((prev) => ({
        ...prev,
        type: value,
        category: "",
      }));
    }
  };

  // Categories matching transaction type
  const filteredCategories = categories.filter(
    (category) =>
      category.category_type?.toUpperCase() ===
      formData.type.toUpperCase()
  );

  // ADD or UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.account) {
      alert("Please select an account.");
      return;
    }

    if (!formData.category) {
      alert("Please select a category.");
      return;
    }

    const transactionData = {
      account_id: Number(formData.account),
      category_id: Number(formData.category),
      transaction_type: formData.type.toUpperCase(),
      amount: Number(formData.amount),
      description: formData.description,
      transaction_date: formData.date,
    };

    try {
      if (editingId) {
        await api.put(
          `/transactions/${editingId}`,
          transactionData
        );
      } else {
        await api.post(
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
      date: transaction.transaction_date?.split("T")[0] || "",
      description: transaction.description || "",
      category: String(transaction.category_id),
      type:
        transaction.transaction_type?.toUpperCase() === "INCOME"
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
      await api.delete(`/transactions/${transactionId}`);

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
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-indigo-600">
            Money Management
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Transactions
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Track and manage your income and expenses.
          </p>
        </div>

        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          className={`inline-flex w-fit items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-lg transition ${
            showForm
              ? "border border-slate-200 bg-white text-slate-700 shadow-slate-200/50 hover:bg-slate-50"
              : "bg-indigo-600 text-white shadow-indigo-600/20 hover:bg-indigo-700"
          }`}
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}

          {showForm ? "Close" : "Add Transaction"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Receipt size={20} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Transactions
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {transactions.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowUpRight size={20} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Income Entries
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {
                  transactions.filter(
                    (item) =>
                      item.transaction_type?.toUpperCase() ===
                      "INCOME"
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <ArrowDownRight size={20} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Expense Entries
              </p>

              <p className="mt-1 text-xl font-bold text-slate-900">
                {
                  transactions.filter(
                    (item) =>
                      item.transaction_type?.toUpperCase() ===
                      "EXPENSE"
                  ).length
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Form */}
      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-7">
            <h2 className="text-xl font-bold text-slate-900">
              {editingId
                ? "Edit Transaction"
                : "Add New Transaction"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter the details of your financial activity.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-5 md:grid-cols-2">
              {/* Date */}
              <div>
                <label
                  htmlFor="date"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Description
                </label>

                <div className="relative">
                  <FileText
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="description"
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="e.g. Grocery shopping"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </div>

              {/* Account */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Account
                </label>

                <select
                  name="account"
                  value={formData.account}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  required
                >
                  <option value="">Select Account</option>

                  {accounts.map((account) => (
                    <option
                      key={account.account_id}
                      value={account.account_id}
                    >
                      {account.account_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Category
                </label>

                <div className="relative">
                  <Tag
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  >
                    <option value="">
                      Select a category
                    </option>

                    {filteredCategories.map((category) => (
                      <option
                        key={category.category_id}
                        value={category.category_id}
                      >
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Type */}
              <div>
                <label
                  htmlFor="type"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Transaction Type
                </label>

                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                >
                  <option value="Expense">Expense</option>
                  <option value="Income">Income</option>
                </select>
              </div>

              {/* Amount */}
              <div>
                <label
                  htmlFor="amount"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Amount
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                    ₹
                  </span>

                  <input
                    id="amount"
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
              >
                {editingId ? (
                  <Pencil size={17} />
                ) : (
                  <Plus size={17} />
                )}

                {editingId
                  ? "Update Transaction"
                  : "Save Transaction"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Transaction History */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
          <h2 className="text-xl font-bold text-slate-900">
            Transaction History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            A complete record of your recent financial activity.
          </p>
        </div>

        {transactions.length === 0 ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Receipt size={26} />
            </div>

            <h3 className="font-semibold text-slate-700">
              No transactions yet
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-400">
              Add your first transaction to start tracking your
              financial activity.
            </p>

            <button
              onClick={() => setShowForm(true)}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700"
            >
              <Plus size={17} />
              Add Transaction
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4 font-semibold">
                    Date
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Description
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Account
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Category
                  </th>

                  <th className="px-6 py-4 font-semibold">
                    Type
                  </th>

                  <th className="px-6 py-4 text-right font-semibold">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-right font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => {
                  const isIncome =
                    transaction.transaction_type?.toUpperCase() ===
                    "INCOME";

                  const account = accounts.find(
                    (item) =>
                      Number(item.account_id) ===
                      Number(transaction.account_id)
                  );

                  const category = categories.find(
                    (item) =>
                      Number(item.category_id) ===
                      Number(transaction.category_id)
                  );

                  return (
                    <tr
                      key={transaction.transaction_id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 text-slate-500">
                        {transaction.transaction_date}
                      </td>

                      <td className="px-6 py-4 font-medium text-slate-700">
                        {transaction.description ||
                          "No description"}
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        {account?.account_name ||
                          `#${transaction.account_id}`}
                      </td>

                      <td className="px-6 py-4 text-slate-500">
                        {category?.category_name ||
                          `#${transaction.category_id}`}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isIncome
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-500"
                          }`}
                        >
                          {isIncome ? (
                            <ArrowUpRight size={13} />
                          ) : (
                            <ArrowDownRight size={13} />
                          )}

                          {transaction.transaction_type}
                        </span>
                      </td>

                      <td
                        className={`px-6 py-4 text-right font-bold ${
                          isIncome
                            ? "text-emerald-600"
                            : "text-red-500"
                        }`}
                      >
                        {isIncome ? "+" : "-"}₹
                        {Number(transaction.amount).toFixed(2)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              handleEdit(transaction)
                            }
                            title="Edit transaction"
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                transaction.transaction_id
                              )
                            }
                            title="Delete transaction"
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions;