'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
  TESIS_ENVANTER, DESTEK_KAPASITESI,
  SORULAR_SANAYI, type SoruSanayi,
  type TesisEnvanterAlani, type DestekKapasite,
} from '@/lib/sorular-sanayi'
import { mapFormToAssessment } from '@/lib/form-to-assessment'

const BACKEND_URL = 'https://omniversel-risk-engine-production.up.railway.app/api/v1'
const TENANT_ID   = '11111111-0000-0000-0000-000000000001'
const SUPA_URL    = 'https://gqguwgbopgnpwzjwcexl.supabase.co'
const SUPA_KEY    = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5OTgzMywiZXhwIjoyMDg4OTc1ODMzfQ.Ku-JRx8JFH5a3SIj7sGP_Dy_nM89NMMW34gPyxVO_qI'

const NAVY = '#0A1628'; const TEAL = '#009B8D'; const BORDER = '#E2E8F0'

const TEHLIKE  = SORULAR_SANAYI.filter(s => s.bolum === 'TEHLİKE')
const KIRILGAN = SORULAR_SANAYI.filter(s => s.bolum === 'KIRILGANLIK')
const KAPASITE = SORULAR_SANAYI.filter(s => s.bolum === 'KAPASİTE' && s.boyut !== 'HRO')
const HRO      = SORULAR_SANAYI.filter(s => s.boyut === 'HRO')

const ADIM_ETIKET = [
  'Tesis Kimlik & Konum',
  'Tehlike Analizi',
  'Kırılganlık',
  'Kapasite & Yönetim',
  'HRO Olgunluğu',
  'Destek Kapasitesi',
  'Sonuç & URI Skoru',
]

// ─── URI hesaplama ────────────────────────────────────────────────────────────
function hesaplaUri(puanlar: Record<string, number>): number {
  let H = 0, Hw = 0, F = 0, Fw = 0, C = 0, Cw = 0
  SORULAR_SANAYI.forEach(s => {
    const p = puanlar[s.kod] ?? 5
    if (s.boyut === 'H')                        { H += p * s.agirlik; Hw += s.agirlik }
    else if (s.boyut === 'F' || s.boyut === 'E') { F += p * s.agirlik; Fw += s.agirlik }
    else if (s.boyut === 'C')                   { C += p * s.agirlik; Cw += s.agirlik }
  })
  const hN = Hw ? H / Hw / 10 : 0.5
  const fN = Fw ? F / Fw / 10 : 0.5
  const cN = Cw ? C / Cw / 10 : 0.5
  return Math.round(Math.max(0, Math.min(100,
    (hN * 0.35 + fN * 0.35) * 100 * 0.7 + (1 - cN) * 100 * 0.3
  )))
}

function uriRenk(uri: number): string {
  return uri < 30 ? '#22C55E' : uri < 50 ? '#EAB308' : uri < 70 ? '#F97316' : '#EF4444'
}
function uriEtiket(uri: number): string {
  return uri < 30 ? 'Düşük Risk' : uri < 50 ? 'Orta Risk' : uri < 70 ? 'Yüksek Risk' : 'Kritik Risk'
}

