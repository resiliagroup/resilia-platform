'use client'
import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const C = { navy950: '#060D1A', navy900: '#0A1628', teal: '#2D8A87', amber: '#F59E0B', white: '#FFFFFF', muted: '#94A3B8', dim: '#64748B', border: '#1E3A5F' }
const F = "'Plus Jakarta Sans', sans-serif"

const CATEGORIES = [
  { title: 'Methodology Guides', desc: 'Deep-dive technical documentation on the Omniversel URI methodology, sector calibration and regulatory alignment frameworks.', link: 'View Guides →' },
  { title: 'Sector Briefings',   desc: 'Risk and resilience briefings for banking, healthcare, energy, industrial and public sector decision-makers.',                 link: 'View Briefings →' },
  { title: 'Regulatory Updates', desc: 'Analysis of BDDK, AFAD, ISO 22301 and international regulatory developments affecting organizational resilience programs.',  link: 'View Updates →' },
]

const ARTICLES = [
  { cat: 'METHODOLOGY',    title: 'Quantifying Urban Resilience: The URI Model Explained',                                  excerpt: 'A technical overview of the Unified Risk Index formula and its application across multi-hazard urban environments.',                              read: '8 min read' },
  { cat: 'SECTOR BRIEFING', title: 'Operational Resilience in Turkish Banking: BDDK Requirements and Beyond',               excerpt: 'How Turkish financial institutions can build defensible, audit-ready resilience programs.',                                                    read: '6 min read' },
  { cat: 'REGULATORY',     title: 'The Sendai Framework at 10: Implications for Municipal Resilience Planning',            excerpt: 'What the Sendai Framework\'s second decade means for Turkish municipalities and their AFAD obligations.',                                    read: '7 min read' },
  { cat: 'METHODOLOGY',    title: 'NATECH Risk: When Natural Hazards Trigger Industrial Accidents',                         excerpt: 'Understanding cascade scenarios and why standard risk frameworks miss them.',                                                                  read: '5 min read' },
  { cat: 'SECTOR BRIEFING', title: 'Hospital Resilience Planning: From JCI Compliance to Operational Reality',             excerpt: 'Why JCI accreditation and genuine emergency preparedness are not the same thing.',                                                           read: '6 min read' },
  { cat: 'RESEARCH',       title: 'High Reliability Organizations: Applying HRO Principles to Urban Infrastructure',       excerpt: 'How near-miss culture and reliability science can transform organizational resilience programs.',                                           read: '9 min read' },
]

function CategoryCard({ title, desc, link }: { title: string; desc: string; link: string }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ background: C.navy900, border: `1px solid ${hov ? C.teal : C.border}`, borderRadius: 12, padding: 32, transition: 'border-color .2s, transform .2s', transform: hov ? 'translateY(-2px)' : 'none' }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: C.white, marginBottom: 12 }}>{title}</h3>
      <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75, marginBottom: 20 }}>{desc}</p>
      <span style={{ fontSize: 13, fontWeight: 600, color: C.teal }}>{link}</span>
    </div>
  )
}

export default function ResourcesPage() {
  const [email, setEmail]   = useState('')
  const [subbed, setSubbed] = useState(false)

  return (
    <div style={{ background: C.navy900, fontFamily: F, minHeight: '100vh', color: C.white }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}a{text-decoration:none;color:inherit}`}</style>
      <Nav />

      {/* HERO */}
      <section style={{ background: C.navy900, padding: '120px 48px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 700, height: 500, background: 'radial-gradient(circle at 100% 0%, rgba(45,138,135,0.10) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20 }}>Resources</p>
          <h1 style={{ fontSize: 'clamp(38px,5vw,60px)', fontWeight: 800, lineHeight: 1.08, marginBottom: 24, letterSpacing: '-0.02em', maxWidth: 700 }}>
            Insights, Research<br /><span style={{ color: C.teal }}>and Guidance.</span>
          </h1>
          <p style={{ fontSize: 18, color: C.muted, maxWidth: 600, lineHeight: 1.75 }}>
            Perspectives on organizational resilience, disaster risk management and business continuity from the Omniversel advisory team and our academic partners at ITU AYM.
          </p>
        </div>
      </section>

      {/* FEATURED CATEGORIES */}
      <section style={{ background: C.navy950, padding: '80px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>Browse by Topic</p>
          <h2 style={{ fontSize: 'clamp(26px,3vw,36px)', fontWeight: 800, color: C.white, marginBottom: 48, letterSpacing: '-0.02em' }}>Find What You Need.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {CATEGORIES.map(c => <CategoryCard key={c.title} {...c} />)}
          </div>
        </div>
      </section>

      {/* ARTICLES */}
      <section style={{ background: C.navy900, padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 16 }}>Latest Articles</p>
          <h2 style={{ fontSize: 'clamp(26px,3vw,36px)', fontWeight: 800, color: C.white, marginBottom: 56, letterSpacing: '-0.02em' }}>From Our Advisory Team.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {ARTICLES.map(a => (
              <div key={a.title} style={{ background: C.navy950, border: `1px solid ${C.border}`, borderRadius: 12, padding: 28 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: C.teal, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>{a.cat}</p>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: C.white, lineHeight: 1.45, marginBottom: 12 }}>{a.title}</h3>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 20,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{a.excerpt}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.amber, background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.25)', padding: '3px 10px', borderRadius: 9999, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Coming Soon</span>
                  <span style={{ fontSize: 12, color: C.dim }}>{a.read}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ background: 'linear-gradient(135deg, #0F2240, #060D1A)', borderTop: `1px solid ${C.border}`, padding: '80px 48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(26px,3.5vw,36px)', fontWeight: 800, color: C.white, marginBottom: 16, letterSpacing: '-0.02em' }}>Stay Informed.</h2>
        <p style={{ fontSize: 16, color: C.muted, maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Resilience insights and regulatory updates — delivered quarterly. No spam.
        </p>
        {!subbed ? (
          <div style={{ display: 'flex', gap: 0, justifyContent: 'center', maxWidth: 480, margin: '0 auto' }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: `1px solid ${C.border}`, borderRight: 'none', borderRadius: '9999px 0 0 9999px', padding: '14px 20px', fontSize: 14, color: C.white, outline: 'none', fontFamily: F }}
            />
            <button
              onClick={() => { if (email) setSubbed(true) }}
              style={{ background: C.teal, color: C.white, fontWeight: 700, fontSize: 14, padding: '14px 28px', borderRadius: '0 9999px 9999px 0', border: 'none', cursor: 'pointer', fontFamily: F }}>
              Subscribe
            </button>
          </div>
        ) : (
          <div style={{ background: 'rgba(45,138,135,0.12)', border: `1px solid ${C.teal}`, borderRadius: 12, padding: '20px 32px', maxWidth: 400, margin: '0 auto' }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: C.teal }}>You are subscribed.</p>
            <p style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>Thank you. We will be in touch quarterly.</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
