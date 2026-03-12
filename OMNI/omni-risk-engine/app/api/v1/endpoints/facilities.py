from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID
from pydantic import BaseModel, Field
from typing import Optional
from app.db.base import get_db
from app.models.facility import Facility, Tenant
from app.core.constants import SectorType

router = APIRouter(prefix="/facilities", tags=["Facilities"])

class FacilityCreate(BaseModel):
    tenant_id: UUID
    code: str = Field(..., min_length=2, max_length=50)
    name: str = Field(..., min_length=2, max_length=200)
    sector: SectorType
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    il_kodu: Optional[str] = Field(None, max_length=2)
    building_age: Optional[int] = Field(None, ge=0, le=300)
    construction_type: Optional[str] = None
    soil_class: Optional[str] = None
    seismic_zone: Optional[int] = Field(None, ge=1, le=5)
    floor_count: Optional[int] = None
    employee_count: Optional[int] = None
    operates_24h: bool = False
    asset_value_usd: Optional[float] = None

class FacilityOut(BaseModel):
    id: UUID
    code: str
    name: str
    sector: SectorType
    building_age: Optional[int]
    seismic_zone: Optional[int]
    employee_count: Optional[int]
    is_active: bool
    model_config = {"from_attributes": True}

@router.post("/", response_model=FacilityOut, status_code=status.HTTP_201_CREATED)
async def create_facility(payload: FacilityCreate, db: AsyncSession = Depends(get_db)):
    facility = Facility(
        tenant_id=payload.tenant_id,
        code=payload.code, name=payload.name, sector=payload.sector,
        il_kodu=payload.il_kodu, building_age=payload.building_age,
        construction_type=payload.construction_type, soil_class=payload.soil_class,
        seismic_zone=payload.seismic_zone, floor_count=payload.floor_count,
        employee_count=payload.employee_count, operates_24h=payload.operates_24h,
        asset_value_usd=payload.asset_value_usd,
    )
    if payload.latitude and payload.longitude:
        facility.geom = f"SRID=4326;POINT({payload.longitude} {payload.latitude})"
    db.add(facility)
    await db.flush()
    return facility

@router.get("/{facility_id}", response_model=FacilityOut)
async def get_facility(facility_id: UUID, db: AsyncSession = Depends(get_db)):
    stmt = select(Facility).where(Facility.id == facility_id)
    facility = (await db.execute(stmt)).scalar_one_or_none()
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    return facility

@router.get("/tenant/{tenant_id}", response_model=list[FacilityOut])
async def list_facilities(tenant_id: UUID, db: AsyncSession = Depends(get_db)):
    stmt = select(Facility).where(Facility.tenant_id == tenant_id, Facility.is_active == True)
    return (await db.execute(stmt)).scalars().all()
