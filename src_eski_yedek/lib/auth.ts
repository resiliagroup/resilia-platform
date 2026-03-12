// ═══════════════════════════════════════════════════════════════
//  RESILIA Platform — Demo Kullanıcılar & Auth Yardımcıları
// ═══════════════════════════════════════════════════════════════

import { Rol, Sektor } from '@/types'

export type DemoKullanici = {
  email: string
  sifre: string
  ad_soyad: string
  rol: Rol
  tenant: string
  sektor: Sektor
  birim_kodu?: string
  renk: string
}

export const DEMO_KULLANICILAR: DemoKullanici[] = [
  // ── Bankacılık ────────────────────────────────────────────
  {
    email:       'sube@akbank.com',
    sifre:       '1234',
    ad_soyad:    'Ayşe Kaya',
    rol:         'birim',
    tenant:      'Akbank A.Ş.',
    sektor:      'bankacilik',
    birim_kodu:  '0042',
    renk:        'bg-blue-900/50 text-blue-400',
  },
  {
    email:       'uzman@akbank.com',
    sifre:       '1234',
    ad_soyad:    'Mehmet Demir',
    rol:         'uzman',
    tenant:      'Akbank A.Ş.',
    sektor:      'bankacilik',
    renk:        'bg-blue-900/50 text-blue-400',
  },
  {
    email:       'board@akbank.com',
    sifre:       '1234',
    ad_soyad:    'Dr. Fatma Şahin',
    rol:         'board',
    tenant:      'Akbank A.Ş.',
    sektor:      'bankacilik',
    renk:        'bg-purple-900/50 text-purple-400',
  },

  // ── Sağlık ────────────────────────────────────────────────
  {
    email:       'tesis@medicalpark.com',
    sifre:       '1234',
    ad_soyad:    'Hemşire Zeynep Arslan',
    rol:         'birim',
    tenant:      'Medical Park Hastaneler',
    sektor:      'saglik',
    birim_kodu:  'MP-IST-01',
    renk:        'bg-green-900/50 text-green-400',
  },
  {
    email:       'uzman@medicalpark.com',
    sifre:       '1234',
    ad_soyad:    'Dr. Ali Yılmaz',
    rol:         'uzman',
    tenant:      'Medical Park Hastaneler',
    sektor:      'saglik',
    renk:        'bg-green-900/50 text-green-400',
  },

  // ── Üretim ────────────────────────────────────────────────
  {
    email:       'fabrika@gebzeosb.com',
    sifre:       '1234',
    ad_soyad:    'Mühendis Can Özdemir',
    rol:         'birim',
    tenant:      'Gebze OSB',
    sektor:      'uretim',
    birim_kodu:  'GOSB-14',
    renk:        'bg-orange-900/50 text-orange-400',
  },

  // ── Belediye ──────────────────────────────────────────────
  {
    email:       'birim@ibb.istanbul',
    sifre:       '1234',
    ad_soyad:    'Uzman Hülya Çelik',
    rol:         'birim',
    tenant:      'İstanbul Büyükşehir Belediyesi',
    sektor:      'belediye',
    birim_kodu:  'IBB-AFAD-01',
    renk:        'bg-pink-900/50 text-pink-400',
  },
  {
    email:       'uzman@ibb.istanbul',
    sifre:       '1234',
    ad_soyad:    'Dr. Kemal Uzun',
    rol:         'uzman',
    tenant:      'İstanbul Büyükşehir Belediyesi',
    sektor:      'belediye',
    renk:        'bg-pink-900/50 text-pink-400',
  },

  // ── MEB ───────────────────────────────────────────────────
  {
    email:       'okul@meb.gov.tr',
    sifre:       '1234',
    ad_soyad:    'Müdür Seda Doğan',
    rol:         'birim',
    tenant:      'MEB İstanbul İl Milli Eğitim Müdürlüğü',
    sektor:      'meb',
    birim_kodu:  'MEB-IST-0042',
    renk:        'bg-emerald-900/50 text-emerald-400',
  },

  // ── Odalar ───────────────────────────────────────────────
  {
    email:       'uye@iso.org.tr',
    sifre:       '1234',
    ad_soyad:    'Yönetici Orhan Kılıç',
    rol:         'birim',
    tenant:      'İstanbul Sanayi Odası',
    sektor:      'odalar',
    birim_kodu:  'ISO-UYE-0187',
    renk:        'bg-violet-900/50 text-violet-400',
  },

  // ── Oda / Bölge Yönetimi ─────────────────────────────────
  {
    email:       'izleme@iso.org.tr',
    sifre:       '1234',
    ad_soyad:    'Genel Sekreter Tuba Erdoğan',
    rol:         'oda',
    tenant:      'İstanbul Sanayi Odası',
    sektor:      'uretim',
    renk:        'bg-violet-900/50 text-violet-400',
  },
  {
    email:       'izleme@kocaeliso.org.tr',
    sifre:       '1234',
    ad_soyad:    'İzleme Uzmanı Emre Şahin',
    rol:         'oda',
    tenant:      'Kocaeli Sanayi Odası',
    sektor:      'uretim',
    renk:        'bg-teal-900/50 text-teal-400',
  },
  {
    email:       'izleme@tobb.org.tr',
    sifre:       '1234',
    ad_soyad:    'Risk Koordinatörü Selin Yıldız',
    rol:         'oda',
    tenant:      'TOBB — Marmara Bölgesi',
    sektor:      'uretim',
    renk:        'bg-amber-900/50 text-amber-400',
  },
]

