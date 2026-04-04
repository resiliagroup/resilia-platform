'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

const SUPA_URL = 'https://gqguwgbopgnpwzjwcexl.supabase.co'
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5OTgzMywiZXhwIjoyMDg4OTc1ODMzfQ.Ku-JRx8JFH5a3SIj7sGP_Dy_nM89NMMW34gPyxVO_qI'

function uriToAdis(u: number) { return Math.round(200 + (u/100)*1000) }
function adisLabel(a: number) { return a<450?'Kritik Risk':a<650?'Yüksek Risk':a<850?'Orta Risk':a<1050?'İyi':'Güçlü' }
function adisRenk(a: number)  { return a<450?'#C0392B':a<650?'#E67E22':a<850?'#D4AC0D':a<1050?'#27AE60':'#1E8449' }
function boyutRenk(b: number) { return b<40?'#E74C3C':b<60?'#E67E22':b<75?'#F1C40F':'#27AE60' }

interface FormData {
  tesis_adi: string; nace_kodu: string; ilce: string
  uri_skoru: number; gonderim_tarihi: string; envanter: Record<string,unknown>; puanlar: Record<string,number>
}
interface Cozum { baslik:string; aciklama:string; tahmini_sure:string; maliyet_seviyesi:string; mevzuat_ref:string[] }

