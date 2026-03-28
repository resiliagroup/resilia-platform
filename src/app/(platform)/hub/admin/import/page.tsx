'use client'
import { useState, useRef } from 'react'
import { createFacility, createAssessment, RISK_CLASS_TR, RISK_CLASS_COLOR, type RiskClass } from '@/lib/api'
import Link from 'next/link'

const TENANT_BD = '11111111-0000-0000-0000-000000000001'
const NAVY = '#0A1628'; const TEAL = '#009B8D'; const BORDER = '#E2E8F0'

// Beklenen kolonlar
const BEKLENEN_KOLONLAR = ['FirmaAdi', 'NaceKodu', 'Enlem', 'Boylam', 'CalisanSayisi', 'KapaliAlan', 'BinaYapimYili']

interface SatirVeri {
  FirmaAdi: string
  NaceKodu?: string
  Enlem?: number
  Boylam?: number
  CalisanSayisi?: number
  KapaliAlan?: number
  BinaYapimYili?: number
}

interface SonucSatir {
  ad: string
  uri?: number
  riskSinifi?: string
  durum: 'bekliyor' | 'isleniyor' | 'tamamlandi' | 'hata'
  hata?: string
}

export default function TopluImportPage() {
  const [satirlar, setSatirlar] = useState<SatirVeri[]>([])
  const [sonuclar, setSonuclar] = useState<SonucSatir[]>([])
  const [isleniyor, setIsleniyor] = useState(false)
  const [tamamlanan, setTamamlanan] = useState(0)
  const [surukleniyorMu, setSurukleniyorMu] = useState(false)
  const [dosyaAdi, setDosyaAdi] = useState('')
  const [adim, setAdim] = useState<'yukle'|'onizle'|'islem'|'bitti'>('yukle')
  const fileRef = useRef<HTMLInputElement>(null)

  const dosyaIsle = async (file: File) => {
    setDosyaAdi(file.name)
    const { read, utils } = await import('xlsx')
    const tampon = await file.arrayBuffer()
    const kitap = read(tampon)
    const sayfa = kitap.Sheets[kitap.SheetNames[0]]
    const veri = utils.sheet_to_json<SatirVeri>(sayfa)
    setSatirlar(veri.filter(s => s.FirmaAdi?.trim()))
    setSonuclar(veri.filter(s => s.FirmaAdi?.trim()).map(s => ({ ad: s.FirmaAdi, durum: 'bekliyor' as const })))
    setAdim('onizle')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setSurukleniyorMu(false)
    const file = e.dataTransfer.files[0]
    if (file) dosyaIsle(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) dosyaIsle(file)
  }

  const islemiBaslat = async () => {
    setIsleniyor(true); setAdim('islem'); setTamamlanan(0)
    const yeniSonuclar = satirlar.map(s => ({ ad: s.FirmaAdi, durum: 'bekliyor' as const }))
    setSonuclar(yeniSonuclar)

    for (let i = 0; i < satirlar.length; i++) {
      const satir = satirlar[i]

      // İşleniyor durumuna al
      setSonuclar(prev => prev.map((s, idx) => idx === i ? { ...s, durum: 'isleniyor' } : s))

      try {
        const binaYasi = satir.BinaYapimYili ? new Date().getFullYear() - satir.BinaYapimYili : 20
        const kapaliAlan = satir.KapaliAlan ?? 1000

        const tesis = await createFacility({
          tenant_id: TENANT_BD,
          code: `IMP-${Date.now().toString(36).toUpperCase()}-${i}`,
          name: satir.FirmaAdi,
          sector: 'industrial',
          latitude: satir.Enlem,
          longitude: satir.Boylam,
          building_age: binaYasi,
          employee_count: satir.CalisanSayisi,
        })

        const assessment = await createAssessment({
          facility_id: tesis.id,
          notes: `Toplu İmport · NACE:${satir.NaceKodu ?? '?'} · ${new Date().toLocaleDateString('tr-TR')}`,
          fragility: {
            building_age_score: Math.min(1, binaYasi / 60),
            maintenance_score: kapaliAlan > 5000 ? 0.4 : 0.6,
          },
        })

        setSonuclar(prev => prev.map((s, idx) => idx === i ? {
          ...s, durum: 'tamamlandi',
          uri: Math.round(assessment.uri_score),
          riskSinifi: RISK_CLASS_TR[assessment.risk_class],
        } : s))
      } catch (e: unknown) {
        setSonuclar(prev => prev.map((s, idx) => idx === i ? {
          ...s, durum: 'hata',
          hata: e instanceof Error ? e.message : 'Bilinmeyen hata',
        } : s))
      }

      setTamamlanan(i + 1)
      // Kısa bekleme — rate limiting
      await new Promise(r => setTimeout(r, 300))
    }

    setIsleniyor(false); setAdim('bitti')
  }

  const ilerlemeYuzdesi = satirlar.length > 0 ? Math.round(tamamlanan / satirlar.length * 100) : 0
  const basarili = sonuclar.filter(s => s.durum === 'tamamlandi').length
  const hatali   = sonuclar.filter(s => s.durum === 'hata').length

  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', fontFamily: "'DM Sans',sans-serif" }}>
      {/* Üst Bar */}
      <div style={{ background: NAVY, padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ color: 'white', fontWeight: 800, fontSize: 16 }}>Toplu Tesis İmport</div>
          <div style={{ color: '#94A3B8', fontSize: 12, marginTop: 2 }}>Excel / CSV · Yalnızca Admin</div>
        </div>
        <Link href="/hub" style={{ color: '#94A3B8', fontSize: 13, textDecoration: 'none' }}>← Hub</Link>
      </div>

      <div style={{ maxWidth: 900, margin: '32px auto', padding: '0 24px' }}>

        {/* Adım 1: Dosya Yükleme */}
        {adim === 'yukle' && (
          <div style={{ background: 'white', borderRadius: 12, border: `1px solid ${BORDER}`, padding: 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Excel veya CSV Dosyası Yükle</h2>
            <p style={{ fontSize: 13, color: '#94A3B8', marginBottom: 24 }}>
              Her tesis için URI hesaplanır ve Supabase&apos;e kaydedilir.
            </p>

            {/* Drag-drop alanı */}
            <div
              onDragOver={e => { e.preventDefault(); setSurukleniyorMu(true) }}
              onDragLeave={() => setSurukleniyorMu(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              style={{ border: `2px dashed ${surukleniyorMu ? TEAL : BORDER}`, borderRadius: 12, padding: '48px 24px', textAlign: 'center', cursor: 'pointer', background: surukleniyorMu ? '#F0FDF9' : '#F8F9FA', transition: 'all .2s' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}></div>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#374151' }}>
                {surukleniyorMu ? 'Bırakın!' : 'Excel veya CSV sürükleyin'}
              </p>
              <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>veya tıklayarak seçin · .xlsx, .xls, .csv</p>
            </div>
            <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }} onChange={handleFileChange} />

            {/* Beklenen format */}
            <div style={{ marginTop: 24, background: '#F8F9FA', borderRadius: 10, padding: 20, border: `1px solid ${BORDER}` }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Beklenen Kolonlar:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {BEKLENEN_KOLONLAR.map(k => (
                  <span key={k} style={{ fontSize: 12, fontFamily: 'DM Mono,monospace', background: '#E0F2FE', color: '#0369A1', padding: '3px 10px', borderRadius: 4 }}>{k}</span>
                ))}
              </div>
              <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 10 }}>
                FirmaAdi zorunlu, diğerleri opsiyonel. NaceKodu sektör kalibrasyonunda kullanılır.
              </p>
            </div>
          </div>
        )}

        {/* Adım 2: Önizleme */}
        {adim === 'onizle' && (
          <div>
            <div style={{ background: 'white', borderRadius: 12, border: `1px solid ${BORDER}`, padding: 24, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: NAVY }}>{dosyaAdi}</h2>
                  <p style={{ fontSize: 13, color: '#94A3B8' }}>{satirlar.length} tesis bulundu — değerlendirme başlatılmadan önce kontrol edin</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => { setAdim('yukle'); setSatirlar([]); setSonuclar([]) }}
                    style={{ padding: '8px 18px', border: `1px solid ${BORDER}`, borderRadius: 8, background: 'white', cursor: 'pointer', fontSize: 13 }}>
                    Değiştir
                  </button>
                  <button onClick={islemiBaslat}
                    style={{ padding: '8px 24px', background: TEAL, color: 'white', fontWeight: 700, fontSize: 13, border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                    {satirlar.length} Tesisi Değerlendir →
                  </button>
                </div>
              </div>

              {/* Tablo */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>
                      {BEKLENEN_KOLONLAR.map(k => (
                        <th key={k} style={{ textAlign: 'left', padding: '8px 12px', background: '#F8F9FA', borderBottom: `1px solid ${BORDER}`, fontSize: 11, fontWeight: 700, color: '#94A3B8', fontFamily: 'DM Mono,monospace' }}>
                          {k}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {satirlar.slice(0, 10).map((s, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${BORDER}` }}>
                        <td style={{ padding: '8px 12px', color: '#374151', fontWeight: 600 }}>{s.FirmaAdi}</td>
                        <td style={{ padding: '8px 12px', color: '#94A3B8' }}>{s.NaceKodu ?? '—'}</td>
                        <td style={{ padding: '8px 12px', color: '#94A3B8' }}>{s.Enlem ?? '—'}</td>
                        <td style={{ padding: '8px 12px', color: '#94A3B8' }}>{s.Boylam ?? '—'}</td>
                        <td style={{ padding: '8px 12px', color: '#94A3B8' }}>{s.CalisanSayisi ?? '—'}</td>
                        <td style={{ padding: '8px 12px', color: '#94A3B8' }}>{s.KapaliAlan ?? '—'}</td>
                        <td style={{ padding: '8px 12px', color: '#94A3B8' }}>{s.BinaYapimYili ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {satirlar.length > 10 && (
                  <p style={{ padding: '8px 12px', fontSize: 12, color: '#94A3B8' }}>… ve {satirlar.length - 10} tesis daha</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Adım 3 & 4: İşlem + Bitti */}
        {(adim === 'islem' || adim === 'bitti') && (
          <div>
            {/* İlerleme */}
            <div style={{ background: 'white', borderRadius: 12, border: `1px solid ${BORDER}`, padding: 24, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>
                  {adim === 'islem' ? 'İşleniyor...' : 'İşlem Tamamlandı'}
                </h2>
                <span style={{ fontSize: 13, fontWeight: 700, color: TEAL, fontFamily: 'DM Mono,monospace' }}>
                  {tamamlanan} / {satirlar.length}
                </span>
              </div>

              {/* İlerleme çubuğu */}
              <div style={{ height: 10, background: '#F1F5F9', borderRadius: 999, overflow: 'hidden', marginBottom: 8 }}>
                <div style={{ height: '100%', width: `${ilerlemeYuzdesi}%`, background: adim === 'bitti' ? '#22C55E' : TEAL, borderRadius: 999, transition: 'width .3s' }} />
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#94A3B8' }}>
                <span>%{ilerlemeYuzdesi} tamamlandı</span>
                <span style={{ color: '#22C55E' }}>✓ {basarili} başarılı</span>
                {hatali > 0 && <span style={{ color: '#EF4444' }}>✗ {hatali} hata</span>}
              </div>

              {adim === 'bitti' && (
                <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
                  <Link href="/hub" style={{ padding: '9px 20px', border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, textDecoration: 'none', color: '#374151' }}>Hub&apos;a Dön</Link>
                  <button onClick={() => { setAdim('yukle'); setSatirlar([]); setSonuclar([]); setTamamlanan(0) }}
                    style={{ padding: '9px 20px', background: TEAL, color: 'white', fontWeight: 700, fontSize: 13, border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                    Yeni İmport
                  </button>
                </div>
              )}
            </div>

            {/* Sonuç Listesi */}
            <div style={{ background: 'white', borderRadius: 12, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
              {sonuclar.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: `1px solid ${BORDER}`, background: s.durum === 'isleniyor' ? '#F0FDF9' : 'white' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: s.durum === 'tamamlandi' ? '#22C55E' : s.durum === 'hata' ? '#EF4444' : s.durum === 'isleniyor' ? TEAL : '#CBD5E1' }} />
                  <span style={{ flex: 1, fontSize: 13, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.ad}</span>
                  {s.durum === 'tamamlandi' && s.uri !== undefined && (
                    <>
                      <span style={{ fontSize: 13, fontWeight: 800, color: RISK_CLASS_COLOR[s.riskSinifi as RiskClass] ?? '#374151', fontFamily: 'DM Mono,monospace' }}>{s.uri}</span>
                      <span style={{ fontSize: 11, color: '#94A3B8' }}>{s.riskSinifi}</span>
                    </>
                  )}
                  {s.durum === 'hata' && <span style={{ fontSize: 11, color: '#EF4444', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.hata}</span>}
                  {s.durum === 'isleniyor' && <span style={{ fontSize: 11, color: TEAL }}>işleniyor...</span>}
                  {s.durum === 'bekliyor' && <span style={{ fontSize: 11, color: '#CBD5E1' }}>bekliyor</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
