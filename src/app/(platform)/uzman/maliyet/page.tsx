'use client'
import { useState, useCallback } from 'react'

// ── Tipler ───────────────────────────────────────────────────────────────────
type MaliyetBant = 'dusuk' | 'orta' | 'yuksek'
type KararTip = 'yerel' | 'ust'
type IcraTip = 'yerel' | 'ulusal'
type ZorlukTip = 'yok' | 'toplum' | 'kapasite' | 'teknoloji'
type YonetisimTip = 'hazir' | 'uzman' | 'uygulayici'

interface Carpanlar {
  karar_yerel: number
  karar_ust: number
  icra_yerel: number
  icra_ulusal: number
  maliyet_dusuk: number
  maliyet_orta: number
  maliyet_yuksek: number
  zorluk_var: number
  zorluk_yok: number
  yonetisim: number
  fayda_kucuk: number   // ≤100K
  fayda_orta: number    // ~1M
  fayda_buyuk: number   // ≥5M
}

interface Aksiyon {
  id: string
  kategori: string
  baslik: string
  aciklama: string
  tip: 'yapisal' | 'yapisal_olmayan'
  bazPuan: number
  karar: KararTip
  icra: IcraTip
  maliyetBant: MaliyetBant
  zorluk: ZorlukTip[]
  yonetisim: YonetisimTip[]
  etkilenenMusteriK: number
  birimFiyatTL: number
  birim: string
  miktar: number
  yillikFaydaTL: number
  rto_saat: number
  rpo_saat: number
  mevzuat: string
}

// ── Varsayılan çarpanlar ─────────────────────────────────────────────────────
const CARPAN_VARSAYILAN: Carpanlar = {
  karar_yerel: 1.5, karar_ust: 0.75,
  icra_yerel: 1.5, icra_ulusal: 0.75,
  maliyet_dusuk: 3, maliyet_orta: 2, maliyet_yuksek: 1,
  zorluk_var: 0.5, zorluk_yok: 1,
  yonetisim: 1.5,
  fayda_kucuk: 0.1, fayda_orta: 1, fayda_buyuk: 5,
}

// ── Başlangıç aksiyonları ────────────────────────────────────────────────────
const AKSIYONLAR_BASLANGIC: Aksiyon[] = [
  { id:'C1', kategori:'Siber', tip:'yapisal_olmayan', baslik:'Yedekli Core Banking Altyapısı (DR Site)', aciklama:'İkincil veri merkezi — aktif-aktif replikasyon mimarisi. 7/24 failover garantisi.', bazPuan:9, karar:'ust', icra:'ulusal', maliyetBant:'yuksek', zorluk:['teknoloji','kapasite'], yonetisim:['uzman','uygulayici'], etkilenenMusteriK:3500, birimFiyatTL:3200000, birim:'Proje', miktar:1, yillikFaydaTL:8500000, rto_saat:4, rpo_saat:1, mevzuat:'BDDK MD 29 · ISO 22301' },
  { id:'C2', kategori:'Siber', tip:'yapisal_olmayan', baslik:'SOC Kurulumu (Security Operations Center)', aciklama:'7/24 SIEM izleme, anomali tespiti ve olay müdahale.', bazPuan:9, karar:'ust', icra:'ulusal', maliyetBant:'yuksek', zorluk:['kapasite'], yonetisim:['uzman','uygulayici','hazir'], etkilenenMusteriK:3500, birimFiyatTL:1800000, birim:'Yıllık Hizmet', miktar:1, yillikFaydaTL:6200000, rto_saat:2, rpo_saat:1, mevzuat:'BDDK Siber Tebliği · ISO 27001' },
  { id:'C3', kategori:'Siber', tip:'yapisal_olmayan', baslik:'Yıllık Penetrasyon Testi', aciklama:'Yılda 2x beyaz kutu + gri kutu pentest ve raporlama.', bazPuan:8, karar:'ust', icra:'yerel', maliyetBant:'orta', zorluk:['yok'], yonetisim:['uzman'], etkilenenMusteriK:3500, birimFiyatTL:120000, birim:'Test', miktar:2, yillikFaydaTL:2100000, rto_saat:48, rpo_saat:4, mevzuat:'BDDK · PCI DSS' },
  { id:'B1', kategori:'Deprem', tip:'yapisal', baslik:'Sismik Güçlendirme — Şube Binası', aciklama:'Taşıyıcı sistem güçlendirmesi. Güncel yönetmelik uyumlu yapısal analiz ve uygulama.', bazPuan:10, karar:'ust', icra:'yerel', maliyetBant:'yuksek', zorluk:['kapasite'], yonetisim:['uzman','uygulayici'], etkilenenMusteriK:450, birimFiyatTL:850000, birim:'Bina', miktar:1, yillikFaydaTL:4200000, rto_saat:72, rpo_saat:24, mevzuat:'TBDY-2018 · AFAD' },
  { id:'B2', kategori:'Deprem', tip:'yapisal_olmayan', baslik:'Sismik Sensör & Erken Uyarı Entegrasyonu', aciklama:'IoT sismik sensör kurulumu + erken uyarı API entegrasyonu. Otomatik bildirim.', bazPuan:8, karar:'yerel', icra:'yerel', maliyetBant:'orta', zorluk:['yok'], yonetisim:['uzman','hazir'], etkilenenMusteriK:450, birimFiyatTL:45000, birim:'Sensör/Şube', miktar:1, yillikFaydaTL:1800000, rto_saat:48, rpo_saat:12, mevzuat:'AFAD · ISO 22301' },
  { id:'B3', kategori:'Deprem', tip:'yapisal_olmayan', baslik:'Zemin Etüdü & Yapısal Hasar Tespiti', aciklama:'Güncel zemin etüdü ve yapısal hasar tespit raporu.', bazPuan:9, karar:'ust', icra:'yerel', maliyetBant:'orta', zorluk:['yok'], yonetisim:['uzman'], etkilenenMusteriK:450, birimFiyatTL:28000, birim:'Rapor/Bina', miktar:1, yillikFaydaTL:950000, rto_saat:72, rpo_saat:24, mevzuat:'TBDY-2018' },
  { id:'G1', kategori:'Genel', tip:'yapisal_olmayan', baslik:'İş Sürekliliği Planı (BCP) Revizyonu', aciklama:'Uluslararası standart uyumlu BCP güncellemesi. Rol bazlı yetki matrisi, yılda 2x tatbikat.', bazPuan:8, karar:'ust', icra:'ulusal', maliyetBant:'orta', zorluk:['yok'], yonetisim:['uzman','uygulayici','hazir'], etkilenenMusteriK:3500, birimFiyatTL:180000, birim:'Proje', miktar:1, yillikFaydaTL:3200000, rto_saat:24, rpo_saat:4, mevzuat:'ISO 22301 · BDDK MD 29' },
  { id:'G2', kategori:'Genel', tip:'yapisal_olmayan', baslik:'Acil Komuta Merkezi (EOC) Kurulumu', aciklama:'Felaket koordinasyonu için fiziksel + sanal EOC. Kriz iletişim altyapısı.', bazPuan:8, karar:'ust', icra:'yerel', maliyetBant:'orta', zorluk:['kapasite'], yonetisim:['uzman','uygulayici'], etkilenenMusteriK:3500, birimFiyatTL:320000, birim:'Merkez', miktar:1, yillikFaydaTL:2800000, rto_saat:12, rpo_saat:4, mevzuat:'ISO 22301 §8.5' },
  { id:'Y1', kategori:'Yangın', tip:'yapisal', baslik:'Sprinkler Sistemi Yenileme', aciklama:'Eski sprinkler sistemlerinin güncel standarda uygun modernizasyonu.', bazPuan:7, karar:'yerel', icra:'yerel', maliyetBant:'orta', zorluk:['yok'], yonetisim:['uygulayici'], etkilenenMusteriK:450, birimFiyatTL:95000, birim:'Şube', miktar:1, yillikFaydaTL:680000, rto_saat:24, rpo_saat:8, mevzuat:'TS EN 12845 · İtfaiye' },
  { id:'Y2', kategori:'Yangın', tip:'yapisal_olmayan', baslik:'Yangın Tatbikatı & Personel Eğitimi', aciklama:'Yılda 2x tahliye tatbikatı + sertifikalı yangın eğitimi.', bazPuan:6, karar:'yerel', icra:'yerel', maliyetBant:'dusuk', zorluk:['yok'], yonetisim:['hazir','uygulayici'], etkilenenMusteriK:450, birimFiyatTL:8500, birim:'Tatbikat/Şube', miktar:2, yillikFaydaTL:420000, rto_saat:12, rpo_saat:4, mevzuat:'İş Sağlığı Güvenliği' },
  { id:'S1', kategori:'Sel', tip:'yapisal', baslik:'Drenaj & Su Yalıtım Güçlendirmesi', aciklama:'Bodrum kat su yalıtımı + periferik drenaj kapasite artırımı.', bazPuan:7, karar:'yerel', icra:'yerel', maliyetBant:'orta', zorluk:['toplum'], yonetisim:['uzman'], etkilenenMusteriK:450, birimFiyatTL:65000, birim:'Şube', miktar:1, yillikFaydaTL:520000, rto_saat:48, rpo_saat:12, mevzuat:'AFAD · Çevre Mevzuatı' },
  { id:'S2', kategori:'Sel', tip:'yapisal_olmayan', baslik:'Meteorolojik Erken Uyarı Entegrasyonu', aciklama:'Meteoroloji + sel uyarı sistemi entegrasyonu — otomatik bildirim akışı.', bazPuan:7, karar:'yerel', icra:'yerel', maliyetBant:'dusuk', zorluk:['yok'], yonetisim:['hazir','uzman'], etkilenenMusteriK:3500, birimFiyatTL:15000, birim:'Yıllık Abonelik', miktar:1, yillikFaydaTL:380000, rto_saat:36, rpo_saat:8, mevzuat:'AFAD · MGM' },
]

