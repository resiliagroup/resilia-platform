'use client'

function uriToAdis(uri: number): number { return Math.round(200 + (uri / 100) * 1000) }
function adisRenk(a: number): string { return a<450?'#EF4444':a<650?'#F97316':a<850?'#EAB308':a<1050?'#22C55E':'#16A34A' }
function adisLabel(a: number): string { return a<450?'Kritik Risk':a<650?'Yüksek Risk':a<850?'Orta Risk':a<1050?'İyi':'Güçlü' }
import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { createClient } from '@supabase/supabase-js'
import { Loader2, WifiOff, AlertTriangle } from 'lucide-react'
import { createAssessment, type OmniAssessment, RISK_CLASS_TR, RISK_CLASS_COLOR } from '@/lib/api'

/* ══════════════════════════════════════════════════════════════
   SUPABASE — Beylikdüzü projesi (service role key)
══════════════════════════════════════════════════════════════ */
const sbBD = createClient(
  'https://gqguwgbopgnpwzjwcexl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5OTgzMywiZXhwIjoyMDg4OTc1ODMzfQ.Ku-JRx8JFH5a3SIj7sGP_Dy_nM89NMMW34gPyxVO_qI',
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
  F_score?:      number
  X_score?:      number
  C_score?:      number
  hazmat_flag?:  boolean
  natech_risk?:  number
  sub_sector?:   string
  risk_deprem?:  number
  risk_sel?:     number
  [k: string]:   unknown
}

type OmniSkorDurumu =
  | { status: 'loading' }
  | { status: 'error'; msg: string }
  | { status: 'ok'; data: OmniAssessment }

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
  MUNICIPALITY: { label: 'Public',      renk: '#5BA3DC' },
  HOSPITAL:     { label: 'Healthcare',  renk: '#EF4444' },
  EDUCATION:    { label: 'Education',   renk: '#F59E0B' },
  INDUSTRIAL:   { label: 'Industry',    renk: '#F97316' },
  BANK:         { label: 'Finance',     renk: '#10B981' },
  HOTEL:        { label: 'Tourism',     renk: '#A78BFA' },
  OTHER:        { label: 'Other',       renk: '#94A3B8' },
}

const TABS = [
  { key: 'ozet',    label: 'District Summary' },
  { key: 'mahalle', label: 'Neighborhood'     },
  { key: 'tesis',   label: 'Facility Network' },
  { key: 'harita',  label: 'GIS Map'          },
  { key: 'natech',  label: 'NATECH'           },
  { key: 'sendai',  label: 'Sendai Alignment' },
] as const
type Tab = typeof TABS[number]['key']

/* ══════════════════════════════════════════════════════════════
   CCDS PNG İKONLAR (public/icons/)
══════════════════════════════════════════════════════════════ */
const CCDS = (file: string, alt: string, size = 18) => (
  <img src={`/icons/${file}`} width={size} height={size} alt={alt} style={{ objectFit: 'contain', flexShrink: 0 }}/>
)
function IcoShield()   { return CCDS('Icon_PROTECT_09_Physical.png',   'Koruma', 18) }
function IcoRadar()    { return CCDS('Icon_MIT_06_Risk.png',            'Risk',   18) }
function IcoPin()      { return CCDS('Icon_RESP_15_Situational.png',   'Konum',  18) }
function IcoBuilding() { return CCDS('Icon_REC_04_Infrastructure.png', 'Altyapı',18) }
function IcoGrid()     { return CCDS('Icon_MIT_03_Operational.png',    'Operasyonel',18) }
function IcoBook()     { return CCDS('Icon_PROTECT_01_Planning.png',   'Planlama',18) }

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
      <span>Loading…</span>
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
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize={11} fill="#9CA3AF">facilities</text>
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
const hLabel = (h = 0) => h >= 4 ? 'CRITICAL' : h >= 3 ? 'HIGH' : h >= 2 ? 'MEDIUM' : 'GOOD'
const hBadgeCls = (h = 0) =>
  h >= 4 ? 'text-red-600 bg-red-50 border-red-200' :
  h >= 3 ? 'text-orange-600 bg-orange-50 border-orange-200' :
  h >= 2 ? 'text-amber-600 bg-amber-50 border-amber-200' :
           'text-emerald-600 bg-emerald-50 border-emerald-200'

/* ── C skoru yardımcısı (Supabase'de yoksa türetilir) */
function cScore(f: Facility): number {
  const raw = (f.extra_data as Record<string, unknown>)?.C_score as number | undefined
  if (raw !== undefined) return parseFloat(String(raw))
  return Math.max(0.5, Math.min(4.8,
    3.0
    - (f.building_age > 30 ? 1 : f.building_age > 20 ? 0.5 : 0)
    + (f.sector === 'HOSPITAL' ? 0.5 : f.sector === 'MUNICIPALITY' ? 0.3 : 0)
  ))
}

