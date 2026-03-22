'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { mevcutKullanici } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

async function exportPDF(
  facilities: { name: string; uri: number; id: string }[],
  totalFacilities: number | null,
  criticalRisk: number | null
) {
  const { default: jsPDF } = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF()
  const now = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })

  // Başlık
  doc.setFontSize(18)
  doc.setTextColor(10, 22, 40)
  doc.text('Omniversel Resilience Platform', 14, 22)

  doc.setFontSize(11)
  doc.setTextColor(100, 116, 139)
  doc.text('Tesis Risk Raporu — Beylikdüzü Belediyesi', 14, 30)
  doc.text(`Rapor Tarihi: ${now}`, 14, 37)

  // KPI satırı
  doc.setFontSize(10)
  doc.setTextColor(10, 22, 40)
  doc.text(`Toplam Tesis: ${totalFacilities ?? '—'}`, 14, 50)
  doc.text(`Kritik Tesis (URI < 75): ${criticalRisk ?? '—'}`, 80, 50)

  // Tablo
  autoTable(doc, {
    startY: 58,
    head: [['Sıra', 'Tesis Adı', 'URI Skoru', 'Risk Seviyesi']],
    body: facilities.map((f, i) => [
      i + 1,
      f.name,
      Math.round(f.uri),
      f.uri < 40 ? 'Kritik' : f.uri < 60 ? 'Yüksek' : f.uri < 75 ? 'Orta' : 'Düşük',
    ]),
    headStyles: { fillColor: [10, 22, 40], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 249, 250] },
    columnStyles: {
      0: { cellWidth: 12 },
      2: { halign: 'center' },
      3: { halign: 'center' },
    },
  })

  doc.setFontSize(8)
  doc.setTextColor(148, 163, 184)
  doc.text('Omniversel Platform · HFER-720 v2.0 · ISO 22301 · Sendai 2015–2030', 14, 285)

  doc.save(`omni-risk-raporu-${new Date().toISOString().slice(0, 10)}.pdf`)
}

const sbBD = createClient(
  'https://gqguwgbopgnpwzjwcexl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5OTgzMywiZXhwIjoyMDg4OTc1ODMzfQ.Ku-JRx8JFH5a3SIj7sGP_Dy_nM89NMMW34gPyxVO_qI',
)
const TENANT_BD = '11111111-0000-0000-0000-000000000001'

const NAVY   = '#0A1628'
const TEAL   = '#009B8D'
const GOLD   = '#E8C97A'
const BORDER = '#E2E8F0'

function CcdsIcon({ file, size = 24 }: { file: string; size?: number }) {
  return <img src={`/icons/${file}`} width={size} height={size} alt="" style={{ objectFit: 'contain', flexShrink: 0 }} />
}

const QUICK_MODULES = [
  { key: 'omnirisk',   name: 'omniRISK',   icon: 'Icon_MIT_06_Risk.png',            color: '#EF4444', bg: '#FEF2F2', border: '#FCA5A5', href: '/beylikduzu-komuta', desc: 'Hazard & risk analysis' },
  { key: 'omniimpact', name: 'omniIMPACT', icon: 'Icon_RESP_15_Situational.png',    color: '#F97316', bg: '#FFF7ED', border: '#FDBA74', href: '/omni-dashboard',    desc: 'Business Impact Analysis' },
  { key: 'omniplan',   name: 'omniPLAN',   icon: 'Icon_PREVENT_01_Planning.png',    color: '#3B82F6', bg: '#EFF6FF', border: '#93C5FD', href: '/omniplan',          desc: 'BCM planning & RTO/RPO' },
  { key: 'omnicrisis', name: 'omniCRISIS', icon: 'Icon_RESP_12_OnScene.png',        color: '#8B5CF6', bg: '#F5F3FF', border: '#C4B5FD', href: '/omnicrisis',        desc: 'Crisis command center' },
  { key: 'omniaudit',  name: 'omniAUDIT',  icon: 'Icon_PROTECT_10_Risk.png',        color: '#10B981', bg: '#F0FDF4', border: '#6EE7B7', href: '/beylikduzu-komuta', desc: 'Compliance & Sendai audit' },
  { key: 'omnivendor', name: 'omniVENDOR', icon: 'Icon_PROTECT_11_Supply.png',      color: '#6366F1', bg: '#EEF2FF', border: '#A5B4FC', href: '/tesis-agi',         desc: 'Supply chain risk' },
]

