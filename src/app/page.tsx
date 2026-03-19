'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import OmniverselLogo from '@/components/OmniverselLogo'

/* ─── tokens ─────────────────────────────────────────────────── */
const N      = '#0A1628'
const T      = '#2D8A87'
const GR     = '#F4F7F6'
const MG     = '#566B66'
const BG     = '#FFFFFF'
const BORDER = '#E8EDED'
const R_R    = '#E30613'
const R_O    = '#E56A04'
const R_Y    = '#FFC801'
const R_G    = '#2D8A87'

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
    setN(0); let s: number | null = null; let raf: number
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
  const [w, setW] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 768)
  useEffect(() => {
    const fn = () => setW(window.innerWidth); fn()
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return w
}

/* ── Dashboard Cards ────────────────────────────────────────── */
function RiskGaugeCard() {
  const CX = 100, CY = 88, R = 64
  const arc = (deg: number) => {
    const r = (deg * Math.PI) / 180
    return `${CX + R * Math.cos(r)},${CY + R * Math.sin(r)}`
  }
  const score = 3.8
  const needleDeg = 180 + (score / 5) * 180
  const nr = (needleDeg * Math.PI) / 180
  const pills = [
    { label:'DÜŞÜK', color:R_G, active:false },
    { label:'ORTA',  color:R_Y, active:false },
    { label:'YÜKSEK',color:R_O, active:true  },
    { label:'KRİTİK',color:R_R, active:false },
  ]
  return (
    <div style={{ background:BG, border:`1px solid ${BORDER}`, borderRadius:12,
      padding:'16px', boxShadow:'0 2px 8px rgba(0,0,0,.08)', flex:1 }}>
      <p style={{ fontSize:11, fontWeight:700, color:MG, letterSpacing:1.5,
        textTransform:'uppercase', marginBottom:6 }}>Risk Skoru</p>
      <div style={{ position:'relative', textAlign:'center' }}>
        <svg viewBox="0 0 200 108" width="100%" style={{ display:'block' }}>
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
      <div style={{ display:'flex', gap:4, justifyContent:'center', flexWrap:'wrap', marginTop:4 }}>
        {pills.map(p => (
          <span key={p.label} style={{ fontSize:9, fontWeight:700, padding:'3px 8px', borderRadius:20,
            background:p.active?p.color:'transparent', color:p.active?'#fff':p.color,
            border:`1px solid ${p.color}`, letterSpacing:0.5 }}>{p.label}</span>
        ))}
      </div>
    </div>
  )
}

function PendulumCard() {
  const bars = [
    { label:'DÜŞÜK', color:R_G, pct:38 }, { label:'ORTA', color:R_Y, pct:27 },
    { label:'YÜKSEK',color:R_O, pct:22 }, { label:'KRİTİK',color:R_R, pct:13 },
  ]
  return (
    <div style={{ background:BG, border:`1px solid ${BORDER}`, borderRadius:16,
      padding:'20px', boxShadow:'0 2px 16px rgba(10,22,40,.07)', flex:1 }}>
      <p style={{ fontSize:10, fontWeight:700, color:MG, letterSpacing:2,
        textTransform:'uppercase', marginBottom:14 }}>Risk Dağılımı</p>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {bars.map((b, i) => (
          <div key={i}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
              <span style={{ fontSize:10, fontWeight:700, color:b.color, letterSpacing:1 }}>{b.label}</span>
              <span style={{ fontSize:10, fontWeight:700, color:b.color, fontFamily:'DM Mono,monospace' }}>{b.pct}%</span>
            </div>
            <div style={{ height:8, background:`${b.color}20`, borderRadius:4, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${b.pct}%`, background:b.color, borderRadius:4 }}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChecklistCard() {
  const items = [
    { text:'Sendai Uyum Tamamlandı',  icon:'✓', color:R_G },
    { text:'NATECH Analizi Beklemede', icon:'⏳', color:R_Y },
    { text:'BCP Güncelleme Gerekli',   icon:'⚠', color:R_O },
  ]
  return (
    <div style={{ background:BG, border:`1px solid ${BORDER}`, borderRadius:16,
      padding:'20px', boxShadow:'0 2px 16px rgba(10,22,40,.07)', flex:1 }}>
      <p style={{ fontSize:10, fontWeight:700, color:MG, letterSpacing:2,
        textTransform:'uppercase', marginBottom:14 }}>Aksiyon Listesi</p>
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px',
            background:`${item.color}0d`, borderRadius:8, borderLeft:`3px solid ${item.color}` }}>
            <span style={{ fontSize:15, lineHeight:1, flexShrink:0 }}>{item.icon}</span>
            <span style={{ fontSize:11, color:N, fontWeight:600, lineHeight:1.4 }}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function KpiCard() {
  const kpis = [
    { v:'782', l:'Tesis', c:T   },
    { v:'103', l:'Kritik', c:R_R },
    { v:'%47', l:'Sendai', c:R_Y },
  ]
  return (
    <div style={{ background:BG, border:`1px solid ${BORDER}`, borderRadius:16,
      padding:'20px', boxShadow:'0 2px 16px rgba(10,22,40,.07)', flex:1 }}>
      <p style={{ fontSize:10, fontWeight:700, color:MG, letterSpacing:2,
        textTransform:'uppercase', marginBottom:14 }}>Canlı Metrikler</p>
      <div style={{ display:'flex', gap:6 }}>
        {kpis.map((k, i) => (
          <div key={i} style={{ flex:1, textAlign:'center', padding:'10px 6px',
            background:GR, borderRadius:8, borderTop:`3px solid ${k.c}` }}>
            <div style={{ fontSize:22, fontWeight:700, color:k.c,
              fontFamily:'DM Mono,monospace', lineHeight:1 }}>{k.v}</div>
            <div style={{ fontSize:9, color:MG, fontWeight:600, marginTop:5,
              textTransform:'uppercase', letterSpacing:0.5 }}>{k.l}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── LiveMetric ───────────────────────────────────────────────── */
function LiveMetric({ target, suffix, label, sub, go }: {
  target: number; suffix: string; label: string; sub: string; go: boolean
}) {
  const n = useCounter(target, 2000, go)
  return (
    <div style={{ textAlign:'center', padding:'0 8px' }}>
      <div style={{ fontSize:'clamp(36px,4vw,52px)', fontWeight:700, color:BG,
        lineHeight:1, fontFamily:'DM Mono,monospace' }}>{n}{suffix}</div>
      <div style={{ color:'rgba(255,255,255,0.88)', fontSize:15, fontWeight:600, marginTop:8 }}>{label}</div>
      <div style={{ color:'rgba(255,255,255,0.55)', fontSize:12, marginTop:4 }}>{sub}</div>
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
  const [metrics, setMetrics] = useState({ tesis:782, kritik:103, mahalle:10, sektor:6 })
  const screenW  = useWindowWidth()
  const isMobile = screenW > 0 && screenW < 768

  const metricsSection = useInView(0.2)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    sbBD.from('facilities').select('id,sector,extra_data')
      .eq('tenant_id', TENANT_BD).eq('is_active', true).limit(1000)
      .then(({ data }) => {
        if (!data || data.length === 0) return
        const kritik  = data.filter((f: { extra_data: { H_score?: number } | null }) => (f.extra_data?.H_score ?? 0) >= 4).length
        const mahalleSet = new Set(data.map((f: { extra_data: { neighborhood?: string } | null }) => f.extra_data?.neighborhood).filter(Boolean))
        const sektorSet  = new Set(data.map((f: { sector: string }) => f.sector))
        setMetrics({ tesis:data.length, kritik, mahalle:mahalleSet.size, sektor:sektorSet.size })
      })
  }, [])

  const PLATFORM_ITEMS = [
    { code:'omniRISK',   color:T,         href:'/products/omnirisk',   desc:'Risk sicili & HFER skoru'      },
    { code:'omniIMPACT', color:'#C8A84A', href:'/products/omniimpact', desc:'İş Etki Analizi & BIA'         },
    { code:'omniPLAN',   color:'#3B7EC8', href:'/products/omniplan',   desc:'BCM planı & RTO/RPO takibi'    },
    { code:'omniCRISIS', color:R_O,       href:'/products/omnicrisis', desc:'Kriz komuta merkezi'           },
    { code:'omniAUDIT',  color:R_G,       href:'#',                    desc:'Uyum denetimi & Sendai izleme' },
    { code:'omniVENDOR', color:'#6366F1', href:'#',                    desc:'Tedarik zinciri riski'         },
  ]
  const SEKTOR_ITEMS = [
    { name:'Bankacılık & Finans', color:T          },
    { name:'Sağlık & Hastane',    color:R_R         },
    { name:'Sanayi & Üretim',     color:R_O         },
    { name:'Eğitim Kurumları',    color:'#3B7EC8'   },
    { name:'Kamu & Belediye',     color:T           },
    { name:'Kritik Altyapı',      color:R_Y         },
    { name:'Turizm & Konaklama',  color:'#7B5EA7'   },
    { name:'Lojistik & Tedarik',  color:MG          },
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
        .mega-wrap{position:relative}
        .mega-panel{position:absolute;top:calc(100% + 12px);left:50%;transform:translateX(-50%);
          background:${BG};border-radius:16px;border:1px solid ${BORDER};
          box-shadow:0 16px 48px rgba(10,22,40,.1);padding:20px;min-width:380px;z-index:300}
        .mega-panel-lg{min-width:440px}
        .mega-panel-sm{min-width:260px}
        .mob-overlay{position:fixed;inset:0;background:rgba(10,22,40,.55);z-index:198;backdrop-filter:blur(4px)}
        .mob-menu{position:fixed;top:68px;left:0;right:0;background:${BG};z-index:199;
          border-bottom:1px solid ${BORDER};box-shadow:0 8px 32px rgba(10,22,40,.12);
          padding:20px 20px 28px;display:flex;flex-direction:column;gap:4px;animation:fadeIn .18s ease both}
        .mob-menu a,.mob-menu span{display:block;padding:12px 14px;border-radius:8px;font-size:15px;font-weight:600;color:${N};transition:background .15s;cursor:pointer}
        .mob-menu a:hover,.mob-menu span:hover{background:${GR}}
        .mob-sep{height:1px;background:${BORDER};margin:8px 0}
        .mob-cta{display:block;background:${T};color:#fff !important;font-weight:700 !important;
          font-size:14px;padding:13px 20px !important;border-radius:6px;text-align:center;margin-top:8px}
        .road-card{display:block;background:${BG};border:1px solid ${BORDER};border-radius:20px;
          padding:36px 32px;transition:all .22s;cursor:pointer;text-decoration:none;color:${N}}
        .road-card:hover{border-color:${T};box-shadow:0 12px 48px rgba(45,138,135,.12);transform:translateY(-4px)}
      `}</style>

      {/* ══ NAV ══════════════════════════════════════════════════ */}
      <header style={{
        position:'fixed', top:0, left:0, right:0, zIndex:200, height:68,
        background:scrolled?'rgba(255,255,255,0.97)':'transparent',
        backdropFilter:scrolled?'blur(12px)':'none',
        WebkitBackdropFilter:scrolled?'blur(12px)':'none',
        borderBottom:scrolled?`1px solid ${BORDER}`:'1px solid transparent',
        boxShadow:scrolled?'0 2px 16px rgba(10,22,40,.07)':'none',
        transition:'all .25s',
        display:'flex', alignItems:'center', padding:isMobile?'0 20px':'0 48px',
      }}>
        <div style={{ maxWidth:1200, width:'100%', margin:'0 auto',
          display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Link href="/" style={{ display:'flex', alignItems:'center' }}>
            <OmniverselLogo width={240} height={60} light />
          </Link>

          {/* Desktop nav */}
          <nav style={{ display:isMobile?'none':'flex', gap:28, alignItems:'center' }}>

            {/* Platform megamenu */}
            <div className="mega-wrap"
              onMouseEnter={() => setMegaOpen('platform')}
              onMouseLeave={() => setMegaOpen(null)}>
              <span className="nav-link" style={{ display:'flex', alignItems:'center', gap:4 }}>
                Platform
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 5l3 3 3-3" stroke={MG} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              {megaOpen === 'platform' && (
                <div className="mega-panel mega-panel-lg">
                  <p style={{ fontSize:10, fontWeight:700, color:MG, letterSpacing:2,
                    textTransform:'uppercase', marginBottom:14 }}>Platform Modülleri</p>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4 }}>
                    {PLATFORM_ITEMS.map(p => (
                      <Link key={p.code} href={p.href}
                        style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 12px',
                          borderRadius:8, transition:'background .15s', color:N }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = GR}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                        <span style={{ width:8, height:8, borderRadius:'50%', background:p.color,
                          flexShrink:0, marginTop:5 }}/>
                        <div>
                          <div style={{ fontSize:13, fontWeight:700, color:N }}>{p.code}</div>
                          <div style={{ fontSize:11, color:MG, marginTop:2 }}>{p.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${BORDER}` }}>
                    <Link href="/products/omnirisk" style={{ fontSize:12, fontWeight:600, color:T,
                      display:'flex', alignItems:'center', gap:5 }}>
                      Tüm Modülleri İncele →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Sektörler megamenu */}
            <div className="mega-wrap"
              onMouseEnter={() => setMegaOpen('sektor')}
              onMouseLeave={() => setMegaOpen(null)}>
              <span className="nav-link" style={{ display:'flex', alignItems:'center', gap:4 }}>
                Sektörler
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 5l3 3 3-3" stroke={MG} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              {megaOpen === 'sektor' && (
                <div className="mega-panel mega-panel-sm">
                  <p style={{ fontSize:10, fontWeight:700, color:MG, letterSpacing:2,
                    textTransform:'uppercase', marginBottom:14 }}>Sektörler</p>
                  {SEKTOR_ITEMS.map(s => (
                    <Link key={s.name} href="/sektorler"
                      style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px',
                        borderRadius:8, transition:'background .15s', color:N }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = GR}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                      <span style={{ width:7, height:7, borderRadius:'50%', background:s.color, flexShrink:0 }}/>
                      <span style={{ fontSize:13, fontWeight:500 }}>{s.name}</span>
                    </Link>
                  ))}
                  <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${BORDER}` }}>
                    <Link href="/sektorler" style={{ fontSize:12, fontWeight:600, color:T,
                      display:'flex', alignItems:'center', gap:5 }}>Tüm Sektörler →</Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/metodoloji" className="nav-link">Metodoloji</Link>
            <Link href="/kaynaklar" className="nav-link">Kaynaklar</Link>
            <Link href="/hakkimizda" className="nav-link">Hakkımızda</Link>

            <Link href="/login" style={{ background:T, color:'#fff', fontWeight:700, fontSize:14,
              padding:'10px 24px', borderRadius:6, display:'inline-block', transition:'opacity .18s' }}>
              Demo Talep
            </Link>
          </nav>

          {/* Hamburger */}
          {isMobile && (
            <button onClick={() => setMenuOpen(o => !o)}
              style={{ background:'none', border:'none', cursor:'pointer', padding:'6px',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:N, fontSize:22, lineHeight:1 }}>
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
            <div style={{ paddingBottom:8, marginBottom:4 }}>
              <OmniverselLogo width={160} height={40} light />
            </div>
            <div className="mob-sep"/>
            <Link href="/sektorler" onClick={() => setMenuOpen(false)}>Sektörler</Link>
            <Link href="/metodoloji" onClick={() => setMenuOpen(false)}>Metodoloji</Link>
            <Link href="/kaynaklar" onClick={() => setMenuOpen(false)}>Kaynaklar</Link>
            <Link href="/hakkimizda" onClick={() => setMenuOpen(false)}>Hakkımızda</Link>
            <Link href="/login" className="mob-cta" onClick={() => setMenuOpen(false)}>Demo Talep</Link>
          </div>
        </>
      )}

      {/* ══ HERO ═════════════════════════════════════════════════ */}
      <section style={{ padding:isMobile?'100px 20px 60px':'140px 48px 100px', background:BG }}>
        <div style={{ maxWidth:1200, margin:'0 auto',
          display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr',
          gap:isMobile?36:72, alignItems:'center' }}>
          {/* Left */}
          <div style={{ animation:'fadeUp .7s ease both' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8,
              background:`${T}12`, border:`1px solid ${T}30`,
              borderRadius:20, padding:'5px 14px', marginBottom:28 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:T, display:'inline-block' }}/>
              <span style={{ color:T, fontSize:12, fontWeight:600, letterSpacing:1 }}>
                omniRISK Aktif · TOC · HRO · Lean · Agile
              </span>
            </div>

            <h1 style={{ fontSize:'clamp(30px,3.8vw,54px)', fontWeight:700,
              lineHeight:1.1, color:N, marginBottom:24 }}>
              Afetlerde Dayanıklılık, Risk Yönetimi<br/>
              <span style={{ color:T }}>ve İş Sürekliliği</span>
            </h1>

            <p style={{ color:MG, fontSize:16, lineHeight:1.85,
              maxWidth:540, marginBottom:40, fontWeight:400 }}>
              TOC darboğaz odaklılık, HRO saha hassasiyeti ve Lean finansal etki analizi ile
              kurumunuzun çevik dayanıklılık kapasitesini ölçün, yönetin ve geliştirin.
            </p>

            <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:40,
              flexDirection:isMobile?'column':'row' }}>
              <Link href="/login" className="btn-teal" style={{ fontSize:15, padding:'13px 32px', textAlign:'center' }}>
                Ücretsiz Demo
              </Link>
              <Link href="/sektorler" className="btn-outline" style={{ fontSize:15, padding:'12px 32px', textAlign:'center' }}>
                Sektörleri İncele
              </Link>
            </div>

            {/* Trust badges */}
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {['ISO 22301','ISO 31000','HRO','TOC','FEMA','AFAD'].map(b => (
                <span key={b} style={{ background:`${T}10`, color:T, fontSize:10,
                  fontWeight:700, letterSpacing:0.8, padding:'5px 12px',
                  borderRadius:20, border:`1px solid ${T}25` }}>{b}</span>
              ))}
            </div>
          </div>

          {/* Right: 2×2 dashboard */}
          <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:16,
            animation:'fadeIn .9s ease .2s both' }}>
            <RiskGaugeCard />
            <PendulumCard />
            <ChecklistCard />
            <KpiCard />
          </div>
        </div>
      </section>

      {/* ══ 3 ANA YOL KARTI ══════════════════════════════════════ */}
      <section style={{ padding:isMobile?'48px 20px':'80px 48px', background:GR,
        borderTop:`1px solid ${BORDER}`, borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <p style={{ color:T, fontSize:12, fontWeight:700, letterSpacing:3,
              textTransform:'uppercase', marginBottom:12 }}>Keşfedin</p>
            <h2 style={{ color:N, fontSize:'clamp(24px,3.2vw,38px)', fontWeight:700, lineHeight:1.15 }}>
              Platformu Üç Yoldan Keşfedin
            </h2>
          </div>
          <div style={{ display:'grid',
            gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)', gap:24 }}>

            {/* Platform */}
            <Link href="/products/omnirisk" className="road-card">
              <div style={{ width:52, height:52, borderRadius:14, background:`${T}14`,
                border:`1.5px solid ${T}30`, display:'flex', alignItems:'center',
                justifyContent:'center', marginBottom:24, fontSize:24 }}>🏗️</div>
              <h3 style={{ color:N, fontSize:22, fontWeight:700, marginBottom:10 }}>Platform</h3>
              <p style={{ color:MG, fontSize:14, lineHeight:1.75, marginBottom:24 }}>
                Modüler yapı, risk motoru ve BCM araçları: omniRISK&apos;ten omniCRISIS&apos;e
                İSYS yaşam döngüsünün tamamı.
              </p>
              {/* 6 modül */}
              <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:28 }}>
                {[
                  { code:'omniRISK',   color:T,         desc:'Risk sicili & HFER skoru' },
                  { code:'omniIMPACT', color:'#C8A84A', desc:'İş Etki Analizi' },
                  { code:'omniPLAN',   color:'#3B7EC8', desc:'BCM planı & RTO/RPO' },
                  { code:'omniCRISIS', color:R_O,       desc:'Kriz komuta merkezi' },
                  { code:'omniAUDIT',  color:R_G,       desc:'Uyum denetimi' },
                  { code:'omniVENDOR', color:'#6366F1', desc:'Tedarik zinciri' },
                ].map(m => (
                  <div key={m.code} style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:m.color, flexShrink:0 }}/>
                    <span style={{ fontSize:12, fontWeight:700, color:m.color }}>{m.code}</span>
                    <span style={{ fontSize:12, color:MG }}>— {m.desc}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6, color:T, fontWeight:700, fontSize:14 }}>
                Modülleri İncele
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke={T} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>

            {/* Sektörler */}
            <Link href="/sektorler" className="road-card">
              <div style={{ width:52, height:52, borderRadius:14, background:`${R_O}14`,
                border:`1.5px solid ${R_O}30`, display:'flex', alignItems:'center',
                justifyContent:'center', marginBottom:24, fontSize:24 }}>🏭</div>
              <h3 style={{ color:N, fontSize:22, fontWeight:700, marginBottom:10 }}>Sektörler</h3>
              <p style={{ color:MG, fontSize:14, lineHeight:1.75, marginBottom:24 }}>
                Her sektörün kendine özgü tehlike profili ve yasal uyum gereksinimleri
                doğrultusunda kalibre edilmiş çözümler.
              </p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginBottom:28 }}>
                {[
                  { n:'Bankacılık',c:'#1565C0' }, { n:'Sağlık',c:R_R },
                  { n:'Sanayi',c:R_O }, { n:'Kamu',c:T },
                  { n:'Eğitim',c:'#3B7EC8' }, { n:'Kritik Alt.',c:R_Y },
                  { n:'Turizm',c:'#7B5EA7' }, { n:'Lojistik',c:MG },
                ].map(s => (
                  <span key={s.n} style={{ fontSize:11, fontWeight:600, padding:'4px 10px',
                    borderRadius:20, background:`${s.c}12`, color:s.c,
                    border:`1px solid ${s.c}25` }}>{s.n}</span>
                ))}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6, color:R_O, fontWeight:700, fontSize:14 }}>
                Sektörleri İncele
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke={R_O} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>

            {/* Metodoloji */}
            <Link href="/metodoloji" className="road-card">
              <div style={{ width:52, height:52, borderRadius:14, background:`${'#7B5EA7'}14`,
                border:`1.5px solid ${'#7B5EA7'}30`, display:'flex', alignItems:'center',
                justifyContent:'center', marginBottom:24, fontSize:24 }}>📐</div>
              <h3 style={{ color:N, fontSize:22, fontWeight:700, marginBottom:10 }}>Metodoloji</h3>
              <p style={{ color:MG, fontSize:14, lineHeight:1.75, marginBottom:24 }}>
                HFER-720 formülü, HRO saha ilkeleri, TOC darboğaz analizi ve
                FEMA Core Capabilities entegrasyonu.
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:28 }}>
                {[
                  { t:'HFER-720', s:'URI = (H×F×E×B)/(1+k·C²)×HRO_α', c:'#7B5EA7' },
                  { t:'HRO',     s:'5 ilke · Near Miss · α çarpanı', c:'#F97316' },
                  { t:'TOC',     s:'Darboğaz → Kısıt → Sistem', c:R_R },
                  { t:'FEMA',    s:'32 Core Capability · 5 Faz', c:'#3B7EC8' },
                ].map(m => (
                  <div key={m.t} style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:m.c,
                      flexShrink:0, marginTop:5 }}/>
                    <div>
                      <span style={{ fontSize:12, fontWeight:700, color:m.c }}>{m.t}</span>
                      <span style={{ fontSize:11, color:MG }}> — {m.s}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6, color:'#7B5EA7', fontWeight:700, fontSize:14 }}>
                Metodolojiye Git
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke={'#7B5EA7'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ CANLI METRİKLER BANDI ════════════════════════════════ */}
      <section ref={metricsSection.ref} style={{ background:T, padding:isMobile?'40px 20px':'64px 48px' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <p style={{ textAlign:'center', color:'rgba(255,255,255,0.6)', fontSize:11, fontWeight:700,
            letterSpacing:3, textTransform:'uppercase', marginBottom:44 }}>
            Canlı Platform Metrikleri · Supabase
          </p>
          <div style={{ display:'grid',
            gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',
            gap:isMobile?20:0 }}>
            {[
              { target:metrics.tesis,   suffix:'', label:'Tesis Analiz Edildi',  sub:'omniRISK skoru hesaplı' },
              { target:metrics.kritik,  suffix:'', label:'Kritik Risk Tespit',    sub:'H_score ≥ 4 seviyesi'  },
              { target:metrics.mahalle, suffix:'', label:'Mahalle Haritalandı',   sub:'CBS katmanı aktif'      },
              { target:metrics.sektor,  suffix:'', label:'Sektör Kapsandı',       sub:'Çapraz sektör analizi' },
            ].map((m, i) => (
              <div key={i} style={{
                opacity:metricsSection.inView?1:0,
                transform:metricsSection.inView?'translateY(0)':'translateY(20px)',
                transition:`all .6s ease ${i*.12}s`,
                borderLeft:!isMobile&&i>0?'1px solid rgba(255,255,255,0.2)':'none',
              }}>
                <LiveMetric {...m} go={metricsSection.inView} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DEMO CTA ═════════════════════════════════════════════ */}
      <section style={{ padding:isMobile?'48px 20px':'80px 48px', background:BG }}>
        <div style={{ maxWidth:760, margin:'0 auto' }}>
          <div style={{ background:N, borderRadius:24, padding:isMobile?'40px 24px':'64px 56px',
            textAlign:'center', boxShadow:'0 8px 48px rgba(10,22,40,.12)' }}>
            <p style={{ color:T, fontSize:12, fontWeight:700, letterSpacing:3,
              textTransform:'uppercase', marginBottom:16 }}>Başlayın</p>
            <h2 style={{ color:BG, fontSize:'clamp(26px,3.8vw,44px)', fontWeight:700,
              lineHeight:1.12, marginBottom:20 }}>
              Kurumunuzun Dirençlilik<br/>Skorunu Hesaplayın
            </h2>
            <p style={{ color:'rgba(255,255,255,0.55)', fontSize:16, lineHeight:1.75,
              maxWidth:480, margin:'0 auto 40px' }}>
              14 günlük ücretsiz deneme. Kurulum yok, kredi kartı gerekmez.
              BCM danışmanımız sizi arar, platform üzerinde birlikte ilerleriz.
            </p>
            <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
              <Link href="/login" style={{ background:T, color:'#fff', fontWeight:700, fontSize:15,
                padding:'14px 40px', borderRadius:8, display:'inline-block', transition:'opacity .18s' }}>
                Ücretsiz Başlayın
              </Link>
              <a href="mailto:info@omniversel.com" style={{ border:'1.5px solid rgba(255,255,255,0.2)',
                color:'rgba(255,255,255,0.72)', fontWeight:600, fontSize:15, padding:'13px 32px',
                borderRadius:8, display:'inline-block', transition:'border-color .18s' }}>
                Bize Yazın
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════ */}
      <footer style={{ background:N, padding:isMobile?'40px 20px 24px':'64px 48px 36px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'grid',
            gridTemplateColumns:isMobile?'1fr 1fr':'2fr 1fr 1fr 1fr',
            gap:isMobile?32:48, marginBottom:isMobile?36:56 }}>
            <div>
              <div style={{ marginBottom:20 }}>
                <OmniverselLogo width={200} height={50} variant="navy" />
              </div>
              <p style={{ color:'rgba(255,255,255,0.45)', fontSize:14, lineHeight:1.8, maxWidth:260 }}>
                Yapay zeka destekli kurumsal dayanıklılık platformu.
                ISO 22301 · BCM · AFAD uyumlu.
              </p>
              <div style={{ display:'flex', gap:12, marginTop:24 }}>
                {['ISO 22301','BCM','KVKK'].map(b => (
                  <span key={b} style={{ background:`${T}25`, color:T, fontSize:11,
                    fontWeight:600, letterSpacing:1, padding:'4px 10px', borderRadius:4 }}>{b}</span>
                ))}
              </div>
            </div>
            {[
              { title:'Platform', links:['omniRISK','omniIMPACT','omniPLAN','omniCRISIS','omniAUDIT'], hrefs:['/products/omnirisk','#','#','#','#'] },
              { title:'Şirket',   links:['Hakkımızda','Metodoloji','Kaynaklar','Sektörler','İletişim'], hrefs:['/hakkimizda','/metodoloji','/kaynaklar','/sektorler','#'] },
              { title:'Destek',   links:['Dokümantasyon','SSS','Güvenlik','KVKK','Kullanım Şartları'], hrefs:['#','#','#','#','#'] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ color:'rgba(255,255,255,0.8)', fontSize:13, fontWeight:700,
                  letterSpacing:1, textTransform:'uppercase', marginBottom:20 }}>{col.title}</div>
                {col.links.map((l, li) => (
                  <div key={l} style={{ marginBottom:12 }}>
                    <a href={col.hrefs[li]} style={{ color:'rgba(255,255,255,0.45)', fontSize:14, transition:'color .18s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = BG)}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}>{l}</a>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:28,
            display:'flex', justifyContent:'space-between', alignItems:'center',
            flexWrap:'wrap', gap:16 }}>
            <span style={{ color:'rgba(255,255,255,0.35)', fontSize:13 }}>
              © {new Date().getFullYear()} Omniversel Teknoloji A.Ş. Tüm hakları saklıdır.
            </span>
            <span style={{ color:'rgba(255,255,255,0.35)', fontSize:13 }}>
              İTÜ AYM iş birliğiyle · Sendai 2015–2030 uyumlu
            </span>
          </div>
        </div>
      </footer>
    </>
  )
}
