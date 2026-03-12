import type {
  PortfolioStats, FacilityRiskSummary, RiskAssessment,
  MapFacility, RiskClass
} from '../types';

// ─── Config ────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env?.VITE_API_URL ?? 'http://localhost:8000/api/v1';

// Turkey bounding box → normalized SVG coords
// lng: 26°E – 45°E  lat: 36°N – 42°N
function geoToSvg(lat: number, lng: number): { x: number; y: number } {
  const x = (lng - 26) / (45 - 26);
  const y = 1 - (lat - 36) / (42 - 36);
  return { x: Math.max(0.01, Math.min(0.99, x)), y: Math.max(0.01, Math.min(0.99, y)) };
}

// ─── Mock data (swapped for real API calls in production) ──────────────────

const MOCK_FACILITIES: FacilityRiskSummary[] = [
  { id:'f001', code:'AKB-0214', name:'Şişli Branch 0214',       sector:'Banking',      uri_score:28, risk_class:'CRITICAL',  h_score:82, f_score:75, e_score:68, r_score:22, assessed_at:'2026-03-10T09:14:00Z', location:{lat:41.06, lng:28.99, il_adi:'İstanbul'}, open_recommendations:8 },
  { id:'f002', code:'AKB-0137', name:'Kadıköy Branch 0137',     sector:'Banking',      uri_score:31, risk_class:'CRITICAL',  h_score:79, f_score:70, e_score:72, r_score:28, assessed_at:'2026-03-10T10:02:00Z', location:{lat:40.99, lng:29.03, il_adi:'İstanbul'}, open_recommendations:7 },
  { id:'f003', code:'MPH-KOC',  name:'Kocaeli Medical Park',    sector:'Healthcare',   uri_score:34, risk_class:'CRITICAL',  h_score:88, f_score:65, e_score:82, r_score:30, assessed_at:'2026-03-09T14:30:00Z', location:{lat:40.77, lng:29.92, il_adi:'Kocaeli'},   open_recommendations:9 },
  { id:'f004', code:'OSB-GBZ7', name:'Gebze OSB Tesis 7',       sector:'Industrial',   uri_score:37, risk_class:'CRITICAL',  h_score:91, f_score:60, e_score:55, r_score:35, assessed_at:'2026-03-08T11:00:00Z', location:{lat:40.79, lng:29.44, il_adi:'Kocaeli'},   open_recommendations:6 },
  { id:'f005', code:'AKB-0312', name:'Ankara Çankaya Branch',   sector:'Banking',      uri_score:42, risk_class:'HIGH',      h_score:70, f_score:60, e_score:58, r_score:42, assessed_at:'2026-03-11T08:45:00Z', location:{lat:39.92, lng:32.85, il_adi:'Ankara'},    open_recommendations:5 },
  { id:'f006', code:'AKB-UMR',  name:'Ümraniye Branch',         sector:'Banking',      uri_score:45, risk_class:'HIGH',      h_score:65, f_score:55, e_score:62, r_score:48, assessed_at:'2026-03-10T15:20:00Z', location:{lat:41.02, lng:29.12, il_adi:'İstanbul'}, open_recommendations:4 },
  { id:'f007', code:'MPH-IST',  name:'Medical Park İstanbul',   sector:'Healthcare',   uri_score:48, risk_class:'HIGH',      h_score:60, f_score:58, e_score:70, r_score:52, assessed_at:'2026-03-09T16:00:00Z', location:{lat:41.08, lng:28.87, il_adi:'İstanbul'}, open_recommendations:5 },
  { id:'f008', code:'BBL-BYK',  name:'Beykoz Belediyesi',       sector:'Municipality', uri_score:51, risk_class:'HIGH',      h_score:68, f_score:50, e_score:55, r_score:55, assessed_at:'2026-03-07T12:00:00Z', location:{lat:41.13, lng:29.11, il_adi:'İstanbul'}, open_recommendations:6 },
  { id:'f009', code:'RXS-ANT',  name:'Rixos Antalya',           sector:'Hospitality',  uri_score:62, risk_class:'MEDIUM',    h_score:55, f_score:45, e_score:60, r_score:60, assessed_at:'2026-03-06T10:00:00Z', location:{lat:36.89, lng:30.71, il_adi:'Antalya'},   open_recommendations:3 },
  { id:'f010', code:'ISO-IST',  name:'İSO Merkez',              sector:'Chamber',      uri_score:68, risk_class:'MEDIUM',    h_score:50, f_score:42, e_score:52, r_score:65, assessed_at:'2026-03-05T09:00:00Z', location:{lat:41.04, lng:28.96, il_adi:'İstanbul'}, open_recommendations:2 },
  { id:'f011', code:'AKB-BRS',  name:'Bursa İnegöl Branch',     sector:'Banking',      uri_score:71, risk_class:'MEDIUM',    h_score:48, f_score:40, e_score:50, r_score:68, assessed_at:'2026-03-04T14:00:00Z', location:{lat:40.07, lng:29.51, il_adi:'Bursa'},     open_recommendations:2 },
  { id:'f012', code:'MPH-BRS',  name:'Medical Park Bursa',      sector:'Healthcare',   uri_score:74, risk_class:'MEDIUM',    h_score:45, f_score:38, e_score:48, r_score:72, assessed_at:'2026-03-03T10:00:00Z', location:{lat:40.19, lng:29.06, il_adi:'Bursa'},     open_recommendations:2 },
  { id:'f013', code:'AKB-KYS',  name:'Kayseri Branch',          sector:'Banking',      uri_score:77, risk_class:'RESILIENT', h_score:40, f_score:35, e_score:45, r_score:78, assessed_at:'2026-03-02T11:00:00Z', location:{lat:38.73, lng:35.49, il_adi:'Kayseri'},   open_recommendations:1 },
  { id:'f014', code:'AKB-GZT',  name:'Gaziantep Branch',        sector:'Banking',      uri_score:79, risk_class:'RESILIENT', h_score:38, f_score:33, e_score:43, r_score:80, assessed_at:'2026-03-01T09:00:00Z', location:{lat:37.07, lng:37.38, il_adi:'Gaziantep'}, open_recommendations:1 },
  { id:'f015', code:'MPH-ADN',  name:'Medical Park Adana',      sector:'Healthcare',   uri_score:82, risk_class:'RESILIENT', h_score:35, f_score:30, e_score:40, r_score:84, assessed_at:'2026-02-28T10:00:00Z', location:{lat:37.00, lng:35.32, il_adi:'Adana'},     open_recommendations:0 },
];

