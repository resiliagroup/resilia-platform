'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const SUPA_URL = 'https://gqguwgbopgnpwzjwcexl.supabase.co'
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5OTgzMywiZXhwIjoyMDg4OTc1ODMzfQ.Ku-JRx8JFH5a3SIj7sGP_Dy_nM89NMMW34gPyxVO_qI'

const NAVY  = '#0A1628'
const TEAL  = '#009B8D'
const BORDER = '#E2E8F0'

/* ─── Sektör ve alt sektör listesi ───────────────────────────────────────── */
const SEKTORLER: Record<string, string[]> = {
  'Kimya & Petrokimya':   ['Ham kimya üretimi', 'Petrokimya rafinerisi', 'Boya & Vernik', 'Plastik hammadde', 'Gübre & Tarım kimyasalı'],
  'Enerji & Utilities':   ['Elektrik üretimi', 'Doğalgaz dağıtımı', 'Yenilenebilir enerji', 'Petrol depolama', 'Su & Atıksu'],
  'İmalat & Metal':       ['Demir-çelik', 'Alüminyum', 'Bakır & alaşımlar', 'Makine imalatı', 'Döküm & Hadde'],
  'Tekstil & Gıda':       ['Pamuk tekstil', 'Sentetik tekstil', 'Gıda işleme', 'İçecek', 'Ambalaj'],
  'İnşaat & Yapı':        ['Konut inşaatı', 'Sanayi yapıları', 'Altyapı', 'Beton & prefabrik', 'Cam & seramik'],
  'Bankacılık & Finans':  ['Ticaret bankası', 'Katılım bankası', 'Leasing & Faktoring', 'Sermaye piyasaları', 'Ödeme sistemleri'],
  'Sigorta':              ['Hayat sigortası', 'Yangın & Doğal afet', 'Sağlık sigortası', 'Nakliyat sigortası', 'Mühendislik sigortası'],
  'Sağlık':              ['Hastane', 'Klinik & poliklinik', 'Eczane zinciri', 'Medikal cihaz', 'Laboratuvar'],
  'Eğitim':              ['İlk & ortaöğretim', 'Üniversite', 'Mesleki eğitim', 'Özel dershane', 'Uzaktan eğitim'],
  'Ulaşım & Lojistik':   ['Kara taşımacılığı', 'Demiryolu', 'Liman & deniz', 'Hava kargo', 'Depo & antrepo'],
  'Kamu & Belediye':     ['Belediye hizmetleri', 'Bakanlık birimi', 'AFAD & İl MD.', 'Altyapı kuruluşu', 'İtfaiye & acil'],
  'OSB Yönetimi':        ['Ağır sanayi OSB', 'Kimya OSB', 'Teknoloji OSB', 'Karma OSB', 'Küçük sanayi sitesi'],
  'Diğer':              ['Perakende', 'Turizm & Otelcilik', 'Medya & Telekomünikasyon', 'Savunma & Güvenlik', 'Diğer'],
}

const TÜRKİYE_İLLERİ = [
  'Adana','Adıyaman','Afyonkarahisar','Ağrı','Amasya','Ankara','Antalya','Artvin',
  'Aydın','Balıkesir','Bilecik','Bingöl','Bitlis','Bolu','Burdur','Bursa',
  'Çanakkale','Çankırı','Çorum','Denizli','Diyarbakır','Edirne','Elazığ','Erzincan',
  'Erzurum','Eskişehir','Gaziantep','Giresun','Gümüşhane','Hakkari','Hatay',
  'Isparta','Mersin','İstanbul','İzmir','Kars','Kastamonu','Kayseri','Kırklareli',
  'Kırşehir','Kocaeli','Konya','Kütahya','Malatya','Manisa','Kahramanmaraş',
  'Mardin','Muğla','Muş','Nevşehir','Niğde','Ordu','Rize','Sakarya','Samsun',
  'Siirt','Sinop','Sivas','Tekirdağ','Tokat','Trabzon','Tunceli','Şanlıurfa',
  'Uşak','Van','Yozgat','Zonguldak','Aksaray','Bayburt','Karaman','Kırıkkale',
  'Batman','Şırnak','Bartın','Ardahan','Iğdır','Yalova','Karabük','Kilis',
  'Osmaniye','Düzce',
]

const CALISAN_GRUPLAR = ['50 altı', '50 – 250', '250 – 1.000', '1.000+']

