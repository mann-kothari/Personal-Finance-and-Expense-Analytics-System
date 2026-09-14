import {
  BarChart3,
  TrendingUp,
  PieChart,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";

function Analytics() {
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
                ₹0.00
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
                ₹0.00
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
                ₹0.00
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
                0
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Activity size={22} />
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Total recorded transactions
          </p>
        </div>
      </div>

      {/* Charts Area */}
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

          <div className="mt-8 flex h-56 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
            <div className="text-center">
              <BarChart3
                size={34}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 text-sm font-medium text-slate-500">
                No monthly data available
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Add transactions to view your monthly analytics
              </p>
            </div>
          </div>
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

          <div className="mt-8 flex h-56 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
            <div className="text-center">
              <PieChart
                size={34}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 text-sm font-medium text-slate-500">
                No category data available
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Add categorized transactions to view spending
              </p>
            </div>
          </div>
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

        <div className="mt-6 flex min-h-40 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
          <div className="text-center">
            <TrendingUp
              size={34}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm font-medium text-slate-500">
              No budget analytics available
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Create budgets and record expenses to compare spending
            </p>
          </div>
        </div>
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
                Analytics will be based on your recorded financial data.
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

export default Analytics;