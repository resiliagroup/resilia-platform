'use client'
import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'

const IstanbulHarita = dynamic(() => import('./IstanbulHarita'), { ssr: false, loading: () => (
  <div style={{ height: 520, display:'flex', alignItems:'center', justifyContent:'center', color:'#64748B' }}>Harita yükleniyor...</div>
) })
import { createClient } from '@supabase/supabase-js'
import {
  AlertTriangle, Building2, Users, MapPin, Activity, Shield,
  FileText, ChevronRight, TrendingUp, Zap, BarChart3,
  CheckCircle2, XCircle, Clock, Download, RefreshCw, Filter,
  Flame, Droplets, Cpu, Package, Info, ChevronDown, ChevronUp,
  Target, BookOpen, Layers, ArrowUpRight, Loader2
} from 'lucide-react'

/* ══════════════════════════════════════════════════════════════
   SUPABASE
══════════════════════════════════════════════════════════════ */
const sb = createClient(
  'https://gqguwgbopgnpwzjwcexl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5OTgzMywiZXhwIjoyMDg4OTc1ODMzfQ.Ku-JRx8JFH5a3SIj7sGP_Dy_nM89NMMW34gPyxVO_qI',
)

/* ══════════════════════════════════════════════════════════════
   TEMA
══════════════════════════════════════════════════════════════ */
const C = {
  navy:   '#060E1C',
  panel:  '#0D1B2E',
  card:   '#101F35',
  border: '#1E3050',
  teal:   '#2D8A87',
  tealL:  '#3AABA7',
  amber:  '#E8A838',
  red:    '#E84040',
  orange: '#E86030',
  green:  '#28C76F',
  blue:   '#3B82F6',
  purple: '#8B5CF6',
  text:   '#E2EAF4',
  muted:  '#6B8299',
  dim:    '#3A5068',
}

/* ══════════════════════════════════════════════════════════════
   TAB TANIMLARI
══════════════════════════════════════════════════════════════ */
const TABS = [
  { key: 'ozet',      label: 'İstanbul Özet',     icon: <BarChart3 size={14}/> },
  { key: 'tesis',     label: 'Tesis Ağı',          icon: <Building2 size={14}/> },
  { key: 'sektor',    label: 'Sektör Analizi',     icon: <Layers size={14}/> },
  { key: 'harita',    label: 'GIS Harita',         icon: <MapPin size={14}/> },
  { key: 'natech',    label: 'NATECH',             icon: <Flame size={14}/> },
  { key: 'bia',       label: 'BIA / İş Sürekliliği', icon: <Shield size={14}/> },
  { key: 'satakol',   label: 'SATAKOL Formu',      icon: <FileText size={14}/> },
  { key: 'is-modeli', label: 'İş Modeli',          icon: <TrendingUp size={14}/> },
] as const
type Tab = typeof TABS[number]['key']

/* ══════════════════════════════════════════════════════════════
   STATİK VERİ (ISO MARAP bazlı)
══════════════════════════════════════════════════════════════ */
const KPI_DATA = [
  { val: '22.846',    lbl: 'Toplam Tesis',       sub: 'İSO kayıtlı',       color: C.teal,   icon: <Building2 size={20}/> },
  { val: '18.712',    lbl: 'Koordinatlı',         sub: '%81.9 kapsama',     color: C.blue,   icon: <MapPin size={20}/> },
  { val: '1.053.058', lbl: 'Toplam Çalışan',      sub: 'Kayıtlı istihdam',  color: C.purple, icon: <Users size={20}/> },
  { val: '193',       lbl: 'Kritik Tesis',        sub: 'URI ≥ 60',          color: C.red,    icon: <AlertTriangle size={20}/> },
]

const SEKTORLER = [
  { ad: 'İlaç ve Eczacılık',  tesis: 142,  calisanK: 28.4, uri: 41.9, badge: 'YÜKSEK', color: C.red,    natech: true,  nace: '21' },
  { ad: 'Kimya',              tesis: 835,  calisanK: 72.1, uri: 40.1, badge: 'YÜKSEK', color: C.red,    natech: true,  nace: '20' },
  { ad: 'Temel Metal',        tesis: 544,  calisanK: 61.8, uri: 39.1, badge: 'YÜKSEK', color: C.orange, natech: true,  nace: '24' },
  { ad: 'Motorlu Araç',       tesis: 579,  calisanK: 54.2, uri: 33.3, badge: 'ORTA',   color: C.amber,  natech: false, nace: '29' },
  { ad: 'Makine ve Ekipman',  tesis: 1749, calisanK: 89.3, uri: 30.9, badge: 'ORTA',   color: C.amber,  natech: false, nace: '28' },
  { ad: 'Elektrikli Ekipman', tesis: 1098, calisanK: 45.6, uri: 27.8, badge: 'ORTA',   color: C.amber,  natech: false, nace: '27' },
  { ad: 'Metal Ürünleri',     tesis: 2211, calisanK: 92.4, uri: 27.0, badge: 'DÜŞÜK',  color: C.green,  natech: false, nace: '25' },
  { ad: 'Tekstil',            tesis: 1880, calisanK: 88.7, uri: 24.0, badge: 'DÜŞÜK',  color: C.green,  natech: false, nace: '13' },
  { ad: 'Plastik ve Kauçuk',  tesis: 1294, calisanK: 51.2, uri: 23.2, badge: 'DÜŞÜK',  color: C.green,  natech: false, nace: '22' },
  { ad: 'Gıda ve İçecek',     tesis: 1565, calisanK: 76.9, uri: 21.0, badge: 'DÜŞÜK',  color: C.green,  natech: false, nace: '10' },
]

const ILCE_DATA = [
  { ilce: 'Başakşehir',    tesis: 2840, kritik: 28, uri: 34.2 },
  { ilce: 'Çerkezköy',     tesis: 2120, kritik: 22, uri: 32.1 },
  { ilce: 'Tuzla',         tesis: 1980, kritik: 31, uri: 36.8 },
  { ilce: 'Gebze (yakın)', tesis: 1750, kritik: 19, uri: 31.4 },
  { ilce: 'Esenyurt',      tesis: 1420, kritik: 14, uri: 28.7 },
  { ilce: 'Beylikdüzü',    tesis: 980,  kritik: 8,  uri: 26.3 },
  { ilce: 'Arnavutköy',    tesis: 870,  kritik: 11, uri: 29.4 },
  { ilce: 'Silivri',       tesis: 640,  kritik: 7,  uri: 27.1 },
]

const NATECH_DATA = [
  { sektor: 'Kimya (NACE 20)',         tesis: 835,  seveso: 127, kritik: 38, renk: C.red    },
  { sektor: 'İlaç (NACE 21)',          tesis: 142,  seveso: 41,  kritik: 18, renk: C.red    },
  { sektor: 'Temel Metal (NACE 24)',   tesis: 544,  seveso: 62,  kritik: 24, renk: C.orange },
  { sektor: 'Plastik (NACE 22)',       tesis: 1294, seveso: 89,  kritik: 22, renk: C.amber  },
  { sektor: 'Motorlu Araç (NACE 29)', tesis: 579,  seveso: 34,  kritik: 11, renk: C.amber  },
]

