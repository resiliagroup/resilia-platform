'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { mevcutKullanici, oturumKapat } from '@/lib/auth'
import { getRiskRenk, getRiskEtiket, type FormCevabi } from '@/types'
import { bolgeRiskOzeti, IL_PROFIL } from '@/lib/bolge-profil'

type UyeFirma = {
  birim_kodu: string
  il_adi: string
  il_kodu: string
  son_skor: number | null
  son_h: number | null
  son_f: number | null
  son_e: number | null
  son_senaryo: string
  form_sayisi: number
  lat: number | null
  lng: number | null
}

export default function OdaDashboard() {
  const mapDiv     = useRef<HTMLDivElement>(null)
  const mapInst    = useRef<any>(null)
  const layerList  = useRef<any[]>([])

  const [firmalar,   setFirmalar]   = useState<UyeFirma[]>([])
  const [secili,     setSecili]     = useState<UyeFirma | null>(null)
  const [kullanici,  setKullanici]  = useState<ReturnType<typeof mevcutKullanici>>(null)
  const [yuklendi,   setYuklendi]   = useState(false)
  const [aramaMetni, setAramaMetni] = useState('')
  const [ilFiltre,   setIlFiltre]   = useState('tumu')
  const [riskFiltre, setRiskFiltre] = useState('tumu')

  useEffect(() => {
    const k = mevcutKullanici()
    if (!k?.rol) { window.location.href = '/login'; return }
    setKullanici(k)

    supabase.from('form_cevaplari').select('*')
      .eq('durum', 'gonderildi')
      .then(({ data }) => {
        if (!data) return

        // Kullanıcının sektörüne göre filtrele
        // sektor kolonu varsa kullan, yoksa birim_kodu prefix'i ile ayırt et
        const sektorFiltreleri: Record<string, (kod: string) => boolean> = {
          uretim:     (k) => k.startsWith('GOSB') || k.startsWith('OSB') || k.startsWith('FAB'),
          saglik:     (k) => k.startsWith('MP-') || k.startsWith('HST'),
          belediye:   (k) => k.startsWith('IBB-') || k.startsWith('BLD'),
          meb:        (k) => k.startsWith('MEB-'),
          odalar:     (k) => k.startsWith('ISO-') || k.startsWith('TOBB'),
          bankacilik: (k) => /^\d{4}$/.test(k),  // 4 haneli sayısal kod = banka şubesi
        }
        const sektor = k.sektor || 'bankacilik'
        const filtreFn = sektorFiltreleri[sektor]

        // sektor kolonu mevcutsa onu kullan, yoksa prefix filtresi uygula
        const filtrelenmis = data.filter(f => {
          if ((f as any).sektor) return (f as any).sektor === sektor
          return filtreFn ? filtreFn(f.birim_kodu) : true
        })

        // Veri yoksa — demo modunda tüm veriyi göster (geliştirme kolaylığı)
        const kaynak = filtrelenmis

        // Her birim için son formu al
        const birMap: Record<string, FormCevabi[]> = {}
        kaynak.forEach(f => {
          if (!birMap[f.birim_kodu]) birMap[f.birim_kodu] = []
          birMap[f.birim_kodu].push(f)
        })
        const liste: UyeFirma[] = Object.entries(birMap).map(([kod, forms]) => {
          const son = forms.sort((a,b) => new Date(b.gonderilme||0).getTime() - new Date(a.gonderilme||0).getTime())[0]
          const il_kodu = kod.length >= 2 ? kod.substring(0,2) : ''
          return {
            birim_kodu: kod,
            il_adi: (son as any).il_adi || IL_PROFIL[il_kodu]?.il || '—',
            il_kodu,
            son_skor: son.dayaniklilik_skoru,
            son_h: son.h_skoru,
            son_f: son.f_skoru,
            son_e: son.e_skoru,
            son_senaryo: son.senaryo,
            form_sayisi: forms.length,
            lat: (son as any).lat || null,
            lng: (son as any).lng || null,
          }
        })
        setFirmalar(liste)
      })
  }, [])

  const ciz = useCallback((map: any, liste: UyeFirma[]) => {
    const L = (window as any).L
    layerList.current.forEach(l => { try { map.removeLayer(l) } catch {} })
    layerList.current = []
    liste.forEach(f => {
      if (!f.lat || !f.lng || f.son_skor === null) return
      const renk = getRiskRenk(f.son_skor)
      const m = L.marker([f.lat, f.lng], {
        icon: L.divIcon({
          html: `<div style="width:32px;height:32px;border-radius:50%;background:${renk};border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:10px;color:white;cursor:pointer">${f.son_skor}</div>`,
          className:'', iconSize:[32,32], iconAnchor:[16,16],
        })
      })
      m.bindPopup(`<div style="font-family:sans-serif;min-width:150px"><b style="font-size:12px">${f.birim_kodu}</b><br><small style="color:#888">${f.il_adi} · ${f.son_senaryo}</small><br><span style="font-size:20px;font-weight:800;color:${renk}">${f.son_skor}</span><br><span style="font-size:10px;color:${renk}">${getRiskEtiket(f.son_skor)}</span></div>`)
      m.on('click', () => setSecili(f))
      m.addTo(map)
      layerList.current.push(m)
    })
  }, [])

  useEffect(() => {
    if (!mapDiv.current) return
    const init = () => {
      if (mapInst.current) return
      const L = (window as any).L
      const map = L.map(mapDiv.current!, { center:[39.2,35.5], zoom:6 })
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution:'© OpenStreetMap', maxZoom:19 }).addTo(map)
      mapInst.current = map
      setYuklendi(true)
      if (firmalar.length > 0) ciz(map, firmalar)
    }
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link'); link.rel='stylesheet'
      link.href='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css'
      document.head.appendChild(link)
    }
    if ((window as any).L) { init(); return }
    const s = document.createElement('script')
    s.src='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'
    s.onload=init; document.head.appendChild(s)
    return () => { if (mapInst.current) { mapInst.current.remove(); mapInst.current=null } }
  }, [ciz, firmalar])

  useEffect(() => {
    if (yuklendi && mapInst.current && firmalar.length > 0) ciz(mapInst.current, firmalar)
  }, [yuklendi, firmalar, ciz])

  const iller = [...new Set(firmalar.map(f=>f.il_adi))].sort()
  const filtreli = firmalar.filter(f => {
    if (aramaMetni && !f.birim_kodu.toLowerCase().includes(aramaMetni.toLowerCase()) && !f.il_adi.toLowerCase().includes(aramaMetni.toLowerCase())) return false
    if (ilFiltre !== 'tumu' && f.il_adi !== ilFiltre) return false
    if (riskFiltre === 'kritik' && (f.son_skor||0) >= 40) return false
    if (riskFiltre === 'orta'   && ((f.son_skor||0) < 40 || (f.son_skor||0) >= 70)) return false
    if (riskFiltre === 'guclu'  && (f.son_skor||0) < 70) return false
    return true
  }).sort((a,b) => (a.son_skor||0) - (b.son_skor||0))

  const kritik  = firmalar.filter(f => (f.son_skor||0) < 40).length
  const orta    = firmalar.filter(f => (f.son_skor||0) >= 40 && (f.son_skor||0) < 70).length
  const guclu   = firmalar.filter(f => (f.son_skor||0) >= 70).length
  const ortSkor = firmalar.length ? Math.round(firmalar.reduce((a,f)=>a+(f.son_skor||0),0)/firmalar.length) : 0

  return (
    <div style={{ height:'100vh', display:'flex', flexDirection:'column', fontFamily:"'DM Sans',sans-serif" }}>
      <style suppressHydrationWarning dangerouslySetInnerHTML={{__html:`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');.fd{font-family:'Playfair Display',serif}.fm{font-family:'DM Mono',monospace}.leaflet-popup-content-wrapper{border-radius:12px!important}`}} />

      {/* NAV */}
      <nav style={{background:'white',borderBottom:'1px solid #e7e5e4',padding:'0 24px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
        <div style={{display:'flex',alignItems:'center',gap:24}}>
          <a href="/ana-sayfa" style={{display:'flex',alignItems:'center',gap:8,textDecoration:'none'}}>
            <div style={{width:28,height:28,borderRadius:8,background:'#0f172a',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span className="fd" style={{color:'white',fontWeight:700,fontSize:12}}>R</span>
            </div>
            <span className="fd" style={{fontWeight:700,color:'#0f172a',fontSize:16}}>RESILIA</span>
          </a>
          <div style={{display:'flex',gap:4}}>
            {[
              {label:'Oda Paneli',   href:'/oda/dashboard',  aktif:true},
              {label:'Risk Haritası',href:'/harita',          aktif:false},
            ].map(l=>(
              <a key={l.label} href={l.href} style={{padding:'6px 12px',borderRadius:8,fontSize:13,fontWeight:500,textDecoration:'none',background:l.aktif?'#f5f5f4':'transparent',color:l.aktif?'#0f172a':'#78716c'}}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:16}}>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:12,fontWeight:600,color:'#1c1917'}}>{kullanici?.ad_soyad}</div>
            <div style={{fontSize:10,color:'#a8a29e'}}>{kullanici?.tenant}</div>
          </div>
          <button onClick={oturumKapat} style={{fontSize:12,color:'#a8a29e',border:'1px solid #e7e5e4',padding:'6px 12px',borderRadius:8,background:'white',cursor:'pointer'}}>Çıkış</button>
        </div>
      </nav>

      {/* GÖVDE */}
      <div style={{flex:1,display:'flex',overflow:'hidden'}}>

        {/* SOL PANEL */}
        <div style={{width:300,flexShrink:0,background:'white',borderRight:'1px solid #e7e5e4',display:'flex',flexDirection:'column',overflow:'hidden'}}>

          {/* Başlık + KPI */}
          <div style={{padding:'20px 16px 12px',borderBottom:'1px solid #f5f5f4',flexShrink:0}}>
            <p className="fm" style={{fontSize:10,color:'#a8a29e',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:4}}>Üye Firma İzleme</p>
            <h1 className="fd" style={{fontSize:18,fontWeight:700,color:'#0f172a',margin:'0 0 4px'}}>Oda Dayanıklılık Paneli</h1>
            <p style={{fontSize:11,color:'#a8a29e',margin:'0 0 12px'}}>{kullanici?.tenant}</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:6}}>
              {[
                {l:'Toplam',v:firmalar.length,c:'#0f172a'},
                {l:'Kritik', v:kritik,         c:'#EF4444'},
                {l:'Orta',   v:orta,           c:'#F59E0B'},
                {l:'Güçlü', v:guclu,          c:'#22C55E'},
              ].map(k=>(
                <div key={k.l} style={{background:'#fafaf9',borderRadius:10,padding:'8px 4px',textAlign:'center'}}>
                  <div className="fd" style={{fontSize:18,fontWeight:700,color:k.c,lineHeight:1}}>{k.v}</div>
                  <div style={{fontSize:9,color:'#a8a29e',marginTop:2}}>{k.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Filtreler */}
          <div style={{padding:'12px 16px',borderBottom:'1px solid #f5f5f4',flexShrink:0}}>
            <input
              value={aramaMetni}
              onChange={e=>setAramaMetni(e.target.value)}
              placeholder="Firma kodu veya il ara..."
              style={{width:'100%',border:'1px solid #e7e5e4',borderRadius:10,padding:'8px 12px',fontSize:12,outline:'none',marginBottom:8,boxSizing:'border-box'}}
            />
            <div style={{display:'flex',gap:6}}>
              <select value={ilFiltre} onChange={e=>setIlFiltre(e.target.value)}
                style={{flex:1,border:'1px solid #e7e5e4',borderRadius:8,padding:'6px 8px',fontSize:11,outline:'none'}}>
                <option value="tumu">Tüm İller</option>
                {iller.map(il=><option key={il}>{il}</option>)}
              </select>
              <select value={riskFiltre} onChange={e=>setRiskFiltre(e.target.value)}
                style={{flex:1,border:'1px solid #e7e5e4',borderRadius:8,padding:'6px 8px',fontSize:11,outline:'none'}}>
                <option value="tumu">Tüm Riskler</option>
                <option value="kritik">Kritik</option>
                <option value="orta">Orta</option>
                <option value="guclu">Güçlü</option>
              </select>
            </div>
            <div style={{fontSize:10,color:'#a8a29e',marginTop:6}}>{filtreli.length} firma listeleniyor</div>
          </div>

          {/* Firma Listesi */}
          <div style={{flex:1,overflowY:'auto',padding:'8px 12px'}}>
            {filtreli.map(f=>{
              const renk = getRiskRenk(f.son_skor||0)
              const bolge = IL_PROFIL[f.il_kodu]
              return (
                <div key={f.birim_kodu}
                  onClick={()=>{ setSecili(f); if(f.lat&&f.lng&&mapInst.current) mapInst.current.setView([f.lat,f.lng],13) }}
                  style={{display:'flex',alignItems:'center',gap:10,padding:'10px 10px',borderRadius:12,border:`1px solid ${secili?.birim_kodu===f.birim_kodu?'#d6d3d1':'#f5f5f4'}`,background:secili?.birim_kodu===f.birim_kodu?'#f5f5f4':'white',cursor:'pointer',marginBottom:6}}>
                  <div style={{width:4,height:32,borderRadius:4,background:renk,flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span className="fm" style={{fontSize:11,fontWeight:700,color:'#1c1917'}}>{f.birim_kodu}</span>
                      <span className="fd" style={{fontSize:16,fontWeight:700,color:renk}}>{f.son_skor??'—'}</span>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:4,marginTop:2}}>
                      <span style={{fontSize:10,color:'#a8a29e'}}>{f.il_adi}</span>
                      {bolge?.deprem_zone === 1 && (
                        <span style={{fontSize:9,background:'#fef2f2',color:'#EF4444',border:'1px solid #fecaca',borderRadius:4,padding:'1px 4px',fontWeight:600}}>1.Zon</span>
                      )}
                      {f.form_sayisi > 1 && (
                        <span style={{fontSize:9,background:'#f0fdf4',color:'#16a34a',border:'1px solid #bbf7d0',borderRadius:4,padding:'1px 4px'}}>{f.form_sayisi} form</span>
                      )}
                    </div>
                    <div style={{fontSize:10,color:'#c4b5a5',marginTop:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{f.son_senaryo}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* HARİTA */}
        <div style={{flex:1,position:'relative'}}>
          <div ref={mapDiv} style={{width:'100%',height:'100%'}}/>

          {!yuklendi && (
            <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'#f5f5f4',zIndex:10}}>
              <span style={{color:'#a8a29e',fontSize:14}}>Harita yükleniyor...</span>
            </div>
          )}

          {/* Risk dağılım özet */}
          <div style={{position:'absolute',top:16,left:16,zIndex:1000,background:'white',border:'1px solid #e7e5e4',borderRadius:14,boxShadow:'0 4px 16px rgba(0,0,0,0.10)',padding:'14px 16px',minWidth:200}}>
            <p className="fm" style={{fontSize:9,color:'#a8a29e',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:8}}>Ağ Ortalaması</p>
            <div className="fd" style={{fontSize:40,fontWeight:700,color:getRiskRenk(ortSkor),lineHeight:1,marginBottom:4}}>{ortSkor}</div>
            <div style={{display:'flex',height:6,borderRadius:6,overflow:'hidden',gap:1,marginBottom:8}}>
              {kritik>0&&<div style={{flex:kritik,background:'#EF4444',borderRadius:6}}/>}
              {orta>0  &&<div style={{flex:orta,  background:'#F59E0B',borderRadius:6}}/>}
              {guclu>0 &&<div style={{flex:guclu, background:'#22C55E',borderRadius:6}}/>}
            </div>
            <div style={{fontSize:10,color:'#a8a29e'}}>{firmalar.length} üye firma · {kullanici?.tenant || 'Oda'}</div>
          </div>

          {/* Seçili firma kartı */}
          {secili && (
            <div style={{position:'absolute',bottom:24,right:24,zIndex:1000,background:'white',border:'1px solid #e7e5e4',borderRadius:16,boxShadow:'0 8px 24px rgba(0,0,0,0.12)',padding:20,width:248}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:12}}>
                <div>
                  <div className="fm" style={{fontWeight:700,color:'#1c1917',fontSize:13}}>{secili.birim_kodu}</div>
                  <div style={{fontSize:11,color:'#a8a29e'}}>{secili.il_adi} · {secili.son_senaryo}</div>
                  {(() => {
                    const br = bolgeRiskOzeti(secili.il_kodu)
                    return br.uyarilar.length > 0 ? (
                      <div style={{marginTop:4,fontSize:10,color:'#EF4444',background:'#fef2f2',borderRadius:6,padding:'3px 6px',display:'inline-block'}}>{IL_PROFIL[secili.il_kodu]?.deprem_zone}. Deprem Zonu · {IL_PROFIL[secili.il_kodu]?.zemin_sinif}</div>
                    ) : null
                  })()}
                </div>
                <button onClick={()=>setSecili(null)} style={{background:'none',border:'none',cursor:'pointer',fontSize:20,color:'#d6d3d1',lineHeight:1}}>×</button>
              </div>
              <div className="fd" style={{fontSize:48,fontWeight:700,color:getRiskRenk(secili.son_skor||0),lineHeight:1,marginBottom:4}}>
                {secili.son_skor??'—'}
              </div>
              <div style={{fontSize:13,fontWeight:600,color:getRiskRenk(secili.son_skor||0),marginBottom:12}}>
                {getRiskEtiket(secili.son_skor||0)}
              </div>
              {[
                {l:'H',v:secili.son_h??0,c:'#F97316'},
                {l:'F',v:secili.son_f??0,c:'#EF4444'},
                {l:'E',v:secili.son_e??0,c:'#3B82F6'},
              ].map(b=>(
                <div key={b.l} style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                  <span className="fm" style={{fontSize:10,color:b.c,width:12}}>{b.l}</span>
                  <div style={{flex:1,height:5,background:'#f5f5f4',borderRadius:9999,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${b.v}%`,background:b.c,borderRadius:9999}}/>
                  </div>
                  <span className="fm" style={{fontSize:10,color:b.c,width:20,textAlign:'right'}}>{b.v}</span>
                </div>
              ))}
              <div style={{display:'flex',gap:8,marginTop:12}}>
                <a href={`/uzman/sube/${secili.birim_kodu}`}
                  style={{flex:1,display:'block',background:'#0f172a',color:'white',textAlign:'center',padding:'9px',borderRadius:10,fontSize:12,fontWeight:600,textDecoration:'none'}}>
                  Detay →
                </a>
                <a href="/oda/rapor"
                  style={{flex:1,display:'block',background:'#f5f5f4',color:'#1c1917',textAlign:'center',padding:'9px',borderRadius:10,fontSize:12,fontWeight:600,textDecoration:'none',border:'1px solid #e7e5e4'}}>
                  Rapor
                </a>
              </div>
            </div>
          )}

          {/* Lejant */}
          <div style={{position:'absolute',bottom:24,left:24,zIndex:1000,background:'white',border:'1px solid #e7e5e4',borderRadius:12,boxShadow:'0 4px 12px rgba(0,0,0,0.08)',padding:12}}>
            <div className="fm" style={{fontSize:9,color:'#a8a29e',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:8}}>Risk Seviyesi</div>
            {[{c:'#EF4444',l:'Kritik  (0–40)'},{c:'#F59E0B',l:'Orta (40–70)'},{c:'#22C55E',l:'Güçlü (70+)'}].map(l=>(
              <div key={l.l} style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                <div style={{width:10,height:10,borderRadius:'50%',background:l.c}}/>
                <span className="fm" style={{fontSize:9,color:'#78716c'}}>{l.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}