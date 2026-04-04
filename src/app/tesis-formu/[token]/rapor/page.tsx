'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

const SUPA_URL = 'https://gqguwgbopgnpwzjwcexl.supabase.co'
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5OTgzMywiZXhwIjoyMDg4OTc1ODMzfQ.Ku-JRx8JFH5a3SIj7sGP_Dy_nM89NMMW34gPyxVO_qI'

function uriToAdis(uri: number) { return Math.round(200 + (uri / 100) * 1000) }
function adisLabel(a: number) { return a<450?'Kritik Risk':a<650?'Yüksek Risk':a<850?'Orta Risk':a<1050?'İyi':'Güçlü' }
function adisRenk(a: number) { return a<450?'#C03928':a<650?'#C05800':a<850?'#8B7000':a<1050?'#1A6B2E':'#0F5020' }
function adisBg(a: number)   { return a<450?'#FEF2F2':a<650?'#FFF7ED':a<850?'#FEFCE8':a<1050?'#F0FDF4':'#ECFDF5' }

interface FormData {
  tesis_adi: string
  nace_kodu: string
  ilce: string
  uri_skoru: number
  gonderim_tarihi: string
  facility_id: string | null
  envanter: Record<string, unknown>
}
interface Cozum {
  baslik: string; aciklama: string; tahmini_sure: string
  maliyet_seviyesi: string; mevzuat_ref: string[]
}

