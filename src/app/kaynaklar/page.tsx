'use client'
import React from 'react'
import Link from 'next/link'
import OmniverselLogo from '@/components/OmniverselLogo'

const N = '#0A1628'; const T = '#2D8A87'
const GR = '#F4F7F6'; const MG = '#566B66'; const BG = '#FFFFFF'; const BORDER = '#E8EDED'
const R_R = '#E30613'; const R_O = '#E56A04'; const R_Y = '#FFC801'

const blogYazilari = [
  {
    kategori: 'Metodoloji', kategorRenk: T,
    baslik: 'omniRISK: Yapay Zeka Destekli Birleşik Risk İndeksi (URI)',
    ozet: 'Tehlike (H), kırılganlık (F), maruziyet (E) ve kapasite (C²) bileşenlerini HFER-720 modeliyle nasıl entegre ediyoruz? ALARP ilkesi ve k(s,t) sektör katsayılarının anlamı.',
    okumaSuresi: '8 dk', tarih: 'Mart 2026', tag: 'HFER-720',
  },
  {
    kategori: 'Kavram', kategorRenk: R_O,
    baslik: 'NATECH Nedir? Doğal Afet Kaynaklı Teknolojik Kazalar',
    ozet: 'Deprem ve sel sonrasında sanayi tesislerinde tetiklenen ikincil kazalar, RAPID-N metodolojisi ve Türkiye\'deki sanayi bölgelerinde NATECH risk haritası.',
    okumaSuresi: '6 dk', tarih: 'Şubat 2026', tag: 'NATECH',
  },
  {
    kategori: 'Politika', kategorRenk: '#7B5EA7',
    baslik: 'Sendai Çerçevesi ve Türk Belediyeleri: Pratik Uygulama',
    ozet: '2015-2030 Sendai Çerçevesi\'nin 4 önceliğini ve belediyeler için pratik uygulama adımlarını, omniRISK Sendai uyum skoru ile nasıl izleyebileceğinizi keşfedin.',
    okumaSuresi: '10 dk', tarih: 'Ocak 2026', tag: 'Sendai',
  },
  {
    kategori: 'HRO', kategorRenk: '#F97316',
    baslik: 'Near Miss Kültürü: Küçük Sinyaller Büyük Arızaların Habercisidir',
    ozet: 'Weick & Sutcliffe\'in HRO metodolojisinin kurumlara nasıl uyarlandığı, near miss raporlama döngüsünün HRO_α çarpanını nasıl iyileştirdiği ve sektörel örnekler.',
    okumaSuresi: '7 dk', tarih: 'Aralık 2025', tag: 'HRO',
  },
  {
    kategori: 'Uygulama', kategorRenk: R_R,
    baslik: 'Bankacılık Sektöründe İSP: BDDK Rehberi ve Basel III Entegrasyonu',
    ozet: 'BDDK İş Sürekliliği Yönetimi Rehberi kapsamında İSP hazırlama, Basel III operasyonel risk matrisi ve HIFYEA bankacılık soru setinin tasarım mantığı.',
    okumaSuresi: '9 dk', tarih: 'Kasım 2025', tag: 'Bankacılık',
  },
  {
    kategori: 'Vaka', kategorRenk: T,
    baslik: 'Beylikdüzü Pilot: 782 Tesiste HFER Skorlaması',
    ozet: '10 mahalle, 6 sektör ve 782 tesis kapsayan uygulama projesinde elde edilen bulgular: 103 kritik tesis, NATECH risk haritası ve Sendai uyum artışı.',
    okumaSuresi: '12 dk', tarih: 'Ekim 2025', tag: 'Vaka Çalışması',
  },
]

