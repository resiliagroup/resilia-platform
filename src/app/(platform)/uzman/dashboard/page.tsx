'use client'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

const TENANT_ID = '11111111-0000-0000-0000-000000000001'
const NAVY = '#060D1A'
const TEAL = '#2D8A87'
const BORDER = '#1E3A5F'

const supabase = createBrowserClient(
  'https://gqguwgbopgnpwzjwcexl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTk4MzMsImV4cCI6MjA4ODk3NTgzM30.ZIFmmiGsB1rUAojvSG8uTfcknZi6LoXgrgApCL-e550'
)

type FormCevabi = {
  id: string
  birim_kodu: string
  senaryo: string
  dayaniklilik_skoru: number
  durum: 'taslak' | 'gonderildi' | 'incelendi'
  sektor?: string
  il_adi?: string
  olusturulma: string
  inceleme_notu?: string
}
type BIAKayit = { id: string; tenant_id: string; [k: string]: unknown }
type BCPKayit  = { id: string; tenant_id: string; [k: string]: unknown }
type Tesis     = { id: string; name: string; type?: string; city?: string; status?: string }

const PERSONEL = [
  { ad: 'Dr. Fatma Şahin',    pozisyon: 'Kriz Koordinatörü',    tel: '+90 532 100 0001', yedek: 'Mehmet Demir'    },
  { ad: 'Mehmet Demir',       pozisyon: 'BCP Sorumlusu',        tel: '+90 532 100 0002', yedek: 'Ayşe Kaya'       },
  { ad: 'Ayşe Kaya',          pozisyon: 'İletişim Yöneticisi',  tel: '+90 532 100 0003', yedek: 'Can Özdemir'     },
  { ad: 'Can Özdemir',        pozisyon: 'IT Altyapı Yöneticisi',tel: '+90 532 100 0004', yedek: 'Tuba Erdoğan'    },
  { ad: 'Tuba Erdoğan',       pozisyon: 'Operasyon Direktörü',  tel: '+90 532 100 0005', yedek: 'Dr. Fatma Şahin' },
]

const TATBIKATLAR = [
  { ad: 'Deprem Tahliye Tatbikatı', tarih: '2026-02-15', tur: 'Saha',    katilimci: 142, durum: 'Tamamlandı'  },
  { ad: 'BCP Masa Tatbikatı',       tarih: '2026-01-10', tur: 'Masa Üstü',katilimci: 28,  durum: 'Tamamlandı'  },
  { ad: 'IT Yük Devretme Testi',    tarih: '2026-04-20', tur: 'Teknik',  katilimci: 12,  durum: 'Planlandı'   },
  { ad: 'Yangın Söndürme Eğitimi',  tarih: '2026-05-08', tur: 'Saha',    katilimci: 85,  durum: 'Planlandı'   },
]

const TABS = [
  'Form Değerlendirme',
  'BIA Analizi',
  'İş Sürekliliği (BCP)',
  'Kritik Personel',
  'Eğitim & Tatbikat',
  'Risk Haritası',
]

function riskRenk(s: number) { return s < 40 ? '#EF4444' : s < 70 ? '#F59E0B' : '#22C55E' }
function riskEtiket(s: number) { return s < 40 ? 'KRİTİK' : s < 70 ? 'ORTA' : 'GÜÇLÜ' }
function durumRenk(d: string) {
  if (d === 'incelendi') return '#22C55E'
  if (d === 'gonderildi') return '#F59E0B'
  return '#64748B'
}

const card = (style?: React.CSSProperties): React.CSSProperties => ({
  background: '#0A1628', border: `1px solid ${BORDER}`, borderRadius: 12,
  padding: 20, ...style,
})

