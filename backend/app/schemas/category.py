from __future__ import annotations

from pydantic import BaseModel
from datetime import datetime


class CategoryBase(BaseModel):
    name: str
    slug: str
    icon: str = ""
    description: str = ""
    is_active: bool = True


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    icon: str | None = None
    description: str | None = None
    is_active: bool | None = None


class CategoryOut(CategoryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