// ── Yardımcı ─────────────────────────────────────────────────────────────────
function hesapla(a: Aksiyon, c: Carpanlar): number {
  const karar = a.karar === 'yerel' ? c.karar_yerel : c.karar_ust
  const icra = a.icra === 'yerel' ? c.icra_yerel : c.icra_ulusal
  const maliyet = a.maliyetBant === 'dusuk' ? c.maliyet_dusuk : a.maliyetBant === 'orta' ? c.maliyet_orta : c.maliyet_yuksek
  const zorluk = a.zorluk.includes('yok') || a.zorluk.length === 0 ? c.zorluk_yok : c.zorluk_var
  const yon = a.yonetisim.length > 0 ? c.yonetisim : 0.5
  const fayda = a.etkilenenMusteriK <= 100
    ? c.fayda_kucuk * (a.etkilenenMusteriK / 100)
    : a.etkilenenMusteriK <= 1000
      ? c.fayda_kucuk + (a.etkilenenMusteriK - 100) / 900 * (c.fayda_orta - c.fayda_kucuk)
      : Math.min(c.fayda_buyuk, c.fayda_orta * (a.etkilenenMusteriK / 1000))
  return +(a.bazPuan * karar * icra * maliyet * zorluk * yon * fayda).toFixed(1)
}

