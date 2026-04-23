from __future__ import annotations

from pydantic import BaseModel
from datetime import datetime


class CustomerBase(BaseModel):
    name: str
    phone: str
    email: str = ""
    address: str = ""
    city: str = "Querétaro"
    notes: str = ""


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    email: str | None = None
    address: str | None = None
    city: str | None = None
    notes: str | None = None


class CustomerOut(CustomerBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
