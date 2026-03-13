'use client'
// ═══════════════════════════════════════════════════════════════
//  OMNI — Beylikdüzü Bağımsız İşletme Başvuru Formu
//  Auth gerektirmez. Sektör seçimi → sektöre özel HFE-360.
//  Oluşturulan birim kodu: BEY-BSVR-{timestamp}
// ═══════════════════════════════════════════════════════════════
import { useState } from 'react'
import { SORULAR } from '@/lib/sorular'
import { SORULAR_SANAYI }    from '@/lib/sorular-sanayi'
import { SORULAR_SAGLIK }    from '@/lib/sorular-saglik'
import { SORULAR_KONAKLAMA } from '@/lib/sorular-konaklama'
import { SORULAR_BELEDIYE }  from '@/lib/sorular-belediye'
import { skorHesapla }       from '@/lib/bcm-hesapla'
import { supabase }          from '@/lib/supabase'
import { SEKTOR_ETIKET, SEKTOR_IKON, SEKTOR_RENK, type Sektor } from '@/types'

// ─── Tipler ──────────────────────────────────────────────────
type Adim = 'sektor' | 'isletme' | 'form' | 'sonuc'

interface IsletmeBilgi {
  isletme_adi:  string
  yetkili_adi:  string
  yetkili_tel:  string
  yetkili_email: string
  adres:        string
  mahalle:      string
}

const ISLETME_BOŞ: IsletmeBilgi = {
  isletme_adi: '', yetkili_adi: '', yetkili_tel: '',
  yetkili_email: '', adres: '', mahalle: '',
}

// ─── Beylikdüzü mahalleleri ───────────────────────────────────
const MAHALLELER = [
  'Yakuplu', 'Kavaklı', 'Gürpınar', 'Adnan Kahveci',
  'Büyükşehir', 'Cumhuriyet', 'Marmara', 'Barış',
]

// ─── Soru setleri ─────────────────────────────────────────────
const getSorular = (sektor: Sektor) => {
  switch (sektor) {
    case 'uretim':    return SORULAR_SANAYI
    case 'saglik':    return SORULAR_SAGLIK
    case 'konaklama': return SORULAR_KONAKLAMA
    case 'belediye':  return SORULAR_BELEDIYE
    default:          return SORULAR
  }
}

// ─── Başvuru için sektörler (belediye gizli, iç kullanıcı için) ─
const BASVURU_SEKTORLER: Sektor[] = [
  'bankacilik', 'saglik', 'konaklama', 'uretim', 'hizmet', 'meb', 'odalar',
]

