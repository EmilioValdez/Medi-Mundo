import enum
from datetime import datetime, date
from sqlalchemy import String, Numeric, ForeignKey, Enum, DateTime, Date, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class BookingStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    active = "active"
    returned = "returned"
    completed = "completed"
    cancelled = "cancelled"


class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(primary_key=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"))
    equipment_id: Mapped[int] = mapped_column(ForeignKey("equipment.id"))
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date] = mapped_column(Date)
    status: Mapped[BookingStatus] = mapped_column(
        Enum(BookingStatus), default=BookingStatus.pending
    )
    delivery_address: Mapped[str] = mapped_column(Text, default="")
    deposit_amount: Mapped[float] = mapped_column(Numeric(10, 2), default=0)
    total_price: Mapped[float] = mapped_column(Numeric(10, 2), default=0)
    notes: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    customer = relationship("Customer", back_populates="bookings")
    equipment = relationship("Equipment", back_populates="bookings")
