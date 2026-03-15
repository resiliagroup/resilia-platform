'use client'

import { useEffect, useRef, useState } from 'react'
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
   HERO INFOGRAPHIC CARDS
═══════════════════════════════════════════════════════════════ */

/* Card 1 — Risk Gauge */
function RiskGaugeCard() {
  const CX = 110, CY = 100, R = 72
  // arc helper
  const arc = (deg: number) => {
    const r = (deg * Math.PI) / 180
    return `${CX + R * Math.cos(r)},${CY + R * Math.sin(r)}`
  }
  // needle at ~130deg (medium-high risk)
  const needleDeg = 130
  const nr = (needleDeg * Math.PI) / 180
  return (
    <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 16,
                  padding: '20px', boxShadow: '0 2px 16px rgba(10,22,40,.07)', flex: 1 }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: MG, letterSpacing: 2,
                  textTransform: 'uppercase', marginBottom: 8 }}>Risk Skoru</p>
      <svg viewBox="0 0 220 120" width="100%" style={{ display: 'block' }}>
        {/* Background arc */}
        <path d={`M ${arc(180)} A ${R} ${R} 0 0 1 ${arc(0)}`}
              fill="none" stroke="#E8EDED" strokeWidth="14" strokeLinecap="round"/>
        {/* Green segment */}
        <path d={`M ${arc(180)} A ${R} ${R} 0 0 1 ${arc(240)}`}
              fill="none" stroke={R_G} strokeWidth="14" strokeLinecap="round"/>
        {/* Yellow segment */}
        <path d={`M ${arc(240)} A ${R} ${R} 0 0 1 ${arc(280)}`}
              fill="none" stroke={R_Y} strokeWidth="14" strokeLinecap="round" opacity="0.9"/>
        {/* Orange segment */}
        <path d={`M ${arc(280)} A ${R} ${R} 0 0 1 ${arc(320)}`}
              fill="none" stroke={R_O} strokeWidth="14" strokeLinecap="round" opacity="0.9"/>
        {/* Red segment */}
        <path d={`M ${arc(320)} A ${R} ${R} 0 0 1 ${arc(360)}`}
              fill="none" stroke={R_R} strokeWidth="14" strokeLinecap="round"/>
        {/* Needle */}
        <line x1={CX} y1={CY}
              x2={CX + (R - 14) * Math.cos(nr)} y2={CY + (R - 14) * Math.sin(nr)}
              stroke={N} strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx={CX} cy={CY} r="5" fill={N}/>
        <circle cx={CX} cy={CY} r="2.5" fill={BG}/>
        {/* Labels */}
        <text x="38" y="115" fill={R_G} fontSize="8" fontWeight="700">DÜŞÜK</text>
        <text x="170" y="115" fill={R_R} fontSize="8" fontWeight="700">KRİTİK</text>
        <text x={CX} y={CY - 20} textAnchor="middle" fill={N} fontSize="13" fontWeight="700">3.8</text>
      </svg>
    </div>
  )
}

/* Card 2 — Pendulum */
function PendulumCard() {
  const balls = [
    { x: 52, color: R_G, label: 'DÜŞ' },
    { x: 84, color: R_Y, label: 'ORTA' },
    { x: 116, color: R_O, label: 'YÜK' },
    { x: 148, color: R_R, label: 'KRİT' },
  ]
  return (
    <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 16,
                  padding: '20px', boxShadow: '0 2px 16px rgba(10,22,40,.07)', flex: 1 }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: MG, letterSpacing: 2,
                  textTransform: 'uppercase', marginBottom: 8 }}>Risk Dağılımı</p>
      <svg viewBox="0 0 200 110" width="100%" style={{ display: 'block' }}>
        <line x1="20" y1="12" x2="180" y2="12" stroke={BORDER} strokeWidth="2" strokeLinecap="round"/>
        {balls.map((b, i) => (
          <g key={i}>
            <line x1={b.x} y1="12" x2={b.x} y2="68" stroke={`${b.color}60`} strokeWidth="1.5"/>
            <circle cx={b.x} cy="76" r="14" fill={`${b.color}20`} stroke={b.color} strokeWidth="1.8"/>
            <text x={b.x} y="80" textAnchor="middle" fill={b.color} fontSize="7" fontWeight="700">{b.label}</text>
          </g>
        ))}
        <text x="100" y="105" textAnchor="middle" fill={MG} fontSize="8">Tehlike Seviyesi</text>
      </svg>
    </div>
  )
}

