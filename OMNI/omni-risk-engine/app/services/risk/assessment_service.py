"""
OMNI Risk Intelligence Engine
Risk Assessment Service — main orchestrator

Coordinates:
  HFER720Engine → EnsembleOrchestrator → RecommendationEngine
"""
from __future__ import annotations
import logging
import uuid
from datetime import datetime, timedelta

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.core.constants import RISK_REVIEW_DAYS, classify_risk
from app.models.db_models import (
    RiskAssessment, HazardScore, RiskRecommendation, Facility
)
from app.schemas.risk import (
    RiskAssessmentRequest, RiskAssessmentResponse,
    HazardBreakdown, RadarData, RecommendationOut,
)
from app.services.risk.hfer720 import HFER720Engine
from app.services.ml.ensemble import EnsembleOrchestrator
from app.services.recommendations.engine import RecommendationEngine

logger = logging.getLogger(__name__)


class RiskAssessmentService:
    """
    Orchestrates the full risk assessment pipeline:
    1. Validate facility + tenant
    2. Run HFER-720 classical model
    3. Run ML ensemble (if requested)
    4. Generate recommendations
    5. Persist to DB
    6. Return structured response
    """

    def __init__(self):
        self.hfer720       = HFER720Engine()
        self.ensemble      = EnsembleOrchestrator(
            classical_weight=settings.ml_ensemble_weight_classical,
            ml_weight=settings.ml_ensemble_weight_ml,
            model_path=f"{settings.ml_model_path}/risk_rf.joblib",
        )
        self.recommender   = RecommendationEngine()

    async def assess(
        self,
        request: RiskAssessmentRequest,
        tenant_id: uuid.UUID,
        db: AsyncSession,
    ) -> RiskAssessmentResponse:

        # 1. Fetch facility and verify tenant ownership
        facility = await self._get_facility(request.facility_id, tenant_id, db)

        sector = facility.sector

        # 2. Classical HFER-720
        classical_result = self.hfer720.compute(
            sector=sector,
            hazard_inputs=request.hazard_scores,
            fragility=request.fragility,
            exposure=request.exposure,
            response=request.response,
        )

        # 3. Ensemble (classical + ML)
        if request.assessment_type in ("hybrid", "ml"):
            uri_final, confidence, model_version = self.ensemble.combine(
                classical_result=classical_result,
                sector=sector,
                hazard_inputs=request.hazard_scores,
                fragility=request.fragility,
                exposure=request.exposure,
                response=request.response,
            )
        else:
            uri_final = classical_result.uri_score
            confidence = classical_result.confidence
            model_version = "classical_only"

        risk_class  = classify_risk(uri_final)
        review_days = RISK_REVIEW_DAYS[risk_class]
        valid_until = datetime.utcnow() + timedelta(days=review_days)

        # 4. Recommendations
        recommendations = self.recommender.generate(
            result=classical_result,
            fragility=request.fragility,
            response=request.response,
            exposure=request.exposure,
            sector=sector,
        )

        # 5. Persist assessment
        assessment_id = await self._persist(
            db=db,
            tenant_id=tenant_id,
            facility=facility,
            sector=sector,
            classical_result=classical_result,
            uri_final=uri_final,
            risk_class=risk_class.value,
            confidence=confidence,
            model_version=model_version,
            request=request,
            recommendations=recommendations,
            valid_until=valid_until,
        )

        # 6. Build response
        return RiskAssessmentResponse(
            assessment_id=assessment_id,
            facility_id=request.facility_id,
            sector=sector,
            assessed_at=datetime.utcnow(),
            uri_score=uri_final,
            risk_class=risk_class.value,
            confidence=confidence,
            h_score=classical_result.h_score,
            f_score=classical_result.f_score,
            e_score=classical_result.e_score,
            r_score=classical_result.r_score,
            hazard_breakdown=classical_result.hazard_breakdown,
            radar=classical_result.radar,
            recommendations=recommendations,
            valid_until=valid_until,
            next_review_days=review_days,
            model_version=model_version,
        )

    async def _get_facility(
        self,
        facility_id: uuid.UUID,
        tenant_id: uuid.UUID,
        db: AsyncSession,
    ) -> Facility:
        result = await db.execute(
            select(Facility).where(
                Facility.id == facility_id,
                Facility.tenant_id == tenant_id,
                Facility.is_active == True,
            )
        )
        facility = result.scalar_one_or_none()
        if not facility:
            raise ValueError(f"Facility {facility_id} not found for tenant {tenant_id}")
        return facility

    async def _persist(
        self,
        db: AsyncSession,
        tenant_id: uuid.UUID,
        facility: Facility,
        sector: str,
        classical_result,
        uri_final: float,
        risk_class: str,
        confidence: float,
        model_version: str,
        request: RiskAssessmentRequest,
        recommendations: list[RecommendationOut],
        valid_until: datetime,
    ) -> uuid.UUID:

        assessment = RiskAssessment(
            tenant_id=tenant_id,
            facility_id=facility.id,
            sector=sector,
            h_score=classical_result.h_score,
            f_score=classical_result.f_score,
            e_score=classical_result.e_score,
            r_score=classical_result.r_score,
            uri_score=uri_final,
            risk_class=risk_class,
            confidence=confidence,
            assessment_type=request.assessment_type,
            model_version=model_version,
            valid_until=valid_until,
            raw_inputs=request.model_dump(),
            score_breakdown=classical_result.score_breakdown,
        )
        db.add(assessment)
        await db.flush()   # get assessment.id

        # Hazard scores
        for hb in classical_result.hazard_breakdown:
            db.add(HazardScore(
                assessment_id=assessment.id,
                hazard_type=hb.hazard_type,
                probability=hb.probability,
                intensity=hb.intensity,
                raw_score=hb.score,
                data_source=hb.data_source,
            ))

        # Recommendations
        for rec in recommendations:
            db.add(RiskRecommendation(
                assessment_id=assessment.id,
                priority=rec.priority,
                category=rec.category,
                title=rec.title,
                description=rec.description,
                effort=rec.effort,
                impact=rec.impact,
                deadline_days=rec.deadline_days,
                standard_ref=rec.standard_ref,
            ))

        await db.commit()
        return assessment.id
