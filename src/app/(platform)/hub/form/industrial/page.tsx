'use client'

function uriToAdis(uri: number): number { return Math.round(200 + (uri / 100) * 1000) }
function adisRenk(a: number): string { return a<450?'#EF4444':a<650?'#F97316':a<850?'#EAB308':a<1050?'#22C55E':'#16A34A' }
function adisLabel(a: number): string { return a<450?'Kritik Risk':a<650?'Yüksek Risk':a<850?'Orta Risk':a<1050?'İyi':'Güçlü' }
import { useState } from 'react'
import { SORULAR_SANAYI, type SoruSanayi } from '@/lib/sorular-sanayi'
import { createFacility, createAssessment, type OmniAssessment, RISK_CLASS_TR, RISK_CLASS_COLOR } from '@/lib/api'
import Link from 'next/link'

const TENANT_BD = '11111111-0000-0000-0000-000000000001'
const NAVY = '#0A1628'; const TEAL = '#009B8D'; const BORDER = '#E2E8F0'

const TEHLIKE  = SORULAR_SANAYI.filter(s => s.bolum === 'TEHLİKE')
const KIRILGAN = SORULAR_SANAYI.filter(s => s.bolum === 'KIRILGANLIK')
const KAPASITE = SORULAR_SANAYI.filter(s => s.bolum === 'KAPASİTE')
const ADIMLAR  = ['Tesis Bilgileri', 'Tehlike Analizi', 'Kırılganlık', 'Kapasite', 'Sonuç']

// Sanayi için seçenek oluşturucu (sorular rehber dizisi kullanır)
const PUAN_LABEL: Record<number, string> = { 1: 'Düşük Risk', 3: 'Orta-Düşük', 5: 'Orta', 7: 'Yüksek', 10: 'Çok Yüksek' }

