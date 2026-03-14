'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

/* ─── tokens ─────────────────────────────────────────────────── */
const N  = '#0A1628'  // navy
const T  = '#6ABFB8'  // teal
const G  = '#E8C97A'  // gold
const GR = '#F7F8FA'  // light gray
const MG = '#8FA3B8'  // muted gray text
const BG = '#FFFFFF'  // white

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

/* Gauge / tachometer ─ Risk Yönetimi */
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

/* Bar chart rising ─ Etki Analizi */
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

/* Shield + check ─ Kurtarma Planı */
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

/* Lightning / alert ─ Kriz Yönetimi */
function IconCrisis({ size = 64 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="30" fill={GR} stroke="#E8A87C" strokeWidth="1.5"/>
      <polygon points="32,13 38,28 35,28 41,51 26,33 30,33" fill="#E8A87C" stroke={N} strokeWidth="1.2" strokeLinejoin="round"/>
      <circle cx="32" cy="32" r="21" fill="none" stroke="#E8A87C" strokeWidth="1" strokeDasharray="3 4"/>
    </svg>
  )
}

/* ── BCM Cycle SVG — 7 segment ────────────────────────────────── */
function BcmCycle() {
  // 7 segments, 360/7 ≈ 51.43° apart, starting at -90°
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
  const HALF = STEP / 2 - 5   // ≈20.7° half-span, ~10° gap between segments

  return (
    <svg viewBox="0 0 400 400" style={{ width: '100%', maxWidth: 420 }}>
      {/* outer dashed ring */}
      <circle cx="200" cy="200" r="168" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="6 6"/>
      {/* segment arcs */}
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
      {/* connector lines + dots + labels */}
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
      {/* center circle */}
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',
                  gap: 56, flexWrap: 'wrap' }}>
      {logos.map(l => (
        <svg key={l.name} width={l.width} height={36} viewBox={`0 0 ${l.width} 36`}>
          <text x={l.width / 2} y="22" textAnchor="middle" fill="#B0BEC5"
                fontSize="13" fontFamily="DM Sans,sans-serif" fontWeight="600"
                letterSpacing="0.5">{l.name}</text>
          <line x1="10" y1="28" x2={l.width - 10} y2="28" stroke="#D0D9E2" strokeWidth="1"/>
        </svg>
      ))}
    </div>
  )
}

/* ── Product cards ──────────────────────────────────────────── */
const products = [
  {
    code: 'omniRISK',
    color: T,
    desc: 'ISO 31000 uyumlu risk sicili, tehlike haritası ve HFER skoru ile kurumsal risk tablonuzu gerçek zamanlı izleyin.',
    icon: <IconRisk size={52}/>,
  },
  {
    code: 'omniIMPACT',
    color: G,
    desc: 'İş Etki Analizi modülü; süreç bağımlılıklarını, RTO/RPO hedeflerini ve kritiklik matrisini otomatik üretir.',
    icon: <IconImpact size={52}/>,
  },
  {
    code: 'omniPLAN',
    color: '#5BA3DC',
    desc: 'ISO 22301 uyumlu İş Sürekliliği Planlarını yapay zeka yardımıyla dakikalar içinde taslaktan onaya taşıyın.',
    icon: <IconPlan size={52}/>,
  },
  {
    code: 'omniCRISIS',
    color: '#E8A87C',
    desc: 'Kriz anında görev atamaları, anlık iletişim protokolleri ve komuta merkezi panosu tek ekranda.',
    icon: <IconCrisis size={52}/>,
  },
]

