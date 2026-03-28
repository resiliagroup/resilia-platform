'use client'
import { useState, useEffect, useCallback } from 'react'

const NAVY = '#0A1628'
const TEAL = '#009B8D'
const RED = '#EF4444'
const AMBER = '#F59E0B'
const GREEN = '#22C55E'
const BORDER = '#E2E8F0'

// ─── Tipler ────────────────────────────────────────────────────────────────

interface MonteCarloSonuc {
  iterasyon: number
  var_95: number    // Value at Risk %95 — ₺M
  var_99: number    // Value at Risk %99 — ₺M
  es_95: number     // Expected Shortfall %95 — ₺M
  es_99: number     // Expected Shortfall %99 — ₺M
  ortalama_kayip: number
  max_kayip: number
  histogram: { aralik: string; adet: number; var_95_cizgisi: boolean }[]
}

interface SenarYoOlasilik {
  id: string
  ad: string
  tur: string
  olasilik_1yil: number   // %
  beklenen_kayip: number  // ₺M
  stres_kayip: number     // ₺M (1-yıllık %99.9)
  korelasyon: number      // diğer senaryolarla
}

// ─── Monte Carlo Simülasyonu ──────────────────────────────────────────────

function monteCarloSimule(
  baz_kayip: number,   // ₺M
  volatilite: number,  // %
  n: number = 10000
): MonteCarloSonuc {
  const kayiplar: number[] = []

  for (let i = 0; i < n; i++) {
    // Box-Muller dönüşümü ile normal dağılım
    const u1 = Math.random()
    const u2 = Math.random()
    const z = Math.sqrt(-2 * Math.log(Math.max(u1, 1e-10))) * Math.cos(2 * Math.PI * u2)
    // Log-normal kayıp dağılımı
    const kayip = baz_kayip * Math.exp(volatilite * z - 0.5 * volatilite * volatilite)
    kayiplar.push(Math.max(0, kayip))
  }

  kayiplar.sort((a, b) => a - b)

  const var95Indeks = Math.floor(0.95 * n)
  const var99Indeks = Math.floor(0.99 * n)
  const var95 = kayiplar[var95Indeks]
  const var99 = kayiplar[var99Indeks]

  // Expected Shortfall = kayıpların VaR'ın üzerindeki ortalaması
  const es95 = kayiplar.slice(var95Indeks).reduce((a, b) => a + b, 0) / (n - var95Indeks)
  const es99 = kayiplar.slice(var99Indeks).reduce((a, b) => a + b, 0) / (n - var99Indeks)

  const ortalama = kayiplar.reduce((a, b) => a + b, 0) / n
  const max = kayiplar[n - 1]

  // Histogram (20 aralık)
  const minK = kayiplar[0]
  const maxK = max
  const aralikBoyutu = (maxK - minK) / 20
  const histogram = Array.from({ length: 20 }, (_, i) => {
    const alt = minK + i * aralikBoyutu
    const ust = alt + aralikBoyutu
    const adet = kayiplar.filter(k => k >= alt && k < ust).length
    return {
      aralik: `${alt.toFixed(1)}`,
      adet,
      var_95_cizgisi: alt <= var95 && ust > var95,
    }
  })

  return {
    iterasyon: n, var_95: var95, var_99: var99,
    es_95: es95, es_99: es99,
    ortalama_kayip: ortalama, max_kayip: max,
    histogram,
  }
}

// ─── Senaryolar ──────────────────────────────────────────────────────────────

