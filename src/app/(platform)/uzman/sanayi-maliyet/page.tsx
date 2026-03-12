'use client'
import { useState } from 'react'

// ── Tipler ───────────────────────────────────────────────────────────────────
type MaliyetBant = 'dusuk' | 'orta' | 'yuksek'
type KararTip = 'yerel' | 'ust'
type IcraTip = 'yerel' | 'ulusal'
type ZorlukTip = 'yok' | 'toplum' | 'kapasite' | 'teknoloji'
type YonetisimTip = 'hazir' | 'uzman' | 'uygulayici'

interface Carpanlar {
  karar_yerel: number; karar_ust: number
  icra_yerel: number; icra_ulusal: number
  maliyet_dusuk: number; maliyet_orta: number; maliyet_yuksek: number
  zorluk_var: number; zorluk_yok: number
  yonetisim: number
  fayda_kucuk: number; fayda_orta: number; fayda_buyuk: number
}

interface Aksiyon {
  id: string; kategori: string; baslik: string; aciklama: string
  tip: 'yapisal' | 'yapisal_olmayan'
  bazPuan: number; karar: KararTip; icra: IcraTip
  maliyetBant: MaliyetBant; zorluk: ZorlukTip[]; yonetisim: YonetisimTip[]
  etkilenenK: number
  birimFiyatTL: number; birim: string; miktar: number; yillikFaydaTL: number
  rto_saat: number; rpo_saat: number; mevzuat: string
  oncelikPuani?: number
}

// ── SATAKOL Formu (MARAP Teknolojik Afet Tesis Veri Şablonu — 20 alan) ───────
interface SatakolVeri {
  // Form 1-6: Kimlik & Konum
  ticaret_sicil: string; firma_adi: string; kep_adresi: string
  nace_kodu: string; faaliyet: string; adres: string; koordinat: string
  // Form 7-10: Yapısal
  alan_m2: string; acik_alan_m2: string; kapali_alan_m2: string
  yapi_yili: string; yapi_tipi: string; kat_adeti: string; tesis_turu: string
  // Form 11-14: Tehlike & Enerji
  tehlikeli_madde_var: boolean; tehlikeli_madde_aciklama: string
  tehlikeli_cas: string; nfpa_kodu: string
  depolama_sekli: string; kompartiman: boolean; depo_m2: string
  nakliye_turu: string; enerji_kaynagi: string
  // Form 15-18: İşletme
  calisan_sayisi: string; calisan_beyaz: string; calisan_mavi: string; vardiya: string
  mulk_sahipligi: string; aritma_tesisi: boolean
  seveso_yukumluluk: boolean; seveso_seviye: string
  // Form 19-20: İletişim
  yetkili_kisi: string; yetkili_unvan: string; yetkili_tel: string; yetkili_email: string
  ek_bilgi: string
}

// ── AADY Kontrol Listesi 2025 ─────────────────────────────────────────────────
interface AADYCevap {
  // Yapısal
  bina_kullanim: string; kat_yukseklik: string; iskan_belgesi: string; sahiplik: string
  mimari_proje: string; tasiyici_proje: string; tasiyici_hesap: string
  guclendirilmis: string; zemin_etut: string; zemin_sinifi: string
  yapisal_durum: string; kompartiman_var: string
  // Sistem skorları 0-4
  deprem_onlem: number; yangin_sistem: number; sel_onlem: number
  enerji_guvenlik: number; it_guvenlik: number; makine_koruma: number
  acil_durum: number; yapisal_olmayan: number; surec_risk: number
  // Yapısal olmayan yönetim
  makine_sabitleme: string; tehlikeli_depo: string
  afet_plani: string; afet_plani_guncelleme: string
  komsu_risk_biliniyor: boolean; kendi_risk_biliniyor: boolean
  egitim: string; tatbikat: string; acil_ekip: boolean
  iso_sertifika: string[]
  kilit_personel: boolean; tedarik_plani: string; alt_uretim: string
  sigorta_var: boolean
  // Süreç riskleri
  riskli_girdi: string; riskli_proses: string; riskli_urun: string
  riskli_depo: string; riskli_atik: string; riskli_makine: string; riskli_lojistik: string
  // Üretimin stratejik önemi
  stratejik_onem: string
  // Afet destek kapasitesi (AADY §92-169)
  destek_lokasyon: boolean
  forklift_ton: string; jenerator_kw: string; vinc_hp: string
  kamyon_ton: string; seyyar_kompresör: string
  ilkyardim_personel: string; arama_kurtarma: string; yangin_personel: string
  afet_yoneticisi: string; iso22301_uzman: string
}

const SATAKOL_BOŞ: SatakolVeri = {
  ticaret_sicil:'', firma_adi:'', kep_adresi:'', nace_kodu:'', faaliyet:'',
  adres:'', koordinat:'', alan_m2:'', acik_alan_m2:'', kapali_alan_m2:'',
  yapi_yili:'', yapi_tipi:'betonarme', kat_adeti:'', tesis_turu:'üretim',
  tehlikeli_madde_var:false, tehlikeli_madde_aciklama:'', tehlikeli_cas:'', nfpa_kodu:'',
  depolama_sekli:'', kompartiman:false, depo_m2:'', nakliye_turu:'karayolu',
  enerji_kaynagi:'elektrik', calisan_sayisi:'', calisan_beyaz:'', calisan_mavi:'',
  vardiya:'1', mulk_sahipligi:'mülk', aritma_tesisi:false,
  seveso_yukumluluk:false, seveso_seviye:'',
  yetkili_kisi:'', yetkili_unvan:'', yetkili_tel:'', yetkili_email:'', ek_bilgi:''
}

const AADY_BOŞ: AADYCevap = {
  bina_kullanim:'üretim', kat_yukseklik:'1-4 kat', iskan_belgesi:'var', sahiplik:'mülk sahibi',
  mimari_proje:'var', tasiyici_proje:'var', tasiyici_hesap:'yok',
  guclendirilmis:'yok', zemin_etut:'yok', zemin_sinifi:'', yapisal_durum:'3', kompartiman_var:'yok',
  deprem_onlem:1, yangin_sistem:2, sel_onlem:1, enerji_guvenlik:2,
  it_guvenlik:1, makine_koruma:1, acil_durum:2, yapisal_olmayan:1, surec_risk:2,
  makine_sabitleme:'yok', tehlikeli_depo:'yok', afet_plani:'yok', afet_plani_guncelleme:'yok',
  komsu_risk_biliniyor:false, kendi_risk_biliniyor:false,
  egitim:'yok', tatbikat:'yok', acil_ekip:false,
  iso_sertifika:[], kilit_personel:false, tedarik_plani:'yok', alt_uretim:'yok',
  sigorta_var:false, stratejik_onem:'ticari',
  riskli_girdi:'', riskli_proses:'', riskli_urun:'', riskli_depo:'',
  riskli_atik:'', riskli_makine:'', riskli_lojistik:'',
  destek_lokasyon:false,
  forklift_ton:'', jenerator_kw:'', vinc_hp:'', kamyon_ton:'', seyyar_kompresör:'',
  ilkyardim_personel:'', arama_kurtarma:'', yangin_personel:'',
  afet_yoneticisi:'', iso22301_uzman:''
}

const CARPAN_VARSAYILAN: Carpanlar = {
  karar_yerel:1.5, karar_ust:0.75, icra_yerel:1.5, icra_ulusal:0.75,
  maliyet_dusuk:3, maliyet_orta:2, maliyet_yuksek:1,
  zorluk_var:0.5, zorluk_yok:1, yonetisim:1.5,
  fayda_kucuk:0.1, fayda_orta:1, fayda_buyuk:5,
}

