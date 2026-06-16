from __future__ import annotations
from typing import Optional
from pydantic import BaseModel


class OxygenRefillOut(BaseModel):
    id: int
    litros: int
    precio: float
    sort_order: int
    is_active: bool

    model_config = {"from_attributes": True}


class OxygenRefillUpdate(BaseModel):
    litros: Optional[int] = None
    precio: Optional[float] = None
    is_active: Optional[bool] = None