/* ── SVG Scatter Plot: Tehlike vs Kapasite */
function ScatterPlot({ facilities }: { facilities: Facility[] }) {
  const [tip, setTip] = useState<{ sx: number; sy: number; name: string; h: number; c: number } | null>(null)
  const W = 440, H = 300
  const ml = 44, mr = 16, mt = 32, mb = 44
  const pw = W - ml - mr, ph = H - mt - mb

  const pts = facilities.map(f => {
    const h = f.extra_data?.H_score ?? 0
    const c = cScore(f)
    return {
      f, h: parseFloat(h.toFixed(2)), c: parseFloat(c.toFixed(2)),
      sx: ml + (c / 5) * pw,
      sy: mt + ph - (h / 5) * ph,
      renk: SEKTOR_META[f.sector]?.renk ?? '#94A3B8',
    }
  })

  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W, display: 'block' }}>
        {/* Kritik bölge: H>3.5 ve C<2.5 — sol üst */}
        <rect x={ml} y={mt} width={(2.5/5)*pw} height={(1.5/5)*ph} fill="#FEE2E218" stroke="#EF444430" strokeWidth={1} rx={3}/>
        {/* Güvenli bölge: H<2.5 ve C>3.5 — sağ alt */}
        <rect x={ml+(3.5/5)*pw} y={mt+(2.5/5)*ph} width={(1.5/5)*pw} height={(2.5/5)*ph} fill="#DCFCE718" stroke="#22C55E30" strokeWidth={1} rx={3}/>
        {/* Zone labels */}
        <text x={ml+5} y={mt+12} fontSize={8} fill="#EF4444" opacity={0.65} fontWeight={600}>CRITICAL ZONE</text>
        <text x={ml+pw-5} y={mt+ph-5} textAnchor="end" fontSize={8} fill="#22C55E" opacity={0.65} fontWeight={600}>SAFE ZONE</text>
        {/* Grid çizgileri */}
        {[1,2,3,4].map(v => (
          <g key={v}>
            <line x1={ml+(v/5)*pw} y1={mt} x2={ml+(v/5)*pw} y2={mt+ph} stroke="#F3F4F6" strokeWidth={1}/>
            <line x1={ml} y1={mt+ph-(v/5)*ph} x2={ml+pw} y2={mt+ph-(v/5)*ph} stroke="#F3F4F6" strokeWidth={1}/>
          </g>
        ))}
        {/* Eksenler */}
        <line x1={ml} y1={mt} x2={ml} y2={mt+ph+1} stroke="#D1D5DB" strokeWidth={1.5}/>
        <line x1={ml-1} y1={mt+ph} x2={ml+pw} y2={mt+ph} stroke="#D1D5DB" strokeWidth={1.5}/>
        {/* Eksen etiketleri */}
        {[0,1,2,3,4,5].map(v => (
          <g key={v}>
            <text x={ml+(v/5)*pw} y={mt+ph+13} textAnchor="middle" fontSize={8} fill="#9CA3AF">{v}</text>
            <text x={ml-5} y={mt+ph-(v/5)*ph+3} textAnchor="end" fontSize={8} fill="#9CA3AF">{v}</text>
          </g>
        ))}
        {/* Eksen başlıkları */}
        <text x={ml+pw/2} y={H-4} textAnchor="middle" fontSize={9} fill="#6B7280">Capacity Score (C) →</text>
        <text x={10} y={mt+ph/2} textAnchor="middle" fontSize={9} fill="#6B7280" transform={`rotate(-90,10,${mt+ph/2})`}>Hazard Score (H) →</text>
        {/* Chart title */}
        <text x={ml+pw/2} y={mt-12} textAnchor="middle" fontSize={12} fontWeight={700} fill="#111827">Hazard vs Capacity Matrix</text>
        {/* Noktalar */}
        {pts.map(p => (
          <circle key={p.f.id} cx={p.sx} cy={p.sy} r={5}
            fill={p.renk} fillOpacity={0.72} stroke="white" strokeWidth={0.8}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setTip({ sx: p.sx, sy: p.sy, name: p.f.name, h: p.h, c: p.c })}
            onMouseLeave={() => setTip(null)}
          />
        ))}
        {/* Tooltip */}
        {tip && (() => {
          const tx = Math.min(tip.sx + 8, W - 130)
          const ty = Math.max(tip.sy - 44, mt)
          return (
            <g>
              <rect x={tx} y={ty} width={120} height={36} rx={5} fill="white" stroke="#E5E7EB" strokeWidth={1}
                    filter="drop-shadow(0 1px 4px rgba(0,0,0,.1))"/>
              <text x={tx+7} y={ty+13} fontSize={8.5} fontWeight={700} fill="#111827">
                {tip.name.length > 17 ? tip.name.slice(0,16)+'…' : tip.name}
              </text>
              <text x={tx+7} y={ty+26} fontSize={8} fill="#6B7280">H: {tip.h.toFixed(1)} · C: {tip.c.toFixed(1)}</text>
            </g>
          )
        })()}
      </svg>
      {/* Lejant */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px', marginTop: 8 }}>
        {(Object.entries(SEKTOR_META) as [Sektor, { label: string; renk: string }][]).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6B7280' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: v.renk, display: 'inline-block', flexShrink: 0 }}/>
            {v.label}
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6B7280' }}>
          <span style={{ width: 8, height: 8, background: '#FEE2E2', border: '1px solid #EF4444', display: 'inline-block', flexShrink: 0 }}/>
          Critical Zone
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6B7280' }}>
          <span style={{ width: 8, height: 8, background: '#DCFCE7', border: '1px solid #22C55E', display: 'inline-block', flexShrink: 0 }}/>
          Safe Zone
        </div>
      </div>
    </div>
  )
}

