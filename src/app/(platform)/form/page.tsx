'use client'
import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase'
import { SORULAR } from '@/lib/sorular'
import { SORULAR_SANAYI, SANAYI_SORU_META } from '@/lib/sorular-sanayi'
import { SORULAR_SAGLIK, SAGLIK_SORU_META } from '@/lib/sorular-saglik'
import { SORULAR_KONAKLAMA, KONAKLAMA_SORU_META } from '@/lib/sorular-konaklama'
import { SORULAR_BELEDIYE, BELEDIYE_SORU_META } from '@/lib/sorular-belediye'
import { skorHesapla, type HFESkor } from '@/lib/bcm-hesapla'
import { getSektorSenaryolari } from '@/lib/senaryolar'
import { mevcutKullanici, oturumKapat } from '@/lib/auth'
import { SEKTOR_ETIKET, SEKTOR_IKON, Sektor } from '@/types'
import { bolgedenOneriHesapla, bolgeRiskOzeti, IL_PROFIL } from '@/lib/bolge-profil'
import {
  createAssessment,
  createFacility,
  fetchFacilitiesByTenant,
  type OmniAssessment,
  type OmniSector,
  type AssessmentCreatePayload,
  RISK_CLASS_TR,
  RISK_CLASS_COLOR,
} from '@/lib/api'

export interface TesisKarti {
  yapi_yili: string; yapi_tipi: string; kat_adeti: string
  bodrum_var: boolean; bodrum_kullanim: string; alan_m2: string
  guclendirilmis: string; zemin_etut: string; yapisal_durum: string
  iskan_belgesi: string; mulk_durumu: string; kira_bitis: string
  atm_sayisi: string; atm_dis_sayisi: string; kasa_tipi: string
  jenerator_var: boolean; jenerator_kw: string
  ups_var: boolean; ups_dakika: string
  yangin_sistemi: string; guvenlik_kamera: boolean; kamera_kayit_gun: string
  erken_uyari: boolean; sigorta_var: boolean; sigorta_sirket: string
  sube_muduru: string; mudur_tel: string; mudur_email: string; kep_adresi: string
  acil_yetkili: string; acil_yetkili_tel: string
  guvenlik_sirket: string; guvenlik_tel: string
  en_yakin_hastane: string; en_yakin_itfaiye: string
  komsu_risk: string; ek_not: string
  // Adres
  mahalle: string; cadde_sokak: string; lat: string; lng: string
}

const TESİS_BOŞ: TesisKarti = {
  yapi_yili: '', yapi_tipi: 'betonarme', kat_adeti: '', bodrum_var: false,
  bodrum_kullanim: 'yok', alan_m2: '', guclendirilmis: 'yok',
  zemin_etut: 'yok', yapisal_durum: '3', iskan_belgesi: 'var',
  mulk_durumu: 'kira', kira_bitis: '', atm_sayisi: '', atm_dis_sayisi: '',
  kasa_tipi: 'kasa odası', jenerator_var: false, jenerator_kw: '',
  ups_var: false, ups_dakika: '', yangin_sistemi: 'algılama',
  guvenlik_kamera: true, kamera_kayit_gun: '30', erken_uyari: false,
  sigorta_var: false, sigorta_sirket: '',
  sube_muduru: '', mudur_tel: '', mudur_email: '', kep_adresi: '',
  acil_yetkili: '', acil_yetkili_tel: '',
  guvenlik_sirket: '', guvenlik_tel: '',
  en_yakin_hastane: '', en_yakin_itfaiye: '',
  komsu_risk: '', ek_not: '',
  mahalle: '', cadde_sokak: '', lat: '', lng: '',
}

// ─── Railway sabitleri ─────────────────────────────────────────
// Demo tenant: production'da kullaniciya göre resolve edilir
const DEMO_TENANT_ID = '11111111-1111-1111-1111-111111111111'

const SEKTOR_RAILWAY: Record<string, OmniSector> = {
  bankacilik: 'bank',
  saglik:     'hospital',
  konaklama:  'hotel',
  uretim:     'industrial',
  hizmet:     'infrastructure',
  belediye:   'municipality',
  kamu:       'municipality',   // legacy uyumluluk
  meb:        'education',
  odalar:     'municipality',
}

// ─── HFE-360 → Railway AssessmentCreatePayload dönüşümü ───────
function buildRailwayPayload(
  facilityId: string,
  puanlar: Record<string, number>,
  tesis: TesisKarti,
  hfe: HFESkor,
  sektor: string,
  birimKodu: string,
  tenant: string,
): AssessmentCreatePayload {
  const p = (kod: string) => (puanlar[kod] ?? 1) / 3   // 0-1 raw

  const yil  = parseInt(tesis.yapi_yili) || 2000
  const age  = new Date().getFullYear() - yil
  const yapiDurum = parseInt(tesis.yapisal_durum?.[0]) || 3  // '3 — Orta' → 3

  return {
    facility_id: facilityId,
    notes: `HFE-360 · ${tenant} · ${birimKodu} · ${new Date().toLocaleDateString('tr-TR')}`,

    hazard: {
      seismic:              p('H2'),                   // fiziksel etki
      seismic_probability:  p('H1'),                   // gerçekleşme sıklığı
      flood:                p('H5'),                   // coğrafi/iklim riski
      flood_probability:    p('H5') * 0.8,
      supply_chain:         p('H7'),                   // zincirleme etki
      cyber:                p('H6') * 0.4,             // ekonomik/siber etki
      cyber_probability:    p('H6') * 0.3,
      pandemic:             p('H4') * 0.3,             // etki süresi
    },

    fragility: {
      building_age_score:      Math.min(1, age / 60),
      construction_quality:    1 - (yapiDurum - 1) / 4,  // 5→0.0, 1→1.0
      seismic_compliance:      tesis.guclendirilmis === 'var'   ? 0.1
                             : tesis.guclendirilmis === 'kısmi' ? 0.45 : 0.85,
      maintenance_score:       1 - hfe.f_skoru / 100,    // düşük f_skoru = kötü bakım
      single_point_of_failure: p('F2'),                  // kilit personel riski
      redundancy_score:        tesis.jenerator_var && tesis.ups_var ? 0.15
                             : tesis.jenerator_var || tesis.ups_var ? 0.45 : 0.80,
      supply_dependency:       p('H7'),
      staff_training_score:    1 - hfe.e_skoru / 100,   // düşük kapasite = az eğitim
      bcm_awareness:           1 - hfe.e_skoru / 100,
      cyber_hygiene:           p('H6') * 0.5,
      backup_status:           tesis.ups_var ? 0.2 : 0.75,
      system_age_score:        Math.min(1, age / 50),
    },

    exposure: {
      asset_criticality:          sektor === 'saglik' || sektor === 'kamu' ? 0.9 : 0.75,
      critical_service_count:     tesis.atm_sayisi ? parseInt(tesis.atm_sayisi) || 1 : 1,
      dependency_count:           3,
      dependency_criticality:     0.6,
      serves_critical_population: sektor === 'saglik' || sektor === 'kamu',
    },

    response: {
      bcm_plan_exists:            hfe.e_skoru > 50,
      plan_tested_last_12m:       hfe.e_skoru > 70,
      iso_22301_certified:        false,
      plan_digitized:             true,
      backup_power_hours:         tesis.jenerator_var ? 8 : tesis.ups_var ? 0.5 : 0,
      backup_systems_score:       tesis.jenerator_var && tesis.ups_var ? 0.85
                                : tesis.jenerator_var || tesis.ups_var ? 0.5 : 0.1,
      emergency_stockpile_days:   1,
      drill_frequency_per_year:   1,
      staff_certification_pct:    Math.round(hfe.e_skoru * 0.6),
      crisis_team_exists:         !!(tesis.acil_yetkili && tesis.acil_yetkili_tel),
      mutual_aid_agreements:      (sektor === 'belediye' || sektor === 'kamu') ? 3 : 1,
      coordination_score:         hfe.e_skoru / 100,
    },
  }
}

