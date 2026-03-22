'use client'

import { Syne } from 'next/font/google'

const font = Syne({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] })

const SEKTORLER = [
  { ad: 'İlaç ve Eczacılık',        tesis: 142,   uri: 41.9, yuksek: 30,  renk: '#EF4444' },
  { ad: 'Kimya',                     tesis: 835,   uri: 40.1, yuksek: 95,  renk: '#EF4444' },
  { ad: 'Temel Metal',               tesis: 544,   uri: 39.1, yuksek: 54,  renk: '#F97316' },
  { ad: 'Motorlu Araç ve Parça',     tesis: 579,   uri: 33.3, yuksek: null, renk: '#F97316' },
  { ad: 'Makine ve Ekipman',         tesis: 1749,  uri: 30.9, yuksek: null, renk: '#EAB308' },
  { ad: 'Elektrikli Ekipman',        tesis: 1098,  uri: 27.8, yuksek: null, renk: '#EAB308' },
  { ad: 'Metal Ürünleri',            tesis: 2211,  uri: 27.0, yuksek: null, renk: '#84CC16' },
  { ad: 'Tekstil',                   tesis: 1880,  uri: 24.0, yuksek: null, renk: '#84CC16' },
  { ad: 'Plastik ve Kauçuk',         tesis: 1294,  uri: 23.2, yuksek: null, renk: '#22C55E' },
  { ad: 'Gıda ve İçecek',            tesis: 1565,  uri: 21.0, yuksek: null, renk: '#22C55E' },
]

function UriBar({ uri }: { uri: number }) {
  const pct = (uri / 60) * 100
  const color = uri >= 40 ? '#EF4444' : uri >= 30 ? '#F97316' : uri >= 25 ? '#EAB308' : '#22C55E'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, height: 6, background: '#0F2240', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color, minWidth: 36, textAlign: 'right' }}>{uri}</span>
    </div>
  )
}

const DONUT_DATA = [
  { label: 'HIGH',   pct: 0.8,  color: '#EF4444', count: 193 },
  { label: 'MEDIUM', pct: 16.0, color: '#F97316', count: 3652 },
  { label: 'LOW',    pct: 83.2, color: '#22C55E', count: 19001 },
]

function Donut() {
  const cx = 60, cy = 60, r = 48, stroke = 14
  const circ = 2 * Math.PI * r
  let offset = 0
  const slices = DONUT_DATA.map(d => {
    const len = (d.pct / 100) * circ
    const slice = { ...d, dasharray: `${len} ${circ - len}`, dashoffset: circ - offset }
    offset += len
    return slice
  })
  return (
    <svg width={120} height={120} viewBox="0 0 120 120">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#0F2240" strokeWidth={stroke} />
      {slices.map(s => (
        <circle key={s.label} cx={cx} cy={cy} r={r} fill="none"
          stroke={s.color} strokeWidth={stroke}
          strokeDasharray={s.dasharray}
          strokeDashoffset={s.dashoffset}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
        />
      ))}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#FFFFFF" fontSize={18} fontWeight={700}>193</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fill="#EF4444" fontSize={9} fontWeight={600}>YÜKSEK</text>
    </svg>
  )
}