const MOCK_PORTFOLIO: PortfolioStats = {
  total_facilities: 673,
  assessed_count: 601,
  avg_uri_score: 61.4,
  by_risk_class: { CRITICAL: 14, HIGH: 89, MEDIUM: 234, RESILIENT: 298, EXEMPLARY: 38 } as Record<RiskClass, number>,
  by_sector: {
    Banking:      58.2,
    Healthcare:   63.7,
    Municipality: 52.1,
    Industrial:   67.4,
    Education:    71.2,
    Hospitality:  69.8,
    Chamber:      74.3,
    Retail:       61.9,
  },
  critical_facilities: MOCK_FACILITIES.filter(f => f.risk_class === 'CRITICAL'),
  facilities: MOCK_FACILITIES,
};

const MOCK_ASSESSMENT: RiskAssessment = {
  assessment_id: 'asmnt-001',
  facility_id: 'f001',
  facility_name: 'Şişli Branch 0214',
  sector: 'Banking',
  assessed_at: '2026-03-10T09:14:00Z',
  uri_score: 28,
  risk_class: 'CRITICAL',
  confidence: 0.91,
  h_score: 82,
  f_score: 75,
  e_score: 68,
  r_score: 22,
  hazard_breakdown: [
    { hazard_type: 'seismic',       score: 76, probability: 0.85, intensity: 90, data_source: 'KOERI+AFAD' },
    { hazard_type: 'flood',         score: 32, probability: 0.35, intensity: 90, data_source: 'MGM+DSİ'   },
    { hazard_type: 'cyber',         score: 68, probability: 0.72, intensity: 95, data_source: 'USOM'       },
    { hazard_type: 'supply_chain',  score: 44, probability: 0.50, intensity: 88, data_source: 'Survey'     },
    { hazard_type: 'pandemic',      score: 28, probability: 0.30, intensity: 93, data_source: 'WHO'        },
    { hazard_type: 'wildfire',      score: 12, probability: 0.12, intensity: 98, data_source: 'OGM'        },
  ],
  radar: { hazard: 82, fragility: 75, exposure: 68, response: 22 },
  recommendations: [
    { priority:1, category:'INFRASTRUCTURE', title:'Install Emergency Backup Power',           description:'No backup power source. Install UPS + generator to ensure continuity during grid outages.', effort:'medium', impact:'high', deadline_days:30,  standard_ref:'ISO 22301 §8.4.2', score_impact:9  },
    { priority:2, category:'PLANNING',       title:'Develop BCM Plan — No Plan Detected',      description:'No business continuity plan exists. This is the single highest-impact action.',              effort:'high',   impact:'high', deadline_days:30,  standard_ref:'ISO 22301 §8.3',   score_impact:12 },
    { priority:3, category:'DIGITAL',        title:'Implement Offsite Data Backup',             description:'No offsite backup. Follow 3-2-1 rule: 3 copies, 2 media types, 1 offsite.',                 effort:'low',    impact:'high', deadline_days:30,  standard_ref:'ISO 22301 §8.4.3', score_impact:7  },
    { priority:4, category:'TRAINING',       title:'Scale BCM Staff Training',                  description:'Only 8% of staff BCM trained. Target 80%+ coverage within 12 months.',                     effort:'medium', impact:'medium',deadline_days:90,  standard_ref:'ISO 22301 §7.2',   score_impact:5  },
    { priority:5, category:'GOVERNANCE',     title:'Establish Crisis Management Team',          description:'No dedicated crisis team. Form cross-functional team with defined roles + 24/7 roster.',    effort:'low',    impact:'high', deadline_days:30,  standard_ref:'ISO 22320 §5.3',   score_impact:6  },
  ],
  valid_until: '2026-04-10T09:14:00Z',
  next_review_days: 30,
  model_version: 'classical=0.4/ml=0.6/rule_based',
};

