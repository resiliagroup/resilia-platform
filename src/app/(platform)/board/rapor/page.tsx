'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { mevcutKullanici, oturumKapat } from '@/lib/auth'
import { getRiskRenk, getRiskEtiket, SEKTOR_ETIKET, Sektor, type FormCevabi } from '@/types'

export default function RaporSayfasi() {
  const [formlar,    setFormlar]    = useState<FormCevabi[]>([])
  const [kullanici,  setKullanici]  = useState<ReturnType<typeof mevcutKullanici>>(null)
  const [yukleniyor, setYukleniyor] = useState(true)
  const [indiriliyor,setIndiriliyor]= useState(false)

  useEffect(() => {
    const k = mevcutKullanici()
    if (!k?.rol) { window.location.href = '/login'; return }
    setKullanici(k)
    // Sektöre göre filtrele
    supabase.from('form_cevaplari').select('*')
      .eq('durum','gonderildi')
      .eq('sektor', k.sektor || 'bankacilik')
      .then(({ data }) => { setFormlar(data || []); setYukleniyor(false) })
  }, [])

  const kritik  = formlar.filter(f => f.dayaniklilik_skoru < 40)
  const orta    = formlar.filter(f => f.dayaniklilik_skoru >= 40 && f.dayaniklilik_skoru < 70)
  const guclu   = formlar.filter(f => f.dayaniklilik_skoru >= 70)
  const ortSkor = formlar.length ? Math.round(formlar.reduce((a,f)=>a+f.dayaniklilik_skoru,0)/formlar.length) : 0
  const ortH    = formlar.length ? Math.round(formlar.reduce((a,f)=>a+(f.h_skoru||0),0)/formlar.length) : 0
  const ortF    = formlar.length ? Math.round(formlar.reduce((a,f)=>a+(f.f_skoru||0),0)/formlar.length) : 0
  const ortE    = formlar.length ? Math.round(formlar.reduce((a,f)=>a+(f.e_skoru||0),0)/formlar.length) : 0
  const enKritik = [...formlar].sort((a,b)=>a.dayaniklilik_skoru-b.dayaniklilik_skoru).slice(0,20)
  const sektor  = (kullanici?.sektor||'bankacilik') as Sektor
  const tenant  = kullanici?.tenant || 'OMNI Platform'
  const tarih   = new Date().toLocaleDateString('tr-TR',{day:'numeric',month:'long',year:'numeric'})

  const senaryoDagilim: Record<string,number> = {}
  formlar.forEach(f => { senaryoDagilim[f.senaryo] = (senaryoDagilim[f.senaryo]||0)+1 })

  const ilOzet: Record<string,{toplam:number,kritik:number,ort:number}> = {}
  formlar.forEach(f => {
    const il = (f as any).il_adi || 'Bilinmiyor'
    if (!ilOzet[il]) ilOzet[il] = {toplam:0,kritik:0,ort:0}
    ilOzet[il].toplam++
    if (f.dayaniklilik_skoru < 40) ilOzet[il].kritik++
    ilOzet[il].ort += f.dayaniklilik_skoru
  })
  Object.keys(ilOzet).forEach(il => { ilOzet[il].ort = Math.round(ilOzet[il].ort/ilOzet[il].toplam) })
  const ilListesi = Object.entries(ilOzet).sort((a,b)=>a[1].ort-b[1].ort).slice(0,10)

  const pdfIndir = async () => {
    setIndiriliyor(true)
    try {
      // jsPDF yükle
      if (!(window as any).jspdf) {
        await new Promise<void>((res,rej) => {
          const s = document.createElement('script')
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
          s.onload = () => res(); s.onerror = rej
          document.head.appendChild(s)
        })
      }
      // jsPDF-AutoTable (Türkçe karakter desteği için)
      if (!(window as any).jspdfAutotable) {
        await new Promise<void>((res,rej) => {
          const s = document.createElement('script')
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js'
          s.onload = () => res(); s.onerror = rej
          document.head.appendChild(s)
        })
      }
      const { jsPDF } = (window as any).jspdf
      // Türkçe karakter dönüştürücü
      const tr = (s:string) => s
        .replace(/ç/g,'c').replace(/Ç/g,'C')
        .replace(/ğ/g,'g').replace(/Ğ/g,'G')
        .replace(/ı/g,'i').replace(/İ/g,'I')
        .replace(/ö/g,'o').replace(/Ö/g,'O')
        .replace(/ş/g,'s').replace(/Ş/g,'S')
        .replace(/ü/g,'u').replace(/Ü/g,'U')

      const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' })
      const W = 210, M = 16
      let y = 0

      const NAVY  : [number,number,number] = [10, 22, 40]
      const TEAL  : [number,number,number] = [0, 155, 141]
      const RED   : [number,number,number] = [239, 68, 68]
      const AMBER : [number,number,number] = [245, 158, 11]
      const GREEN : [number,number,number] = [34, 197, 94]
      const GRAY  : [number,number,number] = [120, 113, 108]
      const LITE  : [number,number,number] = [245, 245, 244]
      const WHITE : [number,number,number] = [255, 255, 255]

      const sf = (c:[number,number,number]) => doc.setFillColor(c[0],c[1],c[2])
      const st = (c:[number,number,number]) => doc.setTextColor(c[0],c[1],c[2])
      const rk = (s:number):[number,number,number] => s<40?RED:s<70?AMBER:GREEN

      // SAYFA 1 — KAPAK
      sf(NAVY); doc.rect(0,0,W,297,'F')
      sf(TEAL);  doc.roundedRect(M,20,12,12,2,2,'F')
      st(WHITE); doc.setFontSize(9); doc.setFont('helvetica','bold')
      doc.text(tr('R'),M+3.8,27.5)
      st(WHITE); doc.setFontSize(9); doc.setFont('helvetica','normal')
      doc.text(tr('OMNI'),M+16,27.5)

      st(WHITE); doc.setFontSize(32); doc.setFont('helvetica','bold')
      doc.text(tr('Kurumsal Dayaniklilik'), M, 90)
      doc.text(tr('Raporu'), M, 108)
      st(TEAL); doc.setFontSize(13); doc.setFont('helvetica','normal')
      doc.text(tr(kullanici?.tenant||''), M, 122)
      st(GRAY); doc.setFontSize(10)
      doc.text(tr(tarih), M, 132)
      doc.text(tr(SEKTOR_ETIKET[sektor]||''), M, 140)

      const skorRenk = rk(ortSkor)
      st(skorRenk); doc.setFontSize(96); doc.setFont('helvetica','bold')
      doc.text(tr(String(ortSkor)), M, 225)
      st(GRAY); doc.setFontSize(11); doc.setFont('helvetica','normal')
      doc.text(tr('Ag Ortalamasi  ' + formlar.length + ' birim  /100'), M, 237)
      st(skorRenk); doc.setFontSize(13); doc.setFont('helvetica','bold')
      doc.text(tr(getRiskEtiket(ortSkor)), M, 248)

      sf([20,30,50]); doc.rect(0,278,W,19,'F')
      st(GRAY); doc.setFontSize(8); doc.setFont('helvetica','normal')
      doc.text(tr('OMNI Kurumsal Dayaniklilik Platformu'), M, 290)
      doc.text(tr('ITU AYM is birligiyle gelistirilmistir'), W-M, 290,'right')

      // SAYFA 2 — ÖZET
      doc.addPage(); y=22
      sf(NAVY); doc.rect(0,0,W,12,'F')
      st(GRAY); doc.setFontSize(7); doc.setFont('helvetica','normal')
      doc.text(tr('OMNI'),M,8); doc.text(tr('Gizli'),W-M,8,'right')

      st(NAVY); doc.setFontSize(18); doc.setFont('helvetica','bold')
      doc.text(tr('Yonetici Ozeti'),M,y); y+=10

      const kpis = [
        {l:'Toplam Birim',v:String(formlar.length),c:NAVY},
        {l:'Kritik',      v:String(kritik.length), c:RED},
        {l:'Orta Risk',   v:String(orta.length),   c:AMBER},
        {l:'Guclu',       v:String(guclu.length),  c:GREEN},
      ]
      const bw = (W-2*M-9)/4
      kpis.forEach((k,i) => {
        const bx = M+i*(bw+3)
        sf(LITE); doc.setDrawColor(230,228,226); doc.setLineWidth(0.3)
        doc.roundedRect(bx,y,bw,22,2,2,'FD')
        st(k.c); doc.setFontSize(20); doc.setFont('helvetica','bold')
        doc.text(tr(k.v),bx+bw/2,y+13,{align:'center'})
        st(GRAY); doc.setFontSize(7); doc.setFont('helvetica','normal')
        doc.text(tr(k.l),bx+bw/2,y+19,{align:'center'})
      }); y+=28

      st(GRAY); doc.setFontSize(8); doc.setFont('helvetica','bold')
      doc.text(tr('RISK DAGILIMI'),M,y); y+=5
      const barW=W-2*M
      const kp=formlar.length?kritik.length/formlar.length:0
      const op=formlar.length?orta.length/formlar.length:0
      const gp=formlar.length?guclu.length/formlar.length:0
      sf(RED);   doc.rect(M,y,barW*kp,8,'F')
      sf(AMBER); doc.rect(M+barW*kp,y,barW*op,8,'F')
      sf(GREEN); doc.rect(M+barW*kp+barW*op,y,barW*gp,8,'F')
      st(WHITE); doc.setFontSize(7); doc.setFont('helvetica','bold')
      if(kp>0.08)doc.text(tr(Math.round(kp*100)+'%'),M+barW*kp/2,y+5.5,{align:'center'})
      if(op>0.08)doc.text(tr(Math.round(op*100)+'%'),M+barW*kp+barW*op/2,y+5.5,{align:'center'})
      if(gp>0.08)doc.text(tr(Math.round(gp*100)+'%'),M+barW*(kp+op)+barW*gp/2,y+5.5,{align:'center'})
      y+=14

      st(GRAY); doc.setFontSize(8); doc.setFont('helvetica','bold')
      doc.text(tr('HFE BILESEN ANALIZI'),M,y); y+=5
      const hfe=[{l:'H Tehlike',v:ortH,c:AMBER},{l:'F Kirilganlik',v:ortF,c:RED},{l:'E Kapasite',v:ortE,c:[59,130,246] as [number,number,number]}]
      hfe.forEach(h=>{
        st(NAVY); doc.setFontSize(8); doc.setFont('helvetica','normal')
        doc.text(tr(h.l),M,y+4)
        sf([230,228,226]); doc.rect(M+40,y,100,5,'F')
        sf(h.c); doc.rect(M+40,y,h.v,5,'F')
        st(h.c); doc.setFontSize(8); doc.setFont('helvetica','bold')
        doc.text(tr(String(h.v)),M+145,y+4)
        y+=9
      }); y+=6

      st(GRAY); doc.setFontSize(8); doc.setFont('helvetica','bold')
      doc.text(tr('SENARYO DAGILIMI'),M,y); y+=5
      Object.entries(senaryoDagilim).sort((a,b)=>b[1]-a[1]).forEach(([s,c])=>{
        const pct=formlar.length?c/formlar.length:0
        sf(LITE); doc.rect(M,y,W-2*M,7,'F')
        sf(TEAL); doc.rect(M,y,(W-2*M)*pct,7,'F')
        st(NAVY); doc.setFontSize(7); doc.setFont('helvetica','normal')
        doc.text(tr(s),M+2,y+4.8)
        doc.text(tr(c+' birim  %'+Math.round(pct*100)),W-M-2,y+4.8,{align:'right'})
        y+=9
      }); y+=4

      if(ilListesi.length>0){
        st(GRAY); doc.setFontSize(8); doc.setFont('helvetica','bold')
        doc.text(tr('EN RISKLI 10 IL'),M,y); y+=5
        sf(NAVY); doc.rect(M,y,W-2*M,7,'F')
        st(WHITE); doc.setFontSize(7); doc.setFont('helvetica','bold')
        doc.text(tr('Il'),M+2,y+4.8); doc.text(tr('Sube'),M+55,y+4.8)
        doc.text(tr('Kritik'),M+78,y+4.8); doc.text(tr('Ort'),M+100,y+4.8); doc.text(tr('Seviye'),M+118,y+4.8)
        y+=7
        ilListesi.forEach(([il,d],i)=>{
          sf(i%2===0?WHITE:LITE); doc.rect(M,y,W-2*M,7,'F')
          const rc=rk(d.ort)
          st(NAVY); doc.setFontSize(7); doc.setFont('helvetica','normal')
          doc.text(tr(il),M+2,y+4.8); doc.text(tr(String(d.toplam)),M+55,y+4.8)
          st(d.kritik>0?RED:NAVY); doc.text(tr(String(d.kritik)),M+78,y+4.8)
          st(rc); doc.setFont('helvetica','bold'); doc.text(tr(String(d.ort)),M+100,y+4.8)
          doc.setFont('helvetica','normal'); doc.text(tr(getRiskEtiket(d.ort)),M+118,y+4.8)
          y+=7
        })
      }

      // SAYFA 3 — ACİL LİSTE
      doc.addPage()
      sf(NAVY); doc.rect(0,0,W,12,'F')
      st(GRAY); doc.setFontSize(7); doc.setFont('helvetica','normal')
      doc.text(tr('OMNI'),M,8); doc.text(tr('Gizli'),W-M,8,'right')
      y=22
      st(NAVY); doc.setFontSize(18); doc.setFont('helvetica','bold')
      doc.text(tr('Acil Mudahale Gerektiren Birimler'),M,y); y+=4
      st(GRAY); doc.setFontSize(9); doc.setFont('helvetica','normal')
      doc.text(tr(kritik.length+' kritik birim tespit edildi'),M,y+5); y+=14

      sf(NAVY); doc.rect(M,y,W-2*M,8,'F')
      st(WHITE); doc.setFontSize(7.5); doc.setFont('helvetica','bold')
      doc.text(tr('#'),M+2,y+5.5); doc.text(tr('Birim'),M+10,y+5.5)
      doc.text(tr('Il'),M+35,y+5.5); doc.text(tr('Senaryo'),M+70,y+5.5)
      doc.text(tr('H'),M+118,y+5.5); doc.text(tr('F'),M+128,y+5.5); doc.text(tr('E'),M+138,y+5.5)
      doc.text(tr('Skor'),M+150,y+5.5); doc.text(tr('Seviye'),M+162,y+5.5)
      y+=8

      enKritik.forEach((f,i)=>{
        if(y>270){doc.addPage();y=20}
        const rc=rk(f.dayaniklilik_skoru)
        sf(i%2===0?WHITE:LITE); doc.rect(M,y,W-2*M,9,'F')
        st(GRAY); doc.setFontSize(7); doc.setFont('helvetica','normal')
        doc.text(tr(String(i+1)),M+2,y+6)
        st(NAVY); doc.setFont('helvetica','bold')
        doc.text(tr(f.birim_kodu),M+10,y+6)
        st(GRAY); doc.setFont('helvetica','normal')
        doc.text(tr((f as any).il_adi||''),M+35,y+6)
        doc.text(tr(f.senaryo),M+70,y+6)
        st(AMBER); doc.text(tr(String(f.h_skoru||0)),M+118,y+6)
        st(RED);   doc.text(tr(String(f.f_skoru||0)),M+128,y+6)
        st([59,130,246]); doc.text(tr(String(f.e_skoru||0)),M+138,y+6)
        st(rc); doc.setFont('helvetica','bold')
        doc.text(tr(String(f.dayaniklilik_skoru)),M+150,y+6)
        doc.setFontSize(6.5); doc.text(tr(getRiskEtiket(f.dayaniklilik_skoru)),M+162,y+6)
        doc.setFontSize(7); y+=9
      })

      y+=8
      if(y>240){doc.addPage();y=20}
      sf(LITE); doc.setDrawColor(230,228,226); doc.setLineWidth(0.3)
      doc.roundedRect(M,y,W-2*M,55,3,3,'FD')
      st(TEAL); doc.setFontSize(10); doc.setFont('helvetica','bold')
      doc.text(tr('Oncelikli Aksiyon Onerileri'),M+5,y+9)
      st(NAVY); doc.setFontSize(8); doc.setFont('helvetica','normal')
      const oneriler=[
        '1. '+kritik.length+' kritik birimdeki BCM planlari oncelikli olarak guncellenmeli',
        '2. Tehlike (H) ortalamasi '+ortH+' — bina guclendirme ve erken uyari sistemleri gozden gecirilmeli',
        '3. Kirilganlik (F) '+ortF+' — tedarik zinciri alternatifleri ve BCP anlasmalari yenilenmeli',
        '4. Kapasite (E) '+ortE+' — personel egitimleri ve tatbikatlar periyodik yapilmali',
        '5. Il bazli onceliklendirme icin CBS Risk Haritasi duzenli izlenmeli',
      ]
      oneriler.forEach((o,i)=>{ doc.text(tr(o),M+5,y+17+i*8) })

      const pc=doc.getNumberOfPages()
      for(let p=1;p<=pc;p++){
        doc.setPage(p)
        sf(LITE); doc.rect(0,287,W,10,'F')
        st(GRAY); doc.setFontSize(7); doc.setFont('helvetica','normal')
        doc.text(tr('OMNI  '+( kullanici?.tenant||'')+' - '+tarih),M,293)
        doc.text(tr('Sayfa '+p+' / '+pc),W-M,293,'right')
      }

      const fn='OMNI_Rapor_'+( kullanici?.tenant||'').replace(/\s/g,'_')+'_'+new Date().toISOString().slice(0,10)+'.pdf'
      doc.save(fn)
    } catch(e) {
      console.error(e)
      alert('PDF olusturulurken hata olustu.')
    } finally {
      setIndiriliyor(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50" style={{fontFamily:"'DM Sans',sans-serif"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        .fd{font-family:'Playfair Display',serif}
        .fm{font-family:'DM Mono',monospace}
      `}</style>
      <nav className="bg-white border-b border-stone-200 px-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <a href="/ana-sayfa" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-stone-900 flex items-center justify-center">
                <span className="text-white font-bold text-xs fd">R</span>
              </div>
              <span className="fd font-bold text-stone-900">OMNI</span>
            </a>
            <div className="hidden sm:flex items-center gap-1 text-sm">
              {[
                {label:'Yonetim Ozeti',href:'/board/ozet',    aktif:false},
                {label:'Uzman Paneli', href:'/uzman/dashboard',aktif:false},
                {label:'Risk Haritasi',href:'/harita',         aktif:false},
                {label:'PDF Rapor',    href:'/board/rapor',    aktif:true},
              ].map(l=>(
                <a key={l.label} href={l.href}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${l.aktif?'bg-stone-100 text-stone-900':'text-stone-500 hover:text-stone-900 hover:bg-stone-50'}`}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-stone-700">{kullanici?.ad_soyad}</div>
              <div className="text-[10px] text-stone-400">{kullanici?.tenant}</div>
            </div>
            <button onClick={oturumKapat} className="text-xs text-stone-400 hover:text-stone-700 border border-stone-200 px-3 py-1.5 rounded-lg transition">Cikis</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="fm text-xs text-stone-400 uppercase tracking-widest mb-1">{SEKTOR_ETIKET[sektor]}</p>
            <h1 className="fd text-3xl font-bold text-stone-900">PDF Rapor</h1>
            <p className="text-stone-400 text-sm mt-1">{kullanici?.tenant} - {tarih}</p>
          </div>
          <button onClick={pdfIndir} disabled={yukleniyor||indiriliyor}
            className="flex items-center gap-3 px-6 py-3 rounded-xl text-white font-semibold text-sm transition disabled:opacity-50"
            style={{background:indiriliyor?'#6b7280':'#0f172a'}}>
            {indiriliyor?(
              <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Hazirlaniyor...</>
            ):(
              <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>PDF Indir</>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-stone-900 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-5" style={{background:'#009B8D',transform:'translate(30%,-30%)'}}/>
              <p className="fm text-xs text-teal-400 uppercase tracking-widest mb-1">Sayfa 1</p>
              <p className="fm text-xs text-stone-500 mb-6">Kapak Sayfasi</p>
              <div className="fd text-4xl font-bold mb-2">Kurumsal Dayaniklilik</div>
              <div className="fd text-4xl font-bold mb-6">Raporu</div>
              <div className="text-teal-400 font-semibold mb-1">{kullanici?.tenant}</div>
              <div className="text-stone-400 text-sm">{tarih}</div>
              <div className="fd mt-8 font-bold" style={{fontSize:64,lineHeight:'1',color:getRiskRenk(ortSkor)}}>{ortSkor}</div>
              <div className="text-stone-400 text-sm mt-1">Ag Ortalamasi - {formlar.length} birim</div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-6">
              <p className="fm text-xs text-stone-400 uppercase tracking-widest mb-4">Sayfa 2 - Yonetici Ozeti</p>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  {l:'Toplam',v:formlar.length,c:'text-stone-900'},
                  {l:'Kritik', v:kritik.length, c:'text-red-500'},
                  {l:'Orta',   v:orta.length,   c:'text-amber-500'},
                  {l:'Guclu',  v:guclu.length,  c:'text-green-500'},
                ].map(k=>(
                  <div key={k.l} className="bg-stone-50 rounded-xl p-3 text-center">
                    <div className={`fd text-2xl font-bold ${k.c}`}>{k.v}</div>
                    <div className="text-xs text-stone-400">{k.l}</div>
                  </div>
                ))}
              </div>
              <div className="flex h-3 rounded-full overflow-hidden gap-0.5 mb-4">
                {kritik.length>0&&<div className="bg-red-500"   style={{width:`${(kritik.length/formlar.length)*100}%`}}/>}
                {orta.length>0  &&<div className="bg-amber-400" style={{width:`${(orta.length/formlar.length)*100}%`}}/>}
                {guclu.length>0 &&<div className="bg-green-500" style={{width:`${(guclu.length/formlar.length)*100}%`}}/>}
              </div>
              <div className="space-y-2">
                {[{l:'H Tehlike',v:ortH,c:'bg-orange-400'},{l:'F Kirilganlik',v:ortF,c:'bg-red-400'},{l:'E Kapasite',v:ortE,c:'bg-blue-400'}].map(h=>(
                  <div key={h.l} className="flex items-center gap-3">
                    <span className="text-xs text-stone-500 w-24">{h.l}</span>
                    <div className="flex-1 bg-stone-100 rounded-full h-2 overflow-hidden">
                      <div className={`h-full rounded-full ${h.c}`} style={{width:`${h.v}%`}}/>
                    </div>
                    <span className="fm text-xs font-bold text-stone-700 w-6 text-right">{h.v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-6">
              <p className="fm text-xs text-stone-400 uppercase tracking-widest mb-4">Sayfa 3 - Acil Mudahale Listesi</p>
              <div className="space-y-1.5">
                {enKritik.slice(0,5).map((f,i)=>(
                  <div key={f.id} className="flex items-center gap-3 px-3 py-2 bg-stone-50 rounded-lg">
                    <span className="fm text-xs text-stone-300 w-4">{i+1}</span>
                    <div className="w-1 h-6 rounded-full" style={{background:getRiskRenk(f.dayaniklilik_skoru)}}/>
                    <span className="fm text-xs font-bold text-stone-800 w-14">{f.birim_kodu}</span>
                    <span className="text-xs text-stone-400 flex-1">{(f as any).il_adi||'—'} - {f.senaryo}</span>
                    <span className="fd text-lg font-bold" style={{color:getRiskRenk(f.dayaniklilik_skoru)}}>{f.dayaniklilik_skoru}</span>
                  </div>
                ))}
                {enKritik.length>5&&<div className="text-xs text-stone-400 text-center py-1">+ {enKritik.length-5} birim daha PDF'de</div>}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white border border-stone-200 rounded-2xl p-5">
              <p className="fm text-xs text-stone-400 uppercase tracking-widest mb-4">Rapor Icerigi</p>
              <div className="space-y-3">
                {[
                  {s:'1',t:'Kapak Sayfasi',      a:'Kurum adi, tarih, genel skor'},
                  {s:'2',t:'Yonetici Ozeti',      a:'KPI, dagilim, HFE, il analizi'},
                  {s:'3',t:'Kritik Birim Listesi',a:kritik.length+' kritik birim detayi'},
                  {s:'+',t:'Aksiyon Onerileri',   a:'Oncelikli iyilestirme adimlari'},
                ].map(r=>(
                  <div key={r.s} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0">
                      <span className="fm text-xs font-bold text-stone-600">{r.s}</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-stone-800">{r.t}</div>
                      <div className="text-xs text-stone-400">{r.a}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-stone-900 rounded-2xl p-5 text-white">
              <p className="fm text-xs text-teal-400 uppercase tracking-widest mb-3">Ozet</p>
              <div className="space-y-2">
                {[
                  {l:'Birim sayisi',  v:String(formlar.length), c:'text-white'},
                  {l:'Ag ortalamasi', v:String(ortSkor),         c:''},
                  {l:'Kritik birim',  v:String(kritik.length),   c:'text-red-400'},
                  {l:'Format',        v:'A4 PDF',                c:'text-white'},
                ].map(item=>(
                  <div key={item.l} className="flex justify-between text-sm">
                    <span className="text-stone-400">{item.l}</span>
                    <span className={`font-bold ${item.c}`} style={item.l==='Ag ortalamasi'?{color:getRiskRenk(ortSkor)}:{}}>{item.v}</span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={pdfIndir} disabled={yukleniyor||indiriliyor}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
              style={{background:'#009B8D'}}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              {indiriliyor?'Olusturuluyor...':'PDF Indir'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}