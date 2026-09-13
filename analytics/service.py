from analytics.repository import (
    get_total_income_expense,
    get_expense_by_category,
    get_monthly_summary,
    get_budget_vs_spending
)


def summary_service(user_id):
    return get_total_income_expense(user_id)


def category_service(user_id):
    return get_expense_by_category(user_id)


def monthly_service(user_id):
    return get_monthly_summary(user_id)


def budget_service(user_id):
    return get_budget_vs_spending(user_id)