const getSektorSorular = (sektor: Sektor) => {
  switch (sektor) {
    case 'uretim':    return SORULAR_SANAYI
    case 'saglik':    return SORULAR_SAGLIK
    case 'konaklama': return SORULAR_KONAKLAMA
    case 'belediye':  return SORULAR_BELEDIYE
    default:          return SORULAR
  }
}
const SEKTOR_KAYNAK: Partial<Record<Sektor, string>> = {
  uretim:    `HIFYEA v2 · ISO 22301 · AFAD AADY 2025 · TOC/HRO — ${SANAYI_SORU_META.toplam} soru`,
  saglik:    `HAP + JCI + İTÜ AYM HFE-360 — ${SAGLIK_SORU_META.toplam} soru`,
  konaklama: `TÜRSAB + Yangın Yön. + HFE-360 — ${KONAKLAMA_SORU_META.toplam} soru`,
  belediye:  `5393 BelK. + AFAD + Sendai + HFE-360 — ${BELEDIYE_SORU_META.toplam} soru`,
}

// Sektöre göre birim adı (üst bar için)
const SEKTOR_BIRIM_LABEL: Partial<Record<Sektor, string>> = {
  bankacilik: 'Şube Değerlendirmesi',
  saglik:     'Tesis Değerlendirmesi',
  konaklama:  'Otel Değerlendirmesi',
  uretim:     'Fabrika / OSB Değerlendirmesi',
  belediye:   'Birim Değerlendirmesi',
  meb:        'Okul Değerlendirmesi',
  hizmet:     'İşletme Değerlendirmesi',
  odalar:     'Üye Firma Değerlendirmesi',
}
const BOLUMLER = ['TEHLİKE', 'KIRILGANLIK', 'KAPASİTE'] as const
const TEAL = '#009B8D'; const NAVY = '#0A1628'; const AMBER = '#D97706'

const BEYLIKDUZU_MAHALLELER = [
  'Yakuplu', 'Kavaklı', 'Sahil', 'Marmara', 'Gürpınar',
  'Dereağzı', 'Adnan Kahveci', 'Büyükşehir', 'Barış', 'Cumhuriyet',
]

// Dynamic Leaflet map (SSR disabled)
const LeafletMap = dynamic(() => import('./LeafletMap'), { ssr: false })

