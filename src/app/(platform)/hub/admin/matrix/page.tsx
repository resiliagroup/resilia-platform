'use client'
import { useState, useEffect, useRef } from 'react'

const NAVY = '#0A1628'; const TEAL = '#009B8D'; const BORDER = '#E2E8F0'

// Sektörler ve zaman dilimleri
const SEKTORLER = ['Bankacılık', 'Sanayi', 'Sağlık', 'Belediye', 'Konaklama', 'Eğitim']
const ZAMANLAR  = ['T+0', 'T+6ay', 'T+1yıl', 'T+2yıl', 'T+5yıl']

type Matris = Record<string, Record<string, number>>

const VARSAYILAN_MATRIS: Matris = {
  'Bankacılık': { 'T+0': 1.00, 'T+6ay': 0.95, 'T+1yıl': 0.88, 'T+2yıl': 0.82, 'T+5yıl': 0.75 },
  'Sanayi':     { 'T+0': 1.00, 'T+6ay': 0.92, 'T+1yıl': 0.85, 'T+2yıl': 0.78, 'T+5yıl': 0.70 },
  'Sağlık':     { 'T+0': 1.00, 'T+6ay': 0.97, 'T+1yıl': 0.93, 'T+2yıl': 0.88, 'T+5yıl': 0.82 },
  'Belediye':   { 'T+0': 1.00, 'T+6ay': 0.90, 'T+1yıl': 0.82, 'T+2yıl': 0.75, 'T+5yıl': 0.68 },
  'Konaklama':  { 'T+0': 1.00, 'T+6ay': 0.88, 'T+1yıl': 0.80, 'T+2yıl': 0.72, 'T+5yıl': 0.65 },
  'Eğitim':     { 'T+0': 1.00, 'T+6ay': 0.93, 'T+1yıl': 0.87, 'T+2yıl': 0.81, 'T+5yıl': 0.74 },
}

// Örnek URI hesaplama — k(s,t) uygular
function uriHesapla(baseUri: number, sektorAdi: string, zamanDilimi: string, matris: Matris): number {
  const k = matris[sektorAdi]?.[zamanDilimi] ?? 1.0
  return Math.round(Math.max(0, Math.min(100, baseUri * k)))
}

// Renk skalası — k değerine göre
function kRenk(k: number): string {
  if (k >= 0.95) return '#DCFCE7'
  if (k >= 0.85) return '#FEF9C3'
  if (k >= 0.75) return '#FEF3C7'
  return '#FEE2E2'
}

