from enum import Enum

class SectorType(str, Enum):
    MUNICIPALITY   = "municipality"
    HOSPITAL       = "hospital"
    BANK           = "bank"
    UNIVERSITY     = "university"
    INDUSTRIAL     = "industrial"
    INFRASTRUCTURE = "infrastructure"
    HOTEL          = "hotel"
    EDUCATION      = "education"

class HazardType(str, Enum):
    SEISMIC       = "seismic"
    FLOOD         = "flood"
    WILDFIRE      = "wildfire"
    CYBER         = "cyber"
    SUPPLY_CHAIN  = "supply_chain"
    PANDEMIC      = "pandemic"
    WIND          = "wind"
    LANDSLIDE     = "landslide"

class RiskClass(str, Enum):
    CRITICAL   = "CRITICAL"    # 0-39
    HIGH       = "HIGH"        # 40-59
    MEDIUM     = "MEDIUM"      # 60-74
    RESILIENT  = "RESILIENT"   # 75-89
    EXEMPLARY  = "EXEMPLARY"   # 90-100

class AssessmentType(str, Enum):
    FORM     = "form"
    AI       = "ai"
    HYBRID   = "hybrid"

class RecommendationStatus(str, Enum):
    OPEN        = "open"
    IN_PROGRESS = "in_progress"
    COMPLETED   = "completed"
    DEFERRED    = "deferred"

# HFER-720 Sector Weights
# (wH, wF, wE, wR) — must sum to 1.0
SECTOR_WEIGHTS: dict[SectorType, dict[str, float]] = {
    SectorType.HOSPITAL: {
        "hazard": 0.20, "fragility": 0.25,
        "exposure": 0.30, "response": 0.25
    },
    SectorType.BANK: {
        "hazard": 0.15, "fragility": 0.30,
        "exposure": 0.25, "response": 0.30
    },
    SectorType.MUNICIPALITY: {
        "hazard": 0.30, "fragility": 0.20,
        "exposure": 0.25, "response": 0.25
    },
    SectorType.UNIVERSITY: {
        "hazard": 0.25, "fragility": 0.20,
        "exposure": 0.30, "response": 0.25
    },
    SectorType.INDUSTRIAL: {
        "hazard": 0.35, "fragility": 0.25,
        "exposure": 0.20, "response": 0.20
    },
    SectorType.INFRASTRUCTURE: {
        "hazard": 0.30, "fragility": 0.25,
        "exposure": 0.25, "response": 0.20
    },
    SectorType.HOTEL: {
        "hazard": 0.25, "fragility": 0.20,
        "exposure": 0.30, "response": 0.25
    },
    SectorType.EDUCATION: {
        "hazard": 0.25, "fragility": 0.20,
        "exposure": 0.30, "response": 0.25
    },
}

# Hazard type weights within H dimension
HAZARD_WEIGHTS: dict[HazardType, float] = {
    HazardType.SEISMIC:      0.25,
    HazardType.FLOOD:        0.20,
    HazardType.CYBER:        0.20,
    HazardType.SUPPLY_CHAIN: 0.15,
    HazardType.WILDFIRE:     0.10,
    HazardType.PANDEMIC:     0.10,
}

# Days to resolve by risk class
URGENCY_DEADLINES: dict[RiskClass, int] = {
    RiskClass.CRITICAL:  30,
    RiskClass.HIGH:      90,
    RiskClass.MEDIUM:   180,
    RiskClass.RESILIENT: 365,
    RiskClass.EXEMPLARY: 730,
}

# Recommendation categories
REC_CATEGORIES = {
    "structural":   "Structural & Physical",
    "operational":  "Operational Continuity",
    "training":     "Training & Awareness",
    "digital":      "Digital & Cyber",
    "governance":   "Governance & Plans",
    "supply":       "Supply Chain",
}


def classify_risk(uri_score: float) -> RiskClass:
    """Map a URI score (0-100) to its RiskClass."""
    if uri_score < 40:  return RiskClass.CRITICAL
    if uri_score < 60:  return RiskClass.HIGH
    if uri_score < 75:  return RiskClass.MEDIUM
    if uri_score < 90:  return RiskClass.RESILIENT
    return RiskClass.EXEMPLARY
