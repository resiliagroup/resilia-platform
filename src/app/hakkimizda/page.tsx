'use client'

import Link from 'next/link'
import OmniverselLogo from '@/components/OmniverselLogo'

/* ─── tokens ─────────────────────────────────────────────────── */
const N      = '#0A1628'
const T      = '#2D8A87'
const G      = '#E8C97A'
const GR     = '#F4F7F6'
const MG     = '#566B66'
const BG     = '#FFFFFF'
const BORDER = '#E8EDED'

/* ═══════════════════════════════════════════════════════════════
   EKIP DATA
═══════════════════════════════════════════════════════════════ */
const team = [
  {
    isim: 'Erkan AKDENİZ',
    unvan: 'Kurucu Ortak / Afet Yönetim Uzmanı',
    bolum: 'Omniversel',
    kurum: 'Omniversel',
    featured: true,
  },
  {
    isim: 'Dr. Öğr. Üyesi Hikmet İSKENDER',
    unvan: 'Akademik Danışman',
    bolum: 'Afet Yönetim Araştırma ve Uygulama Merkezi',
    kurum: 'İTÜ',
    featured: false,
  },
  {
    isim: 'Prof. Dr. Levent TRABZON',
    unvan: 'Öğretim Üyesi',
    bolum: 'Afet Yönetimi Enstitüsü / Makina Fakültesi',
    kurum: 'İTÜ',
    featured: false,
  },
  {
    isim: 'Prof. Dr. Alper İLKİ',
    unvan: 'Öğretim Üyesi',
    bolum: 'Afet Yönetimi Enstitüsü / İnşaat Fakültesi',
    kurum: 'İTÜ',
    featured: false,
  },
  {
    isim: 'Prof. Dr. Filiz BEKTAŞ BALÇIK',
    unvan: 'Öğretim Üyesi',
    bolum: 'Afet Yönetimi Enstitüsü / İnşaat Fakültesi',
    kurum: 'İTÜ',
    featured: false,
  },
  {
    isim: 'Doç. Dr. Abdullah Can ZÜLFİKAR',
    unvan: 'Öğretim Üyesi',
    bolum: 'Afet Yönetimi Enstitüsü',
    kurum: 'İTÜ',
    featured: false,
  },
  {
    isim: 'Doç. Dr. Çağlar GÖKSU AKKAYA',
    unvan: 'Öğretim Üyesi',
    bolum: 'Afet Yönetimi Enstitüsü',
    kurum: 'İTÜ',
    featured: false,
  },
  {
    isim: 'Doç. Dr. Nuri SERTESER',
    unvan: 'Öğretim Üyesi',
    bolum: 'Afet Yönetimi Enstitüsü / Mimarlık Fakültesi',
    kurum: 'İTÜ',
    featured: false,
  },
  {
    isim: 'Doç. Dr. Ömer EKMEKCİOĞLU',
    unvan: 'Öğretim Üyesi',
    bolum: 'Afet Yönetimi Enstitüsü',
    kurum: 'İTÜ',
    featured: false,
  },
  {
    isim: 'Dr. Öğr. Üyesi Ceyhan KAHYA',
    unvan: 'Öğretim Üyesi',
    bolum: 'Afet Yönetimi Enstitüsü / Uçak ve Uzay Bil. Fakültesi',
    kurum: 'İTÜ',
    featured: false,
  },
  {
    isim: 'Araş. Gör. Begüm İSKENDER',
    unvan: 'Araştırmacı',
    bolum: 'Afet Yönetimi Enstitüsü',
    kurum: 'İTÜ',
    featured: false,
  },
  {
    isim: 'Araş. Gör. Eren Mert KAŞ',
    unvan: 'Araştırmacı',
    bolum: 'Afet Yönetimi Enstitüsü',
    kurum: 'İTÜ',
    featured: false,
  },
  {
    isim: 'Araş. Gör. Sinem YAĞMUR',
    unvan: 'Araştırmacı',
    bolum: 'Afet Yönetimi Enstitüsü',
    kurum: 'İTÜ',
    featured: false,
  },
]