const caseStudies = [
  {
    baslik: 'Beylikdüzü Pilot Projesi',
    sektor: 'Kamu & Belediye', sektorRenk: T,
    icon: '/icons/Icon_MIT_04_Community.png',
    metrik: '782 Tesis', metrikAlt: '6 sektör · 10 mahalle',
    aciklama: 'omniRISK modeliyle tesis dayanıklılık envanterinin oluşturulması, NATECH tehlike-maruziyet haritası üretimi ve Sendai Çerçevesi öncelik entegrasyonu.',
    detaylar: ['103 yüksek riskli tesis belirlendi', 'NATECH tehlike haritası üretildi', 'Sendai uyum skoru %47 artış'],
    tarih: '2025-2026',
  },
  {
    baslik: 'Bankacılık Ağı HFER Skorlaması',
    sektor: 'Bankacılık & Finans', sektorRenk: '#3B7EC8',
    icon: '/icons/Icon_PROTECT_10_Risk.png',
    metrik: '%34 Risk Azalma', metrikAlt: 'BCM tatbikatları sonrası ölçüldü',
    aciklama: 'Çok şubeli finansal kuruluş ağında HFER skorlaması, operasyonel risk envanteri ve Basel III uyumlu iş sürekliliği planlaması.',
    detaylar: ['Tüm şube ağı HFER skoru hesaplandı', 'Kritik fonksiyonlar RTO/RPO belirlendi', 'Basel III uyum raporu otomatik üretildi'],
    tarih: '2025',
  },
  {
    baslik: 'Sağlık Tesisleri BCP Projesi',
    sektor: 'Sağlık & Hastane', sektorRenk: R_R,
    icon: '/icons/Icon_REC_06_Health.png',
    metrik: '12 Tesis', metrikAlt: 'ISO 22301 uygunluk değerlendirmesi',
    aciklama: 'Kritik hasta hizmetleri sürekliliği, tıbbi altyapı kırılganlık değerlendirmesi ve Sendai SF-3 çerçevesinde ISO 22301 uyumlu BCP geliştirme.',
    detaylar: ['Tıbbi cihaz bağımlılığı modellendi', 'Senaryo bazlı tahliye planları üretildi', 'Sendai SF-3 yatırım önceliklendirmesi yapıldı'],
    tarih: '2024-2025',
  },
]

const pdfRaporlar = [
  {
    baslik: 'HFER-720 Teknik Dokümantasyonu',
    aciklama: 'URI formülü, k(s,t) katsayı matrisi, ALARP eşiği ve hesaplama yöntemi.',
    renk: T, icon: '📐', boyut: '2.4 MB',
  },
  {
    baslik: 'HIFYEA Soru Seti Tasarım Kılavuzu',
    aciklama: 'Sanayi ve bankacılık soru setlerinin metodolojik dayanakları ve sektör kalibrasyonu.',
    renk: '#3B7EC8', icon: '📋', boyut: '1.8 MB',
  },
  {
    baslik: 'Sendai Çerçevesi Uyum Rehberi',
    aciklama: '4 Sendai önceliğinin omniRISK platformuna entegrasyonu ve uyum skoru hesaplama.',
    renk: '#7B5EA7', icon: '🌍', boyut: '3.1 MB',
  },
  {
    baslik: 'BDDK İSP Uyum Kontrol Listesi',
    aciklama: 'BDDK İş Sürekliliği Yönetimi Rehberi kapsamındaki 73 gereksinim ve denetim kriterleri.',
    renk: R_O, icon: '🏦', boyut: '1.2 MB',
  },
]

