from fastapi import APIRouter, Depends

from analytics.service import (
    summary_service,
    category_service,
    monthly_service,
    budget_service
)

from analytics.auth import get_current_user


router = APIRouter()


@router.get("/analytics/summary")
def summary(user_id: int = Depends(get_current_user)):
    return summary_service(user_id)


@router.get("/analytics/category")
def category(user_id: int = Depends(get_current_user)):
    return category_service(user_id)


@router.get("/analytics/monthly")
def monthly(user_id: int = Depends(get_current_user)):
    return monthly_service(user_id)


@router.get("/analytics/budget")
def budget(user_id: int = Depends(get_current_user)):
    return budget_service(user_id)