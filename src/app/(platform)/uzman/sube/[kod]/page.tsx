'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getRiskRenk, getRiskEtiket, type FormCevabi } from '@/types'
import { Building2, Zap, Shield, Droplets, AlertTriangle, CheckCircle, Clock, XCircle, Activity } from 'lucide-react'

const KATEGORI_IKON = (id: string) => {
  if (id === 'deprem') return <Building2 size={16} color="#EF4444"/>
  if (id === 'yangin') return <Zap size={16} color="#F97316"/>
  if (id === 'siber') return <Shield size={16} color="#8B5CF6"/>
  if (id === 'sel') return <Droplets size={16} color="#0EA5E9"/>
  return <AlertTriangle size={16}/>
}

const DURUM_IKON = (durum: string) => {
  if (durum === 'tamamlandi') return <CheckCircle size={14} color="#22C55E"/>
  if (durum === 'devam') return <Clock size={14} color="#F97316"/>
  if (durum === 'gecikti') return <XCircle size={14} color="#EF4444"/>
  return <Activity size={14} color="#94A3B8"/>
}

type Sekme = 'overview' | 'gap' | 'aksiyonlar' | 'bcp'

// ── Demo veri ────────────────────────────────────────────────────────────────
const DEMO_AKSIYONLAR = [
  { id:'A1', baslik:'Deprem Tatbikatı Gerçekleştir', kategori:'Deprem', departman:'İnsan Kaynakları', sorumlu:'Selin Aydın', email:'s.aydin@akbank.com', tarih:'2025-10-25', durum:'gecikti', oncelik:1, ilerleme:0 },
  { id:'A2', baslik:'Yedekli IT Altyapısı Kur', kategori:'Siber Saldırı', departman:'Bilgi Teknolojileri', sorumlu:'Zeynep Kara', email:'z.kara@akbank.com', tarih:'2025-11-15', durum:'devam', oncelik:2, ilerleme:45 },
  { id:'A3', baslik:'İş Sürekliliği Planı Güncelle', kategori:'Genel', departman:'Risk Yönetimi', sorumlu:'Elif Yıldız', email:'e.yildiz@akbank.com', tarih:'2025-11-25', durum:'tamamlandi', oncelik:2, ilerleme:100 },
  { id:'A4', baslik:'Sismik Güçlendirme Fizibilite', kategori:'Deprem', departman:'Yapı İşleri', sorumlu:'Mehmet Yılmaz', email:'m.yilmaz@akbank.com', tarih:'2025-11-30', durum:'devam', oncelik:1, ilerleme:30 },
  { id:'A5', baslik:'Acil Komuta Merkezi Kur', kategori:'Genel', departman:'Operasyon', sorumlu:'Ahmet Şahin', email:'a.sahin@akbank.com', tarih:'2025-12-01', durum:'baslamamis', oncelik:0, ilerleme:0 },
  { id:'A6', baslik:'Hava Erken Uyarı Sistemi', kategori:'Sel', departman:'Yapı İşleri', sorumlu:'Burak Arslan', email:'b.arslan@akbank.com', tarih:'2025-12-30', durum:'devam', oncelik:1, ilerleme:20 },
]

const DEMO_BCP_SENARYOLAR = [
  { baslik:'Büyük Deprem (M7.0+) İstanbul', olasilik:'Yüksek', etki:'Çok Yüksek', rto:'72 saat', rpo:'24 saat', beklenen_sure:'2–4 hafta', son_guncelleme:'2025-09-01', son_tatbikat:'2025-08-22',
    tetikleyiciler:['M7.0+ sismik aktivite','AFAD kırmızı alarm','Yapısal hasar tespit','Çoklu yaralanma'],
    varliklar:['Şube Binası','ATM Köşkü','IT Altyapısı','Yedek Güç Sistemi'],
    fazlar:[
      { baslik:'Acil Müdahale (0–4 saat)', ekip:'Acil Müdahale Ekibi', adimlar:['Acil ekibi aktive et','Güvenlik taraması ve sayım','İlk yardım uygula','Tehlikeli maddeleri güvene al','Acil komuta merkezi kur'] },
      { baslik:'Değerlendirme & Stabilizasyon (4–24 saat)', ekip:'İş Sürekliliği Ekibi', adimlar:['Yapısal hasar tespiti','IT sistemleri ve veri bütünlüğü değerlendirmesi','Sigorta ve otoriteleri bilgilendir','Yedek tesisleri aktive et','Kritik operasyonları başlat'] },
      { baslik:'Kurtarma Operasyonları (1–7 gün)', ekip:'Operasyon Ekibi', adimlar:['Tam iş sürekliliği uygula','IT altyapısını geri yükle','Müşteri iletişimini sürdür','Hasar tespiti raporla'] },
    ]
  },
  { baslik:'Siber Saldırı / Ransomware', olasilik:'Orta', etki:'Yüksek', rto:'48 saat', rpo:'12 saat', beklenen_sure:'1–2 hafta', son_guncelleme:'2025-08-15', son_tatbikat:'2025-07-10',
    tetikleyiciler:['Sistem erişim anomalisi','BDDK siber alarm','Veri sızıntısı tespiti','Core banking erişim kaybı'],
    varliklar:['Core Banking Sistemi','Müşteri Verileri','ATM Ağı','İnternet Bankacılığı'],
    fazlar:[
      { baslik:'İzolasyon & Değerlendirme (0–2 saat)', ekip:'Siber Güvenlik Ekibi', adimlar:['Etkilenen sistemleri izole et','Saldırı kapsamını belirle','BDDK ve BKM bildirim yapısını aktive et','Yedek sistemlere geç'] },
      { baslik:'Kurtarma & İletişim (2–24 saat)', ekip:'IT Kriz Ekibi', adimlar:['Temiz yedeklerden geri yükle','Müşterileri bilgilendir','Yasal bildirimleri tamamla'] },
    ]
  },
]

const DEMO_PERSONEL = [
  { ad:'Ahmet Yılmaz', unvan:'Şube Müdürü', departman:'Yönetim', rol:'Kriz Yönetim Direktörü', tel:'+90 532 XXX 1111', gorevler:['Genel kriz koordinasyonu','Üst yönetim iletişimi','Karar alma yetkisi','Paydaş iletişimi'] },
  { ad:'Ayşe Demir', unvan:'Operasyon Müdürü', departman:'Operasyon', rol:'Acil Operasyon Koordinatörü', tel:'+90 532 XXX 2222', gorevler:['Acil operasyon koordinasyonu','Saha güvenlik yönetimi','Kurtarma operasyonu'] },
  { ad:'Zeynep Kara', unvan:'BT Müdürü', departman:'Bilgi Teknolojileri', rol:'IT Felaket Kurtarma Lideri', tel:'+90 532 XXX 3333', gorevler:['IT sistemleri kurtarma','Veri yedekleme yönetimi','Siber güvenlik müdahalesi'] },
  { ad:'Mehmet Şahin', unvan:'Güvenlik Amiri', departman:'Güvenlik', rol:'Tahliye & Güvenlik Koordinatörü', tel:'+90 532 XXX 4444', gorevler:['Tahliye prosedürleri','İlk yardım koordinasyonu','Güvenlik ekipmanı yönetimi'] },
  { ad:'Elif Aydın', unvan:'İletişim Direktörü', departman:'Kurumsal İletişim', rol:'Kriz İletişim Lideri', tel:'+90 532 XXX 5555', gorevler:['İç iletişim koordinasyonu','Dış iletişim ve medya ilişkileri','Müşteri bildirimleri'] },
]

const DEMO_EGITIMLER = [
  { tarih:'2026-08-15', baslik:'Yıllık Deprem Tatbikatı', amac:'Tam ölçekli deprem acil tatbikatı — tahliye, toplanma noktası ve sayım prosedürleri', tip:'Tatbikat', sure:'2 saat', katilimci:'Tüm Personel' },
  { tarih:'2026-03-10', baslik:'Yangın Güvenliği & Tahliye Eğitimi', amac:'Yangın söndürücü kullanımı, tahliye güzergahları ve toplanma noktası prosedürleri', tip:'Workshop', sure:'3 saat', katilimci:'Tüm Personel' },
  { tarih:'2025-12-05', baslik:'Siber Güvenlik Olay Müdahalesi', amac:'IT ekibi için simüle edilmiş ransomware saldırısı müdahale tatbikatı', tip:'Masa Başı Tatbikat', sure:'4 saat', katilimci:'IT Departmanı' },
  { tarih:'2026-07-01', baslik:'İş Sürekliliği Farkındalık Eğitimi', amac:'BCP temelleri, roller, sorumluluklar ve acil prosedürler e-öğrenme modülü', tip:'Online Kurs', sure:'1 saat', katilimci:'Tüm Yöneticiler' },
  { tarih:'2026-06-15', baslik:'İlk Yardım & Acil Müdahale', amac:'CPR, yara bakımı ve acil tıbbi müdahale sertifika eğitimi', tip:'Workshop', sure:'8 saat', katilimci:'Acil Müdahale Ekibi' },
]

