'use client'
import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { createClient } from '@supabase/supabase-js'
import { Loader2, WifiOff, AlertTriangle } from 'lucide-react'

/* ══════════════════════════════════════════════════════════════
   SUPABASE — Beylikdüzü projesi (anon key)
══════════════════════════════════════════════════════════════ */
const sbBD = createClient(
  'https://gqguwgbopgnpwzjwcexl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTk4MzMsImV4cCI6MjA4ODk3NTgzM30.ZIFmmiGsB1rUAojvSG8uTfcknZi6LoXgrgApCL-e550',
)
const TENANT_BD = '11111111-0000-0000-0000-000000000001'
const NAVY = '#0A1628'
const GOLD = '#E8C97A'

/* ══════════════════════════════════════════════════════════════
   TİPLER
══════════════════════════════════════════════════════════════ */
type Sektor = 'MUNICIPALITY' | 'HOSPITAL' | 'EDUCATION' | 'INDUSTRIAL' | 'BANK' | 'HOTEL' | 'OTHER'

interface ExtraData {
  neighborhood?: string
  H_score?:      number
  X_score?:      number
  hazmat_flag?:  boolean
  natech_risk?:  number
  sub_sector?:   string
  risk_deprem?:  number
  risk_sel?:     number
  [k: string]:   unknown
}

interface Facility {
  id:             string
  name:           string
  sector:         Sektor
  employee_count: number
  building_age:   number
  operates_24h:   boolean
  extra_data:     ExtraData | null
}

const SEKTOR_META: Record<Sektor, { label: string; renk: string }> = {
  MUNICIPALITY: { label: 'Kamu',   renk: '#5BA3DC' },
  HOSPITAL:     { label: 'Sağlık', renk: '#EF4444' },
  EDUCATION:    { label: 'Eğitim', renk: '#F59E0B' },
  INDUSTRIAL:   { label: 'Sanayi', renk: '#F97316' },
  BANK:         { label: 'Finans', renk: '#10B981' },
  HOTEL:        { label: 'Turizm', renk: '#A78BFA' },
  OTHER:        { label: 'Diğer',  renk: '#94A3B8' },
}

const TABS = [
  { key: 'ozet',    label: 'İlçe Özeti'    },
  { key: 'mahalle', label: 'Mahalle'        },
  { key: 'tesis',   label: 'Tesis Ağı'     },
  { key: 'harita',  label: 'CBS Harita'    },
  { key: 'natech',  label: 'NATECH'        },
  { key: 'sendai',  label: 'Sendai Uyum'   },
] as const
type Tab = typeof TABS[number]['key']

/* ══════════════════════════════════════════════════════════════
   INLINE SVG İKONLAR
══════════════════════════════════════════════════════════════ */
function IcoShield()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> }
function IcoRadar()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg> }
function IcoPin()      { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> }
function IcoBuilding() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 21V9"/></svg> }
function IcoGrid()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> }
function IcoBook()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> }

const TAB_ICONS: Record<Tab, React.ReactNode> = {
  ozet:    <IcoBuilding/>,
  mahalle: <IcoPin/>,
  tesis:   <IcoGrid/>,
  harita:  <IcoPin/>,
  natech:  <IcoRadar/>,
  sendai:  <IcoShield/>,
}

