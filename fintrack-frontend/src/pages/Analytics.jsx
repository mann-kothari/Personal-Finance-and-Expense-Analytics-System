import { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";
import analyticsApi from "../services/analyticsApi";
import api from "../services/api";

function Analytics() {
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expense: 0,
  });

  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [budgetData, setBudgetData] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
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
        const summaryResult = summaryResponse.data;

        setSummary(
          Array.isArray(summaryResult)
            ? summaryResult[0] || {
                total_income: 0,
                total_expense: 0,
              }
            : summaryResult
        );

        setCategoryData(categoryResponse.data || []);
        setMonthlyData(monthlyResponse.data || []);
        setBudgetData(budgetResponse.data || []);
        setTransactions(transactionsResponse.data.transactions || []);
      } catch (err) {
        console.error("Analytics fetch error:", err);
        setError("Unable to load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const totalIncome = Number(summary.total_income || 0);
  const totalExpense = Number(summary.total_expense || 0);
  const netSavings = totalIncome - totalExpense;

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  
  const formatMonth = (value) => {
    if (!value) return "";

    const date = new Date(value);

    return date.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });
  };

  const transactionCount = transactions.length || 0;
  // ? monthlyData.reduce(
  //     (total, item) =>
  //       total +
  //       Number(
  //         item.transaction_count ||
  //           item.transactions_count ||
  //           item.count ||
  //           0
  //       ),
  //     0
  //   )
  // : 0;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <p className="mt-4 text-sm text-slate-500">
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
          <BarChart3 size={24} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Analytics
          </h1>

          <p className="text-sm text-slate-500">
            Understand your income, expenses and spending patterns
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {/* Income */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Income
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {formatCurrency(totalIncome)}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowUpRight size={22} />
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Income recorded in your account
          </p>
        </div>

        {/* Expenses */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Expenses
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {formatCurrency(totalExpense)}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <ArrowDownRight size={22} />
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Expenses recorded in your account
          </p>
        </div>

        {/* Savings */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Net Savings
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {formatCurrency(netSavings)}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <TrendingUp size={22} />
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Income minus expenses
          </p>
        </div>

        {/* Activity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Transactions
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900">
                {transactionCount}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Activity size={22} />
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Recorded transactions
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Monthly Overview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Monthly Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Compare your income and expenses
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <BarChart3 size={20} />
            </div>
          </div>

          {monthlyData.length > 0 ? (
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    tickFormatter={formatMonth}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    labelFormatter={formatMonth} 
                  />

                  <Bar
                    dataKey="total_income"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                  />

                  <Bar
                    dataKey="total_expense"
                    fill="#ef4444"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              icon={<BarChart3 size={34} />}
              title="No monthly data available"
              description="Add transactions to view your monthly analytics"
            />
          )}
        </div>

        {/* Category Spending */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Spending by Category
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                See where your money is going
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <PieChart size={20} />
            </div>
          </div>

          {categoryData.length > 0 ? (
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={categoryData}
                    dataKey="Expense"
                    nameKey="Category"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {categoryData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          [
                            "#6366f1",
                            "#10b981",
                            "#f59e0b",
                            "#ef4444",
                            "#8b5cf6",
                            "#06b6d4",
                          ][index % 6]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              icon={<PieChart size={34} />}
              title="No category data available"
              description="Add categorized transactions to view spending"
            />
          )}
        </div>
      </div>

      {/* Budget Analysis */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Budget vs Actual Spending
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Compare your planned budget with actual expenses
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <TrendingUp size={20} />
          </div>
        </div>

        {budgetData.length > 0 ? (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Budget</th>
                  <th className="px-4 py-3">Actual</th>
                  <th className="px-4 py-3">Difference</th>
                </tr>
              </thead>

              <tbody>
                {budgetData.map((item, index) => {
                  const budget = Number(item.budget_amount || 0);
                  const actual = Number(item.spent_amount || 0);
                  const difference = Number(item.remaining_amount || 0);

                  return (
                    <tr
                      key={item.category_id || index}
                      className="border-b border-slate-100"
                    >
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {item.budget_name || "Category"}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {formatCurrency(budget)}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {formatCurrency(actual)}
                      </td>

                      <td
                        className={`px-4 py-3 font-medium ${
                          actual > budget
                            ? "text-red-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {formatCurrency(difference)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={<TrendingUp size={34} />}
            title="No budget analytics available"
            description="Create budgets and record expenses to compare spending"
          />
        )}
      </div>

      {/* Date Range */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <CalendarDays size={20} />
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">
                Analytics Period
              </h3>

              <p className="text-sm text-slate-500">
                Analytics are based on your recorded financial data.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Current Period
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, description }) {
  return (
    <div className="mt-6 flex h-56 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
      <div className="text-center text-slate-300">
        <div className="flex justify-center">{icon}</div>

        <p className="mt-3 text-sm font-medium text-slate-500">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

export default Analytics;