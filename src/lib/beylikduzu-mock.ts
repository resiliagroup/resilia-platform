// ═══════════════════════════════════════════════════════════════
//  Beylikdüzü CBS — Statik Mock Veri
//  Kaynak: Beylikdüzü Belediyesi CBS katman listesi
//  Kategoriler: Resmi Kurum, Sağlık, Eğitim, Sanayi, Yeşil Alan
//  Koordinatlar: WGS84, gerçek Beylikdüzü konumları
//  Demo tarihi: 16 Mart 2026
// ═══════════════════════════════════════════════════════════════

export type CBSKategori =
  | 'resmi_kurum'
  | 'saglik'
  | 'egitim'
  | 'sanayi'
  | 'yesil_alan'

export type CBSTesis = {
  id: string
  ad: string
  kategori: CBSKategori
  alt_kategori: string
  koordinat: { lat: number; lng: number }
  adres: string
  kapasite?: number          // yatak, kişi, m² vb.
  kapasite_birimi?: string
  risk_skoru?: number        // 1–5 (1=düşük, 5=kritik)
  acil_toplama_noktasi?: boolean
}

// ─── Renk ve ikon eşleştirme (harita katmanları için) ──────────
export const KATEGORİ_META: Record<CBSKategori, {
  label: string
  renk: string      // hex
  ikon: string      // lucide icon adı
}> = {
  resmi_kurum: { label: 'Resmi Kurum',  renk: '#3B82F6', ikon: 'building-2'    },
  saglik:      { label: 'Sağlık',       renk: '#EF4444', ikon: 'cross'         },
  egitim:      { label: 'Eğitim',       renk: '#F59E0B', ikon: 'graduation-cap' },
  sanayi:      { label: 'Sanayi',       renk: '#6B7280', ikon: 'factory'       },
  yesil_alan:  { label: 'Yeşil Alan',   renk: '#22C55E', ikon: 'trees'         },
}

// ─── Resmi Kurum ───────────────────────────────────────────────
const RESMI_KURUMLAR: CBSTesis[] = [
  {
    id: 'rk-001',
    ad: 'Beylikdüzü Belediyesi',
    kategori: 'resmi_kurum',
    alt_kategori: 'Belediye',
    koordinat: { lat: 41.0012, lng: 28.6484 },
    adres: 'Cumhuriyet Mah. E-5 Karayolu Üzeri, Beylikdüzü',
    risk_skoru: 2,
    acil_toplama_noktasi: true,
  },
  {
    id: 'rk-002',
    ad: 'Beylikdüzü İlçe Emniyet Müdürlüğü',
    kategori: 'resmi_kurum',
    alt_kategori: 'Emniyet',
    koordinat: { lat: 41.0031, lng: 28.6512 },
    adres: 'Adnan Kahveci Mah. Belediye Cad., Beylikdüzü',
    risk_skoru: 2,
    acil_toplama_noktasi: true,
  },
  {
    id: 'rk-003',
    ad: 'Beylikdüzü İlçe Jandarma Komutanlığı',
    kategori: 'resmi_kurum',
    alt_kategori: 'Jandarma',
    koordinat: { lat: 40.9971, lng: 28.6398 },
    adres: 'Büyükşehir Mah., Beylikdüzü',
    risk_skoru: 2,
  },
  {
    id: 'rk-004',
    ad: 'Beylikdüzü Kaymakamlığı',
    kategori: 'resmi_kurum',
    alt_kategori: 'Kaymakamlık',
    koordinat: { lat: 41.0019, lng: 28.6491 },
    adres: 'Cumhuriyet Mah. Belediye Cad. No:1, Beylikdüzü',
    risk_skoru: 2,
    acil_toplama_noktasi: true,
  },
  {
    id: 'rk-005',
    ad: 'Beylikdüzü Nüfus Müdürlüğü',
    kategori: 'resmi_kurum',
    alt_kategori: 'Nüfus',
    koordinat: { lat: 41.0023, lng: 28.6488 },
    adres: 'Cumhuriyet Mah., Beylikdüzü',
    risk_skoru: 1,
  },
  {
    id: 'rk-006',
    ad: 'Beylikdüzü Vergi Dairesi',
    kategori: 'resmi_kurum',
    alt_kategori: 'Vergi',
    koordinat: { lat: 41.0008, lng: 28.6502 },
    adres: 'Adnan Kahveci Mah., Beylikdüzü',
    risk_skoru: 1,
  },
  {
    id: 'rk-007',
    ad: 'İstanbul Büyükşehir Belediyesi Beylikdüzü Hizmet Binası',
    kategori: 'resmi_kurum',
    alt_kategori: 'İBB Hizmet',
    koordinat: { lat: 40.9985, lng: 28.6445 },
    adres: 'Marmara Mah., Beylikdüzü',
    risk_skoru: 2,
    acil_toplama_noktasi: true,
  },
]

