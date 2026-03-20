'use client'
import { useState } from 'react'

type Kritiklik = 'Critical' | 'Important' | 'Supporting'
type BIADurum  = 'Completed' | 'Update Required' | 'Never Tested'
type PlanDurum = 'Approved' | 'Draft' | 'None'

interface KritikFonksiyon {
  id: number
  fonksiyon: string
  tip: 'Department' | 'Process' | 'Application'
  sorumlu: string
  kritiklik: Kritiklik
  mtd: string
  rto: string
  rpo: string
  biaDurum: BIADurum
  planDurum: PlanDurum
  sonTest: string
}

const FONKSIYONLAR: KritikFonksiyon[] = [
  { id:  1, fonksiyon: 'Emergency Hotline (112)',              tip: 'Department', sorumlu: 'Fire Dept.',            kritiklik: 'Critical',     mtd: '1h',   rto: '15min', rpo: '0min', biaDurum: 'Completed',           planDurum: 'Approved', sonTest: '10 Mar 2026' },
  { id:  2, fonksiyon: 'Drinking Water Distribution',          tip: 'Process',    sorumlu: 'Water Works',           kritiklik: 'Critical',     mtd: '4h',   rto: '2h',    rpo: '1h',   biaDurum: 'Completed',           planDurum: 'Approved', sonTest: '15 Feb 2026' },
  { id:  3, fonksiyon: 'Power Outage Response',                tip: 'Process',    sorumlu: 'Engineering',           kritiklik: 'Critical',     mtd: '2h',   rto: '30min', rpo: '0min', biaDurum: 'Completed',           planDurum: 'Approved', sonTest: '20 Jan 2026' },
  { id:  4, fonksiyon: 'Municipal Information System (BETS)',  tip: 'Application',sorumlu: 'IT Dept.',              kritiklik: 'Critical',     mtd: '8h',   rto: '4h',    rpo: '1h',   biaDurum: 'Update Required',     planDurum: 'Draft',    sonTest: '05 Nov 2025' },
  { id:  5, fonksiyon: 'Population Registry Services',         tip: 'Process',    sorumlu: 'Civil Registry',        kritiklik: 'Important',    mtd: '24h',  rto: '8h',    rpo: '4h',   biaDurum: 'Update Required',     planDurum: 'Draft',    sonTest: '12 Oct 2025' },
  { id:  6, fonksiyon: 'Zoning & Building Permits',            tip: 'Process',    sorumlu: 'Planning Dept.',        kritiklik: 'Important',    mtd: '48h',  rto: '24h',   rpo: '8h',   biaDurum: 'Never Tested',        planDurum: 'None',     sonTest: '—' },
  { id:  7, fonksiyon: 'Sanitation & Waste Collection',        tip: 'Department', sorumlu: 'Sanitation Dept.',      kritiklik: 'Important',    mtd: '24h',  rto: '12h',   rpo: '4h',   biaDurum: 'Completed',           planDurum: 'Approved', sonTest: '28 Feb 2026' },
  { id:  8, fonksiyon: 'Transport & Transit Coordination',     tip: 'Process',    sorumlu: 'Transport Dept.',       kritiklik: 'Important',    mtd: '8h',   rto: '4h',    rpo: '2h',   biaDurum: 'Update Required',     planDurum: 'Draft',    sonTest: '18 Dec 2025' },
  { id:  9, fonksiyon: 'NEFES Volunteer Coordination',         tip: 'Department', sorumlu: 'Civil Defence',         kritiklik: 'Critical',     mtd: '1h',   rto: '30min', rpo: '0min', biaDurum: 'Completed',           planDurum: 'Approved', sonTest: '15 Mar 2026' },
  { id: 10, fonksiyon: 'Financial Accounting & Payments',      tip: 'Application',sorumlu: 'Financial Services',    kritiklik: 'Important',    mtd: '48h',  rto: '24h',   rpo: '4h',   biaDurum: 'Update Required',     planDurum: 'Draft',    sonTest: '22 Oct 2025' },
  { id: 11, fonksiyon: 'Disaster Early Warning System',        tip: 'Application',sorumlu: 'Emergency Mgmt.',       kritiklik: 'Critical',     mtd: '30min',rto: '10min', rpo: '0min', biaDurum: 'Completed',           planDurum: 'Approved', sonTest: '01 Mar 2026' },
  { id: 12, fonksiyon: 'Social Assistance Services',           tip: 'Process',    sorumlu: 'Social Services',       kritiklik: 'Important',    mtd: '72h',  rto: '24h',   rpo: '8h',   biaDurum: 'Never Tested',        planDurum: 'None',     sonTest: '—' },
  { id: 13, fonksiyon: 'Public Health Surveillance',           tip: 'Process',    sorumlu: 'Health Affairs',        kritiklik: 'Critical',     mtd: '4h',   rto: '2h',    rpo: '1h',   biaDurum: 'Update Required',     planDurum: 'Draft',    sonTest: '30 Jan 2026' },
  { id: 14, fonksiyon: 'Parks & Green Space Maintenance',      tip: 'Department', sorumlu: 'Parks & Gardens',       kritiklik: 'Supporting',   mtd: '168h', rto: '72h',   rpo: '24h',  biaDurum: 'Never Tested',        planDurum: 'None',     sonTest: '—' },
  { id: 15, fonksiyon: 'Urban Renewal Project Management',     tip: 'Process',    sorumlu: 'Planning Dept.',        kritiklik: 'Important',    mtd: '96h',  rto: '48h',   rpo: '24h',  biaDurum: 'Never Tested',        planDurum: 'None',     sonTest: '—' },
  { id: 16, fonksiyon: 'NATECH Field Response Coordination',   tip: 'Process',    sorumlu: 'Fire Dept. & AFAD',     kritiklik: 'Critical',     mtd: '1h',   rto: '20min', rpo: '0min', biaDurum: 'Completed',           planDurum: 'Approved', sonTest: '10 Mar 2026' },
  { id: 17, fonksiyon: 'Flood & Inundation Response System',   tip: 'Process',    sorumlu: 'Engineering',           kritiklik: 'Critical',     mtd: '2h',   rto: '1h',    rpo: '0min', biaDurum: 'Completed',           planDurum: 'Approved', sonTest: '05 Mar 2026' },
  { id: 18, fonksiyon: 'E-Municipality Portal',                tip: 'Application',sorumlu: 'IT Dept.',              kritiklik: 'Important',    mtd: '24h',  rto: '8h',    rpo: '2h',   biaDurum: 'Update Required',     planDurum: 'Draft',    sonTest: '08 Dec 2025' },
  { id: 19, fonksiyon: 'Cemetery & Funeral Services',          tip: 'Department', sorumlu: 'Municipal Police',      kritiklik: 'Important',    mtd: '12h',  rto: '4h',    rpo: '2h',   biaDurum: 'Never Tested',        planDurum: 'None',     sonTest: '—' },
  { id: 20, fonksiyon: 'Harbor & Coastal Safety Monitoring',   tip: 'Process',    sorumlu: 'Environment Dept.',     kritiklik: 'Supporting',   mtd: '48h',  rto: '24h',   rpo: '8h',   biaDurum: 'Never Tested',        planDurum: 'None',     sonTest: '—' },
]

