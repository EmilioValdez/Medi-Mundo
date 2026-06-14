from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.booking import Booking, BookingStatus
from app.models.customer import Customer
from app.models.equipment import Equipment
from app.schemas.booking import BookingCreate, BookingUpdate, BookingOut, RentalRequestCreate
from app.auth.deps import get_current_user

router = APIRouter(prefix="/api/bookings", tags=["bookings"])


def _to_out(b: Booking) -> dict:
    d = {c.key: getattr(b, c.key) for c in Booking.__table__.columns}
    d["status"] = b.status.value if isinstance(b.status, BookingStatus) else b.status
    d["customer_name"] = b.customer.name if b.customer else None
    d["equipment_name"] = b.equipment.name if b.equipment else None
    return d


@router.get("", response_model=list[BookingOut])
@router.get("/", response_model=list[BookingOut])
async def list_bookings(
    status: str | None = None,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    q = (
        select(Booking)
        .options(joinedload(Booking.customer), joinedload(Booking.equipment))
        .order_by(Booking.created_at.desc())
    )
    if status:
        q = q.where(Booking.status == status)
    result = await db.execute(q)
    return [_to_out(b) for b in result.unique().scalars().all()]


@router.get("/{booking_id}", response_model=BookingOut)
async def get_booking(
    booking_id: int,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(
        select(Booking)
        .options(joinedload(Booking.customer), joinedload(Booking.equipment))
        .where(Booking.id == booking_id)
    )
    b = result.unique().scalar_one_or_none()
    if not b:
        raise HTTPException(404, "Reserva no encontrada")
    return _to_out(b)


@router.post("/", response_model=BookingOut)
async def create_booking(
    body: BookingCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    booking = Booking(**body.model_dump())
    db.add(booking)
    await db.commit()
    await db.refresh(booking)
    result = await db.execute(
        select(Booking)
        .options(joinedload(Booking.customer), joinedload(Booking.equipment))
        .where(Booking.id == booking.id)
    )
    booking = result.unique().scalar_one()
    return _to_out(booking)


@router.post("/request", response_model=BookingOut)
async def public_rental_request(body: RentalRequestCreate, db: AsyncSession = Depends(get_db)):
    """Public endpoint: customer submits a rental request (no auth required)."""
    # Find or create customer
    result = await db.execute(select(Customer).where(Customer.phone == body.customer_phone))
    customer = result.scalar_one_or_none()
    if not customer:
        customer = Customer(
            name=body.customer_name,
            phone=body.customer_phone,
            email=body.customer_email,
        )
        db.add(customer)
        await db.flush()

    # Verify equipment exists
    result = await db.execute(select(Equipment).where(Equipment.id == body.equipment_id))
    eq = result.scalar_one_or_none()
    if not eq:
        raise HTTPException(404, "Equipo no encontrado")

    booking = Booking(
        customer_id=customer.id,
        equipment_id=body.equipment_id,
        start_date=body.start_date,
        end_date=body.end_date,
        delivery_address=body.delivery_address,
        deposit_amount=float(eq.deposit),
        notes=body.notes,
        status=BookingStatus.pending,
    )
    db.add(booking)
    await db.commit()
    await db.refresh(booking)

    result = await db.execute(
        select(Booking)
        .options(joinedload(Booking.customer), joinedload(Booking.equipment))
        .where(Booking.id == booking.id)
    )
    booking = result.unique().scalar_one()
    return _to_out(booking)


@router.put("/{booking_id}", response_model=BookingOut)
async def update_booking(
    booking_id: int,
    body: BookingUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(
        select(Booking)
        .options(joinedload(Booking.customer), joinedload(Booking.equipment))
        .where(Booking.id == booking_id)
    )
    booking = result.unique().scalar_one_or_none()
    if not booking:
        raise HTTPException(404, "Reserva no encontrada")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(booking, k, v)
    await db.commit()
    await db.refresh(booking)
    result = await db.execute(
        select(Booking)
        .options(joinedload(Booking.customer), joinedload(Booking.equipment))
        .where(Booking.id == booking.id)
    )
    booking = result.unique().scalar_one()
    return _to_out(booking)


@router.delete("/{booking_id}")
async def delete_booking(
    booking_id: int,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(Booking).where(Booking.id == booking_id))
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(404, "Reserva no encontrada")
    await db.delete(booking)
    await db.commit()
    return {"ok": True}
