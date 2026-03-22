'use client'
import { useState } from 'react'
import { SORULAR_BANKACI, type SoruBankaci } from '@/lib/sorular-bankaci'
import { createFacility, createAssessment, type OmniAssessment, RISK_CLASS_TR, RISK_CLASS_COLOR } from '@/lib/api'
import Link from 'next/link'

const TENANT_BD = '11111111-0000-0000-0000-000000000001'
const NAVY = '#0A1628'; const TEAL = '#009B8D'; const BORDER = '#E2E8F0'

// Soruları bölüme göre grupla
const TEHLIKE   = SORULAR_BANKACI.filter(s => s.bolum === 'TEHLİKE')
const KIRILGAN  = SORULAR_BANKACI.filter(s => s.bolum === 'KIRILGANLIK')
const KAPASITE  = SORULAR_BANKACI.filter(s => s.bolum === 'KAPASİTE')
const ADIMLAR   = ['Tesis Bilgileri', 'Tehlike Analizi', 'Kırılganlık', 'Kapasite', 'Sonuç']

function uriHesapla(puanlar: Record<string, number>): number {
  let H = 0, Hw = 0, F = 0, Fw = 0, C = 0, Cw = 0
  SORULAR_BANKACI.forEach(s => {
    const p = puanlar[s.kod] ?? 5
    if (s.boyut === 'H')              { H += p * s.agirlik; Hw += s.agirlik }
    else if (s.boyut === 'F' || s.boyut === 'E') { F += p * s.agirlik; Fw += s.agirlik }
    else if (s.boyut === 'C')         { C += p * s.agirlik; Cw += s.agirlik }
  })
  const hN = Hw ? H / Hw / 10 : 0.5
  const fN = Fw ? F / Fw / 10 : 0.5
  const cN = Cw ? C / Cw / 10 : 0.5
  return Math.round(Math.max(0, Math.min(100, (1 - (hN * 0.35 + fN * 0.35)) * 100 * 0.7 + cN * 100 * 0.3)))
}

