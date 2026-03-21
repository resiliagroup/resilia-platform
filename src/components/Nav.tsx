'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const C = {
  navy950: '#060D1A', navy900: '#0A1628', navy800: '#0F2240',
  teal: '#2D8A87', amber: '#F59E0B',
  white: '#FFFFFF', muted: '#94A3B8', dim: '#64748B',
  border: '#1E3A5F',
}
const FONT = "'Plus Jakarta Sans', sans-serif"

const PLATFORM_LINKS = [
  { label: 'omniRISK',   href: '/platform/omnirisk' },
  { label: 'omniIMPACT', href: '/platform/omniimpact' },
  { label: 'omniPLAN',   href: '/platform/omniplan' },
  { label: 'omniCRISIS', href: '/platform/omnicrisis' },
  { label: 'omniAUDIT',  href: '/platform/omniaudit' },
  { label: 'omniVENDOR', href: '/platform/omnivendor' },
  { label: 'omniHRO',    href: '/platform/omni-hro',  soon: true },
  { label: 'omniPIPE',   href: '/platform/omnipipe',  soon: true },
]

const SOLUTIONS_ALL = [
  { label: 'Banking & Finance',          href: '/solutions/banking' },
  { label: 'Healthcare',                 href: '/solutions/health' },
  { label: 'Energy & Utilities',         href: '/solutions/energy' },
  { label: 'Industrial',                 href: '/solutions/industrial' },
  { label: 'Manufacturing',              href: '/solutions/manufacturing' },
  { label: 'Insurance',                  href: '/solutions/insurance' },
  { label: 'Telecommunications',         href: '/solutions/telecom' },
  { label: 'Government',                 href: '/solutions/government' },
  { label: 'Public Sector',              href: '/solutions/public-sector' },
  { label: 'Education',                  href: '/solutions/education' },
]

const SOLUTIONS_LEFT = SOLUTIONS_ALL.slice(0, 7)
const SOLUTIONS_RIGHT = SOLUTIONS_ALL.slice(7)

function DropdownLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [hov, setHov] = useState(false)
  return (
    <Link href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'block', padding: '8px 12px', borderRadius: 6,
        fontSize: 14, color: hov ? C.white : C.muted,
        background: hov ? C.navy800 : 'transparent',
        transition: 'all 0.15s', fontFamily: FONT, textDecoration: 'none',
      }}>
      {children}
    </Link>
  )
}

interface NavProps {
  position?: 'sticky' | 'fixed'
  solid?: boolean
}

