"""
OMNI Risk Intelligence Engine
ML Layer — Ensemble model interface

Architecture:
  - BaseMLModel: abstract interface all ML models must implement
  - RuleBasedModel: deterministic fallback (always available)
  - SklearnRiskModel: scikit-learn RandomForest (loaded from disk)
  - EnsembleOrchestrator: combines classical + ML scores
"""
from __future__ import annotations
import logging
import os
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional
import numpy as np

from app.schemas.risk import (
    FragilityInput, ExposureInput,
    ResponseCapacityInput, HazardScoreInput,
)
from app.services.risk.hfer720 import HFER720Result

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────
# DATA TRANSFER
# ─────────────────────────────────────────────

@dataclass
class MLPrediction:
    uri_score: float
    confidence: float
    model_id: str
    model_version: str
    features_used: list[str]


# ─────────────────────────────────────────────
# ABSTRACT BASE
# ─────────────────────────────────────────────

class BaseMLModel(ABC):
    model_id: str = "base"
    model_version: str = "0.0.0"

    @abstractmethod
    def predict(self, features: dict) -> MLPrediction:
        """Predict URI score from feature dict."""
        ...

    @abstractmethod
    def is_available(self) -> bool:
        """True if model is loaded and ready."""
        ...

    def build_features(
        self,
        sector: str,
        hazard_inputs: list[HazardScoreInput],
        fragility: FragilityInput,
        exposure: ExposureInput,
        response: ResponseCapacityInput,
        classical_result: Optional[HFER720Result] = None,
    ) -> dict:
        """
        Convert raw inputs into a flat feature dictionary.
        Classical scores are included as features when available.
        """
        feats: dict = {"sector": sector}

        # Hazard features
        hazard_map = {h.hazard_type: h for h in hazard_inputs}
        for htype in ["seismic", "flood", "cyber", "supply_chain", "wildfire", "pandemic"]:
            h = hazard_map.get(htype)
            feats[f"hazard_{htype}_prob"] = h.probability if h else 0.3
            feats[f"hazard_{htype}_intensity"] = h.intensity if h else 40.0

        # Fragility features
        feats["building_age"] = fragility.building_age or 15
        feats["has_backup_power"] = int(fragility.has_backup_power)
        feats["has_redundant_systems"] = int(fragility.has_redundant_systems)
        feats["single_points_of_failure"] = fragility.single_points_of_failure
        feats["maintenance_score"] = fragility.maintenance_score
        feats["bcm_trained_staff_pct"] = fragility.bcm_trained_staff_pct
        feats["has_crisis_team"] = int(fragility.has_crisis_team)
        feats["cyber_hygiene_score"] = fragility.cyber_hygiene_score
        feats["has_offsite_backup"] = int(fragility.has_offsite_backup)

        # Exposure features
        feats["population_at_risk"] = min(exposure.population_at_risk, 1_000_000)
        feats["population_vulnerability"] = exposure.population_vulnerability
        feats["critical_services_count"] = exposure.critical_services_count
        feats["dependency_count"] = len(exposure.dependency_facility_ids)

        # Response features
        feats["has_bcm_plan"] = int(response.has_bcm_plan)
        feats["plan_last_tested_months"] = response.plan_last_tested_months or 999
        feats["iso_22301_certified"] = int(response.iso_22301_certified)
        feats["emergency_supplies_days"] = response.emergency_supplies_days
        feats["backup_site_available"] = int(response.backup_site_available)
        feats["drill_frequency_annual"] = response.drill_frequency_annual
        feats["mutual_aid_agreements"] = response.mutual_aid_agreements

        # Classical scores as features (meta-learning)
        if classical_result:
            feats["classical_h_score"] = classical_result.h_score
            feats["classical_f_score"] = classical_result.f_score
            feats["classical_e_score"] = classical_result.e_score
            feats["classical_r_score"] = classical_result.r_score
            feats["classical_uri"] = classical_result.uri_score

        return feats


# ─────────────────────────────────────────────
# RULE-BASED FALLBACK
# ─────────────────────────────────────────────

class RuleBasedModel(BaseMLModel):
    """
    Deterministic fallback — always available.
    Applies expert rules to adjust classical URI score.
    Used when no trained ML model is loaded.
    """
    model_id = "rule_based"
    model_version = "1.0.0"

    def is_available(self) -> bool:
        return True

    def predict(self, features: dict) -> MLPrediction:
        base = features.get("classical_uri", 50.0)
        adjustment = 0.0

        # High-impact rules
        if not features.get("has_bcm_plan"):
            adjustment -= 8.0
        if features.get("iso_22301_certified"):
            adjustment += 6.0
        if not features.get("has_backup_power"):
            adjustment -= 5.0
        if not features.get("has_offsite_backup"):
            adjustment -= 4.0
        if features.get("single_points_of_failure", 0) >= 3:
            adjustment -= 7.0
        if features.get("drill_frequency_annual", 0) >= 2:
            adjustment += 5.0
        if features.get("cyber_hygiene_score", 50) < 30:
            adjustment -= 6.0
        if features.get("mutual_aid_agreements", 0) >= 2:
            adjustment += 4.0

        uri = min(max(base + adjustment, 0), 100)

        return MLPrediction(
            uri_score=round(uri, 2),
            confidence=0.75,
            model_id=self.model_id,
            model_version=self.model_version,
            features_used=list(features.keys()),
        )


