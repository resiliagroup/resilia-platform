"""
OMNI Risk Intelligence Engine
API v1 — Risk Assessment Endpoints

POST /api/v1/assess              → run full risk assessment
GET  /api/v1/assessments/{id}    → fetch saved assessment
GET  /api/v1/facilities/{id}/history → assessment history
GET  /api/v1/portfolio           → tenant portfolio summary
"""
from __future__ import annotations
import uuid
import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.db.database import get_db
from app.schemas.risk import (
    RiskAssessmentRequest, RiskAssessmentResponse,
    PortfolioRiskResponse, FacilityRiskSummary,
)
from app.models.db_models import RiskAssessment, Facility, RiskRecommendation, HazardScore
from app.services.risk.assessment_service import RiskAssessmentService
from app.api.v1.deps import get_current_tenant

router = APIRouter(prefix="/assess", tags=["Risk Assessment"])
logger = logging.getLogger(__name__)

# Single service instance (stateless after init)
_service = RiskAssessmentService()


@router.post(
    "",
    response_model=RiskAssessmentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Run a full HFER-720 risk assessment",
)
async def run_assessment(
    request: RiskAssessmentRequest,
    tenant_id: Annotated[uuid.UUID, Depends(get_current_tenant)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """
    Run the full HFER-720 risk assessment pipeline:
    - Compute H, F, E, R scores
    - Apply ML ensemble
    - Generate prioritized recommendations
    - Persist and return results
    """
    try:
        result = await _service.assess(request, tenant_id, db)
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.exception("Assessment failed")
        raise HTTPException(status_code=500, detail="Assessment engine error")


@router.get(
    "/assessments/{assessment_id}",
    response_model=RiskAssessmentResponse,
    summary="Retrieve a saved risk assessment",
)
async def get_assessment(
    assessment_id: uuid.UUID,
    tenant_id: Annotated[uuid.UUID, Depends(get_current_tenant)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    result = await db.execute(
        select(RiskAssessment).where(
            RiskAssessment.id == assessment_id,
            RiskAssessment.tenant_id == tenant_id,
        )
    )
    assessment = result.scalar_one_or_none()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    # Load related hazard scores and recommendations
    hazard_result = await db.execute(
        select(HazardScore).where(HazardScore.assessment_id == assessment_id)
    )
    rec_result = await db.execute(
        select(RiskRecommendation).where(
            RiskRecommendation.assessment_id == assessment_id
        ).order_by(RiskRecommendation.priority)
    )

    from app.schemas.risk import HazardBreakdown, RadarData, RecommendationOut
    from app.core.constants import RISK_REVIEW_DAYS, classify_risk

    hazards = [
        HazardBreakdown(
            hazard_type=h.hazard_type,
            score=h.raw_score,
            probability=h.probability,
            intensity=h.intensity,
            data_source=h.data_source,
        )
        for h in hazard_result.scalars().all()
    ]

    recommendations = [
        RecommendationOut(
            priority=r.priority,
            category=r.category,
            title=r.title,
            description=r.description,
            effort=r.effort,
            impact=r.impact,
            deadline_days=r.deadline_days,
            standard_ref=r.standard_ref,
            score_impact=0.0,
        )
        for r in rec_result.scalars().all()
    ]

    risk_class = classify_risk(assessment.uri_score)
    review_days = RISK_REVIEW_DAYS[risk_class]

    return RiskAssessmentResponse(
        assessment_id=assessment.id,
        facility_id=assessment.facility_id,
        sector=assessment.sector,
        assessed_at=assessment.assessed_at,
        uri_score=assessment.uri_score,
        risk_class=assessment.risk_class,
        confidence=assessment.confidence or 0.8,
        h_score=assessment.h_score,
        f_score=assessment.f_score,
        e_score=assessment.e_score,
        r_score=assessment.r_score,
        hazard_breakdown=hazards,
        radar=RadarData(
            hazard=assessment.h_score,
            fragility=assessment.f_score,
            exposure=assessment.e_score,
            response=assessment.r_score,
        ),
        recommendations=recommendations,
        valid_until=assessment.valid_until,
        next_review_days=review_days,
        model_version=assessment.model_version or "unknown",
    )


@router.get(
    "/portfolio",
    response_model=PortfolioRiskResponse,
    summary="Tenant portfolio risk summary",
)
async def get_portfolio(
    tenant_id: Annotated[uuid.UUID, Depends(get_current_tenant)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Returns aggregated risk view across all tenant facilities."""

    # All facilities for tenant
    fac_result = await db.execute(
        select(Facility).where(
            Facility.tenant_id == tenant_id,
            Facility.is_active == True,
        )
    )
    facilities = fac_result.scalars().all()

    if not facilities:
        raise HTTPException(status_code=404, detail="No facilities found for tenant")

    facility_ids = [f.id for f in facilities]

    # Latest assessment per facility (subquery)
    latest_subq = (
        select(
            RiskAssessment.facility_id,
            func.max(RiskAssessment.assessed_at).label("latest")
        )
        .where(RiskAssessment.facility_id.in_(facility_ids))
        .group_by(RiskAssessment.facility_id)
        .subquery()
    )

    assessments_result = await db.execute(
        select(RiskAssessment).join(
            latest_subq,
            (RiskAssessment.facility_id == latest_subq.c.facility_id) &
            (RiskAssessment.assessed_at == latest_subq.c.latest)
        )
    )
    assessments = assessments_result.scalars().all()
    assessment_map = {a.facility_id: a for a in assessments}

    # Aggregate
    by_risk_class: dict[str, int] = {
        "CRITICAL": 0, "HIGH": 0, "MEDIUM": 0, "RESILIENT": 0, "EXEMPLARY": 0
    }
    by_sector: dict[str, list[float]] = {}
    summaries: list[FacilityRiskSummary] = []
    uri_scores: list[float] = []

    for fac in facilities:
        assessment = assessment_map.get(fac.id)
        uri = assessment.uri_score if assessment else None
        rc = assessment.risk_class if assessment else "UNASSESSED"

        if uri is not None:
            uri_scores.append(uri)
            if rc in by_risk_class:
                by_risk_class[rc] += 1
            if fac.sector not in by_sector:
                by_sector[fac.sector] = []
            by_sector[fac.sector].append(uri)

        summaries.append(FacilityRiskSummary(
            facility_id=fac.id,
            facility_name=fac.name,
            sector=fac.sector,
            uri_score=round(uri, 2) if uri else 0.0,
            risk_class=rc,
            assessed_at=assessment.assessed_at if assessment else None,
        ))

    avg_uri = round(sum(uri_scores) / len(uri_scores), 2) if uri_scores else 0.0
    sector_avg = {s: round(sum(v)/len(v), 2) for s, v in by_sector.items()}

    critical = [s for s in summaries if s.risk_class == "CRITICAL"]
    summaries_sorted = sorted(summaries, key=lambda s: s.uri_score)

    return PortfolioRiskResponse(
        tenant_id=tenant_id,
        total_facilities=len(facilities),
        assessed_count=len(assessments),
        avg_uri_score=avg_uri,
        by_risk_class=by_risk_class,
        by_sector=sector_avg,
        critical_facilities=critical,
        facilities=summaries_sorted,
    )