export default function Nav({ position = 'fixed', solid = false }: NavProps) {
  const [mounted, setMounted]                   = useState(false)
  const [isMobile, setIsMobile]                 = useState(false)
  const [mobileOpen, setMobileOpen]             = useState(false)
  const [mobilePlatformOpen, setMobilePlatformOpen] = useState(false)
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false)

  /* Desktop dropdown state */
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const platformTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const solutionsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setMounted(true)
    const check = () => setIsMobile(window.innerWidth < 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const bg = solid ? C.navy950 : 'rgba(6,13,26,0.92)'
  const backdropFilter = solid ? undefined : 'blur(12px)'

  const baseHeaderStyle: React.CSSProperties = {
    position, top: 0, left: 0, right: 0, zIndex: 300, height: 64,
    background: bg, backdropFilter,
    borderBottom: `1px solid ${C.border}`,
    display: 'flex', alignItems: 'center', padding: '0 24px',
    fontFamily: FONT,
  }

  const soonPill: React.CSSProperties = {
    border: `1px solid ${C.amber}`,
    color: C.amber,
    fontSize: '10px',
    padding: '1px 6px',
    borderRadius: '999px',
    marginLeft: '8px',
    whiteSpace: 'nowrap',
  }

  /* ── SSR stub — renders on server, replaced after mount ── */
  if (!mounted) {
    return (
      <header style={baseHeaderStyle}>
        <style>{`.nav-dd-link{font-size:13px;font-weight:500;color:#94A3B8;cursor:pointer;transition:color .15s;background:none;border:none;padding:0;font-family:'Plus Jakarta Sans',sans-serif}.nav-dd-link:hover{color:#fff}`}</style>
        <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: C.white, letterSpacing: -0.5, lineHeight: 1 }}>OMNIVERSEL</span>
              <span style={{ fontSize: 9, fontWeight: 500, color: C.dim, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 2 }}>Urban Resilience OS</span>
            </div>
          </Link>
        </div>
      </header>
    )
  }

  /* ── MOBILE NAV ─────────────────────────────────────────── */
  if (isMobile) {
    return (
      <>
        <header style={baseHeaderStyle}>
          <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: C.white, letterSpacing: -0.5, lineHeight: 1 }}>OMNIVERSEL</span>
                <span style={{ fontSize: 9, fontWeight: 500, color: C.dim, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 2 }}>Urban Resilience OS</span>
              </div>
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: C.muted }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6"  x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </header>

        {mobileOpen && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: C.navy950, zIndex: 400, overflowY: 'auto',
            display: 'flex', flexDirection: 'column', fontFamily: FONT,
          }}>
            {/* Overlay header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', height: 64, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
              <Link href="/" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', fontWeight: 800, fontSize: 18, color: C.white, letterSpacing: -0.5 }}>
                OMNIVERSEL
              </Link>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: 8 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6"  x2="6"  y2="18" />
                  <line x1="6"  y1="6"  x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Menu items */}
            <div style={{ flex: 1, padding: '8px 0' }}>

              {/* Platform accordion */}
              <div>
                <button
                  onClick={() => setMobilePlatformOpen(v => !v)}
                  style={{ width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${C.border}`, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontFamily: FONT }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: C.white }}>Platform</span>
                  <span style={{ fontSize: 12, color: C.dim }}>{mobilePlatformOpen ? '▲' : '▼'}</span>
                </button>
                {mobilePlatformOpen && (
                  <div style={{ background: C.navy900, borderBottom: `1px solid ${C.border}` }}>
                    {PLATFORM_LINKS.map(l => (
                      <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', padding: '12px 24px 12px 36px', color: C.muted, textDecoration: 'none', fontSize: 14, borderBottom: `1px solid ${C.navy800}` }}>
                        {l.label}
                        {l.soon && <span style={soonPill}>Soon</span>}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Solutions accordion */}
              <div>
                <button
                  onClick={() => setMobileSolutionsOpen(v => !v)}
                  style={{ width: '100%', background: 'none', border: 'none', borderBottom: `1px solid ${C.border}`, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontFamily: FONT }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: C.white }}>Solutions</span>
                  <span style={{ fontSize: 12, color: C.dim }}>{mobileSolutionsOpen ? '▲' : '▼'}</span>
                </button>
                {mobileSolutionsOpen && (
                  <div style={{ background: C.navy900, borderBottom: `1px solid ${C.border}` }}>
                    {SOLUTIONS_ALL.map(l => (
                      <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                        style={{ display: 'block', padding: '12px 24px 12px 36px', color: C.muted, textDecoration: 'none', fontSize: 14, borderBottom: `1px solid ${C.navy800}` }}>
                        {l.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Flat links */}
              {[['Methodology', '/methodology'], ['Pricing', '/pricing'], ['About', '/about'], ['Resources', '/resources']].map(([label, href]) => (
                <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                  style={{ display: 'block', padding: '16px 24px', fontSize: 16, fontWeight: 500, color: C.muted, textDecoration: 'none', borderBottom: `1px solid ${C.border}` }}>
                  {label}
                </Link>
              ))}
            </div>

            {/* Bottom CTAs */}
            <div style={{ padding: 24, borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
              <Link href="/login" onClick={() => setMobileOpen(false)} style={{
                display: 'block', textAlign: 'center', padding: 14,
                border: `1px solid ${C.border}`, borderRadius: 8,
                fontSize: 15, fontWeight: 500, color: C.muted, textDecoration: 'none',
              }}>Sign In</Link>
              <Link href="/login" onClick={() => setMobileOpen(false)} style={{
                display: 'block', textAlign: 'center', padding: 14,
                background: C.teal, borderRadius: 8,
                fontSize: 15, fontWeight: 600, color: C.white, textDecoration: 'none',
              }}>Request Demo</Link>
            </div>
          </div>
        )}
      </>
    )
  }

  /* ── DESKTOP NAV ────────────────────────────────────────── */
  const platOpen = openMenu === 'plat'
  const solOpen  = openMenu === 'sol'

  const openPlat  = () => { if (platformTimeoutRef.current) clearTimeout(platformTimeoutRef.current); setOpenMenu('plat') }
  const closePlat = () => { platformTimeoutRef.current = setTimeout(() => setOpenMenu(m => m === 'plat' ? null : m), 150) }
  const openSol   = () => { if (solutionsTimeoutRef.current) clearTimeout(solutionsTimeoutRef.current); setOpenMenu('sol') }
  const closeSol  = () => { solutionsTimeoutRef.current = setTimeout(() => setOpenMenu(m => m === 'sol' ? null : m), 150) }

  return (
    <header style={baseHeaderStyle}>
      <style>{`.nav-dd-link{font-size:13px;font-weight:500;color:#94A3B8;cursor:pointer;transition:color .15s;background:none;border:none;padding:0;font-family:'Plus Jakarta Sans',sans-serif}.nav-dd-link:hover{color:#fff}`}</style>

      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: C.white, letterSpacing: -0.5, lineHeight: 1 }}>OMNIVERSEL</span>
            <span style={{ fontSize: 9, fontWeight: 500, color: C.dim, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 2 }}>Urban Resilience OS</span>
          </div>
        </Link>

        {/* Center nav */}
        <nav style={{ display: 'flex', gap: 4, alignItems: 'center' }}>

          {/* Platform dropdown */}
          <div style={{ position: 'relative' }} onMouseEnter={openPlat} onMouseLeave={closePlat}>
            <button className="nav-dd-link" style={{ padding: '8px 14px', borderRadius: 6, background: platOpen ? C.navy800 : 'transparent', color: platOpen ? C.white : C.muted }}>
              Platform ▾
            </button>
            {platOpen && (
              <div onMouseEnter={openPlat} onMouseLeave={closePlat} style={{
                position: 'absolute', top: '100%', left: 0, zIndex: 50,
                marginTop: 4, background: C.navy900, border: `1px solid ${C.border}`,
                borderRadius: 12, padding: '16px 12px', minWidth: 220,
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: C.dim, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '0 12px', marginBottom: 8 }}>Modules</p>
                {PLATFORM_LINKS.map(l => (
                  <DropdownLink key={l.href} href={l.href}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span>{l.label}</span>
                      {l.soon && <span style={{ fontSize: 10, fontWeight: 700, color: C.amber, border: `1px solid ${C.amber}`, padding: '1px 6px', borderRadius: 9999, letterSpacing: '0.06em' }}>Soon</span>}
                    </span>
                  </DropdownLink>
                ))}
              </div>
            )}
          </div>

          {/* Solutions dropdown */}
          <div style={{ position: 'relative' }} onMouseEnter={openSol} onMouseLeave={closeSol}>
            <button className="nav-dd-link" style={{ padding: '8px 14px', borderRadius: 6, background: solOpen ? C.navy800 : 'transparent', color: solOpen ? C.white : C.muted }}>
              Solutions ▾
            </button>
            {solOpen && (
              <div onMouseEnter={openSol} onMouseLeave={closeSol} style={{
                position: 'absolute', top: '100%', left: 0, zIndex: 50,
                marginTop: 4, background: C.navy900, border: `1px solid ${C.border}`,
                borderRadius: 12, padding: 24, minWidth: 480,
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: C.dim, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>By Sector</p>
                    {SOLUTIONS_LEFT.map(l => <DropdownLink key={l.href} href={l.href}>{l.label}</DropdownLink>)}
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: C.dim, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>More Sectors</p>
                    {SOLUTIONS_RIGHT.map(l => <DropdownLink key={l.href} href={l.href}>{l.label}</DropdownLink>)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Flat links */}
          {[['Methodology', '/methodology'], ['Pricing', '/pricing'], ['About', '/about']].map(([label, href]) => (
            <Link key={href} href={href} className="nav-dd-link" style={{ padding: '8px 14px', borderRadius: 6 }}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Right CTAs */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link href="/login" style={{ fontSize: 13, fontWeight: 600, color: C.muted, fontFamily: FONT, textDecoration: 'none', padding: '8px 18px', borderRadius: 9999, border: `1px solid ${C.border}` }}>
            Sign In
          </Link>
          <Link href="/login" style={{ fontSize: 13, fontWeight: 700, color: C.white, fontFamily: FONT, textDecoration: 'none', background: C.teal, padding: '8px 20px', borderRadius: 9999 }}>
            Request Demo
          </Link>
        </div>
      </div>
    </header>
  )
}