const SENARYOLAR: SenarYoOlasilik[] = [
  { id: 's1', ad: 'Fidye Yazılımı Saldırısı', tur: 'Siber', olasilik_1yil: 12, beklenen_kayip: 45, stres_kayip: 180, korelasyon: 0.3 },
  { id: 's2', ad: 'Deprem (İstanbul M7+)', tur: 'Fiziksel', olasilik_1yil: 2, beklenen_kayip: 250, stres_kayip: 900, korelasyon: 0.8 },
  { id: 's3', ad: 'Tedarikçi İflası (Kritik IT)', tur: 'Tedarik', olasilik_1yil: 5, beklenen_kayip: 30, stres_kayip: 90, korelasyon: 0.1 },
  { id: 's4', ad: 'Piyasa Çöküşü (%30 Düşüş)', tur: 'Piyasa', olasilik_1yil: 8, beklenen_kayip: 120, stres_kayip: 350, korelasyon: 0.6 },
  { id: 's5', ad: 'İklim Felaketi — Sel', tur: 'İklim', olasilik_1yil: 15, beklenen_kayip: 20, stres_kayip: 75, korelasyon: 0.5 },
  { id: 's6', ad: 'Operasyonel Hata (İnsan)', tur: 'Operasyonel', olasilik_1yil: 35, beklenen_kayip: 8, stres_kayip: 40, korelasyon: 0.05 },
]

// ─── Yardımcı ────────────────────────────────────────────────────────────────

function riskSinif(var99: number): { etiket: string; renk: string } {
  if (var99 > 200) return { etiket: 'Kritik', renk: RED }
  if (var99 > 100) return { etiket: 'Yüksek', renk: AMBER }
  if (var99 > 50) return { etiket: 'Orta', renk: TEAL }
  return { etiket: 'Düşük', renk: GREEN }
}

// ─── Ana Bileşen ─────────────────────────────────────────────────────────────

