export type Rol = 'birim' | 'uzman' | 'board' | 'oda' | 'admin'
export type Sektor = 'bankacilik' | 'saglik' | 'uretim' | 'kamu' | 'meb' | 'odalar'

export interface DemoKullanici {
  email: string
  sifre: string
  ad_soyad: string
  rol: Rol
  tenant: string
  sektor: Sektor
  birim_kodu?: string
  renk?: string
}

export const DEMO_KULLANICILAR: DemoKullanici[] = [
  { email: 'board@akbank.com',      sifre: '1234', ad_soyad: 'Dr. Fatma Şahin',        rol: 'board', tenant: 'Akbank A.Ş.',              sektor: 'bankacilik' },
  { email: 'uzman@akbank.com',      sifre: '1234', ad_soyad: 'Mehmet Demir',            rol: 'uzman', tenant: 'Akbank A.Ş.',              sektor: 'bankacilik' },
  { email: 'sube@akbank.com',       sifre: '1234', ad_soyad: 'Ayşe Kaya',              rol: 'birim', tenant: 'Akbank A.Ş.',              sektor: 'bankacilik', birim_kodu: 'AKB-0042' },
  { email: 'board@isbank.com',      sifre: '1234', ad_soyad: 'İş Bankası Yönetim',     rol: 'board', tenant: 'İş Bankası A.Ş.',          sektor: 'bankacilik' },
  { email: 'uzman@isbank.com',      sifre: '1234', ad_soyad: 'İş Bankası Uzman',       rol: 'uzman', tenant: 'İş Bankası A.Ş.',          sektor: 'bankacilik' },
  { email: 'uzman@medicalpark.com', sifre: '1234', ad_soyad: 'Medical Park Uzman',     rol: 'uzman', tenant: 'Medical Park',             sektor: 'saglik' },
  { email: 'board@medicalpark.com', sifre: '1234', ad_soyad: 'Medical Park Yönetim',   rol: 'board', tenant: 'Medical Park',             sektor: 'saglik' },
  { email: 'izleme@isoistanbul.com',sifre: '1234', ad_soyad: 'ISO İzleme Uzman',       rol: 'uzman', tenant: 'İstanbul Sanayi Odası',    sektor: 'uretim' },
  { email: 'fabrika@gebzeosb.com',  sifre: '1234', ad_soyad: 'Müh. Can Özdemir',       rol: 'birim', tenant: 'Gebze OSB',                sektor: 'uretim', birim_kodu: 'GOSB-0011' },
  { email: 'izleme@iso.org.tr',     sifre: '1234', ad_soyad: 'Gn. Sek. Tuba Erdoğan', rol: 'oda',   tenant: 'İstanbul Sanayi Odası',    sektor: 'uretim' },
  { email: 'uzman@beylikduzu.bel.tr',sifre:'1234', ad_soyad: 'Belediye Uzman',         rol: 'uzman', tenant: 'Beylikdüzü Belediyesi',    sektor: 'kamu' },
  { email: 'board@beylikduzu.bel.tr',sifre:'1234', ad_soyad: 'Belediye Yönetim',       rol: 'board', tenant: 'Beylikdüzü Belediyesi',    sektor: 'kamu' },
  { email: 'uzman@itu.edu.tr',      sifre: '1234', ad_soyad: 'İTÜ Uzman',              rol: 'uzman', tenant: 'İTÜ',                      sektor: 'kamu' },
]

export const AUTH_KEYS = {
  ROL:      'omni_rol',
  EMAIL:    'omni_email',
  AD_SOYAD: 'omni_ad',
  TENANT:   'omni_tenant',
  SEKTOR:   'omni_sektor',
  BIRIM:    'omni_birim',
}

export function oturumAc(email: string, sifre: string): DemoKullanici {
  const k = DEMO_KULLANICILAR.find(u => u.email === email && u.sifre === sifre)
  if (!k) throw new Error('Kullanıcı bulunamadı')
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_KEYS.ROL,      k.rol)
    localStorage.setItem(AUTH_KEYS.EMAIL,    k.email)
    localStorage.setItem(AUTH_KEYS.AD_SOYAD, k.ad_soyad)
    localStorage.setItem(AUTH_KEYS.TENANT,   k.tenant)
    localStorage.setItem(AUTH_KEYS.SEKTOR,   k.sektor)
    if (k.birim_kodu) localStorage.setItem(AUTH_KEYS.BIRIM, k.birim_kodu)
  }
  return k
}

export function oturumKapat() {
  if (typeof window === 'undefined') return
  Object.values(AUTH_KEYS).forEach(k => localStorage.removeItem(k))
}

export function mevcutKullanici(): DemoKullanici | null {
  if (typeof window === 'undefined') return null
  const rol = localStorage.getItem(AUTH_KEYS.ROL) as Rol | null
  if (!rol) return null
  return {
    rol,
    email:      localStorage.getItem(AUTH_KEYS.EMAIL)    || '',
    sifre:      '',
    ad_soyad:   localStorage.getItem(AUTH_KEYS.AD_SOYAD) || '',
    tenant:     localStorage.getItem(AUTH_KEYS.TENANT)   || '',
    sektor:     (localStorage.getItem(AUTH_KEYS.SEKTOR)  || 'bankacilik') as Sektor,
    birim_kodu: localStorage.getItem(AUTH_KEYS.BIRIM)    || undefined,
  }
}

export function rolHedefi(rol: Rol, tenant?: string): string {
  // Tenant bazlı özel yönlendirmeler
  if (tenant?.includes('Beylikdüzü')) return '/beylikduzu-komuta'

  // Genel rol yönlendirmeleri
  if (rol === 'birim') return '/form'
  if (rol === 'uzman') return '/uzman/dashboard'
  if (rol === 'board') return '/board/ozet'
  if (rol === 'oda')   return '/oda/dashboard'
  if (rol === 'admin') return '/eoc-dashboard'
  return '/login'
}
