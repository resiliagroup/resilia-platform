"""
OMNI Risk Intelligence Engine
HFER-720 Classical Risk Model
─────────────────────────────
Four-dimensional risk scoring:
  H — Hazard
  F — Fragility
  E — Exposure
  R — Response Capacity

Output: Unified Risk Index (URI) 0-100
"""
from __future__ import annotations
import logging
from dataclasses import dataclass, field

from app.core.constants import (
    SectorType, HazardType, SECTOR_WEIGHTS,
    HAZARD_DEFINITIONS, classify_risk, RISK_REVIEW_DAYS,
    FRAGILITY_SUBWEIGHTS, RESPONSE_SUBWEIGHTS,
)
from app.schemas.risk import (
    FragilityInput, ExposureInput, ResponseCapacityInput,
    HazardScoreInput, HazardBreakdown, RadarData,
)

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────
# SCORE RESULTS
# ─────────────────────────────────────────────

@dataclass
class HFER720Result:
    h_score: float          # Hazard score (0-100, higher = more hazard)
    f_score: float          # Fragility score (0-100)
    e_score: float          # Exposure score (0-100)
    r_score: float          # Response capacity (0-100, higher = better)
    uri_score: float        # Unified Risk Index (0-100, higher = safer)
    risk_class: str
    confidence: float
    hazard_breakdown: list[HazardBreakdown]
    radar: RadarData
    score_breakdown: dict   # full audit trail


# ─────────────────────────────────────────────
# HAZARD SCORER
# ─────────────────────────────────────────────

class HazardScorer:
    """
    Computes composite Hazard (H) score from multi-hazard inputs.
    H_composite = Σ (probability_i × intensity_i × global_weight_i)
    """

    def score(self, hazard_inputs: list[HazardScoreInput]) -> tuple[float, list[HazardBreakdown]]:
        if not hazard_inputs:
            logger.warning("No hazard inputs provided — using default score 50")
            return 50.0, []

        # Build lookup from inputs
        input_map = {h.hazard_type: h for h in hazard_inputs}

        total_weight = 0.0
        weighted_sum = 0.0
        breakdowns: list[HazardBreakdown] = []

        for hdef in HAZARD_DEFINITIONS:
            h_input = input_map.get(hdef.hazard_type.value)
            if h_input is None:
                # Use default moderate values if not provided
                prob, intensity = 0.3, 40.0
                source = "default"
            else:
                prob = h_input.probability
                intensity = h_input.intensity
                source = h_input.data_source or "manual"

            raw_score = prob * intensity  # 0-100 range
            weighted_contribution = raw_score * hdef.global_weight

            weighted_sum += weighted_contribution
            total_weight += hdef.global_weight

            breakdowns.append(HazardBreakdown(
                hazard_type=hdef.hazard_type.value,
                score=round(raw_score, 2),
                probability=prob,
                intensity=intensity,
                data_source=source,
            ))

        composite = (weighted_sum / total_weight) if total_weight > 0 else 50.0
        return round(min(max(composite, 0), 100), 2), breakdowns


# ─────────────────────────────────────────────
# FRAGILITY SCORER
# ─────────────────────────────────────────────

