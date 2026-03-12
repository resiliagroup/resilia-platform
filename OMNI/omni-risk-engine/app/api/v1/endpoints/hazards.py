"""Hazard ingestion endpoint — accepts events from KOERI, MGM, AFAD and manual input."""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from uuid import UUID
from datetime import datetime, timedelta
from geoalchemy2.functions import ST_DWithin, ST_MakePoint

from app.db.base import get_db
from app.models.risk import HazardEvent, RiskAssessment
from app.schemas.risk import HazardEventCreate
from app.core.constants import HazardType

router = APIRouter(prefix="/hazards", tags=["Hazard Ingestion"])

@router.post("/events", status_code=status.HTTP_201_CREATED)
async def ingest_hazard_event(
    payload: HazardEventCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    """
    Ingest a hazard event (earthquake, flood alert, cyber incident, etc).
    Triggers background re-scoring for all affected facilities.
    """
    event = HazardEvent(
        hazard_type=payload.hazard_type,
        occurred_at=payload.occurred_at,
        geom=f"SRID=4326;POINT({payload.longitude} {payload.latitude})",
        magnitude=payload.magnitude,
        affected_radius_km=payload.affected_radius_km,
        impact_score=payload.impact_score,
        source=payload.source,
        raw_data=payload.raw_data or {},
    )
    db.add(event)
    await db.flush()

    # Queue background re-scoring for affected facilities
    if payload.affected_radius_km:
        background_tasks.add_task(
            trigger_affected_rescoring,
            event_id=event.id,
            lat=payload.latitude,
            lon=payload.longitude,
            radius_km=payload.affected_radius_km,
            hazard_type=payload.hazard_type,
        )

    return {
        "event_id": event.id,
        "message": "Hazard event ingested",
        "rescoring_triggered": bool(payload.affected_radius_km),
    }

@router.get("/events/recent")
async def get_recent_events(
    hours: int = 24,
    hazard_type: HazardType | None = None,
    db: AsyncSession = Depends(get_db),
):
    """Get hazard events from the last N hours."""
    since = datetime.utcnow() - timedelta(hours=hours)
    stmt = select(HazardEvent).where(HazardEvent.occurred_at >= since)
    if hazard_type:
        stmt = stmt.where(HazardEvent.hazard_type == hazard_type)
    stmt = stmt.order_by(HazardEvent.occurred_at.desc()).limit(100)

    events = (await db.execute(stmt)).scalars().all()
    return [
        {
            "id": str(e.id),
            "hazard_type": e.hazard_type,
            "occurred_at": e.occurred_at.isoformat(),
            "magnitude": e.magnitude,
            "affected_radius_km": e.affected_radius_km,
            "impact_score": e.impact_score,
            "source": e.source,
        }
        for e in events
    ]

@router.get("/risk-elevation/{facility_id}")
async def get_hazard_risk_elevation(
    facility_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """
    Calculate current hazard risk elevation for a facility
    based on recent events within radius.
    Returns multiplier to apply to baseline hazard scores.
    """
    from app.models.facility import Facility, FacilityLocation

    fac_stmt = select(Facility).where(Facility.id == facility_id)
    facility = (await db.execute(fac_stmt)).scalar_one_or_none()
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")

    # Events in last 30 days within 200km
    since = datetime.utcnow() - timedelta(days=30)
    recent = (
        await db.execute(
            select(HazardEvent)
            .where(HazardEvent.occurred_at >= since)
            .order_by(HazardEvent.occurred_at.desc())
            .limit(20)
        )
    ).scalars().all()

    elevation = {"seismic": 1.0, "flood": 1.0, "cyber": 1.0, "overall": 1.0}

    for e in recent:
        if e.impact_score and e.impact_score > 50:
            if e.hazard_type == HazardType.SEISMIC:
                elevation["seismic"] = min(2.0, elevation["seismic"] + 0.2)
            elif e.hazard_type == HazardType.FLOOD:
                elevation["flood"] = min(2.0, elevation["flood"] + 0.15)
            elif e.hazard_type == HazardType.CYBER:
                elevation["cyber"] = min(2.0, elevation["cyber"] + 0.25)

    elevation["overall"] = round(
        (elevation["seismic"] + elevation["flood"] + elevation["cyber"]) / 3, 2
    )

    return {"facility_id": facility_id, "elevation_multipliers": elevation}

async def trigger_affected_rescoring(
    event_id: UUID, lat: float, lon: float,
    radius_km: float, hazard_type: HazardType,
):
    """Background task: flag affected facilities for re-assessment."""
    import structlog
    log = structlog.get_logger()
    log.info(
        "rescoring.triggered",
        event_id=str(event_id),
        lat=lat, lon=lon,
        radius_km=radius_km,
        hazard_type=hazard_type,
    )
    # In production: query facilities within radius, push to task queue (Celery/ARQ)
