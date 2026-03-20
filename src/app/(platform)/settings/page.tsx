'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const NAVY   = '#0A1628'
const TEAL   = '#009B8D'
const BORDER = '#E5E7EB'

const sb = createClient(
  'https://gqguwgbopgnpwzjwcexl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5OTgzMywiZXhwIjoyMDg4OTc1ODMzfQ.Ku-JRx8JFH5a3SIj7sGP_Dy_nM89NMMW34gPyxVO_qI',
)
const TENANT = '11111111-0000-0000-0000-000000000001'

/* ─────────────────────────────────────────────────────────────
   FORM SETTINGS DATA
───────────────────────────────────────────────────────────── */
type Alan = { ad: string; tip: string; zorunlu: boolean; gorulur: boolean; sira: number }
const BASLANGIC_ALANLAR: Alan[] = [
  { ad: 'Facility Name',    tip: 'text',      zorunlu: true,  gorulur: true,  sira: 1  },
  { ad: 'Unit Code',        tip: 'text',      zorunlu: true,  gorulur: true,  sira: 2  },
  { ad: 'Sector',           tip: 'selection', zorunlu: true,  gorulur: true,  sira: 3  },
  { ad: 'Sub-Sector',       tip: 'selection', zorunlu: false, gorulur: true,  sira: 4  },
  { ad: 'Construction Year',tip: 'number',    zorunlu: true,  gorulur: true,  sira: 5  },
  { ad: 'Floor Count',      tip: 'number',    zorunlu: true,  gorulur: true,  sira: 6  },
  { ad: 'Gross Area (m²)',  tip: 'number',    zorunlu: false, gorulur: true,  sira: 7  },
  { ad: 'Soil Class',       tip: 'selection', zorunlu: false, gorulur: true,  sira: 8  },
  { ad: 'Seismic Zone',     tip: 'selection', zorunlu: false, gorulur: true,  sira: 9  },
  { ad: 'Employee Count',   tip: 'number',    zorunlu: false, gorulur: true,  sira: 10 },
  { ad: 'Daily Visitors',   tip: 'number',    zorunlu: false, gorulur: false, sira: 11 },
  { ad: '24/7 Operation',   tip: 'checkbox',  zorunlu: false, gorulur: true,  sira: 12 },
  { ad: 'Generator',        tip: 'checkbox',  zorunlu: false, gorulur: true,  sira: 13 },
  { ad: 'UPS',              tip: 'checkbox',  zorunlu: false, gorulur: true,  sira: 14 },
  { ad: 'Sprinkler',        tip: 'checkbox',  zorunlu: false, gorulur: false, sira: 15 },
]

type Soru = { kod: string; metin: string; agirlik: number; boyut: 'H'|'F'|'E'|'C'; tersSkor: boolean }
const BASLANGIC_SORULAR: Soru[] = [
  { kod: 'H1', metin: 'Seismic hazard frequency',       agirlik: 5, boyut: 'H', tersSkor: false },
  { kod: 'H2', metin: 'Flood exposure level',           agirlik: 4, boyut: 'H', tersSkor: false },
  { kod: 'H3', metin: 'Seismic soil class',             agirlik: 4, boyut: 'H', tersSkor: false },
  { kod: 'F1', metin: 'Building age and deterioration', agirlik: 5, boyut: 'F', tersSkor: false },
  { kod: 'F2', metin: 'Key personnel dependency',       agirlik: 3, boyut: 'F', tersSkor: false },
  { kod: 'F3', metin: 'Structural reinforcement status',agirlik: 4, boyut: 'F', tersSkor: true  },
  { kod: 'E1', metin: 'Daily visitor density',          agirlik: 3, boyut: 'E', tersSkor: false },
  { kod: 'E2', metin: 'Critical service outage impact', agirlik: 5, boyut: 'E', tersSkor: false },
  { kod: 'C1', metin: 'BCP plan existence and currency',agirlik: 5, boyut: 'C', tersSkor: true  },
  { kod: 'C2', metin: 'Backup power system capacity',   agirlik: 4, boyut: 'C', tersSkor: true  },
]