const SENDAI_HEDEFLER = [
  { kod: 'A', baslik: 'Küresel Ölüm Azaltımı', mevcut: 22, hedef: 75, renk: C.red   },
  { kod: 'B', baslik: 'Etkilenen Kişi Azaltımı', mevcut: 38, hedef: 75, renk: C.orange },
  { kod: 'C', baslik: 'Ekonomik Kayıp Azaltımı', mevcut: 31, hedef: 75, renk: C.amber  },
  { kod: 'D', baslik: 'Altyapı Zarar Azaltımı', mevcut: 44, hedef: 75, renk: C.blue   },
  { kod: 'E', baslik: 'Ulusal Stratejiler',       mevcut: 55, hedef: 100, renk: C.purple },
  { kod: 'F', baslik: 'Uluslararası İşbirliği',  mevcut: 28, hedef: 75, renk: C.teal   },
  { kod: 'G', baslik: 'Erken Uyarı Erişimi',      mevcut: 47, hedef: 100, renk: C.green  },
]

/* BIA Senaryo verileri */
const BIA_SENARYOLAR = [
  {
    baslik: 'Büyük Deprem (M7.0+)',
    olasilik: 'Yüksek', etki: 'Çok Yüksek',
    rto: '72 saat', rpo: '24 saat',
    etkilenecek: 4820, ekonomikKayipM: 2400,
    color: C.red,
    sektorler: ['Kimya', 'Temel Metal', 'Makine'],
    fazlar: [
      { sure: '0–4 saat',   baslik: 'Acil Müdahale',    adim: 'AFAD koordinasyonu, NATECH tespit, tahliye' },
      { sure: '4–72 saat',  baslik: 'Stabilizasyon',    adim: 'Yapısal değerlendirme, kimyasal sızıntı kontrolü' },
      { sure: '3–30 gün',   baslik: 'Kurtarma',         adim: 'Üretim yeniden başlatma, tedarik zinciri yönetimi' },
      { sure: '1–12 ay',    baslik: 'Yeniden İnşa',     adim: 'Güçlendirme, ISO 22301 yeniden sertifika' },
    ],
  },
  {
    baslik: 'Büyük Yangın / NATECH Olayı',
    olasilik: 'Orta', etki: 'Yüksek',
    rto: '48 saat', rpo: '12 saat',
    etkilenecek: 1240, ekonomikKayipM: 580,
    color: C.orange,
    sektorler: ['Kimya', 'İlaç', 'Plastik'],
    fazlar: [
      { sure: '0–1 saat',   baslik: 'Alarm & İzolasyon', adim: 'Otomatik kesme, bölge tahliyesi, AFAD bildirimi' },
      { sure: '1–12 saat',  baslik: 'Müdahale',          adim: 'İtfaiye koordinasyonu, kimyasal nötralizasyon' },
      { sure: '1–7 gün',    baslik: 'Değerlendirme',     adim: 'Hasar tespiti, çevre kirliliği analizi' },
      { sure: '1–6 ay',     baslik: 'Onarım',            adim: 'Ekipman yenileme, sertifika yenileme' },
    ],
  },
  {
    baslik: 'Siber Saldırı / ICS-SCADA',
    olasilik: 'Orta', etki: 'Yüksek',
    rto: '36 saat', rpo: '8 saat',
    etkilenecek: 890, ekonomikKayipM: 320,
    color: C.purple,
    sektorler: ['Temel Metal', 'Motorlu Araç', 'Makine'],
    fazlar: [
      { sure: '0–2 saat',   baslik: 'Tespit & İzolasyon', adim: 'OT ağı izolasyonu, manuel üretime geçiş' },
      { sure: '2–24 saat',  baslik: 'Analiz',             adim: 'Saldırı kapsamı, etkilenen PLC/SCADA tespiti' },
      { sure: '1–5 gün',    baslik: 'Kurtarma',           adim: 'Temiz yedeklerden yükleme, güvenlik yamaları' },
      { sure: '1–3 ay',     baslik: 'Güçlendirme',        adim: 'Ağ segmentasyonu, IDS/IPS kurulumu' },
    ],
  },
]

/* İş Modeli */
const IS_MODELI = [
  {
    renk: C.teal, icon: <Activity size={18}/>, baslik: 'Platform SaaS',
    desc: 'Yıllık abonelik bazlı dashboard erişimi.',
    detaylar: ['İSO üyelerine ölçekli fiyat', 'Tesis başına veya kurumsal lisans', 'API erişimi ek modül'],
    y5: '₺130M', y1: '₺1.5M',
  },
  {
    renk: C.blue, icon: <FileText size={18}/>, baslik: 'Danışmanlık',
    desc: 'Proje bazlı risk analizi ve ISO 22301 uyum danışmanlığı.',
    detaylar: ['Tesis bazlı URI doğrulama', 'BCP hazırlama paketi', 'Sektör bazlı raporlama'],
    y5: '₺60M', y1: '₺0.5M',
  },
  {
    renk: C.purple, icon: <Target size={18}/>, baslik: 'Test & Saha',
    desc: 'Fiziksel saha ziyaretleri ve tatbikat koordinasyonu.',
    detaylar: ['193 kritik tesis öncelikli', 'Tatbikat senaryo tasarımı', 'Saha doğrulama raporu'],
    y5: '₺55M', y1: '₺1.0M',
  },
  {
    renk: C.orange, icon: <ArrowUpRight size={18}/>, baslik: 'Kurumsal + Uluslararası',
    desc: 'Büyük ölçekli kurumsal lisanslar ve Türkiye modeli ihracatı.',
    detaylar: ['AFAD / Bakanlık entegrasyonu', 'MENA bölgesi genişleme', 'Sigorta sektörü verisi'],
    y5: '₺35M', y1: '₺0M',
  },
]

const PROJ_YILLAR = ['Y1', 'Y2', 'Y3', 'Y4', 'Y5']
const PROJ_DATA = [
  { label: 'Platform SaaS', color: C.teal,   data: [1.5, 10, 28, 65, 130] },
  { label: 'Danışmanlık',   color: C.blue,   data: [0.5,  5, 14, 30,  60] },
  { label: 'Test & Saha',   color: C.purple, data: [1.0,  7, 16, 30,  55] },
  { label: 'Kurumsal+',     color: C.orange, data: [0.0,  3, 10, 23,  35] },
]
const PROJ_TOPLAM = [3, 25, 68, 148, 280]