// ─── Sağlık ────────────────────────────────────────────────────
const SAGLIK_TESİSLERİ: CBSTesis[] = [
  {
    id: 'sg-001',
    ad: 'Beylikdüzü Devlet Hastanesi',
    kategori: 'saglik',
    alt_kategori: 'Devlet Hastanesi',
    koordinat: { lat: 41.0042, lng: 28.6530 },
    adres: 'Adnan Kahveci Mah. 101. Sok. No:1, Beylikdüzü',
    kapasite: 300,
    kapasite_birimi: 'yatak',
    risk_skoru: 5,
    acil_toplama_noktasi: false,
  },
  {
    id: 'sg-002',
    ad: 'Beylikdüzü Ağız ve Diş Sağlığı Merkezi',
    kategori: 'saglik',
    alt_kategori: 'ADSM',
    koordinat: { lat: 41.0035, lng: 28.6518 },
    adres: 'Adnan Kahveci Mah., Beylikdüzü',
    risk_skoru: 3,
  },
  {
    id: 'sg-003',
    ad: 'Beylikdüzü Toplum Sağlığı Merkezi',
    kategori: 'saglik',
    alt_kategori: 'TSM',
    koordinat: { lat: 41.0015, lng: 28.6479 },
    adres: 'Cumhuriyet Mah., Beylikdüzü',
    risk_skoru: 4,
    acil_toplama_noktasi: true,
  },
  {
    id: 'sg-004',
    ad: 'Aile Sağlığı Merkezi - Büyükşehir',
    kategori: 'saglik',
    alt_kategori: 'ASM',
    koordinat: { lat: 40.9977, lng: 28.6412 },
    adres: 'Büyükşehir Mah. 102. Sok., Beylikdüzü',
    risk_skoru: 3,
  },
  {
    id: 'sg-005',
    ad: 'Aile Sağlığı Merkezi - Gürpınar',
    kategori: 'saglik',
    alt_kategori: 'ASM',
    koordinat: { lat: 40.9913, lng: 28.6333 },
    adres: 'Gürpınar Mah., Beylikdüzü',
    risk_skoru: 3,
  },
  {
    id: 'sg-006',
    ad: 'Özel Medilife Beylikdüzü Hastanesi',
    kategori: 'saglik',
    alt_kategori: 'Özel Hastane',
    koordinat: { lat: 41.0055, lng: 28.6548 },
    adres: 'Yakuplu Mah. E-5 Üzeri, Beylikdüzü',
    kapasite: 150,
    kapasite_birimi: 'yatak',
    risk_skoru: 4,
  },
  {
    id: 'sg-007',
    ad: 'Beylikdüzü 112 Acil İstasyonu',
    kategori: 'saglik',
    alt_kategori: '112 İstasyon',
    koordinat: { lat: 41.0028, lng: 28.6507 },
    adres: 'Cumhuriyet Mah., Beylikdüzü',
    risk_skoru: 5,
    acil_toplama_noktasi: true,
  },
]

