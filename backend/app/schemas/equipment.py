from __future__ import annotations

from pydantic import BaseModel
from datetime import datetime
from typing import Any


class EquipmentBase(BaseModel):
    name: str
    category_id: int
    description: str = ""
    specs: dict[str, Any] | None = None
    price_daily: float = 0
    price_weekly: float = 0
    price_monthly: float = 0
    price_sale: float = 0
    deposit: float = 0
    images: list[str] | None = None
    serial_number: str = ""
    quantity_total: int = 1
    quantity_available: int = 1
    condition: str = "available"
    is_active: bool = True


class EquipmentCreate(EquipmentBase):
    # Frontend sends price_biweekly; router maps it to price_weekly before ORM
    price_biweekly: float = 0
    price_weekly: float = 0


class EquipmentUpdate(BaseModel):
    name: str | None = None
    category_id: int | None = None
    description: str | None = None
    specs: dict[str, Any] | None = None
    price_daily: float | None = None
    price_biweekly: float | None = None  # frontend name; router maps → price_weekly
    price_weekly: float | None = None
    price_monthly: float | None = None
    price_sale: float | None = None
    deposit: float | None = None
    images: list[str] | None = None
    serial_number: str | None = None
    quantity_total: int | None = None
    quantity_available: int | None = None
    condition: str | None = None
    is_active: bool | None = None


class EquipmentOut(EquipmentBase):
    id: int
    created_at: datetime
    category_name: str | None = None
    price_biweekly: float = 0  # renamed from price_weekly in _to_out

    class Config:
        from_attributes = True
