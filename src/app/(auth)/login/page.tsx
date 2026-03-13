'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { oturumAc, rolHedefi, DEMO_KULLANICILAR } from '@/lib/auth'
import { Shield } from 'lucide-react'

const GRUPLAR = [
  {
    id: 'bankacilik', label: 'Bankacılık & Finans', icon: '🏦', renk: '#E8C97A', kenar: '#E8C97A33',
    hesaplar: DEMO_KULLANICILAR.filter(k => k.sektor === 'bankacilik'),
  },
  {
    id: 'uretim', label: 'Sanayi & Üretim', icon: '🏭', renk: '#6ABFB8', kenar: '#6ABFB833',
    hesaplar: DEMO_KULLANICILAR.filter(k => k.sektor === 'uretim'),
  },
  {
    id: 'saglik', label: 'Sağlık', icon: '🏥', renk: '#7B9FD4', kenar: '#7B9FD433',
    hesaplar: DEMO_KULLANICILAR.filter(k => k.sektor === 'saglik'),
  },
  {
    id: 'kamu', label: 'Kamu & Eğitim', icon: '🏛️', renk: '#9B8EC4', kenar: '#9B8EC433',
    hesaplar: DEMO_KULLANICILAR.filter(k => k.sektor === 'belediye' || k.sektor === 'meb'),
  },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [sifre, setSifre] = useState('')
  const [acikGrup, setAcikGrup] = useState<string | null>(null)
  const [hata, setHata] = useState('')
  const [yukleniyor, setYukleniyor] = useState(false)

  const girisYap = (emailGir: string, sifreGir: string) => {
    setYukleniyor(true)
    setHata('')
    try {
      const kullanici = oturumAc(emailGir, sifreGir)
      router.push(rolHedefi(kullanici.rol, kullanici.tenant))
    } catch {
      setHata('E-posta veya şifre hatalı.')
      setYukleniyor(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A1628] flex">

      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 border-r border-slate-800/40">
        <div className="flex items-center gap-3">
          <div className="bg-[#E8C97A]/10 p-2.5 rounded-xl border border-[#E8C97A]/20">
            <Shield className="w-6 h-6 text-[#E8C97A]" />
          </div>
          <div>
            <p className="text-white font-bold tracking-widest text-lg">OMNI</p>
            <p className="text-slate-500 text-xs tracking-widest uppercase">Resilience Platform</p>
          </div>
        </div>
        <div>
          <p className="text-4xl font-light text-white leading-tight mb-6">
            Kurumsal dayanıklılığı<br />
            <span className="text-[#E8C97A]">tek platformda</span> yönetin.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[{ label: 'Aktif Tesis', value: '600+' }, { label: 'Sektör', value: '8' }, { label: 'İl', value: '81' }].map(item => (
              <div key={item.label} className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
                <p className="text-2xl font-bold text-[#E8C97A]">{item.value}</p>
                <p className="text-xs text-slate-500 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="text-slate-600 text-xs mt-8">İTÜ AYM iş birliğiyle · HFER-720 v2.0 · © 2026 OMNI</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="bg-[#E8C97A]/10 p-2 rounded-lg border border-[#E8C97A]/20">
              <Shield className="w-5 h-5 text-[#E8C97A]" />
            </div>
            <p className="text-white font-bold tracking-widest">OMNI</p>
          </div>

          <h1 className="text-2xl font-semibold text-white mb-2">Platforma Giriş</h1>
          <p className="text-slate-500 text-sm mb-8">Kurumsal hesabınızla devam edin.</p>

          <form onSubmit={e => { e.preventDefault(); girisYap(email, sifre) }} className="space-y-4 mb-8">
            <input
              type="email" placeholder="E-posta" value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#E8C97A]/50 transition-colors"
            />
            <input
              type="password" placeholder="Şifre" value={sifre}
              onChange={e => setSifre(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#E8C97A]/50 transition-colors"
            />
            {hata && <p className="text-red-400 text-xs">{hata}</p>}
            <button type="submit" disabled={yukleniyor}
              className="w-full bg-[#E8C97A] hover:bg-[#d4b56a] text-[#0A1628] font-semibold rounded-xl py-3 text-sm transition-colors disabled:opacity-50">
              {yukleniyor ? 'Giriş yapılıyor...' : 'Giriş Yap →'}
            </button>
          </form>

          {/* ── Hızlı Demo Giriş ── */}
          <p className="text-xs text-slate-600 mb-3 uppercase tracking-widest">Hızlı Demo Giriş</p>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {[
              { label: 'Beylikdüzü Uzmanı',  email: 'uzman@beylikduzu.bel.tr', renk: '#9B8EC4' },
              { label: 'Beylikdüzü Yönetim', email: 'board@beylikduzu.bel.tr', renk: '#9B8EC4' },
              { label: 'Akbank Board',        email: 'board@akbank.com',        renk: '#E8C97A' },
              { label: 'Akbank Şube',         email: 'sube@akbank.com',         renk: '#E8C97A' },
              { label: 'Medical Park',        email: 'board@medicalpark.com',   renk: '#7B9FD4' },
              { label: 'Grand Hotel',         email: 'otel@grandhotel.com',     renk: '#6ABFB8' },
            ].map(d => (
              <button key={d.email} onClick={() => girisYap(d.email, '1234')}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-700/50 bg-slate-800/20 hover:bg-slate-800/50 transition-colors text-left group">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.renk }} />
                <span className="text-xs text-slate-300 group-hover:text-white transition-colors leading-tight">{d.label}</span>
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-600 mb-4 uppercase tracking-widest">Tüm Demo Hesaplar · Şifre: 1234</p>
          <div className="space-y-2">
            {GRUPLAR.map(grup => (
              <div key={grup.id} className="border border-slate-800/40 rounded-xl overflow-hidden">
                <button onClick={() => setAcikGrup(acikGrup === grup.id ? null : grup.id)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/20 hover:bg-slate-800/40 transition-colors text-left">
                  <span className="text-sm text-slate-300 flex items-center gap-2">
                    <span>{grup.icon}</span> {grup.label}
                  </span>
                  <span className="text-slate-600 text-xs">{acikGrup === grup.id ? '▲' : '▼'}</span>
                </button>
                {acikGrup === grup.id && (
                  <div className="divide-y divide-slate-800/40">
                    {grup.hesaplar.map(h => (
                      <button key={h.email} onClick={() => girisYap(h.email, '1234')}
                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-800/30 transition-colors text-left">
                        <div>
                          <p className="text-xs text-white">{h.ad_soyad}</p>
                          <p className="text-xs text-slate-500">{h.tenant}</p>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full border"
                          style={{ color: grup.renk, borderColor: grup.kenar }}>
                          {h.rol}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