// ─── Stil sabitleri ───────────────────────────────────────────
const TEAL = '#009B8D'
const NAVY = '#0A1628'

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'DM Sans',sans-serif}
  .inp{width:100%;border:1px solid #E5E3E1;border-radius:10px;padding:10px 13px;font-size:13px;font-family:'DM Sans',sans-serif;color:#374151;background:white;outline:none;transition:all .15s}
  .inp:focus{border-color:${TEAL};box-shadow:0 0 0 3px rgba(0,155,141,.1)}
  .fl{font-size:10px;font-weight:700;color:#9CA3AF;letter-spacing:.07em;text-transform:uppercase;display:block;margin-bottom:5px}
  .fg{margin-bottom:12px}
  @keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} .fi{animation:fi .25s ease}
`

// ─── Ana bileşen ─────────────────────────────────────────────
export default function BasvuruPage() {
  const [adim, setAdim]         = useState<Adim>('sektor')
  const [sektor, setSektor]     = useState<Sektor | null>(null)
  const [isletme, setIsletme]   = useState<IsletmeBilgi>(ISLETME_BOŞ)
  const [puanlar, setPuanlar]   = useState<Record<string, number>>({})
  const [gonderiyor, setGonderiyor] = useState(false)
  const [hataMsg, setHataMsg]   = useState('')
  const [sonucSkor, setSonucSkor] = useState(0)

  const sorular = sektor ? getSorular(sektor) : SORULAR
  const BOLUMLER = ['TEHLİKE', 'KIRILGANLIK', 'KAPASİTE'] as const
  const cevaplanan = Object.keys(puanlar).length
  const toplamSoru = sorular.length
  const yuzde = toplamSoru > 0 ? Math.round(cevaplanan / toplamSoru * 100) : 0

  const tD = (k: keyof IsletmeBilgi, v: string) => setIsletme(p => ({ ...p, [k]: v }))

  // Zorunlu işletme alanları
  const isletmeGecerli = !!(isletme.isletme_adi && isletme.yetkili_adi && isletme.yetkili_tel && isletme.mahalle)

  const gonder = async () => {
    if (!sektor || cevaplanan === 0) return
    setGonderiyor(true)
    setHataMsg('')
    try {
      const hfe = skorHesapla(puanlar)
      const birim_kodu = `BEY-BSVR-${Date.now()}`
      const { error } = await supabase.from('form_cevaplari').insert({
        tenant_id:          null,
        birim_kodu,
        sektor,
        senaryo:            'Beylikdüzü Afet Senaryosu',
        puanlar:            {
          ...puanlar,
          _basvuru: {
            isletme_adi:   isletme.isletme_adi,
            yetkili:       isletme.yetkili_adi,
            tel:           isletme.yetkili_tel,
            email:         isletme.yetkili_email,
            adres:         isletme.adres,
            mahalle:       isletme.mahalle,
          },
        },
        dayaniklilik_skoru: hfe.toplam,
        h_skoru:            hfe.h_skoru,
        f_skoru:            hfe.f_skoru,
        e_skoru:            hfe.e_skoru,
        durum:              'gonderildi',
        dolduran_email:     isletme.yetkili_email || null,
        gonderilme:         new Date().toISOString(),
      })
      if (error) throw new Error(error.message)
      setSonucSkor(hfe.toplam)
      setAdim('sonuc')
    } catch (e) {
      setHataMsg((e as Error).message)
    } finally {
      setGonderiyor(false)
    }
  }

  const sifirla = () => {
    setAdim('sektor'); setSektor(null); setIsletme(ISLETME_BOŞ)
    setPuanlar({}); setSonucSkor(0); setHataMsg('')
  }

  // ── Renk yardımcıları ───────────────────────────────────────
  const skorRenk = sonucSkor >= 70 ? '#22C55E' : sonucSkor >= 40 ? '#F59E0B' : '#EF4444'
  const skorEtiket = sonucSkor >= 70 ? 'GÜÇLÜ' : sonucSkor >= 40 ? 'ORTA RİSK' : 'KRİTİK'

  return (
    <div style={{ minHeight: '100vh', background: '#F8F6F3', fontFamily: "'DM Sans', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{ background: NAVY, padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontWeight: 800, color: 'white', fontSize: 17 }}>OMNI</span>
          <span style={{ color: '#475569', fontSize: 14 }}>·</span>
          <span style={{ color: '#94A3B8', fontSize: 13 }}>🏙️ Beylikdüzü İşletme Başvurusu</span>
        </div>
        <div style={{ fontSize: 11, color: '#64748B' }}>
          Adım: {adim === 'sektor' ? '1/3' : adim === 'isletme' ? '2/3' : adim === 'form' ? '3/3' : '✓'}
        </div>
      </div>

      <div style={{ maxWidth: 660, margin: '0 auto', padding: '28px 16px 80px' }}>

        {/* ── ADIM 1: SEKTÖR SEÇİMİ ─────────────────────────── */}
        {adim === 'sektor' && (
          <div className="fi">
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: NAVY, marginBottom: 8 }}>
                Sektörünüzü Seçin
              </h1>
              <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6 }}>
                Beylikdüzü sınırları içindeki işletmeler için ücretsiz afet dayanıklılık değerlendirmesi.
                <br />Sektörünüze göre özelleştirilmiş soru seti yüklenecektir.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {BASVURU_SEKTORLER.map(s => {
                const renk = SEKTOR_RENK[s]
                const secili = sektor === s
                return (
                  <button key={s} onClick={() => setSektor(s)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '16px 18px', borderRadius: 14, cursor: 'pointer',
                      border: secili ? `2px solid ${renk}` : '2px solid #E5E3E1',
                      background: secili ? renk + '0C' : 'white',
                      textAlign: 'left', transition: 'all .15s',
                      boxShadow: secili ? `0 0 0 4px ${renk}15` : 'none',
                    }}>
                    <span style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{SEKTOR_IKON[s]}</span>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: secili ? renk : NAVY, marginBottom: 2 }}>
                        {SEKTOR_ETIKET[s]}
                      </p>
                      <p style={{ fontSize: 10, color: '#9CA3AF' }}>
                        {getSorular(s).length} soru
                      </p>
                    </div>
                    {secili && (
                      <div style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%', background: renk, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>✓</span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {sektor && (
              <button onClick={() => setAdim('isletme')}
                style={{ width: '100%', marginTop: 20, background: TEAL, color: 'white', border: 'none', borderRadius: 14, padding: '14px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                Devam Et — {SEKTOR_ETIKET[sektor]} →
              </button>
            )}

            <p style={{ textAlign: 'center', fontSize: 11, color: '#C4C2BF', marginTop: 20 }}>
              Verileriniz yalnızca Beylikdüzü Belediyesi afet planlama çalışmaları kapsamında kullanılır.
            </p>
          </div>
        )}

        {/* ── ADIM 2: İŞLETME BİLGİLERİ ───────────────────── */}
        {adim === 'isletme' && sektor && (
          <div className="fi">
            {/* Seçilen sektör bandı */}
            <div style={{
              background: SEKTOR_RENK[sektor] + '10',
              border: `1px solid ${SEKTOR_RENK[sektor]}30`,
              borderRadius: 12, padding: '12px 16px', marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: 24 }}>{SEKTOR_IKON[sektor]}</span>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: SEKTOR_RENK[sektor], textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 2 }}>Seçilen Sektör</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{SEKTOR_ETIKET[sektor]}</p>
              </div>
              <button onClick={() => setAdim('sektor')}
                style={{ marginLeft: 'auto', fontSize: 11, color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                Değiştir
              </button>
            </div>

            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E3E1', padding: '20px 20px', marginBottom: 14 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 16 }}>
                İşletme & İletişim Bilgileri
              </p>

              <div className="fg">
                <label className="fl">İşletme / Tesis Adı <span style={{ color: '#EF4444' }}>*</span></label>
                <input type="text" className="inp" placeholder="ör. Yıldız Hastanesi, Akdeniz Otel..." value={isletme.isletme_adi} onChange={e => tD('isletme_adi', e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div className="fg" style={{ margin: 0 }}>
                  <label className="fl">Yetkili Ad Soyad <span style={{ color: '#EF4444' }}>*</span></label>
                  <input type="text" className="inp" placeholder="ör. Ahmet Yılmaz" value={isletme.yetkili_adi} onChange={e => tD('yetkili_adi', e.target.value)} />
                </div>
                <div className="fg" style={{ margin: 0 }}>
                  <label className="fl">Cep Telefonu <span style={{ color: '#EF4444' }}>*</span></label>
                  <input type="text" className="inp" placeholder="05xx xxx xx xx" value={isletme.yetkili_tel} onChange={e => tD('yetkili_tel', e.target.value)} />
                </div>
              </div>

              <div className="fg">
                <label className="fl">E-posta Adresi</label>
                <input type="email" className="inp" placeholder="ornek@isletme.com" value={isletme.yetkili_email} onChange={e => tD('yetkili_email', e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="fg" style={{ margin: 0 }}>
                  <label className="fl">Mahalle <span style={{ color: '#EF4444' }}>*</span></label>
                  <select className="inp" value={isletme.mahalle} onChange={e => tD('mahalle', e.target.value)}>
                    <option value="">— Seçin —</option>
                    {MAHALLELER.map(m => <option key={m} value={m}>{m} Mah.</option>)}
                  </select>
                </div>
                <div className="fg" style={{ margin: 0 }}>
                  <label className="fl">Adres / Sokak</label>
                  <input type="text" className="inp" placeholder="ör. 101. Sok. No:5" value={isletme.adres} onChange={e => tD('adres', e.target.value)} />
                </div>
              </div>
            </div>

            <button disabled={!isletmeGecerli} onClick={() => setAdim('form')}
              style={{ width: '100%', background: isletmeGecerli ? TEAL : '#E5E3E1', color: isletmeGecerli ? 'white' : '#9CA3AF', border: 'none', borderRadius: 14, padding: '14px', fontSize: 14, fontWeight: 700, cursor: isletmeGecerli ? 'pointer' : 'not-allowed', fontFamily: "'DM Sans', sans-serif" }}>
              {isletmeGecerli ? `→ Değerlendirmeye Başla (${toplamSoru} soru)` : '⚠ Zorunlu alanları doldurun'}
            </button>
          </div>
        )}

        {/* ── ADIM 3: FORM (HFE-360) ───────────────────────── */}
        {adim === 'form' && sektor && (
          <div className="fi">
            {/* İşletme + sektör mini banner */}
            <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E5E3E1', padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>{SEKTOR_IKON[sektor]}</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>{isletme.isletme_adi}</p>
                <p style={{ fontSize: 11, color: '#9CA3AF' }}>{SEKTOR_ETIKET[sektor]} · {isletme.mahalle} Mah.</p>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <p style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 2 }}>Tamamlanma</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: yuzde === 100 ? '#22C55E' : TEAL }}>{cevaplanan}/{toplamSoru} · %{yuzde}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height: 5, background: '#F1F0EF', borderRadius: 99, marginBottom: 20, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${yuzde}%`, background: yuzde === 100 ? '#22C55E' : TEAL, borderRadius: 99, transition: 'width .3s' }} />
            </div>

            {/* Sorular */}
            {BOLUMLER.map((bolum, bi) => {
              const bs = sorular.filter(s => s.bolum === bolum)
              const bc = bs.filter(s => puanlar[s.kod] !== undefined).length
              const bT = ['Tehlike Değerlendirmesi', 'Kırılganlık Değerlendirmesi', 'Kapasite Değerlendirmesi'][bi]
              return (
                <div key={bolum} style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <h2 style={{ fontSize: 14, fontWeight: 700, color: NAVY }}>{bT}</h2>
                    <span style={{ fontSize: 11, color: '#9CA3AF', background: '#F1F0EF', padding: '4px 10px', borderRadius: 99 }}>{bc}/{bs.length}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {bs.map((soru, idx) => {
                      const sel = puanlar[soru.kod]
                      return (
                        <div key={soru.kod} style={{ borderRadius: 14, border: `1px solid ${sel !== undefined ? '#A7F3D0' : '#E5E3E1'}`, padding: 14, background: sel !== undefined ? '#F0FDFA' : 'white', transition: 'all .15s' }}>
                          <p style={{ fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 10, lineHeight: 1.5 }}>
                            {idx + 1}. {soru.soru}
                          </p>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                            {[0, 1, 2, 3].map(p => (
                              <button key={p} onClick={() => setPuanlar(prev => ({ ...prev, [soru.kod]: p }))}
                                style={{ fontSize: 12, padding: '9px 10px', borderRadius: 10, border: `1px solid ${sel === p ? TEAL : '#E5E3E1'}`, background: sel === p ? TEAL : 'white', color: sel === p ? 'white' : '#4B5563', cursor: 'pointer', textAlign: 'left', lineHeight: 1.35, fontFamily: "'DM Sans', sans-serif", fontWeight: sel === p ? 600 : 400, transition: 'all .15s' }}>
                                {soru.rehber[p]}
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            {hataMsg && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 14, color: '#DC2626', fontSize: 12 }}>
                ⚠ {hataMsg}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={gonder} disabled={gonderiyor || cevaplanan === 0}
                style={{ flex: 1, background: cevaplanan === 0 ? '#E5E3E1' : TEAL, color: cevaplanan === 0 ? '#9CA3AF' : 'white', border: 'none', borderRadius: 14, padding: '14px', fontSize: 14, fontWeight: 700, cursor: cevaplanan === 0 ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                {gonderiyor ? 'Gönderiliyor…' : `✓ Değerlendirmeyi Gönder${yuzde < 100 ? ` (%${yuzde})` : ''}`}
              </button>
              <button onClick={() => setAdim('isletme')}
                style={{ padding: '14px 16px', background: '#F1F0EF', color: '#6B7280', border: 'none', borderRadius: 14, fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                ← Geri
              </button>
            </div>
          </div>
        )}

        {/* ── SONUÇ ────────────────────────────────────────── */}
        {adim === 'sonuc' && (
          <div className="fi" style={{ textAlign: 'center' }}>
            <div style={{ background: 'white', borderRadius: 20, border: `2px solid ${skorRenk}30`, padding: '36px 28px', marginBottom: 16 }}>
              <div style={{ fontSize: 52, marginBottom: 16 }}>
                {sonucSkor >= 70 ? '✅' : sonucSkor >= 40 ? '⚠️' : '🔴'}
              </div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>
                HFE-360 Dayanıklılık Skoru
              </p>
              <p style={{ fontSize: 72, fontWeight: 800, color: skorRenk, lineHeight: 1, marginBottom: 6 }}>
                {sonucSkor}
              </p>
              <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 20 }}>/100</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: skorRenk + '12', border: `1.5px solid ${skorRenk}40`, borderRadius: 99, padding: '8px 22px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: skorRenk }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: skorRenk }}>{skorEtiket}</span>
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E3E1', padding: '18px 20px', marginBottom: 16, textAlign: 'left' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>Başvuru Özeti</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { label: 'İşletme', val: isletme.isletme_adi },
                  { label: 'Sektör', val: sektor ? `${SEKTOR_IKON[sektor]} ${SEKTOR_ETIKET[sektor]}` : '—' },
                  { label: 'Mahalle', val: `${isletme.mahalle} Mah.` },
                  { label: 'Yetkili', val: `${isletme.yetkili_adi} · ${isletme.yetkili_tel}` },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #F5F3F1' }}>
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>{item.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, padding: '14px 18px', marginBottom: 20, textAlign: 'left' }}>
              <p style={{ fontSize: 12, color: '#92400E', lineHeight: 1.6 }}>
                <strong>Sonraki adım:</strong> Beylikdüzü Belediyesi OMNI uzman ekibi başvurunuzu inceleyerek
                sizi 5 iş günü içinde arayacaktır. Detaylı analiz raporu e-posta ile iletilecektir.
              </p>
            </div>

            <button onClick={sifirla}
              style={{ width: '100%', background: NAVY, color: 'white', border: 'none', borderRadius: 14, padding: '14px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
              Yeni Başvuru Yap
            </button>

            <p style={{ fontSize: 11, color: '#C4C2BF', marginTop: 16 }}>
              OMNI · Beylikdüzü Belediyesi · İTÜ AYM iş birliği
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