export default function FormPage() {
  const [adim, setAdim] = useState<1|2>(1)
  const [tesis, setTesis] = useState<TesisKarti>(TESİS_BOŞ)
  const [puanlar, setPuanlar] = useState<Record<string, number>>({})
  const [senaryo, setSenaryo] = useState('')
  const [gonderiyor, setGonderiyor] = useState(false)
  const [gonderildi, setGonderildi] = useState(false)
  const [assessmentSonucu, setAssessmentSonucu] = useState<OmniAssessment | null>(null)
  const [kullanici, setKullanici] = useState<ReturnType<typeof mevcutKullanici>>(null)
  const [bolgeOneri, setBolgeOneri] = useState<Record<string, number>>({})
  const [ilKodu, setIlKodu] = useState('')
  const [oneriGoster, setOneriGoster] = useState(false)
  const [tesisTamam, setTesisTamam] = useState(false)
  // HRO soruları
  const [hroYanitlar, setHroYanitlar] = useState<Record<string, string | number>>({})
  const hroSet = (k: string, v: string | number) => setHroYanitlar(p => ({ ...p, [k]: v }))
  // Adres
  const [konumModu, setKonumModu] = useState<null|'harita'|'koordinat'>(null)
  const [manuelLat, setManuelLat] = useState('')
  const [manuelLng, setManuelLng] = useState('')

  useEffect(() => {
    const k = mevcutKullanici()
    if (!k?.rol) { window.location.href = '/login'; return }
    setKullanici(k)
    const sns = getSektorSenaryolari(k.sektor as Sektor)
    if (sns.length) setSenaryo(sns[0].ad)
    if (k.birim_kodu) {
      const il = k.birim_kodu.substring(0, 2)
      setIlKodu(il); setBolgeOneri(bolgedenOneriHesapla(il))
    }
  }, [])

  const sektor = (kullanici?.sektor || 'bankacilik') as Sektor
  const senaryolar = getSektorSenaryolari(sektor)
  const sorular = getSektorSorular(sektor)
  const kaynak = SEKTOR_KAYNAK[sektor] || `İTÜ AYM HFE-360 — ${SORULAR.length} soru`
  const mainSorular = sorular.filter(s => !s.kod.startsWith('HRO'))
  const cevaplanan = mainSorular.filter(s => puanlar[s.kod] !== undefined).length
  const toplamSoru = mainSorular.length
  const yuzde = Math.round(cevaplanan / toplamSoru * 100)
  const bolgeRisk = ilKodu ? bolgeRiskOzeti(ilKodu) : null
  const tesisZorunlu = !!(tesis.yapi_yili && tesis.kat_adeti && tesis.sube_muduru && tesis.mudur_tel)

  const tD = (k: keyof TesisKarti, v: any) => setTesis(p => ({ ...p, [k]: v }))
  const bolgeOneriUygula = () => { setPuanlar(prev => ({ ...bolgeOneri, ...prev })); setOneriGoster(false) }

  const formuGonder = async (durum: 'gonderildi' | 'taslak') => {
    if (!kullanici?.birim_kodu) return
    setGonderiyor(true)
    const hfe = skorHesapla(puanlar)

    // ── Taslak: Supabase'e kaydet ─────────────────────────────
    if (durum === 'taslak') {
      const { error } = await supabase.from('form_cevaplari').insert({
        tenant_id: null, birim_kodu: kullanici.birim_kodu, senaryo,
        sektor: kullanici.sektor || 'bankacilik',
        puanlar: { ...puanlar, _tesis_karti: tesis },
        dayaniklilik_skoru: hfe.toplam, h_skoru: hfe.h_skoru,
        f_skoru: hfe.f_skoru, e_skoru: hfe.e_skoru, durum,
        dolduran_email: kullanici.email, gonderilme: null,
      })
      setGonderiyor(false)
      if (error) { alert('Hata: ' + error.message); return }
      alert('✅ Taslak kaydedildi.')
      return
    }

    // ── Gönderildi: Railway API ───────────────────────────────
    try {
      const omniSektor = SEKTOR_RAILWAY[sektor] ?? 'bank'

      // Facility bul veya oluştur
      let facilityId: string | null = null
      try {
        const facilities = await fetchFacilitiesByTenant(DEMO_TENANT_ID)
        facilityId = facilities.find(f => f.code === kullanici.birim_kodu)?.id ?? null
      } catch { /* tenant mevcut değil, yeni facility oluştur */ }

      if (!facilityId) {
        const yil = parseInt(tesis.yapi_yili) || 2000
        const created = await createFacility({
          tenant_id:         DEMO_TENANT_ID,
          code:              kullanici.birim_kodu!,
          name:              `${kullanici.tenant} · ${kullanici.birim_kodu}`,
          sector:            omniSektor,
          building_age:      new Date().getFullYear() - yil,
          floor_count:       parseInt(tesis.kat_adeti) || 3,
          seismic_zone:      1,
          construction_type: tesis.yapi_tipi,
          soil_class:        'ZD',
          employee_count:    10,
        })
        facilityId = created.id
      }

      // HFE-360 → Railway payload dönüşümü
      const payload = buildRailwayPayload(
        facilityId!, puanlar, tesis, hfe, sektor,
        kullanici.birim_kodu!, kullanici.tenant,
      )

      // Railway HFER-720 assessment çalıştır
      const sonuc = await createAssessment(payload)
      setAssessmentSonucu(sonuc)
      setGonderildi(true)
    } catch (err) {
      alert('Railway API hatası: ' + (err as Error).message)
    } finally {
      setGonderiyor(false)
    }
  }

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    .card{background:white;border-radius:16px;border:1px solid #E5E3E1;padding:20px}
    .fl{font-size:10px;font-weight:700;color:#9CA3AF;letter-spacing:.07em;text-transform:uppercase;display:block;margin-bottom:5px}
    .fg{margin-bottom:12px}
    .inp{width:100%;border:1px solid #E5E3E1;border-radius:10px;padding:9px 12px;font-size:13px;font-family:'DM Sans',sans-serif;color:#374151;background:white;outline:none;transition:all .15s}
    .inp:focus{border-color:${TEAL};box-shadow:0 0 0 3px rgba(0,155,141,.1)}
    .chk{width:16px;height:16px;border-radius:4px;border:2px solid #CBD5E1;cursor:pointer;appearance:none;-webkit-appearance:none;flex-shrink:0;transition:all .15s}
    .chk:checked{background:${TEAL};border-color:${TEAL}}
    .chk:checked::after{content:'✓';display:block;color:white;font-size:10px;font-weight:700;text-align:center;line-height:1.3}
    .sek-h{font-size:11px;font-weight:700;color:${NAVY};padding-bottom:8px;border-bottom:2px solid ${TEAL};margin-bottom:14px;text-transform:uppercase;letter-spacing:.07em;display:flex;align-items:center;gap:8px}
    .num{background:${TEAL};color:white;width:20px;height:20px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0}
    .tab{display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:14px;border:2px solid #E5E3E1;background:white;font-family:'DM Sans',sans-serif;transition:all .2s;flex:1;text-align:left}
    .tab.aktif{border-color:${TEAL};background:rgba(0,155,141,.06)}
    .tab.tamam{border-color:#22C55E;background:#F0FFF4}
    .ank{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;flex-shrink:0}
    .g2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
    .sbox{background:#F8F6F3;border-radius:10px;padding:12px 14px;margin-bottom:12px}
    .slbl{font-size:10px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px;display:block}
    @keyframes fi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}} .fi{animation:fi .2s ease}
  `

  const Inp = ({ l, k, t='text', ph='', req=false, min, max }: {l:string;k:keyof TesisKarti;t?:string;ph?:string;req?:boolean;min?:number;max?:number}) => (
    <div className="fg" style={{margin:0}}>
      <label className="fl">{l}{req && <span style={{color:'#EF4444',marginLeft:2}}>*</span>}</label>
      <input
        type={t === 'number' ? 'number' : t === 'email' ? 'email' : t === 'date' ? 'date' : 'text'}
        className="inp"
        placeholder={ph}
        value={tesis[k] as string}
        onChange={e=>tD(k,e.target.value)}
        {...(min !== undefined ? { min } : {})}
        {...(max !== undefined ? { max } : {})}
      />
    </div>
  )
  const Sel = ({l,k,opts,req=false}:{l:string;k:keyof TesisKarti;opts:string[];req?:boolean}) => (
    <div className="fg" style={{margin:0}}>
      <label className="fl">{l}{req && <span style={{color:'#EF4444',marginLeft:2}}>*</span>}</label>
      <select className="inp" value={tesis[k] as string} onChange={e=>tD(k,e.target.value)}>
        {opts.map(o=><option key={o}>{o}</option>)}
      </select>
    </div>
  )
  const Chk = ({l,k}:{l:string;k:keyof TesisKarti}) => (
    <label style={{display:'flex',alignItems:'center',gap:8,fontSize:13,color:'#374151',cursor:'pointer',marginBottom:10}}>
      <input type="checkbox" className="chk" checked={tesis[k] as boolean} onChange={e=>tD(k,e.target.checked)} />{l}
    </label>
  )

  if (gonderildi && assessmentSonucu) {
    const s = assessmentSonucu
    const renkHex = RISK_CLASS_COLOR[s.risk_class]
    const sinifTR = RISK_CLASS_TR[s.risk_class]
    const ds = s.dimension_scores
    const sifirla = () => {
      setPuanlar({}); setTesis(TESİS_BOŞ); setTesisTamam(false)
      setAdim(1); setGonderildi(false); setAssessmentSonucu(null)
    }
    const dimRenk = (v: number) =>
      v >= 0.75 ? '#22C55E' : v >= 0.50 ? '#F59E0B' : v >= 0.30 ? '#F97316' : '#EF4444'

    return (
      <div style={{minHeight:'100vh',background:'#F8F6F3',fontFamily:"'DM Sans',sans-serif",padding:16}}>
        <style dangerouslySetInnerHTML={{__html:css}} />
        <div style={{maxWidth:560,margin:'0 auto',paddingTop:32}}>

          {/* URI Skoru kartı */}
          <div style={{background:'white',borderRadius:20,border:`2px solid ${renkHex}33`,padding:'32px 32px 24px',textAlign:'center',marginBottom:16}}>
            <div style={{fontSize:13,fontWeight:700,color:'#9CA3AF',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:12}}>
              omniRISK · URI Dayanıklılık Skoru
            </div>
            <div style={{fontSize:80,fontWeight:800,lineHeight:1,color:renkHex,marginBottom:8}}>
              {Math.round(s.uri_score)}
            </div>
            <div style={{fontSize:12,color:'#9CA3AF',marginBottom:20}}>/100</div>
            <div style={{
              display:'inline-flex',alignItems:'center',gap:8,
              background: renkHex + '15', border:`1.5px solid ${renkHex}40`,
              borderRadius:99, padding:'8px 20px',
            }}>
              <div style={{width:8,height:8,borderRadius:'50%',background:renkHex}} />
              <span style={{fontSize:14,fontWeight:700,color:renkHex}}>{sinifTR}</span>
            </div>
            <div style={{marginTop:12,fontSize:12,color:'#9CA3AF'}}>
              {kullanici?.birim_kodu} · {new Date(s.assessed_at).toLocaleDateString('tr-TR')}
            </div>
          </div>

          {/* HFE Boyut skorları */}
          <div style={{background:'white',borderRadius:16,border:'1px solid #ECEAE8',padding:'20px 24px',marginBottom:16}}>
            <p style={{fontSize:11,fontWeight:700,color:'#9CA3AF',letterSpacing:'.07em',textTransform:'uppercase',marginBottom:16}}>
              omniRISK Boyut Analizi
            </p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:12}}>
              {([
                {label:'H — Tehlike',  val:ds.h,  aciklama:'Düşük = iyi'},
                {label:'F — Kırılg.',  val:ds.f,  aciklama:'Düşük = iyi'},
                {label:'E — Kapasite', val:ds.e,  aciklama:'Yüksek = iyi'},
                {label:'R — Müdahale', val:ds.r,  aciklama:'Yüksek = iyi'},
              ] as const).map(({label,val,aciklama}) => {
                const pct = Math.round(val * 100)
                const renk = dimRenk(val)
                return (
                  <div key={label} style={{textAlign:'center'}}>
                    <div style={{fontSize:24,fontWeight:800,color:renk}}>{pct}</div>
                    <div style={{height:4,background:'#F1F0EF',borderRadius:99,margin:'6px 0'}}>
                      <div style={{height:'100%',width:`${pct}%`,background:renk,borderRadius:99}} />
                    </div>
                    <div style={{fontSize:10,fontWeight:700,color:NAVY}}>{label}</div>
                    <div style={{fontSize:9,color:'#9CA3AF'}}>{aciklama}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Öneriler */}
          {s.recommendations.length > 0 && (
            <div style={{background:'white',borderRadius:16,border:'1px solid #ECEAE8',padding:'20px 24px',marginBottom:16}}>
              <p style={{fontSize:11,fontWeight:700,color:'#9CA3AF',letterSpacing:'.07em',textTransform:'uppercase',marginBottom:14}}>
                Öncelikli İyileştirme Önerileri
              </p>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>
                {s.recommendations.slice(0, 3).map((rec, i) => {
                  const effortRenk = rec.effort === 'low' ? '#22C55E' : rec.effort === 'medium' ? '#F59E0B' : '#EF4444'
                  const effortTR = rec.effort === 'low' ? 'Kolay' : rec.effort === 'medium' ? 'Orta' : 'Zor'
                  return (
                    <div key={i} style={{display:'flex',gap:12,padding:'12px 14px',background:'#F8F6F3',borderRadius:12,border:'1px solid #ECEAE8'}}>
                      <div style={{width:24,height:24,borderRadius:'50%',background:NAVY,color:'white',fontSize:11,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                        {rec.priority}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,marginBottom:4}}>
                          <p style={{fontSize:13,fontWeight:600,color:NAVY,margin:0}}>{rec.title}</p>
                          <span style={{fontSize:10,fontWeight:600,color:effortRenk,background:effortRenk+'15',border:`1px solid ${effortRenk}40`,borderRadius:99,padding:'2px 8px',flexShrink:0}}>
                            {effortTR}
                          </span>
                        </div>
                        <p style={{fontSize:12,color:'#6B7280',margin:0,lineHeight:1.5}}>{rec.description}</p>
                        {rec.standard_ref && (
                          <p style={{fontSize:10,color:'#9CA3AF',margin:'4px 0 0',fontFamily:'monospace'}}>{rec.standard_ref}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Güven skoru + Railway notu */}
          <div style={{background:'#F0FDF4',border:'1px solid #BBFBD0',borderRadius:12,padding:'12px 16px',marginBottom:20,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <span style={{fontSize:12,color:'#166534'}}>
              ✅ <strong>Railway HFER-720</strong> değerlendirmesi tamamlandı.
            </span>
            <span style={{fontSize:11,color:'#4ADE80',fontFamily:'monospace'}}>
              güven: %{Math.round((s.confidence ?? 0.85) * 100)}
            </span>
          </div>

          <button onClick={sifirla}
            style={{width:'100%',background:TEAL,color:'white',border:'none',borderRadius:14,padding:'14px',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>
            Yeni Değerlendirme
          </button>

          <p style={{textAlign:'center',fontSize:11,color:'#D1CEC9',paddingTop:20}}>
            OMNI · Railway HFER-720 Engine · İTÜ AYM
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{minHeight:'100vh',background:'#F8F6F3',fontFamily:"'DM Sans',sans-serif"}}>
      <style dangerouslySetInnerHTML={{__html:css}} />

      {/* Üst bar */}
      <div style={{background:'white',borderBottom:'1px solid #ECEAE8',padding:'12px 20px',display:'flex',justifyContent:'space-between',alignItems:'center',position:'sticky',top:0,zIndex:10}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontWeight:800,color:NAVY,fontSize:16}}>OMNI</span>
          <span style={{color:'#D1D5DB',fontSize:13}}>·</span>
          <span style={{fontSize:13}}>{SEKTOR_IKON[sektor]}</span>
          <span style={{color:'#9CA3AF',fontSize:13}}>{SEKTOR_BIRIM_LABEL[sektor] || 'Değerlendirme'}</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:14}}>
          <span style={{fontSize:11,color:'#6B7280',fontWeight:600,background:'#F3F4F6',padding:'3px 10px',borderRadius:99}}>{kullanici?.birim_kodu}</span>
          <button onClick={oturumKapat} style={{fontSize:12,color:'#9CA3AF',border:'none',background:'none',cursor:'pointer'}}>Çıkış</button>
        </div>
      </div>

      <div style={{maxWidth:640,margin:'0 auto',padding:'20px 16px 80px'}}>

        {/* ── Sektör Bilgi Bandı (Otomatik Algılama) ─────────── */}
        <div style={{
          background:'linear-gradient(135deg,#EFF6FF,#F0FDF4)',
          border:'1px solid #BFDBFE',borderRadius:14,
          padding:'14px 18px',marginBottom:16,
          display:'flex',alignItems:'center',gap:14,
        }}>
          <div style={{fontSize:32,lineHeight:1,flexShrink:0}}>{SEKTOR_IKON[sektor]}</div>
          <div style={{flex:1,minWidth:0}}>
            <p style={{fontSize:10,fontWeight:700,color:'#2563EB',textTransform:'uppercase' as const,letterSpacing:'.08em',marginBottom:3}}>
              Sektörünüz · Otomatik Algılandı
            </p>
            <p style={{fontSize:15,fontWeight:700,color:NAVY,margin:0}}>{SEKTOR_ETIKET[sektor]}</p>
            <p style={{fontSize:11,color:'#6B7280',margin:'2px 0 0'}}>{kaynak}</p>
          </div>
          <div style={{textAlign:'right' as const,flexShrink:0}}>
            <p style={{fontSize:10,color:'#9CA3AF',marginBottom:2}}>Kurum</p>
            <p style={{fontSize:12,fontWeight:600,color:'#374151'}}>{kullanici?.tenant}</p>
          </div>
        </div>

        {/* Senaryo + Birim */}
        <div className="card" style={{marginBottom:14,display:'flex',gap:14}}>
          <div style={{flex:1}}>
            <label className="fl">Birim Kodu</label>
            <div style={{background:'#F8F6F3',border:'1px solid #E5E3E1',borderRadius:10,padding:'9px 12px',fontSize:13,fontWeight:700,color:NAVY}}>
              {kullanici?.birim_kodu||'—'}
            </div>
          </div>
          <div style={{flex:1}}>
            <label className="fl">Senaryo</label>
            <select className="inp" value={senaryo} onChange={e=>setSenaryo(e.target.value)}>
              {senaryolar.map(s=><option key={s.id}>{s.ad}</option>)}
            </select>
          </div>
        </div>

        {/* Adım sekmeleri */}
        <div style={{display:'flex',gap:10,marginBottom:20}}>
          {([
            {n:1 as const,icon:'🏢',l:'Tesis Kartı',sub:'Yapı · Sistemler · Yetkili'},
            {n:2 as const,icon:'📋',l:'Risk Değerlendirme',sub:`HFE-360 · ${toplamSoru} soru`},
          ]).map(s=>{
            const dur=s.n===adim?'aktif':(s.n===1&&tesisTamam)?'tamam':''
            const dis=s.n===2&&!tesisTamam
            return (
              <button key={s.n} className={`tab ${dur}`} style={{opacity:dis?.4:1,cursor:dis?'not-allowed':'pointer'}}
                onClick={()=>{if(!dis)setAdim(s.n)}} disabled={dis}>
                <div className="ank" style={{background:dur==='tamam'?'#22C55E':dur==='aktif'?TEAL:'#F1F0EF',color:dur?'white':'#9CA3AF',fontSize:dur==='tamam'?14:16}}>
                  {dur==='tamam'?'✓':s.icon}
                </div>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:NAVY}}>{s.l}</div>
                  <div style={{fontSize:10,color:'#9CA3AF',marginTop:1}}>{s.sub}</div>
                </div>
                {dur==='aktif'&&<div style={{marginLeft:'auto',width:7,height:7,borderRadius:'50%',background:TEAL}}/>}
              </button>
            )
          })}
        </div>

        {/* ── ADIM 1: TESİS KARTI ── */}
        {adim===1&&(
          <div className="fi">
            <div style={{background:'rgba(0,155,141,.07)',border:'1px solid rgba(0,155,141,.25)',borderRadius:12,padding:'12px 16px',marginBottom:16,fontSize:12,color:'#065F46',lineHeight:1.7}}>
              🏢 <strong>Şube Tesis Kartı</strong> — <em>Bir kez doldurulur, kalıcı kayıt oluşturur.</em> Yapısal bilgiler,
              kritik sistem envanteri ve acil iletişim bilgilerini içerir.
              <span style={{color:'#EF4444'}}> * </span>ile işaretli alanlar zorunludur.
            </div>

            {/* 0. Adres */}
            <div className="card" style={{marginBottom:14}}>
              <p className="sek-h"><span className="num">0</span> Adres & Konum</p>

              {/* A) Mahalle */}
              <div className="fg" style={{margin:'0 0 12px'}}>
                <label className="fl">Mahalle<span style={{color:'#EF4444',marginLeft:2}}>*</span></label>
                <select className="inp" value={tesis.mahalle} onChange={e => tD('mahalle', e.target.value)}>
                  <option value="">— Mahalle seçin —</option>
                  {BEYLIKDUZU_MAHALLELER.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>

              {/* B) Cadde/Sokak (aktif olur mahalle seçilince) */}
              {tesis.mahalle && (
                <div className="fg" style={{margin:'0 0 12px'}}>
                  <label className="fl">Cadde / Sokak</label>
                  <input className="inp" type="text"
                    placeholder="Cadde veya sokak adı yazın..."
                    value={tesis.cadde_sokak}
                    onChange={e => tD('cadde_sokak', e.target.value)} />
                </div>
              )}

              {/* C) Konum belirleme */}
              {tesis.mahalle && (
                <div style={{marginBottom:12}}>
                  <label className="fl" style={{marginBottom:8}}>Konum Belirleme</label>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap' as const}}>
                    <button type="button" onClick={() => setKonumModu(konumModu==='harita'?null:'harita')}
                      style={{flex:1,minWidth:100,padding:'8px 10px',borderRadius:8,border:`1.5px solid ${konumModu==='harita'?TEAL:'#CBD5E1'}`,background:konumModu==='harita'?`${TEAL}10`:'white',color:NAVY,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>
                      🗺️ Haritadan İşaretle
                    </button>
                    <button type="button" onClick={() => {
                      if (!navigator.geolocation) return alert('Tarayıcı konum desteği yok.')
                      navigator.geolocation.getCurrentPosition(pos => {
                        const lat = pos.coords.latitude.toFixed(6)
                        const lng = pos.coords.longitude.toFixed(6)
                        tD('lat', lat); tD('lng', lng)
                        setKonumModu(null)
                      }, () => alert('Konum alınamadı.'))
                    }}
                      style={{flex:1,minWidth:100,padding:'8px 10px',borderRadius:8,border:'1.5px solid #CBD5E1',background:'white',color:NAVY,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>
                      📍 Mevcut Konumumu Kullan
                    </button>
                    <button type="button" onClick={() => setKonumModu(konumModu==='koordinat'?null:'koordinat')}
                      style={{flex:1,minWidth:100,padding:'8px 10px',borderRadius:8,border:`1.5px solid ${konumModu==='koordinat'?TEAL:'#CBD5E1'}`,background:konumModu==='koordinat'?`${TEAL}10`:'white',color:NAVY,fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>
                      🔢 Koordinat Gir
                    </button>
                  </div>

                  {/* Harita */}
                  {konumModu === 'harita' && (
                    <div style={{marginTop:10,borderRadius:10,overflow:'hidden',border:'1px solid #CBD5E1',height:300}}>
                      <LeafletMap
                        center={[40.99, 28.67]}
                        lat={tesis.lat ? parseFloat(tesis.lat) : undefined}
                        lng={tesis.lng ? parseFloat(tesis.lng) : undefined}
                        onSelect={(lat, lng) => { tD('lat', lat.toFixed(6)); tD('lng', lng.toFixed(6)) }}
                      />
                    </div>
                  )}

                  {/* Manuel koordinat */}
                  {konumModu === 'koordinat' && (
                    <div className="g2" style={{marginTop:10}}>
                      <div className="fg" style={{margin:0}}>
                        <label className="fl">Enlem (Latitude)</label>
                        <input className="inp" type="number" step="0.0001" placeholder="40.9921"
                          value={manuelLat} onChange={e => setManuelLat(e.target.value)} />
                      </div>
                      <div className="fg" style={{margin:0}}>
                        <label className="fl">Boylam (Longitude)</label>
                        <input className="inp" type="number" step="0.0001" placeholder="28.6714"
                          value={manuelLng} onChange={e => setManuelLng(e.target.value)} />
                      </div>
                      <div style={{gridColumn:'1/-1'}}>
                        <button type="button" onClick={() => {
                          if (manuelLat && manuelLng) { tD('lat', manuelLat); tD('lng', manuelLng); setKonumModu(null) }
                        }}
                          style={{padding:'7px 18px',borderRadius:8,border:'none',background:TEAL,color:'white',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>
                          Kaydet
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* D) Konum belirlendi badge */}
              {tesis.lat && tesis.lng && (
                <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'#F0FDF4',border:'1px solid #BBF7D0',borderRadius:99,padding:'5px 14px',fontSize:12,color:'#166534',fontWeight:600}}>
                  📍 Konum belirlendi: {parseFloat(tesis.lat).toFixed(4)}, {parseFloat(tesis.lng).toFixed(4)}
                </div>
              )}
            </div>

            {/* 1. Yapısal */}
            <div className="card" style={{marginBottom:14}}>
              <p className="sek-h"><span className="num">1</span> Yapısal Bilgiler</p>
              <div className="g2" style={{marginBottom:12}}>
                <Inp l="Binanın Yapım Yılı" k="yapi_yili" t="number" ph="ör. 1998" req min={1900} max={2026} />
                <Inp l="Kat Adedi" k="kat_adeti" t="number" ph="ör. 4" req min={1} max={50} />
              </div>
              <div className="g3" style={{marginBottom:12}}>
                <Sel l="Yapı Tipi" k="yapi_tipi" opts={['betonarme','çelik','prefabrik','yığma','karma']} />
                <Inp l="Kapalı Alan (m²)" k="alan_m2" t="number" ph="ör. 450" min={10} max={200000} />
                <Sel l="Mülkiyet" k="mulk_durumu" opts={['kira','mülk']} />
              </div>
              {tesis.mulk_durumu==='kira'&&<div style={{marginBottom:12}}><Inp l="Kira Bitiş Tarihi" k="kira_bitis" t="date" /></div>}
              <div className="g3" style={{marginBottom:12}}>
                <Sel l="Yapısal Güçlendirme" k="guclendirilmis" opts={['yok','kısmi','var']} />
                <Sel l="Zemin Etüdü" k="zemin_etut" opts={['yok','var']} />
                <Sel l="Yapısal Durum (1–5)" k="yapisal_durum" opts={['1 — Çok Kötü','2','3 — Orta','4','5 — Çok İyi']} />
              </div>
              <div className="g2" style={{marginBottom:12}}>
                <Sel l="Yapı Kullanım Belgesi (İskan)" k="iskan_belgesi" opts={['var','yok']} />
              </div>
              <Chk l="Bodrum Kat Mevcut" k="bodrum_var" />
              {tesis.bodrum_var&&<Sel l="Bodrum Kullanım Amacı" k="bodrum_kullanim" opts={['arşiv','depo','kasa','teknik alan','karma','yok']} />}
            </div>

            {/* 2. Kritik Sistem */}
            <div className="card" style={{marginBottom:14}}>
              <p className="sek-h"><span className="num">2</span> Kritik Sistem Envanteri</p>

              <div className="sbox">
                <span className="slbl">ATM & Kasa</span>
                <div className="g3">
                  <Inp l="İç ATM Sayısı" k="atm_sayisi" t="number" ph="0" min={0} max={50} />
                  <Inp l="Dış ATM Sayısı" k="atm_dis_sayisi" t="number" ph="0" min={0} max={50} />
                  <Sel l="Kasa Tipi" k="kasa_tipi" opts={['kasa odası','çelik kasa','yok']} />
                </div>
              </div>

              <div className="sbox">
                <span className="slbl">Enerji & Yedekleme</span>
                <div className="g2">
                  <div>
                    <Chk l="Yedek Güç Jeneratörü" k="jenerator_var" />
                    {tesis.jenerator_var&&<div style={{marginTop:-4}}><Inp l="Kapasite (kW)" k="jenerator_kw" t="number" ph="ör. 50" min={1} max={5000} /></div>}
                  </div>
                  <div>
                    <Chk l="UPS Sistemi" k="ups_var" />
                    {tesis.ups_var&&<div style={{marginTop:-4}}><Inp l="Özerk Süre (dk)" k="ups_dakika" t="number" ph="ör. 30" min={1} max={1440} /></div>}
                  </div>
                </div>
                <Chk l="Sismik Erken Uyarı Sistemi" k="erken_uyari" />
              </div>

              <div className="sbox">
                <span className="slbl">Yangın & Güvenlik</span>
                <Sel l="Yangın Önleme Sistemi" k="yangin_sistemi" opts={['sprinkler + algılama','sprinkler','algılama','yok']} />
                <div style={{marginTop:8,display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
                  <div>
                    <Chk l="Güvenlik Kamera" k="guvenlik_kamera" />
                    {tesis.guvenlik_kamera&&<Inp l="Kayıt Süresi (gün)" k="kamera_kayit_gun" t="number" ph="30" min={1} max={365} />}
                  </div>
                </div>
              </div>

              <Chk l="Bina / Tesis Sigortası Var" k="sigorta_var" />
              {tesis.sigorta_var&&<Inp l="Sigorta Şirketi" k="sigorta_sirket" ph="ör. Anadolu Sigorta" />}
            </div>

            {/* 3. Yetkili */}
            <div className="card" style={{marginBottom:14}}>
              <p className="sek-h"><span className="num">3</span> Yetkili Kişi & Acil İletişim</p>
              <div className="g2" style={{marginBottom:12}}>
                <Inp l="Şube Müdürü" k="sube_muduru" req />
                <Inp l="Müdür Tel" k="mudur_tel" ph="05xx xxx xx xx" req />
                <Inp l="Müdür E-posta" k="mudur_email" t="email" ph="ad@akbank.com" />
                <Inp l="KEP Adresi" k="kep_adresi" ph="akbank.sube@hs01.kep.tr" />
              </div>
              <div style={{background:'#FFFBF5',border:`1px solid #FDE68A`,borderLeft:`3px solid ${AMBER}`,borderRadius:10,padding:'12px 14px',marginBottom:12}}>
                <span className="slbl" style={{color:'#92400E'}}>⚡ 2. Acil Yetkili (Müdür ulaşılamazsa)</span>
                <div className="g2">
                  <Inp l="Ad Soyad / Unvan" k="acil_yetkili" ph="ör. Yönetmen" />
                  <Inp l="Cep Telefonu" k="acil_yetkili_tel" ph="05xx xxx xx xx" />
                </div>
              </div>
              <div className="g2">
                <Inp l="Güvenlik Şirketi" k="guvenlik_sirket" ph="ör. G4S" />
                <Inp l="Güvenlik Acil Hattı" k="guvenlik_tel" />
                <Inp l="En Yakın Hastane" k="en_yakin_hastane" ph="isim / mesafe" />
                <Inp l="En Yakın İtfaiye" k="en_yakin_itfaiye" ph="isim / mesafe" />
              </div>
            </div>

            {/* 4. Ek */}
            <div className="card" style={{marginBottom:16}}>
              <p className="sek-h"><span className="num">4</span> Ek Bilgiler</p>
              <div className="fg">
                <label className="fl">Komşu Binalardan Kaynaklı Riskler</label>
                <textarea className="inp" rows={2} placeholder="ör. Sağ komşu 1968 yığma yapı — deprem riski" value={tesis.komsu_risk} onChange={e=>tD('komsu_risk',e.target.value)} style={{resize:'vertical'}} />
              </div>
              <div className="fg" style={{margin:0}}>
                <label className="fl">Ek Notlar / Diğer Teknik Bilgiler</label>
                <textarea className="inp" rows={2} value={tesis.ek_not} onChange={e=>tD('ek_not',e.target.value)} style={{resize:'vertical'}} />
              </div>
            </div>

            {/* Doluluk göstergesi */}
            {(()=>{
              const dolu=[tesis.yapi_yili,tesis.yapi_tipi,tesis.kat_adeti,tesis.alan_m2,tesis.guclendirilmis,tesis.iskan_belgesi,tesis.mulk_durumu,tesis.atm_sayisi,tesis.yangin_sistemi,tesis.sube_muduru,tesis.mudur_tel,tesis.mudur_email,tesis.kep_adresi,tesis.acil_yetkili,tesis.guvenlik_sirket].filter(Boolean).length
              const pct=Math.round(dolu/15*100)
              return (
                <div style={{marginBottom:16,background:'white',borderRadius:12,border:'1px solid #E5E3E1',padding:'12px 16px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                    <span style={{fontSize:11,color:'#9CA3AF',fontWeight:600}}>Tesis Kartı Doluluk Oranı</span>
                    <span style={{fontSize:12,fontWeight:700,color:pct===100?'#22C55E':pct>50?TEAL:AMBER}}>{dolu}/15 alan · %{pct}</span>
                  </div>
                  <div style={{height:5,background:'#F1F0EF',borderRadius:99,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${pct}%`,background:pct===100?'#22C55E':TEAL,borderRadius:99,transition:'width .3s'}} />
                  </div>
                </div>
              )
            })()}

            <div style={{display:'flex',gap:10}}>
              <button disabled={!tesisZorunlu} onClick={()=>{setTesisTamam(true);setAdim(2)}}
                style={{flex:1,background:tesisZorunlu?TEAL:'#E5E3E1',color:tesisZorunlu?'white':'#9CA3AF',border:'none',borderRadius:14,padding:'14px 20px',fontSize:14,fontWeight:700,cursor:tesisZorunlu?'pointer':'not-allowed',fontFamily:"'DM Sans',sans-serif",transition:'all .15s',lineHeight:1.4}}>
                {tesisZorunlu?'→ Risk Değerlendirmesine Geç':'⚠ Zorunlu alanları doldurun (yapım yılı, kat, müdür adı & tel)'}
              </button>
              <button onClick={()=>formuGonder('taslak')} disabled={gonderiyor}
                style={{padding:'14px 16px',background:'#F1F0EF',color:'#6B7280',border:'none',borderRadius:14,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>
                Taslak
              </button>
            </div>
            {tesisTamam&&(
              <div style={{marginTop:12,background:'#F0FFF4',border:'1px solid #BBFBD0',borderRadius:12,padding:'10px 16px',fontSize:12,color:'#166534',display:'flex',alignItems:'center',gap:8}}>
                ✅ <strong>Tesis Kartı kaydedildi.</strong> Adım 2'de risk sorularını tamamlayıp gönderin.
              </div>
            )}
          </div>
        )}

        {/* ── ADIM 2: HFE-360 ── */}
        {adim===2&&(
          <div className="fi">
            {bolgeRisk&&(
              <div style={{borderRadius:14,border:'1px solid',padding:16,marginBottom:14,
                background:bolgeRisk.seviye==='kritik'?'#FEF2F2':bolgeRisk.seviye==='yüksek'?'#FFFBEB':'#EFF6FF',
                borderColor:bolgeRisk.seviye==='kritik'?'#FECACA':bolgeRisk.seviye==='yüksek'?'#FDE68A':'#BFDBFE'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:10}}>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6}}>
                      <span style={{fontSize:11,fontWeight:700,textTransform:'uppercase' as const,letterSpacing:'.06em',color:bolgeRisk.seviye==='kritik'?'#DC2626':bolgeRisk.seviye==='yüksek'?'#D97706':'#2563EB'}}>
                        📍 Bölge Risk Profili
                      </span>
                      <span style={{fontSize:10,padding:'2px 8px',borderRadius:99,fontWeight:700,
                        background:bolgeRisk.seviye==='kritik'?'#FEE2E2':bolgeRisk.seviye==='yüksek'?'#FEF3C7':'#DBEAFE',
                        color:bolgeRisk.seviye==='kritik'?'#991B1B':bolgeRisk.seviye==='yüksek'?'#92400E':'#1E40AF'}}>
                        {bolgeRisk.seviye.toUpperCase()}
                      </span>
                    </div>
                    <p style={{fontSize:12,color:'#4B5563',marginBottom:6,lineHeight:1.6}}>{bolgeRisk.ozet}</p>
                    {bolgeRisk.uyarilar.map((u,i)=>(
                      <div key={i} style={{fontSize:11,color:'#6B7280',display:'flex',gap:6,marginBottom:4}}>
                        <span style={{color:AMBER,flexShrink:0}}>⚠</span>{u}
                      </div>
                    ))}
                  </div>
                  {Object.keys(bolgeOneri).length>0&&(
                    <button onClick={()=>setOneriGoster(true)}
                      style={{flexShrink:0,fontSize:11,fontWeight:600,padding:'8px 14px',borderRadius:10,background:'white',border:'1px solid #E5E3E1',color:'#374151',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",whiteSpace:'nowrap' as const}}>
                      Bölge Öneri Uygula →
                    </button>
                  )}
                </div>
              </div>
            )}

            {oneriGoster&&(
              <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:50,padding:16}}>
                <div style={{background:'white',borderRadius:20,padding:24,maxWidth:380,width:'100%'}}>
                  <h3 style={{fontWeight:700,color:NAVY,marginBottom:8}}>Bölge Profilini Uygula</h3>
                  <p style={{fontSize:13,color:'#6B7280',marginBottom:12,lineHeight:1.6}}>
                    {IL_PROFIL[ilKodu]?.il} ili için {Object.keys(bolgeOneri).length} soru bölge profiline göre doldurulacak.
                  </p>
                  <div style={{background:'#FFFBEB',border:'1px solid #FDE68A',borderRadius:10,padding:12,marginBottom:16}}>
                    <p style={{fontSize:11,color:'#92400E',fontWeight:500}}>⚠ AFAD haritası ve TMMOB zemin sınıflarına dayanmaktadır. Gerçek zemin etüdü ile doğrulayınız.</p>
                  </div>
                  <div style={{display:'flex',gap:10}}>
                    <button onClick={()=>setOneriGoster(false)} style={{flex:1,padding:10,borderRadius:10,border:'1px solid #E5E3E1',fontSize:13,color:'#6B7280',cursor:'pointer',background:'white',fontFamily:"'DM Sans',sans-serif"}}>İptal</button>
                    <button onClick={bolgeOneriUygula} style={{flex:1,padding:10,borderRadius:10,background:NAVY,color:'white',border:'none',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>Uygula</button>
                  </div>
                </div>
              </div>
            )}

            <div className="card" style={{marginBottom:16}}>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:8}}>
                <span style={{color:'#6B7280'}}>Tamamlanma</span>
                <span style={{fontWeight:600,color:NAVY}}>{cevaplanan}/{toplamSoru} soru <span style={{color:TEAL}}>%{yuzde}</span></span>
              </div>
              <div style={{fontSize:10,color:'#9CA3AF',marginBottom:6}}>{kaynak}</div>
              <div style={{height:6,background:'#F1F0EF',borderRadius:99,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${yuzde}%`,background:yuzde===100?'#22C55E':TEAL,borderRadius:99,transition:'width .3s'}} />
              </div>
            </div>

            {BOLUMLER.map((bolum,bi)=>{
              const bs=sorular.filter(s=>s.bolum===bolum && !s.kod.startsWith('HRO'))
              const bc=bs.filter(s=>puanlar[s.kod]!==undefined).length
              const isHifyea = sektor === 'uretim'
              const bT=isHifyea
                ? ['BÖLÜM 1 — TEHLİKE (H)','BÖLÜM 2 — SAVUNMASIZLIK / Maruziyet (F×E)','BÖLÜM 3 — YÖNETİLEBİLİRLİK / Kapasite (C)'][bi]
                : ['Tehlike Değerlendirmesi','Kırılganlık Değerlendirmesi','Kapasite Değerlendirmesi'][bi]
              const bA=isHifyea
                ? ['Dış tehlike kaynaklarını ve tesisin maruz kaldığı risk yoğunluğunu değerlendirin.','İç yapısal kırılganlıkları ve tehlikeye maruz kalma düzeyini değerlendirin.','Tesisin hazırlık, müdahale ve iş sürekliliği kapasitesini değerlendirin.'][bi]
                : ['Birimin maruz kaldığı dış tehlikeleri değerlendirin.','Birimin iç yapısal zayıflıklarını değerlendirin.','Birimin hazırlık ve müdahale kapasitesini değerlendirin.'][bi]
              return (
                <div key={bolum} style={{marginBottom:24}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                    <div>
                      <h2 style={{fontSize:14,fontWeight:700,color:NAVY}}>{bT}</h2>
                      <p style={{fontSize:11,color:'#9CA3AF',marginTop:2}}>{bA}</p>
                    </div>
                    <span style={{fontSize:11,color:'#9CA3AF',background:'#F1F0EF',padding:'4px 10px',borderRadius:99,flexShrink:0}}>{bc}/{bs.length}</span>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:10}}>
                    {bs.map((soru,idx)=>{
                      const sel=puanlar[soru.kod]
                      return (
                        <div key={soru.kod} style={{borderRadius:16,border:`1px solid ${sel!==undefined?'#A7F3D0':'#E5E3E1'}`,padding:16,background:sel!==undefined?'#F0FDFA':'white',transition:'all .15s'}}>
                          <p style={{fontSize:13,fontWeight:500,color:'#374151',marginBottom:12,lineHeight:1.55}}>
                            {bi===0?idx+1:bi===1?SORULAR.filter(s=>s.bolum==='TEHLİKE').length+idx+1:SORULAR.filter(s=>s.bolum!=='KAPASİTE').length+idx+1}. {soru.soru}
                          </p>
                          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                            {[0,1,2,3].map(p=>(
                              <button key={p} onClick={()=>setPuanlar(prev=>({...prev,[soru.kod]:p}))}
                                style={{fontSize:12,padding:'10px 12px',borderRadius:12,border:`1px solid ${sel===p?TEAL:'#E5E3E1'}`,background:sel===p?TEAL:'white',color:sel===p?'white':'#4B5563',cursor:'pointer',textAlign:'left',lineHeight:1.4,fontFamily:"'DM Sans',sans-serif",fontWeight:sel===p?600:400,transition:'all .15s'}}>
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

            {/* ── HRO BÖLÜMÜ ──────────────────────────────────── */}
            <div style={{marginBottom:24}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                <div>
                  <h2 style={{fontSize:14,fontWeight:700,color:NAVY}}>HRO Değerlendirmesi</h2>
                  <p style={{fontSize:11,color:'#9CA3AF',marginTop:2}}>Yüksek Güvenilirlik Organizasyonu olgunluk düzeyini değerlendirin.</p>
                </div>
                <span style={{fontSize:11,color:'#9CA3AF',background:'#F1F0EF',padding:'4px 10px',borderRadius:99,flexShrink:0}}>
                  {Object.keys(hroYanitlar).length}/5
                </span>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:10}}>

                {/* Q_HRO_1 — Near Miss sayısı */}
                <div style={{borderRadius:16,border:`1px solid ${hroYanitlar['Q_HRO_1']!==undefined?'#A7F3D0':'#E5E3E1'}`,padding:16,background:hroYanitlar['Q_HRO_1']!==undefined?'#F0FDFA':'white',transition:'all .15s'}}>
                  <p style={{fontSize:13,fontWeight:500,color:'#374151',marginBottom:10,lineHeight:1.55}}>
                    HRO-1. Son 12 ayda kaç &quot;Ramak Kala&quot; (Near Miss) olayı resmi olarak raporlandı?
                  </p>
                  <input
                    type="number" min={0} max={50}
                    value={hroYanitlar['Q_HRO_1'] ?? ''}
                    onChange={e => hroSet('Q_HRO_1', Math.min(50, Math.max(0, Number(e.target.value))))}
                    placeholder="0 – 50 arası sayı giriniz"
                    style={{width:'100%',boxSizing:'border-box',padding:'10px 12px',borderRadius:12,border:`1px solid ${hroYanitlar['Q_HRO_1']!==undefined?TEAL:'#E5E3E1'}`,fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:'none'}}
                  />
                </div>

                {/* Q_HRO_2 — Uyarı iletim süresi */}
                <div style={{borderRadius:16,border:`1px solid ${hroYanitlar['Q_HRO_2']!==undefined?'#A7F3D0':'#E5E3E1'}`,padding:16,background:hroYanitlar['Q_HRO_2']!==undefined?'#F0FDFA':'white',transition:'all .15s'}}>
                  <p style={{fontSize:13,fontWeight:500,color:'#374151',marginBottom:10,lineHeight:1.55}}>
                    HRO-2. Güvenlik veya operasyon uyarıları üst yönetime kaç saat içinde iletiliyor?
                  </p>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                    {['<1 saat','1-4 saat','4-24 saat','>24 saat'].map(opt=>(
                      <button key={opt} onClick={()=>hroSet('Q_HRO_2',opt)}
                        style={{fontSize:12,padding:'10px 12px',borderRadius:12,border:`1px solid ${hroYanitlar['Q_HRO_2']===opt?TEAL:'#E5E3E1'}`,background:hroYanitlar['Q_HRO_2']===opt?TEAL:'white',color:hroYanitlar['Q_HRO_2']===opt?'white':'#4B5563',cursor:'pointer',textAlign:'left',lineHeight:1.4,fontFamily:"'DM Sans',sans-serif",fontWeight:hroYanitlar['Q_HRO_2']===opt?600:400,transition:'all .15s'}}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q_HRO_3 — Otonom karar */}
                <div style={{borderRadius:16,border:`1px solid ${hroYanitlar['Q_HRO_3']!==undefined?'#A7F3D0':'#E5E3E1'}`,padding:16,background:hroYanitlar['Q_HRO_3']!==undefined?'#F0FDFA':'white',transition:'all .15s'}}>
                  <p style={{fontSize:13,fontWeight:500,color:'#374151',marginBottom:10,lineHeight:1.55}}>
                    HRO-3. Kriz anında saha ekibi merkezi onay beklemeden acil karar alabiliyor mu?
                  </p>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                    {['Evet','Hayır','Kısmen'].map(opt=>(
                      <button key={opt} onClick={()=>hroSet('Q_HRO_3',opt)}
                        style={{fontSize:12,padding:'10px 12px',borderRadius:12,border:`1px solid ${hroYanitlar['Q_HRO_3']===opt?TEAL:'#E5E3E1'}`,background:hroYanitlar['Q_HRO_3']===opt?TEAL:'white',color:hroYanitlar['Q_HRO_3']===opt?'white':'#4B5563',cursor:'pointer',textAlign:'center',lineHeight:1.4,fontFamily:"'DM Sans',sans-serif",fontWeight:hroYanitlar['Q_HRO_3']===opt?600:400,transition:'all .15s'}}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q_HRO_4 — Başarısızlığa takıntı (1-5 skala) */}
                <div style={{borderRadius:16,border:`1px solid ${hroYanitlar['Q_HRO_4']!==undefined?'#A7F3D0':'#E5E3E1'}`,padding:16,background:hroYanitlar['Q_HRO_4']!==undefined?'#F0FDFA':'white',transition:'all .15s'}}>
                  <p style={{fontSize:13,fontWeight:500,color:'#374151',marginBottom:4,lineHeight:1.55}}>
                    HRO-4. Tesis personeli &quot;hiçbir şey olmuyor çünkü sistemimiz güvenli&quot; varsayımından kaçınıyor mu?
                  </p>
                  <p style={{fontSize:11,color:'#9CA3AF',marginBottom:10}}>1 = Hiç kaçınmıyor (yüksek risk) · 5 = Tam farkındalık (HRO başarısızlığa takıntı ilkesi)</p>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:8}}>
                    {[1,2,3,4,5].map(n=>(
                      <button key={n} onClick={()=>hroSet('Q_HRO_4',n)}
                        style={{fontSize:13,padding:'10px 0',borderRadius:12,border:`1px solid ${hroYanitlar['Q_HRO_4']===n?TEAL:'#E5E3E1'}`,background:hroYanitlar['Q_HRO_4']===n?TEAL:'white',color:hroYanitlar['Q_HRO_4']===n?'white':'#4B5563',cursor:'pointer',textAlign:'center',fontFamily:"'DM Sans',sans-serif",fontWeight:hroYanitlar['Q_HRO_4']===n?700:400,transition:'all .15s'}}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q_HRO_5 — Anormallik kaydı */}
                <div style={{borderRadius:16,border:`1px solid ${hroYanitlar['Q_HRO_5']!==undefined?'#A7F3D0':'#E5E3E1'}`,padding:16,background:hroYanitlar['Q_HRO_5']!==undefined?'#F0FDFA':'white',transition:'all .15s'}}>
                  <p style={{fontSize:13,fontWeight:500,color:'#374151',marginBottom:10,lineHeight:1.55}}>
                    HRO-5. Operasyonel anormallikler (küçük de olsa) kayıt altına alınıp analiz ediliyor mu?
                  </p>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8}}>
                    {['Evet','Hayır','Kısmen'].map(opt=>(
                      <button key={opt} onClick={()=>hroSet('Q_HRO_5',opt)}
                        style={{fontSize:12,padding:'10px 12px',borderRadius:12,border:`1px solid ${hroYanitlar['Q_HRO_5']===opt?TEAL:'#E5E3E1'}`,background:hroYanitlar['Q_HRO_5']===opt?TEAL:'white',color:hroYanitlar['Q_HRO_5']===opt?'white':'#4B5563',cursor:'pointer',textAlign:'center',lineHeight:1.4,fontFamily:"'DM Sans',sans-serif",fontWeight:hroYanitlar['Q_HRO_5']===opt?600:400,transition:'all .15s'}}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            <div style={{display:'flex',gap:10,paddingTop:8}}>
              <button onClick={()=>formuGonder('gonderildi')} disabled={gonderiyor||cevaplanan===0}
                style={{flex:1,background:cevaplanan===0?'#E5E3E1':TEAL,color:cevaplanan===0?'#9CA3AF':'white',border:'none',borderRadius:14,padding:'14px',fontSize:14,fontWeight:700,cursor:cevaplanan===0?'not-allowed':'pointer',fontFamily:"'DM Sans',sans-serif",transition:'all .15s'}}>
                {gonderiyor?'Gönderiliyor...':
                 `✓ Değerlendirmeyi Gönder${yuzde<100?` (%${yuzde} tamamlandı)`:''}`}
              </button>
              <button onClick={()=>formuGonder('taslak')} disabled={gonderiyor}
                style={{padding:'14px 16px',background:'#F1F0EF',color:'#6B7280',border:'none',borderRadius:14,fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>
                Taslak
              </button>
              <button onClick={()=>setAdim(1)}
                style={{padding:'14px 14px',background:'#F1F0EF',color:'#6B7280',border:'none',borderRadius:14,fontSize:12,cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>
                ← Tesis
              </button>
            </div>
          </div>
        )}

        <p style={{textAlign:'center',fontSize:11,color:'#D1CEC9',paddingTop:28,paddingBottom:8}}>
          OMNI · İTÜ AYM iş birliğiyle geliştirilmiştir
        </p>
      </div>
    </div>
  )
}
