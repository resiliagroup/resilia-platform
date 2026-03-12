// ═══════════════════════════════════════════════════════════════
//  RESILIA — Bölge Risk Profili
//  İl bazında deprem, zemin, taşkın ve sanayi risk verileri
//  Kaynak: AFAD Deprem Tehlike Haritası, TMMOB zemin sınıfları
// ═══════════════════════════════════════════════════════════════

export type BolgeRisk = {
  il: string
  il_kodu: string
  deprem_zone: 1 | 2 | 3 | 4 | 5   // 1=çok yüksek, 5=çok düşük
  zemin_sinif: 'ZA' | 'ZB' | 'ZC' | 'ZD' | 'ZE'  // TBDY 2018
  fay_mesafe_km: number             // en yakın aktif faya mesafe
  taskin_riski: 'yok' | 'dusuk' | 'orta' | 'yuksek'
  sanayi_yogunluk: 'dusuk' | 'orta' | 'yuksek'
  osb_sayisi: number
  bolge: 'marmara' | 'ege' | 'akdeniz' | 'ic_anadolu' | 'karadeniz' | 'dogu_anadolu' | 'guneydogu'
}

// Soru kodu → önerilen puan (0-3)
export type OnerilenPuanlar = Record<string, number>

export const IL_PROFIL: Record<string, BolgeRisk> = {
  // MARMARA BÖLGESİ
  '34': { il:'İstanbul',  il_kodu:'34', deprem_zone:1, zemin_sinif:'ZD', fay_mesafe_km:5,   taskin_riski:'orta',   sanayi_yogunluk:'yuksek', osb_sayisi:12, bolge:'marmara' },
  '41': { il:'Kocaeli',   il_kodu:'41', deprem_zone:1, zemin_sinif:'ZC', fay_mesafe_km:3,   taskin_riski:'orta',   sanayi_yogunluk:'yuksek', osb_sayisi:8,  bolge:'marmara' },
  '16': { il:'Bursa',     il_kodu:'16', deprem_zone:2, zemin_sinif:'ZC', fay_mesafe_km:15,  taskin_riski:'dusuk',  sanayi_yogunluk:'yuksek', osb_sayisi:6,  bolge:'marmara' },
  '77': { il:'Yalova',    il_kodu:'77', deprem_zone:1, zemin_sinif:'ZD', fay_mesafe_km:8,   taskin_riski:'orta',   sanayi_yogunluk:'orta',   osb_sayisi:2,  bolge:'marmara' },
  '59': { il:'Tekirdağ',  il_kodu:'59', deprem_zone:2, zemin_sinif:'ZC', fay_mesafe_km:20,  taskin_riski:'dusuk',  sanayi_yogunluk:'yuksek', osb_sayisi:5,  bolge:'marmara' },
  '22': { il:'Edirne',    il_kodu:'22', deprem_zone:3, zemin_sinif:'ZB', fay_mesafe_km:45,  taskin_riski:'orta',   sanayi_yogunluk:'dusuk',  osb_sayisi:1,  bolge:'marmara' },
  '39': { il:'Kırklareli',il_kodu:'39', deprem_zone:3, zemin_sinif:'ZB', fay_mesafe_km:40,  taskin_riski:'dusuk',  sanayi_yogunluk:'dusuk',  osb_sayisi:1,  bolge:'marmara' },
  '10': { il:'Balıkesir', il_kodu:'10', deprem_zone:2, zemin_sinif:'ZC', fay_mesafe_km:25,  taskin_riski:'dusuk',  sanayi_yogunluk:'orta',   osb_sayisi:3,  bolge:'marmara' },
  '17': { il:'Çanakkale', il_kodu:'17', deprem_zone:2, zemin_sinif:'ZC', fay_mesafe_km:18,  taskin_riski:'dusuk',  sanayi_yogunluk:'dusuk',  osb_sayisi:2,  bolge:'marmara' },
  '54': { il:'Sakarya',   il_kodu:'54', deprem_zone:1, zemin_sinif:'ZD', fay_mesafe_km:10,  taskin_riski:'yuksek', sanayi_yogunluk:'yuksek', osb_sayisi:5,  bolge:'marmara' },
  '11': { il:'Bilecik',   il_kodu:'11', deprem_zone:2, zemin_sinif:'ZC', fay_mesafe_km:22,  taskin_riski:'dusuk',  sanayi_yogunluk:'orta',   osb_sayisi:2,  bolge:'marmara' },
  '81': { il:'Düzce',     il_kodu:'81', deprem_zone:1, zemin_sinif:'ZE', fay_mesafe_km:4,   taskin_riski:'yuksek', sanayi_yogunluk:'orta',   osb_sayisi:2,  bolge:'marmara' },
  // EGE
  '35': { il:'İzmir',     il_kodu:'35', deprem_zone:1, zemin_sinif:'ZD', fay_mesafe_km:8,   taskin_riski:'orta',   sanayi_yogunluk:'yuksek', osb_sayisi:7,  bolge:'ege' },
  '09': { il:'Aydın',     il_kodu:'09', deprem_zone:2, zemin_sinif:'ZC', fay_mesafe_km:20,  taskin_riski:'orta',   sanayi_yogunluk:'orta',   osb_sayisi:3,  bolge:'ege' },
  '48': { il:'Muğla',     il_kodu:'48', deprem_zone:2, zemin_sinif:'ZC', fay_mesafe_km:25,  taskin_riski:'dusuk',  sanayi_yogunluk:'dusuk',  osb_sayisi:2,  bolge:'ege' },
  '45': { il:'Manisa',    il_kodu:'45', deprem_zone:2, zemin_sinif:'ZC', fay_mesafe_km:18,  taskin_riski:'orta',   sanayi_yogunluk:'yuksek', osb_sayisi:4,  bolge:'ege' },
  // AKDENİZ
  '31': { il:'Hatay',     il_kodu:'31', deprem_zone:1, zemin_sinif:'ZD', fay_mesafe_km:5,   taskin_riski:'orta',   sanayi_yogunluk:'orta',   osb_sayisi:3,  bolge:'akdeniz' },
  '46': { il:'K.Maraş',   il_kodu:'46', deprem_zone:1, zemin_sinif:'ZD', fay_mesafe_km:6,   taskin_riski:'dusuk',  sanayi_yogunluk:'orta',   osb_sayisi:2,  bolge:'akdeniz' },
  '07': { il:'Antalya',   il_kodu:'07', deprem_zone:2, zemin_sinif:'ZC', fay_mesafe_km:30,  taskin_riski:'dusuk',  sanayi_yogunluk:'orta',   osb_sayisi:3,  bolge:'akdeniz' },
  // İÇ ANADOLU
  '06': { il:'Ankara',    il_kodu:'06', deprem_zone:3, zemin_sinif:'ZB', fay_mesafe_km:50,  taskin_riski:'dusuk',  sanayi_yogunluk:'yuksek', osb_sayisi:8,  bolge:'ic_anadolu' },
  '42': { il:'Konya',     il_kodu:'42', deprem_zone:4, zemin_sinif:'ZB', fay_mesafe_km:80,  taskin_riski:'yok',    sanayi_yogunluk:'orta',   osb_sayisi:4,  bolge:'ic_anadolu' },
  '38': { il:'Kayseri',   il_kodu:'38', deprem_zone:3, zemin_sinif:'ZC', fay_mesafe_km:40,  taskin_riski:'yok',    sanayi_yogunluk:'yuksek', osb_sayisi:5,  bolge:'ic_anadolu' },
  '26': { il:'Eskişehir', il_kodu:'26', deprem_zone:3, zemin_sinif:'ZB', fay_mesafe_km:35,  taskin_riski:'dusuk',  sanayi_yogunluk:'orta',   osb_sayisi:3,  bolge:'ic_anadolu' },
  // DOĞU ANADOLU
  '23': { il:'Elazığ',    il_kodu:'23', deprem_zone:1, zemin_sinif:'ZC', fay_mesafe_km:10,  taskin_riski:'dusuk',  sanayi_yogunluk:'dusuk',  osb_sayisi:1,  bolge:'dogu_anadolu' },
  '25': { il:'Erzurum',   il_kodu:'25', deprem_zone:1, zemin_sinif:'ZC', fay_mesafe_km:15,  taskin_riski:'dusuk',  sanayi_yogunluk:'dusuk',  osb_sayisi:1,  bolge:'dogu_anadolu' },
  // KARADENİZ
  '61': { il:'Trabzon',   il_kodu:'61', deprem_zone:2, zemin_sinif:'ZC', fay_mesafe_km:35,  taskin_riski:'yuksek', sanayi_yogunluk:'dusuk',  osb_sayisi:1,  bolge:'karadeniz' },
  '55': { il:'Samsun',    il_kodu:'55', deprem_zone:2, zemin_sinif:'ZC', fay_mesafe_km:40,  taskin_riski:'orta',   sanayi_yogunluk:'orta',   osb_sayisi:2,  bolge:'karadeniz' },
  // GÜNEYDOĞU
  '27': { il:'Gaziantep', il_kodu:'27', deprem_zone:2, zemin_sinif:'ZC', fay_mesafe_km:20,  taskin_riski:'dusuk',  sanayi_yogunluk:'yuksek', osb_sayisi:4,  bolge:'guneydogu' },
  '21': { il:'Diyarbakır',il_kodu:'21', deprem_zone:2, zemin_sinif:'ZC', fay_mesafe_km:25,  taskin_riski:'dusuk',  sanayi_yogunluk:'orta',   osb_sayisi:2,  bolge:'guneydogu' },
  '63': { il:'Şanlıurfa', il_kodu:'63', deprem_zone:2, zemin_sinif:'ZB', fay_mesafe_km:30,  taskin_riski:'dusuk',  sanayi_yogunluk:'orta',   osb_sayisi:2,  bolge:'guneydogu' },
}

