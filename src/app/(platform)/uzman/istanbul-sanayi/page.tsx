'use client'
import { useState, useEffect } from 'react'

// ── Renk Paleti ──────────────────────────────────────────────────────────────
const NAVY   = '#0A1628'
const TEAL   = '#009B8D'
const TEAL2  = '#00C9B1'
const AMBER  = '#D97706'
const RED    = '#DC2626'
const GREEN  = '#16A34A'
const WARM   = '#F8F6F3'
const AVRUPA = '#1B4FD8'   // mavi
const ANADOLU= '#7C3AED'   // mor

// ── Veri ─────────────────────────────────────────────────────────────────────
const OZET = {
  toplam: 200,
  toplam_calisan: 49411,
  ort_calisan: 247,
  ort_skor: 53.1,
  kritik: 48, orta: 104, guclu: 48,
  avrupa: 90, anadolu: 110,
  az_teh: 70, tehlikeli: 80, cok_teh: 50,
}

const TEHLIKE_GRUPLARI = [
  {
    grup: 'az_tehlikeli', label: 'Az Tehlikeli',
    renk: GREEN, renk2: '#DCFCE7', n: 70,
    ort: 50.9, kritik: 26, orta: 32, guclu: 12,
    sektorler: ['Gıda & İçecek', 'Tekstil & Konfeksiyon', 'Elektronik Montaj', 'Mobilya', 'Plastik Ürünler', 'Kozmetik'],
    isg: 'İSG Yönetmeliği Az Tehlikeli Sınıfı — Yılda 1 Risk Değerlendirmesi',
    icon: '🟢',
    eia_risk: 'Düşük',
    eal: 2.8,
  },
  {
    grup: 'tehlikeli', label: 'Tehlikeli',
    renk: AMBER, renk2: '#FEF3C7', n: 80,
    ort: 57.7, kritik: 11, orta: 46, guclu: 23,
    sektorler: ['Metal İşleme & Döküm', 'Otomotiv Yan Sanayi', 'Makine & Ekipman', 'İnşaat Malzemeleri', 'Lastik & Kauçuk', 'Elektrik-Elektronik'],
    isg: 'İSG Yönetmeliği Tehlikeli Sınıf — 3 Yılda 1 İSGB zorunlu',
    icon: '🟡',
    eia_risk: 'Orta',
    eal: 6.4,
  },
  {
    grup: 'cok_tehlikeli', label: 'Çok Tehlikeli',
    renk: RED, renk2: '#FEE2E2', n: 50,
    ort: 49.8, kritik: 11, orta: 26, guclu: 13,
    sektorler: ['Kimya & Petrokimya', 'Boya, Vernik & Solvent', 'Deri İşleme', 'Gemi İnşa & Onarım', 'Solvente Dayalı Üretim'],
    isg: 'İSG Yönetmeliği Çok Tehlikeli Sınıf — Sürekli İSGB, SEVESO kapsamı',
    icon: '🔴',
    eia_risk: 'Kritik',
    eal: 11.2,
  },
]

const OSB_LISTESI = [
  { osb:'İkitelli OSB',         yaka:'Avrupa',  ilce:'Başakşehir', n:22, ort:55, dep:1, lat:41.068, lng:28.795, ana_sektor:'Tekstil, Metal, Makine' },
  { osb:'İstanbul Tuzla OSB',   yaka:'Anadolu', ilce:'Tuzla',      n:19, ort:52, dep:1, lat:40.824, lng:29.346, ana_sektor:'Kimya, Metal, Otomotiv' },
  { osb:'İstanbul Dudullu OSB', yaka:'Anadolu', ilce:'Ümraniye',   n:16, ort:58, dep:1, lat:41.012, lng:29.184, ana_sektor:'Elektronik, Makine, Plastik' },
  { osb:'Hadımköy Sanayi',      yaka:'Avrupa',  ilce:'Arnavutköy', n:16, ort:51, dep:1, lat:41.102, lng:28.678, ana_sektor:'Metal, İnşaat, Gıda' },
  { osb:'Tuzla Kimya OSB',      yaka:'Anadolu', ilce:'Tuzla',      n:14, ort:44, dep:1, lat:40.818, lng:29.338, ana_sektor:'Kimya, Boya, Solvent' },
  { osb:'Anadolu Yakası OSB',   yaka:'Anadolu', ilce:'Tuzla',      n:12, ort:53, dep:1, lat:40.831, lng:29.352, ana_sektor:'Metal, Mermer, Makine' },
  { osb:'Beylikdüzü OSB',       yaka:'Avrupa',  ilce:'Beylikdüzü', n:11, ort:57, dep:1, lat:41.002, lng:28.654, ana_sektor:'Gıda, Tekstil, Otomotiv' },
  { osb:'İstanbul Deri OSB',    yaka:'Anadolu', ilce:'Tuzla',      n:9,  ort:46, dep:1, lat:40.815, lng:29.360, ana_sektor:'Deri İşleme, Kimya' },
  { osb:'İMES Sanayi Sitesi',   yaka:'Anadolu', ilce:'Ümraniye',   n:9,  ort:60, dep:1, lat:41.008, lng:29.178, ana_sektor:'Metal, Makine, Elektronik' },
  { osb:'Esenyurt Sanayi',      yaka:'Avrupa',  ilce:'Esenyurt',   n:8,  ort:49, dep:1, lat:41.034, lng:28.672, ana_sektor:'Tekstil, Plastik, Gıda' },
  { osb:'Pendik Sanayi',        yaka:'Anadolu', ilce:'Pendik',     n:8,  ort:54, dep:1, lat:40.873, lng:29.234, ana_sektor:'Gemi, Otomotiv, Metal' },
  { osb:'Birlik OSB',           yaka:'Anadolu', ilce:'Tuzla',      n:7,  ort:56, dep:1, lat:40.836, lng:29.361, ana_sektor:'Metal, Makine, Kimya' },
  { osb:'Diğer (7 bölge)',      yaka:'Mix',     ilce:'Çeşitli',    n:49, ort:54, dep:1, lat:41.020, lng:28.950, ana_sektor:'Çeşitli' },
]