export default function MatrisEditorPage() {
  const [matris, setMatris] = useState<Matris>(
    JSON.parse(JSON.stringify(VARSAYILAN_MATRIS))
  )
  const [seciliSektor, setSeciliSektor] = useState('Bankacılık')
  const [ornekUri, setOrnekUri] = useState(75)
  const [onizleme, setOnizleme] = useState<Record<string, number>>({})
  const [kaydedildi, setKaydedildi] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Canlı önizleme — debounce 500ms
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const yeniOnizleme: Record<string, number> = {}
      ZAMANLAR.forEach(z => {
        yeniOnizleme[z] = uriHesapla(ornekUri, seciliSektor, z, matris)
      })
      setOnizleme(yeniOnizleme)
    }, 500)
  }, [matris, seciliSektor, ornekUri])

  const degerGuncelle = (sektor: string, zaman: string, deger: string) => {
    const sayi = parseFloat(deger)
    if (isNaN(sayi) || sayi < 0 || sayi > 2) return
    setMatris(m => ({
      ...m,
      [sektor]: { ...m[sektor], [zaman]: sayi }
    }))
    setKaydedildi(false)
  }

  const kaydet = () => {
    // Gerçek uygulamada Supabase'e kaydedilir
    localStorage.setItem('omni_kst_matris', JSON.stringify(matris))
    setKaydedildi(true)
    setTimeout(() => setKaydedildi(false), 3000)
  }

  const sifirla = () => {
    setMatris(JSON.parse(JSON.stringify(VARSAYILAN_MATRIS)))
    setKaydedildi(false)
  }

  const uriRenk = (uri: number) =>
    uri < 40 ? '#EF4444' : uri < 60 ? '#F97316' : uri < 75 ? '#F59E0B' : '#22C55E'

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', fontFamily: "'DM Sans',sans-serif" }}>
      {/* Üst Bar */}
      <div style={{ background: NAVY, padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ color: 'white', fontWeight: 800, fontSize: 16 }}>k(s,t) Sektör-Zaman Matris Editörü</div>
          <div style={{ color: '#94A3B8', fontSize: 12, marginTop: 2 }}>Yalnızca Admin · URI kalibrasyon katsayıları</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={sifirla} style={{ padding: '8px 18px', border: `1px solid #1E3A5F`, borderRadius: 8, background: 'transparent', color: '#94A3B8', cursor: 'pointer', fontSize: 13 }}>
            Sıfırla
          </button>
          <button onClick={kaydet} style={{ padding: '8px 20px', background: kaydedildi ? '#22C55E' : TEAL, color: 'white', fontWeight: 700, fontSize: 13, border: 'none', borderRadius: 8, cursor: 'pointer', transition: 'background .3s' }}>
            {kaydedildi ? '✓ Kaydedildi' : 'Kaydet'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '32px auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>

        {/* Sol: Matris Tablosu */}
        <div>
          <div style={{ background: 'white', borderRadius: 12, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${BORDER}` }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>Kalibrasyon Matrisi</h2>
              <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>
                Her hücre: k(sektör, zaman) — Base URI × k = Kalibrasyon sonrası URI. Aralık: 0.0 – 2.0
              </p>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: 12, fontWeight: 700, color: '#94A3B8', background: '#F8F9FA', borderBottom: `1px solid ${BORDER}` }}>
                      Sektör
                    </th>
                    {ZAMANLAR.map(z => (
                      <th key={z} style={{ textAlign: 'center', padding: '10px 12px', fontSize: 12, fontWeight: 700, color: '#94A3B8', background: '#F8F9FA', borderBottom: `1px solid ${BORDER}` }}>
                        {z}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SEKTORLER.map((s, si) => (
                    <tr key={s} style={{ borderBottom: `1px solid ${BORDER}`, background: s === seciliSektor ? '#F0FDF9' : 'white' }}>
                      <td style={{ padding: '8px 16px' }}>
                        <button onClick={() => setSeciliSektor(s)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: s === seciliSektor ? 700 : 500, color: s === seciliSektor ? TEAL : '#374151' }}>
                          {s}
                        </button>
                      </td>
                      {ZAMANLAR.map(z => {
                        const val = matris[s]?.[z] ?? 1.0
                        return (
                          <td key={z} style={{ padding: '6px 8px', textAlign: 'center' }}>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max="2"
                              value={val}
                              onChange={e => degerGuncelle(s, z, e.target.value)}
                              style={{
                                width: 72, textAlign: 'center', padding: '6px 4px',
                                border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 13,
                                background: kRenk(val), fontFamily: 'DM Mono,monospace',
                                fontWeight: s === seciliSektor ? 700 : 400, outline: 'none',
                              }}
                            />
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Renk Açıklaması */}
            <div style={{ padding: '12px 16px', borderTop: `1px solid ${BORDER}`, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[
                { bg: '#DCFCE7', label: 'k ≥ 0.95 — Yüksek dayanıklılık' },
                { bg: '#FEF9C3', label: 'k 0.85–0.95' },
                { bg: '#FEF3C7', label: 'k 0.75–0.85' },
                { bg: '#FEE2E2', label: 'k < 0.75 — Düşük dayanıklılık' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 12, height: 12, background: item.bg, border: `1px solid ${BORDER}`, borderRadius: 2 }} />
                  <span style={{ fontSize: 11, color: '#64748B' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sağ: Canlı Önizleme */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Kontrol */}
          <div style={{ background: 'white', borderRadius: 12, border: `1px solid ${BORDER}`, padding: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 16 }}>Canlı URI Önizleme</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 6 }}>Sektör</label>
              <select value={seciliSektor} onChange={e => setSeciliSektor(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, background: 'white', outline: 'none' }}>
                {SEKTORLER.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#94A3B8', display: 'block', marginBottom: 6 }}>
                Baz URI Skoru: <span style={{ fontWeight: 700, color: NAVY }}>{ornekUri}</span>
              </label>
              <input type="range" min={0} max={100} value={ornekUri} onChange={e => setOrnekUri(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', accentColor: TEAL }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#CBD5E1', marginTop: 4 }}>
                <span>0 (Kritik)</span><span>50</span><span>100 (Örnek)</span>
              </div>
            </div>
          </div>

          {/* Sonuçlar */}
          <div style={{ background: 'white', borderRadius: 12, border: `1px solid ${BORDER}`, padding: 20 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 12 }}>
              {seciliSektor} · Baz URI: {ornekUri}
            </h3>
            <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 12 }}>500ms debounce ile güncellenir</div>
            {ZAMANLAR.map(z => {
              const uri = onizleme[z] ?? uriHesapla(ornekUri, seciliSektor, z, matris)
              const k = matris[seciliSektor]?.[z] ?? 1.0
              return (
                <div key={z} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${BORDER}` }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{z}</span>
                    <span style={{ fontSize: 11, color: '#94A3B8', marginLeft: 8 }}>k = {k.toFixed(2)}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 22, fontWeight: 800, color: uriRenk(uri), fontFamily: 'DM Mono,monospace' }}>{uri}</span>
                    <span style={{ fontSize: 11, color: '#94A3B8', marginLeft: 6 }}>
                      {uri < ornekUri ? `▼ ${ornekUri - uri}` : uri > ornekUri ? `▲ ${uri - ornekUri}` : '—'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bilgi */}
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 10, padding: 16 }}>
            <p style={{ fontSize: 12, color: '#1D4ED8', lineHeight: 1.6 }}>
              <strong>k(s,t) nedir?</strong> Sektör (s) ve zaman dilimi (t) parametrelerine göre URI skoru kalibrasyonu. k=1.0 değişim yok, k&lt;1 zaman içinde bozulma, k&gt;1 iyileşme anlamına gelir.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
