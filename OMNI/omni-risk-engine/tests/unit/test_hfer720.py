"""
Tests — HFER-720 classical risk model
"""
import pytest
from app.services.risk.hfer720 import HFER720Engine
from app.schemas.risk import (
    FragilityInput, ExposureInput,
    ResponseCapacityInput, HazardScoreInput,
)


@pytest.fixture
def engine():
    return HFER720Engine()


@pytest.fixture
def minimal_inputs():
    """Minimal valid inputs — all defaults."""
    return dict(
        hazard_inputs=[
            HazardScoreInput(hazard_type="seismic", probability=0.3, intensity=50),
            HazardScoreInput(hazard_type="cyber", probability=0.4, intensity=40),
        ],
        fragility=FragilityInput(),
        exposure=ExposureInput(population_at_risk=500),
        response=ResponseCapacityInput(),
    )


@pytest.fixture
def well_prepared_inputs():
    """Well-prepared facility — should score high."""
    return dict(
        hazard_inputs=[
            HazardScoreInput(hazard_type="seismic", probability=0.1, intensity=20),
            HazardScoreInput(hazard_type="cyber", probability=0.2, intensity=20),
        ],
        fragility=FragilityInput(
            building_age=5,
            construction_type="RC",
            has_backup_power=True,
            has_redundant_systems=True,
            single_points_of_failure=0,
            maintenance_score=90,
            bcm_trained_staff_pct=85,
            has_crisis_team=True,
            cyber_hygiene_score=90,
            has_offsite_backup=True,
        ),
        exposure=ExposureInput(population_at_risk=100),
        response=ResponseCapacityInput(
            has_bcm_plan=True,
            plan_last_tested_months=6,
            iso_22301_certified=True,
            plan_is_digital=True,
            emergency_supplies_days=7,
            backup_site_available=True,
            equipment_readiness=90,
            drill_frequency_annual=4,
            certified_staff_count=10,
            mutual_aid_agreements=3,
            external_coordination_score=85,
        ),
    )


@pytest.fixture
def critical_inputs():
    """Very poorly prepared facility — should score critically low."""
    return dict(
        hazard_inputs=[
            HazardScoreInput(hazard_type="seismic", probability=0.9, intensity=95),
            HazardScoreInput(hazard_type="flood", probability=0.8, intensity=90),
            HazardScoreInput(hazard_type="cyber", probability=0.7, intensity=80),
        ],
        fragility=FragilityInput(
            building_age=50,
            construction_type="masonry",
            has_backup_power=False,
            has_redundant_systems=False,
            single_points_of_failure=5,
            maintenance_score=10,
            bcm_trained_staff_pct=0,
            has_crisis_team=False,
            cyber_hygiene_score=10,
            has_offsite_backup=False,
        ),
        exposure=ExposureInput(
            population_at_risk=50000,
            population_vulnerability=0.9,
            critical_services_count=8,
        ),
        response=ResponseCapacityInput(
            has_bcm_plan=False,
            emergency_supplies_days=0,
            backup_site_available=False,
            drill_frequency_annual=0,
            mutual_aid_agreements=0,
        ),
    )


class TestHFER720Engine:

    def test_score_range(self, engine, minimal_inputs):
        result = engine.compute(sector="hospital", **minimal_inputs)
        assert 0 <= result.uri_score <= 100

    def test_well_prepared_scores_high(self, engine, well_prepared_inputs):
        result = engine.compute(sector="bank", **well_prepared_inputs)
        assert result.uri_score >= 60, f"Expected ≥60, got {result.uri_score}"

    def test_critical_facility_scores_low(self, engine, critical_inputs):
        result = engine.compute(sector="hospital", **critical_inputs)
        assert result.uri_score < 50, f"Expected <50, got {result.uri_score}"

    def test_well_prepared_beats_critical(self, engine, well_prepared_inputs, critical_inputs):
        good = engine.compute(sector="bank", **well_prepared_inputs)
        bad = engine.compute(sector="bank", **critical_inputs)
        assert good.uri_score > bad.uri_score

    def test_all_sectors_compute(self, engine, minimal_inputs):
        sectors = ["hospital", "bank", "municipality", "university", "industrial"]
        for sector in sectors:
            result = engine.compute(sector=sector, **minimal_inputs)
            assert result.uri_score is not None, f"Sector {sector} returned None"

    def test_radar_data_populated(self, engine, minimal_inputs):
        result = engine.compute(sector="hospital", **minimal_inputs)
        assert result.radar.hazard >= 0
        assert result.radar.fragility >= 0
        assert result.radar.exposure >= 0
        assert result.radar.response >= 0

    def test_hazard_breakdown_populated(self, engine, minimal_inputs):
        result = engine.compute(sector="hospital", **minimal_inputs)
        assert len(result.hazard_breakdown) > 0
        for hb in result.hazard_breakdown:
            assert 0 <= hb.score <= 100

    def test_risk_class_assigned(self, engine, minimal_inputs):
        result = engine.compute(sector="hospital", **minimal_inputs)
        valid_classes = {"CRITICAL", "HIGH", "MEDIUM", "RESILIENT", "EXEMPLARY"}
        assert result.risk_class in valid_classes

    def test_empty_hazard_inputs_uses_defaults(self, engine):
        result = engine.compute(
            sector="bank",
            hazard_inputs=[],
            fragility=FragilityInput(),
            exposure=ExposureInput(),
            response=ResponseCapacityInput(),
        )
        assert result.uri_score is not None

    def test_sector_weights_affect_score(self, engine, minimal_inputs):
        """Industrial sector weights hazard higher — should differ from hospital."""
        hospital = engine.compute(sector="hospital", **minimal_inputs)
        industrial = engine.compute(sector="industrial", **minimal_inputs)
        # Scores should differ due to different weights
        assert hospital.uri_score != industrial.uri_score