export default function RaporPage() {
  const { token } = useParams<{ token: string }>()
  const [form, setForm] = useState<FormData | null>(null)
  const [cozumler, setCozumler] = useState<Cozum[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)

  useEffect(() => {
    async function yukle() {
      try {
        const h = { apikey: SUPA_KEY }

        // Form verisi
        const r1 = await fetch(
          `${SUPA_URL}/rest/v1/iso_tesis_formlari?token=eq.${token}&select=*&limit=1`,
          { headers: h }
        )
        const forms = await r1.json()
        if (!forms[0]) return
        setForm(forms[0])

        // Çözümler
        const r2 = await fetch(
          `${SUPA_URL}/rest/v1/cozum_bankasi?aktif=eq.true&order=oncelik.asc&limit=4&select=baslik,aciklama,tahmini_sure,maliyet_seviyesi,mevzuat_ref`,
          { headers: h }
        )
        const c = await r2.json()
        if (Array.isArray(c)) setCozumler(c)
      } catch(e) {
        console.error(e)
      } finally {
        setYukleniyor(false)
      }
    }
    yukle()
  }, [token])

  useEffect(() => {
    if (form) {
      document.title = `ADİS Raporu — ${form.tesis_adi}`
      setTimeout(() => window.print(), 900)
    }
  }, [form])

  if (yukleniyor) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', fontFamily:'Arial' }}>
      <p style={{ color:'#64748B' }}>Rapor hazırlanıyor...</p>
    </div>
  )
  if (!form) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', fontFamily:'Arial' }}>
      <p style={{ color:'#EF4444' }}>Rapor verisi bulunamadı.</p>
    </div>
  )

  const adis   = uriToAdis(form.uri_skoru)
  const aRenk  = adisRenk(adis)
  const aBg    = adisBg(adis)
  const aLabel = adisLabel(adis)
  const tarih  = new Date(form.gonderim_tarihi).toLocaleDateString('tr-TR', { day:'2-digit', month:'long', year:'numeric' })
  const adres  = form.ilce ? `${form.ilce}, İstanbul` : 'İstanbul'
  const calisanSayisi = form.envanter?.E10 ? `${form.envanter.E10} kişi` : '—'

  return (
    <>
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:Arial,sans-serif; background:white; color:#1F2937; }
        @page { size:A4; margin:14mm 16mm; }
        @media print {
          .no-print { display:none !important; }
          body { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
        }
        .page { max-width:794px; margin:0 auto; padding:20px; }
      `}</style>

      <div className="no-print" style={{ background:'#0A1628', padding:'12px 24px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ color:'#009B8D', fontWeight:700, fontSize:14 }}>ADİS Rapor Önizleme — {form.tesis_adi}</span>
        <button onClick={() => window.print()} style={{ background:'#009B8D', color:'white', border:'none', borderRadius:8, padding:'8px 20px', fontWeight:600, cursor:'pointer', fontSize:13 }}>
          PDF Olarak Kaydet
        </button>
      </div>

      <div className="page">

        {/* BAŞLIK */}
        <div style={{ borderBottom:'3px solid #0A1628', paddingBottom:14, marginBottom:18, display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, color:'#009B8D', letterSpacing:'0.15em', marginBottom:4 }}>İSTANBUL SANAYİ ODASI × OMNİVERSEL</div>
            <div style={{ fontSize:22, fontWeight:900, color:'#0A1628', letterSpacing:'-0.5px' }}>ADİS DAYANIKLILIK RAPORU</div>
            <div style={{ fontSize:10, color:'#64748B', marginTop:3 }}>Afet Dayanıklılık İndeksi Sistemi — Tesis Değerlendirme Belgesi</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:9, color:'#94A3B8' }}>Rapor Tarihi</div>
            <div style={{ fontSize:11, fontWeight:700, color:'#374151' }}>{tarih}</div>
            <div style={{ fontSize:9, color:'#94A3B8', marginTop:4 }}>Referans No</div>
            <div style={{ fontSize:10, fontWeight:700, color:'#374151', fontFamily:'Courier' }}>{token}</div>
          </div>
        </div>

        {/* TESİS BİLGİSİ */}
        <div style={{ background:'#F8FAFC', border:'1px solid #E2E8F0', borderRadius:8, padding:'12px 16px', marginBottom:18 }}>
          <div style={{ fontSize:9, fontWeight:700, color:'#94A3B8', letterSpacing:'0.12em', marginBottom:8 }}>TESİS BİLGİLERİ</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px 20px' }}>
            {[
              ['Tesis Adı', form.tesis_adi || '—'],
              ['NACE Kodu', form.nace_kodu || '—'],
              ['Çalışan Sayısı', calisanSayisi],
              ['Konum', adres],
              ['Bina Yaşı', form.envanter?.E16 ? `${form.envanter.E16} yıl` : '—'],
              ['Zemin Sınıfı', (form.envanter?.E26 as string) || '—'],
            ].map(([l, v]) => (
              <div key={l}>
                <div style={{ fontSize:8, color:'#94A3B8', fontWeight:700, letterSpacing:'0.1em', marginBottom:2 }}>{l}</div>
                <div style={{ fontSize:11, color:'#1F2937', fontWeight:600 }}>{v as string}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ADİS SKORU */}
        <div style={{ background:aBg, border:`2px solid ${aRenk}`, borderRadius:10, padding:'16px 20px', marginBottom:18, display:'flex', alignItems:'center', gap:20 }}>
          <div style={{ textAlign:'center', minWidth:110 }}>
            <div style={{ fontSize:9, fontWeight:700, color:'#94A3B8', letterSpacing:'0.12em', marginBottom:4 }}>ADİS SKORU</div>
            <div style={{ fontSize:56, fontWeight:900, color:aRenk, lineHeight:1, fontFamily:'Courier' }}>{adis}</div>
            <div style={{ fontSize:11, color:'#94A3B8' }}>/ 1200</div>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:'inline-block', background:aRenk, color:'white', borderRadius:20, padding:'4px 14px', fontSize:12, fontWeight:700, marginBottom:8 }}>{aLabel}</div>
            <div style={{ height:8, background:'#E2E8F0', borderRadius:4, overflow:'hidden', marginBottom:8 }}>
              <div style={{ height:'100%', width:`${((adis-200)/1000)*100}%`, background:aRenk, borderRadius:4 }} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:3, marginBottom:8 }}>
              {[['200–449','Kritik','#C03928'],['450–649','Yüksek','#C05800'],['650–849','Orta','#8B7000'],['850–1049','İyi','#1A6B2E'],['1050–1200','Güçlü','#0F5020']].map(([r,l,c]) => {
                const lo = parseInt(r.split('–')[0])
                const hi = parseInt(r.split('–')[1])
                const aktif = adis >= lo && adis <= hi
                return (
                  <div key={r} style={{ background: aktif ? c+'22':'#F1F5F9', border:`1px solid ${aktif?c:c+'44'}`, borderRadius:4, padding:'3px 4px', textAlign:'center' }}>
                    <div style={{ fontSize:8, fontWeight:700, color:c }}>{l}</div>
                    <div style={{ fontSize:7, color:'#94A3B8' }}>{r}</div>
                  </div>
                )
              })}
            </div>
            <div style={{ fontSize:9, color:'#64748B' }}>
              URI: {Math.round(form.uri_skoru)} / 100 &nbsp;•&nbsp; Metodoloji: HIFYEA (ISO 31000 + ISO 22301 + AFAD AADY 2025)
            </div>
          </div>
        </div>

        {/* AKSİYONLAR */}
        {cozumler.length > 0 && (
          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'#0A1628', marginBottom:8, paddingBottom:6, borderBottom:'1px solid #E2E8F0' }}>
              ÖNCELİKLİ İYİLEŞTİRME AKSİYONLARI
            </div>
            {cozumler.map((c, i) => (
              <div key={i} style={{ display:'flex', gap:10, marginBottom:8, padding:'10px 12px', background:'#F8FAFC', border:'1px solid #E2E8F0', borderLeft:`3px solid ${c.maliyet_seviyesi==='ucretsiz'?'#22C55E':c.maliyet_seviyesi==='dusuk'?'#009B8D':'#F97316'}`, borderRadius:6 }}>
                <div style={{ background:'#0A1628', color:'white', borderRadius:4, width:20, height:20, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, flexShrink:0 }}>{i+1}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'#0A1628', marginBottom:2 }}>{c.baslik}</div>
                  <div style={{ fontSize:9, color:'#64748B', lineHeight:1.4, marginBottom:3 }}>{c.aciklama?.slice(0,130)}{(c.aciklama?.length||0)>130?'…':''}</div>
                  <div style={{ display:'flex', gap:12, fontSize:9 }}>
                    <span style={{ color:'#64748B' }}>⏱ {c.tahmini_sure}</span>
                    <span style={{ fontWeight:600, color: c.maliyet_seviyesi==='ucretsiz'?'#15803D':'#374151' }}>
                      {c.maliyet_seviyesi==='ucretsiz'?'Ücretsiz':c.maliyet_seviyesi==='dusuk'?'Düşük Maliyet':'Orta Maliyet'}
                    </span>
                    {c.mevzuat_ref?.[0] && <span style={{ color:'#94A3B8' }}>{c.mevzuat_ref[0]}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* YASAL DAYANAK */}
        <div style={{ background:'#EEF2FF', border:'1px solid #C7D2FE', borderRadius:8, padding:'10px 14px', marginBottom:16 }}>
          <div style={{ fontSize:9, fontWeight:700, color:'#3730A3', letterSpacing:'0.1em', marginBottom:6 }}>YASAL DAYANAK VE METODOLOJİ</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'3px 20px', fontSize:9, color:'#4338CA' }}>
            {['ISO 22301:2019 — İş Sürekliliği Yönetimi','ISO 31000:2018 — Risk Yönetimi','AFAD AADY 2025 — Afet Acil Durum Yönetim Planı','6331 Sayılı İSG Kanunu Md.11','BYKHY — Yangından Korunma Yönetmeliği','Sendai Framework 2015-2030'].map(m => (
              <div key={m} style={{ display:'flex', gap:4 }}>
                <span style={{ color:'#6366F1', flexShrink:0 }}>•</span><span>{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ borderTop:'2px solid #0A1628', paddingTop:10, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:9, fontWeight:700, color:'#009B8D' }}>OMNIVERSEL — Urban Resilience Platform</div>
            <div style={{ fontSize:8, color:'#94A3B8' }}>İTÜ Afet Yönetimi Araştırma ve Uygulama Merkezi (İTÜ-AYM) Akademik İş Birliği</div>
            <div style={{ fontSize:8, color:'#94A3B8' }}>omniversel.com  •  info@omniversel.com</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:8, color:'#94A3B8' }}>Bu rapor ADİS metodolojisi ile üretilmiştir.</div>
            <div style={{ fontSize:8, color:'#94A3B8' }}>Yalnızca bilgilendirme amaçlıdır.</div>
            <div style={{ fontSize:9, fontWeight:700, color:'#374151', fontFamily:'Courier', marginTop:2 }}>{token}</div>
          </div>
        </div>

      </div>
    </>
  )
}