/* Card 3 — Checklist */
function ChecklistCard() {
  const items = [
    { text: 'Sendai Uyum Tamamlandı',  color: R_G, done: true  },
    { text: 'NATECH Analizi Beklemede', color: R_O, done: false },
    { text: 'BCP Güncelleme Gerekli',   color: R_R, done: false },
  ]
  return (
    <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 16,
                  padding: '20px', boxShadow: '0 2px 16px rgba(10,22,40,.07)', flex: 1 }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: MG, letterSpacing: 2,
                  textTransform: 'uppercase', marginBottom: 14 }}>Aksiyon Listesi</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" fill={`${item.color}18`} stroke={item.color} strokeWidth="1.5"/>
              {item.done && <polyline points="6,10 9,13 14,7" stroke={item.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>}
              {!item.done && <line x1="7" y1="10" x2="13" y2="10" stroke={item.color} strokeWidth="1.8" strokeLinecap="round"/>}
            </svg>
            <span style={{ fontSize: 11, color: item.done ? MG : N, fontWeight: item.done ? 400 : 600,
                            textDecoration: item.done ? 'line-through' : 'none', lineHeight: 1.4 }}>
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* Card 4 — KPI Counters */
function KpiCard() {
  const kpis = [
    { v: '782', l: 'Tesis', c: T },
    { v: '103', l: 'Kritik', c: R_R },
    { v: '%47', l: 'Sendai Uyum', c: R_Y },
  ]
  return (
    <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 16,
                  padding: '20px', boxShadow: '0 2px 16px rgba(10,22,40,.07)', flex: 1 }}>
      <p style={{ fontSize: 10, fontWeight: 700, color: MG, letterSpacing: 2,
                  textTransform: 'uppercase', marginBottom: 14 }}>Canlı Metrikler</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {kpis.map((k, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                  padding: '8px 10px', background: GR, borderRadius: 8 }}>
            <span style={{ fontSize: 11, color: MG, fontWeight: 500 }}>{k.l}</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: k.c, fontFamily: 'DM Mono,monospace', lineHeight: 1 }}>{k.v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Product icon SVGs ──────────────────────────────────────── */
function IconRisk({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="30" fill={`${T}14`} stroke={T} strokeWidth="1.5"/>
      <path d="M12 42 A22 22 0 0 1 52 42" stroke="#E8EDED" strokeWidth="5" strokeLinecap="round"/>
      <path d="M12 42 A22 22 0 0 1 37 15" stroke={T} strokeWidth="5" strokeLinecap="round"/>
      <line x1="32" y1="32" x2="22" y2="20" stroke={N} strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="32" cy="32" r="4" fill={N}/>
      <circle cx="32" cy="32" r="2" fill={BG}/>
    </svg>
  )
}

function IconImpact({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="30" fill={`${G}18`} stroke={G} strokeWidth="1.5"/>
      <rect x="12" y="38" width="8" height="12" rx="2" fill={G} opacity="0.4"/>
      <rect x="22" y="30" width="8" height="20" rx="2" fill={G} opacity="0.65"/>
      <rect x="32" y="22" width="8" height="28" rx="2" fill={G}/>
      <rect x="42" y="16" width="8" height="34" rx="2" fill={N}/>
      <polyline points="16,36 26,28 36,20 46,14" stroke={T} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconPlan({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="30" fill={`${T}14`} stroke={T} strokeWidth="1.5"/>
      <path d="M32 14 L46 19 L46 34 C46 42 32 50 32 50 C32 50 18 42 18 34 L18 19 Z"
            fill={T} fillOpacity="0.15" stroke={T} strokeWidth="2" strokeLinejoin="round"/>
      <polyline points="25,32 30,37 40,26" stroke={N} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconCrisis({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="30" fill={`${R_O}14`} stroke={R_O} strokeWidth="1.5"/>
      <polygon points="32,13 38,28 35,28 41,51 26,33 30,33" fill={R_O} fillOpacity="0.3" stroke={R_O} strokeWidth="1.2" strokeLinejoin="round"/>
      <circle cx="32" cy="32" r="21" fill="none" stroke={R_O} strokeWidth="1" strokeDasharray="3 4"/>
    </svg>
  )
}

function IconAudit({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="30" fill={`${R_G}14`} stroke={R_G} strokeWidth="1.5"/>
      <path d="M32 16 L43 21 L43 34 C43 40 32 47 32 47 C32 47 21 40 21 34 L21 21 Z"
            fill={R_G} fillOpacity="0.15" stroke={R_G} strokeWidth="1.8" strokeLinejoin="round"/>
      <polyline points="26,31 30,35 39,26" stroke={R_G} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconVendor({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="30" fill="rgba(99,102,241,0.08)" stroke="#6366F1" strokeWidth="1.5"/>
      <rect x="18" y="26" width="28" height="20" rx="3" fill="rgba(99,102,241,0.1)" stroke="#6366F1" strokeWidth="1.8"/>
      <path d="M23 26 L23 22 A9 9 0 0 1 41 22 L41 26" stroke="#6366F1" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <circle cx="26" cy="36" r="2.5" fill="#6366F1"/>
      <circle cx="32" cy="36" r="2.5" fill="#6366F1" fillOpacity="0.5"/>
      <circle cx="38" cy="36" r="2.5" fill="#6366F1" fillOpacity="0.25"/>
    </svg>
  )
}

/* ── BCM Cycle SVG — 7 segment ────────────────────────────────── */
function BcmCycle() {
  const STEP = 360 / 7
  const segments = [
    { label: 'Önleme',          color: R_G },
    { label: 'Hazırlıklı Olma', color: '#4AA89E' },
    { label: 'Zarar Azaltma',   color: R_Y },
    { label: 'Müdahale',        color: R_O },
    { label: 'İyileştirme',     color: R_R },
    { label: 'İzleme',          color: '#B05A00' },
    { label: 'Yönetişim',       color: N },
  ].map((s, i) => ({ ...s, angle: -90 + i * STEP }))
  const toXY = (deg: number, r: number) => ({
    x: 200 + r * Math.cos((deg * Math.PI) / 180),
    y: 200 + r * Math.sin((deg * Math.PI) / 180),
  })
  const HALF = STEP / 2 - 5
  return (
    <svg viewBox="0 0 400 400" style={{ width: '100%', maxWidth: 420 }}>
      <circle cx="200" cy="200" r="168" fill="none" stroke={BORDER} strokeWidth="1" strokeDasharray="6 6"/>
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
      <circle cx="200" cy="200" r="78" fill={BG} stroke={BORDER} strokeWidth="1"/>
      <circle cx="200" cy="200" r="72" fill="none" stroke={T} strokeWidth="1.5"/>
      <text x="200" y="194" textAnchor="middle" fill={T} fontSize="14"
            fontFamily="DM Sans,sans-serif" fontWeight="700" letterSpacing="1">HFER-720</text>
      <text x="200" y="211" textAnchor="middle" fill={MG} fontSize="9"
            fontFamily="DM Sans,sans-serif">BCM MOTOR</text>
    </svg>
  )
}

/* ── Logo band ──────────────────────────────────────────────── */
function LogoBand() {
  const logos = [
    { name: 'Bankacılık Sektörü',    width: 130 },
    { name: 'Sağlık Kuruluşları',    width: 120 },
    { name: 'Turizm Sektörü',        width: 110 },
    { name: 'Finans Sektörü',        width: 110 },
    { name: 'Kamu & Belediye',       width: 120 },
  ]
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 56, flexWrap: 'wrap' }}>
      {logos.map(l => (
        <svg key={l.name} width={l.width} height={36} viewBox={`0 0 ${l.width} 36`}>
          <text x={l.width / 2} y="22" textAnchor="middle" fill="#B5C4C3"
                fontSize="13" fontFamily="DM Sans,sans-serif" fontWeight="600" letterSpacing="0.5">{l.name}</text>
          <line x1="10" y1="28" x2={l.width - 10} y2="28" stroke={BORDER} strokeWidth="1"/>
        </svg>
      ))}
    </div>
  )
}

/* ── products ───────────────────────────────────────────────── */
const products = [
  { code: 'omniRISK',
    title: 'Çok Tehlikeli Risk Değerlendirme Motoru (ISO 31000)',
    color: T, href: '/products/omnirisk',
    desc: 'Tehlike (H), kırılganlık (F), maruziyet (E) ve kapasite (R) parametrelerini HFER-720 motoruyla bütünleştirerek tesis kırılganlık ve maruziyet değerlendirmesi gerçekleştiren, kurumsal risk envanterini gerçek zamanlı izleyen karar destek modülü.',
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
  { quote: 'HFER-720 metodolojisi risk envanterimizi yapılandırmamıza olanak sağladı; nicel değerlendirme süreci denetim etkinliğimizi ölçülebilir biçimde artırdı.',
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
    { x: 0,   y: 0,   w: 200, h: 160, label: 'KOMPLİKE', sub: 'Düşük belirsizlik\nYüksek karmaşıklık', fill: `${R_Y}18`, border: R_Y, tx: 100, ty: 70 },
    { x: 200, y: 0,   w: 200, h: 160, label: 'KAOTİK',   sub: 'VUCA Bölgesi\nOmniversel Çözüm Alanı', fill: `${R_R}20`, border: R_R, tx: 300, ty: 70 },
    { x: 0,   y: 160, w: 200, h: 160, label: 'BASİT',    sub: 'Düşük belirsizlik\nDüşük karmaşıklık',  fill: `${R_G}14`, border: R_G, tx: 100, ty: 230 },
    { x: 200, y: 160, w: 200, h: 160, label: 'KARMAŞIK',  sub: 'Yüksek belirsizlik\nDüşük karmaşıklık', fill: `${R_O}15`, border: R_O, tx: 300, ty: 230 },
  ]
  return (
    <svg viewBox="0 0 440 340" style={{ width: '100%', maxWidth: 480, display: 'block' }}>
      {/* Quadrants */}
      {quads.map((q, i) => (
        <g key={i}>
          <rect x={q.x + 2} y={q.y + 2} width={q.w - 4} height={q.h - 4}
                fill={q.fill} stroke={q.border} strokeWidth="1.5" rx="4"/>
          <text x={q.tx} y={q.ty - 12} textAnchor="middle" fill={N}
                fontSize="11" fontWeight="700" fontFamily="DM Sans,sans-serif">{q.label}</text>
          {q.sub.split('\n').map((line, j) => (
            <text key={j} x={q.tx} y={q.ty + 6 + j * 14} textAnchor="middle" fill={MG}
                  fontSize="9" fontFamily="DM Sans,sans-serif">{line}</text>
          ))}
        </g>
      ))}
      {/* VUCA highlight overlay top-right */}
      <rect x="202" y="2" width="196" height="156" fill="none" stroke={R_R} strokeWidth="2.5"
            strokeDasharray="6 3" rx="4"/>
      <text x="390" y="18" textAnchor="end" fill={R_R} fontSize="9" fontWeight="700"
            fontFamily="DM Sans,sans-serif">HEDEF ALAN</text>
      {/* Omniversel arrow */}
      <line x1="300" y1="140" x2="300" y2="90" stroke={T} strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#arr)"/>
      <text x="300" y="152" textAnchor="middle" fill={T} fontSize="8" fontWeight="700"
            fontFamily="DM Sans,sans-serif">omniRISK çözüm bandı</text>
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 Z" fill={T}/>
        </marker>
      </defs>
      {/* Axes */}
      <line x1="220" y1="0" x2="220" y2="320" stroke={BORDER} strokeWidth="1.5"/>
      <line x1="0" y1="160" x2="420" y2="160" stroke={BORDER} strokeWidth="1.5"/>
      {/* Axis labels */}
      <text x="210" y="334" textAnchor="middle" fill={MG} fontSize="10" fontWeight="600"
            fontFamily="DM Sans,sans-serif">← Düşük Belirsizlik · Yüksek Belirsizlik →</text>
      <text x="-160" y="12" transform="rotate(-90)" textAnchor="middle" fill={MG} fontSize="10"
            fontWeight="600" fontFamily="DM Sans,sans-serif">← Düşük Karmaşıklık · Yüksek →</text>
    </svg>
  )
}

/* 2 — Capacity Effect Chart (logarithmic / C² effect) */
function CapacityChart() {
  const W = 420, H = 220, PL = 56, PR = 24, PT = 20, PB = 48
  const cw = W - PL - PR, ch = H - PT - PB
  // C² eğrisi: X=0..1, Y = 1 - e^(-4x²)  → mapped to canvas
  const curve: string[] = []
  for (let i = 0; i <= 50; i++) {
    const t = i / 50            // 0..1
    const x = PL + t * cw
    const y = PT + ch - (1 - Math.exp(-5 * t * t)) * ch
    curve.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
  }
  // Linear reference: same X range, straight diagonal
  const linStart = `M${PL},${PT + ch}`
  const linEnd   = `L${PL + cw},${PT}`
  // ALARP band: y between 40% and 65% risk reduction
  const alarpY1 = PT + ch - 0.40 * ch
  const alarpY2 = PT + ch - 0.65 * ch
  // X axis labels
  const xLabels = ['1','2','3','4','5']
  // Y axis labels
  const yLabels = ['0%','25%','50%','75%','95%+']
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 480, display: 'block' }}>
      {/* ALARP band */}
      <rect x={PL} y={alarpY2} width={cw} height={alarpY1 - alarpY2}
            fill={`${R_Y}18`} stroke="none"/>
      <text x={PL + cw + 4} y={(alarpY1 + alarpY2) / 2 + 4} fill={R_Y} fontSize="8"
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
      <text x={PL + cw - 4} y={PT + 10} textAnchor="end" fill="#C0CDD8" fontSize="8"
            fontFamily="DM Sans,sans-serif">Doğrusal</text>
      {/* C² HFER curve */}
      <path d={curve.join(' ')} fill="none" stroke={T} strokeWidth="2.5" strokeLinecap="round"/>
      {/* C² annotation */}
      <text x={PL + cw * 0.62} y={PT + ch * 0.22} fill={T} fontSize="9" fontWeight="700"
            fontFamily="DM Sans,sans-serif">C² Etkisi ↑</text>
      {/* Axes */}
      <line x1={PL} y1={PT} x2={PL} y2={PT + ch} stroke={N} strokeWidth="1.5"/>
      <line x1={PL} y1={PT + ch} x2={PL + cw} y2={PT + ch} stroke={N} strokeWidth="1.5"/>
      {/* X labels */}
      {xLabels.map((l, i) => (
        <text key={l} x={PL + (i + 0.5) * cw / 5} y={PT + ch + 16} textAnchor="middle"
              fill={MG} fontSize="9" fontFamily="DM Sans,sans-serif">{l}</text>
      ))}
      <text x={PL + cw / 2} y={H - 4} textAnchor="middle" fill={MG} fontSize="9"
            fontWeight="600" fontFamily="DM Sans,sans-serif">Kapasite Yatırımı →</text>
      {/* Y labels */}
      {yLabels.map((l, i) => {
        const gy = PT + ch - (i / 4) * ch
        return <text key={l} x={PL - 6} y={gy + 4} textAnchor="end" fill={MG}
                     fontSize="8" fontFamily="DM Sans,sans-serif">{l}</text>
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
  const n = useCounter(target, 1600, go)
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
    <div style={{ textAlign: 'center', padding: '0 24px' }}>
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

  const statsSection    = useInView(0.3)
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
            <span style={{ color: N, fontSize: 18, fontWeight: 700, letterSpacing: 0.5 }}>
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
        </div>
      </header>

      {/* ══ HERO ═════════════════════════════════════════════════ */}
      <section style={{ padding: '140px 48px 100px', background: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto',
                      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
          {/* left */}
          <div style={{ animation: 'fadeUp .7s ease both' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
                          background: `${T}12`, border: `1px solid ${T}30`,
                          borderRadius: 20, padding: '5px 14px', marginBottom: 28 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: T,
                              display: 'inline-block' }}/>
              <span style={{ color: T, fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>
                HFER-720 Motor Aktif · ISO 22301 · ISO 31000 · ISO 22316
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(30px, 3.8vw, 54px)', fontWeight: 700,
                         lineHeight: 1.1, color: N, marginBottom: 24 }}>
              VUCA Dünyasında<br/>
              <span style={{ color: T }}>Kurumsal Dayanıklılık</span>
            </h1>

            <p style={{ color: MG, fontSize: 16, lineHeight: 1.85,
                        maxWidth: 540, marginBottom: 40, fontWeight: 400 }}>
              Değişken, belirsiz, karmaşık ve muğlak (VUCA) risk ortamında; kentsel tesis ağlarının
              nicel dayanıklılık değerlendirmesi, İş Sürekliliği Yönetimi (ISO 22301) ve
              gerçek zamanlı Olay Komuta desteği için bütünleşik analitik platform.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
              <Link href="/login" className="btn-teal" style={{ fontSize: 15, padding: '13px 32px' }}>
                Ücretsiz Demo
              </Link>
              <a href="#products" className="btn-outline" style={{ fontSize: 15, padding: '12px 32px' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
                        animation: 'fadeIn .9s ease .2s both' }}>
            <RiskGaugeCard />
            <PendulumCard />
            <ChecklistCard />
            <KpiCard />
          </div>
        </div>
      </section>

      {/* ══ LOGO BAND ════════════════════════════════════════════ */}
      <section style={{ background: GR, padding: '48px 48px',
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
      <section style={{ padding: '100px 48px', background: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>
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
                  <strong style={{ color: R_O }}>WEF Küresel Riskler Raporu 2023:</strong>{' '}
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
      <section ref={howSection.ref} style={{ padding: '100px 48px', background: GR }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <SectionLabel text="Metodoloji" />
            <SectionTitle>Dört Aşamalı İSYS Uygulama Süreci</SectionTitle>
            <p style={{ color: MG, fontSize: 16, maxWidth: 600, margin: '0 auto' }}>
              Platform; tesis kırılganlık envanterinden nicel Afet Risk Yönetimi değerlendirmesine,
              oradan ISO 22301 uyumlu İş Sürekliliği Yönetim Sistemi (İSYS) kurulumuna uzanan sistematik iş akışını destekler.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {[
              { num: '01', title: 'Tesis Kırılganlık ve Maruziyet Değerlendirmesi', desc: 'CBS tabanlı coğrafi veri katmanları, çok tehlikeli alan haritaları ve yapısal envanter standart veri modeliyle sisteme aktarılarak tesis bazlı kırılganlık ve maruziyet profili oluşturulur.', color: T },
              { num: '02', title: 'HFER-720 Risk Değerlendirmesi (ISO 31000)', desc: 'HFER-720 motoru; tehlike (H), kırılganlık, maruziyet ve kapasite parametrelerini ISO 31000 çerçevesinde işleyerek tesis bazlı URI (Unified Risk Index) skoru üretir.', color: R_Y },
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
      <section id="products" ref={productsSection.ref} style={{ padding: '100px 48px', background: GR }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 48, marginBottom: 48,
                        background: BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '32px 40px' }}>
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
      <section style={{ padding: '100px 48px', background: GR }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 20,
                        padding: '56px 64px', textAlign: 'center',
                        boxShadow: '0 4px 32px rgba(45,138,135,.08)' }}>
            <SectionLabel text="HFER-720 Motor — Sendai Çarpanı" />
            <h2 style={{ color: N, fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 700,
                          lineHeight: 1.2, marginBottom: 8 }}>
              Kapasite Yatırımının Üstel Dayanıklılık Getirisi
            </h2>
            <p style={{ color: T, fontSize: 13, fontWeight: 600, marginBottom: 28 }}>
              HFER-720 Modeli — ALARP (As Low as is Reasonably Practicable) İlkesiyle Uyumlu
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                          gap: 16, flexWrap: 'wrap', marginBottom: 36 }}>
              {[
                { sym: 'H', label: 'Tehlike',    color: R_R },
                { sym: '×', label: '',            color: MG },
                { sym: 'V', label: 'Kırılganlık', color: R_O },
                { sym: '×', label: '',            color: MG },
                { sym: 'E', label: 'Maruziyet',  color: R_Y },
                { sym: '/', label: '',            color: MG },
                { sym: 'C', label: 'Kapasite',   color: R_G },
                { sym: '=', label: '',            color: MG },
                { sym: 'URI', label: 'Risk Skoru', color: T },
              ].map((f, i) => (
                f.label === '' ? (
                  <span key={i} style={{ fontSize: 28, color: MG, fontWeight: 300 }}>{f.sym}</span>
                ) : (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ width: 52, height: 52, borderRadius: 12, background: `${f.color}14`,
                                   border: `2px solid ${f.color}30`, display: 'flex', alignItems: 'center',
                                   justifyContent: 'center', margin: '0 auto 6px' }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: f.color,
                                      fontFamily: 'DM Mono,monospace' }}>{f.sym}</span>
                    </div>
                    <span style={{ fontSize: 9, color: MG, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>{f.label}</span>
                  </div>
                )
              ))}
            </div>
            <p style={{ color: MG, fontSize: 15, lineHeight: 1.85, maxWidth: 620, margin: '0 auto 28px' }}>
              HFER-720 formülündeki <strong style={{ color: N }}>C² (kapasite kare)</strong> terimi,
              ISO 31000 risk müdahale hiyerarşisiyle uyumlu olarak, kurumsal kapasite artışının
              <strong style={{ color: N }}> doğrusal olmayan (nonlinear) risk azaltma etkisini</strong>{' '}
              matematiksel olarak ifade etmektedir. 720 parametre; coğrafi, yapısal, operasyonel
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
      <section id="sectors-detail" style={{ padding: '100px 48px', background: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64,
                        alignItems: 'start', marginBottom: 56 }}>
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {[
              { title: 'Bankacılık & Finans', desc: 'Operasyonel risk envanteri, İSYS kurulumu ve İSP geliştirme Basel III ve ISO 22301 uyum gereksinimleri doğrultusunda yürütülür.', standards: 'ISO 22301 · Basel III', iconBg: T },
              { title: 'Sağlık & Hastane',    desc: 'Kritik hasta hizmetleri sürekliliği, tıbbi altyapı kırılganlık değerlendirmesi ve Olay Komuta Sistemi (OKS) entegrasyonu sağlanır.', standards: 'ISO 22301 · Sendai SF-3', iconBg: R_R },
              { title: 'Sanayi & Üretim',     desc: 'NATECH kaskad senaryo analizi, tedarik zinciri kesintisi modellemesi ve ALARP ilkesiyle uyumlu risk müdahale planı üretilir.', standards: 'RAPID-N · ISO 31000', iconBg: R_O },
              { title: 'Eğitim Kurumları',    desc: 'Afet Risk Yönetimi (ARM) planları, tatbikat yönetimi ve Sendai SF-2 kapsamında okul dirençlilik değerlendirmesi yapılır.', standards: 'AFAD · Sendai SF-2', iconBg: '#3B7EC8' },
              { title: 'Kritik Altyapı',      desc: 'Enerji, su ve ulaşım sistemlerinde kademeli bozulma (N-1) analizi, bağımlılık haritalaması ve CIP standartlarına uyum sağlanır.', standards: 'CIP Standartları · ISO 22301', iconBg: R_Y },
              { title: 'Kamu & Belediye',     desc: 'Kentsel ölçekte Tesis Kırılganlık ve Maruziyet Değerlendirmesi ile Sendai Çerçevesi önceliklerine göre yatırım planlaması gerçekleştirilir.', standards: 'Sendai · HFER-720', iconBg: T },
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
      <section id="bcm" ref={bcmSection.ref} style={{ padding: '100px 48px', background: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto',
                      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div style={{ opacity: bcmSection.inView ? 1 : 0, transform: bcmSection.inView ? 'scale(1)' : 'scale(0.93)', transition: 'all .8s ease' }}>
            <BcmCycle />
          </div>
          <div style={{ opacity: bcmSection.inView ? 1 : 0, transform: bcmSection.inView ? 'translateX(0)' : 'translateX(30px)', transition: 'all .7s ease .15s' }}>
            <SectionLabel text="İSYS Yaşam Döngüsü (ISO 22301)" />
            <SectionTitle>Kurumsal Dayanıklılık<br/>Yönetim Döngüsü</SectionTitle>
            <p style={{ color: MG, fontSize: 16, lineHeight: 1.8, marginBottom: 36 }}>
              HFER-720 motoru, ISO 22301 ve ISO 22316 uyumlu yedi aşamalı İSYS döngüsünü
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
      <section id="sectors" ref={statsSection.ref} style={{ padding: '80px 48px', background: GR,
                                                              borderTop: `1px solid ${BORDER}`,
                                                              borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)', gap: 40, textAlign: 'center' }}>
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
      <section ref={caseSection.ref} style={{ padding: '100px 48px', background: GR }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <SectionLabel text="Vaka Çalışmaları" />
            <SectionTitle>Gerçek Projeler, Ölçülebilir Sonuçlar</SectionTitle>
            <p style={{ color: MG, fontSize: 16, maxWidth: 560, margin: '0 auto' }}>
              Uygulama projelerinden elde edilen nicel bulgular; platformun metodolojik
              geçerliliğini ve kurumsal etkinliğini belgelemektedir.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              {
                sektor: 'Kamu & Belediye', sektorRenk: T,
                baslik: 'Belediye ve Kamu Kurumları',
                aciklama: 'Büyük ölçekli kentsel yönetim birimlerinde HFER-720 metodolojisiyle tesis dayanıklılık envanterinin oluşturulması ve Sendai Çerçevesi öncelik entegrasyonu.',
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
              { kategori: 'Metodoloji', kategorRenk: T, baslik: 'HFER-720: 720 Parametreli Risk Modeli',
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
      <section id="about" ref={testiSection.ref} style={{ padding: '100px 48px', background: GR }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <SectionLabel text="Müşteri Yorumları" />
            <SectionTitle>Liderler Ne Diyor?</SectionTitle>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
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
      <section ref={metricsSection.ref} style={{ background: T, padding: '64px 48px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 700,
                      letterSpacing: 3, textTransform: 'uppercase', marginBottom: 44 }}>
            Canlı Platform Metrikleri · Supabase
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
            {[
              { target: metrics.tesis,   suffix: '',  label: 'Tesis Analiz Edildi',  sub: 'HFER-720 skoru hesaplı'  },
              { target: metrics.kritik,  suffix: '',  label: 'Kritik Risk Tespit',    sub: 'H_score ≥ 4 seviyesi'   },
              { target: metrics.mahalle, suffix: '',  label: 'Mahalle Haritalandı',   sub: 'CBS katmanı aktif'       },
              { target: metrics.sektor,  suffix: '',  label: 'Sektör Kapsandı',       sub: 'Çapraz sektör analizi'  },
            ].map((m, i) => (
              <div key={i} style={{
                opacity: metricsSection.inView ? 1 : 0,
                transform: metricsSection.inView ? 'translateY(0)' : 'translateY(20px)',
                transition: `all .6s ease ${i * .12}s`,
                borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.2)' : 'none',
              }}>
                <LiveMetric {...m} go={metricsSection.inView} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════════ */}
      <section style={{ padding: '80px 48px', background: BG }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ background: N, borderRadius: 24, padding: '64px 56px', textAlign: 'center',
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
      <footer style={{ background: N, padding: '64px 48px 36px' }}>
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