/* ── Exposure Hiyerarşi Tablosu */
function ExposureHierarchy({ facilities }: { facilities: Facility[] }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const toggle = (key: string) => setExpanded(prev => {
    const next = new Set(prev)
    if (next.has(key)) next.delete(key); else next.add(key)
    return next
  })

  const nbMap = new Map<string, Map<Sektor, Facility[]>>()
  for (const f of facilities) {
    const nb = f.extra_data?.neighborhood ?? 'Belirsiz'
    if (!nbMap.has(nb)) nbMap.set(nb, new Map())
    const sMap = nbMap.get(nb)!
    if (!sMap.has(f.sector)) sMap.set(f.sector, [])
    sMap.get(f.sector)!.push(f)
  }

  const calcMetrics = (fList: Facility[]) => {
    const avgH = fList.reduce((s, f) => s + (f.extra_data?.H_score ?? 0), 0) / fList.length
    const avgC = fList.reduce((s, f) => s + cScore(f), 0) / fList.length
    const residual = avgH * (1 - avgC / 5)
    return { avgH: parseFloat(avgH.toFixed(2)), avgC: parseFloat(avgC.toFixed(2)), residual: parseFloat(residual.toFixed(2)) }
  }

  const rColor = (v: number) => v >= 4 ? '#EF4444' : v >= 3 ? '#F97316' : v >= 2 ? '#F59E0B' : '#22C55E'
  const rBg    = (v: number) => v >= 4 ? '#FEF2F2' : v >= 3 ? '#FFF7ED' : v >= 2 ? '#FFFBEB' : '#F0FDF4'

  const rows = [...nbMap.entries()].map(([nb, sMap]) => {
    const allF    = [...sMap.values()].flat()
    const metrics = calcMetrics(allF)
    const sectors = [...sMap.entries()].map(([sector, fList]) => ({
      sector, facilities: fList, ...calcMetrics(fList),
    })).sort((a, b) => b.residual - a.residual)
    return { nb, sayi: allF.length, ...metrics, sectors }
  }).sort((a, b) => b.residual - a.residual)

  const COL = '2fr 0.55fr 1fr 1fr 1fr'

  return (
    <Card>
      <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <span style={{ color: GOLD }}>⚠</span> Exposure Hierarchy Table
        </h3>
        <span className="text-xs text-gray-400">Neighborhood → Sector → Facility · Sorted by Residual Exposure</span>
      </div>
      {/* Sütun başlıkları */}
      <div className="hidden lg:grid px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-50"
           style={{ gridTemplateColumns: COL }}>
        <span>Neighborhood / Sector</span><span>Facilities</span>
        <span>Inherent Risk (H̄)</span><span>Control Effectiveness</span><span>Residual Exp.</span>
      </div>
      <div className="divide-y divide-gray-50">
        {rows.map(row => {
          const nbOpen = expanded.has(`nb_${row.nb}`)
          return (
            <div key={row.nb}>
              {/* Mahalle satırı */}
              <button onClick={() => toggle(`nb_${row.nb}`)} className="w-full text-left hover:bg-gray-50 transition-colors">
                <div className="grid items-center px-4 py-3 gap-2" style={{ gridTemplateColumns: COL }}>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 10, color: '#9CA3AF', display: 'inline-block', transition: 'transform .2s',
                                   transform: nbOpen ? 'rotate(90deg)' : 'none' }}>▶</span>
                    <span className="text-sm font-semibold text-gray-900">{row.nb}</span>
                  </div>
                  <span className="text-sm font-mono text-gray-600">{row.sayi}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full border w-fit"
                        style={{ color: rColor(row.avgH), background: rBg(row.avgH), borderColor: rColor(row.avgH)+'40' }}>
                    {row.avgH.toFixed(1)}
                  </span>
                  <span className="text-xs font-mono text-blue-600">{((row.avgC/5)*100).toFixed(0)}%</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full border w-fit"
                        style={{ color: rColor(row.residual), background: rBg(row.residual), borderColor: rColor(row.residual)+'40' }}>
                    {row.residual.toFixed(2)}
                  </span>
                </div>
              </button>

              {/* Sektör satırları */}
              {nbOpen && row.sectors.map(sec => {
                const secKey = `sec_${row.nb}_${sec.sector}`
                const secOpen = expanded.has(secKey)
                const sm = SEKTOR_META[sec.sector] ?? SEKTOR_META.OTHER
                return (
                  <div key={sec.sector} style={{ background: '#FAFAFA' }}>
                    <button onClick={() => toggle(secKey)} className="w-full text-left hover:bg-blue-50/60 transition-colors">
                      <div className="grid items-center gap-2 py-2.5"
                           style={{ gridTemplateColumns: COL, paddingLeft: 32, paddingRight: 16 }}>
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: 9, color: '#9CA3AF', display: 'inline-block', transition: 'transform .2s',
                                         transform: secOpen ? 'rotate(90deg)' : 'none' }}>▶</span>
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: sm.renk }}/>
                          <span className="text-xs font-medium text-gray-700">{sm.label}</span>
                        </div>
                        <span className="text-xs font-mono text-gray-500">{sec.facilities.length}</span>
                        <span className="text-xs font-mono font-semibold" style={{ color: rColor(sec.avgH) }}>{sec.avgH.toFixed(1)}</span>
                        <span className="text-xs font-mono text-blue-500">{((sec.avgC/5)*100).toFixed(0)}%</span>
                        <span className="text-xs font-mono font-semibold" style={{ color: rColor(sec.residual) }}>{sec.residual.toFixed(2)}</span>
                      </div>
                    </button>
                    {/* Tesis satırları */}
                    {secOpen && sec.facilities
                      .map(f => ({ f, res: (f.extra_data?.H_score ?? 0) * (1 - cScore(f)/5) }))
                      .sort((a, b) => b.res - a.res)
                      .slice(0, 10)
                      .map(({ f, res }) => (
                        <div key={f.id} className="grid items-center gap-2 hover:bg-blue-50/40 transition-colors"
                             style={{ gridTemplateColumns: COL, paddingLeft: 52, paddingRight: 16,
                                      paddingTop: 6, paddingBottom: 6, borderTop: '1px solid #F9FAFB' }}>
                          <span className="text-xs text-gray-600 truncate">{f.name}</span>
                          <span className="text-xs text-gray-400">—</span>
                          <span className="text-xs font-mono" style={{ color: rColor(f.extra_data?.H_score ?? 0) }}>
                            {(f.extra_data?.H_score ?? 0).toFixed(1)}
                          </span>
                          <span className="text-xs font-mono text-blue-400">{((cScore(f)/5)*100).toFixed(0)}%</span>
                          <span className="text-xs font-mono" style={{ color: rColor(res) }}>{res.toFixed(2)}</span>
                        </div>
                      ))
                    }
                    {secOpen && sec.facilities.length > 10 && (
                      <div className="text-xs text-gray-400 py-1.5 text-center" style={{ paddingLeft: 52 }}>
                        +{sec.facilities.length - 10} more facilities…
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

/* ══════════════════════════════════════════════════════════════
   DYNAMIC IMPORT — CBS HARİTA
══════════════════════════════════════════════════════════════ */
const CBSHarita = dynamic(() => import('./CBSHarita'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50" style={{ height: 520 }}>
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Map loading…
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
   SENDAI UYUM SEKMESİ
══════════════════════════════════════════════════════════════ */
const SF_RENK: Record<string, { border: string; bg: string; text: string; bar: string; badge: string; badgeBg: string; badgeBorder: string }> = {
  Active:    { border:'#10B981', bg:'#F0FDF4', text:'#059669', bar:'#10B981', badge:'#059669', badgeBg:'#D1FAE5', badgeBorder:'#6EE7B7' },
  Partial:   { border:'#F59E0B', bg:'#FFFBEB', text:'#D97706', bar:'#F59E0B', badge:'#D97706', badgeBg:'#FEF3C7', badgeBorder:'#FCD34D' },
  Planned:   { border:'#F97316', bg:'#FFF7ED', text:'#EA580C', bar:'#F97316', badge:'#EA580C', badgeBg:'#FFEDD5', badgeBorder:'#FDBA74' },
  Missing:   { border:'#EF4444', bg:'#FEF2F2', text:'#DC2626', bar:'#EF4444', badge:'#DC2626', badgeBg:'#FEE2E2', badgeBorder:'#FCA5A5' },
}

const GOSTERGE_IKONU: Record<string, string> = { '✓': '✓', '⚠': '⚠', '✗': '✗' }
const GOSTERGE_RENK:  Record<string, string>  = { '✓': '#10B981', '⚠': '#F59E0B', '✗': '#EF4444' }

function SfKarti({ no, baslik, ilerleme, durum, gostergeler, omni, ikon }: {
  no: string; baslik: string; ilerleme: number; durum: string
  gostergeler: { metin: string; ikon: '✓' | '⚠' | '✗' }[]
  omni: string; ikon?: string
}) {
  const r = SF_RENK[durum] ?? SF_RENK.Eksik
  return (
    <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderLeft: `4px solid ${r.border}`,
                  borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Başlık satırı */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {ikon && <img src={ikon} width={28} height={28} alt={no} style={{ objectFit: 'contain', flexShrink: 0 }}/>}
          <span style={{ fontFamily: 'DM Mono,monospace', fontSize: 11, fontWeight: 700, letterSpacing: 1,
                         background: r.bg, color: r.text, border: `1px solid ${r.border}44`,
                         padding: '3px 8px', borderRadius: 6 }}>{no}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{baslik}</span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                       color: r.badge, background: r.badgeBg, border: `1px solid ${r.badgeBorder}` }}>{durum}</span>
      </div>

      {/* Progress */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 11, color: '#6B7280' }}>Progress</span>
          <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'DM Mono,monospace', color: r.text }}>{ilerleme}%</span>
        </div>
        <svg width="100%" height="8" style={{ display: 'block', borderRadius: 4, overflow: 'hidden' }}>
          <rect x="0" y="0" width="100%" height="8" rx="4" fill="#F3F4F6"/>
          <rect x="0" y="0" width={`${ilerleme}%`} height="8" rx="4" fill={r.bar}/>
        </svg>
      </div>

      {/* Göstergeler */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {gostergeler.map((g, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: GOSTERGE_RENK[g.ikon], flexShrink: 0, width: 14 }}>
              {GOSTERGE_IKONU[g.ikon]}
            </span>
            <span style={{ fontSize: 12, color: '#374151' }}>{g.metin}</span>
          </div>
        ))}
      </div>

      {/* OMNI katkısı */}
      <div style={{ background: '#FFFBF0', border: '1px solid #FDE68A', borderRadius: 8, padding: '8px 12px' }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#92400E', letterSpacing: 0.5, textTransform: 'uppercase' }}>
          OMNI Contribution ·{' '}
        </span>
        <span style={{ fontSize: 11, color: '#78350F' }}>{omni}</span>
      </div>
    </div>
  )
}

const FON_DURUM_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  'Eligible':        { color: '#059669', bg: '#D1FAE5', border: '#6EE7B7' },
  'Under Review':    { color: '#D97706', bg: '#FEF3C7', border: '#FCD34D' },
  'Active Process':  { color: '#2563EB', bg: '#DBEAFE', border: '#93C5FD' },
  'Planning':        { color: '#7C3AED', bg: '#EDE9FE', border: '#C4B5FD' },
  'Potential':       { color: '#0891B2', bg: '#CFFAFE', border: '#67E8F9' },
  'Technical Support': { color: '#D97706', bg: '#FEF3C7', border: '#FCD34D' },
}

function FonKarti({ isim, tur, butce, durum, aciklama, gereklilikler, tarih, logoHarf }: {
  isim: string; tur: string; butce: string; durum: string; aciklama: string
  gereklilikler: string[]; tarih: string; logoHarf: string
}) {
  const ds = FON_DURUM_STYLE[durum] ?? FON_DURUM_STYLE['Potansiyel']
  return (
    <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 18,
                  display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        {/* Logo placeholder */}
        <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F1F5F9', border: '1px solid #E2E8F0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="40" height="40" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="10" fill="#F1F5F9"/>
            <text x="20" y="26" textAnchor="middle" fontSize="14" fontWeight="800" fill="#64748B"
                  fontFamily="DM Mono,monospace">{logoHarf}</text>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{isim}</span>
            <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                           color: ds.color, background: ds.bg, border: `1px solid ${ds.border}`, whiteSpace: 'nowrap' }}>{durum}</span>
          </div>
          <span style={{ fontSize: 11, color: '#6B7280' }}>{tur}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'DM Mono,monospace', color: '#1D4ED8',
                       background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '3px 9px', borderRadius: 6 }}>{butce}</span>
        <span style={{ fontSize: 11, color: '#9CA3AF' }}>{aciklama}</span>
      </div>

      <div>
        <p style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>Requirements</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {gereklilikler.map((g, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#CBD5E1', flexShrink: 0 }}/>
              <span style={{ fontSize: 11, color: '#4B5563' }}>{g}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: '#9CA3AF' }}>Est. application</span>
        <span style={{ fontSize: 11, fontWeight: 600, fontFamily: 'DM Mono,monospace', color: '#374151' }}>{tarih}</span>
      </div>
    </div>
  )
}