const SEKTÖRLER   = ['Banking', 'Healthcare', 'Hospitality', 'Industry', 'Municipality', 'Education', 'Services', 'Chambers']
const SORU_SETLERI = ['HFE-360', 'SATAKOL', 'SRTF', 'ETAHF', 'Belediye']
const BOYUT_RENK: Record<string, string> = { H: '#EF4444', F: '#F97316', E: '#EAB308', C: '#22C55E' }

/* ─────────────────────────────────────────────────────────────
   k(s,t) MATRIX
───────────────────────────────────────────────────────────── */
const HAZARDS  = ['deprem', 'sel', 'natech', 'siber'] as const
const SECTORS  = ['HOSPITAL', 'INDUSTRIAL', 'BANK', 'MUNICIPALITY', 'EDUCATION', 'HOTEL'] as const
type HazardKey  = typeof HAZARDS[number]
type SectorKey  = typeof SECTORS[number]
type KMatrix    = Record<SectorKey, Record<HazardKey, number>>

const SECTOR_TR: Record<SectorKey, string> = {
  HOSPITAL:     'Healthcare',
  INDUSTRIAL:   'Industry',
  BANK:         'Finance',
  MUNICIPALITY: 'Municipality',
  EDUCATION:    'Education',
  HOTEL:        'Hospitality',
}
const HAZARD_TR: Record<HazardKey, string> = {
  deprem: 'Earthquake', sel: 'Flood', natech: 'NATECH', siber: 'Cyber',
}
const HAZARD_DESC: Record<HazardKey, string> = {
  deprem: 'Structural vulnerability and soil effect',
  sel:    'Coastal location and drainage capacity',
  natech: 'Hazardous materials and domino effect',
  siber:  'IT dependency and digital exposure',
}

const DEFAULT_K: KMatrix = {
  HOSPITAL:     { deprem: 2.8, sel: 2.1, natech: 3.5, siber: 4.2 },
  INDUSTRIAL:   { deprem: 3.2, sel: 2.8, natech: 4.8, siber: 1.9 },
  BANK:         { deprem: 1.8, sel: 1.5, natech: 2.0, siber: 5.1 },
  MUNICIPALITY: { deprem: 3.0, sel: 2.5, natech: 3.2, siber: 3.8 },
  EDUCATION:    { deprem: 2.5, sel: 2.0, natech: 1.8, siber: 2.2 },
  HOTEL:        { deprem: 2.2, sel: 3.0, natech: 2.5, siber: 2.8 },
}

function kRenk(v: number) {
  if (v < 1.5) return { bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' }
  if (v < 3.0) return { bg: '#FFFBEB', border: '#FDE68A', text: '#B45309' }
  if (v < 4.5) return { bg: '#FFF7ED', border: '#FED7AA', text: '#C2410C' }
  return { bg: '#FEF2F2', border: '#FECACA', text: '#B91C1C' }
}

/** Simplified URI simulation: fix H=60, F=50, E=50, B=1.0, HRO_α=1.0, C=0.5 → vary only k */
function simUri(k: number, cDeficit = 0.5): number {
  const h = 0.6, f = 0.5, e = 0.5, b = 1.0, hroAlpha = 1.0
  const raw = h * f * e * b
  const adj = raw / ((1 + k * (cDeficit ** 2)) * hroAlpha)
  return Math.round(Math.min(Math.max(100 * (1 - Math.min(adj / 4, 1)), 0), 100) * 10) / 10
}

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────────────────────── */
function Toggle({ val, onChange }: { val: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!val)}
      style={{ width: 36, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer',
               background: val ? TEAL : '#CBD5E1', position: 'relative', transition: 'background .2s', flexShrink: 0 }}>
      <span style={{ position: 'absolute', top: 2, left: val ? 18 : 2, width: 16, height: 16,
                     borderRadius: '50%', background: 'white', transition: 'left .2s', display: 'block' }}/>
    </button>
  )
}

