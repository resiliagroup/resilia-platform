"""
HFER-720 Risk Model
===================
Core mathematical model for computing Unified Risk Index (URI).
Pure functions — no I/O, no DB dependencies. Fully testable.

URI = f(Hazard, Fragility, Exposure, Response)
"""

from dataclasses import dataclass, field
from typing import Optional
import numpy as np
from app.core.constants import SectorType, RiskClass, SECTOR_WEIGHTS, HAZARD_WEIGHTS, HazardType

# ─────────────────────────────────────────────────────────────
# Input dataclasses
# ─────────────────────────────────────────────────────────────

@dataclass
class HazardInput:
    """Raw hazard scores per type. Values 0-100 (higher = more dangerous)."""
    seismic: float = 0.0
    flood: float = 0.0
    wildfire: float = 0.0
    cyber: float = 0.0
    supply_chain: float = 0.0
    pandemic: float = 0.0
    wind: float = 0.0
    landslide: float = 0.0
    # Modifiers
    seismic_probability: float = 0.5   # annual prob 0-1
    flood_probability: float = 0.3
    cyber_probability: float = 0.4

@dataclass
class FragilityInput:
    """Fragility sub-scores. Values 0-100 (higher = more fragile)."""
    # Structural
    building_age_score: float = 50.0     # 0=new, 100=very old
    construction_quality: float = 50.0
    seismic_compliance: float = 50.0     # 0=fully compliant
    maintenance_score: float = 50.0      # 0=excellent

    # Operational
    single_point_of_failure: float = 50.0
    redundancy_score: float = 50.0       # 0=high redundancy
    supply_dependency: float = 50.0

    # Human
    staff_training_score: float = 50.0   # 0=well trained
    turnover_rate_score: float = 50.0
    bcm_awareness: float = 50.0          # 0=high awareness

    # Digital
    cyber_hygiene: float = 50.0          # 0=excellent hygiene
    backup_status: float = 50.0          # 0=fully backed up
    system_age_score: float = 50.0

@dataclass
class ExposureInput:
    """Exposure sub-scores. Values 0-100 (higher = more exposed)."""
    population_at_risk: int = 0
    population_vulnerability: float = 0.5  # 0-1 (elderly/children factor)
    asset_value_usd: float = 0.0
    asset_criticality: float = 0.5         # 0-1
    critical_service_count: int = 1
    dependency_count: int = 0
    dependency_criticality: float = 0.5
    operates_24h: bool = False
    serves_critical_population: bool = False  # hospital, emergency services

@dataclass
class ResponseCapacityInput:
    """Response capacity. Values 0-100 (higher = better capacity)."""
    # Plans
    bcm_plan_exists: bool = False
    plan_tested_last_12m: bool = False
    iso_22301_certified: bool = False
    plan_digitized: bool = False

    # Resources
    backup_power_hours: float = 0.0      # hours of backup power
    backup_systems_score: float = 0.0    # 0-100
    emergency_stockpile_days: float = 0.0

    # Training
    drill_frequency_per_year: int = 0
    staff_certification_pct: float = 0.0  # 0-1
    crisis_team_exists: bool = False

    # Network
    mutual_aid_agreements: int = 0
    coordination_score: float = 0.0      # from graph analysis

# ─────────────────────────────────────────────────────────────
# Output dataclasses
# ─────────────────────────────────────────────────────────────

@dataclass
class DimensionScores:
    h: float   # Hazard composite (0-100, lower=safer)
    f: float   # Fragility composite (0-100, lower=safer)
    e: float   # Exposure composite (0-100, lower=exposed)
    r: float   # Response capacity (0-100, higher=better)

    # Sub-scores
    h_seismic: float = 0.0
    h_flood: float = 0.0
    h_cyber: float = 0.0
    h_supply: float = 0.0
    f_structural: float = 0.0
    f_operational: float = 0.0
    f_human: float = 0.0
    f_digital: float = 0.0
    e_population: float = 0.0
    e_assets: float = 0.0
    e_dependencies: float = 0.0
    r_plans: float = 0.0
    r_resources: float = 0.0
    r_training: float = 0.0
    r_network: float = 0.0

@dataclass
class HFER720Result:
    uri_score: float           # 0-100 (higher = more resilient)
    risk_class: RiskClass
    dimension_scores: DimensionScores
    classical_uri: float
    sector: SectorType
    weights_used: dict[str, float]
    radar_data: dict[str, float]   # for frontend radar chart
    confidence: float = 0.85       # classical model is deterministic → high base confidence