const KRITIKLIK_STYLE: Record<Kritiklik, { color: string; bg: string; border: string }> = {
  'Critical':   { color: '#DC2626', bg: '#FEE2E2', border: '#FCA5A5' },
  'Important':  { color: '#D97706', bg: '#FEF3C7', border: '#FCD34D' },
  'Supporting': { color: '#6B7280', bg: '#F3F4F6', border: '#D1D5DB' },
}

const BIA_STYLE: Record<BIADurum, { color: string; bg: string; border: string; dot: string }> = {
  'Completed':       { color: '#059669', bg: '#D1FAE5', border: '#6EE7B7', dot: '#10B981' },
  'Update Required': { color: '#D97706', bg: '#FEF3C7', border: '#FCD34D', dot: '#F59E0B' },
  'Never Tested':    { color: '#374151', bg: '#F3F4F6', border: '#D1D5DB', dot: '#6B7280' },
}

const PLAN_STYLE: Record<PlanDurum, { color: string; bg: string; border: string }> = {
  'Approved': { color: '#1D4ED8', bg: '#DBEAFE', border: '#93C5FD' },
  'Draft':    { color: '#D97706', bg: '#FEF3C7', border: '#FCD34D' },
  'None':     { color: '#9CA3AF', bg: '#F9FAFB', border: '#E5E7EB' },
}

