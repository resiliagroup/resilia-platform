'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { oturumAc, rolHedefi } from '@/lib/auth'
import OmniverselLogo from '@/components/OmniverselLogo'

const N = '#0A1628'
const G = '#E8C97A'
const T = '#6ABFB8'

function StandardLogos() {
  const logos = [
    { name: 'UNDRR', sub: 'MCR2030' },
    { name: 'ISO', sub: '22301' },
    { name: 'Sendai', sub: '2015–2030' },
    { name: 'AFAD', sub: 'Uyumlu' },
  ]
  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
      {logos.map(l => (
        <div key={l.name} style={{ textAlign: 'center', opacity: 0.5 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#8FA3B8', letterSpacing: 1, lineHeight: 1.2 }}>{l.name}</div>
          <div style={{ fontSize: 10, color: '#5B7080' }}>{l.sub}</div>
        </div>
      ))}
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]           = useState('')
  const [sifre, setSifre]           = useState('')
  const [hata,  setHata]            = useState('')
  const [yukleniyor, setYukleniyor] = useState(false)

  const girisYap = (e: React.FormEvent) => {
    e.preventDefault()
    setYukleniyor(true)
    setHata('')
    try {
      const kullanici = oturumAc(email, sifre)
      router.push(rolHedefi(kullanici.rol, kullanici.tenant))
    } catch {
      setHata('E-posta veya şifre hatalı.')
      setYukleniyor(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',system-ui,sans-serif;-webkit-font-smoothing:antialiased}
        .inp{width:100%;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;
             padding:13px 16px;font-size:14px;color:${N};font-family:'DM Sans',sans-serif;
             outline:none;transition:border-color .18s,box-shadow .18s}
        .inp::placeholder{color:#94A3B8}
        .inp:focus{border-color:${T};box-shadow:0 0 0 3px ${T}22}
        .btn-login{width:100%;background:${N};color:#fff;font-weight:600;font-size:15px;
                   padding:14px;border-radius:10px;border:none;cursor:pointer;
                   font-family:'DM Sans',sans-serif;transition:background .18s,transform .1s}
        .btn-login:hover:not(:disabled){background:#142340;transform:translateY(-1px)}
        .btn-login:disabled{opacity:0.6;cursor:not-allowed}
        .left-panel{display:flex}
        @media(max-width:768px){
          .left-panel{display:none!important}
          .right-panel{padding:32px 20px!important}
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex' }}>

        {/* LEFT: Navy panel — masaüstünde görünür */}
        <div className="left-panel" style={{
          width: '48%', minHeight: '100vh', background: N,
          flexDirection: 'column', justifyContent: 'space-between',
          padding: '52px 56px', borderRight: '1px solid #142340',
        }}>
          <div>
            <OmniverselLogo width={220} height={56} />
          </div>

          <div>
            <p style={{ color: '#94A3B8', fontSize: 11, fontWeight: 700, letterSpacing: 3,
                        textTransform: 'uppercase', marginBottom: 20 }}>
              Urban Resilience Intelligence Platform
            </p>
            <h2 style={{ color: '#F1F5F9', fontSize: 36, fontWeight: 300, lineHeight: 1.25, marginBottom: 48 }}>
              Kurumsal dayanıklılığı<br/>
              <span style={{ color: G, fontWeight: 700 }}>somut veriye</span><br/>
              dönüştürün.
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { kod: 'HFER-720',     baslik: '720 Parametre Motoru',  aciklama: 'Her tesisin tehlike, kırılganlık ve risk skoru anlık hesaplanır.',                    renk: G },
                { kod: 'Sendai',       baslik: 'Uluslararası Çerçeve', aciklama: 'Sendai 2015–2030 ve ISO 22301 standartlarıyla tam entegrasyon.',                       renk: T },
                { kod: 'ISO 22301',    baslik: 'BCM Sürekliliği',       aciklama: 'İş sürekliliği planları otomatik güncellenir, denetim hazır tutulur.',                renk: '#7B9FD4' },
              ].map(b => (
                <div key={b.kod} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, border: `1px solid ${b.renk}33`,
                                background: `${b.renk}11`, display: 'flex', alignItems: 'center',
                                justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 9, fontWeight: 800, color: b.renk, letterSpacing: 0.5, textAlign: 'center', lineHeight: 1.2 }}>
                      {b.kod}
                    </span>
                  </div>
                  <div>
                    <div style={{ color: '#E2E8F0', fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{b.baslik}</div>
                    <div style={{ color: '#5B7080', fontSize: 13, lineHeight: 1.6 }}>{b.aciklama}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ height: 1, background: '#142340', marginBottom: 24 }}/>
            <StandardLogos/>
            <p style={{ color: '#2D4055', fontSize: 11, marginTop: 20 }}>
              İTÜ AYM iş birliğiyle · © {new Date().getFullYear()} Omniversel Teknoloji A.Ş.
            </p>
          </div>
        </div>

        {/* RIGHT: Login form */}
        <div className="right-panel" style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#FFFFFF', padding: '48px 32px',
        }}>
          <div style={{ width: '100%', maxWidth: 380 }}>

            {/* Mobilde logo göster */}
            <div style={{ marginBottom: 36 }}>
              <OmniverselLogo width={200} height={52} light />
            </div>

            <h1 style={{ color: N, fontSize: 26, fontWeight: 700, marginBottom: 6 }}>
              Platforma Giriş
            </h1>
            <p style={{ color: '#94A3B8', fontSize: 14, marginBottom: 36 }}>
              Kurumsal hesabınızla devam edin.
            </p>

            <form onSubmit={girisYap} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input className="inp" type="email" placeholder="E-posta adresi"
                     value={email} onChange={e => setEmail(e.target.value)}
                     required autoComplete="email"/>
              <input className="inp" type="password" placeholder="Şifre"
                     value={sifre} onChange={e => setSifre(e.target.value)}
                     required autoComplete="current-password"/>

              {hata && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8,
                               padding: '10px 14px', color: '#DC2626', fontSize: 13 }}>
                  {hata}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -4 }}>
                <a href="#" style={{ fontSize: 13, color: T, fontWeight: 500 }}
                   onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                   onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}>
                  Şifremi Unuttum
                </a>
              </div>

              <button type="submit" className="btn-login" disabled={yukleniyor} style={{ marginTop: 6 }}>
                {yukleniyor ? 'Giriş yapılıyor…' : 'Giriş Yap'}
              </button>
            </form>

            <div style={{ marginTop: 28, padding: '14px 18px', background: '#F8FAFC',
                          border: '1px solid #E2E8F0', borderRadius: 10 }}>
              <p style={{ fontSize: 12, color: '#94A3B8', lineHeight: 1.6 }}>
                Platforma erişim için{' '}
                <a href="mailto:demo@omniversel.com" style={{ color: T, fontWeight: 600 }}>
                  demo@omniversel.com
                </a>{' '}adresine yazın.
              </p>
            </div>

          </div>
        </div>

      </div>
    </>
  )
}