/* ─────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────── */
export default function SettingsPage() {
  const [sekme, setSekme] = useState<'form' | 'kmatrix'>('form')

  // ── Form settings state ──
  const [alanlar, setAlanlar]       = useState<Alan[]>(BASLANGIC_ALANLAR)
  const [sorular, setSorular]       = useState<Soru[]>(BASLANGIC_SORULAR)
  const [tumSorular, setTumSorular] = useState(false)
  const [sektorSetler, setSektorSetler] = useState<Record<string, string>>(
    Object.fromEntries(SEKTÖRLER.map(s => [s, 'HFE-360']))
  )
  const [kaydedildi, setKaydedildi] = useState(false)

  // ── k-matrix state ──
  const [kMatrix, setKMatrix] = useState<KMatrix>(() => {
    try {
      const stored = localStorage.getItem('omni_k_matrix')
      return stored ? JSON.parse(stored) : DEFAULT_K
    } catch { return DEFAULT_K }
  })
  const [kKaydedildi, setKKaydedildi] = useState(false)

  // ── Simulator state ──
  const [facilities, setFacilities] = useState<{ id: string; name: string; sector: string }[]>([])
  const [simFacility, setSimFacility] = useState('')
  const [simHazard, setSimHazard]     = useState<HazardKey>('deprem')
  const [simK, setSimK]               = useState(2.8)

  useEffect(() => {
    sb.from('facilities')
      .select('id,name,sector')
      .eq('tenant_id', TENANT)
      .eq('is_active', true)
      .limit(50)
      .then(({ data }) => {
        if (data) {
          setFacilities(data as { id: string; name: string; sector: string }[])
          if (data.length) setSimFacility(data[0].id)
        }
      })
  }, [])

  // When facility/hazard selection changes, pre-fill slider from matrix
  useEffect(() => {
    const fac = facilities.find(f => f.id === simFacility)
    if (!fac) return
    const sec = fac.sector.toUpperCase() as SectorKey
    if (SECTORS.includes(sec) && kMatrix[sec]) {
      setSimK(kMatrix[sec][simHazard])
    }
  }, [simFacility, simHazard, facilities, kMatrix])

  const alanGuncelle = (i: number, key: keyof Alan, val: unknown) =>
    setAlanlar(prev => prev.map((a, idx) => idx === i ? { ...a, [key]: val } : a))

  const alanTasi = (i: number, yon: -1 | 1) => {
    setAlanlar(prev => {
      const copy = [...prev]
      const j = i + yon
      if (j < 0 || j >= copy.length) return prev
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
      return copy.map((a, idx) => ({ ...a, sira: idx + 1 }))
    })
  }

  const kaydet = () => {
    setKaydedildi(true)
    setTimeout(() => setKaydedildi(false), 3000)
  }

  const kHucreGuncelle = (sector: SectorKey, hazard: HazardKey, val: number) => {
    setKMatrix(prev => ({
      ...prev,
      [sector]: { ...prev[sector], [hazard]: val },
    }))
  }

  const kKaydet = async () => {
    localStorage.setItem('omni_k_matrix', JSON.stringify(kMatrix))
    try {
      const res = await fetch(
        'https://omniversel-risk-engine-production.up.railway.app/api/v1/config/k-matrix',
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sector_matrix: kMatrix }) }
      )
      console.log('k-matrix API response:', res.status)
    } catch (err) {
      console.log('k-matrix API yok, sadece localStorage kaydedildi:', err)
    }
    setKKaydedildi(true)
    setTimeout(() => setKKaydedildi(false), 3000)
  }

  const kSifirla = () => setKMatrix(DEFAULT_K)

  const simFacObj = facilities.find(f => f.id === simFacility)
  const simSector = (simFacObj?.sector?.toUpperCase() ?? 'HOSPITAL') as SectorKey
  const baseK     = SECTORS.includes(simSector) ? (DEFAULT_K[simSector]?.[simHazard] ?? 2.8) : 2.8
  const simUriBase = simUri(baseK)
  const simUriNew  = simUri(simK)
  const uriDelta   = simUriNew - simUriBase

  const gosterilecekSorular = tumSorular ? sorular : sorular.slice(0, 10)

  return (
    <div style={{ minHeight: '100vh', background: '#F8F6F3', fontFamily: "'DM Sans',sans-serif" }}>

      {/* ── Sticky header ─────────────────────────────────────────── */}
      <div style={{ background: 'white', borderBottom: `1px solid ${BORDER}`, padding: '20px 32px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    position: 'sticky', top: 0, zIndex: 10 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: NAVY, margin: 0 }}>
            {sekme === 'form' ? 'Form Settings' : 'omniRISK k(s,t) Coefficient Matrix'}
          </h1>
          <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>
            {sekme === 'form'
              ? 'Facility card fields, question weights and sector form configuration'
              : 'Sector × hazard type risk coefficient — directly affects HFER-720 URI calculation'}
          </p>
        </div>
        {sekme === 'form' ? (
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={() => { setAlanlar(BASLANGIC_ALANLAR); setSorular(BASLANGIC_SORULAR) }}
              style={btnOutline}>Cancel</button>
            <button type="button" onClick={kaydet}
              style={{ ...btnSolid, background: kaydedildi ? '#22C55E' : NAVY }}>
              {kaydedildi ? '✓ Saved' : 'Save'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={kSifirla} style={btnOutline}>↺ Reset to Default</button>
            <button type="button" onClick={kKaydet}
              style={{ ...btnSolid, background: kKaydedildi ? '#22C55E' : NAVY }}>
              {kKaydedildi ? '✓ Saved' : '💾 Save'}
            </button>
          </div>
        )}
      </div>

      {/* ── Sekme bar ────────────────────────────────────────────── */}
      <div style={{ background: 'white', borderBottom: `1px solid ${BORDER}`, padding: '0 32px',
                    display: 'flex', gap: 4 }}>
        {([
          { key: 'form',    label: 'Form Settings' },
          { key: 'kmatrix', label: 'k(s,t) Coefficient Matrix' },
        ] as { key: 'form' | 'kmatrix'; label: string }[]).map(tab => (
          <button key={tab.key} type="button" onClick={() => setSekme(tab.key)}
            style={{
              padding: '12px 20px', border: 'none', background: 'transparent', cursor: 'pointer',
              fontSize: 13, fontWeight: sekme === tab.key ? 700 : 500,
              color: sekme === tab.key ? TEAL : '#6B7280',
              borderBottom: `2px solid ${sekme === tab.key ? TEAL : 'transparent'}`,
              fontFamily: "'DM Sans',sans-serif", transition: 'all .15s',
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: sekme === 'kmatrix' ? 1100 : 960, margin: '0 auto', padding: '28px 24px 80px' }}>

        {/* ════════════════════════════════════════════════════════
            SEKME 1 — FORM AYARLARI
        ════════════════════════════════════════════════════════ */}
        {sekme === 'form' && (<>

          {/* A) Facility Card Fields */}
          <div style={card}>
            <h2 style={cardTitle}>A — Facility Card Fields</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${BORDER}` }}>
                    {['Order', 'Field Name', 'Type', 'Required', 'Visible', 'Move'].map(h => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {alanlar.map((alan, i) => (
                    <tr key={alan.ad} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
                      <td style={{ ...td, color: '#9CA3AF', fontFamily: 'monospace', fontSize: 11 }}>{String(alan.sira).padStart(2, '0')}</td>
                      <td style={{ ...td, fontWeight: 600, color: NAVY }}>{alan.ad}</td>
                      <td style={td}><span style={{ fontSize: 11, background: '#F3F4F6', borderRadius: 4, padding: '2px 8px', color: '#374151' }}>{alan.tip}</span></td>
                      <td style={td}><Toggle val={alan.zorunlu} onChange={v => alanGuncelle(i, 'zorunlu', v)} /></td>
                      <td style={td}><Toggle val={alan.gorulur} onChange={v => alanGuncelle(i, 'gorulur', v)} /></td>
                      <td style={td}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button type="button" onClick={() => alanTasi(i, -1)} disabled={i === 0}
                            style={{ ...arrowBtn, opacity: i === 0 ? 0.3 : 1 }}>↑</button>
                          <button type="button" onClick={() => alanTasi(i, 1)} disabled={i === alanlar.length - 1}
                            style={{ ...arrowBtn, opacity: i === alanlar.length - 1 ? 0.3 : 1 }}>↓</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* B) Question Weights */}
          <div style={card}>
            <h2 style={cardTitle}>B — Question Weights</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: `2px solid ${BORDER}` }}>
                    {['Code', 'Question', 'Weight (1–5)', 'Dimension', 'Reverse Score'].map(h => (
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {gosterilecekSorular.map((soru, i) => (
                    <tr key={soru.kod} style={{ borderBottom: `1px solid ${BORDER}`, background: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
                      <td style={{ ...td, fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: BOYUT_RENK[soru.boyut] }}>{soru.kod}</td>
                      <td style={{ ...td, color: NAVY, maxWidth: 280 }}>{soru.metin}</td>
                      <td style={td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <input type="range" min={1} max={5} step={1} value={soru.agirlik}
                            onChange={e => setSorular(prev => prev.map((s, idx) => idx === i ? { ...s, agirlik: parseInt(e.target.value) } : s))}
                            style={{ width: 100, accentColor: TEAL }} />
                          <span style={{ fontSize: 13, fontWeight: 700, color: NAVY, fontFamily: 'monospace', minWidth: 16, textAlign: 'center' }}>{soru.agirlik}</span>
                        </div>
                      </td>
                      <td style={td}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
                                       color: BOYUT_RENK[soru.boyut], background: BOYUT_RENK[soru.boyut] + '15',
                                       border: `1px solid ${BOYUT_RENK[soru.boyut]}30` }}>{soru.boyut}</span>
                      </td>
                      <td style={td}>
                        <Toggle val={soru.tersSkor} onChange={v => setSorular(prev => prev.map((s, idx) => idx === i ? { ...s, tersSkor: v } : s))} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!tumSorular && (
              <button type="button" onClick={() => setTumSorular(true)}
                style={{ marginTop: 12, padding: '8px 18px', borderRadius: 8, border: `1.5px solid ${TEAL}`,
                          background: `${TEAL}08`, color: TEAL, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                          fontFamily: "'DM Sans',sans-serif" }}>
                Show All ({sorular.length} questions)
              </button>
            )}
          </div>

          {/* C) Sector Form Settings */}
          <div style={card}>
            <h2 style={cardTitle}>C — Sector Form Settings</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 12 }}>
              {SEKTÖRLER.map(sektor => (
                <div key={sektor} style={{ display: 'flex', alignItems: 'center', gap: 12,
                                            padding: '12px 16px', background: '#F9FAFB',
                                            borderRadius: 10, border: `1px solid ${BORDER}` }}>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: NAVY }}>{sektor}</span>
                  <select value={sektorSetler[sektor]}
                    onChange={e => setSektorSetler(prev => ({ ...prev, [sektor]: e.target.value }))}
                    style={{ padding: '5px 10px', borderRadius: 6, border: `1px solid ${BORDER}`,
                              fontSize: 12, color: NAVY, background: 'white', fontFamily: "'DM Sans',sans-serif", cursor: 'pointer' }}>
                    {SORU_SETLERI.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => { setAlanlar(BASLANGIC_ALANLAR); setSorular(BASLANGIC_SORULAR) }}
              style={btnOutline}>Cancel</button>
            <button type="button" onClick={kaydet}
              style={{ ...btnSolid, background: kaydedildi ? '#22C55E' : NAVY }}>
              {kaydedildi ? '✓ Saved' : 'Save'}
            </button>
          </div>
        </>)}

        {/* ════════════════════════════════════════════════════════
            SEKME 2 — k(s,t) MATRİS EDİTÖRÜ
        ════════════════════════════════════════════════════════ */}
        {sekme === 'kmatrix' && (<>

          {/* Açıklama kartı */}
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 12,
                        padding: '14px 20px', marginBottom: 24, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>ℹ️</span>
            <div>
              <p style={{ fontSize: 13, color: '#1E40AF', fontWeight: 600, margin: '0 0 4px' }}>
                k(s,t) katsayısı — URI = (H × F × E × B) / (1 + <strong>k(s,t)</strong> × C²) × HRO_α
              </p>
              <p style={{ fontSize: 12, color: '#3B82F6', margin: 0 }}>
                Higher k value: the same capacity investment yields greater risk reduction.
                Color code: <span style={{ color: '#15803D', fontWeight: 700 }}>green &lt;1.5</span> · <span style={{ color: '#B45309', fontWeight: 700 }}>yellow 1.5–3.0</span> · <span style={{ color: '#C2410C', fontWeight: 700 }}>orange 3.0–4.5</span> · <span style={{ color: '#B91C1C', fontWeight: 700 }}>red &gt;4.5</span>
              </p>
            </div>
          </div>

          {/* k(s,t) Grid */}
          <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
            {/* Tablo başlığı */}
            <div style={{ display: 'grid', gridTemplateColumns: '140px repeat(4,1fr)',
                          background: NAVY, padding: '12px 20px', gap: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.08em' }}>
                Sector
              </div>
              {HAZARDS.map(h => (
                <div key={h} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{HAZARD_TR[h]}</div>
                  <div style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>{HAZARD_DESC[h]}</div>
                </div>
              ))}
            </div>

            {/* Satırlar */}
            {SECTORS.map((sector, si) => (
              <div key={sector}
                style={{ display: 'grid', gridTemplateColumns: '140px repeat(4,1fr)',
                          padding: '14px 20px', gap: 12, alignItems: 'center',
                          background: si % 2 === 0 ? 'white' : '#FAFAFA',
                          borderBottom: si < SECTORS.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{SECTOR_TR[sector]}</div>
                  <div style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'monospace' }}>{sector}</div>
                </div>
                {HAZARDS.map(hazard => {
                  const val = kMatrix[sector][hazard]
                  const c   = kRenk(val)
                  return (
                    <div key={hazard} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          min={0.5} max={6.0} step={0.1}
                          value={val}
                          onChange={e => {
                            const n = parseFloat(e.target.value)
                            if (!isNaN(n) && n >= 0.5 && n <= 6.0) kHucreGuncelle(sector, hazard, n)
                          }}
                          style={{
                            width: 80, padding: '8px 10px', borderRadius: 8, textAlign: 'center',
                            fontSize: 15, fontWeight: 800, fontFamily: 'monospace',
                            border: `2px solid ${c.border}`,
                            background: c.bg, color: c.text,
                            outline: 'none', cursor: 'pointer',
                          }}
                        />
                      </div>
                      <div style={{ fontSize: 9, fontWeight: 700, color: c.text, letterSpacing: '.5px', textTransform: 'uppercase' }}>
                        {val < 1.5 ? 'Low' : val < 3.0 ? 'Medium' : val < 4.5 ? 'High' : 'Critical'}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}

            {/* Sütun ortalama satırı */}
            <div style={{ display: 'grid', gridTemplateColumns: '140px repeat(4,1fr)',
                          padding: '12px 20px', gap: 12, background: '#F8FAFC',
                          borderTop: `2px solid ${BORDER}`, alignItems: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                Avg.
              </div>
              {HAZARDS.map(hazard => {
                const avg = SECTORS.reduce((sum, s) => sum + kMatrix[s][hazard], 0) / SECTORS.length
                const c   = kRenk(avg)
                return (
                  <div key={hazard} style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 800, fontFamily: 'monospace', color: c.text }}>
                      {avg.toFixed(2)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── ETKİ SİMÜLATÖRÜ ──────────────────────────────────── */}
          <div style={{ ...card, marginTop: 24 }}>
            <h2 style={{ ...cardTitle, marginBottom: 20 }}>⚡ Impact Simulator</h2>
            <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 20 }}>
              See in real time how the URI score is affected when you change the k value.
              <em style={{ color: '#9CA3AF', fontSize: 12 }}> (H=0.6, F=0.5, E=0.5, C-deficit=0.5, B=1.0 fixed assumptions)</em>
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 24 }}>
              {/* Tesis seçimi */}
              <div>
                <label style={labelStyle}>Facility</label>
                <select value={simFacility} onChange={e => setSimFacility(e.target.value)}
                  style={selectStyle}>
                  {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  {!facilities.length && <option>Loading…</option>}
                </select>
              </div>

              {/* Tehlike türü */}
              <div>
                <label style={labelStyle}>Hazard Type</label>
                <select value={simHazard} onChange={e => setSimHazard(e.target.value as HazardKey)}
                  style={selectStyle}>
                  {HAZARDS.map(h => <option key={h} value={h}>{HAZARD_TR[h]}</option>)}
                </select>
              </div>

              {/* k slider */}
              <div>
                <label style={labelStyle}>k value</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                  <input type="range" min={0.5} max={6.0} step={0.1} value={simK}
                    onChange={e => setSimK(parseFloat(e.target.value))}
                    style={{ flex: 1, accentColor: TEAL }} />
                  <span style={{ fontSize: 16, fontWeight: 800, fontFamily: 'monospace', color: NAVY, minWidth: 36 }}>
                    {simK.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Sonuç kartları */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
              <div style={{ background: '#F8FAFC', borderRadius: 12, padding: '20px 24px', border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8 }}>
                  Current k = {baseK.toFixed(1)}
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'monospace', color: uriColor(simUriBase) }}>
                  {simUriBase}
                </div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>URI Score</div>
              </div>

              <div style={{ background: '#F8FAFC', borderRadius: 12, padding: '20px 24px', border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8 }}>
                  New k = {simK.toFixed(1)}
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'monospace', color: uriColor(simUriNew) }}>
                  {simUriNew}
                </div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>URI Score</div>
              </div>

              <div style={{ background: uriDelta >= 0 ? '#F0FDF4' : '#FEF2F2', borderRadius: 12,
                             padding: '20px 24px', border: `1px solid ${uriDelta >= 0 ? '#BBF7D0' : '#FECACA'}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 8 }}>
                  Δ Delta
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'monospace',
                               color: uriDelta >= 0 ? '#15803D' : '#B91C1C' }}>
                  {uriDelta >= 0 ? '+' : ''}{uriDelta.toFixed(1)}
                </div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>
                  {uriDelta > 0 ? 'URI improvement' : uriDelta < 0 ? 'URI degradation' : 'No change'}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16, padding: '12px 16px', background: '#FFFBEB',
                          border: '1px solid #FDE68A', borderRadius: 8, fontSize: 12, color: '#92400E' }}>
              <strong>k={baseK.toFixed(1)} → URI: {simUriBase}</strong>
              {' '} / {' '}
              <strong>k={simK.toFixed(1)} → URI: {simUriNew}</strong>
              {' '}
              {simFacObj && <span>— {simFacObj.name} · {HAZARD_TR[simHazard]}</span>}
            </div>
          </div>
        </>)}
      </div>
    </div>
  )
}