const EN_KRITIK = [
  { kod:'FABKOSB001', ad:'Titan Kimya & Petrokimya San. A.Ş.',      osb:'Tuzla Kimya OSB',     grup:'cok_tehlikeli', skor:15, calisan:280 },
  { kod:'FABIDERI002',ad:'Delta Deri İşleme Üretim San. Tic. A.Ş.', osb:'İstanbul Deri OSB',   grup:'cok_tehlikeli', skor:18, calisan:95  },
  { kod:'FABKOSB003', ad:'Nova Boya, Vernik & Solvent Endüstri A.Ş.',osb:'Tuzb Kimya OSB',     grup:'cok_tehlikeli', skor:21, calisan:140 },
  { kod:'FABIOSB012', ad:'Kaya Tekstil & Konfeksiyon Grup A.Ş.',     osb:'İkitelli OSB',        grup:'az_tehlikeli',  skor:23, calisan:42  },
  { kod:'FABITOS004', ad:'Boğaz Metal İşleme & Döküm San. A.Ş.',    osb:'İst. Tuzla OSB',      grup:'tehlikeli',     skor:25, calisan:320 },
  { kod:'FABIDERI005',ad:'Marmara Deri İşleme İmalat San. A.Ş.',    osb:'İstanbul Deri OSB',   grup:'cok_tehlikeli', skor:26, calisan:78  },
  { kod:'FABIOTB006', ad:'Apex Gemi İnşa & Onarım Teknoloji A.Ş.', osb:'Pendik Sanayi',       grup:'cok_tehlikeli', skor:27, calisan:520 },
  { kod:'FABHAIM007', ad:'Atlas İnşaat Malzemeleri Sanayi A.Ş.',    osb:'Hadımköy Sanayi',     grup:'tehlikeli',     skor:28, calisan:165 },
]

const SENARYO_EAL = [
  { s:'Deprem (1. Bölge)',      eal:12.4, pct:60, sub:'200 tesis 1. derece deprem bölgesinde', renk:RED },
  { s:'Kimyasal Sızıntı/Patlama',eal:8.6, pct:42, sub:'50 çok tehlikeli tesisin SEVESO riski', renk:'#7C3AED' },
  { s:'Yangın',                 eal:5.2,  pct:25, sub:'Özellikle kimya+boya tesislerinde yüksek', renk:AMBER },
  { s:'İş Kazası Kitlesel',     eal:3.8,  pct:18, sub:'49.411 çalışan · OHSAS riski', renk:'#EA580C' },
  { s:'Sel / Su Baskını',       eal:2.4,  pct:12, sub:'Tuzla kıyı tesisleri + Dudullu dere havzası', renk:AVRUPA },
  { s:'Siber / EKS Saldırısı',  eal:1.9,  pct:9,  sub:'SCADA/OT sistemleri hedefli', renk:TEAL },
]

