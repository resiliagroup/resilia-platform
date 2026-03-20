'use client'
import { useState } from 'react'

type OlayDurum = 'Closed' | 'Active' | 'Monitoring'

interface Aksiyon {
  id: number
  metin: string
  tamamlandi: boolean
}

interface Olay {
  id: string
  baslik: string
  tarih: string
  tur: string
  durum: OlayDurum
  ozet: string
  ekleGorev: string[]
  silGorev: string[]
  uzunSuren: string[]
  tamamlanamayan: string[]
  basarilar: string[]
  basarisizliklar: string[]
  aksiyonlar: Aksiyon[]
}

const OLAYLAR: Olay[] = [
  {
    id: 'olay-001',
    baslik: 'Haramidere Industrial Fire Drill',
    tarih: '08 Mar 2026',
    tur: 'Fire / NATECH',
    durum: 'Closed',
    ozet: 'Fire scenario drill at Haramidere OSB chemical storage area. 3 factories, 1 warehouse, NEFES volunteers and Fire Department participated. Evacuation protocol and RAPID-N domino chain test conducted.',
    ekleGorev: [
      'RAPID-N chemical dispersion mapping',
      'OSB entry/exit point security protocol',
      'Wind direction monitoring sensor installation',
    ],
    silGorev: [
      'Manual trigger protocol (replaced with automation)',
    ],
    uzunSuren: [
      'Evacuation SMS alert — target 5 min, actual 14 min',
      'AFAD coordination approval — target 10 min, actual 28 min',
    ],
    tamamlanamayan: [
      'F-N curve calculation could not be completed during drill',
      'Neighboring facility manager notification was skipped',
    ],
    basarilar: [
      'NEFES volunteers reached the field in 18 minutes (target 20 min)',
      'All OSB personnel evacuated in 22 minutes',
      'Fire Dept.–OMNI data integration successfully tested for the first time',
      'Domino risk map updated in real time',
    ],
    basarisizliklar: [
      'SMS notification system capacity insufficient — bulk messages delayed',
      'AFAD coordination line was busy for the first 10 minutes',
      'Night shift scenario was not tested',
    ],
    aksiyonlar: [
      { id: 1, metin: 'Upgrade SMS notification capacity to 5,000/min', tamamlandi: false },
      { id: 2, metin: 'AFAD direct coordination line SLA update',        tamamlandi: false },
      { id: 3, metin: 'Schedule night drill (April 2026)',                tamamlandi: false },
      { id: 4, metin: 'Register neighboring facility managers in OMNI',  tamamlandi: true  },
      { id: 5, metin: 'Wind sensor procurement and installation — Q2 2026', tamamlandi: false },
    ],
  },
  {
    id: 'olay-002',
    baslik: 'Kavaklı Flood Early Warning Test',
    tarih: '12 Feb 2026',
    tur: 'Flood / Inundation',
    durum: 'Closed',
    ozet: 'Water level rise scenario for Kavaklı district creek bed. Meteorology API integration, siren system and evacuation routes tested. Conducted jointly with IBB infrastructure team.',
    ekleGorev: [
      'Kavaklı Creek real-time water level sensor integration',
      'Meteorology API automatic threshold alert setup',
      'Evacuation signage — 12 intersections',
    ],
    silGorev: [
      'Manual observer duty (sensor system activated)',
      'Paper-based evacuation list (migrated to digital)',
    ],
    uzunSuren: [
      'Siren activation — target 3 min, actual 7 min',
    ],
    tamamlanamayan: [
      'Evacuation scenario for individuals with disabilities not tested',
    ],
    basarilar: [
      'Meteorology API integration worked successfully',
      'Evacuation route guide distributed to all volunteers',
      'IBB–Beylikdüzü coordination protocol signed',
    ],
    basarisizliklar: [
      'Siren system battery backup failure detected',
      'Accessible evacuation routes not included in drill',
    ],
    aksiyonlar: [
      { id: 1, metin: 'Replace siren battery backup (March 2026)',             tamamlandi: true  },
      { id: 2, metin: 'Prepare accessible evacuation scenario protocol',        tamamlandi: false },
      { id: 3, metin: 'Add Kavaklı Creek sensor data to OMNI map',             tamamlandi: true  },
      { id: 4, metin: 'Complete evacuation signage installation',               tamamlandi: false },
    ],
  },
  {
    id: 'olay-003',
    baslik: 'Municipal IT System Outage Simulation',
    tarih: '20 Jan 2026',
    tur: 'IT / Cyber',
    durum: 'Monitoring',
    ozet: 'Planned outage simulation for municipal BETS (Municipal Electronic Tracking System). RTO/RPO target compliance tested. Backup system activated, manual processes enabled.',
    ekleGorev: [
      'Backup system automatic activation procedure',
      'IT outage notification chain (IT → Director → Mayor\'s Office)',
      'Critical services offline operation guide',
    ],
    silGorev: [
      'Legacy VPN outage protocol (incompatible with new architecture)',
    ],
    uzunSuren: [
      'Backup system activation — target 4h RTO, actual 6.5h',
      'Data synchronization — target 1h RPO, actual 3h',
    ],
    tamamlanamayan: [
      'Mobile application offline mode test not completed',
      'Vendor SLA verification not reported',
    ],
    basarilar: [
      'Critical financial services continued uninterrupted (offline mode)',
      'IT team coordination performed above expectations',
      'Backup procedure guide updated',
    ],
    basarisizliklar: [
      'RTO target exceeded by 62% — backup system activation too slow',
      'RPO target exceeded 3x — data synchronization delay',
      'Vendor support line unreachable for first 2 hours',
    ],
    aksiyonlar: [
      { id: 1, metin: 'Automate backup system activation procedure',                 tamamlandi: false },
      { id: 2, metin: 'Strengthen data synchronization infrastructure',              tamamlandi: false },
      { id: 3, metin: 'Vendor SLA renegotiation — 2-hour support guarantee',         tamamlandi: false },
      { id: 4, metin: 'Schedule mobile offline mode test for February 2026',         tamamlandi: true  },
      { id: 5, metin: 'Register IT outage notification chain in OMNI',               tamamlandi: true  },
      { id: 6, metin: 'Review and revise RTO/RPO targets',                           tamamlandi: false },
    ],
  },
]

