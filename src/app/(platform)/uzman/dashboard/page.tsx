'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { mevcutKullanici, oturumKapat } from '@/lib/auth'
import { getRiskRenk, getRiskEtiket, type FormCevabi } from '@/types'

type Siralama = 'skor_asc' | 'skor_desc' | 'tarih_desc'

export default function UzmanDashboard() {
  const [formlar,    setFormlar]    = useState<FormCevabi[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [acikId,     setAcikId]     = useState<string | null>(null)
  const [filDurum,   setFilDurum]   = useState('gonderildi')
  const [filSenaryo, setFilSenaryo] = useState('tumu')
  const [filRisk,    setFilRisk]    = useState('tumu')
  const [aramaKod,   setAramaKod]   = useState('')
  const [siralama,   setSiralama]   = useState<Siralama>('skor_asc')
  const [kullanici,  setKullanici]  = useState<ReturnType<typeof mevcutKullanici>>(null)

  useEffect(() => {
    const k = mevcutKullanici()
    if (!k?.rol) { window.location.href = '/login'; return }
    setKullanici(k)
    veriGetir()
  }, [])

  const veriGetir = async () => {
    setYukleniyor(true)
    const { data } = await supabase
      .from('form_cevaplari').select('*').order('olusturulma', { ascending: false })
    setFormlar(data || [])
    setYukleniyor(false)
  }

  const incelendi = async (id: string) => {
    const not = prompt('İnceleme notu (isteğe bağlı):') || ''
    await supabase.from('form_cevaplari').update({
      durum: 'incelendi', inceleme_notu: not, incelenme: new Date().toISOString(),
    }).eq('id', id)
    veriGetir()
  }

  const filtrelenmis = formlar
    .filter(f => filDurum   === 'tumu' || f.durum   === filDurum)
    .filter(f => filSenaryo === 'tumu' || f.senaryo === filSenaryo)
    .filter(f => {
      if (filRisk === 'kritik') return f.dayaniklilik_skoru < 40
      if (filRisk === 'orta')   return f.dayaniklilik_skoru >= 40 && f.dayaniklilik_skoru < 70
      if (filRisk === 'guclu')  return f.dayaniklilik_skoru >= 70
      return true
    })
    .filter(f => !aramaKod || f.birim_kodu.toLowerCase().includes(aramaKod.toLowerCase()))
    .sort((a, b) => {
      if (siralama === 'skor_asc')  return a.dayaniklilik_skoru - b.dayaniklilik_skoru
      if (siralama === 'skor_desc') return b.dayaniklilik_skoru - a.dayaniklilik_skoru
      return new Date(b.olusturulma).getTime() - new Date(a.olusturulma).getTime()
    })

  const senaryolar   = [...new Set(formlar.map(f => f.senaryo))]
  const gonderilmis  = formlar.filter(f => f.durum === 'gonderildi')
  const kritikSay    = gonderilmis.filter(f => f.dayaniklilik_skoru < 40).length
  const ortaSay      = gonderilmis.filter(f => f.dayaniklilik_skoru >= 40 && f.dayaniklilik_skoru < 70).length
  const gucluSay     = gonderilmis.filter(f => f.dayaniklilik_skoru >= 70).length
  const ortSkor      = gonderilmis.length
    ? Math.round(gonderilmis.reduce((a, f) => a + f.dayaniklilik_skoru, 0) / gonderilmis.length)
    : 0

  return (
    <div className="min-h-screen bg-stone-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .font-mono-dm { font-family: 'DM Mono', monospace; }
      `}</style>

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
                className="px-3 py-1.5 rounded-lg font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition">
                Yönetim Özeti
              </a>
              <a href="/uzman/dashboard"
                className="px-3 py-1.5 rounded-lg font-medium bg-stone-100 text-stone-900">
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

        {/* BAŞLIK + KPI */}
        <div className="mb-7">
          <h1 className="font-display text-3xl font-bold text-stone-900 mb-6">Uzman İzleme Merkezi</h1>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Toplam Form', val: gonderilmis.length, renk: '#0f172a', bg: 'bg-white border-stone-200' },
              { label: 'Kritik',      val: kritikSay,          renk: '#EF4444', bg: 'bg-red-50 border-red-100' },
              { label: 'Orta Risk',   val: ortaSay,            renk: '#F59E0B', bg: 'bg-amber-50 border-amber-100' },
              { label: 'Ort. Skor',   val: ortSkor,            renk: getRiskRenk(ortSkor), bg: 'bg-white border-stone-200' },
            ].map(k => (
              <div key={k.label} className={`${k.bg} border rounded-2xl p-4 shadow-sm`}>
                <div className="text-xs text-stone-400 mb-1 font-mono-dm">{k.label}</div>
                <div className="font-display text-4xl font-bold" style={{ color: k.renk }}>{k.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FİLTRELER */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 mb-4 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <input
              placeholder="Birim kodu ara..."
              value={aramaKod}
              onChange={e => setAramaKod(e.target.value)}
              className="col-span-2 sm:col-span-1 border border-stone-200 text-sm px-3 py-2.5 rounded-xl text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {[
              { val: filDurum,   set: setFilDurum,   opts: [['tumu','Tüm Durumlar'],['gonderildi','Gönderildi'],['incelendi','İncelendi'],['taslak','Taslak']] },
              { val: filSenaryo, set: setFilSenaryo, opts: [['tumu','Tüm Senaryolar'], ...senaryolar.map(s=>[s,s])] },
              { val: filRisk,    set: setFilRisk,    opts: [['tumu','Tüm Riskler'],['kritik','Kritik'],['orta','Orta'],['guclu','Güçlü']] },
              { val: siralama,   set: (v: string) => setSiralama(v as Siralama), opts: [['skor_asc','Skor Artan'],['skor_desc','Skor Azalan'],['tarih_desc','Son Eklenen']] },
            ].map((f, i) => (
              <select key={i} value={f.val} onChange={e => f.set(e.target.value)}
                className="border border-stone-200 text-sm px-3 py-2.5 rounded-xl text-stone-600 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                {f.opts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            ))}
          </div>
        </div>

        {/* SONUÇ SAYISI */}
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs text-stone-400 font-mono-dm">{filtrelenmis.length} kayıt</span>
          <button onClick={veriGetir} className="text-xs text-stone-400 hover:text-stone-700 transition">
            Yenile
          </button>
        </div>

        {/* LİSTE */}
        {yukleniyor ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-16 text-center shadow-sm">
            <div className="text-stone-300 text-sm">Yükleniyor...</div>
          </div>
        ) : (
          <div className="space-y-2">
            {filtrelenmis.map(f => (
              <div key={f.id} className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">

                {/* Satır */}
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-stone-50 transition group"
                  onClick={() => setAcikId(acikId === f.id ? null : f.id)}
                  onDoubleClick={() => window.location.href = `/uzman/sube/${f.birim_kodu}`}
                >
                  {/* Risk renk çizgisi */}
                  <div className="w-1 h-10 rounded-full flex-shrink-0"
                    style={{ background: getRiskRenk(f.dayaniklilik_skoru) }} />

                  {/* Skor */}
                  <div className="w-12 text-center flex-shrink-0">
                    <div className="font-display text-2xl font-bold"
                      style={{ color: getRiskRenk(f.dayaniklilik_skoru) }}>
                      {f.dayaniklilik_skoru}
                    </div>
                    <div className="text-[9px] font-mono-dm" style={{ color: getRiskRenk(f.dayaniklilik_skoru) }}>
                      {getRiskEtiket(f.dayaniklilik_skoru)}
                    </div>
                  </div>

                  {/* Birim & HFE */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <a
                        href={`/uzman/sube/${f.birim_kodu}`}
                        onClick={e => e.stopPropagation()}
                        className="font-mono-dm font-bold text-stone-800 hover:text-blue-700 hover:underline transition"
                      >{f.birim_kodu}</a>
                      <span className="text-xs text-stone-400">{f.senaryo}</span>
                    </div>
                    <div className="flex gap-2">
                      {[
                        { label:'H', val:f.h_skoru??0, renk:'#F97316' },
                        { label:'F', val:f.f_skoru??0, renk:'#EF4444' },
                        { label:'E', val:f.e_skoru??0, renk:'#3B82F6' },
                      ].map(b => (
                        <div key={b.label} className="flex-1">
                          <div className="flex justify-between mb-0.5">
                            <span className="text-[9px] font-mono-dm" style={{ color: b.renk }}>{b.label}</span>
                            <span className="text-[9px] text-stone-400">{b.val}</span>
                          </div>
                          <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width:`${b.val}%`, background:b.renk }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Durum & Tarih */}
                  <div className="text-right flex-shrink-0">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium inline-block mb-1 ${
                      f.durum === 'incelendi'  ? 'bg-green-100 text-green-700' :
                      f.durum === 'gonderildi' ? 'bg-blue-100 text-blue-700' :
                      'bg-stone-100 text-stone-500'
                    }`}>
                      {f.durum === 'gonderildi' ? 'Gönderildi' : f.durum === 'incelendi' ? 'İncelendi' : 'Taslak'}
                    </span>
                    <div className="text-[10px] text-stone-400">
                      {new Date(f.olusturulma).toLocaleDateString('tr-TR')}
                    </div>
                  </div>

                  <svg className={`w-4 h-4 text-stone-300 transition-transform flex-shrink-0 ${acikId===f.id?'rotate-180':''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Detay Paneli */}
                {acikId === f.id && (
                  <div className="border-t border-stone-100 px-5 py-5 bg-stone-50">
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { label:'Tehlike (H)',     val:f.h_skoru??0, renk:'#F97316' },
                        { label:'Kırılganlık (F)', val:f.f_skoru??0, renk:'#EF4444' },
                        { label:'Kapasite (E)',    val:f.e_skoru??0, renk:'#3B82F6' },
                      ].map(k => (
                        <div key={k.label} className="bg-white rounded-xl p-4 text-center border border-stone-100">
                          <div className="font-display text-4xl font-bold mb-1" style={{ color:k.renk }}>{k.val}</div>
                          <div className="text-xs text-stone-400">{k.label}</div>
                        </div>
                      ))}
                    </div>
                    {f.inceleme_notu && (
                      <div className="bg-green-50 border border-green-100 rounded-xl p-3 mb-3 text-sm text-green-700">
                        Not: {f.inceleme_notu}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.location.href = `/uzman/sube/${f.birim_kodu}`}
                        className="flex-1 bg-blue-700 hover:bg-blue-800 text-white text-sm py-2.5 rounded-xl transition font-semibold"
                      >
                        📊 Detaylı Analiz →
                      </button>
                      {f.durum === 'gonderildi' && (
                        <button
                          onClick={() => incelendi(f.id)}
                          className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-sm py-2.5 rounded-xl transition font-medium"
                        >
                          İncelendi İşaretle
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filtrelenmis.length === 0 && (
              <div className="bg-white border border-stone-200 rounded-2xl p-16 text-center shadow-sm">
                <div className="font-display text-3xl text-stone-200 mb-2">—</div>
                <p className="text-stone-400 text-sm">Filtre kriterlerine uygun kayıt bulunamadı.</p>
              </div>
            )}
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
