'use client'
import Link from 'next/link'
import { Shield, CheckCircle, ArrowRight, Star } from 'lucide-react'

const C = {
  primary: '#009B8D',
  primaryDark: '#007A6E',
  primaryLight: '#E8F7F6',
  navy: '#0A1628',
  slate: '#374151',
  muted: '#6B7280',
  border: '#E5E7EB',
  bg: '#F9FAFB',
  white: '#FFFFFF',
}

const STARTER_FEATURES = [
  '1 tesis değerlendirmesi',
  'Resilience skoru & raporu',
  'PDF rapor ihracı',
  '14 günlük erişim',
  'E-posta desteği',
]

const PRO_FEATURES = [
  'En fazla 50 tesis',
  'Tüm 6 platform modülü',
  'Çevik sprint panosu',
  'Near-miss olay takibi',
  'BCP plan şablonları',
  'Kriz komuta merkezi',
  'PDF + Excel raporları',
  'Öncelikli destek',
  'Onboarding oturumu',
  'Üç aylık gözden geçirme',
]

const ENT_FEATURES = [
  'Sınırsız tesis',
  'Pipeline & HRO dahil tüm modüller',
  'White-label kurulum',
  'REST API erişimi',
  'Özel hesap yöneticisi',
  'SLA garantisi',
  'Yerinde eğitim',
  'Mevzuat raporlama paketi',
  'Özel entegrasyonlar',
  'Yönetim kurulu panosu',
]

const INCLUDES = [
  {
    title: 'Mevzuat Uyumu',
    body: 'Her değerlendirme, uluslararası BCM ve afet riski standartlarına göre yapılandırılmıştır. Uyumluluk çıktıları otomatik olarak oluşturulur.',
  },
  {
    title: 'Veri Güvenliği',
    body: 'KVKK uyumlu altyapı. Kurumsal risk verileri, açık yetkilendirme olmadan yargı bölgenizden çıkmaz.',
  },
  {
    title: 'Uygulama Desteği',
    body: 'Her plan, danışmanlık ekibimizden onboarding içerir — ilk değerlendirmenizin gerçek risk profilinizi yansıtmasını sağlar.',
  },
]

