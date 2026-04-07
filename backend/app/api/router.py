from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.models.user import User
from app.schemas.common import UserCreate, UserResponse
from app.core.security import get_password_hash
import sqlalchemy as sa

router = APIRouter()

@router.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    exists = await db.execute(sa.select(User).where(User.email == user_in.email))
    if exists.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_user = User(email=user_in.email, hashed_password=get_password_hash(user_in.password), full_name=user_in.full_name)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user