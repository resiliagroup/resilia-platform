'use client'
import { useState } from 'react'
import { DEMO_KULLANICILAR, oturumAc, rolYonlendir } from '@/lib/auth'

// ── Sektör grupları ve renkleri ──────────────────────────────────────────────
const GRUPLAR = [
  {
    id: 'bankacilik', label: 'Bankacılık & Finans', icon: '🏦',
    renk: '#1B4FD8', acik: '#EFF6FF', kenar: '#BFDBFE',
    hesaplar: [
      { email: 'board@akbank.com',    ad: 'Dr. Fatma Şahin',         rol: 'board', kurum: 'Akbank A.Ş.',       rolEtiket: 'Yönetim' },
      { email: 'uzman@akbank.com',    ad: 'Mehmet Demir',            rol: 'uzman', kurum: 'Akbank A.Ş.',       rolEtiket: 'Uzman' },
      { email: 'sube@akbank.com',     ad: 'Ayşe Kaya',               rol: 'birim', kurum: 'Akbank A.Ş.',       rolEtiket: 'Şube' },
      { email: 'board@isbank.com',    ad: 'İş Bankası Yönetim',      rol: 'board', kurum: 'İş Bankası A.Ş.',  rolEtiket: 'Yönetim' },
      { email: 'uzman@isbank.com',    ad: 'İş Bankası Uzman',        rol: 'uzman', kurum: 'İş Bankası A.Ş.',  rolEtiket: 'Uzman' },
    ],
  },
  {
    id: 'uretim', label: 'Sanayi & Üretim', icon: '🏭',
    renk: '#D97706', acik: '#FFFBEB', kenar: '#FDE68A',
    hesaplar: [
      { email: 'izleme@isoistanbul.com', ad: 'ISO İzleme Uzman',     rol: 'uzman', kurum: 'İstanbul Sanayi Odası', rolEtiket: 'Uzman' },
      { email: 'uzman@isoistanbul.com',  ad: 'ISO Uzman',            rol: 'uzman', kurum: 'İstanbul Sanayi Odası', rolEtiket: 'Uzman' },
      { email: 'fabrika@gebzeosb.com',   ad: 'Müh. Can Özdemir',     rol: 'birim', kurum: 'Gebze OSB',             rolEtiket: 'Tesis' },
      { email: 'izleme@iso.org.tr',      ad: 'Gn. Sek. Tuba Erdoğan',rol: 'oda',  kurum: 'İstanbul San. Odası',   rolEtiket: 'Oda' },
      { email: 'izleme@kocaeliso.org.tr',ad: 'İzleme Uzm. Emre Ş.', rol: 'oda',  kurum: 'Kocaeli San. Odası',    rolEtiket: 'Oda' },
      { email: 'izleme@tobb.org.tr',     ad: 'Risk Koor. Selin Y.',  rol: 'oda',  kurum: 'TOBB Marmara',          rolEtiket: 'Oda' },
    ],
  },
  {
    id: 'saglik', label: 'Sağlık', icon: '🏥',
    renk: '#16A34A', acik: '#F0FDF4', kenar: '#BBF7D0',
    hesaplar: [
      { email: 'uzman@medicalpark.com', ad: 'Dr. Ali Yılmaz',         rol: 'uzman', kurum: 'Medical Park',   rolEtiket: 'Uzman' },
      { email: 'tesis@medicalpark.com', ad: 'Hşr. Zeynep Arslan',    rol: 'birim', kurum: 'Medical Park',   rolEtiket: 'Tesis' },
    ],
  },
  {
    id: 'kamu', label: 'Kamu & Eğitim', icon: '🏛️',
    renk: '#7C3AED', acik: '#F5F3FF', kenar: '#DDD6FE',
    hesaplar: [
      { email: 'uzman@ibb.istanbul', ad: 'Dr. Kemal Uzun',            rol: 'uzman', kurum: 'İBB',            rolEtiket: 'Uzman' },
      { email: 'birim@ibb.istanbul', ad: 'Uzm. Hülya Çelik',          rol: 'birim', kurum: 'İBB',            rolEtiket: 'Birim' },
      { email: 'okul@meb.gov.tr',    ad: 'Müdür Seda Doğan',          rol: 'birim', kurum: 'MEB İstanbul',   rolEtiket: 'Okul' },
    ],
  },
]

const ROL_RENK: Record<string, { bg: string; text: string }> = {
  board: { bg: '#F3E8FF', text: '#7C3AED' },
  uzman: { bg: '#DBEAFE', text: '#1D4ED8' },
  birim: { bg: '#F1F5F9', text: '#475569' },
  oda:   { bg: '#CCFBF1', text: '#0F766E' },
}