interface NearMissRow { id: string; event_date: string; category: string; urgency: string; facility_id: string }
interface SprintCardRow { id: string; status: string; tenant_id: string }
interface FacilityRow { id: string; name: string; extra_data: { H_score?: number; F_score?: number; X_score?: number; C_score?: number; natech_risk?: number } | null }

const URGENCY_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  'Critical': { bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' },
  'Kritik':   { bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' },
  'High':     { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
  'Yüksek':  { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
  'Medium':   { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
  'Orta':     { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
  'Low':      { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
  'Düşük':   { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
}

function uriScore(f: FacilityRow): number {
  const ed = f.extra_data
  if (!ed) return 50
  const H = (ed.H_score ?? 0) / 5 * 100
  const F = (ed.F_score ?? 0) / 5 * 100
  const X = (ed.X_score ?? 0) / 5 * 100
  const C = (ed.C_score ?? 0) / 5 * 100
  return Math.max(0, Math.min(100, 100 - (H * 0.3 + F * 0.3 + X * 0.2) / 100 + C * 0.2))
}

export default function HubPage() {
  const [kullanici, setKullanici] = useState('...')
  const bugun = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  // KPI state
  const [totalFacilities, setTotalFacilities] = useState<number | null>(null)
  const [criticalRisk,    setCriticalRisk]    = useState<number | null>(null)
  const [activeNearMiss,  setActiveNearMiss]  = useState<number | null>(null)
  const [sprintVelocity,  setSprintVelocity]  = useState<{ done: number; total: number } | null>(null)

  // Panel state
  const [topFacilities, setTopFacilities] = useState<{ name: string; uri: number; id: string }[]>([])
  const [mtpdTotal,     setMtpdTotal]     = useState(0)
  const [nearMissItems, setNearMissItems] = useState<NearMissRow[]>([])
  const [sprintActive,  setSprintActive]  = useState<SprintCardRow[]>([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const k = mevcutKullanici()
    if (k) setKullanici(k.tenant)

    async function loadAll() {
      setLoading(true)
      try {
        // 1. Facilities
        const { data: facs, count } = await sbBD
          .from('facilities')
          .select('id,name,extra_data', { count: 'exact' })
          .eq('tenant_id', TENANT_BD)
          .eq('is_active', true)
          .limit(1000)

        const facList = (facs ?? []) as FacilityRow[]
        setTotalFacilities(count ?? facList.length)

        // Critical risk: URI < 75
        const critCount = facList.filter(f => uriScore(f) < 75).length
        setCriticalRisk(critCount)

        // Top 5 riskiest facilities (lowest URI)
        const scored = facList
          .map(f => ({ name: f.name, uri: uriScore(f), id: f.id }))
          .sort((a, b) => a.uri - b.uri)
          .slice(0, 5)
        setTopFacilities(scored)
        setMtpdTotal(facList.length * 2) // placeholder MTPD hours

        // 2. Near Miss (this month)
        const thisMonth = new Date()
        thisMonth.setDate(1)
        thisMonth.setHours(0, 0, 0, 0)
        const { data: nmData, count: nmCount } = await sbBD
          .from('near_miss_events')
          .select('id,event_date,category,urgency,facility_id', { count: 'exact' })
          .eq('tenant_id', TENANT_BD)
          .gte('event_date', thisMonth.toISOString())
          .order('event_date', { ascending: false })
          .limit(5)

        setActiveNearMiss(nmCount ?? 0)
        setNearMissItems((nmData ?? []) as NearMissRow[])

        // 3. Sprint cards
        const { data: sprintData } = await sbBD
          .from('sprint_cards')
          .select('id,status,tenant_id')
          .eq('tenant_id', TENANT_BD)

        const allCards = (sprintData ?? []) as SprintCardRow[]
        const doneCards = allCards.filter(c => c.status === 'tamamlandi' || c.status === 'Done')
        setSprintVelocity({ done: doneCards.length, total: allCards.length })
        setSprintActive(allCards.filter(c => c.status === 'yapiliyor' || c.status === 'In Progress'))

      } catch (e) {
        console.error('Hub load error:', e)
      }
      setLoading(false)
    }

    loadAll()
  }, [])

  const kpis = [
    {
      label: 'Total Facilities',
      val: totalFacilities !== null ? totalFacilities.toLocaleString() : '…',
      color: '#3B82F6', sub: 'Supabase · live',
    },
    {
      label: 'Critical Risk',
      val: criticalRisk !== null ? String(criticalRisk) : '…',
      color: '#EF4444', sub: 'URI < 75 threshold',
    },
    {
      label: 'Active Near Miss',
      val: activeNearMiss !== null ? String(activeNearMiss) : '…',
      color: '#F97316', sub: 'This month',
    },
    {
      label: 'Sprint Velocity',
      val: sprintVelocity !== null
        ? `${sprintVelocity.done}/${sprintVelocity.total}`
        : '…',
      color: '#10B981', sub: 'Completed / total cards',
    },
  ]

  const uriColor = (uri: number) =>
    uri < 40 ? '#EF4444' : uri < 60 ? '#F97316' : uri < 75 ? '#F59E0B' : '#22C55E'

  return (
    <div className="min-h-screen" style={{ background: '#F8F9FA', fontFamily: "'DM Sans',sans-serif" }}>

      {/* HEADER */}
      <div style={{ background: NAVY, borderBottom: '1px solid rgba(255,255,255,0.06)' }} className="px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome,{' '}
              <span style={{ color: GOLD }}>{kullanici}</span>
            </h1>
            <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>{bugun}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => exportPDF(topFacilities, totalFacilities, criticalRisk)}
              style={{ fontSize: 12, fontWeight: 600, padding: '7px 14px', borderRadius: 8, background: 'rgba(0,155,141,0.15)', border: '1px solid rgba(0,155,141,0.3)', color: TEAL, cursor: 'pointer' }}
            >
              ↓ PDF İndir
            </button>
            <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg"
                 style={{ background: 'rgba(232,201,122,.1)', border: '1px solid rgba(232,201,122,.2)', color: GOLD }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GOLD }}/>
              OMNI Resilience Platform · v2.0
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* ── KPI STRIP ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map(k => (
            <div key={k.label} style={{ background: 'white', borderRadius: 12, border: `1px solid ${BORDER}`, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{k.label}</p>
              <p style={{ fontSize: 28, fontWeight: 800, color: k.color, fontFamily: 'DM Mono,monospace', lineHeight: 1 }}>{k.val}</p>
              <p style={{ fontSize: 11, color: '#CBD5E1', marginTop: 6 }}>{k.sub}</p>
            </div>
          ))}
        </div>

        {/* ── MIDDLE: 3 PANELS ───────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 28 }}>

          {/* LEFT: YGG Summary */}
          <div style={{ background: 'white', borderRadius: 12, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CcdsIcon file="Icon_MIT_06_Risk.png" size={18} />
                <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>Executive Dashboard</span>
              </div>
              <Link href="/ygg-pano" style={{ fontSize: 11, color: TEAL, fontWeight: 600 }}>View all →</Link>
            </div>
            <div style={{ padding: '12px 16px' }}>
              <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 8 }}>Top 5 Riskiest Facilities</p>
              {loading ? (
                <p style={{ fontSize: 12, color: '#CBD5E1' }}>Loading…</p>
              ) : topFacilities.length === 0 ? (
                <p style={{ fontSize: 12, color: '#CBD5E1' }}>No data</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {topFacilities.map((f, i) => (
                    <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, width: 14 }}>{i+1}</span>
                      <span style={{ fontSize: 12, color: '#374151', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: uriColor(f.uri), fontFamily: 'DM Mono,monospace' }}>{Math.round(f.uri)}</span>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${BORDER}` }}>
                <p style={{ fontSize: 11, color: '#94A3B8' }}>
                  Est. MTPD coverage: <span style={{ fontWeight: 700, color: NAVY }}>{mtpdTotal}h</span>
                </p>
              </div>
            </div>
          </div>

          {/* CENTER: Near Miss Feed */}
          <div style={{ background: 'white', borderRadius: 12, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CcdsIcon file="Icon_RESP_15_Situational.png" size={18} />
                <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>Near Miss Feed</span>
              </div>
              <Link href="/near-miss" style={{ fontSize: 11, color: TEAL, fontWeight: 600 }}>View all →</Link>
            </div>
            <div style={{ padding: '12px 16px' }}>
              <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 8 }}>Last 5 Events This Month</p>
              {loading ? (
                <p style={{ fontSize: 12, color: '#CBD5E1' }}>Loading…</p>
              ) : nearMissItems.length === 0 ? (
                <p style={{ fontSize: 12, color: '#CBD5E1' }}>No events recorded this month</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {nearMissItems.map(nm => {
                    const uc = URGENCY_COLOR[nm.urgency] ?? URGENCY_COLOR['Low']
                    return (
                      <div key={nm.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 6, background: uc.bg, color: uc.text, border: `1px solid ${uc.border}`, flexShrink: 0 }}>
                          {nm.urgency}
                        </span>
                        <span style={{ fontSize: 12, color: '#374151', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nm.category}</span>
                        <span style={{ fontSize: 10, color: '#94A3B8', flexShrink: 0 }}>
                          {new Date(nm.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Sprint Status */}
          <div style={{ background: 'white', borderRadius: 12, border: `1px solid ${BORDER}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '14px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CcdsIcon file="Icon_PROTECT_01_Planning.png" size={18} />
                <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>Sprint Status</span>
              </div>
              <Link href="/omni-sprint" style={{ fontSize: 11, color: TEAL, fontWeight: 600 }}>View board →</Link>
            </div>
            <div style={{ padding: '12px 16px' }}>
              {loading ? (
                <p style={{ fontSize: 12, color: '#CBD5E1' }}>Loading…</p>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                    <div style={{ flex: 1, textAlign: 'center', padding: '10px 6px', background: '#F8F9FA', borderRadius: 8, borderTop: `3px solid ${TEAL}` }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: TEAL, fontFamily: 'DM Mono,monospace' }}>{sprintVelocity?.done ?? 0}</div>
                      <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, marginTop: 4 }}>DONE</div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center', padding: '10px 6px', background: '#F8F9FA', borderRadius: 8, borderTop: '3px solid #F59E0B' }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: '#F59E0B', fontFamily: 'DM Mono,monospace' }}>{sprintActive.length}</div>
                      <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, marginTop: 4 }}>IN PROGRESS</div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'center', padding: '10px 6px', background: '#F8F9FA', borderRadius: 8, borderTop: '3px solid #6B7280' }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: '#6B7280', fontFamily: 'DM Mono,monospace' }}>
                        {(sprintVelocity?.total ?? 0) - (sprintVelocity?.done ?? 0) - sprintActive.length}
                      </div>
                      <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 600, marginTop: 4 }}>BACKLOG</div>
                    </div>
                  </div>
                  {/* Mini burndown bar */}
                  {sprintVelocity && sprintVelocity.total > 0 && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94A3B8', marginBottom: 5 }}>
                        <span>Velocity</span>
                        <span style={{ fontWeight: 700, color: TEAL }}>{Math.round(sprintVelocity.done / sprintVelocity.total * 100)}%</span>
                      </div>
                      <div style={{ height: 6, background: '#F1F0EF', borderRadius: 99 }}>
                        <div style={{ height: '100%', width: `${Math.round(sprintVelocity.done / sprintVelocity.total * 100)}%`, background: TEAL, borderRadius: 99 }} />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── QUICK ACCESS GRID ──────────────────────────────────── */}
        <div>
          <h2 style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Modules</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {QUICK_MODULES.map(m => (
              <Link key={m.key} href={m.href}
                style={{ background: 'white', borderRadius: 12, border: `1px solid ${m.border}`, padding: '16px', display: 'flex', flexDirection: 'column', gap: 10, transition: 'box-shadow .15s', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CcdsIcon file={m.icon} size={22} />
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 800, color: m.color, fontFamily: 'DM Mono,monospace', letterSpacing: 0.5 }}>{m.name}</p>
                  <p style={{ fontSize: 10, color: '#94A3B8', marginTop: 2, lineHeight: 1.4 }}>{m.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontSize: 11, color: '#CBD5E1' }}>OMNI Resilience Platform · HFER-720 v2.0 · © 2026</p>
          <p style={{ fontSize: 11, color: '#CBD5E1' }}>Sendai 2015–2030 · ISO 22301 · AFAD</p>
        </div>
      </div>
    </div>
  )
}
