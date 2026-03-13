/**
 * OMNI Risk Intelligence Engine — API Client
 * Railway backend: https://omniversel-risk-engine-production.up.railway.app
 * Supabase: tenants (Railway'de tenant router yok)
 */
import { useEffect, useState } from 'react'
import { supabase } from './supabase'

// ─────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────

const BASE_URL = 'https://omniversel-risk-engine-production.up.railway.app/api/v1'

// ─────────────────────────────────────────────────────────────
// TYPES — Railway API response shapes (FastAPI → snake_case JSON)
// ─────────────────────────────────────────────────────────────

export type OmniSector =
  | 'municipality'
  | 'hospital'
  | 'bank'
  | 'university'
  | 'industrial'
  | 'infrastructure'
  | 'hotel'
  | 'education'

export type RiskClass = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'RESILIENT' | 'EXEMPLARY'

// Supabase sector enum (büyük harf — DB'de bu şekilde kayıtlı)
export type SupabaseSector =
  | 'MUNICIPALITY'
  | 'HOSPITAL'
  | 'BANK'
  | 'UNIVERSITY'
  | 'INDUSTRIAL'
  | 'INFRASTRUCTURE'
  | 'HOTEL'
  | 'EDUCATION'

/** Tenant — Supabase'den gelir */
export interface OmniTenant {
  id: string
  name: string
  slug: string
  sector: SupabaseSector
  is_active: boolean
  settings: Record<string, unknown>
  created_at: string
  updated_at: string
}

/** Facility — Railway API'den gelir (FacilityOut) */
export interface OmniFacility {
  id: string
  code: string
  name: string
  sector: OmniSector
  building_age: number | null
  seismic_zone: number | null
  employee_count: number | null
  is_active: boolean
}

/** Facility oluşturma payload */
export interface FacilityCreatePayload {
  tenant_id: string
  code: string
  name: string
  sector: OmniSector
  latitude?: number
  longitude?: number
  il_kodu?: string
  building_age?: number
  construction_type?: string
  soil_class?: string
  seismic_zone?: number
  floor_count?: number
  employee_count?: number
  operates_24h?: boolean
  asset_value_usd?: number
}

/** HFER-720 boyut skorları */
export interface DimensionScores {
  h: number; f: number; e: number; r: number
  h_seismic: number; h_flood: number; h_cyber: number; h_supply: number
  f_structural: number; f_operational: number; f_human: number; f_digital: number
  e_population: number; e_assets: number; e_dependencies: number
  r_plans: number; r_resources: number; r_training: number; r_network: number
}

/** Risk önerisi */
export interface RiskRecommendation {
  priority: number
  category: string
  title: string
  description: string
  effort: 'low' | 'medium' | 'high'
  impact_delta: number
  deadline_days: number
  standard_ref: string
}

/** Assessment sonucu — Railway API (AssessmentResponse) */
export interface OmniAssessment {
  id: string
  facility_id: string
  sector: OmniSector
  uri_score: number
  risk_class: RiskClass
  confidence: number
  dimension_scores: DimensionScores
  radar_data: Record<string, number>
  recommendations: RiskRecommendation[]
  classical_score: number
  ml_score: number | null
  assessed_at: string
}

/** Tarihsel özet — RiskSummary */
export interface RiskSummary {
  facility_id: string
  facility_name: string
  uri_score: number
  risk_class: RiskClass
  h_score: number; f_score: number; e_score: number; r_score: number
  assessed_at: string
}

/** Portföy özeti — portfolio/summary */
export interface PortfolioSummary {
  total: number
  avg_uri: number | null
  min_uri: number | null
  max_uri: number | null
  by_class: Record<RiskClass, number>
  critical_count: number
}

