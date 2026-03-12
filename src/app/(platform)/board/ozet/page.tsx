'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { mevcutKullanici, oturumKapat } from '@/lib/auth'
import { getRiskRenk, getRiskEtiket, SEKTOR_ETIKET, Sektor, type FormCevabi } from '@/types'

const SENARYOLAR_DEMO = [
  'Deprem', 'Siber Saldırı', 'Sel / Taşkın',
  'Yangın', 'Elektrik Kesintisi', 'Pandemi / Salgın'
]

export default function BoardOzet() {
  const [formlar,    setFormlar]    = useState<FormCevabi[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [senaryo,    setSenaryo]    = useState('tumu')
  const [kullanici,  setKullanici]  = useState<ReturnType<typeof mevcutKullanici>>(null)

  useEffect(() => {
    const k = mevcutKullanici()
    if (!k?.rol) { window.location.href = '/login'; return }
    setKullanici(k)
    supabase
      .from('form_cevaplari')
      .select('*')
      .eq('durum', 'gonderildi')
      .then(({ data }) => { setFormlar(data || []); setYukleniyor(false) })
  }, [])

  const filtreli = senaryo === 'tumu' ? formlar : formlar.filter(f => f.senaryo === senaryo)
  const kritik   = filtreli.filter(f => f.dayaniklilik_skoru < 40)
  const orta     = filtreli.filter(f => f.dayaniklilik_skoru >= 40 && f.dayaniklilik_skoru < 70)
  const guclu    = filtreli.filter(f => f.dayaniklilik_skoru >= 70)
  const ortSkor  = filtreli.length
    ? Math.round(filtreli.reduce((a, f) => a + f.dayaniklilik_skoru, 0) / filtreli.length)
    : 0
  const enKritik = [...filtreli].sort((a, b) => a.dayaniklilik_skoru - b.dayaniklilik_skoru).slice(0, 8)
  const sektor   = (kullanici?.sektor || 'bankacilik') as Sektor
  const ortH = filtreli.length ? Math.round(filtreli.reduce((a,f)=>a+(f.h_skoru||0),0)/filtreli.length) : 0
  const ortF = filtreli.length ? Math.round(filtreli.reduce((a,f)=>a+(f.f_skoru||0),0)/filtreli.length) : 0
  const ortE = filtreli.length ? Math.round(filtreli.reduce((a,f)=>a+(f.e_skoru||0),0)/filtreli.length) : 0

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* NAV */}
      <nav className="bg-white border-b border-stone-200 px-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <a href="/ana-sayfa" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-stone-900 flex items-center justify-center">
                <span className="text-white font-bold text-xs font-display">R</span>
              </div>
              <span className="font-display font-bold text-stone-900">OMNI</span>
            </a>
            <div className="hidden sm:flex items-center gap-1 text-sm">
              <a href="/board/ozet"
                className="px-3 py-1.5 rounded-lg font-medium bg-stone-100 text-stone-900">
                Yönetim Özeti
              </a>
              <a href="/uzman/dashboard"
                className="px-3 py-1.5 rounded-lg font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition">
                Uzman Paneli
              </a>
              <a href="/harita"
                className="px-3 py-1.5 rounded-lg font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition">
                Risk Haritası
              </a>
              <a href="/board/cok-banka"
                className="px-3 py-1.5 rounded-lg font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition">
                🏦 Çok Banka
              </a>
              <a href="/uzman/bia"
                className="px-3 py-1.5 rounded-lg font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition">
                📊 BIA
              </a>
              <a href="/uzman/istanbul-sanayi"
                className="px-3 py-1.5 rounded-lg font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition">
                🏭 İst. Sanayi
              </a>
              <a href="/board/rapor"
                className="px-3 py-1.5 rounded-lg font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition">
                PDF Rapor
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-stone-700">{kullanici?.ad_soyad}</div>
              <div className="text-[10px] text-stone-400">{kullanici?.tenant}</div>
            </div>
            <button onClick={oturumKapat}
              className="text-xs text-stone-400 hover:text-stone-700 border border-stone-200 px-3 py-1.5 rounded-lg transition">
              Çıkış
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* BAŞLIK */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs text-stone-400 uppercase tracking-widest font-mono-dm mb-1">
              {SEKTOR_ETIKET[sektor]}
            </p>
            <h1 className="font-display text-3xl font-bold text-stone-900">Dayanıklılık Raporu</h1>
            <p className="text-stone-400 text-sm mt-1">{kullanici?.tenant}</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={senaryo}
              onChange={e => setSenaryo(e.target.value)}
              className="border border-stone-200 bg-white text-stone-700 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="tumu">Tüm Senaryolar</option>
              {SENARYOLAR_DEMO.map(s => <option key={s}>{s}</option>)}
            </select>
            <div className="text-xs text-stone-400 bg-white border border-stone-200 px-3 py-2.5 rounded-xl font-mono-dm">
              {new Date().toLocaleDateString('tr-TR', { day:'numeric', month:'long', year:'numeric' })}
            </div>
          </div>
        </div>

        {/* KPI + DAĞILIM */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-5">
          <div className="bg-white border border-stone-200 rounded-2xl p-7 shadow-sm flex flex-col items-center justify-center">
            <div className="text-xs text-stone-400 uppercase tracking-widest mb-3 font-mono-dm">Ağ Ortalaması</div>
            <div className="font-display text-7xl font-bold mb-2" style={{ color: getRiskRenk(ortSkor) }}>
              {yukleniyor ? '—' : ortSkor}
            </div>
            <div className="text-sm font-semibold mb-1" style={{ color: getRiskRenk(ortSkor) }}>
              {!yukleniyor && getRiskEtiket(ortSkor)}
            </div>
            <div className="text-xs text-stone-400">{filtreli.length} birim · /100</div>
          </div>

          <div className="lg:col-span-3 bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
            <div className="text-xs text-stone-400 uppercase tracking-widest mb-5 font-mono-dm">Risk Dağılımı</div>
            {filtreli.length > 0 && (
              <div className="flex h-10 rounded-xl overflow-hidden gap-1 mb-5">
                {kritik.length > 0 && <div className="bg-red-500 flex items-center justify-center" style={{ width: `${(kritik.length/filtreli.length)*100}%` }}><span className="text-xs font-bold text-white">{Math.round((kritik.length/filtreli.length)*100)}%</span></div>}
                {orta.length   > 0 && <div className="bg-amber-400 flex items-center justify-center" style={{ width: `${(orta.length/filtreli.length)*100}%` }}><span className="text-xs font-bold text-white">{Math.round((orta.length/filtreli.length)*100)}%</span></div>}
                {guclu.length  > 0 && <div className="bg-emerald-500 flex items-center justify-center" style={{ width: `${(guclu.length/filtreli.length)*100}%` }}><span className="text-xs font-bold text-white">{Math.round((guclu.length/filtreli.length)*100)}%</span></div>}
              </div>
            )}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Kritik', val: kritik.length, renk: '#EF4444', bg: 'bg-red-50 border-red-100',      acik: '40 puanın altı' },
                { label: 'Orta',   val: orta.length,   renk: '#F59E0B', bg: 'bg-amber-50 border-amber-100',  acik: '40–70 puan arası' },
                { label: 'Güçlü', val: guclu.length,  renk: '#22C55E', bg: 'bg-green-50 border-green-100',  acik: '70 ve üzeri' },
              ].map(k => (
                <div key={k.label} className={`${k.bg} border rounded-2xl p-4 text-center`}>
                  <div className="font-display text-4xl font-bold mb-1" style={{ color: k.renk }}>{k.val}</div>
                  <div className="text-sm font-semibold text-stone-700">{k.label}</div>
                  <div className="text-xs text-stone-400 mt-0.5">{k.acik}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* HFE */}
        {filtreli.length > 0 && (
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm mb-5">
            <div className="text-xs text-stone-400 uppercase tracking-widest mb-5 font-mono-dm">
              H · F · E Bileşen Analizi — Ağ Ortalaması
            </div>
            <div className="grid grid-cols-3 gap-5">
              {[
                { label: 'Tehlike',     kod: 'H', val: ortH, renk: '#F97316', bg: 'bg-orange-50 border-orange-100', acik: 'Düşük değer daha iyi' },
                { label: 'Kırılganlık', kod: 'F', val: ortF, renk: '#EF4444', bg: 'bg-red-50    border-red-100',    acik: 'Düşük değer daha iyi' },
                { label: 'Kapasite',    kod: 'E', val: ortE, renk: '#3B82F6', bg: 'bg-blue-50   border-blue-100',   acik: 'Yüksek değer daha iyi' },
              ].map(k => (
                <div key={k.kod} className={`${k.bg} border rounded-2xl p-5`}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-display text-5xl font-bold" style={{ color: k.renk }}>{k.val}</div>
                      <div className="text-sm font-semibold text-stone-700 mt-1">{k.label}</div>
                    </div>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center font-display text-xl font-bold text-white" style={{ background: k.renk }}>
                      {k.kod}
                    </div>
                  </div>
                  <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${k.val}%`, background: k.renk }} />
                  </div>
                  <div className="text-xs text-stone-400 mt-2">{k.acik}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ÖNCELİKLİ BİRİMLER */}
        {enKritik.length > 0 && (
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm mb-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-xs text-stone-400 uppercase tracking-widest font-mono-dm mb-1">Öncelikli İyileştirme</div>
                <h2 className="font-display text-xl font-bold text-stone-900">Acil Müdahale Gerektiren Birimler</h2>
              </div>
              <button onClick={() => window.location.href = '/uzman/dashboard'}
                className="text-sm text-teal-700 hover:text-teal-900 font-semibold border border-teal-200 bg-teal-50 px-4 py-2 rounded-xl transition">
                Tümünü İncele →
              </button>
            </div>
            <div className="space-y-2">
              {enKritik.map((f, i) => (
                <div key={f.id}
                  onClick={() => window.location.href = `/uzman/sube/${f.birim_kodu}`}
                  className="flex items-center gap-4 px-4 py-3.5 rounded-xl border border-stone-100 hover:border-stone-300 hover:bg-stone-50 transition cursor-pointer group"
                >
                  <span className="font-mono-dm text-xs text-stone-300 w-5">{i+1}</span>
                  <div className="w-1.5 h-8 rounded-full flex-shrink-0" style={{ background: getRiskRenk(f.dayaniklilik_skoru) }} />
                  <span className="font-mono-dm font-bold text-stone-800 text-sm w-16">{f.birim_kodu}</span>
                  <span className="text-xs text-stone-400 w-28 hidden sm:block">{f.senaryo}</span>
                  <div className="flex-1 hidden sm:flex gap-2">
                    {[f.h_skoru??0, f.f_skoru??0, f.e_skoru??0].map((val, bi) => (
                      <div key={bi} className="flex-1 bg-stone-100 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width:`${val}%`, background:['#F97316','#EF4444','#3B82F6'][bi] }} />
                      </div>
                    ))}
                  </div>
                  <div className="font-display text-2xl font-bold flex-shrink-0" style={{ color: getRiskRenk(f.dayaniklilik_skoru) }}>
                    {f.dayaniklilik_skoru}
                  </div>
                  <svg className="w-4 h-4 text-stone-300 group-hover:text-stone-600 transition flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        )}

        {!yukleniyor && filtreli.length === 0 && (
          <div className="bg-white border border-stone-200 rounded-2xl p-16 text-center shadow-sm">
            <div className="font-display text-4xl text-stone-200 mb-3">—</div>
            <p className="text-stone-400 text-sm">Henüz gönderilmiş form bulunmuyor.</p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-stone-200 flex justify-between">
          <span className="text-xs text-stone-400">OMNI Kurumsal Dayanıklılık Platformu</span>
          <span className="text-xs text-stone-300">İTÜ AYM iş birliğiyle geliştirilmiştir</span>
        </div>
      </div>
    </div>
  )
}
