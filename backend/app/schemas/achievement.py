from datetime import date
from pydantic import BaseModel, Field

class AchievementBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    date: date
    level: str = Field(..., pattern="^(региональный|федеральный|международный)$")
    description: str | None = Field(None, max_length=1000)

class AchievementCreate(AchievementBase):
    pass

class AchievementResponse(AchievementBase):
    id: int
    user_id: int
    created_at: date
    
    model_config = {"from_attributes": True}