export default function OmniQraPage() {
  const [aktifSekme, setAktifSekme] = useState<'mc' | 'senaryolar' | 'stres' | 'metodoloji'>('mc')

  // Monte Carlo parametreleri
  const [bazKayip, setBazKayip] = useState(50)        // ₺M
  const [volatilite, setVolatilite] = useState(0.6)   // %
  const [iterasyon, setIterasyon] = useState(10000)
  const [mcSonuc, setMcSonuc] = useState<MonteCarloSonuc | null>(null)
  const [hesaplaniyor, setHesaplaniyor] = useState(false)

  // Senaryo ağırlıkları
  const [senaryoAgirliklar, setSenaryoAgirliklar] = useState<Record<string, number>>(
    Object.fromEntries(SENARYOLAR.map(s => [s.id, s.olasilik_1yil]))
  )

  const mcHesapla = useCallback(() => {
    setHesaplaniyor(true)
    // Async benzeri: kısa timeout ile UI'nin güncel kalmasını sağla
    setTimeout(() => {
      const sonuc = monteCarloSimule(bazKayip, volatilite, iterasyon)
      setMcSonuc(sonuc)
      setHesaplaniyor(false)
    }, 50)
  }, [bazKayip, volatilite, iterasyon])

  // İlk yüklemede hesapla
  useEffect(() => { mcHesapla() }, [mcHesapla])

  // Agregat beklenen kayıp (tüm senaryolar)
  const agregatBeklenenKayip = SENARYOLAR.reduce((acc, s) => {
    const agirlik = (senaryoAgirliklar[s.id] ?? s.olasilik_1yil) / 100
    return acc + agirlik * s.beklenen_kayip
  }, 0)

  const agregatStresKayip = SENARYOLAR.reduce((acc, s) => {
    const agirlik = (senaryoAgirliklar[s.id] ?? s.olasilik_1yil) / 100
    return acc + agirlik * s.stres_kayip
  }, 0)

  // ─── Render ──────────────────────────────────────────────────────────────

  const sekmeStyle = (aktif: boolean) => ({
    padding: '10px 20px', background: aktif ? NAVY : 'transparent',
    color: aktif ? 'white' : '#64748B', border: 'none', borderRadius: 8,
    fontSize: 13, fontWeight: aktif ? 700 : 500, cursor: 'pointer',
  })

  const sliderLabel = (label: string, val: string | number) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
      <span style={{ fontSize: 12, color: '#94A3B8' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: NAVY, fontFamily: 'DM Mono,monospace' }}>{val}</span>
    </div>
  )

  const histMax = mcSonuc ? Math.max(...mcSonuc.histogram.map(h => h.adet)) : 1

  const sinif = mcSonuc ? riskSinif(mcSonuc.var_99) : null

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', fontFamily: "'DM Sans',sans-serif" }}>

      {/* Üst Bar */}
      <div style={{ background: NAVY, padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ color: 'white', fontWeight: 800, fontSize: 18 }}>
            omniQRA
            <span style={{ fontSize: 11, background: '#7C3AED', color: 'white', padding: '2px 8px', borderRadius: 20, fontWeight: 600, marginLeft: 8 }}>ARAŞTIRMA</span>
          </div>
          <div style={{ color: '#94A3B8', fontSize: 12, marginTop: 2 }}>Kantitatif Risk Analizi · Monte Carlo · VaR · Stres Testi · ICAAP Araştırma Modülü</div>
        </div>
        <div style={{ background: '#1E293B', borderRadius: 10, padding: '8px 16px', textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: '#64748B', marginBottom: 2 }}>ARAŞTIRMA MODELİ</div>
          <div style={{ fontSize: 12, color: '#94A3B8', fontFamily: 'DM Mono,monospace' }}>Log-Normal · Basel II Standardı</div>
        </div>
      </div>

      {/* Sekmeler */}
      <div style={{ background: 'white', borderBottom: `1px solid ${BORDER}`, padding: '8px 32px', display: 'flex', gap: 4 }}>
        {([
          ['mc', 'Monte Carlo Simülasyonu'],
          ['senaryolar', 'Senaryo Olasılık Analizi'],
          ['stres', 'Stres Testi Sonuçları'],
          ['metodoloji', 'Metodoloji'],
        ] as const).map(([key, label]) => (
          <button key={key} onClick={() => setAktifSekme(key)} style={sekmeStyle(aktifSekme === key)}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: '28px auto', padding: '0 24px' }}>

        {/* ── MONTE CARLO ─────────────────────────────────────────────── */}
        {aktifSekme === 'mc' && (
          <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>

            {/* Parametre paneli */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 16 }}>Simülasyon Parametreleri</h3>

                <div style={{ marginBottom: 16 }}>
                  {sliderLabel('Baz Kayıp (₺M)', bazKayip)}
                  <input type="range" min={5} max={500} value={bazKayip} onChange={e => setBazKayip(Number(e.target.value))}
                    style={{ width: '100%', accentColor: TEAL, cursor: 'pointer' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#CBD5E1' }}>
                    <span>₺5M</span><span>₺500M</span>
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  {sliderLabel('Volatilite (σ)', volatilite.toFixed(2))}
                  <input type="range" min={0.1} max={2.0} step={0.05} value={volatilite} onChange={e => setVolatilite(Number(e.target.value))}
                    style={{ width: '100%', accentColor: TEAL, cursor: 'pointer' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#CBD5E1' }}>
                    <span>0.10 (Düşük)</span><span>2.00 (Yüksek)</span>
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  {sliderLabel('İterasyon Sayısı', iterasyon.toLocaleString('tr-TR'))}
                  <input type="range" min={1000} max={100000} step={1000} value={iterasyon} onChange={e => setIterasyon(Number(e.target.value))}
                    style={{ width: '100%', accentColor: TEAL, cursor: 'pointer' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#CBD5E1' }}>
                    <span>1,000</span><span>100,000</span>
                  </div>
                </div>

                <button onClick={mcHesapla} disabled={hesaplaniyor}
                  style={{ width: '100%', padding: '10px', background: hesaplaniyor ? '#94A3B8' : NAVY, color: 'white', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: hesaplaniyor ? 'wait' : 'pointer', transition: 'background .2s' }}>
                  {hesaplaniyor ? '⏳ Hesaplanıyor…' : '▶ Simüle Et'}
                </button>
              </div>

              {/* Sonuç kartı */}
              {mcSonuc && sinif && (
                <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>Risk Sınıfı</h3>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'white', background: sinif.renk, padding: '3px 12px', borderRadius: 20 }}>{sinif.etiket}</span>
                  </div>
                  {[
                    ['VaR %95', `₺${mcSonuc.var_95.toFixed(1)}M`, RED],
                    ['VaR %99', `₺${mcSonuc.var_99.toFixed(1)}M`, RED],
                    ['ES %95', `₺${mcSonuc.es_95.toFixed(1)}M`, AMBER],
                    ['ES %99', `₺${mcSonuc.es_99.toFixed(1)}M`, AMBER],
                    ['Ort. Kayıp', `₺${mcSonuc.ortalama_kayip.toFixed(1)}M`, TEAL],
                    ['Maks. Kayıp', `₺${mcSonuc.max_kayip.toFixed(1)}M`, NAVY],
                  ].map(([label, val, renk]) => (
                    <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${BORDER}`, fontSize: 13 }}>
                      <span style={{ color: '#94A3B8' }}>{label as string}</span>
                      <span style={{ fontWeight: 800, color: renk as string, fontFamily: 'DM Mono,monospace' }}>{val as string}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 10, fontSize: 11, color: '#94A3B8', textAlign: 'center' }}>
                    {(iterasyon).toLocaleString('tr-TR')} iterasyon · Log-Normal Dağılım
                  </div>
                </div>
              )}
            </div>

            {/* Histogram */}
            <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Kayıp Dağılımı Histogramı</h3>
              <p style={{ fontSize: 12, color: '#94A3B8', marginBottom: 20 }}>
                Monte Carlo {iterasyon.toLocaleString('tr-TR')} iterasyon · Kırmızı çizgi = VaR %95
              </p>

              {mcSonuc ? (
                <div>
                  {/* SVG histogram */}
                  <div style={{ position: 'relative', height: 240 }}>
                    <svg width="100%" height="240" style={{ overflow: 'visible' }}>
                      {mcSonuc.histogram.map((bar, i) => {
                        const barHeight = (bar.adet / histMax) * 200
                        const barWidth = 100 / mcSonuc.histogram.length
                        const x = i * barWidth
                        return (
                          <g key={i}>
                            <rect
                              x={`${x + 0.3}%`}
                              y={240 - barHeight}
                              width={`${barWidth - 0.6}%`}
                              height={barHeight}
                              fill={bar.var_95_cizgisi ? RED : i >= mcSonuc.histogram.length * 0.85 ? '#FCA5A5' : '#BFDBFE'}
                              opacity={0.85}
                            />
                          </g>
                        )
                      })}
                      {/* VaR %99 çizgisi */}
                      <line x1="99%" y1="0" x2="99%" y2="240" stroke={RED} strokeDasharray="4 3" strokeWidth={1.5} />
                    </svg>
                  </div>

                  {/* X ekseni etiketleri */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#94A3B8', marginTop: 4 }}>
                    <span>₺{mcSonuc.histogram[0]?.aralik}M</span>
                    <span style={{ color: RED }}>← VaR %95</span>
                    <span>₺{mcSonuc.max_kayip.toFixed(1)}M</span>
                  </div>

                  {/* VaR/ES açıklama kutuları */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20 }}>
                    {[
                      { label: 'VaR %95', val: mcSonuc.var_95, aciklama: 'Kayıpların %5\'i bu değeri aşar', renk: '#FEE2E2', textRenk: RED },
                      { label: 'VaR %99', val: mcSonuc.var_99, aciklama: 'Kayıpların %1\'i bu değeri aşar', renk: '#FEE2E2', textRenk: RED },
                      { label: 'ES %95 (CVaR)', val: mcSonuc.es_95, aciklama: 'VaR üzeri kayıpların ortalaması', renk: '#FEF9C3', textRenk: AMBER },
                      { label: 'ES %99 (CVaR)', val: mcSonuc.es_99, aciklama: 'Kuyruk riskinin beklenen değeri', renk: '#FEF9C3', textRenk: AMBER },
                    ].map(x => (
                      <div key={x.label} style={{ background: x.renk, borderRadius: 8, padding: '10px 12px' }}>
                        <div style={{ fontSize: 11, color: x.textRenk, fontWeight: 700, marginBottom: 2 }}>{x.label}</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: x.textRenk, fontFamily: 'DM Mono,monospace' }}>₺{x.val.toFixed(1)}M</div>
                        <div style={{ fontSize: 10, color: x.textRenk, opacity: 0.75, marginTop: 2 }}>{x.aciklama}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ height: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
                  Parametreleri ayarlayıp "Simüle Et"e basın.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SENARYO OLASILIK ANALİZİ ────────────────────────────────── */}
        {aktifSekme === 'senaryolar' && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Senaryo Olasılık & Etki Analizi</h2>
              <p style={{ fontSize: 12, color: '#94A3B8' }}>Her senaryo için 1 yıllık olasılık ve beklenen/stres kayıp tahmini. Olasılıkları kaydırarak senaryoları kalibrate edebilirsiniz.</p>
            </div>

            {/* Agregat */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
              {[
                { label: 'Agregat Beklenen Kayıp / Yıl', val: `₺${agregatBeklenenKayip.toFixed(1)}M`, renk: TEAL },
                { label: 'Agregat Stres Kaybı (%99.9)', val: `₺${agregatStresKayip.toFixed(1)}M`, renk: RED },
                { label: 'Risk Yoğunlaşması', val: SENARYOLAR.reduce((a, s) => Math.max(a, (senaryoAgirliklar[s.id] ?? s.olasilik_1yil) / 100 * s.stres_kayip), 0).toFixed(0) + '% tek senaryo', renk: AMBER },
              ].map(k => (
                <div key={k.label} style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '16px 20px' }}>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 6 }}>{k.label}</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: k.renk, fontFamily: 'DM Mono,monospace' }}>{k.val}</div>
                </div>
              ))}
            </div>

            {/* Senaryo listesi */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SENARYOLAR.map(s => {
                const agirlik = senaryoAgirliklar[s.id] ?? s.olasilik_1yil
                const bekKayip = (agirlik / 100) * s.beklenen_kayip
                return (
                  <div key={s.id} style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '16px 20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px 140px 140px', gap: 16, alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{s.ad}</div>
                        <span style={{ fontSize: 11, background: '#EFF6FF', color: '#2563EB', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>{s.tur}</span>
                      </div>

                      <div>
                        <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4 }}>
                          1 Yıllık Olasılık: <span style={{ fontWeight: 700, color: NAVY }}>{agirlik}%</span>
                        </div>
                        <input type="range" min={0} max={100} value={agirlik}
                          onChange={e => setSenaryoAgirliklar(p => ({ ...p, [s.id]: Number(e.target.value) }))}
                          style={{ width: '100%', accentColor: TEAL, cursor: 'pointer' }} />
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 3 }}>Beklenen Kayıp / Yıl</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: TEAL, fontFamily: 'DM Mono,monospace' }}>₺{bekKayip.toFixed(1)}M</div>
                        <div style={{ fontSize: 10, color: '#94A3B8' }}>(p={agirlik}% × ₺{s.beklenen_kayip}M)</div>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 3 }}>Stres Kaybı %99.9</div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: RED, fontFamily: 'DM Mono,monospace' }}>₺{s.stres_kayip}M</div>
                        <div style={{ fontSize: 10, color: '#94A3B8' }}>Korelasyon: {s.korelasyon.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── STRES TESTİ ─────────────────────────────────────────────── */}
        {aktifSekme === 'stres' && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Stres Testi Sonuçları</h2>
              <p style={{ fontSize: 12, color: '#94A3B8' }}>NGFS İklim Senaryoları · Basel III Stres Testi · BDDK İSEDES Madde 22 uyumlu</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

              {/* Stres senaryoları */}
              {[
                {
                  baslik: 'Baz Senaryo (Olası)',
                  aciklama: 'Orta şiddette operasyonel olay + ılımlı ekonomik baskı',
                  renk: TEAL, bg: '#F0FDF9', border: '#86EFAC',
                  metrikler: [
                    ['Operasyonel Kayıp', '₺12M'],
                    ['Sermaye Tüketimi', '%3.2'],
                    ['RWA Artışı', '₺45M'],
                    ['LCR Etkisi', '%-2.1'],
                  ],
                },
                {
                  baslik: 'Olumsuz Senaryo (Stres)',
                  aciklama: 'Ciddi siber saldırı + piyasa dalgalanması + tedarik kesintisi',
                  renk: AMBER, bg: '#FFFBEB', border: '#FDE68A',
                  metrikler: [
                    ['Operasyonel Kayıp', '₺78M'],
                    ['Sermaye Tüketimi', '%9.4'],
                    ['RWA Artışı', '₺210M'],
                    ['LCR Etkisi', '%-11.3'],
                  ],
                },
                {
                  baslik: 'Ağır Stres Senaryosu',
                  aciklama: 'İstanbul depremi + eş zamanlı siber saldırı + tedarikçi iflasları',
                  renk: RED, bg: '#FFF7F7', border: '#FCA5A5',
                  metrikler: [
                    ['Operasyonel Kayıp', '₺340M'],
                    ['Sermaye Tüketimi', '%28.7'],
                    ['RWA Artışı', '₺890M'],
                    ['LCR Etkisi', '%-42.8'],
                  ],
                },
                {
                  baslik: 'NGFS İklim — Net Sıfır 2050',
                  aciklama: 'Düzenleyici geçiş riski + karbon vergileri + varlık değer kaybı',
                  renk: '#7C3AED', bg: '#F5F3FF', border: '#C4B5FD',
                  metrikler: [
                    ['Kredi Riski (Geçiş)', '₺55M'],
                    ['Piyasa Riski', '₺28M'],
                    ['Stranded Assets', '₺110M'],
                    ['Sermaye İhtiyacı', '₺+195M'],
                  ],
                },
              ].map(s => (
                <div key={s.baslik} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 12, padding: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 4 }}>{s.baslik}</div>
                  <div style={{ fontSize: 12, color: '#64748B', marginBottom: 14, lineHeight: 1.5 }}>{s.aciklama}</div>
                  {s.metrikler.map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${s.border}`, fontSize: 13 }}>
                      <span style={{ color: '#64748B' }}>{label}</span>
                      <span style={{ fontWeight: 800, color: s.renk, fontFamily: 'DM Mono,monospace' }}>{val}</span>
                    </div>
                  ))}
                </div>
              ))}

              {/* Stres testi uyarısı */}
              <div style={{ gridColumn: '1 / -1', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1D4ED8', marginBottom: 6 }}> ICAAP Bağlantısı</div>
                <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.7 }}>
                  Bu stres testi sonuçları BDDK İSEDES Madde 17 kapsamındaki İç Sermaye Yeterliliği Değerlendirme Süreci'ne (ICAAP) girdi sağlar. Ağır stres senaryosunda %28.7 sermaye tüketimi, mevcut sermaye tamponlarının yeterliliğini test etmektedir. Sonuçlar <strong>omniAUDIT</strong> modülüne aktarılabilir.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── METODOLOJİ ──────────────────────────────────────────────── */}
        {aktifSekme === 'metodoloji' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

            {[
              {
                baslik: 'Monte Carlo Simülasyonu',
                renk: NAVY,
                maddeler: [
                  ['Model', 'Log-Normal Kayıp Dağılımı'],
                  ['Parametre', 'μ (baz kayıp), σ (volatilite)'],
                  ['Rasgele Sayı', 'Box-Muller Dönüşümü'],
                  ['Varsayılan İterasyon', '10,000 simülasyon'],
                  ['Güven Aralıkları', '%95 ve %99 VaR/ES'],
                  ['Standart', 'Basel II — Gelişmiş Ölçüm Yaklaşımı'],
                ],
              },
              {
                baslik: 'Value at Risk (VaR)',
                renk: RED,
                maddeler: [
                  ['Tanım', 'Belirli bir güven düzeyinde maksimum kayıp'],
                  ['Formül', 'VaR(α) = F⁻¹(1−α)'],
                  ['%95 VaR', 'Kayıpların %5\'i bu değeri aşar'],
                  ['%99 VaR', 'Kayıpların %1\'i bu değeri aşar'],
                  ['Sınırlılık', 'Kuyruk riskini hafife alabilir'],
                  ['Alternatif', 'Expected Shortfall (ES) kullanılır'],
                ],
              },
              {
                baslik: 'Expected Shortfall (ES / CVaR)',
                renk: AMBER,
                maddeler: [
                  ['Tanım', 'VaR\'ın ötesindeki kayıpların beklenen değeri'],
                  ['Formül', 'ES(α) = E[L | L > VaR(α)]'],
                  ['Avantaj', 'Kuyruk riskini VaR\'dan iyi yakalar'],
                  ['Basel III', 'Piyasa riski modeli ES kullanır'],
                  ['FRTB', 'ES %97.5 temel ölçüt olarak tanımlanmış'],
                  ['Tutarlılık', 'Alt-eklemeli — portföy çeşitlendirmesi'],
                ],
              },
              {
                baslik: 'Düzenleyici Çerçeve',
                renk: TEAL,
                maddeler: [
                  ['BDDK İSEDES', 'Madde 17 — ICAAP kapsamı'],
                  ['BDDK İSEDES', 'Madde 22 — Stres Testi zorunluluğu'],
                  ['Basel II', 'Pillar 2 — Sermaye Yeterliliği'],
                  ['Basel III', 'Piyasa Riski — ES tabanlı'],
                  ['NGFS', 'İklim senaryoları — Geçiş ve Fiziksel'],
                  ['ISO 31000', 'Risk yönetim çerçevesi'],
                ],
              },
            ].map(blok => (
              <div key={blok.baslik} style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ background: blok.renk, padding: '12px 16px' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{blok.baslik}</h3>
                </div>
                {blok.maddeler.map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', padding: '10px 16px', borderBottom: `1px solid ${BORDER}`, gap: 16 }}>
                    <span style={{ fontSize: 12, color: '#94A3B8', minWidth: 120 }}>{label}</span>
                    <span style={{ fontSize: 12, color: NAVY }}>{val}</span>
                  </div>
                ))}
              </div>
            ))}

            {/* Araştırma bildirimi */}
            <div style={{ gridColumn: '1 / -1', background: '#F5F3FF', border: '1px solid #C4B5FD', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#6D28D9', marginBottom: 6 }}> Araştırma Modülü Bildirimi</div>
              <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.7 }}>
                omniQRA bir araştırma ve prototip modülüdür. Sunulan modeller ve sonuçlar eğitim ve araştırma amaçlıdır; prodüksiyon ortamında kullanılacak VaR/ES hesaplamaları için validasyon ve bağımsız doğrulama süreçlerinden geçirilmelidir. BDDK onaylı risk ölçüm sistemi olarak kullanmadan önce Madde 17 kapsamında ICAAP dokümanı hazırlanmalı ve denetimden geçirilmelidir.
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