/** Assessment oluşturma payload (tüm alanlar opsiyonel — default değerler Railway'de) */
export interface AssessmentCreatePayload {
  facility_id: string
  notes?: string
  hazard?: Partial<{
    seismic: number; flood: number; wildfire: number; cyber: number
    supply_chain: number; pandemic: number
    seismic_probability: number; flood_probability: number; cyber_probability: number
  }>
  fragility?: Partial<{
    building_age_score: number; construction_quality: number; seismic_compliance: number
    maintenance_score: number; single_point_of_failure: number; redundancy_score: number
    supply_dependency: number; staff_training_score: number; turnover_rate_score: number
    bcm_awareness: number; cyber_hygiene: number; backup_status: number; system_age_score: number
  }>
  exposure?: Partial<{
    population_at_risk: number; population_vulnerability: number
    asset_value_usd: number; asset_criticality: number
    critical_service_count: number; dependency_count: number
    dependency_criticality: number; serves_critical_population: boolean
  }>
  response?: Partial<{
    bcm_plan_exists: boolean; plan_tested_last_12m: boolean; iso_22301_certified: boolean
    plan_digitized: boolean; backup_power_hours: number; backup_systems_score: number
    emergency_stockpile_days: number; drill_frequency_per_year: number
    staff_certification_pct: number; crisis_team_exists: boolean
    mutual_aid_agreements: number; coordination_score: number
  }>
}

// ─────────────────────────────────────────────────────────────
// CORE FETCHER
// ─────────────────────────────────────────────────────────────

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function omni<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    let detail = res.statusText
    try {
      const body = await res.json()
      detail = body?.detail ?? detail
    } catch {}
    throw new ApiError(res.status, detail)
  }

  return res.json() as Promise<T>
}

// ─────────────────────────────────────────────────────────────
// RAW API FUNCTIONS
// ─────────────────────────────────────────────────────────────

/** Tenant için tüm facility'leri listele */
export const fetchFacilitiesByTenant = (tenantId: string) =>
  omni<OmniFacility[]>(`/facilities/tenant/${tenantId}`)

/** Tek facility getir */
export const fetchFacility = (facilityId: string) =>
  omni<OmniFacility>(`/facilities/${facilityId}`)

