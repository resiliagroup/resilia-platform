// ═══════════════════════════════════════════════════
// Omniversel — Risk Kural Motoru
// ML analizinden türetilmiş kural seti
// ═══════════════════════════════════════════════════

export type RiskUyari = {
  kod: string
  seviye: 'kirmizi' | 'turuncu' | 'sari'
  baslik: string
  mesaj: string
  mevzuat: string
  aksiyon: string
  paket_oneri?: 'Pro' | 'Standart'
}

export function kural_motoru_calistir(puanlar: Record<string, number>): RiskUyari[] {
  const uyarilar: RiskUyari[] = []

  // KURAL 1 — NATECH/Siber kritik (T3 >= 5 OR T7 >= 5)
  if ((puanlar['T3'] ?? 0) >= 5 || (puanlar['T7'] ?? 0) >= 5) {
    uyarilar.push({
      kod: 'NATECH_SIBER',
      seviye: 'kirmizi',
      baslik: 'NATECH / Siber Risk Tespit Edildi',
      mesaj: 'Tesisinizde tehlikeli madde veya endüstriyel kontrol sistemi riski yüksek. Bu kombinasyon büyük kazaların %78\'inde tespit edilmektedir.',
      mevzuat: 'Büyük Endüstriyel Kazaların Önlenmesi Yönetmeliği (Seveso III)',
      aksiyon: 'RAPID-N protokolü uygulanmalı. Akademik danışman desteği alın.',
      paket_oneri: 'Pro',
    })
  }

  // KURAL 2 — AADYP eksik (Y6 <= 3)
  if ((puanlar['Y6'] ?? 10) <= 3) {
    uyarilar.push({
      kod: 'AADYP_EKSIK',
      seviye: 'kirmizi',
      baslik: 'Acil Durum Planı Eksik — Yasal Zorunluluk',
      mesaj: 'Afet ve Acil Durum Yönetim Planı bulunmuyor veya güncel değil. AFAD denetiminde idari para cezası uygulanabilir.',
      mevzuat: 'AADY 2025 Md.67-68 / 6331 İSG Kanunu Md.11',
      aksiyon: 'AFAD şablonundan ücretsiz AADYP hazırlayın. afad.gov.tr adresinden indirin.',
    })
  }

  // KURAL 3 — Yapısal risk (T1 >= 6 AND S1 >= 5)
  if ((puanlar['T1'] ?? 0) >= 6 && (puanlar['S1'] ?? 0) >= 5) {
    uyarilar.push({
      kod: 'YAPISAL_RISK',
      seviye: 'kirmizi',
      baslik: 'Yüksek Deprem + Yapısal Kırılganlık',
      mesaj: 'Deprem tehlikesi yüksek bölgede eski veya güçlendirilmemiş bina. En kritik risk kombinasyonu.',
      mevzuat: 'TBDY 2018 / 6306 Sayılı Kanun / AADY 2025 Md.11-25',
      aksiyon: '6306 kapsamında ücretsiz yapısal değerlendirme hakkınız var. İlgili bakanlığa başvurun.',
    })
  }

  // KURAL 4 — Tatbikat yok (Y22 <= 2)
  if ((puanlar['Y22'] ?? 10) <= 2) {
    uyarilar.push({
      kod: 'TATBIKAT_YOK',
      seviye: 'turuncu',
      baslik: 'Tatbikat Yapılmıyor',
      mesaj: 'AFAD Tatbikat Yönetmeliği kapsamında yılda en az 1 masabaşı tatbikat zorunlu.',
      mevzuat: 'Afet ve Acil Durum Tatbikatları Hakkında Yönetmelik Md.5 (2024)',
      aksiyon: 'İl AFAD Müdürlüğü tatbikat takvimine kayıt yaptırın. Ücretsiz.',
    })
  }

  // KURAL 5 — Enerji tek hat (S6 >= 7)
  if ((puanlar['S6'] ?? 0) >= 7) {
    uyarilar.push({
      kod: 'ENERJI_TEKHAT',
      seviye: 'turuncu',
      baslik: 'Tek Hat Enerji Bağımlılığı',
      mesaj: 'Üretim tamamen tek enerji hattına bağlı. Herhangi bir kesinti tüm üretimi durduruyor.',
      mevzuat: 'AADY 2025 Md.43-48',
      aksiyon: 'Kritik ekipman için UPS temin edin (3.000-15.000 TRY). TEDAŞ\'a çift hat başvurusu yapın.',
    })
  }

  // KURAL 6 — HRO kültürü eksik (HRO1 <= 2 AND HRO3 <= 2)
  if ((puanlar['HRO1'] ?? 10) <= 2 && (puanlar['HRO3'] ?? 10) <= 2) {
    uyarilar.push({
      kod: 'HRO_EKSIK',
      seviye: 'sari',
      baslik: 'Güvenlik Kültürü Geliştirilmeli',
      mesaj: 'Near-miss raporlama ve saha durdurma yetkisi kültürü zayıf. Büyük kazaların %89\'u önce küçük sinyaller verir.',
      mevzuat: 'ISO 45001:2018 §9.1',
      aksiyon: 'Anonim near-miss kutusu koyun ve aylık güvenlik toplantısı başlatın. Ücretsiz.',
    })
  }

  // Öncelik sırasına göre sırala
  const sira = { kirmizi: 0, turuncu: 1, sari: 2 }
  return uyarilar.sort((a, b) => sira[a.seviye] - sira[b.seviye])
}

// Paket önerisi
export function paket_oner(puanlar: Record<string, number>, tehlikeSinifi: number | null): 'Temel' | 'Standart' | 'Pro' {
  const uyarilar = kural_motoru_calistir(puanlar)
  if (uyarilar.some(u => u.paket_oneri === 'Pro')) return 'Pro'
  if (tehlikeSinifi === 1) return 'Pro'
  if (tehlikeSinifi === 2) return 'Standart'
  return 'Temel'
}
