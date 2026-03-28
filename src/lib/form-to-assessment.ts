// ═══════════════════════════════════════════════════
// Form yanıtları → AssessmentCreateRequest mapper
// SORULAR_SANAYI puanları (1-10) → backend (0-100)
// ═══════════════════════════════════════════════════

export function mapFormToAssessment(
  facilityId: string,
  puanlar: Record<string, number>,
  envanter: Record<string, unknown>
) {
  // Puan normalizer: 1-10 arası → 0-100
  const p = (kod: string, defVal = 50) => {
    const v = puanlar[kod]
    return v !== undefined ? Math.round(v * 10) : defVal
  }

  // Düz soru → ters çevir (yüksek backend = kötü, düz soru yüksek = iyi)
  const pd = (kod: string, defVal = 50) => 100 - p(kod, defVal)
  // Ters soru → direkt (yüksek puan = kötü, backend 0-100 kötü)
  const pt = (kod: string, defVal = 50) => p(kod, defVal)

  return {
    facility_id: facilityId,

    hazard: {
      seismic:              pt('T1', 50),
      flood:                pt('T2', 30),
      wildfire:             pt('T4', 20),
      cyber:                pt('T7', 40),
      supply_chain:         pt('T6', 35),
      pandemic:             pt('T8', 20),
      seismic_probability:  pt('T1', 50) / 100,
      flood_probability:    pt('T9', 30) / 100,
      cyber_probability:    pt('T7', 40) / 100,
    },

    fragility: {
      building_age_score:       pt('S1', 50),
      construction_quality:     pt('S2', 50),
      seismic_compliance:       pt('S1', 50),
      maintenance_score:        pt('S4', 50),
      single_point_of_failure:  pt('S10', 50),
      redundancy_score:         pt('S6', 50),
      supply_dependency:        pt('S8', 50),
      staff_training_score:     pd('Y21', 50),
      turnover_rate_score:      pt('S11', 50),
      bcm_awareness:            pd('Y1', 50),
      cyber_hygiene:            pt('S7', 50),
      backup_status:            pd('Y26', 50),
      system_age_score:         pt('S7', 50),
    },

    exposure: {
      population_at_risk:         parseInt(String(envanter['E10'] ?? '50')) || 50,
      population_vulnerability:   0.4,
      asset_value_usd:            5000000,
      asset_criticality:          puanlar['T8'] ? puanlar['T8'] / 10 : 0.5,
      critical_service_count:     1,
      dependency_count:           puanlar['S8'] ? Math.round(puanlar['S8'] / 2) : 2,
      dependency_criticality:     puanlar['S10'] ? puanlar['S10'] / 10 : 0.5,
      serves_critical_population: envanter['E06'] === 'Ulusal' || envanter['E06'] === 'Global / İhracat',
    },

    response: {
      bcm_plan_exists:          (puanlar['Y6'] ?? 0) > 5,
      plan_tested_last_12m:     (puanlar['Y22'] ?? 0) > 5,
      iso_22301_certified:      String(envanter['E36'] ?? '').includes('ISO 22301'),
      plan_digitized:           false,
      backup_power_hours:       puanlar['Y12'] ? puanlar['Y12'] * 4 : 0,
      backup_systems_score:     pd('Y12', 0),
      emergency_stockpile_days: puanlar['Y10'] ? puanlar['Y10'] * 3 : 0,
      drill_frequency_per_year: puanlar['Y22'] ? Math.round(puanlar['Y22'] / 3) : 0,
      staff_certification_pct:  puanlar['Y20'] ? puanlar['Y20'] * 10 : 0,
      crisis_team_exists:       (puanlar['Y23'] ?? 0) > 5,
      mutual_aid_agreements:    puanlar['Y29'] ? Math.round(puanlar['Y29'] / 3) : 0,
      coordination_score:       pd('Y29', 0),
    },

    notes: `İSO Form — NACE: ${String(envanter['E03'] ?? '?')} — İlçe: ${String(envanter['E13'] ?? '?')}`,

    bottleneck_score: puanlar['S10']
      ? 1 + (puanlar['S10'] / 10) * 2
      : 1.0,

    near_miss_count: puanlar['Y34']
      ? Math.round((10 - puanlar['Y34']) * 2)
      : 3,

    tatbikat_var: (puanlar['Y22'] ?? 0) > 3,
    otonom_squad: (puanlar['HRO3'] ?? 0) > 5,

    primary_hazard: (() => {
      const scores: Record<string, number> = {
        deprem:  puanlar['T1'] ?? 0,
        sel:     puanlar['T9'] ?? 0,
        yangin:  puanlar['T4'] ?? 0,
        siber:   puanlar['T7'] ?? 0,
        tedarik: puanlar['T6'] ?? 0,
      }
      return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]
    })(),
  }
}

// ISG Tehlike Sınıfına göre primary_hazard ağırlığı
export function getISGMultiplier(isgSinifi: string): number {
  if (isgSinifi.includes('1') || isgSinifi.includes('Çok Tehlikeli')) return 1.3
  if (isgSinifi.includes('2') || isgSinifi.includes('Tehlikeli')) return 1.1
  return 1.0
}