const YAKA_KARSILASTIR = {
  avrupa: { n:90, ort:53.8, kritik:20, guclu:22, top_osb:'İkitelli OSB (22)', ana:'Tekstil, Metal, Gıda' },
  anadolu:{ n:110, ort:52.5, kritik:28, guclu:26, top_osb:'İst. Tuzla OSB (19)', ana:'Kimya, Metal, Otomotiv' },
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const srk = (s:number) => s<40?RED:s<70?AMBER:GREEN
const sel = (s:number) => s<40?'KRİTİK':s<70?'ORTA':'GÜÇLÜ'
function AnimNum({v,pre='',suf='',dec=0}:any){
  const [d,setD]=useState(0)
  useEffect(()=>{
    let step=0; const iv=setInterval(()=>{
      step++;setD(v*step/40)
      if(step>=40){setD(v);clearInterval(iv)}
    },14); return()=>clearInterval(iv)
  },[v])
  return <>{pre}{dec?d.toFixed(dec):Math.round(d)}{suf}</>
}

function MBar({v,max,c}:any){
  return <div style={{height:5,background:'#F1F0EF',borderRadius:99,overflow:'hidden',flex:1}}>
    <div style={{height:'100%',width:`${Math.min(100,v/max*100)}%`,background:c,borderRadius:99,transition:'width .6s ease'}}/>
  </div>
}

function DagBar({k,o,g,t}:any){
  return <div>
    <div style={{display:'flex',height:10,borderRadius:99,overflow:'hidden',gap:1}}>
      <div style={{width:`${k/t*100}%`,background:RED}}/>
      <div style={{width:`${o/t*100}%`,background:AMBER}}/>
      <div style={{width:`${g/t*100}%`,background:GREEN}}/>
    </div>
    <div style={{display:'flex',gap:12,marginTop:6}}>
      {([[RED,'KRİTİK',k],[AMBER,'ORTA',o],[GREEN,'GÜÇLÜ',g]] as any[]).map(([c,l,n])=>(
        <div key={l} style={{display:'flex',alignItems:'center',gap:4}}>
          <div style={{width:7,height:7,borderRadius:2,background:c}}/>
          <span style={{fontSize:10,color:'#6B7280'}}>{l}: <strong style={{color:NAVY}}>{n}</strong></span>
        </div>
      ))}
    </div>
  </div>
}

// ── Ana Bileşen ──────────────────────────────────────────────────────────────
export default function IstanbulSanayiDashboard() {
  const [sekme, setSekme] = useState<'ozet'|'tehlike'|'osb'|'kritik'|'bia'|'yaka'>('ozet')
  const [secilenTeh, setSecilenTeh] = useState<string|null>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(()=>{ setMounted(true) },[])

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'DM Sans',sans-serif;background:${WARM}}
    ::-webkit-scrollbar{width:4px;height:4px}
    ::-webkit-scrollbar-track{background:#F1F0EF}
    ::-webkit-scrollbar-thumb{background:#D1CEC9;border-radius:99px}
    @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    .fu{animation:fadeUp .3s ease forwards}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
    .pulse{animation:pulse 2s infinite}
  `

  const SEKMELER = [
    {v:'ozet',l:'Genel Özet'},{v:'tehlike',l:'Tehlike Grupları'},{v:'yaka',l:'İki Yakası'},
    {v:'osb',l:'OSB & Bölgeler'},{v:'kritik',l:'Kritik Tesisler'},{v:'bia',l:'BIA & EAL'},
  ]

  return (
    <div style={{minHeight:'100vh',background:WARM,fontFamily:"'DM Sans',sans-serif"}}>
      <style dangerouslySetInnerHTML={{__html:css}}/>

      {/* Topbar */}
      <div style={{background:NAVY,padding:'0 28px',display:'flex',alignItems:'stretch',justifyContent:'space-between',height:56,position:'sticky',top:0,zIndex:100}}>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <div style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:20,color:'white'}}>OMNI</div>
          <div style={{width:1,height:24,background:'rgba(255,255,255,.15)'}}/>
          <div style={{fontSize:11,color:'rgba(255,255,255,.5)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.08em'}}>
            İstanbul Sanayi Tesisleri · ISO Fabrika Üyeleri
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:8,height:8,borderRadius:'50%',background:TEAL2}} className="pulse"/>
          <span style={{fontSize:11,color:'rgba(255,255,255,.5)'}}>200 Tesis · 49.411 Çalışan · Canlı Demo</span>
        </div>
      </div>

      <div style={{maxWidth:1240,margin:'0 auto',padding:'24px 20px 60px'}}>

        {/* Hero başlık + sekmeler */}
        <div style={{marginBottom:20}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:16}}>
            <div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:900,color:NAVY,marginBottom:2}}>
                İstanbul Sanayi Dayanıklılık Haritası
              </div>
              <div style={{fontSize:13,color:'#9CA3AF'}}>
                200 tesis · Avrupa + Anadolu Yakası · 19 OSB/Sanayi Bölgesi · İSG Tehlike Grupları
              </div>
            </div>
            {/* Yaka rozeti */}
            <div style={{display:'flex',gap:8}}>
              {[{l:'Avrupa',n:90,c:AVRUPA},{l:'Anadolu',n:110,c:ANADOLU}].map(y=>(
                <div key={y.l} style={{padding:'8px 14px',borderRadius:10,background:y.c+'18',border:`1px solid ${y.c}40`,textAlign:'center'}}>
                  <div style={{fontSize:11,fontWeight:700,color:y.c}}>{y.l} Yakası</div>
                  <div style={{fontSize:18,fontWeight:800,color:NAVY}}>{y.n}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Sekmeler */}
          <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
            {SEKMELER.map(s=>(
              <button key={s.v} onClick={()=>setSekme(s.v as any)}
                style={{fontSize:12,fontWeight:600,padding:'8px 14px',borderRadius:10,border:'none',
                  cursor:'pointer',fontFamily:"'DM Sans',sans-serif",transition:'all .15s',
                  background:sekme===s.v?NAVY:'#F1F0EF',color:sekme===s.v?'white':'#6B7280'}}>
                {s.l}
              </button>
            ))}
          </div>
        </div>

        {/* ── GENEL ÖZET ────────────────────────────────────────────────── */}
        {sekme==='ozet' && (
          <div className="fu">
            {/* KPI grid */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:12,marginBottom:20}}>
              {[
                {l:'Toplam Tesis',v:200,sub:'İstanbul geneli',c:TEAL,suf:'',icon:'🏭',ani:true},
                {l:'Toplam Çalışan',v:49411,sub:'İSG risk altında',c:AVRUPA,suf:'',icon:'👷',ani:true},
                {l:'Ort. Skor',v:53.1,sub:'HFE-360 metodolojisi',c:AMBER,suf:'',icon:'📊',ani:false},
                {l:'Kritik Tesis',v:48,sub:'Skor < 40',c:RED,suf:'',icon:'🚨',ani:true},
                {l:'Güçlü Tesis',v:48,sub:'Skor ≥ 70',c:GREEN,suf:'',icon:'✅',ani:true},
              ].map(k=>(
                <div key={k.l} style={{background:'white',borderRadius:16,border:'1px solid #ECEAE8',padding:'16px 18px',position:'relative',overflow:'hidden'}}>
                  <div style={{position:'absolute',top:0,left:0,width:4,bottom:0,background:k.c,borderRadius:'16px 0 0 16px'}}/>
                  <div style={{paddingLeft:8}}>
                    <div style={{fontSize:10,fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>{k.l}</div>
                    <div style={{fontSize:26,fontWeight:800,color:NAVY,lineHeight:1,marginBottom:3}}>
                      {k.ani&&mounted?<AnimNum v={k.v}/>:k.v}
                    </div>
                    <div style={{fontSize:10,color:'#9CA3AF'}}>{k.sub}</div>
                  </div>
                  <div style={{position:'absolute',right:14,top:14,fontSize:20,opacity:.12}}>{k.icon}</div>
                </div>
              ))}
            </div>

            {/* Tehlike grubu kartları */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:20}}>
              {TEHLIKE_GRUPLARI.map(tg=>(
                <div key={tg.grup} style={{background:'white',borderRadius:18,border:`2px solid ${tg.renk}30`,padding:'20px 22px',cursor:'pointer',transition:'all .2s'}}
                  onClick={()=>{setSekme('tehlike');setSecilenTeh(tg.grup)}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                    <div>
                      <div style={{fontSize:10,fontWeight:700,color:tg.renk,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4}}>{tg.icon} {tg.label}</div>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:34,fontWeight:700,color:NAVY,lineHeight:1}}>{tg.n}</div>
                      <div style={{fontSize:11,color:'#9CA3AF',marginTop:2}}>tesis · Ort. {tg.ort}</div>
                    </div>
                    <div style={{background:tg.renk+'15',borderRadius:12,padding:'8px 12px',textAlign:'center'}}>
                      <div style={{fontSize:11,color:tg.renk,fontWeight:700}}>EAL</div>
                      <div style={{fontSize:18,fontWeight:800,color:tg.renk}}>₺{tg.eal}M</div>
                    </div>
                  </div>
                  <DagBar k={tg.kritik} o={tg.orta} g={tg.guclu} t={tg.n}/>
                  <div style={{marginTop:10,fontSize:10,color:'#9CA3AF',lineHeight:1.6}}>
                    {tg.sektorler.slice(0,3).join(' · ')}
                  </div>
                </div>
              ))}
            </div>

            {/* Senaryo ve yakası yan yana */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
              <div style={{background:'white',borderRadius:16,border:'1px solid #ECEAE8',padding:'20px 22px'}}>
                <div style={{fontSize:11,fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:14}}>Top 3 Risk Senaryosu</div>
                {SENARYO_EAL.slice(0,3).map(s=>(
                  <div key={s.s} style={{marginBottom:12}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                      <span style={{fontSize:12,fontWeight:600,color:NAVY}}>{s.s}</span>
                      <span style={{fontSize:14,fontWeight:800,color:s.renk}}>₺{s.eal}M</span>
                    </div>
                    <div style={{height:5,background:'#F1F0EF',borderRadius:99,overflow:'hidden'}}>
                      <div style={{height:'100%',width:`${s.pct}%`,background:s.renk,borderRadius:99}}/>
                    </div>
                    <div style={{fontSize:10,color:'#9CA3AF',marginTop:3}}>{s.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{background:NAVY,borderRadius:16,padding:'20px 22px',color:'white'}}>
                <div style={{fontSize:11,fontWeight:700,opacity:.5,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:16}}>İSG Tehlike Özeti</div>
                {TEHLIKE_GRUPLARI.map(tg=>(
                  <div key={tg.grup} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid rgba(255,255,255,.1)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{width:10,height:10,borderRadius:3,background:tg.renk}}/>
                      <span style={{fontSize:12,fontWeight:600}}>{tg.label}</span>
                    </div>
                    <div style={{display:'flex',gap:16}}>
                      <span style={{fontSize:11,opacity:.6}}>{tg.n} tesis</span>
                      <span style={{fontSize:12,fontWeight:700,color:tg.renk}}>Ort. {tg.ort}</span>
                    </div>
                  </div>
                ))}
                <div style={{marginTop:14,fontSize:12,opacity:.6,lineHeight:1.7}}>
                  50 çok tehlikeli tesiste <strong style={{opacity:1,color:RED}}>SEVESO III</strong> kapsamı değerlendirmesi zorunlu.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TEHLİKE GRUPLARI ──────────────────────────────────────────── */}
        {sekme==='tehlike' && (
          <div className="fu">
            {/* Seçici */}
            <div style={{display:'flex',gap:8,marginBottom:20}}>
              {TEHLIKE_GRUPLARI.map(tg=>(
                <button key={tg.grup} onClick={()=>setSecilenTeh(secilenTeh===tg.grup?null:tg.grup)}
                  style={{display:'flex',alignItems:'center',gap:8,padding:'10px 18px',borderRadius:14,
                    border:`2px solid ${secilenTeh===tg.grup?tg.renk:'#ECEAE8'}`,
                    background:secilenTeh===tg.grup?tg.renk:'white',
                    cursor:'pointer',fontFamily:"'DM Sans',sans-serif",transition:'all .2s',flex:1}}>
                  <span style={{fontSize:20}}>{tg.icon}</span>
                  <div style={{textAlign:'left'}}>
                    <div style={{fontSize:13,fontWeight:700,color:secilenTeh===tg.grup?'white':NAVY}}>{tg.label}</div>
                    <div style={{fontSize:10,color:secilenTeh===tg.grup?'rgba(255,255,255,.7)':'#9CA3AF'}}>{tg.n} tesis</div>
                  </div>
                </button>
              ))}
            </div>
            {/* Detay */}
            {(secilenTeh?TEHLIKE_GRUPLARI.filter(t=>t.grup===secilenTeh):TEHLIKE_GRUPLARI).map(tg=>(
              <div key={tg.grup} style={{background:'white',borderRadius:20,border:`2px solid ${tg.renk}30`,padding:'24px',marginBottom:16}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16,marginBottom:20}}>
                  <div>
                    <div style={{fontSize:10,color:'#9CA3AF',fontWeight:700,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:8}}>{tg.icon} {tg.label}</div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:48,fontWeight:700,color:tg.renk,lineHeight:1}}>{tg.n}</div>
                    <div style={{fontSize:12,color:'#9CA3AF',marginTop:4}}>tesis · Ort. skor: {tg.ort}</div>
                    <div style={{marginTop:12}}>
                      <DagBar k={tg.kritik} o={tg.orta} g={tg.guclu} t={tg.n}/>
                    </div>
                  </div>
                  <div>
                    <div style={{fontSize:10,color:'#9CA3AF',fontWeight:700,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:10}}>Sektörler</div>
                    {tg.sektorler.map(s=>(
                      <div key={s} style={{display:'flex',alignItems:'center',gap:6,marginBottom:7}}>
                        <div style={{width:6,height:6,borderRadius:2,background:tg.renk,flexShrink:0}}/>
                        <span style={{fontSize:12,color:'#374151'}}>{s}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{fontSize:10,color:'#9CA3AF',fontWeight:700,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:10}}>Risk Metrikleri</div>
                    {[
                      ['Yıllık EAL',`₺${tg.eal}M`,tg.renk],
                      ['Kritik Tesis',`${tg.kritik} (${Math.round(tg.kritik/tg.n*100)}%)`,RED],
                      ['Güçlü Tesis',`${tg.guclu} (${Math.round(tg.guclu/tg.n*100)}%)`,GREEN],
                      ['ÇED Risk Sınıfı',tg.eia_risk,tg.renk],
                    ].map(([l,v,c])=>(
                      <div key={l as string} style={{display:'flex',justifyContent:'space-between',padding:'7px 0',borderBottom:'1px solid #F1F0EF'}}>
                        <span style={{fontSize:12,color:'#6B7280'}}>{l}</span>
                        <span style={{fontSize:12,fontWeight:700,color:c as string}}>{v}</span>
                      </div>
                    ))}
                    <div style={{marginTop:12,padding:'10px 12px',background:tg.renk+'0F',borderRadius:10,fontSize:11,color:'#374151',lineHeight:1.6}}>
                      <strong>{tg.isg}</strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── İKİ YAKASI ────────────────────────────────────────────────── */}
        {sekme==='yaka' && (
          <div className="fu">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:20}}>
              {[{key:'avrupa',label:'Avrupa Yakası',renk:AVRUPA,icon:'🌉'},{key:'anadolu',label:'Anadolu Yakası',renk:ANADOLU,icon:'🏭'}].map(y=>{
                const d = YAKA_KARSILASTIR[y.key as 'avrupa'|'anadolu']
                return (
                  <div key={y.key} style={{background:y.renk,borderRadius:20,padding:'24px',color:'white'}}>
                    <div style={{fontSize:11,fontWeight:700,opacity:.7,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:6}}>{y.icon} {y.label}</div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:52,fontWeight:900,lineHeight:1,marginBottom:6}}>{d.n}</div>
                    <div style={{fontSize:13,opacity:.8,marginBottom:20}}>tesis · Ort. skor: {d.ort}</div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
                      {[['Kritik',d.kritik,RED],['Güçlü',d.guclu,GREEN]].map(([l,v,c])=>(
                        <div key={l as string} style={{background:'rgba(255,255,255,.12)',borderRadius:12,padding:'12px 14px'}}>
                          <div style={{fontSize:10,opacity:.7,marginBottom:4}}>{l}</div>
                          <div style={{fontSize:22,fontWeight:800}}>{v}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{fontSize:11,opacity:.7}}>🏆 Büyük OSB: {d.top_osb}</div>
                    <div style={{fontSize:11,opacity:.7,marginTop:4}}>⚙️ Ana Sektörler: {d.ana}</div>
                  </div>
                )
              })}
            </div>
            {/* Karşılaştırma tablosu */}
            <div style={{background:'white',borderRadius:16,border:'1px solid #ECEAE8',overflow:'hidden',marginBottom:16}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 150px 150px',background:NAVY,padding:'10px 18px'}}>
                {['Metrik','Avrupa Yakası','Anadolu Yakası'].map(h=>(
                  <div key={h} style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,.5)',textTransform:'uppercase',letterSpacing:'.07em',textAlign:h==='Metrik'?'left':'center'}}>{h}</div>
                ))}
              </div>
              {[
                ['Toplam Tesis','90','110'],
                ['Ort. Dayanıklılık Skoru','53.8 ✓','52.5'],
                ['Kritik Tesis (< 40)','20','28'],
                ['Güçlü Tesis (≥ 70)','22','26'],
                ['En Büyük OSB','İkitelli (22)','İst. Tuzla (19)'],
                ['Ağır Kimya Tesisi','8','18 ⚠'],
                ['Dep. Bölgesi','Tümü 1. Derece','Tümü 1. Derece'],
                ['Kıyı Riski (Sel/Tsunami)','Orta','Yüksek (Tuzla)'],
              ].map(([l,a,b],i)=>(
                <div key={l} style={{display:'grid',gridTemplateColumns:'1fr 150px 150px',padding:'10px 18px',background:i%2===0?'white':'#FAFAFA',borderBottom:'1px solid #F1F0EF'}}>
                  <span style={{fontSize:12,color:'#374151'}}>{l}</span>
                  <span style={{fontSize:12,fontWeight:700,color:AVRUPA,textAlign:'center'}}>{a}</span>
                  <span style={{fontSize:12,fontWeight:700,color:ANADOLU,textAlign:'center'}}>{b}</span>
                </div>
              ))}
            </div>
            <div style={{background:'#EFF6FF',border:'1px solid #BFDBFE',borderRadius:14,padding:'14px 18px'}}>
              <div style={{fontSize:12,fontWeight:700,color:'#1E40AF',marginBottom:6}}>🌉 İki Yaka Karşılaştırma Değerlendirmesi</div>
              <p style={{fontSize:12,color:'#1E3A8A',lineHeight:1.7,margin:0}}>
                Anadolu Yakası Tuzla bölgesi kimya ve deri sanayi yoğunluğu nedeniyle <strong>çok tehlikeli tesis oranında öne çıkıyor</strong>.
                Deprem riskinde iki yaka da 1. derece bölgede olup Tuzla kıyı tesisleri ayrıca <strong>tsunami/kıyı seli riski</strong> taşıyor.
                Avrupa Yakası İkitelli OSB'nin tekstil ağırlıklı yapısı daha yönetilebilir bir risk profili sunuyor.
                İki yaka toplamında <strong>₺20.4M/yıl EAL</strong> öngörülmektedir.
              </p>
            </div>
          </div>
        )}

        {/* ── OSB & BÖLGELER ────────────────────────────────────────────── */}
        {sekme==='osb' && (
          <div className="fu">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div style={{background:'white',borderRadius:16,border:'1px solid #ECEAE8',padding:'20px 22px'}}>
                <div style={{fontSize:11,fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:14}}>OSB / Sanayi Bölgesi Listesi</div>
                <div style={{maxHeight:480,overflowY:'auto'}}>
                  {OSB_LISTESI.map((o,i)=>(
                    <div key={o.osb} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:'1px solid #F1F0EF'}}>
                      <div style={{width:22,fontSize:10,color:'#9CA3AF',fontWeight:700,textAlign:'center',flexShrink:0}}>{i+1}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                          <span style={{fontSize:12,fontWeight:600,color:NAVY,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{o.osb}</span>
                          <div style={{display:'flex',gap:6,flexShrink:0}}>
                            <span style={{fontSize:10,padding:'2px 6px',borderRadius:5,background:o.yaka==='Avrupa'?AVRUPA+'18':o.yaka==='Mix'?'#9CA3AF18':ANADOLU+'18',color:o.yaka==='Avrupa'?AVRUPA:o.yaka==='Mix'?'#9CA3AF':ANADOLU,fontWeight:700}}>
                              {o.yaka}
                            </span>
                            <span style={{fontSize:11,fontWeight:700,color:srk(o.ort)}}>{o.ort}</span>
                            <span style={{fontSize:10,color:'#9CA3AF'}}>{o.n}</span>
                          </div>
                        </div>
                        <MBar v={o.ort} max={100} c={srk(o.ort)}/>
                        <div style={{fontSize:9,color:'#9CA3AF',marginTop:3}}>{o.ana_sektor}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <div style={{background:NAVY,borderRadius:16,padding:'20px 22px',color:'white'}}>
                  <div style={{fontSize:11,fontWeight:700,opacity:.5,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:14}}>OSB Dağılım Özeti</div>
                  {[['19 OSB/Sanayi Bölgesi','İstanbul genelinde'],['12 OSB','Organize yapılanma'],['7 Sanayi Bölgesi','Eski sanayi alanları'],['110 Tesis','Anadolu Yakası'],['90 Tesis','Avrupa Yakası'],].map(([v,l])=>(
                    <div key={v} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,.1)'}}>
                      <span style={{fontSize:12,opacity:.7}}>{l}</span>
                      <span style={{fontSize:13,fontWeight:700}}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{background:'white',borderRadius:16,border:'1px solid #ECEAE8',padding:'20px 22px'}}>
                  <div style={{fontSize:11,fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:12}}>En Riskli OSB'ler (Ort. Skor ↓)</div>
                  {OSB_LISTESI.filter(o=>o.yaka!=='Mix').sort((a,b)=>a.ort-b.ort).slice(0,5).map((o,i)=>(
                    <div key={o.osb} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:'1px solid #F1F0EF'}}>
                      <div style={{width:28,height:28,borderRadius:8,background:srk(o.ort),color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,flexShrink:0}}>{o.ort}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:12,fontWeight:600,color:NAVY}}>{o.osb}</div>
                        <div style={{fontSize:10,color:'#9CA3AF'}}>{o.n} tesis · {o.ilce} · {o.yaka}</div>
                      </div>
                      <span style={{fontSize:10,padding:'3px 7px',borderRadius:5,background:srk(o.ort)+'18',color:srk(o.ort),fontWeight:700}}>{sel(o.ort)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── KRİTİK TESİSLER ───────────────────────────────────────────── */}
        {sekme==='kritik' && (
          <div className="fu">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div style={{background:'white',borderRadius:16,border:'1px solid #ECEAE8',padding:'20px 22px'}}>
                <div style={{fontSize:11,fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:14}}>
                  En Kritik 8 Tesis — Acil Müdahale
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:8}}>
                  {EN_KRITIK.map((t,i)=>{
                    const tg = TEHLIKE_GRUPLARI.find(g=>g.grup===t.grup)!
                    return (
                      <div key={t.kod} style={{display:'flex',alignItems:'center',gap:10,padding:'12px 14px',background:i===0?'#FEF2F2':i<3?'#FEF9F0':'#FAFAFA',borderRadius:12,border:`1px solid ${i===0?'#FECACA':i<3?'#FDE68A':'#F1F0EF'}`}}>
                        <div style={{width:40,height:40,borderRadius:10,background:tg.renk,color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:800,flexShrink:0}}>
                          {t.skor}
                        </div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:12,fontWeight:600,color:NAVY,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{t.ad}</div>
                          <div style={{display:'flex',gap:8,marginTop:3}}>
                            <span style={{fontSize:10,color:'#6B7280'}}>📍 {t.osb}</span>
                            <span style={{fontSize:10,color:'#6B7280'}}>👷 {t.calisan} çalışan</span>
                            <span style={{fontSize:9,padding:'2px 5px',borderRadius:4,background:tg.renk+'18',color:tg.renk,fontWeight:700}}>{tg.icon} {tg.label}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <div style={{background:'white',borderRadius:16,border:'1px solid #ECEAE8',padding:'20px 22px'}}>
                  <div style={{fontSize:11,fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:12}}>Kritik Tesis Dağılımı</div>
                  {[['Toplam kritik tesis (< 40)','48',RED],['Çok tehlikeli kritik','11',RED],['Tehlikeli kritik','11',AMBER],['Az tehlikeli kritik','26',AMBER],['SEVESO kapsamı bekl.','~18',RED],['Acil yapısal değerlendirme','12',RED]].map(([l,v,c])=>(
                    <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #F1F0EF'}}>
                      <span style={{fontSize:12,color:'#6B7280'}}>{l}</span>
                      <span style={{fontSize:13,fontWeight:800,color:c}}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:16,padding:'16px 20px'}}>
                  <div style={{fontSize:12,fontWeight:700,color:'#991B1B',marginBottom:8}}>⚡ Öncelikli Aksiyon Planı</div>
                  {['30 Gün: Tuzla Kimya + Deri OSB çok tehlikeli 11 tesis acil denetim',
                    '60 Gün: 48 kritik tesisin BCP/ACİL EYLEM planı güncelleme',
                    '90 Gün: SEVESO III kapsamındaki teslere özel risk analizi',
                    '6 Ay: Deprem sonrası tahliye ve iş sürekliliği tatbikatı',
                    '12 Ay: ISO 45001 + ISO 22301 sertifika yol haritası'].map((a,i)=>(
                    <div key={i} style={{display:'flex',gap:8,marginBottom:6,fontSize:12,color:'#7F1D1D'}}>
                      <span style={{color:RED,flexShrink:0,fontWeight:700}}>{i+1}.</span>{a}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── BIA & EAL ─────────────────────────────────────────────────── */}
        {sekme==='bia' && (
          <div className="fu">
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
              <div>
                <div style={{background:'white',borderRadius:16,border:'1px solid #ECEAE8',padding:'20px 22px',marginBottom:14}}>
                  <div style={{fontSize:11,fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:14}}>Senaryo Bazlı Yıllık Beklenen Kayıp (EAL)</div>
                  {SENARYO_EAL.map(s=>(
                    <div key={s.s} style={{background:'#F8F6F3',borderRadius:10,padding:'12px 14px',marginBottom:8}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                        <div>
                          <span style={{fontSize:13,fontWeight:700,color:NAVY}}>{s.s}</span>
                          <div style={{fontSize:10,color:'#9CA3AF',marginTop:2}}>{s.sub}</div>
                        </div>
                        <div style={{textAlign:'right',flexShrink:0}}>
                          <span style={{fontSize:16,fontWeight:800,color:s.renk}}>₺{s.eal}M</span>
                        </div>
                      </div>
                      <div style={{height:5,background:'#E5E3E1',borderRadius:99,overflow:'hidden'}}>
                        <div style={{height:'100%',width:`${s.pct}%`,background:s.renk,borderRadius:99}}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <div style={{background:RED,borderRadius:20,padding:'24px',color:'white'}}>
                  <div style={{fontSize:11,fontWeight:700,opacity:.7,textTransform:'uppercase',letterSpacing:'.07em',marginBottom:8}}>Toplam Yıllık EAL</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:48,fontWeight:900,marginBottom:4}}>
                    ₺{SENARYO_EAL.reduce((a,s)=>a+s.eal,0).toFixed(1)}M
                  </div>
                  <div style={{fontSize:13,opacity:.8,marginBottom:20}}>200 tesis portföyü · 49.411 çalışan</div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                    {[['Çok Tehlikeli EAL','₺11.2M'],['Tehlikeli EAL','₺6.4M'],['Az Tehlikeli EAL','₺2.8M'],['İSG Tazminat Riski','₺3.1M']].map(([l,v])=>(
                      <div key={l} style={{background:'rgba(255,255,255,.12)',borderRadius:12,padding:'12px 14px'}}>
                        <div style={{fontSize:10,opacity:.7,marginBottom:4}}>{l}</div>
                        <div style={{fontSize:18,fontWeight:800}}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{background:'white',borderRadius:16,border:'1px solid #ECEAE8',padding:'20px 22px'}}>
                  <div style={{fontSize:11,fontWeight:700,color:'#9CA3AF',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:12}}>İş Sürekliliği Süreleri</div>
                  {[['Kritik üretim durdurma','4–24 saat','Kimya/otomotiv'],['Tam fabrika kapatma','1–7 gün','Yangın/patlama'],['Çevre rehabilitasyon','3–12 ay','Kimyasal sızıntı'],['İSG soruşturma süreci','6–18 ay','Kitlesel kaza'],].map(([l,v,sub])=>(
                    <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',padding:'9px 0',borderBottom:'1px solid #F1F0EF'}}>
                      <div>
                        <div style={{fontSize:12,color:NAVY,fontWeight:500}}>{l}</div>
                        <div style={{fontSize:10,color:'#9CA3AF'}}>{sub}</div>
                      </div>
                      <span style={{fontSize:12,fontWeight:700,color:AMBER,flexShrink:0}}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{textAlign:'center',fontSize:11,color:'#D1CEC9',marginTop:40}}>
          OMNI · ITU AYM iş birliğiyle · ISO Fabrika Üyeleri Dayanıklılık Platformu · 2025
        </div>
      </div>
    </div>
  )
}
