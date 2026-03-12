"""
OMNI Risk Intelligence Engine
Recommendation Engine

Generates prioritized, sector-aware recommendations
mapped to ISO standards.
"""
from __future__ import annotations
from dataclasses import dataclass

from app.core.constants import RiskClass, classify_risk, RECOMMENDATION_DEADLINES
from app.schemas.risk import (
    FragilityInput, ResponseCapacityInput,
    ExposureInput, RecommendationOut,
)
from app.services.risk.hfer720 import HFER720Result


@dataclass
class RecommendationRule:
    condition: callable       # f(fragility, response, exposure, result) → bool
    category: str
    title: str
    description: str
    effort: str               # low / medium / high
    impact: str               # low / medium / high
    score_impact: float       # estimated URI improvement
    standard_ref: str


# ─────────────────────────────────────────────
# RECOMMENDATION RULES LIBRARY
# ─────────────────────────────────────────────

RULES: list[RecommendationRule] = [
    RecommendationRule(
        condition=lambda f, r, e, res: not r.has_bcm_plan,
        category="planning",
        title="Develop a Business Continuity Management Plan",
        description=(
            "No BCM plan detected. Develop a comprehensive plan covering "
            "crisis scenarios, recovery time objectives and communication protocols. "
            "This is the single highest-impact action to improve resilience."
        ),
        effort="high",
        impact="high",
        score_impact=12.0,
        standard_ref="ISO 22301 §8.3",
    ),
    RecommendationRule(
        condition=lambda f, r, e, res: r.has_bcm_plan and (r.plan_last_tested_months or 999) > 12,
        category="planning",
        title="Conduct an Annual BCM Plan Exercise",
        description=(
            "The BCM plan has not been tested in the past 12 months. "
            "Schedule a tabletop exercise or full simulation to validate "
            "plan effectiveness and identify gaps."
        ),
        effort="medium",
        impact="high",
        score_impact=8.0,
        standard_ref="ISO 22301 §8.5",
    ),
    RecommendationRule(
        condition=lambda f, r, e, res: not r.iso_22301_certified,
        category="certification",
        title="Pursue ISO 22301 Certification",
        description=(
            "ISO 22301 certification provides external validation of your BCM "
            "programme and is increasingly required by regulators and large clients. "
            "Begin with a gap analysis against the standard."
        ),
        effort="high",
        impact="high",
        score_impact=7.0,
        standard_ref="ISO 22301",
    ),
    RecommendationRule(
        condition=lambda f, r, e, res: not f.has_backup_power,
        category="infrastructure",
        title="Install Emergency Backup Power System",
        description=(
            "No backup power source detected. A UPS and/or generator ensures "
            "continuity of critical systems during grid outages — the most "
            "common trigger for business disruption."
        ),
        effort="medium",
        impact="high",
        score_impact=9.0,
        standard_ref="ISO 22301 §8.4.2",
    ),
    RecommendationRule(
        condition=lambda f, r, e, res: not f.has_redundant_systems,
        category="infrastructure",
        title="Eliminate Single Points of Failure",
        description=(
            "Critical systems lack redundancy. Identify and remediate single "
            "points of failure in IT, communications and utility supply. "
            "Prioritise by business impact."
        ),
        effort="high",
        impact="high",
        score_impact=8.0,
        standard_ref="ISO 22301 §8.4.4",
    ),
    RecommendationRule(
        condition=lambda f, r, e, res: f.single_points_of_failure >= 3,
        category="infrastructure",
        title="Urgent: Multiple Single Points of Failure Detected",
        description=(
            f"Three or more single points of failure increase cascade failure risk "
            "significantly. Conduct an immediate dependency audit and implement "
            "redundancy for the top 3 critical systems."
        ),
        effort="high",
        impact="high",
        score_impact=10.0,
        standard_ref="ISO 22301 §8.4.4",
    ),
    RecommendationRule(
        condition=lambda f, r, e, res: not f.has_offsite_backup,
        category="digital",
        title="Implement Offsite / Cloud Data Backup",
        description=(
            "No offsite backup detected. Implement automated daily backups to a "
            "geographically separate location. Follow the 3-2-1 rule: "
            "3 copies, 2 media types, 1 offsite."
        ),
        effort="low",
        impact="high",
        score_impact=7.0,
        standard_ref="ISO 22301 §8.4.3",
    ),
    RecommendationRule(
        condition=lambda f, r, e, res: f.cyber_hygiene_score < 40,
        category="digital",
        title="Improve Cybersecurity Hygiene",
        description=(
            "Cybersecurity score is critically low. Prioritise: patch management, "
            "multi-factor authentication, privileged access review, and staff "
            "phishing awareness training."
        ),
        effort="medium",
        impact="high",
        score_impact=8.0,
        standard_ref="ISO 27001 §A.12",
    ),
    RecommendationRule(
        condition=lambda f, r, e, res: f.bcm_trained_staff_pct < 30,
        category="training",
        title="Scale BCM Awareness Training",
        description=(
            "Less than 30% of staff have BCM training. Implement a mandatory "
            "annual BCM awareness programme. Aim for 80%+ coverage within "
            "12 months."
        ),
        effort="medium",
        impact="medium",
        score_impact=5.0,
        standard_ref="ISO 22301 §7.2",
    ),
    RecommendationRule(
        condition=lambda f, r, e, res: r.drill_frequency_annual < 1,
        category="training",
        title="Schedule Annual Crisis Simulation Drill",
        description=(
            "No crisis drills recorded this year. Conduct at least one annual "
            "exercise. Include scenario-based simulations for your top hazards."
        ),
        effort="low",
        impact="medium",
        score_impact=4.0,
        standard_ref="ISO 22301 §8.5",
    ),
    RecommendationRule(
        condition=lambda f, r, e, res: not f.has_crisis_team,
        category="governance",
        title="Establish a Crisis Management Team",
        description=(
            "No dedicated crisis management team detected. Form a cross-functional "
            "team with defined roles, escalation paths and 24/7 contact roster."
        ),
        effort="low",
        impact="high",
        score_impact=6.0,
        standard_ref="ISO 22320 §5.3",
    ),
    RecommendationRule(
        condition=lambda f, r, e, res: r.mutual_aid_agreements < 1,
        category="network",
        title="Establish Mutual Aid Agreements",
        description=(
            "No mutual aid agreements in place. Negotiate agreements with "
            "peer organisations or sector bodies to share resources during crises. "
            "Critical for extended incidents."
        ),
        effort="medium",
        impact="medium",
        score_impact=4.0,
        standard_ref="ISO 22316 §9.4",
    ),
    RecommendationRule(
        condition=lambda f, r, e, res: not r.backup_site_available,
        category="infrastructure",
        title="Establish an Alternate Operating Location",
        description=(
            "No backup site available. Identify and contractually secure an "
            "alternate work site capable of supporting critical functions. "
            "Cloud-based solutions may provide a cost-effective option."
        ),
        effort="high",
        impact="high",
        score_impact=9.0,
        standard_ref="ISO 22301 §8.4.2",
    ),
    RecommendationRule(
        condition=lambda f, r, e, res: r.emergency_supplies_days < 3,
        category="resources",
        title="Build Emergency Supply Stockpile (72-hour minimum)",
        description=(
            "Emergency supply capacity is below 72 hours. Maintain minimum 3-day "
            "stocks of critical consumables. For healthcare and critical "
            "infrastructure, target 7-day capacity."
        ),
        effort="low",
        impact="medium",
        score_impact=4.0,
        standard_ref="ISO 22301 §8.4.2",
    ),
]