export default function KaynakPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:${BG};color:${N};font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}
        .kaynak-card{background:${GR};border:1px solid ${BORDER};border-radius:16px;padding:28px;
          transition:box-shadow .2s,transform .2s,border-color .2s;cursor:default}
        .kaynak-card:hover{box-shadow:0 8px 32px rgba(45,138,135,.1);transform:translateY(-3px);border-color:${T}}
      `}</style>

      {/* NAV */}
      <header style={{ position:'sticky', top:0, zIndex:100, height:64,
        background:'rgba(255,255,255,0.97)', backdropFilter:'blur(12px)',
        borderBottom:`1px solid ${BORDER}`, display:'flex', alignItems:'center', padding:'0 48px' }}>
        <div style={{ maxWidth:1200, width:'100%', margin:'0 auto',
          display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Link href="/"><OmniverselLogo width={200} height={50} light /></Link>
          <Link href="/" style={{ display:'flex', alignItems:'center', gap:6, color:MG, fontSize:14,
            fontWeight:500, padding:'8px 16px', borderRadius:8, border:`1px solid ${BORDER}` }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M11 7H3M7 11l-4-4 4-4" stroke={MG} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Ana Sayfa
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section style={{ background:`linear-gradient(135deg, ${N} 0%, #0F2847 100%)`,
        padding:'72px 48px 56px', textAlign:'center' }}>
        <p style={{ color:T, fontSize:12, fontWeight:700, letterSpacing:3,
          textTransform:'uppercase', marginBottom:16 }}>Bilgi Merkezi</p>
        <h1 style={{ color:'#fff', fontSize:'clamp(30px,4vw,50px)', fontWeight:700,
          lineHeight:1.15, marginBottom:16, maxWidth:700, margin:'0 auto 16px' }}>
          Kaynaklar & Uzman İçerikler
        </h1>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:16, lineHeight:1.8,
          maxWidth:560, margin:'0 auto' }}>
          BCM, afet risk yönetimi ve kurumsal dayanıklılık konularında
          derinlemesine makaleler, vaka çalışmaları ve teknik raporlar.
        </p>
      </section>

      {/* BLOG */}
      <section style={{ padding:'72px 48px', background:BG }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <p style={{ color:T, fontSize:12, fontWeight:700, letterSpacing:3,
            textTransform:'uppercase', marginBottom:12 }}>Blog & Makaleler</p>
          <h2 style={{ color:N, fontSize:'clamp(24px,3vw,36px)', fontWeight:700,
            marginBottom:48, lineHeight:1.2 }}>Son Yazılar</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:24 }}>
            {blogYazilari.map((b, i) => (
              <div key={i} className="kaynak-card">
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
                  <span style={{ fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:12,
                    background:`${b.kategorRenk}14`, color:b.kategorRenk,
                    border:`1px solid ${b.kategorRenk}25` }}>{b.kategori}</span>
                  <span style={{ fontSize:11, color:MG }}>{b.okumaSuresi} okuma</span>
                </div>
                <h3 style={{ color:N, fontWeight:700, fontSize:16, lineHeight:1.4, marginBottom:12 }}>{b.baslik}</h3>
                <p style={{ color:MG, fontSize:13, lineHeight:1.75, marginBottom:24 }}>{b.ozet}</p>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                  borderTop:`1px solid ${BORDER}`, paddingTop:16 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ fontSize:12, color:MG }}>{b.tarih}</span>
                    <span style={{ fontSize:10, padding:'2px 8px', borderRadius:20,
                      background:`${b.kategorRenk}10`, color:b.kategorRenk,
                      fontWeight:600, border:`1px solid ${b.kategorRenk}20` }}>{b.tag}</span>
                  </div>
                  <a href="#" style={{ display:'flex', alignItems:'center', gap:5,
                    color:b.kategorRenk, fontSize:13, fontWeight:600 }}>
                    Devamını Oku
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7h8M7 3l4 4-4 4" stroke={b.kategorRenk} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section style={{ padding:'72px 48px', background:GR, borderTop:`1px solid ${BORDER}` }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <p style={{ color:R_O, fontSize:12, fontWeight:700, letterSpacing:3,
            textTransform:'uppercase', marginBottom:12 }}>Vaka Çalışmaları</p>
          <h2 style={{ color:N, fontSize:'clamp(24px,3vw,36px)', fontWeight:700,
            marginBottom:48, lineHeight:1.2 }}>Gerçek Projeler, Ölçülebilir Sonuçlar</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:24 }}>
            {caseStudies.map((cs, i) => (
              <div key={i} style={{ background:BG, border:`1px solid ${BORDER}`, borderRadius:16,
                padding:'28px', transition:'box-shadow .2s,transform .2s' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(45,138,135,.1)'
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
                }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:`${cs.sektorRenk}14`,
                    border:`1px solid ${cs.sektorRenk}30`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <img src={cs.icon} width={28} height={28} alt={cs.sektor} style={{ objectFit:'contain' }}/>
                  </div>
                  <span style={{ fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:12,
                    background:`${cs.sektorRenk}12`, color:cs.sektorRenk,
                    border:`1px solid ${cs.sektorRenk}25` }}>{cs.sektor}</span>
                </div>
                <h3 style={{ color:N, fontWeight:700, fontSize:18, marginBottom:10 }}>{cs.baslik}</h3>
                <p style={{ color:MG, fontSize:13, lineHeight:1.7, marginBottom:20 }}>{cs.aciklama}</p>
                <div style={{ background:`${cs.sektorRenk}08`, border:`1px solid ${cs.sektorRenk}20`,
                  borderRadius:10, padding:'12px 16px', marginBottom:20 }}>
                  <div style={{ fontSize:22, fontWeight:700, color:cs.sektorRenk,
                    fontFamily:'DM Mono,monospace', lineHeight:1 }}>{cs.metrik}</div>
                  <div style={{ fontSize:12, color:MG, marginTop:4 }}>{cs.metrikAlt}</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:20 }}>
                  {cs.detaylar.map((d, j) => (
                    <div key={j} style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
                      <span style={{ width:5, height:5, borderRadius:'50%', background:cs.sektorRenk,
                        flexShrink:0, marginTop:6 }}/>
                      <span style={{ fontSize:13, color:MG, lineHeight:1.5 }}>{d}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                  borderTop:`1px solid ${BORDER}`, paddingTop:16 }}>
                  <span style={{ fontSize:12, color:MG }}>{cs.tarih}</span>
                  <a href="#" style={{ display:'flex', alignItems:'center', gap:5,
                    color:cs.sektorRenk, fontSize:13, fontWeight:600 }}>
                    Vaka Çalışmasını İncele
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7h8M7 3l4 4-4 4" stroke={cs.sektorRenk} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PDF RAPORLAR */}
      <section style={{ padding:'72px 48px', background:BG, borderTop:`1px solid ${BORDER}` }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <p style={{ color:N, fontSize:12, fontWeight:700, letterSpacing:3,
            textTransform:'uppercase', marginBottom:12 }}>Teknik Dokümanlar</p>
          <h2 style={{ color:N, fontSize:'clamp(24px,3vw,36px)', fontWeight:700,
            marginBottom:48, lineHeight:1.2 }}>PDF Raporlar & Kılavuzlar</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
            {pdfRaporlar.map((r, i) => (
              <div key={i} style={{ background:GR, border:`1px solid ${BORDER}`,
                borderRadius:14, padding:'24px', display:'flex', flexDirection:'column', gap:16,
                transition:'box-shadow .18s', cursor:'pointer' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 24px ${r.renk}20`}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'}>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:48, height:48, borderRadius:12, background:`${r.renk}14`,
                    border:`1px solid ${r.renk}30`, display:'flex', alignItems:'center',
                    justifyContent:'center', fontSize:22, flexShrink:0 }}>{r.icon}</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:N, lineHeight:1.35 }}>{r.baslik}</div>
                    <div style={{ fontSize:11, color:MG, marginTop:3 }}>{r.boyut} · PDF</div>
                  </div>
                </div>
                <p style={{ fontSize:12, color:MG, lineHeight:1.65 }}>{r.aciklama}</p>
                <a href="#" style={{ display:'flex', alignItems:'center', gap:6,
                  color:r.renk, fontSize:13, fontWeight:600, marginTop:'auto' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 2v8M3 7l4 4 4-4M2 12h10" stroke={r.renk} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  İndir
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ background:N, padding:'64px 48px', textAlign:'center' }}>
        <h2 style={{ color:'#fff', fontSize:'clamp(24px,3vw,36px)', fontWeight:700,
          marginBottom:16, lineHeight:1.2 }}>Platformu Ücretsiz Deneyin</h2>
        <p style={{ color:'rgba(255,255,255,0.55)', fontSize:16, maxWidth:440,
          margin:'0 auto 36px', lineHeight:1.75 }}>
          14 günlük deneme süresiyle omniRISK metodolojisini kurumunuzda uygulayın.
        </p>
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/login" style={{ background:T, color:'#fff', fontWeight:700, fontSize:15,
            padding:'14px 36px', borderRadius:8, display:'inline-block' }}>
            Ücretsiz Demo
          </Link>
          <Link href="/metodoloji" style={{ border:'1.5px solid rgba(255,255,255,0.2)',
            color:'rgba(255,255,255,0.72)', fontWeight:600, fontSize:15, padding:'13px 32px',
            borderRadius:8, display:'inline-block' }}>
            Metodoloji →
          </Link>
        </div>
      </section>
    </>
  )
}
