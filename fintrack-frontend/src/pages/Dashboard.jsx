import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  ArrowRight,
  Receipt,
  PiggyBank,
  Target,
} from "lucide-react";

import api from "../services/api";
import analyticsApi from "../services/analyticsApi";

function Dashboard() {
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expense: 0,
  });

  const [categories, setCategories] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [budget, setBudget] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        summaryResponse,
        categoryResponse,
        monthlyResponse,
        budgetResponse,
        transactionsResponse,
      ] = await Promise.all([
        analyticsApi.get("/analytics/summary"),
        analyticsApi.get("/analytics/category"),
        analyticsApi.get("/analytics/monthly"),
        analyticsApi.get("/analytics/budget"),
        api.get("/transactions"),
      ]);

      const summaryData = summaryResponse.data?.[0];

      setSummary({
        total_income: Number(summaryData?.total_income || 0),
        total_expense: Number(summaryData?.total_expense || 0),
      });

      setCategories(categoryResponse.data || []);
      setMonthly(monthlyResponse.data || []);
      setBudget(budgetResponse.data || []);

      setTransactions(
        (transactionsResponse.data?.transactions || []).slice(0, 5)
      );
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else {
        setError(
          err.response?.data?.detail ||
            err.response?.data?.message ||
            "Failed to load dashboard data."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const netBalance =
    summary.total_income - summary.total_expense;

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
          <p className="text-sm font-medium text-slate-500">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-indigo-600">
            Financial Overview
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Welcome back 👋
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Here's what's happening with your finances.
          </p>
        </div>

        <Link
          to="/transactions"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
        >
          <Receipt size={17} />
          View Transactions
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-5 md:grid-cols-3">
        {/* Income */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Income
              </p>

              <p className="mt-3 text-2xl font-bold text-slate-900">
                ₹{summary.total_income.toFixed(2)}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowUpRight size={22} />
            </div>
          </div>

          <p className="mt-4 text-xs font-medium text-emerald-600">
            Money coming in
          </p>
        </div>

        {/* Expense */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Expense
              </p>

              <p className="mt-3 text-2xl font-bold text-slate-900">
                ₹{summary.total_expense.toFixed(2)}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <ArrowDownRight size={22} />
            </div>
          </div>

          <p className="mt-4 text-xs font-medium text-red-500">
            Money going out
          </p>
        </div>

        {/* Balance */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Net Balance
              </p>

              <p
                className={`mt-3 text-2xl font-bold ${
                  netBalance >= 0
                    ? "text-emerald-600"
                    : "text-red-500"
                }`}
              >
                ₹{netBalance.toFixed(2)}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Wallet size={22} />
            </div>
          </div>

          <p className="mt-4 text-xs font-medium text-slate-500">
            Income minus expenses
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Quick Access
          </h2>

          <p className="text-sm text-slate-500">
            Manage your finances from one place.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/accounts"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
          >
            <Wallet className="mb-4 text-indigo-600" size={22} />

            <h3 className="font-semibold text-slate-900">
              Accounts
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Manage your financial accounts
            </p>

            <ArrowRight
              className="mt-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600"
              size={18}
            />
          </Link>

          <Link
            to="/budget"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
          >
            <PiggyBank className="mb-4 text-indigo-600" size={22} />

            <h3 className="font-semibold text-slate-900">
              Budget
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Plan and control your spending
            </p>

            <ArrowRight
              className="mt-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600"
              size={18}
            />
          </Link>

          <Link
            to="/goals"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
          >
            <Target className="mb-4 text-indigo-600" size={22} />

            <h3 className="font-semibold text-slate-900">
              Savings Goals
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Track your financial goals
            </p>

            <ArrowRight
              className="mt-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600"
              size={18}
            />
          </Link>

          <Link
            to="/analytics"
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
          >
            <BarChart className="mb-4 text-indigo-600" size={22} />

            <h3 className="font-semibold text-slate-900">
              Analytics
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Understand your spending patterns
            </p>

            <ArrowRight
              className="mt-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600"
              size={18}
            />
          </Link>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Monthly Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Monthly Income & Expense
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Compare your income and spending over time.
            </p>
          </div>

          {monthly.length === 0 ? (
            <div className="flex h-[300px] items-center justify-center rounded-xl bg-slate-50">
              <p className="text-sm text-slate-400">
                No monthly analytics data available.
              </p>
            </div>
          ) : (
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={monthly}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip />

                  <Legend />

                  <Bar
                    dataKey="total_income"
                    name="Income"
                    radius={[5, 5, 0, 0]}
                  />

                  <Bar
                    dataKey="total_expense"
                    name="Expense"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Category Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Expense by Category
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              See where your money is being spent.
            </p>
          </div>

          {categories.length === 0 ? (
            <div className="flex h-[300px] items-center justify-center rounded-xl bg-slate-50">
              <p className="text-sm text-slate-400">
                No category spending data available.
              </p>
            </div>
          ) : (
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categories}
                    dataKey="total_expense"
                    nameKey="category_name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {categories.map((entry, index) => (
                      <Cell key={index} />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Budget */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900">
            Budget vs Spending
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Keep track of your planned and actual spending.
          </p>
        </div>

        {budget.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-xl bg-slate-50">
            <p className="text-sm text-slate-400">
              No budget data available.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3 font-semibold">
                    Category
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Budget
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Spent
                  </th>
                </tr>
              </thead>

              <tbody>
                {budget.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-4 py-4 font-medium text-slate-700">
                      {item.category_name ||
                        item.budget_name ||
                        "Budget"}
                    </td>

                    <td className="px-4 py-4 font-semibold text-slate-900">
                      ₹
                      {Number(
                        item.budget_amount ||
                          item.amount ||
                          0
                      ).toFixed(2)}
                    </td>

                    <td className="px-4 py-4 font-semibold text-red-500">
                      ₹
                      {Number(
                        item.actual_spending ||
                          item.spent ||
                          0
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent Transactions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your latest financial activity.
            </p>
          </div>

          <Link
            to="/transactions"
            className="hidden items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 sm:flex"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        {transactions.length === 0 ? (
          <div className="flex h-24 items-center justify-center rounded-xl bg-slate-50">
            <p className="text-sm text-slate-400">
              No transactions available.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3 font-semibold">
                    Date
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Description
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Type
                  </th>

                  <th className="px-4 py-3 text-right font-semibold">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => {
                  const isIncome =
                    transaction.transaction_type?.toLowerCase() ===
                    "income";

                  return (
                    <tr
                      key={transaction.transaction_id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-4 py-4 text-slate-500">
                        {transaction.transaction_date}
                      </td>

                      <td className="px-4 py-4 font-medium text-slate-700">
                        {transaction.description || "No description"}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isIncome
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-500"
                          }`}
                        >
                          {transaction.transaction_type}
                        </span>
                      </td>

                      <td
                        className={`px-4 py-4 text-right font-bold ${
                          isIncome
                            ? "text-emerald-600"
                            : "text-red-500"
                        }`}
                      >
                        {isIncome ? "+" : "-"}₹
                        {Number(transaction.amount).toFixed(2)}
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

export default Dashboard;