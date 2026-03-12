"""
Recommendation Engine
=====================
Generates prioritized, actionable recommendations from HFER-720 results.
Maps score gaps to ISO 22301 / ISO 31000 references.
"""

from dataclasses import dataclass
from app.services.risk.hfer_model import HFER720Result, DimensionScores
from app.core.constants import RiskClass, URGENCY_DEADLINES

@dataclass
class Recommendation:
    priority: int
    category: str
    title: str
    description: str
    effort: str           # low / medium / high
    impact_delta: float   # expected URI improvement if resolved
    deadline_days: int
    standard_ref: str

RECOMMENDATION_LIBRARY = [
    # Structural
    {
        "id": "structural_seismic_retrofit",
        "category": "structural",
        "title": "Seismic Retrofitting Assessment",
        "description": (
            "Commission a structural engineering assessment for seismic compliance "
            "per TBDY-2018. Facilities built before 1999 are at elevated risk. "
            "Prioritize base isolation or shear wall reinforcement where required."
        ),
        "trigger": lambda d: d.f_structural > 60 or d.h_seismic > 65,
        "effort": "high",
        "impact_delta": 8.0,
        "standard_ref": "ISO 22301:2019 §8.3 / TBDY-2018",
    },
    {
        "id": "structural_maintenance",
        "category": "structural",
        "title": "Preventive Maintenance Program",
        "description": (
            "Establish a quarterly preventive maintenance schedule covering "
            "critical systems: HVAC, electrical panels, generator, water supply. "
            "Assign a facility manager with KPIs."
        ),
        "trigger": lambda d: d.f_structural > 50,
        "effort": "medium",
        "impact_delta": 4.0,
        "standard_ref": "ISO 22301:2019 §8.4",
    },
    # Operational
    {
        "id": "ops_redundancy",
        "category": "operational",
        "title": "Eliminate Single Points of Failure",
        "description": (
            "Map all critical operational dependencies and implement N+1 redundancy "
            "for power, internet, and key supplier relationships. "
            "Document failover procedures for each critical system."
        ),
        "trigger": lambda d: d.f_operational > 60,
        "effort": "high",
        "impact_delta": 7.0,
        "standard_ref": "ISO 22301:2019 §8.6 / ISO 31000:2018 §6.5",
    },
    # BCM Plans
    {
        "id": "plans_create",
        "category": "governance",
        "title": "Develop Business Continuity Plan",
        "description": (
            "Create a formal BCP covering all critical functions. Include RTO/RPO targets, "
            "escalation procedures, communication trees, and alternate site arrangements. "
            "Target ISO 22301 certification within 18 months."
        ),
        "trigger": lambda d: d.r_plans < 25,
        "effort": "high",
        "impact_delta": 12.0,
        "standard_ref": "ISO 22301:2019 §8.4 / §8.5",
    },
    {
        "id": "plans_test",
        "category": "governance",
        "title": "Conduct BCP Tabletop Exercise",
        "description": (
            "Schedule and execute a tabletop exercise simulating your top 2 risk scenarios. "
            "Involve all department heads. Document gaps and update plan within 30 days. "
            "Target at least 2 exercises per year."
        ),
        "trigger": lambda d: d.r_plans < 50 and d.r_training < 60,
        "effort": "low",
        "impact_delta": 6.0,
        "standard_ref": "ISO 22301:2019 §9.1.3",
    },
    # Digital / Cyber
    {
        "id": "cyber_backup",
        "category": "digital",
        "title": "Implement 3-2-1 Backup Strategy",
        "description": (
            "Ensure 3 copies of critical data on 2 different media with 1 offsite. "
            "Automate backups and test restoration monthly. "
            "Encrypt backups at rest and in transit."
        ),
        "trigger": lambda d: d.f_digital > 50 or d.h_cyber > 50,
        "effort": "medium",
        "impact_delta": 5.0,
        "standard_ref": "ISO 27001:2022 §A.8.13 / NIST CSF PR.IP-4",
    },
    {
        "id": "cyber_assessment",
        "category": "digital",
        "title": "Cybersecurity Risk Assessment",
        "description": (
            "Commission a penetration test and vulnerability assessment. "
            "Prioritize patching of critical CVEs, implement MFA on all admin accounts, "
            "and deploy endpoint detection and response (EDR) tooling."
        ),
        "trigger": lambda d: d.h_cyber > 60 or d.f_digital > 65,
        "effort": "high",
        "impact_delta": 7.0,
        "standard_ref": "ISO 27001:2022 §8.8 / USOM guidelines",
    },
    # Training
    {
        "id": "training_crisis_team",
        "category": "training",
        "title": "Establish Crisis Management Team",
        "description": (
            "Designate and train a 5-8 person Crisis Management Team with clear roles: "
            "Crisis Manager, Communications Lead, Operations Lead, and IT Lead. "
            "Provide 2-day crisis management training and quarterly refreshers."
        ),
        "trigger": lambda d: d.r_training < 40,
        "effort": "medium",
        "impact_delta": 6.0,
        "standard_ref": "ISO 22320:2018 §5 / FEMA ICS",
    },
    # Supply chain
    {
        "id": "supply_diversification",
        "category": "supply",
        "title": "Supply Chain Diversification",
        "description": (
            "Identify your top 10 critical suppliers and ensure at least 2 qualified "
            "alternatives for each. Implement supplier risk scoring and annual audits. "
            "Target no single supplier >40% of critical supply category."
        ),
        "trigger": lambda d: d.h_supply > 55 or d.f_operational > 60,
        "effort": "high",
        "impact_delta": 5.0,
        "standard_ref": "ISO 22301:2019 §8.4.3 / ISO 28001",
    },
    # Response network
    {
        "id": "network_mutual_aid",
        "category": "governance",
        "title": "Mutual Aid Agreements",
        "description": (
            "Formalize mutual aid agreements with at least 3 peer organizations in your sector. "
            "Include resource sharing, temporary space, and staff support provisions. "
            "Register agreements with relevant government bodies (AFAD, BDDK, etc)."
        ),
        "trigger": lambda d: d.r_network < 30,
        "effort": "medium",
        "impact_delta": 4.0,
        "standard_ref": "ISO 22301:2019 §8.4 / AFAD Coordination Guidelines",
    },
]

