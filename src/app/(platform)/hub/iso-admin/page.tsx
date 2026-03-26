'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { SORULAR_SANAYI } from '@/lib/sorular-sanayi'

const sb = createClient(
  'https://gqguwgbopgnpwzjwcexl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5OTgzMywiZXhwIjoyMDg4OTc1ODMzfQ.Ku-JRx8JFH5a3SIj7sGP_Dy_nM89NMMW34gPyxVO_qI',
)

const NAVY = '#0A1628'; const TEAL = '#009B8D'; const BORDER = '#E2E8F0'

type Sekme = 'izleme' | 'sorular' | 'kmatris'

// ─── Risk rengi ───────────────────────────────────────────────────────────────
function uriRenk(uri: number) {
  return uri < 30 ? '#22C55E' : uri < 50 ? '#EAB308' : uri < 70 ? '#F97316' : '#EF4444'
}
function uriEtiket(uri: number) {
  return uri < 30 ? 'Düşük' : uri < 50 ? 'Orta' : uri < 70 ? 'Yüksek' : 'Kritik'
}

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ val, onChange }: { val: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!val)}
      style={{ width: 36, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer', background: val ? TEAL : '#CBD5E1', position: 'relative', transition: 'background .2s', flexShrink: 0 }}>
      <span style={{ position: 'absolute', top: 2, left: val ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: 'white', transition: 'left .2s', display: 'block' }} />
    </button>
  )
}

// ─── KPI Kart ─────────────────────────────────────────────────────────────────
function KpiKart({ baslik, deger, renk }: { baslik: string; deger: string | number; renk?: string }) {
  return (
    <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '16px 20px', minWidth: 140 }}>
      <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: .5 }}>{baslik}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: renk ?? NAVY, fontFamily: 'DM Mono, monospace' }}>{deger}</div>
    </div>
  )
}

// ─── SEKME 1: Form İzleme ─────────────────────────────────────────────────────
type TesisFormu = {
  token: string
  envanter: Record<string, unknown>
  uri_skoru: number
  lat: number
  lng: number
  gonderim_tarihi: string
}

