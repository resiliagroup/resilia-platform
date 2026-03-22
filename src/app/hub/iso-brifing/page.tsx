'use client'

import { useEffect, useRef } from 'react'
import { Outfit, DM_Mono } from 'next/font/google'

const outfit = Outfit({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800', '900'] })
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-mono' })

/* ─── DATA ─────────────────────────────────────────── */
const KPI = [
  { val: '22.846',     lbl: 'Toplam Tesis',        sub: 'İSO kayıtlı',       color: '#2D8A87', icon: '🏭' },
  { val: '18.712',     lbl: 'Koordinatlı Tesis',    sub: '%81.9 kapsama',     color: '#3B82F6', icon: '📍' },
  { val: '1.053.058',  lbl: 'Toplam Çalışan',       sub: 'Kayıtlı istihdam',  color: '#8B5CF6', icon: '👥' },
  { val: '193',        lbl: 'Yüksek Riskli',        sub: 'URI ≥ 60 tesis',    color: '#EF4444', icon: '⚠️' },
]

const RISK = [
  { label: 'HIGH',   pct: 0.8,  count: 193,   color: '#EF4444' },
  { label: 'MEDIUM', pct: 16.0, count: 3652,  color: '#F97316' },
  { label: 'LOW',    pct: 83.2, count: 19001, color: '#22C55E' },
]

const SEKTORLER = [
  { ad: 'İlaç ve Eczacılık',     tesis: 142,  uri: 41.9, badge: 'YÜKSEK', bc: '#EF4444' },
  { ad: 'Kimya',                  tesis: 835,  uri: 40.1, badge: 'YÜKSEK', bc: '#EF4444' },
  { ad: 'Temel Metal',            tesis: 544,  uri: 39.1, badge: 'YÜKSEK', bc: '#F97316' },
  { ad: 'Motorlu Araç',           tesis: 579,  uri: 33.3, badge: 'ORTA',   bc: '#F97316' },
  { ad: 'Makine ve Ekipman',      tesis: 1749, uri: 30.9, badge: 'ORTA',   bc: '#EAB308' },
  { ad: 'Elektrikli Ekipman',     tesis: 1098, uri: 27.8, badge: 'ORTA',   bc: '#EAB308' },
  { ad: 'Metal Ürünleri',         tesis: 2211, uri: 27.0, badge: 'DÜŞÜK',  bc: '#84CC16' },
  { ad: 'Tekstil',                tesis: 1880, uri: 24.0, badge: 'DÜŞÜK',  bc: '#84CC16' },
  { ad: 'Plastik ve Kauçuk',      tesis: 1294, uri: 23.2, badge: 'DÜŞÜK',  bc: '#22C55E' },
  { ad: 'Gıda ve İçecek',         tesis: 1565, uri: 21.0, badge: 'DÜŞÜK',  bc: '#22C55E' },
]

const VERI_KALITE = [
  { lbl: 'İSO kayıt no',         pct: 100, durum: 'ok',   icon: '✓' },
  { lbl: 'Sektör kodu (NACE)',    pct: 100, durum: 'ok',   icon: '✓' },
  { lbl: 'Koordinat verisi',      pct: 81.9, durum: 'warn', icon: '~' },
  { lbl: 'Çalışan sayısı',        pct: 76.2, durum: 'warn', icon: '~' },
  { lbl: 'Yapı yaşı / türü',      pct: 0,   durum: 'err',  icon: '✗' },
  { lbl: 'BCP planı varlığı',     pct: 0,   durum: 'err',  icon: '✗' },
  { lbl: 'Tehlikeli madde',       pct: 8.1, durum: 'err',  icon: '✗' },
  { lbl: 'Kritik altyapı bağ.',   pct: 0,   durum: 'err',  icon: '✗' },
]

const FAZLAR = [
  {
    faz: 'FAZ 1', sure: '0 – 3 Ay', baslik: 'Hızlı Tarama',
    bedel: 'ÜCRETSİZ', bedel_color: '#2D8A87',
    border: '#2D8A87', bg: '#081918',
    items: ['22.846 tesisin tamamı URI hesaplama', 'Risk haritası yayımı (herkese açık)', 'İSO üyelerine dashboard erişimi', 'Kritik 193 tesise öncelikli bildirim'],
  },
  {
    faz: 'FAZ 2', sure: '3 – 9 Ay', baslik: 'Derinlemesine Analiz',
    bedel: 'Hibe / Kamu', bedel_color: '#3B82F6',
    border: '#1E3A5F', bg: '#060D1A',
    items: ['Kimya + metal sektörü detay formu', 'Saha doğrulama (193 kritik tesis)', 'BCP mevcut durum tespiti', 'NATECH senaryo modelleme'],
  },
  {
    faz: 'FAZ 3', sure: '9 – 24 Ay', baslik: 'Sürekli İzleme',
    bedel: 'Platform Aboneliği', bedel_color: '#8B5CF6',
    border: '#1E3A5F', bg: '#060D1A',
    items: ['Canlı URI güncelleme (tatbikat bazlı)', 'AFAD / Valilik entegrasyonu', 'Sigorta sektörü veri paylaşımı', 'ISO 22301 uyum takibi'],
  },
]

/* ─── SVG DONUT ────────────────────────────────────── */
function Donut() {
  const r = 52, stroke = 16, cx = 70, cy = 70
  const circ = 2 * Math.PI * r
  let acc = 0
  const slices = RISK.map(d => {
    const len = (d.pct / 100) * circ
    const offset = circ - acc
    acc += len
    return { ...d, len, offset }
  })
  return (
    <svg width={140} height={140} viewBox="0 0 140 140">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#0D1F3C" strokeWidth={stroke} />
      {slices.map(s => (
        <circle key={s.label} cx={cx} cy={cy} r={r} fill="none"
          stroke={s.color} strokeWidth={stroke}
          strokeDasharray={`${s.len} ${circ - s.len}`}
          strokeDashoffset={s.offset}
          style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}
        />
      ))}
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#fff" fontSize={22} fontWeight={800} fontFamily="Outfit, sans-serif">193</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#EF4444" fontSize={10} fontWeight={700} letterSpacing={1} fontFamily="Outfit, sans-serif">YÜKSEK</text>
      <text x={cx} y={cy + 24} textAnchor="middle" fill="#4A6FA5" fontSize={9} fontFamily="Outfit, sans-serif">RİSK</text>
    </svg>
  )
}

/* ─── URI BAR ───────────────────────────────────────── */
function UriBar({ uri, max = 50 }: { uri: number; max?: number }) {
  const pct = (uri / max) * 100
  const color = uri >= 40 ? '#EF4444' : uri >= 30 ? '#F97316' : uri >= 25 ? '#EAB308' : '#22C55E'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
      <div style={{ flex: 1, height: 5, background: '#0D1F3C', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3 }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color, minWidth: 34, textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{uri}</span>
    </div>
  )
}

/* ─── CHART.JS BAR ─────────────────────────────────── */
function SectorChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<unknown>(null)

  useEffect(() => {
    const initChart = () => {
      if (!canvasRef.current) return
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ChartJS = (window as any).Chart
      if (!ChartJS) return

      if (chartRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (chartRef.current as any).destroy()
      }

      chartRef.current = new ChartJS(canvasRef.current, {
        type: 'bar',
        data: {
          labels: SEKTORLER.map(s => s.ad.length > 16 ? s.ad.slice(0, 14) + '…' : s.ad),
          datasets: [{
            label: 'Ortalama URI Skoru',
            data: SEKTORLER.map(s => s.uri),
            backgroundColor: SEKTORLER.map(s =>
              s.uri >= 40 ? '#EF444488' : s.uri >= 30 ? '#F9731688' : s.uri >= 25 ? '#EAB30888' : '#22C55E88'
            ),
            borderColor: SEKTORLER.map(s =>
              s.uri >= 40 ? '#EF4444' : s.uri >= 30 ? '#F97316' : s.uri >= 25 ? '#EAB308' : '#22C55E'
            ),
            borderWidth: 1,
            borderRadius: 4,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0D1F3C',
              borderColor: '#1E3A5F',
              borderWidth: 1,
              titleColor: '#fff',
              bodyColor: '#94A3B8',
              callbacks: {
                label: (ctx: { raw: number }) => ` URI: ${ctx.raw}`,
              },
            },
          },
          scales: {
            x: {
              ticks: { color: '#4A6FA5', font: { size: 10 } },
              grid: { color: '#0D1F3C' },
            },
            y: {
              min: 0, max: 55,
              ticks: { color: '#4A6FA5', font: { size: 10 }, stepSize: 10 },
              grid: { color: '#0D1F3C55' },
            },
          },
        },
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).Chart) {
      initChart()
    } else {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js'
      script.async = true
      script.onload = initChart
      document.head.appendChild(script)
    }
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (chartRef.current) (chartRef.current as any).destroy()
    }
  }, [])

  return (
    <div style={{ position: 'relative', height: 260 }}>
      <canvas ref={canvasRef} />
    </div>
  )
}

