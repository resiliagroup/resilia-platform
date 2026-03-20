'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import OmniverselLogo from '@/components/OmniverselLogo'

const N  = '#0A1628'
const T  = '#6ABFB8'
const G  = '#E8C97A'
const MG = '#8FA3B8'
const BG = '#FFFFFF'
const GR = '#F7F8FA'
const BORDER = '#E8EDF3'
const PRODUCT_COLOR = '#6ABFB8'

export default function OmniRiskPage() {
  const [scrolled, setScrolled] = useState(false)
  const [adSoyad, setAdSoyad]   = useState('')
  const [kurum, setKurum]       = useState('')
  const [eposta, setEposta]     = useState('')
  const [mesaj, setMesaj]       = useState('')

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    alert('Talebiniz alındı. 24 saat içinde sizi arayacağız.')
  }

  const features = [
    {
      icon: '/icons/Icon_MIT_06_Risk.png',
      title: 'HFER-720 Risk Motoru',
      desc: 'Tehlike (H), Kırılganlık (F), Maruziyet (E) ve Kapasite (C) parametrelerini ISO 31000 çerçevesinde işleyerek tesis bazlı URI skoru üreten 720 parametreli hesaplama motoru.',
    },
    {
      icon: '/icons/Icon_PREVENT_01_Planning.png',
      title: 'Çok Tehlike Analizi',
      desc: 'Deprem, sel, NATECH, iklim krizi ve toplumsal olayları tek bütünleşik modelde ele alır. Sendai Çerçevesi tehlike sınıflandırmasıyla uyumlu çok katmanlı risk değerlendirmesi.',
    },
    {
      icon: '/icons/Icon_MIT_03_Operational.png',
      title: 'Mahalle Bazlı URI Skoru',
      desc: 'İlçe ve mahalle düzeyinde Birleşik Risk Endeksi (URI) skoru otomatik üretilir. 39 İstanbul ilçesi için gerçek zamanlı karşılaştırmalı analiz ve önceliklendirme.',
    },
    {
      icon: '/icons/Icon_PROTECT_04_Intelligence.png',
      title: 'CBS & PostGIS Entegrasyonu',
      desc: 'PostGIS tabanlı coğrafi analiz altyapısı; tesis katmanı, ısı haritası ve maruziyet alanı görselleştirmesi. TUCBS standartlarıyla uyumlu veri modeli.',
    },
    {
      icon: '/icons/Icon_PREVENT_07_Forensics.png',
      title: 'F-N Eğrisi & ALARP',
      desc: 'Frekans-Nüfus (F-N) eğrisi analizi ile ALARP metodolojisi çerçevesinde risk toleransı değerlendirmesi. Sektörel kabul edilebilir risk eşikleri otomatik hesaplanır.',
    },
    {
      icon: '/icons/Icon_MIT_01_Planning.png',
      title: 'Otomatik Raporlama',
      desc: 'Yönetim kurulu düzeyinde özet rapor, teknik detay paketi ve denetim kanıt dosyası otomatik üretilir. ISO 31000 ve Sendai Çerçevesi uyum puanı raporlara dahildir.',
    },
  ]

  const standards = [
    { code: 'ISO 31000:2018',    desc: 'Risk yönetimi — İlkeler ve kılavuzlar. omniRISK metodolojisinin temel çerçevesi.' },
    { code: 'Sendai 2015–2030',  desc: 'BM Afet Riski Azaltma Çerçevesi. 4 öncelik alanı ve 7 küresel hedef ile uyum.' },
    { code: 'HFER-720',          desc: 'ITU AYM iş birliğiyle geliştirilen 720 parametreli Tehlike-Frekans-Etki-Risk motoru.' },
    { code: 'RAPID-N',           desc: 'NATECH (Doğal Afet Kaynaklı Teknolojik Kaza) risk değerlendirme metodolojisi.' },
    { code: 'ISO 31010',         desc: 'Risk değerlendirme teknikleri. Senaryo analizi ve olasılık-etki matrisi.' },
    { code: 'TUCBS',             desc: 'Türkiye Ulusal Coğrafi Bilgi Sistemi standartlarıyla uyumlu veri modeli.' },
  ]

  const sectors = [
    { name: 'Kamu & Belediye',   icon: '/icons/Icon_MIT_01_Planning.png',         color: T },
    { name: 'Sanayi & Üretim',   icon: '/icons/Icon_RESP_04_Infrastructure.png',  color: '#E56A04' },
    { name: 'Kritik Altyapı',    icon: '/icons/Icon_PROTECT_09_Physical.png',     color: '#E8C97A' },
    { name: 'Bankacılık',        icon: '/icons/Icon_PROTECT_10_Risk.png',         color: '#1565C0' },
    { name: 'Sağlık',            icon: '/icons/Icon_REC_06_Health.png',           color: '#C62828' },
    { name: 'Eğitim',            icon: '/icons/Icon_MIT_04_Community.png',        color: '#3B7EC8' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:${BG};color:${N};font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}
        .nav-link{color:${MG};font-size:14px;font-weight:500;transition:color .18s}
        .nav-link:hover{color:${N}}
        .btn-teal{display:inline-block;background:${T};color:#fff;font-weight:600;font-size:14px;padding:11px 26px;border-radius:6px;transition:background .18s,transform .12s;cursor:pointer}
        .btn-teal:hover{background:#5AAFAB;transform:translateY(-1px)}
        .btn-outline{display:inline-block;border:1.5px solid ${N};color:${N};font-weight:600;font-size:14px;padding:10px 26px;border-radius:6px;transition:background .18s}
        .btn-outline:hover{background:${GR}}
        .feat-card{background:${BG};border-radius:16px;border:1px solid ${BORDER};padding:32px;transition:box-shadow .2s,transform .2s}
        .feat-card:hover{box-shadow:0 8px 32px rgba(45,138,135,.12);transform:translateY(-3px);border-color:${T}}
        .std-card{background:${BG};border-radius:12px;border:1px solid ${BORDER};padding:24px;flex:1;min-width:200px;transition:box-shadow .2s}
        .std-card:hover{box-shadow:0 4px 20px rgba(10,22,40,.08)}
        .risk-input{border:1px solid #E2E8F0;border-radius:10px;padding:12px 16px;width:100%;font-size:14px;font-family:'DM Sans',sans-serif;color:${N};outline:none;transition:border-color .2s;background:${BG}}
        .risk-input:focus{border-color:${T}}
      `}</style>

      {/* NAV */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: 68, background: BG,
        borderBottom: `1px solid ${scrolled ? BORDER : 'transparent'}`,
        boxShadow: scrolled ? '0 2px 16px rgba(10,22,40,.06)' : 'none',
        transition: 'box-shadow .25s, border-color .25s',
        display: 'flex', alignItems: 'center', padding: '0 48px',
      }}>
        <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/"><OmniverselLogo width={200} height={52} light /></Link>
          <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            <Link href="/#products" className="nav-link">Ürünler</Link>
            <Link href="/#sectors-detail" className="nav-link">Çözümler</Link>
            <Link href="/hakkimizda" className="nav-link">Hakkımızda</Link>
            <Link href="/login" className="btn-teal">Demo Talep</Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section style={{ padding: '140px 48px 100px', background: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto',
                      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '5px 16px', borderRadius: 20,
              background: `${T}18`, border: `1px solid ${T}40`,
              color: T, fontSize: 12, fontWeight: 700, letterSpacing: 2,
              textTransform: 'uppercase', marginBottom: 28,
            }}>
              <Image src="/icons/Icon_MIT_06_Risk.png" width={16} height={16} alt="" style={{ objectFit: 'contain' }}/>
              omniRISK · ISO 31000
            </div>
            <h1 style={{ fontSize: 'clamp(36px, 4.5vw, 58px)', fontWeight: 700,
                         lineHeight: 1.12, color: N, marginBottom: 24 }}>
              Riski ölçemeyen,<br/>yönetemez.
            </h1>
            <p style={{ color: MG, fontSize: 17, lineHeight: 1.85, maxWidth: 500, marginBottom: 16 }}>
              HFER-720 motoru ile çok tehlikeli kentsel ortamlarda tesis bazlı nicel risk değerlendirmesi.
              Depremden NATECH&apos;e, iklim krizinden toplumsal olaylara 720 parametreli bütünleşik analiz.
            </p>
            <p style={{ color: MG, fontSize: 14, lineHeight: 1.7, maxWidth: 500, marginBottom: 40,
                        padding: '12px 16px', background: `${T}08`, borderRadius: 8,
                        borderLeft: `3px solid ${T}` }}>
              İTÜ Afet Yönetim Araştırma ve Uygulama Merkezi (AYM) ile ortak geliştirilen metodoloji;
              ISO 31000, ISO 31010 ve Sendai Çerçevesi ile tam uyumludur.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a href="#demo" className="btn-teal" style={{ fontSize: 15, padding: '13px 32px' }}>Demo Talep Et</a>
              <Link href="/login" className="btn-outline" style={{ fontSize: 15, padding: '12px 32px' }}>Platforma Giriş</Link>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div>
            <svg width="500" height="340" viewBox="0 0 500 340"
                 style={{ borderRadius: 16, width: '100%', maxWidth: 500, boxShadow: '0 24px 64px rgba(10,22,40,.18)' }}>
              <rect width="500" height="340" rx="16" fill="#0A1628"/>
              <rect x="0" y="0" width="500" height="44" fill="#0D1E36"/>
              <circle cx="20" cy="22" r="5" fill="#f87171" fillOpacity="0.7"/>
              <circle cx="36" cy="22" r="5" fill="#E8C97A" fillOpacity="0.7"/>
              <circle cx="52" cy="22" r="5" fill="#6ABFB8" fillOpacity="0.7"/>
              <text x="80" y="26" fill="#ffffff" fontSize="10" fillOpacity="0.4" fontFamily="DM Sans,sans-serif">omniRISK · URI Dashboard</text>
              <rect x="20" y="60" width="140" height="72" rx="8" fill="#ffffff" fillOpacity="0.06"/>
              <rect x="172" y="60" width="140" height="72" rx="8" fill="#ffffff" fillOpacity="0.06"/>
              <rect x="324" y="60" width="156" height="72" rx="8" fill="#ffffff" fillOpacity="0.06"/>
              <text x="90" y="92" fill="#6ABFB8" fontSize="22" fontWeight="700" fontFamily="DM Mono,monospace" textAnchor="middle">720</text>
              <text x="90" y="110" fill="#ffffff" fontSize="9" fontFamily="DM Sans,sans-serif" textAnchor="middle" fillOpacity="0.5">Parametre</text>
              <text x="242" y="92" fill="#E8C97A" fontSize="22" fontWeight="700" fontFamily="DM Mono,monospace" textAnchor="middle">39</text>
              <text x="242" y="110" fill="#ffffff" fontSize="9" fontFamily="DM Sans,sans-serif" textAnchor="middle" fillOpacity="0.5">İlçe</text>
              <text x="402" y="92" fill="#f87171" fontSize="22" fontWeight="700" fontFamily="DM Mono,monospace" textAnchor="middle">4.2</text>
              <text x="402" y="110" fill="#ffffff" fontSize="9" fontFamily="DM Sans,sans-serif" textAnchor="middle" fillOpacity="0.5">Ort. URI Skoru</text>
              <rect x="20" y="148" width="200" height="130" rx="8" fill="#ffffff" fillOpacity="0.04"/>
              <text x="30" y="166" fill="#ffffff" fontSize="9" fillOpacity="0.4" fontFamily="DM Sans,sans-serif">Risk Dağılımı</text>
              <rect x="36" y="240" width="18" height="28" rx="2" fill="#6ABFB8" fillOpacity="0.5"/>
              <rect x="62" y="220" width="18" height="48" rx="2" fill="#6ABFB8" fillOpacity="0.7"/>
              <rect x="88" y="195" width="18" height="73" rx="2" fill="#f87171" fillOpacity="0.8"/>
              <rect x="114" y="215" width="18" height="53" rx="2" fill="#E8C97A" fillOpacity="0.7"/>
              <rect x="140" y="230" width="18" height="38" rx="2" fill="#6ABFB8" fillOpacity="0.4"/>
              <rect x="166" y="208" width="18" height="60" rx="2" fill="#6ABFB8"/>
              <rect x="232" y="148" width="248" height="130" rx="8" fill="#ffffff" fillOpacity="0.04"/>
              <text x="242" y="166" fill="#ffffff" fontSize="9" fillOpacity="0.4" fontFamily="DM Sans,sans-serif">URI Trend · Son 6 Ay</text>
              <polyline points="248,258 280,240 312,248 344,215 376,228 408,205 440,212 464,198"
                        fill="none" stroke="#E8C97A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="248,268 280,260 312,265 344,250 376,255 408,238 440,242 464,230"
                        fill="none" stroke="#6ABFB8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5"/>
              <circle cx="464" cy="198" r="4" fill="#E8C97A"/>
              <line x1="248" y1="148" x2="248" y2="278" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1"/>
              <line x1="248" y1="278" x2="480" y2="278" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1"/>
            </svg>
          </div>
        </div>
      </section>

      {/* FORMULA BAND */}
      <section style={{ background: N, padding: '56px 48px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ color: T, fontSize: 11, fontWeight: 700, letterSpacing: 4,
                      textTransform: 'uppercase', marginBottom: 20 }}>HFER-720 Motoru</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
            {[
              { sym: 'H', label: 'Tehlike' },
              { sym: '×', label: '' },
              { sym: 'F', label: 'Kırılganlık' },
              { sym: '×', label: '' },
              { sym: 'E', label: 'Maruziyet' },
              { sym: '/', label: '' },
              { sym: 'C', label: 'Kapasite' },
              { sym: '=', label: '' },
              { sym: 'URI', label: 'Risk Skoru' },
            ].map((item, i) => (
              item.label ? (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700,
                                fontFamily: 'DM Mono,monospace', color: i === 8 ? G : T,
                                lineHeight: 1 }}>{item.sym}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)',
                                marginTop: 6, letterSpacing: 1 }}>{item.label}</div>
                </div>
              ) : (
                <div key={i} style={{ fontSize: 36, color: 'rgba(255,255,255,0.3)',
                                      fontWeight: 300, lineHeight: 1 }}>{item.sym}</div>
              )
            ))}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, maxWidth: 600, margin: '0 auto' }}>
            720 parametreli model; coğrafi, yapısal, operasyonel ve sosyal verileri
            tek bir ölçülebilir URI skoruna dönüştürerek önceliklendirme yapar.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '100px 48px', background: GR }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ color: T, fontSize: 12, fontWeight: 700, letterSpacing: 3,
                        textTransform: 'uppercase', marginBottom: 12 }}>Özellikler</p>
            <h2 style={{ color: N, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, lineHeight: 1.15 }}>
              omniRISK ile Neler Yapabilirsiniz?
            </h2>
            <p style={{ color: MG, fontSize: 16, marginTop: 16, maxWidth: 600, margin: '16px auto 0' }}>
              ISO 31000 ve Sendai Çerçevesi ile uyumlu altı temel analiz kapasitesi.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} className="feat-card">
                <div style={{ marginBottom: 20 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 12,
                                background: `${T}12`, border: `1px solid ${T}25`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image src={f.icon} width={32} height={32} alt={f.title} style={{ objectFit: 'contain' }}/>
                  </div>
                </div>
                <div style={{ color: N, fontWeight: 700, fontSize: 16, marginBottom: 10 }}>{f.title}</div>
                <p style={{ color: MG, fontSize: 14, lineHeight: 1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTORS */}
      <section style={{ padding: '80px 48px', background: BG }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ color: T, fontSize: 12, fontWeight: 700, letterSpacing: 3,
                      textTransform: 'uppercase', marginBottom: 12 }}>Sektörler</p>
          <h2 style={{ color: N, fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, marginBottom: 8 }}>
            Hangi Sektörlere Hitap Eder?
          </h2>
          <p style={{ color: MG, fontSize: 15, marginBottom: 40, maxWidth: 600 }}>
            Farklı sektörlerin risk toleransı, operasyonel öncelikler ve uyum gereksinimleri
            doğrultusunda özelleştirilmiş analiz profilleri.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {sectors.map((s, i) => (
              <div key={i} style={{ background: GR, border: `1px solid ${BORDER}`,
                                    borderRadius: 14, padding: '24px 28px',
                                    display: 'flex', alignItems: 'center', gap: 16,
                                    transition: 'box-shadow .2s, border-color .2s' }}
                   onMouseEnter={e => {
                     (e.currentTarget as HTMLDivElement).style.borderColor = s.color
                     ;(e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 20px ${s.color}20`
                   }}
                   onMouseLeave={e => {
                     (e.currentTarget as HTMLDivElement).style.borderColor = BORDER
                     ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                   }}>
                <div style={{ width: 44, height: 44, borderRadius: 10,
                              background: `${s.color}14`, border: `1px solid ${s.color}30`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Image src={s.icon} width={26} height={26} alt={s.name} style={{ objectFit: 'contain' }}/>
                </div>
                <span style={{ color: N, fontWeight: 600, fontSize: 15 }}>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STANDARDS */}
      <section style={{ padding: '80px 48px', background: GR }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ color: T, fontSize: 12, fontWeight: 700, letterSpacing: 3,
                      textTransform: 'uppercase', marginBottom: 12 }}>Metodoloji & Uyum</p>
          <h2 style={{ color: N, fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, marginBottom: 8 }}>
            Uluslararası Standart Uyumu
          </h2>
          <p style={{ color: MG, fontSize: 15, marginBottom: 40, maxWidth: 600 }}>
            omniRISK metodolojisi, aşağıdaki uluslararası standart ve çerçevelerle
            uyumlu biçimde tasarlanmış ve validasyon süreçleri tamamlanmıştır.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {standards.map((s, i) => (
              <div key={i} className="std-card">
                <div style={{ color: T, fontWeight: 700, fontSize: 15, marginBottom: 8,
                              fontFamily: 'DM Mono,monospace' }}>{s.code}</div>
                <div style={{ color: MG, fontSize: 13, lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD */}
      <section style={{ padding: '80px 48px', background: N, textAlign: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ color: T, fontSize: 12, fontWeight: 700, letterSpacing: 3,
                      textTransform: 'uppercase', marginBottom: 12 }}>Platform</p>
          <h2 style={{ color: BG, fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700, marginBottom: 16 }}>
            omniRISK Analiz Arayüzü
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 48, maxWidth: 560, margin: '0 auto 48px' }}>
            Gerçek zamanlı URI skoru, tesis karşılaştırma tablosu ve CBS harita görünümü.
          </p>
          <svg width="100%" viewBox="0 0 900 420" style={{ maxWidth: 900, borderRadius: 16,
               boxShadow: '0 32px 80px rgba(0,0,0,.4)' }}>
            <rect width="900" height="420" rx="16" fill="#0D1E36"/>
            <rect x="0" y="0" width="900" height="50" fill="#ffffff" fillOpacity="0.05"/>
            <rect x="20" y="17" width="100" height="16" rx="4" fill="#ffffff" fillOpacity="0.2"/>
            <rect x="140" y="17" width="70" height="16" rx="4" fill="#ffffff" fillOpacity="0.1"/>
            <rect x="230" y="17" width="70" height="16" rx="4" fill="#ffffff" fillOpacity="0.1"/>
            <rect x="780" y="14" width="100" height="22" rx="6" fill={T} fillOpacity="0.5"/>
            <rect x="0" y="50" width="180" height="370" fill="#ffffff" fillOpacity="0.03"/>
            <rect x="16" y="72" width="148" height="12" rx="4" fill="#ffffff" fillOpacity="0.15"/>
            <rect x="16" y="96" width="120" height="12" rx="4" fill="#ffffff" fillOpacity="0.1"/>
            <rect x="16" y="120" width="132" height="12" rx="4" fill="#ffffff" fillOpacity="0.1"/>
            <rect x="16" y="144" width="100" height="12" rx="4" fill={T} fillOpacity="0.4"/>
            <rect x="16" y="168" width="110" height="12" rx="4" fill="#ffffff" fillOpacity="0.08"/>
            <rect x="200" y="68" width="210" height="80" rx="8" fill="#ffffff" fillOpacity="0.06"/>
            <rect x="424" y="68" width="210" height="80" rx="8" fill="#ffffff" fillOpacity="0.06"/>
            <rect x="648" y="68" width="232" height="80" rx="8" fill="#ffffff" fillOpacity="0.06"/>
            <text x="305" y="104" fill={T} fontSize="26" fontWeight="700" fontFamily="DM Mono,monospace" textAnchor="middle">720</text>
            <text x="305" y="122" fill="#ffffff" fontSize="9" fontFamily="DM Sans,sans-serif" textAnchor="middle" fillOpacity="0.4">Analiz Parametresi</text>
            <text x="529" y="104" fill="#E8C97A" fontSize="26" fontWeight="700" fontFamily="DM Mono,monospace" textAnchor="middle">4.2</text>
            <text x="529" y="122" fill="#ffffff" fontSize="9" fontFamily="DM Sans,sans-serif" textAnchor="middle" fillOpacity="0.4">Ortalama URI Skoru</text>
            <text x="764" y="104" fill="#f87171" fontSize="26" fontWeight="700" fontFamily="DM Mono,monospace" textAnchor="middle">103</text>
            <text x="764" y="122" fill="#ffffff" fontSize="9" fontFamily="DM Sans,sans-serif" textAnchor="middle" fillOpacity="0.4">Kritik Tesis</text>
            <rect x="200" y="164" width="320" height="236" rx="8" fill="#ffffff" fillOpacity="0.03"/>
            <text x="216" y="184" fill="#ffffff" fontSize="10" fillOpacity="0.4" fontFamily="DM Sans,sans-serif">URI Risk Dağılımı · İlçe Bazlı</text>
            <rect x="216" y="352" width="26" height="36" rx="3" fill={T} fillOpacity="0.4"/>
            <rect x="254" y="318" width="26" height="70" rx="3" fill={T} fillOpacity="0.6"/>
            <rect x="292" y="285" width="26" height="103" rx="3" fill="#f87171" fillOpacity="0.8"/>
            <rect x="330" y="302" width="26" height="86" rx="3" fill="#E8C97A" fillOpacity="0.7"/>
            <rect x="368" y="325" width="26" height="63" rx="3" fill={T} fillOpacity="0.5"/>
            <rect x="406" y="295" width="26" height="93" rx="3" fill={T}/>
            <rect x="444" y="312" width="26" height="76" rx="3" fill={T} fillOpacity="0.6"/>
            <rect x="482" y="288" width="26" height="100" rx="3" fill="#f87171" fillOpacity="0.6"/>
            <rect x="536" y="164" width="344" height="236" rx="8" fill="#ffffff" fillOpacity="0.03"/>
            <text x="552" y="184" fill="#ffffff" fontSize="10" fillOpacity="0.4" fontFamily="DM Sans,sans-serif">URI Trend · 12 Aylık</text>
            <polyline points="556,368 596,338 636,348 676,308 716,322 756,285 796,298 836,268 876,258"
                      fill="none" stroke="#E8C97A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9"/>
            <polyline points="556,378 596,362 636,368 676,348 716,355 756,330 796,338 836,315 876,308"
                      fill="none" stroke={T} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.4"/>
            <circle cx="876" cy="258" r="5" fill="#E8C97A"/>
            <line x1="200" y1="398" x2="880" y2="398" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1"/>
          </svg>
        </div>
      </section>

      {/* DEMO FORM */}
      <section id="demo" style={{ padding: '100px 48px', background: BG }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ background: BG, borderRadius: 20, padding: '56px 48px',
                        boxShadow: '0 8px 48px rgba(10,22,40,.08)', border: `1px solid ${BORDER}` }}>
            <p style={{ color: T, fontSize: 12, fontWeight: 700, letterSpacing: 3,
                        textTransform: 'uppercase', marginBottom: 12 }}>Demo Talebi</p>
            <h2 style={{ color: N, fontSize: 28, fontWeight: 700, marginBottom: 8 }}>omniRISK Demo Talep Et</h2>
            <p style={{ color: MG, fontSize: 14, marginBottom: 36, lineHeight: 1.75 }}>
              Kurumunuzun risk profilini omniRISK ile değerlendirin.
              Uzmanımız 24 saat içinde sizi arar ve platform üzerinde birlikte ilerleriz.
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input type="text" placeholder="Ad Soyad" value={adSoyad}
                     onChange={e => setAdSoyad(e.target.value)} required className="risk-input"/>
              <input type="text" placeholder="Kurum / Şirket" value={kurum}
                     onChange={e => setKurum(e.target.value)} required className="risk-input"/>
              <input type="email" placeholder="Kurumsal E-posta" value={eposta}
                     onChange={e => setEposta(e.target.value)} required className="risk-input"/>
              <textarea placeholder="Mesajınız (opsiyonel)" value={mesaj}
                        onChange={e => setMesaj(e.target.value)} rows={4}
                        className="risk-input" style={{ resize: 'vertical' }}/>
              <button type="submit" style={{ background: T, color: '#fff', fontWeight: 700,
                       fontSize: 15, padding: '13px 32px', borderRadius: 8, border: 'none',
                       cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'background .18s' }}>
                Demo Talep Et
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: N, padding: '48px 48px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        flexWrap: 'wrap', gap: 24, paddingBottom: 32,
                        borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <OmniverselLogo width={200} height={50} variant="navy" />
            <div style={{ display: 'flex', gap: 32 }}>
              {[['omniRISK', '/products/omnirisk'], ['omniIMPACT', '/products/omniimpact'],
                ['omniPLAN', '/products/omniplan'], ['omniCRISIS', '/products/omnicrisis']].map(([label, href]) => (
                <Link key={label} href={href}
                      style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13,
                               transition: 'color .18s', fontWeight: 500 }}
                      onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = T}
                      onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)'}>
                  {label}
                </Link>
              ))}
            </div>
            <Link href="/login" style={{ display: 'inline-block', background: T, color: '#fff',
                   fontWeight: 600, fontSize: 13, padding: '9px 22px', borderRadius: 6 }}>
              Demo Talep
            </Link>
          </div>
          <div style={{ paddingTop: 24, display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
              © {new Date().getFullYear()} Omniversel Teknoloji A.Ş. · ITU AYM iş birliğiyle · Sendai 2015–2030 uyumlu
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              {['ISO 22301', 'BCM', 'KVKK'].map(tag => (
                <span key={tag} style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11,
                                         padding: '2px 8px', border: '1px solid rgba(255,255,255,0.1)',
                                         borderRadius: 4 }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
