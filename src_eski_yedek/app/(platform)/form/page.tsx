'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { SORULAR } from '@/lib/sorular'
import { SORULAR_SANAYI, SANAYI_SORU_META } from '@/lib/sorular-sanayi'
import { skorHesapla } from '@/lib/bcm-hesapla'
import { getSektorSenaryolari } from '@/lib/senaryolar'
import { mevcutKullanici, oturumKapat } from '@/lib/auth'
import { SEKTOR_ETIKET, SEKTOR_IKON, Sektor } from '@/types'
import { bolgedenOneriHesapla, bolgeRiskOzeti, IL_PROFIL } from '@/lib/bolge-profil'

export interface TesisKarti {
  yapi_yili: string; yapi_tipi: string; kat_adeti: string
  bodrum_var: boolean; bodrum_kullanim: string; alan_m2: string
  guclendirilmis: string; zemin_etut: string; yapisal_durum: string
  iskan_belgesi: string; mulk_durumu: string; kira_bitis: string
  atm_sayisi: string; atm_dis_sayisi: string; kasa_tipi: string
  jenerator_var: boolean; jenerator_kw: string
  ups_var: boolean; ups_dakika: string
  yangin_sistemi: string; guvenlik_kamera: boolean; kamera_kayit_gun: string
  erken_uyari: boolean; sigorta_var: boolean; sigorta_sirket: string
  sube_muduru: string; mudur_tel: string; mudur_email: string; kep_adresi: string
  acil_yetkili: string; acil_yetkili_tel: string
  guvenlik_sirket: string; guvenlik_tel: string
  en_yakin_hastane: string; en_yakin_itfaiye: string
  komsu_risk: string; ek_not: string
}

const TESİS_BOŞ: TesisKarti = {
  yapi_yili: '', yapi_tipi: 'betonarme', kat_adeti: '', bodrum_var: false,
  bodrum_kullanim: 'yok', alan_m2: '', guclendirilmis: 'yok',
  zemin_etut: 'yok', yapisal_durum: '3', iskan_belgesi: 'var',
  mulk_durumu: 'kira', kira_bitis: '', atm_sayisi: '', atm_dis_sayisi: '',
  kasa_tipi: 'kasa odası', jenerator_var: false, jenerator_kw: '',
  ups_var: false, ups_dakika: '', yangin_sistemi: 'algılama',
  guvenlik_kamera: true, kamera_kayit_gun: '30', erken_uyari: false,
  sigorta_var: false, sigorta_sirket: '',
  sube_muduru: '', mudur_tel: '', mudur_email: '', kep_adresi: '',
  acil_yetkili: '', acil_yetkili_tel: '',
  guvenlik_sirket: '', guvenlik_tel: '',
  en_yakin_hastane: '', en_yakin_itfaiye: '',
  komsu_risk: '', ek_not: '',
}

const getSektorSorular = (sektor: Sektor) => {
  switch (sektor) { case 'uretim': return SORULAR_SANAYI; default: return SORULAR }
}
const SEKTOR_KAYNAK: Partial<Record<Sektor, string>> = {
  uretim: `İSO AADY 2025 + İTÜ AYM HFE-360 — ${SANAYI_SORU_META.toplam} soru`,
}
const BOLUMLER = ['TEHLİKE', 'KIRILGANLIK', 'KAPASİTE'] as const
const TEAL = '#009B8D'; const NAVY = '#0A1628'; const AMBER = '#D97706'