// ── Sanayi Aksiyonları (AADY + SATAKOL referanslı) ──────────────────────────
const AKSIYONLAR_BASLANGIC: Aksiyon[] = [
  { id:'D1', kategori:'Deprem', tip:'yapisal', baslik:'Taşıyıcı Sistem Güçlendirme',
    aciklama:'AADY Yapısal Durum + SATAKOL Form 9: Yapısal hasar tespiti ve TBDY-2018 uyumlu güçlendirme projesi & uygulaması.',
    bazPuan:10, karar:'ust', icra:'yerel', maliyetBant:'yuksek', zorluk:['kapasite'],
    yonetisim:['uzman','uygulayici'], etkilenenK:5, birimFiyatTL:1200000, birim:'Bina',
    miktar:1, yillikFaydaTL:5500000, rto_saat:72, rpo_saat:24, mevzuat:'TBDY-2018 · AFAD · ISO 22301' },

  { id:'D2', kategori:'Deprem', tip:'yapisal_olmayan', baslik:'Makine-Teçhizat Sabitleme Projesi',
    aciklama:'AADY §65: CNC tezgahlar, kompresörler, depo rafları ve kritik ekipmanın sismik sabitlenmesi.',
    bazPuan:8, karar:'yerel', icra:'yerel', maliyetBant:'orta', zorluk:['yok'],
    yonetisim:['uzman','uygulayici'], etkilenenK:2, birimFiyatTL:85000, birim:'Tesis',
    miktar:1, yillikFaydaTL:1200000, rto_saat:48, rpo_saat:12, mevzuat:'TBDY-2018 · İSG 6331' },

  { id:'D3', kategori:'Deprem', tip:'yapisal_olmayan', baslik:'Zemin Etüdü & Yapısal Durum Tespiti',
    aciklama:'SATAKOL Form 8-9 + AADY: Güncel zemin etüdü, zemin sınıflaması ve yapısal durum tespiti raporlanması.',
    bazPuan:9, karar:'ust', icra:'yerel', maliyetBant:'orta', zorluk:['yok'],
    yonetisim:['uzman'], etkilenenK:2, birimFiyatTL:35000, birim:'Rapor',
    miktar:1, yillikFaydaTL:800000, rto_saat:72, rpo_saat:24, mevzuat:'TBDY-2018 · Yapı Denetim' },

  { id:'Y1', kategori:'Yangın', tip:'yapisal', baslik:'Endüstriyel Yangın Algılama & Sprinkler',
    aciklama:'AADY Yangın Önleme Sistemleri: Endüstriyel sprinkler + duman/ısı dedektörü + NFPA 704 uyumlu işaretleme.',
    bazPuan:9, karar:'yerel', icra:'yerel', maliyetBant:'orta', zorluk:['yok'],
    yonetisim:['uzman','uygulayici'], etkilenenK:2, birimFiyatTL:180000, birim:'Tesis',
    miktar:1, yillikFaydaTL:2200000, rto_saat:24, rpo_saat:8, mevzuat:'TS EN 12845 · NFPA 704 · İtfaiye' },

  { id:'Y2', kategori:'Yangın', tip:'yapisal', baslik:'Tehlikeli Madde Depolama İyileştirme',
    aciklama:'SATAKOL Form 11-12 + AADY §66: NFPA 704 ve SEVESO uyumlu kompartımanlama, ikincil kapı sistemi, havalandırma.',
    bazPuan:9, karar:'ust', icra:'yerel', maliyetBant:'orta', zorluk:['teknoloji'],
    yonetisim:['uzman','uygulayici'], etkilenenK:5, birimFiyatTL:120000, birim:'Depo Bölümü',
    miktar:1, yillikFaydaTL:2800000, rto_saat:12, rpo_saat:4, mevzuat:'NFPA 704 · SEVESO · Kimyasal Mevzuat' },

  { id:'Y3', kategori:'Yangın', tip:'yapisal_olmayan', baslik:'Yangın Tatbikatı & Acil Durum Ekibi',
    aciklama:'AADY §71-73: Yılda 2x yangın tatbikatı, sertifikalı ilk yardım ve yangın müdahale ekibi oluşturulması.',
    bazPuan:7, karar:'yerel', icra:'yerel', maliyetBant:'dusuk', zorluk:['yok'],
    yonetisim:['hazir','uygulayici'], etkilenenK:2, birimFiyatTL:15000, birim:'Tatbikat/Yıl',
    miktar:2, yillikFaydaTL:520000, rto_saat:12, rpo_saat:4, mevzuat:'İSG 6331 · İtfaiye Yönetmeliği' },

  { id:'E1', kategori:'Enerji', tip:'yapisal', baslik:'Yedek Güç Jeneratörü & UPS Sistemi',
    aciklama:'SATAKOL Form 14 + AADY Enerji Güvenliği: Kritik üretim hatları için dizel jeneratör + UPS. 72s özerk çalışma.',
    bazPuan:8, karar:'yerel', icra:'yerel', maliyetBant:'orta', zorluk:['yok'],
    yonetisim:['uzman','uygulayici'], etkilenenK:2, birimFiyatTL:280000, birim:'Sistem',
    miktar:1, yillikFaydaTL:1800000, rto_saat:4, rpo_saat:1, mevzuat:'ISO 22301 §8.4 · TEİAŞ' },

  { id:'E2', kategori:'Enerji', tip:'yapisal_olmayan', baslik:'Akıllı Enerji İzleme (SCADA/IoT)',
    aciklama:'AADY IT Güvenlik + Enerji: SCADA tabanlı enerji tüketim izleme, anomali tespiti ve otomatik kesme.',
    bazPuan:7, karar:'yerel', icra:'yerel', maliyetBant:'orta', zorluk:['teknoloji'],
    yonetisim:['uzman'], etkilenenK:2, birimFiyatTL:75000, birim:'Sistem',
    miktar:1, yillikFaydaTL:520000, rto_saat:8, rpo_saat:2, mevzuat:'ISO 50001 · IEC 62443' },

  { id:'IT1', kategori:'Siber/IT', tip:'yapisal_olmayan', baslik:'OT/SCADA Siber Güvenlik Denetimi',
    aciklama:'AADY IT Güvenlik §49-52: Operasyonel teknoloji ve SCADA sistemlerinin siber güvenlik açık taraması (IEC 62443).',
    bazPuan:9, karar:'ust', icra:'ulusal', maliyetBant:'yuksek', zorluk:['teknoloji'],
    yonetisim:['uzman','uygulayici'], etkilenenK:20, birimFiyatTL:280000, birim:'Denetim',
    miktar:1, yillikFaydaTL:4200000, rto_saat:8, rpo_saat:2, mevzuat:'IEC 62443 · ISO 27001' },

  { id:'IT2', kategori:'Siber/IT', tip:'yapisal_olmayan', baslik:'Üretim Veri Yedekleme & DR Planı',
    aciklama:'AADY §49: ERP, MES, SCADA verilerinin yedeklenmesi ve felaket kurtarma planı dokümantasyonu.',
    bazPuan:8, karar:'yerel', icra:'yerel', maliyetBant:'orta', zorluk:['yok'],
    yonetisim:['uzman'], etkilenenK:20, birimFiyatTL:95000, birim:'Proje',
    miktar:1, yillikFaydaTL:2100000, rto_saat:24, rpo_saat:4, mevzuat:'ISO 22301 · ISO 27001' },

  { id:'T1', kategori:'Tedarik', tip:'yapisal_olmayan', baslik:'Tedarik Zinciri Sürekliliği Planı',
    aciklama:'AADY §76: Kritik hammadde tedarikçi alternatifleri, stok tamponu ve tedarik kesintisi senaryoları. BCM odaklı.',
    bazPuan:8, karar:'ust', icra:'ulusal', maliyetBant:'orta', zorluk:['yok'],
    yonetisim:['uzman','uygulayici','hazir'], etkilenenK:20, birimFiyatTL:120000, birim:'Plan',
    miktar:1, yillikFaydaTL:5500000, rto_saat:48, rpo_saat:24, mevzuat:'ISO 22301 §8.3 · BCM' },

  { id:'T2', kategori:'Tedarik', tip:'yapisal_olmayan', baslik:'Alternatif Üretim Yeri Planlaması',
    aciklama:'AADY §77: Üretim kesintisi durumunda alternatif tesis/fason üretim protokolleri ve anlaşmaları.',
    bazPuan:9, karar:'ust', icra:'ulusal', maliyetBant:'orta', zorluk:['kapasite'],
    yonetisim:['uzman','uygulayici'], etkilenenK:20, birimFiyatTL:85000, birim:'Plan',
    miktar:1, yillikFaydaTL:7200000, rto_saat:72, rpo_saat:48, mevzuat:'ISO 22301 §8.4' },

  { id:'G1', kategori:'Genel/BCM', tip:'yapisal_olmayan', baslik:'Afet & Acil Durum Yönetim Planı (AADYP)',
    aciklama:'AADY §67-70: AADYP hazırlanması, komşu tesis riskleri, düzenli güncelleme ve AFAD bildirimi.',
    bazPuan:9, karar:'ust', icra:'ulusal', maliyetBant:'orta', zorluk:['yok'],
    yonetisim:['uzman','uygulayici','hazir'], etkilenenK:20, birimFiyatTL:160000, birim:'Plan',
    miktar:1, yillikFaydaTL:4200000, rto_saat:24, rpo_saat:8, mevzuat:'AFAD · ISO 22301 · İSG 6331' },

  { id:'G2', kategori:'Genel/BCM', tip:'yapisal_olmayan', baslik:'ISO 22301 & ISO 45001 Sertifikasyon',
    aciklama:'AADY §74: İş Sürekliliği (22301) + İSG (45001) yönetim sistemi kurulumu ve uluslararası belgelendirme.',
    bazPuan:8, karar:'ust', icra:'ulusal', maliyetBant:'yuksek', zorluk:['kapasite'],
    yonetisim:['uzman','uygulayici'], etkilenenK:20, birimFiyatTL:240000, birim:'Program',
    miktar:1, yillikFaydaTL:3100000, rto_saat:24, rpo_saat:8, mevzuat:'ISO 22301 · ISO 45001' },

  { id:'C1', kategori:'Çevre/SEVESO', tip:'yapisal', baslik:'Atık Su Arıtma Tesisi',
    aciklama:'SATAKOL Form 17 + SEVESO: Arıtma tesisi kurulumu. Çevre mevzuatı uyum + kimyasal sızıntı önleme.',
    bazPuan:7, karar:'ust', icra:'yerel', maliyetBant:'yuksek', zorluk:['kapasite'],
    yonetisim:['uzman','uygulayici'], etkilenenK:50, birimFiyatTL:520000, birim:'Tesis',
    miktar:1, yillikFaydaTL:750000, rto_saat:120, rpo_saat:48, mevzuat:'Çevre Kanunu · SKKY · SEVESO' },

  { id:'SEL1', kategori:'Sel', tip:'yapisal', baslik:'Tesis Drenaj & Su Bariyer Sistemi',
    aciklama:'AADY Sel-Su Baskını Önlemleri: Drenaj kapasitesi artırımı, seyyar bariyer sistemleri, pompa istasyonları.',
    bazPuan:7, karar:'yerel', icra:'yerel', maliyetBant:'orta', zorluk:['toplum'],
    yonetisim:['uzman'], etkilenenK:2, birimFiyatTL:85000, birim:'Tesis',
    miktar:1, yillikFaydaTL:620000, rto_saat:48, rpo_saat:16, mevzuat:'AFAD · Çevre Mevzuatı' },
]