// ─── Soru Kartı (ağırlık/kritik gösterilmez) ─────────────────────────────────
function SoruKarti({ soru, puan, onDegis }: { soru: SoruSanayi; puan: number; onDegis: (v: number) => void }) {
  const secenekler = soru.rehber
    ? soru.rehber.map((label, i) => ({ label, puan: [1, 3, 6, 10][i] ?? i * 3 + 1 }))
    : [1, 3, 6, 10].map((p, i) => ({ label: ['Çok Düşük', 'Düşük', 'Orta', 'Yüksek'][i], puan: p }))

  return (
    <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '16px 20px', marginBottom: 10 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'white', background: soru.boyut === 'H' ? '#EF4444' : soru.boyut === 'C' || soru.boyut === 'HRO' ? '#10B981' : '#F97316', padding: '2px 8px', borderRadius: 4, flexShrink: 0 }}>
          {soru.kod}
        </span>
        <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.55, margin: 0 }}>{soru.soru}</p>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {secenekler.map(s => (
          <button key={s.puan} onClick={() => onDegis(s.puan)}
            style={{ fontSize: 12, padding: '6px 14px', borderRadius: 6, border: `1px solid ${puan === s.puan ? TEAL : BORDER}`, background: puan === s.puan ? '#EBF8F7' : 'white', color: puan === s.puan ? TEAL : '#6B7280', fontWeight: puan === s.puan ? 700 : 400, cursor: 'pointer', maxWidth: 280, textAlign: 'left' as const }}>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Konum Bileşeni ───────────────────────────────────────────────────────────
function KonumAlani({ lat, lng, onDegis }: { lat: string; lng: string; onDegis: (lat: string, lng: string) => void }) {
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState('')

  const konumAl = () => {
    if (!navigator.geolocation) { setHata('Tarayıcı konum desteklemiyor.'); return }
    setYukleniyor(true); setHata('')
    navigator.geolocation.getCurrentPosition(
      pos => { onDegis(pos.coords.latitude.toFixed(6), pos.coords.longitude.toFixed(6)); setYukleniyor(false) },
      () => { setHata('Konum alınamadı. Manuel girin.'); setYukleniyor(false) }
    )
  }

  return (
    <div>
      <button type="button" onClick={konumAl} disabled={yukleniyor}
        style={{ padding: '8px 18px', background: yukleniyor ? '#94A3B8' : TEAL, color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: yukleniyor ? 'not-allowed' : 'pointer', marginBottom: 12 }}>
        {yukleniyor ? '⏳ Konum alınıyor...' : ' Konumumu Al'}
      </button>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <label style={lbl}>Enlem (Lat)</label>
          <input value={lat} onChange={e => onDegis(e.target.value, lng)} placeholder="örn. 41.015276"
            style={inp} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={lbl}>Boylam (Lng)</label>
          <input value={lng} onChange={e => onDegis(lat, e.target.value)} placeholder="örn. 28.979530"
            style={inp} />
        </div>
      </div>
      {lat && lng && (
        <a href={`https://www.google.com/maps?q=${lat},${lng}`} target="_blank" rel="noreferrer"
          style={{ display: 'inline-block', marginTop: 8, fontSize: 12, color: TEAL, textDecoration: 'underline' }}>
          🗺 Google Maps&apos;te doğrula
        </a>
      )}
      {hata && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 6 }}>{hata}</p>}
    </div>
  )
}

// ─── Envanter Alan Render ─────────────────────────────────────────────────────
function EnvanterAlan({ alan, deger, onDegis }: {
  alan: TesisEnvanterAlani
  deger: unknown
  onDegis: (v: unknown) => void
}) {
  if (alan.tip === 'koordinat') {
    const [lat, lng] = Array.isArray(deger) ? deger as string[] : ['', '']
    return <KonumAlani lat={lat || ''} lng={lng || ''} onDegis={(la, ln) => onDegis([la, ln])} />
  }
  if (alan.tip === 'checkbox') {
    return (
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
        <input type="checkbox" checked={!!deger} onChange={e => onDegis(e.target.checked)}
          style={{ width: 16, height: 16, accentColor: TEAL }} />
        <span style={{ fontSize: 13, color: '#374151' }}>Evet</span>
      </label>
    )
  }
  if (alan.tip === 'select' && alan.secenek) {
    return (
      <select value={(deger as string) || ''} onChange={e => onDegis(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
        <option value="">— Seçin —</option>
        {alan.secenek.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    )
  }
  if (alan.tip === 'multiselect' && alan.secenek) {
    const secili: string[] = Array.isArray(deger) ? deger as string[] : []
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {alan.secenek.map(s => {
          const aktif = secili.includes(s)
          return (
            <button key={s} type="button"
              onClick={() => onDegis(aktif ? secili.filter(x => x !== s) : [...secili, s])}
              style={{ padding: '6px 14px', borderRadius: 6, border: `1px solid ${aktif ? TEAL : BORDER}`, background: aktif ? '#EBF8F7' : 'white', color: aktif ? TEAL : '#6B7280', fontSize: 12, fontWeight: aktif ? 700 : 400, cursor: 'pointer' }}>
              {s}
            </button>
          )
        })}
      </div>
    )
  }
  if (alan.tip === 'belge') {
    const secim = (deger as string) || ''
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        {['Var', 'Yok', 'Tarih Yok'].map(s => (
          <button key={s} type="button" onClick={() => onDegis(s)}
            style={{ padding: '6px 16px', borderRadius: 6, border: `1px solid ${secim === s ? TEAL : BORDER}`, background: secim === s ? '#EBF8F7' : 'white', color: secim === s ? TEAL : '#6B7280', fontSize: 12, fontWeight: secim === s ? 700 : 400, cursor: 'pointer' }}>
            {s}
          </button>
        ))}
      </div>
    )
  }
  return (
    <input type={alan.tip === 'number' ? 'number' : 'text'}
      value={(deger as string | number) || ''}
      onChange={e => onDegis(alan.tip === 'number' ? Number(e.target.value) : e.target.value)}
      placeholder={alan.aciklama || ''}
      style={inp} />
  )
}

// ─── Destek Kapasitesi Render ─────────────────────────────────────────────────
function DestekAlan({ alan, deger, onDegis }: {
  alan: DestekKapasite
  deger: unknown
  onDegis: (v: unknown) => void
}) {
  if (alan.tip === 'checkbox') {
    return (
      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
        <input type="checkbox" checked={!!deger} onChange={e => onDegis(e.target.checked)}
          style={{ width: 16, height: 16, accentColor: TEAL }} />
        <span style={{ fontSize: 13, color: '#374151' }}>Evet</span>
      </label>
    )
  }
  if (alan.tip === 'select' && alan.secenek) {
    return (
      <select value={(deger as string) || ''} onChange={e => onDegis(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
        <option value="">— Seçin —</option>
        {alan.secenek.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    )
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <input type="number" value={(deger as number) || ''} onChange={e => onDegis(Number(e.target.value))}
        placeholder="0" style={{ ...inp, width: 100 }} />
      {alan.birim && <span style={{ fontSize: 12, color: '#94A3B8' }}>{alan.birim}</span>}
    </div>
  )
}

// ─── Stil sabitleri ───────────────────────────────────────────────────────────
const lbl: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }
const inp: React.CSSProperties = { width: '100%', padding: '10px 14px', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', background: 'white' }

// ─── ANA SAYFA ────────────────────────────────────────────────────────────────
export default function TesisFormuPage() {
  const params = useParams()
  const token = params?.token as string ?? ''

  const [adim, setAdim] = useState(0)
  const [envanter, setEnvanter] = useState<Record<string, unknown>>({})
  const [puanlar, setPuanlar] = useState<Record<string, number>>({})
  const [destek, setDestek] = useState<Record<string, unknown>>({})
  const [hata, setHata] = useState('')
  const [gonderiyor, setGonderiyor] = useState(false)
  const [gonderildi, setGonderildi] = useState(false)
  const [uri, setUri] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cozumler, setCozumler] = useState<any[]>([])
  const [tehlikeSinifi, setTehlikeSinifi] = useState<{ sinif: number; label: string; mevzuat: string[] } | null>(null)
  const [detayliMod, setDetayliMod] = useState(false)
  const [tesisYuklendi, setTesisYuklendi] = useState(false)
  const [facilityId, setFacilityId] = useState<string | null>(null)

  // Token ile tesis verisi önceden doldur
  useEffect(() => {
    if (!token) return
    fetch(`${SUPA_URL}/rest/v1/iso_tokenlar?token=eq.${token}&limit=1`, {
      headers: { 'apikey': SUPA_KEY, 'Authorization': `Bearer ${SUPA_KEY}` },
    })
      .then(r => r.json())
      .then((rows: Record<string, unknown>[]) => {
        const data = rows?.[0]
        if (data) {
          setEnvanter(prev => ({
            ...prev,
            E01: (data.tesis_adi as string) ?? '',
            E03: (data.nace_kodu as string) ?? '',
            E10: data.employee_count != null ? String(data.employee_count) : '',
            E13: (data.ilce as string) ?? '',
            E16: data.building_age != null ? String(data.building_age) : '',
          }))
          setTesisYuklendi(true)
          setFacilityId((data.facility_id as string) ?? null)
        }
      })
  }, [token])

  useEffect(() => { if (adim === 6) setUri(hesaplaUri(puanlar)) }, [adim, puanlar])

  const setEnv = (kod: string, val: unknown) => setEnvanter(e => ({ ...e, [kod]: val }))

  const naceChange = async (nace: string) => {
    setEnvanter(prev => ({ ...prev, E03: nace }))
    const temiz = nace.replace(/\s/g, '')
    if (temiz.length >= 4) {
      const r = await fetch(
        `${SUPA_URL}/rest/v1/nace_tehlike?nace_alti_kod=like.${encodeURIComponent(temiz)}*&select=tehlike_sinifi,tehlike_label,zorunlu_mevzuat,seveso_kapsam,natech_olasilik&order=nace_alti_kod.asc&limit=1`,
        { headers: { 'apikey': SUPA_KEY } }
      )
      if (r.ok) {
        const data = await r.json()
        if (data.length > 0) {
          const d = data[0]
          setTehlikeSinifi({ sinif: d.tehlike_sinifi, label: d.tehlike_label, mevzuat: d.zorunlu_mevzuat ?? [] })
          const isgLabel = d.tehlike_sinifi === 1 ? '1 — Çok Tehlikeli' : d.tehlike_sinifi === 2 ? '2 — Tehlikeli' : '3 — Az Tehlikeli'
          setEnvanter(prev => ({ ...prev, E04: isgLabel }))
        } else {
          setTehlikeSinifi(null)
        }
      }
    } else {
      setTehlikeSinifi(null)
    }
  }
  const setPuan = (kod: string, val: number) => setPuanlar(p => ({ ...p, [kod]: val }))
  const setDst = (kod: string, val: unknown) => setDestek(d => ({ ...d, [kod]: val }))

  // Koordinat kontrolü (E12)
  const koordinatOk = () => {
    const koord = envanter['E12'] as string[] | undefined
    return Array.isArray(koord) && koord[0] && koord[1]
  }

  const ileri = () => {
    setHata('')
    if (adim === 0) {
      if (!envanter['E01']) { setHata('Firma adı zorunludur (E01).'); return }
      if (!envanter['E03']) { setHata('NACE kodu zorunludur (E03).'); return }
      if (!koordinatOk()) { setHata('Konum (enlem/boylam) zorunludur (E12).'); return }
    }
    setAdim(a => Math.min(6, a + 1))
  }
  const geri = () => { setHata(''); setAdim(a => Math.max(0, a - 1)) }

  const gonder = async () => {
    setGonderiyor(true); setHata('')
    const koord = envanter['E12'] as string[]
    try {
      // Adım 1: Tesis yoksa backend'de oluştur
      let fId = facilityId
      if (!fId) {
        const lat = parseFloat(String(koord?.[0] ?? '')) || null
        const lng = parseFloat(String(koord?.[1] ?? '')) || null
        const facRes = await fetch(`${BACKEND_URL}/facilities/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenant_id: TENANT_ID,
            code: `ISO-${token.slice(0, 8).toUpperCase()}`,
            name: (envanter['E01'] as string) || 'İsimsiz Tesis',
            sector: 'industrial',
            ...(lat ? { latitude: lat } : {}),
            ...(lng ? { longitude: lng } : {}),
            ...(envanter['E16'] ? { building_age: parseInt(envanter['E16'] as string) } : {}),
            ...(envanter['E10'] ? { employee_count: parseInt(envanter['E10'] as string) } : {}),
            ...(envanter['E26'] && envanter['E26'] !== 'Bilinmiyor' ? { soil_class: envanter['E26'] as string } : {}),
          }),
        })
        if (facRes.ok) {
          const facData = await facRes.json()
          fId = facData.id ?? fId
          setFacilityId(fId ?? null)
        }
      }

      // Adım 2: Assessment çalıştır → gerçek URI skoru al
      let sonUri = hesaplaUri(puanlar)
      if (fId) {
        const payload = mapFormToAssessment(fId, puanlar, envanter)
        const assRes = await fetch(`${BACKEND_URL}/assessments/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (assRes.ok) {
          const assData = await assRes.json()
          if (typeof assData.uri_score === 'number') sonUri = assData.uri_score
          else if (typeof assData.overall_uri === 'number') sonUri = assData.overall_uri
        }
      }

      // Adım 3: Supabase REST upsert
      const uriSkoru = sonUri
      const lat = parseFloat(String(koord?.[0] ?? '')) || null
      const lng = parseFloat(String(koord?.[1] ?? '')) || null
      const destekCevaplari = destek

      const saveRes = await fetch(`${SUPA_URL}/rest/v1/iso_tesis_formlari?on_conflict=token`, {
        method: 'POST',
        headers: {
          'apikey': SUPA_KEY,
          'Authorization': `Bearer ${SUPA_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify({
          token,
          facility_id: fId ?? null,
          envanter,
          puanlar,
          destek: destekCevaplari,
          uri_skoru: uriSkoru,
          lat: lat ?? null,
          lng: lng ?? null,
          tesis_adi: envanter['E01'] ?? null,
          nace_kodu: envanter['E03'] ?? null,
          ilce: envanter['E13'] ?? null,
          gonderim_tarihi: new Date().toISOString(),
        }),
      })

      if (!saveRes.ok) {
        const errText = await saveRes.text()
        console.error('Supabase hata:', errText)
        throw new Error(`Supabase ${saveRes.status}: ${errText}`)
      }

      // Adım 4: Token kapat
      await fetch(`${SUPA_URL}/rest/v1/iso_tokenlar?token=eq.${token}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPA_KEY,
          'Authorization': `Bearer ${SUPA_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dolduruldu: true }),
      })

      // Düşük puanlı sorulara ait çözümleri çek
      const dusukPuanlar = Object.entries(puanlar)
        .filter(([, v]) => v <= 4)
        .map(([k]) => k)
        .slice(0, 8)
      if (dusukPuanlar.length > 0) {
        const sinifFilter = tehlikeSinifi ? `&tehlike_siniflar=cs.{${tehlikeSinifi.sinif}}` : ''
        const cozumRes = await fetch(
          `${SUPA_URL}/rest/v1/cozum_bankasi?soru_kod=in.(${dusukPuanlar.join(',')})&aktif=eq.true${sinifFilter}&order=oncelik.asc&limit=6`,
          { headers: { 'apikey': SUPA_KEY } }
        )
        const cozumData = cozumRes.ok ? await cozumRes.json() : []
        setCozumler(Array.isArray(cozumData) ? cozumData : [])
      }

      setUri(sonUri)
      setGonderildi(true)
    } catch {
      setHata('Kaydedilemedi, lütfen tekrar deneyin.')
    }
    setGonderiyor(false)
  }

  const uriR = uriRenk(uri)

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ background: NAVY, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: TEAL, fontWeight: 800, fontSize: 15, letterSpacing: '-0.3px' }}>İSO × Omniversel</span>
          <span style={{ color: '#334155', fontSize: 13 }}>—</span>
          <span style={{ color: '#94A3B8', fontSize: 13 }}>Tesis Dayanıklılık Formu</span>
        </div>
        <span style={{ fontSize: 11, color: '#475569', background: '#0D1F3C', padding: '3px 10px', borderRadius: 20 }}>
          Token: {token.slice(0, 8)}…
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{ background: 'white', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 16px', overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: 0, whiteSpace: 'nowrap' as const }}>
            {ADIM_ETIKET.map((et, i) => (
              <div key={i} style={{ padding: '12px 16px', fontSize: 11, fontWeight: i === adim ? 700 : 500, color: i === adim ? TEAL : i < adim ? '#64748B' : '#CBD5E1', borderBottom: i === adim ? `2px solid ${TEAL}` : '2px solid transparent', flexShrink: 0 }}>
                {i < adim ? '✓ ' : `${i}. `}{et}
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 3, background: '#F1F5F9' }}>
          <div style={{ height: '100%', background: TEAL, width: `${(adim / 6) * 100}%`, transition: 'width .3s' }} />
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '32px auto', padding: '0 16px 60px' }}>

        {/* ── ADIM 0 — Tesis Kimlik & Konum ── */}
        {adim === 0 && (
          <div style={{ background: 'white', borderRadius: 12, border: `1px solid ${BORDER}`, padding: 28 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Tesis Kimlik & Yapısal Envanter</h2>
            <p style={{ fontSize: 12, color: tesisYuklendi ? '#15803D' : '#94A3B8', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6 }}>
              {tesisYuklendi
                ? <><span style={{ fontSize: 14 }}>✓</span> Tesis bilgileriniz sisteme kayıtlı verilerden getirilmiştir. Lütfen kontrol edip eksik alanları tamamlayın.</>
                : 'Lütfen tesis bilgilerinizi eksiksiz doldurun.'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {TESIS_ENVANTER.map(alan => {
                const dolu = tesisYuklendi && !!envanter[alan.kod]
                return (
                  <div key={alan.kod} style={alan.tip === 'koordinat' ? { gridColumn: '1 / -1' } : {}}>
                    <label style={lbl}>
                      {alan.label}
                      {alan.zorunlu && <span style={{ color: '#EF4444', marginLeft: 2 }}>*</span>}
                      {dolu && <span style={{ color: '#22C55E', fontSize: 11, marginLeft: 6, fontWeight: 600 }}>✓ Doğrulandı</span>}
                    </label>
                    {alan.aciklama && alan.tip !== 'koordinat' && (
                      <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>{alan.aciklama}</p>
                    )}
                    <EnvanterAlan
                      alan={alan}
                      deger={envanter[alan.kod]}
                      onDegis={alan.kod === 'E03' ? (v) => naceChange(String(v)) : (v) => setEnv(alan.kod, v)}
                    />
                    {alan.kod === 'E03' && tehlikeSinifi && (
                      <div style={{
                        marginTop: 8, padding: '10px 14px', borderRadius: 8,
                        background: tehlikeSinifi.sinif === 1 ? '#FEF2F2' : tehlikeSinifi.sinif === 2 ? '#FFF7ED' : '#F0FDF4',
                        border: `1px solid ${tehlikeSinifi.sinif === 1 ? '#FECACA' : tehlikeSinifi.sinif === 2 ? '#FED7AA' : '#BBF7D0'}`,
                        display: 'flex', flexDirection: 'column', gap: 6,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{
                            fontSize: 11, fontWeight: 700, padding: '2px 10px', borderRadius: 20,
                            background: tehlikeSinifi.sinif === 1 ? '#EF4444' : tehlikeSinifi.sinif === 2 ? '#F97316' : '#22C55E',
                            color: 'white',
                          }}>
                            {tehlikeSinifi.label}
                          </span>
                          <span style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>
                            6331 sayılı Kanun EK-1 kapsamında sınıflandırılmıştır
                          </span>
                        </div>
                        <div style={{ fontSize: 11, color: '#64748B' }}>
                          Zorunlu mevzuat: {tehlikeSinifi.mevzuat.slice(0, 3).join(' · ')}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            {hata && <p style={{ color: '#EF4444', fontSize: 13, marginTop: 16 }}>{hata}</p>}
            <div style={{ marginTop: 28, display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={ileri} style={{ padding: '11px 32px', background: TEAL, color: 'white', fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                İleri →
              </button>
            </div>
          </div>
        )}

        {/* ── ADIM 1 — Tehlike ── */}
        {adim === 1 && (
          <BolumSoru
            baslik="Bölüm 1 — Tehlike Analizi"
            sorular={TEHLIKE}
            puanlar={puanlar}
            setPuan={setPuan}
            detayliMod={detayliMod}
            onDetayliMod={() => setDetayliMod(true)}
            onGeri={geri}
            onIleri={ileri}
          />
        )}

        {/* ── ADIM 2 — Kırılganlık ── */}
        {adim === 2 && (
          <BolumSoru
            baslik="Bölüm 2 — Kırılganlık & Maruziyet"
            sorular={KIRILGAN}
            puanlar={puanlar}
            setPuan={setPuan}
            detayliMod={detayliMod}
            onDetayliMod={() => setDetayliMod(true)}
            onGeri={geri}
            onIleri={ileri}
          />
        )}

        {/* ── ADIM 3 — Kapasite ── */}
        {adim === 3 && (
          <BolumSoru
            baslik="Bölüm 3 — Kapasite & Yönetim"
            sorular={KAPASITE}
            puanlar={puanlar}
            setPuan={setPuan}
            detayliMod={detayliMod}
            onDetayliMod={() => setDetayliMod(true)}
            onGeri={geri}
            onIleri={ileri}
          />
        )}

        {/* ── ADIM 4 — HRO ── */}
        {adim === 4 && (
          <BolumSoru
            baslik="Bölüm 4 — HRO Olgunluğu"
            sorular={HRO}
            puanlar={puanlar}
            setPuan={setPuan}
            detayliMod={detayliMod}
            onDetayliMod={() => setDetayliMod(true)}
            onGeri={geri}
            onIleri={ileri}
          />
        )}

        {/* ── ADIM 5 — Destek Kapasitesi ── */}
        {adim === 5 && (
          <div>
            <div style={{ background: 'white', borderRadius: 12, border: `1px solid ${BORDER}`, padding: 28 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Bölüm 5 — Destek Kapasitesi</h2>
              <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 24 }}>İSO Kaynak Havuzu & Afet Sonrası Müdahale Planlaması</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
                {DESTEK_KAPASITESI.map(alan => (
                  <div key={alan.kod}>
                    <label style={lbl}>{alan.label}</label>
                    {alan.aciklama && <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>{alan.aciklama}</p>}
                    <DestekAlan alan={alan} deger={destek[alan.kod]} onDegis={v => setDst(alan.kod, v)} />
                  </div>
                ))}
              </div>
            </div>
            <NavButtons onGeri={geri} onIleri={ileri} ileriLabel="Sonuca Git →" />
          </div>
        )}

        {/* ── ADIM 6 — Sonuç ── */}
        {adim === 6 && (
          <div>
            {!gonderildi ? (
              <div style={{ background: 'white', borderRadius: 12, border: `1px solid ${BORDER}`, padding: 32, textAlign: 'center' }}>
                <p style={{ fontSize: 14, color: '#374151', marginBottom: 20 }}>
                  Tüm bölümler tamamlandı. Formunuzu göndererek İSO Afet Yönetimi Şubesi&apos;ne iletebilirsiniz.
                </p>
                {hata && <p style={{ color: '#EF4444', fontSize: 13, marginBottom: 12 }}>{hata}</p>}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <button onClick={geri} style={{ padding: '11px 24px', border: `1px solid ${BORDER}`, borderRadius: 8, background: 'white', cursor: 'pointer', fontSize: 14, color: '#374151' }}>← Geri</button>
                  <button onClick={gonder} disabled={gonderiyor}
                    style={{ padding: '11px 40px', background: gonderiyor ? '#94A3B8' : NAVY, color: 'white', fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 8, cursor: gonderiyor ? 'not-allowed' : 'pointer' }}>
                    {gonderiyor ? 'Gönderiliyor...' : '✓ Formu Gönder'}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 16, padding: 48, textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#22C55E', color: 'white', fontSize: 32, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>✓</div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#15803D', marginBottom: 12 }}>Formunuz Başarıyla Alındı</h2>
                <p style={{ fontSize: 14, color: '#166534', maxWidth: 420, margin: '0 auto 20px', lineHeight: 1.6 }}>
                  Değerlendirmeniz İSO Afet Yönetimi Şubesi uzmanları tarafından incelenecek ve en kısa sürede sizinle iletişime geçilecektir.
                </p>
                <div style={{ background: 'white', borderRadius: 8, padding: '10px 20px', display: 'inline-block', border: '1px solid #BBF7D0' }}>
                  <span style={{ fontSize: 12, color: '#64748B' }}>Referans No: </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#15803D', fontFamily: 'DM Mono, monospace' }}>{token}</span>
                </div>
                <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 12 }}>
                  {new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </div>

                {cozumler.length > 0 && (
                  <div style={{ marginTop: 32 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1628', marginBottom: 16, textAlign: 'center' }}>
                      Tesisınız için Önerilen İlk Adımlar
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {cozumler.slice(0, 4).map((c) => (
                        <div key={c.id} style={{
                          background: 'white',
                          border: '1px solid #E2E8F0',
                          borderLeft: `4px solid ${
                            c.maliyet_seviyesi === 'ucretsiz' ? '#22C55E' :
                            c.maliyet_seviyesi === 'dusuk' ? '#009B8D' : '#F97316'
                          }`,
                          borderRadius: 10,
                          padding: '14px 16px',
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: '#0A1628', margin: 0, flex: 1 }}>{c.baslik}</p>
                            <span style={{
                              fontSize: 10, padding: '2px 8px', borderRadius: 10, marginLeft: 8, flexShrink: 0,
                              background: c.maliyet_seviyesi === 'ucretsiz' ? '#F0FDF4' : c.maliyet_seviyesi === 'dusuk' ? '#EBF8F7' : '#FFF7ED',
                              color: c.maliyet_seviyesi === 'ucretsiz' ? '#16A34A' : c.maliyet_seviyesi === 'dusuk' ? '#009B8D' : '#EA580C',
                              fontWeight: 700,
                            }}>
                              {c.maliyet_seviyesi === 'ucretsiz' ? 'Ücretsiz' : c.maliyet_seviyesi === 'dusuk' ? 'Düşük Maliyet' : 'Orta Maliyet'}
                            </span>
                          </div>
                          <p style={{ fontSize: 12, color: '#64748B', margin: '0 0 8px', lineHeight: 1.5 }}>{c.aciklama}</p>
                          {c.adimlar && c.adimlar.slice(0, 2).map((adim: string, i: number) => (
                            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                              <span style={{ fontSize: 11, color: '#009B8D', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                              <span style={{ fontSize: 11, color: '#374151' }}>{adim}</span>
                            </div>
                          ))}
                          <div style={{ marginTop: 8, display: 'flex', gap: 12 }}>
                            <span style={{ fontSize: 10, color: '#94A3B8' }}>Süre: {c.tahmini_sure}</span>
                            <span style={{ fontSize: 10, color: '#22C55E', fontWeight: 600 }}>URI iyileşmesi: -{c.uri_iyilesmesi} puan</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontSize: 11, color: '#94A3B8', textAlign: 'center', marginTop: 12 }}>
                      Detaylı aksiyon planı için İSO Afet Yönetimi Şubesi uzmanlarımız sizinle iletişime geçecektir.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${BORDER}`, padding: '16px 24px', textAlign: 'center', fontSize: 11, color: '#94A3B8', background: 'white' }}>
        Bu form İstanbul Sanayi Odası Afet Yönetimi Şubesi adına Omniversel tarafından işlenmektedir.
      </div>
    </div>
  )
}

// ─── Adaptif Bölüm Soru Bileşeni ─────────────────────────────────────────────
function BolumSoru({
  baslik, sorular, puanlar, setPuan, detayliMod, onDetayliMod, onGeri, onIleri,
}: {
  baslik: string
  sorular: SoruSanayi[]
  puanlar: Record<string, number>
  setPuan: (kod: string, val: number) => void
  detayliMod: boolean
  onDetayliMod: () => void
  onGeri: () => void
  onIleri: () => void
}) {
  const kritikler = sorular.filter(s => s.kritik)
  const ekler     = sorular.filter(s => !s.kritik)
  const gosterilenler = detayliMod ? sorular : kritikler
  const yanitlanan = gosterilenler.filter(s => puanlar[s.kod] !== undefined).length
  const toplamGos  = gosterilenler.length
  const tahminiDak = Math.ceil(toplamGos * 0.75)

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{baslik}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' as const }}>
          <span style={{ fontSize: 12, color: '#94A3B8' }}>
            {detayliMod ? `${toplamGos} soru` : `${kritikler.length} kritik soru`} · ~{tahminiDak} dakika
          </span>
          {/* Doluluk progress bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 120 }}>
            <div style={{ flex: 1, height: 4, background: '#E2E8F0', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: TEAL, width: toplamGos ? `${(yanitlanan / toplamGos) * 100}%` : '0%', transition: 'width .2s' }} />
            </div>
            <span style={{ fontSize: 11, color: '#94A3B8', whiteSpace: 'nowrap' as const }}>{yanitlanan}/{toplamGos}</span>
          </div>
        </div>
      </div>

      {gosterilenler.map(s => (
        <SoruKarti key={s.kod} soru={s} puan={puanlar[s.kod] ?? 0} onDegis={v => setPuan(s.kod, v)} />
      ))}

      {!detayliMod && ekler.length > 0 && (
        <div style={{ margin: '16px 0', padding: '14px 20px', border: `1px dashed ${TEAL}`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: '#F0FDFA' }}>
          <span style={{ fontSize: 13, color: '#0F766E' }}>
            Bu bölümde <b>{ekler.length}</b> ek soru daha var
          </span>
          <button onClick={onDetayliMod}
            style={{ padding: '7px 18px', border: `1.5px solid ${TEAL}`, borderRadius: 8, background: 'white', color: TEAL, fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
            Detaylı Değerlendirme Ekle
          </button>
        </div>
      )}

      <NavButtons onGeri={onGeri} onIleri={onIleri} />
    </div>
  )
}

function NavButtons({ onGeri, onIleri, ileriLabel = 'İleri →' }: { onGeri: () => void; onIleri: () => void; ileriLabel?: string }) {
  return (
    <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
      <button onClick={onGeri} style={{ padding: '11px 24px', border: `1px solid ${BORDER}`, borderRadius: 8, background: 'white', cursor: 'pointer', fontSize: 14, color: '#374151' }}>← Geri</button>
      <button onClick={onIleri} style={{ padding: '11px 32px', background: TEAL, color: 'white', fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 8, cursor: 'pointer' }}>{ileriLabel}</button>
    </div>
  )
}