class FragilityScorer:
    """
    Computes Fragility (F) score across 4 sub-dimensions.
    Higher score = more fragile = higher risk.
    """

    def score(self, f: FragilityInput) -> tuple[float, dict]:
        structural = self._score_structural(f)
        operational = self._score_operational(f)
        human = self._score_human(f)
        digital = self._score_digital(f)

        composite = (
            structural   * FRAGILITY_SUBWEIGHTS["structural"] +
            operational  * FRAGILITY_SUBWEIGHTS["operational"] +
            human        * FRAGILITY_SUBWEIGHTS["human"] +
            digital      * FRAGILITY_SUBWEIGHTS["digital"]
        )

        breakdown = {
            "structural": round(structural, 2),
            "operational": round(operational, 2),
            "human": round(human, 2),
            "digital": round(digital, 2),
        }

        return round(min(max(composite, 0), 100), 2), breakdown

    def _score_structural(self, f: FragilityInput) -> float:
        score = 50.0  # baseline

        # Building age penalty
        if f.building_age:
            if f.building_age > 40:   score += 20
            elif f.building_age > 25: score += 10
            elif f.building_age > 10: score += 5

        # Construction type
        construction_penalties = {
            "masonry": 20, "wood": 25, "RC": 0, "steel": -5
        }
        if f.construction_type:
            score += construction_penalties.get(f.construction_type, 5)

        # Inspection recency
        if f.last_inspection_years:
            if f.last_inspection_years > 5:  score += 15
            elif f.last_inspection_years > 2: score += 5

        # Mitigation credit
        if f.structural_reinforced: score -= 15

        return min(max(score, 0), 100)

    def _score_operational(self, f: FragilityInput) -> float:
        score = 50.0

        if not f.has_backup_power:    score += 15
        if not f.has_redundant_systems: score += 10
        score += min(f.single_points_of_failure * 8, 30)

        # Maintenance quality
        score -= (f.maintenance_score - 50) * 0.4  # 0-100 → -20 to +20

        return min(max(score, 0), 100)

    def _score_human(self, f: FragilityInput) -> float:
        score = 50.0

        # Training coverage
        if f.bcm_trained_staff_pct < 20:   score += 20
        elif f.bcm_trained_staff_pct < 50: score += 10
        elif f.bcm_trained_staff_pct > 80: score -= 15

        # Staff turnover (high turnover = knowledge loss)
        if f.staff_turnover_annual > 30:   score += 15
        elif f.staff_turnover_annual > 15: score += 7

        if not f.has_crisis_team: score += 10

        return min(max(score, 0), 100)

    def _score_digital(self, f: FragilityInput) -> float:
        score = 50.0

        # Cyber hygiene (0-100 → modifier)
        score -= (f.cyber_hygiene_score - 50) * 0.5

        if not f.has_offsite_backup: score += 20

        if f.it_system_age_years:
            if f.it_system_age_years > 7:  score += 15
            elif f.it_system_age_years > 3: score += 5

        return min(max(score, 0), 100)


# ─────────────────────────────────────────────
# EXPOSURE SCORER
# ─────────────────────────────────────────────

class ExposureScorer:
    """
    Computes Exposure (E) score.
    Factors in population, asset value, cascade dependencies.
    """

    def score(self, e: ExposureInput) -> tuple[float, dict]:
        pop_score    = self._score_population(e)
        asset_score  = self._score_assets(e)
        dep_score    = self._score_dependencies(e)

        composite = (
            pop_score   * 0.35 +
            asset_score * 0.35 +
            dep_score   * 0.30
        )

        breakdown = {
            "population": round(pop_score, 2),
            "assets": round(asset_score, 2),
            "dependencies": round(dep_score, 2),
        }

        return round(min(max(composite, 0), 100), 2), breakdown

    def _score_population(self, e: ExposureInput) -> float:
        if e.population_at_risk == 0:
            return 20.0

        # Log-scaled population score
        import math
        pop_score = min(math.log10(max(e.population_at_risk, 1)) * 20, 80)
        return pop_score * (0.5 + e.population_vulnerability * 0.5)

    def _score_assets(self, e: ExposureInput) -> float:
        if not e.asset_value_tl:
            return 40.0  # unknown = moderate default

        import math
        asset_score = min(math.log10(max(e.asset_value_tl, 1)) * 8, 80)
        return asset_score * (0.5 + e.asset_replacement_difficulty * 0.5)

    def _score_dependencies(self, e: ExposureInput) -> float:
        # Each critical service dependency adds to exposure
        dep_score = min(e.critical_services_count * 10, 60)

        # External dependency facilities add cascade risk
        cascade_factor = min(len(e.dependency_facility_ids) * 5, 40)
        dep_score += cascade_factor

        return min(dep_score, 100)


# ─────────────────────────────────────────────
# RESPONSE CAPACITY SCORER
# ─────────────────────────────────────────────

