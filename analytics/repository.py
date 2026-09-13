from database.supabase_client import supabase


def get_total_income_expense(user_id):
    return supabase.rpc(
        "dashboard_total_income_expense",
        {"p_user_id": user_id}
    ).execute().data


def get_expense_by_category(user_id):
    return supabase.rpc(
        "expense_by_category",
        {"p_user_id": user_id}
    ).execute().data


def get_monthly_summary(user_id):
    return supabase.rpc(
        "monthly_income_expense_summary",
        {"p_user_id": user_id}
    ).execute().data


def get_budget_vs_spending(user_id):
    return supabase.rpc(
        "budget_vs_actual_spending",
        {"p_user_id": user_id}
    ).execute().data