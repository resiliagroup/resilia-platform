'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

const SUPA_URL = 'https://gqguwgbopgnpwzjwcexl.supabase.co'
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5OTgzMywiZXhwIjoyMDg4OTc1ODMzfQ.Ku-JRx8JFH5a3SIj7sGP_Dy_nM89NMMW34gPyxVO_qI'

function uriToAdis(uri: number) { return Math.round(200 + (uri / 100) * 1000) }
function adisLabel(a: number) { return a<450?'Kritik Risk':a<650?'Yüksek Risk':a<850?'Orta Risk':a<1050?'İyi':'Güçlü' }
function adisRenk(a: number) { return a<450?'#C03928':a<650?'#C05800':a<850?'#8B7000':a<1050?'#1A6B2E':'#0F5020' }
function adisBg(a: number) { return a<450?'#FEF2F2':a<650?'#FFF7ED':a<850?'#FEFCE8':a<1050?'#F0FDF4':'#ECFDF5' }

interface TesisData {
  name: string
  address: string
  sector: string
  employee_count: number
  nace_kodu?: string
  uri_score: number
  created_at: string
  cozumler: {baslik: string; aciklama: string; tahmini_sure: string; maliyet_seviyesi: string; uri_iyilesmesi: number; mevzuat_ref: string[]}[]
}

