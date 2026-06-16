from __future__ import annotations
from sqlalchemy import Integer, Numeric, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class OxygenRefill(Base):
    __tablename__ = "oxygen_refills"

    id: Mapped[int] = mapped_column(primary_key=True)
    litros: Mapped[int] = mapped_column(Integer, unique=True)
    precio: Mapped[float] = mapped_column(Numeric(10, 2), default=0)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
