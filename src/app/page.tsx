'use client'
import Link from 'next/link'
import { Shield, Building2, Zap, CheckCircle, ArrowRight, BarChart2, Map, Users, FileText, Star } from 'lucide-react'

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
  green: '#10B981',
  orange: '#F59E0B',
  red: '#EF4444',
}

const FEATURES = [
  {
    icon: <Shield size={24} color={C.primary} />,
    title: 'NACE Tehlike Motoru',
    desc: 'NACE kodu girince sistem otomatik olarak ISG tehlike sınıfını belirler. Çok Tehlikeli, Tehlikeli veya Az Tehlikeli — anında sınıflandırma.',
  },
  {
    icon: <FileText size={24} color={C.primary} />,
    title: 'Adaptif Form',
    desc: 'Tehlike sınıfına göre 9, 12 veya 36 soruluk akıllı form. Gereksiz sorular sorulmaz, kritik alanlar vurgulanır.',
  },
  {
    icon: <Zap size={24} color={C.primary} />,
    title: 'Çözüm Bankası',
    desc: '74 DIY aksiyon önerisi — ücretsizden 100K TRY bütçeye kadar sıralanmış, mevzuat referanslı, hemen uygulanabilir.',
  },
]

const STEPS = [
  { num: '01', label: 'NACE Gir', desc: 'Sektör kodunuzu yazın' },
  { num: '02', label: 'Sınıf Tespit', desc: 'Otomatik tehlike sınıfı' },
  { num: '03', label: 'Form Doldur', desc: 'Adaptif sorular' },
  { num: '04', label: 'Çözüm Al', desc: 'Kişisel aksiyon planı' },
]

const SEKTORLER = ['Kimya', 'Metal', 'Tekstil', 'Gıda', 'Enerji', 'İnşaat', 'Lojistik', 'Plastik', 'Makine', 'Elektronik']

