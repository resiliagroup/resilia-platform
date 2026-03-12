"""Pydantic schemas — API request/response contracts."""

from pydantic import BaseModel, Field, field_validator
from typing import Optional
from uuid import UUID
from datetime import datetime
from app.core.constants import SectorType, RiskClass, HazardType

# ── Input schemas ────────────────────────────────────────────

class HazardInputSchema(BaseModel):
    seismic: float = Field(50, ge=0, le=100)
    flood: float = Field(30, ge=0, le=100)
    wildfire: float = Field(20, ge=0, le=100)
    cyber: float = Field(40, ge=0, le=100)
    supply_chain: float = Field(35, ge=0, le=100)
    pandemic: float = Field(20, ge=0, le=100)
    seismic_probability: float = Field(0.5, ge=0, le=1)
    flood_probability: float = Field(0.3, ge=0, le=1)
    cyber_probability: float = Field(0.4, ge=0, le=1)

class FragilityInputSchema(BaseModel):
    building_age_score: float = Field(50, ge=0, le=100)
    construction_quality: float = Field(50, ge=0, le=100)
    seismic_compliance: float = Field(50, ge=0, le=100)
    maintenance_score: float = Field(50, ge=0, le=100)
    single_point_of_failure: float = Field(50, ge=0, le=100)
    redundancy_score: float = Field(50, ge=0, le=100)
    supply_dependency: float = Field(50, ge=0, le=100)
    staff_training_score: float = Field(50, ge=0, le=100)
    turnover_rate_score: float = Field(50, ge=0, le=100)
    bcm_awareness: float = Field(50, ge=0, le=100)
    cyber_hygiene: float = Field(50, ge=0, le=100)
    backup_status: float = Field(50, ge=0, le=100)
    system_age_score: float = Field(50, ge=0, le=100)

class ExposureInputSchema(BaseModel):
    population_at_risk: int = Field(100, ge=0)
    population_vulnerability: float = Field(0.3, ge=0, le=1)
    asset_value_usd: float = Field(5_000_000, ge=0)
    asset_criticality: float = Field(0.5, ge=0, le=1)
    critical_service_count: int = Field(1, ge=0)
    dependency_count: int = Field(2, ge=0)
    dependency_criticality: float = Field(0.5, ge=0, le=1)
    serves_critical_population: bool = False

class ResponseCapacityInputSchema(BaseModel):
    bcm_plan_exists: bool = False
    plan_tested_last_12m: bool = False
    iso_22301_certified: bool = False
    plan_digitized: bool = False
    backup_power_hours: float = Field(0, ge=0)
    backup_systems_score: float = Field(0, ge=0, le=100)
    emergency_stockpile_days: float = Field(0, ge=0)
    drill_frequency_per_year: int = Field(0, ge=0)
    staff_certification_pct: float = Field(0, ge=0, le=1)
    crisis_team_exists: bool = False
    mutual_aid_agreements: int = Field(0, ge=0)
    coordination_score: float = Field(0, ge=0, le=100)

class AssessmentCreateRequest(BaseModel):
    facility_id: UUID
    hazard: HazardInputSchema = HazardInputSchema()
    fragility: FragilityInputSchema = FragilityInputSchema()
    exposure: ExposureInputSchema = ExposureInputSchema()
    response: ResponseCapacityInputSchema = ResponseCapacityInputSchema()
    notes: Optional[str] = None

# ── Output schemas ───────────────────────────────────────────

class DimensionScoresOut(BaseModel):
    h: float; f: float; e: float; r: float
    h_seismic: float; h_flood: float; h_cyber: float; h_supply: float
    f_structural: float; f_operational: float; f_human: float; f_digital: float
    e_population: float; e_assets: float; e_dependencies: float
    r_plans: float; r_resources: float; r_training: float; r_network: float

class RecommendationOut(BaseModel):
    priority: int
    category: str
    title: str
    description: str
    effort: str
    impact_delta: float
    deadline_days: int
    standard_ref: str

class AssessmentResponse(BaseModel):
    id: UUID
    facility_id: UUID
    sector: SectorType
    uri_score: float
    risk_class: RiskClass
    confidence: float
    dimension_scores: DimensionScoresOut
    radar_data: dict[str, float]
    recommendations: list[RecommendationOut]
    classical_score: float
    ml_score: Optional[float]
    assessed_at: datetime

    model_config = {"from_attributes": True}

class HazardEventCreate(BaseModel):
    hazard_type: HazardType
    occurred_at: datetime
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    magnitude: Optional[float] = None
    affected_radius_km: Optional[float] = None
    impact_score: Optional[float] = Field(None, ge=0, le=100)
    source: Optional[str] = None
    raw_data: Optional[dict] = None

class RiskSummary(BaseModel):
    facility_id: UUID
    facility_name: str
    uri_score: float
    risk_class: RiskClass
    h_score: float; f_score: float; e_score: float; r_score: float
    assessed_at: datetime