/* SATAKOL form bölümleri (HIFYEA bazlı özet) */
const SATAKOL_BOLUMLER = [
  {
    kod: 'T', baslik: 'Tehlike (H)', renk: C.red, soru: 8,
    sorular: [
      { kod:'T1', kisa:'Deprem tehlikesi',         weight: 5 },
      { kod:'T2', kisa:'Taşkın / sel tehlikesi',   weight: 4 },
      { kod:'T3', kisa:'NATECH potansiyeli',        weight: 5 },
      { kod:'T4', kisa:'Yangın / patlama yoğunluğu', weight: 5 },
      { kod:'T5', kisa:'Komşu tesis tehdidi',      weight: 3 },
      { kod:'T6', kisa:'Tedarik zinciri riski',    weight: 3 },
      { kod:'T7', kisa:'Siber saldırı (OT/BT)',    weight: 4 },
      { kod:'T8', kisa:'Zincirleme etki (TOC)',     weight: 3 },
    ],
  },
  {
    kod: 'S', baslik: 'Savunmasızlık (F×E)', renk: C.orange, soru: 15,
    sorular: [
      { kod:'S1',  kisa:'Bina yaşı / deprem uyumu',   weight: 5 },
      { kod:'S2',  kisa:'Zemin sınıfı / sıvılaşma',   weight: 4 },
      { kod:'S3',  kisa:'Can kaybı riski',             weight: 5 },
      { kod:'S4',  kisa:'Ekipman hasar riski',         weight: 4 },
      { kod:'S5',  kisa:'Kimyasal sızıntı riski',      weight: 5 },
      { kod:'S6',  kisa:'Enerji altyapısı kırılganlığı', weight: 4 },
      { kod:'S7',  kisa:'OT/BT sistemi güvenlik açığı', weight: 4 },
      { kod:'S8',  kisa:'Tedarik çeşitliliği',         weight: 3 },
      { kod:'S9',  kisa:'Coğrafi kümülatif risk',      weight: 4 },
      { kod:'S10', kisa:'SPOF analizi (TOC)',           weight: 4 },
      { kod:'S11', kisa:'Kilit personel bağımlılığı',  weight: 3 },
      { kod:'S12', kisa:'Nakit akışı kapasitesi',       weight: 3 },
      { kod:'S13', kisa:'Sigorta yeterliliği',          weight: 3 },
      { kod:'S14', kisa:'Yasal uyum durumu',            weight: 3 },
      { kod:'S15', kisa:'İtibar kaybı riski',           weight: 2 },
    ],
  },
  {
    kod: 'Y', baslik: 'Kapasite (C)', renk: C.green, soru: 35,
    sorular: [
      { kod:'Y1',  kisa:'Üst yönetim liderliği',       weight: 5 },
      { kod:'Y6',  kisa:'AADYP güncel mi?',             weight: 5 },
      { kod:'Y7',  kisa:'BCP hazır ve test edilmiş mi?',weight: 5 },
      { kod:'Y11', kisa:'Yangın sistemleri',            weight: 5 },
      { kod:'Y12', kisa:'Enerji güvenliği sistemleri',  weight: 4 },
      { kod:'Y14', kisa:'NATECH önlem sistemi',         weight: 5 },
      { kod:'Y19', kisa:'Acil müdahale ekipleri',       weight: 5 },
      { kod:'Y20', kisa:'ISO 22301 uzmanı',             weight: 5 },
      { kod:'Y22', kisa:'Tatbikat sıklığı',             weight: 4 },
      { kod:'Y25', kisa:'OT/BT siber güvenlik',         weight: 4 },
    ],
  },
  {
    kod: 'HRO', baslik: 'HRO Olgunluğu', renk: C.purple, soru: 5,
    sorular: [
      { kod:'HRO1', kisa:'Başarısızlığa takıntı',      weight: 5 },
      { kod:'HRO2', kisa:'Basitleştirmeye direnç',     weight: 4 },
      { kod:'HRO3', kisa:'Operasyona duyarlılık',      weight: 4 },
      { kod:'HRO4', kisa:'Dayanıklılığa bağlılık',    weight: 4 },
      { kod:'HRO5', kisa:'Uzmanlığa saygı',            weight: 4 },
    ],
  },
]

/* ══════════════════════════════════════════════════════════════
   YARDIMCI BİLEŞENLER
══════════════════════════════════════════════════════════════ */
function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
      padding: 20, ...style,
    }}>{children}</div>
  )
}

function SectionTitle({ icon, title, sub }: { icon: React.ReactNode; title: string; sub?: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 16 }}>
      <span style={{ color: C.teal }}>{icon}</span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, letterSpacing: '.02em' }}>{title}</div>
        {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  )
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
      background: color + '22', color, border: `1px solid ${color}44`,
      letterSpacing: '.06em',
    }}>{label}</span>
  )
}

function URIMini({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
      <div style={{ flex: 1, height: 4, background: C.border, borderRadius: 2, overflow:'hidden' }}>
        <div style={{ width:`${value}%`, height:'100%', background: color, borderRadius: 2, transition:'width .5s' }}/>
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 28, textAlign:'right' }}>{value}</span>
    </div>
  )
}

function StatCard({ val, lbl, sub, color, icon }: { val: string; lbl: string; sub: string; color: string; icon: React.ReactNode }) {
  return (
    <Card style={{ display:'flex', flexDirection:'column', gap: 6 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ color }}>{icon}</span>
        <ArrowUpRight size={12} color={C.dim}/>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color, fontVariantNumeric:'tabular-nums', letterSpacing:'-.02em' }}>{val}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{lbl}</div>
      <div style={{ fontSize: 11, color: C.muted }}>{sub}</div>
    </Card>
  )
}