export default function RaporPage() {
  const { token } = useParams<{token:string}>()
  const [form, setForm] = useState<FormData|null>(null)
  const [cozumler, setCozumler] = useState<Cozum[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)

  useEffect(() => {
    async function yukle() {
      try {
        const h = { apikey: SUPA_KEY }
        const r1 = await fetch(`${SUPA_URL}/rest/v1/iso_tesis_formlari?token=eq.${token}&select=*&limit=1`, { headers: h })
        const forms = await r1.json()
        if (!forms[0]) return
        setForm(forms[0])
        const r2 = await fetch(`${SUPA_URL}/rest/v1/cozum_bankasi?aktif=eq.true&order=oncelik.asc&limit=5&select=baslik,aciklama,tahmini_sure,maliyet_seviyesi,mevzuat_ref`, { headers: h })
        const c = await r2.json()
        if (Array.isArray(c)) setCozumler(c)
      } catch(e) { console.error(e) }
      finally { setYukleniyor(false) }
    }
    yukle()
  }, [token])

  useEffect(() => {
    if (form) { document.title = `ADİS Raporu — ${form.tesis_adi}`; setTimeout(() => window.print(), 1000) }
  }, [form])

  if (yukleniyor) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',fontFamily:'Arial',color:'#64748B'}}>Rapor hazırlanıyor...</div>
  if (!form) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',fontFamily:'Arial',color:'#E74C3C'}}>Rapor verisi bulunamadı.</div>

  const adis   = uriToAdis(form.uri_skoru)
  const aRenk  = adisRenk(adis)
  const aLabel = adisLabel(adis)
  const tarih  = new Date(form.gonderim_tarihi).toLocaleDateString('tr-TR',{day:'2-digit',month:'long',year:'numeric'})

  // Boyut puanları — İnsan/Mekan/Proses/Çevre/Ekonomi kategorileri
  // Soru kodu → kategori eşleşmesi (sorular-sanayi.ts'deki kategori alanından)
  const p = form.puanlar || {}

  const KATEGORI_MAP: Record<string,string> = {
    T1:'cevre',T2:'cevre',T3:'cevre',T4:'proses',T5:'cevre',
    T6:'ekonomi',T7:'proses',T8:'proses',T9:'cevre',T10:'cevre',
    T11:'cevre',T12:'ekonomi',T13:'ekonomi',T14:'cevre',T15:'cevre',
    T16:'insan',T17:'cevre',T18:'proses',T19:'cevre',T20:'insan',
    S1:'mekan',S2:'mekan',S3:'insan',S4:'mekan',S5:'cevre',
    S6:'mekan',S7:'proses',S8:'proses',S9:'mekan',S10:'proses',
    S11:'insan',S12:'ekonomi',S13:'ekonomi',S14:'ekonomi',S15:'ekonomi',
    S16:'mekan',S17:'proses',S18:'mekan',S19:'mekan',S20:'proses',
    S21:'mekan',S22:'insan',
    Y1:'proses',Y2:'proses',Y3:'proses',Y4:'proses',Y5:'proses',
    Y6:'proses',Y7:'proses',Y8:'proses',Y9:'proses',Y10:'proses',
    Y11:'proses',Y12:'proses',Y13:'proses',Y14:'proses',Y15:'mekan',
    Y16:'mekan',Y17:'cevre',Y18:'cevre',Y19:'mekan',Y20:'cevre',
    Y21:'mekan',Y22:'mekan',Y23:'mekan',Y24:'mekan',Y25:'insan',
    Y26:'insan',Y27:'insan',Y28:'insan',Y29:'insan',Y30:'insan',
    Y31:'insan',Y32:'ekonomi',Y33:'proses',Y34:'proses',Y35:'proses',
    Y36:'proses',Y37:'proses',Y38:'ekonomi',Y39:'ekonomi',Y40:'ekonomi',
    Y41:'ekonomi',Y42:'ekonomi',Y43:'proses',Y44:'proses',Y45:'insan',
    Y46:'ekonomi',Y47:'proses',Y48:'proses',Y49:'proses',Y50:'insan',
    HRO1:'insan',HRO2:'insan',HRO3:'insan',HRO4:'proses',HRO5:'insan',
    HRO6:'proses',HRO7:'proses',HRO8:'proses',HRO9:'insan',HRO10:'proses',
    HRO11:'proses',HRO12:'insan',
  }

  function kategoriPuan(kat: string): number {
    const sorular = Object.entries(p).filter(([k]) => KATEGORI_MAP[k] === kat)
    if (!sorular.length) return 50
    const ort = sorular.reduce((s,[,v])=>s+v,0) / sorular.length
    return Math.round((ort / 5) * 100)
  }

  const boyutlar = [
    { ad:'İnsan',   ikon:'👤', puan:kategoriPuan('insan'),   agirlik:'%20', aciklama:'Çalışan güvenliği, eğitim, tahliye, psikolojik hazırlık' },
    { ad:'Mekan',   ikon:'🏭', puan:kategoriPuan('mekan'),   agirlik:'%25', aciklama:'Yapısal dayanıklılık, yangın sistemleri, kaçış yolları' },
    { ad:'Proses',  ikon:'⚙️', puan:kategoriPuan('proses'),  agirlik:'%30', aciklama:'İş sürekliliği, BCP/DRP, siber güvenlik, tedarik zinciri' },
    { ad:'Çevre',   ikon:'🌿', puan:kategoriPuan('cevre'),   agirlik:'%15', aciklama:'Doğal tehlikeler, NATECH riski, iklim uyumu' },
    { ad:'Ekonomi', ikon:'📊', puan:kategoriPuan('ekonomi'), agirlik:'%10', aciklama:'Sigorta, finansal rezerv, tedarikçi riski, mevzuat uyumu' },
  ]

  const bantlar = [
    {label:'Güçlü',   aralik:'1050–1200', renk:'#1E8449', lo:1050, hi:1200},
    {label:'İyi',     aralik:'850–1049',  renk:'#27AE60', lo:850,  hi:1049},
    {label:'Orta',    aralik:'650–849',   renk:'#D4AC0D', lo:650,  hi:849 },
    {label:'Yüksek',  aralik:'450–649',   renk:'#E67E22', lo:450,  hi:649 },
    {label:'Kritik',  aralik:'200–449',   renk:'#C0392B', lo:200,  hi:449 },
  ]

  return (
    <>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:Arial,Helvetica,sans-serif;background:white;color:#2C3E50;font-size:11px;}
        @page{size:A4;margin:12mm 14mm;}
        @media print{.no-print{display:none!important;}body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
        .page{max-width:780px;margin:0 auto;padding:16px;}
        table{border-collapse:collapse;width:100%;}
        td,th{padding:5px 8px;vertical-align:top;}
      `}</style>

      {/* EKRAN BUTONU */}
      <div className="no-print" style={{background:'#1a2942',padding:'10px 20px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{color:'#009B8D',fontWeight:700,fontSize:13}}>ADİS Dayanıklılık Raporu — Önizleme</div>
        <button onClick={()=>window.print()} style={{background:'#009B8D',color:'white',border:'none',borderRadius:6,padding:'7px 18px',fontWeight:700,cursor:'pointer',fontSize:12}}>
          ⬇ PDF Olarak Kaydet
        </button>
      </div>

      <div className="page">

        {/* ══ HEADER — Findeks tarzı ══ */}
        <table style={{marginBottom:12}}>
          <tbody><tr>
            <td style={{padding:0,width:'60%'}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
                <div style={{background:'#009B8D',color:'white',fontWeight:900,fontSize:15,padding:'4px 10px',borderRadius:4,letterSpacing:1}}>ADİS</div>
                <div>
                  <div style={{fontSize:18,fontWeight:900,color:'#1a2942',letterSpacing:'-0.3px'}}>DAYANIKLILIK RAPORU</div>
                  <div style={{fontSize:9,color:'#7F8C8D'}}>Afet Dayanıklılık İndeksi Sistemi — Tesis Değerlendirme Belgesi</div>
                </div>
              </div>
            </td>
            <td style={{padding:0,textAlign:'right'}}>
              <table style={{width:'auto',marginLeft:'auto'}}>
                <tbody>
                  <tr>
                    <td style={{fontSize:8,color:'#7F8C8D',padding:'1px 6px'}}>TESİS ADI / NACE</td>
                    <td style={{fontSize:8,color:'#7F8C8D',padding:'1px 6px'}}>RAPOR TARİHİ</td>
                    <td style={{fontSize:8,color:'#7F8C8D',padding:'1px 6px'}}>REFERANS KODU</td>
                  </tr>
                  <tr>
                    <td style={{fontWeight:700,fontSize:10,color:'#1a2942',padding:'1px 6px'}}>{form.tesis_adi}<br/><span style={{fontWeight:400,color:'#7F8C8D'}}>{form.nace_kodu||'—'}</span></td>
                    <td style={{fontWeight:700,fontSize:10,color:'#1a2942',padding:'1px 6px'}}>{tarih}</td>
                    <td style={{fontWeight:700,fontSize:10,color:'#1a2942',padding:'1px 6px',fontFamily:'Courier'}}>{token.slice(0,12).toUpperCase()}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr></tbody>
        </table>

        {/* Altın çizgi */}
        <div style={{height:3,background:`linear-gradient(90deg, ${aRenk}, #009B8D)`,borderRadius:2,marginBottom:16}}/>

        {/* ══ SKOR BÖLÜMÜ — Findeks tarzı ══ */}
        <table style={{marginBottom:14}}>
          <tbody><tr>
            {/* Sol: Büyük skor */}
            <td style={{width:'38%',background:'#F8F9FA',border:'1px solid #E5E8EC',borderRadius:8,padding:'16px 20px',textAlign:'center'}}>
              <div style={{fontSize:9,fontWeight:700,color:'#7F8C8D',letterSpacing:'0.12em',marginBottom:6}}>ADİS DAYANIKLILIK SKORU</div>
              <div style={{fontSize:68,fontWeight:900,color:aRenk,lineHeight:1,fontFamily:'Arial',marginBottom:4}}>{adis}</div>
              <div style={{fontSize:12,color:'#7F8C8D',marginBottom:10}}>/ 1200</div>
              <div style={{display:'inline-block',background:aRenk,color:'white',borderRadius:20,padding:'5px 18px',fontSize:12,fontWeight:700,marginBottom:12}}>{aLabel}</div>
              {/* Progress bar */}
              <div style={{height:10,background:'#E5E8EC',borderRadius:5,overflow:'hidden',marginBottom:6}}>
                <div style={{height:'100%',width:`${((adis-200)/1000)*100}%`,background:aRenk,borderRadius:5}}/>
              </div>
              <div style={{fontSize:8,color:'#7F8C8D'}}>200 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 1200</div>
            </td>

            {/* Orta: Bant tablosu — Findeks tarzı */}
            <td style={{width:'32%',padding:'0 12px'}}>
              <div style={{fontSize:9,fontWeight:700,color:'#7F8C8D',letterSpacing:'0.1em',marginBottom:8}}>SKOR BANTLARI</div>
              {bantlar.map(b=>{
                const aktif = adis>=b.lo && adis<=b.hi
                return (
                  <div key={b.label} style={{display:'flex',alignItems:'center',gap:6,marginBottom:5,padding:'4px 8px',background:aktif?b.renk+'18':'transparent',borderRadius:4,border:aktif?`1.5px solid ${b.renk}`:'1px solid transparent'}}>
                    <div style={{width:10,height:10,borderRadius:2,background:b.renk,flexShrink:0}}/>
                    <div style={{flex:1,fontSize:10,fontWeight:aktif?700:400,color:aktif?b.renk:'#2C3E50'}}>{b.label}</div>
                    <div style={{fontSize:9,color:'#7F8C8D',fontFamily:'Courier'}}>{b.aralik}</div>
                  </div>
                )
              })}
              <div style={{marginTop:10,fontSize:8,color:'#7F8C8D',lineHeight:1.5}}>
                URI Skoru: <b>{Math.round(form.uri_skoru)}</b>/100<br/>
                Metodoloji: HIFYEA<br/>
                ISO 31000 · ISO 22301 · AFAD
              </div>
            </td>

            {/* Sağ: Boyut bileşenleri — Findeks pasta tarzı */}
            <td style={{width:'30%',padding:'0 0 0 8px'}}>
              <div style={{fontSize:9,fontWeight:700,color:'#7F8C8D',letterSpacing:'0.1em',marginBottom:8}}>DEĞERLENDİRME BİLEŞENLERİ</div>
              {boyutlar.map(b=>(
                <div key={b.kod} style={{marginBottom:6}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}>
                    <span style={{fontSize:9,color:'#2C3E50',fontWeight:500}}>{b.ad}</span>
                    <span style={{fontSize:9,fontWeight:700,color:boyutRenk(b.puan)}}>{b.agirlik}</span>
                  </div>
                  <div style={{height:6,background:'#E5E8EC',borderRadius:3,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${b.puan}%`,background:boyutRenk(b.puan),borderRadius:3}}/>
                  </div>
                </div>
              ))}
            </td>
          </tr></tbody>
        </table>

        <div style={{height:1,background:'#E5E8EC',marginBottom:14}}/>

        {/* ══ TESİS BİLGİLERİ — Findeks kart tarzı ══ */}
        <div style={{fontSize:9,fontWeight:700,color:'#7F8C8D',letterSpacing:'0.12em',marginBottom:8}}>TESİS BİLGİLERİ</div>
        <table style={{background:'#F8F9FA',border:'1px solid #E5E8EC',borderRadius:6,marginBottom:14}}>
          <tbody>
            <tr>
              <td style={{fontSize:8,color:'#7F8C8D',fontWeight:700,width:'16%',borderBottom:'1px solid #E5E8EC'}}>TESİS ADI</td>
              <td style={{fontSize:10,fontWeight:700,color:'#1a2942',borderBottom:'1px solid #E5E8EC'}}>{form.tesis_adi}</td>
              <td style={{fontSize:8,color:'#7F8C8D',fontWeight:700,width:'16%',borderBottom:'1px solid #E5E8EC'}}>NACE KODU</td>
              <td style={{fontSize:10,fontWeight:700,color:'#1a2942',borderBottom:'1px solid #E5E8EC'}}>{form.nace_kodu||'—'}</td>
              <td style={{fontSize:8,color:'#7F8C8D',fontWeight:700,width:'16%',borderBottom:'1px solid #E5E8EC'}}>İLÇE</td>
              <td style={{fontSize:10,fontWeight:700,color:'#1a2942',borderBottom:'1px solid #E5E8EC'}}>{form.ilce||'İstanbul'}</td>
            </tr>
            <tr>
              <td style={{fontSize:8,color:'#7F8C8D',fontWeight:700}}>ÇALIŞAN SAYISI</td>
              <td style={{fontSize:10,fontWeight:700,color:'#1a2942'}}>{form.envanter?.E10 ? `${form.envanter.E10} kişi` : '—'}</td>
              <td style={{fontSize:8,color:'#7F8C8D',fontWeight:700}}>BİNA YAŞI</td>
              <td style={{fontSize:10,fontWeight:700,color:'#1a2942'}}>{form.envanter?.E16 ? `${form.envanter.E16} yıl` : '—'}</td>
              <td style={{fontSize:8,color:'#7F8C8D',fontWeight:700}}>ZEMİN SINIFI</td>
              <td style={{fontSize:10,fontWeight:700,color:'#1a2942'}}>{(form.envanter?.E26 as string)||'—'}</td>
            </tr>
          </tbody>
        </table>

        {/* ══ AKSİYON PLANI — Findeks kredi detayı tarzı ══ */}
        <div style={{fontSize:9,fontWeight:700,color:'#7F8C8D',letterSpacing:'0.12em',marginBottom:8}}>ÖNCELİKLİ AKSİYON PLANI</div>
        {cozumler.map((c,i)=>{
          const maliyetRenk = c.maliyet_seviyesi==='ucretsiz'?'#27AE60':c.maliyet_seviyesi==='dusuk'?'#009B8D':'#E67E22'
          const maliyetLabel = c.maliyet_seviyesi==='ucretsiz'?'Ücretsiz':c.maliyet_seviyesi==='dusuk'?'Düşük Maliyet':'Orta Maliyet'
          return (
            <div key={i} style={{border:'1px solid #E5E8EC',borderLeft:`4px solid ${maliyetRenk}`,borderRadius:4,padding:'8px 12px',marginBottom:8,background:'#FAFAFA'}}>
              <table><tbody><tr>
                <td style={{width:22,padding:'0 8px 0 0',verticalAlign:'middle'}}>
                  <div style={{background:'#1a2942',color:'white',borderRadius:3,width:18,height:18,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700}}>{i+1}</div>
                </td>
                <td style={{padding:0}}>
                  <div style={{fontWeight:700,fontSize:11,color:'#1a2942',marginBottom:3}}>{c.baslik}</div>
                  <div style={{fontSize:9,color:'#5D6D7E',lineHeight:1.5,marginBottom:4}}>{c.aciklama?.slice(0,140)}{(c.aciklama?.length||0)>140?'…':''}</div>
                  <div style={{display:'flex',gap:16,fontSize:8}}>
                    <span style={{color:'#7F8C8D'}}>⏱ {c.tahmini_sure}</span>
                    <span style={{fontWeight:700,color:maliyetRenk}}>{maliyetLabel}</span>
                    {c.mevzuat_ref?.[0]&&<span style={{color:'#7F8C8D'}}>{c.mevzuat_ref[0]}</span>}
                  </div>
                </td>
              </tr></tbody></table>
            </div>
          )
        })}

        <div style={{height:1,background:'#E5E8EC',margin:'12px 0'}}/>

        {/* ══ AÇIKLAMA METNİ — Findeks alt metin tarzı ══ */}
        <div style={{background:'#F8F9FA',border:'1px solid #E5E8EC',borderRadius:6,padding:'10px 14px',marginBottom:12}}>
          <div style={{fontSize:9,fontWeight:700,color:'#1a2942',marginBottom:6}}>ADİS Dayanıklılık Skoru Nedir?</div>
          <div style={{fontSize:8,color:'#5D6D7E',lineHeight:1.6}}>
            ADİS Skoru, sanayi tesislerinin afet ve iş sürekliliği risklerini sayısallaştıran, Türkiye&apos;nin ilk sektörel dayanıklılık derecelendirme sistemidir. 
            200 ile 1200 arasında yer alır; 200 en riskli, 1200 en dayanıklı düzeyi ifade eder. 
            Skor; tehlike analizi, kırılganlık, kapasite, HRO olgunluğu ve destek kapasitesi bileşenlerinin ağırlıklı ortalamasından oluşur. 
            ISO 22301, ISO 31000, AFAD AADY 2025 ve 6331 sayılı İSG Kanunu esas alınmıştır.
          </div>
          <div style={{fontSize:8,color:'#5D6D7E',lineHeight:1.6,marginTop:6}}>
            ADİS Skoru yalnızca bilgilendirme amaçlıdır; hukuki bağlayıcılığı bulunmamaktadır. 
            Rapor içeriğindeki hatalardan Omniversel sorumlu tutulamaz. 
            Yüksek ADİS skoru; kredi, sigorta ve hibe başvurularında kurumların değerlendirme süreçlerinde referans alınabilir.
          </div>
        </div>

        {/* ══ FOOTER ══ */}
        <table>
          <tbody><tr>
            <td style={{padding:0}}>
              <div style={{fontSize:9,fontWeight:700,color:'#009B8D'}}>OMNIVERSEL — Urban Resilience Platform</div>
              <div style={{fontSize:8,color:'#7F8C8D'}}>İTÜ Afet Yönetimi Araştırma ve Uygulama Merkezi (İTÜ-AYM) Akademik İş Birliği ile geliştirilmiştir.</div>
              <div style={{fontSize:8,color:'#7F8C8D'}}>omniversel.com  •  info@omniversel.com  •  İstanbul, Türkiye</div>
            </td>
            <td style={{padding:0,textAlign:'right'}}>
              <div style={{fontSize:8,color:'#7F8C8D'}}>Bu rapor ADİS metodolojisi ile otomatik üretilmiştir.</div>
              <div style={{fontSize:8,color:'#7F8C8D'}}>Sayfa 1 / 1</div>
              <div style={{fontSize:9,fontWeight:700,color:'#1a2942',fontFamily:'Courier',marginTop:2}}>{token.slice(0,16).toUpperCase()}</div>
            </td>
          </tr></tbody>
        </table>

      </div>
    </>
  )
}