export default function UzmanDashboard() {
  const [aktifTab, setAktifTab] = useState(0)
  const [formlar, setFormlar]   = useState<FormCevabi[]>([])
  const [bia, setBia]           = useState<BIAKayit[]>([])
  const [bcp, setBcp]           = useState<BCPKayit[]>([])
  const [tesisler, setTesisler] = useState<Tesis[]>([])
  const [yukl, setYukl]         = useState(true)

  useEffect(() => {
    async function yukle() {
      setYukl(true)
      const [fRes, biaRes, bcpRes, tesRes] = await Promise.all([
        supabase.from('form_cevaplari').select('*').eq('tenant_id', TENANT_ID).order('olusturulma', { ascending: false }),
        supabase.from('bia_assessments').select('*').eq('tenant_id', TENANT_ID),
        supabase.from('bcp_plans').select('*').eq('tenant_id', TENANT_ID),
        supabase.from('facilities').select('id,name,type,city,status').limit(50),
      ])
      setFormlar((fRes.data ?? []) as FormCevabi[])
      setBia((biaRes.data ?? []) as BIAKayit[])
      setBcp((bcpRes.data ?? []) as BCPKayit[])
      setTesisler((tesRes.data ?? []) as Tesis[])
      setYukl(false)
    }
    yukle()
  }, [])

  const gonderilmis = formlar.filter(f => f.durum === 'gonderildi' || f.durum === 'incelendi')
  const kritik = gonderilmis.filter(f => f.dayaniklilik_skoru < 40).length
  const orta   = gonderilmis.filter(f => f.dayaniklilik_skoru >= 40 && f.dayaniklilik_skoru < 70).length
  const ortSkor = gonderilmis.length
    ? Math.round(gonderilmis.reduce((a, f) => a + f.dayaniklilik_skoru, 0) / gonderilmis.length)
    : 0

  return (
    <div style={{ minHeight: '100vh', background: NAVY, color: '#E2E8F0', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${BORDER}`, padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: 0 }}>Uzman Paneli</h1>
          <p style={{ fontSize: 13, color: '#64748B', margin: '2px 0 0' }}>Beylikdüzü Belediyesi · Operasyonel Risk Yönetimi</p>
        </div>
        <div style={{ fontSize: 12, color: '#64748B' }}>{new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
      </div>

      <div style={{ padding: '24px 32px' }}>

        {/* KPI Kartlar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { etiket: 'Toplam Form',   deger: formlar.length,    renk: TEAL     },
            { etiket: 'Kritik Risk',   deger: kritik,            renk: '#EF4444'},
            { etiket: 'Orta Risk',     deger: orta,              renk: '#F59E0B'},
            { etiket: 'Ort. URI Skor', deger: `${ortSkor}`,      renk: '#22C55E'},
          ].map(k => (
            <div key={k.etiket} style={card()}>
              <div style={{ fontSize: 12, color: '#64748B', marginBottom: 8 }}>{k.etiket}</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: k.renk }}>{yukl ? '—' : k.deger}</div>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: `1px solid ${BORDER}`, paddingBottom: 0 }}>
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setAktifTab(i)} style={{
              padding: '9px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              background: 'transparent', border: 'none', outline: 'none',
              color: aktifTab === i ? '#fff' : '#64748B',
              borderBottom: aktifTab === i ? `2px solid ${TEAL}` : '2px solid transparent',
              transition: 'color .15s',
            }}>{t}</button>
          ))}
        </div>

        {/* Tab içerikleri */}
        {yukl ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#64748B' }}>Yükleniyor...</div>
        ) : (
          <>
            {/* 0 — Form Değerlendirme */}
            {aktifTab === 0 && (
              <div>
                {formlar.length === 0 ? (
                  <div style={card({ textAlign: 'center', padding: 48, color: '#64748B' })}>
                    Henüz form kaydı yok. Migration 005 çalıştırıldı mı?
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {formlar.map(f => (
                      <div key={f.id} style={card({ display: 'flex', alignItems: 'center', gap: 16 })}>
                        <div style={{
                          minWidth: 56, height: 56, borderRadius: 10,
                          background: riskRenk(f.dayaniklilik_skoru) + '22',
                          border: `1px solid ${riskRenk(f.dayaniklilik_skoru)}44`,
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <div style={{ fontSize: 18, fontWeight: 800, color: riskRenk(f.dayaniklilik_skoru) }}>{f.dayaniklilik_skoru}</div>
                          <div style={{ fontSize: 9, color: riskRenk(f.dayaniklilik_skoru), fontWeight: 600 }}>{riskEtiket(f.dayaniklilik_skoru)}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, color: '#fff', fontSize: 14 }}>{f.birim_kodu}</div>
                          <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                            {f.sektor ?? '—'} · {f.senaryo} · {f.il_adi ?? '—'}
                          </div>
                          {f.inceleme_notu && (
                            <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 4, fontStyle: 'italic' }}>
                              📝 {f.inceleme_notu}
                            </div>
                          )}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{
                            fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                            background: durumRenk(f.durum) + '22', color: durumRenk(f.durum),
                            border: `1px solid ${durumRenk(f.durum)}44`,
                          }}>{f.durum}</span>
                          <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>
                            {new Date(f.olusturulma).toLocaleDateString('tr-TR')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 1 — BIA Analizi */}
            {aktifTab === 1 && (
              <div style={card({ padding: 32 })}>
                {bia.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#64748B', padding: 32 }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
                    <div style={{ fontWeight: 600, color: '#94A3B8' }}>BIA kaydı bulunamadı.</div>
                    <div style={{ fontSize: 13, marginTop: 6 }}>bia_assessments tablosuna veri ekleyin.</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {bia.map(b => (
                      <div key={b.id} style={{ padding: '14px 18px', background: '#0D1F3C', borderRadius: 10, border: `1px solid ${BORDER}` }}>
                        <div style={{ fontSize: 13, color: '#94A3B8' }}>ID: {b.id}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2 — İş Sürekliliği */}
            {aktifTab === 2 && (
              <div style={card({ padding: 32 })}>
                {bcp.length === 0 ? (
                  <div style={{ textAlign: 'center', color: '#64748B', padding: 32 }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
                    <div style={{ fontWeight: 600, color: '#94A3B8' }}>BCP planı bulunamadı.</div>
                    <div style={{ fontSize: 13, marginTop: 6 }}>bcp_plans tablosuna veri ekleyin.</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {bcp.map(b => (
                      <div key={b.id} style={{ padding: '14px 18px', background: '#0D1F3C', borderRadius: 10, border: `1px solid ${BORDER}` }}>
                        <div style={{ fontSize: 13, color: '#94A3B8' }}>ID: {b.id}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3 — Kritik Personel */}
            {aktifTab === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {PERSONEL.map(p => (
                  <div key={p.ad} style={card({ display: 'flex', alignItems: 'center', gap: 16 })}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%',
                      background: TEAL + '33', border: `1px solid ${TEAL}66`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 18, fontWeight: 700, color: TEAL,
                    }}>
                      {p.ad.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: 14 }}>{p.ad}</div>
                      <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{p.pozisyon}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, color: TEAL, fontWeight: 500 }}>{p.tel}</div>
                      <div style={{ fontSize: 11, color: '#475569', marginTop: 3 }}>Yedek: {p.yedek}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4 — Eğitim & Tatbikat */}
            {aktifTab === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {TATBIKATLAR.map(t => (
                  <div key={t.ad} style={card({ display: 'flex', alignItems: 'center', gap: 16 })}>
                    <div style={{
                      minWidth: 48, height: 48, borderRadius: 10,
                      background: t.durum === 'Tamamlandı' ? '#22C55E22' : '#F59E0B22',
                      border: `1px solid ${t.durum === 'Tamamlandı' ? '#22C55E44' : '#F59E0B44'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                    }}>
                      {t.durum === 'Tamamlandı' ? '✓' : '📅'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#fff', fontSize: 14 }}>{t.ad}</div>
                      <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                        {t.tur} · {t.katilimci} katılımcı
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, color: '#94A3B8' }}>{new Date(t.tarih).toLocaleDateString('tr-TR')}</div>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, marginTop: 4, display: 'inline-block',
                        background: t.durum === 'Tamamlandı' ? '#22C55E22' : '#F59E0B22',
                        color: t.durum === 'Tamamlandı' ? '#22C55E' : '#F59E0B',
                        border: `1px solid ${t.durum === 'Tamamlandı' ? '#22C55E44' : '#F59E0B44'}`,
                      }}>{t.durum}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 5 — Risk Haritası (tesis listesi) */}
            {aktifTab === 5 && (
              <div>
                {tesisler.length === 0 ? (
                  <div style={card({ textAlign: 'center', padding: 48, color: '#64748B' })}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>🗺️</div>
                    <div style={{ fontWeight: 600, color: '#94A3B8' }}>Tesis kaydı bulunamadı.</div>
                    <div style={{ fontSize: 13, marginTop: 6 }}>facilities tablosuna veri ekleyin.</div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: 13, color: '#64748B', marginBottom: 14 }}>{tesisler.length} tesis bulundu</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                      {tesisler.map(t => (
                        <div key={t.id} style={card()}>
                          <div style={{ fontWeight: 600, color: '#fff', fontSize: 14, marginBottom: 6 }}>{t.name}</div>
                          <div style={{ fontSize: 12, color: '#64748B' }}>{t.type ?? '—'} · {t.city ?? '—'}</div>
                          <div style={{ marginTop: 10 }}>
                            <span style={{
                              fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                              background: '#22C55E22', color: '#22C55E', border: '1px solid #22C55E44',
                            }}>{t.status ?? 'Aktif'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
