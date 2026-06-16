from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User, UserRole
from app.schemas.auth import UserOut, UserCreate
from app.auth.deps import require_admin, hash_password

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("", response_model=list[UserOut])
@router.get("/", response_model=list[UserOut])
async def list_users(db: AsyncSession = Depends(get_db), _=Depends(require_admin)):
    result = await db.execute(select(User).order_by(User.id))
    return result.scalars().all()


@router.post("", response_model=UserOut)
@router.post("/", response_model=UserOut)
async def create_user(
    body: UserCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(require_admin),
):
    if body.role not in (UserRole.admin.value, UserRole.operator.value):
        raise HTTPException(400, "Rol inválido")

    existing = (await db.execute(
        select(User).where(User.username == body.username)
    )).scalar_one_or_none()
    if existing:
        raise HTTPException(400, "Ese nombre de usuario ya existe")

    user = User(
        username=body.username,
        password_hash=hash_password(body.password),
        full_name=body.full_name,
        role=body.role,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(require_admin),
):
    if user_id == admin.id:
        raise HTTPException(400, "No puedes eliminar tu propia cuenta")

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(404, "Usuario no encontrado")

    await db.delete(user)
    await db.commit()
    return {"ok": True}