const GAP_KATEGORILER = [
  { id:'deprem', label:'Deprem', ikon:'🏚️', renk:'#EF4444', sorular:[
    { id:'H1', label:'Deprem Risk Bölgesi', puan:85, hedef:80, aciklama:'Konum bazlı sismik tehlike skoru' },
    { id:'F3', label:'Zemin Etüdü', puan:40, hedef:75, aciklama:'Son 5 yılda gerçekleştirilmiş etüt' },
    { id:'F4', label:'Yapısal Dayanıklılık', puan:55, hedef:80, aciklama:'Bina sismik güçlendirme durumu' },
    { id:'E3', label:'Sismik Sensör', puan:30, hedef:70, aciklama:'Erken uyarı sistemi varlığı' },
    { id:'E4', label:'Tatbikat Sıklığı', puan:60, hedef:80, aciklama:'Yıllık deprem tatbikat sayısı' },
  ]},
  { id:'yangin', label:'Yangın', ikon:'🔥', renk:'#F97316', sorular:[
    { id:'E5', label:'Yangın Dedektörü', puan:90, hedef:90, aciklama:'Dedektör kapsam yüzdesi' },
    { id:'E6', label:'Sprinkler Sistemi', puan:85, hedef:90, aciklama:'Sprinkler kapsam ve bakım durumu' },
    { id:'E7', label:'Tahliye Planı', puan:75, hedef:85, aciklama:'Belgelenmiş tahliye prosedürü' },
    { id:'E8', label:'Personel Eğitimi', puan:65, hedef:80, aciklama:'Son 1 yıl yangın eğitim katılımı' },
  ]},
  { id:'siber', label:'Siber', ikon:'💻', renk:'#8B5CF6', sorular:[
    { id:'E9', label:'Yedek Sistem', puan:45, hedef:85, aciklama:'Yedekli IT altyapısı varlığı' },
    { id:'E10', label:'Güvenlik Duvarı', puan:70, hedef:90, aciklama:'Katmanlı güvenlik duvarı yapılandırması' },
    { id:'E11', label:'Veri Yedekleme', puan:80, hedef:90, aciklama:'Otomatik yedekleme sıklığı ve test durumu' },
    { id:'E12', label:'Sızma Testi', puan:35, hedef:75, aciklama:'Son 12 ayda gerçekleştirilen pentest' },
  ]},
  { id:'sel', label:'Sel', ikon:'🌊', renk:'#0EA5E9', sorular:[
    { id:'H4', label:'Taşkın Riski Bölgesi', puan:60, hedef:70, aciklama:'AFAD taşkın risk haritası konumu' },
    { id:'F6', label:'Drenaj Sistemi', puan:50, hedef:70, aciklama:'Bina çevresi drenaj kapasitesi' },
    { id:'E13', label:'Erken Uyarı', puan:25, hedef:65, aciklama:'Meteorolojik erken uyarı sistemi entegrasyonu' },
  ]},
]

const SENARYO_SKORLAR_OFFSET: Record<string, number> = {
  'Deprem':-12, 'Yangın':+8, 'Sel / Taşkın':-5, 'Siber Saldırı':-18, 'Elektrik Kesintisi':+3, 'Pandemi / Salgın':-8,
}