/* ── Testimonials ────────────────────────────────────────────── */
const testimonials = [
  {
    quote: 'HFER-720 motor sayesinde risk sicilimizi üç günde tamamladık. Denetimden tam puan aldık.',
    name:  'Mehmet Aydın',
    role:  'Risk Direktörü, Finans Sektörü',
  },
  {
    quote: 'Tesis bazlı BCP planlarımız artık otomatik güncelleniyor. Saha ekibimizin yükü %60 azaldı.',
    name:  'Ayşe Kılıç',
    role:  'BCM Müdürü, Sağlık Grubu',
  },
  {
    quote: 'omniCRISIS modülü pandemi sürecinde krize müdahalemizi kökten değiştirdi. Olmazsa olmaz.',
    name:  'Burak Demir',
    role:  'İcra Kurulu, Belediye Grubu',
  },
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

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function Page() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const statsSection   = useInView(0.3)
  const productsSection = useInView(0.15)
  const bcmSection     = useInView(0.2)
  const testiSection   = useInView(0.15)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  /* shared section heading */
  const SectionLabel = ({ text }: { text: string }) => (
    <p style={{ color: T, fontSize: 12, fontWeight: 700, letterSpacing: 3,
                textTransform: 'uppercase', marginBottom: 12 }}>{text}</p>
  )
  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 style={{ color: N, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700,
                 lineHeight: 1.15, marginBottom: 20 }}>{children}</h2>
  )

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
        .nav-link{color:${MG};font-size:14px;font-weight:500;transition:color .18s;cursor:pointer}
        .nav-link:hover{color:${N}}
        .btn-navy{display:inline-block;background:${N};color:#fff;font-weight:600;font-size:14px;
          padding:11px 26px;border-radius:6px;transition:background .18s,transform .12s;cursor:pointer;border:none;font-family:'DM Sans',sans-serif}
        .btn-navy:hover{background:#142340;transform:translateY(-1px)}
        .btn-outline{display:inline-block;border:1.5px solid ${N};color:${N};font-weight:600;font-size:14px;
          padding:10px 26px;border-radius:6px;transition:background .18s;cursor:pointer;font-family:'DM Sans',sans-serif}
        .btn-outline:hover{background:${GR}}
        .card{background:${BG};border-radius:16px;border:1px solid #E8EDF3;padding:36px 32px;
          transition:box-shadow .2s,transform .2s}
        .card:hover{box-shadow:0 8px 32px rgba(10,22,40,.09);transform:translateY(-3px)}
        .product-tag{display:inline-block;font-size:11px;font-weight:700;letter-spacing:1.5px;
          text-transform:uppercase;padding:4px 12px;border-radius:20px;margin-bottom:18px}
      `}</style>

      {/* ══ NAV ══════════════════════════════════════════════════ */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: 68,
        background: BG,
        borderBottom: scrolled ? '1px solid #E8EDF3' : '1px solid transparent',
        boxShadow: scrolled ? '0 2px 16px rgba(10,22,40,.06)' : 'none',
        transition: 'box-shadow .25s, border-color .25s',
        display: 'flex', alignItems: 'center',
        padding: '0 48px',
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
          <nav style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
            {[['Ürünler','#products'],['BCM Döngüsü','#bcm'],['Sektörler','#sectors'],['Hakkımızda','#about']].map(([l,h]) => (
              <a key={l} href={h} className="nav-link">{l}</a>
            ))}
            <Link href="/login" className="btn-navy">Demo Talep</Link>
          </nav>
        </div>
      </header>

      {/* ══ HERO ═════════════════════════════════════════════════ */}
      <section style={{ paddingTop: 120, paddingBottom: 96,
                        padding: '140px 48px 100px', background: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto',
                      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
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
                         lineHeight: 1.08, color: N, marginBottom: 24 }}>
              Dayanıklılık.<br />
              <span style={{ color: T }}>Ölçülebilir.</span>
            </h1>

            <p style={{ color: MG, fontSize: 18, lineHeight: 1.75,
                        maxWidth: 500, marginBottom: 40, fontWeight: 400 }}>
              720 parametre, 39 ilçe haritası ve yapay zeka destekli BCM döngüsüyle
              kurumunuzun kriz hazırlığını somut verilere dönüştürün.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 52 }}>
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
                  <div style={{ color: N, fontSize: 24, fontWeight: 700 }}>{s.v}</div>
                  <div style={{ color: MG, fontSize: 12, fontWeight: 500, marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* right: 2×2 icon grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20,
                        animation: 'fadeIn .9s ease .2s both' }}>
            {[
              { icon: <IconRisk size={56}/>,   label: 'Risk Yönetimi',  sub: 'omniRISK', c: T },
              { icon: <IconImpact size={56}/>, label: 'Etki Analizi',   sub: 'omniIMPACT', c: G },
              { icon: <IconPlan size={56}/>,   label: 'Kurtarma Planı', sub: 'omniPLAN', c: '#5BA3DC' },
              { icon: <IconCrisis size={56}/>, label: 'Kriz Yönetimi', sub: 'omniCRISIS', c: '#E8A87C' },
            ].map((item, i) => (
              <div key={i} className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                  {item.icon}
                </div>
                <div style={{ color: N, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{item.label}</div>
                <div style={{ color: item.c, fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>{item.sub}</div>
              </div>
            ))}
          </div>
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

      {/* ══ PRODUCTS ═════════════════════════════════════════════ */}
      <section id="products" ref={productsSection.ref} style={{ padding: '100px 48px', background: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <SectionLabel text="Modüler Platform" />
            <SectionTitle>Her Süreç İçin Doğru Modül</SectionTitle>
            <p style={{ color: MG, fontSize: 16, maxWidth: 540, margin: '0 auto' }}>
              Dört entegre modül, BCM döngünüzün her aşamasını kapsar.
              İhtiyacınıza göre tekil veya bütünleşik kullanabilirsiniz.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {products.map((p, i) => (
              <div key={i} className="card"
                   style={{
                     opacity: productsSection.inView ? 1 : 0,
                     transform: productsSection.inView ? 'translateY(0)' : 'translateY(24px)',
                     transition: `opacity .55s ease ${i*.1}s, transform .55s ease ${i*.1}s`,
                   }}>
                <div style={{ marginBottom: 20 }}>{p.icon}</div>
                <span className="product-tag"
                      style={{ background: `${p.color}18`, color: p.color }}>{p.code}</span>
                <p style={{ color: MG, fontSize: 14, lineHeight: 1.75 }}>{p.desc}</p>
                <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 6,
                               color: p.color, fontSize: 13, fontWeight: 600 }}>
                  <span>Detayları İncele</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8M7 3l4 4-4 4" stroke={p.color} strokeWidth="1.5"
                          strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
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
          {/* left */}
          <div style={{
            opacity: bcmSection.inView ? 1 : 0,
            transform: bcmSection.inView ? 'scale(1)' : 'scale(0.93)',
            transition: 'all .8s ease',
          }}>
            <BcmCycle />
          </div>

          {/* right */}
          <div style={{
            opacity: bcmSection.inView ? 1 : 0,
            transform: bcmSection.inView ? 'translateX(0)' : 'translateX(30px)',
            transition: 'all .7s ease .15s',
          }}>
            <SectionLabel text="BCM Döngüsü" />
            <SectionTitle>Kesintisiz Dayanıklılık<br/>Döngüsü</SectionTitle>
            <p style={{ color: MG, fontSize: 16, lineHeight: 1.8, marginBottom: 36 }}>
              HFER-720 motoru, yedi aşamalı BCM döngüsünü sürekli besler.
              Önlemeden yönetişime kadar her aşama platformda izlenir,
              güncellenir ve raporlanır.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { phase: 'Önleme',          desc: 'Tehlike tespiti ve proaktif risk azaltma',         color: '#E8C97A' },
                { phase: 'Hazırlıklı Olma', desc: 'Plan geliştirme, eğitim, tatbikat yönetimi',       color: '#7B9FD4' },
                { phase: 'Zarar Azaltma',   desc: 'Kayıp minimizasyonu ve güçlendirme yatırımları',   color: '#6ABFB8' },
                { phase: 'Müdahale',        desc: 'Gerçek zamanlı kriz komuta merkezi',               color: '#f87171' },
                { phase: 'İyileştirme',     desc: 'Operasyon restorasyonu ve RTO/RPO takibi',         color: '#fb923c' },
                { phase: 'İzleme',          desc: 'KPI kontrol paneli ve uyum denetimi',             color: '#a78bfa' },
                { phase: 'Yönetişim',       desc: 'Üst yönetim raporlama ve strateji güncelleme',    color: '#34d399' },
              ].map(item => (
                <div key={item.phase} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color,
                                 flexShrink: 0, marginTop: 5 }}/>
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
      <section id="sectors" ref={statsSection.ref}
               style={{ padding: '80px 48px', background: N }}>
        <div style={{ maxWidth: 1000, margin: '0 auto',
                      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: 40, textAlign: 'center' }}>
          {[
            { target: 720,  suffix: '+',  label: 'Analiz Parametresi' },
            { target: 39,   suffix: '',   label: 'İlçe Kapsamı' },
            { target: 6,    suffix: '',   label: 'Sektör Desteği' },
            { target: 98,   suffix: '%',  label: 'Platform Uptime' },
          ].map((s, i) => (
            <div key={i} style={{
              opacity: statsSection.inView ? 1 : 0,
              transform: statsSection.inView ? 'translateY(0)' : 'translateY(20px)',
              transition: `all .6s ease ${i * .1}s`,
            }}>
              <div style={{ fontSize: 'clamp(40px, 5vw, 60px)', fontWeight: 700,
                             color: G, lineHeight: 1 }}>
                <StatItem target={s.target} suffix={s.suffix} label={s.label} go={statsSection.inView} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ TESTIMONIALS ═════════════════════════════════════════ */}
      <section id="about" ref={testiSection.ref} style={{ padding: '100px 48px', background: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <SectionLabel text="Müşteri Yorumları" />
            <SectionTitle>Liderler Ne Diyor?</SectionTitle>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="card"
                   style={{
                     opacity: testiSection.inView ? 1 : 0,
                     transform: testiSection.inView ? 'translateY(0)' : 'translateY(24px)',
                     transition: `all .6s ease ${i * .12}s`,
                   }}>
                {/* quote mark */}
                <svg width="28" height="22" viewBox="0 0 28 22" style={{ marginBottom: 18 }}>
                  <text x="0" y="22" fontSize="36" fill={T} opacity="0.35">&ldquo;</text>
                </svg>
                <p style={{ color: N, fontSize: 15, lineHeight: 1.8, fontStyle: 'italic',
                             marginBottom: 24, fontWeight: 400 }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12,
                               borderTop: '1px solid #E8EDF3', paddingTop: 20 }}>
                  {/* avatar placeholder */}
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${T}20`,
                                 display: 'flex', alignItems: 'center', justifyContent: 'center',
                                 flexShrink: 0 }}>
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
      <section style={{ padding: '80px 48px', background: GR }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div style={{ background: BG, borderRadius: 24, padding: '64px 56px',
                        boxShadow: '0 8px 48px rgba(10,22,40,.08)',
                        border: '1px solid #E8EDF3', textAlign: 'center' }}>
            <SectionLabel text="Başlayın" />
            <h2 style={{ color: N, fontSize: 'clamp(30px, 4vw, 48px)', fontWeight: 700,
                          lineHeight: 1.12, marginBottom: 20 }}>
              İlk Adımı Atın
            </h2>
            <p style={{ color: MG, fontSize: 16, lineHeight: 1.75,
                         maxWidth: 480, margin: '0 auto 40px' }}>
              14 günlük ücretsiz deneme. Kurulum yok, kredi kartı gerekmez.
              BCM danışmanımız sizi arar, platform üzerinde birlikte ilerleriz.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/login" className="btn-navy"
                    style={{ fontSize: 15, padding: '14px 40px' }}>
                Ücretsiz Başlayın
              </Link>
              <a href="mailto:info@omniversel.com" className="btn-outline"
                 style={{ fontSize: 15, padding: '13px 32px' }}>
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
            {/* brand */}
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
                  <span key={b} style={{ background: '#142340', color: T,
                                         fontSize: 11, fontWeight: 600, letterSpacing: 1,
                                         padding: '4px 10px', borderRadius: 4 }}>{b}</span>
                ))}
              </div>
            </div>

            {/* columns */}
            {[
              { title: 'Platform',  links: ['omniRISK','omniIMPACT','omniPLAN','omniCRISIS','Fiyatlar'] },
              { title: 'Şirket',    links: ['Hakkımızda','Blog','Kariyer','Basın','İletişim'] },
              { title: 'Destek',    links: ['Dokümantasyon','SSS','Güvenlik','KVKK','Kullanım Şartları'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ color: '#E2EAF3', fontSize: 13, fontWeight: 700,
                               letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>
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

          {/* bottom bar */}
          <div style={{ borderTop: '1px solid #142340', paddingTop: 28,
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
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