// ─── Eğitim ────────────────────────────────────────────────────
const EĞİTİM_TESİSLERİ: CBSTesis[] = [
  {
    id: 'eg-001',
    ad: 'Beylikdüzü Anadolu Lisesi',
    kategori: 'egitim',
    alt_kategori: 'Lise',
    koordinat: { lat: 41.0002, lng: 28.6461 },
    adres: 'Cumhuriyet Mah. Okul Sok., Beylikdüzü',
    kapasite: 1200,
    kapasite_birimi: 'öğrenci',
    risk_skoru: 3,
    acil_toplama_noktasi: true,
  },
  {
    id: 'eg-002',
    ad: 'Beylikdüzü Fen Lisesi',
    kategori: 'egitim',
    alt_kategori: 'Lise',
    koordinat: { lat: 40.9994, lng: 28.6437 },
    adres: 'Büyükşehir Mah., Beylikdüzü',
    kapasite: 800,
    kapasite_birimi: 'öğrenci',
    risk_skoru: 3,
    acil_toplama_noktasi: true,
  },
  {
    id: 'eg-003',
    ad: 'Adnan Kahveci İlkokulu',
    kategori: 'egitim',
    alt_kategori: 'İlkokul',
    koordinat: { lat: 41.0038, lng: 28.6524 },
    adres: 'Adnan Kahveci Mah., Beylikdüzü',
    kapasite: 900,
    kapasite_birimi: 'öğrenci',
    risk_skoru: 3,
  },
  {
    id: 'eg-004',
    ad: 'Yakuplu İlköğretim Okulu',
    kategori: 'egitim',
    alt_kategori: 'İlkokul',
    koordinat: { lat: 41.0061, lng: 28.6563 },
    adres: 'Yakuplu Mah., Beylikdüzü',
    kapasite: 700,
    kapasite_birimi: 'öğrenci',
    risk_skoru: 2,
  },
  {
    id: 'eg-005',
    ad: 'Gürpınar Ortaokulu',
    kategori: 'egitim',
    alt_kategori: 'Ortaokul',
    koordinat: { lat: 40.9921, lng: 28.6347 },
    adres: 'Gürpınar Mah., Beylikdüzü',
    kapasite: 600,
    kapasite_birimi: 'öğrenci',
    risk_skoru: 2,
  },
  {
    id: 'eg-006',
    ad: 'İstanbul Ticaret Üniversitesi Beylikdüzü Kampüsü',
    kategori: 'egitim',
    alt_kategori: 'Üniversite',
    koordinat: { lat: 41.0071, lng: 28.6492 },
    adres: 'Ekşioğlu Kampüsü, Beylikdüzü',
    kapasite: 5000,
    kapasite_birimi: 'öğrenci',
    risk_skoru: 3,
    acil_toplama_noktasi: true,
  },
  {
    id: 'eg-007',
    ad: 'Marmara Mah. Anaokulu',
    kategori: 'egitim',
    alt_kategori: 'Anaokul',
    koordinat: { lat: 40.9988, lng: 28.6452 },
    adres: 'Marmara Mah., Beylikdüzü',
    kapasite: 200,
    kapasite_birimi: 'öğrenci',
    risk_skoru: 2,
  },
  {
    id: 'eg-008',
    ad: 'Beylikdüzü Halk Eğitim Merkezi',
    kategori: 'egitim',
    alt_kategori: 'Halk Eğitim',
    koordinat: { lat: 41.0005, lng: 28.6469 },
    adres: 'Cumhuriyet Mah., Beylikdüzü',
    risk_skoru: 1,
    acil_toplama_noktasi: false,
  },
]