export default function SubeDetay() {
  const params = useParams()
  const kod = params?.kod as string
  const [sekme, setSekme] = useState<Sekme>('overview')
  const [formlar, setFormlar] = useState<FormCevabi[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [aktifGap, setAktifGap] = useState('deprem')
  const [aktifSenaryo, setAktifSenaryo] = useState(0)
  const [aktifBcpSekme, setAktifBcpSekme] = useState<'senaryolar'|'planlar'|'personel'|'egitim'>('senaryolar')
  const [aramaAksiyon, setAramaAksiyon] = useState('')
  const [filtreDurum, setFiltreDurum] = useState('tumu')
  const [filtreOncelik, setFiltreOncelik] = useState('tumu')

  useEffect(() => {
    supabase.from('form_cevaplari').select('*')
      .eq('birim_kodu', kod).eq('durum', 'gonderildi')
      .order('gonderilme', { ascending: false })
      .then(({ data }) => { setFormlar(data || []); setYukleniyor(false) })
  }, [kod])

  const sonForm = formlar[0]
  const skor = sonForm?.dayaniklilik_skoru ?? 0
  const hSkor = sonForm?.h_skoru ?? 0
  const fSkor = sonForm?.f_skoru ?? 0
  const eSkor = sonForm?.e_skoru ?? 0
  const riskRenk = getRiskRenk(skor)
  const riskEtiket = getRiskEtiket(skor)
  const tarih = new Date().toLocaleDateString('tr-TR', { day:'numeric', month:'long', year:'numeric' })

  const senaryoSkorlar = Object.entries(SENARYO_SKORLAR_OFFSET).map(([sn, offset]) => ({
    ad: sn, skor: Math.max(10, Math.min(95, skor + offset))
  }))

  const durumRenk: Record<string, string> = { gecikti:'#EF4444', devam:'#F59E0B', tamamlandi:'#22C55E', baslamamis:'#94A3B8' }
  const durumLabel: Record<string, string> = { gecikti:'Gecikti', devam:'Devam Ediyor', tamamlandi:'Tamamlandı', baslamamis:'Başlamadı' }
  const oncelikRenk: Record<number, string> = { 0:'#94A3B8', 1:'#F59E0B', 2:'#EF4444' }
  const oncelikLabel: Record<number, string> = { 0:'Normal', 1:'Yüksek', 2:'Kritik' }

  const gapKat = GAP_KATEGORILER.find(k => k.id === aktifGap)!
  const gapSkorlar = gapKat.sorular
  const gapOrt = Math.round(gapSkorlar.reduce((a,s)=>a+s.puan,0) / gapSkorlar.length)
  const gapHedefOrt = Math.round(gapSkorlar.reduce((a,s)=>a+s.hedef,0) / gapSkorlar.length)
  const gapBosluk = gapSkorlar.filter(s=>s.puan<s.hedef).length

  const filtrelenmisAksiyonlar = DEMO_AKSIYONLAR
    .filter(a => filtreDurum === 'tumu' || a.durum === filtreDurum)
    .filter(a => filtreOncelik === 'tumu' || a.oncelik === Number(filtreOncelik))
    .filter(a => !aramaAksiyon || a.baslik.toLowerCase().includes(aramaAksiyon.toLowerCase()))

  const aksiyonIlerleme = Math.round(DEMO_AKSIYONLAR.reduce((a,b)=>a+b.ilerleme,0) / DEMO_AKSIYONLAR.length)

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    .fd{font-family:'Playfair Display',serif}
    .fm{font-family:'DM Mono',monospace}
    .pb{background:#F1F0EF;border-radius:99px;overflow:hidden}
    .pf{height:100%;border-radius:99px;transition:width .7s cubic-bezier(.4,0,.2,1)}
    .bdg{display:inline-flex;align-items:center;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:600;line-height:1.6}
    .card{background:white;border-radius:14px;border:1px solid #ECEAE8}
    .sb{padding:9px 18px;border:none;background:transparent;cursor:pointer;font-size:13px;font-weight:500;color:#9CA3AF;border-bottom:2px solid transparent;transition:all .2s;font-family:'DM Sans',sans-serif;white-space:nowrap}
    .sb.on{color:#0A1628;border-bottom-color:#1B4FD8;font-weight:600}
    .sb:hover:not(.on){color:#374151}
    .bsb{padding:7px 14px;border-radius:8px;border:1px solid #E5E3E1;background:white;cursor:pointer;font-size:12px;font-weight:500;color:#6B7280;transition:all .15s;font-family:'DM Sans',sans-serif}
    .bsb.on{border-color:#1B4FD8;background:#EFF6FF;color:#1B4FD8;font-weight:600}
    .bsb:hover:not(.on){background:#FAFAF9}
    .row-hover:hover{background:#FAFAF9}
    .ikincil-sb{padding:6px 14px;border-radius:20px;border:1px solid #E5E3E1;background:white;cursor:pointer;font-size:12px;font-weight:500;color:#6B7280;transition:all .15s;font-family:'DM Sans',sans-serif}
    .ikincil-sb.on{border-color:transparent;background:#0A1628;color:white;font-weight:600}
    .scen-card{border-radius:12px;border:1px solid #E5E3E1;padding:18px;cursor:pointer;transition:all .2s;background:white}
    .scen-card:hover{border-color:#CBD5E1;background:#FAFAF9}
    .scen-card.aktif{border-color:#1B4FD8;background:#EFF6FF}
    @keyframes fi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
    .fi{animation:fi .25s ease}
    input[type=text]{outline:none;border:1px solid #E5E3E1;border-radius:8px;padding:7px 12px;font-size:13px;font-family:'DM Sans',sans-serif;color:#1c1917;background:white}
    input[type=text]:focus{border-color:#1B4FD8;box-shadow:0 0 0 3px #EFF6FF}
    select{outline:none;border:1px solid #E5E3E1;border-radius:8px;padding:7px 12px;font-size:12px;font-family:'DM Sans',sans-serif;color:#374151;background:white;cursor:pointer}
    select:focus{border-color:#1B4FD8}
    .faz-satir{border-left:2px solid #E5E3E1;padding-left:16px;margin-left:6px;padding-bottom:20px}
    .faz-satir:last-child{padding-bottom:0}
    .faz-dot{width:12px;height:12px;border-radius:50%;background:#1B4FD8;margin-left:-22px;margin-top:2px;flex-shrink:0}
  `

  return (
    <div style={{minHeight:'100vh',background:'#F8F6F3',fontFamily:"'DM Sans',sans-serif"}}>
      <style dangerouslySetInnerHTML={{__html:css}} />

      {/* NAV */}
      <nav style={{background:'white',borderBottom:'1px solid #ECEAE8',padding:'0 32px',height:54,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:100}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <a href="/ana-sayfa" style={{display:'flex',alignItems:'center',gap:8,textDecoration:'none',marginRight:8}}>
            <div style={{width:28,height:28,borderRadius:8,background:'#0A1628',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span className="fd" style={{color:'white',fontWeight:700,fontSize:13}}>R</span>
            </div>
            <span className="fd" style={{fontWeight:800,color:'#0A1628',fontSize:15,letterSpacing:'-.3px'}}>OMNI</span>
          </a>
          <span style={{color:'#D1CEC9',fontSize:16,margin:'0 4px'}}>/</span>
          <a href="/uzman/dashboard" style={{fontSize:12,color:'#9CA3AF',textDecoration:'none',fontWeight:500,padding:'4px 8px',borderRadius:6,transition:'all .15s'}}
            onMouseEnter={e=>(e.currentTarget.style.color='#374151')} onMouseLeave={e=>(e.currentTarget.style.color='#9CA3AF')}>
            Uzman Paneli
          </a>
          <span style={{color:'#D1CEC9',fontSize:16,margin:'0 4px'}}>/</span>
          <span className="fm" style={{fontSize:11,fontWeight:700,color:'#0A1628',background:'#F1F0EF',padding:'3px 10px',borderRadius:6}}>{kod}</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:12,fontWeight:600,color:'#1c1917'}}>Uzman Görünümü</div>
            <div style={{fontSize:10,color:'#A8A29E'}}>Omniversel Platform</div>
          </div>
        </div>
      </nav>

      <div style={{maxWidth:1320,margin:'0 auto',padding:'28px 28px 72px'}}>

        {/* ÜSTTE — Şube Kimlik Bandı */}
        <div className="card" style={{padding:'20px 28px',marginBottom:20,display:'flex',alignItems:'center',justifyContent:'space-between'}} >
          <div style={{display:'flex',alignItems:'center',gap:20}}>
            <div style={{width:52,height:52,borderRadius:14,background:'#0A1628',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <span style={{fontSize:20}}>🏦</span>
            </div>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
                <h1 className="fd" style={{fontSize:22,fontWeight:800,color:'#0A1628',lineHeight:1}}>{kod}</h1>
                <span className="bdg" style={{background:'#EFF6FF',color:'#1B4FD8',fontSize:10}}>Bankacılık & Finans</span>
                {sonForm && <span className="bdg" style={{background:riskRenk+'15',color:riskRenk}}>{riskEtiket}</span>}
              </div>
              <div style={{display:'flex',alignItems:'center',gap:16,fontSize:12,color:'#9CA3AF'}}>
                <span>Akbank A.Ş.</span>
                <span>·</span>
                <span>Son Değerlendirme: {sonForm ? new Date(sonForm.gonderilme||'').toLocaleDateString('tr-TR') : '—'}</span>
                <span>·</span>
                <span>{formlar.length} form kaydı</span>
              </div>
            </div>
          </div>
          {/* 3 Skor Pill */}
          <div style={{display:'flex',gap:12}}>
            {[
              {l:'HFE-360',v:skor,r:riskRenk},
              {l:'Tehlike (H)',v:hSkor,r:'#EF4444'},
              {l:'Kırılganlık (F)',v:fSkor,r:'#F59E0B'},
              {l:'Kapasite (E)',v:eSkor,r:'#22C55E'},
            ].map(s=>(
              <div key={s.l} style={{textAlign:'center',padding:'10px 16px',background:'#FAFAF9',borderRadius:12,border:'1px solid #ECEAE8',minWidth:72}}>
                <div className="fm" style={{fontSize:22,fontWeight:700,color:s.r,lineHeight:1}}>{s.v}</div>
                <div style={{fontSize:10,color:'#9CA3AF',marginTop:4}}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ANA 2 KOLON LAYOUT */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:16,marginBottom:20}}>
          {/* Senaryo Skorlar */}
          <div className="card fi" style={{padding:20}}>
            <p className="fm" style={{fontSize:9,color:'#A8A29E',textTransform:'uppercase',letterSpacing:'.12em',marginBottom:14}}>Senaryo Bazlı Risk</p>
            {senaryoSkorlar.map(s=>(
              <div key={s.ad} style={{marginBottom:11}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
                  <span style={{fontSize:11,color:'#57534e',fontWeight:500}}>{s.ad}</span>
                  <span className="fm" style={{fontSize:11,fontWeight:700,color:getRiskRenk(s.skor)}}>{s.skor}</span>
                </div>
                <div className="pb" style={{height:5}}><div className="pf" style={{width:s.skor+'%',background:getRiskRenk(s.skor),height:5}} /></div>
              </div>
            ))}
          </div>

          {/* GAP Özeti */}
          <div className="card fi" style={{padding:20}}>
            <p className="fm" style={{fontSize:9,color:'#A8A29E',textTransform:'uppercase',letterSpacing:'.12em',marginBottom:14}}>GAP Kategoriler</p>
            {GAP_KATEGORILER.map(k=>{
              const ort = Math.round(k.sorular.reduce((a,s)=>a+s.puan,0)/k.sorular.length)
              const bosluk = k.sorular.filter(s=>s.puan<s.hedef).length
              return (
                <div key={k.id} style={{display:'flex',alignItems:'center',gap:12,marginBottom:12,cursor:'pointer',padding:'6px 8px',borderRadius:8,transition:'all .15s'}}
                  onClick={()=>{setSekme('gap');setAktifGap(k.id)}}
                  onMouseEnter={e=>e.currentTarget.style.background='#FAFAF9'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <span style={{flexShrink:0}}>{KATEGORI_IKON(k.id)}</span>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                      <span style={{fontSize:12,fontWeight:600,color:'#374151'}}>{k.label}</span>
                      <span className="fm" style={{fontSize:12,fontWeight:700,color:getRiskRenk(ort)}}>{ort}</span>
                    </div>
                    <div className="pb" style={{height:4}}><div className="pf" style={{width:ort+'%',background:getRiskRenk(ort),height:4}} /></div>
                  </div>
                  {bosluk>0&&<span className="bdg" style={{background:'#FEF2F2',color:'#EF4444',flexShrink:0}}>{bosluk} gap</span>}
                </div>
              )
            })}
          </div>

          {/* Aksiyon Özeti */}
          <div className="card fi" style={{padding:20}}>
            <p className="fm" style={{fontSize:9,color:'#A8A29E',textTransform:'uppercase',letterSpacing:'.12em',marginBottom:14}}>Aksiyon Durumu</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:14}}>
              {[
                {l:'Toplam',v:DEMO_AKSIYONLAR.length,r:'#0A1628'},
                {l:'Tamamlandı',v:DEMO_AKSIYONLAR.filter(a=>a.durum==='tamamlandi').length,r:'#22C55E'},
                {l:'Devam Eden',v:DEMO_AKSIYONLAR.filter(a=>a.durum==='devam').length,r:'#F59E0B'},
                {l:'Gecikti',v:DEMO_AKSIYONLAR.filter(a=>a.durum==='gecikti').length,r:'#EF4444'},
              ].map(k=>(
                <div key={k.l} style={{background:'#FAFAF9',borderRadius:10,padding:'10px 12px',border:'1px solid #F1F0EF'}}>
                  <div className="fd" style={{fontSize:20,fontWeight:800,color:k.r,lineHeight:1}}>{k.v}</div>
                  <div style={{fontSize:10,color:'#A8A29E',marginTop:3}}>{k.l}</div>
                </div>
              ))}
            </div>
            <div style={{marginBottom:6,display:'flex',justifyContent:'space-between'}}>
              <span style={{fontSize:11,color:'#6B7280',fontWeight:500}}>Genel İlerleme</span>
              <span className="fm" style={{fontSize:11,fontWeight:700,color:'#0A1628'}}>%{aksiyonIlerleme}</span>
            </div>
            <div className="pb" style={{height:7}}>
              <div className="pf" style={{width:aksiyonIlerleme+'%',height:7,background:'linear-gradient(90deg,#1B4FD8,#009B8D)'}} />
            </div>
            <button onClick={()=>setSekme('aksiyonlar')} style={{marginTop:14,width:'100%',padding:'8px',borderRadius:8,border:'1px solid #E5E3E1',background:'white',cursor:'pointer',fontSize:12,fontWeight:600,color:'#1B4FD8',fontFamily:"'DM Sans',sans-serif",transition:'all .15s'}}
              onMouseEnter={e=>e.currentTarget.style.background='#EFF6FF'} onMouseLeave={e=>e.currentTarget.style.background='white'}>
              Aksiyonlara Git →
            </button>
          </div>

          {/* Son Aktiviteler */}
          <div className="card fi" style={{padding:20}}>
            <p className="fm" style={{fontSize:9,color:'#A8A29E',textTransform:'uppercase',letterSpacing:'.12em',marginBottom:14}}>Son Aktiviteler</p>
            {[
              {i:'',l:'Son Risk Değerlendirmesi',v:sonForm?new Date(sonForm.gonderilme||'').toLocaleDateString('tr-TR'):'—'},
              {i:'',l:'Son Tatbikat',v:'22 Ağu 2025'},
              {i:'📄',l:'Son BCP Güncelleme',v:'30 Eyl 2025'},
              {i:'🔄',l:'Bu Yıl Tatbikat',v:'4 adet'},
              {i:'',l:'Personel Katılım',v:'%87.5'},
            ].map(it=>(
              <div key={it.l} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 0',borderBottom:'1px solid #F7F6F5'}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{fontSize:14}}>{it.i}</span>
                  <span style={{fontSize:11,color:'#6B7280'}}>{it.l}</span>
                </div>
                <span style={{fontSize:11,fontWeight:700,color:'#0A1628'}}>{it.v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SEKMELI DETAY PANELI */}
        <div className="card" style={{overflow:'hidden'}}>
          {/* Sekme başlıkları */}
          <div style={{borderBottom:'1px solid #F1F0EF',padding:'0 24px',display:'flex',gap:0,overflowX:'auto'}}>
            {([
              {id:'overview',label:' Genel Bakış'},
              {id:'gap',label:'🔍 GAP Analizi'},
              {id:'aksiyonlar',label:` Aksiyon Listesi (${DEMO_AKSIYONLAR.length})`},
              {id:'bcp',label:'🔁 İş Sürekliliği'},
            ] as {id:Sekme,label:string}[]).map(s=>(
              <button key={s.id} className={'sb'+(sekme===s.id?' on':'')} onClick={()=>setSekme(s.id)}>{s.label}</button>
            ))}
          </div>

          <div style={{padding:28}}>

            {/* ── GENEL BAKIŞ ──────────────────────────────────────────────────── */}
            {sekme==='overview' && (
              <div className="fi">
                <div style={{display:'grid',gridTemplateColumns:'3fr 2fr',gap:28}}>
                  <div>
                    <h3 className="fd" style={{fontSize:16,fontWeight:700,color:'#0A1628',marginBottom:12}}>Yönetici Özeti</h3>
                    <div style={{background:'#FAFAF9',borderRadius:12,padding:20,fontSize:13,color:'#57534e',lineHeight:1.75,marginBottom:20,border:'1px solid #F1F0EF'}}>
                      <strong style={{color:'#0A1628'}}>HFE-360 Değerlendirme Sonucu:</strong> Şube, kapsamlı değerlendirme metodolojisine göre{' '}
                      <strong style={{color:riskRenk,background:riskRenk+'12',padding:'1px 6px',borderRadius:4}}>{riskEtiket}</strong>{' '}
                      kategorisinde yer almaktadır. Deprem kırılganlığı ve yapısal güçlendirme skoru kritik iyileştirme gerektirmektedir. Yangın güvenlik sistemleri sektör ortalamasının üzerindeyken, siber güvenlik ve IT yedekleme kapasitesi acil aksiyon beklemektedir. Sel riski lokasyon bazlı değerlendirmede orta düzey tehdit oluşturmaktadır.
                    </div>
                    {/* GAP özet tablosu */}
                    <h4 style={{fontSize:13,fontWeight:700,color:'#0A1628',marginBottom:10}}>Risk Dağılımı — Senaryo Türü</h4>
                    <div style={{border:'1px solid #F1F0EF',borderRadius:10,overflow:'hidden',marginBottom:20}}>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 80px 80px 80px',padding:'8px 14px',background:'#FAFAF9',borderBottom:'1px solid #F1F0EF'}}>
                        {['Senaryo','H Skoru','F Skoru','E Skoru'].map(h=>(
                          <span key={h} style={{fontSize:10,fontWeight:700,color:'#A8A29E',textTransform:'uppercase',letterSpacing:'.05em'}}>{h}</span>
                        ))}
                      </div>
                      {senaryoSkorlar.map(s=>(
                        <div key={s.ad} className="row-hover" style={{display:'grid',gridTemplateColumns:'1fr 80px 80px 80px',padding:'11px 14px',borderBottom:'1px solid #F7F6F5',cursor:'pointer',transition:'all .15s'}}>
                          <div style={{display:'flex',alignItems:'center',gap:8}}>
                            <div style={{width:8,height:8,borderRadius:'50%',background:getRiskRenk(s.skor),flexShrink:0}} />
                            <span style={{fontSize:12,fontWeight:500,color:'#374151'}}>{s.ad}</span>
                          </div>
                          <span className="fm" style={{fontSize:12,fontWeight:700,color:'#EF4444'}}>{Math.max(10,hSkor+Math.floor(Math.random()*10)-5)}</span>
                          <span className="fm" style={{fontSize:12,fontWeight:700,color:'#F59E0B'}}>{Math.max(10,fSkor+Math.floor(Math.random()*10)-5)}</span>
                          <span className="fm" style={{fontSize:12,fontWeight:700,color:'#22C55E'}}>{Math.max(10,eSkor+Math.floor(Math.random()*10)-5)}</span>
                        </div>
                      ))}
                    </div>
                    <h4 style={{fontSize:13,fontWeight:700,color:'#0A1628',marginBottom:10}}>Öncelikli Aksiyonlar</h4>
                    {DEMO_AKSIYONLAR.filter(a=>a.oncelik>=1).slice(0,4).map((a,i)=>(
                      <div key={a.id} style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:8,padding:'10px 14px',background:'#FAFAF9',borderRadius:8,border:'1px solid #F1F0EF'}}>
                        <span style={{width:22,height:22,borderRadius:'50%',background:oncelikRenk[a.oncelik],color:'white',fontSize:10,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:1}}>{i+1}</span>
                        <div style={{flex:1}}>
                          <div style={{fontSize:12,fontWeight:600,color:'#0A1628',marginBottom:2}}>{a.baslik}</div>
                          <div style={{fontSize:10,color:'#A8A29E'}}>{a.departman} · {new Date(a.tarih).toLocaleDateString('tr-TR')}</div>
                        </div>
                        <span className="bdg" style={{background:durumRenk[a.durum]+'15',color:durumRenk[a.durum],flexShrink:0}}>{durumLabel[a.durum]}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h3 className="fd" style={{fontSize:16,fontWeight:700,color:'#0A1628',marginBottom:12}}>Hazırlık Durumu</h3>
                    {GAP_KATEGORILER.map(k=>{
                      const ort=Math.round(k.sorular.reduce((a,s)=>a+s.puan,0)/k.sorular.length)
                      const hedef=Math.round(k.sorular.reduce((a,s)=>a+s.hedef,0)/k.sorular.length)
                      const shortcomings=k.sorular.filter(s=>s.puan<s.hedef).length
                      const redflag=k.sorular.filter(s=>s.puan<s.hedef*0.7).length
                      return (
                        <div key={k.id} style={{background:'#FAFAF9',borderRadius:12,padding:16,marginBottom:12,border:'1px solid #F1F0EF',cursor:'pointer',transition:'all .15s'}}
                          onClick={()=>{setSekme('gap');setAktifGap(k.id)}}
                          onMouseEnter={e=>e.currentTarget.style.background='#F5F3F1'} onMouseLeave={e=>e.currentTarget.style.background='#FAFAF9'}>
                          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                            <div style={{display:'flex',alignItems:'center',gap:8}}>
                              <span>{KATEGORI_IKON(k.id)}</span>
                              <span style={{fontSize:13,fontWeight:700,color:'#0A1628'}}>{k.label}</span>
                            </div>
                            <span className="fm" style={{fontSize:18,fontWeight:800,color:getRiskRenk(ort)}}>{ort}</span>
                          </div>
                          <div className="pb" style={{height:6,marginBottom:10}}><div className="pf" style={{width:ort+'%',height:6,background:getRiskRenk(ort)}} /></div>
                          <div style={{display:'flex',justifyContent:'space-between',fontSize:11}}>
                            <span style={{color:'#9CA3AF'}}>Hedef: <strong style={{color:'#374151'}}>{hedef}</strong></span>
                            <div style={{display:'flex',gap:10}}>
                              {shortcomings>0&&<span style={{color:'#F59E0B',fontWeight:600}}>⚠ {shortcomings} kısıt</span>}
                              {redflag>0&&<span style={{color:'#EF4444',fontWeight:600}}>🚩 {redflag} kritik</span>}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    {/* Hızlı Erişim */}
                    <h4 style={{fontSize:12,fontWeight:700,color:'#0A1628',marginBottom:10,marginTop:16}}>Hızlı Erişim</h4>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                      {[
                        {l:'GAP Analizi',i:'',s:'gap' as Sekme},
                        {l:'Aksiyon Listesi',i:'',s:'aksiyonlar' as Sekme},
                        {l:'İş Sürekliliği',i:'🔁',s:'bcp' as Sekme},
                        {l:'Risk Haritası',i:'',href:'/harita'},
                      ].map(h=>(
                        h.href
                          ? <a key={h.l} href={h.href} style={{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',background:'white',borderRadius:10,border:'1px solid #E5E3E1',textDecoration:'none',fontSize:12,fontWeight:600,color:'#374151',transition:'all .15s'}}
                              onMouseEnter={e=>e.currentTarget.style.background='#FAFAF9'} onMouseLeave={e=>e.currentTarget.style.background='white'}>
                              <span>{h.i}</span>{h.l}
                            </a>
                          : <button key={h.l} onClick={()=>setSekme(h.s!)} style={{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',background:'white',borderRadius:10,border:'1px solid #E5E3E1',cursor:'pointer',fontSize:12,fontWeight:600,color:'#374151',fontFamily:"'DM Sans',sans-serif",transition:'all .15s'}}
                              onMouseEnter={e=>e.currentTarget.style.background='#FAFAF9'} onMouseLeave={e=>e.currentTarget.style.background='white'}>
                              <span>{h.i}</span>{h.l}
                            </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── GAP ANALİZİ ──────────────────────────────────────────────────── */}
            {sekme==='gap' && (
              <div className="fi">
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:24}}>
                  <div>
                    <h3 className="fd" style={{fontSize:16,fontWeight:700,color:'#0A1628',margin:0}}>GAP Analizi</h3>
                    <p style={{fontSize:12,color:'#A8A29E',marginTop:4}}>Kapsamlı HFE-360 Dayanıklılık Değerlendirmesi · {tarih}</p>
                  </div>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                    {GAP_KATEGORILER.map(k=>(
                      <button key={k.id} className={'bsb'+(aktifGap===k.id?' on':'')} onClick={()=>setAktifGap(k.id)}>
                        <span style={{marginRight:4}}>{KATEGORI_IKON(k.id)}</span>{k.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{display:'grid',gridTemplateColumns:'5fr 3fr',gap:24}}>
                  <div>
                    {/* KPI satırı */}
                    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:20}}>
                      {[
                        {l:'Kategori Skoru',v:gapOrt,r:getRiskRenk(gapOrt)},
                        {l:'Hedef Skor',v:gapHedefOrt,r:'#1B4FD8'},
                        {l:'GAP Sayısı',v:gapBosluk,r:'#F59E0B'},
                        {l:'Kritik Alan',v:gapSkorlar.filter(s=>s.puan<50).length,r:'#EF4444'},
                      ].map(k=>(
                        <div key={k.l} style={{background:'#FAFAF9',borderRadius:10,padding:'12px 14px',border:'1px solid #F1F0EF'}}>
                          <div style={{fontSize:9,color:'#A8A29E',marginBottom:4,textTransform:'uppercase',letterSpacing:'.08em'}}>{k.l}</div>
                          <div className="fd" style={{fontSize:26,fontWeight:800,color:k.r,lineHeight:1}}>{k.v}</div>
                        </div>
                      ))}
                    </div>

                    {/* Yürütücü özet */}
                    <div style={{background:'linear-gradient(135deg,#F8F6F3,#FFFFFF)',border:'1px solid #F1F0EF',borderRadius:12,padding:18,marginBottom:20,borderLeft:'4px solid '+gapKat.renk}}>
                      <p style={{fontSize:12,fontWeight:700,color:'#0A1628',marginBottom:8}}>Yönetici Özeti</p>
                      <p style={{fontSize:12,color:'#57534e',lineHeight:1.7}}>
                        {aktifGap==='deprem'&&'Deprem hazırlık değerlendirmesi, yapısal ve yapısal olmayan risklerin kabul edilebilir sınırların üzerinde olduğunu ortaya koymaktadır. Tahliye planları iyi belgelenmiş olsa da, eski binaların sismik güçlendirme eksiklikleri önemli risk oluşturmaktadır. 2000 yılından önce inşa edilmiş yapılar için acil aksiyon gerekmektedir.'}
                        {aktifGap==='yangin'&&'Yangın güvenlik sistemleri büyük ölçüde yerinde olmakla birlikte, acil teşkilat ve müdahale senaryolarının standardizasyonunda iyileştirme alanları tespit edilmiştir. Personel eğitim katılımı artırılmalıdır.'}
                        {aktifGap==='siber'&&'Siber güvenlik değerlendirmesi, yedek sistem ve sızma testi kapasitelerinde kritik boşluklar ortaya koymaktadır. BDDK dijital dayanıklılık gereksinimleri için ivedi aksiyon planlanmalıdır.'}
                        {aktifGap==='sel'&&'Sel ve iklim kaynaklı afetler için erken uyarı, tahliye ve iş sürekliliği planlarının entegrasyonunun yetersiz kaldığı tespit edilmiştir. Coğrafi konum risk faktörleri dikkate alınarak entegrasyon tamamlanmalıdır.'}
                      </p>
                    </div>

                    {/* Soru detayları */}
                    {gapSkorlar.map(soru=>{
                      const fark=soru.hedef-soru.puan
                      const dr=soru.puan>=soru.hedef?'#22C55E':soru.puan>=soru.hedef*.7?'#F59E0B':'#EF4444'
                      const doluluk=(soru.puan/soru.hedef)*100
                      return (
                        <div key={soru.id} style={{marginBottom:12,padding:'14px 16px',background:'#FAFAF9',borderRadius:12,border:'1px solid #F1F0EF',borderLeft:'3px solid '+dr}}>
                          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:8}}>
                            <div>
                              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
                                <span className="fm" style={{fontSize:10,background:'#F1F0EF',padding:'2px 8px',borderRadius:6,color:'#78716c'}}>{soru.id}</span>
                                <span style={{fontSize:13,fontWeight:600,color:'#0A1628'}}>{soru.label}</span>
                              </div>
                              <span style={{fontSize:11,color:'#A8A29E'}}>{soru.aciklama}</span>
                            </div>
                            <div style={{textAlign:'right',flexShrink:0,marginLeft:12}}>
                              <div className="fm" style={{fontSize:18,fontWeight:800,color:dr,lineHeight:1}}>{soru.puan}</div>
                              <div style={{fontSize:10,color:'#A8A29E'}}>Hedef: {soru.hedef}</div>
                            </div>
                          </div>
                          <div style={{display:'flex',gap:8,alignItems:'center'}}>
                            <div style={{flex:1}}>
                              <div className="pb" style={{height:7}}>
                                <div className="pf" style={{width:soru.puan+'%',height:7,background:dr}} />
                              </div>
                            </div>
                            {fark>0
                              ? <span style={{fontSize:10,color:'#EF4444',fontWeight:600,flexShrink:0}}>▼ {fark} açık</span>
                              : <span style={{fontSize:10,color:'#22C55E',fontWeight:600,flexShrink:0}}>✓ Hedef OK</span>
                            }
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Sağ Panel */}
                  <div>
                    <div style={{background:'#FAFAF9',borderRadius:12,padding:18,border:'1px solid #F1F0EF',marginBottom:14}}>
                      <p style={{fontSize:12,fontWeight:700,color:'#0A1628',marginBottom:12}}> Güçlü Yönler</p>
                      {gapSkorlar.filter(s=>s.puan>=s.hedef).length===0
                        ?<p style={{fontSize:12,color:'#A8A29E',fontStyle:'italic'}}>Bu kategoride hedef karşılanan alan bulunmuyor.</p>
                        :gapSkorlar.filter(s=>s.puan>=s.hedef).map(s=>(
                          <div key={s.id} style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:8}}>
                            <span style={{color:'#22C55E',fontWeight:700,marginTop:1,flexShrink:0}}>✓</span>
                            <div>
                              <div style={{fontSize:12,fontWeight:600,color:'#374151'}}>{s.label}</div>
                              <div style={{fontSize:10,color:'#A8A29E'}}>{s.puan}/{s.hedef} · Hedef aşıldı</div>
                            </div>
                          </div>
                        ))}
                    </div>

                    <div style={{background:'#FEF2F2',borderRadius:12,padding:18,border:'1px solid #FECACA',marginBottom:14}}>
                      <p style={{fontSize:12,fontWeight:700,color:'#991B1B',marginBottom:12}}>⚠ Kritik Boşluklar</p>
                      {gapSkorlar.filter(s=>s.puan<s.hedef).map(s=>(
                        <div key={s.id} style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:8}}>
                          <span style={{color:'#EF4444',fontWeight:700,marginTop:1,flexShrink:0}}>!</span>
                          <div>
                            <div style={{fontSize:12,fontWeight:600,color:'#7F1D1D'}}>{s.label}</div>
                            <div style={{fontSize:10,color:'#DC2626'}}>{s.hedef-s.puan} puan açık · Hedef: {s.hedef}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{background:'#EFF6FF',borderRadius:12,padding:18,border:'1px solid #BFDBFE',marginBottom:14}}>
                      <p style={{fontSize:12,fontWeight:700,color:'#1E40AF',marginBottom:8}}> Öneri</p>
                      <p style={{fontSize:12,color:'#1E3A8A',lineHeight:1.65}}>
                        {aktifGap==='deprem'&&'Zemin etüdü ve yapısal güçlendirme çalışmalarının önceliklendirilmesi, sismik sensör kurulumunun planlanması tavsiye edilir.'}
                        {aktifGap==='yangin'&&'Personel eğitim programlarının yenilenmesi ve tahliye planlarının düzenli test edilmesi tavsiye edilir.'}
                        {aktifGap==='siber'&&'Yedekli IT altyapısı kurulumu ve yıllık sızma testleri ivedilikle tamamlanmalı, BDDK bildirimleri güncellenmelidir.'}
                        {aktifGap==='sel'&&'Meteorolojik erken uyarı sistemi entegrasyonu ve drenaj iyileştirmeleri için bütçe ayrılması önerilir.'}
                      </p>
                    </div>

                    <div style={{background:'white',borderRadius:12,padding:18,border:'1px solid #F1F0EF'}}>
                      <p style={{fontSize:12,fontWeight:700,color:'#0A1628',marginBottom:12}}>Sektör Kıyaslaması</p>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                        <span style={{fontSize:11,color:'#6B7280'}}>Bu Şube</span>
                        <span className="fm" style={{fontSize:11,fontWeight:700,color:getRiskRenk(gapOrt)}}>{gapOrt}</span>
                      </div>
                      <div className="pb" style={{height:5,marginBottom:10}}><div className="pf" style={{width:gapOrt+'%',height:5,background:getRiskRenk(gapOrt)}} /></div>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                        <span style={{fontSize:11,color:'#6B7280'}}>Sektör Ortalaması</span>
                        <span className="fm" style={{fontSize:11,fontWeight:700,color:'#F59E0B'}}>58</span>
                      </div>
                      <div className="pb" style={{height:5,marginBottom:10}}><div className="pf" style={{width:'58%',height:5,background:'#F59E0B'}} /></div>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                        <span style={{fontSize:11,color:'#6B7280'}}>Sektör En İyisi</span>
                        <span className="fm" style={{fontSize:11,fontWeight:700,color:'#22C55E'}}>82</span>
                      </div>
                      <div className="pb" style={{height:5}}><div className="pf" style={{width:'82%',height:5,background:'#22C55E'}} /></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── AKSİYON LİSTESİ ──────────────────────────────────────────────── */}
            {sekme==='aksiyonlar' && (
              <div className="fi">
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
                  <div>
                    <h3 className="fd" style={{fontSize:16,fontWeight:700,color:'#0A1628',margin:0}}>Aksiyon Listesi</h3>
                    <p style={{fontSize:12,color:'#A8A29E',marginTop:4}}>Dayanıklılık iyileştirme aksiyonlarını takip et ve yönet</p>
                  </div>
                  <div style={{display:'flex',gap:10}}>
                    {[
                      {l:'Toplam',v:DEMO_AKSIYONLAR.length,r:'#0A1628'},
                      {l:'Tamamlandı',v:DEMO_AKSIYONLAR.filter(a=>a.durum==='tamamlandi').length,r:'#22C55E'},
                      {l:'Devam',v:DEMO_AKSIYONLAR.filter(a=>a.durum==='devam').length,r:'#F59E0B'},
                      {l:'Gecikti',v:DEMO_AKSIYONLAR.filter(a=>a.durum==='gecikti').length,r:'#EF4444'},
                      {l:'Başlamadı',v:DEMO_AKSIYONLAR.filter(a=>a.durum==='baslamamis').length,r:'#94A3B8'},
                    ].map(k=>(
                      <div key={k.l} style={{textAlign:'center',padding:'8px 14px',background:'#FAFAF9',borderRadius:10,border:'1px solid #F1F0EF',minWidth:70}}>
                        <div className="fd" style={{fontSize:20,fontWeight:800,color:k.r,lineHeight:1}}>{k.v}</div>
                        <div style={{fontSize:9,color:'#A8A29E',marginTop:3,textTransform:'uppercase',letterSpacing:'.05em'}}>{k.l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* İlerleme çubuğu */}
                <div style={{background:'#FAFAF9',borderRadius:10,padding:'12px 16px',marginBottom:16,border:'1px solid #F1F0EF'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                    <span style={{fontSize:12,fontWeight:600,color:'#374151'}}>Genel İlerleme</span>
                    <span className="fm" style={{fontSize:12,fontWeight:700,color:'#0A1628'}}>%{aksiyonIlerleme}</span>
                  </div>
                  <div className="pb" style={{height:8}}>
                    <div className="pf" style={{width:aksiyonIlerleme+'%',height:8,background:'linear-gradient(90deg,#1B4FD8,#009B8D)'}} />
                  </div>
                </div>

                {/* Filtreler */}
                <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}}>
                  <input type="text" placeholder="Aksiyon ara..." value={aramaAksiyon} onChange={e=>setAramaAksiyon(e.target.value)} style={{flex:1,minWidth:200}} />
                  <select value={filtreDurum} onChange={e=>setFiltreDurum(e.target.value)}>
                    <option value="tumu">Tüm Durumlar</option>
                    <option value="gecikti">Gecikti</option>
                    <option value="devam">Devam Ediyor</option>
                    <option value="tamamlandi">Tamamlandı</option>
                    <option value="baslamamis">Başlamadı</option>
                  </select>
                  <select value={filtreOncelik} onChange={e=>setFiltreOncelik(e.target.value)}>
                    <option value="tumu">Tüm Öncelikler</option>
                    <option value="2">Kritik</option>
                    <option value="1">Yüksek</option>
                    <option value="0">Normal</option>
                  </select>
                  <span style={{fontSize:12,color:'#A8A29E',alignSelf:'center'}}>{filtrelenmisAksiyonlar.length} aksiyon</span>
                </div>

                {/* Tablo */}
                <div style={{border:'1px solid #F1F0EF',borderRadius:12,overflow:'hidden'}}>
                  <div style={{display:'grid',gridTemplateColumns:'3fr 1fr 1.5fr 1.8fr 1fr 1fr 1fr',padding:'9px 16px',background:'#FAFAF9',borderBottom:'1px solid #F1F0EF'}}>
                    {['Aksiyon','Kategori','Departman','Sorumlu','Hedef Tarih','Durum','Öncelik'].map(h=>(
                      <span key={h} style={{fontSize:10,fontWeight:700,color:'#A8A29E',textTransform:'uppercase',letterSpacing:'.04em'}}>{h}</span>
                    ))}
                  </div>
                  {filtrelenmisAksiyonlar.length===0&&(
                    <div style={{padding:'32px',textAlign:'center',color:'#A8A29E',fontSize:13}}>Filtreyle eşleşen aksiyon bulunamadı.</div>
                  )}
                  {filtrelenmisAksiyonlar.map(a=>(
                    <div key={a.id} className="row-hover" style={{display:'grid',gridTemplateColumns:'3fr 1fr 1.5fr 1.8fr 1fr 1fr 1fr',padding:'13px 16px',borderBottom:'1px solid #F7F6F5',cursor:'pointer',transition:'all .15s'}}>
                      <div>
                        <div style={{fontSize:12,fontWeight:600,color:'#0A1628',marginBottom:a.ilerleme>0?4:0}}>{a.baslik}</div>
                        {a.ilerleme>0&&(
                          <div style={{display:'flex',alignItems:'center',gap:6}}>
                            <div style={{width:72,height:4,background:'#F1F0EF',borderRadius:99,overflow:'hidden'}}>
                              <div style={{width:a.ilerleme+'%',height:'100%',background:durumRenk[a.durum],borderRadius:99}} />
                            </div>
                            <span style={{fontSize:10,color:'#A8A29E'}}>%{a.ilerleme}</span>
                          </div>
                        )}
                      </div>
                      <span style={{fontSize:11,color:'#6B7280',alignSelf:'center'}}>{a.kategori}</span>
                      <span style={{fontSize:11,color:'#6B7280',alignSelf:'center'}}>{a.departman}</span>
                      <div style={{alignSelf:'center'}}>
                        <div style={{fontSize:11,fontWeight:600,color:'#0A1628'}}>{a.sorumlu}</div>
                        <div style={{fontSize:10,color:'#A8A29E'}}>{a.email}</div>
                      </div>
                      <span style={{fontSize:11,color:'#6B7280',alignSelf:'center'}}>{new Date(a.tarih).toLocaleDateString('tr-TR')}</span>
                      <span className="bdg" style={{alignSelf:'center',background:durumRenk[a.durum]+'18',color:durumRenk[a.durum]}}>{durumLabel[a.durum]}</span>
                      <span className="bdg" style={{alignSelf:'center',background:oncelikRenk[a.oncelik]+'18',color:oncelikRenk[a.oncelik]}}>{oncelikLabel[a.oncelik]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── İŞ SÜREKLİLİĞİ ──────────────────────────────────────────────── */}
            {sekme==='bcp' && (
              <div className="fi">
                {/* BCP KPI Bandı */}
                <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:10,marginBottom:20}}>
                  {[
                    {l:'Senaryolar',v:DEMO_BCP_SENARYOLAR.length,i:''},
                    {l:'Kurtarma Planı',v:2,i:'🔁'},
                    {l:'Kilit Personel',v:DEMO_PERSONEL.length,i:'👤'},
                    {l:'Eğitim Programı',v:DEMO_EGITIMLER.length,i:''},
                    {l:'Genel Hazırlık',v:'%78',i:''},
                  ].map(k=>(
                    <div key={k.l} style={{background:'#FAFAF9',borderRadius:12,padding:'14px 16px',border:'1px solid #F1F0EF',textAlign:'center'}}>
                      <div style={{fontSize:22,marginBottom:6}}>{k.i}</div>
                      <div className="fd" style={{fontSize:22,fontWeight:800,color:'#0A1628',lineHeight:1}}>{k.v}</div>
                      <div style={{fontSize:10,color:'#A8A29E',marginTop:4}}>{k.l}</div>
                    </div>
                  ))}
                </div>

                {/* Alt Sekmeler */}
                <div style={{display:'flex',gap:6,marginBottom:20,borderBottom:'1px solid #F1F0EF',paddingBottom:0}}>
                  {([
                    {id:'senaryolar',l:'Afet Senaryoları'},
                    {id:'planlar',l:'Kurtarma Planları'},
                    {id:'personel',l:'Kilit Personel'},
                    {id:'egitim',l:'Eğitim Programı'},
                  ] as {id:typeof aktifBcpSekme,l:string}[]).map(s=>(
                    <button key={s.id} className={'sb'+(aktifBcpSekme===s.id?' on':'')} onClick={()=>setAktifBcpSekme(s.id)}>{s.l}</button>
                  ))}
                </div>

                {/* Afet Senaryoları */}
                {aktifBcpSekme==='senaryolar' && (
                  <div className="fi">
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:20}}>
                      {DEMO_BCP_SENARYOLAR.map((s,i)=>(
                        <div key={i} className={'scen-card'+(aktifSenaryo===i?' aktif':'')} onClick={()=>setAktifSenaryo(i)}
                          style={{borderLeft:'4px solid '+(i===0?'#EF4444':'#F97316')}}>
                          <div style={{display:'flex',justifyContent:'space-between',marginBottom:10,gap:10}}>
                            <h4 style={{fontSize:14,fontWeight:700,color:'#0A1628',lineHeight:1.3}}>{s.baslik}</h4>
                            <div style={{display:'flex',gap:5,flexShrink:0}}>
                              <span className="bdg" style={{background:'#FEF2F2',color:'#991B1B'}}>Olasılık: {s.olasilik}</span>
                              <span className="bdg" style={{background:'#FFF7ED',color:'#92400E'}}>Etki: {s.etki}</span>
                            </div>
                          </div>
                          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:6,marginBottom:10}}>
                            {[{l:'RTO',v:s.rto},{l:'RPO',v:s.rpo},{l:'Beklenen Süre',v:s.beklenen_sure}].map(m=>(
                              <div key={m.l} style={{background:'white',borderRadius:7,padding:'7px 9px',border:'1px solid #E5E3E1'}}>
                                <div style={{fontSize:9,color:'#A8A29E',marginBottom:2,textTransform:'uppercase'}}>{m.l}</div>
                                <div className="fm" style={{fontSize:11,fontWeight:700,color:'#0A1628'}}>{m.v}</div>
                              </div>
                            ))}
                          </div>
                          <div style={{display:'flex',gap:14,fontSize:10,color:'#A8A29E'}}>
                            <span>Revizyon: <strong style={{color:'#374151'}}>{new Date(s.son_guncelleme).toLocaleDateString('tr-TR')}</strong></span>
                            <span>Tatbikat: <strong style={{color:'#374151'}}>{new Date(s.son_tatbikat).toLocaleDateString('tr-TR')}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Seçili senaryo detayı */}
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
                      <div style={{background:'#FAFAF9',borderRadius:12,padding:18,border:'1px solid #F1F0EF'}}>
                        <p style={{fontSize:12,fontWeight:700,color:'#0A1628',marginBottom:12}}>Tetikleyici Koşullar</p>
                        {DEMO_BCP_SENARYOLAR[aktifSenaryo]?.tetikleyiciler.map((t,i)=>(
                          <div key={i} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                            <div style={{width:6,height:6,borderRadius:'50%',background:'#1B4FD8',flexShrink:0}} />
                            <span style={{fontSize:12,color:'#57534e'}}>{t}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{background:'#FAFAF9',borderRadius:12,padding:18,border:'1px solid #F1F0EF'}}>
                        <p style={{fontSize:12,fontWeight:700,color:'#0A1628',marginBottom:12}}>Etkilenen Varlıklar</p>
                        {DEMO_BCP_SENARYOLAR[aktifSenaryo]?.varliklar.map((v,i)=>(
                          <div key={i} style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                            <div style={{width:6,height:6,borderRadius:'50%',background:'#EF4444',flexShrink:0}} />
                            <span style={{fontSize:12,color:'#57534e'}}>{v}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{background:'#FAFAF9',borderRadius:12,padding:18,border:'1px solid #F1F0EF'}}>
                        <p style={{fontSize:12,fontWeight:700,color:'#0A1628',marginBottom:12}}>Kurtarma Fazları</p>
                        {DEMO_BCP_SENARYOLAR[aktifSenaryo]?.fazlar.map((faz,i)=>(
                          <div key={i} style={{display:'flex',gap:10,marginBottom:12}}>
                            <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
                              <div style={{width:20,height:20,borderRadius:'50%',background:'#1B4FD8',color:'white',fontSize:10,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{i+1}</div>
                              {i<DEMO_BCP_SENARYOLAR[aktifSenaryo].fazlar.length-1&&<div style={{width:2,flex:1,background:'#E5E3E1',margin:'3px 0'}} />}
                            </div>
                            <div style={{paddingBottom:i<DEMO_BCP_SENARYOLAR[aktifSenaryo].fazlar.length-1?12:0}}>
                              <div style={{fontSize:11,fontWeight:700,color:'#0A1628',marginBottom:2}}>{faz.baslik}</div>
                              <div style={{fontSize:10,color:'#A8A29E'}}>{faz.ekip}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Kurtarma Planları */}
                {aktifBcpSekme==='planlar' && (
                  <div className="fi">
                    {DEMO_BCP_SENARYOLAR.map((s,i)=>(
                      <div key={i} style={{background:'#FAFAF9',borderRadius:14,border:'1px solid #E5E3E1',padding:24,marginBottom:16,borderLeft:'4px solid '+(i===0?'#EF4444':'#F97316')}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
                          <div>
                            <h4 style={{fontSize:15,fontWeight:700,color:'#0A1628',marginBottom:4}}>{s.baslik.replace('İstanbul','').trim()} — Acil Müdahale & Kurtarma Planı</h4>
                            <div style={{display:'flex',gap:8}}>
                              <span className="bdg" style={{background:'#DCFCE7',color:'#166534'}}>✓ Onaylı</span>
                              <span className="bdg" style={{background:'#EFF6FF',color:'#1E40AF'}}>Versiyon 2.{i+1}</span>
                            </div>
                          </div>
                          <div style={{display:'flex',gap:8}}>
                            {[{l:'RTO',v:s.rto},{l:'RPO',v:s.rpo},{l:'Süre',v:s.beklenen_sure}].map(m=>(
                              <div key={m.l} style={{textAlign:'center',padding:'8px 12px',background:'white',borderRadius:8,border:'1px solid #E5E3E1'}}>
                                <div style={{fontSize:9,color:'#A8A29E',textTransform:'uppercase',marginBottom:2}}>{m.l}</div>
                                <div className="fm" style={{fontSize:12,fontWeight:700,color:'#0A1628'}}>{m.v}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        {s.fazlar.map((faz,fi)=>(
                          <div key={fi} style={{marginBottom:14,background:'white',borderRadius:10,border:'1px solid #E5E3E1',overflow:'hidden'}}>
                            <div style={{padding:'10px 16px',background:'#F8F6F3',borderBottom:'1px solid #E5E3E1',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                              <span style={{fontSize:13,fontWeight:700,color:'#0A1628'}}>{faz.baslik}</span>
                              <span className="bdg" style={{background:'#EFF6FF',color:'#1B4FD8',fontSize:10}}>{faz.ekip}</span>
                            </div>
                            <div style={{padding:'12px 16px'}}>
                              {faz.adimlar.map((a,ai)=>(
                                <div key={ai} style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                                  <span style={{color:'#22C55E',fontWeight:700,fontSize:12}}>✓</span>
                                  <span style={{fontSize:12,color:'#57534e'}}>{a}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {/* Kilit Personel */}
                {aktifBcpSekme==='personel' && (
                  <div className="fi">
                    <div style={{border:'1px solid #F1F0EF',borderRadius:12,overflow:'hidden'}}>
                      <div style={{display:'grid',gridTemplateColumns:'1.8fr 1.5fr 2fr 1.5fr 1fr',padding:'9px 16px',background:'#FAFAF9',borderBottom:'1px solid #F1F0EF'}}>
                        {['İsim / E-posta','Departman / Pozisyon','Kritik Rol','Görevler','Telefon'].map(h=>(
                          <span key={h} style={{fontSize:10,fontWeight:700,color:'#A8A29E',textTransform:'uppercase',letterSpacing:'.04em'}}>{h}</span>
                        ))}
                      </div>
                      {DEMO_PERSONEL.map((p,i)=>(
                        <div key={i} className="row-hover" style={{display:'grid',gridTemplateColumns:'1.8fr 1.5fr 2fr 1.5fr 1fr',padding:'14px 16px',borderBottom:'1px solid #F7F6F5',transition:'all .15s'}}>
                          <div>
                            <div style={{fontSize:13,fontWeight:600,color:'#0A1628',marginBottom:2}}>{p.ad}</div>
                            <div style={{fontSize:10,color:'#A8A29E'}}>{p.unvan.toLowerCase().replace(/ /g,'.')+'@akbank.com'}</div>
                          </div>
                          <div>
                            <div style={{fontSize:12,fontWeight:500,color:'#374151',marginBottom:2}}>{p.unvan}</div>
                            <span className="bdg" style={{background:'#F1F0EF',color:'#6B7280',fontSize:10}}>{p.departman}</span>
                          </div>
                          <span style={{fontSize:12,fontWeight:600,color:'#1B4FD8',alignSelf:'center'}}>{p.rol}</span>
                          <div style={{alignSelf:'center'}}>
                            {p.gorevler.slice(0,2).map((g,gi)=>(
                              <div key={gi} style={{display:'flex',alignItems:'flex-start',gap:5,marginBottom:3}}>
                                <span style={{color:'#9CA3AF',fontSize:10,marginTop:1}}>•</span>
                                <span style={{fontSize:10,color:'#6B7280',lineHeight:1.4}}>{g}</span>
                              </div>
                            ))}
                            {p.gorevler.length>2&&<span style={{fontSize:10,color:'#1B4FD8'}}>+{p.gorevler.length-2} daha</span>}
                          </div>
                          <span className="fm" style={{fontSize:10,color:'#6B7280',alignSelf:'center'}}>{p.tel}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Eğitim Programı */}
                {aktifBcpSekme==='egitim' && (
                  <div className="fi">
                    <div style={{border:'1px solid #F1F0EF',borderRadius:12,overflow:'hidden'}}>
                      <div style={{display:'grid',gridTemplateColumns:'100px 2fr 3fr 100px 1fr 1.2fr',padding:'9px 16px',background:'#FAFAF9',borderBottom:'1px solid #F1F0EF'}}>
                        {['Tarih','Eğitim Başlığı','Amaç / Özet','Tip','Süre','Katılımcı'].map(h=>(
                          <span key={h} style={{fontSize:10,fontWeight:700,color:'#A8A29E',textTransform:'uppercase',letterSpacing:'.04em'}}>{h}</span>
                        ))}
                      </div>
                      {DEMO_EGITIMLER.map((e,i)=>{
                        const gecti = new Date(e.tarih) < new Date()
                        return (
                          <div key={i} className="row-hover" style={{display:'grid',gridTemplateColumns:'100px 2fr 3fr 100px 1fr 1.2fr',padding:'13px 16px',borderBottom:'1px solid #F7F6F5',transition:'all .15s'}}>
                            <div>
                              <div style={{fontSize:11,fontWeight:700,color:'#374151'}}>{new Date(e.tarih).toLocaleDateString('tr-TR',{day:'numeric',month:'short'})}</div>
                              <div style={{fontSize:10,color:'#A8A29E'}}>{new Date(e.tarih).getFullYear()}</div>
                            </div>
                            <div>
                              <div style={{fontSize:12,fontWeight:600,color:'#0A1628',marginBottom:3}}>{e.baslik}</div>
                              <span className="bdg" style={{background:gecti?'#DCFCE7':'#EFF6FF',color:gecti?'#166534':'#1E40AF',fontSize:10}}>{gecti?'✓ Tamamlandı':'Planlandı'}</span>
                            </div>
                            <span style={{fontSize:11,color:'#6B7280',alignSelf:'center',lineHeight:1.5}}>{e.amac}</span>
                            <span className="bdg" style={{alignSelf:'center',background:'#F1F0EF',color:'#6B7280'}}>{e.tip}</span>
                            <span style={{fontSize:11,color:'#374151',fontWeight:500,alignSelf:'center'}}>{e.sure}</span>
                            <span style={{fontSize:11,color:'#6B7280',alignSelf:'center'}}>{e.katilimci}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