export default function OmniPlanPage() {
  const [filtre, setFiltre] = useState<Kritiklik | 'hepsi'>('hepsi')
  const [aramaQ, setAramaQ] = useState('')

  const filtered = FONKSIYONLAR.filter(f =>
    (filtre === 'hepsi' || f.kritiklik === filtre) &&
    (aramaQ === '' || f.fonksiyon.toLowerCase().includes(aramaQ.toLowerCase()) || f.sorumlu.toLowerCase().includes(aramaQ.toLowerCase()))
  )

  const ozet = {
    toplam:   FONKSIYONLAR.length,
    kritik:   FONKSIYONLAR.filter(f => f.kritiklik === 'Critical').length,
    onaylı:   FONKSIYONLAR.filter(f => f.planDurum === 'Approved').length,
    hiçTest:  FONKSIYONLAR.filter(f => f.biaDurum === 'Never Tested').length,
  }

  return (
    <div className="min-h-screen" style={{ background: '#F8F9FA', fontFamily: "'DM Sans',sans-serif" }}>

      {/* HEADER */}
      <div style={{ background: '#0A1628' }} className="px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <div style={{ background: 'rgba(59,130,246,.15)', border: '1px solid rgba(59,130,246,.3)' }} className="p-2.5 rounded-xl">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">omniPLAN</h1>
              <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                Business Continuity & Disaster Recovery · RTO / RPO Tracking · Beylikdüzü Municipality
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg"
               style={{ background: 'rgba(59,130,246,.1)', border: '1px solid rgba(59,130,246,.2)', color: '#93C5FD' }}>
            ISO 22301 · BCM Framework
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-6">

        {/* KPI */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { lbl: 'Total Functions',  val: ozet.toplam, renk: '#3B82F6', sub: 'Critical function count' },
            { lbl: 'Critical',         val: ozet.kritik, renk: '#EF4444', sub: 'Critical priority'       },
            { lbl: 'Approved Plan',    val: ozet.onaylı,  renk: '#10B981', sub: 'BCP plan approved'      },
            { lbl: 'Never Tested',     val: ozet.hiçTest, renk: '#6B7280', sub: 'Awaiting test'          },
          ].map(k => (
            <div key={k.lbl} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">{k.lbl}</p>
              <p className="text-3xl font-bold font-mono mt-1" style={{ color: k.renk }}>{k.val}</p>
              <p className="text-xs text-gray-400 mt-2">{k.sub}</p>
            </div>
          ))}
        </div>

        {/* TOOLBAR */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
            <input type="text" placeholder="Search function or owner…" value={aramaQ}
              onChange={e => setAramaQ(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-300 flex-1 min-w-[180px]"/>
            <div className="flex gap-2 flex-wrap">
              {(['hepsi', 'Critical', 'Important', 'Supporting'] as const).map(k => {
                const a = filtre === k
                const s = k !== 'hepsi' ? KRITIKLIK_STYLE[k] : null
                return (
                  <button key={k} onClick={() => setFiltre(k)}
                    className="text-xs px-3 py-1 rounded-full border transition-all font-medium"
                    style={a && s ? { background: s.bg, color: s.color, borderColor: s.border } :
                           a ? { background: '#F1F5F9', color: '#0A1628', borderColor: '#CBD5E1' } :
                           { background: 'transparent', color: '#9CA3AF', borderColor: '#E5E7EB' }}>
                    {k === 'hepsi' ? 'All' : k}
                  </button>
                )
              })}
            </div>
            <span className="text-xs text-gray-400 ml-auto">{filtered.length} functions</span>
          </div>

          {/* TABLE HEADER */}
          <div className="hidden xl:grid px-4 py-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-50"
               style={{ gridTemplateColumns: '2.5fr 0.7fr 1fr 0.8fr 0.5fr 0.5fr 0.5fr 1fr 0.8fr 0.9fr' }}>
            <span>Critical Function</span>
            <span>Type</span>
            <span>Owner</span>
            <span>Criticality</span>
            <span>MTD</span>
            <span>RTO</span>
            <span>RPO</span>
            <span>BIA Status</span>
            <span>Plan</span>
            <span>Last Test</span>
          </div>

          {/* ROWS */}
          <div className="divide-y divide-gray-50">
            {filtered.map(f => {
              const ks = KRITIKLIK_STYLE[f.kritiklik]
              const bs = BIA_STYLE[f.biaDurum]
              const ps = PLAN_STYLE[f.planDurum]
              return (
                <div key={f.id}
                  className="grid xl:grid-cols-[2.5fr_0.7fr_1fr_0.8fr_0.5fr_0.5fr_0.5fr_1fr_0.8fr_0.9fr] items-center px-4 py-3 hover:bg-gray-50 transition-colors gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-300 w-5 flex-shrink-0">{f.id}</span>
                    <span className="font-medium text-gray-900 text-xs">{f.fonksiyon}</span>
                  </div>
                  <span className="text-xs text-gray-500">{f.tip}</span>
                  <span className="text-xs text-gray-600">{f.sorumlu}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full border w-fit"
                        style={{ color: ks.color, background: ks.bg, borderColor: ks.border }}>
                    {f.kritiklik}
                  </span>
                  <span className="text-xs font-mono text-gray-700 font-semibold">{f.mtd}</span>
                  <span className="text-xs font-mono font-bold" style={{ color: '#3B82F6' }}>{f.rto}</span>
                  <span className="text-xs font-mono font-bold" style={{ color: '#8B5CF6' }}>{f.rpo}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: bs.dot }}/>
                    <span className="text-xs px-2 py-0.5 rounded-full border"
                          style={{ color: bs.color, background: bs.bg, borderColor: bs.border }}>
                      {f.biaDurum}
                    </span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full border w-fit"
                        style={{ color: ps.color, background: ps.bg, borderColor: ps.border }}>
                    {f.planDurum}
                  </span>
                  <span className="text-xs font-mono text-gray-500">{f.sonTest}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* LEGEND */}
        <div className="mt-4 flex flex-wrap gap-6 text-xs text-gray-400">
          <div><span className="font-semibold text-gray-600">MTD</span> — Maximum Tolerable Downtime</div>
          <div><span className="font-semibold text-gray-600">RTO</span> — Recovery Time Objective</div>
          <div><span className="font-semibold text-gray-600">RPO</span> — Recovery Point Objective</div>
        </div>

        <div className="mt-8 pt-5 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-gray-300">omniPLAN · ISO 22301 BCM Framework · OMNI Resilience Platform</p>
          <p className="text-xs text-gray-300">Beylikdüzü Municipality · 2026</p>
        </div>
      </div>
    </div>
  )
}