// ─── Sanayi ────────────────────────────────────────────────────
const SANAYİ_TESİSLERİ: CBSTesis[] = [
  {
    id: 'sn-001',
    ad: 'Beylikdüzü Organize Sanayi Bölgesi (BOSB)',
    kategori: 'sanayi',
    alt_kategori: 'OSB',
    koordinat: { lat: 41.0112, lng: 28.6601 },
    adres: 'Yakuplu Mah. OSB Cad., Beylikdüzü',
    kapasite: 250,
    kapasite_birimi: 'işletme',
    risk_skoru: 4,
  },
  {
    id: 'sn-002',
    ad: 'Beylikdüzü Sanayi Sitesi',
    kategori: 'sanayi',
    alt_kategori: 'Sanayi Sitesi',
    koordinat: { lat: 41.0089, lng: 28.6578 },
    adres: 'Yakuplu Mah. Sanayi Cad., Beylikdüzü',
    kapasite: 180,
    kapasite_birimi: 'işletme',
    risk_skoru: 3,
  },
  {
    id: 'sn-003',
    ad: 'Büyükşehir Küçük Sanayi Sitesi',
    kategori: 'sanayi',
    alt_kategori: 'KSS',
    koordinat: { lat: 40.9962, lng: 28.6381 },
    adres: 'Büyükşehir Mah. Sanayi Bölgesi, Beylikdüzü',
    kapasite: 95,
    kapasite_birimi: 'işletme',
    risk_skoru: 3,
  },
  {
    id: 'sn-004',
    ad: 'Gürpınar Akaryakıt Terminali',
    kategori: 'sanayi',
    alt_kategori: 'Akaryakıt Depo',
    koordinat: { lat: 40.9888, lng: 28.6291 },
    adres: 'Gürpınar Mah. Sahil Yolu, Beylikdüzü',
    risk_skoru: 5,
  },
  {
    id: 'sn-005',
    ad: 'Beylikdüzü Doğalgaz İstasyonu (IGDAŞ)',
    kategori: 'sanayi',
    alt_kategori: 'Enerji Altyapı',
    koordinat: { lat: 41.0078, lng: 28.6557 },
    adres: 'Yakuplu Mah., Beylikdüzü',
    risk_skoru: 5,
  },
  {
    id: 'sn-006',
    ad: 'E-5 Lojistik Depo Alanı',
    kategori: 'sanayi',
    alt_kategori: 'Lojistik Depo',
    koordinat: { lat: 41.0098, lng: 28.6589 },
    adres: 'Yakuplu Mah. E-5 Kenarı, Beylikdüzü',
    kapasite: 45000,
    kapasite_birimi: 'm²',
    risk_skoru: 3,
  },
]

