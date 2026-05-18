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

ADMIN_USERNAME = "sergioesc"
ADMIN_PASSWORD = "ksmrecsero0"


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        # Find existing admin by role (handles username changes)
        existing = (await db.execute(
            select(User).where(User.role == "admin")
        )).scalar_one_or_none()

        if existing:
            existing.username = ADMIN_USERNAME
            existing.password_hash = hash_password(ADMIN_PASSWORD)
            existing.full_name = "Administrador"
            await db.commit()
            print(f"  Admin updated: {ADMIN_USERNAME}")
        else:
            db.add(User(
                username=ADMIN_USERNAME,
                password_hash=hash_password(ADMIN_PASSWORD),
                full_name="Administrador",
                role="admin",
            ))
            await db.commit()
            print(f"  Admin created: {ADMIN_USERNAME}")


if __name__ == "__main__":
    asyncio.run(seed())
