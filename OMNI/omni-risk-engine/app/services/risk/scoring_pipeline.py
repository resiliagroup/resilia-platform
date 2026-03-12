"""
Risk Scoring Pipeline
=====================
Orchestrates the full assessment: form inputs → HFER-720 → ML → ensemble → DB persist.
"""

from dataclasses import asdict
from typing import Optional
import uuid
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.risk.hfer_model import (
    hfer_model, HazardInput, FragilityInput,
    ExposureInput, ResponseCapacityInput, HFER720Result,
)
from app.services.risk.recommendation_engine import generate_recommendations, Recommendation
from app.services.ml.predictor import ml_predictor
from app.models.risk import RiskAssessment, HazardScore, RiskRecommendation
from app.models.facility import Facility
from app.core.constants import SectorType, HazardType, AssessmentType
from app.core.config import settings
from app.schemas.risk import AssessmentCreateRequest
import structlog

logger = structlog.get_logger()

class RiskScoringPipeline:

    async def run(
        self,
        db: AsyncSession,
        facility: Facility,
        request: "AssessmentCreateRequest",
        assessor_id: Optional[uuid.UUID] = None,
    ) -> tuple[RiskAssessment, list[Recommendation]]:
        """
        Full pipeline:
        1. Map request → model inputs
        2. Run HFER-720 classical
        3. Run ML predictor (if available)
        4. Ensemble
        5. Generate recommendations
        6. Persist to DB
        7. Return assessment + recommendations
        """
        log = logger.bind(facility_id=str(facility.id), sector=facility.sector)
        log.info("risk_pipeline.start")

        # 1. Build model inputs
        hazard_inp = self._build_hazard_input(request, facility)
        fragility_inp = self._build_fragility_input(request, facility)
        exposure_inp = self._build_exposure_input(request, facility)
        response_inp = self._build_response_input(request)

        # 2. Classical HFER-720
        ml_score = None
        ml_weight = 0.0

        # 3. ML layer (non-blocking — if ML fails, classical carries on)
        try:
            features = ml_predictor.build_features(facility, request)
            ml_score = ml_predictor.predict_uri(features)
            ml_weight = settings.MODEL_ENSEMBLE_ML_WEIGHT
            log.info("ml_predictor.success", ml_score=ml_score)
        except Exception as exc:
            log.warning("ml_predictor.unavailable", error=str(exc))

        # 4. Compute HFER-720 with ensemble
        result: HFER720Result = hfer_model.compute(
            sector=facility.sector,
            hazard=hazard_inp,
            fragility=fragility_inp,
            exposure=exposure_inp,
            response=response_inp,
            ml_score=ml_score,
            ml_weight=ml_weight,
        )

        # 5. Recommendations
        recommendations = generate_recommendations(result)

        # 6. Persist
        assessment = await self._persist(
            db, facility, result, recommendations,
            request, assessor_id, ml_score, ml_weight
        )

        log.info(
            "risk_pipeline.complete",
            uri=result.uri_score,
            risk_class=result.risk_class,
            rec_count=len(recommendations),
        )

        return assessment, recommendations

    def _build_hazard_input(self, req, facility: Facility) -> HazardInput:
        h = req.hazard
        loc = facility.location_data

        # Augment with GIS data if available
        seismic_base = h.seismic
        if loc and loc.seismic_pga:
            # PGA > 0.4g → significantly elevated
            pga_factor = min(1.5, 1 + loc.seismic_pga / 0.4)
            seismic_base = min(100, seismic_base * pga_factor)

        return HazardInput(
            seismic=seismic_base,
            flood=h.flood,
            wildfire=h.wildfire,
            cyber=h.cyber,
            supply_chain=h.supply_chain,
            pandemic=h.pandemic,
            seismic_probability=h.seismic_probability,
            flood_probability=h.flood_probability,
            cyber_probability=h.cyber_probability,
        )

    def _build_fragility_input(self, req, facility: Facility) -> FragilityInput:
        fr = req.fragility
        # Building age → fragility penalty
        age_score = 0.0
        if facility.building_age:
            if facility.building_age > 40:    age_score = 80.0
            elif facility.building_age > 25:  age_score = 60.0
            elif facility.building_age > 10:  age_score = 35.0
            else:                             age_score = 15.0
        else:
            age_score = fr.building_age_score

        return FragilityInput(
            building_age_score=age_score,
            construction_quality=fr.construction_quality,
            seismic_compliance=fr.seismic_compliance,
            maintenance_score=fr.maintenance_score,
            single_point_of_failure=fr.single_point_of_failure,
            redundancy_score=fr.redundancy_score,
            supply_dependency=fr.supply_dependency,
            staff_training_score=fr.staff_training_score,
            turnover_rate_score=fr.turnover_rate_score,
            bcm_awareness=fr.bcm_awareness,
            cyber_hygiene=fr.cyber_hygiene,
            backup_status=fr.backup_status,
            system_age_score=fr.system_age_score,
        )

    def _build_exposure_input(self, req, facility: Facility) -> ExposureInput:
        ex = req.exposure
        return ExposureInput(
            population_at_risk=facility.employee_count or ex.population_at_risk,
            population_vulnerability=ex.population_vulnerability,
            asset_value_usd=facility.asset_value_usd or ex.asset_value_usd,
            asset_criticality=ex.asset_criticality,
            critical_service_count=ex.critical_service_count,
            dependency_count=ex.dependency_count,
            dependency_criticality=ex.dependency_criticality,
            operates_24h=facility.operates_24h,
            serves_critical_population=ex.serves_critical_population,
        )

    def _build_response_input(self, req) -> ResponseCapacityInput:
        r = req.response
        return ResponseCapacityInput(
            bcm_plan_exists=r.bcm_plan_exists,
            plan_tested_last_12m=r.plan_tested_last_12m,
            iso_22301_certified=r.iso_22301_certified,
            plan_digitized=r.plan_digitized,
            backup_power_hours=r.backup_power_hours,
            backup_systems_score=r.backup_systems_score,
            emergency_stockpile_days=r.emergency_stockpile_days,
            drill_frequency_per_year=r.drill_frequency_per_year,
            staff_certification_pct=r.staff_certification_pct,
            crisis_team_exists=r.crisis_team_exists,
            mutual_aid_agreements=r.mutual_aid_agreements,
            coordination_score=r.coordination_score,
        )

    async def _persist(
        self, db, facility, result: HFER720Result,
        recommendations, request, assessor_id, ml_score, ml_weight,
    ) -> RiskAssessment:
        d = result.dimension_scores

        assessment = RiskAssessment(
            tenant_id=facility.tenant_id,
            facility_id=facility.id,
            sector=facility.sector,
            h_score=d.h, f_score=d.f, e_score=d.e, r_score=d.r,
            uri_score=result.uri_score,
            h_seismic=d.h_seismic, h_flood=d.h_flood,
            h_cyber=d.h_cyber, h_supply=d.h_supply,
            f_structural=d.f_structural, f_operational=d.f_operational,
            f_human=d.f_human, f_digital=d.f_digital,
            e_population=d.e_population, e_assets=d.e_assets,
            e_dependencies=d.e_dependencies,
            r_plans=d.r_plans, r_resources=d.r_resources,
            r_training=d.r_training, r_network=d.r_network,
            risk_class=result.risk_class,
            confidence=result.confidence,
            classical_score=result.classical_uri,
            ml_score=ml_score,
            ml_weight_used=ml_weight,
            assessment_type=AssessmentType.HYBRID if ml_score else AssessmentType.FORM,
            assessor_id=assessor_id,
            raw_inputs=request.model_dump(),
        )
        db.add(assessment)
        await db.flush()

        # Recommendations
        for rec in recommendations:
            db.add(RiskRecommendation(
                assessment_id=assessment.id,
                priority=rec.priority,
                category=rec.category,
                title=rec.title,
                description=rec.description,
                effort=rec.effort,
                impact_delta=rec.impact_delta,
                deadline_days=rec.deadline_days,
                standard_ref=rec.standard_ref,
            ))

        await db.flush()
        return assessment

pipeline = RiskScoringPipeline()
