'use client'
import { useState } from 'react'

const NAVY = '#0A1628'
const TEAL = '#009B8D'
const BORDER = '#E5E7EB'

/* ── Tesis Kartı Alanları ──────────────────────────────────── */
type Alan = {
  ad: string; tip: string; zorunlu: boolean; gorulur: boolean; sira: number
}
const BASLANGIC_ALANLAR: Alan[] = [
  { ad: 'Tesis Adı',       tip: 'metin',   zorunlu: true,  gorulur: true,  sira: 1 },
  { ad: 'Birim Kodu',      tip: 'metin',   zorunlu: true,  gorulur: true,  sira: 2 },
  { ad: 'Sektör',          tip: 'seçim',   zorunlu: true,  gorulur: true,  sira: 3 },
  { ad: 'Alt Sektör',      tip: 'seçim',   zorunlu: false, gorulur: true,  sira: 4 },
  { ad: 'Yapım Yılı',      tip: 'sayı',    zorunlu: true,  gorulur: true,  sira: 5 },
  { ad: 'Kat Sayısı',      tip: 'sayı',    zorunlu: true,  gorulur: true,  sira: 6 },
  { ad: 'Brüt Alan (m²)',  tip: 'sayı',    zorunlu: false, gorulur: true,  sira: 7 },
  { ad: 'Zemin Sınıfı',    tip: 'seçim',   zorunlu: false, gorulur: true,  sira: 8 },
  { ad: 'Deprem Zonu',     tip: 'seçim',   zorunlu: false, gorulur: true,  sira: 9 },
  { ad: 'Çalışan Sayısı',  tip: 'sayı',    zorunlu: false, gorulur: true,  sira: 10 },
  { ad: 'Günlük Ziyaretçi',tip: 'sayı',    zorunlu: false, gorulur: false, sira: 11 },
  { ad: '7/24 Operasyon',  tip: 'onay',    zorunlu: false, gorulur: true,  sira: 12 },
  { ad: 'Jeneratör',       tip: 'onay',    zorunlu: false, gorulur: true,  sira: 13 },
  { ad: 'UPS',             tip: 'onay',    zorunlu: false, gorulur: true,  sira: 14 },
  { ad: 'Sprinkler',       tip: 'onay',    zorunlu: false, gorulur: false, sira: 15 },
]

/* ── Soru Ağırlıkları ─────────────────────────────────────── */
type Soru = {
  kod: string; metin: string; agirlik: number; boyut: 'H'|'F'|'E'|'C'; tersSkor: boolean
}
const BASLANGIC_SORULAR: Soru[] = [
  { kod: 'H1', metin: 'Deprem tehlike sıklığı',         agirlik: 5, boyut: 'H', tersSkor: false },
  { kod: 'H2', metin: 'Taşkın maruziyet düzeyi',        agirlik: 4, boyut: 'H', tersSkor: false },
  { kod: 'H3', metin: 'Sismik zemin sınıfı',            agirlik: 4, boyut: 'H', tersSkor: false },
  { kod: 'F1', metin: 'Yapı yaşı ve eskime durumu',     agirlik: 5, boyut: 'F', tersSkor: false },
  { kod: 'F2', metin: 'Kilit personel bağımlılığı',     agirlik: 3, boyut: 'F', tersSkor: false },
  { kod: 'F3', metin: 'Yapısal güçlendirme varlığı',    agirlik: 4, boyut: 'F', tersSkor: true  },
  { kod: 'E1', metin: 'Günlük ziyaretçi yoğunluğu',    agirlik: 3, boyut: 'E', tersSkor: false },
  { kod: 'E2', metin: 'Kritik hizmet kesintisi etkisi', agirlik: 5, boyut: 'E', tersSkor: false },
  { kod: 'C1', metin: 'BCP planı varlığı ve güncelliği',agirlik: 5, boyut: 'C', tersSkor: true  },
  { kod: 'C2', metin: 'Yedek güç sistemi kapasitesi',   agirlik: 4, boyut: 'C', tersSkor: true  },
]

const SEKTÖRLER = ['Bankacılık', 'Sağlık', 'Konaklama', 'Sanayi', 'Belediye', 'Eğitim', 'Hizmet', 'Odalar']
const SORU_SETLERI = ['HFE-360', 'SATAKOL', 'SRTF', 'ETAHF', 'Belediye']
const BOYUT_RENK: Record<string, string> = { H: '#EF4444', F: '#F97316', E: '#EAB308', C: '#22C55E' }

/* ── Toggle component ─────────────────────────────────────── */
function Toggle({ val, onChange }: { val: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!val)}
      style={{
        width: 36, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer',
        background: val ? TEAL : '#CBD5E1', position: 'relative', transition: 'background .2s',
        flexShrink: 0,
      }}>
      <span style={{
        position: 'absolute', top: 2, left: val ? 18 : 2,
        width: 16, height: 16, borderRadius: '50%', background: 'white',
        transition: 'left .2s', display: 'block',
      }}/>
    </button>
  )
}