/** Yeni facility oluştur */
export const createFacility = (payload: FacilityCreatePayload) =>
  omni<OmniFacility>('/facilities/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

/** Facility'nin son assessmentını getir */
export const fetchLatestAssessment = (facilityId: string) =>
  omni<OmniAssessment>(`/assessments/facility/${facilityId}/latest`)

/** Assessment geçmişi */
export const fetchAssessmentHistory = (facilityId: string, limit = 12) =>
  omni<RiskSummary[]>(`/assessments/facility/${facilityId}/history?limit=${limit}`)

/** Belirli bir assessmentı getir */
export const fetchAssessment = (assessmentId: string) =>
  omni<OmniAssessment>(`/assessments/${assessmentId}`)

/** Yeni assessment çalıştır */
export const createAssessment = (payload: AssessmentCreatePayload) =>
  omni<OmniAssessment>('/assessments/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

/** Tenant portföy özeti */
export const fetchPortfolioSummary = (tenantId: string, sector?: OmniSector) => {
  const params = new URLSearchParams({ tenant_id: tenantId })
  if (sector) params.set('sector', sector)
  return omni<PortfolioSummary>(`/assessments/portfolio/summary?${params}`)
}

// ─────────────────────────────────────────────────────────────
// REACT HOOKS
// ─────────────────────────────────────────────────────────────

type HookState<T> = { data: T | null; loading: boolean; error: string | null }

function initState<T>(): HookState<T> {
  return { data: null, loading: true, error: null }
}

// ── Tenants (Supabase) ────────────────────────────────────────

/** Aktif tenant listesi — Supabase */
export function useOmniTenants() {
  const [state, setState] = useState<HookState<OmniTenant[]>>(initState)

  useEffect(() => {
    supabase
      .from('tenants')
      .select('*')
      .eq('is_active', true)
      .order('name')
      .then(({ data, error }) => {
        if (error) setState({ data: null, loading: false, error: error.message })
        else setState({ data: data as OmniTenant[], loading: false, error: null })
      })
  }, [])

  return state
}

/** Tek tenant — Supabase */
export function useOmniTenant(tenantId: string | null) {
  const [state, setState] = useState<HookState<OmniTenant>>(initState)

  useEffect(() => {
    if (!tenantId) {
      setState({ data: null, loading: false, error: null })
      return
    }
    supabase
      .from('tenants')
      .select('*')
      .eq('id', tenantId)
      .single()
      .then(({ data, error }) => {
        if (error) setState({ data: null, loading: false, error: error.message })
        else setState({ data: data as OmniTenant, loading: false, error: null })
      })
  }, [tenantId])

  return state
}

// ── Facilities (Railway API) ──────────────────────────────────

/** Tenant'a ait tüm facility'ler — Railway */
export function useOmniFacilities(tenantId: string | null) {
  const [state, setState] = useState<HookState<OmniFacility[]>>(initState)

  useEffect(() => {
    if (!tenantId) {
      setState({ data: null, loading: false, error: null })
      return
    }
    setState(initState)
    fetchFacilitiesByTenant(tenantId)
      .then(data => setState({ data, loading: false, error: null }))
      .catch((err: Error) => setState({ data: null, loading: false, error: err.message }))
  }, [tenantId])

  return state
}

/** Tek facility — Railway */
export function useOmniFacility(facilityId: string | null) {
  const [state, setState] = useState<HookState<OmniFacility>>(initState)

  useEffect(() => {
    if (!facilityId) {
      setState({ data: null, loading: false, error: null })
      return
    }
    setState(initState)
    fetchFacility(facilityId)
      .then(data => setState({ data, loading: false, error: null }))
      .catch((err: Error) => setState({ data: null, loading: false, error: err.message }))
  }, [facilityId])

  return state
}

// ── Assessments (Railway API) ─────────────────────────────────

/** Facility'nin son HFER-720 assessmentı — Railway */
export function useLatestAssessment(facilityId: string | null) {
  const [state, setState] = useState<HookState<OmniAssessment>>(initState)

  useEffect(() => {
    if (!facilityId) {
      setState({ data: null, loading: false, error: null })
      return
    }
    setState(initState)
    fetchLatestAssessment(facilityId)
      .then(data => setState({ data, loading: false, error: null }))
      .catch((err: Error) => setState({ data: null, loading: false, error: err.message }))
  }, [facilityId])

  return state
}

/** Facility assessment tarihçesi — Railway */
export function useAssessmentHistory(facilityId: string | null, limit = 12) {
  const [state, setState] = useState<HookState<RiskSummary[]>>(initState)

  useEffect(() => {
    if (!facilityId) {
      setState({ data: null, loading: false, error: null })
      return
    }
    setState(initState)
    fetchAssessmentHistory(facilityId, limit)
      .then(data => setState({ data, loading: false, error: null }))
      .catch((err: Error) => setState({ data: null, loading: false, error: err.message }))
  }, [facilityId, limit])

  return state
}

/** Tenant portföy özeti — Railway */
export function usePortfolioSummary(tenantId: string | null, sector?: OmniSector) {
  const [state, setState] = useState<HookState<PortfolioSummary>>(initState)

  useEffect(() => {
    if (!tenantId) {
      setState({ data: null, loading: false, error: null })
      return
    }
    setState(initState)
    fetchPortfolioSummary(tenantId, sector)
      .then(data => setState({ data, loading: false, error: null }))
      .catch((err: Error) => setState({ data: null, loading: false, error: err.message }))
  }, [tenantId, sector])

  return state
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

export const RISK_CLASS_TR: Record<RiskClass, string> = {
  CRITICAL:  'Kritik',
  HIGH:      'Yüksek',
  MEDIUM:    'Orta',
  RESILIENT: 'Dirençli',
  EXEMPLARY: 'Örnek',
}

export const RISK_CLASS_COLOR: Record<RiskClass, string> = {
  CRITICAL:  '#EF4444',
  HIGH:      '#F97316',
  MEDIUM:    '#F59E0B',
  RESILIENT: '#22C55E',
  EXEMPLARY: '#6366F1',
}

export const SECTOR_TR: Record<OmniSector, string> = {
  municipality:   'Belediye',
  hospital:       'Sağlık',
  bank:           'Bankacılık',
  university:     'Üniversite',
  industrial:     'Sanayi',
  infrastructure: 'Altyapı',
  hotel:          'Konaklama',
  education:      'Eğitim',
}

/** URI skoru → RiskClass */
export function uriToRiskClass(score: number): RiskClass {
  if (score < 40) return 'CRITICAL'
  if (score < 60) return 'HIGH'
  if (score < 75) return 'MEDIUM'
  if (score < 90) return 'RESILIENT'
  return 'EXEMPLARY'
}