// ── Yardımcı Fonksiyonlar ─────────────────────────────────────────────────────
function hesapla(a: Aksiyon, c: Carpanlar): number {
  const karar = a.karar === 'yerel' ? c.karar_yerel : c.karar_ust
  const icra = a.icra === 'yerel' ? c.icra_yerel : c.icra_ulusal
  const maliyet = a.maliyetBant === 'dusuk' ? c.maliyet_dusuk : a.maliyetBant === 'orta' ? c.maliyet_orta : c.maliyet_yuksek
  const zorluk = a.zorluk.includes('yok') || a.zorluk.length === 0 ? c.zorluk_yok : c.zorluk_var
  const yon = a.yonetisim.length > 0 ? c.yonetisim : 0.5
  const k = a.etkilenenK
  const fayda = k <= 1 ? c.fayda_kucuk * k
    : k <= 10 ? c.fayda_kucuk + (k - 1) / 9 * (c.fayda_orta - c.fayda_kucuk)
    : Math.min(c.fayda_buyuk, c.fayda_orta * k / 10)
  return +(a.bazPuan * karar * icra * maliyet * zorluk * yon * fayda).toFixed(1)
}

function aadySkoru(c: AADYCevap): number {
  const b = [c.deprem_onlem, c.yangin_sistem, c.sel_onlem, c.enerji_guvenlik,
             c.it_guvenlik, c.makine_koruma, c.acil_durum, c.yapisal_olmayan, c.surec_risk]
  return Math.round(b.reduce((s, v) => s + v, 0) / b.length / 4 * 100)
}

