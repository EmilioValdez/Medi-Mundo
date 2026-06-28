from __future__ import annotations

from sqlalchemy import Column, LargeBinary, String, DateTime, func
from app.database import Base


class StoredImage(Base):
    __tablename__ = "stored_images"

    id = Column(String, primary_key=True)
    data = Column(LargeBinary, nullable=False)
    content_type = Column(String, default="image/jpeg")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
