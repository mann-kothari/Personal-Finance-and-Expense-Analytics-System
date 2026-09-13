from fastapi import FastAPI
from analytics.routes import router as analytics_router

app = FastAPI()

app.include_router(analytics_router)