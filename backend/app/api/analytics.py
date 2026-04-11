from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_

from app.db.session import get_db
from app.models.user import User
from app.models.achievement import Achievement
from app.api.deps import get_current_user

router = APIRouter(prefix="/analytics", tags=["Аналитика"])

@router.get("/summary")
async def get_dashboard_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Статистика достижений текущего пользователя"""
    # Общее количество
    total = await db.scalar(
        select(func.count(Achievement.id)).where(Achievement.user_id == current_user.id)
    )
    
    # Группировка по уровням
    by_level = await db.execute(
        select(Achievement.level, func.count(Achievement.id))
        .where(Achievement.user_id == current_user.id)
        .group_by(Achievement.level)
    )
    
    return {
        "total_achievements": total or 0,
        "by_level": {level: count for level, count in by_level.all()}
    }