export default function FormPage() {
  const [adim, setAdim] = useState<1|2>(1)
  const [tesis, setTesis] = useState<TesisKarti>(TESİS_BOŞ)
  const [puanlar, setPuanlar] = useState<Record<string, number>>({})
  const [senaryo, setSenaryo] = useState('')
  const [gonderiyor, setGonderiyor] = useState(false)
  const [gonderildi, setGonderildi] = useState(false)
  const [kullanici, setKullanici] = useState<ReturnType<typeof mevcutKullanici>>(null)
  const [bolgeOneri, setBolgeOneri] = useState<Record<string, number>>({})
  const [ilKodu, setIlKodu] = useState('')
  const [oneriGoster, setOneriGoster] = useState(false)
  const [tesisTamam, setTesisTamam] = useState(false)

  useEffect(() => {
    const k = mevcutKullanici()
    if (!k?.rol) { window.location.href = '/login'; return }
    setKullanici(k)
    const sns = getSektorSenaryolari(k.sektor as Sektor)
    if (sns.length) setSenaryo(sns[0].ad)
    if (k.birim_kodu) {
      const il = k.birim_kodu.substring(0, 2)
      setIlKodu(il); setBolgeOneri(bolgedenOneriHesapla(il))
    }
  }, [])

  const sektor = (kullanici?.sektor || 'bankacilik') as Sektor
  const senaryolar = getSektorSenaryolari(sektor)
  const sorular = getSektorSorular(sektor)
  const kaynak = SEKTOR_KAYNAK[sektor] || `İTÜ AYM HFE-360 — ${SORULAR.length} soru`
  const cevaplanan = Object.keys(puanlar).length
  const toplamSoru = sorular.length
  const yuzde = Math.round(cevaplanan / toplamSoru * 100)
  const bolgeRisk = ilKodu ? bolgeRiskOzeti(ilKodu) : null
  const tesisZorunlu = !!(tesis.yapi_yili && tesis.kat_adeti && tesis.sube_muduru && tesis.mudur_tel)

  const tD = (k: keyof TesisKarti, v: any) => setTesis(p => ({ ...p, [k]: v }))
  const bolgeOneriUygula = () => { setPuanlar(prev => ({ ...bolgeOneri, ...prev })); setOneriGoster(false) }

  const formuGonder = async (durum: 'gonderildi' | 'taslak') => {
    if (!kullanici?.birim_kodu) return
    setGonderiyor(true)
    const hfe = skorHesapla(puanlar)
    const { error } = await supabase.from('form_cevaplari').insert({
      tenant_id: null, birim_kodu: kullanici.birim_kodu, senaryo,
      sektor: kullanici.sektor || 'bankacilik',
      puanlar: { ...puanlar, _tesis_karti: tesis },
      dayaniklilik_skoru: hfe.toplam, h_skoru: hfe.h_skoru,
      f_skoru: hfe.f_skoru, e_skoru: hfe.e_skoru, durum,
      dolduran_email: kullanici.email,
      gonderilme: durum === 'gonderildi' ? new Date().toISOString() : null,
    })
    setGonderiyor(false)
    if (error) { alert('Hata: ' + error.message); return }
    if (durum === 'gonderildi') setGonderildi(true)
    else alert('✅ Taslak kaydedildi.')
  }

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    .card{background:white;border-radius:16px;border:1px solid #E5E3E1;padding:20px}
    .fl{font-size:10px;font-weight:700;color:#9CA3AF;letter-spacing:.07em;text-transform:uppercase;display:block;margin-bottom:5px}
    .fg{margin-bottom:12px}
    .inp{width:100%;border:1px solid #E5E3E1;border-radius:10px;padding:9px 12px;font-size:13px;font-family:'DM Sans',sans-serif;color:#374151;background:white;outline:none;transition:all .15s}
    .inp:focus{border-color:${TEAL};box-shadow:0 0 0 3px rgba(0,155,141,.1)}
    .chk{width:16px;height:16px;border-radius:4px;border:2px solid #CBD5E1;cursor:pointer;appearance:none;-webkit-appearance:none;flex-shrink:0;transition:all .15s}
    .chk:checked{background:${TEAL};border-color:${TEAL}}
    .chk:checked::after{content:'✓';display:block;color:white;font-size:10px;font-weight:700;text-align:center;line-height:1.3}
    .sek-h{font-size:11px;font-weight:700;color:${NAVY};padding-bottom:8px;border-bottom:2px solid ${TEAL};margin-bottom:14px;text-transform:uppercase;letter-spacing:.07em;display:flex;align-items:center;gap:8px}
    .num{background:${TEAL};color:white;width:20px;height:20px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0}
    .tab{display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:14px;border:2px solid #E5E3E1;background:white;font-family:'DM Sans',sans-serif;transition:all .2s;flex:1;text-align:left}
    .tab.aktif{border-color:${TEAL};background:rgba(0,155,141,.06)}
    .tab.tamam{border-color:#22C55E;background:#F0FFF4}
    .ank{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0}
    .g2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
    .sbox{background:#F8F6F3;border-radius:10px;padding:12px 14px;margin-bottom:12px}
    .slbl{font-size:10px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px;display:block}
    @keyframes fi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}} .fi{animation:fi .2s ease}
  `

  const Inp = ({ l, k, t='text', ph='', req=false }: {l:string;k:keyof TesisKarti;t?:string;ph?:string;req?:boolean}) => (
    <div className="fg" style={{margin:0}}>
      <label className="fl">{l}{req && <span style={{color:'#EF4444',marginLeft:2}}>*</span>}</label>
      <input type={t} className="inp" placeholder={ph} value={tesis[k] as string} onChange={e=>tD(k,e.target.value)} />
    </div>
  )
  const Sel = ({l,k,opts,req=false}:{l:string;k:keyof TesisKarti;opts:string[];req?:boolean}) => (
    <div className="fg" style={{margin:0}}>
      <label className="fl">{l}{req && <span style={{color:'#EF4444',marginLeft:2}}>*</span>}</label>
      <select className="inp" value={tesis[k] as string} onChange={e=>tD(k,e.target.value)}>
        {opts.map(o=><option key={o}>{o}</option>)}
      </select>
    </div>
  )
  const Chk = ({l,k}:{l:string;k:keyof TesisKarti}) => (
    <label style={{display:'flex',alignItems:'center',gap:8,fontSize:13,color:'#374151',cursor:'pointer',marginBottom:10}}>
      <input type="checkbox" className="chk" checked={tesis[k] as boolean} onChange={e=>tD(k,e.target.checked)} />{l}
    </label>
  )

  if (gonderildi) return (
    <div style={{minHeight:'100vh',background:'#F8F6F3',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'DM Sans',sans-serif",padding:16}}>
      <style dangerouslySetInnerHTML={{__html:css}} />
      <div style={{background:'white',borderRadius:20,border:'1px solid #ECEAE8',padding:40,textAlign:'center',maxWidth:400,width:'100%'}}>
        <div style={{fontSize:52,marginBottom:16}}>✅</div>
        <h2 style={{fontSize:20,fontWeight:700,color:NAVY,marginBottom:8}}>Teşekkürler!</h2>
        <p style={{color:'#6B7280',fontSize:14,marginBottom:6,lineHeight:1.6}}>Tesis Kartı ve dayanıklılık değerlendirmesi başarıyla gönderildi.</p>
        <p style={{color:'#9CA3AF',fontSize:13,marginBottom:28,lineHeight:1.6}}>Uzman ekibimiz inceleyerek sizinle paylaşacaktır.</p>
        <button onClick={()=>{setPuanlar({});setTesis(TESİS_BOŞ);setTesisTamam(false);setAdim(1);setGonderildi(false)}}
          style={{background:TEAL,color:'white',border:'none',borderRadius:12,padding:'12px 32px',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>
          Yeni Değerlendirme
        </button>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#F8F6F3',fontFamily:"'DM Sans',sans-serif"}}>
      <style dangerouslySetInnerHTML={{__html:css}} />

      {/* Üst bar */}
      <div style={{background:'white',borderBottom:'1px solid #ECEAE8',padding:'12px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,zIndex:10}}>
        <div>
          <span style={{fontWeight:800,color:NAVY,fontSize:16}}>RESILIA</span>
          <span style={{color:'#9CA3AF',fontSize:13,marginLeft:8}}>{SEKTOR_IKON[sektor]} Şube Değerlendirmesi</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <span style={{fontSize:12,color:'#6B7280',fontWeight:600}}>{kullanici?.birim_kodu}</span>
          <button onClick={oturumKapat} style={{fontSize:12,color:'#9CA3AF',border:'none',background:'none',cursor:'pointer'}}>Çıkış</button>
        </div>
      </div>

      <div style={{maxWidth:640,margin:'0 auto',padding:'20px 16px 80px'}}>

        {/* Senaryo + Birim */}
        <div className="card" style={{marginBottom:14,display:'flex',gap:14}}>
          <div style={{flex:1}}>
            <label className="fl">Birim</label>
            <div style={{background:'#F8F6F3',border:'1px solid #E5E3E1',borderRadius:10,padding:'9px 12px',fontSize:13,fontWeight:700,color:NAVY}}>
              {kullanici?.birim_kodu||'—'} · {SEKTOR_ETIKET[sektor]}
            </div>
          </div>
          <div style={{flex:1}}>
            <label className="fl">Senaryo</label>
            <select className="inp" value={senaryo} onChange={e=>setSenaryo(e.target.value)}>
              {senaryolar.map(s=><option key={s.id}>{s.ad}</option>)}
            </select>
          </div>
        </div>

        {/* Adım sekmeleri */}
        <div style={{display:'flex',gap:10,marginBottom:20}}>
          {([
            {n:1 as const,icon:'🏢',l:'Tesis Kartı',sub:'Yapı · Sistemler · Yetkili'},
            {n:2 as const,icon:'📋',l:'Risk Değerlendirme',sub:`HFE-360 · ${toplamSoru} soru`},
          ]).map(s=>{
            const dur=s.n===adim?'aktif':(s.n===1&&tesisTamam)?'tamam':''
            const dis=s.n===2&&!tesisTamam
            return (
              <button key={s.n} className={`tab ${dur}`} style={{opacity:dis?.4:1,cursor:dis?'not-allowed':'pointer'}}
                onClick={()=>{if(!dis)setAdim(s.n)}} disabled={dis}>
                <div className="ank" style={{background:dur==='tamam'?'#22C55E':dur==='aktif'?TEAL:'#F1F0EF',color:dur?'white':'#9CA3AF',fontSize:dur==='tamam'?14:16}}>
                  {dur==='tamam'?'✓':s.icon}
                </div>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:NAVY}}>{s.l}</div>
                  <div style={{fontSize:10,color:'#9CA3AF',marginTop:1}}>{s.sub}</div>
                </div>
                {dur==='aktif'&&<div style={{marginLeft:'auto',width:7,height:7,borderRadius:'50%',background:TEAL}}/>}
              </button>
            )
          })}
        </div>

        {/* ── ADIM 1: TESİS KARTI ── */}
        {adim===1&&(
          <div className="fi">
            <div style={{background:'rgba(0,155,141,.07)',border:'1px solid rgba(0,155,141,.25)',borderRadius:12,padding:'12px 16px',marginBottom:16,fontSize:12,color:'#065F46',lineHeight:1.7}}>
              🏢 <strong>Şube Tesis Kartı</strong> — <em>Bir kez doldurulur, kalıcı kayıt oluşturur.</em> Yapısal bilgiler,
              kritik sistem envanteri ve acil iletişim bilgilerini içerir.
              <span style={{color:'#EF4444'}}> * </span>ile işaretli alanlar zorunludur.
            </div>

            {/* 1. Yapısal */}
            <div className="card" style={{marginBottom:14}}>
              <p className="sek-h"><span className="num">1</span> Yapısal Bilgiler</p>
              <div className="g2" style={{marginBottom:12}}>
                <Inp l="Binanın Yapım Yılı" k="yapi_yili" t="number" ph="ör. 1998" req />
                <Inp l="Kat Adedi" k="kat_adeti" ph="ör. 4" req />
              </div>
              <div className="g3" style={{marginBottom:12}}>
                <Sel l="Yapı Tipi" k="yapi_tipi" opts={['betonarme','çelik','prefabrik','yığma','karma']} />
                <Inp l="Kapalı Alan (m²)" k="alan_m2" t="number" ph="ör. 450" />
                <Sel l="Mülkiyet" k="mulk_durumu" opts={['kira','mülk']} />
              </div>
              {tesis.mulk_durumu==='kira'&&<div style={{marginBottom:12}}><Inp l="Kira Bitiş Tarihi" k="kira_bitis" t="date" /></div>}
              <div className="g3" style={{marginBottom:12}}>
                <Sel l="Yapısal Güçlendirme" k="guclendirilmis" opts={['yok','kısmi','var']} />
                <Sel l="Zemin Etüdü" k="zemin_etut" opts={['yok','var']} />
                <Sel l="Yapısal Durum (1–5)" k="yapisal_durum" opts={['1 — Çok Kötü','2','3 — Orta','4','5 — Çok İyi']} />
              </div>
              <div className="g2" style={{marginBottom:12}}>
                <Sel l="Yapı Kullanım Belgesi (İskan)" k="iskan_belgesi" opts={['var','yok']} />
              </div>
              <Chk l="Bodrum Kat Mevcut" k="bodrum_var" />
              {tesis.bodrum_var&&<Sel l="Bodrum Kullanım Amacı" k="bodrum_kullanim" opts={['arşiv','depo','kasa','teknik alan','karma','yok']} />}
            </div>

            {/* 2. Kritik Sistem */}
            <div className="card" style={{marginBottom:14}}>
              <p className="sek-h"><span className="num">2</span> Kritik Sistem Envanteri</p>

              <div className="sbox">
                <span className="slbl">ATM & Kasa</span>
                <div className="g3">
                  <Inp l="İç ATM Sayısı" k="atm_sayisi" t="number" ph="0" />
                  <Inp l="Dış ATM Sayısı" k="atm_dis_sayisi" t="number" ph="0" />
                  <Sel l="Kasa Tipi" k="kasa_tipi" opts={['kasa odası','çelik kasa','yok']} />
                </div>
              </div>

              <div className="sbox">
                <span className="slbl">Enerji & Yedekleme</span>
                <div className="g2">
                  <div>
                    <Chk l="Yedek Güç Jeneratörü" k="jenerator_var" />
                    {tesis.jenerator_var&&<div style={{marginTop:-4}}><Inp l="Kapasite (kW)" k="jenerator_kw" t="number" ph="ör. 50" /></div>}
                  </div>
                  <div>
                    <Chk l="UPS Sistemi" k="ups_var" />
                    {tesis.ups_var&&<div style={{marginTop:-4}}><Inp l="Özerk Süre (dk)" k="ups_dakika" t="number" ph="ör. 30" /></div>}
                  </div>
                </div>
                <Chk l="Sismik Erken Uyarı Sistemi" k="erken_uyari" />
              </div>

              <div className="sbox">
                <span className="slbl">Yangın & Güvenlik</span>
                <Sel l="Yangın Önleme Sistemi" k="yangin_sistemi" opts={['sprinkler + algılama','sprinkler','algılama','yok']} />
                <div style={{marginTop:8,display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  <div>
                    <Chk l="Güvenlik Kamera" k="guvenlik_kamera" />
                    {tesis.guvenlik_kamera&&<Inp l="Kayıt Süresi (gün)" k="kamera_kayit_gun" t="number" ph="30" />}
                  </div>
                </div>
              </div>

              <Chk l="Bina / Tesis Sigortası Var" k="sigorta_var" />
              {tesis.sigorta_var&&<Inp l="Sigorta Şirketi" k="sigorta_sirket" ph="ör. Anadolu Sigorta" />}
            </div>

            {/* 3. Yetkili */}
            <div className="card" style={{marginBottom:14}}>
              <p className="sek-h"><span className="num">3</span> Yetkili Kişi & Acil İletişim</p>
              <div className="g2" style={{marginBottom:12}}>
                <Inp l="Şube Müdürü" k="sube_muduru" req />
                <Inp l="Müdür Tel" k="mudur_tel" ph="05xx xxx xx xx" req />
                <Inp l="Müdür E-posta" k="mudur_email" t="email" ph="ad@akbank.com" />
                <Inp l="KEP Adresi" k="kep_adresi" ph="akbank.sube@hs01.kep.tr" />
              </div>
              <div style={{background:'#FFFBF5',border:`1px solid #FDE68A`,borderLeft:`3px solid ${AMBER}`,borderRadius:10,padding:'12px 14px',marginBottom:12}}>
                <span className="slbl" style={{color:'#92400E'}}>⚡ 2. Acil Yetkili (Müdür ulaşılamazsa)</span>
                <div className="g2">
                  <Inp l="Ad Soyad / Unvan" k="acil_yetkili" ph="ör. Yönetmen" />
                  <Inp l="Cep Telefonu" k="acil_yetkili_tel" ph="05xx xxx xx xx" />
                </div>
              </div>
              <div className="g2">
                <Inp l="Güvenlik Şirketi" k="guvenlik_sirket" ph="ör. G4S" />
                <Inp l="Güvenlik Acil Hattı" k="guvenlik_tel" />
                <Inp l="En Yakın Hastane" k="en_yakin_hastane" ph="isim / mesafe" />
                <Inp l="En Yakın İtfaiye" k="en_yakin_itfaiye" ph="isim / mesafe" />
              </div>
            </div>

            {/* 4. Ek */}
            <div className="card" style={{marginBottom:16}}>
              <p className="sek-h"><span className="num">4</span> Ek Bilgiler</p>
              <div className="fg">
                <label className="fl">Komşu Binalardan Kaynaklı Riskler</label>
                <textarea className="inp" rows={2} placeholder="ör. Sağ komşu 1968 yığma yapı — deprem riski" value={tesis.komsu_risk} onChange={e=>tD('komsu_risk',e.target.value)} style={{resize:'vertical'}} />
              </div>
              <div className="fg" style={{margin:0}}>
                <label className="fl">Ek Notlar / Diğer Teknik Bilgiler</label>
                <textarea className="inp" rows={2} value={tesis.ek_not} onChange={e=>tD('ek_not',e.target.value)} style={{resize:'vertical'}} />
              </div>
            </div>

            {/* Doluluk göstergesi */}
            {(()=>{
              const dolu=[tesis.yapi_yili,tesis.yapi_tipi,tesis.kat_adeti,tesis.alan_m2,tesis.guclendirilmis,tesis.iskan_belgesi,tesis.mulk_durumu,tesis.atm_sayisi,tesis.yangin_sistemi,tesis.sube_muduru,tesis.mudur_tel,tesis.mudur_email,tesis.kep_adresi,tesis.acil_yetkili,tesis.guvenlik_sirket].filter(Boolean).length
              const pct=Math.round(dolu/15*100)
              return (
                <div style={{marginBottom:16,background:'white',borderRadius:12,border:'1px solid #E5E3E1',padding:'12px 16px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                    <span style={{fontSize:11,color:'#9CA3AF',fontWeight:600}}>Tesis Kartı Doluluk Oranı</span>
                    <span style={{fontSize:12,fontWeight:700,color:pct===100?'#22C55E':pct>50?TEAL:AMBER}}>{dolu}/15 alan · %{pct}</span>
                  </div>
                  <div style={{height:5,background:'#F1F0EF',borderRadius:99,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${pct}%`,background:pct===100?'#22C55E':TEAL,borderRadius:99,transition:'width .3s'}} />
                  </div>
                </div>
              )
            })()}

            <div style={{display:'flex',gap:10}}>
              <button disabled={!tesisZorunlu} onClick={()=>{setTesisTamam(true);setAdim(2)}}
                style={{flex:1,background:tesisZorunlu?TEAL:'#E5E3E1',color:tesisZorunlu?'white':'#9CA3AF',border:'none',borderRadius:14,padding:'14px 20px',fontSize:14,fontWeight:700,cursor:tesisZorunlu?'pointer':'not-allowed',fontFamily:"'DM Sans',sans-serif",transition:'all .15s',lineHeight:1.4}}>
                {tesisZorunlu?'→ Risk Değerlendirmesine Geç':'⚠ Zorunlu alanları doldurun (yapım yılı, kat, müdür adı & tel)'}
              </button>
              <button onClick={()=>formuGonder('taslak')} disabled={gonderiyor}
                style={{padding:'14px 16px',background:'#F1F0EF',color:'#6B7280',border:'none',borderRadius:14,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>
                Taslak
              </button>
            </div>
            {tesisTamam&&(
              <div style={{marginTop:12,background:'#F0FFF4',border:'1px solid #BBFBD0',borderRadius:12,padding:'10px 16px',fontSize:12,color:'#166534',display:'flex',alignItems:'center',gap:8}}>
                ✅ <strong>Tesis Kartı kaydedildi.</strong> Adım 2'de risk sorularını tamamlayıp gönderin.
              </div>
            )}
          </div>
        )}

        {/* ── ADIM 2: HFE-360 ── */}
        {adim===2&&(
          <div className="fi">
            {bolgeRisk&&(
              <div style={{borderRadius:14,border:'1px solid',padding:16,marginBottom:14,
                background:bolgeRisk.seviye==='kritik'?'#FEF2F2':bolgeRisk.seviye==='yüksek'?'#FFFBEB':'#EFF6FF',
                borderColor:bolgeRisk.seviye==='kritik'?'#FECACA':bolgeRisk.seviye==='yüksek'?'#FDE68A':'#BFDBFE'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:10}}>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                      <span style={{fontSize:11,fontWeight:700,textTransform:'uppercase' as const,letterSpacing:'.06em',color:bolgeRisk.seviye==='kritik'?'#DC2626':bolgeRisk.seviye==='yüksek'?'#D97706':'#2563EB'}}>
                        📍 Bölge Risk Profili
                      </span>
                      <span style={{fontSize:10,padding:'2px 8px',borderRadius:99,fontWeight:700,
                        background:bolgeRisk.seviye==='kritik'?'#FEE2E2':bolgeRisk.seviye==='yüksek'?'#FEF3C7':'#DBEAFE',
                        color:bolgeRisk.seviye==='kritik'?'#991B1B':bolgeRisk.seviye==='yüksek'?'#92400E':'#1E40AF'}}>
                        {bolgeRisk.seviye.toUpperCase()}
                      </span>
                    </div>
                    <p style={{fontSize:12,color:'#4B5563',marginBottom:6,lineHeight:1.6}}>{bolgeRisk.ozet}</p>
                    {bolgeRisk.uyarilar.map((u,i)=>(
                      <div key={i} style={{fontSize:11,color:'#6B7280',display:'flex',gap:6,marginBottom:4}}>
                        <span style={{color:AMBER,flexShrink:0}}>⚠</span>{u}
                      </div>
                    ))}
                  </div>
                  {Object.keys(bolgeOneri).length>0&&(
                    <button onClick={()=>setOneriGoster(true)}
                      style={{flexShrink:0,fontSize:11,fontWeight:600,padding:'8px 14px',borderRadius:10,background:'white',border:'1px solid #E5E3E1',color:'#374151',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",whiteSpace:'nowrap' as const}}>
                      Bölge Öneri Uygula →
                    </button>
                  )}
                </div>
              </div>
            )}

            {oneriGoster&&(
              <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:50,padding:16}}>
                <div style={{background:'white',borderRadius:20,padding:24,maxWidth:380,width:'100%'}}>
                  <h3 style={{fontWeight:700,color:NAVY,marginBottom:8}}>Bölge Profilini Uygula</h3>
                  <p style={{fontSize:13,color:'#6B7280',marginBottom:12,lineHeight:1.6}}>
                    {IL_PROFIL[ilKodu]?.il} ili için {Object.keys(bolgeOneri).length} soru bölge profiline göre doldurulacak.
                  </p>
                  <div style={{background:'#FFFBEB',border:'1px solid #FDE68A',borderRadius:10,padding:12,marginBottom:16}}>
                    <p style={{fontSize:11,color:'#92400E',fontWeight:500}}>⚠ AFAD haritası ve TMMOB zemin sınıflarına dayanmaktadır. Gerçek zemin etüdü ile doğrulayınız.</p>
                  </div>
                  <div style={{display:'flex',gap:10}}>
                    <button onClick={()=>setOneriGoster(false)} style={{flex:1,padding:10,borderRadius:10,border:'1px solid #E5E3E1',fontSize:13,color:'#6B7280',cursor:'pointer',background:'white',fontFamily:"'DM Sans',sans-serif"}}>İptal</button>
                    <button onClick={bolgeOneriUygula} style={{flex:1,padding:10,borderRadius:10,background:NAVY,color:'white',border:'none',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>Uygula</button>
                  </div>
                </div>
              </div>
            )}

            <div className="card" style={{marginBottom:16}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:8}}>
                <span style={{color:'#6B7280'}}>Tamamlanma</span>
                <span style={{fontWeight:600,color:NAVY}}>{cevaplanan}/{toplamSoru} soru <span style={{color:TEAL}}>%{yuzde}</span></span>
              </div>
              <div style={{fontSize:10,color:'#9CA3AF',marginBottom:6}}>{kaynak}</div>
              <div style={{height:6,background:'#F1F0EF',borderRadius:99,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${yuzde}%`,background:yuzde===100?'#22C55E':TEAL,borderRadius:99,transition:'width .3s'}} />
              </div>
            </div>

            {BOLUMLER.map((bolum,bi)=>{
              const bs=sorular.filter(s=>s.bolum===bolum)
              const bc=bs.filter(s=>puanlar[s.kod]!==undefined).length
              const bT=['Tehlike Değerlendirmesi','Kırılganlık Değerlendirmesi','Kapasite Değerlendirmesi'][bi]
              const bA=['Birimin maruz kaldığı dış tehlikeleri değerlendirin.','Birimin iç yapısal zayıflıklarını değerlendirin.','Birimin hazırlık ve müdahale kapasitesini değerlendirin.'][bi]
              return (
                <div key={bolum} style={{marginBottom:24}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                    <div>
                      <h2 style={{fontSize:14,fontWeight:700,color:NAVY}}>{bT}</h2>
                      <p style={{fontSize:11,color:'#9CA3AF',marginTop:2}}>{bA}</p>
                    </div>
                    <span style={{fontSize:11,color:'#9CA3AF',background:'#F1F0EF',padding:'4px 10px',borderRadius:99,flexShrink:0}}>{bc}/{bs.length}</span>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:10}}>
                    {bs.map((soru,idx)=>{
                      const sel=puanlar[soru.kod]
                      return (
                        <div key={soru.kod} style={{borderRadius:16,border:`1px solid ${sel!==undefined?'#A7F3D0':'#E5E3E1'}`,padding:16,background:sel!==undefined?'#F0FDFA':'white',transition:'all .15s'}}>
                          <p style={{fontSize:13,fontWeight:500,color:'#374151',marginBottom:12,lineHeight:1.55}}>
                            {bi===0?idx+1:bi===1?SORULAR.filter(s=>s.bolum==='TEHLİKE').length+idx+1:SORULAR.filter(s=>s.bolum!=='KAPASİTE').length+idx+1}. {soru.soru}
                          </p>
                          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                            {[0,1,2,3].map(p=>(
                              <button key={p} onClick={()=>setPuanlar(prev=>({...prev,[soru.kod]:p}))}
                                style={{fontSize:12,padding:'10px 12px',borderRadius:12,border:`1px solid ${sel===p?TEAL:'#E5E3E1'}`,background:sel===p?TEAL:'white',color:sel===p?'white':'#4B5563',cursor:'pointer',textAlign:'left',lineHeight:1.4,fontFamily:"'DM Sans',sans-serif",fontWeight:sel===p?600:400,transition:'all .15s'}}>
                                {soru.rehber[p]}
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            <div style={{display:'flex',gap:10,paddingTop:8}}>
              <button onClick={()=>formuGonder('gonderildi')} disabled={gonderiyor||cevaplanan===0}
                style={{flex:1,background:cevaplanan===0?'#E5E3E1':TEAL,color:cevaplanan===0?'#9CA3AF':'white',border:'none',borderRadius:14,padding:'14px',fontSize:14,fontWeight:700,cursor:cevaplanan===0?'not-allowed':'pointer',fontFamily:"'DM Sans',sans-serif",transition:'all .15s'}}>
                {gonderiyor?'Gönderiliyor...':
                 `✓ Değerlendirmeyi Gönder${yuzde<100?` (%${yuzde} tamamlandı)`:''}`}
              </button>
              <button onClick={()=>formuGonder('taslak')} disabled={gonderiyor}
                style={{padding:'14px 16px',background:'#F1F0EF',color:'#6B7280',border:'none',borderRadius:14,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>
                Taslak
              </button>
              <button onClick={()=>setAdim(1)}
                style={{padding:'14px 14px',background:'#F1F0EF',color:'#6B7280',border:'none',borderRadius:14,fontSize:12,cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>
                ← Tesis
              </button>
            </div>
          </div>
        )}

        <p style={{textAlign:'center',fontSize:11,color:'#D1CEC9',paddingTop:28,paddingBottom:8}}>
          RESILIA · İTÜ AYM iş birliğiyle geliştirilmiştir
        </p>
      </div>
    </div>
  )
}