export default function PricingPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.bg, color: C.slate, minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
      `}</style>

      {/* NAV */}
      <nav style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: '0 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'sticky', top: 0, zIndex: 100 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={18} color="#fff" />
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, color: C.navy, letterSpacing: '-0.01em' }}>Omniversel</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link href="/" style={{ fontSize: 14, color: C.muted, fontWeight: 500 }}>Ana Sayfa</Link>
          <Link href="/hub/iso-brifing" style={{ fontSize: 14, color: C.muted, fontWeight: 500 }}>Briefing</Link>
          <Link href="/login" style={{ background: C.primary, color: C.white, fontWeight: 700, fontSize: 14, padding: '8px 20px', borderRadius: 8, display: 'inline-block' }}>
            Giriş Yap
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: C.white, padding: '80px 48px 60px', textAlign: 'center', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: C.primaryLight, color: C.primary, fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20, marginBottom: 20, letterSpacing: '0.04em' }}>
          <Star size={12} />
          Şeffaf Fiyatlandırma
        </div>
        <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, color: C.navy, marginBottom: 16, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Basit, Şeffaf Fiyatlandırma
        </h1>
        <p style={{ fontSize: 18, color: C.muted, maxWidth: 480, margin: '0 auto', lineHeight: 1.65 }}>
          Ücretsiz başlayın. Dirençlilik programınızla ölçeklendirin. Sürpriz ücret yok.
        </p>
      </section>

      {/* PLANS */}
      <section style={{ padding: '64px 48px 80px', background: C.bg }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', gap: 24, justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* STARTER */}
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: 40, width: 340, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Başlangıç</p>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: C.navy, lineHeight: 1.25, marginBottom: 28 }}>
              Tekli Tesis<br />Değerlendirmesi
            </h3>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 48, fontWeight: 800, color: C.primary, lineHeight: 1 }}>Ücretsiz</span>
            </div>
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 28 }}>Kredi kartı gerekmez</p>
            <div style={{ height: 1, background: C.border, marginBottom: 28 }} />
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {STARTER_FEATURES.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: C.slate }}>
                  <CheckCircle size={16} color={C.primary} style={{ flexShrink: 0, marginTop: 1 }} />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/login" style={{ display: 'block', textAlign: 'center', padding: '12px 24px', borderRadius: 8, border: `2px solid ${C.primary}`, color: C.primary, fontWeight: 700, fontSize: 14 }}>
              Ücretsiz Başla
            </Link>
          </div>

          {/* PROFESSIONAL */}
          <div style={{ background: C.white, border: `2px solid ${C.primary}`, borderRadius: 12, padding: 40, width: 380, position: 'relative', boxShadow: `0 8px 32px rgba(0,155,141,0.12)` }}>
            <div style={{ position: 'absolute', top: -14, right: 28, background: C.primary, color: C.white, fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 20, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              En Popüler
            </div>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.primary, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Profesyonel</p>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: C.navy, lineHeight: 1.25, marginBottom: 28 }}>
              50 Tesise Kadar,<br />Tam Platform Paketi
            </h3>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: C.navy, lineHeight: 1 }}>Fiyat için iletişime geçin</span>
            </div>
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 28 }}>Yıllık fatura · Tüm modüller dahil</p>
            <div style={{ height: 1, background: C.border, marginBottom: 28 }} />
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {PRO_FEATURES.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: C.slate }}>
                  <CheckCircle size={16} color={C.primary} style={{ flexShrink: 0, marginTop: 1 }} />
                  {f}
                </li>
              ))}
            </ul>
            <a href="mailto:info@omniversel.com" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 24px', borderRadius: 8, background: C.primary, color: C.white, fontWeight: 700, fontSize: 14 }}>
              Satışla İletişime Geç <ArrowRight size={14} />
            </a>
          </div>

          {/* ENTERPRISE */}
          <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: 40, width: 340, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Kurumsal</p>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: C.navy, lineHeight: 1.25, marginBottom: 28 }}>
              Sınırsız Tesis,<br />White-Label & API
            </h3>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 24, fontWeight: 800, color: C.navy, lineHeight: 1 }}>Fiyat için iletişime geçin</span>
            </div>
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 28 }}>Özel sözleşme · Özel destek</p>
            <div style={{ height: 1, background: C.border, marginBottom: 28 }} />
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
              {ENT_FEATURES.map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: C.slate }}>
                  <CheckCircle size={16} color={C.muted} style={{ flexShrink: 0, marginTop: 1 }} />
                  {f}
                </li>
              ))}
            </ul>
            <a href="mailto:enterprise@omniversel.com" style={{ display: 'block', textAlign: 'center', padding: '12px 24px', borderRadius: 8, border: `1px solid ${C.border}`, color: C.slate, fontWeight: 700, fontSize: 14 }}>
              Kurumsal İletişim
            </a>
          </div>
        </div>
      </section>

      {/* ALL PLANS INCLUDE */}
      <section style={{ background: C.white, padding: '72px 48px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: C.navy, textAlign: 'center', marginBottom: 48, letterSpacing: '-0.01em' }}>
            Tüm Planlara Dahil
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {INCLUDES.map(col => (
              <div key={col.title} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: 28 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 10 }}>{col.title}</h3>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8 }}>{col.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ background: C.primary, padding: '80px 48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, color: C.white, marginBottom: 16, letterSpacing: '-0.02em' }}>
          Başlamaya Hazır mısınız?
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', marginBottom: 36, lineHeight: 1.7 }}>
          Taahhüt yok. Bugün ücretsiz bir değerlendirmeyle başlayın.
        </p>
        <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.white, color: C.primary, fontWeight: 800, fontSize: 15, padding: '14px 36px', borderRadius: 8 }}>
          Ücretsiz Değerlendirme Başlat <ArrowRight size={16} />
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.navy, color: 'rgba(255,255,255,0.6)', padding: '32px 48px', textAlign: 'center' }}>
        <div style={{ fontSize: 12 }}>
          © 2026 Omniversel. Tüm hakları saklıdır. · <Link href="/" style={{ color: 'rgba(255,255,255,0.5)' }}>Ana Sayfa</Link>
        </div>
      </footer>
    </div>
  )
}