def _priority_score(impact_delta: float, effort: str, risk_class: RiskClass) -> float:
    """Higher score = higher priority (should be listed first)."""
    effort_multiplier = {"low": 1.5, "medium": 1.0, "high": 0.7}
    class_multiplier = {
        RiskClass.CRITICAL:  2.0,
        RiskClass.HIGH:      1.5,
        RiskClass.MEDIUM:    1.0,
        RiskClass.RESILIENT: 0.7,
        RiskClass.EXEMPLARY: 0.5,
    }
    return impact_delta * effort_multiplier[effort] * class_multiplier[risk_class]

def generate_recommendations(
    result: HFER720Result,
    max_recommendations: int = 5,
) -> list[Recommendation]:
    """
    Generate prioritized recommendations from HFER-720 result.
    Filters to triggered recommendations, ranks by impact×effort×urgency.
    """
    d = result.dimension_scores
    triggered = [r for r in RECOMMENDATION_LIBRARY if r["trigger"](d)]

    # Score and sort
    scored = sorted(
        triggered,
        key=lambda r: _priority_score(
            r["impact_delta"], r["effort"], result.risk_class
        ),
        reverse=True,
    )

    recs = []
    for i, r in enumerate(scored[:max_recommendations]):
        recs.append(Recommendation(
            priority=i + 1,
            category=r["category"],
            title=r["title"],
            description=r["description"],
            effort=r["effort"],
            impact_delta=r["impact_delta"],
            deadline_days=URGENCY_DEADLINES[result.risk_class],
            standard_ref=r.get("standard_ref", ""),
        ))

    return recs