const standards = [
  { name: 'UNDRR Sendai 2015–2030', sub: 'Küresel Afet Risk Azaltma Çerçevesi' },
  { name: 'ISO 22301',              sub: 'İş Sürekliliği Yönetim Sistemi' },
  { name: 'AFAD',                   sub: 'T.C. Afet ve Acil Durum Yönetimi' },
  { name: 'TUCBS',                  sub: 'Türkiye Ulusal CBS Standartları' },
  { name: 'EU Horizon Europe',      sub: 'Ar-Ge & İnovasyon Çerçeve Programı' },
  { name: 'İTÜ AYM',               sub: 'Afet Yönetimi Enstitüsü Metodolojisi' },
]

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function HakkimizdaPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:${BG};color:${N};font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100, height: 64,
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center',
        padding: '0 48px',
      }}>
        <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <OmniverselLogo width={180} height={46} light />
          </Link>
          <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            <Link href="/" style={{ color: MG, fontSize: 14, fontWeight: 500, transition: 'color .18s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = T)}
                  onMouseLeave={e => (e.currentTarget.style.color = MG)}>Ana Sayfa</Link>
            <Link href="/hakkimizda" style={{ color: T, fontSize: 14, fontWeight: 600 }}>Hakkımızda</Link>
            <Link href="/login" style={{ background: T, color: '#fff', fontWeight: 700, fontSize: 14,
                                          padding: '9px 22px', borderRadius: 6, display: 'inline-block' }}>
              Demo Talep
            </Link>
          </nav>
        </div>
      </header>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section style={{ background: N, padding: '96px 48px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center',
                      animation: 'fadeUp .7s ease both' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: `${T}20`, border: `1px solid ${T}40`,
                        borderRadius: 20, padding: '5px 14px', marginBottom: 32 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: T, display: 'inline-block' }}/>
            <span style={{ color: T, fontSize: 12, fontWeight: 600, letterSpacing: 1.5 }}>
              HAKKIMIZDA
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 700,
                       lineHeight: 1.1, color: '#fff', marginBottom: 24 }}>
            Omniversel Hakkında
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 18, lineHeight: 1.8,
                      maxWidth: 640, margin: '0 auto' }}>
            Kentsel dirençlilik araştırması ile kurumsal uygulama arasındaki köprü
          </p>
        </div>
      </section>

      {/* ── MİSYON / VİZYON ─────────────────────────────────────── */}
      <section style={{ padding: '80px 48px', background: GR }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            {/* Misyon */}
            <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 20,
                          padding: '48px 44px', borderTop: `4px solid ${T}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${T}14`,
                               border: `1px solid ${T}30`, display: 'flex', alignItems: 'center',
                               justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: T, letterSpacing: 2,
                                textTransform: 'uppercase' }}>Misyon</span>
              </div>
              <p style={{ color: N, fontSize: 16, lineHeight: 1.85, fontWeight: 400 }}>
                Türkiye&apos;nin kentsel ve kurumsal dirençlilik kapasitesini, uluslararası standartlarla
                uyumlu bilimsel yöntemler aracılığıyla <strong style={{ fontWeight: 700 }}>ölçmek,
                geliştirmek ve sürdürülebilir kılmak.</strong>
              </p>
            </div>

            {/* Vizyon */}
            <div style={{ background: BG, border: `1px solid ${BORDER}`, borderRadius: 20,
                          padding: '48px 44px', borderTop: `4px solid ${G}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${G}18`,
                               border: `1px solid ${G}40`, display: 'flex', alignItems: 'center',
                               justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={G} strokeWidth="2" strokeLinecap="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#C8A84A', letterSpacing: 2,
                                textTransform: 'uppercase' }}>Vizyon</span>
              </div>
              <p style={{ color: N, fontSize: 16, lineHeight: 1.85, fontWeight: 400 }}>
                2030 yılına kadar Sendai Çerçevesi hedefleri doğrultusunda Türkiye&apos;nin 81 ilinde
                kurumsal risk atlasını tamamlamak ve <strong style={{ fontWeight: 700 }}>bölgesel ölçekte
                referans platform olmak.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── AKADEMİK ORTAKLIK ────────────────────────────────────── */}
      <section style={{ padding: '80px 48px', background: BG }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ color: T, fontSize: 12, fontWeight: 700, letterSpacing: 3,
                        textTransform: 'uppercase', marginBottom: 14 }}>Akademik Ar-Ge İş Birliği</p>
            <h2 style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, color: N,
                          lineHeight: 1.2, marginBottom: 24, maxWidth: 800, margin: '0 auto 24px' }}>
              İTÜ Afet Yönetim Araştırma ve Uygulama Merkezi (AYM) ile Ar-Ge İş Birliği
            </h2>
            <p style={{ color: MG, fontSize: 16, lineHeight: 1.85, maxWidth: 780, margin: '0 auto 16px' }}>
              Omniversel, İstanbul Teknik Üniversitesi Afet Yönetim Araştırma ve Uygulama Merkezi
              (İTÜ AYM) ile stratejik Ar-Ge iş birliği çerçevesinde faaliyet göstermektedir.{' '}
              <strong style={{ color: N }}>omniRISK metodolojisinin bilimsel temeli</strong>, İTÜ AYM
              bünyesinde yürütülen akademik araştırmalar ve saha çalışmaları ile geliştirilmiş ve
              validasyon süreçleri tamamlanmıştır.
            </p>
          </div>

          {/* 3 işbirliği kartı */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 56 }}>
            {[
              {
                title: 'Ar-Ge İş Birliği',
                icon: '🔬',
                desc: 'omniRISK metodolojisi İTÜ AYM akademik araştırmalarıyla ortak geliştirilmekte; saha çalışmaları ve veri validasyonu birlikte yürütülmektedir.',
              },
              {
                title: 'Eğitim & Kapasite',
                icon: '🎓',
                desc: 'Afet yönetimi, kentsel dayanıklılık ve ISO 22301 alanlarında ortak eğitim programları, sertifika çalışmaları ve kapasite geliştirme faaliyetleri.',
              },
              {
                title: 'Danışmanlık',
                icon: '🤝',
                desc: 'Kamu kurumları ve özel sektör için AFAD/Sendai uyumlu kurumsal dayanıklılık danışmanlığı, kentsel risk atlası üretimi ve politika desteği.',
              },
            ].map(k => (
              <div key={k.title} style={{ background: GR, border: `1px solid ${BORDER}`,
                                           borderTop: `4px solid ${T}`, borderRadius: 16,
                                           padding: '32px 28px' }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>{k.icon}</div>
                <h3 style={{ color: N, fontWeight: 700, fontSize: 17, marginBottom: 12 }}>{k.title}</h3>
                <p style={{ color: MG, fontSize: 14, lineHeight: 1.75 }}>{k.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KURUMSAL YAPI ────────────────────────────────────────── */}
      <section style={{ padding: '80px 48px', background: GR }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ color: T, fontSize: 12, fontWeight: 700, letterSpacing: 3,
                        textTransform: 'uppercase', marginBottom: 12 }}>Kurumsal Yapı</p>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 700, color: N,
                          lineHeight: 1.15, marginBottom: 16 }}>
              Stratejik Ortaklık Modeli
            </h2>
          </div>

          {/* 2 büyük kart + × sembolü */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 24,
                        alignItems: 'center', maxWidth: 900, margin: '0 auto' }}>
            {/* Omniversel kartı */}
            <div style={{ background: N, borderRadius: 24, padding: '48px 40px', textAlign: 'center',
                          boxShadow: '0 8px 40px rgba(10,22,40,.18)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <OmniverselLogo width={200} height={50} />
              </div>
              <p style={{ color: T, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Teknoloji & Platform</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['omniRISK Platform', 'Yazılım Geliştirme', 'Veri Mühendisliği', 'Ürün Yönetimi'].map(item => (
                  <span key={item} style={{ background: `${T}15`, color: 'rgba(255,255,255,0.8)', fontSize: 12,
                                            fontWeight: 500, padding: '5px 12px', borderRadius: 8,
                                            border: `1px solid ${T}25` }}>{item}</span>
                ))}
              </div>
            </div>

            {/* × sembolü */}
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: BG,
                             border: `2px solid ${BORDER}`, display: 'flex', alignItems: 'center',
                             justifyContent: 'center' }}>
                <span style={{ fontSize: 22, fontWeight: 800, color: MG }}>×</span>
              </div>
            </div>

            {/* İTÜ AYM kartı */}
            <div style={{ background: BG, border: `2px solid ${BORDER}`, borderRadius: 24,
                          padding: '48px 40px', textAlign: 'center',
                          boxShadow: '0 4px 24px rgba(45,138,135,.08)' }}>
              <div style={{ width: 72, height: 72, borderRadius: 16, background: `${T}10`,
                             border: `2px solid ${T}30`, display: 'flex', alignItems: 'center',
                             justifyContent: 'center', margin: '0 auto 20px' }}>
                <span style={{ fontSize: 24, fontWeight: 900, color: N, fontFamily: 'DM Sans,sans-serif',
                                letterSpacing: -1 }}>İTÜ</span>
              </div>
              <h3 style={{ color: N, fontWeight: 800, fontSize: 22, marginBottom: 8 }}>İTÜ AYM</h3>
              <p style={{ color: T, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
                Afet Yönetim Araştırma ve Uygulama Merkezi
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Akademik Araştırma', 'Metodoloji Geliştirme', 'Saha Çalışmaları', 'Validasyon'].map(item => (
                  <span key={item} style={{ background: GR, color: MG, fontSize: 12,
                                            fontWeight: 500, padding: '5px 12px', borderRadius: 8,
                                            border: `1px solid ${BORDER}` }}>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STANDARTLAR VE ÇERÇEVELER ────────────────────────────── */}
      <section style={{ padding: '80px 48px', background: BG }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ color: T, fontSize: 12, fontWeight: 700, letterSpacing: 3,
                        textTransform: 'uppercase', marginBottom: 12 }}>Uyum & Çerçeveler</p>
            <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 38px)', fontWeight: 700, color: N,
                          lineHeight: 1.2, marginBottom: 16 }}>
              Uluslararası Standart ve Metodoloji Uyumu
            </h2>
            <p style={{ color: MG, fontSize: 16, maxWidth: 520, margin: '0 auto' }}>
              Platform metodolojisi, aşağıdaki uluslararası çerçeve ve standartlarla
              uyumlu biçimde tasarlanmış ve validasyon süreçleri tamamlanmıştır.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
            {standards.map((s, i) => (
              <div key={i} style={{
                background: GR, border: `1px solid ${BORDER}`, borderRadius: 16,
                padding: '28px 28px', display: 'flex', alignItems: 'flex-start', gap: 16,
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${T}14`,
                               border: `1px solid ${T}30`, display: 'flex', alignItems: 'center',
                               justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="2" strokeLinecap="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <polyline points="9 12 11 14 15 10"/>
                  </svg>
                </div>
                <div>
                  <div style={{ color: N, fontWeight: 700, fontSize: 15, marginBottom: 5 }}>{s.name}</div>
                  <p style={{ color: MG, fontSize: 13, lineHeight: 1.5 }}>{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
          {/* İTÜ AYM link */}
          <div style={{ background: `${T}08`, border: `1px solid ${T}25`, borderRadius: 12,
                        padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T} strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <span style={{ color: MG, fontSize: 14 }}>
              İTÜ AYM hakkında daha fazla bilgi:{' '}
              <a href="https://aym.itu.edu.tr" target="_blank" rel="noopener noreferrer"
                 style={{ color: T, fontWeight: 700, textDecoration: 'underline' }}>
                aym.itu.edu.tr
              </a>
            </span>
          </div>
        </div>
      </section>

      {/* ── İLETİŞİM CTA ─────────────────────────────────────────── */}
      <section style={{ padding: '80px 48px', background: GR }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ background: N, borderRadius: 24, padding: '64px 56px', textAlign: 'center',
                        boxShadow: '0 8px 48px rgba(10,22,40,.14)' }}>
            <p style={{ color: T, fontSize: 12, fontWeight: 700, letterSpacing: 3,
                        textTransform: 'uppercase', marginBottom: 16 }}>İletişim</p>
            <h2 style={{ color: '#fff', fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 700,
                          lineHeight: 1.15, marginBottom: 20 }}>
              İş Birliği ve Demo Talebi için
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 16, lineHeight: 1.75,
                         maxWidth: 520, margin: '0 auto 40px' }}>
              Platform demo talebi, akademik iş birliği görüşmesi veya proje danışmanlığı
              için aşağıdaki formu doldurun. Ekibimiz en kısa sürede sizinle iletişime geçecektir.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/form/basvuru" style={{
                background: T, color: '#fff', fontWeight: 700, fontSize: 15,
                padding: '14px 40px', borderRadius: 8, display: 'inline-block',
                transition: 'opacity .18s',
              }}>
                Başvuru Formuna Git
              </Link>
              <a href="mailto:info@omniversel.com" style={{
                border: '1.5px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.72)',
                fontWeight: 600, fontSize: 15, padding: '13px 32px', borderRadius: 8,
                display: 'inline-block',
              }}>
                info@omniversel.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer style={{ background: N, padding: '48px 48px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      flexWrap: 'wrap', gap: 24 }}>
          <div>
            <OmniverselLogo width={200} height={50} />
          </div>
          <div style={{ display: 'flex', gap: 28 }}>
            {[
              { l: 'Ana Sayfa',  h: '/' },
              { l: 'Hakkımızda', h: '/hakkimizda' },
              { l: 'Platform',   h: '/#products' },
              { l: 'Demo Talep', h: '/login' },
            ].map(item => (
              <Link key={item.l} href={item.h}
                    style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, transition: 'color .18s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}>
                {item.l}
              </Link>
            ))}
          </div>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
            © {new Date().getFullYear()} Omniversel Teknoloji A.Ş.
          </span>
        </div>
      </footer>
    </>
  )
}
