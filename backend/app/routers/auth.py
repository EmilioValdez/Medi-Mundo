from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.auth.deps import verify_password, create_access_token, get_current_user, hash_password
from app.schemas.auth import LoginRequest, TokenResponse, UserOut

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.username == body.username))
    user = result.scalar_one_or_none()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Credenciales inválidas")
    token = create_access_token({"sub": user.username, "role": user.role.value})
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserOut)
async def me(user: User = Depends(get_current_user)):
    return user


@router.post("/seed", response_model=dict)
async def seed_admin(db: AsyncSession = Depends(get_db)):
    """Create default admin if none exists."""
    result = await db.execute(select(User).where(User.username == "admin"))
    if result.scalar_one_or_none():
        return {"message": "Admin already exists"}
    admin = User(
        username="admin",
        password_hash=hash_password("admin123"),
        full_name="Administrador",
        role="admin",
    )
    db.add(admin)
    await db.commit()
    return {"message": "Admin created", "username": "admin", "password": "admin123"}
