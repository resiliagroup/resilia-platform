// ═══════════════════════════════════════════════════════════════
//  OMNI Platform — Senaryo Kataloğu
//  Sektöre özgü + genel senaryolar
// ═══════════════════════════════════════════════════════════════

import { Sektor } from '@/types'

export type Senaryo = {
  id: string
  ad: string
  ikon: string
  renk: string
  sektorler: Sektor[] | 'hepsi'  // hangi sektörlerde görünür
}

export const SENARYOLAR: Senaryo[] = [
  // ── Doğal Afetler ──────────────────────────────────────────
  { id: 'deprem',         ad: 'Deprem',                 ikon: '🔴', renk: '#EF4444', sektorler: 'hepsi' },
  { id: 'sel',            ad: 'Sel / Taşkın',           ikon: '🌊', renk: '#3B82F6', sektorler: 'hepsi' },
  { id: 'yangin',         ad: 'Yangın',                  ikon: '🔥', renk: '#F97316', sektorler: 'hepsi' },
  { id: 'firtina',        ad: 'Fırtına / Aşırı Yağış',  ikon: '⛈️', renk: '#6366F1', sektorler: 'hepsi' },
  { id: 'asiri_sicak',    ad: 'Aşırı Sıcak / Soğuk',    ikon: '🌡️', renk: '#D97706', sektorler: 'hepsi' },

  // ── Teknoloji ─────────────────────────────────────────────
  { id: 'siber_saldiri',  ad: 'Siber Saldırı',           ikon: '💻', renk: '#7C3AED', sektorler: 'hepsi' },
  { id: 'elektrik',       ad: 'Elektrik Kesintisi',       ikon: '⚡', renk: '#F59E0B', sektorler: 'hepsi' },
  { id: 'it_arizasi',     ad: 'IT / Sistem Arızası',      ikon: '🖥️', renk: '#8B5CF6', sektorler: 'hepsi' },
  { id: 'telekom',        ad: 'Telekomünikasyon Kesintisi',ikon: '📡', renk: '#0891B2', sektorler: 'hepsi' },
  { id: 'su_gaz',         ad: 'Su / Doğalgaz Kesintisi',  ikon: '🔧', renk: '#059669', sektorler: 'hepsi' },

  // ── Güvenlik ─────────────────────────────────────────────
  { id: 'toplumsal',      ad: 'Toplumsal Olaylar / Terör',ikon: '🚨', renk: '#DC2626', sektorler: 'hepsi' },
  { id: 'soygun',         ad: 'Soygun / Fiziksel Saldırı',ikon: '⚠️', renk: '#B91C1C', sektorler: 'hepsi' },
  { id: 'ic_tehdit',      ad: 'İç Tehdit / Sabotaj',      ikon: '🔍', renk: '#9F1239', sektorler: 'hepsi' },

  // ── Sağlık ───────────────────────────────────────────────
  { id: 'pandemi',        ad: 'Pandemi / Salgın',         ikon: '🦠', renk: '#15803D', sektorler: 'hepsi' },
  { id: 'toplu_kaza',     ad: 'Toplu Kaza / Kitlesel Olay',ikon: '🚑', renk: '#BE185D',
    sektorler: ['saglik', 'belediye', 'meb', 'konaklama'] },

  // ── Kurumsal ─────────────────────────────────────────────
  { id: 'personel_kaybi', ad: 'Kritik Personel Kaybı',    ikon: '👤', renk: '#475569', sektorler: 'hepsi' },
  { id: 'tedarik',        ad: 'Tedarik Zinciri Çöküşü',   ikon: '🔗', renk: '#65A30D', sektorler: 'hepsi' },

  // ── Sektöre Özgü ─────────────────────────────────────────
  { id: 'bddk',           ad: 'BDDK / Regülatör Yaptırımı', ikon: '📋', renk: '#1D4ED8',
    sektorler: ['bankacilik'] },
  { id: 'swift_kesinti',  ad: 'SWIFT / Ödeme Sistemi Kesintisi', ikon: '💳', renk: '#2563EB',
    sektorler: ['bankacilik'] },
  { id: 'kimyasal',       ad: 'Kimyasal / Tehlikeli Madde Sızıntısı', ikon: '☢️', renk: '#EA580C',
    sektorler: ['uretim'] },
  { id: 'patlama',        ad: 'Patlama / Endüstriyel Kaza', ikon: '💥', renk: '#C2410C',
    sektorler: ['uretim'] },
  { id: 'turizm_krizi',   ad: 'Turizm Krizi / Destinasyon Riski', ikon: '✈️', renk: '#D97706',
    sektorler: ['konaklama'] },
  { id: 'okul_tahliye',   ad: 'Okul Tahliyesi / Acil Durum', ikon: '🏫', renk: '#065F46',
    sektorler: ['meb'] },
  { id: 'altyapi',        ad: 'Belediye Altyapı Hasarı', ikon: '🏗️', renk: '#BE185D',
    sektorler: ['belediye'] },
  { id: 'ticari_uyusmazlik', ad: 'Ticari Uyuşmazlık / İflas Riski', ikon: '⚖️', renk: '#7C3AED',
    sektorler: ['odalar', 'hizmet'] },
]

/**
 * Belirli bir sektöre uygun senaryoları getirir
 */
export function getSektorSenaryolari(sektor: Sektor): Senaryo[] {
  return SENARYOLAR.filter(s =>
    s.sektorler === 'hepsi' || s.sektorler.includes(sektor)
  )
}

/**
 * Senaryo renk haritası (eski uyumluluk için)
 */
export const SENARYO_RENK: Record<string, string> = Object.fromEntries(
  SENARYOLAR.map(s => [s.ad, `bg-${s.renk} text-white`])
)
