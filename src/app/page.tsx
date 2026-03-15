'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

/* ─── tokens ─────────────────────────────────────────────────── */
const N  = '#0A1628'
const T  = '#00d4b8'
const G  = '#E8C97A'
const GR = '#f5f7fa'
const MG = '#8FA3B8'
const BG = '#FFFFFF'

/* ─── Supabase (metrics band) ────────────────────────────────── */
const sbBD = createClient(
  'https://gqguwgbopgnpwzjwcexl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5OTgzMywiZXhwIjoyMDg4OTc1ODMzfQ.Ku-JRx8JFH5a3SIj7sGP_Dy_nM89NMMW34gPyxVO_qI',
)
const TENANT_BD = '11111111-0000-0000-0000-000000000001'

/* ─── useInView ──────────────────────────────────────────────── */
function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [v, setV] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true) }, { threshold })
    o.observe(el)
    return () => o.disconnect()
  }, [threshold])
  return { ref, inView: v }
}

/* ─── useCounter ─────────────────────────────────────────────── */
function useCounter(target: number, dur = 1800, go: boolean) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!go) return
    let s: number | null = null
    const tick = (t: number) => {
      if (!s) s = t
      const p = Math.min((t - s) / dur, 1)
      setN(Math.floor(p * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [go, target, dur])
  return n
}

/* ═══════════════════════════════════════════════════════════════
   INLINE SVG ICONS
═══════════════════════════════════════════════════════════════ */

function IconRisk({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="30" fill={GR} stroke={T} strokeWidth="1.5"/>
      <path d="M12 42 A22 22 0 0 1 52 42" stroke="#E2E8F0" strokeWidth="5" strokeLinecap="round"/>
      <path d="M12 42 A22 22 0 0 1 37 15" stroke={T} strokeWidth="5" strokeLinecap="round"/>
      <line x1="32" y1="32" x2="22" y2="20" stroke={N} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="32" cy="32" r="4" fill={N}/>
      <circle cx="32" cy="32" r="2" fill={BG}/>
      <text x="32" y="52" textAnchor="middle" fill={N} fontSize="7" fontFamily="DM Sans,sans-serif" fontWeight="600">RISK</text>
    </svg>
  )
}

function IconImpact({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="30" fill={GR} stroke={G} strokeWidth="1.5"/>
      <rect x="12" y="38" width="8"  height="12" rx="2" fill={G} opacity="0.4"/>
      <rect x="22" y="30" width="8"  height="20" rx="2" fill={G} opacity="0.65"/>
      <rect x="32" y="22" width="8"  height="28" rx="2" fill={G}/>
      <rect x="42" y="16" width="8"  height="34" rx="2" fill={N}/>
      <polyline points="16,36 26,28 36,20 46,14" stroke={T} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="46" cy="14" r="2.5" fill={T}/>
    </svg>
  )
}

function IconPlan({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="30" fill={GR} stroke={T} strokeWidth="1.5"/>
      <path d="M32 14 L46 19 L46 34 C46 42 32 50 32 50 C32 50 18 42 18 34 L18 19 Z"
            fill={T} fillOpacity="0.15" stroke={T} strokeWidth="2" strokeLinejoin="round"/>
      <polyline points="25,32 30,37 40,26" stroke={N} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconCrisis({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="30" fill={GR} stroke="#E8A87C" strokeWidth="1.5"/>
      <polygon points="32,13 38,28 35,28 41,51 26,33 30,33" fill="#E8A87C" stroke={N} strokeWidth="1.2" strokeLinejoin="round"/>
      <circle cx="32" cy="32" r="21" fill="none" stroke="#E8A87C" strokeWidth="1" strokeDasharray="3 4"/>
    </svg>
  )
}

function IconAudit({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="30" fill={GR} stroke="#10B981" strokeWidth="1.5"/>
      <path d="M32 16 L43 21 L43 34 C43 40 32 47 32 47 C32 47 21 40 21 34 L21 21 Z"
            fill="#10B981" fillOpacity="0.15" stroke="#10B981" strokeWidth="1.8" strokeLinejoin="round"/>
      <polyline points="26,31 30,35 39,26" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="32" y="54" textAnchor="middle" fill="#10B981" fontSize="7" fontFamily="DM Sans,sans-serif" fontWeight="600">AUDIT</text>
    </svg>
  )
}

function IconVendor({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="30" fill={GR} stroke="#6366F1" strokeWidth="1.5"/>
      <rect x="18" y="26" width="28" height="20" rx="3" fill="#6366F1" fillOpacity="0.15" stroke="#6366F1" strokeWidth="1.8"/>
      <path d="M23 26 L23 22 A9 9 0 0 1 41 22 L41 26" stroke="#6366F1" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <circle cx="26" cy="36" r="2.5" fill="#6366F1"/>
      <circle cx="32" cy="36" r="2.5" fill="#6366F1" fillOpacity="0.5"/>
      <circle cx="38" cy="36" r="2.5" fill="#6366F1" fillOpacity="0.25"/>
      <text x="32" y="54" textAnchor="middle" fill="#6366F1" fontSize="7" fontFamily="DM Sans,sans-serif" fontWeight="600">VENDOR</text>
    </svg>
  )
}

/* ── BCM Cycle SVG — 7 segment ────────────────────────────────── */
function BcmCycle() {
  const STEP = 360 / 7
  const segments = [
    { label: 'Önleme',          color: '#E8C97A' },
    { label: 'Hazırlıklı Olma', color: '#7B9FD4' },
    { label: 'Zarar Azaltma',   color: '#6ABFB8' },
    { label: 'Müdahale',        color: '#f87171' },
    { label: 'İyileştirme',     color: '#fb923c' },
    { label: 'İzleme',          color: '#a78bfa' },
    { label: 'Yönetişim',       color: '#34d399' },
  ].map((s, i) => ({ ...s, angle: -90 + i * STEP }))
  const toXY = (deg: number, r: number) => ({
    x: 200 + r * Math.cos((deg * Math.PI) / 180),
    y: 200 + r * Math.sin((deg * Math.PI) / 180),
  })
  const HALF = STEP / 2 - 5
  return (
    <svg viewBox="0 0 400 400" style={{ width: '100%', maxWidth: 420 }}>
      <circle cx="200" cy="200" r="168" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="6 6"/>
      {segments.map((seg, i) => {
        const a0 = seg.angle - HALF, a1 = seg.angle + HALF
        const si = toXY(a0, 112), ei = toXY(a1, 112)
        const so = toXY(a0, 132), eo = toXY(a1, 132)
        return (
          <path key={i}
            d={`M ${si.x.toFixed(2)} ${si.y.toFixed(2)} A 112 112 0 0 1 ${ei.x.toFixed(2)} ${ei.y.toFixed(2)}
                L ${eo.x.toFixed(2)} ${eo.y.toFixed(2)} A 132 132 0 0 0 ${so.x.toFixed(2)} ${so.y.toFixed(2)} Z`}
            fill={seg.color} fillOpacity="0.2" stroke={seg.color} strokeWidth="1.5"/>
        )
      })}
      {segments.map((seg, i) => {
        const inner = toXY(seg.angle, 112)
        const dot   = toXY(seg.angle, 148)
        const lbl   = toXY(seg.angle, 172)
        return (
          <g key={i}>
            <line x1={inner.x} y1={inner.y} x2={dot.x} y2={dot.y}
                  stroke={seg.color} strokeWidth="1.5" strokeDasharray="3 3"/>
            <circle cx={dot.x} cy={dot.y} r="4" fill={seg.color}/>
            <text x={lbl.x} y={lbl.y} textAnchor="middle" dominantBaseline="middle"
                  fill={N} fontSize="10.5" fontFamily="DM Sans,sans-serif" fontWeight="600">{seg.label}</text>
          </g>
        )
      })}
      <circle cx="200" cy="200" r="78" fill={N}/>
      <circle cx="200" cy="200" r="72" fill="none" stroke={T} strokeWidth="1.5"/>
      <text x="200" y="194" textAnchor="middle" fill={G} fontSize="14"
            fontFamily="DM Sans,sans-serif" fontWeight="700" letterSpacing="1">HFER-720</text>
      <text x="200" y="211" textAnchor="middle" fill="#8FA3B8" fontSize="9"
            fontFamily="DM Sans,sans-serif">BCM MOTOR</text>
    </svg>
  )
}

/* ── Logo band ──────────────────────────────────────────────── */
function LogoBand() {
  const logos = [
    { name: 'Akbank',                width: 90 },
    { name: 'Medical Park',          width: 110 },
    { name: 'Rixos',                 width: 70 },
    { name: 'İş Bankası',            width: 100 },
    { name: 'Beylikdüzü Belediyesi', width: 140 },
  ]
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 56, flexWrap: 'wrap' }}>
      {logos.map(l => (
        <svg key={l.name} width={l.width} height={36} viewBox={`0 0 ${l.width} 36`}>
          <text x={l.width / 2} y="22" textAnchor="middle" fill="#B0BEC5"
                fontSize="13" fontFamily="DM Sans,sans-serif" fontWeight="600" letterSpacing="0.5">{l.name}</text>
          <line x1="10" y1="28" x2={l.width - 10} y2="28" stroke="#D0D9E2" strokeWidth="1"/>
        </svg>
      ))}
    </div>
  )
}

