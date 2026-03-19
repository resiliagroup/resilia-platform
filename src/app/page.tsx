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
    { label:'LOW',      color:R_G, active:false },
    { label:'MODERATE', color:R_Y, active:false },
    { label:'HIGH',     color:R_O, active:true  },
    { label:'CRITICAL', color:R_R, active:false },
  ]
  return (
    <div style={{ background:BG, border:`1px solid ${BORDER}`, borderRadius:12,
      padding:'16px', boxShadow:'0 2px 8px rgba(0,0,0,.08)', flex:1 }}>
      <p style={{ fontSize:11, fontWeight:700, color:MG, letterSpacing:1.5,
        textTransform:'uppercase', marginBottom:6 }}>Risk Score</p>
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
          <text x={CX} y={CY - 4} textAnchor="middle" fill={MG} fontSize="8">URI Score</text>
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
    { label:'LOW',      color:R_G, pct:38 }, { label:'MODERATE', color:R_Y, pct:27 },
    { label:'HIGH',     color:R_O, pct:22 }, { label:'CRITICAL', color:R_R, pct:13 },
  ]
  return (
    <div style={{ background:BG, border:`1px solid ${BORDER}`, borderRadius:16,
      padding:'20px', boxShadow:'0 2px 16px rgba(10,22,40,.07)', flex:1 }}>
      <p style={{ fontSize:10, fontWeight:700, color:MG, letterSpacing:2,
        textTransform:'uppercase', marginBottom:14 }}>Risk Distribution</p>
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
    { text:'Sendai Compliance — Done',    icon:'✓', color:R_G },
    { text:'NATECH Analysis — Pending',   icon:'⏳', color:R_Y },
    { text:'BCP Update Required',         icon:'⚠', color:R_O },
  ]
  return (
    <div style={{ background:BG, border:`1px solid ${BORDER}`, borderRadius:16,
      padding:'20px', boxShadow:'0 2px 16px rgba(10,22,40,.07)', flex:1 }}>
      <p style={{ fontSize:10, fontWeight:700, color:MG, letterSpacing:2,
        textTransform:'uppercase', marginBottom:14 }}>Action Items</p>
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
    { v:'782', l:'Facilities', c:T   },
    { v:'103', l:'Critical',   c:R_R },
    { v:'47%', l:'Sendai',     c:R_Y },
  ]
  return (
    <div style={{ background:BG, border:`1px solid ${BORDER}`, borderRadius:16,
      padding:'20px', boxShadow:'0 2px 16px rgba(10,22,40,.07)', flex:1 }}>
      <p style={{ fontSize:10, fontWeight:700, color:MG, letterSpacing:2,
        textTransform:'uppercase', marginBottom:14 }}>Live Metrics</p>
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
  const [metrics, setMetrics] = useState({ tesis:782, kritik:103, mahalle:150, sektor:6 })
  const screenW  = useWindowWidth()
  const isMobile = screenW > 0 && screenW < 768

  const metricsSection = useInView(0.2)
  const femaSection    = useInView(0.15)
  const statsSection   = useInView(0.2)

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
        setMetrics({ tesis:data.length, kritik, mahalle:mahalleSet.size * 15, sektor:sektorSet.size })
      })
  }, [])

  const PLATFORM_ITEMS = [
    { code:'omniRISK',   color:T,         href:'/products/omnirisk',   desc:'Risk registry & HFER score'      },
    { code:'omniIMPACT', color:'#C8A84A', href:'/products/omniimpact', desc:'Business Impact Analysis & BIA'  },
    { code:'omniPLAN',   color:'#3B7EC8', href:'/products/omniplan',   desc:'BCM plan & RTO/RPO tracking'     },
    { code:'omniCRISIS', color:R_O,       href:'/products/omnicrisis', desc:'Crisis command center'           },
    { code:'omniAUDIT',  color:R_G,       href:'#',                    desc:'Compliance audit & Sendai'       },
    { code:'omniVENDOR', color:'#6366F1', href:'#',                    desc:'Supply chain risk'               },
  ]
  const SOLUTION_ITEMS = [
    { name:'Banking & Finance',      color:T          },
    { name:'Health & Hospital',      color:R_R        },
    { name:'Industry & Manufacturing', color:R_O      },
    { name:'Education',              color:'#3B7EC8'  },
    { name:'Public & Municipality',  color:T          },
    { name:'Critical Infrastructure',color:R_Y        },
    { name:'Tourism & Hospitality',  color:'#7B5EA7'  },
    { name:'Logistics & Supply',     color:MG         },
  ]

  const FEMA_AREAS = [
    {
      phase:'Prevention',
      color:'#15803D',
      bg:'#F0FDF4',
      border:'#BBF7D0',
      icon:'/icons/fema/Icon_PREVENT_01_Planning.png',
      desc:'Detect, deter and stop threats before they occur.',
      caps:[
        { icon:'/icons/fema/Icon_PREVENT_01_Planning.png',     label:'Planning' },
        { icon:'/icons/fema/Icon_PREVENT_04_Intelligence.png', label:'Intelligence' },
        { icon:'/icons/fema/Icon_PREVENT_05_Interdiction.png', label:'Interdiction' },
      ],
    },
    {
      phase:'Protection',
      color:'#0F766E',
      bg:'#CCFBF1',
      border:'#99F6E4',
      icon:'/icons/fema/Icon_PROTECT_08_Cyber.png',
      desc:'Safeguard citizens, assets, networks and critical infrastructure.',
      caps:[
        { icon:'/icons/fema/Icon_PROTECT_08_Cyber.png',     label:'Cyber Security' },
        { icon:'/icons/fema/Icon_PROTECT_09_Physical.png',  label:'Physical Protection' },
        { icon:'/icons/fema/Icon_PROTECT_11_Supply.png',    label:'Supply Chain' },
      ],
    },
    {
      phase:'Mitigation',
      color:'#B45309',
      bg:'#FFFBEB',
      border:'#FDE68A',
      icon:'/icons/fema/Icon_MIT_06_Risk.png',
      desc:'Reduce loss of life and property by lessening the impact of disasters.',
      caps:[
        { icon:'/icons/fema/Icon_MIT_06_Risk.png',          label:'Risk Assessment' },
        { icon:'/icons/fema/Icon_MIT_04_Community.png',     label:'Community Resilience' },
        { icon:'/icons/fema/Icon_MIT_05_LongTerm.png',      label:'Long-Term Reduction' },
      ],
    },
    {
      phase:'Response',
      color:'#C2410C',
      bg:'#FFF7ED',
      border:'#FED7AA',
      icon:'/icons/fema/Icon_RESP_12_OnScene.png',
      desc:'Save lives, protect property and meet basic needs after an incident.',
      caps:[
        { icon:'/icons/fema/Icon_RESP_12_OnScene.png',      label:'On-Scene Coordination' },
        { icon:'/icons/fema/Icon_RESP_15_Situational.png',  label:'Situational Awareness' },
        { icon:'/icons/fema/Icon_RESP_14_PublicHealth.png', label:'Public Health' },
      ],
    },
    {
      phase:'Recovery',
      color:'#B91C1C',
      bg:'#FEF2F2',
      border:'#FECACA',
      icon:'/icons/fema/Icon_REC_04_Infrastructure.png',
      desc:'Recover through a focus on the timely restoration of infrastructure.',
      caps:[
        { icon:'/icons/fema/Icon_REC_04_Infrastructure.png', label:'Infrastructure' },
        { icon:'/icons/fema/Icon_REC_05_Econ.png',           label:'Economic Recovery' },
        { icon:'/icons/fema/Icon_REC_06_Health.png',          label:'Health & Social' },
      ],
    },
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
        .fema-card{background:${BG};border:1px solid ${BORDER};border-radius:16px;padding:28px 24px;transition:all .22s}
        .fema-card:hover{transform:translateY(-3px);box-shadow:0 8px 32px rgba(10,22,40,.1)}
        .stat-card{background:${BG};border:1px solid ${BORDER};border-radius:16px;padding:28px 24px;text-align:center}
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
                    textTransform:'uppercase', marginBottom:14 }}>Platform Modules</p>
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
                      View All Modules →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Solutions megamenu */}
            <div className="mega-wrap"
              onMouseEnter={() => setMegaOpen('solutions')}
              onMouseLeave={() => setMegaOpen(null)}>
              <span className="nav-link" style={{ display:'flex', alignItems:'center', gap:4 }}>
                Solutions
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 5l3 3 3-3" stroke={MG} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              {megaOpen === 'solutions' && (
                <div className="mega-panel mega-panel-sm">
                  <p style={{ fontSize:10, fontWeight:700, color:MG, letterSpacing:2,
                    textTransform:'uppercase', marginBottom:14 }}>By Sector</p>
                  {SOLUTION_ITEMS.map(s => (
                    <Link key={s.name} href="/solutions"
                      style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px',
                        borderRadius:8, transition:'background .15s', color:N }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = GR}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                      <span style={{ width:7, height:7, borderRadius:'50%', background:s.color, flexShrink:0 }}/>
                      <span style={{ fontSize:13, fontWeight:500 }}>{s.name}</span>
                    </Link>
                  ))}
                  <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${BORDER}` }}>
                    <Link href="/solutions" style={{ fontSize:12, fontWeight:600, color:T,
                      display:'flex', alignItems:'center', gap:5 }}>All Solutions →</Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/methodology" className="nav-link">Methodology</Link>
            <Link href="/resources" className="nav-link">Resources</Link>
            <Link href="/about" className="nav-link">About</Link>

            <Link href="/login" style={{ background:T, color:'#fff', fontWeight:700, fontSize:14,
              padding:'10px 24px', borderRadius:6, display:'inline-block', transition:'opacity .18s' }}>
              Request Demo
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
            <Link href="/solutions"   onClick={() => setMenuOpen(false)}>Solutions</Link>
            <Link href="/methodology" onClick={() => setMenuOpen(false)}>Methodology</Link>
            <Link href="/resources"   onClick={() => setMenuOpen(false)}>Resources</Link>
            <Link href="/about"       onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/login" className="mob-cta" onClick={() => setMenuOpen(false)}>Request Demo</Link>
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
                omniRISK Active · TOC · HRO · FEMA · ISO 22301
              </span>
            </div>

            <h1 style={{ fontSize:'clamp(30px,3.8vw,54px)', fontWeight:700,
              lineHeight:1.1, color:N, marginBottom:24 }}>
              Resilience, Risk Management<br/>
              <span style={{ color:T }}>&amp; Business Continuity</span>
            </h1>

            <p style={{ color:MG, fontSize:16, lineHeight:1.85,
              maxWidth:540, marginBottom:40, fontWeight:400 }}>
              An integrated analytics platform for measuring, planning, and managing organizational
              resilience in multi-hazard urban environments using the omniRISK engine.
            </p>

            <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:40,
              flexDirection:isMobile?'column':'row' }}>
              <Link href="/login" className="btn-teal" style={{ fontSize:15, padding:'13px 32px', textAlign:'center' }}>
                Assess Your Organization →
              </Link>
              <Link href="/solutions" className="btn-outline" style={{ fontSize:15, padding:'12px 32px', textAlign:'center' }}>
                Explore Platform
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

      {/* ══ 3 ROAD CARDS ══════════════════════════════════════════ */}
      <section style={{ padding:isMobile?'48px 20px':'80px 48px', background:GR,
        borderTop:`1px solid ${BORDER}`, borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <p style={{ color:T, fontSize:12, fontWeight:700, letterSpacing:3,
              textTransform:'uppercase', marginBottom:12 }}>Explore</p>
            <h2 style={{ color:N, fontSize:'clamp(24px,3.2vw,38px)', fontWeight:700, lineHeight:1.15 }}>
              Three Ways Into the Platform
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
                6 integrated modules from risk scoring to crisis command — the complete
                BCM lifecycle in a single workspace.
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:28 }}>
                {[
                  { code:'omniRISK',   color:T,         desc:'Risk registry & HFER score' },
                  { code:'omniIMPACT', color:'#C8A84A', desc:'Business Impact Analysis' },
                  { code:'omniPLAN',   color:'#3B7EC8', desc:'BCM plan & RTO/RPO' },
                  { code:'omniCRISIS', color:R_O,       desc:'Crisis command center' },
                  { code:'omniAUDIT',  color:R_G,       desc:'Compliance audit' },
                  { code:'omniVENDOR', color:'#6366F1', desc:'Supply chain risk' },
                ].map(m => (
                  <div key={m.code} style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:m.color, flexShrink:0 }}/>
                    <span style={{ fontSize:12, fontWeight:700, color:m.color }}>{m.code}</span>
                    <span style={{ fontSize:12, color:MG }}>— {m.desc}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6, color:T, fontWeight:700, fontSize:14 }}>
                Explore Modules
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke={T} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>

            {/* Solutions */}
            <Link href="/solutions" className="road-card">
              <div style={{ width:52, height:52, borderRadius:14, background:`${R_O}14`,
                border:`1.5px solid ${R_O}30`, display:'flex', alignItems:'center',
                justifyContent:'center', marginBottom:24, fontSize:24 }}>🏭</div>
              <h3 style={{ color:N, fontSize:22, fontWeight:700, marginBottom:10 }}>Solutions</h3>
              <p style={{ color:MG, fontSize:14, lineHeight:1.75, marginBottom:24 }}>
                Purpose-built for Banking, Health, Industry, Public Sector and more —
                sector-calibrated risk frameworks aligned to international standards.
              </p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginBottom:28 }}>
                {[
                  { n:'Banking',    c:'#1565C0' }, { n:'Health',    c:R_R },
                  { n:'Industry',   c:R_O       }, { n:'Public',    c:T   },
                  { n:'Education',  c:'#3B7EC8' }, { n:'Infra.',    c:R_Y },
                  { n:'Tourism',    c:'#7B5EA7' }, { n:'Logistics', c:MG  },
                ].map(s => (
                  <span key={s.n} style={{ fontSize:11, fontWeight:600, padding:'4px 10px',
                    borderRadius:20, background:`${s.c}12`, color:s.c,
                    border:`1px solid ${s.c}25` }}>{s.n}</span>
                ))}
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6, color:R_O, fontWeight:700, fontSize:14 }}>
                View Solutions
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke={R_O} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>

            {/* Methodology */}
            <Link href="/methodology" className="road-card">
              <div style={{ width:52, height:52, borderRadius:14, background:`${'#7B5EA7'}14`,
                border:`1.5px solid ${'#7B5EA7'}30`, display:'flex', alignItems:'center',
                justifyContent:'center', marginBottom:24, fontSize:24 }}>📐</div>
              <h3 style={{ color:N, fontSize:22, fontWeight:700, marginBottom:10 }}>Methodology</h3>
              <p style={{ color:MG, fontSize:14, lineHeight:1.75, marginBottom:24 }}>
                The omniRISK engine, HFER-720 formula, HRO Alpha, TOC Bottleneck —
                academically grounded, operationally tested.
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:28 }}>
                {[
                  { t:'HFER-720', s:'URI = (H×F×E×B)/(1+k·C²)×HRO_α', c:'#7B5EA7' },
                  { t:'HRO',     s:'5 principles · Near Miss · α factor',  c:'#F97316' },
                  { t:'TOC',     s:'Bottleneck → Constraint → System',     c:R_R },
                  { t:'FEMA',    s:'32 Core Capabilities · 5 Mission Areas', c:'#3B7EC8' },
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
                Read Methodology
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke={'#7B5EA7'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ══ FEMA 5 MISSION AREAS ══════════════════════════════════ */}
      <section ref={femaSection.ref} style={{ padding:isMobile?'48px 20px':'80px 48px', background:BG }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <p style={{ color:'#3B7EC8', fontSize:12, fontWeight:700, letterSpacing:3,
              textTransform:'uppercase', marginBottom:12 }}>FEMA National Preparedness Goal</p>
            <h2 style={{ color:N, fontSize:'clamp(24px,3.2vw,38px)', fontWeight:700, lineHeight:1.15, marginBottom:16 }}>
              5 Mission Areas · 32 Core Capabilities
            </h2>
            <p style={{ color:MG, fontSize:16, lineHeight:1.75, maxWidth:580, margin:'0 auto' }}>
              Every omniRISK assessment maps directly to FEMA&apos;s Core Capabilities framework,
              giving your organization a globally recognized preparedness baseline.
            </p>
          </div>
          <div style={{ display:'grid',
            gridTemplateColumns:isMobile?'1fr':' repeat(5,1fr)',
            gap:16 }}>
            {FEMA_AREAS.map((area, i) => (
              <div key={area.phase} className="fema-card"
                style={{
                  borderTop:`4px solid ${area.color}`,
                  opacity:femaSection.inView?1:0,
                  transform:femaSection.inView?'translateY(0)':'translateY(24px)',
                  transition:`all .5s ease ${i*0.1}s`,
                }}>
                <img src={area.icon} alt={area.phase}
                  style={{ width:44, height:44, objectFit:'contain', marginBottom:14 }}/>
                <div style={{ fontSize:10, fontWeight:700, color:area.color,
                  letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>
                  FEMA Mission Area
                </div>
                <div style={{ fontSize:16, fontWeight:700, color:N, marginBottom:10 }}>{area.phase}</div>
                <p style={{ fontSize:12, color:MG, lineHeight:1.65, marginBottom:16 }}>{area.desc}</p>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {area.caps.map(c => (
                    <div key={c.label} style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <img src={c.icon} alt={c.label}
                        style={{ width:20, height:20, objectFit:'contain', flexShrink:0 }}/>
                      <span style={{ fontSize:11, color:N, fontWeight:500 }}>{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ LIVE METRICS BAND ════════════════════════════════════ */}
      <section ref={metricsSection.ref} style={{ background:T, padding:isMobile?'40px 20px':'64px 48px' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <p style={{ textAlign:'center', color:'rgba(255,255,255,0.6)', fontSize:11, fontWeight:700,
            letterSpacing:3, textTransform:'uppercase', marginBottom:44 }}>
            Live Platform Metrics · Real-Time Data
          </p>
          <div style={{ display:'grid',
            gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',
            gap:isMobile?20:0 }}>
            {[
              { target:metrics.tesis,   suffix:'', label:'Facilities Analyzed',  sub:'omniRISK score computed' },
              { target:metrics.kritik,  suffix:'', label:'Critical Risks Flagged', sub:'H_score ≥ 4 threshold'  },
              { target:metrics.mahalle, suffix:'M+', label:'TRY Value Protected',  sub:'Weighted MTPD coverage'  },
              { target:metrics.sektor,  suffix:'', label:'Sectors Covered',       sub:'Cross-sector analysis'   },
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

      {/* ══ STATS — Ncontracts style ══════════════════════════════ */}
      <section ref={statsSection.ref} style={{ padding:isMobile?'48px 20px':'80px 48px', background:GR,
        borderTop:`1px solid ${BORDER}`, borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <p style={{ color:T, fontSize:12, fontWeight:700, letterSpacing:3,
              textTransform:'uppercase', marginBottom:12 }}>Proven Impact</p>
            <h2 style={{ color:N, fontSize:'clamp(24px,3.2vw,38px)', fontWeight:700, lineHeight:1.15 }}>
              Numbers That Define Resilience
            </h2>
          </div>
          <div style={{ display:'grid',
            gridTemplateColumns:isMobile?'repeat(2,1fr)':'repeat(4,1fr)',
            gap:20 }}>
            {[
              { num:'720', unit:'pts', label:'HFER-720 Score Range', desc:'Multi-dimensional risk index covering hazard, fragility, exposure & capacity' },
              { num:'32',  unit:'',    label:'FEMA Core Capabilities', desc:'All mission areas mapped to assessment questions across 5 preparedness phases' },
              { num:'73',  unit:'Q',   label:'Banking Assessment', desc:'HIFYEA v2.0 — 73-question BDDK & Basel III aligned evaluation framework' },
              { num:'5',   unit:'',    label:'HRO Principles Tracked', desc:'Near-miss, simplification, operations focus, resilience & expertise deference' },
            ].map((s, i) => (
              <div key={i} className="stat-card"
                style={{
                  opacity:statsSection.inView?1:0,
                  transform:statsSection.inView?'translateY(0)':'translateY(20px)',
                  transition:`all .5s ease ${i*0.1}s`,
                }}>
                <div style={{ display:'flex', alignItems:'baseline', gap:4, justifyContent:'center', marginBottom:10 }}>
                  <span style={{ fontSize:52, fontWeight:800, color:T,
                    fontFamily:'DM Mono,monospace', lineHeight:1 }}>{s.num}</span>
                  {s.unit && <span style={{ fontSize:20, fontWeight:700, color:T }}>{s.unit}</span>}
                </div>
                <div style={{ fontSize:14, fontWeight:700, color:N, marginBottom:8 }}>{s.label}</div>
                <p style={{ fontSize:12, color:MG, lineHeight:1.65 }}>{s.desc}</p>
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
              textTransform:'uppercase', marginBottom:16 }}>Get Started</p>
            <h2 style={{ color:BG, fontSize:'clamp(26px,3.8vw,44px)', fontWeight:700,
              lineHeight:1.12, marginBottom:20 }}>
              Calculate Your<br/>Resilience Score →
            </h2>
            <p style={{ color:'rgba(255,255,255,0.55)', fontSize:16, lineHeight:1.75,
              maxWidth:480, margin:'0 auto 40px' }}>
              14-day free assessment. No installation, no credit card required.
              Our BCM advisor walks you through the platform together.
            </p>
            <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
              <Link href="/login" style={{ background:T, color:'#fff', fontWeight:700, fontSize:15,
                padding:'14px 40px', borderRadius:8, display:'inline-block', transition:'opacity .18s' }}>
                Start Free Assessment
              </Link>
              <a href="mailto:info@omniversel.com" style={{ border:'1.5px solid rgba(255,255,255,0.2)',
                color:'rgba(255,255,255,0.72)', fontWeight:600, fontSize:15, padding:'13px 32px',
                borderRadius:8, display:'inline-block', transition:'border-color .18s' }}>
                Contact Us
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
                <OmniverselLogo width={180} height={45} />
              </div>
              <p style={{ color:'rgba(255,255,255,0.45)', fontSize:13, lineHeight:1.75, maxWidth:280 }}>
                Integrated resilience analytics for multi-hazard urban environments.
                Powered by the omniRISK HFER-720 engine.
              </p>
            </div>
            <div>
              <p style={{ color:'rgba(255,255,255,0.35)', fontSize:10, fontWeight:700,
                letterSpacing:2, textTransform:'uppercase', marginBottom:16 }}>Platform</p>
              {[
                { label:'omniRISK',   href:'/products/omnirisk'   },
                { label:'omniIMPACT', href:'/products/omniimpact' },
                { label:'omniPLAN',   href:'/products/omniplan'   },
                { label:'omniCRISIS', href:'/products/omnicrisis' },
              ].map(l => (
                <Link key={l.label} href={l.href}
                  style={{ display:'block', color:'rgba(255,255,255,0.55)', fontSize:13,
                    marginBottom:10, transition:'color .15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'}>
                  {l.label}
                </Link>
              ))}
            </div>
            <div>
              <p style={{ color:'rgba(255,255,255,0.35)', fontSize:10, fontWeight:700,
                letterSpacing:2, textTransform:'uppercase', marginBottom:16 }}>Company</p>
              {[
                { label:'About',       href:'/about'       },
                { label:'Methodology', href:'/methodology' },
                { label:'Resources',   href:'/resources'   },
                { label:'Solutions',   href:'/solutions'   },
              ].map(l => (
                <Link key={l.label} href={l.href}
                  style={{ display:'block', color:'rgba(255,255,255,0.55)', fontSize:13,
                    marginBottom:10, transition:'color .15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'}>
                  {l.label}
                </Link>
              ))}
            </div>
            <div>
              <p style={{ color:'rgba(255,255,255,0.35)', fontSize:10, fontWeight:700,
                letterSpacing:2, textTransform:'uppercase', marginBottom:16 }}>Standards</p>
              {['ISO 22301','ISO 31000','FEMA NPG','Basel III','BDDK ISP','Sendai SF'].map(s => (
                <p key={s} style={{ color:'rgba(255,255,255,0.4)', fontSize:12, marginBottom:8 }}>{s}</p>
              ))}
            </div>
          </div>
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:24,
            display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
            <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12 }}>
              © 2026 Omniversel. All rights reserved.
            </p>
            <p style={{ color:'rgba(255,255,255,0.3)', fontSize:12 }}>
              omniRISK HFER-720 · ISO 22301 · FEMA NPG · HRO · TOC
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
