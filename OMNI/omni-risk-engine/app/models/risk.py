from sqlalchemy import String, Float, Integer, Boolean, ForeignKey, Text, SmallInteger, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy import DateTime, func
from app.db.base import Base, TimestampMixin
from app.core.constants import SectorType, HazardType, RiskClass, AssessmentType, RecommendationStatus
import uuid

class RiskAssessment(Base, TimestampMixin):
    __tablename__ = "risk_assessments"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False)
    facility_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("facilities.id"), nullable=False)
    sector: Mapped[SectorType] = mapped_column(SAEnum(SectorType), nullable=False)
    assessed_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    valid_until: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=True)

    # HFER-720 dimension scores (0-100)
    h_score: Mapped[float] = mapped_column(Float, nullable=True)   # Hazard (inverse)
    f_score: Mapped[float] = mapped_column(Float, nullable=True)   # Fragility (inverse)
    e_score: Mapped[float] = mapped_column(Float, nullable=True)   # Exposure (inverse)
    r_score: Mapped[float] = mapped_column(Float, nullable=True)   # Response (direct)
    uri_score: Mapped[float] = mapped_column(Float, nullable=True) # Unified Risk Index

    # Sub-scores
    h_seismic: Mapped[float] = mapped_column(Float, nullable=True)
    h_flood: Mapped[float] = mapped_column(Float, nullable=True)
    h_cyber: Mapped[float] = mapped_column(Float, nullable=True)
    h_supply: Mapped[float] = mapped_column(Float, nullable=True)
    f_structural: Mapped[float] = mapped_column(Float, nullable=True)
    f_operational: Mapped[float] = mapped_column(Float, nullable=True)
    f_human: Mapped[float] = mapped_column(Float, nullable=True)
    f_digital: Mapped[float] = mapped_column(Float, nullable=True)
    e_population: Mapped[float] = mapped_column(Float, nullable=True)
    e_assets: Mapped[float] = mapped_column(Float, nullable=True)
    e_dependencies: Mapped[float] = mapped_column(Float, nullable=True)
    r_plans: Mapped[float] = mapped_column(Float, nullable=True)
    r_resources: Mapped[float] = mapped_column(Float, nullable=True)
    r_training: Mapped[float] = mapped_column(Float, nullable=True)
    r_network: Mapped[float] = mapped_column(Float, nullable=True)

    # Classification
    risk_class: Mapped[RiskClass] = mapped_column(SAEnum(RiskClass), nullable=True)
    confidence: Mapped[float] = mapped_column(Float, nullable=True)  # 0-1

    # Ensemble details
    classical_score: Mapped[float] = mapped_column(Float, nullable=True)
    ml_score: Mapped[float] = mapped_column(Float, nullable=True)
    ml_weight_used: Mapped[float] = mapped_column(Float, nullable=True)

    assessment_type: Mapped[AssessmentType] = mapped_column(SAEnum(AssessmentType), default=AssessmentType.HYBRID)
    assessor_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=True)
    version: Mapped[int] = mapped_column(Integer, default=1)
    raw_inputs: Mapped[dict] = mapped_column(JSONB, default={})
    notes: Mapped[str] = mapped_column(Text, nullable=True)

    facility: Mapped["Facility"] = relationship(back_populates="assessments")
    hazard_scores: Mapped[list["HazardScore"]] = relationship(back_populates="assessment")
    recommendations: Mapped[list["RiskRecommendation"]] = relationship(back_populates="assessment")

class HazardScore(Base):
    __tablename__ = "hazard_scores"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assessment_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("risk_assessments.id"))
    hazard_type: Mapped[HazardType] = mapped_column(SAEnum(HazardType), nullable=False)
    probability: Mapped[float] = mapped_column(Float)    # 0-1 annual probability
    intensity: Mapped[float] = mapped_column(Float)      # normalized 0-100
    raw_score: Mapped[float] = mapped_column(Float)
    weighted_score: Mapped[float] = mapped_column(Float)
    data_source: Mapped[str] = mapped_column(String(100), nullable=True)
    captured_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    metadata: Mapped[dict] = mapped_column(JSONB, default={})

    assessment: Mapped["RiskAssessment"] = relationship(back_populates="hazard_scores")

class RiskRecommendation(Base, TimestampMixin):
    __tablename__ = "risk_recommendations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    assessment_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("risk_assessments.id"))
    priority: Mapped[int] = mapped_column(SmallInteger)   # 1 = most critical
    category: Mapped[str] = mapped_column(String(50))
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(Text)
    effort: Mapped[str] = mapped_column(String(20))       # low/medium/high
    impact_delta: Mapped[float] = mapped_column(Float)    # expected URI improvement
    deadline_days: Mapped[int] = mapped_column(Integer)
    standard_ref: Mapped[str] = mapped_column(String(100), nullable=True)
    status: Mapped[RecommendationStatus] = mapped_column(
        SAEnum(RecommendationStatus), default=RecommendationStatus.OPEN
    )

    assessment: Mapped["RiskAssessment"] = relationship(back_populates="recommendations")

class HazardEvent(Base):
    """Historical hazard events — used for ML model training"""
    __tablename__ = "hazard_events"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    hazard_type: Mapped[HazardType] = mapped_column(SAEnum(HazardType), nullable=False)
    occurred_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), nullable=False)
    geom: Mapped[Geometry] = mapped_column(Geometry("POINT", srid=4326), nullable=True)
    magnitude: Mapped[float] = mapped_column(Float, nullable=True)
    affected_radius_km: Mapped[float] = mapped_column(Float, nullable=True)
    impact_score: Mapped[float] = mapped_column(Float, nullable=True)
    source: Mapped[str] = mapped_column(String(100), nullable=True)
    raw_data: Mapped[dict] = mapped_column(JSONB, default={})