// ─── API Client ────────────────────────────────────────────────────────────

class OmniApiClient {
  private token: string | null = null;

  setToken(token: string) { this.token = token; }

  private headers() {
    return {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
    };
  }

  async getPortfolio(): Promise<PortfolioStats> {
    try {
      const res = await fetch(`${API_BASE}/assess/portfolio`, { headers: this.headers() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    } catch {
      // Fall back to mock data in development
      return new Promise(resolve => setTimeout(() => resolve(MOCK_PORTFOLIO), 400));
    }
  }

  async getAssessment(facilityId: string): Promise<RiskAssessment> {
    try {
      const res = await fetch(`${API_BASE}/assess/assessments/${facilityId}`, { headers: this.headers() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    } catch {
      return new Promise(resolve => setTimeout(() => resolve({
        ...MOCK_ASSESSMENT,
        facility_id: facilityId,
        facility_name: MOCK_FACILITIES.find(f => f.id === facilityId)?.name ?? MOCK_ASSESSMENT.facility_name,
        uri_score: MOCK_FACILITIES.find(f => f.id === facilityId)?.uri_score ?? 28,
        risk_class: MOCK_FACILITIES.find(f => f.id === facilityId)?.risk_class ?? 'CRITICAL',
        h_score: MOCK_FACILITIES.find(f => f.id === facilityId)?.h_score ?? 82,
        f_score: MOCK_FACILITIES.find(f => f.id === facilityId)?.f_score ?? 75,
        e_score: MOCK_FACILITIES.find(f => f.id === facilityId)?.e_score ?? 68,
        r_score: MOCK_FACILITIES.find(f => f.id === facilityId)?.r_score ?? 22,
        radar: {
          hazard:    MOCK_FACILITIES.find(f => f.id === facilityId)?.h_score ?? 82,
          fragility: MOCK_FACILITIES.find(f => f.id === facilityId)?.f_score ?? 75,
          exposure:  MOCK_FACILITIES.find(f => f.id === facilityId)?.e_score ?? 68,
          response:  MOCK_FACILITIES.find(f => f.id === facilityId)?.r_score ?? 22,
        },
      }), 300));
    }
  }
}

export const apiClient = new OmniApiClient();

// ─── Geo helpers ───────────────────────────────────────────────────────────

export function facilitiesToMapPoints(facilities: FacilityRiskSummary[]): MapFacility[] {
  return facilities.map(f => {
    const { x, y } = geoToSvg(f.location.lat, f.location.lng);
    return {
      id: f.id,
      name: f.name,
      sector: f.sector,
      uri_score: f.uri_score,
      risk_class: f.risk_class,
      x, y,
      lat: f.location.lat,
      lng: f.location.lng,
    };
  });
}