export default function SettingsPage() {
  const [alanlar, setAlanlar] = useState<Alan[]>(BASLANGIC_ALANLAR)
  const [sorular, setSorular] = useState<Soru[]>(BASLANGIC_SORULAR)
  const [tumSorular, setTumSorular] = useState(false)
  const [sektorSetler, setSektorSetler] = useState<Record<string, string>>(
    Object.fromEntries(SEKTÖRLER.map(s => [s, 'HFE-360']))
  )
  const [kaydedildi, setKaydedildi] = useState(false)

  const alanGuncelle = (i: number, key: keyof Alan, val: any) => {
    setAlanlar(prev => prev.map((a, idx) => idx === i ? { ...a, [key]: val } : a))
  }
  const alanTasi = (i: number, yon: -1|1) => {
    setAlanlar(prev => {
      const copy = [...prev]
      const j = i + yon
      if (j < 0 || j >= copy.length) return prev
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
      return copy.map((a, idx) => ({ ...a, sira: idx + 1 }))
    })
  }
  const soruAgirlikGuncelle = (i: number, val: number) => {
    setSorular(prev => prev.map((s, idx) => idx === i ? { ...s, agirlik: val } : s))
  }
  const soruTersGuncelle = (i: number, val: boolean) => {
    setSorular(prev => prev.map((s, idx) => idx === i ? { ...s, tersSkor: val } : s))
  }
  const kaydet = () => {
    // Demo: gerçek uygulamada API çağrısı yapılır
    setKaydedildi(true)
    setTimeout(() => setKaydedildi(false), 3000)
  }

  const gosterilecekSorular = tumSorular ? sorular : sorular.slice(0, 10)

  return (
    <div style={{ minHeight: '100vh', background: '#F8F6F3', fontFamily: "'DM Sans',sans-serif", padding: 0 }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: `1px solid ${BORDER}`, padding: '20px 32px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    position: 'sticky', top: 0, zIndex: 10 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: NAVY, margin: 0 }}>Form Ayarları</h1>
          <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>
            Tesis kartı alanları, soru ağırlıkları ve sektör form yapılandırması
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="button" onClick={() => { setAlanlar(BASLANGIC_ALANLAR); setSorular(BASLANGIC_SORULAR) }}
            style={{ padding: '9px 20px', borderRadius: 8, border: `1.5px solid ${BORDER}`,
                     background: 'white', color: '#374151', fontSize: 13, fontWeight: 600,
                     cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
            İptal
          </button>
          <button type="button" onClick={kaydet}
            style={{ padding: '9px 20px', borderRadius: 8, border: 'none',
                     background: kaydedildi ? '#22C55E' : NAVY, color: 'white',
                     fontSize: 13, fontWeight: 700, cursor: 'pointer',
                     fontFamily: "'DM Sans',sans-serif", transition: 'background .3s' }}>
            {kaydedildi ? '✓ Kaydedildi' : 'Kaydet'}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '28px 24px 80px' }}>

        {/* ─── A) TESİS KARTI ALANLARI ─────────────────────────── */}
        <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${BORDER}`,
                      padding: '24px', marginBottom: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 800, color: NAVY, margin: '0 0 18px',
                       textTransform: 'uppercase', letterSpacing: '.08em' }}>
            A — Tesis Kartı Alanları
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${BORDER}` }}>
                  {['Sıra', 'Alan Adı', 'Tip', 'Zorunlu', 'Görünür', 'Taşı'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11,
                                         fontWeight: 700, color: '#6B7280', letterSpacing: '.05em',
                                         textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {alanlar.map((alan, i) => (
                  <tr key={alan.ad} style={{ borderBottom: `1px solid ${BORDER}`,
                                              background: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
                    <td style={{ padding: '10px 12px', color: '#9CA3AF', fontFamily: 'monospace', fontSize: 11 }}>
                      {String(alan.sira).padStart(2, '0')}
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: NAVY }}>{alan.ad}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontSize: 11, background: '#F3F4F6', borderRadius: 4,
                                      padding: '2px 8px', color: '#374151' }}>{alan.tip}</span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <Toggle val={alan.zorunlu} onChange={v => alanGuncelle(i, 'zorunlu', v)} />
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <Toggle val={alan.gorulur} onChange={v => alanGuncelle(i, 'gorulur', v)} />
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button type="button" onClick={() => alanTasi(i, -1)} disabled={i === 0}
                          style={{ width: 24, height: 24, borderRadius: 4, border: `1px solid ${BORDER}`,
                                   background: 'white', cursor: i === 0 ? 'not-allowed' : 'pointer',
                                   opacity: i === 0 ? 0.3 : 1, fontSize: 12, lineHeight: 1 }}>↑</button>
                        <button type="button" onClick={() => alanTasi(i, 1)} disabled={i === alanlar.length - 1}
                          style={{ width: 24, height: 24, borderRadius: 4, border: `1px solid ${BORDER}`,
                                   background: 'white', cursor: i === alanlar.length - 1 ? 'not-allowed' : 'pointer',
                                   opacity: i === alanlar.length - 1 ? 0.3 : 1, fontSize: 12, lineHeight: 1 }}>↓</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── B) SORU AĞIRLIKLARI ─────────────────────────────── */}
        <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${BORDER}`,
                      padding: '24px', marginBottom: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 800, color: NAVY, margin: '0 0 18px',
                       textTransform: 'uppercase', letterSpacing: '.08em' }}>
            B — Soru Ağırlıkları
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${BORDER}` }}>
                  {['Kod', 'Soru Metni', 'Ağırlık (1–5)', 'Boyut', 'Ters Skor'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 11,
                                         fontWeight: 700, color: '#6B7280', letterSpacing: '.05em',
                                         textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gosterilecekSorular.map((soru, i) => (
                  <tr key={soru.kod} style={{ borderBottom: `1px solid ${BORDER}`,
                                               background: i % 2 === 0 ? 'white' : '#FAFAFA' }}>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 12,
                                  fontWeight: 700, color: BOYUT_RENK[soru.boyut] }}>
                      {soru.kod}
                    </td>
                    <td style={{ padding: '10px 12px', color: NAVY, maxWidth: 280 }}>{soru.metin}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <input type="range" min={1} max={5} step={1} value={soru.agirlik}
                          onChange={e => soruAgirlikGuncelle(i, parseInt(e.target.value))}
                          style={{ width: 100, accentColor: TEAL }} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: NAVY,
                                        fontFamily: 'monospace', minWidth: 16, textAlign: 'center' }}>
                          {soru.agirlik}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px',
                                      borderRadius: 99, color: BOYUT_RENK[soru.boyut],
                                      background: BOYUT_RENK[soru.boyut] + '15',
                                      border: `1px solid ${BOYUT_RENK[soru.boyut]}30` }}>
                        {soru.boyut}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <Toggle val={soru.tersSkor} onChange={v => soruTersGuncelle(i, v)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!tumSorular && (
            <button type="button" onClick={() => setTumSorular(true)}
              style={{ marginTop: 12, padding: '8px 18px', borderRadius: 8,
                       border: `1.5px solid ${TEAL}`, background: `${TEAL}08`,
                       color: TEAL, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                       fontFamily: "'DM Sans',sans-serif" }}>
              Tümünü Görüntüle ({sorular.length} soru)
            </button>
          )}
        </div>

        {/* ─── C) SEKTÖR FORM AYARLARI ─────────────────────────── */}
        <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${BORDER}`,
                      padding: '24px', marginBottom: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 800, color: NAVY, margin: '0 0 18px',
                       textTransform: 'uppercase', letterSpacing: '.08em' }}>
            C — Sektör Form Ayarları
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {SEKTÖRLER.map(sektor => (
              <div key={sektor} style={{ display: 'flex', alignItems: 'center', gap: 12,
                                          padding: '12px 16px', background: '#F9FAFB',
                                          borderRadius: 10, border: `1px solid ${BORDER}` }}>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: NAVY }}>{sektor}</span>
                <select
                  value={sektorSetler[sektor]}
                  onChange={e => setSektorSetler(prev => ({ ...prev, [sektor]: e.target.value }))}
                  style={{ padding: '5px 10px', borderRadius: 6, border: `1px solid ${BORDER}`,
                            fontSize: 12, color: NAVY, background: 'white', fontFamily: "'DM Sans',sans-serif",
                            cursor: 'pointer' }}>
                  {SORU_SETLERI.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* ─── D) Butonlar ──────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button type="button"
            onClick={() => { setAlanlar(BASLANGIC_ALANLAR); setSorular(BASLANGIC_SORULAR) }}
            style={{ padding: '11px 28px', borderRadius: 10, border: `1.5px solid ${BORDER}`,
                     background: 'white', color: '#374151', fontSize: 14, fontWeight: 600,
                     cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}>
            İptal
          </button>
          <button type="button" onClick={kaydet}
            style={{ padding: '11px 28px', borderRadius: 10, border: 'none',
                     background: kaydedildi ? '#22C55E' : NAVY, color: 'white',
                     fontSize: 14, fontWeight: 700, cursor: 'pointer',
                     fontFamily: "'DM Sans',sans-serif", transition: 'background .3s' }}>
            {kaydedildi ? '✓ Kaydedildi' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  )
}