const DURUM_STYLE: Record<OlayDurum, { color: string; bg: string; border: string; dot: string }> = {
  'Closed':     { color: '#6B7280', bg: '#F3F4F6', border: '#D1D5DB', dot: '#9CA3AF' },
  'Active':     { color: '#DC2626', bg: '#FEE2E2', border: '#FCA5A5', dot: '#EF4444' },
  'Monitoring': { color: '#D97706', bg: '#FEF3C7', border: '#FCD34D', dot: '#F59E0B' },
}

const TUR_STYLE: Record<string, { color: string; bg: string }> = {
  'Fire / NATECH':      { color: '#EA580C', bg: '#FFF7ED' },
  'Flood / Inundation': { color: '#2563EB', bg: '#EFF6FF' },
  'IT / Cyber':         { color: '#7C3AED', bg: '#F5F3FF' },
}

function Akordeon({ baslik, renk, items }: { baslik: string; renk: string; items: string[] }) {
  const [ac, setAc] = useState(false)
  return (
    <div style={{ border: `1px solid ${renk}30`, borderRadius: 8, overflow: 'hidden' }}>
      <button onClick={() => setAc(!ac)}
        className="w-full text-left flex items-center justify-between px-4 py-3 hover:opacity-90 transition-opacity"
        style={{ background: renk + '10' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: renk }}>{baslik}</span>
        <span style={{ fontSize: 10, color: renk, transform: ac ? 'rotate(180deg)' : 'none', display: 'inline-block', transition: 'transform .2s' }}>▼</span>
      </button>
      {ac && (
        <div style={{ background: '#FAFAFA', borderTop: `1px solid ${renk}20` }}>
          {items.length === 0
            ? <p style={{ fontSize: 12, color: '#9CA3AF', padding: '10px 16px' }}>No records.</p>
            : items.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 16px', borderBottom: i < items.length-1 ? '1px solid #F3F4F6' : 'none' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: renk, flexShrink: 0, marginTop: 5 }}/>
                  <span style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))
          }
        </div>
      )}
    </div>
  )
}