/* ─── Tehlike sınıfı tahmini ──────────────────────────────────────────────── */
function getTehlikeSinifi(sektor: string): { sinif: 1 | 2 | 3; label: string; renk: string; bg: string; border: string } {
  if (['Kimya & Petrokimya', 'Enerji & Utilities'].includes(sektor)) {
    return { sinif: 1, label: 'Sınıf 1 — Çok Tehlikeli', renk: '#DC2626', bg: '#FEF2F2', border: '#FECACA' }
  }
  if (['İmalat & Metal', 'Tekstil & Gıda', 'İnşaat & Yapı', 'Ulaşım & Lojistik', 'OSB Yönetimi'].includes(sektor)) {
    return { sinif: 2, label: 'Sınıf 2 — Tehlikeli', renk: '#EA580C', bg: '#FFF7ED', border: '#FED7AA' }
  }
  return { sinif: 3, label: 'Sınıf 3 — Az Tehlikeli', renk: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' }
}

/* ─── İlerleme göstergesi ────────────────────────────────────────────────── */
function ProgressBar({ adim }: { adim: number }) {
  const adimlar = ['Profil', 'Form', 'Rapor']
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 32 }}>
      {adimlar.map((label, i) => {
        const aktif = i === adim
        const tamamlandi = i < adim
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: tamamlandi ? TEAL : aktif ? NAVY : '#E2E8F0',
                color: tamamlandi || aktif ? '#FFFFFF' : '#94A3B8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700,
              }}>
                {tamamlandi ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: 11, fontWeight: aktif ? 700 : 400, color: aktif ? NAVY : '#94A3B8', marginTop: 6, whiteSpace: 'nowrap' }}>
                {label}
              </span>
            </div>
            {i < adimlar.length - 1 && (
              <div style={{ flex: 2, height: 2, background: i < adim ? TEAL : '#E2E8F0', marginBottom: 18, marginTop: 0 }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─── ANA SAYFA ──────────────────────────────────────────────────────────── */
export default function OnboardingPage() {
  const router = useRouter()

  const [tesisAdi, setTesisAdi] = useState('')
  const [sektor, setSektor]     = useState('')
  const [altSektor, setAlt]     = useState('')
  const [calisan, setCalisan]   = useState('')
  const [il, setIl]             = useState('')
  const [ilce, setIlce]         = useState('')
  const [nace, setNace]         = useState('')
  const [naceLoad, setNaceLoad] = useState(false)
  const [naceTehlike, setNaceTehlike] = useState<{ sinif: number; label: string } | null>(null)
  const [kaydediliyor, setKaydediliyor] = useState(false)
  const [hata, setHata] = useState('')

  const tehlike = naceTehlike
    ? { sinif: naceTehlike.sinif as 1|2|3, label: naceTehlike.label,
        renk: naceTehlike.sinif === 1 ? '#DC2626' : naceTehlike.sinif === 2 ? '#EA580C' : '#16A34A',
        bg: naceTehlike.sinif === 1 ? '#FEF2F2' : naceTehlike.sinif === 2 ? '#FFF7ED' : '#F0FDF4',
        border: naceTehlike.sinif === 1 ? '#FECACA' : naceTehlike.sinif === 2 ? '#FED7AA' : '#BBF7D0' }
    : sektor ? getTehlikeSinifi(sektor) : null

  const onNaceChange = async (val: string) => {
    setNace(val)
    const temiz = val.replace(/\s/g, '')
    if (temiz.length >= 4) {
      setNaceLoad(true)
      const r = await fetch(
        `${SUPA_URL}/rest/v1/nace_tehlike?nace_alti_kod=like.${encodeURIComponent(temiz)}*&select=tehlike_sinifi,tehlike_label&order=nace_alti_kod.asc&limit=1`,
        { headers: { apikey: SUPA_KEY } }
      )
      if (r.ok) {
        const data = await r.json()
        if (data.length > 0) {
          setNaceTehlike({ sinif: data[0].tehlike_sinifi, label: data[0].tehlike_label })
        } else {
          setNaceTehlike(null)
        }
      }
      setNaceLoad(false)
    } else {
      setNaceTehlike(null)
    }
  }

  const kaydet = async () => {
    if (!tesisAdi) { setHata('Tesis adı zorunludur.'); return }
    if (!sektor)   { setHata('Sektör seçimi zorunludur.'); return }
    if (!il)       { setHata('İl seçimi zorunludur.'); return }

    setKaydediliyor(true); setHata('')
    try {
      await fetch(`${SUPA_URL}/rest/v1/tesis_profil`, {
        method: 'POST',
        headers: {
          apikey: SUPA_KEY,
          Authorization: `Bearer ${SUPA_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          tesis_adi: tesisAdi,
          sektor,
          alt_sektor: altSektor || null,
          calisan_grubu: calisan || null,
          il,
          ilce: ilce || null,
          nace_kodu: nace || null,
          tehlike_sinifi: tehlike?.sinif ?? null,
          olusturma_tarihi: new Date().toISOString(),
        }),
      })
      router.push('/hub/site-haritasi')
    } catch {
      setHata('Kaydedilemedi, lütfen tekrar deneyin.')
      setKaydediliyor(false)
    }
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '10px 14px',
    border: `1px solid ${BORDER}`, borderRadius: 8,
    fontSize: 14, outline: 'none', boxSizing: 'border-box',
    background: '#FFFFFF', color: NAVY,
  }
  const lbl: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        select option { color: #0A1628; }
      `}</style>

      <div style={{ width: '100%', maxWidth: 640 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TEAL, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 8 }}>
            OMNIVERSEL PLATFORM
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: NAVY, marginBottom: 8, letterSpacing: '-0.5px' }}>
            Tesisini Tanıt
          </h1>
          <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6 }}>
            Platforma hoş geldin. Tesisine özel risk profili oluşturmak için birkaç bilgiye ihtiyacımız var.
          </p>
        </div>

        {/* İlerleme */}
        <ProgressBar adim={0} />

        {/* Kart */}
        <div style={{ background: '#FFFFFF', borderRadius: 16, border: `1px solid ${BORDER}`, padding: '36px 40px', boxShadow: '0 4px 24px rgba(10,22,40,0.06)' }}>

          {/* Tesis Adı */}
          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Tesis Adı <span style={{ color: '#EF4444' }}>*</span></label>
            <input value={tesisAdi} onChange={e => setTesisAdi(e.target.value)} placeholder="Örn: XYZ Kimya Sanayi A.Ş." style={inp} />
          </div>

          {/* Sektör */}
          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Sektör <span style={{ color: '#EF4444' }}>*</span></label>
            <select value={sektor} onChange={e => { setSektor(e.target.value); setAlt('') }} style={{ ...inp, cursor: 'pointer' }}>
              <option value="">— Sektör seçin —</option>
              {Object.keys(SEKTORLER).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Alt sektör (dinamik) */}
          {sektor && (
            <div style={{ marginBottom: 20 }}>
              <label style={lbl}>Alt Sektör</label>
              <select value={altSektor} onChange={e => setAlt(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                <option value="">— Alt sektör seçin (opsiyonel) —</option>
                {SEKTORLER[sektor]?.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}

          {/* 2 kolon: Çalışan + NACE */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={lbl}>Çalışan Sayısı</label>
              <select value={calisan} onChange={e => setCalisan(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                <option value="">— Seçin —</option>
                {CALISAN_GRUPLAR.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>NACE Kodu <span style={{ color: '#94A3B8', fontWeight: 400 }}>(opsiyonel)</span></label>
              <input value={nace} onChange={e => onNaceChange(e.target.value)} placeholder="Örn: 20.13" style={inp} />
              {naceLoad && <span style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, display: 'block' }}>Sınıf kontrol ediliyor…</span>}
            </div>
          </div>

          {/* Tehlike sınıfı badge */}
          {tehlike && (
            <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 10, background: tehlike.bg, border: `1px solid ${tehlike.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: tehlike.renk, background: tehlike.renk + '18', border: `1px solid ${tehlike.renk}33`, borderRadius: 20, padding: '3px 12px' }}>
                {tehlike.label}
              </span>
              <span style={{ fontSize: 12, color: '#374151' }}>
                {tehlike.sinif === 1 && 'Detaylı form doldurmanız gerekmektedir.'}
                {tehlike.sinif === 2 && 'Standart form doldurmanız önerilmektedir.'}
                {tehlike.sinif === 3 && 'Kısa formu hızlıca tamamlayabilirsiniz.'}
              </span>
            </div>
          )}

          {/* 2 kolon: İl + İlçe */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
            <div>
              <label style={lbl}>İl <span style={{ color: '#EF4444' }}>*</span></label>
              <select value={il} onChange={e => setIl(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                <option value="">— İl seçin —</option>
                {TÜRKİYE_İLLERİ.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>İlçe</label>
              <input value={ilce} onChange={e => setIlce(e.target.value)} placeholder="İlçe adı" style={inp} />
            </div>
          </div>

          {hata && (
            <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 8, background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: 13 }}>
              {hata}
            </div>
          )}

          <button
            onClick={kaydet}
            disabled={kaydediliyor}
            style={{ width: '100%', padding: '13px', background: kaydediliyor ? '#94A3B8' : NAVY, color: '#FFFFFF', fontWeight: 700, fontSize: 15, border: 'none', borderRadius: 10, cursor: kaydediliyor ? 'not-allowed' : 'pointer', transition: 'background .15s' }}>
            {kaydediliyor ? 'Kaydediliyor…' : 'Tesisimi Kaydet ve Devam Et →'}
          </button>

          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: '#94A3B8' }}>
            Bu bilgiler yalnızca risk profilinizi oluşturmak amacıyla kullanılır.
          </div>
        </div>
      </div>
    </div>
  )
}