class ResponseCapacityScorer:
    """
    Computes Response Capacity (R) score.
    Higher = better prepared = lower overall risk.
    """

    def score(self, r: ResponseCapacityInput) -> tuple[float, dict]:
        plan_score      = self._score_plans(r)
        resource_score  = self._score_resources(r)
        training_score  = self._score_training(r)
        network_score   = self._score_network(r)

        composite = (
            plan_score     * RESPONSE_SUBWEIGHTS["plans"] +
            resource_score * RESPONSE_SUBWEIGHTS["resources"] +
            training_score * RESPONSE_SUBWEIGHTS["training"] +
            network_score  * RESPONSE_SUBWEIGHTS["network"]
        )

        breakdown = {
            "plans": round(plan_score, 2),
            "resources": round(resource_score, 2),
            "training": round(training_score, 2),
            "network": round(network_score, 2),
        }

        return round(min(max(composite, 0), 100), 2), breakdown

    def _score_plans(self, r: ResponseCapacityInput) -> float:
        score = 0.0

        if r.has_bcm_plan:
            score += 20
            if r.plan_last_tested_months is not None:
                if r.plan_last_tested_months <= 12: score += 25
                elif r.plan_last_tested_months <= 24: score += 12
            if r.iso_22301_certified: score += 30
            if r.plan_is_digital: score += 25

        return min(score, 100)

    def _score_resources(self, r: ResponseCapacityInput) -> float:
        score = 0.0

        # Emergency supplies
        if r.emergency_supplies_days >= 7:  score += 30
        elif r.emergency_supplies_days >= 3: score += 15
        elif r.emergency_supplies_days >= 1: score += 5

        if r.backup_site_available: score += 30

        # Equipment readiness (0-100 → 0-40 contribution)
        score += r.equipment_readiness * 0.4

        return min(score, 100)

    def _score_training(self, r: ResponseCapacityInput) -> float:
        score = 0.0

        # Annual drills
        if r.drill_frequency_annual >= 4:   score += 40
        elif r.drill_frequency_annual >= 2: score += 25
        elif r.drill_frequency_annual >= 1: score += 10

        # Certified staff
        score += min(r.certified_staff_count * 5, 30)

        # Drill recency
        if r.last_drill_months is not None:
            if r.last_drill_months <= 6:  score += 30
            elif r.last_drill_months <= 12: score += 15

        return min(score, 100)

    def _score_network(self, r: ResponseCapacityInput) -> float:
        score = 0.0

        # Mutual aid agreements
        score += min(r.mutual_aid_agreements * 15, 60)

        # External coordination
        score += r.external_coordination_score * 0.4

        return min(score, 100)


# ─────────────────────────────────────────────
# HFER-720 MAIN ENGINE
# ─────────────────────────────────────────────

class HFER720Engine:
    """
    Main classical risk model.
    Composes H, F, E, R into a Unified Risk Index (URI).

    URI = 100 - [(H×wH + F×wF + E×wE) - (R×wR_adjusted)] / normalization
    """

    def __init__(self):
        self.hazard_scorer   = HazardScorer()
        self.fragility_scorer = FragilityScorer()
        self.exposure_scorer = ExposureScorer()
        self.response_scorer = ResponseCapacityScorer()

    def compute(
        self,
        sector: str,
        hazard_inputs: list[HazardScoreInput],
        fragility: FragilityInput,
        exposure: ExposureInput,
        response: ResponseCapacityInput,
    ) -> HFER720Result:

        sector_type = SectorType(sector) if sector in SectorType._value2member_map_ else SectorType.MUNICIPALITY
        weights = SECTOR_WEIGHTS[sector_type]

        # Score each dimension
        h_score, hazard_breakdown = self.hazard_scorer.score(hazard_inputs)
        f_score, f_breakdown = self.fragility_scorer.score(fragility)
        e_score, e_breakdown = self.exposure_scorer.score(exposure)
        r_score, r_breakdown = self.response_scorer.score(response)

        # URI formula:
        # Risk dimensions (H, F, E) reduce safety, R increases it
        # URI = 100 - weighted_risk + response_bonus
        raw_risk = (
            h_score * weights.w_hazard +
            f_score * weights.w_fragility +
            e_score * weights.w_exposure
        )

        # Response capacity reduces risk (scaled to same dimension as risk)
        response_credit = r_score * weights.w_response

        uri_raw = 100 - raw_risk + (response_credit * 0.5)
        uri_score = round(min(max(uri_raw, 0), 100), 2)

        risk_class = classify_risk(uri_score)
        next_review = RISK_REVIEW_DAYS[risk_class]

        radar = RadarData(
            hazard=round(h_score, 1),
            fragility=round(f_score, 1),
            exposure=round(e_score, 1),
            response=round(r_score, 1),
        )

        score_breakdown = {
            "sector": sector,
            "weights": {
                "w_hazard": weights.w_hazard,
                "w_fragility": weights.w_fragility,
                "w_exposure": weights.w_exposure,
                "w_response": weights.w_response,
            },
            "raw_risk": round(raw_risk, 4),
            "response_credit": round(response_credit, 4),
            "hazard_detail": f_breakdown,
            "fragility_detail": f_breakdown,
            "exposure_detail": e_breakdown,
            "response_detail": r_breakdown,
        }

        return HFER720Result(
            h_score=h_score,
            f_score=f_score,
            e_score=e_score,
            r_score=r_score,
            uri_score=uri_score,
            risk_class=risk_class.value,
            confidence=0.85,   # classical model — fixed confidence
            hazard_breakdown=hazard_breakdown,
            radar=radar,
            score_breakdown=score_breakdown,
        )