export default function IsoBrifing() {
  return (
    <div className={font.className} style={{ background: '#060D1A', minHeight: '100vh', color: '#FFFFFF' }}>
      <style>{`
        *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #060D1A; }
        .iso-wrap { max-width: 960px; margin: 0 auto; padding: 48px 24px 80px; }
        .iso-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .iso-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .iso-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        @media (max-width: 768px) {
          .iso-grid-4 { grid-template-columns: repeat(2, 1fr); }
          .iso-grid-2 { grid-template-columns: 1fr; }
          .iso-grid-3 { grid-template-columns: 1fr; }
          .iso-wrap   { padding: 32px 16px 60px; }
        }
        @media (max-width: 480px) {
          .iso-grid-4 { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="iso-wrap">

        {/* ── 1. HEADER ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 56, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: '#2D8A87', textTransform: 'uppercase', marginBottom: 8 }}>
              OMNIVERSEL × İSTANBUL SANAYİ ODASI
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.3px' }}>
              Sanayi Tesisleri Risk Brifing
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#4A6FA5', fontWeight: 600, marginBottom: 4 }}>YAYIM TARİHİ</div>
            <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500 }}>Mart 2026</div>
            <div style={{ marginTop: 10, display: 'inline-block', background: '#0D1F3C', border: '1px solid #1E3A5F', borderRadius: 20, padding: '3px 12px', fontSize: 10, color: '#2D8A87', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              GİZLİ
            </div>
          </div>
        </div>

        {/* ── 2. HERO ── */}
        <div style={{ marginBottom: 64, borderLeft: '3px solid #2D8A87', paddingLeft: 28 }}>
          <div style={{ fontSize: 11, color: '#2D8A87', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
            YÖNETİCİ ÖZETİ
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-1px', marginBottom: 20, color: '#FFFFFF' }}>
            Veri var.<br />
            <span style={{ color: '#2D8A87' }}>İçgörü yok.</span>
          </h1>
          <p style={{ fontSize: 16, color: '#94A3B8', lineHeight: 1.75, maxWidth: 640, fontWeight: 400 }}>
            İstanbul'un 22.846 sanayi tesisi kayıt altında — ancak bu tesislerin afet direnci, iş sürekliliği kapasitesi ve kritik altyapı bağımlılıkları sistematik olarak ölçülmemiştir. Bu brifing, mevcut veri altyapısı ile tespit edilen açıkları ve önerilen çözüm programını sunar.
          </p>
        </div>

        {/* ── 3. 4 BÜYÜK RAKAM ── */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 11, color: '#4A6FA5', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
            VERİ TABANI ÖZETI
          </div>
          <div className="iso-grid-4">
            {[
              { val: '22.846', lbl: 'Toplam Tesis', sub: 'İSO kayıtlı', color: '#2D8A87' },
              { val: '18.712', lbl: 'Koordinatlı Tesis', sub: '%81.9 kapsama', color: '#3B82F6' },
              { val: '1.053.058', lbl: 'Toplam Çalışan', sub: 'Kayıtlı istihdam', color: '#8B5CF6' },
              { val: '193',    lbl: 'Yüksek Riskli', sub: 'URI ≥ 60 tesis', color: '#EF4444' },
            ].map(c => (
              <div key={c.lbl} style={{ background: '#080F1E', border: '1px solid #0F2240', borderRadius: 12, padding: '24px 20px' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: c.color, letterSpacing: '-1px', marginBottom: 6 }}>{c.val}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>{c.lbl}</div>
                <div style={{ fontSize: 11, color: '#4A6FA5' }}>{c.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. RİSK DAĞILIMI ── */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 11, color: '#4A6FA5', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
            URI RİSK DAĞILIMI
          </div>
          <div className="iso-grid-2">
            {/* Bar chart */}
            <div style={{ background: '#080F1E', border: '1px solid #0F2240', borderRadius: 12, padding: '28px 24px' }}>
              <div style={{ marginBottom: 24 }}>
                {DONUT_DATA.map(d => (
                  <div key={d.label} style={{ marginBottom: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: d.color }}>{d.label}</span>
                      <span style={{ fontSize: 12, color: '#94A3B8' }}>{d.count.toLocaleString('tr-TR')} tesis — %{d.pct}</span>
                    </div>
                    <div style={{ height: 8, background: '#0F2240', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${d.pct}%`, height: '100%', background: d.color, borderRadius: 4 }} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: '#2A4266', borderTop: '1px solid #0F2240', paddingTop: 16 }}>
                Toplam: 22.846 tesis · URI Metodu: FEMA HMA + NATECH katsayısı
              </div>
            </div>
            {/* Donut */}
            <div style={{ background: '#080F1E', border: '1px solid #0F2240', borderRadius: 12, padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
              <Donut />
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                {DONUT_DATA.map(d => (
                  <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                    <span style={{ fontSize: 11, color: '#94A3B8' }}>{d.label} %{d.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 5. SEKTÖREL TABLO ── */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 11, color: '#4A6FA5', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
            SEKTÖREL URI ANALİZİ — İLK 10
          </div>
          <div style={{ background: '#080F1E', border: '1px solid #0F2240', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #0F2240' }}>
                  {['#', 'Sektör', 'Tesis', 'Ort. URI', 'Risk Bar', 'Yüksek Riskli'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', fontSize: 10, fontWeight: 700, color: '#4A6FA5', textAlign: 'left', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SEKTORLER.map((s, i) => (
                  <tr key={s.ad} style={{ borderBottom: '1px solid #0A1628' }}>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: '#4A6FA5', fontWeight: 600 }}>{i + 1}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>{s.ad}</td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#94A3B8' }}>{s.tesis.toLocaleString('tr-TR')}</td>
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 800, color: s.renk }}>{s.uri}</td>
                    <td style={{ padding: '14px 16px', width: 140 }}><UriBar uri={s.uri} /></td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: s.yuksek ? '#EF4444' : '#4A6FA5', fontWeight: s.yuksek ? 700 : 400 }}>
                      {s.yuksek ? `${s.yuksek} tesis` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── 6. KİMYA UYARI BANDI ── */}
        <div style={{ marginBottom: 56, background: '#1A0808', border: '1px solid #3F1515', borderLeft: '4px solid #EF4444', borderRadius: 12, padding: '20px 24px' }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 20 }}>⚠️</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#EF4444', marginBottom: 6, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                KRİTİK BULGU — KİMYA SEKTÖRÜ
              </div>
              <p style={{ fontSize: 14, color: '#FCA5A5', lineHeight: 1.65 }}>
                835 kimya tesisinin 95'i (%11.4) URI eşiğinin üzerinde. Bu tesislerin <strong>%78'inin aktif BCP planı bulunmuyor</strong>. NATECH senaryosunda zincirleme etki riski: deprem + kimyasal yayılım + yangın üst üste geldiğinde etkilenen nüfus tahmini <strong>240.000+</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* ── 7. VERİ KALİTESİ ── */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 11, color: '#4A6FA5', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
            VERİ KALİTESİ DEĞERLENDİRMESİ
          </div>
          <div className="iso-grid-2">
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#22C55E', marginBottom: 12, letterSpacing: '0.08em' }}>MEVCUT VERİ</div>
              {[
                'İSO kayıt numarası ve unvan',
                'Sektör kodu (NACE Rev.2)',
                'İlçe bazlı konum bilgisi',
                'Çalışan sayısı (yaklaşık)',
                'Koordinat (18.712 tesis)',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#94A3B8' }}>{item}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#EF4444', marginBottom: 12, letterSpacing: '0.08em' }}>EKSİK VERİ</div>
              {[
                'Yapı yaşı ve bina türü',
                'Kritik altyapı bağımlılıkları',
                'BCP planı varlığı',
                'Tehlikeli madde deposu bilgisi',
                'Personel esneklik kapasitesi',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444', flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#94A3B8' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 8. 3 FAZLI PROGRAM ── */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ fontSize: 11, color: '#4A6FA5', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
            ÖNERİLEN PROGRAM — 3 FAZ
          </div>
          <div className="iso-grid-3">
            {[
              {
                faz: 'FAZ 1',
                sure: '0–3 Ay',
                baslik: 'Hızlı Tarama',
                bedel: 'ÜCRETSİZ',
                bedel_color: '#22C55E',
                items: ['22.846 tesis otomatik URI hesaplama', 'Risk haritası yayımı', 'İSO üyelerine dashboard erişimi', 'Kritik 193 tesise öncelikli bildirim'],
                border: '#22C55E',
                bg: '#061A0F',
              },
              {
                faz: 'FAZ 2',
                sure: '3–9 Ay',
                baslik: 'Derinlemesine Analiz',
                bedel: 'Hibe / Kamu',
                bedel_color: '#3B82F6',
                items: ['Kimya + metal sektörü detay formu', 'Saha doğrulama (193 kritik tesis)', 'BCP mevcut durum tespiti', 'NATECH senaryo modelleme'],
                border: '#3B82F6',
                bg: '#060D1A',
              },
              {
                faz: 'FAZ 3',
                sure: '9–24 Ay',
                baslik: 'Sürekli İzleme',
                bedel: 'Platform Aboneliği',
                bedel_color: '#8B5CF6',
                items: ['Canlı URI güncelleme (tatbikat sonrası)', 'AFAD / Valilik entegrasyonu', 'Sigorta sektörü veri paylaşımı', 'ISO 22301 uyum takibi'],
                border: '#8B5CF6',
                bg: '#060D1A',
              },
            ].map(f => (
              <div key={f.faz} style={{ background: f.bg, border: `1px solid ${f.border}`, borderTop: `3px solid ${f.border}`, borderRadius: 12, padding: '24px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: f.border, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>{f.faz} · {f.sure}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF' }}>{f.baslik}</div>
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 800, color: f.bedel_color, background: `${f.bedel_color}18`, border: `1px solid ${f.bedel_color}40`, borderRadius: 20, padding: '3px 10px', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                    {f.bedel}
                  </div>
                </div>
                {f.items.map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: f.border, flexShrink: 0, marginTop: 5 }} />
                    <span style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── 9. CTA ── */}
        <div style={{ background: 'linear-gradient(135deg, #0D2A28 0%, #0A1628 100%)', border: '1px solid #2D8A8730', borderRadius: 16, padding: '48px 40px', textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#2D8A87', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 16 }}>
            BİR SONRAKI ADIM
          </div>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: '#FFFFFF', marginBottom: 16, letterSpacing: '-0.5px' }}>
            Faz 1 başlatmak için<br />ortak olmaya hazır mısınız?
          </h2>
          <p style={{ fontSize: 15, color: '#94A3B8', marginBottom: 36, lineHeight: 1.7 }}>
            22.846 tesisin tamamı için otomatik URI hesaplama ve risk haritası — 90 gün içinde, ücretsiz.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:info@omniversel.com" style={{ textDecoration: 'none', background: '#2D8A87', color: '#FFFFFF', fontWeight: 700, fontSize: 14, padding: '14px 32px', borderRadius: 8, letterSpacing: '0.02em' }}>
              İletişime Geç →
            </a>
            <a href="/hub" style={{ textDecoration: 'none', background: 'transparent', color: '#2D8A87', fontWeight: 700, fontSize: 14, padding: '14px 32px', borderRadius: 8, border: '1px solid #2D8A87', letterSpacing: '0.02em' }}>
              ← Hub'a Dön
            </a>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ borderTop: '1px solid #0F2240', paddingTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#FFFFFF', marginBottom: 2 }}>OMNIVERSEL</div>
            <div style={{ fontSize: 11, color: '#2D8A87' }}>Urban Resilience Platform</div>
          </div>
          <div style={{ fontSize: 11, color: '#2A4266', textAlign: 'right' }}>
            <div>© 2026 Omniversel · omniversel.com</div>
            <div style={{ marginTop: 4 }}>Bu belge gizlidir. İzinsiz dağıtılamaz.</div>
          </div>
        </div>

      </div>
    </div>
  )
}
