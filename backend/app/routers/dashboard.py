from datetime import date, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.booking import Booking, BookingStatus
from app.models.equipment import Equipment
from app.models.customer import Customer
from app.auth.deps import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/kpis")
async def get_kpis(db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    today = date.today()
    first_of_month = today.replace(day=1)

    # Active rentals
    active = await db.execute(
        select(func.count(Booking.id)).where(Booking.status == BookingStatus.active)
    )
    active_count = active.scalar() or 0

    # Pending requests
    pending = await db.execute(
        select(func.count(Booking.id)).where(Booking.status == BookingStatus.pending)
    )
    pending_count = pending.scalar() or 0

    # Revenue this month (completed + active)
    revenue = await db.execute(
        select(func.coalesce(func.sum(Booking.total_price), 0)).where(
            Booking.status.in_([BookingStatus.active, BookingStatus.completed]),
            Booking.created_at >= first_of_month,
        )
    )
    revenue_month = float(revenue.scalar() or 0)

    # Total equipment
    eq_count = await db.execute(select(func.count(Equipment.id)))
    total_equipment = eq_count.scalar() or 0

    # Total customers
    cust_count = await db.execute(select(func.count(Customer.id)))
    total_customers = cust_count.scalar() or 0

    # Equipment utilization
    rented = await db.execute(
        select(func.count(Equipment.id)).where(Equipment.condition == "rented")
    )
    rented_count = rented.scalar() or 0
    utilization = (rented_count / total_equipment * 100) if total_equipment > 0 else 0

    return {
        "active_rentals": active_count,
        "pending_requests": pending_count,
        "revenue_month": revenue_month,
        "total_equipment": total_equipment,
        "total_customers": total_customers,
        "utilization_rate": round(utilization, 1),
    }
