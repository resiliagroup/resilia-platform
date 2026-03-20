'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

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

/* ═══════════════════════════════════════════════════════════════
   PAGE DATA
═══════════════════════════════════════════════════════════════ */
const PLATFORM_ITEMS = [
  { code:'omniRISK',   color:'#EF4444', href:'/platform/omnirisk',   desc:'Quantitative risk scoring' },
  { code:'omniIMPACT', color:'#F97316', href:'/platform/omniimpact', desc:'Business Impact Analysis' },
  { code:'omniPLAN',   color:'#3B82F6', href:'/platform/omniplan',   desc:'ISO 22301 BCM planning' },
  { code:'omniCRISIS', color:'#8B5CF6', href:'/platform/omnicrisis', desc:'Crisis command center' },
  { code:'omniAUDIT',  color:'#10B981', href:'/platform/omniaudit',  desc:'Compliance & Sendai audit' },
  { code:'omniVENDOR', color:'#6366F1', href:'/platform/omnivendor', desc:'Supply chain resilience' },
  { code:'omniPIPE',   color:'#F59E0B', href:'/platform/omnipipe',   desc:'Pipeline infrastructure risk' },
  { code:'omniHRO',    color:'#06B6D4', href:'/platform/omni-hro',   desc:'High Reliability Organization' },
]

const SOLUTION_ITEMS = [
  { name:'Banking & Finance',        href:'/solutions/banking', color:'#1565C0' },
  { name:'Health & Hospital',        href:'/solutions/health',  color:'#EF4444' },
  { name:'Energy & Pipeline',        href:'/solutions/energy',  color:'#F59E0B' },
  { name:'Industry & Manufacturing', href:'/solutions',         color:'#F97316' },
  { name:'Public & Municipality',    href:'/solutions',         color:T         },
  { name:'Education',                href:'/solutions',         color:'#3B7EC8' },
  { name:'Tourism & Hospitality',    href:'/solutions',         color:'#7B5EA7' },
  { name:'Logistics & Supply',       href:'/solutions',         color:MG        },
]