# ─────────────────────────────────────────────
# SKLEARN MODEL (loaded from disk)
# ─────────────────────────────────────────────

class SklearnRiskModel(BaseMLModel):
    """
    RandomForest model trained on historical assessments.
    Loaded from joblib file at startup.
    Falls back gracefully if model file not found.
    """
    model_id = "sklearn_rf"
    model_version = "1.0.0"

    FEATURE_ORDER = [
        "hazard_seismic_prob", "hazard_seismic_intensity",
        "hazard_flood_prob", "hazard_flood_intensity",
        "hazard_cyber_prob", "hazard_cyber_intensity",
        "hazard_supply_chain_prob", "hazard_supply_chain_intensity",
        "building_age", "has_backup_power", "has_redundant_systems",
        "single_points_of_failure", "maintenance_score",
        "bcm_trained_staff_pct", "has_crisis_team",
        "cyber_hygiene_score", "has_offsite_backup",
        "population_at_risk", "population_vulnerability",
        "critical_services_count", "dependency_count",
        "has_bcm_plan", "plan_last_tested_months",
        "iso_22301_certified", "emergency_supplies_days",
        "backup_site_available", "drill_frequency_annual",
        "mutual_aid_agreements",
        "classical_h_score", "classical_f_score",
        "classical_e_score", "classical_r_score", "classical_uri",
    ]

    def __init__(self, model_path: str):
        self._model = None
        self._model_path = model_path
        self._load()

    def _load(self):
        try:
            import joblib
            if os.path.exists(self._model_path):
                self._model = joblib.load(self._model_path)
                logger.info(f"ML model loaded from {self._model_path}")
            else:
                logger.warning(f"ML model not found at {self._model_path} — will use fallback")
        except Exception as e:
            logger.error(f"Failed to load ML model: {e}")

    def is_available(self) -> bool:
        return self._model is not None

    def predict(self, features: dict) -> MLPrediction:
        if not self.is_available():
            raise RuntimeError("SklearnRiskModel not loaded")

        # Build feature vector in correct order
        X = np.array([[features.get(f, 0.0) for f in self.FEATURE_ORDER]])
        uri_pred = float(self._model.predict(X)[0])
        uri_pred = min(max(uri_pred, 0), 100)

        # Confidence from tree variance if available
        confidence = 0.82
        if hasattr(self._model, "estimators_"):
            tree_preds = np.array([t.predict(X)[0] for t in self._model.estimators_])
            std = np.std(tree_preds)
            confidence = round(max(0.5, 1.0 - (std / 50)), 3)

        return MLPrediction(
            uri_score=round(uri_pred, 2),
            confidence=confidence,
            model_id=self.model_id,
            model_version=self.model_version,
            features_used=self.FEATURE_ORDER,
        )


# ─────────────────────────────────────────────
# ENSEMBLE ORCHESTRATOR
# ─────────────────────────────────────────────

class EnsembleOrchestrator:
    """
    Combines classical HFER-720 and ML predictions.
    
    URI_final = α × URI_classical + β × URI_ml
    
    Weights α/β shift as more training data accumulates.
    """

    def __init__(
        self,
        classical_weight: float = 0.4,
        ml_weight: float = 0.6,
        model_path: Optional[str] = None,
    ):
        self.classical_weight = classical_weight
        self.ml_weight = ml_weight

        # Load ML model with fallback chain
        self._ml_model: BaseMLModel
        sklearn_model = SklearnRiskModel(model_path or "./models/risk_rf.joblib")
        if sklearn_model.is_available():
            self._ml_model = sklearn_model
            logger.info("Ensemble using SklearnRiskModel")
        else:
            self._ml_model = RuleBasedModel()
            logger.info("Ensemble using RuleBasedModel (fallback)")

    def combine(
        self,
        classical_result: HFER720Result,
        sector: str,
        hazard_inputs: list[HazardScoreInput],
        fragility: FragilityInput,
        exposure: ExposureInput,
        response: ResponseCapacityInput,
    ) -> tuple[float, float, str]:
        """
        Returns: (uri_score, confidence, model_version)
        """
        # Build features for ML
        base_model = BaseMLModel.__subclasses__()[0]()  # just for build_features
        features = self._ml_model.build_features(
            sector=sector,
            hazard_inputs=hazard_inputs,
            fragility=fragility,
            exposure=exposure,
            response=response,
            classical_result=classical_result,
        )

        ml_pred = self._ml_model.predict(features)

        # Ensemble
        uri_final = (
            self.classical_weight * classical_result.uri_score +
            self.ml_weight * ml_pred.uri_score
        )

        # Weighted confidence
        confidence = (
            self.classical_weight * classical_result.confidence +
            self.ml_weight * ml_pred.confidence
        )

        model_version = f"classical={self.classical_weight}/ml={self.ml_weight}/{ml_pred.model_id}"

        logger.debug(
            f"Ensemble: classical={classical_result.uri_score:.1f} "
            f"ml={ml_pred.uri_score:.1f} final={uri_final:.1f}"
        )

        return round(uri_final, 2), round(confidence, 3), model_version
