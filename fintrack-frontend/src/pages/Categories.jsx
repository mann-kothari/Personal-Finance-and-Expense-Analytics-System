import {
  Tags,
  Utensils,
  ShoppingBag,
  Car,
  Home,
  HeartPulse,
  GraduationCap,
  Film,
  Briefcase,
  MoreHorizontal,
} from "lucide-react";

function Categories() {
  const categories = [
    {
      name: "Food & Dining",
      description: "Restaurants, groceries and meals",
      icon: Utensils,
    },
    {
      name: "Shopping",
      description: "Clothing, electronics and purchases",
      icon: ShoppingBag,
    },
    {
      name: "Transportation",
      description: "Fuel, travel and transport",
      icon: Car,
    },
    {
      name: "Housing",
      description: "Rent, maintenance and utilities",
      icon: Home,
    },
    {
      name: "Health",
      description: "Medical and healthcare expenses",
      icon: HeartPulse,
    },
    {
      name: "Education",
      description: "Courses, books and education",
      icon: GraduationCap,
    },
    {
      name: "Entertainment",
      description: "Movies, games and leisure",
      icon: Film,
    },
    {
      name: "Work",
      description: "Business and work-related expenses",
      icon: Briefcase,
    },
    {
      name: "Other",
      description: "Other miscellaneous expenses",
      icon: MoreHorizontal,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
          <Tags size={24} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Categories
          </h1>

          <p className="text-sm text-slate-500">
            Organize your transactions by spending category
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-100">
              Available Categories
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {categories.length}
            </h2>

            <p className="mt-2 text-sm text-indigo-100">
              Use categories to keep your finances organized
            </p>
          </div>

          <div className="hidden h-12 w-12 items-center justify-center rounded-xl bg-white/10 sm:flex">
            <Tags size={26} />
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Expense Categories
          </h2>

          <p className="text-sm text-slate-500">
            Common categories for managing your expenses
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <div
                key={category.name}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-100">
                    <Icon size={23} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {category.name}
                    </h3>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Information Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <Tags size={20} />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              About Categories
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Categories help you understand where your money is
              going. Assigning transactions to categories makes it
              easier to analyze spending patterns and manage your
              budgets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categories;