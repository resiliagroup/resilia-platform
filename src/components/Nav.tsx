'use client'
import { useState, useEffect, useRef } from 'react'

export default function Nav() {
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobilePlatformOpen, setMobilePlatformOpen] = useState(false)
  const [mobileSolutionsOpen, setMobileSolutionsOpen] = useState(false)
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

  const platformLinks = [
    { label: 'omniRISK',   href: '/platform/omnirisk' },
    { label: 'omniIMPACT', href: '/platform/omniimpact' },
    { label: 'omniPLAN',   href: '/platform/omniplan' },
    { label: 'omniCRISIS', href: '/platform/omnicrisis' },
    { label: 'omniAUDIT',  href: '/platform/omniaudit' },
    { label: 'omniVENDOR', href: '/platform/omnivendor' },
    { label: 'omniHRO',    href: '/platform/omni-hro', soon: true },
    { label: 'omniPIPE',   href: '/platform/omnipipe', soon: true },
  ]

  const solutionLinks = [
    { label: 'Banking & Finance',   href: '/solutions/banking' },
    { label: 'Healthcare',          href: '/solutions/health' },
    { label: 'Energy & Utilities',  href: '/solutions/energy' },
    { label: 'Industrial',          href: '/solutions/industrial' },
    { label: 'Manufacturing',       href: '/solutions/manufacturing' },
    { label: 'Insurance',           href: '/solutions/insurance' },
    { label: 'Telecommunications',  href: '/solutions/telecom' },
    { label: 'Government',          href: '/solutions/government' },
    { label: 'Public Sector',       href: '/solutions/public-sector' },
    { label: 'Education',           href: '/solutions/education' },
  ]

  const soonPill: React.CSSProperties = {
    border: '1px solid #F59E0B',
    color: '#F59E0B',
    fontSize: '10px',
    padding: '1px 6px',
    borderRadius: '999px',
    marginLeft: '8px',
    whiteSpace: 'nowrap',
  }

  const navBase: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: 'rgba(255,255,255,0.98)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid #E2E8F0',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
  }

  // SSR stub
  if (!mounted) {
    return (
      <nav style={navBase}>
        <span style={{ fontWeight: 800, fontSize: '18px', color: '#0A1628', letterSpacing: '-0.5px' }}>
          OMNIVERSEL
        </span>
      </nav>
    )
  }

  // ─── MOBILE ───────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        <nav style={navBase}>
          <a href="/" style={{ textDecoration: 'none', fontWeight: 800, fontSize: '18px', color: '#0A1628', letterSpacing: '-0.5px' }}>
            OMNIVERSEL
          </a>
          <button
            onClick={() => setMobileOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: '#94A3B8', display: 'flex', alignItems: 'center' }}
            aria-label="Open menu"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </nav>

        {mobileOpen && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: '#FFFFFF', zIndex: 100, overflowY: 'auto',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px', height: '64px', borderBottom: '1px solid #E2E8F0', flexShrink: 0 }}>
              <a href="/" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none', fontWeight: 800, fontSize: '18px', color: '#0A1628', letterSpacing: '-0.5px' }}>
                OMNIVERSEL
              </a>
              <button
                onClick={() => setMobileOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '8px', display: 'flex', alignItems: 'center' }}
                aria-label="Close menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Links */}
            <div style={{ flex: 1 }}>

              {/* Platform accordion */}
              <button
                onClick={() => setMobilePlatformOpen(v => !v)}
                style={{ width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #E2E8F0', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: '#0F172A', fontSize: '16px', fontWeight: 600, textAlign: 'left' }}
              >
                Platform
                <span style={{ fontSize: '11px', color: '#64748B', transition: 'transform 200ms', transform: mobilePlatformOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </button>
              {mobilePlatformOpen && (
                <div style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  {platformLinks.map(link => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', padding: '13px 24px 13px 40px', color: '#374151', textDecoration: 'none', fontSize: '14px', borderBottom: '1px solid #E2E8F0' }}
                    >
                      {link.label}
                      {link.soon && <span style={soonPill}>Soon</span>}
                    </a>
                  ))}
                </div>
              )}

              {/* Solutions accordion */}
              <button
                onClick={() => setMobileSolutionsOpen(v => !v)}
                style={{ width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #E2E8F0', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: '#0F172A', fontSize: '16px', fontWeight: 600, textAlign: 'left' }}
              >
                Solutions
                <span style={{ fontSize: '11px', color: '#64748B', transition: 'transform 200ms', transform: mobileSolutionsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </button>
              {mobileSolutionsOpen && (
                <div style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  {solutionLinks.map(link => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      style={{ display: 'block', padding: '13px 24px 13px 40px', color: '#374151', textDecoration: 'none', fontSize: '14px', borderBottom: '1px solid #E2E8F0' }}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}

              {/* Static links */}
              {[
                { label: 'Methodology', href: '/methodology' },
                { label: 'Pricing',     href: '/pricing' },
                { label: 'About',       href: '/about' },
                { label: 'Resources',   href: '/resources' },
              ].map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{ display: 'block', padding: '18px 24px', color: '#374151', textDecoration: 'none', fontSize: '16px', borderBottom: '1px solid #E2E8F0', fontWeight: 500 }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA */}
            <div style={{ padding: '20px 24px', borderTop: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0 }}>
              <a
                href="/login"
                onClick={() => setMobileOpen(false)}
                style={{ display: 'block', padding: '14px', textAlign: 'center', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#374151', textDecoration: 'none', fontSize: '15px', fontWeight: 500 }}
              >
                Sign In
              </a>
              <a
                href="/login"
                onClick={() => setMobileOpen(false)}
                style={{ display: 'block', padding: '14px', textAlign: 'center', background: '#009B8D', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontSize: '15px', fontWeight: 600 }}
              >
                Request Demo
              </a>
            </div>
          </div>
        )}
      </>
    )
  }

  // ─── DESKTOP ──────────────────────────────────────────
  const handlePlatformEnter = () => {
    if (platformTimeoutRef.current) clearTimeout(platformTimeoutRef.current)
    setOpenMenu('platform')
  }
  const handlePlatformLeave = () => {
    platformTimeoutRef.current = setTimeout(() => setOpenMenu(null), 150)
  }
  const handleSolutionsEnter = () => {
    if (solutionsTimeoutRef.current) clearTimeout(solutionsTimeoutRef.current)
    setOpenMenu('solutions')
  }
  const handleSolutionsLeave = () => {
    solutionsTimeoutRef.current = setTimeout(() => setOpenMenu(null), 150)
  }

  return (
    <nav style={navBase}>
      {/* Logo */}
      <a href="/" style={{ textDecoration: 'none', fontWeight: 800, fontSize: '18px', color: '#0A1628', letterSpacing: '-0.5px', flexShrink: 0 }}>
        OMNIVERSEL
      </a>

      {/* Desktop links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', position: 'relative' }}>

        {/* Platform dropdown */}
        <div
          onMouseEnter={handlePlatformEnter}
          onMouseLeave={handlePlatformLeave}
          style={{ position: 'relative' }}
        >
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 12px', color: openMenu === 'platform' ? '#009B8D' : '#374151', fontSize: '14px', fontWeight: 500 }}>
            Platform ▾
          </button>
          {openMenu === 'platform' && (
            <div
              onMouseEnter={handlePlatformEnter}
              onMouseLeave={handlePlatformLeave}
              style={{ position: 'absolute', top: '100%', left: 0, background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', minWidth: '220px', boxShadow: '0 8px 32px rgba(0,0,0,0.10)', zIndex: 60 }}
            >
              {platformLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', color: '#374151', textDecoration: 'none', fontSize: '14px', borderRadius: '6px' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F0FDF9'; (e.currentTarget as HTMLElement).style.color = '#009B8D' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#94A3B8' }}
                >
                  {link.label}
                  {link.soon && <span style={soonPill}>Soon</span>}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Solutions dropdown */}
        <div
          onMouseEnter={handleSolutionsEnter}
          onMouseLeave={handleSolutionsLeave}
          style={{ position: 'relative' }}
        >
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px 12px', color: openMenu === 'solutions' ? '#009B8D' : '#374151', fontSize: '14px', fontWeight: 500 }}>
            Solutions ▾
          </button>
          {openMenu === 'solutions' && (
            <div
              onMouseEnter={handleSolutionsEnter}
              onMouseLeave={handleSolutionsLeave}
              style={{ position: 'absolute', top: '100%', left: 0, background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', minWidth: '480px', boxShadow: '0 8px 32px rgba(0,0,0,0.10)', zIndex: 60, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}
            >
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', padding: '0 12px' }}>By Sector</div>
                {solutionLinks.slice(0, 7).map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    style={{ display: 'block', padding: '8px 12px', color: '#374151', textDecoration: 'none', fontSize: '14px', borderRadius: '6px' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F0FDF9'; (e.currentTarget as HTMLElement).style.color = '#009B8D' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#94A3B8' }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px', padding: '0 12px' }}>More Sectors</div>
                {solutionLinks.slice(7).map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    style={{ display: 'block', padding: '8px 12px', color: '#374151', textDecoration: 'none', fontSize: '14px', borderRadius: '6px' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F0FDF9'; (e.currentTarget as HTMLElement).style.color = '#009B8D' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = '#94A3B8' }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Static links */}
        {[
          { label: 'Methodology', href: '/methodology' },
          { label: 'Pricing',     href: '/pricing' },
          { label: 'About',       href: '/about' },
        ].map(link => (
          <a
            key={link.href}
            href={link.href}
            style={{ padding: '8px 12px', color: '#374151', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#009B8D'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#94A3B8'}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Right CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <a
          href="/login"
          style={{ padding: '7px 16px', border: '1px solid #E2E8F0', borderRadius: '999px', color: '#374151', textDecoration: 'none', fontSize: '13px', fontWeight: 500 }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#2D8A87'; (e.currentTarget as HTMLElement).style.color = '#009B8D' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1E3A5F'; (e.currentTarget as HTMLElement).style.color = '#94A3B8' }}
        >
          Sign In
        </a>
        <a
          href="/login"
          style={{ padding: '7px 16px', background: '#009B8D', borderRadius: '999px', color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#3BA8A5'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#2D8A87'}
        >
          Request Demo
        </a>
      </div>
    </nav>
  )
}