const MODULES_GRID = [
  { code:'omniRISK',   color:'#EF4444', bg:'#FEF2F2', icon:'Icon_MIT_06_Risk.png',           href:'/platform/omnirisk',   desc:'Quantitative risk scoring using the HFER-720 URI formula', badge:'' },
  { code:'omniIMPACT', color:'#F97316', bg:'#FFF7ED', icon:'Icon_RESP_15_Situational.png',   href:'/platform/omniimpact', desc:'Business impact analysis, downtime cost modeling & MTPD',  badge:'' },
  { code:'omniPLAN',   color:'#3B82F6', bg:'#EFF6FF', icon:'Icon_PREVENT_01_Planning.png',   href:'/platform/omniplan',   desc:'ISO 22301-aligned BCM planning with RTO/RPO tracking',    badge:'' },
  { code:'omniCRISIS', color:'#8B5CF6', bg:'#F5F3FF', icon:'Icon_RESP_12_OnScene.png',       href:'/platform/omnicrisis', desc:'Real-time crisis command, HEICS protocols & post-mortem',  badge:'' },
  { code:'omniAUDIT',  color:'#10B981', bg:'#F0FDF4', icon:'Icon_PROTECT_10_Risk.png',       href:'/platform/omniaudit',  desc:'Sendai Framework & ISO 22301 compliance scorecards',       badge:'' },
  { code:'omniVENDOR', color:'#6366F1', bg:'#EEF2FF', icon:'Icon_PROTECT_11_Supply.png',     href:'/platform/omnivendor', desc:'Third-party & supply chain risk assessment',               badge:'' },
  { code:'omniPIPE',   color:'#F59E0B', bg:'#FFFBEB', icon:'Icon_RESP_06_Environ.png',       href:'/platform/omnipipe',   desc:'Pipeline, LNG & energy infrastructure NATECH risk',        badge:'Coming Soon' },
  { code:'omniHRO',    color:'#06B6D4', bg:'#ECFEFF', icon:'Icon_MIT_04_Community.png',      href:'/platform/omni-hro',   desc:'Near miss analysis, HRO Alpha scoring & reliability culture', badge:'Coming Soon' },
]

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

  const femaSection = useInView(0.15)

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
        .fema-card{background:${BG};border:1px solid ${BORDER};border-radius:16px;padding:28px 24px;transition:all .22s}
        .fema-card:hover{transform:translateY(-3px);box-shadow:0 8px 32px rgba(10,22,40,.1)}
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
            <div style={{ display:'flex', flexDirection:'column' }}>
              <span style={{ fontSize:18, fontWeight:800, color:N, letterSpacing:-0.5, lineHeight:1 }}>OMNIVERSEL</span>
              <span style={{ fontSize:10, fontWeight:500, color:MG, letterSpacing:1.5, textTransform:'uppercase', marginTop:2 }}>Urban Resilience OS</span>
            </div>
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
                    <Link href="/platform/omnirisk" style={{ fontSize:12, fontWeight:600, color:T,
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
                    <Link key={s.name} href={s.href}
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
            <Link href="/pricing" className="nav-link">Pricing</Link>
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
              <div style={{ display:'flex', flexDirection:'column' }}>
                <span style={{ fontSize:18, fontWeight:800, color:N, letterSpacing:-0.5, lineHeight:1 }}>OMNIVERSEL</span>
                <span style={{ fontSize:10, fontWeight:500, color:MG, letterSpacing:1.5, textTransform:'uppercase', marginTop:2 }}>Urban Resilience OS</span>
              </div>
            </div>
            <div className="mob-sep"/>
            <Link href="/solutions"   onClick={() => setMenuOpen(false)}>Solutions</Link>
            <Link href="/methodology" onClick={() => setMenuOpen(false)}>Methodology</Link>
            <Link href="/resources"   onClick={() => setMenuOpen(false)}>Resources</Link>
            <Link href="/pricing"     onClick={() => setMenuOpen(false)}>Pricing</Link>
            <Link href="/about"       onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/login" className="mob-cta" onClick={() => setMenuOpen(false)}>Request Demo</Link>
          </div>
        </>
      )}

      {/* ══ SECTION 1: HERO ══════════════════════════════════════ */}
      <section style={{ padding:isMobile?'120px 20px 80px':'160px 48px 100px', background:BG }}>
        <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center', animation:'fadeUp .7s ease both' }}>

          {/* Badge */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:8,
            background:`${T}12`, border:`1px solid ${T}30`, borderRadius:20,
            padding:'5px 16px', marginBottom:32 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:T, display:'inline-block' }}/>
            <span style={{ color:T, fontSize:12, fontWeight:600, letterSpacing:1 }}>
              omniRISK Active · TOC · HRO · FEMA · ISO 22301
            </span>
          </div>

          {/* Tagline */}
          <h1 style={{ fontSize:'clamp(40px,5.5vw,72px)', fontWeight:800,
            lineHeight:1.08, color:N, marginBottom:24, letterSpacing:'-0.025em' }}>
            Resilience,{' '}
            <span style={{ color:T }}>Reimagined.</span>
          </h1>

          {/* Subtitle */}
          <p style={{ color:MG, fontSize:'clamp(16px,1.8vw,20px)', lineHeight:1.7,
            maxWidth:660, margin:'0 auto 48px', fontWeight:400 }}>
            The first platform to unify omniRISK scoring, crisis command, and agile BCM sprints —
            purpose-built for multi-hazard urban environments.
          </p>

          {/* CTAs */}
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', marginBottom:72 }}>
            <Link href="/platform/omnirisk" style={{ background:N, color:'#fff', fontWeight:700,
              fontSize:15, padding:'14px 36px', borderRadius:8, display:'inline-block',
              transition:'opacity .18s' }}>
              Explore Platform →
            </Link>
            <Link href="/login" style={{ border:`1.5px solid ${BORDER}`, color:N,
              fontWeight:600, fontSize:15, padding:'13px 32px', borderRadius:8,
              display:'inline-block', transition:'border-color .18s' }}>
              Request Demo
            </Link>
          </div>

          {/* Trust logos band */}
          <div>
            <p style={{ color:MG, fontSize:11, fontWeight:600, letterSpacing:2,
              textTransform:'uppercase', marginBottom:20 }}>
              Trusted by critical infrastructure operators
            </p>
            <div style={{ display:'flex', gap:32, justifyContent:'center', alignItems:'center',
              flexWrap:'wrap', opacity:0.5 }}>
              {[
                'Beylikdüzü Municipality',
                'İTÜ AYM',
                'NEFES Network',
                'AFAD Aligned',
              ].map(name => (
                <span key={name} style={{ fontSize:12, fontWeight:700, color:MG,
                  letterSpacing:0.5, textTransform:'uppercase' }}>{name}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECTION 2: PLATFORM MODULES GRID ════════════════════ */}
      <section style={{ padding:isMobile?'48px 20px':'80px 48px', background:GR,
        borderTop:`1px solid ${BORDER}`, borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:52 }}>
            <p style={{ color:T, fontSize:12, fontWeight:700, letterSpacing:3,
              textTransform:'uppercase', marginBottom:12 }}>Platform</p>
            <h2 style={{ color:N, fontSize:'clamp(26px,3.2vw,40px)', fontWeight:700, lineHeight:1.15 }}>
              One Platform. Every Risk.
            </h2>
          </div>
          <div style={{ display:'grid',
            gridTemplateColumns:isMobile?'1fr 1fr':'repeat(4,1fr)', gap:16 }}>
            {MODULES_GRID.map(m => (
              <Link key={m.code} href={m.href}
                style={{ background:BG, border:`1px solid ${BORDER}`, borderRadius:16,
                  padding:'24px 20px', display:'flex', flexDirection:'column', gap:14,
                  transition:'all .22s', textDecoration:'none', color:N, position:'relative' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor=m.color; el.style.transform='translateY(-3px)'; el.style.boxShadow=`0 8px 24px ${m.color}18` }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor=BORDER; el.style.transform='translateY(0)'; el.style.boxShadow='none' }}>
                {m.badge && (
                  <span style={{ position:'absolute', top:12, right:12, fontSize:9,
                    fontWeight:700, background:`${m.color}18`, color:m.color,
                    padding:'3px 8px', borderRadius:20, letterSpacing:0.5, textTransform:'uppercase' }}>
                    {m.badge}
                  </span>
                )}
                <div style={{ width:44, height:44, borderRadius:12, background:m.bg,
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <img src={`/icons/${m.icon}`} width={24} height={24} alt={m.code}
                    style={{ objectFit:'contain' }} />
                </div>
                <div>
                  <div style={{ fontSize:14, fontWeight:800, color:m.color,
                    fontFamily:'DM Mono,monospace', letterSpacing:0.5, marginBottom:6 }}>{m.code}</div>
                  <p style={{ fontSize:12, color:MG, lineHeight:1.65 }}>{m.desc}</p>
                </div>
                <div style={{ fontSize:12, fontWeight:600, color:m.color, marginTop:'auto',
                  display:'flex', alignItems:'center', gap:4 }}>
                  Learn more
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke={m.color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTION 3: FEMA 5 MISSION AREAS ═════════════════════ */}
      <section ref={femaSection.ref} style={{ padding:isMobile?'48px 20px':'64px 48px', background:BG }}>
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
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {/* Row 1: 2 cards */}
            <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr', gap:20 }}>
              {FEMA_AREAS.slice(0,2).map((area, i) => (
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
            {/* Row 2: 3 cards */}
            <div style={{ display:'grid', gridTemplateColumns:isMobile?'1fr':'1fr 1fr 1fr', gap:20 }}>
              {FEMA_AREAS.slice(2).map((area, i) => (
                <div key={area.phase} className="fema-card"
                  style={{
                    borderTop:`4px solid ${area.color}`,
                    opacity:femaSection.inView?1:0,
                    transform:femaSection.inView?'translateY(0)':'translateY(24px)',
                    transition:`all .5s ease ${(i+2)*0.1}s`,
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
        </div>
      </section>

      {/* ══ SECTION 4: CTA BAND ══════════════════════════════════ */}
      <section style={{ background:N, padding:isMobile?'64px 20px':'80px 48px' }}>
        <div style={{ maxWidth:720, margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ color:'#fff', fontSize:'clamp(28px,3.8vw,44px)', fontWeight:700,
            lineHeight:1.12, marginBottom:20 }}>
            Start with a free assessment →
          </h2>
          <p style={{ color:'rgba(255,255,255,0.55)', fontSize:17, lineHeight:1.75,
            maxWidth:480, margin:'0 auto 40px' }}>
            14-day free trial. No installation required. Our BCM advisor walks you through together.
          </p>
          <Link href="/login" style={{ background:T, color:'#fff', fontWeight:700,
            fontSize:16, padding:'16px 48px', borderRadius:8, display:'inline-block',
            transition:'opacity .18s' }}>
            Request Free Assessment
          </Link>
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
                <div style={{ display:'flex', flexDirection:'column' }}>
                  <span style={{ fontSize:18, fontWeight:800, color:'#FFFFFF', letterSpacing:-0.5, lineHeight:1 }}>OMNIVERSEL</span>
                  <span style={{ fontSize:10, fontWeight:500, color:'rgba(255,255,255,0.5)', letterSpacing:1.5, textTransform:'uppercase', marginTop:2 }}>Urban Resilience OS</span>
                </div>
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
                { label:'omniRISK',   href:'/platform/omnirisk'   },
                { label:'omniIMPACT', href:'/platform/omniimpact' },
                { label:'omniPLAN',   href:'/platform/omniplan'   },
                { label:'omniCRISIS', href:'/platform/omnicrisis' },
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
