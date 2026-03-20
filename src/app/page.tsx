'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

/* ── tokens ───────────────────────────────────────────────────── */
const N      = '#0A1628'
const T      = '#2D8A87'
const MG     = '#566B66'
const BG     = '#FFFFFF'
const BORDER = '#E2E8F0'
const GR     = '#F8FAFB'

/* ── useWindowWidth ───────────────────────────────────────────── */
function useWindowWidth() {
  const [w, setW] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1024)
  useEffect(() => {
    const fn = () => setW(window.innerWidth); fn()
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return w
}

/* ── data ─────────────────────────────────────────────────────── */
const NAV_PLATFORM = [
  { code: 'omniRISK',   color: '#EF4444', href: '/platform/omnirisk',   desc: 'Quantitative risk scoring'         },
  { code: 'omniIMPACT', color: '#F97316', href: '/platform/omniimpact', desc: 'Business Impact Analysis'          },
  { code: 'omniPLAN',   color: '#3B82F6', href: '/platform/omniplan',   desc: 'ISO 22301 BCM planning'            },
  { code: 'omniCRISIS', color: '#8B5CF6', href: '/platform/omnicrisis', desc: 'Crisis command center'             },
  { code: 'omniAUDIT',  color: '#10B981', href: '/platform/omniaudit',  desc: 'Compliance & audit management'     },
  { code: 'omniVENDOR', color: '#6366F1', href: '/platform/omnivendor', desc: 'Supply chain resilience'           },
  { code: 'omniPIPE',   color: '#F59E0B', href: '/platform/omnipipe',   desc: 'Pipeline infrastructure risk'      },
  { code: 'omniHRO',    color: '#06B6D4', href: '/platform/omni-hro',   desc: 'High Reliability Organization'     },
]

const NAV_SOLUTIONS = [
  { name: 'Banking & Finance',       href: '/solutions/banking'  },
  { name: 'Healthcare & Hospital',   href: '/solutions/health'   },
  { name: 'Energy & Pipeline',       href: '/solutions/energy'   },
  { name: 'Industry & Manufacturing',href: '/solutions'          },
  { name: 'Public & Municipality',   href: '/solutions'          },
  { name: 'Education',               href: '/solutions'          },
  { name: 'Tourism & Hospitality',   href: '/solutions'          },
  { name: 'Logistics & Supply',      href: '/solutions'          },
]

const MODULES = [
  { code: 'omniRISK',   color: '#EF4444', bg: '#FEF2F2', border: '#FECACA', icon: 'Icon_MIT_06_Risk.png',         href: '/platform/omnirisk',   desc: 'Quantitative risk scoring for every facility',        badge: ''            },
  { code: 'omniIMPACT', color: '#F97316', bg: '#FFF7ED', border: '#FED7AA', icon: 'Icon_RESP_15_Situational.png', href: '/platform/omniimpact', desc: 'Business impact analysis and downtime cost modeling', badge: ''            },
  { code: 'omniPLAN',   color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE', icon: 'Icon_PREVENT_01_Planning.png', href: '/platform/omniplan',   desc: 'ISO 22301-aligned BCM planning with RTO/RPO tracking',badge: ''            },
  { code: 'omniCRISIS', color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE', icon: 'Icon_RESP_12_OnScene.png',     href: '/platform/omnicrisis', desc: 'Real-time crisis command and post-incident analysis',  badge: ''            },
  { code: 'omniAUDIT',  color: '#10B981', bg: '#F0FDF4', border: '#A7F3D0', icon: 'Icon_PROTECT_10_Risk.png',     href: '/platform/omniaudit',  desc: 'Compliance scorecards and regulatory gap tracking',    badge: ''            },
  { code: 'omniVENDOR', color: '#6366F1', bg: '#EEF2FF', border: '#C7D2FE', icon: 'Icon_PROTECT_11_Supply.png',   href: '/platform/omnivendor', desc: 'Third-party and supply chain risk assessment',         badge: ''            },
  { code: 'omniPIPE',   color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', icon: 'Icon_RESP_06_Environ.png',     href: '/platform/omnipipe',   desc: 'Pipeline, LNG and energy infrastructure risk',        badge: 'Coming Soon' },
  { code: 'omniHRO',    color: '#06B6D4', bg: '#ECFEFF', border: '#A5F3FC', icon: 'Icon_MIT_04_Community.png',    href: '/platform/omni-hro',   desc: 'Near miss analysis and reliability culture measurement',badge: 'Coming Soon' },
]

const DIFFERENTIATORS = [
  {
    title: 'Quantitative, Not Qualitative',
    body:  'Traditional 5×5 matrices leave risk undefined. Every Omniversel assessment produces a numeric score backed by a validated multi-parameter model — comparable across facilities, sectors and time.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="1.8" strokeLinecap="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    title: 'Operational, Not Compliant',
    body:  'Most BCM tools are built to pass audits. Omniversel is built to keep operations running when systems fail at 03:00 — with agile sprint boards, near-miss feeds and real-time command dashboards.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    title: 'Agile, Not Static',
    body:  'Annual risk assessments miss emerging threats. Omniversel runs continuous 15-day sprint cycles with real-time near-miss signal integration — turning operational data into resilience intelligence.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="1.8" strokeLinecap="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
  },
]

const SECTORS = ['Banking', 'Healthcare', 'Industry', 'Public Sector', 'Education', 'Critical Infrastructure', 'Tourism', 'Logistics']

const CASE_STUDIES = [
  {
    tag: 'Municipal Infrastructure',
    tagColor: '#3B82F6',
    metrics: [
      { val: '782', label: 'Facilities assessed' },
      { val: '103', label: 'Critical risk points' },
      { val: '6',   label: 'Sectors covered'     },
    ],
    body: 'Multi-hazard risk assessment across a metropolitan district. Cascade failure scenarios mapped for industrial clusters adjacent to residential zones. BCM plans established for 47 critical municipal functions.',
  },
  {
    tag: 'Financial Services',
    tagColor: '#1565C0',
    metrics: [
      { val: '<4h',  label: 'RTO established'   },
      { val: '73',   label: 'Assessment points' },
      { val: '100%', label: 'Regulatory aligned'},
    ],
    body: 'Multi-entity BCM assessment for financial institutions. RTO/RPO targets established per function. Full regulatory alignment verified including central bank operational resilience requirements.',
  },
]

/* ── Dashboard mock (hero right panel) ───────────────────────── */
function DashboardMock() {
  return (
    <div style={{ background: '#F8FAFB', border: `1px solid ${BORDER}`, borderRadius: 16,
      padding: 20, boxShadow: '0 4px 24px rgba(10,22,40,0.08)' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: N }}>Omniversel Platform</span>
        <span style={{ fontSize: 10, background: '#DCFCE7', color: '#15803D', borderRadius: 20,
          padding: '3px 10px', fontWeight: 700 }}>Live</span>
      </div>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 14 }}>
        {[['782','Facilities','#3B82F6'],['103','Critical','#EF4444'],['94%','Compliant','#10B981']].map(([v,l,c]) => (
          <div key={l} style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 10,
            padding: '10px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: c as string, lineHeight: 1 }}>{v}</div>
            <div style={{ fontSize: 9, color: MG, marginTop: 4, fontWeight: 600 }}>{l}</div>
          </div>
        ))}
      </div>
      {/* Risk bar chart */}
      <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '12px 12px 8px' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: MG, textTransform: 'uppercase',
          letterSpacing: 1, marginBottom: 10 }}>Risk Distribution</div>
        {[['Low','#10B981',38],['Medium','#F59E0B',27],['High','#F97316',22],['Critical','#EF4444',13]].map(([l,c,p]) => (
          <div key={l as string} style={{ marginBottom: 7 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 9, fontWeight: 600, color: c as string }}>{l}</span>
              <span style={{ fontSize: 9, color: MG }}>{p}%</span>
            </div>
            <div style={{ height: 5, background: `${c}22`, borderRadius: 3 }}>
              <div style={{ height: '100%', width: `${p}%`, background: c as string, borderRadius: 3 }}/>
            </div>
          </div>
        ))}
      </div>
      {/* Module pills */}
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginTop: 12 }}>
        {['omniRISK','omniPLAN','omniCRISIS','omniAUDIT'].map(m => (
          <span key={m} style={{ fontSize: 9, fontWeight: 700, padding: '4px 9px', borderRadius: 20,
            background: N, color: 'rgba(255,255,255,0.85)' }}>{m}</span>
        ))}
      </div>
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
  const screenW  = useWindowWidth()
  const isMobile = screenW < 768

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:${BG};color:${N};font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .nav-link{font-size:14px;font-weight:500;color:${N};transition:color .15s;cursor:pointer}
        .nav-link:hover{color:${T}}
        .mega-wrap{position:relative}
        .mega-panel{position:absolute;top:calc(100% + 10px);left:50%;transform:translateX(-50%);
          background:${BG};border-radius:14px;border:1px solid ${BORDER};
          box-shadow:0 12px 40px rgba(10,22,40,.09);padding:18px;min-width:360px;z-index:300}
        .mob-overlay{position:fixed;inset:0;background:rgba(10,22,40,.45);z-index:198;backdrop-filter:blur(4px)}
        .mob-menu{position:fixed;top:64px;left:0;right:0;background:${BG};z-index:199;
          border-bottom:1px solid ${BORDER};padding:20px 20px 28px;
          display:flex;flex-direction:column;gap:4px;animation:fadeIn .15s ease both}
        .mob-menu a,.mob-menu span{display:block;padding:11px 14px;border-radius:8px;
          font-size:15px;font-weight:600;color:${N};transition:background .12s;cursor:pointer}
        .mob-menu a:hover{background:${GR}}
        .mob-sep{height:1px;background:${BORDER};margin:8px 0}
        .mob-cta{background:${T}!important;color:#fff!important;border-radius:6px;text-align:center;margin-top:6px}
      `}</style>

      {/* ══ NAV ══════════════════════════════════════════════════ */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, height: 64,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${BORDER}` : '1px solid transparent',
        boxShadow: scrolled ? '0 1px 12px rgba(10,22,40,.06)' : 'none',
        transition: 'all .22s',
        display: 'flex', alignItems: 'center', padding: isMobile ? '0 20px' : '0 48px',
      }}>
        <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link href="/">
            <span style={{ fontSize: 18, fontWeight: 800, color: N, letterSpacing: -0.5, lineHeight: 1 }}>
              OMNIVERSEL
            </span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: isMobile ? 'none' : 'flex', gap: 32, alignItems: 'center' }}>

            {/* Platform dropdown */}
            <div className="mega-wrap"
              onMouseEnter={() => setMegaOpen('platform')}
              onMouseLeave={() => setMegaOpen(null)}>
              <span className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                Platform
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M3 5l3 3 3-3" stroke={MG} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              {megaOpen === 'platform' && (
                <div className="mega-panel" style={{ minWidth: 420 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: MG, letterSpacing: 2,
                    textTransform: 'uppercase', marginBottom: 12 }}>Platform Modules</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    {NAV_PLATFORM.map(p => (
                      <Link key={p.code} href={p.href}
                        style={{ display: 'flex', alignItems: 'flex-start', gap: 10,
                          padding: '9px 10px', borderRadius: 8, color: N, transition: 'background .12s' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = GR}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%',
                          background: p.color, flexShrink: 0, marginTop: 5 }}/>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: N }}>{p.code}</div>
                          <div style={{ fontSize: 11, color: MG, marginTop: 1 }}>{p.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Solutions dropdown */}
            <div className="mega-wrap"
              onMouseEnter={() => setMegaOpen('solutions')}
              onMouseLeave={() => setMegaOpen(null)}>
              <span className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                Solutions
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M3 5l3 3 3-3" stroke={MG} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              {megaOpen === 'solutions' && (
                <div className="mega-panel" style={{ minWidth: 240 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: MG, letterSpacing: 2,
                    textTransform: 'uppercase', marginBottom: 12 }}>By Sector</p>
                  {NAV_SOLUTIONS.map(s => (
                    <Link key={s.name} href={s.href}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                        borderRadius: 8, color: N, fontSize: 13, fontWeight: 500, transition: 'background .12s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = GR}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}>
                      {s.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/methodology" className="nav-link">Methodology</Link>
            <Link href="/resources"   className="nav-link">Resources</Link>
            <Link href="/pricing"     className="nav-link">Pricing</Link>
            <Link href="/about"       className="nav-link">About</Link>

            <Link href="/login" style={{ background: T, color: '#fff', fontWeight: 700,
              fontSize: 14, padding: '10px 24px', borderRadius: 6, transition: 'opacity .15s',
              display: 'inline-block' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.88'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}>
              Request Demo
            </Link>
          </nav>

          {/* Hamburger */}
          {isMobile && (
            <button onClick={() => setMenuOpen(o => !o)}
              style={{ background: 'none', border: 'none', cursor: 'pointer',
                padding: 6, color: N, fontSize: 22, lineHeight: 1, display: 'flex',
                alignItems: 'center', justifyContent: 'center' }}>
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
            <Link href="/platform/omnirisk" onClick={() => setMenuOpen(false)}>Platform</Link>
            <Link href="/solutions"         onClick={() => setMenuOpen(false)}>Solutions</Link>
            <Link href="/methodology"       onClick={() => setMenuOpen(false)}>Methodology</Link>
            <Link href="/resources"         onClick={() => setMenuOpen(false)}>Resources</Link>
            <Link href="/pricing"           onClick={() => setMenuOpen(false)}>Pricing</Link>
            <Link href="/about"             onClick={() => setMenuOpen(false)}>About</Link>
            <div className="mob-sep"/>
            <Link href="/login" className="mob-cta" onClick={() => setMenuOpen(false)}>
              Request Demo
            </Link>
          </div>
        </>
      )}

      {/* ══ HERO ═════════════════════════════════════════════════ */}
      <section style={{
        padding: isMobile ? '100px 20px 72px' : '140px 48px 100px',
        background: BG,
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? 48 : 80,
          alignItems: 'center',
        }}>
          {/* Left */}
          <div style={{ animation: 'fadeUp .65s ease both' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: T, letterSpacing: 3,
              textTransform: 'uppercase', marginBottom: 24 }}>
              Enterprise Resilience Platform
            </p>
            <h1 style={{ fontSize: 'clamp(36px,4.2vw,64px)', fontWeight: 800,
              lineHeight: 1.08, color: N, marginBottom: 20, letterSpacing: '-0.025em' }}>
              Resilience,<br/>Reimagined.
            </h1>
            <p style={{ color: MG, fontSize: 'clamp(15px,1.5vw,18px)', lineHeight: 1.75,
              maxWidth: 520, marginBottom: 40, fontWeight: 400 }}>
              An integrated platform for organizational resilience — disaster risk,
              business continuity and crisis management unified in one workspace.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap',
              flexDirection: isMobile ? 'column' : 'row' }}>
              <Link href="/platform/omnirisk"
                style={{ background: N, color: '#fff', fontWeight: 700, fontSize: 15,
                  padding: '13px 32px', borderRadius: 7, display: 'inline-block',
                  transition: 'opacity .15s' }}>
                Explore Platform →
              </Link>
              <Link href="/login"
                style={{ border: `1.5px solid ${BORDER}`, color: N, fontWeight: 600,
                  fontSize: 15, padding: '12px 28px', borderRadius: 7,
                  display: 'inline-block', transition: 'border-color .15s' }}>
                Request Demo
              </Link>
            </div>
          </div>

          {/* Right — dashboard mock */}
          {!isMobile && (
            <div style={{ animation: 'fadeIn .8s ease .2s both' }}>
              <DashboardMock />
            </div>
          )}
        </div>
      </section>

      {/* ══ PLATFORM MODULES ═════════════════════════════════════ */}
      <section style={{ padding: isMobile ? '56px 20px' : '88px 48px',
        background: GR, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ color: T, fontSize: 11, fontWeight: 700, letterSpacing: 3,
              textTransform: 'uppercase', marginBottom: 14 }}>Platform</p>
            <h2 style={{ color: N, fontSize: 'clamp(24px,3vw,40px)', fontWeight: 700,
              lineHeight: 1.15, marginBottom: 14 }}>
              One Platform. Every Risk.
            </h2>
            <p style={{ color: MG, fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
              Six integrated modules covering the complete resilience lifecycle.
            </p>
          </div>
          <div style={{ display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)',
            gap: 16 }}>
            {MODULES.map(m => (
              <Link key={m.code} href={m.href}
                style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 14,
                  padding: '22px 18px', display: 'flex', flexDirection: 'column', gap: 12,
                  textDecoration: 'none', color: N, position: 'relative',
                  transition: 'all .2s' }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = m.color
                  el.style.transform   = 'translateY(-3px)'
                  el.style.boxShadow   = `0 8px 24px ${m.color}18`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.borderColor = BORDER
                  el.style.transform   = 'translateY(0)'
                  el.style.boxShadow   = 'none'
                }}>
                {m.badge && (
                  <span style={{ position: 'absolute', top: 10, right: 10, fontSize: 9,
                    fontWeight: 700, background: `${m.color}18`, color: m.color,
                    padding: '3px 8px', borderRadius: 20, letterSpacing: 0.5,
                    textTransform: 'uppercase' }}>
                    {m.badge}
                  </span>
                )}
                <div style={{ width: 40, height: 40, borderRadius: 10, background: m.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={`/icons/${m.icon}`} width={22} height={22} alt={m.code}
                    style={{ objectFit: 'contain' }}/>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: m.color,
                    letterSpacing: 0.3, marginBottom: 5 }}>{m.code}</div>
                  <p style={{ fontSize: 12, color: MG, lineHeight: 1.6 }}>{m.desc}</p>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: m.color,
                  marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 3 }}>
                  Learn more
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke={m.color} strokeWidth="1.6"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BUILT DIFFERENT ══════════════════════════════════════ */}
      <section style={{ padding: isMobile ? '56px 20px' : '88px 48px', background: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ color: T, fontSize: 11, fontWeight: 700, letterSpacing: 3,
              textTransform: 'uppercase', marginBottom: 14 }}>Why Omniversel</p>
            <h2 style={{ color: N, fontSize: 'clamp(24px,3vw,40px)', fontWeight: 700, lineHeight: 1.15 }}>
              Built Different.
            </h2>
          </div>
          <div style={{ display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)',
            gap: 24 }}>
            {DIFFERENTIATORS.map(d => (
              <div key={d.title} style={{ border: `1px solid ${BORDER}`, borderRadius: 16,
                padding: '32px 28px', background: BG }}>
                <div style={{ width: 52, height: 52, borderRadius: 14,
                  background: `${T}10`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', marginBottom: 20 }}>
                  {d.icon}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: N, marginBottom: 12,
                  lineHeight: 1.2 }}>{d.title}</h3>
                <p style={{ fontSize: 14, color: MG, lineHeight: 1.75 }}>{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECTORS BAND ═════════════════════════════════════════ */}
      <section style={{ padding: isMobile ? '40px 20px' : '48px 48px',
        background: GR, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: MG, letterSpacing: 2.5,
            textTransform: 'uppercase', marginBottom: 24 }}>
            Trusted across sectors
          </p>
          <div style={{ display: 'flex', gap: isMobile ? 16 : 32,
            justifyContent: 'center', flexWrap: 'wrap' }}>
            {SECTORS.map((s, i) => (
              <span key={s} style={{ fontSize: 14, fontWeight: 600, color: MG,
                opacity: 0.7, whiteSpace: 'nowrap' }}>
                {s}{i < SECTORS.length - 1 && (
                  <span style={{ marginLeft: isMobile ? 16 : 32, color: BORDER }}>·</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CASE STUDIES ═════════════════════════════════════════ */}
      <section style={{ padding: isMobile ? '56px 20px' : '88px 48px', background: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ color: T, fontSize: 11, fontWeight: 700, letterSpacing: 3,
              textTransform: 'uppercase', marginBottom: 14 }}>Results</p>
            <h2 style={{ color: N, fontSize: 'clamp(24px,3vw,40px)', fontWeight: 700, lineHeight: 1.15 }}>
              Real Deployments. Measurable Outcomes.
            </h2>
          </div>
          <div style={{ display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: 24 }}>
            {CASE_STUDIES.map(c => (
              <div key={c.tag} style={{ border: `1px solid ${BORDER}`, borderRadius: 16,
                padding: '36px 32px', background: BG }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px',
                  borderRadius: 20, background: `${c.tagColor}12`,
                  color: c.tagColor, letterSpacing: 0.5, marginBottom: 28,
                  display: 'inline-block' }}>
                  {c.tag}
                </span>
                <div style={{ display: 'flex', gap: 20, marginBottom: 24, marginTop: 16 }}>
                  {c.metrics.map(m => (
                    <div key={m.label}>
                      <div style={{ fontSize: 32, fontWeight: 800, color: N,
                        lineHeight: 1, letterSpacing: '-0.02em' }}>{m.val}</div>
                      <div style={{ fontSize: 11, color: MG, marginTop: 5,
                        fontWeight: 500 }}>{m.label}</div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 14, color: MG, lineHeight: 1.75 }}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA BAND ═════════════════════════════════════════════ */}
      <section style={{ background: N, padding: isMobile ? '64px 20px' : '88px 48px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ color: '#fff', fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 700,
            lineHeight: 1.12, marginBottom: 16, letterSpacing: '-0.015em' }}>
            Start with a free assessment.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 17, lineHeight: 1.7,
            maxWidth: 440, margin: '0 auto 40px' }}>
            No commitment. No installation. Our advisor walks you through.
          </p>
          <Link href="/login" style={{ background: T, color: '#fff', fontWeight: 700,
            fontSize: 16, padding: '15px 48px', borderRadius: 8, display: 'inline-block',
            transition: 'opacity .15s' }}>
            Request Free Assessment →
          </Link>
        </div>
      </section>

      {/* ══ FOOTER ═══════════════════════════════════════════════ */}
      <footer style={{ background: '#080F1C', padding: isMobile ? '48px 20px 28px' : '64px 48px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : '2fr 1fr 1fr 1fr',
            gap: isMobile ? 32 : 48, marginBottom: 48 }}>

            {/* Brand */}
            <div>
              <span style={{ fontSize: 17, fontWeight: 800, color: '#fff',
                letterSpacing: -0.5, display: 'block', marginBottom: 14 }}>
                OMNIVERSEL
              </span>
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, lineHeight: 1.75, maxWidth: 260 }}>
                Integrated resilience analytics for multi-hazard urban environments.
              </p>
            </div>

            {/* Platform */}
            <div>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700,
                letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Platform</p>
              {[
                { label: 'omniRISK',   href: '/platform/omnirisk'   },
                { label: 'omniPLAN',   href: '/platform/omniplan'   },
                { label: 'omniCRISIS', href: '/platform/omnicrisis' },
                { label: 'omniAUDIT',  href: '/platform/omniaudit'  },
              ].map(l => (
                <Link key={l.label} href={l.href}
                  style={{ display: 'block', color: 'rgba(255,255,255,0.48)',
                    fontSize: 13, marginBottom: 10, transition: 'color .14s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.48)'}>
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Solutions */}
            <div>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700,
                letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Solutions</p>
              {[
                { label: 'Banking',    href: '/solutions/banking' },
                { label: 'Healthcare', href: '/solutions/health'  },
                { label: 'Energy',     href: '/solutions/energy'  },
                { label: 'Industry',   href: '/solutions'         },
              ].map(l => (
                <Link key={l.label} href={l.href}
                  style={{ display: 'block', color: 'rgba(255,255,255,0.48)',
                    fontSize: 13, marginBottom: 10, transition: 'color .14s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.48)'}>
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Company */}
            <div>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700,
                letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Company</p>
              {[
                { label: 'About',       href: '/about'       },
                { label: 'Methodology', href: '/methodology' },
                { label: 'Resources',   href: '/resources'   },
                { label: 'Pricing',     href: '/pricing'     },
              ].map(l => (
                <Link key={l.label} href={l.href}
                  style={{ display: 'block', color: 'rgba(255,255,255,0.48)',
                    fontSize: 13, marginBottom: 10, transition: 'color .14s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.48)'}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 24,
            display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>
              © 2026 Omniversel. All rights reserved.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>
              Resilience Analytics · Business Continuity · Crisis Management
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