export default function OmniCrisisPage() {
  const [secilenId, setSecilenId] = useState<string | null>(OLAYLAR[0].id)
  const [aksiyonlar, setAksiyonlar] = useState<Record<string, Aksiyon[]>>(
    Object.fromEntries(OLAYLAR.map(o => [o.id, o.aksiyonlar.map(a => ({ ...a }))]))
  )

  const olay = OLAYLAR.find(o => o.id === secilenId) ?? null

  const toggleAksiyon = (olayId: string, aksiyonId: number) => {
    setAksiyonlar(prev => ({
      ...prev,
      [olayId]: prev[olayId].map(a => a.id === aksiyonId ? { ...a, tamamlandi: !a.tamamlandi } : a),
    }))
  }

  const mevcutAksiyonlar = olay ? aksiyonlar[olay.id] ?? [] : []
  const tamamlanan = mevcutAksiyonlar.filter(a => a.tamamlandi).length

  return (
    <div className="min-h-screen" style={{ background: '#F8F9FA', fontFamily: "'DM Sans',sans-serif" }}>

      {/* HEADER */}
      <div style={{ background: '#0A1628' }} className="px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div style={{ background: 'rgba(139,92,246,.15)', border: '1px solid rgba(139,92,246,.3)' }} className="p-2.5 rounded-xl">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">omniCRISIS</h1>
              <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                Crisis Management · Post-Mortem Reporting · Beylikdüzü Municipality
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg"
               style={{ background: 'rgba(139,92,246,.1)', border: '1px solid rgba(139,92,246,.2)', color: '#C4B5FD' }}>
            {OLAYLAR.filter(o => o.durum === 'Active').length} Active Events · {OLAYLAR.filter(o => o.durum === 'Monitoring').length} Monitoring
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">

          {/* OLAY LİSTESİ */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Events</h2>
            {OLAYLAR.map(o => {
              const ds = DURUM_STYLE[o.durum]
              const ts = TUR_STYLE[o.tur] ?? { color: '#6B7280', bg: '#F3F4F6' }
              const aktif = secilenId === o.id
              return (
                <button key={o.id} onClick={() => setSecilenId(o.id)}
                  className="w-full text-left bg-white rounded-xl border shadow-sm p-4 transition-all hover:shadow-md"
                  style={{ borderColor: aktif ? '#8B5CF6' : '#E5E7EB', outline: aktif ? '2px solid #8B5CF620' : 'none' }}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-900 leading-snug">{o.baslik}</span>
                    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border flex-shrink-0"
                          style={{ color: ds.color, background: ds.bg, borderColor: ds.border }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: ds.dot }}/>
                      {o.durum}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: ts.color, background: ts.bg }}>
                      {o.tur}
                    </span>
                    <span className="text-xs text-gray-400">{o.tarih}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* POST-MORTEM FORMU */}
          {olay ? (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                {/* Olay başlık */}
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h2 className="text-lg font-bold text-gray-900">{olay.baslik}</h2>
                  <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border flex-shrink-0"
                        style={{ color: DURUM_STYLE[olay.durum].color, background: DURUM_STYLE[olay.durum].bg, borderColor: DURUM_STYLE[olay.durum].border }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: DURUM_STYLE[olay.durum].dot }}/>
                    {olay.durum}
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ color: (TUR_STYLE[olay.tur] ?? {color:'#6B7280'}).color, background: (TUR_STYLE[olay.tur] ?? {bg:'#F3F4F6'}).bg }}>
                    {olay.tur}
                  </span>
                  <span className="text-xs text-gray-400">{olay.tarih}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{olay.ozet}</p>
              </div>

              {/* ISSUES & ANOMALIES */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span style={{ color: '#F59E0B' }}>⚠</span> Issues &amp; Anomalies
                </h3>
                <div className="space-y-3">
                  <Akordeon baslik="Tasks Added During Event"     renk="#10B981" items={olay.ekleGorev}      />
                  <Akordeon baslik="Removed Tasks"                renk="#6B7280" items={olay.silGorev}       />
                  <Akordeon baslik="Took Longer Than Expected"    renk="#F97316" items={olay.uzunSuren}      />
                  <Akordeon baslik="Incomplete Tasks"             renk="#EF4444" items={olay.tamamlanamayan} />
                </div>
              </div>

              {/* BAŞARILAR & BAŞARISIZLIKLAR */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-green-200 shadow-sm p-5">
                  <h3 className="text-sm font-semibold text-green-700 mb-3 flex items-center gap-2">
                    <span>✓</span> Successes — What Went Well
                  </h3>
                  <div className="space-y-2">
                    {olay.basarilar.map((b, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-1.5"/>
                        <span className="text-sm text-gray-700 leading-relaxed">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-red-200 shadow-sm p-5">
                  <h3 className="text-sm font-semibold text-red-700 mb-3 flex items-center gap-2">
                    <span>✗</span> Failures — What Went Wrong
                  </h3>
                  <div className="space-y-2">
                    {olay.basarisizliklar.map((b, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 mt-1.5"/>
                        <span className="text-sm text-gray-700 leading-relaxed">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AKSİYON KALEMLERİ */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <span style={{ color: '#3B82F6' }}>→</span> Action Items
                  </h3>
                  <span className="text-xs text-gray-400 font-mono">
                    {tamamlanan} / {mevcutAksiyonlar.length} completed
                  </span>
                </div>
                {/* Progress bar */}
                <div className="mb-4">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-1.5 rounded-full bg-blue-500 transition-all"
                         style={{ width: `${mevcutAksiyonlar.length ? (tamamlanan / mevcutAksiyonlar.length) * 100 : 0}%` }}/>
                  </div>
                </div>
                <div className="space-y-2">
                  {mevcutAksiyonlar.map(a => (
                    <button key={a.id} onClick={() => toggleAksiyon(olay.id, a.id)}
                      className="w-full text-left flex items-center gap-3 p-3 rounded-lg border transition-all hover:bg-gray-50"
                      style={{ borderColor: a.tamamlandi ? '#6EE7B7' : '#E5E7EB', background: a.tamamlandi ? '#F0FDF4' : 'white' }}>
                      <div className="w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all"
                           style={{ borderColor: a.tamamlandi ? '#10B981' : '#D1D5DB', background: a.tamamlandi ? '#10B981' : 'white' }}>
                        {a.tamamlandi && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-gray-700" style={{ textDecoration: a.tamamlandi ? 'line-through' : 'none', opacity: a.tamamlandi ? 0.6 : 1 }}>
                        {a.metin}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-center" style={{ minHeight: 300 }}>
              <p className="text-sm text-gray-400">Select an event from the left.</p>
            </div>
          )}
        </div>

        <div className="mt-8 pt-5 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-gray-300">omniCRISIS · Crisis Management Module · OMNI Resilience Platform</p>
          <p className="text-xs text-gray-300">Beylikdüzü Municipality · 2026</p>
        </div>
      </div>
    </div>
  )
}