// ─── Bölge profiline göre soru ön doldurma ──────────────────────
export function bolgedenOneriHesapla(il_kodu: string): OnerilenPuanlar {
  const profil = IL_PROFIL[il_kodu]
  if (!profil) return {}

  const p: OnerilenPuanlar = {}
  const z = profil.deprem_zone  // 1=çok yüksek risk, 5=çok düşük

  // ── H SORULARI ──────────────────────────────────────────────

  // H1 — Deprem tekerrür sıklığı
  // zone 1 → sık (3), zone 2 → mümkün (2), 3 → seyrek (1), 4-5 → nadir (0)
  p['H1'] = z === 1 ? 3 : z === 2 ? 2 : z === 3 ? 1 : 0

  // H2 — Fiziksel etki büyüklüğü (zone + zemin sınıfı)
  const zeminKatsayi = profil.zemin_sinif === 'ZE' ? 1 : profil.zemin_sinif === 'ZD' ? 0.5 : 0
  p['H2'] = Math.min(3, Math.round((z === 1 ? 3 : z === 2 ? 2 : 1) + zeminKatsayi))

  // H3 — Uyarı süresi (deprem = her zaman ani)
  p['H3'] = 3  // Deprem için her zaman ani

  // H4 — Etki süresi
  p['H4'] = z <= 2 ? 3 : z === 3 ? 2 : 1

  // H5 — ISG tehlike sınıfı / NACE riski (OSB yoğunluğuna göre)
  p['H6'] = profil.sanayi_yogunluk === 'yuksek' ? 3 : profil.sanayi_yogunluk === 'orta' ? 2 : 1

  // H7 — Komşu tesis riski (OSB sayısına göre)
  p['H7'] = profil.osb_sayisi >= 5 ? 2 : profil.osb_sayisi >= 2 ? 1 : 0

  // H8 — Tedarik zinciri zincirleme (Marmara = maksimum)
  p['H8'] = profil.bolge === 'marmara' ? 3 : profil.bolge === 'ege' ? 2 : 1

  // ── F SORULARI ──────────────────────────────────────────────

  // F3 — Zemin sınıfı (ZE/ZD = yüksek kırılganlık)
  p['F3'] = profil.zemin_sinif === 'ZE' ? 3 : profil.zemin_sinif === 'ZD' ? 2 : profil.zemin_sinif === 'ZC' ? 1 : 0

  // F4 — Konum riski (fay mesafesi + deprem zone)
  p['F4'] = profil.fay_mesafe_km <= 5 ? 3 : profil.fay_mesafe_km <= 15 ? 2 : profil.fay_mesafe_km <= 30 ? 1 : 0

  // F6 — Altyapı kırılganlığı (Marmara sanayi yoğunluğunda daha hassas)
  p['F6'] = profil.sanayi_yogunluk === 'yuksek' && z <= 2 ? 2 : 1

  // ── E SORULARI (bölge profiline göre minimum beklenti) ──────

  // E3 — Deprem yapısal önlemleri beklentisi (yüksek riskli bölgelerde zorunlu)
  // Öneri değil, minimum puan uyarısı — düşük dolduranlar için kırmızı uyarı
  // Bu alan form UI'da "bölge uyarısı" olarak gösterilecek

  return p
}

