from __future__ import annotations
from typing import Optional
from sqlalchemy import String, Integer, Numeric, JSON, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class InogenModel(Base):
    __tablename__ = "inogen_models"

    id: Mapped[int] = mapped_column(primary_key=True)
    model_id: Mapped[str] = mapped_column(String(50), unique=True)  # g2, g3, g4, g5, at-home
    name: Mapped[str] = mapped_column(String(200))
    image: Mapped[str] = mapped_column(String(500), default="")
    price_monthly: Mapped[float] = mapped_column(Numeric(10, 2), default=0)
    price_biweekly: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), nullable=True)
    price_weekly: Mapped[Optional[float]] = mapped_column(Numeric(10, 2), nullable=True)
    deposit: Mapped[float] = mapped_column(Numeric(10, 2), default=0)
    faa_label: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    faa_approved: Mapped[bool] = mapped_column(Boolean, default=False)
    includes: Mapped[list] = mapped_column(JSON, default=list)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
