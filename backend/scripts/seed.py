import asyncio
import random
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import async_session_maker
from app.models.user import User
from app.core.security import get_password_hash

async def seed_data():
    async with async_session_maker() as session:
        # Проверяем, есть ли уже пользователи
        result = await session.execute(select(User))
        if result.scalars().first():
            print("🟡 База уже содержит данные. Пропуск.")
            return

        test_users = [
            {"email": "admin@college.ru", "full_name": "Администратор системы", "role": "admin"},
            {"email": "ivanov@graduate.ru", "full_name": "Иванов Иван Иванович", "role": "graduate"},
            {"email": "petrova@graduate.ru", "full_name": "Петрова Анна Сергеевна", "role": "graduate"},
            {"email": "sidorov@graduate.ru", "full_name": "Сидоров Алексей Петрович", "role": "graduate"},
        ]

        for u in test_users:
            db_user = User(
                email=u["email"],
                full_name=u["full_name"],
                hashed_password=get_password_hash("test123"),
                is_active=True
            )
            session.add(db_user)
        
        await session.commit()
        print("✅ Тестовые пользователи успешно добавлены.")

if __name__ == "__main__":
    asyncio.run(seed_data())