// ─── Bölge risk özeti metni ──────────────────────────────────────
export function bolgeRiskOzeti(il_kodu: string): {
  seviye: 'kritik' | 'yüksek' | 'orta' | 'düşük'
  ozet: string
  uyarilar: string[]
} {
  const p = IL_PROFIL[il_kodu]
  if (!p) return { seviye: 'orta', ozet: 'Bölge profili bulunamadı.', uyarilar: [] }

  const uyarilar: string[] = []
  if (p.deprem_zone === 1) uyarilar.push('1. Derece Deprem Bölgesi — TBDY 2018 uyumu zorunlu')
  if (p.fay_mesafe_km <= 10) uyarilar.push(`Aktif fay hattına ${p.fay_mesafe_km} km mesafe — sismik izolasyon değerlendirilmeli`)
  if (p.zemin_sinif === 'ZD' || p.zemin_sinif === 'ZE') uyarilar.push(`${p.zemin_sinif} zemin sınıfı — zemin etüdü ve güçlendirme kritik`)
  if (p.taskin_riski === 'yuksek') uyarilar.push('Yüksek taşkın riski — sel bariyeri ve tahliye pompası zorunlu')
  if (p.osb_sayisi >= 5) uyarilar.push(`${p.osb_sayisi} OSB bulunuyor — komşu tesis tehlike analizi yapılmalı`)

  const seviye = p.deprem_zone === 1 ? 'kritik' : p.deprem_zone === 2 ? 'yüksek' : 'orta'

  const bolgeAd: Record<string, string> = {
    marmara: 'Marmara', ege: 'Ege', akdeniz: 'Akdeniz',
    ic_anadolu: 'İç Anadolu', karadeniz: 'Karadeniz',
    dogu_anadolu: 'Doğu Anadolu', guneydogu: 'Güneydoğu Anadolu'
  }

  const ozet = `${p.il} — ${bolgeAd[p.bolge]} Bölgesi · Deprem Zonu ${p.deprem_zone} · Zemin ${p.zemin_sinif} · Fay: ${p.fay_mesafe_km}km`

  return { seviye, ozet, uyarilar }
}

export const MARMARA_ILLERI = Object.values(IL_PROFIL).filter(p => p.bolge === 'marmara').map(p => p.il_kodu)
