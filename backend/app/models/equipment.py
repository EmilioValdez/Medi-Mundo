from __future__ import annotations
import enum
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Numeric, ForeignKey, Enum, DateTime, Text, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class EquipmentCondition(str, enum.Enum):
    available = "available"
    rented = "rented"
    maintenance = "maintenance"


class Equipment(Base):
    __tablename__ = "equipment"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(300))
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"))
    description: Mapped[str] = mapped_column(Text, default="")
    specs: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    price_daily: Mapped[float] = mapped_column(Numeric(10, 2), default=0)
    price_weekly: Mapped[float] = mapped_column(Numeric(10, 2), default=0)
    price_monthly: Mapped[float] = mapped_column(Numeric(10, 2), default=0)
    deposit: Mapped[float] = mapped_column(Numeric(10, 2), default=0)
    images: Mapped[Optional[list]] = mapped_column(JSON, nullable=True)
    serial_number: Mapped[str] = mapped_column(String(200), default="")
    quantity_total: Mapped[int] = mapped_column(Integer, default=1)
    quantity_available: Mapped[int] = mapped_column(Integer, default=1)
    condition: Mapped[EquipmentCondition] = mapped_column(
        Enum(EquipmentCondition), default=EquipmentCondition.available
    )
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    category = relationship("Category", back_populates="equipment")
    bookings = relationship("Booking", back_populates="equipment")
