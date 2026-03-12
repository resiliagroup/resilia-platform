// ═══════════════════════════════════════════════════════════════
//  OMNI Platform — Tip Tanımları
//  İTÜ AYM (Afet Yönetimi Uygulama ve Araştırma Merkezi)
//  iş birliğiyle geliştirilmiştir.
// ═══════════════════════════════════════════════════════════════

// ── Kullanıcı rolleri ──────────────────────────────────────────
export type Rol = 'birim' | 'uzman' | 'board' | 'oda' | 'admin'

export type Kullanici = {
  id: string
  email: string
  rol: Rol
  ad_soyad: string
  tenant_id: string
  birim_kodu?: string | null
  olusturulma: string
}

// ── Sektörler ──────────────────────────────────────────────────
export type Sektor =
  | 'bankacilik'
  | 'saglik'
  | 'konaklama'
  | 'uretim'
  | 'hizmet'
  | 'odalar'
  | 'belediye'
  | 'meb'

export const SEKTOR_ETIKET: Record<Sektor, string> = {
  bankacilik: 'Bankacılık & Finans',
  saglik:     'Sağlık',
  konaklama:  'Konaklama & Turizm',
  uretim:     'Üretim Tesisleri',
  hizmet:     'Hizmet Sektörü',
  odalar:     'Odalar (Sanayi & Ticaret)',
  belediye:   'Belediyeler',
  meb:        'MEB / Eğitim',
}

export const SEKTOR_IKON: Record<Sektor, string> = {
  bankacilik: '🏦',
  saglik:     '🏥',
  konaklama:  '🏨',
  uretim:     '🏭',
  hizmet:     '🔧',
  odalar:     '🏛️',
  belediye:   '🏙️',
  meb:        '📚',
}

export const SEKTOR_RENK: Record<Sektor, string> = {
  bankacilik: '#1B4FD8',
  saglik:     '#059669',
  konaklama:  '#D97706',
  uretim:     '#EA580C',
  hizmet:     '#0891B2',
  odalar:     '#7C3AED',
  belediye:   '#BE185D',
  meb:        '#065F46',
}

// Alt birim adlandırması sektöre göre değişir
export const SEKTOR_BIRIM_ADI: Record<Sektor, string> = {
  bankacilik: 'Şube',
  saglik:     'Tesis',
  konaklama:  'Otel',
  uretim:     'Fabrika / OSB',
  hizmet:     'İşletme',
  odalar:     'Üye Firma',
  belediye:   'Birim',
  meb:        'Okul',
}

// Sektöre özgü mevzuat
export const SEKTOR_MEVZUAT: Record<Sektor, string[]> = {
  bankacilik: ['BDDK 26333', 'ISO 22301', 'SWIFT CSP', 'EU DORA', 'NIS2'],
  saglik:     ['HAP', 'JCI', 'ISO 27799', 'Sağlık Bak.'],
  konaklama:  ['TÜRSAB', 'Yangın Yön.', 'Kültür Bak.'],
  uretim:     ['6331 İSG', 'Seveso III', 'OHSAS 18001', 'ISO 45001'],
  hizmet:     ['6331 İSG', 'ISO 22301', 'KVKK', 'TSE'],
  odalar:     ['TOBB', 'TESK', 'AFAD', 'ISO 22313'],
  belediye:   ['5393 Bel. K.', 'AFAD', 'İçişleri Bak.', 'ISO 22301'],
  meb:        ['MEB Genelge', 'AFAD', 'Yangın Yön.', 'ISO 22301'],
}

// ── Birim (şube / tesis / okul / ilçe vb.) ────────────────────
export type Birim = {
  id: string
  tenant_id: string
  kod: string
  ad: string
  sektor: Sektor
  il: string
  ilce: string
  adres?: string
  koordinat_lat?: number
  koordinat_lng?: number
  deprem_bolgesi?: number
  personel_sayisi?: number
  aktif: boolean
  olusturulma: string
}

// ── Form Cevabı (ana veri modeli) ─────────────────────────────
export type FormCevabi = {
  id: string
  tenant_id: string
  birim_kodu: string
  senaryo: string
  puanlar: Record<string, number>
  dayaniklilik_skoru: number
  h_skoru: number | null
  f_skoru: number | null
  e_skoru: number | null
  durum: 'taslak' | 'gonderildi' | 'incelendi'
  dolduran_email?: string
  inceleme_notu?: string
  olusturulma: string
  gonderilme: string | null
  lat?: number | null
  lng?: number | null
  il_adi?: string | null
  sektor?: string | null
}

// ── Risk yardımcı fonksiyonları ────────────────────────────────
export type RiskSeviyesi = 'kritik' | 'orta' | 'guclu'

export const getRiskSeviyesi = (skor: number): RiskSeviyesi => {
  if (skor < 40) return 'kritik'
  if (skor < 70) return 'orta'
  return 'guclu'
}

export const getRiskRenk = (skor: number): string => {
  if (skor < 40) return '#EF4444'
  if (skor < 70) return '#F59E0B'
  return '#22C55E'
}

export const getRiskEtiket = (skor: number): string => {
  if (skor < 40) return 'KRİTİK'
  if (skor < 70) return 'ORTA RİSK'
  return 'GÜÇLÜ'
}

export const getRiskBg = (skor: number): string => {
  if (skor < 40) return 'bg-red-950/30 border-red-900/40 text-red-400'
  if (skor < 70) return 'bg-yellow-950/30 border-yellow-900/40 text-yellow-400'
  return 'bg-green-950/30 border-green-900/40 text-green-400'
}

// ── Dashboard özet ─────────────────────────────────────────────
export type DashboardOzet = {
  toplam_birim: number
  toplam_form: number
  ortalama_skor: number
  kritik: number
  orta: number
  guclu: number
}

// ── Tenant (müşteri/kurum) ─────────────────────────────────────
export type Tenant = {
  id: string
  ad: string
  sektor: Sektor
  logo_url?: string
  aktif: boolean
  olusturulma: string
}