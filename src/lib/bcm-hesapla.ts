// ═══════════════════════════════════════════════════════════════
//  OMNI Platform — BCM Skor Hesaplama Motoru
//  İTÜ AYM akademik metodolojisine dayalı H-F-E algoritması
// ═══════════════════════════════════════════════════════════════

import { SORULAR, SORULAR_H, SORULAR_F, SORULAR_E } from './sorular'

export type HFESkor = {
  toplam:       number   // 0-100 arası genel dayanıklılık skoru
  h_skoru:      number   // Tehlike skoru
  f_skoru:      number   // Kırılganlık skoru
  e_skoru:      number   // Kapasite skoru
  cevaplanan:   number
  toplam_soru:  number
  kritik_sorular: string[]  // Kritik sorularda düşük puan alanlar
  eksik_sorular:  string[]  // Cevaplanmayan sorular
}

/**
 * Ana skor hesaplama fonksiyonu
 * H ve F için: düşük puan = iyi (ters mantık)
 * E için: yüksek puan = iyi (düz mantık)
 */
export function skorHesapla(puanlar: Record<string, number>): HFESkor {
  const bolumSkor = (sorular: typeof SORULAR) => {
    const cevaplanmis = sorular.filter(s => puanlar[s.kod] !== undefined)
    if (!cevaplanmis.length) return 0

    const alinan = cevaplanmis.reduce((acc, s) => {
      const p = puanlar[s.kod]
      // H ve F: ters mantık (0 = en iyi, 3 = en kötü)
      // E: düz mantık (3 = en iyi, 0 = en kötü)
      const normalPuan = s.ters ? (3 - p) : p
      return acc + normalPuan * s.agirlik
    }, 0)

    const max = cevaplanmis.reduce((acc, s) => acc + s.agirlik * 3, 0)
    return max > 0 ? Math.round((alinan / max) * 100) : 0
  }

  const toplamSkor = () => {
    const cevaplanmis = SORULAR.filter(s => puanlar[s.kod] !== undefined)
    if (!cevaplanmis.length) return 0

    const alinan = cevaplanmis.reduce((acc, s) => {
      const p = puanlar[s.kod]
      const normalPuan = s.ters ? (3 - p) : p
      return acc + normalPuan * s.agirlik
    }, 0)

    const max = cevaplanmis.reduce((acc, s) => acc + s.agirlik * 3, 0)
    return max > 0 ? Math.round((alinan / max) * 100) : 0
  }

  // Kritik sorularda düşük puan kontrolü
  const kritikSorular = SORULAR
    .filter(s => s.kritik && puanlar[s.kod] !== undefined)
    .filter(s => {
      const p = puanlar[s.kod]
      const normalPuan = s.ters ? (3 - p) / 3 : p / 3
      return normalPuan < 0.34  // %34'ün altı kritik
    })
    .map(s => s.kod)

  const eksikSorular = SORULAR
    .filter(s => puanlar[s.kod] === undefined)
    .map(s => s.kod)

  return {
    toplam:        toplamSkor(),
    h_skoru:       bolumSkor(SORULAR_H),
    f_skoru:       bolumSkor(SORULAR_F),
    e_skoru:       bolumSkor(SORULAR_E),
    cevaplanan:    Object.keys(puanlar).length,
    toplam_soru:   SORULAR.length,
    kritik_sorular: kritikSorular,
    eksik_sorular:  eksikSorular,
  }
}

/**
 * Öncelikli iyileştirme alanları (en zayıf sorular)
 */
export function zayifNoktalar(puanlar: Record<string, number>, adet = 8) {
  return SORULAR
    .filter(s => puanlar[s.kod] !== undefined)
    .map(s => {
      const p = puanlar[s.kod]
      const normalPuan = s.ters ? (3 - p) / 3 : p / 3
      return { ...s, puan: p, normalPuan, etki: normalPuan * s.agirlik }
    })
    .filter(s => s.normalPuan < 0.5)
    .sort((a, b) => a.etki - b.etki)
    .slice(0, adet)
}

/**
 * Tamamlanma yüzdesi
 */
export function tamamlanmaYuzdesi(puanlar: Record<string, number>): number {
  return Math.round((Object.keys(puanlar).length / SORULAR.length) * 100)
}

/**
 * Çoklu form ortalaması (dashboard için)
 */
export function networkSkor(skorlar: number[]): number {
  if (!skorlar.length) return 0
  return Math.round(skorlar.reduce((a, b) => a + b, 0) / skorlar.length)
}