export default function GirisPage() {
  const [email,      setEmail]      = useState('')
  const [sifre,      setSifre]      = useState('')
  const [hata,       setHata]       = useState('')
  const [yukleniyor, setYukleniyor] = useState(false)
  const [aktifGrup,  setAktifGrup]  = useState<string | null>(null)

  const girisYap = async (e?: string, s?: string) => {
    const em = e ?? email; const sh = s ?? sifre
    setHata(''); setYukleniyor(true)
    const k = DEMO_KULLANICILAR.find(u => u.email === em.trim() && u.sifre === (sh || '1234'))
    if (!k) { setHata('E-posta veya şifre hatalı.'); setYukleniyor(false); return }
    oturumAc(k)
    await new Promise(r => setTimeout(r, 280))
    window.location.href = rolYonlendir(k.rol, k.sektor)
  }

  const hizliGiris = (em: string) => {
    setEmail(em); setSifre('1234')
    girisYap(em, '1234')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'DM Sans',sans-serif", background: '#F8F6F3' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        input::placeholder{color:#C4C0BB} input:focus{outline:none}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:#D1CEC9;border-radius:99px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fadeUp .25s ease forwards}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}} .pulse{animation:pulse 2s infinite}
      `}</style>

      {/* ── SOL: Marka paneli ─────────────────────────────────────────────── */}
      <div style={{ width: 420, background: '#0A1628', display: 'flex', flexDirection: 'column', padding: '40px 36px', flexShrink: 0 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 18, color: 'white' }}>R</span>
          </div>
          <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 20, color: 'white' }}>RESILIA</span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00C9B1' }} className="pulse"/>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,.3)', fontFamily: "'DM Mono',monospace" }}>DEMO</span>
          </div>
        </div>

        {/* Slogan */}
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 900, color: 'white', lineHeight: 1.2, marginBottom: 12 }}>
            Kurumsal<br />Dayanıklılık,<br /><span style={{ color: '#00C9B1' }}>Tek Platformda.</span>
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', lineHeight: 1.7 }}>
            Bankadan okula, fabrikadan belediyeye — 8 sektörde HFE-360 metodolojisiyle iş sürekliliği yönetimi.
          </p>
        </div>

        {/* HFE metodoloji görseli */}
        <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: '18px 20px', marginBottom: 28 }}>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,.3)', fontFamily: "'DM Mono',monospace", textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 14 }}>HFE-360 Metodolojisi · İTÜ AYM</div>
          {[
            { harf: 'H', label: 'Tehlike',     val: 72, renk: '#F97316' },
            { harf: 'F', label: 'Kırılganlık', val: 58, renk: '#EF4444' },
            { harf: 'E', label: 'Kapasite',    val: 81, renk: '#009B8D' },
          ].map(b => (
            <div key={b.harf} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: b.renk, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 13, color: 'white', flexShrink: 0 }}>{b.harf}</div>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', width: 70 }}>{b.label}</span>
              <div style={{ flex: 1, background: 'rgba(255,255,255,.06)', borderRadius: 99, height: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${b.val}%`, background: b.renk, borderRadius: 99 }} />
              </div>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, fontWeight: 500, color: b.renk, width: 20 }}>{b.val}</span>
            </div>
          ))}
        </div>

        {/* Platform istatistikleri */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 'auto' }}>
          {[['600+', 'Birim'], ['8', 'Sektör'], ['49.411', 'Çalışan'], ['19', 'İstanbul OSB']].map(([v, l]) => (
            <div key={l} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 18, fontWeight: 700, color: '#00C9B1', marginBottom: 2 }}>{v}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 28, fontSize: 10, color: 'rgba(255,255,255,.2)', fontFamily: "'DM Mono',monospace" }}>
          İTÜ AYM iş birliğiyle · © 2025-2026 RESILIA
        </div>
      </div>

      {/* ── SAĞ: Giriş + Demo hesaplar ───────────────────────────────────── */}
      <div style={{ flex: 1, overflow: 'auto', padding: '40px 32px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>

          {/* Başlık */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 800, color: '#0A1628', marginBottom: 5 }}>Platforma Giriş</h2>
            <p style={{ fontSize: 13, color: '#9CA3AF' }}>Kurumsal hesabınızla devam edin veya aşağıdan demo hesap seçin.</p>
          </div>

          {/* Giriş formu */}
          <div style={{ background: 'white', borderRadius: 18, border: '1px solid #ECEAE8', padding: '22px 24px', marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,.04)' }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 5 }}>E-posta</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && girisYap()}
                  placeholder="ad@kurum.com"
                  style={{ width: '100%', border: '1.5px solid #E5E3E1', background: '#FAFAF9', borderRadius: 10, padding: '9px 12px', fontSize: 13, color: '#0A1628', fontFamily: "'DM Sans',sans-serif", transition: 'border-color .15s' }}
                  onFocus={e => e.target.style.borderColor = '#009B8D'}
                  onBlur={e => e.target.style.borderColor = '#E5E3E1'} />
              </div>
              <div style={{ width: 120 }}>
                <label style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.07em', display: 'block', marginBottom: 5 }}>Şifre</label>
                <input type="password" value={sifre} onChange={e => setSifre(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && girisYap()}
                  placeholder="••••"
                  style={{ width: '100%', border: '1.5px solid #E5E3E1', background: '#FAFAF9', borderRadius: 10, padding: '9px 12px', fontSize: 13, color: '#0A1628', fontFamily: "'DM Sans',sans-serif", transition: 'border-color .15s' }}
                  onFocus={e => e.target.style.borderColor = '#009B8D'}
                  onBlur={e => e.target.style.borderColor = '#E5E3E1'} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button onClick={() => girisYap()} disabled={yukleniyor}
                  style={{ background: '#0A1628', color: 'white', border: 'none', borderRadius: 10, padding: '9px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", whiteSpace: 'nowrap', opacity: yukleniyor ? .6 : 1, transition: 'all .15s' }}>
                  {yukleniyor ? '…' : 'Giriş Yap →'}
                </button>
              </div>
            </div>
            {hata && (
              <div style={{ fontSize: 12, color: '#DC2626', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '8px 12px' }}>{hata}</div>
            )}
          </div>

          {/* Demo hesaplar başlığı */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 1, background: '#ECEAE8' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.08em', whiteSpace: 'nowrap' }}>Demo Hesaplar · Şifre: 1234</span>
            <div style={{ flex: 1, height: 1, background: '#ECEAE8' }} />
          </div>

          {/* Sektör grupları */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {GRUPLAR.map(g => (
              <div key={g.id} style={{ background: 'white', borderRadius: 16, border: `1.5px solid ${aktifGrup === g.id ? g.renk + '60' : '#ECEAE8'}`, overflow: 'hidden', transition: 'border-color .2s', boxShadow: '0 2px 8px rgba(0,0,0,.03)' }}>
                {/* Grup başlığı */}
                <button onClick={() => setAktifGrup(aktifGrup === g.id ? null : g.id)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '12px 14px', border: 'none', background: aktifGrup === g.id ? g.acik : 'white', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'background .2s', borderBottom: aktifGrup === g.id ? `1px solid ${g.kenar}` : '1px solid transparent' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: g.renk + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{g.icon}</div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#0A1628' }}>{g.label}</div>
                    <div style={{ fontSize: 10, color: '#9CA3AF' }}>{g.hesaplar.length} hesap</div>
                  </div>
                  <span style={{ fontSize: 14, color: '#9CA3AF', transform: aktifGrup === g.id ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>⌄</span>
                </button>

                {/* Hesap listesi */}
                {aktifGrup === g.id && (
                  <div className="fu" style={{ padding: '8px 10px' }}>
                    {g.hesaplar.map(h => {
                      const rr = ROL_RENK[h.rol] || { bg: '#F1F5F9', text: '#475569' }
                      return (
                        <button key={h.email} onClick={() => hizliGiris(h.email)}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', borderRadius: 10, border: 'none', background: 'none', cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", transition: 'background .12s', marginBottom: 3, textAlign: 'left' }}
                          onMouseEnter={e => (e.currentTarget.style.background = g.acik)}
                          onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                          {/* Avatar */}
                          <div style={{ width: 30, height: 30, borderRadius: 8, background: g.renk + '20', border: `1.5px solid ${g.renk}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, flexShrink: 0, fontWeight: 700, color: g.renk }}>
                            {h.ad.charAt(0)}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: '#0A1628', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.ad}</div>
                            <div style={{ fontSize: 9, color: '#9CA3AF', fontFamily: "'DM Mono',monospace", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.email}</div>
                          </div>
                          <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: rr.bg, color: rr.text, flexShrink: 0 }}>{h.rolEtiket}</span>
                          <span style={{ fontSize: 14, color: '#C4C0BB', flexShrink: 0 }}>›</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Alt not */}
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <a href="/ana-sayfa" style={{ fontSize: 11, color: '#C4C0BB', textDecoration: 'none', transition: 'color .15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#6B7280')}
              onMouseLeave={e => (e.currentTarget.style.color = '#C4C0BB')}>
              ← Ana sayfaya dön
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
