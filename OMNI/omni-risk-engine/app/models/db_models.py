"""
OMNI Risk Intelligence Engine
SQLAlchemy ORM models — PostgreSQL + PostGIS
"""
import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import (
    Column, String, Float, Boolean, Integer,
    ForeignKey, Text, DateTime, JSON, SmallInteger
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship, DeclarativeBase
from sqlalchemy.sql import func
from geoalchemy2 import Geometry


class Base(DeclarativeBase):
    pass


# ─────────────────────────────────────────────
# TENANT (Multi-tenancy)
# ─────────────────────────────────────────────

class Tenant(Base):
    __tablename__ = "tenants"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name        = Column(String(200), nullable=False)
    sector      = Column(String(50), nullable=False)
    plan        = Column(String(50), default="starter")  # starter/pro/enterprise
    is_active   = Column(Boolean, default=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
    settings    = Column(JSONB, default={})

    facilities  = relationship("Facility", back_populates="tenant")
    assessments = relationship("RiskAssessment", back_populates="tenant")


# ─────────────────────────────────────────────
# FACILITY
# ─────────────────────────────────────────────

class Facility(Base):
    __tablename__ = "facilities"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id       = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    code            = Column(String(50), nullable=False)
    name            = Column(String(200), nullable=False)
    sector          = Column(String(50), nullable=False)
    sub_sector      = Column(String(50))

    # Location
    geom            = Column(Geometry(geometry_type="POINT", srid=4326))
    il_kodu         = Column(String(2))
    ilce_kodu       = Column(String(4))
    address         = Column(Text)
    elevation_m     = Column(Float)

    # Physical characteristics
    building_age    = Column(SmallInteger)
    construction_type = Column(String(50))   # RC/masonry/steel
    floor_count     = Column(SmallInteger)
    total_area_m2   = Column(Float)
    soil_class      = Column(String(2))      # ZA-ZE (TBDY-2018)
    seismic_zone    = Column(SmallInteger)   # 1-5
    flood_zone      = Column(String(20))

    # Operational
    staff_count     = Column(Integer)
    daily_visitors  = Column(Integer)
    is_critical_infra = Column(Boolean, default=False)
    is_active       = Column(Boolean, default=True)

    created_at      = Column(DateTime(timezone=True), server_default=func.now())
    updated_at      = Column(DateTime(timezone=True), onupdate=func.now())
    metadata_       = Column("metadata", JSONB, default={})

    tenant          = relationship("Tenant", back_populates="facilities")
    assessments     = relationship("RiskAssessment", back_populates="facility")
    location        = relationship("FacilityLocation", back_populates="facility", uselist=False)
    dependencies_out = relationship(
        "FacilityDependency", foreign_keys="FacilityDependency.source_id", back_populates="source"
    )
    dependencies_in = relationship(
        "FacilityDependency", foreign_keys="FacilityDependency.target_id", back_populates="target"
    )


class FacilityLocation(Base):
    """Extended GIS data — separated for performance"""
    __tablename__ = "facility_locations"

    facility_id     = Column(UUID(as_uuid=True), ForeignKey("facilities.id"), primary_key=True)
    geom            = Column(Geometry(geometry_type="POINT", srid=4326), nullable=False)
    soil_class      = Column(String(2))
    flood_zone      = Column(String(20))
    seismic_zone    = Column(SmallInteger)
    elevation_m     = Column(Float)
    building_age    = Column(SmallInteger)
    construction_type = Column(String(50))

    facility        = relationship("Facility", back_populates="location")


# ─────────────────────────────────────────────
# RISK ASSESSMENT
# ─────────────────────────────────────────────

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id       = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    facility_id     = Column(UUID(as_uuid=True), ForeignKey("facilities.id"), nullable=False)
    sector          = Column(String(50), nullable=False)
    assessed_at     = Column(DateTime(timezone=True), server_default=func.now())
    valid_until     = Column(DateTime(timezone=True))

    # HFER-720 component scores (0-100)
    h_score         = Column(Float)   # Hazard
    f_score         = Column(Float)   # Fragility
    e_score         = Column(Float)   # Exposure
    r_score         = Column(Float)   # Response Capacity

    # Unified Risk Index
    uri_score       = Column(Float)
    risk_class      = Column(String(20))

    # ML metadata
    confidence      = Column(Float)
    assessment_type = Column(String(20), default="hybrid")  # classical/ml/hybrid
    model_version   = Column(String(20))

    # Audit
    assessor_id     = Column(UUID(as_uuid=True))
    version         = Column(Integer, default=1)
    raw_inputs      = Column(JSONB)    # snapshot of inputs
    score_breakdown = Column(JSONB)    # full breakdown for audit

    tenant          = relationship("Tenant", back_populates="assessments")
    facility        = relationship("Facility", back_populates="assessments")
    hazard_scores   = relationship("HazardScore", back_populates="assessment")
    recommendations = relationship("RiskRecommendation", back_populates="assessment")


# ─────────────────────────────────────────────
# HAZARD SCORES
# ─────────────────────────────────────────────

class HazardScore(Base):
    __tablename__ = "hazard_scores"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assessment_id   = Column(UUID(as_uuid=True), ForeignKey("risk_assessments.id"), nullable=False)
    hazard_type     = Column(String(50), nullable=False)
    probability     = Column(Float)   # 0-1
    intensity       = Column(Float)   # 0-100
    raw_score       = Column(Float)   # 0-100
    data_source     = Column(String(100))
    captured_at     = Column(DateTime(timezone=True), server_default=func.now())

    assessment      = relationship("RiskAssessment", back_populates="hazard_scores")


# ─────────────────────────────────────────────
# INFRASTRUCTURE DEPENDENCY GRAPH
# ─────────────────────────────────────────────

class FacilityDependency(Base):
    __tablename__ = "facility_dependencies"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_id       = Column(UUID(as_uuid=True), ForeignKey("facilities.id"), nullable=False)
    target_id       = Column(UUID(as_uuid=True), ForeignKey("facilities.id"), nullable=False)
    dependency_type = Column(String(50))   # power/water/supply/data/access
    criticality     = Column(Float)        # 0-1
    is_redundant    = Column(Boolean, default=False)
    validated_at    = Column(DateTime(timezone=True))

    source          = relationship("Facility", foreign_keys=[source_id], back_populates="dependencies_out")
    target          = relationship("Facility", foreign_keys=[target_id], back_populates="dependencies_in")


# ─────────────────────────────────────────────
# HAZARD EVENTS (External ingestion)
# ─────────────────────────────────────────────

class HazardEvent(Base):
    __tablename__ = "hazard_events"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_type      = Column(String(50), nullable=False)
    occurred_at     = Column(DateTime(timezone=True), nullable=False)
    geom            = Column(Geometry(geometry_type="POINT", srid=4326))
    magnitude       = Column(Float)
    affected_radius_km = Column(Float)
    impact_score    = Column(Float)
    source          = Column(String(100))
    raw_data        = Column(JSONB)
    ingested_at     = Column(DateTime(timezone=True), server_default=func.now())


# ─────────────────────────────────────────────
# RECOMMENDATIONS
# ─────────────────────────────────────────────

class RiskRecommendation(Base):
    __tablename__ = "risk_recommendations"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assessment_id   = Column(UUID(as_uuid=True), ForeignKey("risk_assessments.id"), nullable=False)
    priority        = Column(SmallInteger)      # 1 = most critical
    category        = Column(String(50))        # structural/operational/training/digital
    title           = Column(String(200))
    description     = Column(Text)
    effort          = Column(String(20))        # low/medium/high
    impact          = Column(String(20))        # low/medium/high
    deadline_days   = Column(Integer)
    standard_ref    = Column(String(100))       # ISO 22301 §8.4.3
    status          = Column(String(20), default="open")
    created_at      = Column(DateTime(timezone=True), server_default=func.now())

    assessment      = relationship("RiskAssessment", back_populates="recommendations")


# ─────────────────────────────────────────────
# AI PREDICTION LOG
# ─────────────────────────────────────────────

class AIPrediction(Base):
    __tablename__ = "ai_predictions"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    facility_id     = Column(UUID(as_uuid=True), ForeignKey("facilities.id"), nullable=False)
    model_id        = Column(String(100), nullable=False)
    model_version   = Column(String(20), nullable=False)
    prediction_type = Column(String(50))   # risk_score/anomaly/scenario
    predicted_at    = Column(DateTime(timezone=True), server_default=func.now())
    horizon_days    = Column(Integer)
    prediction      = Column(JSONB)
    actual          = Column(JSONB)        # filled post-event for retraining
    confidence      = Column(Float)
