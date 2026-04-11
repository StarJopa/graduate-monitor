from fastapi import APIRouter
from app.api import auth, users, achievements, analytics

router = APIRouter()
router.include_router(auth.router)
router.include_router(users.router)
router.include_router(achievements.router)
router.include_router(analytics.router)