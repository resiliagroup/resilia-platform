"""Unit tests for HFER-720 model — pure math, no DB required."""

import pytest
from app.services.risk.hfer_model import (
    HFER720Model, HazardInput, FragilityInput,
    ExposureInput, ResponseCapacityInput,
)
from app.core.constants import SectorType, RiskClass

model = HFER720Model()

def test_worst_case_is_critical():
    """Maximum hazard + fragility + exposure, zero response → CRITICAL."""
    result = model.compute(
        sector=SectorType.HOSPITAL,
        hazard=HazardInput(seismic=100, flood=100, cyber=100, supply_chain=100),
        fragility=FragilityInput(**{k: 100 for k in FragilityInput.__dataclass_fields__
                                   if k not in ("seismic_probability","flood_probability","cyber_probability")}),
        exposure=ExposureInput(population_at_risk=100_000, asset_value_usd=1e9,
                               dependency_count=20, serves_critical_population=True),
        response=ResponseCapacityInput(),  # all zeros
    )
    assert result.risk_class == RiskClass.CRITICAL
    assert result.uri_score < 40

def test_best_case_is_exemplary():
    """Minimum hazard, zero fragility, ISO certified, well trained → EXEMPLARY."""
    result = model.compute(
        sector=SectorType.BANK,
        hazard=HazardInput(seismic=5, flood=5, cyber=10, supply_chain=10),
        fragility=FragilityInput(**{k: 5 for k in FragilityInput.__dataclass_fields__
                                   if not k.endswith("_probability")}),
        exposure=ExposureInput(population_at_risk=50, asset_value_usd=1e6),
        response=ResponseCapacityInput(
            bcm_plan_exists=True, plan_tested_last_12m=True,
            iso_22301_certified=True, plan_digitized=True,
            backup_power_hours=72, drill_frequency_per_year=4,
            staff_certification_pct=1.0, crisis_team_exists=True,
            mutual_aid_agreements=5, coordination_score=90,
        ),
    )
    assert result.risk_class in (RiskClass.RESILIENT, RiskClass.EXEMPLARY)
    assert result.uri_score >= 75

def test_uri_range():
    """URI always in [0, 100]."""
    import random
    for _ in range(50):
        result = model.compute(
            sector=random.choice(list(SectorType)),
            hazard=HazardInput(
                seismic=random.uniform(0,100), flood=random.uniform(0,100),
                cyber=random.uniform(0,100), supply_chain=random.uniform(0,100),
            ),
            fragility=FragilityInput(),
            exposure=ExposureInput(),
            response=ResponseCapacityInput(),
        )
        assert 0 <= result.uri_score <= 100

def test_ml_ensemble_blends_scores():
    """Providing an ML score changes the final URI."""
    base = model.compute(
        sector=SectorType.MUNICIPALITY,
        hazard=HazardInput(seismic=60),
        fragility=FragilityInput(),
        exposure=ExposureInput(),
        response=ResponseCapacityInput(),
    )
    with_ml = model.compute(
        sector=SectorType.MUNICIPALITY,
        hazard=HazardInput(seismic=60),
        fragility=FragilityInput(),
        exposure=ExposureInput(),
        response=ResponseCapacityInput(),
        ml_score=90.0,
        ml_weight=0.6,
    )
    assert with_ml.uri_score != base.uri_score
    assert with_ml.uri_score > base.uri_score  # ML score is optimistic here

def test_sector_weights_affect_uri():
    """Same inputs, different sector → different URI."""
    kwargs = dict(
        hazard=HazardInput(seismic=70),
        fragility=FragilityInput(),
        exposure=ExposureInput(),
        response=ResponseCapacityInput(),
    )
    hospital_uri = model.compute(sector=SectorType.HOSPITAL, **kwargs).uri_score
    industrial_uri = model.compute(sector=SectorType.INDUSTRIAL, **kwargs).uri_score
    assert hospital_uri != industrial_uri

def test_recommendations_generated():
    """Critical facility gets at least 3 recommendations."""
    from app.services.risk.recommendation_engine import generate_recommendations
    result = model.compute(
        sector=SectorType.HOSPITAL,
        hazard=HazardInput(seismic=80, cyber=75),
        fragility=FragilityInput(building_age_score=85, cyber_hygiene=80),
        exposure=ExposureInput(serves_critical_population=True),
        response=ResponseCapacityInput(),  # no plans
    )
    recs = generate_recommendations(result)
    assert len(recs) >= 3
    assert recs[0].priority == 1
    assert all(r.deadline_days > 0 for r in recs)