function SendaiTab() {
  const omniUyumSkoru = 47
  const SF_DATA = [
    {
      no: 'SF-1', baslik: 'Understanding Disaster Risk', ilerleme: 68, durum: 'Active',
      ikon: '/icons/Icon_MIT_06_Risk.png',
      gostergeler: [
        { metin: 'URI score ready — omniRISK calculation active',          ikon: '✓' as const },
        { metin: 'Neighborhood map — 6 neighborhood analysis completed',   ikon: '✓' as const },
        { metin: 'GIS integration — heat map partial, F-N curve missing',  ikon: '⚠' as const },
      ],
      omni: 'omniRISK URI score + neighborhood-based risk map + GIS facility layer',
    },
    {
      no: 'SF-2', baslik: 'Strengthening Risk Governance', ilerleme: 34, durum: 'Partial',
      ikon: '/icons/Icon_PROTECT_01_Planning.png',
      gostergeler: [
        { metin: 'ISO 22301 — municipality in draft phase',                ikon: '⚠' as const },
        { metin: 'BCP plan — not yet completed',                           ikon: '✗' as const },
        { metin: 'OMNI Dashboard — active with live data',                 ikon: '✓' as const },
      ],
      omni: 'ISO 22301 BCP planning advisory + governance dashboard integration',
    },
    {
      no: 'SF-3', baslik: 'Investing in Disaster Risk Reduction', ilerleme: 21, durum: 'Planned',
      ikon: '/icons/Icon_MIT_05_LongTerm.png',
      gostergeler: [
        { metin: 'Facility score — 782 facilities with H_score calculated', ikon: '✓' as const },
        { metin: 'Investment plan — in draft preparation phase',             ikon: '⚠' as const },
        { metin: 'NATECH investment — not yet planned',                      ikon: '✗' as const },
      ],
      omni: 'Facility resilience score + NATECH D coefficient + priority investment map',
    },
    {
      no: 'SF-4', baslik: 'Enhancing Response & Recovery', ilerleme: 12, durum: 'Missing',
      ikon: '/icons/Icon_RESP_03_OpCoord.png',
      gostergeler: [
        { metin: 'EOC setup — protocol not prepared',                        ikon: '✗' as const },
        { metin: 'Drill plan — schedule not established',                    ikon: '✗' as const },
        { metin: 'NEFES protocol — integration partial',                     ikon: '⚠' as const },
      ],
      omni: 'EOC dashboard + NEFES Brigade protocol integration + drill module',
    },
  ]

  const ULUSLAR_FON = [
    {
      isim: 'EU Horizon Europe Cluster 3', tur: 'Civil Security — Disaster Resilience',
      butce: '€5–15M', durum: 'Eligible', logoHarf: 'HE',
      aciklama: 'Consortium application, Q3 2026',
      gereklilikler: ['Sendai compliance report + quantitative risk score', 'Minimum 3 EU member country partners', 'OMNI / HFER-720 data integration', 'Municipality as co-applicant institution'],
      tarih: 'Q3 2026',
    },
    {
      isim: 'EU IPA III', tur: 'Pre-Accession Fund — Urban Resilience',
      butce: '€2–8M', durum: 'Under Review', logoHarf: 'IPA',
      aciklama: 'Direct municipal application',
      gereklilikler: ['National alignment document', 'GIS integration', 'Disaster risk map'],
      tarih: 'Q1 2027',
    },
    {
      isim: 'UNDRR MCR2030', tur: 'Making Cities Resilient 2030',
      butce: 'Micro-grants', durum: 'Active Process', logoHarf: 'UN',
      aciklama: 'Resilience Hub status',
      gereklilikler: ['Sendai monitoring data', 'Municipal commitment letter', 'OMNI platform evidence'],
      tarih: 'Ongoing',
    },
    {
      isim: 'URBACT IV', tur: 'European Urban Networks Programme',
      butce: '€850K', durum: 'Planning', logoHarf: 'UR',
      aciklama: '3–4 European city consortium',
      gereklilikler: ['Partner European cities', 'Action plan draft', 'Urban resilience theme'],
      tarih: 'Q2 2027',
    },
    {
      isim: 'World Bank GFDRR', tur: 'Global Disaster Risk Financing',
      butce: '$2–10M', durum: 'Potential', logoHarf: 'WB',
      aciklama: 'Application via İLBANK',
      gereklilikler: ['ISO 22301 BCP certificate', 'URI index calculated', 'İLBANK intermediary'],
      tarih: 'Q4 2026',
    },
    {
      isim: 'JICA Earthquake Cooperation', tur: 'Japan International Cooperation',
      butce: 'Technical credit', durum: 'Technical Support', logoHarf: 'JI',
      aciklama: 'İTÜ partnership required',
      gereklilikler: ['ITU AYM official partnership', 'Earthquake facility risk analysis', 'Japan–Turkey framework agreement'],
      tarih: '2027',
    },
    {
      isim: 'EBRD Green Cities', tur: 'Climate & NATECH Adaptation',
      butce: 'Project-based', durum: 'Under Review', logoHarf: 'EB',
      aciklama: 'Istanbul EBRD city status',
      gereklilikler: ['NATECH risk profile', 'Climate adaptation action plan', 'Green infrastructure component'],
      tarih: 'Q2 2026',
    },
  ]

  const ULUSAL_FON = [
    {
      isim: 'İSTKA MDP', tur: 'Spatial Transformation Project',
      butce: '10–20M TL', durum: 'Eligible', logoHarf: 'İK',
      aciklama: 'Beylikdüzü as applicant, 3–6 months',
      gereklilikler: ['Urban transformation plan', 'Facility network analysis (OMNI)', 'Municipal council decision'],
      tarih: 'Q2 2026',
    },
    {
      isim: 'TÜBİTAK 1001 / TEYDEB', tur: 'R&D Project Support',
      butce: '2–5M TL', durum: 'Planning', logoHarf: 'TB',
      aciklama: 'İTÜ partnership, 12–18 months',
      gereklilikler: ['ITU AYM as executing institution', 'HFER-720 R&D plan', 'Academic publication commitment'],
      tarih: 'Q3 2026',
    },
    {
      isim: 'AFAD UDAP', tur: 'National Earthquake Research Programme',
      butce: 'Direct support', durum: 'Eligible', logoHarf: 'AF',
      aciklama: 'NATECH modelling, direct alignment',
      gereklilikler: ['NATECH facility list ready (782 facilities)', 'Disaster modelling infrastructure', 'AFAD data-sharing protocol'],
      tarih: 'Q1 2026',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'DM Sans,sans-serif' }}>

      {/* OMNI UYUM SKORU — üstte büyük */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: '24px 28px',
                    display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <span style={{ fontSize: 64, fontWeight: 900, fontFamily: 'DM Mono,monospace', lineHeight: 1,
                         background: 'linear-gradient(135deg,#F97316,#EF4444)', WebkitBackgroundClip: 'text',
                         WebkitTextFillColor: 'transparent' }}>{omniUyumSkoru}</span>
          <span style={{ fontSize: 13, color: '#9CA3AF', fontFamily: 'DM Mono,monospace' }}>/ 100</span>
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>OMNI Sendai Alignment Score</p>
          <p style={{ fontSize: 12, color: '#6B7280', margin: '0 0 12px' }}>Weighted average of 4 Sendai Framework priorities</p>
          <svg width="100%" height="10" style={{ display: 'block' }}>
            <rect x="0" y="0" width="100%" height="10" rx="5" fill="#F3F4F6"/>
            <rect x="0" y="0" width={`${omniUyumSkoru}%`} height="10" rx="5" fill="url(#omniGrad)"/>
            <defs>
              <linearGradient id="omniGrad" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#F97316"/>
                <stop offset="100%" stopColor="#EF4444"/>
              </linearGradient>
            </defs>
          </svg>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 10, color: '#9CA3AF' }}>Current: {omniUyumSkoru}%</span>
            <span style={{ fontSize: 10, color: '#10B981', fontWeight: 600 }}>2026 Target: 75%</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[{ no:'SF-1', pct: 68, renk:'#10B981' }, { no:'SF-2', pct: 34, renk:'#F59E0B' },
            { no:'SF-3', pct: 21, renk:'#F97316' }, { no:'SF-4', pct: 12, renk:'#EF4444' }].map(s => (
            <div key={s.no} style={{ textAlign: 'center', width: 52 }}>
              <svg width="52" height="52" viewBox="0 0 52 52">
                <circle cx="26" cy="26" r="20" fill="none" stroke="#F3F4F6" strokeWidth="5"/>
                <circle cx="26" cy="26" r="20" fill="none" stroke={s.renk} strokeWidth="5"
                        strokeDasharray={`${(s.pct / 100) * 125.7} 125.7`}
                        strokeDashoffset="31.4" strokeLinecap="round" transform="rotate(-90 26 26)"/>
                <text x="26" y="31" textAnchor="middle" fontSize="11" fontWeight="700"
                      fill={s.renk} fontFamily="DM Mono,monospace">{s.pct}</text>
              </svg>
              <span style={{ fontSize: 10, color: '#6B7280', fontFamily: 'DM Mono,monospace' }}>{s.no}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SENDAI ÇERÇEVE SKORKART */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
          Sendai Framework Scorecard — 4 Priorities
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {SF_DATA.map(sf => <SfKarti key={sf.no} {...sf}/>)}
        </div>
      </div>

      {/* ULUSLARARASI FON FIRSATLARI */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
          International Funding Opportunities
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {ULUSLAR_FON.map(f => <FonKarti key={f.isim} {...f}/>)}
        </div>
      </div>

      {/* ULUSAL FON FIRSATLARI */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
          National Funding Opportunities
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {ULUSAL_FON.map(f => <FonKarti key={f.isim} {...f}/>)}
        </div>
      </div>

      {/* KONSORSİYUM STRATEJİSİ */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: '20px 24px' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>
          Consortium Strategy
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 16 }}>
          {[
            { isim: 'Beylikdüzü Municipality', rol: 'Pilot site + Owner',    ikon: '/icons/Icon_MIT_04_Community.png',    renk: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE' },
            { isim: 'ITU AYM',                rol: 'Academic Partner',      ikon: '/icons/Icon_PREVENT_01_Planning.png', renk: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE' },
            { isim: 'Omniversel',              rol: 'Technology Provider',   ikon: '/icons/Icon_PROTECT_08_Cyber.png',   renk: '#059669', bg: '#F0FDF4', border: '#BBF7D0' },
          ].map(k => (
            <div key={k.isim} style={{ background: k.bg, border: `1px solid ${k.border}`, borderRadius: 12,
                                       padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center', textAlign: 'center' }}>
              <img src={k.ikon} width={40} height={40} alt={k.isim} style={{ objectFit: 'contain' }}/>
              <span style={{ fontSize: 13, fontWeight: 700, color: k.renk }}>{k.isim}</span>
              <span style={{ fontSize: 11, color: '#6B7280' }}>{k.rol}</span>
            </div>
          ))}
        </div>
        <div style={{ background: 'linear-gradient(135deg,#FFFBEB,#FFF7ED)', border: '1px solid #FCD34D',
                      borderRadius: 10, padding: '12px 18px', textAlign: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#92400E', letterSpacing: 0.3 }}>
            &ldquo;We don&apos;t want cash, we want a consortium.&rdquo;
          </span>
          <p style={{ margin: '4px 0 0', fontSize: 11, color: '#B45309' }}>
            In funding applications the three stakeholders act together — each committing their own expertise.
          </p>
        </div>
      </div>

      {/* STRATEJİK TİMELINE */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 }}>
          Strategic Timeline
        </p>
        {(() => {
          type MilestoneDurum = 'tamamlandı' | 'devam' | 'planlandı'
          const milestones: { tarih: string; baslik: string; aciklama: string; durum: MilestoneDurum }[] = [
            { tarih: 'Mar 2026',  baslik: 'Beylikdüzü Pilot Launch',        aciklama: 'OMNI platform went live. 782 facilities loaded into Supabase. HFER-720 v2.0 calculation engine active.', durum: 'tamamlandı' },
            { tarih: 'Apr 2026',  baslik: 'İSTKA Application',              aciklama: 'Municipal application for Spatial Transformation Project grant. 10–20M TL financing target.', durum: 'devam' },
            { tarih: 'Jun 2026',  baslik: '39 Districts Expansion',         aciklama: 'All Istanbul districts to be included in the OMNI platform. Pilot success is a prerequisite.', durum: 'planlandı' },
            { tarih: 'Sep 2026',  baslik: 'EU Horizon Europe Application',  aciklama: 'Cluster 3 consortium application. €5–15M funding target with ITU AYM + 2 EU partners.', durum: 'planlandı' },
            { tarih: 'Dec 2026',  baslik: '75% Sendai Alignment Target',    aciklama: 'To be raised from current 47% to 75%. SF-3 and SF-4 are priority intervention areas.', durum: 'planlandı' },
            { tarih: '2027',      baslik: '81 Province Scale-Up',           aciklama: 'Roll-out of the OMNI platform nationwide across all of Turkey. AFAD national integration.', durum: 'planlandı' },
          ]
          const RENK: Record<MilestoneDurum, { circle: string; text: string; bg: string; border: string; icon: string }> = {
            tamamlandı: { circle: '#10B981', text: '#059669', bg: '#F0FDF4', border: '#6EE7B7', icon: '✓' },
            devam:      { circle: '#3B82F6', text: '#1D4ED8', bg: '#EFF6FF', border: '#93C5FD', icon: '→' },
            planlandı:  { circle: '#9CA3AF', text: '#6B7280', bg: '#F9FAFB', border: '#E5E7EB', icon: '○' },
          }
          const SVG_H = milestones.length * 80 + 20
          const CX = 28, Y0 = 30, STEP = 80
          return (
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              {/* SVG dikey çizgi + daireler */}
              <svg width="56" height={SVG_H} viewBox={`0 0 56 ${SVG_H}`} style={{ flexShrink: 0 }}>
                <line x1={CX} y1={Y0} x2={CX} y2={Y0 + (milestones.length - 1) * STEP} stroke="#E5E7EB" strokeWidth="2"/>
                {milestones.map((m, i) => {
                  const r = RENK[m.durum]
                  const cy = Y0 + i * STEP
                  return (
                    <g key={i}>
                      <circle cx={CX} cy={cy} r={13} fill={r.circle} stroke="white" strokeWidth="2.5"/>
                      <text x={CX} y={cy + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="white">
                        {r.icon}
                      </text>
                    </g>
                  )
                })}
              </svg>
              {/* Milestone kartları */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 12 }}>
                {milestones.map((m, i) => {
                  const r = RENK[m.durum]
                  return (
                    <div key={i} style={{ background: r.bg, border: `1px solid ${r.border}`, borderRadius: 12, padding: '12px 16px', marginBottom: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, flexWrap: 'wrap', gap: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'DM Mono,monospace', color: r.text, letterSpacing: 0.5 }}>
                          {m.tarih}
                        </span>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                                       color: r.text, background: 'white', border: `1px solid ${r.border}` }}>
                          {m.durum.charAt(0).toUpperCase() + m.durum.slice(1)}
                        </span>
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>{m.baslik}</p>
                      <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.5, margin: 0 }}>{m.aciklama}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })()}
      </div>

    </div>
  )
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

  /* ── omniRISK canlı skorlar */
  const [omniSkorlar, setOmniSkorlar] = useState<Record<string, OmniSkorDurumu>>({})

  const omniRiskHesapla = async (f: Facility) => {
    setOmniSkorlar(prev => ({ ...prev, [f.id]: { status: 'loading' } }))
    const ex = f.extra_data ?? {}
    const deprem     = (ex.risk_deprem  ?? ex.H_score ?? 2.5) as number
    const sel        = (ex.risk_sel     ?? 1.5) as number
    const natech     = (ex.natech_risk  ?? 1.0) as number
    const primaryHaz = natech >= deprem && natech >= sel ? 'natech'
                     : deprem >= sel ? 'deprem' : 'sel'
    try {
      const result = await createAssessment({
        facility_id:     f.id,
        bottleneck_score: ex.hazmat_flag ? 2.5 : 1.2,
        near_miss_count: 0,
        primary_hazard:  primaryHaz,
        hazard: {
          seismic:      Math.min(100, deprem  * 20),
          flood:        Math.min(100, sel     * 20),
          supply_chain: Math.min(100, natech  * 20),
        },
        fragility: ex.F_score != null ? {
          building_age_score:  Math.min(100, (ex.F_score as number) * 20),
          construction_quality:Math.min(100, (ex.F_score as number) * 20),
        } : undefined,
        exposure: {
          population_at_risk:      f.employee_count ?? 100,
          asset_criticality:       ex.X_score != null ? Math.min(1, (ex.X_score as number) / 5) : 0.5,
          serves_critical_population: f.operates_24h,
        },
        response: ex.C_score != null ? {
          bcm_plan_exists:        (ex.C_score as number) >= 2,
          plan_tested_last_12m:   (ex.C_score as number) >= 3,
          drill_frequency_per_year: Math.round((ex.C_score as number)),
          crisis_team_exists:     (ex.C_score as number) >= 3,
        } : undefined,
      })
      setOmniSkorlar(prev => ({ ...prev, [f.id]: { status: 'ok', data: result } }))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Bağlantı hatası'
      setOmniSkorlar(prev => ({ ...prev, [f.id]: { status: 'error', msg } }))
    }
  }

  /* ── Supabase veri çekme */
  useEffect(() => {
    let iptal = false
    async function cek() {
      setLoading(true); setHata(null)
      const { data, error } = await sbBD
        .from('facilities')
        .select('id,name,sector,employee_count,building_age,operates_24h,extra_data')
        .eq('tenant_id', TENANT_BD)
        .limit(1000)
      if (iptal) return
      if (error) { console.error('[page] Supabase hata:', error.message); setHata(error.message); setLoading(false); return }
      console.log('[page] Supabase yanıtı:', { adet: data?.length ?? 0, tenant_id: TENANT_BD, hata: error })
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
      { name: 'CRITICAL',   value: 25, fill: '#EF4444' },
      { name: 'HIGH',       value: 35, fill: '#F97316' },
      { name: 'MEDIUM',     value: 28, fill: '#F59E0B' },
      { name: 'RESILIENT',  value: 12, fill: '#22C55E' },
    ]
    const kritik   = facilities.filter(f => (f.extra_data?.H_score ?? 0) >= 4).length
    const yuksek   = facilities.filter(f => { const h = f.extra_data?.H_score ?? 0; return h >= 3 && h < 4 }).length
    const orta     = facilities.filter(f => { const h = f.extra_data?.H_score ?? 0; return h >= 2 && h < 3 }).length
    const direncli = Math.max(0, facilities.length - kritik - yuksek - orta)
    return [
      { name: 'CRITICAL',  value: kritik,   fill: '#EF4444' },
      { name: 'HIGH',      value: yuksek,   fill: '#F97316' },
      { name: 'MEDIUM',    value: orta,     fill: '#F59E0B' },
      { name: 'RESILIENT', value: direncli, fill: '#22C55E' },
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
                OMNI Disaster Resilience Platform · HFER-720 v2.0 · Sendai 2015–2030
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
              {loading ? 'Connecting…' : hata ? 'Supabase error' : `Supabase · ${kpi.toplam} facilities`}
            </div>
            <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg"
                 style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}30`, color: GOLD }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GOLD }}/>
              Live · {new Date().toLocaleDateString('en-GB')}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6">

        {/* ── KPI KARTLARI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { lbl: 'Total Facilities', val: kpi.toplam, renk: '#60A5FA', sub: 'Supabase · live'         },
            { lbl: 'Critical (H ≥ 4)',val: kpi.kritik, renk: '#EF4444', sub: 'High risk facility'       },
            { lbl: 'Hazmat Facility', val: kpi.hazmat, renk: '#F97316', sub: 'NATECH risk present'      },
            { lbl: '24h Operation',   val: kpi.h24,    renk: '#F59E0B', sub: 'Continuously operating'   },
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
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">District URI Score</p>
                {loading ? <div className="h-24 w-36 bg-gray-100 rounded animate-pulse"/> : <URIGauge value={kpi.uri} renk={kpi.uriRenk}/>}
                <div className="mt-3 text-center">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${hBadgeCls(kpi.uri < 40 ? 5 : kpi.uri < 60 ? 3.5 : kpi.uri < 75 ? 2.5 : 1)}`}>
                    {kpi.uri < 40 ? 'CRITICAL' : kpi.uri < 60 ? 'HIGH' : kpi.uri < 75 ? 'MEDIUM' : 'GOOD'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-3 text-center">HFER-720 · derived from average H score</p>
              </Card>

              {/* HFE Bileşenler */}
              <Card className="p-6">
                <SectionTitle icon={<IcoRadar/>} title="HFE Component Analysis"/>
                {[
                  { label: 'H — Hazard Intensity', val: loading ? 0 : parseFloat((facilities.reduce((s, f) => s + (f.extra_data?.H_score ?? 0), 0) / Math.max(facilities.length, 1) * 20).toFixed(0)), renk: '#EF4444', not: 'Lower = better' },
                  { label: 'F — Fragility',        val: 62, renk: '#F97316', not: 'Static' },
                  { label: 'E — Capacity',          val: 58, renk: '#22C55E', not: 'Static' },
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
                <SectionTitle icon={<IcoShield/>} title="Risk Class Distribution"/>
                {loading
                  ? <div className="h-48 bg-gray-50 rounded-lg animate-pulse"/>
                  : <SvgDonut slices={donutSlices} centerLbl={String(kpi.toplam || '—')}/>
                }
              </Card>
            </div>

            {/* Aksiyon Planı + Kapasite */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Card className="p-6">
                <SectionTitle icon={<AlertTriangle className="w-4 h-4"/>} title="Priority Action Plan"/>
                {[
                  { baslik: 'Yakuplu OSB — NATECH Plan',       acil: true,  icerik: 'RAPID-N protocol must be implemented. Neighboring facility dependency map and domino chain analysis required.', badge: 'Urgent' },
                  { baslik: 'Kavaklı — Flood Early Warning',   acil: true,  icerik: 'Meteorology API integration + SMS/siren system. Post-remediation monitoring by IBB is critical.',             badge: 'Urgent' },
                  { baslik: 'Gürpınar — NAF Line Plan',        acil: false, icerik: 'Soil liquefaction survey needed. KİPTAŞ urban renewal should be accelerated. Landslide risk map required.',  badge: 'Plan'   },
                  { baslik: 'District ISO 22301 BCP',          acil: false, icerik: 'Business continuity plan for critical municipal services. Mandatory for international funding applications.',   badge: 'Plan'   },
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
                <SectionTitle icon={<IcoGrid/>} title="NEFES Brigade Capacity"/>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { label: 'Volunteers',         val: '992',    ikon: '/icons/Icon_RESP_10_MassCare.png'  },
                    { label: 'Response Vehicles',  val: '169',    ikon: '/icons/Icon_RESP_08_Fire.png'      },
                    { label: 'Response Stations',  val: '10',     ikon: '/icons/Icon_RESP_09_Logistics.png' },
                    { label: 'Households Reached', val: '75,498', ikon: '/icons/Icon_REC_07_Housing.png'   },
                  ].map(k => (
                    <div key={k.label} className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                      <img src={k.ikon} width={28} height={28} alt={k.label} style={{ objectFit: 'contain', margin: '0 auto 4px' }}/>
                      <p className="text-lg font-bold text-gray-900">{k.val}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{k.label}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-lg text-xs text-gray-500" style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}20` }}>
                  <span style={{ color: GOLD }} className="font-medium">OMNI × Beylikdüzü Synergy:</span>{' '}
                  Existing operational capacity is strong. OMNI adds a quantitative risk score, NATECH analysis and international standard alignment to this capacity.
                </div>
              </Card>
            </div>

            {/* SCATTER PLOT */}
            {!loading && facilities.length > 0 && (
              <Card className="p-6">
                <SectionTitle icon={<IcoGrid/>} title="Hazard vs Capacity Matrix"/>
                <ScatterPlot facilities={facilities}/>
              </Card>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            MAHALLE ANALİZİ
        ════════════════════════════════════════════════════ */}
        {tab === 'mahalle' && (
          <div className="space-y-5">
            <Card className="p-6">
              <SectionTitle icon={<IcoPin/>} title="Average H Score by Neighborhood (Supabase)"/>
              {loading ? (
                <div className="h-48 bg-gray-50 rounded-lg animate-pulse"/>
              ) : mahalleData.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">Neighborhood data could not be loaded.</p>
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
                <h3 className="text-sm font-semibold text-gray-900">Neighborhood Risk Table</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {/* Başlık */}
                <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_auto] px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                  <span>Neighborhood</span><span>Facilities</span><span>Avg. H</span><span>Risk</span><span>Sector</span>
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
                              <span className="font-medium text-gray-800">Population:</span>{' '}
                              {ctx.nufus.toLocaleString('en-GB')}
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

            {/* EXPOSURE HİYERARŞİ TABLOSU */}
            {!loading && facilities.length > 0 && (
              <ExposureHierarchy facilities={facilities}/>
            )}
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
                { lbl: 'Total',     val: facilities.length,                               renk: '#60A5FA' },
                { lbl: 'Critical',  val: kpi.kritik,                                      renk: '#EF4444' },
                { lbl: 'Hazmat',    val: kpi.hazmat,                                      renk: '#F97316' },
                { lbl: 'Employees', val: facilities.reduce((s, f) => s + (f.employee_count ?? 0), 0), renk: '#10B981' },
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
                  type="text" placeholder="Search facility or neighborhood…" value={search}
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
                        {s === 'hepsi' ? 'All' : m?.label}
                      </button>
                    )
                  })}
                </div>
                <span className="text-xs text-gray-400 ml-auto">{filteredFacilities.length} results</span>
              </div>

              {/* Tablo başlığı */}
              <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto_160px] px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                <span>Facility Name</span><span>Neighborhood</span><span>Sector</span><span>H Score</span><span>Employees</span><span>Status</span><span>omniRISK</span>
              </div>

              {loading && <div className="p-8 flex justify-center"><Spinner/></div>}
              {hata    && <div className="p-6 flex items-center gap-2 text-red-500 text-sm"><WifiOff className="w-4 h-4"/>{hata}</div>}

              {!loading && pagedFacilities.length === 0 && (
                <div className="p-8 text-center text-gray-400 text-sm">No matching facilities found.</div>
              )}

              <div className="divide-y divide-gray-50">
                {pagedFacilities.map(f => {
                  const h      = f.extra_data?.H_score ?? 0
                  const sm     = SEKTOR_META[f.sector] ?? SEKTOR_META.OTHER
                  const hazmat = f.extra_data?.hazmat_flag
                  const skor   = omniSkorlar[f.id]
                  return (
                    <div key={f.id} className="grid lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto_160px] items-center px-4 py-3 hover:bg-gray-50 transition-colors gap-2">
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

                      {/* ── omniRISK skor butonu + inline sonuç */}
                      <div className="flex flex-col gap-1 min-w-0">
                        {!skor || skor.status === 'error' ? (
                          <button
                            onClick={() => omniRiskHesapla(f)}
                            className="text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all whitespace-nowrap"
                            style={{ borderColor: '#6366F1', color: '#6366F1', background: '#EEF2FF' }}
                          >
                            {skor?.status === 'error' ? '↺ Retry' : ' Calculate omniRISK'}
                          </button>
                        ) : skor.status === 'loading' ? (
                          <span className="text-[11px] flex items-center gap-1 text-indigo-500 px-2">
                            <Loader2 className="w-3 h-3 animate-spin"/> Calculating…
                          </span>
                        ) : (
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="text-[11px] font-bold px-2 py-0.5 rounded-full border"
                                style={{
                                  color: RISK_CLASS_COLOR[skor.data.risk_class],
                                  borderColor: RISK_CLASS_COLOR[skor.data.risk_class] + '50',
                                  background:  RISK_CLASS_COLOR[skor.data.risk_class] + '15',
                                }}
                              >
                                ADİS {uriToAdis(Math.round(skor.data.uri_score))}
                              </span>
                              <span
                                className="text-[10px] font-semibold"
                                style={{ color: RISK_CLASS_COLOR[skor.data.risk_class] }}
                              >
                                {RISK_CLASS_TR[skor.data.risk_class]}
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-400 pl-1">
                              HRO α={skor.data.hro_alpha?.toFixed(2) ?? '—'}
                              {' · '}B={skor.data.bottleneck_score?.toFixed(1) ?? '—'}
                            </span>
                          </div>
                        )}
                        {skor?.status === 'error' && (
                          <span className="text-[10px] text-red-400 truncate">{skor.msg}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Sayfalama */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                  <button disabled={sayfa === 0} onClick={() => setSayfa(p => p - 1)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors">
                    ← Previous
                  </button>
                  <span className="text-xs text-gray-400">
                    {sayfa + 1} / {totalPages} · {filteredFacilities.length} facilities
                  </span>
                  <button disabled={sayfa >= totalPages - 1} onClick={() => setSayfa(p => p + 1)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors">
                    Next →
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
                  <span style={{ color: GOLD }}>⚠</span> Hazmat / NATECH Facilities
                </h3>
                <span className="text-xs bg-orange-50 border border-orange-200 text-orange-600 px-2 py-1 rounded-full">
                  {natechFacilities.length} facilities
                </span>
              </div>
              {loading && <div className="p-6 flex justify-center"><Spinner/></div>}
              {!loading && natechFacilities.length === 0 && (
                <p className="p-6 text-center text-sm text-gray-400">No hazmat facilities found.</p>
              )}
              <div className="divide-y divide-gray-50">
                <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                  <span>Facility</span><span>Neighborhood</span><span>Sector</span><span>NATECH Risk</span><span>H Score</span>
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
                <SectionTitle icon={<IcoRadar/>} title="Scenario Parameters"/>
                <div className="mb-5">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Disaster Type</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[{ key: 'deprem', label: '🌍 Earthquake' }, { key: 'yangin', label: '🔥 Fire' }, { key: 'sel', label: '🌊 Flood' }].map(s => (
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
                      <p className="text-xs text-gray-400 uppercase tracking-widest">Earthquake Magnitude (Mw)</p>
                      <p className="font-mono font-bold text-sm" style={{ color: GOLD }}>{siddet.toFixed(1)}</p>
                    </div>
                    <input type="range" min="5.0" max="8.0" step="0.1" value={siddet}
                      onChange={e => setSiddet(parseFloat(e.target.value))}
                      className="w-full accent-yellow-400"/>
                    <div className="flex justify-between text-xs text-gray-300 mt-1"><span>Mw 5.0</span><span>Mw 8.0</span></div>
                  </div>
                )}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">RAPID-N Protocol</p>
                  <div className="space-y-2 text-sm">
                    {[
                      { label: 'Affected facilities',  val: `${natechFacilities.length} Hazmat facilities` },
                      { label: 'NATECH D coefficient', val: '2.4', renk: '#F97316' },
                      { label: 'Domino chain',         val: '3 neighboring facilities' },
                      { label: 'Evacuation time',      val: '~45 min' },
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
                  <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">NATECH Cumulative Impact Score</p>
                  <p className={`text-6xl font-bold mb-2 ${natechEtki > 60 ? 'text-red-500' : natechEtki > 30 ? 'text-orange-500' : 'text-amber-500'}`}>
                    {natechEtki}<span className="text-2xl text-gray-200">/100</span>
                  </p>
                  <p className="text-gray-600 text-sm">
                    {natechEtki > 60 ? 'CRITICAL — Emergency evacuation and response protocol must be activated' :
                     natechEtki > 30 ? 'HIGH — Preventive measures and early warning must be activated' :
                     'MEDIUM — Monitoring and preparedness level should be raised'}
                  </p>
                </Card>
                <Card className="p-5">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Impact Projection</p>
                  <div className="space-y-3">
                    {[
                      { label: 'Population at risk',      val: `~${Math.round(toplamNufus * (natechEtki / 100) * 0.6 / 1000)}K people`, renk: 'text-red-500'   },
                      { label: 'Evacuation zone',         val: 'Yakuplu + Kavaklı',                                                      renk: 'text-orange-500' },
                      { label: 'Affected facilities',     val: `${Math.ceil(natechEtki / 20 * natechFacilities.length / 5)} facilities`,  renk: 'text-amber-600'  },
                      { label: 'Emergency response time', val: senaryo === 'deprem' ? '72 hours' : '48 hours',                            renk: 'text-gray-800'   },
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
        {tab === 'sendai' && <SendaiTab />}

        {/* FOOTER */}
        <div className="mt-10 pt-5 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-gray-300">OMNI Resilience Platform · HFER-720 v2.0 · ITU AYM · © 2026</p>
          <p className="text-xs text-gray-300">Sendai 2015–2030 · ISO 22301 · AFAD · RAPID-N</p>
        </div>
      </div>
    </div>
  )
}
