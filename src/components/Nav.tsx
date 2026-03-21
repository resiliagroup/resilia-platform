'use client'
import { useState } from 'react'
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
  { label: 'omniPIPE',   href: '/platform/omnipipe',  soon: true },
  { label: 'omniHRO',    href: '/platform/omni-hro',  soon: true },
]

const SOLUTIONS_LEFT = [
  { label: 'Banking & Finance',        href: '/solutions/banking' },
  { label: 'Healthcare',               href: '/solutions/health' },
  { label: 'Energy & Utilities',       href: '/solutions/energy' },
  { label: 'Industrial & Manufacturing', href: '/solutions/industrial' },
  { label: 'Manufacturing',            href: '/solutions/manufacturing' },
  { label: 'Public Sector',            href: '/solutions/public-sector' },
  { label: 'Education',                href: '/solutions/education' },
]

const SOLUTIONS_RIGHT = [
  { label: 'Insurance',        href: '/solutions/insurance' },
  { label: 'Telecommunications', href: '/solutions/telecom' },
  { label: 'Government',       href: '/solutions/government' },
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
  /** sticky (homepage) vs fixed (inner pages) */
  position?: 'sticky' | 'fixed'
  /** background override — defaults to rgba(6,13,26,0.92) with blur */
  solid?: boolean
}

export default function Nav({ position = 'fixed', solid = false }: NavProps) {
  const [platOpen, setPlatOpen] = useState(false)
  const [solOpen,  setSolOpen]  = useState(false)

  const bg = solid ? C.navy950 : 'rgba(6,13,26,0.92)'
  const backdropFilter = solid ? undefined : 'blur(12px)'

  return (
    <header style={{
      position, top: 0, left: 0, right: 0, zIndex: 300, height: 64,
      background: bg, backdropFilter, borderBottom: `1px solid ${C.border}`,
      display: 'flex', alignItems: 'center', padding: '0 48px', fontFamily: FONT,
    }}>
      <style>{`
        .nav-dd-link{font-size:13px;font-weight:500;color:#94A3B8;cursor:pointer;transition:color .15s;background:none;border:none;padding:0;font-family:'Plus Jakarta Sans',sans-serif}
        .nav-dd-link:hover{color:#fff}
        @media(max-width:900px){.nav-center{display:none!important}}
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

        {/* Center nav */}
        <nav className="nav-center" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>

          {/* Platform dropdown */}
          <div style={{ position: 'relative' }}
            onMouseEnter={() => setPlatOpen(true)}
            onMouseLeave={() => setPlatOpen(false)}>
            <button className="nav-dd-link"
              style={{ padding: '8px 14px', borderRadius: 6,
                background: platOpen ? C.navy800 : 'transparent',
                color: platOpen ? C.white : C.muted }}>
              Platform ▾
            </button>
            {platOpen && (
              <div style={{
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
                          background: `${C.amber}18`, padding: '2px 7px', borderRadius: 4, letterSpacing: '0.06em' }}>
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
          <div style={{ position: 'relative' }}
            onMouseEnter={() => setSolOpen(true)}
            onMouseLeave={() => setSolOpen(false)}>
            <button className="nav-dd-link"
              style={{ padding: '8px 14px', borderRadius: 6,
                background: solOpen ? C.navy800 : 'transparent',
                color: solOpen ? C.white : C.muted }}>
              Solutions ▾
            </button>
            {solOpen && (
              <div style={{
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
                    {SOLUTIONS_LEFT.map(l => (
                      <DropdownLink key={l.href} href={l.href}>{l.label}</DropdownLink>
                    ))}
                  </div>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: C.dim, letterSpacing: '0.14em',
                      textTransform: 'uppercase', marginBottom: 12 }}>More Sectors</p>
                    {SOLUTIONS_RIGHT.map(l => (
                      <DropdownLink key={l.href} href={l.href}>{l.label}</DropdownLink>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Flat links */}
          {[['Methodology', '/methodology'], ['Pricing', '/pricing'], ['About', '/about']].map(([label, href]) => (
            <Link key={href} href={href} className="nav-dd-link"
              style={{ padding: '8px 14px', borderRadius: 6 }}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Right CTAs */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link href="/login" style={{
            fontSize: 13, fontWeight: 600, color: C.muted, fontFamily: FONT, textDecoration: 'none',
            padding: '8px 18px', borderRadius: 9999, border: `1px solid ${C.border}`,
          }}>
            Sign In
          </Link>
          <Link href="/login" style={{
            fontSize: 13, fontWeight: 700, color: C.white, fontFamily: FONT, textDecoration: 'none',
            background: C.teal, padding: '8px 20px', borderRadius: 9999,
          }}>
            Request Demo
          </Link>
        </div>
      </div>
    </header>
  )
}
