from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from app.db.session import get_db
from app.models.user import User
from app.models.achievement import Achievement  # создайте эту модель
from app.schemas.achievement import AchievementCreate, AchievementResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/achievements", tags=["Достижения"])

@router.get("", response_model=list[AchievementResponse])
async def get_my_achievements(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Получить достижения ТОЛЬКО текущего пользователя"""
    result = await db.execute(
        select(Achievement).where(Achievement.user_id == current_user.id)
    )
    return result.scalars().all()

@router.post("", response_model=AchievementResponse, status_code=status.HTTP_201_CREATED)
async def create_achievement(
    achievement_in: AchievementCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Создать достижение для текущего пользователя"""
    db_achievement = Achievement(**achievement_in.model_dump(), user_id=current_user.id)
    db.add(db_achievement)
    await db.commit()
    await db.refresh(db_achievement)
    return db_achievement