export default function RaporPage() {
  const { token } = useParams<{ token: string }>()
  const [data, setData] = useState<TesisData | null>(null)
  const [yukleniyor, setYukleniyor] = useState(true)

  useEffect(() => {
    async function yukle() {
      try {
        // Token → form
        const r1 = await fetch(`${SUPA_URL}/rest/v1/iso_forms?token=eq.${token}&select=*&limit=1`, {
          headers: { apikey: SUPA_KEY }
        })
        const forms = await r1.json()
        const form = forms[0]
        if (!form) return

        // Facility
        let tesis = { name: form.company_name || 'Tesis', address: form.address || '', sector: form.sector || '', employee_count: form.employee_count || 0, nace_kodu: form.nace_kodu }

        if (form.facility_id) {
          const r2 = await fetch(`${SUPA_URL}/rest/v1/facilities?id=eq.${form.facility_id}&select=name,address,sector,employee_count,extra_data&limit=1`, {
            headers: { apikey: SUPA_KEY }
          })
          const facs = await r2.json()
          if (facs[0]) {
            tesis = { ...tesis, ...facs[0], nace_kodu: facs[0].extra_data?.nace_kodu || form.nace_kodu }
          }
        }

        // Assessment → uri_score
        let uri_score = 37
        if (form.facility_id) {
          const r3 = await fetch(`${SUPA_URL}/rest/v1/assessments?facility_id=eq.${form.facility_id}&select=uri_score&order=created_at.desc&limit=1`, {
            headers: { apikey: SUPA_KEY }
          })
          const ass = await r3.json()
          if (ass[0]?.uri_score) uri_score = ass[0].uri_score
        }

        // Çözümler
        const r4 = await fetch(`${SUPA_URL}/rest/v1/cozum_bankasi?aktif=eq.true&order=oncelik.asc&limit=5&select=baslik,aciklama,tahmini_sure,maliyet_seviyesi,uri_iyilesmesi,mevzuat_ref`, {
          headers: { apikey: SUPA_KEY }
        })
        const cozumler = await r4.json()

        setData({ ...tesis, uri_score, created_at: form.created_at, cozumler: cozumler || [] })
      } catch (e) {
        console.error(e)
      } finally {
        setYukleniyor(false)
      }
    }
    yukle()
  }, [token])

  useEffect(() => {
    if (data) {
      document.title = `ADİS Raporu — ${data.name}`
      setTimeout(() => window.print(), 800)
    }
  }, [data])

  if (yukleniyor) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'Arial' }}>
      <p style={{ color: '#64748B' }}>Rapor hazırlanıyor...</p>
    </div>
  )

  if (!data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'Arial' }}>
      <p style={{ color: '#EF4444' }}>Rapor verisi bulunamadı.</p>
    </div>
  )

  const adis = uriToAdis(data.uri_score)
  const aRenk = adisRenk(adis)
  const aBg = adisBg(adis)
  const aLabel = adisLabel(adis)
  const tarih = new Date(data.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; background: white; color: #1F2937; }
        @page { size: A4; margin: 15mm 18mm; }
        @media print {
          .no-print { display: none !important; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        .page { max-width: 794px; margin: 0 auto; padding: 20px; }
      `}</style>

      {/* Print butonu — ekranda görünür, print'te gizlenir */}
      <div className="no-print" style={{ background: '#0A1628', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#009B8D', fontWeight: 700, fontSize: 14 }}>ADİS Rapor Önizleme</span>
        <button onClick={() => window.print()} style={{ background: '#009B8D', color: 'white', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>
          PDF Olarak Kaydet
        </button>
      </div>

      <div className="page">

        {/* KAPAK BAŞLIK */}
        <div style={{ borderBottom: '3px solid #0A1628', paddingBottom: 16, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#009B8D', letterSpacing: '0.15em', marginBottom: 4 }}>İSTANBUL SANAYİ ODASI × OMNİVERSEL</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#0A1628', letterSpacing: '-0.5px' }}>ADİS DAYANIKLILIK RAPORU</div>
            <div style={{ fontSize: 10, color: '#64748B', marginTop: 4 }}>Afet Dayanıklılık İndeksi Sistemi — Tesis Değerlendirme Belgesi</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 9, color: '#94A3B8' }}>Rapor Tarihi</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#374151' }}>{tarih}</div>
            <div style={{ fontSize: 9, color: '#94A3B8', marginTop: 4 }}>Referans No</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#374151', fontFamily: 'Courier' }}>{token}</div>
          </div>
        </div>

        {/* TESİS BİLGİSİ */}
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '14px 18px', marginBottom: 20 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.12em', marginBottom: 8 }}>TESİS BİLGİLERİ</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px 20px' }}>
            {[
              ['Tesis Adı', data.name],
              ['Sektör', data.sector],
              ['Çalışan Sayısı', data.employee_count ? `${data.employee_count} kişi` : '—'],
              ['NACE Kodu', data.nace_kodu || '—'],
              ['Adres', data.address || '—'],
            ].map(([label, value]) => (
              <div key={label}>
                <div style={{ fontSize: 8, color: '#94A3B8', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 11, color: '#1F2937', fontWeight: 600 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ADİS SKORU */}
        <div style={{ background: aBg, border: `2px solid ${aRenk}`, borderRadius: 10, padding: '18px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ textAlign: 'center', minWidth: 120 }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.12em', marginBottom: 4 }}>ADİS SKORU</div>
            <div style={{ fontSize: 52, fontWeight: 900, color: aRenk, lineHeight: 1, fontFamily: 'Courier' }}>{adis}</div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>/ 1200</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'inline-block', background: aRenk, color: 'white', borderRadius: 20, padding: '4px 14px', fontSize: 12, fontWeight: 700, marginBottom: 10 }}>{aLabel}</div>
            <div style={{ height: 8, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
              <div style={{ height: '100%', width: `${((adis-200)/1000)*100}%`, background: aRenk, borderRadius: 4 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 4 }}>
              {[['200-449','Kritik','#C03928'],['450-649','Yüksek','#C05800'],['650-849','Orta','#8B7000'],['850-1049','İyi','#1A6B2E'],['1050-1200','Güçlü','#0F5020']].map(([r,l,c]) => (
                <div key={r} style={{ background: adis >= parseInt(r) && adis <= parseInt(r.split('-')[1]) ? c+'22' : '#F1F5F9', border: `1px solid ${c}44`, borderRadius: 4, padding: '3px 4px', textAlign: 'center' }}>
                  <div style={{ fontSize: 8, fontWeight: 700, color: c }}>{l}</div>
                  <div style={{ fontSize: 7, color: '#94A3B8' }}>{r}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8, fontSize: 9, color: '#64748B' }}>URI Skoru: {Math.round(data.uri_score)} / 100 &nbsp;•&nbsp; Metodoloji: HIFYEA (ISO 31000 + ISO 22301 + AFAD)</div>
          </div>
        </div>

        {/* ÖNERİLEN AKSİYONLAR */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#0A1628', marginBottom: 10, paddingBottom: 6, borderBottom: '1px solid #E2E8F0' }}>ÖNCELİKLİ İYİLEŞTİRME AKSİYONLARI</div>
          {data.cozumler.slice(0, 4).map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10, padding: '10px 12px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderLeft: `3px solid ${c.maliyet_seviyesi==='ucretsiz'?'#22C55E':c.maliyet_seviyesi==='dusuk'?'#009B8D':'#F97316'}`, borderRadius: 6 }}>
              <div style={{ background: '#0A1628', color: 'white', borderRadius: 4, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i+1}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#0A1628', marginBottom: 3 }}>{c.baslik}</div>
                <div style={{ fontSize: 9, color: '#64748B', lineHeight: 1.4, marginBottom: 4 }}>{c.aciklama?.slice(0, 120)}{c.aciklama?.length > 120 ? '...' : ''}</div>
                <div style={{ display: 'flex', gap: 12, fontSize: 9 }}>
                  <span style={{ color: '#64748B' }}>⏱ {c.tahmini_sure}</span>
                  <span style={{ color: c.maliyet_seviyesi==='ucretsiz'?'#15803D':'#374151', fontWeight: 600 }}>{c.maliyet_seviyesi === 'ucretsiz' ? 'Ücretsiz' : c.maliyet_seviyesi === 'dusuk' ? 'Düşük Maliyet' : 'Orta Maliyet'}</span>
                  {c.mevzuat_ref?.[0] && <span style={{ color: '#94A3B8' }}>{c.mevzuat_ref[0]}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* YASAL DAYANAK */}
        <div style={{ background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: 8, padding: '12px 16px', marginBottom: 20 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: '#3730A3', letterSpacing: '0.1em', marginBottom: 6 }}>YASAL DAYANAK VE METODOLOJI</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 20px', fontSize: 9, color: '#4338CA' }}>
            {['ISO 22301:2019+A1:2024 — İş Sürekliliği Yönetimi', 'ISO 31000:2018 — Risk Yönetimi', 'AFAD AADY 2025 — Afet Acil Durum Yönetim Planı', '6331 Sayılı İSG Kanunu — Acil Durum Planlaması', 'BYKHY — Binaların Yangından Korunması Yönetmeliği', 'Sendai Framework 2015-2030 — Afet Risk Azaltma'].map(m => (
              <div key={m} style={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
                <span style={{ color: '#6366F1', flexShrink: 0 }}>•</span>
                <span>{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ borderTop: '2px solid #0A1628', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#009B8D' }}>OMNIVERSEL — Urban Resilience Platform</div>
            <div style={{ fontSize: 8, color: '#94A3B8' }}>İTÜ Afet Yönetimi Araştırma ve Uygulama Merkezi (İTÜ-AYM) Akademik İş Birliği</div>
            <div style={{ fontSize: 8, color: '#94A3B8' }}>omniversel.com &nbsp;•&nbsp; info@omniversel.com</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 8, color: '#94A3B8' }}>Bu rapor ADİS metodolojisi ile üretilmiştir.</div>
            <div style={{ fontSize: 8, color: '#94A3B8' }}>Yalnızca bilgilendirme amaçlıdır, hukuki bağlayıcılığı yoktur.</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#374151', fontFamily: 'Courier', marginTop: 2 }}>{token}</div>
          </div>
        </div>

      </div>
    </>
  )
}
