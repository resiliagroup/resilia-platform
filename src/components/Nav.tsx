'use client'
import { useState, useRef, useEffect } from 'react'
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

const SOLUTIONS_LEFT = [
  { label: 'Banking & Finance',          href: '/solutions/banking' },
  { label: 'Healthcare',                 href: '/solutions/health' },
  { label: 'Energy & Utilities',         href: '/solutions/energy' },
  { label: 'Industrial & Manufacturing', href: '/solutions/industrial' },
  { label: 'Manufacturing',              href: '/solutions/manufacturing' },
  { label: 'Public Sector',              href: '/solutions/public-sector' },
  { label: 'Education',                  href: '/solutions/education' },
]

const SOLUTIONS_RIGHT = [
  { label: 'Insurance',          href: '/solutions/insurance' },
  { label: 'Telecommunications', href: '/solutions/telecom' },
  { label: 'Government',         href: '/solutions/government' },
]

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
  /* Desktop dropdowns */
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const platRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const solRef  = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openPlat  = () => { if (platRef.current) clearTimeout(platRef.current); setOpenMenu('plat') }
  const closePlat = () => { platRef.current = setTimeout(() => setOpenMenu(m => m === 'plat' ? null : m), 150) }
  const openSol   = () => { if (solRef.current)  clearTimeout(solRef.current);  setOpenMenu('sol') }
  const closeSol  = () => { solRef.current  = setTimeout(() => setOpenMenu(m => m === 'sol'  ? null : m), 150) }

  const platOpen = openMenu === 'plat'
  const solOpen  = openMenu === 'sol'

  /* Mobile */
  const [isMobile, setIsMobile]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [platAcc, setPlatAcc]       = useState(false)
  const [solAcc, setSolAcc]         = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  /* Lock scroll when overlay open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const bg = solid ? C.navy950 : 'rgba(6,13,26,0.92)'
  const backdropFilter = solid ? undefined : 'blur(12px)'

  return (
    <>
      <header style={{
        position, top: 0, left: 0, right: 0, zIndex: 300, height: 64,
        background: bg, backdropFilter, borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', padding: '0 24px', fontFamily: FONT,
      }}>
        <style>{`
          .nav-dd-link{font-size:13px;font-weight:500;color:#94A3B8;cursor:pointer;transition:color .15s;background:none;border:none;padding:0;font-family:'Plus Jakarta Sans',sans-serif}
          .nav-dd-link:hover{color:#fff}
        `}</style>

        <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: C.white, letterSpacing: -0.5, lineHeight: 1 }}>OMNIVERSEL</span>
              <span style={{ fontSize: 9, fontWeight: 500, color: C.dim, letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 2 }}>Urban Resilience OS</span>
            </div>
          </Link>

          {/* Desktop center nav */}
          {!isMobile && (
            <nav style={{ display: 'flex', gap: 4, alignItems: 'center' }}>

              {/* Platform dropdown */}
              <div style={{ position: 'relative' }} onMouseEnter={openPlat} onMouseLeave={closePlat}>
                <button className="nav-dd-link" style={{
                  padding: '8px 14px', borderRadius: 6,
                  background: platOpen ? C.navy800 : 'transparent',
                  color: platOpen ? C.white : C.muted,
                }}>Platform ▾</button>
                {platOpen && (
                  <div onMouseEnter={openPlat} onMouseLeave={closePlat} style={{
                    position: 'absolute', top: '100%', left: 0, zIndex: 50,
                    marginTop: 4, background: C.navy900,
                    border: `1px solid ${C.border}`, borderRadius: 12,
                    padding: '16px 12px', minWidth: 220,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: C.dim, letterSpacing: '0.14em',
                      textTransform: 'uppercase', padding: '0 12px', marginBottom: 8 }}>Modules</p>
                    {PLATFORM_LINKS.map(l => (
                      <DropdownLink key={l.href} href={l.href}>
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                          <span>{l.label}</span>
                          {l.soon && (
                            <span style={{ fontSize: 10, fontWeight: 700, color: C.amber,
                              border: `1px solid ${C.amber}`, padding: '1px 6px', borderRadius: 9999, letterSpacing: '0.06em' }}>
                              Soon
                            </span>
                          )}
                        </span>
                      </DropdownLink>
                    ))}
                  </div>
                )}
              </div>

              {/* Solutions dropdown */}
              <div style={{ position: 'relative' }} onMouseEnter={openSol} onMouseLeave={closeSol}>
                <button className="nav-dd-link" style={{
                  padding: '8px 14px', borderRadius: 6,
                  background: solOpen ? C.navy800 : 'transparent',
                  color: solOpen ? C.white : C.muted,
                }}>Solutions ▾</button>
                {solOpen && (
                  <div onMouseEnter={openSol} onMouseLeave={closeSol} style={{
                    position: 'absolute', top: '100%', left: 0, zIndex: 50,
                    marginTop: 4, background: C.navy900,
                    border: `1px solid ${C.border}`, borderRadius: 12,
                    padding: 24, minWidth: 480,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: C.dim, letterSpacing: '0.14em',
                          textTransform: 'uppercase', marginBottom: 12 }}>By Sector</p>
                        {SOLUTIONS_LEFT.map(l => <DropdownLink key={l.href} href={l.href}>{l.label}</DropdownLink>)}
                      </div>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: C.dim, letterSpacing: '0.14em',
                          textTransform: 'uppercase', marginBottom: 12 }}>More Sectors</p>
                        {SOLUTIONS_RIGHT.map(l => <DropdownLink key={l.href} href={l.href}>{l.label}</DropdownLink>)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {[['Methodology', '/methodology'], ['Pricing', '/pricing'], ['About', '/about']].map(([label, href]) => (
                <Link key={href} href={href} className="nav-dd-link" style={{ padding: '8px 14px', borderRadius: 6 }}>
                  {label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right — desktop CTAs or mobile hamburger */}
          {!isMobile ? (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Link href="/login" style={{
                fontSize: 13, fontWeight: 600, color: C.muted, fontFamily: FONT, textDecoration: 'none',
                padding: '8px 18px', borderRadius: 9999, border: `1px solid ${C.border}`,
              }}>Sign In</Link>
              <Link href="/login" style={{
                fontSize: 13, fontWeight: 700, color: C.white, fontFamily: FONT, textDecoration: 'none',
                background: C.teal, padding: '8px 20px', borderRadius: 9999,
              }}>Request Demo</Link>
            </div>
          ) : (
            <button
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: C.muted }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6"  x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 400,
          background: C.navy950, overflowY: 'auto', fontFamily: FONT,
        }}>
          {/* Overlay top bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 24px', height: 64, borderBottom: `1px solid ${C.border}`,
          }}>
            <Link href="/" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: C.white, letterSpacing: -0.5 }}>OMNIVERSEL</span>
            </Link>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: 8 }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="4" x2="20" y2="20" />
                <line x1="20" y1="4" x2="4" y2="20" />
              </svg>
            </button>
          </div>

          {/* Menu items */}
          <div style={{ padding: '8px 0' }}>

            {/* Platform accordion */}
            <button
              onClick={() => setPlatAcc(v => !v)}
              style={{
                width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 24px', borderBottom: `1px solid ${C.border}`,
                fontFamily: FONT,
              }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: C.white }}>Platform</span>
              <span style={{ color: C.dim, fontSize: 14 }}>{platAcc ? '▲' : '▼'}</span>
            </button>
            {platAcc && (
              <div style={{ background: C.navy900, borderBottom: `1px solid ${C.border}` }}>
                {PLATFORM_LINKS.map(l => (
                  <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '13px 24px 13px 40px', fontSize: 14, color: C.dim,
                      textDecoration: 'none', borderBottom: `1px solid ${C.border}40` }}>
                    <span>{l.label}</span>
                    {l.soon && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: C.amber,
                        border: `1px solid ${C.amber}`, padding: '1px 6px', borderRadius: 9999 }}>Soon</span>
                    )}
                  </Link>
                ))}
              </div>
            )}

            {/* Solutions accordion */}
            <button
              onClick={() => setSolAcc(v => !v)}
              style={{
                width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 24px', borderBottom: `1px solid ${C.border}`,
                fontFamily: FONT,
              }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: C.white }}>Solutions</span>
              <span style={{ color: C.dim, fontSize: 14 }}>{solAcc ? '▲' : '▼'}</span>
            </button>
            {solAcc && (
              <div style={{ background: C.navy900, borderBottom: `1px solid ${C.border}` }}>
                {[...SOLUTIONS_LEFT, ...SOLUTIONS_RIGHT].map(l => (
                  <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                    style={{ display: 'block', padding: '13px 24px 13px 40px', fontSize: 14, color: C.dim,
                      textDecoration: 'none', borderBottom: `1px solid ${C.border}40` }}>
                    {l.label}
                  </Link>
                ))}
              </div>
            )}

            {/* Flat links */}
            {[['Methodology', '/methodology'], ['Pricing', '/pricing'], ['About', '/about'], ['Resources', '/resources']].map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)}
                style={{ display: 'block', padding: '16px 24px', fontSize: 16, color: C.muted,
                  textDecoration: 'none', borderBottom: `1px solid ${C.border}` }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Bottom CTAs */}
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link href="/login" onClick={() => setMobileOpen(false)} style={{
              display: 'block', textAlign: 'center', padding: '14px',
              border: `1px solid ${C.border}`, borderRadius: 9999,
              fontSize: 15, fontWeight: 600, color: C.muted, textDecoration: 'none',
            }}>Sign In</Link>
            <Link href="/login" onClick={() => setMobileOpen(false)} style={{
              display: 'block', textAlign: 'center', padding: '14px',
              background: C.teal, borderRadius: 9999,
              fontSize: 15, fontWeight: 700, color: C.white, textDecoration: 'none',
            }}>Request Demo</Link>
          </div>
        </div>
      )}
    </>
  )
}