/* ── Hero Dashboard Mock ────────────────────────────────────── */
function HeroDashboardMock() {
  // Mini scatter points (static, representative)
  const pts = [
    { cx: 60,  cy: 42,  r: '#EF4444' }, { cx: 78,  cy: 35,  r: '#EF4444' },
    { cx: 52,  cy: 52,  r: '#F97316' }, { cx: 88,  cy: 58,  r: '#F97316' },
    { cx: 110, cy: 48,  r: '#5BA3DC' }, { cx: 125, cy: 62,  r: '#5BA3DC' },
    { cx: 142, cy: 38,  r: '#10B981' }, { cx: 155, cy: 70,  r: '#10B981' },
    { cx: 168, cy: 55,  r: '#E8C97A' }, { cx: 70,  cy: 28,  r: '#EF4444' },
    { cx: 98,  cy: 72,  r: '#F59E0B' }, { cx: 135, cy: 28,  r: '#6ABFB8' },
  ]

  return (
    <div style={{
      background: N, borderRadius: 20, padding: '20px',
      border: '1px solid rgba(255,255,255,0.08)',
      boxShadow: '0 24px 64px rgba(10,22,40,.4)',
      animation: 'fadeIn .9s ease .2s both',
    }}>
      {/* Window bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }}/>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }}/>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22C55E' }}/>
        <span style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 10, marginLeft: 8 }}/>
        <span style={{ fontSize: 9, color: '#94A3B8', fontFamily: 'DM Mono,monospace' }}>OMNI · HFER-720</span>
      </div>

      {/* Mini KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
        {[
          { v: '782',  l: 'Tesis',    c: '#60A5FA' },
          { v: '103',  l: 'Kritik',   c: '#EF4444' },
          { v: '47%',  l: 'Sendai',   c: G         },
          { v: '6',    l: 'Sektör',   c: T         },
        ].map(k => (
          <div key={k.l} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px 10px',
                                   border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: k.c, fontFamily: 'DM Mono,monospace', lineHeight: 1 }}>{k.v}</div>
            <div style={{ fontSize: 9, color: '#64748B', marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.5 }}>{k.l}</div>
          </div>
        ))}
      </div>

      {/* Mini Scatter Plot */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '10px 12px',
                    border: '1px solid rgba(255,255,255,0.05)', marginBottom: 12 }}>
        <div style={{ fontSize: 9, color: '#64748B', marginBottom: 6, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
          Tehlike vs Kapasite
        </div>
        <svg viewBox="0 0 230 100" width="100%" style={{ display: 'block' }}>
          {/* Grid */}
          {[40, 80, 120, 160, 200].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="96" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
          ))}
          {[24, 48, 72, 96].map(y => (
            <line key={y} x1="0" y1={y} x2="230" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
          ))}
          {/* Critical zone */}
          <rect x="0" y="0" width="92" height="57" fill="rgba(239,68,68,0.06)" stroke="rgba(239,68,68,0.15)" strokeWidth="1" rx="2"/>
          {/* Safe zone */}
          <rect x="138" y="57" width="92" height="39" fill="rgba(34,197,94,0.06)" stroke="rgba(34,197,94,0.15)" strokeWidth="1" rx="2"/>
          {/* Points */}
          {pts.map((p, i) => (
            <circle key={i} cx={p.cx} cy={p.cy} r="4.5" fill={p.r} fillOpacity="0.8"/>
          ))}
          {/* Axis labels */}
          <text x="115" y="99" textAnchor="middle" fontSize="7" fill="#475569">Kapasite →</text>
        </svg>
      </div>

      {/* Mini risk table */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '6px 12px',
                      borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          {['Mahalle', 'H Skoru', 'Risk'].map(h => (
            <span key={h} style={{ fontSize: 8, color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</span>
          ))}
        </div>
        {[
          { nb: 'Yakuplu',       h: '3.8', renk: '#F97316', label: 'YÜKSEK' },
          { nb: 'Gürpınar',      h: '4.1', renk: '#EF4444', label: 'KRİTİK' },
          { nb: 'Adnan Kahveci', h: '2.9', renk: '#F59E0B', label: 'ORTA'   },
        ].map(row => (
          <div key={row.nb} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr',
                                      padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
            <span style={{ fontSize: 9, color: '#94A3B8' }}>{row.nb}</span>
            <span style={{ fontSize: 9, fontFamily: 'DM Mono,monospace', color: row.renk, fontWeight: 700 }}>{row.h}</span>
            <span style={{ fontSize: 8, color: row.renk, fontWeight: 600 }}>{row.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Product cards ──────────────────────────────────────────── */
const products = [
  { code: 'omniRISK',   color: T,          href: '/products/omnirisk',
    desc: 'ISO 31000 uyumlu risk sicili, tehlike haritası ve HFER skoru ile kurumsal risk tablonuzu gerçek zamanlı izleyin.',
    icon: <IconRisk size={52}/> },
  { code: 'omniIMPACT', color: G,          href: '/products/omniimpact',
    desc: 'İş Etki Analizi modülü; süreç bağımlılıklarını, RTO/RPO hedeflerini ve kritiklik matrisini otomatik üretir.',
    icon: <IconImpact size={52}/> },
  { code: 'omniPLAN',   color: '#5BA3DC',  href: '/products/omniplan',
    desc: 'ISO 22301 uyumlu İş Sürekliliği Planlarını yapay zeka yardımıyla dakikalar içinde taslaktan onaya taşıyın.',
    icon: <IconPlan size={52}/> },
  { code: 'omniCRISIS', color: '#E8A87C',  href: '/products/omnicrisis',
    desc: 'Kriz anında görev atamaları, anlık iletişim protokolleri ve komuta merkezi panosu tek ekranda.',
    icon: <IconCrisis size={52}/> },
  { code: 'omniAUDIT',  color: '#10B981',  href: '#',
    desc: 'ISO 22301 uyum denetimi, Sendai çerçeve izleme ve kontrol etkinliği skoru ile uyum sürecinizi otomatikleştirin.',
    icon: <IconAudit size={52}/> },
  { code: 'omniVENDOR', color: '#6366F1',  href: '#',
    desc: 'Tedarik zinciri risk skoru, kritik tedarikçi bağımlılık analizi ve üçüncü taraf BCM değerlendirmesi.',
    icon: <IconVendor size={52}/> },
]

/* ── Testimonials ────────────────────────────────────────────── */
const testimonials = [
  { quote: 'HFER-720 motor sayesinde risk sicilimizi üç günde tamamladık. Denetimden tam puan aldık.',
    name:  'Mehmet Aydın', role:  'Risk Direktörü, Finans Sektörü' },
  { quote: 'Tesis bazlı BCP planlarımız artık otomatik güncelleniyor. Saha ekibimizin yükü %60 azaldı.',
    name:  'Ayşe Kılıç',   role:  'BCM Müdürü, Sağlık Grubu' },
  { quote: 'omniCRISIS modülü pandemi sürecinde krize müdahalemizi kökten değiştirdi. Olmazsa olmaz.',
    name:  'Burak Demir',  role:  'İcra Kurulu, Belediye Grubu' },
]

/* ── Stat item ───────────────────────────────────────────────── */
function StatItem({ target, suffix, label, go }: { target: number; suffix: string; label: string; go: boolean }) {
  const n = useCounter(target, 1600, go)
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 'clamp(40px, 5vw, 60px)', fontWeight: 700, color: N, lineHeight: 1 }}>
        {n}{suffix}
      </div>
      <div style={{ color: MG, fontSize: 14, marginTop: 8, fontWeight: 500 }}>{label}</div>
    </div>
  )
}

/* ── Live Metric Item ─────────────────────────────────────────── */
function LiveMetric({ target, suffix, label, sub, go }: {
  target: number; suffix: string; label: string; sub: string; go: boolean
}) {
  const n = useCounter(target, 2000, go)
  return (
    <div style={{ textAlign: 'center', padding: '0 24px' }}>
      <div style={{ fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 700, color: G,
                    lineHeight: 1, fontFamily: 'DM Mono,monospace' }}>
        {n}{suffix}
      </div>
      <div style={{ color: BG, fontSize: 15, fontWeight: 600, marginTop: 8 }}>{label}</div>
      <div style={{ color: '#4A6580', fontSize: 12, marginTop: 4 }}>{sub}</div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function Page() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [megaOpen,  setMegaOpen]  = useState<string | null>(null)

  /* live metrics from supabase */
  const [metrics, setMetrics] = useState({ tesis: 782, kritik: 103, mahalle: 10, sektor: 6 })

  const statsSection    = useInView(0.3)
  const productsSection = useInView(0.15)
  const bcmSection      = useInView(0.2)
  const testiSection    = useInView(0.15)
  const metricsSection  = useInView(0.2)
  const caseSection     = useInView(0.15)
  const resourceSection = useInView(0.15)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    sbBD
      .from('facilities')
      .select('id,sector,extra_data')
      .eq('tenant_id', TENANT_BD)
      .eq('is_active', true)
      .limit(1000)
      .then(({ data }) => {
        if (!data || data.length === 0) return
        const kritik  = data.filter((f: { extra_data: { H_score?: number } | null }) => (f.extra_data?.H_score ?? 0) >= 4).length
        const mahalleSet = new Set(data.map((f: { extra_data: { neighborhood?: string } | null }) => f.extra_data?.neighborhood).filter(Boolean))
        const sektorSet  = new Set(data.map((f: { sector: string }) => f.sector))
        setMetrics({ tesis: data.length, kritik, mahalle: mahalleSet.size, sektor: sektorSet.size })
      })
  }, [])

  const SectionLabel = ({ text }: { text: string }) => (
    <p style={{ color: T, fontSize: 12, fontWeight: 700, letterSpacing: 3,
                textTransform: 'uppercase', marginBottom: 12 }}>{text}</p>
  )
  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 style={{ color: N, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700,
                 lineHeight: 1.15, marginBottom: 20 }}>{children}</h2>
  )

  /* megamenu data */
  const PLATFORM_ITEMS = [
    { code: 'omniRISK',   color: T,         href: '/products/omnirisk',   desc: 'Risk sicili & HFER skoru'         },
    { code: 'omniIMPACT', color: G,         href: '/products/omniimpact', desc: 'İş Etki Analizi & BIA'            },
    { code: 'omniPLAN',   color: '#5BA3DC', href: '/products/omniplan',   desc: 'BCM planı & RTO/RPO takibi'       },
    { code: 'omniCRISIS', color: '#E8A87C', href: '/products/omnicrisis', desc: 'Kriz komuta merkezi'              },
    { code: 'omniAUDIT',  color: '#10B981', href: '#',                    desc: 'Uyum denetimi & Sendai izleme'    },
    { code: 'omniVENDOR', color: '#6366F1', href: '#',                    desc: 'Tedarik zinciri riski'            },
  ]
  const SEKTOR_ITEMS = [
    { name: 'Bankacılık & Finans',    color: T },
    { name: 'Sağlık & Hastane',       color: '#f87171' },
    { name: 'Sanayi & Üretim',        color: G },
    { name: 'Eğitim Kurumları',       color: '#7B9FD4' },
    { name: 'Kamu & Belediye',        color: '#6ABFB8' },
    { name: 'Kritik Altyapı',         color: '#fb923c' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:${BG};color:${N};font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .nav-link{color:rgba(255,255,255,0.72);font-size:14px;font-weight:500;transition:color .18s;cursor:pointer;position:relative}
        .nav-link:hover{color:#fff}
        .btn-navy{display:inline-block;background:${G};color:${N};font-weight:700;font-size:14px;
          padding:11px 26px;border-radius:6px;transition:opacity .18s,transform .12s;cursor:pointer;border:none;font-family:'DM Sans',sans-serif}
        .btn-navy:hover{opacity:.88;transform:translateY(-1px)}
        .btn-outline{display:inline-block;border:1.5px solid rgba(255,255,255,0.3);color:rgba(255,255,255,0.88);font-weight:600;font-size:14px;
          padding:10px 26px;border-radius:6px;transition:border-color .18s,background .18s;cursor:pointer;font-family:'DM Sans',sans-serif}
        .btn-outline:hover{border-color:rgba(255,255,255,0.6);background:rgba(255,255,255,0.06)}
        .btn-teal{display:inline-block;background:${T};color:${N};font-weight:600;font-size:14px;
          padding:10px 26px;border-radius:6px;transition:opacity .18s,transform .12s;cursor:pointer}
        .btn-teal:hover{opacity:.88;transform:translateY(-1px)}
        .card{background:${BG};border-radius:16px;border:1px solid #E8EDF3;padding:36px 32px;
          transition:box-shadow .2s,transform .2s}
        .card:hover{box-shadow:0 8px 32px rgba(10,22,40,.09);transform:translateY(-3px)}
        .product-tag{display:inline-block;font-size:11px;font-weight:700;letter-spacing:1.5px;
          text-transform:uppercase;padding:4px 12px;border-radius:20px;margin-bottom:18px}
        .mega-wrap{position:relative}
        .mega-panel{position:absolute;top:calc(100% + 12px);left:50%;transform:translateX(-50%);
          background:white;border-radius:16px;border:1px solid #E8EDF3;
          box-shadow:0 16px 48px rgba(10,22,40,.12);padding:20px;min-width:420px;z-index:300}
        .mega-panel-sm{min-width:260px}
      `}</style>

      {/* ══ NAV ══════════════════════════════════════════════════ */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 68,
        background: scrolled ? 'rgba(18,6,58,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
        boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,.35)' : 'none',
        transition: 'all .25s',
        display: 'flex', alignItems: 'center', padding: '0 48px',
      }}>
        <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill={N}/>
              <polygon points="16,7 25,22 7,22" fill="none" stroke={T} strokeWidth="2"/>
              <polygon points="16,12 21,20 11,20" fill={T} fillOpacity="0.4"/>
              <circle cx="16" cy="18" r="2" fill={G}/>
            </svg>
            <span style={{ color: '#fff', fontSize: 18, fontWeight: 700, letterSpacing: 0.5 }}>
              omni<span style={{ color: T }}>versel</span>
            </span>
          </div>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>

            {/* Platform megamenu */}
            <div className="mega-wrap"
                 onMouseEnter={() => setMegaOpen('platform')}
                 onMouseLeave={() => setMegaOpen(null)}>
              <span className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                Platform
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 5l3 3 3-3" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              {megaOpen === 'platform' && (
                <div className="mega-panel">
                  <p style={{ fontSize: 10, fontWeight: 700, color: MG, letterSpacing: 2,
                               textTransform: 'uppercase', marginBottom: 14 }}>Modüller</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                    {PLATFORM_ITEMS.map(item => (
                      <Link key={item.code} href={item.href}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                                 borderRadius: 10, transition: 'background .15s' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = GR}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%',
                                       background: item.color, flexShrink: 0 }}/>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: N,
                                         fontFamily: 'DM Mono,monospace', letterSpacing: 0.5 }}>{item.code}</div>
                          <div style={{ fontSize: 11, color: MG, marginTop: 1 }}>{item.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div style={{ borderTop: '1px solid #E8EDF3', marginTop: 14, paddingTop: 12 }}>
                    <Link href="/hub" style={{ display: 'flex', alignItems: 'center', gap: 8,
                                               fontSize: 13, fontWeight: 600, color: T, padding: '4px 12px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                        <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                      </svg>
                      Platform Hub'ı Aç →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* BCM Döngüsü */}
            <a href="#bcm" className="nav-link">BCM Döngüsü</a>

            {/* Sektörler megamenu */}
            <div className="mega-wrap"
                 onMouseEnter={() => setMegaOpen('sektor')}
                 onMouseLeave={() => setMegaOpen(null)}>
              <span className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                Sektörler
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 5l3 3 3-3" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              {megaOpen === 'sektor' && (
                <div className="mega-panel mega-panel-sm">
                  <p style={{ fontSize: 10, fontWeight: 700, color: MG, letterSpacing: 2,
                               textTransform: 'uppercase', marginBottom: 14 }}>Sektörler</p>
                  {SEKTOR_ITEMS.map(s => (
                    <a key={s.name} href="#sectors-detail"
                       style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
                                borderRadius: 8, transition: 'background .15s', color: N }}
                       onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = GR}
                       onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.color, flexShrink: 0 }}/>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a href="#about" className="nav-link">Hakkımızda</a>
            <Link href="/login" style={{ background: G, color: N, fontWeight: 700, fontSize: 14,
                                          padding: '10px 24px', borderRadius: 6, display: 'inline-block',
                                          transition: 'opacity .18s' }}>Demo Talep</Link>
          </nav>
        </div>
      </header>

      {/* ══ HERO ═════════════════════════════════════════════════ */}
      <section style={{ padding: '140px 48px 100px', background: 'linear-gradient(135deg, #12063A 0%, #1e0f5c 50%, #0d1f4a 100%)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto',
                      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
          {/* left */}
          <div style={{ animation: 'fadeUp .7s ease both' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
                          background: `${T}14`, border: `1px solid ${T}40`,
                          borderRadius: 20, padding: '5px 14px', marginBottom: 28 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: T,
                              display: 'inline-block', boxShadow: `0 0 5px ${T}` }}/>
              <span style={{ color: T, fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>
                HFER-720 Motor Aktif · ISO 22301
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(40px, 5vw, 68px)', fontWeight: 700,
                         lineHeight: 1.08, color: '#fff', marginBottom: 24 }}>
              Dayanıklılık.<br />
              <span style={{ color: T }}>Ölçülebilir.</span>
            </h1>

            <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: 18, lineHeight: 1.75,
                        maxWidth: 500, marginBottom: 40, fontWeight: 400 }}>
              720 parametre, 39 ilçe haritası ve yapay zeka destekli BCM döngüsüyle
              kurumunuzun kriz hazırlığını somut verilere dönüştürün.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 52 }}>
              <Link href="/login" className="btn-navy" style={{ fontSize: 15, padding: '13px 32px' }}>
                Ücretsiz Demo
              </Link>
              <a href="#products" className="btn-outline" style={{ fontSize: 15, padding: '12px 32px' }}>
                Ürünleri Keşfet
              </a>
            </div>

            {/* mini trust row */}
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {[
                { v: '720+', l: 'Parametre' },
                { v: '39',   l: 'İlçe' },
                { v: '%98',  l: 'Uptime' },
              ].map(s => (
                <div key={s.l}>
                  <div style={{ color: '#fff', fontSize: 24, fontWeight: 700 }}>{s.v}</div>
                  <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 500, marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* right: real dashboard mock */}
          <HeroDashboardMock />
        </div>
      </section>

      {/* ══ LOGO BAND ════════════════════════════════════════════ */}
      <section style={{ background: GR, padding: '48px 48px', borderTop: '1px solid #E8EDF3',
                        borderBottom: '1px solid #E8EDF3' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', color: '#B0BEC5', fontSize: 12,
                      letterSpacing: 3, textTransform: 'uppercase', marginBottom: 36 }}>
            Güvenilen Kurumlar
          </p>
          <LogoBand />
        </div>
      </section>

      {/* ══ LIVE METRICS BAND ════════════════════════════════════ */}
      <section ref={metricsSection.ref} style={{ background: '#0f0730', padding: '64px 48px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', color: '#4A6580', fontSize: 11, fontWeight: 700,
                      letterSpacing: 3, textTransform: 'uppercase', marginBottom: 44 }}>
            Canlı Platform Metrikleri · Supabase
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
            {[
              { target: metrics.tesis,   suffix: '',  label: 'Tesis Analiz Edildi',    sub: 'HFER-720 skoru hesaplı'   },
              { target: metrics.kritik,  suffix: '',  label: 'Kritik Risk Tespit',      sub: 'H_score ≥ 4 seviyesi'    },
              { target: metrics.mahalle, suffix: '',  label: 'Mahalle Haritalandı',     sub: 'CBS katmanı aktif'        },
              { target: metrics.sektor,  suffix: '',  label: 'Sektör Kapsandı',         sub: 'Çapraz sektör analizi'   },
            ].map((m, i) => (
              <div key={i} style={{
                opacity: metricsSection.inView ? 1 : 0,
                transform: metricsSection.inView ? 'translateY(0)' : 'translateY(20px)',
                transition: `all .6s ease ${i * .12}s`,
                borderLeft: i > 0 ? '1px solid #142340' : 'none',
              }}>
                <LiveMetric {...m} go={metricsSection.inView} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRODUCTS ═════════════════════════════════════════════ */}
      <section id="products" ref={productsSection.ref} style={{ padding: '100px 48px', background: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <SectionLabel text="Modüler Platform" />
            <SectionTitle>Her Süreç İçin Doğru Modül</SectionTitle>
            <p style={{ color: MG, fontSize: 16, maxWidth: 560, margin: '0 auto' }}>
              Altı entegre modül, BCM döngünüzün her aşamasını kapsar.
              İhtiyacınıza göre tekil veya bütünleşik kullanabilirsiniz.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {products.map((p, i) => (
              <div key={i} className="card"
                   style={{
                     opacity: productsSection.inView ? 1 : 0,
                     transform: productsSection.inView ? 'translateY(0)' : 'translateY(24px)',
                     transition: `opacity .55s ease ${i*.08}s, transform .55s ease ${i*.08}s`,
                   }}>
                <div style={{ marginBottom: 20 }}>{p.icon}</div>
                <span className="product-tag"
                      style={{ background: `${p.color}18`, color: p.color }}>{p.code}</span>
                <p style={{ color: MG, fontSize: 14, lineHeight: 1.75 }}>{p.desc}</p>
                <Link href={p.href} style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 6,
                               color: p.color, fontSize: 13, fontWeight: 600 }}>
                  <span>Detayları İncele</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M7 3l4 4-4 4" stroke={p.color} strokeWidth="1.5"
                          strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTORS ══ */}
      <section id="sectors-detail" style={{ padding: '100px 48px', background: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <SectionLabel text="Sektörel Çözümler" />
            <SectionTitle>Her Sektör İçin Özelleştirilmiş</SectionTitle>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {[
              { title: 'Bankacılık & Finans', desc: 'Sermaye yeterliliği, operasyonel risk ve BCM planları Basel III ve ISO 22301 uyumlu olarak yönetilir.', standards: 'ISO 22301 · Basel III', iconPath: 'M1 9 L3 5 L5 7 L7 3 L9 7', iconBg: '#6ABFB8' },
              { title: 'Sağlık & Hastane',    desc: 'Kritik tıbbi hizmetlerin sürekliliği, tıbbi cihaz bağımlılığı ve tahliye planları Sendai SF-3 çerçevesinde hazırlanır.', standards: 'ISO 22301 · Sendai SF-3', iconPath: 'M5 1 L5 9 M1 5 L9 5', iconBg: '#f87171' },
              { title: 'Sanayi & Üretim',     desc: 'NATECH senaryoları, tedarik zinciri kesintisi ve iş sürekliliği RAPID-N metodolojisi ile değerlendirilir.', standards: 'RAPID-N · ISO 31000', iconPath: 'M3 5 A2 2 0 1 0 3 4.9 M5 1 L5 3 M5 7 L5 9 M1 5 L3 5 M7 5 L9 5', iconBg: '#E8C97A' },
              { title: 'Eğitim Kurumları',    desc: 'Okul tahliye planları, deprem tatbikatları ve veli iletişim protokolleri AFAD direktifleriyle entegre çalışır.', standards: 'AFAD · Sendai SF-2', iconPath: 'M1 2 L9 2 L9 8 L1 8 Z M1 5 L9 5 M4 2 L4 8', iconBg: '#7B9FD4' },
              { title: 'Kritik Altyapı',      desc: 'Enerji, su, ulaşım altyapısının kademeli bozulma analizi ve domino etkisi modellemesi N-1 kriterleriyle yapılır.', standards: 'CIP Standartları · ISO 22301', iconPath: 'M5 1 L6.5 4 L9 4 L7 6 L8 9 L5 7.5 L2 9 L3 6 L1 4 L3.5 4 Z', iconBg: '#fb923c' },
              { title: 'Kamu & Belediye',     desc: 'İlçe bazlı risk haritası, tesis ağı analizi ve halk iletişim planı Sendai 2015–2030 ve URI endeksiyle desteklenir.', standards: 'Sendai · HFER-720', iconPath: 'M1 9 L1 5 L5 2 L9 5 L9 9 Z M3.5 9 L3.5 6.5 L6.5 6.5 L6.5 9', iconBg: '#6ABFB8' },
              { title: 'Turizm & Konaklama',  desc: 'Otel tahliye planları, misafir güvenliği protokolleri ve sezon bazlı kriz senaryoları hazırlanır.', standards: 'ISO 22301 · NFPA 101', iconPath: 'M1 9 L1 4 L5 1 L9 4 L9 9 Z M3 9 L3 6 L7 6 L7 9 M4 3.5 L6 3.5', iconBg: '#a78bfa' },
              { title: 'Lojistik & Tedarik',  desc: 'Kritik tedarikçi analizi, alternatif rota planlaması ve stok kesintisi senaryoları modellenir.', standards: 'ISO 28000 · ISO 22301', iconPath: 'M1 6 L7 6 L7 4 L9 6 L7 8 L7 6 M1 4 L5 4 M1 8 L4 8', iconBg: '#34d399' },
            ].map((sector, i) => (
              <div key={i}
                   style={{ background: BG, border: '1px solid #E8EDF3', borderRadius: 16, padding: '32px',
                             cursor: 'default', transition: 'box-shadow .2s, transform .2s' }}
                   onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(10,22,40,.09)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)' }}
                   onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}>
                <div style={{ marginBottom: 20 }}>
                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="24" fill={`${sector.iconBg}18`}/>
                    <g transform="translate(19,19)">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d={sector.iconPath} stroke={sector.iconBg} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </g>
                  </svg>
                </div>
                <div style={{ color: N, fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{sector.title}</div>
                <p style={{ color: MG, fontSize: 13, lineHeight: 1.75, marginBottom: 20 }}>{sector.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {sector.standards.split(' · ').map(std => (
                    <span key={std} style={{ background: `${sector.iconBg}14`, color: sector.iconBg, fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 12, border: `1px solid ${sector.iconBg}30` }}>{std}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BCM CYCLE ════════════════════════════════════════════ */}
      <section id="bcm" ref={bcmSection.ref} style={{ padding: '100px 48px', background: GR }}>
        <div style={{ maxWidth: 1200, margin: '0 auto',
                      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div style={{ opacity: bcmSection.inView ? 1 : 0, transform: bcmSection.inView ? 'scale(1)' : 'scale(0.93)', transition: 'all .8s ease' }}>
            <BcmCycle />
          </div>
          <div style={{ opacity: bcmSection.inView ? 1 : 0, transform: bcmSection.inView ? 'translateX(0)' : 'translateX(30px)', transition: 'all .7s ease .15s' }}>
            <SectionLabel text="BCM Döngüsü" />
            <SectionTitle>Kesintisiz Dayanıklılık<br/>Döngüsü</SectionTitle>
            <p style={{ color: MG, fontSize: 16, lineHeight: 1.8, marginBottom: 36 }}>
              HFER-720 motoru, yedi aşamalı BCM döngüsünü sürekli besler.
              Önlemeden yönetişime kadar her aşama platformda izlenir, güncellenir ve raporlanır.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { phase: 'Önleme',          desc: 'Tehlike tespiti ve proaktif risk azaltma',        color: '#E8C97A' },
                { phase: 'Hazırlıklı Olma', desc: 'Plan geliştirme, eğitim, tatbikat yönetimi',      color: '#7B9FD4' },
                { phase: 'Zarar Azaltma',   desc: 'Kayıp minimizasyonu ve güçlendirme yatırımları',  color: '#6ABFB8' },
                { phase: 'Müdahale',        desc: 'Gerçek zamanlı kriz komuta merkezi',              color: '#f87171' },
                { phase: 'İyileştirme',     desc: 'Operasyon restorasyonu ve RTO/RPO takibi',        color: '#fb923c' },
                { phase: 'İzleme',          desc: 'KPI kontrol paneli ve uyum denetimi',            color: '#a78bfa' },
                { phase: 'Yönetişim',       desc: 'Üst yönetim raporlama ve strateji güncelleme',   color: '#34d399' },
              ].map(item => (
                <div key={item.phase} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0, marginTop: 5 }}/>
                  <div>
                    <span style={{ color: N, fontWeight: 600, fontSize: 14 }}>{item.phase}: </span>
                    <span style={{ color: MG, fontSize: 14 }}>{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS ════════════════════════════════════════════════ */}
      <section id="sectors" ref={statsSection.ref} style={{ padding: '80px 48px', background: '#0f0730' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 40, textAlign: 'center' }}>
          {[
            { target: 720, suffix: '+', label: 'Analiz Parametresi' },
            { target: 39,  suffix: '',  label: 'İlçe Kapsamı' },
            { target: 6,   suffix: '',  label: 'Sektör Desteği' },
            { target: 98,  suffix: '%', label: 'Platform Uptime' },
          ].map((s, i) => (
            <div key={i} style={{ opacity: statsSection.inView ? 1 : 0, transform: statsSection.inView ? 'translateY(0)' : 'translateY(20px)', transition: `all .6s ease ${i * .1}s` }}>
              <div style={{ fontSize: 'clamp(40px, 5vw, 60px)', fontWeight: 700, color: G, lineHeight: 1 }}>
                <StatItem target={s.target} suffix={s.suffix} label={s.label} go={statsSection.inView} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CASE STUDIES ═════════════════════════════════════════ */}
      <section ref={caseSection.ref} style={{ padding: '100px 48px', background: GR }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <SectionLabel text="Vaka Çalışmaları" />
            <SectionTitle>Gerçek Projeler, Ölçülebilir Sonuçlar</SectionTitle>
            <p style={{ color: MG, fontSize: 16, maxWidth: 520, margin: '0 auto' }}>
              Pilot projeden sektör geneline — OMNI platformunun sahada yarattığı fark.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              {
                sektor: 'Kamu & Belediye', sektorRenk: T,
                icon: (
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="20" fill={`${T}18`}/>
                    <path d="M8 32 L8 20 L20 12 L32 20 L32 32 Z" stroke={T} strokeWidth="1.8" fill="none" strokeLinejoin="round"/>
                    <rect x="15" y="24" width="10" height="8" stroke={T} strokeWidth="1.5" fill="none"/>
                  </svg>
                ),
                baslik: 'Beylikdüzü Belediyesi',
                aciklama: 'İstanbul\'un batısında 354.000 nüfuslu ilçe için kapsamlı tesis dayanıklılık analizi ve Sendai çerçeve entegrasyonu.',
                metrik: '782 Tesis',
                metrikAlt: '6 sektör · 10 mahalle · pilot proje',
                detay: [
                  '103 kritik risk tespit edildi',
                  'NATECH tehlike haritası oluşturuldu',
                  'Sendai uyum skoru %47\'ye ulaştı',
                ],
              },
              {
                sektor: 'Bankacılık & Finans', sektorRenk: '#5BA3DC',
                icon: (
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="20" fill="#5BA3DC18"/>
                    <path d="M8 16 L20 10 L32 16" stroke="#5BA3DC" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="10" y="16" width="4" height="14" stroke="#5BA3DC" strokeWidth="1.5" fill="none"/>
                    <rect x="18" y="16" width="4" height="14" stroke="#5BA3DC" strokeWidth="1.5" fill="none"/>
                    <rect x="26" y="16" width="4" height="14" stroke="#5BA3DC" strokeWidth="1.5" fill="none"/>
                    <line x1="8" y1="30" x2="32" y2="30" stroke="#5BA3DC" strokeWidth="1.5"/>
                  </svg>
                ),
                baslik: 'Bankacılık Sektörü',
                aciklama: 'HFE-360 motoru ile çok şubeli banka ağının tesis bazlı dayanıklılık analizi ve operasyonel risk sicili.',
                metrik: '%34 Risk Azalma',
                metrikAlt: 'BCM tatbikatları sonrası ölçülen iyileşme',
                detay: [
                  '180+ şube HFE skoru hesaplandı',
                  'Kritik şubeler için RTO/RPO belirlendi',
                  'Basel III uyum raporu otomatik üretildi',
                ],
              },
              {
                sektor: 'Sağlık & Hastane', sektorRenk: '#f87171',
                icon: (
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="20" fill="#f8717118"/>
                    <rect x="12" y="10" width="16" height="20" rx="2" stroke="#f87171" strokeWidth="1.8" fill="none"/>
                    <line x1="20" y1="15" x2="20" y2="25" stroke="#f87171" strokeWidth="1.8" strokeLinecap="round"/>
                    <line x1="15" y1="20" x2="25" y2="20" stroke="#f87171" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ),
                baslik: 'Sağlık Sektörü',
                aciklama: 'Kritik hasta kapasitesi, tıbbi cihaz bağımlılık haritası ve hastane altyapı süreklilik analizi.',
                metrik: '12 Hastane',
                metrikAlt: 'BCP planları ISO 22301 uyumlu onaylandı',
                detay: [
                  'Kritik cihaz bağımlılık grafiği çıkarıldı',
                  'Tahliye senaryoları simüle edildi',
                  'Sendai SF-3 kapsamında yatırım planı',
                ],
              },
            ].map((cs, i) => (
              <div key={i} className="card"
                   style={{ opacity: caseSection.inView ? 1 : 0,
                             transform: caseSection.inView ? 'translateY(0)' : 'translateY(24px)',
                             transition: `all .6s ease ${i * .12}s`,
                             background: BG }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                               marginBottom: 20, flexDirection: 'row' }}>
                  {cs.icon}
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 12,
                                  background: `${cs.sektorRenk}14`, color: cs.sektorRenk,
                                  border: `1px solid ${cs.sektorRenk}30` }}>
                    {cs.sektor}
                  </span>
                </div>
                <h3 style={{ color: N, fontWeight: 700, fontSize: 18, marginBottom: 10 }}>{cs.baslik}</h3>
                <p style={{ color: MG, fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>{cs.aciklama}</p>
                {/* Metric highlight */}
                <div style={{ background: `${cs.sektorRenk}08`, border: `1px solid ${cs.sektorRenk}20`,
                               borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: cs.sektorRenk, fontFamily: 'DM Mono,monospace', lineHeight: 1 }}>
                    {cs.metrik}
                  </div>
                  <div style={{ fontSize: 12, color: MG, marginTop: 4 }}>{cs.metrikAlt}</div>
                </div>
                {/* Bullets */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                  {cs.detay.map((d, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: cs.sektorRenk,
                                      flexShrink: 0, marginTop: 6 }}/>
                      <span style={{ fontSize: 13, color: MG, lineHeight: 1.5 }}>{d}</span>
                    </div>
                  ))}
                </div>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 6,
                                      color: cs.sektorRenk, fontSize: 13, fontWeight: 600 }}>
                  <span>Vaka Çalışmasını İncele</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M7 3l4 4-4 4" stroke={cs.sektorRenk} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ RESOURCES ════════════════════════════════════════════ */}
      <section ref={resourceSection.ref} style={{ padding: '100px 48px', background: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <SectionLabel text="Kaynaklar & Blog" />
            <SectionTitle>Uzman İçerikler</SectionTitle>
            <p style={{ color: MG, fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
              BCM, risk yönetimi ve afet dayanıklılığı hakkında derinlemesine okumalar.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              {
                kategori: 'Metodoloji', kategorRenk: T,
                baslik: 'HFER-720: 720 Parametreli Risk Modeli',
                ozet: 'Tehlike, kırılganlık, kapasite ve maruziyet bileşenlerini tek bir URI skoruna nasıl dönüştürüyoruz? Formül, veri kaynakları ve sektör kalibrasyonu.',
                okumaSuresi: '8 dk',
                tarih: 'Mart 2026',
                ikon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                ),
              },
              {
                kategori: 'Kavram', kategorRenk: '#F97316',
                baslik: 'NATECH Nedir? Doğal Afet Kaynaklı Teknolojik Kazalar',
                ozet: 'Deprem, sel veya kasırga sonrasında sanayi tesislerinde tetiklenen ikincil kazalar. RAPID-N metodolojisi ve Beylikdüzü Haramidere örneği.',
                okumaSuresi: '6 dk',
                tarih: 'Şubat 2026',
                ikon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                ),
              },
              {
                kategori: 'Politika', kategorRenk: '#8B5CF6',
                baslik: 'Sendai Çerçevesi ve Türk Belediyeleri İçin Anlamı',
                ozet: '2015-2030 Sendai Çerçevesi\'nin 4 önceliğini, Türkiye\'nin ulusal uyum durumunu ve belediyeler için pratik uygulama adımlarını keşfedin.',
                okumaSuresi: '10 dk',
                tarih: 'Ocak 2026',
                ikon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                ),
              },
            ].map((r, i) => (
              <div key={i} className="card"
                   style={{ opacity: resourceSection.inView ? 1 : 0,
                             transform: resourceSection.inView ? 'translateY(0)' : 'translateY(24px)',
                             transition: `all .6s ease ${i * .12}s`, padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {r.ikon}
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 12,
                                    background: `${r.kategorRenk}14`, color: r.kategorRenk,
                                    border: `1px solid ${r.kategorRenk}30` }}>
                      {r.kategori}
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: MG }}>{r.okumaSuresi} okuma</span>
                </div>
                <h3 style={{ color: N, fontWeight: 700, fontSize: 16, lineHeight: 1.4, marginBottom: 12 }}>
                  {r.baslik}
                </h3>
                <p style={{ color: MG, fontSize: 13, lineHeight: 1.75, marginBottom: 24 }}>{r.ozet}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                               borderTop: '1px solid #E8EDF3', paddingTop: 18 }}>
                  <span style={{ fontSize: 12, color: MG }}>{r.tarih}</span>
                  <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 5,
                                        color: r.kategorRenk, fontSize: 13, fontWeight: 600 }}>
                    Devamını Oku
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7h8M7 3l4 4-4 4" stroke={r.kategorRenk} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ═════════════════════════════════════════ */}
      <section id="about" ref={testiSection.ref} style={{ padding: '100px 48px', background: GR }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <SectionLabel text="Müşteri Yorumları" />
            <SectionTitle>Liderler Ne Diyor?</SectionTitle>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="card"
                   style={{ opacity: testiSection.inView ? 1 : 0,
                             transform: testiSection.inView ? 'translateY(0)' : 'translateY(24px)',
                             transition: `all .6s ease ${i * .12}s` }}>
                <svg width="28" height="22" viewBox="0 0 28 22" style={{ marginBottom: 18 }}>
                  <text x="0" y="22" fontSize="36" fill={T} opacity="0.35">&ldquo;</text>
                </svg>
                <p style={{ color: N, fontSize: 15, lineHeight: 1.8, fontStyle: 'italic',
                             marginBottom: 24, fontWeight: 400 }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12,
                               borderTop: '1px solid #E8EDF3', paddingTop: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${T}20`,
                                 display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: T, fontWeight: 700, fontSize: 14 }}>
                      {t.name.split(' ').map(w => w[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div style={{ color: N, fontWeight: 600, fontSize: 14 }}>{t.name}</div>
                    <div style={{ color: MG, fontSize: 12, marginTop: 2 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 48px', background: BG }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ background: N, borderRadius: 24, padding: '64px 56px', textAlign: 'center',
                        boxShadow: '0 8px 48px rgba(10,22,40,.16)' }}>
            <p style={{ color: T, fontSize: 12, fontWeight: 700, letterSpacing: 3,
                        textTransform: 'uppercase', marginBottom: 16 }}>Başlayın</p>
            <h2 style={{ color: BG, fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 700,
                          lineHeight: 1.12, marginBottom: 20 }}>
              İlk Adımı Atın
            </h2>
            <p style={{ color: '#607899', fontSize: 16, lineHeight: 1.75,
                         maxWidth: 480, margin: '0 auto 40px' }}>
              14 günlük ücretsiz deneme. Kurulum yok, kredi kartı gerekmez.
              BCM danışmanımız sizi arar, platform üzerinde birlikte ilerleriz.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/login" style={{ background: G, color: N, fontWeight: 700, fontSize: 15,
                                            padding: '14px 40px', borderRadius: 8,
                                            transition: 'opacity .18s', display: 'inline-block' }}>
                Ücretsiz Başlayın
              </Link>
              <a href="mailto:info@omniversel.com" style={{ border: `1.5px solid #2A3F5F`, color: '#607899',
                                                             fontWeight: 600, fontSize: 15, padding: '13px 32px',
                                                             borderRadius: 8, display: 'inline-block', transition: 'border-color .18s' }}>
                Bize Yazın
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════ */}
      <footer style={{ background: '#0a0520', padding: '64px 48px 36px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 56 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="8" fill={T} fillOpacity="0.2"/>
                  <polygon points="16,7 25,22 7,22" fill="none" stroke={T} strokeWidth="2"/>
                  <circle cx="16" cy="18" r="2" fill={G}/>
                </svg>
                <span style={{ color: BG, fontSize: 17, fontWeight: 700 }}>
                  omni<span style={{ color: T }}>versel</span>
                </span>
              </div>
              <p style={{ color: '#607899', fontSize: 14, lineHeight: 1.8, maxWidth: 260 }}>
                Yapay zeka destekli kurumsal dayanıklılık platformu.
                ISO 22301 · BCM · AFAD uyumlu.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                {['ISO 22301', 'BCM', 'KVKK'].map(b => (
                  <span key={b} style={{ background: '#142340', color: T, fontSize: 11, fontWeight: 600, letterSpacing: 1, padding: '4px 10px', borderRadius: 4 }}>{b}</span>
                ))}
              </div>
            </div>
            {[
              { title: 'Platform',  links: ['omniRISK','omniIMPACT','omniPLAN','omniCRISIS','omniAUDIT','omniVENDOR'] },
              { title: 'Şirket',    links: ['Hakkımızda','Blog','Kariyer','Basın','İletişim'] },
              { title: 'Destek',    links: ['Dokümantasyon','SSS','Güvenlik','KVKK','Kullanım Şartları'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ color: '#E2EAF3', fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>
                  {col.title}
                </div>
                {col.links.map(l => (
                  <div key={l} style={{ marginBottom: 12 }}>
                    <a href="#" style={{ color: '#607899', fontSize: 14, transition: 'color .18s' }}
                       onMouseEnter={e => (e.currentTarget.style.color = BG)}
                       onMouseLeave={e => (e.currentTarget.style.color = '#607899')}>{l}</a>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #142340', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <span style={{ color: '#607899', fontSize: 13 }}>
              © {new Date().getFullYear()} Omniversel Teknoloji A.Ş. Tüm hakları saklıdır.
            </span>
            <span style={{ color: '#607899', fontSize: 13 }}>
              İTÜ AYM iş birliğiyle · Sendai 2015–2030 uyumlu
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}