/* ── Shared style objects ─────────────────────────────────── */
const card: React.CSSProperties = {
  background: 'white', borderRadius: 16, border: `1px solid #E5E7EB`,
  padding: '24px', marginBottom: 24,
}
const cardTitle: React.CSSProperties = {
  fontSize: 14, fontWeight: 800, color: NAVY, margin: '0 0 18px',
  textTransform: 'uppercase', letterSpacing: '.08em',
}
const thStyle: React.CSSProperties = {
  padding: '8px 12px', textAlign: 'left', fontSize: 11,
  fontWeight: 700, color: '#6B7280', letterSpacing: '.05em', textTransform: 'uppercase',
}
const td: React.CSSProperties = { padding: '10px 12px' }
const btnOutline: React.CSSProperties = {
  padding: '9px 20px', borderRadius: 8, border: `1.5px solid #E5E7EB`,
  background: 'white', color: '#374151', fontSize: 13, fontWeight: 600,
  cursor: 'pointer', fontFamily: "'DM Sans',sans-serif",
}
const btnSolid: React.CSSProperties = {
  padding: '9px 20px', borderRadius: 8, border: 'none',
  color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer',
  fontFamily: "'DM Sans',sans-serif", transition: 'background .3s',
}
const arrowBtn: React.CSSProperties = {
  width: 24, height: 24, borderRadius: 4, border: `1px solid #E5E7EB`,
  background: 'white', cursor: 'pointer', fontSize: 12, lineHeight: '1',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 700, color: '#6B7280',
  textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6,
}
const selectStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: 8, border: `1.5px solid #E5E7EB`,
  fontSize: 13, color: NAVY, background: 'white', fontFamily: "'DM Sans',sans-serif", cursor: 'pointer',
}

function uriColor(uri: number) {
  if (uri < 50) return '#EF4444'
  if (uri < 70) return '#F97316'
  if (uri < 85) return '#F59E0B'
  return '#22C55E'
}