function tl(n: number) {
  if (n >= 1_000_000) return `₺${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `₺${(n / 1_000).toFixed(0)}K`
  return `₺${n.toLocaleString('tr-TR')}`
}

const KAT_RENK: Record<string, string> = { Siber:'#8B5CF6', Deprem:'#EF4444', Genel:'#1B4FD8', Yangın:'#F97316', Sel:'#0EA5E9' }
const MAL_RENK: Record<MaliyetBant, string> = { yuksek:'#EF4444', orta:'#F59E0B', dusuk:'#22C55E' }
const MAL_LABEL: Record<MaliyetBant, string> = { yuksek:'Yüksek', orta:'Orta', dusuk:'Düşük/Maliyetsiz' }

const BOŞ_AKSIYON: Aksiyon = {
  id:'', kategori:'Genel', tip:'yapisal_olmayan', baslik:'', aciklama:'',
  bazPuan:5, karar:'yerel', icra:'yerel', maliyetBant:'orta',
  zorluk:['yok'], yonetisim:['uzman'],
  etkilenenMusteriK:500, birimFiyatTL:100000, birim:'Proje', miktar:1,
  yillikFaydaTL:500000, rto_saat:24, rpo_saat:8, mevzuat:'',
}

// ─────────────────────────────────────────────────────────────────────────────
export default function MaliyetPage() {
  const [sekme, setSekme] = useState<'ozet'|'liste'|'bia'|'parametreler'>('ozet')
  const [carpanlar, setCarpanlar] = useState<Carpanlar>(CARPAN_VARSAYILAN)
  const [aksiyonlar, setAksiyonlar] = useState<Aksiyon[]>(AKSIYONLAR_BASLANGIC)
  const [secili, setSecili] = useState<Set<string>>(new Set(AKSIYONLAR_BASLANGIC.slice(0,5).map(a=>a.id)))
  const [detay, setDetay] = useState<string|null>(null)
  const [duzenle, setDuzenle] = useState<string|null>(null)
  const [yeniForm, setYeniForm] = useState<Aksiyon|null>(null)
  const [filKat, setFilKat] = useState('tumu')
  const [filMal, setFilMal] = useState('tumu')
  const [carpanDuzenle, setCarpanDuzenle] = useState(false)
  const [carpanTemp, setCarpanTemp] = useState<Carpanlar>(CARPAN_VARSAYILAN)

  const toggle = (id: string) => {
    const s = new Set(secili); s.has(id) ? s.delete(id) : s.add(id); setSecili(s)
  }

  const puanliAksiyonlar = aksiyonlar
    .map(a => ({ ...a, oncelikPuani: hesapla(a, carpanlar) }))
    .sort((a, b) => b.oncelikPuani - a.oncelikPuani)

  const filtreli = puanliAksiyonlar
    .filter(a => filKat === 'tumu' || a.kategori === filKat)
    .filter(a => filMal === 'tumu' || a.maliyetBant === filMal)

  const secilenList = puanliAksiyonlar.filter(a => secili.has(a.id))
  const topMaliyet = secilenList.reduce((s, a) => s + a.birimFiyatTL * a.miktar, 0)
  const topFayda = secilenList.reduce((s, a) => s + a.yillikFaydaTL, 0)
  const roi = topMaliyet > 0 ? Math.round(topFayda / topMaliyet * 100) : 0
  const geriOdeme = topFayda > 0 ? (topMaliyet / topFayda).toFixed(1) : '—'
  const maxPuan = puanliAksiyonlar[0]?.oncelikPuani || 1

  const aksiyonGuncelle = (id: string, guncellenmis: Partial<Aksiyon>) => {
    setAksiyonlar(prev => prev.map(a => a.id === id ? { ...a, ...guncellenmis } : a))
  }

  const aksiyonSil = (id: string) => {
    setAksiyonlar(prev => prev.filter(a => a.id !== id))
    const s = new Set(secili); s.delete(id); setSecili(s)
  }

  const aksiyonEkle = () => {
    const yeniId = 'A' + Date.now()
    const yeni = { ...BOŞ_AKSIYON, id: yeniId, baslik: 'Yeni Aksiyon' }
    setAksiyonlar(prev => [...prev, yeni])
    setDuzenle(yeniId)
  }

  const carpanUygula = () => {
    setCarpanlar(carpanTemp)
    setCarpanDuzenle(false)
  }

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    .fd{font-family:'Playfair Display',serif}
    .fm{font-family:'DM Mono',monospace}
    .pb{background:#F1F0EF;border-radius:99px;overflow:hidden}
    .pf{height:100%;border-radius:99px;transition:width .5s ease}
    .bdg{display:inline-flex;align-items:center;padding:2px 9px;border-radius:99px;font-size:11px;font-weight:600;line-height:1.6;white-space:nowrap}
    .card{background:white;border-radius:14px;border:1px solid #ECEAE8}
    .sb{padding:10px 20px;border:none;background:transparent;cursor:pointer;font-size:13px;font-weight:500;color:#9CA3AF;border-bottom:2px solid transparent;transition:all .2s;font-family:'DM Sans',sans-serif;white-space:nowrap}
    .sb.on{color:#0A1628;border-bottom-color:#1B4FD8;font-weight:700}
    .sb:hover:not(.on){color:#374151}
    .rh:hover{background:#FAFAF9!important}
    select,input[type=text],input[type=number]{outline:none;border:1px solid #E5E3E1;border-radius:8px;padding:7px 10px;font-size:12px;font-family:'DM Sans',sans-serif;color:#374151;background:white}
    select:focus,input:focus{border-color:#1B4FD8;box-shadow:0 0 0 3px #EFF6FF}
    textarea{outline:none;border:1px solid #E5E3E1;border-radius:8px;padding:8px 10px;font-size:12px;font-family:'DM Sans',sans-serif;color:#374151;background:white;resize:vertical}
    textarea:focus{border-color:#1B4FD8;box-shadow:0 0 0 3px #EFF6FF}
    .chk{width:16px;height:16px;border-radius:4px;border:2px solid #CBD5E1;cursor:pointer;appearance:none;-webkit-appearance:none;flex-shrink:0;transition:all .15s}
    .chk:checked{background:#1B4FD8;border-color:#1B4FD8}
    .chk:checked::after{content:'✓';display:block;color:white;font-size:10px;font-weight:700;text-align:center;line-height:1.25}
    table{border-collapse:collapse;width:100%}
    th{padding:9px 14px;text-align:left;font-size:10px;font-weight:700;color:#A8A29E;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #F1F0EF;background:#FAFAF9;white-space:nowrap}
    td{padding:11px 14px;border-bottom:1px solid #F7F6F5;vertical-align:middle}
    .btn{border:none;border-radius:8px;cursor:pointer;font-family:'DM Sans',sans-serif;font-weight:600;transition:all .15s}
    .btn-mavi{background:#1B4FD8;color:white;padding:8px 16px;font-size:12px}
    .btn-mavi:hover{background:#1E40AF}
    .btn-beyaz{background:white;color:#374151;border:1px solid #E5E3E1;padding:7px 14px;font-size:12px}
    .btn-beyaz:hover{background:#FAFAF9}
    .btn-kirmizi{background:#FEF2F2;color:#EF4444;border:1px solid #FECACA;padding:5px 10px;font-size:11px}
    .btn-kirmizi:hover{background:#FEE2E2}
    .form-label{font-size:11px;font-weight:600;color:#374151;margin-bottom:4px;display:block;text-transform:uppercase;letter-spacing:.05em}
    @keyframes fi{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
    .fi{animation:fi .2s ease}
    .carpan-input{width:64px;text-align:center;font-family:'DM Mono',monospace;font-weight:700}
    .toggle-group{display:flex;gap:6px;flex-wrap:wrap}
    .toggle-item{padding:4px 10px;border-radius:99px;border:1px solid #E5E3E1;font-size:11px;font-weight:500;cursor:pointer;transition:all .15s;background:white;color:#6B7280;font-family:'DM Sans',sans-serif}
    .toggle-item.on{background:#0A1628;color:white;border-color:#0A1628}
  `

  // ── Edit formu ─────────────────────────────────────────────────────────────
  const EditForm = ({ a }: { a: Aksiyon & { oncelikPuani: number } }) => {
    const [form, setForm] = useState<Aksiyon>({ ...a })
    const toggleZorluk = (z: ZorlukTip) => {
      if (z === 'yok') { setForm(f => ({ ...f, zorluk: ['yok'] })); return }
      const prev = form.zorluk.filter(x => x !== 'yok')
      setForm(f => ({ ...f, zorluk: prev.includes(z) ? prev.filter(x => x !== z) : [...prev, z] }))
    }
    const toggleYon = (y: YonetisimTip) => {
      setForm(f => ({ ...f, yonetisim: f.yonetisim.includes(y) ? f.yonetisim.filter(x => x !== y) : [...f.yonetisim, y] }))
    }
    const canliPuan = hesapla(form, carpanlar)

    return (
      <tr>
        <td colSpan={10} style={{ padding: 0, background: '#F8F6F3' }}>
          <div style={{ padding: '20px 24px' }} className="fi">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#0A1628' }}>Aksiyon Düzenle</span>
                <span className="bdg" style={{ background: '#EFF6FF', color: '#1B4FD8' }}>
                  Anlık Puan: <span className="fm" style={{ fontSize: 14, marginLeft: 4 }}>{canliPuan}</span>
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-mavi" onClick={() => { aksiyonGuncelle(a.id, form); setDuzenle(null) }}>Kaydet</button>
                <button className="btn btn-beyaz" onClick={() => setDuzenle(null)}>İptal</button>
                <button className="btn btn-kirmizi" onClick={() => { aksiyonSil(a.id); setDuzenle(null) }}>Sil</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
              {/* Temel bilgiler */}
              <div>
                <label className="form-label">Aksiyon Başlığı</label>
                <input type="text" value={form.baslik} onChange={e => setForm(f => ({ ...f, baslik: e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
                <label className="form-label">Açıklama</label>
                <textarea value={form.aciklama} onChange={e => setForm(f => ({ ...f, aciklama: e.target.value }))} rows={2} style={{ width: '100%', marginBottom: 8 }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <label className="form-label">Kategori</label>
                    <select value={form.kategori} onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))} style={{ width: '100%' }}>
                      {['Deprem','Siber','Yangın','Sel','Genel'].map(k => <option key={k}>{k}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Tip</label>
                    <select value={form.tip} onChange={e => setForm(f => ({ ...f, tip: e.target.value as any }))} style={{ width: '100%' }}>
                      <option value="yapisal">Yapısal</option>
                      <option value="yapisal_olmayan">Yapısal Olmayan</option>
                    </select>
                  </div>
                </div>
              </div>
              {/* Öncelikleme parametreleri */}
              <div>
                <label className="form-label">Risk Derecesi (1–10)</label>
                <input type="number" min={1} max={10} value={form.bazPuan} onChange={e => setForm(f => ({ ...f, bazPuan: +e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
                <label className="form-label">Karar Makamı</label>
                <select value={form.karar} onChange={e => setForm(f => ({ ...f, karar: e.target.value as KararTip }))} style={{ width: '100%', marginBottom: 8 }}>
                  <option value="yerel">Yerel Makam (×{carpanlar.karar_yerel})</option>
                  <option value="ust">Üst Makam (×{carpanlar.karar_ust})</option>
                </select>
                <label className="form-label">İcra</label>
                <select value={form.icra} onChange={e => setForm(f => ({ ...f, icra: e.target.value as IcraTip }))} style={{ width: '100%', marginBottom: 8 }}>
                  <option value="yerel">Yerel / Az Kurum (×{carpanlar.icra_yerel})</option>
                  <option value="ulusal">Ulusal / Çok Kurum (×{carpanlar.icra_ulusal})</option>
                </select>
                <label className="form-label">Maliyet Etkinliği</label>
                <select value={form.maliyetBant} onChange={e => setForm(f => ({ ...f, maliyetBant: e.target.value as MaliyetBant }))} style={{ width: '100%' }}>
                  <option value="dusuk">Düşük / Maliyetsiz (×{carpanlar.maliyet_dusuk})</option>
                  <option value="orta">Orta Maliyet (×{carpanlar.maliyet_orta})</option>
                  <option value="yuksek">Yüksek Maliyet (×{carpanlar.maliyet_yuksek})</option>
                </select>
              </div>
              {/* Zorluk + Yönetişim */}
              <div>
                <label className="form-label">Uygulama Zorluğu</label>
                <div className="toggle-group" style={{ marginBottom: 12 }}>
                  {([['yok','Zorluk Yok'],['toplum','Toplum Direnci'],['kapasite','Kapasite'],['teknoloji','Teknoloji']] as [ZorlukTip,string][]).map(([v,l]) => (
                    <button key={v} className={'toggle-item' + (form.zorluk.includes(v) ? ' on' : '')} onClick={() => toggleZorluk(v)}>{l}</button>
                  ))}
                </div>
                <label className="form-label">Yönetişim</label>
                <div className="toggle-group" style={{ marginBottom: 12 }}>
                  {([['hazir','Toplumsal Hazırlık'],['uzman','Uzman Görüşü'],['uygulayici','Uygulayıcı Görüşü']] as [YonetisimTip,string][]).map(([v,l]) => (
                    <button key={v} className={'toggle-item' + (form.yonetisim.includes(v) ? ' on' : '')} onClick={() => toggleYon(v)}>{l}</button>
                  ))}
                </div>
                <label className="form-label">Etkilenen Müşteri/Personel (bin kişi)</label>
                <input type="number" value={form.etkilenenMusteriK} onChange={e => setForm(f => ({ ...f, etkilenenMusteriK: +e.target.value }))} style={{ width: '100%' }} />
              </div>
              {/* Finansal */}
              <div>
                <label className="form-label">Birim Fiyat (₺)</label>
                <input type="number" value={form.birimFiyatTL} onChange={e => setForm(f => ({ ...f, birimFiyatTL: +e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
                <label className="form-label">Birim</label>
                <input type="text" value={form.birim} onChange={e => setForm(f => ({ ...f, birim: e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
                <label className="form-label">Miktar</label>
                <input type="number" value={form.miktar} onChange={e => setForm(f => ({ ...f, miktar: +e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
                <label className="form-label">Yıllık Fayda (₺)</label>
                <input type="number" value={form.yillikFaydaTL} onChange={e => setForm(f => ({ ...f, yillikFaydaTL: +e.target.value }))} style={{ width: '100%', marginBottom: 8 }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <label className="form-label">RTO (saat)</label>
                    <input type="number" value={form.rto_saat} onChange={e => setForm(f => ({ ...f, rto_saat: +e.target.value }))} style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label className="form-label">RPO (saat)</label>
                    <input type="number" value={form.rpo_saat} onChange={e => setForm(f => ({ ...f, rpo_saat: +e.target.value }))} style={{ width: '100%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8F6F3', fontFamily: "'DM Sans',sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* ── NAV / BAŞLIK ─────────────────────────────────────────────────── */}
      <div style={{ background: 'white', borderBottom: '1px solid #ECEAE8', padding: '0 32px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '18px 0 14px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                <a href="/uzman/dashboard" style={{ fontSize: 11, color: '#A8A29E', textDecoration: 'none', fontWeight: 500 }}>Uzman Paneli</a>
                <span style={{ color: '#D1CEC9' }}>/</span>
                <span style={{ fontSize: 11, color: '#1B4FD8', fontWeight: 600 }}>Maliyet & BIA Analizi</span>
              </div>
              <h1 className="fd" style={{ fontSize: 21, fontWeight: 800, color: '#0A1628', marginBottom: 3 }}>Maliyet Analizi & İş Etki Değerlendirmesi</h1>
              <div style={{ display: 'flex', gap: 8 }}>
                <span className="bdg" style={{ background: '#EFF6FF', color: '#1E40AF' }}>ISO 22301 · BDDK MD 29 · BCM/YGG</span>
                <span className="bdg" style={{ background: '#F1F0EF', color: '#6B7280' }}>
                  Öncelikleme Çarpanları{' '}
                  <button onClick={() => { setCarpanTemp(carpanlar); setCarpanDuzenle(true); setSekme('parametreler') }}
                    style={{ marginLeft: 6, fontSize: 10, color: '#1B4FD8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>
                    Düzenle →
                  </button>
                </span>
              </div>
            </div>
            {/* KPI */}
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { l: 'Seçili', v: String(secili.size), r: '#1B4FD8' },
                { l: 'Yatırım', v: tl(topMaliyet), r: '#EF4444' },
                { l: 'Yıllık Fayda', v: tl(topFayda), r: '#22C55E' },
                { l: 'ROI', v: '%' + roi, r: '#F59E0B' },
                { l: 'Geri Ödeme', v: geriOdeme + ' yıl', r: '#8B5CF6' },
              ].map(k => (
                <div key={k.l} style={{ textAlign: 'center', padding: '9px 14px', background: '#FAFAF9', borderRadius: 11, border: '1px solid #ECEAE8', minWidth: 80 }}>
                  <div className="fm" style={{ fontSize: 16, fontWeight: 700, color: k.r, lineHeight: 1 }}>{k.v}</div>
                  <div style={{ fontSize: 9, color: '#A8A29E', marginTop: 3, textTransform: 'uppercase', letterSpacing: '.05em' }}>{k.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            {([
              { id: 'ozet', l: ' Özet' },
              { id: 'liste', l: ` Aksiyonlar (${aksiyonlar.length})` },
              { id: 'bia', l: ' İş Etki Analizi' },
              { id: 'parametreler', l: '⚙️ Öncelikleme Parametreleri' },
            ] as { id: typeof sekme, l: string }[]).map(s => (
              <button key={s.id} className={'sb' + (sekme === s.id ? ' on' : '')} onClick={() => setSekme(s.id)}>{s.l}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 32px 72px' }}>

        {/* ── ÖZET ─────────────────────────────────────────────────────────── */}
        {sekme === 'ozet' && (
          <div className="fi">
            <div style={{ display: 'grid', gridTemplateColumns: '5fr 3fr', gap: 20 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0A1628' }}>Öncelik Sıralaması</h3>
                  <span style={{ fontSize: 11, color: '#A8A29E' }}>Satıra tıklayarak seç/çıkar</span>
                </div>
                <div className="card" style={{ overflow: 'hidden' }}>
                  <table>
                    <thead>
                      <tr>
                        {['#', 'Aksiyon', 'Puan', 'Birim Fiyat', 'Toplam', 'Fayda/Yıl', 'ROI', 'RTO'].map(h => <th key={h}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {puanliAksiyonlar.map((a, i) => {
                        const total = a.birimFiyatTL * a.miktar
                        const aROI = total > 0 ? Math.round(a.yillikFaydaTL / total * 100) : 0
                        const pct = (a.oncelikPuani / maxPuan) * 100
                        const isSecili = secili.has(a.id)
                        return (
                          <tr key={a.id} className="rh" style={{ background: isSecili ? '#F0FFFE' : 'white', cursor: 'pointer', transition: 'all .15s' }} onClick={() => toggle(a.id)}>
                            <td style={{ fontWeight: 700, color: '#A8A29E', fontSize: 12 }}>{i + 1}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: KAT_RENK[a.kategori] || '#999', flexShrink: 0 }} />
                                <span style={{ fontSize: 12, fontWeight: 600, color: '#0A1628' }}>{a.baslik}</span>
                                {isSecili && <span className="bdg" style={{ background: '#DCFCE7', color: '#166534', fontSize: 9 }}>SEÇİLİ</span>}
                              </div>
                              <span className="bdg" style={{ background: KAT_RENK[a.kategori] + '18', color: KAT_RENK[a.kategori], fontSize: 10 }}>{a.kategori}</span>
                            </td>
                            <td>
                              <div className="fm" style={{ fontSize: 15, fontWeight: 800, color: '#0A1628', marginBottom: 3 }}>{a.oncelikPuani}</div>
                              <div className="pb" style={{ height: 3, width: 56 }}><div className="pf" style={{ width: pct + '%', height: 3, background: pct > 66 ? '#22C55E' : pct > 33 ? '#F59E0B' : '#EF4444' }} /></div>
                            </td>
                            <td>
                              <div className="fm" style={{ fontSize: 11, fontWeight: 700, color: MAL_RENK[a.maliyetBant] }}>{tl(a.birimFiyatTL)}</div>
                              <div style={{ fontSize: 10, color: '#A8A29E' }}>/{a.birim}</div>
                            </td>
                            <td><span className="fm" style={{ fontSize: 12, fontWeight: 700 }}>{tl(total)}</span></td>
                            <td><span className="fm" style={{ fontSize: 11, fontWeight: 700, color: '#22C55E' }}>{tl(a.yillikFaydaTL)}</span></td>
                            <td><span className="fm" style={{ fontSize: 11, fontWeight: 700, color: aROI > 200 ? '#22C55E' : aROI > 100 ? '#F59E0B' : '#EF4444' }}>%{aROI}</span></td>
                            <td><span className="fm" style={{ fontSize: 11, fontWeight: 700, color: '#1B4FD8' }}>{a.rto_saat}s</span></td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0A1628', marginBottom: 12 }}>Seçili Paket</h3>
                <div className="card" style={{ padding: 20, marginBottom: 14 }}>
                  {[
                    { l: 'Toplam Yatırım', v: tl(topMaliyet), r: '#EF4444', i: '' },
                    { l: 'Yıllık Fayda', v: tl(topFayda), r: '#22C55E', i: '' },
                    { l: 'ROI', v: '%' + roi, r: '#F59E0B', i: '' },
                    { l: 'Geri Ödeme', v: geriOdeme + ' yıl', r: '#1B4FD8', i: '🕐' },
                  ].map(k => (
                    <div key={k.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F7F6F5' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>{k.i}</span>
                        <span style={{ fontSize: 12, color: '#6B7280' }}>{k.l}</span>
                      </div>
                      <span className="fm" style={{ fontSize: 14, fontWeight: 700, color: k.r }}>{k.v}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 12, padding: 12, background: '#F0FFF4', borderRadius: 10, border: '1px solid #BBFBD0' }}>
                    <p style={{ fontSize: 11, color: '#166534', lineHeight: 1.65 }}>
                      Seçili <strong>{secili.size}</strong> aksiyon ISO 22301 ve BDDK MD 29 kapsamındaki YGG yükümlülüklerini büyük ölçüde karşılamaktadır.
                    </p>
                  </div>
                </div>

                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#0A1628', marginBottom: 10 }}>Kategori Dağılımı</h3>
                <div className="card" style={{ padding: 16 }}>
                  {Object.entries(
                    aksiyonlar.reduce((acc, a) => { acc[a.kategori] = (acc[a.kategori] || 0) + a.birimFiyatTL * a.miktar; return acc }, {} as Record<string, number>)
                  ).sort((x, y) => y[1] - x[1]).map(([kat, mal]) => {
                    const total = aksiyonlar.reduce((s, a) => s + a.birimFiyatTL * a.miktar, 0)
                    const pct = total > 0 ? Math.round(mal / total * 100) : 0
                    return (
                      <div key={kat} style={{ marginBottom: 11 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: KAT_RENK[kat] || '#999' }} />
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{kat}</span>
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <span className="fm" style={{ fontSize: 11, fontWeight: 700 }}>{tl(mal)}</span>
                            <span style={{ fontSize: 11, color: '#A8A29E' }}>%{pct}</span>
                          </div>
                        </div>
                        <div className="pb" style={{ height: 5 }}><div className="pf" style={{ width: pct + '%', height: 5, background: KAT_RENK[kat] || '#999' }} /></div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── AKSİYON LİSTESİ ──────────────────────────────────────────────── */}
        {sekme === 'liste' && (
          <div className="fi">
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              <select value={filKat} onChange={e => setFilKat(e.target.value)}>
                <option value="tumu">Tüm Kategoriler</option>
                {[...new Set(aksiyonlar.map(a => a.kategori))].map(k => <option key={k}>{k}</option>)}
              </select>
              <select value={filMal} onChange={e => setFilMal(e.target.value)}>
                <option value="tumu">Tüm Maliyetler</option>
                <option value="yuksek">Yüksek</option>
                <option value="orta">Orta</option>
                <option value="dusuk">Düşük</option>
              </select>
              <span style={{ fontSize: 12, color: '#A8A29E' }}>{filtreli.length} aksiyon</span>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <button className="btn btn-beyaz" onClick={() => setSecili(new Set(aksiyonlar.map(a => a.id)))}>Tümünü Seç</button>
                <button className="btn btn-beyaz" onClick={() => setSecili(new Set())}>Sıfırla</button>
                <button className="btn btn-mavi" onClick={aksiyonEkle}>+ Yeni Aksiyon</button>
              </div>
            </div>

            <div className="card" style={{ overflow: 'hidden' }}>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: 32 }}></th>
                    <th>Aksiyon</th>
                    <th>Puan</th>
                    <th>Birim Fiyat</th>
                    <th>Miktar</th>
                    <th>Toplam</th>
                    <th>Fayda/Yıl</th>
                    <th>ROI</th>
                    <th>RTO/RPO</th>
                    <th style={{ width: 80 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filtreli.map(a => {
                    const total = a.birimFiyatTL * a.miktar
                    const aROI = total > 0 ? Math.round(a.yillikFaydaTL / total * 100) : 0
                    const isSecili = secili.has(a.id)
                    const isOpen = duzenle === a.id
                    return (
                      <>
                        <tr key={a.id} className="rh" style={{ background: isSecili ? '#F0FFFE' : 'white', transition: 'all .15s' }}>
                          <td onClick={() => toggle(a.id)} style={{ cursor: 'pointer' }}>
                            <input type="checkbox" className="chk" checked={isSecili} readOnly />
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                              <div style={{ width: 8, height: 8, borderRadius: '50%', background: KAT_RENK[a.kategori] || '#999', flexShrink: 0 }} />
                              <span style={{ fontSize: 12, fontWeight: 600, color: '#0A1628' }}>{a.baslik}</span>
                            </div>
                            <div style={{ display: 'flex', gap: 5 }}>
                              <span className="bdg" style={{ background: KAT_RENK[a.kategori] + '18', color: KAT_RENK[a.kategori], fontSize: 10 }}>{a.kategori}</span>
                              <span className="bdg" style={{ background: MAL_RENK[a.maliyetBant] + '18', color: MAL_RENK[a.maliyetBant], fontSize: 10 }}>{MAL_LABEL[a.maliyetBant]}</span>
                            </div>
                          </td>
                          <td><span className="fm" style={{ fontSize: 15, fontWeight: 800, color: '#0A1628' }}>{a.oncelikPuani}</span></td>
                          <td>
                            <span className="fm" style={{ fontSize: 12, fontWeight: 700, color: MAL_RENK[a.maliyetBant] }}>{tl(a.birimFiyatTL)}</span>
                            <div style={{ fontSize: 10, color: '#A8A29E' }}>/{a.birim}</div>
                          </td>
                          <td><span className="fm" style={{ fontSize: 12 }}>{a.miktar} {a.birim}</span></td>
                          <td><span className="fm" style={{ fontSize: 13, fontWeight: 800 }}>{tl(total)}</span></td>
                          <td><span className="fm" style={{ fontSize: 12, fontWeight: 700, color: '#22C55E' }}>{tl(a.yillikFaydaTL)}</span></td>
                          <td><span className="fm" style={{ fontSize: 12, fontWeight: 700, color: aROI > 200 ? '#22C55E' : aROI > 100 ? '#F59E0B' : '#EF4444' }}>%{aROI}</span></td>
                          <td>
                            <div className="fm" style={{ fontSize: 10, fontWeight: 700, color: '#1B4FD8' }}>RTO: {a.rto_saat}s</div>
                            <div className="fm" style={{ fontSize: 10, fontWeight: 700, color: '#8B5CF6' }}>RPO: {a.rpo_saat}s</div>
                          </td>
                          <td>
                            <button className="btn btn-beyaz" style={{ fontSize: 11, padding: '5px 10px' }}
                              onClick={() => setDuzenle(isOpen ? null : a.id)}>
                              {isOpen ? 'Kapat' : '✏️ Düzenle'}
                            </button>
                          </td>
                        </tr>
                        {isOpen && <EditForm key={'edit-' + a.id} a={a} />}
                      </>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── BIA ──────────────────────────────────────────────────────────── */}
        {sekme === 'bia' && (
          <div className="fi">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div className="card" style={{ padding: 24, borderLeft: '4px solid #1B4FD8' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0A1628', marginBottom: 12 }}>BIA Parametreleri — ISO 22301 §8.2.2</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                    { l: 'MTD (Max Tolerable Downtime)', v: '72 saat' },
                    { l: 'RTO — Kritik Süreçler', v: '4 saat' },
                    { l: 'RTO — Operasyonel', v: '24 saat' },
                    { l: 'RPO — Core Banking', v: '1 saat' },
                    { l: 'MTPD Ortalama', v: '48 saat' },
                    { l: 'Günlük Gelir Kaybı', v: '₺2.8M/gün' },
                  ].map(k => (
                    <div key={k.l} style={{ background: '#FAFAF9', borderRadius: 8, padding: '9px 12px', border: '1px solid #F1F0EF' }}>
                      <div style={{ fontSize: 9, color: '#A8A29E', textTransform: 'uppercase', marginBottom: 2 }}>{k.l}</div>
                      <div className="fm" style={{ fontSize: 13, fontWeight: 700, color: '#0A1628' }}>{k.v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0A1628', marginBottom: 12 }}>Beklenen Yıllık Kayıp (EAL)</h3>
                {[
                  { s: 'Büyük Deprem (M7.0+)', olas: '%8', etki: '₺85M', eal: '₺6.8M/yıl', r: '#EF4444' },
                  { s: 'Ransomware Saldırısı', olas: '%22', etki: '₺18M', eal: '₺3.96M/yıl', r: '#8B5CF6' },
                  { s: 'Yangın', olas: '%5', etki: '₺12M', eal: '₺0.6M/yıl', r: '#F97316' },
                  { s: 'Sel / Taşkın', olas: '%10', etki: '₺8M', eal: '₺0.8M/yıl', r: '#0EA5E9' },
                  { s: 'Elektrik Kesintisi', olas: '%35', etki: '₺2.5M', eal: '₺0.875M/yıl', r: '#F59E0B' },
                ].map(s => (
                  <div key={s.s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F7F6F5' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.r, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#0A1628' }}>{s.s}</div>
                        <div style={{ fontSize: 10, color: '#A8A29E' }}>Yıllık olasılık: {s.olas} · Tek etki: {s.etki}</div>
                      </div>
                    </div>
                    <span className="fm" style={{ fontSize: 12, fontWeight: 700, color: s.r }}>{s.eal}</span>
                  </div>
                ))}
                <div style={{ marginTop: 12, padding: '10px 14px', background: '#FEF2F2', borderRadius: 10, border: '1px solid #FECACA', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#991B1B' }}>Toplam EAL</span>
                  <span className="fm" style={{ fontSize: 15, fontWeight: 800, color: '#EF4444' }}>₺13.04M/yıl</span>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0A1628', marginBottom: 14 }}>Kritik İş Süreci — BIA Matrisi</h3>
              <table>
                <thead>
                  <tr>{['Kritik Süreç', 'Öncelik', 'MTD', 'RTO', 'RPO', 'MAO', 'Yıllık Gelir', 'İlgili Aksiyonlar'].map(h => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {[
                    { s: 'Core Banking', p: 1, mtd: '4s', rto: '1s', rpo: '15dk', mao: '4s', gel: '₺28M', aks: 'C1, C2, C3' },
                    { s: 'ATM / POS Ağı', p: 1, mtd: '8s', rto: '2s', rpo: '30dk', mao: '8s', gel: '₺12M', aks: 'C1, C3' },
                    { s: 'İnternet Bankacılığı', p: 2, mtd: '12s', rto: '4s', rpo: '1s', mao: '12s', gel: '₺18M', aks: 'C1, C2, G1' },
                    { s: 'Swift / Havale', p: 1, mtd: '6s', rto: '2s', rpo: '30dk', mao: '6s', gel: '₺9M', aks: 'C1, G1' },
                    { s: 'Şube Operasyonları', p: 3, mtd: '48s', rto: '12s', rpo: '8s', mao: '48s', gel: '₺22M', aks: 'B2, G2, Y1' },
                    { s: 'Ödeme Sistemleri', p: 1, mtd: '4s', rto: '1s', rpo: '15dk', mao: '4s', gel: '₺15M', aks: 'C1, C3, G1' },
                  ].map((r, i) => (
                    <tr key={i} className="rh">
                      <td style={{ fontWeight: 600, color: '#0A1628', fontSize: 12 }}>{r.s}</td>
                      <td><span className="bdg" style={{ background: r.p === 1 ? '#FEF2F2' : r.p === 2 ? '#FFF7ED' : '#F0FFF4', color: r.p === 1 ? '#991B1B' : r.p === 2 ? '#92400E' : '#166534' }}>P{r.p}</span></td>
                      {[r.mtd, r.rto, r.rpo, r.mao].map((v, j) => <td key={j}><span className="fm" style={{ fontSize: 12, fontWeight: 700, color: '#1B4FD8' }}>{v}</span></td>)}
                      <td><span className="fm" style={{ fontSize: 12, fontWeight: 700, color: '#22C55E' }}>{r.gel}</span></td>
                      <td><span style={{ fontSize: 11, color: '#1B4FD8', fontWeight: 600 }}>{r.aks}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0A1628', marginBottom: 14 }}>Kesinti Süresine Göre Kümülatif Mali Etki</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 10 }}>
                {[
                  { sure: '1 saat', etki: '₺117K', r: '#22C55E', pct: 2 },
                  { sure: '4 saat', etki: '₺468K', r: '#84CC16', pct: 8 },
                  { sure: '12 saat', etki: '₺1.4M', r: '#F59E0B', pct: 24 },
                  { sure: '24 saat', etki: '₺2.8M', r: '#F97316', pct: 48 },
                  { sure: '48 saat', etki: '₺6.2M', r: '#EF4444', pct: 70 },
                  { sure: '72 saat', etki: '₺11.8M+', r: '#DC2626', pct: 100 },
                ].map(t => (
                  <div key={t.sure} style={{ textAlign: 'center', padding: '14px 10px', background: '#FAFAF9', borderRadius: 12, border: '2px solid ' + t.r + '30' }}>
                    <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 5, fontWeight: 600 }}>{t.sure}</div>
                    <div className="fd" style={{ fontSize: 17, fontWeight: 800, color: t.r, lineHeight: 1, marginBottom: 3 }}>{t.etki}</div>
                    <div style={{ fontSize: 9, color: '#A8A29E', marginBottom: 6 }}>kümülatif kayıp</div>
                    <div className="pb" style={{ height: 4 }}><div className="pf" style={{ width: t.pct + '%', height: 4, background: t.r }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PARAMETRELER ─────────────────────────────────────────────────── */}
        {sekme === 'parametreler' && (
          <div className="fi">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* Sol — çarpan editörü */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0A1628' }}>Öncelikleme Çarpanları</h3>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {carpanDuzenle
                      ? <>
                          <button className="btn btn-mavi" onClick={carpanUygula}>Uygula</button>
                          <button className="btn btn-beyaz" onClick={() => { setCarpanDuzenle(false); setCarpanTemp(carpanlar) }}>İptal</button>
                        </>
                      : <button className="btn btn-beyaz" onClick={() => { setCarpanTemp({ ...carpanlar }); setCarpanDuzenle(true) }}>Düzenle</button>
                    }
                    <button className="btn btn-beyaz" onClick={() => { setCarpanTemp({ ...CARPAN_VARSAYILAN }); setCarpanlar(CARPAN_VARSAYILAN); setCarpanDuzenle(false) }}>Varsayılana Dön</button>
                  </div>
                </div>

                {[
                  { baslik: 'KARAR', aciklama: 'Aksiyona karar verecek makam', items: [
                    { l: 'Yerel Makam', k: 'karar_yerel' as keyof Carpanlar },
                    { l: 'Üst Makam', k: 'karar_ust' as keyof Carpanlar },
                  ]},
                  { baslik: 'İCRA', aciklama: 'Aksiyonu hayata geçirecek kurum sayısı', items: [
                    { l: 'Yerel / Az Sayıda Kurum', k: 'icra_yerel' as keyof Carpanlar },
                    { l: 'Ulusal / Çok Sayıda Kurum', k: 'icra_ulusal' as keyof Carpanlar },
                  ]},
                  { baslik: 'MALİYET ETKİNLİĞİ', aciklama: 'Aksiyonun maliyet düzeyi — düşük maliyet daha yüksek öncelik', items: [
                    { l: 'Düşük / Maliyetsiz', k: 'maliyet_dusuk' as keyof Carpanlar },
                    { l: 'Orta Maliyet', k: 'maliyet_orta' as keyof Carpanlar },
                    { l: 'Yüksek / Öngörülemeyen', k: 'maliyet_yuksek' as keyof Carpanlar },
                  ]},
                  { baslik: 'UYGULAMA ZORLUĞU', aciklama: 'Zorluk varsa puanı düşürür', items: [
                    { l: 'Zorluk Yok', k: 'zorluk_yok' as keyof Carpanlar },
                    { l: 'Zorluk Var (Toplum/Kapasite/Teknoloji)', k: 'zorluk_var' as keyof Carpanlar },
                  ]},
                  { baslik: 'YÖNETİŞİM', aciklama: 'Hazırlık, uzman ve uygulayıcı görüşü varlığı', items: [
                    { l: 'Yönetişim Çarpanı (Hazırlık/Uzman/Uygulayıcı)', k: 'yonetisim' as keyof Carpanlar },
                  ]},
                  { baslik: 'FAYDA ÇARPANI (Etkilenen Kişi)', aciklama: '≤100K | ~1M | ≥5M kişi eşik değerleri', items: [
                    { l: '100.000 kişi eşiği', k: 'fayda_kucuk' as keyof Carpanlar },
                    { l: '1.000.000 kişi eşiği', k: 'fayda_orta' as keyof Carpanlar },
                    { l: '5.000.000 kişi eşiği', k: 'fayda_buyuk' as keyof Carpanlar },
                  ]},
                ].map(grup => (
                  <div key={grup.baslik} className="card" style={{ padding: '14px 18px', marginBottom: 10 }}>
                    <div style={{ marginBottom: 10 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: '#0A1628', textTransform: 'uppercase', letterSpacing: '.06em' }}>{grup.baslik}</p>
                      <p style={{ fontSize: 11, color: '#A8A29E', marginTop: 2 }}>{grup.aciklama}</p>
                    </div>
                    {grup.items.map(it => (
                      <div key={it.k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderTop: '1px solid #F1F0EF' }}>
                        <span style={{ fontSize: 12, color: '#374151' }}>{it.l}</span>
                        {carpanDuzenle
                          ? <input type="number" className="carpan-input" step="0.05" min="0" max="10"
                              value={carpanTemp[it.k]}
                              onChange={e => setCarpanTemp(p => ({ ...p, [it.k]: +e.target.value }))} />
                          : <span className="fm" style={{ fontSize: 15, fontWeight: 800, color: '#1B4FD8', background: '#EFF6FF', padding: '3px 12px', borderRadius: 8 }}>×{carpanlar[it.k]}</span>
                        }
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Sağ — formül + canlı önizleme */}
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0A1628', marginBottom: 14 }}>Öncelikleme Formülü</h3>
                <div className="card" style={{ padding: 20, marginBottom: 16, borderLeft: '4px solid #1B4FD8' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#A8A29E', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>Proje Öncelik Puanı =</p>
                  <div style={{ background: '#F8F6F3', borderRadius: 10, padding: '14px 16px', fontFamily: "'DM Mono',monospace", fontSize: 12, color: '#374151', lineHeight: 2 }}>
                    Baz Puan (Risk Derecesi 1–10)<br />
                    <span style={{ color: '#1B4FD8' }}>× Karar Çarpanı</span><br />
                    <span style={{ color: '#8B5CF6' }}>× İcra Çarpanı</span><br />
                    <span style={{ color: '#F59E0B' }}>× Maliyet Etkinliği Çarpanı</span><br />
                    <span style={{ color: '#EF4444' }}>× Uygulama Zorluğu Çarpanı</span><br />
                    <span style={{ color: '#22C55E' }}>× Yönetişim Çarpanı</span><br />
                    <span style={{ color: '#F97316' }}>× Fayda Çarpanı (Etkilenen Kişi)</span>
                  </div>
                  <p style={{ fontSize: 11, color: '#A8A29E', marginTop: 10, lineHeight: 1.65 }}>
                    Yüksek risk derecesi, düşük maliyet ve geniş etki alanına sahip aksiyonlar en yüksek öncelik puanını alır. Çarpanları yukarıdan kurumunuza göre ayarlayabilirsiniz.
                  </p>
                </div>

                <h3 style={{ fontSize: 13, fontWeight: 700, color: '#0A1628', marginBottom: 12 }}>
                  {carpanDuzenle ? '🔄 Canlı Önizleme (değişiklikler uygulanmadı)' : 'Mevcut Parametrelerle İlk 5 Aksiyon'}
                </h3>
                <div className="card" style={{ overflow: 'hidden' }}>
                  {(carpanDuzenle
                    ? aksiyonlar.map(a => ({ ...a, oncelikPuani: hesapla(a, carpanTemp) })).sort((a, b) => b.oncelikPuani - a.oncelikPuani)
                    : puanliAksiyonlar
                  ).slice(0, 5).map((a, i) => (
                    <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid #F7F6F5' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#A8A29E', width: 20, flexShrink: 0 }}>{i + 1}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                          <div style={{ width: 7, height: 7, borderRadius: '50%', background: KAT_RENK[a.kategori] || '#999' }} />
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#0A1628' }}>{a.baslik}</span>
                        </div>
                        <div className="pb" style={{ height: 4, maxWidth: 200 }}>
                          <div className="pf" style={{ width: (a.oncelikPuani / (maxPuan || 1) * 100) + '%', height: 4, background: KAT_RENK[a.kategori] || '#999' }} />
                        </div>
                      </div>
                      <span className="fm" style={{ fontSize: 16, fontWeight: 800, color: carpanDuzenle ? '#F59E0B' : '#0A1628', flexShrink: 0 }}>{a.oncelikPuani}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
