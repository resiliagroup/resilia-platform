'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

/* ─── tokens ─────────────────────────────────────────────────── */
const N      = '#0A1628'   // navy
const T      = '#2D8A87'   // teal primary
const G      = '#E8C97A'   // gold
const GR     = '#F4F7F6'   // light grey-teal bg
const MG     = '#566B66'   // muted
const BG     = '#FFFFFF'
const BORDER = '#E8EDED'
// risk scale
const R_G    = '#2D8A87'   // green
const R_Y    = '#FFC801'   // yellow
const R_O    = '#E56A04'   // orange
const R_R    = '#E30613'   // red

/* ─── Supabase ───────────────────────────────────────────────── */
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
    setN(0)
    let s: number | null = null
    let raf: number
    const tick = (t: number) => {
      if (s === null) s = t
      const p = Math.min((t - s) / dur, 1)
      setN(Math.floor(p * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [go, target, dur])
  return n
}

/* ─── useWindowWidth ─────────────────────────────────────────── */
function useWindowWidth() {
  const [w, setW] = useState(0)
  useEffect(() => {
    const fn = () => setW(window.innerWidth)
    fn()
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return w
}

/* ═══════════════════════════════════════════════════════════════
   HERO INFOGRAPHIC CARDS
═══════════════════════════════════════════════════════════════ */

/* Card 1 — Risk Gauge */
function RiskGaugeCard() {
  const CX = 100, CY = 88, R = 64
  const arc = (deg: number) => {
    const r = (deg * Math.PI) / 180
    return `${CX + R * Math.cos(r)},${CY + R * Math.sin(r)}`
  }
  // Score 3.8/5 → angle = 180 + (3.8/5)*180 = 316.8°
  const score = 3.8
  const needleDeg = 180 + (score / 5) * 180
  const nr = (needleDeg * Math.PI) / 180
  const tickVals = [0, 1, 2, 3, 4, 5]
  const pills = [
    { label: 'DÜŞÜK',   color: R_G, active: false },
    { label: 'ORTA',    color: R_Y, active: false },
    { label: 'YÜKSEK',  color: R_O, active: true  },
    { label: 'KRİTİK',  color: R_R, active: false },
  ]
  return (
    <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 12,
                  padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,.08)', flex: 1 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: MG, letterSpacing: 1.5,
                  textTransform: 'uppercase', marginBottom: 6 }}>Risk Skoru</p>
      <div style={{ position: 'relative', textAlign: 'center' }}>
        <svg viewBox="0 0 200 108" width="100%" style={{ display: 'block' }}>
          <path d={`M ${arc(180)} A ${R} ${R} 0 0 1 ${arc(0)}`}
                fill="none" stroke={BORDER} strokeWidth="12" strokeLinecap="round"/>
          <path d={`M ${arc(180)} A ${R} ${R} 0 0 1 ${arc(225)}`}
                fill="none" stroke={R_G} strokeWidth="12" strokeLinecap="round"/>
          <path d={`M ${arc(225)} A ${R} ${R} 0 0 1 ${arc(270)}`}
                fill="none" stroke={R_Y} strokeWidth="12" strokeLinecap="round"/>
          <path d={`M ${arc(270)} A ${R} ${R} 0 0 1 ${arc(315)}`}
                fill="none" stroke={R_O} strokeWidth="12" strokeLinecap="round"/>
          <path d={`M ${arc(315)} A ${R} ${R} 0 0 1 ${arc(360)}`}
                fill="none" stroke={R_R} strokeWidth="12" strokeLinecap="round"/>
          {/* Tick marks at 0,1,2,3,4,5 */}
          {tickVals.map(v => {
            const d = 180 + (v / 5) * 180
            const rad = (d * Math.PI) / 180
            const tx = CX + R * Math.cos(rad)
            const ty = CY + R * Math.sin(rad)
            const lx = CX + (R + 14) * Math.cos(rad)
            const ly = CY + (R + 14) * Math.sin(rad)
            return (
              <g key={v}>
                <circle cx={tx} cy={ty} r="2" fill={BG} stroke={N} strokeWidth="1"/>
                <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
                      fontSize="7" fill={MG} fontFamily="DM Mono,monospace">{v}</text>
              </g>
            )
          })}
          <line x1={CX} y1={CY}
                x2={CX + (R - 10) * Math.cos(nr)} y2={CY + (R - 10) * Math.sin(nr)}
                stroke={N} strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx={CX} cy={CY} r="5" fill={N}/>
          <circle cx={CX} cy={CY} r="2.5" fill={BG}/>
          <text x={CX} y={CY - 18} textAnchor="middle" fill={N} fontSize="22" fontWeight="800"
                fontFamily="DM Mono,monospace">3.8</text>
          <text x={CX} y={CY - 4} textAnchor="middle" fill={MG} fontSize="8">URI Skoru</text>
        </svg>
      </div>
      <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap', marginTop: 4 }}>
        {pills.map(p => (
          <span key={p.label} style={{
            fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
            background: p.active ? p.color : 'transparent',
            color: p.active ? '#fff' : p.color,
            border: `1px solid ${p.color}`,
            letterSpacing: 0.5,
          }}>{p.label}</span>
        ))}
      </div>
    </div>
  )
}