function FormIzlemeSekme() {
  const [formlar, setFormlar] = useState<TesisFormu[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)

  useEffect(() => {
    sb.from('iso_tesis_formlari')
      .select('token, envanter, uri_skoru, lat, lng, gonderim_tarihi')
      .order('gonderim_tarihi', { ascending: false })
      .then(({ data }) => {
        if (data) setFormlar(data as TesisFormu[])
        setYukleniyor(false)
      })
  }, [])

  const buHafta = formlar.filter(f => {
    const d = new Date(f.gonderim_tarihi)
    const haftaOnce = new Date(); haftaOnce.setDate(haftaOnce.getDate() - 7)
    return d >= haftaOnce
  }).length

  const ortUri = formlar.length
    ? Math.round(formlar.reduce((s, f) => s + f.uri_skoru, 0) / formlar.length)
    : 0

  const kritik = formlar.filter(f => f.uri_skoru > 50).length

  return (
    <div>
      {/* KPI */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        <KpiKart baslik="Toplam Gönderim" deger={formlar.length} />
        <KpiKart baslik="Ortalama URI" deger={ortUri} renk={uriRenk(ortUri)} />
        <KpiKart baslik="Kritik Tesis (URI>50)" deger={kritik} renk="#EF4444" />
        <KpiKart baslik="Bu Hafta" deger={buHafta} renk={TEAL} />
      </div>

      {/* Tablo */}
      <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>Gönderilen Formlar</span>
          <button onClick={() => window.location.reload()} style={{ fontSize: 12, color: TEAL, background: 'none', border: 'none', cursor: 'pointer' }}>↻ Yenile</button>
        </div>
        {yukleniyor ? (
          <div style={{ padding: 32, textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>Yükleniyor...</div>
        ) : formlar.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>Henüz form gönderilmemiş.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {['Token', 'Firma Adı', 'URI Skoru', 'Risk', 'Gönderim Tarihi', 'Konum'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left' as const, fontWeight: 600, color: '#64748B', borderBottom: `1px solid ${BORDER}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {formlar.map((f, i) => {
                  const firma = (f.envanter?.E01 as string) || '—'
                  const renk = uriRenk(f.uri_skoru)
                  return (
                    <tr key={f.token} style={{ background: i % 2 === 0 ? 'white' : '#FAFBFC' }}>
                      <td style={{ padding: '10px 16px', color: '#94A3B8', fontFamily: 'monospace', fontSize: 11 }}>{f.token.slice(0, 8)}…</td>
                      <td style={{ padding: '10px 16px', fontWeight: 600, color: NAVY }}>{firma}</td>
                      <td style={{ padding: '10px 16px' }}>
                        <span style={{ fontWeight: 800, color: renk, fontFamily: 'DM Mono, monospace', fontSize: 16 }}>{f.uri_skoru}</span>
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: renk, background: renk + '15', padding: '2px 8px', borderRadius: 20 }}>{uriEtiket(f.uri_skoru)}</span>
                      </td>
                      <td style={{ padding: '10px 16px', color: '#64748B' }}>
                        {new Date(f.gonderim_tarihi).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        {f.lat && f.lng ? (
                          <a href={`https://www.google.com/maps?q=${f.lat},${f.lng}`} target="_blank" rel="noreferrer"
                            style={{ fontSize: 12, color: TEAL, textDecoration: 'none' }}>📍 Harita</a>
                        ) : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── SEKME 2: Soru Yönetimi ───────────────────────────────────────────────────
type SoruAyar = { kod: string; agirlik: number; kritik: boolean }

function SoruYonetimiSekme() {
  const [ayarlar, setAyarlar] = useState<Record<string, SoruAyar>>(() =>
    Object.fromEntries(SORULAR_SANAYI.map(s => [s.kod, { kod: s.kod, agirlik: s.agirlik, kritik: s.kritik }]))
  )
  const [kaydediliyor, setKaydediliyor] = useState(false)
  const [mesaj, setMesaj] = useState('')

  const setAgirlik = (kod: string, agirlik: number) => setAyarlar(a => ({ ...a, [kod]: { ...a[kod], agirlik } }))
  const setKritik = (kod: string, kritik: boolean) => setAyarlar(a => ({ ...a, [kod]: { ...a[kod], kritik } }))

  const kaydet = async () => {
    setKaydediliyor(true); setMesaj('')
    const rows = Object.values(ayarlar).map(a => ({ ...a, guncelleme: new Date().toISOString() }))
    const { error } = await sb.from('soru_ayarlari').upsert(rows, { onConflict: 'kod' })
    setMesaj(error ? 'Hata: ' + error.message : '✓ Değişiklikler kaydedildi.')
    setKaydediliyor(false)
  }

  const BOLUMLER = [
    { baslik: 'Tehlike', sorular: SORULAR_SANAYI.filter(s => s.bolum === 'TEHLİKE'), renk: '#EF4444' },
    { baslik: 'Kırılganlık', sorular: SORULAR_SANAYI.filter(s => s.bolum === 'KIRILGANLIK'), renk: '#F97316' },
    { baslik: 'Kapasite', sorular: SORULAR_SANAYI.filter(s => s.bolum === 'KAPASİTE' && s.boyut !== 'HRO'), renk: '#10B981' },
    { baslik: 'HRO', sorular: SORULAR_SANAYI.filter(s => s.boyut === 'HRO'), renk: '#8B5CF6' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <p style={{ fontSize: 13, color: '#64748B' }}>Ağırlık ve kritiklik ayarlarını değiştirip kaydedin. Değişiklikler URI hesabını etkiler.</p>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {mesaj && <span style={{ fontSize: 12, color: mesaj.startsWith('✓') ? '#15803D' : '#EF4444' }}>{mesaj}</span>}
          <button onClick={kaydet} disabled={kaydediliyor}
            style={{ padding: '9px 24px', background: kaydediliyor ? '#94A3B8' : NAVY, color: 'white', fontWeight: 700, fontSize: 13, border: 'none', borderRadius: 8, cursor: kaydediliyor ? 'not-allowed' : 'pointer' }}>
            {kaydediliyor ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </div>

      {BOLUMLER.map(({ baslik, sorular, renk }) => (
        <div key={baslik} style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '12px 20px', borderBottom: `1px solid ${BORDER}`, background: '#F8FAFC', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: renk, display: 'inline-block' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{baslik}</span>
            <span style={{ fontSize: 11, color: '#94A3B8' }}>· {sorular.length} soru</span>
          </div>
          {sorular.map(s => {
            const ay = ayarlar[s.kod]
            return (
              <div key={s.kod} style={{ padding: '12px 20px', borderBottom: `1px solid ${BORDER}`, display: 'grid', gridTemplateColumns: '60px 1fr 180px 80px', gap: 16, alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'white', background: renk, padding: '2px 8px', borderRadius: 4, textAlign: 'center' as const }}>{s.kod}</span>
                <span style={{ fontSize: 12, color: '#374151', lineHeight: 1.4 }}>{s.soru.slice(0, 120)}{s.soru.length > 120 ? '…' : ''}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 11, color: '#94A3B8', width: 40 }}>Ağırlık</span>
                  <input type="range" min={1} max={10} value={ay?.agirlik ?? s.agirlik}
                    onChange={e => setAgirlik(s.kod, Number(e.target.value))}
                    style={{ flex: 1, accentColor: TEAL }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: NAVY, width: 18, textAlign: 'center' as const }}>{ay?.agirlik ?? s.agirlik}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Toggle val={ay?.kritik ?? s.kritik} onChange={v => setKritik(s.kod, v)} />
                  <span style={{ fontSize: 11, color: '#64748B' }}>Kritik</span>
                </div>
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// ─── SEKME 3: k Katsayısı Editörü ────────────────────────────────────────────
const HAZARDS  = ['deprem', 'sel', 'natech', 'siber'] as const
const SECTORS  = ['HOSPITAL', 'INDUSTRIAL', 'BANK', 'MUNICIPALITY', 'EDUCATION', 'HOTEL'] as const
type HKey = typeof HAZARDS[number]
type SKey = typeof SECTORS[number]
type KMatrix = Record<SKey, Record<HKey, number>>

const SECTOR_TR: Record<SKey, string>  = { HOSPITAL: 'Hastane', INDUSTRIAL: 'Sanayi', BANK: 'Finans', MUNICIPALITY: 'Belediye', EDUCATION: 'Eğitim', HOTEL: 'Otelcilik' }
const HAZARD_TR: Record<HKey, string>  = { deprem: 'Deprem', sel: 'Sel', natech: 'NATECH', siber: 'Siber' }

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

function KMatrisSekme() {
  const [kMatrix, setKMatrix] = useState<KMatrix>(() => {
    try { const s = localStorage.getItem('omni_k_matrix'); return s ? JSON.parse(s) : DEFAULT_K }
    catch { return DEFAULT_K }
  })
  const [kaydedildi, setKaydedildi] = useState(false)

  const setK = (sector: SKey, hazard: HKey, val: number) => {
    setKMatrix(m => ({ ...m, [sector]: { ...m[sector], [hazard]: val } }))
    setKaydedildi(false)
  }
  const kaydet = () => {
    localStorage.setItem('omni_k_matrix', JSON.stringify(kMatrix))
    setKaydedildi(true)
    setTimeout(() => setKaydedildi(false), 2000)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <p style={{ fontSize: 13, color: '#64748B' }}>k(s,t) — Sektör × Tehlike tipi ağırlık matrisi (0.5 – 6.0 arası)</p>
        <button onClick={kaydet}
          style={{ padding: '9px 24px', background: kaydedildi ? '#10B981' : NAVY, color: 'white', fontWeight: 700, fontSize: 13, border: 'none', borderRadius: 8, cursor: 'pointer', transition: 'background .2s' }}>
          {kaydedildi ? '✓ Kaydedildi' : 'Kaydet (LocalStorage)'}
        </button>
      </div>

      <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' as const }}>
          <thead>
            <tr>
              <th style={{ padding: '12px 20px', textAlign: 'left' as const, fontSize: 12, color: '#64748B', fontWeight: 600, borderBottom: `1px solid ${BORDER}`, background: '#F8FAFC' }}>Sektör</th>
              {HAZARDS.map(h => (
                <th key={h} style={{ padding: '12px 20px', textAlign: 'center' as const, fontSize: 12, color: '#64748B', fontWeight: 600, borderBottom: `1px solid ${BORDER}`, background: '#F8FAFC' }}>{HAZARD_TR[h]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SECTORS.map((sector, si) => (
              <tr key={sector} style={{ background: si % 2 === 0 ? 'white' : '#FAFBFC' }}>
                <td style={{ padding: '12px 20px', fontSize: 13, fontWeight: 600, color: NAVY, borderBottom: `1px solid ${BORDER}` }}>{SECTOR_TR[sector]}</td>
                {HAZARDS.map(hazard => {
                  const val = kMatrix[sector][hazard]
                  const c = kRenk(val)
                  return (
                    <td key={hazard} style={{ padding: '8px 16px', borderBottom: `1px solid ${BORDER}`, textAlign: 'center' as const }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                        <input type="number" min={0.5} max={6} step={0.1} value={val}
                          onChange={e => setK(sector, hazard, parseFloat(e.target.value) || 0.5)}
                          style={{ width: 64, padding: '5px 8px', border: `1px solid ${c.border}`, borderRadius: 6, fontSize: 13, fontWeight: 700, color: c.text, background: c.bg, textAlign: 'center' as const, outline: 'none' }} />
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {[{ label: '< 1.5 — Düşük etki', bg: '#F0FDF4', border: '#BBF7D0', text: '#15803D' },
          { label: '1.5–3.0 — Orta', bg: '#FFFBEB', border: '#FDE68A', text: '#B45309' },
          { label: '3.0–4.5 — Yüksek', bg: '#FFF7ED', border: '#FED7AA', text: '#C2410C' },
          { label: '≥ 4.5 — Kritik', bg: '#FEF2F2', border: '#FECACA', text: '#B91C1C' }
        ].map(c => (
          <span key={c.label} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: c.bg, border: `1px solid ${c.border}`, color: c.text, fontWeight: 600 }}>{c.label}</span>
        ))}
      </div>
    </div>
  )
}

// ─── ANA SAYFA ────────────────────────────────────────────────────────────────
export default function IsoAdminPage() {
  const [sekme, setSekme] = useState<Sekme>('izleme')

  const sekmeler: { id: Sekme; label: string }[] = [
    { id: 'izleme',  label: '📋 Form İzleme' },
    { id: 'sorular', label: '⚙️ Soru Yönetimi' },
    { id: 'kmatris', label: '🔢 k Katsayısı Editörü' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ background: NAVY, padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ color: TEAL, fontWeight: 800, fontSize: 15 }}>İSO Admin</span>
        <span style={{ color: '#334155' }}>—</span>
        <span style={{ color: '#94A3B8', fontSize: 13 }}>Tesis Formu Yönetim Paneli</span>
      </div>

      {/* Sekme Bar */}
      <div style={{ background: 'white', borderBottom: `1px solid ${BORDER}`, padding: '0 32px' }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {sekmeler.map(s => (
            <button key={s.id} onClick={() => setSekme(s.id)}
              style={{ padding: '14px 24px', fontSize: 13, fontWeight: sekme === s.id ? 700 : 500, color: sekme === s.id ? TEAL : '#64748B', background: 'none', border: 'none', borderBottom: sekme === s.id ? `2px solid ${TEAL}` : '2px solid transparent', cursor: 'pointer' }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '32px auto', padding: '0 24px 60px' }}>
        {sekme === 'izleme'  && <FormIzlemeSekme />}
        {sekme === 'sorular' && <SoruYonetimiSekme />}
        {sekme === 'kmatris' && <KMatrisSekme />}
      </div>
    </div>
  )
}