# ─────────────────────────────────────────────────────────────
# HFER-720 Model
# ─────────────────────────────────────────────────────────────

class HFER720Model:
    """
    Hybrid HFER-720 risk model.

    Classical path: deterministic weighted formula.
    ML path: injected externally → ensemble combined here.
    """

    def compute_hazard(self, inp: HazardInput) -> tuple[float, dict]:
        """Compute composite Hazard score (0-100, higher=more hazardous)."""
        scores = {
            HazardType.SEISMIC:      inp.seismic      * (1 + 0.3 * inp.seismic_probability),
            HazardType.FLOOD:        inp.flood        * (1 + 0.2 * inp.flood_probability),
            HazardType.WILDFIRE:     inp.wildfire,
            HazardType.CYBER:        inp.cyber        * (1 + 0.2 * inp.cyber_probability),
            HazardType.SUPPLY_CHAIN: inp.supply_chain,
            HazardType.PANDEMIC:     inp.pandemic,
        }

        weights = {k: HAZARD_WEIGHTS.get(k, 0.05) for k in scores}
        total_weight = sum(weights.values())

        composite = sum(
            scores[k] * weights[k] for k in scores
        ) / total_weight

        sub = {
            "h_seismic": min(100, scores[HazardType.SEISMIC]),
            "h_flood":   min(100, scores[HazardType.FLOOD]),
            "h_cyber":   min(100, scores[HazardType.CYBER]),
            "h_supply":  min(100, scores[HazardType.SUPPLY_CHAIN]),
        }
        return min(100.0, max(0.0, composite)), sub

    def compute_fragility(self, inp: FragilityInput) -> tuple[float, dict]:
        """Compute composite Fragility score (0-100, higher=more fragile)."""
        f_structural = np.mean([
            inp.building_age_score,
            inp.construction_quality,
            inp.seismic_compliance,
            inp.maintenance_score,
        ])
        f_operational = np.mean([
            inp.single_point_of_failure,
            inp.redundancy_score,
            inp.supply_dependency,
        ])
        f_human = np.mean([
            inp.staff_training_score,
            inp.turnover_rate_score,
            inp.bcm_awareness,
        ])
        f_digital = np.mean([
            inp.cyber_hygiene,
            inp.backup_status,
            inp.system_age_score,
        ])

        composite = (
            0.35 * f_structural +
            0.25 * f_operational +
            0.20 * f_human +
            0.20 * f_digital
        )

        sub = {
            "f_structural":  float(f_structural),
            "f_operational": float(f_operational),
            "f_human":       float(f_human),
            "f_digital":     float(f_digital),
        }
        return min(100.0, max(0.0, float(composite))), sub

    def compute_exposure(self, inp: ExposureInput) -> tuple[float, dict]:
        """Compute composite Exposure score (0-100, higher=more exposed)."""

        # Population component: normalize per 10,000 people
        pop_raw = min(100, (inp.population_at_risk / 10_000) * 100)
        e_population = pop_raw * (1 + 0.5 * inp.population_vulnerability)
        if inp.serves_critical_population:
            e_population = min(100, e_population * 1.3)

        # Asset component: normalize per $100M
        asset_raw = min(100, (inp.asset_value_usd / 100_000_000) * 100)
        e_assets = asset_raw * (0.5 + 0.5 * inp.asset_criticality)

        # Dependency component
        dep_raw = min(100, inp.dependency_count * 10)
        e_dependencies = dep_raw * (0.5 + 0.5 * inp.dependency_criticality)
        if inp.critical_service_count > 5:
            e_dependencies = min(100, e_dependencies * 1.2)

        # Time multiplier: 24h operation = higher exposure
        time_multiplier = 1.15 if inp.operates_24h else 1.0

        composite = time_multiplier * (
            0.35 * e_population +
            0.35 * e_assets +
            0.30 * e_dependencies
        )

        sub = {
            "e_population":   min(100.0, float(e_population)),
            "e_assets":       min(100.0, float(e_assets)),
            "e_dependencies": min(100.0, float(e_dependencies)),
        }
        return min(100.0, max(0.0, float(composite))), sub

    def compute_response(self, inp: ResponseCapacityInput) -> tuple[float, dict]:
        """Compute Response Capacity score (0-100, higher=better)."""

        # Plans sub-score (0-100)
        r_plans = 0.0
        if inp.bcm_plan_exists:        r_plans += 25.0
        if inp.plan_tested_last_12m:   r_plans += 25.0
        if inp.iso_22301_certified:    r_plans += 30.0
        if inp.plan_digitized:         r_plans += 20.0

        # Resources sub-score (0-100)
        power_score = min(40, (inp.backup_power_hours / 72) * 40)  # 72h = max
        stockpile_score = min(30, (inp.emergency_stockpile_days / 30) * 30)
        r_resources = power_score + stockpile_score + min(30, inp.backup_systems_score * 0.3)

        # Training sub-score (0-100)
        drill_score = min(40, inp.drill_frequency_per_year * 10)
        cert_score = inp.staff_certification_pct * 40
        team_score = 20.0 if inp.crisis_team_exists else 0.0
        r_training = drill_score + cert_score + team_score

        # Network sub-score (0-100)
        aid_score = min(50, inp.mutual_aid_agreements * 12.5)
        r_network = aid_score + min(50, inp.coordination_score)

        composite = (
            0.30 * r_plans +
            0.25 * r_resources +
            0.25 * r_training +
            0.20 * r_network
        )

        sub = {
            "r_plans":     float(r_plans),
            "r_resources": float(r_resources),
            "r_training":  float(r_training),
            "r_network":   float(r_network),
        }
        return min(100.0, max(0.0, float(composite))), sub

    def compute_uri(
        self,
        sector: SectorType,
        h: float, f: float, e: float, r: float,
    ) -> float:
        """
        Unified Risk Index formula.
        URI ∈ [0, 100] — higher = more resilient.

        URI = 100 - [wH×H + wF×F + wE×E - wR×R] / (wH+wF+wE)
        """
        w = SECTOR_WEIGHTS[sector]
        wH, wF, wE, wR = w["hazard"], w["fragility"], w["exposure"], w["response"]
        denom = wH + wF + wE

        raw_risk = (wH * h + wF * f + wE * e - wR * r) / denom
        uri = 100.0 - raw_risk
        return min(100.0, max(0.0, uri))

    def classify(self, uri: float) -> RiskClass:
        if uri < 40:  return RiskClass.CRITICAL
        if uri < 60:  return RiskClass.HIGH
        if uri < 75:  return RiskClass.MEDIUM
        if uri < 90:  return RiskClass.RESILIENT
        return RiskClass.EXEMPLARY

    def compute(
        self,
        sector: SectorType,
        hazard: HazardInput,
        fragility: FragilityInput,
        exposure: ExposureInput,
        response: ResponseCapacityInput,
        ml_score: Optional[float] = None,
        ml_weight: float = 0.6,
    ) -> HFER720Result:
        """Full HFER-720 pipeline. Returns complete result."""

        h, h_sub = self.compute_hazard(hazard)
        f, f_sub = self.compute_fragility(fragility)
        e, e_sub = self.compute_exposure(exposure)
        r, r_sub = self.compute_response(response)

        classical_uri = self.compute_uri(sector, h, f, e, r)

        # Ensemble: blend classical + ML if ML score available
        if ml_score is not None:
            final_uri = (1 - ml_weight) * classical_uri + ml_weight * ml_score
            confidence = 0.90
        else:
            final_uri = classical_uri
            ml_weight = 0.0
            confidence = 0.80

        dim = DimensionScores(
            h=h, f=f, e=e, r=r,
            **h_sub, **f_sub, **e_sub, **r_sub,
        )

        radar_data = {
            "Hazard":           round(100 - h, 1),  # invert for radar (higher=better)
            "Fragility":        round(100 - f, 1),
            "Exposure":         round(100 - e, 1),
            "Response":         round(r, 1),
            "Seismic Safety":   round(100 - h_sub["h_seismic"], 1),
            "Cyber Security":   round(100 - h_sub["h_cyber"], 1),
            "Structural":       round(100 - f_sub["f_structural"], 1),
            "Plans & Protocols":round(r_sub["r_plans"], 1),
        }

        return HFER720Result(
            uri_score=round(final_uri, 2),
            risk_class=self.classify(final_uri),
            dimension_scores=dim,
            classical_uri=round(classical_uri, 2),
            sector=sector,
            weights_used=SECTOR_WEIGHTS[sector],
            radar_data=radar_data,
            confidence=confidence,
            ml_weight_used=ml_weight if ml_score else None,
        )

# Singleton
hfer_model = HFER720Model()