export default function HomePage() {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.bg, color: C.slate, minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
      `}</style>

      {/* NAV */}
      <nav style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: '0 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={18} color="#fff" />
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, color: C.navy, letterSpacing: '-0.01em' }}>Omniversel</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link href="/hub/iso-brifing" style={{ fontSize: 14, color: C.muted, fontWeight: 500 }}>Briefing</Link>
          <Link href="/pricing" style={{ fontSize: 14, color: C.muted, fontWeight: 500 }}>Fiyatlar</Link>
          <Link href="/methodology" style={{ fontSize: 14, color: C.muted, fontWeight: 500 }}>Metodoloji</Link>
          <Link href="/login" style={{ background: C.primary, color: C.white, fontWeight: 700, fontSize: 14, padding: '8px 20px', borderRadius: 8, display: 'inline-block' }}>
            Giriş Yap
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: C.white, padding: '80px 48px 64px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: C.primaryLight, color: C.primary, fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20, marginBottom: 24, letterSpacing: '0.04em' }}>
              <Star size={12} />
              İSO × Omniversel İş Birliği
            </div>
            <h1 style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800, color: C.navy, lineHeight: 1.15, marginBottom: 20, letterSpacing: '-0.02em' }}>
              İstanbul Sanayisini<br />Afetlere Hazırlıyoruz
            </h1>
            <p style={{ fontSize: 18, color: C.muted, lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
              22.846 tesisin URI risk skoru — NACE bazlı otomatik sınıflandırma, adaptif form ve kişisel çözüm önerileri.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
              <Link href="/tesis-formu/iso-canli-test-001" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.primary, color: C.white, fontWeight: 700, fontSize: 15, padding: '14px 28px', borderRadius: 8 }}>
                Tesis Formunu Doldur <ArrowRight size={16} />
              </Link>
              <Link href="/hub/iso-brifing" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `2px solid ${C.border}`, color: C.navy, fontWeight: 700, fontSize: 15, padding: '14px 28px', borderRadius: 8, background: C.white }}>
                Briefing Dashboard
              </Link>
            </div>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {[
                { val: '22.846', lbl: 'Kayıtlı Tesis' },
                { val: '2.145', lbl: 'NACE Kodu' },
                { val: '74', lbl: 'DIY Çözüm' },
              ].map(k => (
                <div key={k.lbl}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: C.primary }}>{k.val}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{k.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sağ — URI risk kartı */}
          <div style={{ background: C.bg, borderRadius: 16, border: `1px solid ${C.border}`, padding: 32 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 16, letterSpacing: '0.06em' }}>ÖRNEK URI SKORU</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', border: `4px solid ${C.orange}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', flexShrink: 0 }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: C.orange }}>58</span>
                <span style={{ fontSize: 9, color: C.muted }}>/100</span>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Kimya Tesisi — Tuzla OSB</div>
                <div style={{ fontSize: 12, color: C.muted }}>NACE: 20.13 · ISG Sınıf 1</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.orange, marginTop: 4 }}>Yüksek Risk</div>
              </div>
            </div>
            {[
              { lbl: 'Deprem Tehlikesi', val: 72, color: C.red },
              { lbl: 'BCP Kapasitesi', val: 38, color: C.orange },
              { lbl: 'Yapısal Dayanıklılık', val: 45, color: C.orange },
              { lbl: 'Siber Güvenlik', val: 61, color: C.orange },
            ].map(r => (
              <div key={r.lbl} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: C.slate }}>{r.lbl}</span>
                  <span style={{ fontWeight: 700, color: r.color }}>{r.val}</span>
                </div>
                <div style={{ height: 5, background: C.border, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${r.val}%`, background: r.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 20, padding: '10px 14px', background: C.primaryLight, borderRadius: 8, borderLeft: `3px solid ${C.primary}` }}>
              <div style={{ fontSize: 11, color: C.primary, fontWeight: 700, marginBottom: 2 }}>ÖNERİLEN AKSIYON</div>
              <div style={{ fontSize: 12, color: C.slate }}>AADYP şablonunu doldurun — 0 TRY, AFAD ücretsiz</div>
            </div>
          </div>
        </div>
      </section>

      {/* ÖZELLIKLER */}
      <section style={{ padding: '72px 48px', background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: C.navy, marginBottom: 12, letterSpacing: '-0.01em' }}>Platform Özellikleri</h2>
            <p style={{ fontSize: 16, color: C.muted }}>Sanayi tesisleri için HIFYEA metodolojisi tabanlı dijital dirençlilik</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 28 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: C.navy, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SÜREÇ */}
      <section style={{ padding: '72px 48px', background: C.white, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: C.navy, marginBottom: 12, letterSpacing: '-0.01em' }}>Nasıl Çalışır?</h2>
            <p style={{ fontSize: 16, color: C.muted }}>4 adımda kişisel risk skoru ve aksiyon planı</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {STEPS.map((s, i) => (
              <div key={s.num} style={{ textAlign: 'center', position: 'relative' }}>
                {i < STEPS.length - 1 && (
                  <div style={{ position: 'absolute', top: 24, left: '60%', width: '80%', height: 1, background: C.border }} />
                )}
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: C.primaryLight, border: `2px solid ${C.primary}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', position: 'relative', zIndex: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: C.primary }}>{s.num}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEKTÖRLER */}
      <section style={{ padding: '56px 48px', background: C.bg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>
            Desteklenen Sektörler
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {SEKTORLER.map(s => (
              <span key={s} style={{ padding: '6px 16px', borderRadius: 20, border: `1px solid ${C.border}`, background: C.white, fontSize: 13, color: C.slate, fontWeight: 500 }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* İSTATİSTİKLER */}
      <section style={{ padding: '72px 48px', background: C.white, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {[
            { icon: <Building2 size={20} color={C.primary} />, val: '22.846', lbl: 'Toplam Tesis', sub: 'İSO kayıtlı üye' },
            { icon: <Map size={20} color={C.primary} />, val: '%81.9', lbl: 'Kapsama', sub: 'GPS koordinatlı' },
            { icon: <Users size={20} color={C.primary} />, val: '1.053.058', lbl: 'İstihdam', sub: 'Kayıtlı çalışan' },
            { icon: <BarChart2 size={20} color={C.primary} />, val: '193', lbl: 'Kritik Tesis', sub: 'URI skoru ≥ 60' },
          ].map(k => (
            <div key={k.lbl} style={{ background: C.bg, borderRadius: 12, border: `1px solid ${C.border}`, padding: '24px 20px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>{k.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: C.navy, marginBottom: 4 }}>{k.val}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.slate, marginBottom: 2 }}>{k.lbl}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{k.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ background: C.primary, padding: '72px 48px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <CheckCircle size={36} color="rgba(255,255,255,0.8)" style={{ marginBottom: 20 }} />
          <h2 style={{ fontSize: 32, fontWeight: 800, color: C.white, marginBottom: 16, letterSpacing: '-0.01em' }}>
            Ücretsiz Değerlendirme
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', marginBottom: 32, lineHeight: 1.7 }}>
            Tesisinizin URI risk skorunu öğrenin. Kredi kartı gerekmez — AFAD mevzuatına uygun, tamamen ücretsiz başlayın.
          </p>
          <Link href="/tesis-formu/iso-canli-test-001" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.white, color: C.primary, fontWeight: 800, fontSize: 15, padding: '14px 32px', borderRadius: 8 }}>
            Formu Doldur <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.navy, color: 'rgba(255,255,255,0.6)', padding: '48px 48px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 48, marginBottom: 40 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={16} color="#fff" />
                </div>
                <span style={{ fontSize: 15, fontWeight: 800, color: C.white }}>Omniversel</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 280 }}>
                İstanbul Sanayi Odası × Omniversel iş birliğiyle geliştirilen dijital dirençlilik platformu.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 16, letterSpacing: '0.06em' }}>PLATFORM</div>
              {['Tesis Formu', 'Briefing Dashboard', 'Admin Paneli', 'Paket Seçenekleri'].map(l => (
                <div key={l} style={{ fontSize: 13, marginBottom: 8 }}>{l}</div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 16, letterSpacing: '0.06em' }}>KAYNAKLAR</div>
              {['HIFYEA Metodolojisi', 'ISO 22301', 'AFAD AADY 2025', 'Lean Six Sigma'].map(l => (
                <div key={l} style={{ fontSize: 13, marginBottom: 8 }}>{l}</div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span>© 2026 Omniversel. Tüm hakları saklıdır.</span>
            <span>İSO Ekosistemi · Sprint 9 · v3.2</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
