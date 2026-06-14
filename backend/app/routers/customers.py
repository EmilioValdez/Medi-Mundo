from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.customer import Customer
from app.models.booking import Booking
from app.schemas.customer import CustomerCreate, CustomerUpdate, CustomerOut
from app.auth.deps import get_current_user

router = APIRouter(prefix="/api/customers", tags=["customers"])


@router.get("", response_model=list[CustomerOut])
@router.get("/", response_model=list[CustomerOut])
async def list_customers(
    search: str | None = None,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    q = select(Customer).order_by(Customer.name)
    if search:
        q = q.where(Customer.name.ilike(f"%{search}%") | Customer.phone.ilike(f"%{search}%"))
    result = await db.execute(q)
    return result.scalars().all()


@router.get("/{cust_id}", response_model=CustomerOut)
async def get_customer(
    cust_id: int,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(Customer).where(Customer.id == cust_id))
    cust = result.scalar_one_or_none()
    if not cust:
        raise HTTPException(404, "Cliente no encontrado")
    return cust


@router.post("/", response_model=CustomerOut)
async def create_customer(
    body: CustomerCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    cust = Customer(**body.model_dump())
    db.add(cust)
    await db.commit()
    await db.refresh(cust)
    return cust


@router.put("/{cust_id}", response_model=CustomerOut)
async def update_customer(
    cust_id: int,
    body: CustomerUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(Customer).where(Customer.id == cust_id))
    cust = result.scalar_one_or_none()
    if not cust:
        raise HTTPException(404, "Cliente no encontrado")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(cust, k, v)
    await db.commit()
    await db.refresh(cust)
    return cust


@router.delete("/{cust_id}")
async def delete_customer(
    cust_id: int,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(Customer).where(Customer.id == cust_id))
    cust = result.scalar_one_or_none()
    if not cust:
        raise HTTPException(404, "Cliente no encontrado")
    await db.delete(cust)
    await db.commit()
    return {"ok": True}