/* ══════════════════════════════════════════════════════════════
   TAB: ÖZET
══════════════════════════════════════════════════════════════ */
function TabOzet() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 20 }}>

      {/* KPI */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap: 12 }}>
        {KPI_DATA.map(k => <StatCard key={k.lbl} {...k}/>)}
      </div>

      {/* Risk Dağılımı + İlçe Tablosu */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.6fr', gap: 12 }}>
        <Card>
          <SectionTitle icon={<Activity size={14}/>} title="URI Risk Dağılımı" sub="22.846 tesis"/>
          <div style={{ display:'flex', flexDirection:'column', gap: 10, marginTop: 8 }}>
            {[
              { label:'KRİTİK',  pct: 0.8,  count: 193,   color: C.red    },
              { label:'YÜKSEK',  pct: 3.2,  count: 731,   color: C.orange },
              { label:'ORTA',    pct: 16.0, count: 3652,  color: C.amber  },
              { label:'DÜŞÜK',   pct: 80.0, count: 18270, color: C.green  },
            ].map(r => (
              <div key={r.label}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: r.color, letterSpacing:'.06em' }}>{r.label}</span>
                  <span style={{ fontSize: 11, color: C.muted }}>{r.count.toLocaleString('tr')} tesis · %{r.pct}</span>
                </div>
                <div style={{ height: 6, background: C.border, borderRadius: 3, overflow:'hidden' }}>
                  <div style={{ width:`${r.pct * 3}%`, height:'100%', background: r.color, borderRadius: 3, transition:'width .6s' }}/>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, padding: '10px 14px', background: C.panel, borderRadius: 8, border:`1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>Veri Kalitesi</div>
            {[
              { lbl:'Koordinat verisi',  pct: 81.9, ok: true  },
              { lbl:'Çalışan sayısı',    pct: 76.2, ok: true  },
              { lbl:'Yapı yaşı / türü',  pct: 0,    ok: false },
              { lbl:'BCP planı varlığı', pct: 0,    ok: false },
              { lbl:'Tehlikeli madde',   pct: 8.1,  ok: false },
            ].map(v => (
              <div key={v.lbl} style={{ display:'flex', alignItems:'center', gap: 6, marginBottom: 4 }}>
                {v.ok
                  ? <CheckCircle2 size={11} color={C.green}/>
                  : <XCircle size={11} color={v.pct > 0 ? C.amber : C.red}/>
                }
                <span style={{ flex:1, fontSize: 11, color: C.text }}>{v.lbl}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: v.pct > 50 ? C.green : v.pct > 0 ? C.amber : C.red }}>
                  %{v.pct}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle icon={<MapPin size={14}/>} title="İlçe Bazlı Tesis Dağılımı" sub="En yoğun 8 ilçe"/>
          <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
            {ILCE_DATA.map((il, i) => (
              <div key={il.ilce} style={{
                display:'flex', alignItems:'center', gap: 10, padding:'8px 10px',
                background: i % 2 === 0 ? C.panel : 'transparent', borderRadius: 6,
              }}>
                <span style={{ fontSize: 11, color: C.dim, minWidth: 16, textAlign:'right' }}>{i+1}</span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.text }}>{il.ilce}</span>
                <span style={{ fontSize: 12, color: C.muted, minWidth: 60, textAlign:'right' }}>{il.tesis.toLocaleString('tr')} tesis</span>
                <span style={{ fontSize: 11, color: C.red, minWidth: 60, textAlign:'right' }}>{il.kritik} kritik</span>
                <div style={{ minWidth: 80 }}>
                  <URIMini value={il.uri} color={il.uri > 35 ? C.red : il.uri > 28 ? C.amber : C.green}/>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Faz Planı */}
      <Card>
        <SectionTitle icon={<Clock size={14}/>} title="Uygulama Fazları" sub="İSO iş birliği takvimi"/>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: 12 }}>
          {[
            { faz:'FAZ 1', sure:'0 – 3 Ay', baslik:'Hızlı Tarama', bedel:'ÜCRETSİZ', color: C.teal, aktif: true,
              items:['22.846 tesisin URI hesaplaması','Risk haritası yayımı (herkese açık)','İSO üyelerine dashboard erişimi','Kritik 193 tesise öncelikli bildirim'] },
            { faz:'FAZ 2', sure:'3 – 9 Ay', baslik:'Derinlemesine Analiz', bedel:'Hibe / Kamu', color: C.blue, aktif: false,
              items:['Kimya + metal sektörü detay formu','Saha doğrulama (193 kritik tesis)','BCP mevcut durum tespiti','NATECH senaryo modelleme'] },
            { faz:'FAZ 3', sure:'9 – 24 Ay', baslik:'Sürekli İzleme', bedel:'Platform Aboneliği', color: C.purple, aktif: false,
              items:['Canlı URI güncelleme','AFAD / Valilik entegrasyonu','Sigorta sektörü veri paylaşımı','ISO 22301 uyum takibi'] },
          ].map(f => (
            <div key={f.faz} style={{
              padding: 16, borderRadius: 10,
              border: `1px solid ${f.aktif ? f.color : C.border}`,
              background: f.aktif ? f.color + '12' : C.panel,
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: f.color, letterSpacing:'.1em' }}>{f.faz}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginTop: 2 }}>{f.baslik}</div>
                  <div style={{ fontSize: 11, color: C.muted }}>{f.sure}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, padding:'2px 8px', borderRadius: 4, background: f.color + '22', color: f.color }}>{f.bedel}</span>
              </div>
              {f.items.map(item => (
                <div key={item} style={{ display:'flex', gap: 6, marginBottom: 4, alignItems:'flex-start' }}>
                  <ChevronRight size={10} color={f.color} style={{ marginTop: 2, flexShrink: 0 }}/>
                  <span style={{ fontSize: 11, color: C.text }}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   TAB: TESİS AĞI
══════════════════════════════════════════════════════════════ */
function TabTesis() {
  const [aramaStr, setAramaStr] = useState('')
  const [sortBy, setSortBy] = useState<'uri'|'tesis'|'ad'>('uri')

  const filtrelenmis = useMemo(() => {
    return SEKTORLER
      .filter(s => s.ad.toLowerCase().includes(aramaStr.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'uri')   return b.uri - a.uri
        if (sortBy === 'tesis') return b.tesis - a.tesis
        return a.ad.localeCompare(b.ad, 'tr')
      })
  }, [aramaStr, sortBy])

  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 16 }}>
      <Card style={{ padding:'12px 16px' }}>
        <div style={{ display:'flex', gap: 10, alignItems:'center' }}>
          <input
            value={aramaStr}
            onChange={e => setAramaStr(e.target.value)}
            placeholder="Sektör ara..."
            style={{ flex:1, background: C.panel, border:`1px solid ${C.border}`, borderRadius: 8, padding:'8px 12px', color: C.text, fontSize: 13, outline:'none' }}
          />
          <div style={{ display:'flex', gap: 4 }}>
            {(['uri','tesis','ad'] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)}
                style={{ padding:'6px 12px', borderRadius: 6, border:`1px solid ${sortBy===s ? C.teal : C.border}`,
                  background: sortBy===s ? C.teal+'22' : C.panel, color: sortBy===s ? C.teal : C.muted,
                  fontSize: 11, fontWeight: 700, cursor:'pointer', letterSpacing:'.04em' }}>
                {s === 'uri' ? 'URI ↓' : s === 'tesis' ? 'Tesis ↓' : 'A-Z'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${C.border}` }}>
                {['Sektör','NACE','Tesis','Çalışan (bin)','URI Skoru','Risk','NATECH'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'8px 12px', fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing:'.06em', whiteSpace:'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrelenmis.map((s, i) => (
                <tr key={s.ad} style={{ borderBottom:`1px solid ${C.border}22`, background: i%2===0 ? C.panel+'80' : 'transparent' }}>
                  <td style={{ padding:'10px 12px', fontSize: 13, fontWeight: 600, color: C.text }}>{s.ad}</td>
                  <td style={{ padding:'10px 12px', fontSize: 12, color: C.muted, fontFamily:'monospace' }}>{s.nace}</td>
                  <td style={{ padding:'10px 12px', fontSize: 13, color: C.text }}>{s.tesis.toLocaleString('tr')}</td>
                  <td style={{ padding:'10px 12px', fontSize: 13, color: C.text }}>{s.calisanK.toFixed(1)}</td>
                  <td style={{ padding:'10px 12px', minWidth: 120 }}><URIMini value={s.uri} color={s.color}/></td>
                  <td style={{ padding:'10px 12px' }}><Badge label={s.badge} color={s.color}/></td>
                  <td style={{ padding:'10px 12px', textAlign:'center' }}>
                    {s.natech
                      ? <Flame size={14} color={C.red}/>
                      : <span style={{ fontSize: 11, color: C.dim }}>—</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* İlçe breakdown */}
      <Card>
        <SectionTitle icon={<MapPin size={14}/>} title="İlçe Bazlı Dağılım" sub="Tesis yoğunluğu ve risk profili"/>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap: 10 }}>
          {ILCE_DATA.map(il => (
            <div key={il.ilce} style={{ padding:'12px 14px', background: C.panel, borderRadius: 8, border:`1px solid ${C.border}` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 8 }}>{il.ilce}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.teal }}>{il.tesis.toLocaleString('tr')}</div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 6 }}>tesis</div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize: 11 }}>
                <span style={{ color: C.red }}>{il.kritik} kritik</span>
                <span style={{ color: C.muted }}>URI {il.uri}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   TAB: SEKTÖR ANALİZİ