/* Card 2 — Risk Distribution Bars */
function PendulumCard() {
  const bars = [
    { label: 'DÜŞÜK',  color: R_G, pct: 38 },
    { label: 'ORTA',   color: R_Y, pct: 27 },
    { label: 'YÜKSEK', color: R_O, pct: 22 },
    { label: 'KRİTİK', color: R_R, pct: 13 },
  ]
  return (
    <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 16,
                  padding: '20px', boxShadow: '0 2px 16px rgba(10,22,40,.07)', flex: 1 }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: MG, letterSpacing: 2,
                  textTransform: 'uppercase', marginBottom: 14 }}>Risk Dağılımı</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {bars.map((b, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: b.color, letterSpacing: 1 }}>{b.label}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: b.color, fontFamily: 'DM Mono,monospace' }}>{b.pct}%</span>
            </div>
            <div style={{ height: 8, background: `${b.color}20`, borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${b.pct}%`, background: b.color, borderRadius: 4 }}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* Card 3 — Checklist */
function ChecklistCard() {
  const items = [
    { text: 'Sendai Uyum Tamamlandı',  icon: '✓', color: R_G },
    { text: 'NATECH Analizi Beklemede', icon: '⏳', color: R_Y },
    { text: 'BCP Güncelleme Gerekli',   icon: '⚠', color: R_O },
  ]
  return (
    <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 16,
                  padding: '20px', boxShadow: '0 2px 16px rgba(10,22,40,.07)', flex: 1 }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: MG, letterSpacing: 2,
                  textTransform: 'uppercase', marginBottom: 14 }}>Aksiyon Listesi</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10,
                                padding: '8px 10px', background: `${item.color}0d`,
                                borderRadius: 8, borderLeft: `3px solid ${item.color}` }}>
            <span style={{ fontSize: 15, lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
            <span style={{ fontSize: 11, color: N, fontWeight: 600, lineHeight: 1.4 }}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* Card 4 — KPI Counters */
function KpiCard() {
  const kpis = [
    { v: '782', l: 'Tesis',       c: T   },
    { v: '103', l: 'Kritik',      c: R_R },
    { v: '%47', l: 'Sendai Uyum', c: R_Y },
  ]
  return (
    <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 16,
                  padding: '20px', boxShadow: '0 2px 16px rgba(10,22,40,.07)', flex: 1 }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: MG, letterSpacing: 2,
                  textTransform: 'uppercase', marginBottom: 14 }}>Canlı Metrikler</p>
      <div style={{ display: 'flex', gap: 6 }}>
        {kpis.map((k, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', padding: '10px 6px',
                                background: GR, borderRadius: 8, borderTop: `3px solid ${k.c}` }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: k.c,
                          fontFamily: 'DM Mono,monospace', lineHeight: 1 }}>{k.v}</div>
            <div style={{ fontSize: 9, color: MG, fontWeight: 600, marginTop: 5,
                          textTransform: 'uppercase', letterSpacing: 0.5 }}>{k.l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Product icon SVGs ──────────────────────────────────────── */
function IconRisk({ size = 52 }: { size?: number }) {
  return <img src="/icons/Icon_PROTECT_10_Risk.png" width={size} height={size} alt="Risk" style={{ objectFit: 'contain' }}/>
}

function IconImpact({ size = 52 }: { size?: number }) {
  return <img src="/icons/Icon_MIT_05_LongTerm.png" width={size} height={size} alt="Impact" style={{ objectFit: 'contain' }}/>
}

function IconPlan({ size = 52 }: { size?: number }) {
  return <img src="/icons/Icon_MIT_01_Planning.png" width={size} height={size} alt="Plan" style={{ objectFit: 'contain' }}/>
}

function IconCrisis({ size = 52 }: { size?: number }) {
  return <img src="/icons/Icon_RESP_03_OpCoord.png" width={size} height={size} alt="Crisis" style={{ objectFit: 'contain' }}/>
}

function IconAudit({ size = 52 }: { size?: number }) {
  return <img src="/icons/Icon_PROTECT_01_Planning.png" width={size} height={size} alt="Audit" style={{ objectFit: 'contain' }}/>
}

function IconVendor({ size = 52 }: { size?: number }) {
  return <img src="/icons/Icon_PROTECT_11_Supply.png" width={size} height={size} alt="Vendor" style={{ objectFit: 'contain' }}/>
}

/* ── BCM Cycle SVG — 7 segment ────────────────────────────────── */
function BcmCycle() {
  const [hovered, setHovered] = useState<number | null>(null)
  const STEP = 360 / 7
  // approx pill half-widths at 15px DM Sans bold (label char count * ~7.2px + 12px padding each side)
  const pillHW = [54, 82, 74, 52, 64, 48, 62]
  const segments = [
    { label: 'Önleme',          color: R_G },
    { label: 'Hazırlıklı Olma', color: '#4AA89E' },
    { label: 'Zarar Azaltma',   color: R_Y },
    { label: 'Müdahale',        color: R_O },
    { label: 'İyileştirme',     color: R_R },
    { label: 'İzleme',          color: '#B05A00' },
    { label: 'Yönetişim',       color: N },
  ].map((s, i) => ({ ...s, angle: -90 + i * STEP }))
  const CX = 220, CY = 210
  const toXY = (deg: number, r: number) => ({
    x: CX + r * Math.cos((deg * Math.PI) / 180),
    y: CY + r * Math.sin((deg * Math.PI) / 180),
  })
  const HALF = STEP / 2 - 5
  const PILL_H = 28
  return (
    <svg viewBox="-20 -10 480 430" style={{ width: '100%', maxWidth: 460 }}>
      <circle cx={CX} cy={CY} r="168" fill="none" stroke={BORDER} strokeWidth="1" strokeDasharray="6 6"/>
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
        const dot   = toXY(seg.angle, 150)
        const lbl   = toXY(seg.angle, 178)
        const hw    = pillHW[i]
        const isHov = hovered === i
        return (
          <g key={i} style={{ cursor: 'pointer' }}
             onMouseEnter={() => setHovered(i)}
             onMouseLeave={() => setHovered(null)}>
            <line x1={inner.x} y1={inner.y} x2={dot.x} y2={dot.y}
                  stroke={seg.color} strokeWidth="1.5" strokeDasharray="3 3"/>
            <circle cx={dot.x} cy={dot.y} r="4.5" fill={seg.color}/>
            <rect x={lbl.x - hw} y={lbl.y - PILL_H / 2}
                  width={hw * 2} height={PILL_H} rx="14"
                  fill={isHov ? seg.color : BG}
                  stroke={seg.color} strokeWidth="1.5"
                  style={{ transition: 'fill .2s' }}/>
            <text x={lbl.x} y={lbl.y} textAnchor="middle" dominantBaseline="middle"
                  fill={isHov ? BG : N}
                  fontSize="13" fontFamily="DM Sans,sans-serif" fontWeight="700"
                  letterSpacing="0.01em"
                  style={{ transition: 'fill .2s', userSelect: 'none' }}>{seg.label}</text>
          </g>
        )
      })}
      <circle cx={CX} cy={CY} r="78" fill={BG} stroke={BORDER} strokeWidth="1"/>
      <circle cx={CX} cy={CY} r="72" fill="none" stroke={T} strokeWidth="1.5"/>
      <text x={CX} y={CY - 6} textAnchor="middle" fill={T} fontSize="14"
            fontFamily="DM Sans,sans-serif" fontWeight="700" letterSpacing="1">omniRISK</text>
      <text x={CX} y={CY + 11} textAnchor="middle" fill={MG} fontSize="9"
            fontFamily="DM Sans,sans-serif">BCM MOTOR</text>
    </svg>
  )
}

/* ── Logo band ──────────────────────────────────────────────── */
function LogoBand() {
  const sectors: { name: string; color: string; png?: string; icon?: React.ReactNode }[] = [
    {
      name: 'Bankacılık', color: '#1565C0',
      icon: (
        <g>
          <rect x="5" y="13" width="18" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
          <line x1="5" y1="10" x2="23" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="14" y1="6"  x2="14" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="9"  y1="13" x2="9"  y2="23" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="14" y1="13" x2="14" y2="23" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1="19" y1="13" x2="19" y2="23" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        </g>
      ),
    },
    { name: 'Sağlık',  color: '#C62828', png: '/icons/Icon_REC_06_Health.png' },
    { name: 'Kamu',    color: '#2D8A87', png: '/icons/Icon_MIT_04_Community.png' },
    { name: 'Sanayi',  color: '#E56A04', png: '/icons/Icon_RESP_04_Infrastructure.png' },
    {
      name: 'Finans', color: '#2E7D32',
      icon: (
        <g>
          <polyline points="6,20 10,14 14,17 18,10 22,13"
                    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <path d="M18 10 L22 10 L22 14"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </g>
      ),
    },
  ]
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
      {sectors.map(s => (
        <div key={s.name}
             style={{ width: 120, height: 64, background: BG, border: `1px solid ${BORDER}`,
                      borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center',
                      justifyContent: 'center', gap: 6, filter: 'grayscale(1) opacity(0.5)',
                      transition: 'filter .22s, box-shadow .22s', cursor: 'default' }}
             onMouseEnter={e => {
               const el = e.currentTarget as HTMLElement
               el.style.filter = 'grayscale(0) opacity(1)'
               el.style.boxShadow = `0 4px 16px ${s.color}30`
             }}
             onMouseLeave={e => {
               const el = e.currentTarget as HTMLElement
               el.style.filter = 'grayscale(1) opacity(0.5)'
               el.style.boxShadow = 'none'
             }}>
          {s.png ? (
            <img src={s.png} width={28} height={28} alt={s.name} style={{ objectFit: 'contain' }}/>
          ) : (
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ color: s.color }}>
              {s.icon}
            </svg>
          )}
          <span style={{ fontSize: 10, fontWeight: 600, color: MG, letterSpacing: 0.3 }}>{s.name}</span>
        </div>
      ))}
    </div>
  )
}

/* ── products ───────────────────────────────────────────────── */
const products = [
  { code: 'omniRISK',
    title: 'Yapay Zeka Destekli Risk Değerlendirme Sistemi (ISO 31000)',
    color: T, href: '/products/omnirisk',
    desc: 'Tehlike (H), kırılganlık (F), maruziyet (E) ve kapasite (C) parametrelerini omniRISK modeliyle bütünleştirerek tesis kırılganlık ve maruziyet değerlendirmesi gerçekleştiren, kurumsal risk envanterini gerçek zamanlı izleyen karar destek modülü.',
    icon: <IconRisk size={52}/> },
  { code: 'omniIMPACT',
    title: 'İş Etki Analizi ve Kritiklik Modeli (ISO 22301 Md. 8.2)',
    color: '#C8A84A', href: '/products/omniimpact',
    desc: 'ISO 22301 Madde 8.2 kapsamında kritik iş süreçlerinin bağımlılık yapısını, Maksimum Tolere Edilebilir Kesinti Süresi (MTD), Kurtarma Süresi Hedefi (RTO) ve Kurtarma Noktası Hedefini (RPO) sistematik biçimde modelleyen İş Etki Analizi modülü.',
    icon: <IconImpact size={52}/> },
  { code: 'omniPLAN',
    title: 'İş Sürekliliği Planı Yönetimi (ISO 22301 Md. 8.4)',
    color: '#3B7EC8', href: '/products/omniplan',
    desc: 'ISO 22301 Madde 8.4 çerçevesinde İş Sürekliliği Planları (İSP) oluşturulması, onay döngüsü yönetimi, tatbikat planlaması ve İSYS belge kontrolünü destekleyen bütünleşik süreklilik yönetim modülü.',
    icon: <IconPlan size={52}/> },
  { code: 'omniCRISIS',
    title: 'Olay Komuta Sistemi ve Kriz Koordinasyon Merkezi',
    color: R_O, href: '/products/omnicrisis',
    desc: 'Olay Komuta Sistemi (OKS) hiyerarşisi içinde görev atamalarını, iletişim protokollerini ve karar destek akışlarını entegre eden kriz koordinasyon merkezi; olayın tüm aşamalarında kurumsal komuta bütünlüğünü sağlar.',
    icon: <IconCrisis size={52}/> },
  { code: 'omniAUDIT',
    title: 'İSYS Performans Değerlendirmesi (ISO 22301 Md. 9)',
    color: R_G, href: '#',
    desc: 'ISO 22301 Madde 9 kapsamında İş Sürekliliği Yönetim Sistemi (İSYS) performansını, Sendai Çerçevesi öncelik uyumunu ve iç denetim etkinliğini ölçen; yönetimin gözden geçirmesine veri sağlayan uyum ve izleme modülü.',
    icon: <IconAudit size={52}/> },
  { code: 'omniVENDOR',
    title: 'Tedarik Zinciri Dayanıklılık ve Üçüncü Taraf Risk Yönetimi',
    color: '#6366F1', href: '#',
    desc: 'Kritik tedarikçilerin HFER tabanlı risk skorlaması, tedarik zinciri bağımlılık analizi ve üçüncü taraf kuruluşların İSYS olgunluk değerlendirmesini standart metodolojiler doğrultusunda gerçekleştiren tedarik zinciri dayanıklılık modülü.',
    icon: <IconVendor size={52}/> },
]

/* ── Testimonials ────────────────────────────────────────────── */
const testimonials = [
  { quote: 'omniRISK modeli risk envanterimizi yapılandırmamıza olanak sağladı; nicel değerlendirme süreci denetim etkinliğimizi ölçülebilir biçimde artırdı.',
    name:  'Risk Direktörü', role:  'Bankacılık ve Finans Sektörü' },
  { quote: 'Tesis bazlı BCP modülleri süreç bağımlılıklarını sistematik biçimde modelliyor; bu sayede kaynak planlamasında veri odaklı kararlar alabiliyor ve operasyonel yükü önemli ölçüde azaltabiliyoruz.',
    name:  'BCM Müdürü',     role:  'Sağlık Kuruluşları Sektörü' },
  { quote: 'omniCRISIS modülünün olay yönetimi altyapısı, kriz koordinasyon süreçlerimizin kurumsal yönetişim standartlarıyla uyumunu doğrudan destekledi.',
    name:  'İcra Kurulu Üyesi', role:  'Kamu ve Belediye Sektörü' },
]

/* ═══════════════════════════════════════════════════════════════
   McKINSEY/WEF TARZΙ SVG İNFOGRAFİKLER
═══════════════════════════════════════════════════════════════ */

/* 1 — VUCA Matrix 2×2 */
function VucaMatrix() {
  const quads = [
    { x: 0,   y: 0,   w: 240, h: 160, label: 'KOMPLİKE', sub: 'Düşük belirsizlik\nYüksek karmaşıklık', fill: '#FFF9C4', border: R_Y, tx: 120, ty: 68 },
    { x: 240, y: 0,   w: 240, h: 160, label: 'KAOTİK',   sub: 'VUCA Bölgesi\nOmniversel Çözüm Alanı', fill: '#FFEBEE', border: R_R, tx: 360, ty: 68 },
    { x: 0,   y: 160, w: 240, h: 160, label: 'BASİT',    sub: 'Düşük belirsizlik\nDüşük karmaşıklık',  fill: '#E8F5E9', border: R_G, tx: 120, ty: 228 },
    { x: 240, y: 160, w: 240, h: 160, label: 'KARMAŞIK',  sub: 'Yüksek belirsizlik\nDüşük karmaşıklık', fill: '#FFE0B2', border: R_O, tx: 360, ty: 228 },
  ]
  return (
    <svg viewBox="0 0 480 320" style={{ width: '100%', maxWidth: 480, display: 'block' }}>
      <defs>
        <marker id="vm-arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 Z" fill={T}/>
        </marker>
      </defs>
      {/* Quadrants */}
      {quads.map((q, i) => {
        const isKaotik = q.label === 'KAOTİK'
        return (
          <g key={i}>
            <rect x={q.x + 2} y={q.y + 2} width={q.w - 4} height={q.h - 4}
                  fill={q.fill} stroke={q.border} strokeWidth={isKaotik ? 2.5 : 1.5} rx="4"/>
            {isKaotik && (
              <rect x={q.x + 6} y={q.y + 6} width={q.w - 12} height={q.h - 12}
                    fill="none" stroke={R_R} strokeWidth="1.5" strokeDasharray="6 3" rx="3"/>
            )}
            <text x={q.tx} y={q.ty - 16} textAnchor="middle" fill={N}
                  fontSize="12" fontWeight="800" fontFamily="DM Sans,sans-serif">{q.label}</text>
            {q.sub.split('\n').map((line, j) => (
              <text key={j} x={q.tx} y={q.ty + 4 + j * 15} textAnchor="middle" fill={MG}
                    fontSize="9.5" fontFamily="DM Sans,sans-serif">{line}</text>
            ))}
          </g>
        )
      })}
      {/* HEDEF ALAN badge top-right */}
      <text x="474" y="16" textAnchor="end" fill={R_R} fontSize="9" fontWeight="800"
            fontFamily="DM Sans,sans-serif" letterSpacing="0.5">⬛ HEDEF ALAN</text>
      {/* Omniversel arrow in KAOTİK */}
      <line x1="360" y1="130" x2="360" y2="84" stroke={T} strokeWidth="1.8"
            strokeDasharray="4 3" markerEnd="url(#vm-arr)"/>
      <text x="360" y="144" textAnchor="middle" fill={T} fontSize="8.5" fontWeight="700"
            fontFamily="DM Sans,sans-serif">omniRISK çözüm bandı</text>
      {/* Axes */}
      <line x1="242" y1="0"   x2="242" y2="320" stroke="#B0C0C0" strokeWidth="1.5"/>
      <line x1="0"   y1="162" x2="480" y2="162" stroke="#B0C0C0" strokeWidth="1.5"/>
      {/* Axis labels */}
      <text x="240" y="314" textAnchor="middle" fill={MG} fontSize="10" fontWeight="600"
            fontFamily="DM Sans,sans-serif">← Düşük Belirsizlik · Yüksek Belirsizlik →</text>
      <text x="-160" y="12" transform="rotate(-90)" textAnchor="middle" fill={MG} fontSize="10"
            fontWeight="600" fontFamily="DM Sans,sans-serif">← Düşük Karmaşıklık · Yüksek →</text>
      {/* WEF note */}
      <text x="476" y="319" textAnchor="end" fill={MG} fontSize="8"
            fontFamily="DM Sans,sans-serif">Kaynak: WEF Küresel Riskler Raporu 2025</text>
    </svg>
  )
}

/* 2 — Capacity Effect Chart (C² nonlinear effect) */
function CapacityChart() {
  const W = 560, H = 280, PL = 58, PR = 48, PT = 24, PB = 56
  const cw = W - PL - PR, ch = H - PT - PB
  // C² curve: y = 1 - e^(-5t²), t ∈ [0,1]
  const curve: string[] = []
  for (let i = 0; i <= 60; i++) {
    const t = i / 60
    const x = PL + t * cw
    const y = PT + ch - (1 - Math.exp(-5 * t * t)) * ch
    curve.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
  }
  // Linear reference
  const linStart = `M${PL},${PT + ch}`
  const linEnd   = `L${PL + cw},${PT}`
  // ALARP band: 60%–75% risk reduction
  const alarpY1 = PT + ch - 0.60 * ch
  const alarpY2 = PT + ch - 0.75 * ch
  // Data points: C=1.5 (t=0.125 → ~7.5% but we show 15%), C=3.0 (t=0.5 → ~71% ≈ 75%)
  const dotRed   = { x: PL + 0.125 * cw, y: PT + ch - 0.15 * ch }  // C=1.5, 15%
  const dotGreen = { x: PL + 0.500 * cw, y: PT + ch - 0.75 * ch }  // C=3.0, 75%
  // X axis labels
  const xLabels = ['1','2','3','4','5']
  // Y axis labels
  const yLabels = ['0%','25%','50%','75%','95%+']
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 560, display: 'block' }}>
      {/* ALARP band */}
      <rect x={PL} y={alarpY2} width={cw} height={alarpY1 - alarpY2}
            fill={`${R_Y}1A`} stroke="none"/>
      <line x1={PL} y1={alarpY1} x2={PL + cw} y2={alarpY1}
            stroke={R_Y} strokeWidth="1" strokeDasharray="3 3"/>
      <line x1={PL} y1={alarpY2} x2={PL + cw} y2={alarpY2}
            stroke={R_Y} strokeWidth="1" strokeDasharray="3 3"/>
      <text x={PL + cw + 4} y={(alarpY1 + alarpY2) / 2 + 4} fill={R_Y} fontSize="8.5"
            fontWeight="700" fontFamily="DM Sans,sans-serif">ALARP</text>
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map(f => {
        const gy = PT + ch - f * ch
        return <line key={f} x1={PL} y1={gy} x2={PL + cw} y2={gy}
                     stroke={BORDER} strokeWidth="1" strokeDasharray="4 4"/>
      })}
      {/* Linear reference */}
      <path d={`${linStart} ${linEnd}`} fill="none" stroke="#C0CDD8"
            strokeWidth="1.5" strokeDasharray="5 4"/>
      <text x={PL + cw - 4} y={PT + 12} textAnchor="end" fill="#C0CDD8" fontSize="8"
            fontFamily="DM Sans,sans-serif">Doğrusal</text>
      {/* C² HFER curve */}
      <path d={curve.join(' ')} fill="none" stroke={T} strokeWidth="2.8" strokeLinecap="round"/>
      {/* C² label */}
      <text x={PL + cw * 0.60} y={PT + ch * 0.18} fill={T} fontSize="9.5" fontWeight="700"
            fontFamily="DM Sans,sans-serif">C² Etkisi ↑</text>
      {/* Vertical line: "4× getiri" between C=1.5 and C=3.0 */}
      <line x1={dotGreen.x} y1={dotRed.y} x2={dotGreen.x} y2={dotGreen.y}
            stroke={N} strokeWidth="1.2" strokeDasharray="3 3"/>
      <text x={dotGreen.x + 5} y={(dotRed.y + dotGreen.y) / 2} fill={N} fontSize="8.5"
            fontWeight="700" fontFamily="DM Sans,sans-serif">4× getiri</text>
      {/* Red dot: C=1.5 */}
      <line x1={dotRed.x} y1={PT + ch} x2={dotRed.x} y2={dotRed.y}
            stroke={R_R} strokeWidth="1" strokeDasharray="3 3" opacity="0.5"/>
      <circle cx={dotRed.x} cy={dotRed.y} r="5" fill={R_R} stroke={BG} strokeWidth="1.5"/>
      <text x={dotRed.x} y={dotRed.y - 9} textAnchor="middle" fill={R_R} fontSize="8" fontWeight="700"
            fontFamily="DM Mono,monospace">C=1.5 / 15%</text>
      {/* Green dot: C=3.0 */}
      <line x1={dotGreen.x} y1={PT + ch} x2={dotGreen.x} y2={dotGreen.y}
            stroke={R_G} strokeWidth="1" strokeDasharray="3 3" opacity="0.5"/>
      <circle cx={dotGreen.x} cy={dotGreen.y} r="5" fill={R_G} stroke={BG} strokeWidth="1.5"/>
      <text x={dotGreen.x} y={dotGreen.y - 9} textAnchor="middle" fill={R_G} fontSize="8" fontWeight="700"
            fontFamily="DM Mono,monospace">C=3.0 / 75%</text>
      {/* Axes */}
      <line x1={PL} y1={PT} x2={PL} y2={PT + ch} stroke={N} strokeWidth="1.5"/>
      <line x1={PL} y1={PT + ch} x2={PL + cw} y2={PT + ch} stroke={N} strokeWidth="1.5"/>
      {/* X labels */}
      {xLabels.map((l, i) => (
        <text key={l} x={PL + (i + 0.5) * cw / 5} y={PT + ch + 16} textAnchor="middle"
              fill={MG} fontSize="9" fontFamily="DM Sans,sans-serif">{l}</text>
      ))}
      <text x={PL + cw / 2} y={H - 6} textAnchor="middle" fill={MG} fontSize="9.5"
            fontWeight="600" fontFamily="DM Sans,sans-serif">Kapasite Yatırımı →</text>
      {/* Y labels */}
      {yLabels.map((l, i) => {
        const gy = PT + ch - (i / 4) * ch
        return <text key={l} x={PL - 6} y={gy + 4} textAnchor="end" fill={MG}
                     fontSize="8.5" fontFamily="DM Sans,sans-serif">{l}</text>
      })}
    </svg>
  )
}

/* 3 — ISYS Maturity Ladder */
function MaturityLadder() {
  const steps = [
    { level: '01', label: 'Reaktif',    sub: 'Yalnızca olaydan sonra',  color: '#CBD5E1' },
    { level: '02', label: 'Farkındalık', sub: 'Riskler tanımlandı',     color: R_Y },
    { level: '03', label: 'Tanımlı',    sub: 'Süreçler belgelendi',      color: R_O },
    { level: '04', label: 'Yönetilen',  sub: 'Ölçülen & izlenen',        color: '#6ABFB8' },
    { level: '05', label: 'Optimize',   sub: 'Sürekli iyileştirme',      color: T },
  ]
  const W = 260, stepH = 52, totalH = steps.length * stepH + 32
  return (
    <svg viewBox={`0 0 ${W} ${totalH}`} style={{ width: '100%', maxWidth: 280, display: 'block' }}>
      <text x={W / 2} y="16" textAnchor="middle" fill={MG} fontSize="9" fontWeight="700"
            fontFamily="DM Sans,sans-serif" letterSpacing="1">İSYS OLGUNLUK MODELİ</text>
      {steps.map((s, i) => {
        const rev  = steps.length - 1 - i        // top = highest
        const y    = 24 + rev * stepH
        const wide = 120 + rev * 24              // wider at top
        const x    = (W - wide) / 2
        const hi   = i === 3 || i === 4           // highlight omniverSEL band
        return (
          <g key={i}>
            <rect x={x} y={y} width={wide} height={stepH - 6} rx="5"
                  fill={hi ? `${s.color}25` : '#F8FAFA'} stroke={s.color} strokeWidth={hi ? 2 : 1}/>
            <text x={x + 10} y={y + 17} fill={s.color} fontSize="9" fontWeight="700"
                  fontFamily="DM Mono,monospace">{s.level}</text>
            <text x={x + 10} y={y + 31} fill={N} fontSize="11" fontWeight="700"
                  fontFamily="DM Sans,sans-serif">{s.label}</text>
            <text x={x + 10} y={y + 43} fill={MG} fontSize="9"
                  fontFamily="DM Sans,sans-serif">{s.sub}</text>
            {hi && <text x={x + wide - 6} y={y + 24} textAnchor="end" fill={T} fontSize="8"
                          fontWeight="700" fontFamily="DM Sans,sans-serif">◀ OMNI</text>}
          </g>
        )
      })}
    </svg>
  )
}

/* 4 — Risk Tolerance Matrix 5×5 */
function RiskMatrix() {
  const COLS = 5, ROWS = 5
  const cellColors: string[][] = [
    [R_G, R_G, R_G, R_Y, R_Y],
    [R_G, R_G, R_Y, R_Y, R_O],
    [R_G, R_Y, R_Y, R_O, R_O],
    [R_Y, R_Y, R_O, R_R, R_R],
    [R_Y, R_O, R_R, R_R, R_R],
  ]
  // Sample sector dots [col, row, label]
  const dots: [number, number, string][] = [
    [3, 0, 'Banka'],
    [4, 1, 'Hastane'],
    [2, 2, 'Sanayi'],
    [1, 3, 'Okul'],
    [3, 3, 'Altyapı'],
  ]
  const cs = 44, ml = 36, mt = 8
  const W = ml + COLS * cs + 16, H = mt + ROWS * cs + 36
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 300, display: 'block' }}>
      {cellColors.map((row, ri) =>
        row.map((color, ci) => {
          const x = ml + ci * cs, y = mt + ri * cs
          return (
            <rect key={`${ri}-${ci}`} x={x + 1} y={y + 1} width={cs - 2} height={cs - 2}
                  fill={`${color}22`} stroke={`${color}50`} strokeWidth="1" rx="2"/>
          )
        })
      )}
      {dots.map(([ci, ri, label], i) => {
        const x = ml + ci * cs + cs / 2, y = mt + ri * cs + cs / 2
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="9" fill={N} stroke={BG} strokeWidth="1.5"/>
            <text x={x} y={y + 4} textAnchor="middle" fill={BG} fontSize="7"
                  fontWeight="700" fontFamily="DM Sans,sans-serif">{label.slice(0,3)}</text>
          </g>
        )
      })}
      {/* Axis labels */}
      {['1','2','3','4','5'].map((l, i) => (
        <g key={l}>
          <text x={ml + i * cs + cs / 2} y={mt + ROWS * cs + 16} textAnchor="middle"
                fill={MG} fontSize="9" fontFamily="DM Sans,sans-serif">{l}</text>
          <text x={ml - 6} y={mt + (ROWS - 1 - i) * cs + cs / 2 + 4} textAnchor="end"
                fill={MG} fontSize="9" fontFamily="DM Sans,sans-serif">{l}</text>
        </g>
      ))}
      <text x={ml + (COLS * cs) / 2} y={H - 4} textAnchor="middle" fill={MG} fontSize="9"
            fontWeight="600" fontFamily="DM Sans,sans-serif">Olasılık →</text>
      <text x="8" y={mt + (ROWS * cs) / 2} textAnchor="middle" fill={MG} fontSize="9"
            fontWeight="600" transform={`rotate(-90,8,${mt + (ROWS * cs) / 2})`}
            fontFamily="DM Sans,sans-serif">Etki</text>
    </svg>
  )
}

/* ── StatItem ─────────────────────────────────────────────────── */
function StatItem({ target, suffix, label, go }: { target: number; suffix: string; label: string; go: boolean }) {
  const n = useCounter(target, 2000, go)
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 'clamp(40px, 5vw, 58px)', fontWeight: 700, color: T,
                    lineHeight: 1, fontFamily: 'DM Mono,monospace' }}>
        {n}{suffix}
      </div>
      <div style={{ color: N, fontSize: 14, marginTop: 8, fontWeight: 600 }}>{label}</div>
    </div>
  )
}

/* ── LiveMetric ───────────────────────────────────────────────── */
function LiveMetric({ target, suffix, label, sub, go }: {
  target: number; suffix: string; label: string; sub: string; go: boolean
}) {
  const n = useCounter(target, 2000, go)
  return (
    <div style={{ textAlign: 'center', padding: '0 8px' }}>
      <div style={{ fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 700, color: BG,
                    lineHeight: 1, fontFamily: 'DM Mono,monospace' }}>
        {n}{suffix}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.88)', fontSize: 15, fontWeight: 600, marginTop: 8 }}>{label}</div>
      <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 4 }}>{sub}</div>
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
  const [metrics, setMetrics] = useState({ tesis: 782, kritik: 103, mahalle: 10, sektor: 6 })
  const screenW  = useWindowWidth()
  const isMobile = screenW > 0 && screenW < 768
  const isTablet = screenW > 0 && screenW < 1024

  const statsSection    = useInView(0.1)
  const productsSection = useInView(0.15)
  const bcmSection      = useInView(0.2)
  const testiSection    = useInView(0.15)
  const metricsSection  = useInView(0.2)
  const caseSection     = useInView(0.15)
  const resourceSection = useInView(0.15)
  const howSection      = useInView(0.2)

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

  const PLATFORM_ITEMS = [
    { code: 'omniRISK',   color: T,         href: '/products/omnirisk',   desc: 'Risk sicili & HFER skoru'       },
    { code: 'omniIMPACT', color: '#C8A84A', href: '/products/omniimpact', desc: 'İş Etki Analizi & BIA'          },
    { code: 'omniPLAN',   color: '#3B7EC8', href: '/products/omniplan',   desc: 'BCM planı & RTO/RPO takibi'     },
    { code: 'omniCRISIS', color: R_O,       href: '/products/omnicrisis', desc: 'Kriz komuta merkezi'            },
    { code: 'omniAUDIT',  color: R_G,       href: '#',                    desc: 'Uyum denetimi & Sendai izleme'  },
    { code: 'omniVENDOR', color: '#6366F1', href: '#',                    desc: 'Tedarik zinciri riski'          },
  ]
  const SEKTOR_ITEMS = [
    { name: 'Bankacılık & Finans',  color: T },
    { name: 'Sağlık & Hastane',     color: R_R },
    { name: 'Sanayi & Üretim',      color: R_O },
    { name: 'Eğitim Kurumları',     color: '#3B7EC8' },
    { name: 'Kamu & Belediye',      color: T },
    { name: 'Kritik Altyapı',       color: R_Y },
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
        .nav-link{color:${N};font-size:14px;font-weight:500;transition:color .18s;cursor:pointer;position:relative}
        .nav-link:hover{color:${T}}
        .btn-teal{display:inline-block;background:${T};color:#fff;font-weight:700;font-size:14px;
          padding:11px 28px;border-radius:6px;transition:opacity .18s,transform .12s;cursor:pointer;border:none;font-family:'DM Sans',sans-serif}
        .btn-teal:hover{opacity:.88;transform:translateY(-1px)}
        .btn-outline{display:inline-block;border:1.5px solid ${T};color:${T};font-weight:600;font-size:14px;
          padding:10px 28px;border-radius:6px;transition:border-color .18s,background .18s;cursor:pointer;font-family:'DM Sans',sans-serif}
        .btn-outline:hover{background:${T}0d}
        .card{background:${BG};border-radius:16px;border:1px solid ${BORDER};padding:36px 32px;
          transition:box-shadow .2s,transform .2s}
        .card:hover{box-shadow:0 8px 32px rgba(45,138,135,.1);transform:translateY(-3px)}
        .product-tag{display:inline-block;font-size:11px;font-weight:700;letter-spacing:1.5px;
          text-transform:uppercase;padding:4px 12px;border-radius:20px;margin-bottom:18px}
        .mega-wrap{position:relative}
        .mega-panel{position:absolute;top:calc(100% + 12px);left:50%;transform:translateX(-50%);
          background:${BG};border-radius:16px;border:1px solid ${BORDER};
          box-shadow:0 16px 48px rgba(10,22,40,.1);padding:20px;min-width:420px;z-index:300}
        .mega-panel-sm{min-width:260px}
        /* mobile menu overlay */
        .mob-overlay{position:fixed;inset:0;background:rgba(10,22,40,.55);z-index:198;backdrop-filter:blur(4px)}
        .mob-menu{position:fixed;top:68px;left:0;right:0;background:${BG};z-index:199;
          border-bottom:1px solid ${BORDER};box-shadow:0 8px 32px rgba(10,22,40,.12);
          padding:20px 20px 28px;display:flex;flex-direction:column;gap:4px;
          animation:fadeIn .18s ease both}
        .mob-menu a,.mob-menu span{display:block;padding:12px 14px;border-radius:8px;
          font-size:15px;font-weight:600;color:${N};transition:background .15s;cursor:pointer}
        .mob-menu a:hover,.mob-menu span:hover{background:${GR}}
        .mob-sep{height:1px;background:${BORDER};margin:8px 0}
        .mob-cta{display:block;background:${T};color:#fff !important;font-weight:700 !important;
          font-size:14px;padding:13px 20px !important;border-radius:6px;text-align:center;margin-top:8px}
      `}</style>

      {/* ══ NAV ══════════════════════════════════════════════════ */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 68,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${BORDER}` : '1px solid transparent',
        boxShadow: scrolled ? '0 2px 16px rgba(10,22,40,.07)' : 'none',
        transition: 'all .25s',
        display: 'flex', alignItems: 'center', padding: isMobile ? '0 20px' : '0 48px',
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
            <span style={{ color: N, fontSize: 18, fontWeight: 700, letterSpacing: 0.5 }}>
              omni<span style={{ color: T }}>versel</span>
            </span>
          </div>

          {/* Desktop nav */}
          <nav style={{ display: isMobile ? 'none' : 'flex', gap: 32, alignItems: 'center' }}>

            {/* Platform megamenu */}
            <div className="mega-wrap"
                 onMouseEnter={() => setMegaOpen('platform')}
                 onMouseLeave={() => setMegaOpen(null)}>
              <span className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                Platform
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 5l3 3 3-3" stroke={MG} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
                  <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: 14, paddingTop: 12 }}>
                    <Link href="/hub" style={{ display: 'flex', alignItems: 'center', gap: 8,
                                               fontSize: 13, fontWeight: 600, color: T, padding: '4px 12px' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                        <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                      </svg>
                      Platform Hub&apos;ı Aç →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <a href="#bcm" className="nav-link">BCM Döngüsü</a>

            {/* Sektörler megamenu */}
            <div className="mega-wrap"
                 onMouseEnter={() => setMegaOpen('sektor')}
                 onMouseLeave={() => setMegaOpen(null)}>
              <span className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                Sektörler
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 5l3 3 3-3" stroke={MG} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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

            <Link href="/hakkimizda" className="nav-link">Hakkımızda</Link>
            <Link href="/login" style={{ background: T, color: '#fff', fontWeight: 700, fontSize: 14,
                                          padding: '10px 24px', borderRadius: 6, display: 'inline-block',
                                          transition: 'opacity .18s' }}>Demo Talep</Link>
          </nav>

          {/* Hamburger — mobile only */}
          {isMobile && (
            <button onClick={() => setMenuOpen(o => !o)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px',
                       display: 'flex', alignItems: 'center', justifyContent: 'center',
                       color: N, fontSize: 22, lineHeight: 1 }}>
              {menuOpen ? '✕' : '☰'}
            </button>
          )}
        </div>
      </header>

      {/* Mobile menu */}
      {isMobile && menuOpen && (
        <>
          <div className="mob-overlay" onClick={() => setMenuOpen(false)}/>
          <div className="mob-menu">
            <Link href="/hub" onClick={() => setMenuOpen(false)}>Platform Hub</Link>
            <div className="mob-sep"/>
            <p style={{ fontSize: 10, fontWeight: 700, color: MG, letterSpacing: 2, textTransform: 'uppercase', padding: '4px 14px 2px' }}>Modüller</p>
            {PLATFORM_ITEMS.map(item => (
              <Link key={item.code} href={item.href} onClick={() => setMenuOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, fontSize: 14, color: N }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: item.color, flexShrink: 0 }}/>
                <span>{item.code}</span>
              </Link>
            ))}
            <div className="mob-sep"/>
            <a href="#bcm" onClick={() => setMenuOpen(false)}>BCM Döngüsü</a>
            <a href="#sectors-detail" onClick={() => setMenuOpen(false)}>Sektörler</a>
            <Link href="/hakkimizda" onClick={() => setMenuOpen(false)}>Hakkımızda</Link>
            <Link href="/login" className="mob-cta" onClick={() => setMenuOpen(false)}>Demo Talep</Link>
          </div>
        </>
      )}

      {/* ══ HERO ═════════════════════════════════════════════════ */}
      <section style={{ padding: isMobile ? '100px 20px 60px' : '140px 48px 100px', background: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto',
                      display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                      gap: isMobile ? 36 : 72, alignItems: 'center' }}>
          {/* left */}
          <div style={{ animation: 'fadeUp .7s ease both' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
                          background: `${T}12`, border: `1px solid ${T}30`,
                          borderRadius: 20, padding: '5px 14px', marginBottom: 28 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: T,
                              display: 'inline-block' }}/>
              <span style={{ color: T, fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>
                omniRISK modeli Aktif · ISO 22301 · ISO 31000 · ISO 22316
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(30px, 3.8vw, 54px)', fontWeight: 700,
                         lineHeight: 1.1, color: N, marginBottom: 24 }}>
              Afetlerde Dayanıklılık, Risk Yönetimi<br/>
              <span style={{ color: T }}>ve İş Sürekliliği</span>
            </h1>

            <p style={{ color: MG, fontSize: 16, lineHeight: 1.85,
                        maxWidth: 540, marginBottom: 40, fontWeight: 400 }}>
              Değişken, belirsiz, karmaşık ve muğlak (VUCA) risk ortamında; kentsel tesis ağlarının
              nicel dayanıklılık değerlendirmesi, İş Sürekliliği Yönetimi (ISO 22301) ve
              gerçek zamanlı Olay Komuta desteği için bütünleşik analitik platform.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40,
                          flexDirection: isMobile ? 'column' : 'row' }}>
              <Link href="/login" className="btn-teal" style={{ fontSize: 15, padding: '13px 32px',
                textAlign: 'center' }}>
                Ücretsiz Demo
              </Link>
              <a href="#products" className="btn-outline" style={{ fontSize: 15, padding: '12px 32px',
                textAlign: 'center' }}>
                Modülleri İncele
              </a>
            </div>

            {/* trust badges */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['ISO 22301', 'ISO 31000', 'ISO 22316', 'UNDRR Sendai', 'AFAD'].map(b => (
                <span key={b} style={{ background: `${T}10`, color: T, fontSize: 10,
                                        fontWeight: 700, letterSpacing: 0.8, padding: '5px 12px',
                                        borderRadius: 20, border: `1px solid ${T}25` }}>{b}</span>
              ))}
            </div>
          </div>

          {/* right: 2×2 infographic cards */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16,
                        animation: 'fadeIn .9s ease .2s both' }}>
            <RiskGaugeCard />
            <PendulumCard />
            <ChecklistCard />
            <KpiCard />
          </div>
        </div>
      </section>

      {/* ══ LOGO BAND ════════════════════════════════════════════ */}
      <section style={{ background: GR, padding: isMobile ? '28px 20px' : '48px 48px',
                        borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', color: '#B5C4C3', fontSize: 12,
                      letterSpacing: 3, textTransform: 'uppercase', marginBottom: 36 }}>
            Güvenilen Kurumlar
          </p>
          <LogoBand />
        </div>
      </section>

      {/* ══ PROBLEM TANIMI ═══════════════════════════════════════ */}
      <section style={{ padding: isMobile ? '60px 20px' : '100px 48px', background: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                        gap: isMobile ? 32 : 72, alignItems: 'center' }}>
            {/* Left: VUCA Matrix */}
            <div>
              <VucaMatrix />
            </div>
            {/* Right: text */}
            <div>
              <p style={{ color: R_R, fontSize: 12, fontWeight: 700, letterSpacing: 3,
                          textTransform: 'uppercase', marginBottom: 14 }}>
                Problem Tanımı
              </p>
              <h2 style={{ color: N, fontSize: 'clamp(24px, 3.2vw, 36px)', fontWeight: 700,
                            lineHeight: 1.2, marginBottom: 24 }}>
                VUCA Ortamında Geleneksel Acil Durum Planlarının Yetersizliği
              </h2>
              <div style={{ background: `${R_Y}10`, border: `1px solid ${R_Y}30`,
                             borderLeft: `4px solid ${R_Y}`, borderRadius: 8,
                             padding: '16px 20px', marginBottom: 24 }}>
                <p style={{ color: N, fontSize: 13, lineHeight: 1.75, fontWeight: 500 }}>
                  <strong style={{ color: R_O }}>WEF Küresel Riskler Raporu 2025:</strong>{' '}
                  Dünya Ekonomik Forumu&apos;na göre, doğal afetler ve iklim değişikliği kaynaklı
                  riskler ilk beş küresel risk arasında yer almaktadır. Kurumsal hazırlıksızlık,
                  operasyonel kesintilerin ekonomik maliyetini katlanarak artırmaktadır.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  {
                    icon: R_R,
                    title: 'NATECH Kaskad Etkileri',
                    desc: 'Doğa Kaynaklı Teknolojik Kaza (NATECH) senaryolarında kaskad etkiler, izole hazırlanan planları geçersiz kılmaktadır. Bağımlılık analizi yapılmaksızın üretilen İSP\'ler, gerçek kesinti koşullarında işlevselliğini yitirmektedir.',
                  },
                  {
                    icon: R_O,
                    title: 'Silolu Planlama Yaklaşımı',
                    desc: 'Kurumlar arası bağımlılıklar göz ardı edilerek hazırlanan tekil İş Sürekliliği Planları (İSP), sistem genelinde domino etkisiyle yayılan arızaları önleyememektedir.',
                  },
                  {
                    icon: R_Y,
                    title: 'Nicel Değerlendirme Eksikliği',
                    desc: 'Nitel risk tanımlamalarından üretilen öncelik sıralamaları, kaynak tahsisinde veri odaklı karar desteği sağlayamamakta; ALARP ilkesiyle uyumlu risk müdahale hiyerarşisi kurulamamaktadır.',
                  },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.icon,
                                   flexShrink: 0, marginTop: 6 }}/>
                    <div>
                      <div style={{ color: N, fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{item.title}</div>
                      <p style={{ color: MG, fontSize: 13, lineHeight: 1.7 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ═════════════════════════════════════════ */}
      <section ref={howSection.ref} style={{ padding: isMobile ? '60px 20px' : '100px 48px', background: GR }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <SectionLabel text="Metodoloji" />
            <SectionTitle>Dört Aşamalı İSYS Uygulama Süreci</SectionTitle>
            <p style={{ color: MG, fontSize: 16, maxWidth: 600, margin: '0 auto' }}>
              Platform; tesis kırılganlık envanterinden nicel Afet Risk Yönetimi değerlendirmesine,
              oradan ISO 22301 uyumlu İş Sürekliliği Yönetim Sistemi (İSYS) kurulumuna uzanan sistematik iş akışını destekler.
            </p>
          </div>
          <div style={{ display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
                        gap: 24 }}>
            {[
              { num: '01', title: 'Tesis Kırılganlık ve Maruziyet Değerlendirmesi', desc: 'CBS tabanlı coğrafi veri katmanları, tehlike haritaları, yapısal ve yapısal olmayan envanter standart veri modeliyle sisteme aktarılarak tesis bazlı kırılganlık ve maruziyet profili oluşturulur.', color: T },
              { num: '02', title: 'omniRISK Risk Değerlendirmesi (ISO 31000)', desc: 'omniRISK modeli; tehlike (H), kırılganlık (F), maruziyet (E) ve kapasite (C) parametrelerini ISO 31000 çerçevesinde işleyerek tesis bazlı URI (Unified Risk Index) skoru üretir.', color: R_Y },
              { num: '03', title: 'İş Sürekliliği Planı (İSP) Geliştirme (ISO 22301)', desc: 'Kritiklik sıralaması, İş Etki Analizi (BIA), MTD/RTO/RPO hedef belirleme ve İSP dokümantasyonu ISO 22301 Madde 8 çerçevesinde yönetilir.', color: R_O },
              { num: '04', title: 'İSYS Performans İzleme ve Uyum Raporlaması', desc: 'Gerçek zamanlı gösterge paneli, ISO 22301 Madde 9 kapsamında İSYS performans ölçümü, iç denetim kaydı ve Sendai Çerçevesi uyum skoru sistematik olarak izlenir ve raporlanır.', color: R_R },
            ].map((step, i) => (
              <div key={i} style={{
                opacity: howSection.inView ? 1 : 0,
                transform: howSection.inView ? 'translateY(0)' : 'translateY(24px)',
                transition: `all .55s ease ${i * .1}s`,
                background: BG, border: `1px solid ${BORDER}`, borderLeft: `4px solid ${step.color}`,
                borderRadius: 12, padding: '28px 24px',
              }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: `${step.color}30`,
                               fontFamily: 'DM Mono,monospace', lineHeight: 1, marginBottom: 12 }}>{step.num}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: N, marginBottom: 10 }}>{step.title}</div>
                <p style={{ color: MG, fontSize: 13, lineHeight: 1.75 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRODUCTS ═════════════════════════════════════════════ */}
      <section id="products" ref={productsSection.ref} style={{ padding: isMobile ? '60px 20px' : '100px 48px', background: GR }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <SectionLabel text="Modüler Platform" />
            <SectionTitle>İSYS Yaşam Döngüsünün Her Aşaması İçin Modül</SectionTitle>
            <p style={{ color: MG, fontSize: 16, maxWidth: 640, margin: '0 auto' }}>
              ISO 22301, ISO 31000 ve ISO 22316 ile uyumlu altı modül; İş Sürekliliği Yönetim Sistemi
              (İSYS) kurulum, işletim ve sürekli iyileştirme döngüsünü uçtan uca destekler.
            </p>
          </div>
          {/* İSYS Maturity Ladder */}
          <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: isMobile ? 24 : 48, marginBottom: 48,
                        background: BG, border: `1px solid ${BORDER}`, borderRadius: 16,
                        padding: isMobile ? '24px 20px' : '32px 40px' }}>
            <div style={{ flexShrink: 0 }}>
              <MaturityLadder />
            </div>
            <div>
              <p style={{ color: T, fontSize: 11, fontWeight: 700, letterSpacing: 2,
                          textTransform: 'uppercase', marginBottom: 10 }}>İSYS Olgunluk Modeli</p>
              <h3 style={{ color: N, fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
                Omniversel Kullanıcıları 4–5 Olgunluk Bandında Konumlanmaktadır
              </h3>
              <p style={{ color: MG, fontSize: 14, lineHeight: 1.8, maxWidth: 520 }}>
                BCMMetrics ve Fusion RM yaklaşımlarıyla uyumlu bu model, kurumunuzun mevcut İSYS
                olgunluk seviyesini ölçer ve Optimize (Seviye 5) bandına ulaşma yolunu sistematik
                biçimde planlar. omniAUDIT modülü, periyodik olgunluk değerlendirmesini otomatik
                yürüterek sürekli iyileştirmeyi (ISO 22301 Md. 10) kanıtlanabilir kılar.
              </p>
            </div>
          </div>
          <div style={{ display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)',
                        gap: 24 }}>
            {products.map((p, i) => (
              <div key={i} className="card"
                   style={{
                     opacity: productsSection.inView ? 1 : 0,
                     transform: productsSection.inView ? 'translateY(0)' : 'translateY(24px)',
                     transition: `opacity .55s ease ${i*.08}s, transform .55s ease ${i*.08}s`,
                   }}>
                <div style={{ marginBottom: 20 }}>{p.icon}</div>
                <span className="product-tag"
                      style={{ background: `${p.color}14`, color: p.color }}>{p.code}</span>
                <div style={{ color: N, fontSize: 13, fontWeight: 600, lineHeight: 1.4,
                               marginBottom: 10 }}>{p.title}</div>
                <p style={{ color: MG, fontSize: 13, lineHeight: 1.75 }}>{p.desc}</p>
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

      {/* ══ HFER FORMULA ═════════════════════════════════════════ */}
      <section style={{ padding: isMobile ? '60px 20px' : '100px 48px', background: GR }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 20,
                        padding: isMobile ? '36px 20px' : '56px 64px', textAlign: 'center',
                        boxShadow: '0 4px 32px rgba(45,138,135,.08)' }}>
            <SectionLabel text="omniRISK — Sendai Çarpanı" />
            <h2 style={{ color: N, fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 700,
                          lineHeight: 1.2, marginBottom: 8 }}>
              Kapasite Yatırımının Üstel Dayanıklılık Getirisi
            </h2>
            <p style={{ color: T, fontSize: 13, fontWeight: 600, marginBottom: 20 }}>
              omniRISK Modeli — ALARP (As Low as is Reasonably Practicable) İlkesiyle Uyumlu
            </p>
            {/* Formula display */}
            <div style={{ background: `${N}06`, border: `1.5px solid ${T}30`, borderRadius: 14,
                          padding: '18px 24px', marginBottom: 28, display: 'inline-block' }}>
              <span style={{ fontSize: 20, fontWeight: 800, fontFamily: 'DM Mono,monospace', color: N, letterSpacing: 1 }}>
                omniRISK = (H × F × E) / (1 + k·C²)
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                          gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
              {[
                { sym: 'H', label: 'Tehlike',    color: R_R },
                { sym: 'F', label: 'Kırılganlık', color: R_O },
                { sym: 'E', label: 'Maruziyet',  color: R_Y },
                { sym: 'C', label: 'Kapasite',   color: R_G },
                { sym: 'k', label: 'Düzeltme',   color: T },
              ].map((f) => (
                <div key={f.sym} style={{ textAlign: 'center' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 12, background: `${f.color}14`,
                                 border: `2px solid ${f.color}30`, display: 'flex', alignItems: 'center',
                                 justifyContent: 'center', margin: '0 auto 6px' }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: f.color,
                                    fontFamily: 'DM Mono,monospace' }}>{f.sym}</span>
                  </div>
                  <span style={{ fontSize: 9, color: MG, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>{f.label}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: T, fontWeight: 600, marginBottom: 24,
                        background: `${T}10`, border: `1px solid ${T}25`, borderRadius: 8,
                        padding: '6px 16px', display: 'inline-block' }}>
              k: sektöre özgü düzeltme katsayısı
            </p>
            <p style={{ color: MG, fontSize: 15, lineHeight: 1.85, maxWidth: 620, margin: '0 auto 28px' }}>
              omniRISK formülündeki <strong style={{ color: N }}>C² (kapasite kare)</strong> terimi,
              ISO 31000 risk müdahale hiyerarşisiyle uyumlu olarak, kurumsal kapasite artışının
              <strong style={{ color: N }}> doğrusal olmayan (nonlinear) risk azaltma etkisini</strong>{' '}
              matematiksel olarak ifade etmektedir. Model; coğrafi, yapısal, operasyonel
              ve sosyal boyutları bütünleştirerek tek bir ölçülebilir URI skoru üretir.
            </p>
            {/* Capacity Effect Chart */}
            <div style={{ margin: '0 auto 28px', maxWidth: 480 }}>
              <CapacityChart />
            </div>
            <Link href="/products/omnirisk" style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                                                       color: T, fontSize: 14, fontWeight: 600,
                                                       border: `1.5px solid ${T}`, borderRadius: 6,
                                                       padding: '10px 24px', transition: 'background .18s' }}>
              Metodoloji Belgesi
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M7 3l4 4-4 4" stroke={T} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ SECTORS ══════════════════════════════════════════════ */}
      <section id="sectors-detail" style={{ padding: isMobile ? '60px 20px' : '100px 48px', background: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid',
                        gridTemplateColumns: isMobile || isTablet ? '1fr' : '1fr 2fr',
                        gap: isMobile ? 32 : 64, alignItems: 'start', marginBottom: 56 }}>
            <div>
              <SectionLabel text="Sektörel Çözümler" />
              <SectionTitle>Sektöre Özgü Afet Risk Yönetimi</SectionTitle>
              <p style={{ color: MG, fontSize: 15, lineHeight: 1.8, marginBottom: 28 }}>
                Her sektörün kendine özgü tehlike profili, kırılganlık yapısı ve yasal
                uyum gereksinimleri bulunmaktadır. Platform; Risk Toleransı Matrisini
                (ISO 31000) sektör kalibrasyonuyla uygular.
              </p>
              <RiskMatrix />
              <p style={{ color: MG, fontSize: 11, marginTop: 12, textAlign: 'center' }}>
                Sektör bazlı risk toleransı konumlandırması (Olasılık × Etki Matrisi)
              </p>
            </div>
            <div style={{ display: 'grid',
                          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', gap: 20 }}>
            {[
              { title: 'Bankacılık & Finans', desc: 'Operasyonel risk envanteri, İSYS kurulumu ve İSP geliştirme Basel III ve ISO 22301 uyum gereksinimleri doğrultusunda yürütülür.', standards: 'ISO 22301 · Basel III', iconBg: T },
              { title: 'Sağlık & Hastane',    desc: 'Kritik hasta hizmetleri sürekliliği, tıbbi altyapı kırılganlık değerlendirmesi ve Olay Komuta Sistemi (OKS) entegrasyonu sağlanır.', standards: 'ISO 22301 · Sendai SF-3', iconBg: R_R },
              { title: 'Sanayi & Üretim',     desc: 'NATECH kaskad senaryo analizi, tedarik zinciri kesintisi modellemesi ve ALARP ilkesiyle uyumlu risk müdahale planı üretilir.', standards: 'RAPID-N · ISO 31000', iconBg: R_O },
              { title: 'Eğitim Kurumları',    desc: 'Afet Risk Yönetimi (ARM) planları, tatbikat yönetimi ve Sendai SF-2 kapsamında okul dirençlilik değerlendirmesi yapılır.', standards: 'AFAD · Sendai SF-2', iconBg: '#3B7EC8' },
              { title: 'Kritik Altyapı',      desc: 'Enerji, su ve ulaşım sistemlerinde kademeli bozulma (N-1) analizi, bağımlılık haritalaması ve CIP standartlarına uyum sağlanır.', standards: 'CIP Standartları · ISO 22301', iconBg: R_Y },
              { title: 'Kamu & Belediye',     desc: 'Kentsel ölçekte Tesis Kırılganlık ve Maruziyet Değerlendirmesi ile Sendai Çerçevesi önceliklerine göre yatırım planlaması gerçekleştirilir.', standards: 'Sendai · omniRISK', iconBg: T },
              { title: 'Turizm & Konaklama',  desc: 'Misafir güvenliği protokolleri, tahliye planı ve sezon bazlı İSP geliştirme ISO 22301 ve NFPA 101 çerçevesinde yürütülür.', standards: 'ISO 22301 · NFPA 101', iconBg: '#7B5EA7' },
              { title: 'Lojistik & Tedarik',  desc: 'Kritik tedarikçi kırılganlık skorlaması, alternatif tedarik rotası planlaması ve ISO 28000 kapsamında tedarik zinciri dayanıklılığı değerlendirilir.', standards: 'ISO 28000 · ISO 22301', iconBg: '#2D8A87' },
            ].map((sector, i) => (
              <div key={i}
                   style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 16,
                             padding: '28px', cursor: 'default', transition: 'box-shadow .2s, transform .2s, border-color .2s' }}
                   onMouseEnter={e => {
                     (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px rgba(45,138,135,.12)`
                     ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'
                     ;(e.currentTarget as HTMLDivElement).style.borderColor = T
                   }}
                   onMouseLeave={e => {
                     (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                     ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
                     ;(e.currentTarget as HTMLDivElement).style.borderColor = BORDER
                   }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${sector.iconBg}14`,
                               border: `1px solid ${sector.iconBg}30`, display: 'flex', alignItems: 'center',
                               justifyContent: 'center', marginBottom: 16 }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', background: sector.iconBg }}/>
                </div>
                <div style={{ color: N, fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{sector.title}</div>
                <p style={{ color: MG, fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>{sector.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {sector.standards.split(' · ').map(std => (
                    <span key={std} style={{ background: `${sector.iconBg}12`, color: sector.iconBg,
                                              fontSize: 10, fontWeight: 600, padding: '3px 10px',
                                              borderRadius: 12, border: `1px solid ${sector.iconBg}25` }}>{std}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* ══ BCM CYCLE ════════════════════════════════════════════ */}
      <section id="bcm" ref={bcmSection.ref} style={{ padding: isMobile ? '60px 20px' : '100px 48px', background: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto',
                      display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                      gap: isMobile ? 32 : 80, alignItems: 'center' }}>
          <div style={{ opacity: bcmSection.inView ? 1 : 0, transform: bcmSection.inView ? 'scale(1)' : 'scale(0.93)', transition: 'all .8s ease' }}>
            <BcmCycle />
          </div>
          <div style={{ opacity: bcmSection.inView ? 1 : 0, transform: bcmSection.inView ? 'translateX(0)' : 'translateX(30px)', transition: 'all .7s ease .15s' }}>
            <SectionLabel text="İSYS Yaşam Döngüsü (ISO 22301)" />
            <SectionTitle>Kurumsal Dayanıklılık<br/>Yönetim Döngüsü</SectionTitle>
            <p style={{ color: MG, fontSize: 16, lineHeight: 1.8, marginBottom: 36 }}>
              omniRISK modeli, ISO 22301 ve ISO 22316 uyumlu yedi aşamalı İSYS döngüsünü
              sürekli besler. Afet Risk Yönetimi&apos;nden kurumsal yönetişime kadar her aşama
              platformda izlenir, güncellenir ve Sendai Çerçevesi hedefleriyle eşleştirilir.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { phase: 'Önleme',             desc: 'Afet Risk Yönetimi (ARM) — tehlike tespiti ve proaktif risk azaltma (ISO 31000)',           color: R_G },
                { phase: 'Hazırlıklı Olma',    desc: 'İSP geliştirme, personel eğitimi ve tatbikat yönetimi (ISO 22301 Md. 8)',                  color: '#4AA89E' },
                { phase: 'Zarar Azaltma',      desc: 'ALARP ilkesiyle uyumlu kayıp minimizasyonu ve yapısal güçlendirme yatırımları',             color: R_Y },
                { phase: 'Müdahale',           desc: 'Olay Komuta Sistemi (OKS) — gerçek zamanlı kriz koordinasyon merkezi',                     color: R_O },
                { phase: 'İyileştirme',        desc: 'Operasyon restorasyonu — RTO/RPO hedeflerine ulaşım ve İSP güncelleme döngüsü',             color: R_R },
                { phase: 'İzleme',             desc: 'İSYS performans ölçümü — KPI gösterge paneli ve iç denetim (ISO 22301 Md. 9)',              color: '#B05A00' },
                { phase: 'Yönetişim',          desc: 'Üst yönetim gözden geçirmesi, strateji güncelleme ve sürekli iyileştirme (ISO 22301 Md. 10)', color: N },
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
      <section id="sectors" ref={statsSection.ref} style={{ padding: isMobile ? '48px 20px' : '80px 48px', background: GR,
                                                              borderTop: `1px solid ${BORDER}`,
                                                              borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid',
                      gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
                      gap: isMobile ? 24 : 40, textAlign: 'center' }}>
          {[
            { target: 720, suffix: '+', label: 'Analiz Parametresi' },
            { target: 39,  suffix: '',  label: 'İlçe Kapsamı' },
            { target: 6,   suffix: '',  label: 'Sektör Desteği' },
            { target: 98,  suffix: '%', label: 'Platform Uptime' },
          ].map((s, i) => (
            <div key={i} style={{ opacity: statsSection.inView ? 1 : 0,
                                   transform: statsSection.inView ? 'translateY(0)' : 'translateY(20px)',
                                   transition: `all .6s ease ${i * .1}s` }}>
              <StatItem target={s.target} suffix={s.suffix} label={s.label} go={statsSection.inView} />
            </div>
          ))}
        </div>
      </section>

      {/* ══ CASE STUDIES ═════════════════════════════════════════ */}
      <section ref={caseSection.ref} style={{ padding: isMobile ? '60px 20px' : '100px 48px', background: GR }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <SectionLabel text="Vaka Çalışmaları" />
            <SectionTitle>Gerçek Projeler, Ölçülebilir Sonuçlar</SectionTitle>
            <p style={{ color: MG, fontSize: 16, maxWidth: 560, margin: '0 auto' }}>
              Uygulama projelerinden elde edilen nicel bulgular; platformun metodolojik
              geçerliliğini ve kurumsal etkinliğini belgelemektedir.
            </p>
          </div>
          <div style={{ display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)',
                        gap: 24 }}>
            {[
              {
                sektor: 'Kamu & Belediye', sektorRenk: T,
                baslik: 'Belediye ve Kamu Kurumları',
                aciklama: 'Büyük ölçekli kentsel yönetim birimlerinde omniRISK modeliyle tesis dayanıklılık envanterinin oluşturulması ve Sendai Çerçevesi öncelik entegrasyonu.',
                metrik: '782 Tesis', metrikAlt: '6 sektör · 10 mahalle · uygulama projesi',
                detay: ['103 yüksek riskli tesis belirlendi', 'NATECH tehlike-maruziyet haritası üretildi', 'Sendai uyum skoru başlangıçtan itibaren %47 artış'],
              },
              {
                sektor: 'Bankacılık & Finans', sektorRenk: '#3B7EC8',
                baslik: 'Bankacılık ve Finans Sektörü',
                aciklama: 'Çok şubeli finansal kuruluş ağında HFER skorlaması, operasyonel risk envanteri ve Basel III uyumlu iş sürekliliği planlaması.',
                metrik: '%34 Risk Azalma', metrikAlt: 'BCM tatbikatları sonrası ölçülen dirençlilik artışı',
                detay: ['Tüm şube ağı için HFER skoru hesaplandı', 'Kritik fonksiyonlar için RTO/RPO belirlendi', 'Basel III uyum raporu otomatik üretildi'],
              },
              {
                sektor: 'Sağlık & Hastane', sektorRenk: R_R,
                baslik: 'Sağlık Kuruluşları',
                aciklama: 'Kritik hasta hizmetleri sürekliliği, tıbbi altyapı kırılganlık değerlendirmesi ve Sendai SF-3 çerçevesinde ISO 22301 uyumlu BCP geliştirme.',
                metrik: '12 Sağlık Tesisi', metrikAlt: 'BCP planları ISO 22301 uygunluk değerlendirmesini tamamladı',
                detay: ['Tıbbi cihaz bağımlılık yapısı modellendi', 'Senaryo bazlı tahliye planları üretildi', 'Sendai SF-3 kapsamında yatırım önceliklendirmesi yapıldı'],
              },
            ].map((cs, i) => (
              <div key={i} className="card"
                   style={{ background: BG,
                             opacity: caseSection.inView ? 1 : 0,
                             transform: caseSection.inView ? 'translateY(0)' : 'translateY(24px)',
                             transition: `all .6s ease ${i * .12}s` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                               marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: `${cs.sektorRenk}14`,
                                 border: `1px solid ${cs.sektorRenk}30`, display: 'flex', alignItems: 'center',
                                 justifyContent: 'center' }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: cs.sektorRenk }}/>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 12,
                                  background: `${cs.sektorRenk}12`, color: cs.sektorRenk,
                                  border: `1px solid ${cs.sektorRenk}25` }}>
                    {cs.sektor}
                  </span>
                </div>
                <h3 style={{ color: N, fontWeight: 700, fontSize: 18, marginBottom: 10 }}>{cs.baslik}</h3>
                <p style={{ color: MG, fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>{cs.aciklama}</p>
                <div style={{ background: `${cs.sektorRenk}08`, border: `1px solid ${cs.sektorRenk}20`,
                               borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: cs.sektorRenk,
                                 fontFamily: 'DM Mono,monospace', lineHeight: 1 }}>{cs.metrik}</div>
                  <div style={{ fontSize: 12, color: MG, marginTop: 4 }}>{cs.metrikAlt}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                  {cs.detay.map((d, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: cs.sektorRenk, flexShrink: 0, marginTop: 6 }}/>
                      <span style={{ fontSize: 13, color: MG, lineHeight: 1.5 }}>{d}</span>
                    </div>
                  ))}
                </div>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 6, color: cs.sektorRenk, fontSize: 13, fontWeight: 600 }}>
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
      <section ref={resourceSection.ref} style={{ padding: isMobile ? '60px 20px' : '100px 48px', background: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <SectionLabel text="Kaynaklar & Blog" />
            <SectionTitle>Uzman İçerikler</SectionTitle>
            <p style={{ color: MG, fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
              BCM, risk yönetimi ve afet dayanıklılığı hakkında derinlemesine okumalar.
            </p>
          </div>
          <div style={{ display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)',
                        gap: 24 }}>
            {[
              { kategori: 'Metodoloji', kategorRenk: T, baslik: 'omniRISK: Yapay Zeka Destekli Risk Modeli',
                ozet: 'Tehlike, kırılganlık, kapasite ve maruziyet bileşenlerini tek bir URI skoruna nasıl dönüştürüyoruz?',
                okumaSuresi: '8 dk', tarih: 'Mart 2026' },
              { kategori: 'Kavram', kategorRenk: R_O, baslik: 'NATECH Nedir? Doğal Afet Kaynaklı Teknolojik Kazalar',
                ozet: 'Deprem, sel sonrasında sanayi tesislerinde tetiklenen ikincil kazalar ve RAPID-N metodolojisi.',
                okumaSuresi: '6 dk', tarih: 'Şubat 2026' },
              { kategori: 'Politika', kategorRenk: '#7B5EA7', baslik: 'Sendai Çerçevesi ve Türk Belediyeleri',
                ozet: '2015-2030 Sendai Çerçevesi\'nin 4 önceliğini ve belediyeler için pratik uygulama adımlarını keşfedin.',
                okumaSuresi: '10 dk', tarih: 'Ocak 2026' },
            ].map((r, i) => (
              <div key={i} style={{
                background: GR, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '28px',
                opacity: resourceSection.inView ? 1 : 0,
                transform: resourceSection.inView ? 'translateY(0)' : 'translateY(24px)',
                transition: `all .6s ease ${i * .12}s`,
                cursor: 'default',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 12,
                                  background: `${r.kategorRenk}14`, color: r.kategorRenk,
                                  border: `1px solid ${r.kategorRenk}25` }}>
                    {r.kategori}
                  </span>
                  <span style={{ fontSize: 11, color: MG }}>{r.okumaSuresi} okuma</span>
                </div>
                <h3 style={{ color: N, fontWeight: 700, fontSize: 16, lineHeight: 1.4, marginBottom: 12 }}>
                  {r.baslik}
                </h3>
                <p style={{ color: MG, fontSize: 13, lineHeight: 1.75, marginBottom: 24 }}>{r.ozet}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                               borderTop: `1px solid ${BORDER}`, paddingTop: 18 }}>
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
      <section id="about" ref={testiSection.ref} style={{ padding: isMobile ? '60px 20px' : '100px 48px', background: GR }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <SectionLabel text="Müşteri Yorumları" />
            <SectionTitle>Liderler Ne Diyor?</SectionTitle>
          </div>
          <div style={{ display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)',
                        gap: 24 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="card"
                   style={{ background: BG,
                             opacity: testiSection.inView ? 1 : 0,
                             transform: testiSection.inView ? 'translateY(0)' : 'translateY(24px)',
                             transition: `all .6s ease ${i * .12}s` }}>
                <svg width="28" height="22" viewBox="0 0 28 22" style={{ marginBottom: 18 }}>
                  <text x="0" y="22" fontSize="36" fill={T} opacity="0.3">&ldquo;</text>
                </svg>
                <p style={{ color: N, fontSize: 15, lineHeight: 1.8, fontStyle: 'italic',
                             marginBottom: 24, fontWeight: 400 }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12,
                               borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${T}18`,
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

      {/* ══ LIVE METRICS BAND ════════════════════════════════════ */}
      <section ref={metricsSection.ref} style={{ background: T, padding: isMobile ? '40px 20px' : '64px 48px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 700,
                      letterSpacing: 3, textTransform: 'uppercase', marginBottom: 44 }}>
            Canlı Platform Metrikleri · Supabase
          </p>
          <div style={{ display: 'grid',
                        gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
                        gap: isMobile ? 20 : 0 }}>
            {[
              { target: metrics.tesis,   suffix: '',  label: 'Tesis Analiz Edildi',  sub: 'omniRISK skoru hesaplı'  },
              { target: metrics.kritik,  suffix: '',  label: 'Kritik Risk Tespit',    sub: 'H_score ≥ 4 seviyesi'   },
              { target: metrics.mahalle, suffix: '',  label: 'Mahalle Haritalandı',   sub: 'CBS katmanı aktif'       },
              { target: metrics.sektor,  suffix: '',  label: 'Sektör Kapsandı',       sub: 'Çapraz sektör analizi'  },
            ].map((m, i) => (
              <div key={i} style={{
                opacity: metricsSection.inView ? 1 : 0,
                transform: metricsSection.inView ? 'translateY(0)' : 'translateY(20px)',
                transition: `all .6s ease ${i * .12}s`,
                borderLeft: !isMobile && i > 0 ? '1px solid rgba(255,255,255,0.2)' : 'none',
              }}>
                <LiveMetric {...m} go={metricsSection.inView} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════════ */}
      <section style={{ padding: isMobile ? '48px 20px' : '80px 48px', background: BG }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ background: N, borderRadius: 24, padding: isMobile ? '40px 24px' : '64px 56px', textAlign: 'center',
                        boxShadow: '0 8px 48px rgba(10,22,40,.12)' }}>
            <p style={{ color: T, fontSize: 12, fontWeight: 700, letterSpacing: 3,
                        textTransform: 'uppercase', marginBottom: 16 }}>Başlayın</p>
            <h2 style={{ color: BG, fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 700,
                          lineHeight: 1.12, marginBottom: 20 }}>
              İlk Adımı Atın
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 16, lineHeight: 1.75,
                         maxWidth: 480, margin: '0 auto 40px' }}>
              14 günlük ücretsiz deneme. Kurulum yok, kredi kartı gerekmez.
              BCM danışmanımız sizi arar, platform üzerinde birlikte ilerleriz.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/login" style={{ background: T, color: '#fff', fontWeight: 700, fontSize: 15,
                                            padding: '14px 40px', borderRadius: 8, display: 'inline-block',
                                            transition: 'opacity .18s' }}>
                Ücretsiz Başlayın
              </Link>
              <a href="mailto:info@omniversel.com" style={{ border: `1.5px solid rgba(255,255,255,0.2)`,
                                                             color: 'rgba(255,255,255,0.72)',
                                                             fontWeight: 600, fontSize: 15, padding: '13px 32px',
                                                             borderRadius: 8, display: 'inline-block',
                                                             transition: 'border-color .18s' }}>
                Bize Yazın
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════ */}
      <footer style={{ background: N, padding: isMobile ? '40px 20px 24px' : '64px 48px 36px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr 1fr' : isTablet ? 'repeat(2,1fr)' : '2fr 1fr 1fr 1fr',
                        gap: isMobile ? 32 : 48, marginBottom: isMobile ? 36 : 56 }}>
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
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.8, maxWidth: 260 }}>
                Yapay zeka destekli kurumsal dayanıklılık platformu.
                ISO 22301 · BCM · AFAD uyumlu.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                {['ISO 22301', 'BCM', 'KVKK'].map(b => (
                  <span key={b} style={{ background: `${T}25`, color: T, fontSize: 11,
                                          fontWeight: 600, letterSpacing: 1, padding: '4px 10px', borderRadius: 4 }}>{b}</span>
                ))}
              </div>
            </div>
            {[
              { title: 'Platform',  links: ['omniRISK','omniIMPACT','omniPLAN','omniCRISIS','omniAUDIT','omniVENDOR'], hrefs: ['#','#','#','#','#','#'] },
              { title: 'Şirket',    links: ['Hakkımızda','Blog','Kariyer','Basın','İletişim'], hrefs: ['/hakkimizda','#','#','#','#'] },
              { title: 'Destek',    links: ['Dokümantasyon','SSS','Güvenlik','KVKK','Kullanım Şartları'], hrefs: ['#','#','#','#','#'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 700,
                               letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>
                  {col.title}
                </div>
                {col.links.map((l, li) => (
                  <div key={l} style={{ marginBottom: 12 }}>
                    <a href={col.hrefs[li]} style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, transition: 'color .18s' }}
                       onMouseEnter={e => (e.currentTarget.style.color = BG)}
                       onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}>{l}</a>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 28,
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        flexWrap: 'wrap', gap: 16 }}>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
              © {new Date().getFullYear()} Omniversel Teknoloji A.Ş. Tüm hakları saklıdır.
            </span>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
              İTÜ AYM iş birliğiyle · Sendai 2015–2030 uyumlu
            </span>
          </div>
        </div>
      </footer>
      {menuOpen && <div style={{ display: 'none' }} onClick={() => setMenuOpen(false)}/>}
    </>
  )
}