# ─────────────────────────────────────────────
# RECOMMENDATION ENGINE
# ─────────────────────────────────────────────

class RecommendationEngine:

    def generate(
        self,
        result: HFER720Result,
        fragility: FragilityInput,
        response: ResponseCapacityInput,
        exposure: ExposureInput,
        sector: str,
        max_recommendations: int = 5,
    ) -> list[RecommendationOut]:

        risk_class = classify_risk(result.uri_score)
        deadline_days = RECOMMENDATION_DEADLINES.get(risk_class, 180)

        triggered: list[tuple[RecommendationRule, float]] = []

        for rule in RULES:
            try:
                if rule.condition(fragility, response, exposure, result):
                    # Priority score: impact × urgency × risk_multiplier
                    priority_score = self._compute_priority_score(
                        rule, risk_class, result.uri_score
                    )
                    triggered.append((rule, priority_score))
            except Exception:
                continue

        # Sort by priority score descending
        triggered.sort(key=lambda x: x[1], reverse=True)

        recommendations: list[RecommendationOut] = []
        for rank, (rule, _) in enumerate(triggered[:max_recommendations], start=1):
            recommendations.append(RecommendationOut(
                priority=rank,
                category=rule.category,
                title=rule.title,
                description=rule.description,
                effort=rule.effort,
                impact=rule.impact,
                deadline_days=deadline_days,
                standard_ref=rule.standard_ref,
                score_impact=rule.score_impact,
            ))

        return recommendations

    def _compute_priority_score(
        self,
        rule: RecommendationRule,
        risk_class: RiskClass,
        uri_score: float,
    ) -> float:
        # Base: estimated score improvement
        base = rule.score_impact

        # Risk class multiplier (CRITICAL facilities get boost)
        class_multipliers = {
            RiskClass.CRITICAL:  2.0,
            RiskClass.HIGH:      1.5,
            RiskClass.MEDIUM:    1.0,
            RiskClass.RESILIENT: 0.7,
            RiskClass.EXEMPLARY: 0.5,
        }
        multiplier = class_multipliers.get(risk_class, 1.0)

        # Effort penalty (prefer low effort for same impact)
        effort_penalty = {"low": 0, "medium": 0.5, "high": 1.5}
        penalty = effort_penalty.get(rule.effort, 0)

        # Impact bonus
        impact_bonus = {"high": 2.0, "medium": 1.0, "low": 0}
        bonus = impact_bonus.get(rule.impact, 0)

        return (base * multiplier + bonus) - penalty
