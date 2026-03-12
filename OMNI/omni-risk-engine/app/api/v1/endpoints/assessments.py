"""Assessment endpoints — core Risk Intelligence API."""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from uuid import UUID
from typing import Optional

from app.db.base import get_db
from app.models.facility import Facility
from app.models.risk import RiskAssessment, RiskRecommendation
from app.schemas.risk import AssessmentCreateRequest, AssessmentResponse, RiskSummary
from app.services.risk.scoring_pipeline import pipeline
from app.services.risk.recommendation_engine import generate_recommendations
from app.core.constants import RiskClass, SectorType
import structlog

router = APIRouter(prefix="/assessments", tags=["Risk Assessments"])
logger = structlog.get_logger()

@router.post("/", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED)
async def create_assessment(
    request: AssessmentCreateRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Run full HFER-720 pipeline for a facility.
    Returns URI score, dimension scores, radar data and recommendations.
    """
    # Fetch facility with location data
    stmt = select(Facility).where(Facility.id == request.facility_id)
    result = await db.execute(stmt)
    facility = result.scalar_one_or_none()

    if not facility:
        raise HTTPException(status_code=404, detail=f"Facility {request.facility_id} not found")
    if not facility.is_active:
        raise HTTPException(status_code=400, detail="Facility is inactive")

    assessment, recommendations = await pipeline.run(
        db=db, facility=facility, request=request
    )

    return _build_response(assessment, recommendations)

@router.get("/{assessment_id}", response_model=AssessmentResponse)
async def get_assessment(
    assessment_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Retrieve a completed assessment with all scores and recommendations."""
    stmt = (
        select(RiskAssessment)
        .where(RiskAssessment.id == assessment_id)
    )
    result = await db.execute(stmt)
    assessment = result.scalar_one_or_none()

    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    rec_stmt = select(RiskRecommendation).where(
        RiskRecommendation.assessment_id == assessment_id
    ).order_by(RiskRecommendation.priority)
    recs = (await db.execute(rec_stmt)).scalars().all()

    return _build_response(assessment, recs)

@router.get("/facility/{facility_id}/latest", response_model=AssessmentResponse)
async def get_latest_assessment(
    facility_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """Get the most recent assessment for a facility."""
    stmt = (
        select(RiskAssessment)
        .where(RiskAssessment.facility_id == facility_id)
        .order_by(desc(RiskAssessment.assessed_at))
        .limit(1)
    )
    result = await db.execute(stmt)
    assessment = result.scalar_one_or_none()

    if not assessment:
        raise HTTPException(status_code=404, detail="No assessments found for this facility")

    rec_stmt = select(RiskRecommendation).where(
        RiskRecommendation.assessment_id == assessment.id
    ).order_by(RiskRecommendation.priority)
    recs = (await db.execute(rec_stmt)).scalars().all()

    return _build_response(assessment, recs)

@router.get("/facility/{facility_id}/history", response_model=list[RiskSummary])
async def get_assessment_history(
    facility_id: UUID,
    limit: int = Query(default=12, le=50),
    db: AsyncSession = Depends(get_db),
):
    """Time series of URI scores for trend analysis."""
    stmt = (
        select(RiskAssessment)
        .where(RiskAssessment.facility_id == facility_id)
        .order_by(desc(RiskAssessment.assessed_at))
        .limit(limit)
    )
    assessments = (await db.execute(stmt)).scalars().all()

    # Need facility name
    fac_stmt = select(Facility).where(Facility.id == facility_id)
    facility = (await db.execute(fac_stmt)).scalar_one_or_none()

    return [
        RiskSummary(
            facility_id=a.facility_id,
            facility_name=facility.name if facility else "Unknown",
            uri_score=a.uri_score,
            risk_class=a.risk_class,
            h_score=a.h_score, f_score=a.f_score,
            e_score=a.e_score, r_score=a.r_score,
            assessed_at=a.assessed_at,
        )
        for a in assessments
    ]

@router.get("/portfolio/summary")
async def portfolio_summary(
    tenant_id: UUID = Query(...),
    sector: Optional[SectorType] = None,
    db: AsyncSession = Depends(get_db),
):
    """
    Aggregate risk summary across all facilities for a tenant.
    Used in board dashboard.
    """
    stmt = select(RiskAssessment).where(RiskAssessment.tenant_id == tenant_id)
    if sector:
        stmt = stmt.where(RiskAssessment.sector == sector)

    # Latest assessment per facility via subquery approach
    assessments = (await db.execute(stmt)).scalars().all()

    if not assessments:
        return {"total": 0, "by_class": {}, "avg_uri": None}

    scores = [a.uri_score for a in assessments if a.uri_score is not None]
    by_class = {}
    for a in assessments:
        cls = a.risk_class.value if a.risk_class else "UNKNOWN"
        by_class[cls] = by_class.get(cls, 0) + 1

    return {
        "total": len(assessments),
        "avg_uri": round(sum(scores) / len(scores), 1) if scores else None,
        "min_uri": round(min(scores), 1) if scores else None,
        "max_uri": round(max(scores), 1) if scores else None,
        "by_class": by_class,
        "critical_count": by_class.get("CRITICAL", 0),
    }

def _build_response(assessment: RiskAssessment, recommendations) -> AssessmentResponse:
    from app.schemas.risk import DimensionScoresOut, RecommendationOut
    from app.services.risk.hfer_model import HFER720Result

    dim = DimensionScoresOut(
        h=assessment.h_score or 0, f=assessment.f_score or 0,
        e=assessment.e_score or 0, r=assessment.r_score or 0,
        h_seismic=assessment.h_seismic or 0, h_flood=assessment.h_flood or 0,
        h_cyber=assessment.h_cyber or 0, h_supply=assessment.h_supply or 0,
        f_structural=assessment.f_structural or 0, f_operational=assessment.f_operational or 0,
        f_human=assessment.f_human or 0, f_digital=assessment.f_digital or 0,
        e_population=assessment.e_population or 0, e_assets=assessment.e_assets or 0,
        e_dependencies=assessment.e_dependencies or 0,
        r_plans=assessment.r_plans or 0, r_resources=assessment.r_resources or 0,
        r_training=assessment.r_training or 0, r_network=assessment.r_network or 0,
    )

    radar = {
        "Hazard":           round(100 - (assessment.h_score or 50), 1),
        "Fragility":        round(100 - (assessment.f_score or 50), 1),
        "Exposure":         round(100 - (assessment.e_score or 50), 1),
        "Response":         round(assessment.r_score or 0, 1),
        "Seismic Safety":   round(100 - (assessment.h_seismic or 50), 1),
        "Cyber Security":   round(100 - (assessment.h_cyber or 50), 1),
        "Structural":       round(100 - (assessment.f_structural or 50), 1),
        "Plans & Protocols":round(assessment.r_plans or 0, 1),
    }

    recs_out = [
        RecommendationOut(
            priority=r.priority, category=r.category,
            title=r.title, description=r.description,
            effort=r.effort, impact_delta=r.impact_delta,
            deadline_days=r.deadline_days, standard_ref=r.standard_ref or "",
        )
        for r in recommendations
    ]

    return AssessmentResponse(
        id=assessment.id, facility_id=assessment.facility_id,
        sector=assessment.sector, uri_score=assessment.uri_score,
        risk_class=assessment.risk_class, confidence=assessment.confidence or 0.8,
        dimension_scores=dim, radar_data=radar,
        recommendations=recs_out, classical_score=assessment.classical_score or 0,
        ml_score=assessment.ml_score, assessed_at=assessment.assessed_at,
    )
