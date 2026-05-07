from __future__ import annotations
from typing import Optional
from pydantic import BaseModel


class InogenModelOut(BaseModel):
    id: int
    model_id: str
    name: str
    image: str
    price_monthly: float
    price_biweekly: Optional[float]
    price_weekly: Optional[float]
    deposit: float
    faa_label: Optional[str]
    faa_approved: bool
    includes: list
    sort_order: int
    is_active: bool

    model_config = {"from_attributes": True}


class InogenModelUpdate(BaseModel):
    price_monthly: Optional[float] = None
    price_biweekly: Optional[float] = None
    price_weekly: Optional[float] = None
    deposit: Optional[float] = None
    faa_label: Optional[str] = None
    faa_approved: Optional[bool] = None
    includes: Optional[list] = None
    is_active: Optional[bool] = None
