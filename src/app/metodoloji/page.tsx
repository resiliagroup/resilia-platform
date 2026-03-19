'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import OmniverselLogo from '@/components/OmniverselLogo'

const N = '#0A1628'; const T = '#2D8A87'; const G = '#E8C97A'
const GR = '#F4F7F6'; const MG = '#566B66'; const BG = '#FFFFFF'; const BORDER = '#E8EDED'
const R_R = '#E30613'; const R_O = '#E56A04'; const R_Y = '#FFC801'; const R_G = '#2D8A87'

export default function MetodolojiPage() {
  const [activeTab, setActiveTab] = useState<'hfer' | 'hro' | 'toc' | 'fema'>('hfer')

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:${BG};color:${N};font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}
      `}</style>

      {/* NAV */}
      <header style={{ position:'sticky', top:0, zIndex:100, height:64, background:'rgba(255,255,255,0.97)',
        backdropFilter:'blur(12px)', borderBottom:`1px solid ${BORDER}`,
        display:'flex', alignItems:'center', padding:'0 48px' }}>
        <div style={{ maxWidth:1200, width:'100%', margin:'0 auto',
          display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Link href="/"><OmniverselLogo width={200} height={50} light /></Link>
          <Link href="/" style={{ display:'flex', alignItems:'center', gap:6, color:MG, fontSize:14, fontWeight:500,
            padding:'8px 16px', borderRadius:8, border:`1px solid ${BORDER}`, transition:'all .18s' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M11 7H3M7 11l-4-4 4-4" stroke={MG} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Ana Sayfa
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section style={{ background:`linear-gradient(135deg, ${N} 0%, #0F2847 100%)`,
        padding:'80px 48px 64px', textAlign:'center' }}>
        <p style={{ color:T, fontSize:12, fontWeight:700, letterSpacing:3,
          textTransform:'uppercase', marginBottom:16 }}>Bilimsel Metodoloji</p>
        <h1 style={{ color:'#fff', fontSize:'clamp(32px,4.5vw,56px)', fontWeight:700,
          lineHeight:1.1, marginBottom:20, maxWidth:800, margin:'0 auto 20px' }}>
          HFER-720 ve Çevik<br/>
          <span style={{ color:T }}>Dayanıklılık Çerçevesi</span>
        </h1>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:17, lineHeight:1.8,
          maxWidth:600, margin:'0 auto 40px' }}>
          TOC darboğaz analizi, HRO saha hassasiyeti, Lean finansal odak ve
          FEMA Core Capabilities ile entegre akademik metodoloji.
        </p>
        {/* Formula */}
        <div style={{ display:'inline-block', background:'rgba(255,255,255,0.06)',
          border:`1.5px solid ${T}50`, borderRadius:16, padding:'20px 32px' }}>
          <span style={{ fontSize:'clamp(16px,2.2vw,24px)', fontWeight:800,
            fontFamily:'DM Mono,monospace', color:'#fff', letterSpacing:1 }}>
            URI = (H × F × E × B) / (1 + k(s,t) × C²) × HRO_α
          </span>
        </div>
      </section>

      {/* TABS */}
      <section style={{ background:GR, borderBottom:`1px solid ${BORDER}` }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', overflowX:'auto' }}>
          {([
            { key:'hfer', label:'HFER-720 Formülü' },
            { key:'hro',  label:'HRO Metodolojisi' },
            { key:'toc',  label:'TOC Darboğaz Analizi' },
            { key:'fema', label:'FEMA Core Capabilities' },
          ] as const).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{ flexShrink:0, padding:'18px 28px', border:'none', background:'transparent',
                fontSize:14, fontWeight:activeTab===tab.key?700:500,
                color:activeTab===tab.key?T:MG, cursor:'pointer',
                borderBottom:activeTab===tab.key?`2px solid ${T}`:'2px solid transparent',
                fontFamily:"'DM Sans',sans-serif", transition:'all .18s', whiteSpace:'nowrap' as const }}>
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* TAB CONTENT */}
      <section style={{ padding:'64px 48px', background:BG }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>

          {/* ── HFER-720 ── */}
          {activeTab === 'hfer' && (
            <div>
              <p style={{ color:T, fontSize:12, fontWeight:700, letterSpacing:3,
                textTransform:'uppercase', marginBottom:12 }}>omniRISK Çekirdek Modeli</p>
              <h2 style={{ color:N, fontSize:'clamp(26px,3.5vw,40px)', fontWeight:700,
                lineHeight:1.15, marginBottom:16 }}>
                HFER-720: Birleşik Risk İndeksi
              </h2>
              <p style={{ color:MG, fontSize:16, lineHeight:1.85, maxWidth:680, marginBottom:48 }}>
                İTÜ AYM iş birliğiyle geliştirilen HFER-720 modeli; tehlike (H), kırılganlık (F),
                maruziyet (E) ve kapasite (C²) bileşenlerini sektör kalibrasyonuyla
                entegre ederek tesis bazlı Birleşik Risk İndeksi (URI) üretir.
              </p>

              {/* Formula components */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',
                gap:20, marginBottom:56 }}>
                {[
                  { sym:'H', name:'Tehlike', color:R_R, desc:'Seismik zon, taşkın bölgesi, NATECH tehlike yoğunluğu ve tekerrür periyotları.' },
                  { sym:'F', name:'Kırılganlık', color:R_O, desc:'Yapısal dayanıksızlık, personel bağımlılığı ve tek nokta başarısızlık riski.' },
                  { sym:'E', name:'Maruziyet', color:R_Y, desc:'Etkilenecek nüfus, kritik varlık yoğunluğu ve hizmet bağımlılık derinliği.' },
                  { sym:'B', name:'Darboğaz', color:'#8B5CF6', desc:'TOC tabanlı sistemi kilitleyecek kısıt noktası ve zincir kopma riski.' },
                  { sym:'C²', name:'Kapasite', color:R_G, desc:'Hazırlık, müdahale ve iyileştirme kapasitesinin üstel (nonlinear) katkısı.' },
                  { sym:'k(s,t)', name:'Sektör Katsayısı', color:T, desc:'Sektör ve tehlike türüne göre kalibrasyon. Sağlık-NATECH: k=3.5 · Finans-Siber: k=5.1' },
                  { sym:'HRO_α', name:'HRO Çarpanı', color:'#F97316', desc:'Near miss raporlama ve tatbikat faaliyetleriyle 1.0 üzerine çıkan dayanıklılık çarpanı.' },
                ].map(f => (
                  <div key={f.sym} style={{ background:GR, border:`1px solid ${BORDER}`,
                    borderTop:`4px solid ${f.color}`, borderRadius:12, padding:'24px 20px' }}>
                    <div style={{ fontSize:28, fontWeight:800, fontFamily:'DM Mono,monospace',
                      color:f.color, marginBottom:10 }}>{f.sym}</div>
                    <div style={{ fontSize:14, fontWeight:700, color:N, marginBottom:8 }}>{f.name}</div>
                    <p style={{ fontSize:13, color:MG, lineHeight:1.7 }}>{f.desc}</p>
                  </div>
                ))}
              </div>

              {/* K-matrix table */}
              <div style={{ background:GR, border:`1px solid ${BORDER}`, borderRadius:16,
                padding:'32px', marginBottom:48 }}>
                <h3 style={{ color:N, fontSize:18, fontWeight:700, marginBottom:24 }}>
                  k(s,t) Sektör × Tehlike Katsayı Matrisi
                </h3>
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                    <thead>
                      <tr style={{ background:N, color:'#fff' }}>
                        {['Sektör','Deprem','Sel','NATECH','Siber','Operasyonel'].map(h => (
                          <th key={h} style={{ padding:'10px 14px', textAlign:'left',
                            fontWeight:600, fontSize:12 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Bankacılık', '2.1', '1.8', '1.5', '5.1', '4.2'],
                        ['Sağlık',     '3.8', '2.9', '3.5', '2.8', '3.1'],
                        ['Sanayi',     '2.6', '3.1', '4.8', '2.2', '2.4'],
                        ['Kamu',       '3.2', '3.4', '2.8', '3.0', '2.6'],
                        ['Eğitim',     '3.0', '2.6', '1.9', '1.8', '2.0'],
                        ['Kritik Alt.','4.1', '3.8', '4.2', '4.5', '3.8'],
                      ].map((row, i) => (
                        <tr key={i} style={{ background: i%2===0 ? BG : GR }}>
                          {row.map((cell, j) => (
                            <td key={j} style={{ padding:'10px 14px', color: j===0 ? N : T,
                              fontWeight: j===0 ? 600 : 700,
                              fontFamily: j>0 ? 'DM Mono,monospace' : 'inherit',
                              borderBottom:`1px solid ${BORDER}` }}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* References */}
              <div style={{ background:`${T}08`, border:`1px solid ${T}25`, borderRadius:12, padding:'24px 28px' }}>
                <p style={{ fontSize:12, fontWeight:700, color:T, letterSpacing:2,
                  textTransform:'uppercase', marginBottom:14 }}>Akademik Referanslar</p>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {[
                    'UNDRR (2015). Sendai Framework for Disaster Risk Reduction 2015–2030. United Nations.',
                    'ISO 22301:2019. Business Continuity Management Systems – Requirements.',
                    'ISO 31000:2018. Risk Management – Guidelines.',
                    'Goldratt, E.M. (1984). The Goal: A Process of Ongoing Improvement. Theory of Constraints.',
                    'Weick, K.E. & Sutcliffe, K.M. (2007). Managing the Unexpected: Resilient Performance in an Age of Uncertainty. HRO.',
                    'FEMA (2019). National Preparedness Goal – Core Capabilities. U.S. Department of Homeland Security.',
                    'RAPID-N (2021). Natech Risk Assessment and Management Tool. European Commission JRC.',
                  ].map((ref, i) => (
                    <div key={i} style={{ display:'flex', gap:10 }}>
                      <span style={{ color:T, fontWeight:700, flexShrink:0, fontSize:12,
                        fontFamily:'DM Mono,monospace', marginTop:2 }}>[{i+1}]</span>
                      <span style={{ fontSize:13, color:MG, lineHeight:1.65 }}>{ref}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── HRO ── */}
          {activeTab === 'hro' && (
            <div>
              <p style={{ color:'#F97316', fontSize:12, fontWeight:700, letterSpacing:3,
                textTransform:'uppercase', marginBottom:12 }}>High Reliability Organization</p>
              <h2 style={{ color:N, fontSize:'clamp(26px,3.5vw,40px)', fontWeight:700,
                lineHeight:1.15, marginBottom:16 }}>
                Yüksek Güvenilirlik Organizasyonu
              </h2>
              <p style={{ color:MG, fontSize:16, lineHeight:1.85, maxWidth:680, marginBottom:48 }}>
                Weick & Sutcliffe (2007) tarafından nükleer enerji, havacılık ve deniz operasyonları
                analizinden türetilen HRO metodolojisi; beklenmedik olayları yönetme kapasitesini
                beş temel ilkeyle ölçer.
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:24, marginBottom:48 }}>
                {[
                  { no:'01', title:'Hatalara Duyarlılık', color:'#F97316',
                    desc:'Küçük anormallikler ve near-miss olayları sistematik olarak raporlanır. Başarı varsayımı kabul edilmez; her sinyal potansiyel bir uyarıdır.',
                    hro:'Preoccupation with Failure' },
                  { no:'02', title:'Basitleştirmeye Direnç', color:R_R,
                    desc:'Karmaşık durumlar tek açıklamaya indirgenmez. Farklı bakış açıları değerlendirilir, bağlamsal çeşitlilik korunur.',
                    hro:'Reluctance to Simplify' },
                  { no:'03', title:'Operasyonlara Odaklanma', color:R_O,
                    desc:'Gerçek zamanlı operasyonel durum izlenir. Saha personelinin anlık farkındalığı hiyerarşinin üzerinde tutulur.',
                    hro:'Sensitivity to Operations' },
                  { no:'04', title:'Esnekliğe Bağlılık', color:R_G,
                    desc:'Beklenmedik durumlarda hızlı adapte olma kapasitesi geliştirilir. Uzman personele yetki devredilir, ritüel prosedürlere teslim olunmaz.',
                    hro:'Commitment to Resilience' },
                  { no:'05', title:'Uzmanlığa Saygı', color:T,
                    desc:'Kriz anında hiyerarşi değil, uzmanlık önceliklidir. Karar yetkisi konuya en yakın kişiye devredilir.',
                    hro:'Deference to Expertise' },
                ].map(p => (
                  <div key={p.no} style={{ background:GR, border:`1px solid ${BORDER}`,
                    borderLeft:`4px solid ${p.color}`, borderRadius:12, padding:'28px 24px' }}>
                    <div style={{ fontSize:32, fontWeight:800, color:`${p.color}30`,
                      fontFamily:'DM Mono,monospace', lineHeight:1, marginBottom:8 }}>{p.no}</div>
                    <div style={{ fontSize:16, fontWeight:700, color:N, marginBottom:6 }}>{p.title}</div>
                    <div style={{ fontSize:10, fontWeight:600, color:p.color, letterSpacing:1,
                      textTransform:'uppercase', marginBottom:12 }}>{p.hro}</div>
                    <p style={{ fontSize:13, color:MG, lineHeight:1.75 }}>{p.desc}</p>
                  </div>
                ))}
              </div>
              <div style={{ background:`${'#F97316'}0D`, border:`1px solid ${'#F97316'}30`,
                borderRadius:12, padding:'24px 28px' }}>
                <p style={{ fontSize:14, fontWeight:600, color:N, lineHeight:1.75 }}>
                  <strong style={{ color:'#F97316' }}>HRO_α Çarpanı:</strong>{' '}
                  Platformda near miss raporlama oranı, tatbikat tamamlama skoru ve komuta
                  olgunluğu değerlerine göre hesaplanan HRO_α, 1.0&apos;ın üzerine çıktığında
                  URI formülünde risk azaltıcı bir çarpan işlevi görür.
                  Near miss sıfır raporlanan kurumda α = 1.20 (yüksek görünmeyen risk).
                  Aktif raporlayan kurumda α = 0.85 (sistematik kontrol altındaki risk).
                </p>
              </div>
            </div>
          )}

          {/* ── TOC ── */}
          {activeTab === 'toc' && (
            <div>
              <p style={{ color:R_R, fontSize:12, fontWeight:700, letterSpacing:3,
                textTransform:'uppercase', marginBottom:12 }}>Theory of Constraints</p>
              <h2 style={{ color:N, fontSize:'clamp(26px,3.5vw,40px)', fontWeight:700,
                lineHeight:1.15, marginBottom:16 }}>
                TOC Darboğaz Analizi
              </h2>
              <p style={{ color:MG, fontSize:16, lineHeight:1.85, maxWidth:680, marginBottom:48 }}>
                Goldratt&apos;ın (1984) Kısıtlar Teorisi, risk yönetiminde 500 riski eşit ağırlıkla
                işleyen geleneksel yaklaşımın yetersizliğini giderir. Sistemi kilitleyecek
                tek kısıt noktası belirlenerek kaynak tahsisi maximize edilir.
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',
                gap:20, marginBottom:48 }}>
                {[
                  { step:'1', title:'Kısıtı Belirle', color:R_R, desc:'Tüm tesis ağında sistem verimini en çok kısıtlayan tek darboğazı tespit et. B (Bottleneck) skoru otomatik hesaplanır.' },
                  { step:'2', title:'Kısıtı Sömür', color:R_O, desc:'Mevcut darboğaz kapasitesini maksimum verimle kullan. Ek yatırım yapmadan mevcut kaynakla çıktıyı optimize et.' },
                  { step:'3', title:'Her Şeyi Ona Tabi Kıl', color:R_Y, desc:'Kısıt olmayan tüm süreçleri darboğazın hızına göre ayarla. Yerel optimizasyon yerine sistem optimizasyonu.' },
                  { step:'4', title:'Kısıtı Kaldır', color:R_G, desc:'Gerekli yatırım ve aksiyon planıyla darboğazı ortadan kaldır. omniSPRINT ile 15 günlük aksiyon döngüsü yönet.' },
                  { step:'5', title:'Tekrarla', color:T, desc:'Eski darboğaz çözülünce sistem yeni bir kısıt bulur. Sürekli iyileştirme döngüsü HRO olgunluğunu artırır.' },
                ].map(s => (
                  <div key={s.step} style={{ background:GR, border:`1px solid ${BORDER}`,
                    borderRadius:12, padding:'24px 20px', position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute', top:12, right:16, fontSize:48, fontWeight:800,
                      color:`${s.color}15`, fontFamily:'DM Mono,monospace', lineHeight:1 }}>{s.step}</div>
                    <div style={{ width:32, height:32, borderRadius:8, background:`${s.color}14`,
                      border:`2px solid ${s.color}30`, display:'flex', alignItems:'center',
                      justifyContent:'center', marginBottom:14 }}>
                      <span style={{ fontSize:14, fontWeight:800, color:s.color,
                        fontFamily:'DM Mono,monospace' }}>{s.step}</span>
                    </div>
                    <div style={{ fontSize:15, fontWeight:700, color:N, marginBottom:8 }}>{s.title}</div>
                    <p style={{ fontSize:13, color:MG, lineHeight:1.7, position:'relative', zIndex:1 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
              <div style={{ background:`${R_R}0D`, border:`1px solid ${R_R}30`,
                borderRadius:12, padding:'24px 28px' }}>
                <p style={{ fontSize:14, fontWeight:600, color:N, lineHeight:1.75 }}>
                  <strong style={{ color:R_R }}>omniRISK&apos;teki Uygulama:</strong>{' '}
                  B (Darboğaz) parametresi, tesis ağı içinde tek başına sistemin tamamını
                  durduracak başarısızlık noktasını (Single Point of Failure) otomatik olarak
                  tespit eder. Bağımlılık zinciri analizi, tedarik zinciri ve kritik altyapı
                  bağlantıları dahil olmak üzere kaskad etkisini modelleyen bir grafik
                  algoritmasıyla hesaplanır.
                </p>
              </div>
            </div>
          )}

          {/* ── FEMA ── */}
          {activeTab === 'fema' && (
            <div>
              <p style={{ color:'#3B7EC8', fontSize:12, fontWeight:700, letterSpacing:3,
                textTransform:'uppercase', marginBottom:12 }}>FEMA National Preparedness Goal</p>
              <h2 style={{ color:N, fontSize:'clamp(26px,3.5vw,40px)', fontWeight:700,
                lineHeight:1.15, marginBottom:16 }}>
                32 Temel Kapasite Çerçevesi
              </h2>
              <p style={{ color:MG, fontSize:16, lineHeight:1.85, maxWidth:680, marginBottom:48 }}>
                FEMA (2019) National Preparedness Goal&apos;un 32 Core Capability alanı,
                omniRISK&apos;in Yönetilebilirlik (C) boyutunun iskeletini oluşturur.
                HIFYEA soru setleri bu çerçeveye göre tasarlanmıştır.
              </p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',
                gap:24, marginBottom:48 }}>
                {[
                  { faz:'Önleme', color:R_G, icon:'🛡️',
                    desc:'Beklenmedik ya da yaklaşan tehditleri tespit etme, engelim ve durdurma kapasitesi.',
                    caps:['İstihbarat ve Bilgi Paylaşımı', 'Terörle Mücadele', 'Fiziksel Koruma Önlemleri', 'Risk ve Tehdit Değerlendirmesi'] },
                  { faz:'Koruma', color:'#3B7EC8', icon:'🔒',
                    desc:'Tehditler gerçekleşmeden fiziksel ve siber altyapıyı, kritik değerleri koruma.',
                    caps:['Siber Güvenlik', 'Erişim Kontrol', 'Tedarik Zinciri Güvencesi', 'Kamu Sağlığı Koruması'] },
                  { faz:'Zarar Azaltma', color:R_Y, icon:'📉',
                    desc:'Uzun vadeli kırılganlık azaltma, risk transferi ve topluluk dayanıklılığı inşası.',
                    caps:['Topluluk Dayanıklılığı', 'Uzun Vadeli Kırılganlık Azaltma', 'Risk ve Kapasite Değerlendirmesi', 'Tehdit ve Tehlike Tanımlaması'] },
                  { faz:'Müdahale', color:R_O, icon:'🚨',
                    desc:'Olayın hemen ardından can kurtarma, hasarı sınırlandırma ve hizmetleri sürdürme.',
                    caps:['Olay Yönetimi', 'Kamu Bilgilendirmesi', 'Arama & Kurtarma', 'Sağlık & Tıbbi'] },
                  { faz:'İyileştirme', color:R_R, icon:'🔄',
                    desc:'Etkilenen bölge ve toplulukların uzun vadeli sosyo-ekonomik toparlanması.',
                    caps:['Ekonomik Kurtarma', 'Sağlık & Sosyal Hizmetler', 'Konut', 'Altyapı Sistemleri'] },
                ].map(f => (
                  <div key={f.faz} style={{ background:GR, border:`1px solid ${BORDER}`,
                    borderRadius:16, padding:'28px', borderTop:`4px solid ${f.color}` }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                      <span style={{ fontSize:28 }}>{f.icon}</span>
                      <div>
                        <div style={{ fontSize:10, fontWeight:700, color:f.color,
                          letterSpacing:2, textTransform:'uppercase' }}>FEMA Fazı</div>
                        <div style={{ fontSize:18, fontWeight:700, color:N }}>{f.faz}</div>
                      </div>
                    </div>
                    <p style={{ fontSize:13, color:MG, lineHeight:1.7, marginBottom:16 }}>{f.desc}</p>
                    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                      {f.caps.map(c => (
                        <div key={c} style={{ display:'flex', gap:8 }}>
                          <span style={{ width:5, height:5, borderRadius:'50%', background:f.color,
                            flexShrink:0, marginTop:6 }}/>
                          <span style={{ fontSize:12, color:N, fontWeight:500 }}>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background:`${'#3B7EC8'}0D`, border:`1px solid ${'#3B7EC8'}30`,
                borderRadius:12, padding:'24px 28px' }}>
                <p style={{ fontSize:14, fontWeight:600, color:N, lineHeight:1.75 }}>
                  <strong style={{ color:'#3B7EC8' }}>HIFYEA Entegrasyonu:</strong>{' '}
                  Bankacılık ve Sanayi HIFYEA soru setlerinin YÖNETİLEBİLİRLİK bölümü
                  doğrudan FEMA Core Capabilities fazlarına eşlenmiştir: Y1-Y6 Prevention,
                  Y7-Y13 Protection, Y14-Y23 Mitigation, Y24-Y36 Response, Y37-Y45 Recovery.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ background:N, padding:'64px 48px', textAlign:'center' }}>
        <p style={{ color:T, fontSize:12, fontWeight:700, letterSpacing:3,
          textTransform:'uppercase', marginBottom:16 }}>Platforma Erişin</p>
        <h2 style={{ color:'#fff', fontSize:'clamp(26px,3.5vw,40px)', fontWeight:700,
          lineHeight:1.15, marginBottom:20 }}>
          Metodoloji Belgelerini İndirin
        </h2>
        <p style={{ color:'rgba(255,255,255,0.55)', fontSize:16, lineHeight:1.75,
          maxWidth:480, margin:'0 auto 40px' }}>
          HFER-720 teknik dokümantasyonu, sektör kalibrasyonu kılavuzu ve
          HIFYEA soru seti tasarım metodolojisi.
        </p>
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/login" style={{ background:T, color:'#fff', fontWeight:700, fontSize:15,
            padding:'14px 36px', borderRadius:8, display:'inline-block', transition:'opacity .18s' }}>
            Platforma Giriş
          </Link>
          <a href="mailto:info@omniversel.com" style={{ border:'1.5px solid rgba(255,255,255,0.2)',
            color:'rgba(255,255,255,0.72)', fontWeight:600, fontSize:15, padding:'13px 32px',
            borderRadius:8, display:'inline-block', transition:'border-color .18s' }}>
            Teknik Soru
          </a>
        </div>
      </section>
    </>
  )
}