// ── LocalStorage yardımcıları ─────────────────────────────────
export const AUTH_KEYS = {
  ROL:         'resilia_rol',
  EMAIL:       'resilia_email',
  AD_SOYAD:    'resilia_ad',
  TENANT:      'resilia_tenant',
  SEKTOR:      'resilia_sektor',
  BIRIM_KODU:  'resilia_birim',
}

export function oturumAc(k: DemoKullanici) {
  if (typeof window === 'undefined') return
  localStorage.setItem(AUTH_KEYS.ROL,        k.rol)
  localStorage.setItem(AUTH_KEYS.EMAIL,      k.email)
  localStorage.setItem(AUTH_KEYS.AD_SOYAD,   k.ad_soyad)
  localStorage.setItem(AUTH_KEYS.TENANT,     k.tenant)
  localStorage.setItem(AUTH_KEYS.SEKTOR,     k.sektor)
  if (k.birim_kodu) localStorage.setItem(AUTH_KEYS.BIRIM_KODU, k.birim_kodu)
}

export function oturumKapat() {
  if (typeof window === 'undefined') return
  Object.values(AUTH_KEYS).forEach(k => localStorage.removeItem(k))
}

export function mevcutKullanici(): Partial<DemoKullanici> | null {
  if (typeof window === 'undefined') return null
  const rol = localStorage.getItem(AUTH_KEYS.ROL) as Rol | null
  if (!rol) return null
  return {
    rol,
    email:      localStorage.getItem(AUTH_KEYS.EMAIL)     || '',
    ad_soyad:   localStorage.getItem(AUTH_KEYS.AD_SOYAD)  || '',
    tenant:     localStorage.getItem(AUTH_KEYS.TENANT)    || '',
    sektor:     (localStorage.getItem(AUTH_KEYS.SEKTOR)   || 'bankacilik') as Sektor,
    birim_kodu: localStorage.getItem(AUTH_KEYS.BIRIM_KODU) || undefined,
  }
}

export function rolYonlendir(rol: Rol, sektor: Sektor): string {
  if (rol === 'birim')  return '/form'
  if (rol === 'uzman')  return '/uzman/dashboard'
  if (rol === 'board')  return '/board/ozet'
  if (rol === 'oda')    return '/oda/dashboard'
  if (rol === 'admin')  return '/admin'
  return '/login'
}