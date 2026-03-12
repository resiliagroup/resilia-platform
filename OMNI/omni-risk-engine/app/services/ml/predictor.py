"""
ML Predictor Layer
==================
Abstraction over ML models. Currently ships with a feature-engineered
fallback predictor. Swap in PyTorch/XGBoost models without changing the interface.
"""

from typing import Optional, Protocol
import numpy as np

class MLModel(Protocol):
    def predict(self, features: np.ndarray) -> float: ...

class FeatureEngineer:
    """Maps facility + request to a flat feature vector."""

    FEATURE_NAMES = [
        # Facility static
        "building_age", "floor_count", "employee_count", "operates_24h",
        "seismic_zone", "soil_class_encoded",
        # Hazard
        "h_seismic", "h_flood", "h_cyber", "h_supply", "h_wildfire",
        # Fragility
        "f_structural", "f_operational", "f_human", "f_digital",
        # Exposure
        "e_population_norm", "e_assets_norm", "e_dependency_count",
        # Response
        "r_plan_exists", "r_plan_tested", "r_iso_certified",
        "r_backup_power_h", "r_drill_freq", "r_cert_pct",
    ]

    SOIL_CLASS_MAP = {"ZA": 0, "ZB": 1, "ZC": 2, "ZD": 3, "ZE": 4}

    def build(self, facility, request) -> np.ndarray:
        fac = facility
        h = request.hazard
        fr = request.fragility
        ex = request.exposure
        r = request.response

        features = np.array([
            # Facility
            fac.building_age or 20,
            fac.floor_count or 3,
            fac.employee_count or 50,
            float(fac.operates_24h),
            fac.seismic_zone or 3,
            self.SOIL_CLASS_MAP.get(fac.soil_class or "ZC", 2),
            # Hazard
            h.seismic, h.flood, h.cyber, h.supply_chain, h.wildfire,
            # Fragility
            fr.building_age_score, fr.construction_quality,
            fr.staff_training_score, fr.cyber_hygiene,
            # Exposure
            min(1.0, (ex.population_at_risk or 0) / 10000),
            min(1.0, (ex.asset_value_usd or 0) / 1e8),
            ex.dependency_count,
            # Response
            float(r.bcm_plan_exists), float(r.plan_tested_last_12m),
            float(r.iso_22301_certified), r.backup_power_hours / 72,
            r.drill_frequency_per_year / 4, r.staff_certification_pct,
        ], dtype=np.float32)

        return features

class FallbackPredictor:
    """
    Rule-based predictor simulating what a trained model would output.
    Returns URI estimate based on weighted feature heuristics.
    Replaced by trained XGBoost/PyTorch model in production.
    """

    def predict(self, features: np.ndarray) -> float:
        # Simple linear approximation of classical HFER (fallback)
        # features indices: [0]=age, [6..10]=hazard, [11..14]=fragility, [20..22]=response_bool
        h_mean = np.mean(features[6:11])
        f_mean = np.mean(features[11:15])
        r_bool_score = np.sum(features[20:23]) / 3.0 * 100

        raw_risk = 0.4 * h_mean + 0.35 * f_mean - 0.25 * r_bool_score
        uri = 100.0 - raw_risk
        return float(np.clip(uri, 0, 100))

class MLPredictor:
    """
    Manages the ML model lifecycle.
    Load a trained model from disk/MLflow; fallback gracefully.
    """

    def __init__(self):
        self._model: Optional[MLModel] = None
        self._feature_engineer = FeatureEngineer()
        self._fallback = FallbackPredictor()
        self._model_version = "fallback-1.0"
        self._try_load_model()

    def _try_load_model(self):
        """Attempt to load a serialized model. Fail silently → use fallback."""
        try:
            import joblib, os
            model_path = os.environ.get("OMNI_MODEL_PATH", "models/hfer_xgb_v1.pkl")
            if os.path.exists(model_path):
                self._model = joblib.load(model_path)
                self._model_version = "xgb-1.0"
        except Exception:
            pass

    def build_features(self, facility, request) -> np.ndarray:
        return self._feature_engineer.build(facility, request)

    def predict_uri(self, features: np.ndarray) -> float:
        if self._model is not None:
            return float(self._model.predict(features.reshape(1, -1))[0])
        return self._fallback.predict(features)

    @property
    def model_version(self) -> str:
        return self._model_version

ml_predictor = MLPredictor()