function tl(n: number) {
  if (n >= 1_000_000) return `₺${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `₺${(n / 1_000).toFixed(0)}K`
  return `₺${n.toLocaleString('tr-TR')}`
}

const KAT_RENK: Record<string, string> = {
  Deprem: '#EF4444', Yangın: '#F97316', Enerji: '#F59E0B',
  'Siber/IT': '#8B5CF6', Tedarik: '#1B4FD8', 'Genel/BCM': '#0891B2',
  'Çevre/SEVESO': '#22C55E', Sel: '#0EA5E9'
}
const MAL_RENK: Record<MaliyetBant, string> = { yuksek: '#EF4444', orta: '#F59E0B', dusuk: '#22C55E' }
const MAL_L: Record<MaliyetBant, string> = { yuksek: 'Yüksek', orta: 'Orta', dusuk: 'Düşük' }

// ─────────────────────────────────────────────────────────────────────────────
export default function SanayiMaliyetPage() {
  const [sekme, setSekme] = useState<'envanter' | 'aady' | 'maliyet' | 'bia' | 'parametreler'>('envanter')
  const [satakol, setSatakol] = useState<SatakolVeri>(SATAKOL_BOŞ)
  const [aady, setAady] = useState<AADYCevap>(AADY_BOŞ)
  const [aksiyonlar, setAksiyonlar] = useState<Aksiyon[]>(AKSIYONLAR_BASLANGIC)
  const [carpanlar, setCarpanlar] = useState<Carpanlar>(CARPAN_VARSAYILAN)
  const [secili, setSecili] = useState<Set<string>>(new Set(AKSIYONLAR_BASLANGIC.slice(0, 7).map(a => a.id)))
  const [duzenleId, setDuzenleId] = useState<string | null>(null)
  const [carpanDuzenle, setCarpanDuzenle] = useState(false)
  const [carpanTemp, setCarpanTemp] = useState<Carpanlar>(CARPAN_VARSAYILAN)
  const [filKat, setFilKat] = useState('tumu')
  const [kaydetBilgi, setKaydetBilgi] = useState('')

  const toggle = (id: string) => {
    const s = new Set(secili); s.has(id) ? s.delete(id) : s.add(id); setSecili(s)
  }

  const pAksiyonlar = aksiyonlar
    .map(a => ({ ...a, oncelikPuani: hesapla(a, carpanlar) }))
    .sort((a, b) => b.oncelikPuani - a.oncelikPuani)

  const filtreli = pAksiyonlar.filter(a => filKat === 'tumu' || a.kategori === filKat)
  const secilenList = pAksiyonlar.filter(a => secili.has(a.id))
  const topMaliyet = secilenList.reduce((s, a) => s + a.birimFiyatTL * a.miktar, 0)
  const topFayda = secilenList.reduce((s, a) => s + a.yillikFaydaTL, 0)
  const roi = topMaliyet > 0 ? Math.round(topFayda / topMaliyet * 100) : 0
  const maxPuan = pAksiyonlar[0]?.oncelikPuani || 1
  const skoru = aadySkoru(aady)

  const sD = (k: keyof SatakolVeri, v: any) => setSatakol(p => ({ ...p, [k]: v }))
  const aD = (k: keyof AADYCevap, v: any) => setAady(p => ({ ...p, [k]: v }))

  const kaydet = () => {
    setKaydetBilgi('✓ Kaydedildi — ' + new Date().toLocaleTimeString('tr-TR'))
    setTimeout(() => setKaydetBilgi(''), 3000)
  }

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    .fd{font-family:'Playfair Display',serif} .fm{font-family:'DM Mono',monospace}
    .pb{background:#F1F0EF;border-radius:99px;overflow:hidden}
    .pf{height:100%;border-radius:99px;transition:width .5s}
    .bdg{display:inline-flex;align-items:center;padding:2px 9px;border-radius:99px;font-size:11px;font-weight:600;line-height:1.6;white-space:nowrap}
    .card{background:white;border-radius:14px;border:1px solid #ECEAE8}
    .sb{padding:10px 18px;border:none;background:transparent;cursor:pointer;font-size:13px;font-weight:500;color:#9CA3AF;border-bottom:2px solid transparent;transition:all .2s;font-family:'DM Sans',sans-serif;white-space:nowrap}
    .sb.on{color:#0A1628;border-bottom-color:#F97316;font-weight:700}
    .sb:hover:not(.on){color:#374151}
    .rh:hover{background:#FFFBF5!important}
    input[type=text],input[type=number],input[type=email],textarea,select{outline:none;border:1px solid #E5E3E1;border-radius:8px;padding:7px 10px;font-size:12px;font-family:'DM Sans',sans-serif;color:#374151;background:white;width:100%}
    input:focus,textarea:focus,select:focus{border-color:#F97316;box-shadow:0 0 0 3px #FFF7ED}
    textarea{resize:vertical}
    table{border-collapse:collapse;width:100%}
    th{padding:9px 14px;text-align:left;font-size:10px;font-weight:700;color:#A8A29E;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #F1F0EF;background:#FAFAF9;white-space:nowrap}
    td{padding:11px 14px;border-bottom:1px solid #F7F6F5;vertical-align:middle}
    .btn{border:none;border-radius:8px;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:600;transition:all .15s;white-space:nowrap}
    .btn-o{background:#F97316;color:white;padding:8px 16px;font-size:12px}
    .btn-o:hover{background:#EA6F10}
    .btn-w{background:white;color:#374151;border:1px solid #E5E3E1;padding:7px 14px;font-size:12px}
    .btn-w:hover{background:#FAFAF9}
    .fl{font-size:10px;font-weight:700;color:#6B7280;margin-bottom:4px;display:block;text-transform:uppercase;letter-spacing:.06em}
    .fg{display:flex;flex-direction:column;margin-bottom:11px}
    .chk{width:16px;height:16px;border-radius:4px;border:2px solid #CBD5E1;cursor:pointer;appearance:none;-webkit-appearance:none;flex-shrink:0;transition:all .15s;margin-top:1px}
    .chk:checked{background:#F97316;border-color:#F97316}
    .chk:checked::after{content:'✓';display:block;color:white;font-size:10px;font-weight:700;text-align:center;line-height:1.3}
    .sk{display:flex;gap:5px;flex-wrap:wrap}
    .sk-b{padding:5px 11px;border-radius:8px;border:1px solid #E5E3E1;font-size:11px;cursor:pointer;font-family:'DM Sans',sans-serif;background:white;transition:all .15s;font-weight:500;color:#6B7280}
    .sk-b.on{border-color:#F97316;background:#FFF7ED;color:#EA580C;font-weight:700}
    .sek-h{font-size:11px;font-weight:700;color:#0A1628;padding:8px 0 5px;border-bottom:2px solid #F97316;margin-bottom:12px;text-transform:uppercase;letter-spacing:.07em}
    .info{background:#FFF7ED;border:1px solid #FED7AA;border-radius:10px;padding:12px 16px;font-size:11px;color:#92400E;line-height:1.7;margin-bottom:16px}
    @keyframes fi{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}} .fi{animation:fi .2s ease}
  `

  const SkalaRow = ({ alan, etiket }: { alan: keyof AADYCevap; etiket: string }) => (
    <div className="fg">
      <label className="fl">{etiket}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div className="sk">
          {[0, 1, 2, 3, 4].map(i => (
            <button key={i} className={'sk-b' + (aady[alan] === i ? ' on' : '')} onClick={() => aD(alan, i)}>
              {i === 0 ? 'Yok' : i}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 11, color: '#A8A29E' }}>
          {aady[alan] === 0 ? 'Hiç yok' : aady[alan] === 1 ? 'Çok yetersiz' : aady[alan] === 2 ? 'Kısmi' : aady[alan] === 3 ? 'Yeterli' : 'Tam / İdeal'}
        </span>
      </div>
    </div>
  )

  const SkorKutu = ({ l, v, r, max }: { l: string; v: number; r: string; max?: number }) => (
    <div style={{ textAlign: 'center', padding: '10px 8px', background: 'white', borderRadius: 10, border: '1px solid #ECEAE8' }}>
      <div className="fm" style={{ fontSize: max ? 16 : 20, fontWeight: 800, color: r, lineHeight: 1 }}>{max ? `${v}/${max}` : v}</div>
      <div style={{ fontSize: 9, color: '#A8A29E', marginTop: 3, textTransform: 'uppercase', letterSpacing: '.05em', lineHeight: 1.4 }}>{l}</div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F8F6F3', fontFamily: "'DM Sans',sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── BAŞLIK ─────────────────────────────────────────────────────────── */}
      <div style={{ background: 'white', borderBottom: '1px solid #ECEAE8', padding: '0 32px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '16px 0 12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <a href="/uzman/dashboard" style={{ fontSize: 11, color: '#A8A29E', textDecoration: 'none' }}>Uzman Paneli</a>
                <span style={{ color: '#D1CEC9' }}>/</span>
                <span style={{ fontSize: 11, color: '#F97316', fontWeight: 600 }}>Sanayi Tesis Analizi</span>
              </div>
              <h1 className="fd" style={{ fontSize: 21, fontWeight: 800, color: '#0A1628', marginBottom: 4 }}>
                Sanayi Tesis Envanter & Maliyet Analizi
              </h1>
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                <span className="bdg" style={{ background: '#FFF7ED', color: '#C2410C' }}>SATAKOL — Tesis Envanter Formu</span>
                <span className="bdg" style={{ background: '#FFF7ED', color: '#C2410C' }}>AADY Kontrol Listesi 2025</span>
                <span className="bdg" style={{ background: '#F0FFF4', color: '#166534' }}>ISO 22301 · ISO 45001 · SEVESO · IEC 62443</span>
                {kaydetBilgi && <span className="bdg" style={{ background: '#DCFCE7', color: '#166534' }}>{kaydetBilgi}</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {[
                { l: 'AADY Skoru', v: skoru, r: skoru >= 70 ? '#22C55E' : skoru >= 40 ? '#F59E0B' : '#EF4444' },
                { l: 'Seçili', v: secili.size, r: '#F97316' },
                { l: 'Yatırım', v: tl(topMaliyet), r: '#EF4444' },
                { l: 'ROI', v: '%' + roi, r: '#22C55E' },
              ].map(k => (
                <div key={k.l} style={{ textAlign: 'center', padding: '9px 14px', background: '#FAFAF9', borderRadius: 11, border: '1px solid #ECEAE8', minWidth: 80 }}>
                  <div className="fm" style={{ fontSize: 16, fontWeight: 700, color: k.r as string, lineHeight: 1 }}>{k.v}</div>
                  <div style={{ fontSize: 9, color: '#A8A29E', marginTop: 3, textTransform: 'uppercase', letterSpacing: '.05em' }}>{k.l}</div>
                </div>
              ))}
              <button className="btn btn-o" onClick={kaydet}>💾 Kaydet</button>
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            {([
              { id: 'envanter', l: '🏭 Tesis Envanteri (SATAKOL)' },
              { id: 'aady', l: '📋 Dayanıklılık Kontrol (AADY)' },
              { id: 'maliyet', l: `💰 Maliyet & Öncelik (${aksiyonlar.length})` },
              { id: 'bia', l: '⚠️ İş Etki Analizi' },
              { id: 'parametreler', l: '⚙️ Öncelikleme' },
            ] as { id: typeof sekme; l: string }[]).map(s => (
              <button key={s.id} className={'sb' + (sekme === s.id ? ' on' : '')} onClick={() => setSekme(s.id)}>{s.l}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 32px 72px' }}>

        {/* ════════════════════════════════════════════════════════════════════
            SATAKOL ENVANTERİ
        ════════════════════════════════════════════════════════════════════ */}
        {sekme === 'envanter' && (
          <div className="fi">
            <div className="info">
              📋 <strong>SATAKOL — Sanayi Tesisleri Acil Durum/Afet Kontrol Listesi.</strong> Her tesis için ayrı doldurulmalıdır.
              Toplanan veriler; risk haritası, tedarik zinciri analizi, AFAD koordinasyonu ve bölgesel dayanıklılık değerlendirmesinde kullanılacaktır.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>

              {/* Sütun 1 — Kimlik & Konum */}
              <div>
                <div className="card" style={{ padding: 20, marginBottom: 14 }}>
                  <p className="sek-h">1 — Firma Kimlik Bilgileri</p>
                  <div className="fg"><label className="fl">Ticaret Sicil No</label>
                    <input type="text" value={satakol.ticaret_sicil} onChange={e => sD('ticaret_sicil', e.target.value)} /></div>
                  <div className="fg"><label className="fl">Firma Adı / Ticaret Ünvanı</label>
                    <input type="text" placeholder="Oda kayıtlarındaki resmî isim" value={satakol.firma_adi} onChange={e => sD('firma_adi', e.target.value)} /></div>
                  <div className="fg"><label className="fl">KEP Adresi</label>
                    <input type="email" value={satakol.kep_adresi} onChange={e => sD('kep_adresi', e.target.value)} /></div>
                  <div className="fg"><label className="fl">NACE Kodu</label>
                    <input type="text" placeholder="ör. C2410 — Çelik Üretimi" value={satakol.nace_kodu} onChange={e => sD('nace_kodu', e.target.value)} /></div>
                  <div className="fg"><label className="fl">Faaliyet Konusu / Üretilen Ürün</label>
                    <textarea rows={2} placeholder="Ana iş kolu, üretim türü veya hizmet alanı" value={satakol.faaliyet} onChange={e => sD('faaliyet', e.target.value)} /></div>
                </div>

                <div className="card" style={{ padding: 20 }}>
                  <p className="sek-h">2 — Adres & Konum</p>
                  <div className="fg"><label className="fl">Adres Bilgisi</label>
                    <textarea rows={2} placeholder="Mahalle, cadde, bina no, ilçe, posta kodu" value={satakol.adres} onChange={e => sD('adres', e.target.value)} /></div>
                  <div className="fg"><label className="fl">Koordinat (Enlem – Boylam)</label>
                    <input type="text" placeholder="ör. 40.987N, 29.124E" value={satakol.koordinat} onChange={e => sD('koordinat', e.target.value)} /></div>
                </div>
              </div>

              {/* Sütun 2 — Yapısal & İşletme */}
              <div>
                <div className="card" style={{ padding: 20, marginBottom: 14 }}>
                  <p className="sek-h">3 — Alan & Yapısal Özellikler</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                    {[
                      { l: 'Toplam Alan (m²)', k: 'alan_m2' },
                      { l: 'Açık Alan (m²)', k: 'acik_alan_m2' },
                      { l: 'Kapalı Alan (m²)', k: 'kapali_alan_m2' },
                    ].map(f => (
                      <div key={f.k} className="fg" style={{ margin: 0 }}>
                        <label className="fl">{f.l}</label>
                        <input type="number" value={satakol[f.k as keyof SatakolVeri] as string} onChange={e => sD(f.k as keyof SatakolVeri, e.target.value)} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
                    <div className="fg" style={{ margin: 0 }}>
                      <label className="fl">Yapım Yılı</label>
                      <input type="number" placeholder="ör. 1998" value={satakol.yapi_yili} onChange={e => sD('yapi_yili', e.target.value)} />
                    </div>
                    <div className="fg" style={{ margin: 0 }}>
                      <label className="fl">Kat Adedi</label>
                      <input type="text" placeholder="ör. 2 + bodrum" value={satakol.kat_adeti} onChange={e => sD('kat_adeti', e.target.value)} />
                    </div>
                  </div>
                  <div className="fg">
                    <label className="fl">Yapı Tipi</label>
                    <select value={satakol.yapi_tipi} onChange={e => sD('yapi_tipi', e.target.value)}>
                      {['betonarme', 'çelik', 'prefabrik', 'yığma', 'karma'].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div className="fg">
                    <label className="fl">Tesisin Türü</label>
                    <select value={satakol.tesis_turu} onChange={e => sD('tesis_turu', e.target.value)}>
                      {['üretim', 'kimya', 'gıda-içecek', 'lojistik-depo', 'enerji', 'tekstil', 'metal işleme', 'plastik-kauçuk', 'ilaç', 'savunma-hava', 'makine-ekipman', 'elektronik', 'diğer'].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                </div>

                <div className="card" style={{ padding: 20 }}>
                  <p className="sek-h">4 — İşletme Bilgileri</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                    <div className="fg" style={{ margin: 0 }}>
                      <label className="fl">Toplam Çalışan</label>
                      <select value={satakol.calisan_sayisi} onChange={e => sD('calisan_sayisi', e.target.value)}>
                        {['0–50', '51–250', '251–500', '500+'].map(v => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                    <div className="fg" style={{ margin: 0 }}>
                      <label className="fl">Vardiya Sayısı</label>
                      <select value={satakol.vardiya} onChange={e => sD('vardiya', e.target.value)}>
                        {['1', '2', '3 (7/24)'].map(v => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                    <div className="fg" style={{ margin: 0 }}>
                      <label className="fl">Beyaz Yaka</label>
                      <input type="number" placeholder="kişi sayısı" value={satakol.calisan_beyaz} onChange={e => sD('calisan_beyaz', e.target.value)} />
                    </div>
                    <div className="fg" style={{ margin: 0 }}>
                      <label className="fl">Mavi Yaka</label>
                      <input type="number" placeholder="kişi sayısı" value={satakol.calisan_mavi} onChange={e => sD('calisan_mavi', e.target.value)} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                    <div className="fg" style={{ margin: 0 }}>
                      <label className="fl">Mülk / Kira</label>
                      <select value={satakol.mulk_sahipligi} onChange={e => sD('mulk_sahipligi', e.target.value)}>
                        {['mülk', 'kira'].map(v => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                    <div className="fg" style={{ margin: 0 }}>
                      <label className="fl">Enerji Kaynağı</label>
                      <select value={satakol.enerji_kaynagi} onChange={e => sD('enerji_kaynagi', e.target.value)}>
                        {['elektrik', 'doğalgaz', 'kömür', 'yenilenebilir', 'karma'].map(v => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 10 }}>
                    {([['aritma_tesisi', 'Arıtma Tesisi Var'], ['seveso_yukumluluk', 'SEVESO Yükümlülüğü']] as [keyof SatakolVeri, string][]).map(([k, l]) => (
                      <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#374151', cursor: 'pointer' }}>
                        <input type="checkbox" className="chk" checked={satakol[k] as boolean} onChange={e => sD(k, e.target.checked)} />{l}
                      </label>
                    ))}
                  </div>
                  {satakol.seveso_yukumluluk && (
                    <div className="fg">
                      <label className="fl">SEVESO Seviyesi</label>
                      <select value={satakol.seveso_seviye} onChange={e => sD('seveso_seviye', e.target.value)}>
                        <option value="">Seçin</option>
                        <option value="alt">Alt Seviye Tesis</option>
                        <option value="ust">Üst Seviye Tesis</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Sütun 3 — Tehlikeli Madde & İletişim */}
              <div>
                <div className="card" style={{ padding: 20, marginBottom: 14 }}>
                  <p className="sek-h">5 — Tehlikeli Madde & Nakliye</p>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#374151', cursor: 'pointer', marginBottom: 12 }}>
                    <input type="checkbox" className="chk" checked={satakol.tehlikeli_madde_var} onChange={e => sD('tehlikeli_madde_var', e.target.checked)} />
                    <span><strong>Tehlikeli Madde Kullanımı</strong> Mevcut</span>
                  </label>
                  {satakol.tehlikeli_madde_var && (
                    <>
                      <div className="fg"><label className="fl">Madde Türü & Miktar</label>
                        <textarea rows={2} placeholder="ör. Aseton 500L, H₂SO₄ 200L" value={satakol.tehlikeli_madde_aciklama} onChange={e => sD('tehlikeli_madde_aciklama', e.target.value)} /></div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <div className="fg" style={{ margin: 0 }}>
                          <label className="fl">CAS Numarası</label>
                          <input type="text" placeholder="ör. 67-64-1" value={satakol.tehlikeli_cas} onChange={e => sD('tehlikeli_cas', e.target.value)} />
                        </div>
                        <div className="fg" style={{ margin: 0 }}>
                          <label className="fl">NFPA 704 Kodu</label>
                          <input type="text" placeholder="ör. F3-H1-R0" value={satakol.nfpa_kodu} onChange={e => sD('nfpa_kodu', e.target.value)} />
                        </div>
                      </div>
                    </>
                  )}
                  <div className="fg"><label className="fl">Depolama Şekli</label>
                    <textarea rows={2} placeholder="Tank, varil, IBC, açık alan vb." value={satakol.depolama_sekli} onChange={e => sD('depolama_sekli', e.target.value)} /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                    <div className="fg" style={{ margin: 0 }}>
                      <label className="fl">Depo Alanı (m²)</label>
                      <input type="number" value={satakol.depo_m2} onChange={e => sD('depo_m2', e.target.value)} />
                    </div>
                    <div style={{ paddingTop: 18, display: 'flex', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, cursor: 'pointer' }}>
                        <input type="checkbox" className="chk" checked={satakol.kompartiman} onChange={e => sD('kompartiman', e.target.checked)} />
                        Kompartımanlama Var
                      </label>
                    </div>
                  </div>
                  <div className="fg"><label className="fl">Nakliye / Taşıma Türü</label>
                    <select value={satakol.nakliye_turu} onChange={e => sD('nakliye_turu', e.target.value)}>
                      {['karayolu', 'demiryolu', 'denizyolu', 'havayolu', 'çok modlu'].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                </div>

                <div className="card" style={{ padding: 20 }}>
                  <p className="sek-h">6 — Yetkili Kişi İletişim</p>
                  {[
                    { l: 'Ad Soyad', k: 'yetkili_kisi' as keyof SatakolVeri, t: 'text' },
                    { l: 'Unvan', k: 'yetkili_unvan' as keyof SatakolVeri, t: 'text' },
                    { l: 'Telefon', k: 'yetkili_tel' as keyof SatakolVeri, t: 'text' },
                    { l: 'E-posta', k: 'yetkili_email' as keyof SatakolVeri, t: 'email' },
                  ].map(f => (
                    <div key={f.k} className="fg">
                      <label className="fl">{f.l}</label>
                      <input type={f.t} value={satakol[f.k] as string} onChange={e => sD(f.k, e.target.value)} />
                    </div>
                  ))}
                  <div className="fg"><label className="fl">Ek Bilgiler / Diğer Teknik Bilgiler</label>
                    <textarea rows={2} value={satakol.ek_bilgi} onChange={e => sD('ek_bilgi', e.target.value)} /></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            AADY KONTROL LİSTESİ
        ════════════════════════════════════════════════════════════════════ */}
        {sekme === 'aady' && (
          <div className="fi">
            <div className="info">
              📊 <strong>AADY Kontrol Listesi 2025</strong> — Afet/Acil Durum Dayanıklılık Kontrol Listesi.
              Her bölüme <strong>0–4 puan</strong> verin (0=Yok, 1=Çok Yetersiz, 2=Kısmi, 3=Yeterli, 4=Tam/İdeal).
              Her bina/mekan için ayrı ayrı doldurulmalıdır.
            </div>

            {/* Skor özeti */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 20 }}>
              <SkorKutu l="AADY Genel Skoru" v={skoru} r={skoru >= 70 ? '#22C55E' : skoru >= 40 ? '#F59E0B' : '#EF4444'} />
              <SkorKutu l="Deprem Önlemleri" v={aady.deprem_onlem} r="#EF4444" max={4} />
              <SkorKutu l="Yangın Sistemi" v={aady.yangin_sistem} r="#F97316" max={4} />
              <SkorKutu l="IT / OT Güvenlik" v={aady.it_guvenlik} r="#8B5CF6" max={4} />
              <SkorKutu l="Acil Durum Ekibi" v={aady.acil_durum} r="#1B4FD8" max={4} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>

              {/* Yapısal Durum */}
              <div>
                <div className="card" style={{ padding: 20, marginBottom: 14 }}>
                  <p className="sek-h">Yapısal Durum</p>
                  {[
                    { l: 'Bina Kullanım Amacı', k: 'bina_kullanim' as keyof AADYCevap, opts: ['üretim', 'ofis/idari', 'depo', 'karma'] },
                    { l: 'Kat Yüksekliği', k: 'kat_yukseklik' as keyof AADYCevap, opts: ['1-4 kat', '5-8 kat', '9-19 kat', '20+'] },
                    { l: 'Yapı Kullanım Belgesi (İskan)', k: 'iskan_belgesi' as keyof AADYCevap, opts: ['var', 'yok'] },
                    { l: 'Sahiplik Durumu', k: 'sahiplik' as keyof AADYCevap, opts: ['mülk sahibi', 'kiracı'] },
                    { l: 'Mimari Proje', k: 'mimari_proje' as keyof AADYCevap, opts: ['var', 'yok'] },
                    { l: 'Taşıyıcı Sistem Proje Çizimi', k: 'tasiyici_proje' as keyof AADYCevap, opts: ['var', 'yok'] },
                    { l: 'Taşıyıcı Hesap Dosyası', k: 'tasiyici_hesap' as keyof AADYCevap, opts: ['var', 'yok'] },
                    { l: 'Güçlendirme Yapılmış mı?', k: 'guclendirilmis' as keyof AADYCevap, opts: ['tam', 'kısmi', 'yok'] },
                    { l: 'Zemin Etüdü', k: 'zemin_etut' as keyof AADYCevap, opts: ['var', 'yok'] },
                    { l: 'Zemin Sınıflaması', k: 'zemin_sinifi' as keyof AADYCevap, opts: ['ZA', 'ZB', 'ZC', 'ZD', 'ZE', 'Bilinmiyor'] },
                    { l: 'Yapısal Durum (1=Çok Kötü → 5=Çok İyi)', k: 'yapisal_durum' as keyof AADYCevap, opts: ['1', '2', '3', '4', '5'] },
                    { l: 'Yapısal Kompartımanlama', k: 'kompartiman_var' as keyof AADYCevap, opts: ['var', 'yok'] },
                  ].map(f => (
                    <div key={f.k} className="fg">
                      <label className="fl">{f.l}</label>
                      <select value={aady[f.k] as string} onChange={e => aD(f.k, e.target.value)}>
                        {f.opts.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>

                <div className="card" style={{ padding: 20 }}>
                  <p className="sek-h">Süreç Riskleri</p>
                  <p style={{ fontSize: 11, color: '#A8A29E', marginBottom: 12, lineHeight: 1.6 }}>
                    Riskli gördüğünüz madde, malzeme, süreç vb. belirtiniz (parlayıcı, patlayıcı, yanıcı vb.)
                  </p>
                  {[
                    { l: 'Riskli Girdi / Hammadde', k: 'riskli_girdi' as keyof AADYCevap },
                    { l: 'Riskli Proses / Süreçler', k: 'riskli_proses' as keyof AADYCevap },
                    { l: 'Riskli Ürün', k: 'riskli_urun' as keyof AADYCevap },
                    { l: 'Riskli Depolama', k: 'riskli_depo' as keyof AADYCevap },
                    { l: 'Riskli Atık', k: 'riskli_atik' as keyof AADYCevap },
                    { l: 'Riskli Makine-Ekipman', k: 'riskli_makine' as keyof AADYCevap },
                    { l: 'Riskli Lojistik (Tedarik-Nakliye)', k: 'riskli_lojistik' as keyof AADYCevap },
                  ].map(f => (
                    <div key={f.k} className="fg">
                      <label className="fl">{f.l}</label>
                      <input type="text" value={aady[f.k] as string} onChange={e => aD(f.k, e.target.value)} placeholder="Açıklayınız..." />
                    </div>
                  ))}
                </div>
              </div>

              {/* Sistem Skorları */}
              <div>
                <div className="card" style={{ padding: 20, marginBottom: 14 }}>
                  <p className="sek-h">Sistem Değerlendirmesi (0 – 4)</p>
                  {([
                    ['deprem_onlem', 'Deprem İçin Yapısal Önlemler'],
                    ['yangin_sistem', 'Yangın Önleme Sistemleri'],
                    ['sel_onlem', 'Sel – Su Baskınına Karşı Önlemler'],
                    ['enerji_guvenlik', 'Enerji Güvenliği Sistemleri'],
                    ['it_guvenlik', 'IT Güvenlik & OT/SCADA Koruma'],
                    ['makine_koruma', 'Makine Koruma Sistemleri'],
                    ['acil_durum', 'Acil Durum Sistemleri'],
                    ['yapisal_olmayan', 'Yapısal Olmayan Önlemler'],
                    ['surec_risk', 'Süreç Risk Yönetimi'],
                  ] as [keyof AADYCevap, string][]).map(([alan, et]) => (
                    <SkalaRow key={alan} alan={alan} etiket={et} />
                  ))}
                </div>

                <div className="card" style={{ padding: 20 }}>
                  <p className="sek-h">Üretimin Stratejik Önemi</p>
                  <div className="fg">
                    <label className="fl">Stratejik Önem Düzeyi</label>
                    <select value={aady.stratejik_onem} onChange={e => aD('stratejik_onem', e.target.value)}>
                      {['ticari', 'bölgesel', 'ulusal', 'global', 'kritik altyapı'].map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <p style={{ fontSize: 11, color: '#A8A29E', lineHeight: 1.6 }}>
                    Üretimi Yapılan Ürünler stratejik önem arz ediyor mu? (Ulusal, Bölgesel, Global, Ticari vb.)
                  </p>
                </div>
              </div>

              {/* Yönetim & Destek */}
              <div>
                <div className="card" style={{ padding: 20, marginBottom: 14 }}>
                  <p className="sek-h">Yapısal Olmayan & Yönetim</p>
                  {[
                    { l: 'Makine-Teçhizat Sabitlenmiş mi?', k: 'makine_sabitleme' as keyof AADYCevap, opts: ['tam', 'kısmi', 'yok'] },
                    { l: 'Tehlikeli Madde Depolama Uyumu', k: 'tehlikeli_depo' as keyof AADYCevap, opts: ['tam uyumlu', 'kısmi', 'yok'] },
                    { l: 'Afet & Acil Durum Yönetim Planı', k: 'afet_plani' as keyof AADYCevap, opts: ['güncel', 'var-eski', 'yok'] },
                    { l: 'Plan Düzenli Güncelleniyor mu?', k: 'afet_plani_guncelleme' as keyof AADYCevap, opts: ['her yıl', '2 yılda bir', 'yok'] },
                    { l: 'Yönetici & Personel Eğitimi', k: 'egitim' as keyof AADYCevap, opts: ['düzenli', 'ara sıra', 'yok'] },
                    { l: 'Düzenli Tatbikat Yapılıyor mu?', k: 'tatbikat' as keyof AADYCevap, opts: ['düzenli', 'ara sıra', 'yok'] },
                    { l: 'Tedarik Zinciri Sürekliliği', k: 'tedarik_plani' as keyof AADYCevap, opts: ['var', 'kısmi', 'yok'] },
                    { l: 'Alternatif Üretim Yeri', k: 'alt_uretim' as keyof AADYCevap, opts: ['belirli ve planlı', 'planlanıyor', 'yok'] },
                  ].map(f => (
                    <div key={f.k} className="fg">
                      <label className="fl">{f.l}</label>
                      <select value={aady[f.k] as string} onChange={e => aD(f.k, e.target.value)}>
                        {f.opts.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
                    {([
                      ['acil_ekip', 'Acil Durum Ekibi Var'],
                      ['kilit_personel', 'Kilit Personel Tanımlı'],
                      ['sigorta_var', 'İşyeri Sigortası Var'],
                      ['komsu_risk_biliniyor', 'Komşu Tesis Riskleri Biliniyor'],
                      ['kendi_risk_biliniyor', 'Kendi Risklerimiz Komşulara Bildirildi'],
                    ] as [keyof AADYCevap, string][]).map(([k, l]) => (
                      <label key={k} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, cursor: 'pointer', color: '#374151' }}>
                        <input type="checkbox" className="chk" checked={aady[k] as boolean} onChange={e => aD(k, e.target.checked)} />{l}
                      </label>
                    ))}
                  </div>
                  <div className="fg">
                    <label className="fl">Kalite / Sertifikasyonlar</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {['ISO 9001', 'ISO 14001', 'ISO 22301', 'ISO 27001', 'ISO 45001', 'ISO 50001', 'ISO 22000'].map(s => (
                        <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, cursor: 'pointer', background: aady.iso_sertifika.includes(s) ? '#FFF7ED' : '#FAFAF9', border: '1px solid ' + (aady.iso_sertifika.includes(s) ? '#FED7AA' : '#E5E3E1'), borderRadius: 8, padding: '4px 10px', color: aady.iso_sertifika.includes(s) ? '#EA580C' : '#6B7280', fontWeight: aady.iso_sertifika.includes(s) ? 700 : 400, transition: 'all .15s' }}>
                          <input type="checkbox" style={{ display: 'none' }}
                            checked={aady.iso_sertifika.includes(s)}
                            onChange={e => aD('iso_sertifika', e.target.checked ? [...aady.iso_sertifika, s] : aady.iso_sertifika.filter((x: string) => x !== s))} />
                          {s}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="card" style={{ padding: 20 }}>
                  <p className="sek-h">Afet Destek Kapasitesi (AADY §92–169)</p>
                  <p style={{ fontSize: 11, color: '#A8A29E', marginBottom: 12, lineHeight: 1.6 }}>
                    Olası afet durumunda tesisin sağlayabileceği ekipman ve personel desteği
                  </p>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer', marginBottom: 12, color: '#374151' }}>
                    <input type="checkbox" className="chk" checked={aady.destek_lokasyon} onChange={e => aD('destek_lokasyon', e.target.checked)} />
                    <span>Tesis <strong>destek lokasyonu</strong> olarak kullanılabilir</span>
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {[
                      { l: 'Forklift (Ton)', k: 'forklift_ton' },
                      { l: 'Jeneratör (kW)', k: 'jenerator_kw' },
                      { l: 'Vinç / HP', k: 'vinc_hp' },
                      { l: 'Kamyon (Ton)', k: 'kamyon_ton' },
                      { l: 'Seyyar Kompresör (kW)', k: 'seyyar_kompresör' },
                      { l: 'İlk Yardım Personeli', k: 'ilkyardim_personel' },
                      { l: 'Arama-Kurtarma Personeli', k: 'arama_kurtarma' },
                      { l: 'Yangın Müdahale Personeli', k: 'yangin_personel' },
                      { l: 'Afet Yöneticisi (kişi)', k: 'afet_yoneticisi' },
                      { l: 'ISO 22301 Uzmanı (kişi)', k: 'iso22301_uzman' },
                    ].map(f => (
                      <div key={f.k} className="fg" style={{ margin: 0 }}>
                        <label className="fl">{f.l}</label>
                        <input type="text" value={aady[f.k as keyof AADYCevap] as string} onChange={e => aD(f.k as keyof AADYCevap, e.target.value)} placeholder="0" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            MALİYET ANALİZİ
        ════════════════════════════════════════════════════════════════════ */}
        {sekme === 'maliyet' && (
          <div className="fi">
            {/* KPI şeridi */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 16 }}>
              {[
                { l: 'Seçili Aksiyon', v: String(secili.size), r: '#F97316' },
                { l: 'Toplam Yatırım', v: tl(topMaliyet), r: '#EF4444' },
                { l: 'Yıllık Fayda', v: tl(topFayda), r: '#22C55E' },
                { l: 'ROI', v: '%' + roi, r: '#F59E0B' },
                { l: 'Geri Ödeme', v: topFayda > 0 ? (topMaliyet / topFayda).toFixed(1) + ' yıl' : '—', r: '#8B5CF6' },
              ].map(k => (
                <div key={k.l} style={{ textAlign: 'center', padding: '12px', background: 'white', borderRadius: 12, border: '1px solid #ECEAE8' }}>
                  <div className="fm" style={{ fontSize: 17, fontWeight: 700, color: k.r, lineHeight: 1 }}>{k.v}</div>
                  <div style={{ fontSize: 9, color: '#A8A29E', marginTop: 4, textTransform: 'uppercase' }}>{k.l}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
              <select value={filKat} onChange={e => setFilKat(e.target.value)} style={{ minWidth: 180, width: 'auto' }}>
                <option value="tumu">Tüm Kategoriler</option>
                {[...new Set(aksiyonlar.map(a => a.kategori))].map(k => <option key={k}>{k}</option>)}
              </select>
              <span style={{ fontSize: 12, color: '#A8A29E' }}>{filtreli.length} aksiyon</span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <button className="btn btn-w" onClick={() => setSecili(new Set(aksiyonlar.map(a => a.id)))}>Tümünü Seç</button>
                <button className="btn btn-w" onClick={() => setSecili(new Set())}>Sıfırla</button>
              </div>
            </div>

            <div className="card" style={{ overflow: 'hidden' }}>
              <table>
                <thead>
                  <tr>{['', '#', 'Aksiyon / Kaynak', 'Öncelik Puanı', 'Birim Fiyat', 'Miktar', 'Toplam', 'Yıllık Fayda', 'ROI', 'RTO / RPO'].map(h => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {filtreli.map((a, i) => {
                    const total = a.birimFiyatTL * a.miktar
                    const aROI = total > 0 ? Math.round(a.yillikFaydaTL / total * 100) : 0
                    const isSecili = secili.has(a.id)
                    const pct = (a.oncelikPuani / maxPuan) * 100
                    return (
                      <tr key={a.id} className="rh" style={{ background: isSecili ? '#FFFBF5' : 'white', transition: 'all .15s' }}>
                        <td onClick={() => toggle(a.id)} style={{ cursor: 'pointer' }}>
                          <input type="checkbox" className="chk" checked={isSecili} readOnly />
                        </td>
                        <td style={{ fontWeight: 700, color: '#A8A29E', fontSize: 12 }}>{i + 1}</td>
                        <td style={{ maxWidth: 300 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: KAT_RENK[a.kategori] || '#999', flexShrink: 0 }} />
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#0A1628' }}>{a.baslik}</span>
                          </div>
                          <div style={{ display: 'flex', gap: 5, marginBottom: 3 }}>
                            <span className="bdg" style={{ background: (KAT_RENK[a.kategori] || '#999') + '18', color: KAT_RENK[a.kategori] || '#999', fontSize: 9 }}>{a.kategori}</span>
                            <span className="bdg" style={{ background: MAL_RENK[a.maliyetBant] + '18', color: MAL_RENK[a.maliyetBant], fontSize: 9 }}>{MAL_L[a.maliyetBant]}</span>
                          </div>
                          <div style={{ fontSize: 10, color: '#A8A29E', lineHeight: 1.5 }}>{a.aciklama}</div>
                        </td>
                        <td>
                          <div className="fm" style={{ fontSize: 16, fontWeight: 800, color: '#0A1628', marginBottom: 3 }}>{a.oncelikPuani}</div>
                          <div className="pb" style={{ height: 3, width: 52 }}>
                            <div className="pf" style={{ width: pct + '%', height: 3, background: pct > 66 ? '#22C55E' : pct > 33 ? '#F59E0B' : '#EF4444' }} />
                          </div>
                        </td>
                        <td>
                          <div className="fm" style={{ fontSize: 12, fontWeight: 700, color: MAL_RENK[a.maliyetBant] }}>{tl(a.birimFiyatTL)}</div>
                          <div style={{ fontSize: 10, color: '#A8A29E' }}>/{a.birim}</div>
                        </td>
                        <td><span className="fm" style={{ fontSize: 12 }}>{a.miktar} {a.birim}</span></td>
                        <td><span className="fm" style={{ fontSize: 13, fontWeight: 800 }}>{tl(total)}</span></td>
                        <td><span className="fm" style={{ fontSize: 12, fontWeight: 700, color: '#22C55E' }}>{tl(a.yillikFaydaTL)}</span></td>
                        <td><span className="fm" style={{ fontSize: 12, fontWeight: 700, color: aROI > 200 ? '#22C55E' : aROI > 100 ? '#F59E0B' : '#EF4444' }}>%{aROI}</span></td>
                        <td>
                          <div className="fm" style={{ fontSize: 10, fontWeight: 700, color: '#1B4FD8' }}>RTO: {a.rto_saat}s</div>
                          <div className="fm" style={{ fontSize: 10, fontWeight: 700, color: '#8B5CF6' }}>RPO: {a.rpo_saat}s</div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Kategori özet */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }}>
              <div className="card" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#0A1628', marginBottom: 12 }}>Kategori Maliyet Dağılımı (Tüm Aksiyonlar)</h3>
                {Object.entries(
                  aksiyonlar.reduce((acc, a) => { acc[a.kategori] = (acc[a.kategori] || 0) + a.birimFiyatTL * a.miktar; return acc }, {} as Record<string, number>)
                ).sort((x, y) => y[1] - x[1]).map(([kat, mal]) => {
                  const total = aksiyonlar.reduce((s, a) => s + a.birimFiyatTL * a.miktar, 0)
                  const pct = total > 0 ? Math.round(mal / total * 100) : 0
                  return (
                    <div key={kat} style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: KAT_RENK[kat] || '#999' }} />
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{kat}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <span className="fm" style={{ fontSize: 11, fontWeight: 700 }}>{tl(mal)}</span>
                          <span style={{ fontSize: 11, color: '#A8A29E' }}>%{pct}</span>
                        </div>
                      </div>
                      <div className="pb" style={{ height: 5 }}>
                        <div className="pf" style={{ width: pct + '%', height: 5, background: KAT_RENK[kat] || '#999' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="card" style={{ padding: 20 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#0A1628', marginBottom: 12 }}>Seçili Paket — BCM/YGG Uyum Özeti</h3>
                {[
                  { l: 'Toplam Yatırım', v: tl(topMaliyet), r: '#EF4444' },
                  { l: 'Yıllık Fayda', v: tl(topFayda), r: '#22C55E' },
                  { l: 'ROI', v: '%' + roi, r: '#F59E0B' },
                  { l: 'Geri Ödeme', v: topFayda > 0 ? (topMaliyet / topFayda).toFixed(1) + ' yıl' : '—', r: '#1B4FD8' },
                ].map(k => (
                  <div key={k.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid #F7F6F5' }}>
                    <span style={{ fontSize: 12, color: '#6B7280' }}>{k.l}</span>
                    <span className="fm" style={{ fontSize: 14, fontWeight: 700, color: k.r }}>{k.v}</span>
                  </div>
                ))}
                <div style={{ marginTop: 14, background: '#F0FFF4', border: '1px solid #BBFBD0', borderRadius: 10, padding: '12px 14px' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#166534', marginBottom: 4 }}>ISO 22301 · ISO 45001 · AFAD Uyum</p>
                  <p style={{ fontSize: 11, color: '#166534', lineHeight: 1.65 }}>
                    Seçili <strong>{secili.size}</strong> aksiyon; AADY Kontrol Listesi'ndeki kritik eksiklikleri ve
                    ISO 22301 §8.2–8.5 ile İSG 6331 kapsamındaki YGG yükümlülüklerini büyük ölçüde karşılamaktadır.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            BIA
        ════════════════════════════════════════════════════════════════════ */}
        {sekme === 'bia' && (
          <div className="fi">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div className="card" style={{ padding: 24, borderLeft: '4px solid #F97316' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0A1628', marginBottom: 12 }}>BIA Temel Parametreleri — ISO 22301 §8.2.2</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { l: 'MTD (Max Tolerable Downtime)', v: '72 saat' },
                    { l: 'RTO — Kritik Üretim Hattı', v: '8 saat' },
                    { l: 'RTO — Yardımcı Sistemler', v: '24 saat' },
                    { l: 'RPO — Üretim Verisi', v: '4 saat' },
                    { l: 'RPO — OT/SCADA', v: '1 saat' },
                    { l: 'MTPD Ortalama', v: '48 saat' },
                  ].map(k => (
                    <div key={k.l} style={{ background: '#FAFAF9', borderRadius: 8, padding: '9px 12px', border: '1px solid #F1F0EF' }}>
                      <div style={{ fontSize: 9, color: '#A8A29E', textTransform: 'uppercase', marginBottom: 2 }}>{k.l}</div>
                      <div className="fm" style={{ fontSize: 13, fontWeight: 700, color: '#0A1628' }}>{k.v}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0A1628', marginBottom: 12 }}>Senaryo Bazlı Beklenen Yıllık Kayıp (EAL)</h3>
                {[
                  { s: 'Deprem / Yapısal Hasar', olas: '%8', etki: 'Tam veya kısmi tesis kaybı', sev: 'KRİTİK', r: '#EF4444' },
                  { s: 'Yangın (Tehlikeli Madde)', olas: '%5', etki: 'Maddi hasar + çevre cezası', sev: 'KRİTİK', r: '#F97316' },
                  { s: 'OT/SCADA Siber Saldırı', olas: '%18', etki: 'Üretim durması, veri kaybı', sev: 'YÜKSEK', r: '#8B5CF6' },
                  { s: 'Enerji Kesintisi (uzun süreli)', olas: '%40', etki: 'Kısmi üretim kaybı', sev: 'ORTA', r: '#F59E0B' },
                  { s: 'Tedarik Zinciri Kesintisi', olas: '%25', etki: 'Hammadde eksikliği', sev: 'YÜKSEK', r: '#1B4FD8' },
                  { s: 'Sel / Su Baskını', olas: '%8', etki: 'Altyapı + ekipman hasarı', sev: 'ORTA', r: '#0EA5E9' },
                ].map(s => (
                  <div key={s.s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F7F6F5' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.r, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#0A1628' }}>{s.s}</div>
                        <div style={{ fontSize: 10, color: '#A8A29E' }}>Yıllık olasılık: {s.olas} · {s.etki}</div>
                      </div>
                    </div>
                    <span className="bdg" style={{ background: s.r + '18', color: s.r }}>{s.sev}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0A1628', marginBottom: 14 }}>Kritik Üretim Süreci BIA Matrisi</h3>
              <table>
                <thead>
                  <tr>{['Kritik Süreç', 'Öncelik', 'MTD', 'RTO', 'RPO', 'MAO', 'Etki Düzeyi', 'İlgili Aksiyonlar'].map(h => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {[
                    { s: 'Ana Üretim Hattı', p: 1, mtd: '24s', rto: '8s', rpo: '4s', mao: '24s', etki: 'En Yüksek', aks: 'D1, D2, E1' },
                    { s: 'OT/SCADA Kontrol Sistemi', p: 1, mtd: '8s', rto: '2s', rpo: '1s', mao: '8s', etki: 'Kritik', aks: 'IT1, IT2' },
                    { s: 'Tehlikeli Madde İşleme', p: 1, mtd: '4s', rto: '1s', rpo: '30dk', mao: '4s', etki: 'Kritik + Ceza', aks: 'Y1, Y2' },
                    { s: 'Tedarik / Hammadde', p: 2, mtd: '72s', rto: '24s', rpo: '12s', mao: '72s', etki: 'Yüksek', aks: 'T1, T2' },
                    { s: 'ERP / MES Sistemi', p: 2, mtd: '24s', rto: '8s', rpo: '4s', mao: '24s', etki: 'Orta-Yüksek', aks: 'IT2, G1' },
                    { s: 'Lojistik / Sevkiyat', p: 2, mtd: '48s', rto: '12s', rpo: '8s', mao: '48s', etki: 'Yüksek', aks: 'T1, G1' },
                    { s: 'Yardımcı Sistemler', p: 3, mtd: '72s', rto: '24s', rpo: '12s', mao: '72s', etki: 'Düşük-Orta', aks: 'E1, E2' },
                  ].map((r, i) => (
                    <tr key={i} className="rh">
                      <td style={{ fontWeight: 600, color: '#0A1628', fontSize: 12 }}>{r.s}</td>
                      <td><span className="bdg" style={{ background: r.p === 1 ? '#FEF2F2' : r.p === 2 ? '#FFF7ED' : '#F0FFF4', color: r.p === 1 ? '#991B1B' : r.p === 2 ? '#92400E' : '#166534' }}>P{r.p}</span></td>
                      {[r.mtd, r.rto, r.rpo, r.mao].map((v, j) => <td key={j}><span className="fm" style={{ fontSize: 12, fontWeight: 700, color: '#1B4FD8' }}>{v}</span></td>)}
                      <td><span style={{ fontSize: 11, fontWeight: 600, color: '#EF4444' }}>{r.etki}</span></td>
                      <td><span style={{ fontSize: 11, color: '#F97316', fontWeight: 600 }}>{r.aks}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0A1628', marginBottom: 14 }}>Kesinti Süresine Göre Kümülatif Üretim Kaybı</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
                {[
                  { sure: '1 saat', etki: 'Düşük', sub: 'Kısmi kayıp', r: '#22C55E', pct: 5 },
                  { sure: '4 saat', etki: 'Orta', sub: 'Hat durması', r: '#84CC16', pct: 15 },
                  { sure: '12 saat', etki: 'Önemli', sub: 'Sipariş gecikme', r: '#F59E0B', pct: 35 },
                  { sure: '24 saat', etki: 'Kritik', sub: 'Müşteri kayıpları', r: '#F97316', pct: 55 },
                  { sure: '48 saat', etki: 'Çok Kritik', sub: 'Sözleşme ihlali', r: '#EF4444', pct: 75 },
                  { sure: '72 saat+', etki: 'Yıkıcı', sub: 'İş sürekliliği tehlikede', r: '#DC2626', pct: 100 },
                ].map(t => (
                  <div key={t.sure} style={{ textAlign: 'center', padding: '14px 10px', background: '#FAFAF9', borderRadius: 12, border: '2px solid ' + t.r + '30' }}>
                    <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 5, fontWeight: 600 }}>{t.sure}</div>
                    <div className="fd" style={{ fontSize: 15, fontWeight: 800, color: t.r, lineHeight: 1.2, marginBottom: 2 }}>{t.etki}</div>
                    <div style={{ fontSize: 9, color: '#A8A29E', marginBottom: 8 }}>{t.sub}</div>
                    <div className="pb" style={{ height: 4 }}><div className="pf" style={{ width: t.pct + '%', height: 4, background: t.r }} /></div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: '#A8A29E', marginTop: 12, textAlign: 'center' }}>
                Tesis bazlı günlük üretim kaybı ve ciro etkisi tesisin kapasitesine göre değişmektedir. Regülatör cezası, SEVESO yaptırımı ve itibar kaybı dahil değildir.
              </p>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            PARAMETRELER
        ════════════════════════════════════════════════════════════════════ */}
        {sekme === 'parametreler' && (
          <div className="fi">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0A1628' }}>Öncelikleme Çarpanları</h3>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {carpanDuzenle
                      ? <>
                          <button className="btn btn-o" onClick={() => { setCarpanlar(carpanTemp); setCarpanDuzenle(false) }}>Uygula</button>
                          <button className="btn btn-w" onClick={() => setCarpanDuzenle(false)}>İptal</button>
                        </>
                      : <button className="btn btn-w" onClick={() => { setCarpanTemp({ ...carpanlar }); setCarpanDuzenle(true) }}>Düzenle</button>
                    }
                    <button className="btn btn-w" onClick={() => { setCarpanlar(CARPAN_VARSAYILAN); setCarpanTemp(CARPAN_VARSAYILAN); setCarpanDuzenle(false) }}>Varsayılan</button>
                  </div>
                </div>
                {[
                  { b: 'KARAR', items: [{ l: 'Yerel Makam', k: 'karar_yerel' }, { l: 'Üst Makam', k: 'karar_ust' }] },
                  { b: 'İCRA', items: [{ l: 'Yerel / Az Sayıda Kurum', k: 'icra_yerel' }, { l: 'Ulusal / Çok Sayıda Kurum', k: 'icra_ulusal' }] },
                  { b: 'MALİYET ETKİNLİĞİ', items: [{ l: 'Düşük / Maliyetsiz', k: 'maliyet_dusuk' }, { l: 'Orta Maliyet', k: 'maliyet_orta' }, { l: 'Yüksek / Öngörülemeyen', k: 'maliyet_yuksek' }] },
                  { b: 'UYGULAMA ZORLUĞU', items: [{ l: 'Zorluk Yok', k: 'zorluk_yok' }, { l: 'Zorluk Var', k: 'zorluk_var' }] },
                  { b: 'YÖNETİŞİM', items: [{ l: 'Uzman / Uygulayıcı / Hazırlık Varlığı', k: 'yonetisim' }] },
                  { b: 'FAYDA ÇARPANI (Etkilenen Personel / Toplum)', items: [{ l: '≤1K kişi eşiği', k: 'fayda_kucuk' }, { l: '~10K kişi eşiği', k: 'fayda_orta' }, { l: '≥50K kişi eşiği', k: 'fayda_buyuk' }] },
                ].map(grup => (
                  <div key={grup.b} className="card" style={{ padding: '12px 18px', marginBottom: 10 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: '#0A1628', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8 }}>{grup.b}</p>
                    {grup.items.map(it => (
                      <div key={it.k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderTop: '1px solid #F1F0EF' }}>
                        <span style={{ fontSize: 12, color: '#374151' }}>{it.l}</span>
                        {carpanDuzenle
                          ? <input type="number" step="0.05" min="0" max="10"
                              value={carpanTemp[it.k as keyof Carpanlar]}
                              onChange={e => setCarpanTemp(p => ({ ...p, [it.k]: +e.target.value }))}
                              style={{ width: 64, textAlign: 'center', fontFamily: "'DM Mono',monospace", fontWeight: 700 }} />
                          : <span className="fm" style={{ fontSize: 14, fontWeight: 800, color: '#F97316', background: '#FFF7ED', padding: '3px 12px', borderRadius: 8 }}>×{carpanlar[it.k as keyof Carpanlar]}</span>
                        }
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0A1628', marginBottom: 14 }}>Formül & Canlı Sıralama</h3>
                <div className="card" style={{ padding: 20, marginBottom: 16, borderLeft: '4px solid #F97316' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>Proje Öncelik Puanı =</p>
                  <div style={{ background: '#FFF7ED', borderRadius: 10, padding: '14px 16px', fontFamily: "'DM Mono',monospace", fontSize: 12, color: '#374151', lineHeight: 2.2 }}>
                    Baz Puan (Risk Derecesi 1–10)<br />
                    <span style={{ color: '#1B4FD8' }}>× Karar Çarpanı</span><br />
                    <span style={{ color: '#8B5CF6' }}>× İcra Çarpanı</span><br />
                    <span style={{ color: '#F59E0B' }}>× Maliyet Etkinliği Çarpanı</span><br />
                    <span style={{ color: '#EF4444' }}>× Uygulama Zorluğu Çarpanı</span><br />
                    <span style={{ color: '#22C55E' }}>× Yönetişim Çarpanı</span><br />
                    <span style={{ color: '#F97316' }}>× Fayda Çarpanı (Etkilenen Personel/Toplum)</span>
                  </div>
                </div>

                <h4 style={{ fontSize: 13, fontWeight: 700, color: '#0A1628', marginBottom: 10 }}>
                  {carpanDuzenle ? '🔄 Canlı Önizleme (uygulanmadı)' : 'Mevcut Parametre Sıralaması'}
                </h4>
                <div className="card" style={{ overflow: 'hidden' }}>
                  {(carpanDuzenle
                    ? aksiyonlar.map(a => ({ ...a, oncelikPuani: hesapla(a, carpanTemp) })).sort((a, b) => b.oncelikPuani - a.oncelikPuani)
                    : pAksiyonlar
                  ).map((a, i) => (
                    <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', borderBottom: '1px solid #F7F6F5' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#A8A29E', width: 22, flexShrink: 0 }}>{i + 1}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                          <div style={{ width: 7, height: 7, borderRadius: '50%', background: KAT_RENK[a.kategori] || '#999' }} />
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#0A1628' }}>{a.baslik}</span>
                        </div>
                        <div className="pb" style={{ height: 3, maxWidth: 200 }}>
                          <div className="pf" style={{ width: (a.oncelikPuani / maxPuan * 100) + '%', height: 3, background: KAT_RENK[a.kategori] || '#999' }} />
                        </div>
                      </div>
                      <span className="fm" style={{ fontSize: 16, fontWeight: 800, color: carpanDuzenle ? '#F97316' : '#0A1628', flexShrink: 0 }}>{a.oncelikPuani}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
