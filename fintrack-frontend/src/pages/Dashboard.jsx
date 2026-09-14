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
      <div>
        <h1>Dashboard</h1>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Dashboard</h1>

      {error && (
        <p>
          {error}
        </p>
      )}

      {/* Summary Cards */}
      <div>
        <div>
          <h3>Total Income</h3>
          <p>₹{summary.total_income.toFixed(2)}</p>
        </div>

        <div>
          <h3>Total Expense</h3>
          <p>₹{summary.total_expense.toFixed(2)}</p>
        </div>

        <div>
          <h3>Net Balance</h3>
          <p>₹{netBalance.toFixed(2)}</p>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <Link to="/transactions">
          View Transactions
        </Link>

        {" | "}

        <Link to="/accounts">
          View Accounts
        </Link>

        {" | "}

        <Link to="/analytics">
          View Analytics
        </Link>
      </div>

      <hr />

      {/* Monthly Chart */}
      <h2>Monthly Income & Expense</h2>

      {monthly.length === 0 ? (
        <p>No monthly analytics data available.</p>
      ) : (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Bar
                dataKey="total_income"
                name="Income"
              />

              <Bar
                dataKey="total_expense"
                name="Expense"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Category Chart */}
      <h2>Expense by Category</h2>

      {categories.length === 0 ? (
        <p>No category spending data available.</p>
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

      {/* Budget */}
      <h2>Budget vs Spending</h2>

      {budget.length === 0 ? (
        <p>No budget data available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Budget</th>
              <th>Spent</th>
            </tr>
          </thead>

          <tbody>
            {budget.map((item, index) => (
              <tr key={index}>
                <td>
                  {item.category_name ||
                    item.budget_name ||
                    "Budget"}
                </td>

                <td>
                  ₹
                  {Number(
                    item.budget_amount ||
                      item.amount ||
                      0
                  ).toFixed(2)}
                </td>

                <td>
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
      )}

      {/* Recent Transactions */}
      <h2>Recent Transactions</h2>

      {transactions.length === 0 ? (
        <p>No transactions available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.transaction_id}>
                <td>
                  {transaction.transaction_date}
                </td>

                <td>
                  {transaction.description}
                </td>

                <td>
                  {transaction.transaction_type}
                </td>

                <td>
                  ₹{Number(transaction.amount).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Dashboard;