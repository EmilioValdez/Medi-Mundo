from __future__ import annotations

from pydantic import BaseModel
from datetime import date, datetime


class BookingBase(BaseModel):
    customer_id: int
    equipment_id: int
    start_date: date
    end_date: date
    delivery_address: str = ""
    deposit_amount: float = 0
    total_price: float = 0
    notes: str = ""


class BookingCreate(BookingBase):
    pass


class RentalRequestCreate(BaseModel):
    """Public rental request — creates customer + booking."""
    customer_name: str
    customer_phone: str
    customer_email: str = ""
    equipment_id: int
    start_date: date
    end_date: date
    delivery_address: str = ""
    notes: str = ""


class BookingUpdate(BaseModel):
    status: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    delivery_address: str | None = None
    deposit_amount: float | None = None
    total_price: float | None = None
    notes: str | None = None


class BookingOut(BookingBase):
    id: int
    status: str
    created_at: datetime
    customer_name: str | None = None
    equipment_name: str | None = None

    class Config:
        from_attributes = True