/* ══════════════════════════════════════════════════════════════
   YARDIMCI BİLEŞENLER
══════════════════════════════════════════════════════════════ */
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white border border-gray-200 rounded-xl shadow-sm ${className}`}>{children}</div>
}

function Spinner() {
  return (
    <div className="flex items-center gap-2 text-gray-400 text-sm">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>Yükleniyor…</span>
    </div>
  )
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2 text-sm">
      <span style={{ color: GOLD }}>{icon}</span>
      {title}
    </h3>
  )
}

/* ── SVG Gauge (yarım daire, Recharts-free) */
function URIGauge({ value, renk }: { value: number; renk: string }) {
  const r = 72, cx = 100, cy = 98
  const totalLen = Math.PI * r
  const valLen   = (value / 100) * totalLen
  return (
    <div style={{ position: 'relative', width: 200, height: 110 }}>
      <svg viewBox="0 0 200 110" width={200} height={110}>
        <path d={`M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy}`}
              fill="none" stroke="#F3F4F6" strokeWidth={18} strokeLinecap="round"/>
        <path d={`M ${cx - r},${cy} A ${r},${r} 0 0 1 ${cx + r},${cy}`}
              fill="none" stroke={renk} strokeWidth={18} strokeLinecap="round"
              strokeDasharray={`${valLen.toFixed(1)} ${totalLen.toFixed(1)}`}/>
        <text x={cx} y={cy - 10} textAnchor="middle" fontSize={30} fontWeight={800} fill={renk}>{value}</text>
        <text x={cx} y={cy + 6}  textAnchor="middle" fontSize={10} fill="#9CA3AF">/ 100</text>
      </svg>
    </div>
  )
}

/* ── SVG Donut */
function SvgDonut({ slices, centerLbl }: {
  slices: { name: string; value: number; fill: string }[]
  centerLbl: string
}) {
  const total = slices.reduce((s, d) => s + d.value, 0) || 1
  const cx = 100, cy = 100, ro = 80, ri = 50
  let angle = -Math.PI / 2
  const gap = 0.04
  type DonutSlice = { name: string; value: number; fill: string; path: string }
  const paths = slices.map(d => {
    const sweep = (d.value / total) * Math.PI * 2 - gap
    if (sweep <= 0) { angle += (d.value / total) * Math.PI * 2; return null }
    const a1 = angle + gap / 2, a2 = a1 + sweep
    const x1o = cx + ro * Math.cos(a1), y1o = cy + ro * Math.sin(a1)
    const x2o = cx + ro * Math.cos(a2), y2o = cy + ro * Math.sin(a2)
    const x1i = cx + ri * Math.cos(a2), y1i = cy + ri * Math.sin(a2)
    const x2i = cx + ri * Math.cos(a1), y2i = cy + ri * Math.sin(a1)
    const large = sweep > Math.PI ? 1 : 0
    const path = `M${x1o.toFixed(1)},${y1o.toFixed(1)} A${ro},${ro} 0 ${large} 1 ${x2o.toFixed(1)},${y2o.toFixed(1)} L${x1i.toFixed(1)},${y1i.toFixed(1)} A${ri},${ri} 0 ${large} 0 ${x2i.toFixed(1)},${y2i.toFixed(1)} Z`
    angle += (d.value / total) * Math.PI * 2
    return { ...d, path }
  }).filter(Boolean) as DonutSlice[]

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 200" width={200} height={200}>
        {paths.map(s => <path key={s.name} d={s.path} fill={s.fill} opacity={0.9}/>)}
        <text x={cx} y={cy - 8}  textAnchor="middle" fontSize={22} fontWeight={700} fill="#111827">{centerLbl}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize={11} fill="#9CA3AF">tesis</text>
      </svg>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-1">
        {paths.map(s => (
          <div key={s.name} className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.fill }}/>
            {s.name} ({s.value})
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── SVG Bar Chart (mahalle bazlı) */
function SvgBarChart({ data }: { data: { label: string; value: number; fill: string }[] }) {
  if (!data.length) return null
  const W = 560, H = 200, ml = 36, mr = 16, mt = 20, mb = 44
  const pw = W - ml - mr, ph = H - mt - mb
  const maxVal = Math.max(...data.map(d => d.value), 1)
  const slotW  = pw / data.length
  const barW   = Math.min(slotW * 0.55, 40)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
      {/* Y grid */}
      {[0, 1, 2, 3, 4, 5].map(v => {
        const y = mt + ph - (v / 5) * ph
        return (
          <g key={v}>
            <line x1={ml} y1={y} x2={ml + pw} y2={y} stroke="#F3F4F6" strokeWidth={1}/>
            <text x={ml - 4} y={y + 4} textAnchor="end" fontSize={9} fill="#D1D5DB">{v}</text>
          </g>
        )
      })}
      {/* Axes */}
      <line x1={ml} y1={mt} x2={ml} y2={mt + ph} stroke="#E5E7EB" strokeWidth={1}/>
      <line x1={ml} y1={mt + ph} x2={ml + pw} y2={mt + ph} stroke="#E5E7EB" strokeWidth={1}/>
      {/* Bars */}
      {data.map((d, i) => {
        const cx   = ml + (i + 0.5) * slotW
        const barH = (d.value / maxVal) * ph
        const x    = cx - barW / 2
        const y    = mt + ph - barH
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={barW} height={barH} rx={3} fill={d.fill} opacity={0.85}/>
            <text x={cx} y={y - 4} textAnchor="middle" fontSize={9} fill={d.fill} fontWeight={700}>
              {d.value.toFixed(1)}
            </text>
            <text x={cx} y={mt + ph + 14} textAnchor="middle" fontSize={9} fill="#9CA3AF">
              {d.label.length > 8 ? d.label.slice(0, 7) + '…' : d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* ── Riske göre renk */
const hRenk = (h = 0) => h >= 4 ? '#EF4444' : h >= 3 ? '#F97316' : h >= 2 ? '#F59E0B' : '#22C55E'
const hLabel = (h = 0) => h >= 4 ? 'KRİTİK' : h >= 3 ? 'YÜKSEK' : h >= 2 ? 'ORTA' : 'İYİ'
const hBadgeCls = (h = 0) =>
  h >= 4 ? 'text-red-600 bg-red-50 border-red-200' :
  h >= 3 ? 'text-orange-600 bg-orange-50 border-orange-200' :
  h >= 2 ? 'text-amber-600 bg-amber-50 border-amber-200' :
           'text-emerald-600 bg-emerald-50 border-emerald-200'

/* ══════════════════════════════════════════════════════════════
   DYNAMIC IMPORT — CBS HARİTA
══════════════════════════════════════════════════════════════ */
const CBSHarita = dynamic(() => import('./CBSHarita'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50" style={{ height: 520 }}>
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Harita yükleniyor…
      </div>
    </div>
  ),
})

/* ══════════════════════════════════════════════════════════════
   STATIK VERİ — Mahalle bağlamı + Sendai
══════════════════════════════════════════════════════════════ */
const MAHALLE_CONTEXT: Record<string, { nufus: number; natech: boolean; not: string; sendai: string }> = {
  'Yakuplu':       { nufus: 89420,  natech: true,  sendai: 'SF-3', not: 'Yakuplu OSB varlığı NATECH riskini kritik düzeye taşıyor. Domino etkisi modellemesi gerekli.' },
  'Kavaklı':       { nufus: 42180,  natech: false, sendai: 'SF-4', not: 'Dere yatağına yakın konut alanları. İBB yağmursuyu ıslahı tamamlandı.' },
  'Gürpınar':      { nufus: 38650,  natech: false, sendai: 'SF-1', not: 'KAF hattına yakınlık birincil tehlike. KİPTAŞ dönüşümü devam ediyor.' },
  'Adnan Kahveci': { nufus: 124300, natech: false, sendai: 'SF-2', not: 'En kalabalık mahalle. Müdahale istasyonu koordinasyon merkezi olabilir.' },
  'Büyükşehir':    { nufus: 31200,  natech: false, sendai: 'SF-1', not: 'Karma kullanım alanı. Orta düzey risk profili.' },
  'Cumhuriyet':    { nufus: 28400,  natech: false, sendai: 'SF-1', not: 'AFAD deposu burada — stratejik konum avantajı.' },
}

/* ══════════════════════════════════════════════════════════════
   ANA BİLEŞEN
══════════════════════════════════════════════════════════════ */
export default function BeylikduzuKomuta() {
  const [tab,        setTab]        = useState<Tab>('ozet')
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [loading,    setLoading]    = useState(true)
  const [hata,       setHata]       = useState<string | null>(null)

  /* Tesis Ağı UI */
  const [search,       setSearch]       = useState('')
  const [sektorFiltre, setSektorFiltre] = useState<Sektor | 'hepsi'>('hepsi')
  const [sayfa,        setSayfa]        = useState(0)
  const PAGE_SIZE = 20

  /* NATECH senaryo */
  const [senaryo, setSenaryo] = useState('deprem')
  const [siddet,  setSiddet]  = useState(6.5)

  /* ── Supabase veri çekme */
  useEffect(() => {
    let iptal = false
    async function cek() {
      setLoading(true); setHata(null)
      const { data, error } = await sbBD
        .from('facilities')
        .select('id,name,sector,employee_count,building_age,operates_24h,extra_data')
        .eq('tenant_id', TENANT_BD)
        .eq('is_active', true)
        .limit(1000)
      if (iptal) return
      if (error) { setHata(error.message); setLoading(false); return }
      setFacilities((data ?? []) as Facility[])
      setLoading(false)
    }
    cek()
    return () => { iptal = true }
  }, [])

  /* ── KPI hesaplama */
  const kpi = useMemo(() => {
    const toplam  = facilities.length
    const kritik  = facilities.filter(f => (f.extra_data?.H_score ?? 0) >= 4).length
    const hazmat  = facilities.filter(f => f.extra_data?.hazmat_flag).length
    const h24     = facilities.filter(f => f.operates_24h).length
    const avgH    = toplam ? facilities.reduce((s, f) => s + (f.extra_data?.H_score ?? 0), 0) / toplam : 2.5
    const uri     = Math.max(0, Math.min(100, Math.round(100 - avgH * 20)))
    const uriRenk = uri < 40 ? '#EF4444' : uri < 60 ? '#F97316' : uri < 75 ? '#F59E0B' : '#22C55E'
    return { toplam, kritik, hazmat, h24, uri, uriRenk }
  }, [facilities])

  /* ── Donut dilimleri (canlı veriden) */
  const donutSlices = useMemo(() => {
    if (!facilities.length) return [
      { name: 'KRİTİK',    value: 25, fill: '#EF4444' },
      { name: 'YÜKSEK',    value: 35, fill: '#F97316' },
      { name: 'ORTA',      value: 28, fill: '#F59E0B' },
      { name: 'DİRENÇLİ', value: 12, fill: '#22C55E' },
    ]
    const kritik   = facilities.filter(f => (f.extra_data?.H_score ?? 0) >= 4).length
    const yuksek   = facilities.filter(f => { const h = f.extra_data?.H_score ?? 0; return h >= 3 && h < 4 }).length
    const orta     = facilities.filter(f => { const h = f.extra_data?.H_score ?? 0; return h >= 2 && h < 3 }).length
    const direncli = Math.max(0, facilities.length - kritik - yuksek - orta)
    return [
      { name: 'KRİTİK',    value: kritik,   fill: '#EF4444' },
      { name: 'YÜKSEK',    value: yuksek,   fill: '#F97316' },
      { name: 'ORTA',      value: orta,     fill: '#F59E0B' },
      { name: 'DİRENÇLİ', value: direncli, fill: '#22C55E' },
    ].filter(s => s.value > 0)
  }, [facilities])

  /* ── Mahalle özet verisi */
  const mahalleData = useMemo(() => {
    const map = new Map<string, { list: Facility[] }>()
    for (const f of facilities) {
      const nb = f.extra_data?.neighborhood ?? 'Belirsiz'
      if (!map.has(nb)) map.set(nb, { list: [] })
      map.get(nb)!.list.push(f)
    }
    return [...map.entries()].map(([nb, { list }]) => {
      const avgH = list.length ? list.reduce((s, f) => s + (f.extra_data?.H_score ?? 0), 0) / list.length : 0
      const sektorSay: Partial<Record<Sektor, number>> = {}
      for (const f of list) sektorSay[f.sector] = (sektorSay[f.sector] ?? 0) + 1
      const topSector = (Object.entries(sektorSay) as [Sektor, number][])
        .sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'OTHER'
      return { nb, sayi: list.length, avgH: parseFloat(avgH.toFixed(1)), topSector }
    }).sort((a, b) => b.avgH - a.avgH).slice(0, 12)
  }, [facilities])

  const [secilenMahalle, setSecilenMahalle] = useState<string | null>(null)

  /* ── Tesis Ağı filtre + sayfalama */
  const filteredFacilities = useMemo(() => {
    const q = search.toLowerCase()
    return facilities.filter(f =>
      (sektorFiltre === 'hepsi' || f.sector === sektorFiltre) &&
      (q === '' || f.name.toLowerCase().includes(q) || (f.extra_data?.neighborhood ?? '').toLowerCase().includes(q))
    )
  }, [facilities, search, sektorFiltre])

  const pagedFacilities = filteredFacilities.slice(sayfa * PAGE_SIZE, (sayfa + 1) * PAGE_SIZE)
  const totalPages      = Math.ceil(filteredFacilities.length / PAGE_SIZE)

  /* ── NATECH tesisleri */
  const natechFacilities = useMemo(() =>
    facilities.filter(f => f.extra_data?.hazmat_flag).sort((a, b) =>
      ((b.extra_data?.natech_risk ?? 0) - (a.extra_data?.natech_risk ?? 0))),
    [facilities])

  const toplamNufus = 354150
  const natechEtki  = senaryo === 'deprem' ? Math.min(100, Math.round((siddet - 5) * 28 * 1.4)) : senaryo === 'yangin' ? 45 : 38

  /* ══════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen" style={{ background: '#F8F9FA', fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── HEADER */}
      <div style={{ background: NAVY }} className="px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div style={{ background: `${GOLD}20`, border: `1px solid ${GOLD}40` }} className="p-2.5 rounded-xl">
              <IcoShield/>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Beylikdüzü Belediyesi</h1>
              <p style={{ color: '#94A3B8' }} className="text-xs mt-0.5">
                OMNI Afet Dayanıklılık Platformu · HFER-720 v2.0 · Sendai 2015–2030
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Supabase bağlantı göstergesi */}
            <div style={{
              background: loading ? 'rgba(148,163,184,.1)' : hata ? 'rgba(239,68,68,.1)' : 'rgba(34,197,94,.1)',
              border: `1px solid ${loading ? 'rgba(148,163,184,.2)' : hata ? 'rgba(239,68,68,.2)' : 'rgba(34,197,94,.25)'}`,
              color: loading ? '#94A3B8' : hata ? '#F87171' : '#4ADE80',
            }} className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg">
              <span className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-slate-400 animate-pulse' : hata ? 'bg-red-400' : 'bg-emerald-400'}`}/>
              {loading ? 'Bağlanıyor…' : hata ? 'Supabase hatası' : `Supabase · ${kpi.toplam} tesis`}
            </div>
            <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg"
                 style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}30`, color: GOLD }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GOLD }}/>
              Canlı · {new Date().toLocaleDateString('tr-TR')}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6">

        {/* ── KPI KARTLARI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { lbl: 'Toplam Tesis',   val: kpi.toplam, renk: '#60A5FA', sub: 'Supabase · canlı'          },
            { lbl: 'Kritik (H ≥ 4)', val: kpi.kritik, renk: '#EF4444', sub: 'Yüksek risk tesisi'        },
            { lbl: 'Hazmat Tesisi',  val: kpi.hazmat, renk: '#F97316', sub: 'NATECH riski taşıyor'      },
            { lbl: '24h Operasyon',  val: kpi.h24,    renk: '#F59E0B', sub: 'Sürekli çalışan tesis'     },
          ].map(k => (
            <Card key={k.lbl} className="p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{k.lbl}</p>
              {loading
                ? <div className="h-9 w-20 bg-gray-100 rounded animate-pulse mt-1"/>
                : <p className="text-3xl font-bold mt-1 font-mono" style={{ color: k.renk }}>{k.val.toLocaleString('tr-TR')}</p>
              }
              <p className="text-xs text-gray-400 mt-2">{k.sub}</p>
            </Card>
          ))}
        </div>

        {/* ── TABS */}
        <div className="flex gap-0 mb-6 border-b border-gray-200">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap -mb-px ${
                tab === t.key ? 'border-[#E8C97A] text-[#0A1628]' : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}>
              <span className={tab === t.key ? '' : 'opacity-50'}>{TAB_ICONS[t.key]}</span>
              {t.label}
              {t.key === 'tesis' && kpi.toplam > 0 && (
                <span className="ml-0.5 text-[10px] bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.5 rounded-full">
                  {kpi.toplam}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════
            İLÇE ÖZETİ
        ════════════════════════════════════════════════════ */}
        {tab === 'ozet' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              {/* URI Gauge */}
              <Card className="p-6 flex flex-col items-center justify-center">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">İlçe URI Skoru</p>
                {loading ? <div className="h-24 w-36 bg-gray-100 rounded animate-pulse"/> : <URIGauge value={kpi.uri} renk={kpi.uriRenk}/>}
                <div className="mt-3 text-center">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${hBadgeCls(kpi.uri < 40 ? 5 : kpi.uri < 60 ? 3.5 : kpi.uri < 75 ? 2.5 : 1)}`}>
                    {kpi.uri < 40 ? 'KRİTİK' : kpi.uri < 60 ? 'YÜKSEK' : kpi.uri < 75 ? 'ORTA' : 'İYİ'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center">HFER-720 · H skoru ortalamasından</p>
              </Card>

              {/* HFE Bileşenler */}
              <Card className="p-6">
                <SectionTitle icon={<IcoRadar/>} title="HFE Bileşen Analizi"/>
                {[
                  { label: 'H — Tehlike Yoğunluğu', val: loading ? 0 : parseFloat((facilities.reduce((s, f) => s + (f.extra_data?.H_score ?? 0), 0) / Math.max(facilities.length, 1) * 20).toFixed(0)), renk: '#EF4444', not: 'Düşük = iyi' },
                  { label: 'F — Kırılganlık',        val: 62, renk: '#F97316', not: 'Statik' },
                  { label: 'E — Kapasite',            val: 58, renk: '#22C55E', not: 'Statik' },
                ].map(item => (
                  <div key={item.label} className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="text-gray-800 font-mono font-semibold">{item.val} <span className="text-gray-300">({item.not})</span></span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full">
                      <div className="h-1.5 rounded-full transition-all" style={{ width: `${item.val}%`, background: item.renk }}/>
                    </div>
                  </div>
                ))}
                <div className="mt-4 p-3 rounded-lg text-xs text-gray-500" style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}20` }}>
                  <span style={{ color: GOLD }} className="font-medium">HFER-720:</span> URI = NormCurve(H × F × X × D / (1 + k·C²))
                </div>
              </Card>

              {/* Risk Sınıfı Donut */}
              <Card className="p-6">
                <SectionTitle icon={<IcoShield/>} title="Risk Sınıf Dağılımı"/>
                {loading
                  ? <div className="h-48 bg-gray-50 rounded-lg animate-pulse"/>
                  : <SvgDonut slices={donutSlices} centerLbl={String(kpi.toplam || '—')}/>
                }
              </Card>
            </div>

            {/* Aksiyon Planı + Kapasite */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Card className="p-6">
                <SectionTitle icon={<AlertTriangle className="w-4 h-4"/>} title="Öncelikli Aksiyon Planı"/>
                {[
                  { baslik: 'Yakuplu OSB — NATECH Planı',    acil: true,  icerik: 'RAPID-N protokolü uygulanmalı. Komşu tesis bağımlılık haritası ve domino zinciri analizi gerekli.', badge: 'Acil'   },
                  { baslik: 'Kavaklı — Sel Erken Uyarı',     acil: true,  icerik: 'Meteoroloji API entegrasyonu + SMS/siren sistemi. İBB ıslah sonrası izleme kritik.',              badge: 'Acil'   },
                  { baslik: 'Gürpınar — KAF Hattı Planı',    acil: false, icerik: 'Zemin sıvılaşma etüdü. KİPTAŞ dönüşümü hızlandırılmalı. Heyelan risk haritası çıkarılmalı.',     badge: 'Planla' },
                  { baslik: 'İlçe ISO 22301 İş Sürekliliği', acil: false, icerik: 'Belediye kritik hizmetleri için iş sürekliliği planı. Uluslararası fon başvurusu için zorunlu.',  badge: 'Planla' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 mb-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className={`w-1 rounded-full flex-shrink-0 my-0.5 ${item.acil ? 'bg-red-400' : 'bg-amber-400'}`}/>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-sm font-medium text-gray-800">{item.baslik}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${item.acil ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>{item.badge}</span>
                      </div>
                      <p className="text-xs text-gray-500">{item.icerik}</p>
                    </div>
                  </div>
                ))}
              </Card>

              <Card className="p-6">
                <SectionTitle icon={<IcoGrid/>} title="NEFES Birliği Kapasitesi"/>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: 'Gönüllü',            val: '992',    ikon: '👥' },
                    { label: 'Müdahale Aracı',     val: '169',    ikon: '🚒' },
                    { label: 'Müdahale İstasyonu', val: '10',     ikon: '📦' },
                    { label: 'Haneye Ulaşıldı',    val: '75.498', ikon: '🏠' },
                  ].map(k => (
                    <div key={k.label} className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                      <p className="text-xl mb-1">{k.ikon}</p>
                      <p className="text-lg font-bold text-gray-900">{k.val}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{k.label}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-lg text-xs text-gray-500" style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}20` }}>
                  <span style={{ color: GOLD }} className="font-medium">OMNI × Beylikdüzü Sinerji:</span>{' '}
                  Mevcut operasyonel kapasite güçlü. OMNI bu kapasiteye kantitatif risk skoru, NATECH analizi ve uluslararası standart uyumu ekliyor.
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            MAHALLE ANALİZİ
        ════════════════════════════════════════════════════ */}
        {tab === 'mahalle' && (
          <div className="space-y-5">
            <Card className="p-6">
              <SectionTitle icon={<IcoPin/>} title="Mahalle Bazlı Ortalama H Skoru (Supabase)"/>
              {loading ? (
                <div className="h-48 bg-gray-50 rounded-lg animate-pulse"/>
              ) : mahalleData.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">Mahalle verisi yüklenemedi.</p>
              ) : (
                <SvgBarChart
                  data={mahalleData.map(m => ({
                    label: m.nb,
                    value: m.avgH,
                    fill:  hRenk(m.avgH),
                  }))}
                />
              )}
            </Card>

            <Card>
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">Mahalle Risk Tablosu</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {/* Başlık */}
                <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_auto] px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                  <span>Mahalle</span><span>Tesis</span><span>Ort. H</span><span>Risk</span><span>Sektör</span>
                </div>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="px-4 py-3 animate-pulse">
                      <div className="h-4 bg-gray-100 rounded w-1/3"/>
                    </div>
                  ))
                ) : mahalleData.map(m => {
                  const aktif = secilenMahalle === m.nb
                  const ctx   = MAHALLE_CONTEXT[m.nb]
                  return (
                    <div key={m.nb}>
                      <button onClick={() => setSecilenMahalle(aktif ? null : m.nb)}
                        className={`w-full text-left grid grid-cols-[2fr_1fr_1fr_1fr_auto] items-center px-4 py-3 hover:bg-gray-50 transition-colors ${aktif ? 'bg-blue-50' : ''}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">{m.nb}</span>
                          {ctx?.natech && <span className="text-[10px] bg-orange-50 border border-orange-200 text-orange-600 px-1.5 py-0.5 rounded">NATECH</span>}
                        </div>
                        <span className="text-sm text-gray-600 font-mono">{m.sayi}</span>
                        <span className="text-sm font-mono font-semibold" style={{ color: hRenk(m.avgH) }}>{m.avgH}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium w-fit ${hBadgeCls(m.avgH)}`}>{hLabel(m.avgH)}</span>
                        <span className="text-xs text-gray-400">{SEKTOR_META[m.topSector]?.label ?? m.topSector}</span>
                      </button>
                      {aktif && ctx && (
                        <div className="px-4 pb-3 bg-blue-50 border-t border-blue-100">
                          <div className="grid grid-cols-2 gap-3 mt-2">
                            <div className="text-xs text-gray-600">
                              <span className="font-medium text-gray-800">Nüfus:</span>{' '}
                              {ctx.nufus.toLocaleString('tr-TR')} kişi
                            </div>
                            <div className="text-xs text-gray-600">
                              <span className="font-medium text-gray-800">Sendai:</span> {ctx.sendai}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2 leading-relaxed">{ctx.not}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            TESİS AĞI
        ════════════════════════════════════════════════════ */}
        {tab === 'tesis' && (
          <div className="space-y-5">
            {/* KPI mini row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { lbl: 'Toplam',    val: facilities.length,                               renk: '#60A5FA' },
                { lbl: 'Kritik',    val: kpi.kritik,                                      renk: '#EF4444' },
                { lbl: 'Hazmat',    val: kpi.hazmat,                                      renk: '#F97316' },
                { lbl: 'Çalışan',   val: facilities.reduce((s, f) => s + (f.employee_count ?? 0), 0), renk: '#10B981' },
              ].map(k => (
                <Card key={k.lbl} className="p-4 text-center">
                  <p className="text-2xl font-bold font-mono mt-1" style={{ color: k.renk }}>
                    {k.val.toLocaleString('tr-TR')}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{k.lbl}</p>
                </Card>
              ))}
            </div>

            <Card>
              {/* Arama + Filtre toolbar */}
              <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
                <input
                  type="text" placeholder="Tesis veya mahalle ara…" value={search}
                  onChange={e => { setSearch(e.target.value); setSayfa(0) }}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-amber-300 flex-1 min-w-[180px]"
                />
                <div className="flex gap-2 flex-wrap">
                  {(['hepsi', 'MUNICIPALITY', 'HOSPITAL', 'EDUCATION', 'INDUSTRIAL', 'BANK', 'HOTEL'] as const).map(s => {
                    const a = sektorFiltre === s
                    const m = s === 'hepsi' ? null : SEKTOR_META[s]
                    return (
                      <button key={s} onClick={() => { setSektorFiltre(s); setSayfa(0) }}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-all ${a ? 'font-semibold' : 'text-gray-400 border-gray-200 hover:text-gray-700'}`}
                        style={a ? { borderColor: m?.renk ?? '#94A3B8', background: (m?.renk ?? '#94A3B8') + '18', color: m?.renk ?? '#94A3B8' } : {}}>
                        {s === 'hepsi' ? 'Tümü' : m?.label}
                      </button>
                    )
                  })}
                </div>
                <span className="text-xs text-gray-400 ml-auto">{filteredFacilities.length} sonuç</span>
              </div>

              {/* Tablo başlığı */}
              <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <span>Tesis Adı</span><span>Mahalle</span><span>Sektör</span><span>H Skoru</span><span>Çalışan</span><span>Durum</span>
              </div>

              {loading && <div className="p-8 flex justify-center"><Spinner/></div>}
              {hata    && <div className="p-6 flex items-center gap-2 text-red-500 text-sm"><WifiOff className="w-4 h-4"/>{hata}</div>}

              {!loading && pagedFacilities.length === 0 && (
                <div className="p-8 text-center text-gray-400 text-sm">Eşleşen tesis bulunamadı.</div>
              )}

              <div className="divide-y divide-gray-50">
                {pagedFacilities.map(f => {
                  const h      = f.extra_data?.H_score ?? 0
                  const sm     = SEKTOR_META[f.sector] ?? SEKTOR_META.OTHER
                  const hazmat = f.extra_data?.hazmat_flag
                  return (
                    <div key={f.id} className="grid lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] items-center px-4 py-3 hover:bg-gray-50 transition-colors gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-medium text-gray-900 truncate">{f.name}</span>
                        {hazmat && <span className="text-[10px] bg-orange-50 border border-orange-200 text-orange-600 px-1.5 py-0.5 rounded flex-shrink-0">⚠ NATECH</span>}
                      </div>
                      <span className="text-xs text-gray-500">{f.extra_data?.neighborhood ?? '—'}</span>
                      <span className="text-xs font-medium" style={{ color: sm.renk }}>{sm.label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium w-fit ${hBadgeCls(h)}`}>
                        {h.toFixed(1)} {hLabel(h)}
                      </span>
                      <span className="text-xs text-gray-500 font-mono">{f.employee_count?.toLocaleString('tr-TR') ?? '—'}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${f.operates_24h ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-gray-400 bg-gray-50 border-gray-200'}`}>
                        {f.operates_24h ? '24h' : 'Normal'}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Sayfalama */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                  <button disabled={sayfa === 0} onClick={() => setSayfa(p => p - 1)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors">
                    ← Önceki
                  </button>
                  <span className="text-xs text-gray-400">
                    {sayfa + 1} / {totalPages} · {filteredFacilities.length} tesis
                  </span>
                  <button disabled={sayfa >= totalPages - 1} onClick={() => setSayfa(p => p + 1)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors">
                    Sonraki →
                  </button>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            CBS HARİTA
        ════════════════════════════════════════════════════ */}
        {tab === 'harita' && <CBSHarita/>}

        {/* ════════════════════════════════════════════════════
            NATECH SENARYO
        ════════════════════════════════════════════════════ */}
        {tab === 'natech' && (
          <div className="space-y-5">
            {/* Hazmat tesisleri listesi */}
            <Card>
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <span style={{ color: GOLD }}>⚠</span> Hazmat / NATECH Tesisleri
                </h3>
                <span className="text-xs bg-orange-50 border border-orange-200 text-orange-600 px-2 py-1 rounded-full">
                  {natechFacilities.length} tesis
                </span>
              </div>
              {loading && <div className="p-6 flex justify-center"><Spinner/></div>}
              {!loading && natechFacilities.length === 0 && (
                <p className="p-6 text-center text-sm text-gray-400">Hazmat tesisi bulunamadı.</p>
              )}
              <div className="divide-y divide-gray-50">
                <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                  <span>Tesis</span><span>Mahalle</span><span>Sektör</span><span>NATECH Riski</span><span>H Skoru</span>
                </div>
                {natechFacilities.map(f => {
                  const nr = (f.extra_data?.natech_risk as number | undefined) ?? 0
                  const h  = f.extra_data?.H_score ?? 0
                  const sm = SEKTOR_META[f.sector] ?? SEKTOR_META.OTHER
                  return (
                    <div key={f.id} className="grid lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center px-4 py-3 hover:bg-orange-50 transition-colors gap-2">
                      <span className="text-sm font-medium text-gray-900">{f.name}</span>
                      <span className="text-xs text-gray-500">{f.extra_data?.neighborhood ?? '—'}</span>
                      <span className="text-xs font-medium" style={{ color: sm.renk }}>{sm.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 bg-gray-100 rounded-full max-w-[60px]">
                          <div className="h-1.5 rounded-full bg-orange-500" style={{ width: `${Math.min(nr / 5 * 100, 100)}%` }}/>
                        </div>
                        <span className="text-xs font-mono font-semibold text-orange-600">{nr.toFixed(1)}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium w-fit ${hBadgeCls(h)}`}>{h.toFixed(1)}</span>
                    </div>
                  )
                })}
              </div>
            </Card>

            {/* Senaryo paneli */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Card className="p-6">
                <SectionTitle icon={<IcoRadar/>} title="Senaryo Parametreleri"/>
                <div className="mb-5">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Afet Türü</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[{ key: 'deprem', label: '🌍 Deprem' }, { key: 'yangin', label: '🔥 Yangın' }, { key: 'sel', label: '🌊 Sel' }].map(s => (
                      <button key={s.key} onClick={() => setSenaryo(s.key)}
                        className={`py-2.5 rounded-lg text-sm font-medium border transition-all ${senaryo === s.key ? 'text-[#0A1628] bg-white shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-800'}`}
                        style={senaryo === s.key ? { borderColor: GOLD } : {}}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
                {senaryo === 'deprem' && (
                  <div className="mb-5">
                    <div className="flex justify-between mb-2">
                      <p className="text-xs text-gray-400 uppercase tracking-widest">Deprem Şiddeti (Mw)</p>
                      <p className="font-mono font-bold text-sm" style={{ color: GOLD }}>{siddet.toFixed(1)}</p>
                    </div>
                    <input type="range" min="5.0" max="8.0" step="0.1" value={siddet}
                      onChange={e => setSiddet(parseFloat(e.target.value))}
                      className="w-full accent-yellow-400"/>
                    <div className="flex justify-between text-xs text-gray-300 mt-1"><span>Mw 5.0</span><span>Mw 8.0</span></div>
                  </div>
                )}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">RAPID-N Protokolü</p>
                  <div className="space-y-2 text-sm">
                    {[
                      { label: 'Etkilenen tesis',    val: `${natechFacilities.length} Hazmat tesisi` },
                      { label: 'NATECH D katsayısı', val: '2.4', renk: '#F97316' },
                      { label: 'Domino zinciri',     val: '3 komşu tesis' },
                      { label: 'Tahliye süresi',     val: '~45 dk' },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between">
                        <span className="text-gray-500">{item.label}</span>
                        <span className="font-mono font-medium text-gray-800" style={item.renk ? { color: item.renk } : {}}>{item.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              <div className="space-y-4">
                <Card className={`p-6 ${natechEtki > 60 ? 'border-red-200' : natechEtki > 30 ? 'border-orange-200' : 'border-amber-200'}`}>
                  <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">NATECH Kümülatif Etki Skoru</p>
                  <p className={`text-6xl font-bold mb-2 ${natechEtki > 60 ? 'text-red-500' : natechEtki > 30 ? 'text-orange-500' : 'text-amber-500'}`}>
                    {natechEtki}<span className="text-2xl text-gray-200">/100</span>
                  </p>
                  <p className="text-gray-600 text-sm">
                    {natechEtki > 60 ? 'KRİTİK — Acil tahliye ve müdahale protokolü devreye alınmalı' :
                     natechEtki > 30 ? 'YÜKSEK — Önleyici önlemler ve erken uyarı aktif edilmeli' :
                     'ORTA — İzleme ve hazırlık seviyesi yükseltilmeli'}
                  </p>
                </Card>
                <Card className="p-5">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Etki Projeksiyonu</p>
                  <div className="space-y-3">
                    {[
                      { label: 'Risk altındaki nüfus',    val: `~${Math.round(toplamNufus * (natechEtki / 100) * 0.6 / 1000)}K kişi`, renk: 'text-red-500'   },
                      { label: 'Tahliye gerektiren bölge', val: 'Yakuplu + Kavaklı',                                                   renk: 'text-orange-500' },
                      { label: 'Etkilenen tesis',         val: `${Math.ceil(natechEtki / 20 * natechFacilities.length / 5)} tesis`,    renk: 'text-amber-600'  },
                      { label: 'Acil müdahale süresi',    val: senaryo === 'deprem' ? '72 saat' : '48 saat',                          renk: 'text-gray-800'   },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">{item.label}</span>
                        <span className={`text-sm font-medium ${item.renk}`}>{item.val}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            SENDAİ UYUM
        ════════════════════════════════════════════════════ */}
        {tab === 'sendai' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[
                { no: 'SF-1', baslik: 'Afet Riskini Anlama',                 puan: 72, durum: 'Aktif',     omni: 'HFER-720 URI skoru + mahalle bazlı risk haritası',     renk: 'emerald' },
                { no: 'SF-2', baslik: 'Risk Yönetişimini Güçlendirme',       puan: 48, durum: 'Kısmi',     omni: 'Belediye ISO 22301 BCP planlaması + OMNI dashboard',   renk: 'amber'   },
                { no: 'SF-3', baslik: 'Dayanıklılığa Yatırım',               puan: 35, durum: 'Planlandı', omni: 'Tesis ağı dayanıklılık skoru + NATECH D katsayısı',    renk: 'amber'   },
                { no: 'SF-4', baslik: 'Etkin Müdahale ve Yeniden Yapılanma', puan: 21, durum: 'Eksik',     omni: 'EOC dashboard + NEFES Birliği protokolü entegrasyonu', renk: 'red'     },
              ].map(s => (
                <Card key={s.no} className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">{s.no}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                      s.renk === 'emerald' ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
                      s.renk === 'amber'   ? 'text-amber-600 bg-amber-50 border-amber-200' :
                      'text-red-600 bg-red-50 border-red-200'
                    }`}>{s.durum}</span>
                  </div>
                  <p className="text-gray-900 font-semibold mb-3 text-sm">{s.baslik}</p>
                  <div className="h-1.5 bg-gray-100 rounded-full mb-3">
                    <div className={`h-1.5 rounded-full ${s.renk === 'emerald' ? 'bg-emerald-500' : s.renk === 'amber' ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${s.puan}%` }}/>
                  </div>
                  <p className="text-xs text-gray-500"><span style={{ color: GOLD }} className="font-medium">OMNI katkısı:</span> {s.omni}</p>
                </Card>
              ))}
            </div>
            <Card className="p-6">
              <h3 className="text-gray-900 font-semibold mb-4 text-sm">Uluslararası Fon Fırsatları</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {[
                  { fon: 'EU Horizon Europe',   konu: 'Şehir Dayanıklılığı (2024–2027)',  gereklilik: 'Sendai uyum raporu + kantitatif risk skoru', durum: 'Uygun'         },
                  { fon: 'UNDP DRRM',           konu: 'Afet Risk Azaltma Fonu',           gereklilik: 'RAPID-N analizi + tesis ağı haritası',       durum: 'Değerlendirme' },
                  { fon: 'Dünya Bankası GFDRR', konu: 'Küresel Afet Risk Finansmanı',     gereklilik: 'ISO 22301 BCP + URI endeksi',                 durum: 'Potansiyel'    },
                ].map(f => (
                  <div key={f.fon} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <p className="text-gray-900 font-medium text-sm mb-1">{f.fon}</p>
                    <p className="text-xs text-gray-400 mb-2">{f.konu}</p>
                    <p className="text-xs text-gray-400 mb-3"><span className="text-gray-600">Gereklilik:</span> {f.gereklilik}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                      f.durum === 'Uygun'         ? 'text-emerald-600 bg-emerald-50 border-emerald-200' :
                      f.durum === 'Değerlendirme' ? 'text-amber-600 bg-amber-50 border-amber-200' :
                      'text-blue-600 bg-blue-50 border-blue-200'
                    }`}>{f.durum}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-10 pt-5 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-gray-300">OMNI Resilience Platform · HFER-720 v2.0 · İTÜ AYM · © 2026</p>
          <p className="text-xs text-gray-300">Sendai 2015–2030 · ISO 22301 · AFAD · RAPID-N</p>
        </div>
      </div>
    </div>
  )
}
