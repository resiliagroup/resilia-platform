// ─── Risk Classification ───────────────────────────────────────────────────

export type RiskClass = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'RESILIENT' | 'EXEMPLARY';

export const RISK_COLORS: Record<RiskClass, string> = {
  CRITICAL:  '#EF4444',
  HIGH:      '#F97316',
  MEDIUM:    '#EAB308',
  RESILIENT: '#22C55E',
  EXEMPLARY: '#6ABFB8',
};

export const RISK_ORDER: RiskClass[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'RESILIENT', 'EXEMPLARY'];

// ─── Facility ──────────────────────────────────────────────────────────────

export interface FacilityLocation {
  lat: number;
  lng: number;
  il_adi: string;
}

export interface FacilityRiskSummary {
  id: string;
  code: string;
  name: string;
  sector: string;
  uri_score: number;
  risk_class: RiskClass;
  h_score: number;
  f_score: number;
  e_score: number;
  r_score: number;
  assessed_at: string;
  location: FacilityLocation;
  open_recommendations: number;
}

// ─── HFER-720 Assessment ───────────────────────────────────────────────────

export interface HazardBreakdown {
  hazard_type: string;
  score: number;
  probability: number;
  intensity: number;
  data_source: string;
}

export interface RadarData {
  hazard: number;
  fragility: number;
  exposure: number;
  response: number;
}

export interface Recommendation {
  priority: number;
  category: string;
  title: string;
  description: string;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  deadline_days: number;
  standard_ref: string;
  score_impact: number;
}

export interface RiskAssessment {
  assessment_id: string;
  facility_id: string;
  facility_name: string;
  sector: string;
  assessed_at: string;
  uri_score: number;
  risk_class: RiskClass;
  confidence: number;
  h_score: number;
  f_score: number;
  e_score: number;
  r_score: number;
  hazard_breakdown: HazardBreakdown[];
  radar: RadarData;
  recommendations: Recommendation[];
  valid_until: string;
  next_review_days: number;
  model_version: string;
}

// ─── Portfolio ─────────────────────────────────────────────────────────────

export interface PortfolioStats {
  total_facilities: number;
  assessed_count: number;
  avg_uri_score: number;
  by_risk_class: Record<RiskClass, number>;
  by_sector: Record<string, number>;
  critical_facilities: FacilityRiskSummary[];
  facilities: FacilityRiskSummary[];
}

// ─── GIS Map ───────────────────────────────────────────────────────────────

export interface MapFacility {
  id: string;
  name: string;
  sector: string;
  uri_score: number;
  risk_class: RiskClass;
  // Normalized SVG coordinates (0-1)
  x: number;
  y: number;
  lat: number;
  lng: number;
}

// ─── API ───────────────────────────────────────────────────────────────────

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