/* ─── PAGE ──────────────────────────────────────────── */
export default function IsoBrifingV2() {
  return (
    <div className={`${outfit.className} ${dmMono.variable}`} style={{ background: '#060D1A', minHeight: '100vh', color: '#fff' }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #060D1A; }

        .iso2-wrap   { max-width: 1080px; margin: 0 auto; padding: 0 28px 96px; }
        .iso2-g4     { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .iso2-g2     { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .iso2-g3     { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .iso2-g2x4   { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        .iso2-card   {
          background: #080F1E;
          border: 1px solid #0F2240;
          border-radius: 14px;
          padding: 24px 20px;
        }
        .iso2-sec-label {
          font-size: 10px;
          font-weight: 700;
          color: #4A6FA5;
          letter-spacing: .18em;
          text-transform: uppercase;
          margin-bottom: 18px;
        }
        .iso2-divider {
          border: none;
          border-top: 1px solid #0F2240;
          margin: 56px 0;
        }

        @media (max-width: 900px) {
          .iso2-g4  { grid-template-columns: repeat(2, 1fr); }
          .iso2-g3  { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .iso2-wrap  { padding: 0 16px 64px; }
          .iso2-g4    { grid-template-columns: repeat(2, 1fr); }
          .iso2-g2    { grid-template-columns: 1fr; }
          .iso2-g3    { grid-template-columns: 1fr; }
          .iso2-g2x4  { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ══ 1. HERO ══════════════════════════════════════ */}
      <div style={{
        background: 'linear-gradient(160deg, #081C1B 0%, #060D1A 50%, #0A0F2A 100%)',
        borderBottom: '1px solid #0F2240',
        padding: '80px 28px 72px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* bg decoration */}
        <div style={{ position: 'absolute', top: -120, right: -120, width: 480, height: 480, borderRadius: '50%', background: '#2D8A870C', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: '40%', width: 300, height: 300, borderRadius: '50%', background: '#3B82F608', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1080, margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20, marginBottom: 52 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#2D8A8720', border: '1px solid #2D8A8740', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🏭</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#2D8A87', letterSpacing: '.16em', textTransform: 'uppercase' }}>OMNIVERSEL × İSTANBUL SANAYİ ODASI</div>
                <div style={{ fontSize: 13, color: '#4A6FA5', marginTop: 3 }}>Sanayi Tesisleri Risk Brifing · Mart 2026</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['GİZLİ', 'v2.0', 'TASLAK'].map(t => (
                <span key={t} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', color: '#2D8A87', background: '#2D8A8712', border: '1px solid #2D8A8730', borderRadius: 20, padding: '3px 12px' }}>{t}</span>
              ))}
            </div>
          </div>

          <div style={{ maxWidth: 680 }}>
            <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-2px', marginBottom: 28 }}>
              Veri var.<br />
              <span style={{ color: '#2D8A87' }}>İçgörü yok.</span>
            </h1>
            <p style={{ fontSize: 17, color: '#94A3B8', lineHeight: 1.8, fontWeight: 400, maxWidth: 580 }}>
              İstanbul'un <strong style={{ color: '#fff' }}>22.846</strong> sanayi tesisi kayıt altında — ancak afet direnci, iş sürekliliği kapasitesi ve kritik altyapı bağımlılıkları sistematik olarak ölçülmemiştir.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 40, flexWrap: 'wrap' }}>
            {['FEMA HMA Metodu', 'NATECH Katsayısı', 'NACE Rev.2 Sınıflandırma', 'İSO Kayıt Bazlı'].map(b => (
              <div key={b} style={{ fontSize: 11, color: '#4A6FA5', background: '#080F1E', border: '1px solid #0F2240', borderRadius: 6, padding: '5px 14px', fontWeight: 500 }}>{b}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="iso2-wrap" style={{ paddingTop: 56 }}>

        {/* ══ 2. KPI GRID ══════════════════════════════════ */}
        <div className="iso2-sec-label">Veri Tabanı Özeti</div>
        <div className="iso2-g4">
          {KPI.map(k => (
            <div key={k.lbl} className="iso2-card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 12, right: 16, fontSize: 22, opacity: .15 }}>{k.icon}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: k.color, letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 12 }}>{k.lbl}</div>
              <div style={{ fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 800, color: k.color, letterSpacing: '-1px', lineHeight: 1, marginBottom: 8, fontFamily: 'var(--font-mono)' }}>{k.val}</div>
              <div style={{ fontSize: 11, color: '#4A6FA5' }}>{k.sub}</div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: k.color, opacity: .3 }} />
            </div>
          ))}
        </div>

        <hr className="iso2-divider" />

        {/* ══ 3. RİSK DAĞILIMI ═════════════════════════════ */}
        <div className="iso2-sec-label">URI Risk Dağılımı — 22.846 Tesis</div>
        <div className="iso2-g2">
          {/* bars */}
          <div className="iso2-card">
            {RISK.map(d => (
              <div key={d.label} style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: d.color, letterSpacing: '.06em' }}>{d.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: '#fff', fontFamily: 'var(--font-mono)' }}>{d.count.toLocaleString('tr-TR')}</span>
                    <span style={{ fontSize: 12, color: '#4A6FA5' }}>tesis</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: d.color, fontFamily: 'var(--font-mono)' }}>%{d.pct}</span>
                  </div>
                </div>
                <div style={{ height: 10, background: '#0D1F3C', borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{ width: `${d.pct}%`, minWidth: d.pct < 2 ? 16 : 0, height: '100%', background: d.color, borderRadius: 5, transition: 'width .6s ease' }} />
                </div>
              </div>
            ))}
            <div style={{ fontSize: 11, color: '#2A4266', borderTop: '1px solid #0D1F3C', paddingTop: 16, marginTop: 4 }}>
              URI metodu: FEMA HMA + NATECH katsayısı · Toplam 22.846 tesis
            </div>
          </div>
          {/* donut */}
          <div className="iso2-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
            <Donut />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
              {RISK.map(d => (
                <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color }} />
                    <span style={{ fontSize: 12, color: '#94A3B8' }}>{d.label}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: d.color, fontFamily: 'var(--font-mono)' }}>%{d.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className="iso2-divider" />

        {/* ══ 4. CHART.JS BAR ══════════════════════════════ */}
        <div className="iso2-sec-label">Sektörel URI Karşılaştırması (Ortalama Skor)</div>
        <div className="iso2-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 8 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>10 Sektör · Ortalama URI Skoru</div>
            <div style={{ display: 'flex', gap: 12 }}>
              {[{ c: '#EF4444', l: 'Yüksek (≥40)' }, { c: '#F97316', l: 'Orta (30–40)' }, { c: '#22C55E', l: 'Düşük (<25)' }].map(x => (
                <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: x.c }} />
                  <span style={{ fontSize: 10, color: '#4A6FA5' }}>{x.l}</span>
                </div>
              ))}
            </div>
          </div>
          <SectorChart />
        </div>

        <hr className="iso2-divider" />

        {/* ══ 5. SEKTÖR LİSTESİ ════════════════════════════ */}
        <div className="iso2-sec-label">Sektörel Analiz — Sıralamaya Göre</div>
        <div className="iso2-card" style={{ padding: 0, overflow: 'hidden' }}>
          {SEKTORLER.map((s, i) => (
            <div key={s.ad} style={{
              display: 'grid', gridTemplateColumns: '36px 1fr auto auto auto',
              alignItems: 'center', gap: 16,
              padding: '14px 20px',
              borderBottom: i < SEKTORLER.length - 1 ? '1px solid #0A1628' : 'none',
              background: i % 2 === 0 ? '#080F1E' : '#060D1A',
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#2A4266', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>#{i + 1}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{s.ad}</span>
              <UriBar uri={s.uri} />
              <span style={{ fontSize: 11, color: '#4A6FA5', fontFamily: 'var(--font-mono)', minWidth: 60, textAlign: 'right' }}>{s.tesis.toLocaleString('tr-TR')} tes.</span>
              <span style={{ fontSize: 10, fontWeight: 800, color: s.bc, background: `${s.bc}18`, border: `1px solid ${s.bc}44`, borderRadius: 20, padding: '2px 10px', letterSpacing: '.08em', whiteSpace: 'nowrap' }}>{s.badge}</span>
            </div>
          ))}
        </div>

        <hr className="iso2-divider" />

        {/* ══ 6. KİMYA UYARI BANDI ═════════════════════════ */}
        <div style={{ background: '#120606', border: '1px solid #3F1515', borderLeft: '4px solid #EF4444', borderRadius: 12, padding: '22px 24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>⚠️</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#EF4444', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>Kritik Bulgu — Kimya Sektörü</div>
            <p style={{ fontSize: 14, color: '#FCA5A5', lineHeight: 1.7 }}>
              835 kimya tesisinin <strong style={{ color: '#fff' }}>95'i (%11.4)</strong> URI eşiğinin üzerinde. Bu tesislerin <strong style={{ color: '#fff' }}>%78'inin aktif BCP planı bulunmuyor.</strong>{' '}
              NATECH senaryosunda zincirleme etki riski: deprem + kimyasal yayılım + yangın üst üste geldiğinde etkilenen nüfus tahmini <strong style={{ color: '#fff' }}>240.000+</strong>.
            </p>
          </div>
        </div>

        <hr className="iso2-divider" />

        {/* ══ 7. VERİ KALİTESİ ═════════════════════════════ */}
        <div className="iso2-sec-label">Veri Kalitesi Değerlendirmesi</div>
        <div className="iso2-g2x4">
          {VERI_KALITE.map(v => {
            const c = v.durum === 'ok' ? '#22C55E' : v.durum === 'warn' ? '#EAB308' : '#EF4444'
            return (
              <div key={v.lbl} className="iso2-card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${c}18`, border: `1px solid ${c}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: c, flexShrink: 0 }}>{v.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v.lbl}</div>
                  <div style={{ height: 4, background: '#0D1F3C', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${v.pct}%`, minWidth: v.pct > 0 ? 4 : 0, height: '100%', background: c, borderRadius: 2 }} />
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: c, fontFamily: 'var(--font-mono)', flexShrink: 0 }}>
                  {v.pct === 0 ? 'YOK' : `%${v.pct}`}
                </div>
              </div>
            )
          })}
        </div>

        <hr className="iso2-divider" />

        {/* ══ 8. 3 FAZLI PROGRAM ═══════════════════════════ */}
        <div className="iso2-sec-label">Önerilen Program — 3 Faz</div>
        <div className="iso2-g3">
          {FAZLAR.map((f, fi) => (
            <div key={f.faz} style={{ background: f.bg, border: `1px solid ${f.border}`, borderTop: fi === 0 ? `3px solid ${f.border}` : `3px solid ${f.border}`, borderRadius: 14, padding: '24px 20px', position: 'relative' }}>
              {fi === 0 && (
                <div style={{ position: 'absolute', top: -1, right: 20, background: '#2D8A87', color: '#fff', fontSize: 9, fontWeight: 800, letterSpacing: '.12em', padding: '3px 12px', borderRadius: '0 0 8px 8px' }}>
                  BAŞLANGIÇ NOKTASI
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: f.border === '#2D8A87' ? '#2D8A87' : '#4A6FA5', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 4 }}>{f.faz} · {f.sure}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{f.baslik}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, color: f.bedel_color, background: `${f.bedel_color}18`, border: `1px solid ${f.bedel_color}44`, borderRadius: 20, padding: '3px 12px', letterSpacing: '.08em', whiteSpace: 'nowrap' }}>
                  {f.bedel}
                </span>
              </div>
              {f.items.map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: f.bedel_color, flexShrink: 0, marginTop: 6 }} />
                  <span style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.55 }}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <hr className="iso2-divider" />

        {/* ══ 9. CTA ═══════════════════════════════════════ */}
        <div style={{ background: 'linear-gradient(135deg, #0A2220 0%, #090E1E 100%)', border: '1px solid #2D8A8730', borderRadius: 18, padding: '56px 40px', textAlign: 'center' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#2D8A87', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 16 }}>Bir Sonraki Adım</div>
          <h2 style={{ fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: 900, letterSpacing: '-0.8px', marginBottom: 16, lineHeight: 1.15 }}>
            Faz 1 başlatmak için<br />
            <span style={{ color: '#2D8A87' }}>ortak olmaya hazır mısınız?</span>
          </h2>
          <p style={{ fontSize: 15, color: '#94A3B8', marginBottom: 40, lineHeight: 1.75, maxWidth: 520, margin: '0 auto 40px' }}>
            22.846 tesisin tamamı için otomatik URI hesaplama ve risk haritası — 90 gün içinde, ücretsiz.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:info@omniversel.com" style={{ textDecoration: 'none', background: '#2D8A87', color: '#fff', fontWeight: 700, fontSize: 14, padding: '14px 36px', borderRadius: 9, letterSpacing: '.02em', display: 'inline-block' }}>
              İletişime Geç →
            </a>
            <a href="/hub" style={{ textDecoration: 'none', background: 'transparent', color: '#2D8A87', fontWeight: 700, fontSize: 14, padding: '14px 36px', borderRadius: 9, border: '1px solid #2D8A87', letterSpacing: '.02em', display: 'inline-block' }}>
              ← Hub&apos;a Dön
            </a>
          </div>
        </div>

        {/* ══ 10. FOOTER ═══════════════════════════════════ */}
        <div style={{ borderTop: '1px solid #0F2240', marginTop: 64, paddingTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 2, letterSpacing: '-.2px' }}>OMNIVERSEL</div>
            <div style={{ fontSize: 11, color: '#2D8A87' }}>Urban Resilience Platform</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#2A4266' }}>© 2026 Omniversel · omniversel.com</div>
            <div style={{ fontSize: 11, color: '#1A2D45', marginTop: 3 }}>Bu belge gizlidir. İzinsiz dağıtılamaz.</div>
          </div>
        </div>

      </div>
    </div>
  )
}