function SoruKarti({ soru, puan, onDegis }: { soru: SoruBankaci; puan: number; onDegis: (v: number) => void }) {
  return (
    <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '16px 20px', marginBottom: 10 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'white', background: soru.boyut === 'H' ? '#EF4444' : soru.boyut === 'C' ? '#10B981' : '#F97316', padding: '2px 8px', borderRadius: 4, flexShrink: 0 }}>
          {soru.kod}
        </span>
        {soru.kritik && <span style={{ fontSize: 10, color: '#DC2626', background: '#FEF2F2', border: '1px solid #FECACA', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>KRİTİK</span>}
        <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.55 }}>{soru.soru}</p>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {soru.secenekler.map(s => (
          <button key={s.puan} onClick={() => onDegis(s.puan)}
            style={{ fontSize: 12, padding: '6px 14px', borderRadius: 6, border: `1px solid ${puan === s.puan ? TEAL : BORDER}`, background: puan === s.puan ? '#EBF8F7' : 'white', color: puan === s.puan ? TEAL : '#6B7280', fontWeight: puan === s.puan ? 700 : 400, cursor: 'pointer', transition: 'all .15s' }}>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function BankacılikFormuPage() {
  const [adim, setAdim] = useState(0)
  const [tesisAdi, setTesisAdi] = useState('')
  const [sehir, setSehir] = useState('İstanbul')
  const [puanlar, setPuanlar] = useState<Record<string, number>>({})
  const [gonderiyor, setGonderiyor] = useState(false)
  const [hata, setHata] = useState('')
  const [sonuc, setSonuc] = useState<OmniAssessment | null>(null)

  const setPuan = (kod: string, val: number) => setPuanlar(p => ({ ...p, [kod]: val }))

  const toplamDoluluk = () => {
    const toplam = SORULAR_BANKACI.length
    const dolu = SORULAR_BANKACI.filter(s => puanlar[s.kod] !== undefined).length
    return Math.round(dolu / toplam * 100)
  }

  const sonrakiAdim = () => {
    if (adim === 0 && !tesisAdi.trim()) { setHata('Tesis adı zorunludur.'); return }
    setHata(''); setAdim(a => a + 1)
  }

  const formuGonder = async () => {
    setGonderiyor(true); setHata('')
    try {
      const tesis = await createFacility({
        tenant_id: TENANT_BD,
        code: `BNK-${Date.now().toString(36).toUpperCase()}`,
        name: tesisAdi,
        sector: 'bank',
        building_age: 10,
      })

      // Puanları normalize et (0-1)
      const p = (kod: string) => (puanlar[kod] ?? 5) / 10

      const assessment = await createAssessment({
        facility_id: tesis.id,
        notes: `HIFYEA Bankacılık · ${sehir} · ${new Date().toLocaleDateString('tr-TR')}`,
        hazard: {
          seismic: p('T1'), flood: p('T2'), cyber: p('T3'),
          supply_chain: p('T5'), pandemic: p('T7'),
        },
        fragility: {
          single_point_of_failure: p('S1'), staff_training_score: p('S2'),
          construction_quality: 1 - p('S6'), redundancy_score: 1 - p('S9'),
          cyber_hygiene: 1 - p('S10'),
        },
        response: {
          bcm_plan_exists: (puanlar['Y2'] ?? 5) >= 7,
          plan_tested_last_12m: (puanlar['Y22'] ?? 5) >= 7,
          drill_frequency_per_year: Math.round((puanlar['Y23'] ?? 5) / 2),
          crisis_team_exists: (puanlar['Y19'] ?? 5) >= 5,
          iso_22301_certified: (puanlar['Y7'] ?? 5) >= 8,
        },
      })
      setSonuc(assessment)
      setAdim(4)
    } catch (e: unknown) {
      setHata(e instanceof Error ? e.message : 'Değerlendirme gönderilemedi.')
    }
    setGonderiyor(false)
  }

  const uriOnizleme = uriHesapla(puanlar)
  const uriRenk = uriOnizleme < 40 ? '#EF4444' : uriOnizleme < 60 ? '#F97316' : uriOnizleme < 75 ? '#F59E0B' : '#22C55E'

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', fontFamily: "'DM Sans',sans-serif" }}>

      {/* Üst Bar */}
      <div style={{ background: NAVY, padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/hub" style={{ color: '#94A3B8', fontSize: 13, textDecoration: 'none' }}>← Hub</Link>
          <span style={{ color: '#1E3A5F', fontSize: 13 }}>|</span>
          <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>HIFYEA Bankacılık Değerlendirmesi</span>
        </div>
        {adim > 0 && adim < 4 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#94A3B8' }}>Anlık URI Tahmini:</span>
            <span style={{ fontWeight: 800, fontSize: 16, color: uriRenk, fontFamily: 'DM Mono,monospace' }}>{uriOnizleme}</span>
          </div>
        )}
      </div>

      {/* İlerleme */}
      <div style={{ background: 'white', borderBottom: `1px solid ${BORDER}`, padding: '0 32px' }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {ADIMLAR.map((a, i) => (
            <div key={a} style={{ padding: '12px 20px', fontSize: 12, fontWeight: i === adim ? 700 : 500, color: i === adim ? TEAL : i < adim ? '#64748B' : '#CBD5E1', borderBottom: i === adim ? `2px solid ${TEAL}` : '2px solid transparent' }}>
              {i < adim ? '✓ ' : `${i + 1}. `}{a}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: '32px auto', padding: '0 24px' }}>

        {/* Adım 0: Tesis Bilgileri */}
        {adim === 0 && (
          <div style={{ background: 'white', borderRadius: 12, border: `1px solid ${BORDER}`, padding: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Tesis Bilgileri</h2>
            <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 24 }}>BDDK İSP Rehberi · Basel III · ISO 22301 · 73 soru</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Tesis / Şube Adı *</label>
                <input value={tesisAdi} onChange={e => setTesisAdi(e.target.value)} placeholder="örn. Akbank Bakırköy Şubesi"
                  style={{ width: '100%', padding: '10px 14px', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Şehir</label>
                <select value={sehir} onChange={e => setSehir(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, background: 'white', outline: 'none', boxSizing: 'border-box' as const }}>
                  {['İstanbul','Ankara','İzmir','Bursa','Antalya','Adana','Kocaeli','Gaziantep'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            {hata && <p style={{ color: '#EF4444', fontSize: 13, marginTop: 12 }}>{hata}</p>}
            <button onClick={sonrakiAdim} style={{ marginTop: 24, background: TEAL, color: 'white', fontWeight: 700, fontSize: 14, padding: '12px 32px', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
              Değerlendirmeye Başla →
            </button>
          </div>
        )}

        {/* Adım 1: Tehlike */}
        {adim === 1 && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>Bölüm 1 — Tehlike Analizi</h2>
              <p style={{ fontSize: 13, color: '#94A3B8' }}>ISO 31000 · ISO 22327 · {TEHLIKE.length} soru — Her soru için kuruluşunuza en uygun seçeneği işaretleyin</p>
            </div>
            {TEHLIKE.map(s => <SoruKarti key={s.kod} soru={s} puan={puanlar[s.kod] ?? 0} onDegis={v => setPuan(s.kod, v)} />)}
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setAdim(0)} style={{ padding: '12px 24px', border: `1px solid ${BORDER}`, borderRadius: 8, background: 'white', cursor: 'pointer', fontSize: 14 }}>← Geri</button>
              <button onClick={sonrakiAdim} style={{ padding: '12px 32px', background: TEAL, color: 'white', fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 8, cursor: 'pointer' }}>Kırılganlık Analizine Geç →</button>
            </div>
          </div>
        )}

        {/* Adım 2: Kırılganlık */}
        {adim === 2 && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>Bölüm 2 — Kırılganlık Analizi</h2>
              <p style={{ fontSize: 13, color: '#94A3B8' }}>BDDK Basel III · İnsan · Mekan · Ekonomik · {KIRILGAN.length} soru</p>
            </div>
            {KIRILGAN.map(s => <SoruKarti key={s.kod} soru={s} puan={puanlar[s.kod] ?? 0} onDegis={v => setPuan(s.kod, v)} />)}
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setAdim(1)} style={{ padding: '12px 24px', border: `1px solid ${BORDER}`, borderRadius: 8, background: 'white', cursor: 'pointer', fontSize: 14 }}>← Geri</button>
              <button onClick={sonrakiAdim} style={{ padding: '12px 32px', background: TEAL, color: 'white', fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 8, cursor: 'pointer' }}>Kapasite Analizine Geç →</button>
            </div>
          </div>
        )}

        {/* Adım 3: Kapasite */}
        {adim === 3 && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>Bölüm 3 — Yönetilebilirlik & Kapasite</h2>
              <p style={{ fontSize: 13, color: '#94A3B8' }}>BDDK İSP Rehberi · ISO 22301 · FEMA Core Capabilities · {KAPASITE.length} soru</p>
              <div style={{ marginTop: 8, fontSize: 12, color: '#64748B' }}>Doluluk: %{toplamDoluluk()} — Yanıtlanmayan sorular orta değer (5) olarak işlenir.</div>
            </div>
            {KAPASITE.map(s => <SoruKarti key={s.kod} soru={s} puan={puanlar[s.kod] ?? 0} onDegis={v => setPuan(s.kod, v)} />)}
            {hata && <p style={{ color: '#EF4444', fontSize: 13, marginTop: 12 }}>{hata}</p>}
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setAdim(2)} style={{ padding: '12px 24px', border: `1px solid ${BORDER}`, borderRadius: 8, background: 'white', cursor: 'pointer', fontSize: 14 }}>← Geri</button>
              <button onClick={formuGonder} disabled={gonderiyor}
                style={{ padding: '12px 40px', background: gonderiyor ? '#94A3B8' : NAVY, color: 'white', fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 8, cursor: gonderiyor ? 'not-allowed' : 'pointer' }}>
                {gonderiyor ? 'Değerlendiriliyor...' : 'Değerlendirmeyi Tamamla →'}
              </button>
            </div>
          </div>
        )}

        {/* Adım 4: Sonuç */}
        {adim === 4 && sonuc && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: 'white', borderRadius: 16, border: `1px solid ${BORDER}`, padding: 48, marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: '#94A3B8', marginBottom: 8 }}>URI SKORU</div>
              <div style={{ fontSize: 80, fontWeight: 900, color: RISK_CLASS_COLOR[sonuc.risk_class], fontFamily: 'DM Mono,monospace', lineHeight: 1 }}>
                {Math.round(sonuc.uri_score)}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: RISK_CLASS_COLOR[sonuc.risk_class], marginTop: 8 }}>
                {RISK_CLASS_TR[sonuc.risk_class]}
              </div>
              <div style={{ fontSize: 14, color: '#94A3B8', marginTop: 8 }}>{tesisAdi}</div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginTop: 32, textAlign: 'left' }}>
                {Object.entries(sonuc.dimension_scores).slice(0, 4).map(([key, val]) => (
                  <div key={key} style={{ background: '#F8F9FA', borderRadius: 8, padding: 16 }}>
                    <div style={{ fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>{key.toUpperCase()}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: NAVY, fontFamily: 'DM Mono,monospace' }}>{typeof val === 'number' ? Math.round(val) : '—'}</div>
                  </div>
                ))}
              </div>

              {sonuc.recommendations?.length > 0 && (
                <div style={{ marginTop: 32, textAlign: 'left' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 12 }}>Öncelikli Öneriler</h3>
                  {sonuc.recommendations.slice(0, 3).map((r, i) => (
                    <div key={i} style={{ padding: '12px 16px', background: '#F8F9FA', borderRadius: 8, marginBottom: 8, borderLeft: '3px solid #F59E0B' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{r.title}</div>
                      <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>{r.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Link href="/hub" style={{ padding: '12px 28px', border: `1px solid ${BORDER}`, borderRadius: 8, color: '#374151', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>
                Hub&apos;a Dön
              </Link>
              <button onClick={() => { setAdim(0); setSonuc(null); setPuanlar({}); setTesisAdi('') }}
                style={{ padding: '12px 28px', background: TEAL, color: 'white', fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                Yeni Değerlendirme
              </button>
            </div>
          </div>
        )}

        {adim === 4 && !sonuc && (
          <div style={{ textAlign: 'center', padding: 48, color: '#EF4444' }}>{hata || 'Sonuç yüklenemedi.'}</div>
        )}
      </div>
    </div>
  )
}