function SoruKarti({ soru, puan, onDegis }: { soru: SoruSanayi; puan: number; onDegis: (v: number) => void }) {
  const secenekler = soru.rehber
    ? soru.rehber.map((label, i) => ({ label, puan: [1, 3, 6, 10][i] ?? i * 3 + 1 }))
    : Object.entries(PUAN_LABEL).map(([p, label]) => ({ label, puan: Number(p) }))

  return (
    <div style={{ background: 'white', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '16px 20px', marginBottom: 10 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'white', background: soru.boyut === 'H' ? '#EF4444' : soru.boyut === 'C' ? '#10B981' : '#F97316', padding: '2px 8px', borderRadius: 4, flexShrink: 0 }}>
          {soru.kod}
        </span>
        {soru.kritik && <span style={{ fontSize: 10, color: '#DC2626', background: '#FEF2F2', border: '1px solid #FECACA', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>KRİTİK</span>}
        {(soru as SoruSanayi).natech_flag && <span style={{ fontSize: 10, color: '#7C3AED', background: '#F5F3FF', border: '1px solid #DDD6FE', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>NATECH</span>}
        <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.55 }}>{soru.soru}</p>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {secenekler.map(s => (
          <button key={s.puan} onClick={() => onDegis(s.puan)}
            style={{ fontSize: 12, padding: '6px 14px', borderRadius: 6, border: `1px solid ${puan === s.puan ? TEAL : BORDER}`, background: puan === s.puan ? '#EBF8F7' : 'white', color: puan === s.puan ? TEAL : '#6B7280', fontWeight: puan === s.puan ? 700 : 400, cursor: 'pointer', transition: 'all .15s', maxWidth: 280, textAlign: 'left' as const }}>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function SanayiFormuPage() {
  const [adim, setAdim] = useState(0)
  const [tesisAdi, setTesisAdi] = useState('')
  const [naceKodu, setNaceKodu] = useState('')
  const [calisanSayisi, setCalisanSayisi] = useState('')
  const [puanlar, setPuanlar] = useState<Record<string, number>>({})
  const [gonderiyor, setGonderiyor] = useState(false)
  const [hata, setHata] = useState('')
  const [sonuc, setSonuc] = useState<OmniAssessment | null>(null)

  const setPuan = (kod: string, val: number) => setPuanlar(p => ({ ...p, [kod]: val }))

  const toplamDoluluk = () => {
    const dolu = SORULAR_SANAYI.filter(s => puanlar[s.kod] !== undefined).length
    return Math.round(dolu / SORULAR_SANAYI.length * 100)
  }

  // Anlık URI tahmini
  const uriOnizleme = (() => {
    let H = 0, Hw = 0, F = 0, Fw = 0, C = 0, Cw = 0
    SORULAR_SANAYI.forEach(s => {
      const p = puanlar[s.kod] ?? 5
      if (s.boyut === 'H')                       { H += p * s.agirlik; Hw += s.agirlik }
      else if (s.boyut === 'F' || s.boyut === 'E') { F += p * s.agirlik; Fw += s.agirlik }
      else if (s.boyut === 'C')                  { C += p * s.agirlik; Cw += s.agirlik }
    })
    const hN = Hw ? H / Hw / 10 : 0.5
    const fN = Fw ? F / Fw / 10 : 0.5
    const cN = Cw ? C / Cw / 10 : 0.5
    return Math.round(Math.max(0, Math.min(100, (1 - (hN * 0.35 + fN * 0.35)) * 100 * 0.7 + cN * 100 * 0.3)))
  })()
  const uriRenk = uriOnizleme < 40 ? '#EF4444' : uriOnizleme < 60 ? '#F97316' : uriOnizleme < 75 ? '#F59E0B' : '#22C55E'

  const sonrakiAdim = () => {
    if (adim === 0 && !tesisAdi.trim()) { setHata('Tesis adı zorunludur.'); return }
    setHata(''); setAdim(a => a + 1)
  }

  const formuGonder = async () => {
    setGonderiyor(true); setHata('')
    try {
      const tesis = await createFacility({
        tenant_id: TENANT_BD,
        code: `IND-${Date.now().toString(36).toUpperCase()}`,
        name: tesisAdi,
        sector: 'industrial',
        employee_count: parseInt(calisanSayisi) || undefined,
      })

      const p = (kod: string) => (puanlar[kod] ?? 5) / 10
      const assessment = await createAssessment({
        facility_id: tesis.id,
        notes: `HIFYEA Sanayi · NACE:${naceKodu || 'Belirtilmemiş'} · ${new Date().toLocaleDateString('tr-TR')}`,
        bottleneck_score: p('T8'),
        hazard: {
          seismic: p('T1'), flood: p('T2'), wildfire: p('T3'),
          supply_chain: p('T6'), cyber: p('T7') * 0.5,
        },
        fragility: {
          construction_quality: 1 - p('S1'), seismic_compliance: 1 - p('S2'),
          maintenance_score: 1 - p('S4'), single_point_of_failure: p('S7'),
          redundancy_score: 1 - p('S9'), cyber_hygiene: 1 - p('S10'),
        },
        response: {
          bcm_plan_exists: (puanlar['Y2'] ?? 5) >= 7,
          plan_tested_last_12m: (puanlar['Y22'] ?? 5) >= 7,
          drill_frequency_per_year: Math.round((puanlar['Y23'] ?? 5) / 2),
          crisis_team_exists: (puanlar['Y19'] ?? 5) >= 5,
          iso_22301_certified: (puanlar['Y7'] ?? 5) >= 8,
          emergency_stockpile_days: Math.round((10 - (puanlar['Y15'] ?? 5)) / 2),
        },
      })
      setSonuc(assessment)
      setAdim(4)
    } catch (e: unknown) {
      setHata(e instanceof Error ? e.message : 'Değerlendirme gönderilemedi.')
    }
    setGonderiyor(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', fontFamily: "'DM Sans',sans-serif" }}>
      {/* Üst Bar */}
      <div style={{ background: NAVY, padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/hub" style={{ color: '#94A3B8', fontSize: 13, textDecoration: 'none' }}>← Hub</Link>
          <span style={{ color: '#1E3A5F', fontSize: 13 }}>|</span>
          <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>HIFYEA Sanayi Tesisi Değerlendirmesi</span>
        </div>
        {adim > 0 && adim < 4 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#94A3B8' }}>Anlık URI:</span>
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
            <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 24 }}>ISO 22301 · AFAD AADY 2025 · TOC/HRO Sentezi · {SORULAR_SANAYI.length} soru</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Tesis Adı *</label>
                <input value={tesisAdi} onChange={e => setTesisAdi(e.target.value)} placeholder="örn. Gebze OSB Fabrikası A"
                  style={{ width: '100%', padding: '10px 14px', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>NACE Kodu</label>
                <input value={naceKodu} onChange={e => setNaceKodu(e.target.value)} placeholder="örn. 24.10"
                  style={{ width: '100%', padding: '10px 14px', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Çalışan Sayısı</label>
                <input type="number" value={calisanSayisi} onChange={e => setCalisanSayisi(e.target.value)} placeholder="örn. 250"
                  style={{ width: '100%', padding: '10px 14px', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
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
              <p style={{ fontSize: 13, color: '#94A3B8' }}>AFAD AADY 2025 · NATECH · {TEHLIKE.length} soru</p>
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
              <p style={{ fontSize: 13, color: '#94A3B8' }}>Yapısal · Operasyonel · İnsan · {KIRILGAN.length} soru</p>
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
              <p style={{ fontSize: 13, color: '#94A3B8' }}>ISO 22301 · HRO İlkeleri · {KAPASITE.length} soru · Doluluk: %{toplamDoluluk()}</p>
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
                {uriToAdis(Math.round(sonuc.uri_score))}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: RISK_CLASS_COLOR[sonuc.risk_class], marginTop: 8 }}>
                {RISK_CLASS_TR[sonuc.risk_class]}
              </div>
              <div style={{ fontSize: 14, color: '#94A3B8', marginTop: 8 }}>{tesisAdi}</div>
              {sonuc.bottleneck_score !== undefined && (
                <div style={{ fontSize: 12, color: '#7C3AED', marginTop: 4 }}>NATECH Darboğaz: {Math.round(sonuc.bottleneck_score * 100)}</div>
              )}

              {sonuc.recommendations?.length > 0 && (
                <div style={{ marginTop: 32, textAlign: 'left' }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 12 }}>Öncelikli Öneriler</h3>
                  {sonuc.recommendations.slice(0, 3).map((r, i) => (
                    <div key={i} style={{ padding: '12px 16px', background: '#F8F9FA', borderRadius: 8, marginBottom: 8, borderLeft: '3px solid #7C3AED' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: NAVY }}>{r.title}</div>
                      <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>{r.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Link href="/hub" style={{ padding: '12px 28px', border: `1px solid ${BORDER}`, borderRadius: 8, color: '#374151', textDecoration: 'none', fontSize: 14 }}>Hub&apos;a Dön</Link>
              <button onClick={() => { setAdim(0); setSonuc(null); setPuanlar({}); setTesisAdi('') }}
                style={{ padding: '12px 28px', background: TEAL, color: 'white', fontWeight: 700, fontSize: 14, border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                Yeni Değerlendirme
              </button>
            </div>
          </div>
        )}
        {adim === 4 && !sonuc && <div style={{ textAlign: 'center', padding: 48, color: '#EF4444' }}>{hata}</div>}
      </div>
    </div>
  )
}
