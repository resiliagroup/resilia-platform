from sqlalchemy import String, Float, Integer, Boolean, ForeignKey, Text, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from geoalchemy2 import Geometry
from app.db.base import Base, TimestampMixin
from app.core.constants import SectorType
import uuid

class Tenant(Base, TimestampMixin):
    __tablename__ = "tenants"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    sector: Mapped[SectorType] = mapped_column(SAEnum(SectorType), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    settings: Mapped[dict] = mapped_column(JSONB, default={})

    facilities: Mapped[list["Facility"]] = relationship(back_populates="tenant")

class Facility(Base, TimestampMixin):
    __tablename__ = "facilities"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    code: Mapped[str] = mapped_column(String(50), nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    sector: Mapped[SectorType] = mapped_column(SAEnum(SectorType), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Location
    geom: Mapped[Geometry] = mapped_column(Geometry("POINT", srid=4326), nullable=True)
    il_kodu: Mapped[str] = mapped_column(String(2), nullable=True)
    ilce_kodu: Mapped[str] = mapped_column(String(4), nullable=True)
    address: Mapped[str] = mapped_column(Text, nullable=True)

    # Physical characteristics
    building_age: Mapped[int] = mapped_column(Integer, nullable=True)
    construction_type: Mapped[str] = mapped_column(String(50), nullable=True)  # RC/masonry/steel
    soil_class: Mapped[str] = mapped_column(String(5), nullable=True)   # ZA-ZE per TBDY-2018
    floor_count: Mapped[int] = mapped_column(Integer, nullable=True)
    total_area_m2: Mapped[float] = mapped_column(Float, nullable=True)

    # Seismic zone
    seismic_zone: Mapped[int] = mapped_column(Integer, nullable=True)  # 1-5
    flood_zone: Mapped[str] = mapped_column(String(20), nullable=True)
    elevation_m: Mapped[float] = mapped_column(Float, nullable=True)

    # Operational
    employee_count: Mapped[int] = mapped_column(Integer, nullable=True)
    operates_24h: Mapped[bool] = mapped_column(Boolean, default=False)
    asset_value_usd: Mapped[float] = mapped_column(Float, nullable=True)
    metadata: Mapped[dict] = mapped_column(JSONB, default={})

    tenant: Mapped["Tenant"] = relationship(back_populates="facilities")
    assessments: Mapped[list["RiskAssessment"]] = relationship(back_populates="facility")
    location_data: Mapped["FacilityLocation"] = relationship(back_populates="facility", uselist=False)

class FacilityLocation(Base):
    __tablename__ = "facility_locations"

    facility_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("facilities.id"), primary_key=True)
    seismic_pga: Mapped[float] = mapped_column(Float, nullable=True)   # Peak ground acceleration
    flood_depth_100yr: Mapped[float] = mapped_column(Float, nullable=True)
    wildfire_risk_index: Mapped[float] = mapped_column(Float, nullable=True)
    liquefaction_risk: Mapped[str] = mapped_column(String(20), nullable=True)
    distance_to_fault_km: Mapped[float] = mapped_column(Float, nullable=True)
    distance_to_hospital_km: Mapped[float] = mapped_column(Float, nullable=True)
    distance_to_fire_station_km: Mapped[float] = mapped_column(Float, nullable=True)
    enriched_at: Mapped[str] = mapped_column(String(30), nullable=True)

    facility: Mapped["Facility"] = relationship(back_populates="location_data")

class FacilityDependency(Base, TimestampMixin):
    __tablename__ = "facility_dependencies"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("facilities.id"))
    target_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("facilities.id"))
    dependency_type: Mapped[str] = mapped_column(String(50))  # power/water/supply/data/access
    criticality: Mapped[float] = mapped_column(Float, default=0.5)  # 0-1
    is_redundant: Mapped[bool] = mapped_column(Boolean, default=False)
    notes: Mapped[str] = mapped_column(Text, nullable=True)
