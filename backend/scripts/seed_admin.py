"""
Run from the backend/ directory:
    python -m scripts.seed_admin
"""
from __future__ import annotations

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import select
from app.database import async_session, engine, Base
from app.models.user import User
from app.auth.deps import hash_password


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        existing = (await db.execute(
            select(User).where(User.username == "admin")
        )).scalar_one_or_none()

        if existing:
            print("  Admin already exists.")
        else:
            db.add(User(
                username="admin",
                password_hash=hash_password("admin123"),
                full_name="Administrador",
                role="admin",
            ))
            await db.commit()
            print("  Admin created: admin / admin123")


if __name__ == "__main__":
    asyncio.run(seed())