══════════════════════════════════════════════════════════════ */
function TabSektor() {
  const [aktif, setAktif] = useState(0)
  const s = SEKTORLER[aktif]

  return (
    <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap: 16 }}>
      {/* Sol liste */}
      <Card style={{ padding: 12 }}>
        {SEKTORLER.map((sektor, i) => (
          <div key={sektor.ad} onClick={() => setAktif(i)}
            style={{ display:'flex', alignItems:'center', gap: 8, padding:'10px 10px', borderRadius: 8, marginBottom: 4, cursor:'pointer',
              background: aktif===i ? C.teal+'18' : 'transparent', border:`1px solid ${aktif===i ? C.teal+'44' : 'transparent'}` }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: sektor.color, flexShrink: 0 }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: aktif===i ? 700 : 500, color: aktif===i ? C.text : C.muted }}>{sektor.ad}</div>
              <div style={{ fontSize: 10, color: C.dim }}>NACE {sektor.nace} · {sektor.tesis.toLocaleString('tr')} tesis</div>
            </div>
            <ChevronRight size={12} color={aktif===i ? C.teal : C.dim}/>
          </div>
        ))}
      </Card>

      {/* Sağ detay */}
      <div style={{ display:'flex', flexDirection:'column', gap: 12 }}>
        <Card>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{s.ad}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>NACE {s.nace} · {s.tesis.toLocaleString('tr')} tesis · {s.calisanK.toFixed(1)}K çalışan</div>
            </div>
            <div style={{ display:'flex', gap: 8, alignItems:'center' }}>
              {s.natech && <Badge label="NATECH" color={C.red}/>}
              <Badge label={s.badge} color={s.color}/>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
            {[
              { lbl:'Toplam Tesis',  val: s.tesis.toLocaleString('tr'), color: C.teal   },
              { lbl:'Çalışan (bin)', val: s.calisanK.toFixed(1),        color: C.blue   },
              { lbl:'URI Skoru',     val: s.uri.toString(),              color: s.color  },
              { lbl:'Risk Sınıfı',   val: s.badge,                       color: s.color  },
            ].map(m => (
              <div key={m.lbl} style={{ padding:'10px 12px', background: C.panel, borderRadius: 8, border:`1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{m.lbl}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: m.color }}>{m.val}</div>
              </div>
            ))}
          </div>
          <URIMini value={s.uri} color={s.color}/>
        </Card>

        {/* SATAKOL özet bu sektör için */}
        <Card>
          <SectionTitle icon={<FileText size={14}/>} title="SATAKOL Değerlendirme Boyutları" sub="63 soruluk HIFYEA metodolojisi"/>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap: 10 }}>
            {SATAKOL_BOLUMLER.map(b => (
              <div key={b.kod} style={{ padding:'12px 14px', background: C.panel, borderRadius: 8, border:`1px solid ${C.border}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: b.renk }}>{b.baslik}</div>
                  <span style={{ fontSize: 10, color: C.muted }}>{b.soru} soru</span>
                </div>
                {b.sorular.slice(0, 4).map(s => (
                  <div key={s.kod} style={{ display:'flex', gap: 6, alignItems:'center', marginBottom: 3 }}>
                    <span style={{ fontSize: 10, fontFamily:'monospace', color: b.renk, minWidth: 32 }}>{s.kod}</span>
                    <span style={{ fontSize: 11, color: C.muted, flex: 1 }}>{s.kisa}</span>
                    <span style={{ fontSize: 10, color: C.dim }}>×{s.weight}</span>
                  </div>
                ))}
                {b.sorular.length > 4 && <div style={{ fontSize: 10, color: C.dim, marginTop: 4 }}>+{b.sorular.length - 4} soru daha...</div>}
              </div>
            ))}
          </div>
        </Card>

        {/* Sendai uyum */}
        <Card>
          <SectionTitle icon={<Target size={14}/>} title="Sendai Çerçevesi Uyum" sub={`${s.ad} sektörü için hedef boşluğu`}/>
          <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
            {SENDAI_HEDEFLER.map(h => (
              <div key={h.kod}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: C.text }}><span style={{ fontWeight: 700, color: h.renk, marginRight: 6 }}>{h.kod}</span>{h.baslik}</span>
                  <span style={{ fontSize: 11, color: C.muted }}>{h.mevcut} / {h.hedef}</span>
                </div>
                <div style={{ height: 5, background: C.border, borderRadius: 3, overflow:'hidden' }}>
                  <div style={{ width:`${(h.mevcut/h.hedef)*100}%`, height:'100%', background: h.renk, borderRadius: 3 }}/>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   TAB: GIS HARİTA
══════════════════════════════════════════════════════════════ */
function TabHarita() {
  return (
    <Card>
      <SectionTitle icon={<MapPin size={14}/>} title="İstanbul Sanayi Tesis Haritası" sub="Leaflet CBS — URI risk renklendirmesi + NATECH bayrakları"/>
      <IstanbulHarita />
    </Card>
  )
}

/* ══════════════════════════════════════════════════════════════
   TAB: NATECH
══════════════════════════════════════════════════════════════ */
function TabNatech() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 16 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: 12 }}>
        {[
          { val: '319', lbl: 'Seveso Kapsamı', sub: 'Alt + üst eşik', color: C.red,    icon: <Flame size={18}/> },
          { val: '1.521', lbl: 'NATECH Riskli', sub: 'Tesis sayısı',   color: C.orange, icon: <AlertTriangle size={18}/> },
          { val: '5',   lbl: 'Sektör',         sub: 'Yüksek öncelik', color: C.amber,  icon: <Layers size={18}/> },
        ].map(k => <StatCard key={k.lbl} {...k}/>)}
      </div>

      <Card>
        <SectionTitle icon={<Flame size={14}/>} title="NATECH Yüksek Riskli Sektörler" sub="Seveso kapsamı + kritik tesis sayısı"/>
        <div style={{ display:'flex', flexDirection:'column', gap: 8 }}>
          {NATECH_DATA.map(n => (
            <div key={n.sektor} style={{ display:'grid', gridTemplateColumns:'1fr 80px 80px 80px', alignItems:'center', gap: 12, padding:'10px 14px', background: C.panel, borderRadius: 8, border:`1px solid ${C.border}` }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{n.sektor}</div>
              </div>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.muted }}>{n.tesis.toLocaleString('tr')}</div>
                <div style={{ fontSize: 10, color: C.dim }}>Toplam</div>
              </div>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.orange }}>{n.seveso}</div>
                <div style={{ fontSize: 10, color: C.dim }}>Seveso</div>
              </div>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: n.renk }}>{n.kritik}</div>
                <div style={{ fontSize: 10, color: C.dim }}>Kritik</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle icon={<AlertTriangle size={14}/>} title="Domino Etkisi Senaryosu — Tuzla OSB" sub="Örnek olaylar zinciri modeli"/>
        <div style={{ padding:'14px 16px', background: C.panel, borderRadius: 8, border:`1px solid ${C.red}33` }}>
          <div style={{ display:'flex', gap: 8, marginBottom: 12 }}>
            <Badge label="M6.5+ DEPREM" color={C.red}/>
            <Badge label="TUZLA OSB" color={C.orange}/>
            <Badge label="NATECH TETİKLEYİCİ" color={C.amber}/>
          </div>
          <div style={{ display:'flex', gap: 0, overflowX:'auto' }}>
            {[
              { n: 1, text: 'Deprem altyapı hasarı', color: C.red    },
              { n: 2, text: 'Kimya tesisi tank çökmesi', color: C.orange },
              { n: 3, text: 'Yanıcı gaz sızıntısı', color: C.amber  },
              { n: 4, text: 'Seri patlama / yangın', color: C.red    },
              { n: 5, text: 'OSB geneli tahliye', color: C.purple  },
            ].map((step, i, arr) => (
              <div key={step.n} style={{ display:'flex', alignItems:'center' }}>
                <div style={{ padding:'10px 14px', background: step.color + '18', borderRadius: 8, border:`1px solid ${step.color}44`, minWidth: 130 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: step.color, marginBottom: 4 }}>ADIM {step.n}</div>
                  <div style={{ fontSize: 12, color: C.text }}>{step.text}</div>
                </div>
                {i < arr.length - 1 && <ChevronRight size={16} color={C.dim} style={{ margin:'0 4px', flexShrink: 0 }}/>}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   TAB: BIA / İŞ SÜREKLİLİĞİ
══════════════════════════════════════════════════════════════ */
function TabBIA() {
  const [aktifSenaryo, setAktifSenaryo] = useState(0)
  const sen = BIA_SENARYOLAR[aktifSenaryo]

  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 16 }}>
      {/* Senaryo seçici */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: 10 }}>
        {BIA_SENARYOLAR.map((s, i) => (
          <div key={s.baslik} onClick={() => setAktifSenaryo(i)}
            style={{ padding:'14px 16px', borderRadius: 10, cursor:'pointer',
              border:`1px solid ${aktifSenaryo===i ? s.color : C.border}`,
              background: aktifSenaryo===i ? s.color + '14' : C.card }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 6 }}>
              <Badge label={s.olasilik} color={s.color}/>
              <Badge label={`Etki: ${s.etki}`} color={s.color}/>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: aktifSenaryo===i ? C.text : C.muted }}>{s.baslik}</div>
            <div style={{ display:'flex', gap: 12, marginTop: 8, fontSize: 11, color: C.dim }}>
              <span>RTO: {s.rto}</span>
              <span>RPO: {s.rpo}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Senaryo detay */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12 }}>
        <Card>
          <SectionTitle icon={<Activity size={14}/>} title={sen.baslik} sub="Etki & Kurtarma Parametreleri"/>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10, marginBottom: 16 }}>
            {[
              { lbl:'Etkilenecek Tesis', val: sen.etkilenecek.toLocaleString('tr'), color: sen.color },
              { lbl:'Ekonomik Kayıp',    val: `₺${sen.ekonomikKayipM}M`,           color: sen.color },
              { lbl:'RTO Hedefi',        val: sen.rto,                              color: C.amber   },
              { lbl:'RPO Hedefi',        val: sen.rpo,                              color: C.blue    },
            ].map(m => (
              <div key={m.lbl} style={{ padding:'10px 12px', background: C.panel, borderRadius: 8, border:`1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 2 }}>{m.lbl}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: m.color }}>{m.val}</div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, marginBottom: 8, letterSpacing:'.06em' }}>ETKİLENEN SEKTÖRLER</div>
            <div style={{ display:'flex', gap: 6 }}>
              {sen.sektorler.map(s => <Badge key={s} label={s} color={sen.color}/>)}
            </div>
          </div>
        </Card>

        <Card>
          <SectionTitle icon={<Clock size={14}/>} title="Müdahale Fazları" sub="Zaman bazlı kurtarma planı"/>
          {sen.fazlar.map((faz, i) => (
            <div key={i} style={{ display:'flex', gap: 10, marginBottom: 12, paddingBottom: 12, borderBottom: i < sen.fazlar.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', background: sen.color + '22', border:`1px solid ${sen.color}44`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: sen.color }}>{i+1}</span>
              </div>
              <div>
                <div style={{ display:'flex', gap: 8, alignItems:'center', marginBottom: 3 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{faz.baslik}</span>
                  <span style={{ fontSize: 10, color: C.dim }}>{faz.sure}</span>
                </div>
                <div style={{ fontSize: 11, color: C.muted }}>{faz.adim}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* ISO 22301 Uyum Hedefleri */}
      <Card>
        <SectionTitle icon={<CheckCircle2 size={14}/>} title="ISO 22301 Uyum Gereksinimleri" sub="Sanayi sektörü için kritik maddeler"/>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: 10 }}>
          {[
            { madde:'Md. 6.2', baslik:'BCM Politikası & Hedefleri',       durum:'eksik',     renk: C.red    },
            { madde:'Md. 8.2', baslik:'İş Etki Analizi (BIA)',            durum:'kısmi',     renk: C.amber  },
            { madde:'Md. 8.3', baslik:'İş Sürekliliği Stratejisi',        durum:'kısmi',     renk: C.amber  },
            { madde:'Md. 8.4', baslik:'İş Sürekliliği Prosedürleri',      durum:'eksik',     renk: C.red    },
            { madde:'Md. 8.5', baslik:'Tatbikat & Test Programı',         durum:'eksik',     renk: C.red    },
            { madde:'Md. 9.1', baslik:'İzleme & Ölçüm',                  durum:'yeterli',   renk: C.green  },
          ].map(m => (
            <div key={m.madde} style={{ padding:'10px 12px', background: C.panel, borderRadius: 8, border:`1px solid ${m.renk}33` }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontFamily:'monospace', color: m.renk, fontWeight: 700 }}>{m.madde}</span>
                <Badge label={m.durum.toUpperCase()} color={m.renk}/>
              </div>
              <div style={{ fontSize: 12, color: C.text }}>{m.baslik}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   TAB: SATAKOL FORMU (63 soru özeti)
══════════════════════════════════════════════════════════════ */
function TabSatakol() {
  const [acikBolum, setAcikBolum] = useState<string|null>('T')

  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 12 }}>
      <Card style={{ padding:'12px 16px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>SATAKOL — HIFYEA Soru Seti</div>
            <div style={{ fontSize: 11, color: C.muted }}>63 soru · H:8 · F×E:15 · C:35 · HRO:5 · ISO 22301 + AFAD AADY 2025 uyumlu</div>
          </div>
          <div style={{ display:'flex', gap: 8 }}>
            {SATAKOL_BOLUMLER.map(b => (
              <div key={b.kod} style={{ textAlign:'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: b.renk }}>{b.soru}</div>
                <div style={{ fontSize: 10, color: C.dim }}>{b.baslik.split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {SATAKOL_BOLUMLER.map(bolum => (
        <Card key={bolum.kod} style={{ padding: 0, overflow:'hidden' }}>
          <div
            onClick={() => setAcikBolum(acikBolum === bolum.kod ? null : bolum.kod)}
            style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', cursor:'pointer', borderBottom: acikBolum === bolum.kod ? `1px solid ${C.border}` : 'none' }}>
            <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
              <div style={{ width: 3, height: 24, background: bolum.renk, borderRadius: 2 }}/>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{bolum.baslik}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{bolum.soru} soru</div>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
              <Badge label={`${bolum.soru} SORU`} color={bolum.renk}/>
              {acikBolum === bolum.kod ? <ChevronUp size={14} color={C.muted}/> : <ChevronDown size={14} color={C.muted}/>}
            </div>
          </div>

          {acikBolum === bolum.kod && (
            <div style={{ padding:'12px 18px' }}>
              <div style={{ display:'flex', flexDirection:'column', gap: 6 }}>
                {bolum.sorular.map((s, i) => (
                  <div key={s.kod} style={{ display:'flex', alignItems:'center', gap: 10, padding:'8px 10px', background: i%2===0 ? C.panel : 'transparent', borderRadius: 6 }}>
                    <span style={{ fontSize: 11, fontFamily:'monospace', color: bolum.renk, fontWeight: 700, minWidth: 36 }}>{s.kod}</span>
                    <span style={{ flex: 1, fontSize: 12, color: C.text }}>{s.kisa}</span>
                    <div style={{ display:'flex', alignItems:'center', gap: 4 }}>
                      <span style={{ fontSize: 10, color: C.dim }}>Ağırlık:</span>
                      {Array.from({length: 5}).map((_, j) => (
                        <div key={j} style={{ width: 6, height: 6, borderRadius: 1, background: j < s.weight ? bolum.renk : C.border }}/>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, padding:'10px 14px', background: bolum.renk + '10', borderRadius: 8, border:`1px solid ${bolum.renk}22` }}>
                <div style={{ fontSize: 11, color: bolum.renk, fontWeight: 700, marginBottom: 4 }}>Bu bölümde forma nasıl yönlendirilir?</div>
                <div style={{ fontSize: 11, color: C.muted }}>
                  {bolum.kod === 'T' && 'Tesis yöneticisi veya uzman tarafından mevzuat + AFAD verileri referans alınarak doldurulur.'}
                  {bolum.kod === 'S' && 'Yapısal mühendis ve risk uzmanı tarafından; bina etüt raporu ve SCADA/OT listesiyle birlikte doldurulur.'}
                  {bolum.kod === 'Y' && 'İş sürekliliği yöneticisi ve İSG uzmanı tarafından; mevcut planlar ve tatbikat kayıtlarıyla birlikte doldurulur.'}
                  {bolum.kod === 'HRO' && 'Yönetim ve saha liderleri anketini ayrı ayrı doldurur; sonuçlar karşılaştırılır.'}
                </div>
              </div>
            </div>
          )}
        </Card>
      ))}

      <Card>
        <SectionTitle icon={<BookOpen size={14}/>} title="Form Çıktıları" sub="Doldurulmuş SATAKOL formundan üretilen belgeler"/>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap: 10 }}>
          {[
            { baslik:'URI Skoru Raporu',           renk: C.teal,   icon: <Activity size={14}/> },
            { baslik:'BCP Hazırlama Kılavuzu',     renk: C.blue,   icon: <FileText size={14}/> },
            { baslik:'NATECH Risk Haritası',       renk: C.red,    icon: <Flame size={14}/> },
            { baslik:'Sendai Uyum Raporu',         renk: C.purple, icon: <Target size={14}/> },
            { baslik:'HRO Olgunluk Seviyesi',      renk: C.amber,  icon: <Shield size={14}/> },
            { baslik:'Aksiyon Planı (PDF)',        renk: C.green,  icon: <Download size={14}/> },
          ].map(c => (
            <div key={c.baslik} style={{ display:'flex', alignItems:'center', gap: 8, padding:'10px 12px', background: C.panel, borderRadius: 8, border:`1px solid ${C.border}` }}>
              <span style={{ color: c.renk }}>{c.icon}</span>
              <span style={{ fontSize: 12, color: C.text }}>{c.baslik}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   TAB: İŞ MODELİ
══════════════════════════════════════════════════════════════ */
function TabIsModeli() {
  const maxVal = 280

  return (
    <div style={{ display:'flex', flexDirection:'column', gap: 16 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap: 12 }}>
        {IS_MODELI.map(m => (
          <Card key={m.baslik}>
            <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 10 }}>
              <span style={{ color: m.renk }}>{m.icon}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{m.baslik}</span>
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>{m.desc}</div>
            {m.detaylar.map(d => (
              <div key={d} style={{ display:'flex', gap: 6, marginBottom: 4 }}>
                <ChevronRight size={10} color={m.renk} style={{ flexShrink: 0, marginTop: 2 }}/>
                <span style={{ fontSize: 11, color: C.text }}>{d}</span>
              </div>
            ))}
            <div style={{ marginTop: 12, display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
              <div>
                <div style={{ fontSize: 10, color: C.dim }}>Y1</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.muted }}>{m.y1}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize: 10, color: C.dim }}>Y5</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: m.renk }}>{m.y5}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Projeksiyon grafiği (SVG stacked bar) */}
      <Card>
        <SectionTitle icon={<TrendingUp size={14}/>} title="5 Yıllık Gelir Projeksiyonu" sub="Toplam: ₺280M — Y5"/>
        <div style={{ overflowX:'auto' }}>
          <svg width="100%" viewBox="0 0 700 220" style={{ display:'block' }}>
            {PROJ_YILLAR.map((yil, xi) => {
              const x = 60 + xi * 120
              const totalH = (PROJ_TOPLAM[xi] / maxVal) * 160
              let yOffset = 190

              return (
                <g key={yil}>
                  {PROJ_DATA.map((serie) => {
                    const h = (serie.data[xi] / maxVal) * 160
                    yOffset -= h
                    const y = yOffset
                    return (
                      <rect key={serie.label} x={x - 28} y={y} width={56} height={h}
                        fill={serie.color} opacity={0.85} rx={2}/>
                    )
                  })}
                  <text x={x} y={188} textAnchor="middle" fontSize={11} fill={C.muted}>{yil}</text>
                  <text x={x} y={190 - totalH - 6} textAnchor="middle" fontSize={11} fontWeight="700" fill={C.text}>
                    ₺{PROJ_TOPLAM[xi]}M
                  </text>
                </g>
              )
            })}
            {/* Lejant */}
            {PROJ_DATA.map((s, i) => (
              <g key={s.label}>
                <rect x={60 + i * 160} y={205} width={10} height={10} fill={s.color} rx={2}/>
                <text x={75 + i * 160} y={214} fontSize={10} fill={C.muted}>{s.label}</text>
              </g>
            ))}
          </svg>
        </div>
      </Card>

      {/* 4 Stratejik Giriş Noktası */}
      <Card>
        <SectionTitle icon={<Target size={14}/>} title="İSO İçin 4 Stratejik Giriş Noktası"/>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap: 12 }}>
          {[
            {
              n: 1, baslik: '"Kapasite Raporu 2.0" Çerçevesi', renk: C.teal,
              desc: 'İSO\'nun kapasite raporu tesisin üretim kapasitesini ölçüyor. Omniversel\'in URI skoru ise afet direncini. Bu ikisi birleştiğinde üye için bütüncül bir "tesis değer kartı" oluşuyor.',
            },
            {
              n: 2, baslik: 'OSB Reziliyans Endeksi', renk: C.blue,
              desc: 'Başakşehir, Tuzla, Çerkezköy gibi OSB\'lerin tamamı için URI ortalaması hesaplanır. İSO, bu endeksi üyelerine "bölgenizin dirençlilik puanı" olarak sunar.',
            },
            {
              n: 3, baslik: 'İSO Sigorta & Kredi Bağlantısı', renk: C.purple,
              desc: 'URI skoru düşük tesisler risk primini düşürmek için plan yapar. İSO, bu verileri üye lehine kredi/sigorta pazarlığında kullanır.',
            },
            {
              n: 4, baslik: 'AFAD / Bakanlık Köprüsü', renk: C.orange,
              desc: 'Omniversel\'in İSO veri setinden ürettiği risk haritası, AFAD\'ın "Sanayi Tesisi Afet Hazırlık Portalı"na veri sağlayıcı olarak konumlanır.',
            },
          ].map(gp => (
            <div key={gp.n} style={{ padding:'14px 16px', background: C.panel, borderRadius: 10, border:`1px solid ${gp.renk}33` }}>
              <div style={{ display:'flex', gap: 8, alignItems:'flex-start', marginBottom: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: gp.renk + '22', border:`1px solid ${gp.renk}44`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: gp.renk }}>{gp.n}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{gp.baslik}</div>
              </div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{gp.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   ANA SAYFA
══════════════════════════════════════════════════════════════ */
export default function IstanbulSanayiPage() {
  const [aktifTab, setAktifTab] = useState<Tab>('ozet')
  const [dbTesis, setDbTesis] = useState<number|null>(null)

  useEffect(() => {
    sb.from('facilities').select('id', { count:'exact', head: true })
      .eq('sector', 'INDUSTRIAL')
      .then(({ count }) => setDbTesis(count))
  }, [])

  const tabIcerik: Record<Tab, React.ReactNode> = {
    ozet:      <TabOzet/>,
    tesis:     <TabTesis/>,
    sektor:    <TabSektor/>,
    harita:    <TabHarita/>,
    natech:    <TabNatech/>,
    bia:       <TabBIA/>,
    satakol:   <TabSatakol/>,
    'is-modeli': <TabIsModeli/>,
  }

  return (
    <div style={{ minHeight:'100vh', background: C.navy, fontFamily:"'DM Sans', system-ui, sans-serif", color: C.text }}>

      {/* Üst bar */}
      <div style={{ background: C.panel, borderBottom:`1px solid ${C.border}`, padding:'14px 28px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display:'flex', alignItems:'center', gap: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.text, letterSpacing:'.01em' }}>İstanbul Sanayi</div>
            <div style={{ fontSize: 11, color: C.muted }}>Urban Resilience OS · OMNIVERSEL</div>
          </div>
          {dbTesis !== null && (
            <div style={{ padding:'4px 10px', background: C.teal + '18', border:`1px solid ${C.teal}44`, borderRadius: 6, fontSize: 11, color: C.teal }}>
              Supabase · {dbTesis.toLocaleString('tr')} kayıt
            </div>
          )}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
          <a href="/hub" style={{ fontSize: 12, color: C.muted, textDecoration:'none', padding:'6px 12px', border:`1px solid ${C.border}`, borderRadius: 6 }}>← Hub</a>
          <a href="/uzman/dashboard" style={{ fontSize: 12, color: C.muted, textDecoration:'none', padding:'6px 12px', border:`1px solid ${C.border}`, borderRadius: 6 }}>Uzman Paneli</a>
        </div>
      </div>

      {/* Hero banner */}
      <div style={{ background:`linear-gradient(135deg, ${C.panel} 0%, #081220 100%)`, borderBottom:`1px solid ${C.border}`, padding:'20px 28px' }}>
        <div style={{ maxWidth: 800 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: C.text, letterSpacing:'-.01em', lineHeight: 1.2, marginBottom: 8 }}>
            İstanbul Sanayi Ekosistemi İçin<br/>
            <span style={{ color: C.teal }}>Yeni Bir Dirençlilik Altyapısı.</span>
          </div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
            22.846 tesisin sektörel risk profili, öncelikli müdahale hedefleri ve iş sürekliliği kapasitesi —<br/>
            İSO'nun kurumsal ağırlığı ile Omniversel'in analitik motoru bir araya geliyor.
          </div>
          <div style={{ display:'flex', gap: 10, marginTop: 12 }}>
            <Badge label="HIFYEA METODOLOJİSİ" color={C.teal}/>
            <Badge label="ISO 22301 UYUMLU" color={C.blue}/>
            <Badge label="AFAD AADY 2025" color={C.purple}/>
            <Badge label="İTÜ AYM İŞ BİRLİĞİ" color={C.amber}/>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ background: C.panel, borderBottom:`1px solid ${C.border}`, padding:'0 28px', display:'flex', gap: 2, overflowX:'auto' }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setAktifTab(tab.key)}
            style={{ display:'flex', alignItems:'center', gap: 6, padding:'12px 14px', background:'transparent', border:'none', borderBottom: aktifTab===tab.key ? `2px solid ${C.teal}` : '2px solid transparent', color: aktifTab===tab.key ? C.text : C.muted, fontSize: 12, fontWeight: aktifTab===tab.key ? 700 : 400, cursor:'pointer', whiteSpace:'nowrap', transition:'all .15s' }}>
            <span style={{ color: aktifTab===tab.key ? C.teal : C.dim }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* İçerik */}
      <div style={{ maxWidth: 1400, margin:'0 auto', padding:'24px 28px' }}>
        {tabIcerik[aktifTab]}
      </div>
    </div>
  )
}