// ─── Yeşil Alan ────────────────────────────────────────────────
const YEŞİL_ALANLAR: CBSTesis[] = [
  {
    id: 'ya-001',
    ad: 'Beylikdüzü Yaşam Vadisi',
    kategori: 'yesil_alan',
    alt_kategori: 'Büyük Park',
    koordinat: { lat: 41.0048, lng: 28.6540 },
    adres: 'Adnan Kahveci Mah. Yaşam Vadisi, Beylikdüzü',
    kapasite: 120000,
    kapasite_birimi: 'm²',
    risk_skoru: 1,
    acil_toplama_noktasi: true,
  },
  {
    id: 'ya-002',
    ad: 'Marmara Sahil Parkı',
    kategori: 'yesil_alan',
    alt_kategori: 'Sahil Parkı',
    koordinat: { lat: 40.9908, lng: 28.6308 },
    adres: 'Gürpınar Mah. Sahil Yolu, Beylikdüzü',
    kapasite: 85000,
    kapasite_birimi: 'm²',
    risk_skoru: 2,
    acil_toplama_noktasi: true,
  },
  {
    id: 'ya-003',
    ad: 'Cumhuriyet Mah. Merkez Parkı',
    kategori: 'yesil_alan',
    alt_kategori: 'Mahalle Parkı',
    koordinat: { lat: 41.0017, lng: 28.6471 },
    adres: 'Cumhuriyet Mah., Beylikdüzü',
    kapasite: 12000,
    kapasite_birimi: 'm²',
    risk_skoru: 1,
    acil_toplama_noktasi: true,
  },
  {
    id: 'ya-004',
    ad: 'Büyükşehir Mah. Spor Parkı',
    kategori: 'yesil_alan',
    alt_kategori: 'Spor Parkı',
    koordinat: { lat: 40.9981, lng: 28.6431 },
    adres: 'Büyükşehir Mah., Beylikdüzü',
    kapasite: 18000,
    kapasite_birimi: 'm²',
    risk_skoru: 1,
    acil_toplama_noktasi: true,
  },
  {
    id: 'ya-005',
    ad: 'Adnan Kahveci Botanik Bahçesi',
    kategori: 'yesil_alan',
    alt_kategori: 'Botanik',
    koordinat: { lat: 41.0033, lng: 28.6516 },
    adres: 'Adnan Kahveci Mah., Beylikdüzü',
    kapasite: 25000,
    kapasite_birimi: 'm²',
    risk_skoru: 1,
  },
  {
    id: 'ya-006',
    ad: 'Yakuplu Orman Alanı',
    kategori: 'yesil_alan',
    alt_kategori: 'Orman',
    koordinat: { lat: 41.0081, lng: 28.6572 },
    adres: 'Yakuplu Mah. Kuzey Ormanı, Beylikdüzü',
    kapasite: 340000,
    kapasite_birimi: 'm²',
    risk_skoru: 1,
    acil_toplama_noktasi: false,
  },
  {
    id: 'ya-007',
    ad: 'Belediye Çiçek Bahçesi',
    kategori: 'yesil_alan',
    alt_kategori: 'Belediye Bahçe',
    koordinat: { lat: 41.0009, lng: 28.6485 },
    adres: 'Cumhuriyet Mah. Belediye Yanı, Beylikdüzü',
    kapasite: 5000,
    kapasite_birimi: 'm²',
    risk_skoru: 1,
  },
]

// ─── Tüm tesisler birleşik ─────────────────────────────────────
export const TUM_TESİSLER: CBSTesis[] = [
  ...RESMI_KURUMLAR,
  ...SAGLIK_TESİSLERİ,
  ...EĞİTİM_TESİSLERİ,
  ...SANAYİ_TESİSLERİ,
  ...YEŞİL_ALANLAR,
]

// ─── Yardımcı: kategoriye göre filtrele ───────────────────────
export function tesisleriGetir(kategori?: CBSKategori): CBSTesis[] {
  if (!kategori) return TUM_TESİSLER
  return TUM_TESİSLER.filter(t => t.kategori === kategori)
}

// ─── Yardımcı: acil toplama noktaları ────────────────────────
export function acilToplamaNoktaları(): CBSTesis[] {
  return TUM_TESİSLER.filter(t => t.acil_toplama_noktasi === true)
}

// ─── Yardımcı: yüksek riskli tesisler ────────────────────────
export function kritikTesisler(minRisk = 4): CBSTesis[] {
  return TUM_TESİSLER.filter(t => (t.risk_skoru ?? 0) >= minRisk)
}

// ─── Özet istatistik ──────────────────────────────────────────
export const CBS_OZET = {
  toplam_tesis: TUM_TESİSLER.length,
  kategoriler: {
    resmi_kurum: RESMI_KURUMLAR.length,
    saglik:      SAGLIK_TESİSLERİ.length,
    egitim:      EĞİTİM_TESİSLERİ.length,
    sanayi:      SANAYİ_TESİSLERİ.length,
    yesil_alan:  YEŞİL_ALANLAR.length,
  },
  acil_toplama_noktasi_sayisi: TUM_TESİSLER.filter(t => t.acil_toplama_noktasi).length,
  kritik_tesis_sayisi: TUM_TESİSLER.filter(t => (t.risk_skoru ?? 0) >= 4).length,
  merkez_koordinat: { lat: 41.0010, lng: 28.6490 }, // Beylikdüzü merkez
  zoom_seviyesi: 13,
}
