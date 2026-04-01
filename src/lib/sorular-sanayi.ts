// ═══════════════════════════════════════════════════════════════
//  OMNI Platform — Sanayi Tesisleri HIFYEA Soru Seti v4.0
//  HIFYEA Metodolojisi: H·F×E·Y·A
//  Mevzuat: AFAD AADY 2025 · Seveso III · ISO 22301:2019+A1:2024
//           ISO 45001:2023 · ISO 31000:2018 · BS EN IEC 31010:2019
//           İSG Kanunu 6331 · Büyük Endüstriyel Kazalar Yönetmeliği
//           Binaların Yangından Korunması Yönetmeliği · ISO 50001
//           ISO 27001/27031 · ISO 28000:2022 · BS ISO 22316:2017
//  Toplam: ~120 soru — T:20, S:22, Y:50, HRO:12 (sinif bazlı gösterim)
// ═══════════════════════════════════════════════════════════════

import type { Soru } from './sorular'
export type { Soru }

export type SoruSanayi = Soru & {
  boyut: 'H' | 'F' | 'E' | 'C' | 'HRO'
  natech_flag?: boolean
  siniflar: (1 | 2 | 3)[]   // hangi tehlike sınıflarında gösterilsin
  mevzuat: string[]          // dayandığı mevzuat/standart referansları
}

// ─── Tesis Kimlik Envanter ──────────────────────────────────────
export type TesisEnvanterAlani = {
  kod: string; label: string
  tip: 'text' | 'number' | 'select' | 'checkbox' | 'belge' | 'koordinat' | 'multiselect'
  zorunlu: boolean; secenek?: string[]; aciklama?: string
}

export type DestekKapasite = {
  kod: string; label: string
  tip: 'number' | 'checkbox' | 'select'
  birim?: string; aciklama?: string; secenek?: string[]
}

export const SORULAR_SANAYI: SoruSanayi[] = [

  // ══════════════════════════════════════════════════════════════
  // BÖLÜM 1 — TEHLİKE (T1-T20)  boyut: H
  // ══════════════════════════════════════════════════════════════

  {
    kod: 'T1', bolum: 'TEHLİKE', boyut: 'H', agirlik: 5, kritik: true, ters: true,
    siniflar: [1, 2, 3], natech_flag: true,
    mevzuat: ['AFAD AADY 2025', 'TBDY 2018', 'ISO 22301:2019'],
    soru: 'Tesisin bulunduğu bölgenin deprem tehlike haritasındaki ivme değeri ve tarihsel deprem tekerrür sıklığı nedir?',
    rehber: [
      'DD-2 ivmesi < 0.1g, son 50 yılda M5+ deprem yok — risk minimal',
      'DD-2 ivmesi 0.1–0.3g, seyrek M5+ deprem geçmişi — düşük risk',
      'DD-2 ivmesi 0.3–0.5g, bölgede M6+ deprem deneyimi var — orta risk',
      'DD-2 ivmesi > 0.5g, aktif fay hattı yakınında, M7+ deprem riski yüksek — kritik',
    ],
  },
  {
    kod: 'T2', bolum: 'TEHLİKE', boyut: 'H', agirlik: 4, kritik: true, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['AFAD AADY 2025', 'Büyükşehir Belediyeleri Afet Yatırımları Yönetmeliği'],
    soru: 'Tesisin bulunduğu havzanın taşkın/sel tehlike derecesi ve tekerrür periyodu nedir?',
    rehber: [
      'Taşkın alanı dışında, Q500 sınırının ötesinde — güvenli',
      'Q100 dışında ama Q500 içinde — dikkat gerektirir',
      'Q100 taşkın alanı içinde — yüksek risk',
      'Q50 veya daha sık tekerrürlü taşkın alanında — acil önlem şart',
    ],
  },
  {
    kod: 'T3', bolum: 'TEHLİKE', boyut: 'H', agirlik: 5, kritik: true, ters: true,
    siniflar: [1, 2], natech_flag: true,
    mevzuat: ['Büyük Endüstriyel Kazaların Önlenmesi Yönetmeliği (Seveso III)', 'Büyük Kaza Önleme Politika Belgesi Tebliği', 'Güvenlik Raporu Tebliği'],
    soru: 'Tesiste üretilen, kullanılan veya depolanan tehlikeli maddelerin NATECH potansiyeli nedir?',
    rehber: [
      'Tehlikeli madde yok, NATECH riski minimal',
      'Küçük miktarda tehlikeli madde, Seveso eşiği altında',
      'Önemli miktarda tehlikeli madde, alt eşik Seveso kapsamında',
      'Büyük miktarda tehlikeli madde, üst eşik Seveso / COMAH — zorunlu güvenlik raporu gerekli',
    ],
  },
  {
    kod: 'T4', bolum: 'TEHLİKE', boyut: 'H', agirlik: 5, kritik: true, ters: true,
    siniflar: [1, 2], natech_flag: true,
    mevzuat: ['Binaların Yangından Korunması Hakkında Yönetmelik', 'Büyük Endüstriyel Kazalar Yönetmeliği', 'İSG Kanunu 6331'],
    soru: 'Tesis içi yangın ve patlama tehlikesi yoğunluğu nasıldır? (NACE kodu, proses sıcaklığı, basınçlı ekipman)',
    rehber: [
      'Yangın/patlama tehlikesi yok veya ihmal edilebilir düzeyde',
      'Sınırlı yanıcı madde, düşük basınçlı proses',
      'Önemli yangın/patlama potansiyeli, orta basınçlı sistem',
      'Yüksek tehlikeli proses, parlayıcı/patlayıcı madde, yüksek basınç — ATEX önlem zorunlu',
    ],
  },
  {
    kod: 'T5', bolum: 'TEHLİKE', boyut: 'H', agirlik: 3, kritik: false, ters: true,
    siniflar: [1, 2],
    mevzuat: ['Büyük Endüstriyel Kazalar Yönetmeliği Madde 9 (domino etkisi)', 'İSG Risk Değerlendirmesi Yönetmeliği'],
    soru: 'Komşu tesisler veya çevreden kaynaklanabilecek baskı, kaza ve kirlilik tehdidi var mı?',
    rehber: [
      'İzole konum, çevresel tehdit yok',
      'Düşük riskli komşular, etki minimal',
      'OSB içinde riskli komşu tesis mevcut',
      'Seveso tesisi veya yüksek riskli proses komşuluğu, domino etkisi riski var',
    ],
  },
  {
    kod: 'T6', bolum: 'TEHLİKE', boyut: 'H', agirlik: 3, kritik: false, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 28000:2022 (Tedarik Zinciri Güvenliği)', 'BS ISO 28001:2007', 'ISO 22301:2019 Madde 8.3'],
    soru: 'Kritik hammadde, enerji veya lojistik tedarikçisinin kesintiye uğrama sıklığı ve olası etki büyüklüğü?',
    rehber: [
      'Çoklu tedarikçi, kesinti hiç yaşanmadı',
      'Ara sıra kısa süreli aksama, alternatif mevcut',
      'Yılda birkaç kez üretimi etkileyen kesinti',
      'Tek tedarikçi bağımlılığı, kesinti üretimi tamamen durduruyor',
    ],
  },
  {
    kod: 'T7', bolum: 'TEHLİKE', boyut: 'H', agirlik: 4, kritik: true, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['BS EN ISO-IEC 27005:2024', 'BS ISO-IEC 27031:2025 (ICT DR)', 'BS ISO-IEC 27035:2023 (Olay Müdahale)'],
    soru: 'Endüstriyel kontrol sistemleri (SCADA/PLC/DCS) ve BT altyapısına yönelik siber saldırı tehdidi seviyesi nedir?',
    rehber: [
      'Kapalı ağ, internet erişimi yok, tehdit minimal',
      'Kısmi internet bağlantısı, standart güvenlik önlemleri mevcut',
      'Uzaktan erişim var, güvenlik açıkları tespit edilmiş',
      'OT/IT ağları birleşik, daha önce siber olay yaşandı veya kritik açık mevcut',
    ],
  },
  {
    kod: 'T8', bolum: 'TEHLİKE', boyut: 'H', agirlik: 3, kritik: false, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 22301:2019 Madde 6.2 (BIA)', 'PD ISO-TS 22317:2021 (BIA Kılavuzu)'],
    soru: 'Üretim kesintisinin tedarik zinciri ve stratejik müşterilere zincirleme etkisi ne düzeyde?',
    rehber: [
      'Tesis yerel tedarikçi, ikame kolayca bulunabilir',
      'Bölgesel önemi var, alternatif temin süresi 1-4 hafta',
      'Ulusal tedarik zincirinde kritik, ikamesi zor',
      'Stratejik/ihracat ürünü, global tedarik zinciri etkisi',
    ],
  },
  {
    kod: 'T9', bolum: 'TEHLİKE', boyut: 'H', agirlik: 4, kritik: true, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['AFAD AADY 2025', 'Büyükşehir Belediyeleri Afet Yatırımları Yönetmeliği'],
    soru: 'Tesisin bulunduğu bölgede sel, taşkın veya aşırı yağış riski ve son 10 yıldaki tekerrür sıklığı nedir?',
    rehber: [
      'Taşkın alanı dışında, Q500 ötesinde, hiç su baskını yaşanmadı',
      'Q100 dışında, bölgede seyrek su baskını geçmişi var',
      'Q100 taşkın alanı içinde veya son 10 yılda 1-2 kez su baskını',
      'Q50 veya daha sık tekerrürlü taşkın alanı, rutin su baskını problemi var',
    ],
  },
  {
    kod: 'T10', bolum: 'TEHLİKE', boyut: 'H', agirlik: 3, kritik: false, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 14001:2015+A1:2024', 'ISO 50001:2018+A1:2024'],
    soru: 'Aşırı sıcak veya soğuk hava dalgaları tesisin üretim kapasitesini ve enerji maliyetlerini nasıl etkiliyor?',
    rehber: [
      'İklim kontrolü tam, aşırı sıcak/soğuk üretimi etkilemiyor',
      'Kısmi etki var, üretim yavaşlıyor ancak durmuyor',
      'Yılda birkaç kez üretim durması veya ciddi enerji maliyeti artışı',
      'Aşırı hava olayları üretimi düzenli olarak durduruyor, altyapı yetersiz',
    ],
  },
  {
    kod: 'T11', bolum: 'TEHLİKE', boyut: 'H', agirlik: 3, kritik: false, ters: true,
    siniflar: [1, 2],
    mevzuat: ['ISO 50001:2018+A1:2024', 'ISO 22301:2019 Madde 8.7 (iş sürekliliği)'],
    soru: 'Tesisin enerji tüketim profili iklim kaynaklı şebeke yükü artışlarına (yaz/kış zirvesi) ne kadar duyarlı?',
    rehber: [
      'Yenilenebilir enerji + kendi üretim kapasitesi var, şebekeye bağımlılık düşük',
      'Yedek jeneratör mevcut, kısa süreli kesintiler tolere edilebilir',
      'Şebekeye tam bağımlı, zirve dönemlerinde kesinti yaşandı',
      'Tek hat, yedek yok, enerji kesintisi üretimi hemen durduruyor',
    ],
  },
  {
    kod: 'T12', bolum: 'TEHLİKE', boyut: 'H', agirlik: 4, kritik: true, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['Güvenlik ve Acil Durumlar Koordinasyon Merkezi Yönetmeliği', 'AFAD AADY 2025'],
    soru: 'Tesisin bulunduğu bölgede toplumsal olaylar, grev, sabotaj veya terör saldırısı riski nasıl değerlendiriliyor?',
    rehber: [
      'Düşük risk bölgesi, geçmişte hiç olay yaşanmadı, güvenli sanayi bölgesi',
      'Düşük-orta risk, bölgede nadiren küçük çaplı olaylar yaşanıyor',
      'Orta risk, tesis sektörü/konumu nedeniyle hedef olabilir, güvenlik kısmi',
      'Yüksek risk, kritik altyapı veya stratejik tesis, güvenlik olayı geçmişi var',
    ],
  },
  {
    kod: 'T13', bolum: 'TEHLİKE', boyut: 'H', agirlik: 5, kritik: true, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 22301:2019 Madde 6.1 (bağlam)', 'BS ISO 31000:2018'],
    soru: 'Tesisin tedarik zinciri, üretim ortağı veya ihracat pazarları jeopolitik çatışma bölgelerine yakınlık açısından nasıl değerlendiriliyor?',
    rehber: [
      'Tedarik zinciri tamamen iç piyasaya yönelik, jeopolitik etki minimal',
      'Bazı tedarikçi/pazarlar risk bölgelerine yakın, alternatif mevcut',
      'Kritik hammadde/ihracat pazarlarının önemli kısmı risk bölgesinde, ikame zor',
      'Tedarik zinciri/pazar yapısı doğrudan çatışma bölgesine bağımlı, ciddi kırılganlık',
    ],
  },
  {
    kod: 'T14', bolum: 'TEHLİKE', boyut: 'H', agirlik: 4, kritik: true, ters: true,
    siniflar: [1, 2],
    mevzuat: ['Radyasyon Acil Durumlarının Yönetimi Hakkında Yönetmelik', 'Nükleer Tesislerde Yangın Güvenliği Yönetmeliği'],
    soru: 'Tesisin yakın çevresinde nükleer, radyolojik veya yüksek frekanslı elektromanyetik alan kaynağı var mı?',
    rehber: [
      'Yakın çevrede herhangi bir kaynak yok',
      'Uzak mesafede tesis mevcut, operasyonel etki minimal',
      'Orta mesafede tesis var, olası senaryo değerlendirilmiş',
      'Yakın çevrede aktif kaynak, acil müdahale planı entegre edilmeli',
    ],
  },
  {
    kod: 'T15', bolum: 'TEHLİKE', boyut: 'H', agirlik: 3, kritik: false, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['Orman Yangınlarının Önlenmesi Yönetmeliği', 'AFAD AADY 2025'],
    soru: 'Tesisin yakın çevresinde orman yangını veya kırsal yangın tehlikesi var mı?',
    rehber: [
      'Orman/kırsal alan yok, kent merkezinde veya sanayi bölgesinde',
      'Uzak mesafede orman var, geçmişte yangın yaşanmadı',
      'Orman veya kırsal alana yakın, bölgede geçmişte yangın yaşandı',
      'Doğrudan bitişik veya içinde, yangın riski yüksek sezon mevcut',
    ],
  },
  {
    kod: 'T16', bolum: 'TEHLİKE', boyut: 'H', agirlik: 4, kritik: true, ters: true,
    siniflar: [1, 2],
    mevzuat: ['İSG Kanunu 6331', 'İSGYE Tehlike Sınıfları Tebliği', 'Maden İşyerlerinde İSG Yönetmeliği'],
    soru: 'Tesis faaliyetlerinden kaynaklanan toz, gürültü, titreşim veya kimyasal maruziyet düzeyi nasıldır?',
    rehber: [
      'Ofis ortamı seviyesinde, herhangi bir mesleki maruziyet yok',
      'Sınır değerlerin altında, kişisel koruyucu yeterli',
      'Zaman zaman sınır değer aşımı, teknik önlem gerekiyor',
      'Kronik/yüksek düzey maruziyet, meslek hastalığı riski, mühendislik önlemi zorunlu',
    ],
  },
  {
    kod: 'T17', bolum: 'TEHLİKE', boyut: 'H', agirlik: 3, kritik: false, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 14001:2015+A1:2024', 'Büyük Endüstriyel Kazalar Yönetmeliği'],
    soru: 'Tesisin faaliyetlerinden kaynaklanan çevre kirliliği (hava, su, toprak) riski ve düzenleyici ceza geçmişi nasıldır?',
    rehber: [
      'Çevre etkisi minimal, hiç ceza almadı, çevre izni güncel',
      'Küçük ihlaller geçmişte oldu, giderildi',
      'Tekrarlayan ihlaller, idari ceza alındı, devam eden süreç var',
      'Ciddi çevre kirliliği davası, faaliyet durdurma riski veya hukuki süreç',
    ],
  },
  {
    kod: 'T18', bolum: 'TEHLİKE', boyut: 'H', agirlik: 4, kritik: true, ters: true,
    siniflar: [1, 2],
    mevzuat: ['Büyük Endüstriyel Kazalar Yönetmeliği', 'Dahili Acil Durum Planları Hakkında Tebliğ'],
    soru: 'Tesisin tarihsel kaza kaydı (yangın, patlama, kimyasal sızıntı, iş kazası) nasıldır?',
    rehber: [
      'Son 5 yılda hiç kayıt yok, mükemmel güvenlik performansı',
      'Küçük olaylar var, kayıp günü yok veya minimal',
      'Birden fazla kayıp günlü kaza, iyileştirme devam ediyor',
      'Ölümlü veya ağır yaralanmalı kaza, iş durdurma geçmişi var',
    ],
  },
  {
    kod: 'T19', bolum: 'TEHLİKE', boyut: 'H', agirlik: 3, kritik: false, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['BS ISO 31000:2018', 'BS EN IEC 31010:2019'],
    soru: 'İklim değişikliğinin uzun vadeli etkileri (aşırı hava, kıtlık, biyoçeşitlilik kaybı) tesisin operasyonunu nasıl etkiliyor?',
    rehber: [
      'İklim değişikliği senaryoları analiz edilmiş, risk düşük',
      'Uzun vadeli senaryo değerlendirmesi yapılmış, orta etki bekleniyor',
      'Değerlendirme kısmen yapılmış, bazı risklere önlem alındı',
      'İklim değişikliği değerlendirmesi hiç yapılmamış, uzun vadeli operasyonel risk belirsiz',
    ],
  },
  {
    kod: 'T20', bolum: 'TEHLİKE', boyut: 'H', agirlik: 4, kritik: true, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['İSG Kanunu 6331', 'Çalışanların İSG Eğitimleri Yönetmeliği', 'AFAD Tatbikatlar Yönetmeliği'],
    soru: 'Tesisin iç denetim, dış denetim ve müfettiş ziyaretlerinden kaynaklanan uyumsuzluk kaydı nasıldır?',
    rehber: [
      'Son 3 yılda hiç uyumsuzluk kaydı yok',
      'Küçük uyumsuzluklar zamanında kapatıldı',
      'Tekrarlayan uyumsuzluklar, kapatma süreleri aşılıyor',
      'Büyük uyumsuzluk, yaptırım veya faaliyeti etkileyen karar alındı',
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // BÖLÜM 2 — KIRILGANLIK (S1-S22)  boyut: F/E
  // ══════════════════════════════════════════════════════════════

  {
    kod: 'S1', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 5, kritik: true, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['TBDY 2018', 'ISO 21542:2021 (yapı erişilebilirliği)', 'AFAD AADY 2025'],
    soru: 'Binanın inşa yılı, deprem yönetmeliği uyumu ve yapısal hasar riski nasıl değerlendirilir?',
    rehber: [
      '2019 sonrası, TBDY uyumlu, yapısal değerlendirme tamam',
      '2007-2018 arası, deprem yönetmeliğine uygun',
      '1999-2007 arası, güçlendirme planı var ancak tamamlanmadı',
      '1999 öncesi, hasarlı veya güçlendirme yapılmamış, yüksek yıkılma riski',
    ],
  },
  {
    kod: 'S2', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 4, kritik: true, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['TBDY 2018', 'Zemin ve Temel Etüdü Genelgesi'],
    soru: 'Zemin sınıflaması, sıvılaşma ve oturma potansiyeli nasıl?',
    rehber: [
      'ZA/ZB zemin, sıvılaşma riski yok, etüt raporu mükemmel',
      'ZC zemin, etüt raporu mevcut, risk düşük',
      'ZD zemin, sıvılaşma olasılığı var, önlem kısmi',
      'ZE/ZF zemin veya etüt yok, sıvılaşma/göçük riski yüksek',
    ],
  },
  {
    kod: 'S3', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 5, kritik: true, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['İSG Kanunu 6331', 'İşyerlerinde Acil Durumlar Hakkında Yönetmelik', 'ISO 45001:2023'],
    soru: 'Afet veya kaza anında çalışanların fiziksel zarar görme riski ve olası can kaybı ihtimali nedir?',
    rehber: [
      'Personel afet anında tesis dışında, risk minimal',
      'Hafif yaralanma olasılığı var, tahliye yetişilebilir',
      'Ağır yaralanma riski mevcut, geç kalınırsa kritik',
      'Can kaybı riski yüksek, 7/24 çalışan var ve kaçış yolu yetersiz',
    ],
  },
  {
    kod: 'S4', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 4, kritik: false, ters: true,
    siniflar: [1, 2],
    mevzuat: ['ISO 55001:2024 (Varlık Yönetimi)', 'ISO 22301:2019 Madde 8.4'],
    soru: 'Kritik üretim ekipmanı ve makinelerin afet anında hasar görme riski nasıl?',
    rehber: [
      'Tüm kritik ekipman ankrajlı, titreşim izolatörlü',
      'Büyük ekipman sabitlenmiş, küçükler kısmen',
      'Ekipmanların çoğu sabitlenmemiş, devrilme/hasar riski var',
      'Ağır ekipman zemine tutturulmamış, domino etkisi riski yüksek',
    ],
  },
  {
    kod: 'S5', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 5, kritik: true, ters: true,
    siniflar: [1, 2], natech_flag: true,
    mevzuat: ['Büyük Endüstriyel Kazalar Yönetmeliği', 'Büyük Kaza Senaryo Dokümanı Tebliği', 'Dahili Acil Durum Planları Tebliği'],
    soru: 'Tehlikeli kimyasal maddelerin depolanma koşulları ve afet anında sızıntı/yayılım riski?',
    rehber: [
      'Güvenli depolama, sekonder kap, otomatik kesme vanası mevcut',
      'Depolama alanı uygun, prosedür var, manuel kesme yapılabiliyor',
      'Depolama koşulları kısmen yeterli, acil müdahale eksik',
      'Güvensiz depolama, acil prosedür yok, sızıntı riski kritik',
    ],
  },
  {
    kod: 'S6', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 4, kritik: true, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 50001:2018', 'ISO 22301:2019 Madde 8.7', 'Binaların Yangından Korunması Yönetmeliği'],
    soru: 'Enerji altyapısı (elektrik, gaz, basınçlı hava) kırılganlığı ve tek hat bağımlılığı?',
    rehber: [
      'Çift besleme hattı, jeneratör ve UPS, tam yedekli',
      'Tek hat ama yedek jeneratör var',
      'Tek hat, yedek enerji kısmen yeterli',
      'Tek hatta tam bağımlı, herhangi bir kesinti üretimi durdurur',
    ],
  },
  {
    kod: 'S7', bolum: 'KIRILGANLIK', boyut: 'E', agirlik: 4, kritik: true, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['BS ISO-IEC 27031:2025 (ICT DR)', 'BS EN ISO-IEC 27005:2024', 'BS ISO-IEC 24762:2008'],
    soru: 'OT/BT sistemleri (SCADA, PLC, MES) eski nesil cihaz oranı ve güvenlik açığı seviyesi?',
    rehber: [
      'Sistemler < 5 yıl, güncel yamalar, segmentasyon uygulanmış',
      'Büyük çoğunluk modern, az sayıda eski cihaz',
      'Önemli oranda eski sistem, yama desteği sona ermiş',
      'Legacy SCADA/PLC yaygın, internet bağlantılı, güvenlik açığı kritik',
    ],
  },
  {
    kod: 'S8', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 3, kritik: false, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 28000:2022+A1:2024', 'PD ISO-TS 22318:2021 (Tedarik Zinciri Sürekliliği)'],
    soru: 'Kritik hammadde veya girdi tedarikçisi sayısı ve coğrafi çeşitliliği (tedarik zinciri kırılganlığı)?',
    rehber: [
      '3+ onaylı tedarikçi, farklı coğrafyada, stok 30+ gün',
      '2 tedarikçi, makul stok rezervi',
      'Tek onaylı tedarikçi, yedek arayışı başlatılmış',
      'Tek tedarikçi, ikame yok, afet/grev durumunda üretim durur',
    ],
  },
  {
    kod: 'S9', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 4, kritik: false, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['TBDY 2018', 'AFAD AADY 2025', 'Büyükşehir Belediyeleri Afet Yatırımları Yönetmeliği'],
    soru: 'Tesisin coğrafi konumu açısından kümülatif risk: fay hattı, taşkın ovası, akarsu yatağı mesafesi?',
    rehber: [
      'Fay hattına > 5 km, sel ovası dışında, güvenli yükseklik',
      'Fay hattına 2-5 km, Q100 alanı dışında',
      'Fay hattına 1-2 km veya Q100 alanına yakın',
      'Aktif fay hattına < 1 km ve/veya Q50 taşkın alanı içinde',
    ],
  },
  {
    kod: 'S10', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 4, kritik: true, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 22301:2019 Madde 8.3 (SPOF analizi)', 'PD ISO-TS 22317:2021'],
    soru: 'Operasyonun tek bir makine, sistem, proses veya kilit kişiye bağımlılık düzeyi (SPOF)?',
    rehber: [
      'Tam paralel kapasite, hiçbir SPOF tespit edilmedi',
      'Kısmi bağımlılık, yedek plan mevcut',
      'Kritik SPOF var, yedek plan hazırlanıyor',
      'Birden fazla kritik SPOF, tek hata üretimi tamamen durdurabilir',
    ],
  },
  {
    kod: 'S11', bolum: 'KIRILGANLIK', boyut: 'E', agirlik: 3, kritik: false, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 22301:2019 Madde 7.2 (yetkinlik)', 'PD ISO-TS 22330:2018 (insan unsuru)'],
    soru: 'Kilit teknik personelin (operatör, usta, mühendis) ani yokluğunda üretim sürekliliği riski?',
    rehber: [
      'Çapraz eğitim tam, tüm pozisyonlar 2+ kişi tarafından yapılabiliyor',
      'Çoğu kritik pozisyon yedekli, birkaç boşluk var',
      'Kritik becerilerde tek kişi bağımlılığı yaygın',
      'Çoğu kritik bilgi tek kişide, işten ayrılma/kaza halinde üretim durur',
    ],
  },
  {
    kod: 'S12', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 3, kritik: false, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 22301:2019 Madde 8.3 (finansal kapasite)', 'PD ISO-TS 22331:2018'],
    soru: 'Üretim kesintisinde nakit akışı ve acil operasyonel giderleri karşılama kapasitesi?',
    rehber: [
      'Güçlü likidite, 3+ aylık gideri karşılayacak rezerv',
      '1-3 aylık rezerv, kredi imkânı mevcut',
      '2-4 haftalık rezerv, mevcut',
      'Nakit rezervi yok, kısa süreli kesinti bile finansal krize yol açar',
    ],
  },
  {
    kod: 'S13', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 3, kritik: false, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 22301:2019 Madde 8.3', 'BS 31100:2021 (Risk Yönetimi Uygulama Kılavuzu)'],
    soru: 'Tesis sigortası kapsamı (yangın, deprem, iş durması, 3. şahıs sorumluluk) yeterliliği?',
    rehber: [
      'Kapsamlı sigorta, iş durması ve 3. şahıs dahil, makul muafiyet',
      'Temel tesis sigortası var, iş durması kısmen var',
      'Yalnızca zorunlu sigorta, önemli boşluklar',
      'Sigorta yetersiz veya hiç yok, risk tamamen tesisin üzerinde',
    ],
  },
  {
    kod: 'S14', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 3, kritik: false, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['İSG Kanunu 6331', 'Büyük Endüstriyel Kazalar Yönetmeliği', 'ISO 45001:2023'],
    soru: 'Yürürlükteki yasal düzenlemelere (6331 İSG, Seveso III, ISO standartları, AFAD mevzuatı) uyum durumu?',
    rehber: [
      'Tam uyumlu, bağımsız denetimden geçmiş',
      'Küçük eksikler var, giderilme sürecinde',
      'Orta düzey uyumsuzluk, idari ceza alındı',
      'Büyük uyumsuzluk, faaliyet durdurma riski veya süregelen ihlal',
    ],
  },
  {
    kod: 'S15', bolum: 'KIRILGANLIK', boyut: 'E', agirlik: 2, kritik: false, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['BS ISO 31000:2018', 'ISO 22301:2019 Madde 4.2 (paydaş analizi)'],
    soru: 'Olası bir afet veya kaza sonrası tesisin itibar kaybı, müşteri/ortak güven erozyonu riski?',
    rehber: [
      'Güçlü itibar, müşteriler çeşitlendirilmiş, etki minimal',
      'Geçici güven kaybı, 3 ay içinde telafi edilebilir',
      'Ciddi itibar hasarı, uzun süreli müşteri kaybı riski',
      'Kalıcı marka hasarı, kritik kontrat iptali, piyasadan çekilme riski',
    ],
  },
  {
    kod: 'S16', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 4, kritik: true, ters: true,
    siniflar: [1, 2],
    mevzuat: ['Büyük Endüstriyel Kazalar Yönetmeliği', 'İSG Risk Değerlendirmesi Yönetmeliği', 'BS EN ISO 13849-1:2023'],
    soru: 'Tesis içi boru hatları, depolama tankları ve basınçlı kapların periyodik muayene ve test durumu nasıldır?',
    rehber: [
      'Tüm ekipman periyodik muayeneli, belgeli, son muayene tarihi güncel',
      'Büyük çoğunluk muayeneli, küçük eksikler var',
      'Muayene programı var ancak bazı kritik ekipman atlanmış',
      'Muayene programı yok veya son 3 yılda hiç muayene yapılmamış',
    ],
  },
  {
    kod: 'S17', bolum: 'KIRILGANLIK', boyut: 'E', agirlik: 3, kritik: false, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 41001:2018+A1:2024 (Tesis Yönetimi)', 'ISO 55001:2024'],
    soru: 'Tesis bakım yönetim sisteminin etkinliği: arıza bakım oranı, önleyici bakım planı ve yedek parça stoku?',
    rehber: [
      'Önleyici bakım > %80, yedek parça stoku hazır, arıza bakım < %20',
      'Önleyici bakım > %60, yedek parça kısmen mevcut',
      'Önleyici bakım < %60, ağırlıklı olarak arıza bakımı',
      'Bakım planı yok, arıza bakımı yaygın, kritik yedek parça stoklanmıyor',
    ],
  },
  {
    kod: 'S18', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 4, kritik: true, ters: true,
    siniflar: [1, 2],
    mevzuat: ['Binaların Yangından Korunması Hakkında Yönetmelik', 'Seyyar Yangın Söndürücüler Tebliği', 'TS 11827'],
    soru: 'Tesis yangın yükü (m²/MJ) ve yapısal yangın direnci (REI sınıfı) nasıl değerlendiriliyor?',
    rehber: [
      'Düşük yangın yükü, REI 120+ taşıyıcı sistem, yangın bölmeleme tam',
      'Orta yangın yükü, REI 60-90, bölmeleme büyük ölçüde mevcut',
      'Yüksek yangın yükü, REI 30-60, bölmeleme eksik',
      'Çok yüksek yangın yükü, yanıcı yapı malzemesi, bölmeleme yok',
    ],
  },
  {
    kod: 'S19', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 3, kritik: false, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['Yapı İşlerinde İSG Yönetmeliği', 'ISO 21542:2021'],
    soru: 'Tesisin erişim yolları ve tahliye güzergâhları afet sırasında işlevselliğini koruyabiliyor mu?',
    rehber: [
      'Çoklu erişim yolu, tahliye güzergâhları bağımsız ve geniş',
      '2 erişim yolu, tahliye güzergâhları yeterli',
      'Tek erişim yolu, tahliye güzergâhları kısmen yeterli',
      'Tek erişim yolu, afet durumunda kesilebilir, tahliye güzergâhları yetersiz',
    ],
  },
  {
    kod: 'S20', bolum: 'KIRILGANLIK', boyut: 'E', agirlik: 3, kritik: false, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['BS EN ISO-IEC 27701:2025 (Gizlilik)', 'KVKK', 'BS EN ISO-IEC 27017:2021'],
    soru: 'Tesisin üretim, müşteri ve operasyonel verilerinin veri güvenliği ve gizlilik koruma düzeyi nasıldır?',
    rehber: [
      'KVKK uyumlu, veri envanteri hazır, ihlal müdahale planı mevcut',
      'KVKK kaydı yapılmış, eksikler giderilmekte',
      'Kısmi uyum, bazı kişisel veri işleme süreçleri belgelenmemiş',
      'KVKK uyumu yok, veri güvenliği politikası mevcut değil',
    ],
  },
  {
    kod: 'S21', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 4, kritik: true, ters: true,
    siniflar: [1, 2],
    mevzuat: ['ISO 19443:2022+A1:2024 (Nükleer Tedarik Zinciri)', 'BS ISO 28000:2022'],
    soru: 'Tesisin kritik güvenlik ekipmanları (yangın kapıları, acil çıkış kapıları, sprinkler) son muayene tarihi ve durumu nasıldır?',
    rehber: [
      'Tüm güvenlik ekipmanı son 12 ay içinde test edilmiş ve sertifikalı',
      'Büyük çoğunluk test edilmiş, küçük eksikler takip ediliyor',
      'Bazı kritik ekipman test edilmemiş, muayene programı yetersiz',
      'Güvenlik ekipmanları hiç test edilmemiş veya devre dışı bırakılmış',
    ],
  },
  {
    kod: 'S22', bolum: 'KIRILGANLIK', boyut: 'E', agirlik: 3, kritik: false, ters: true,
    siniflar: [1, 2, 3],
    mevzuat: ['BS ISO 39001:2012+A1:2024 (Trafik Güvenliği)', 'İSG Kanunu 6331'],
    soru: 'Tesisin iş yerinde ve çevresindeki trafik güvenliği düzenlemeleri ve yaya/araç ayrışması nasıl değerlendiriliyor?',
    rehber: [
      'Tam yaya/araç ayrışması, hız sınırı uygulamalı, acil araç erişimi planlanmış',
      'Büyük ölçüde ayrışma mevcut, bazı iyileştirme alanları var',
      'Kısmen ayrışma var, yüksek trafik dönemlerinde risk artıyor',
      'Ayrışma yok, yaya/araç karışık trafiği, acil araç erişimi kısıtlı',
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // BÖLÜM 3 — KAPASİTE / YÖNETİLEBİLİRLİK (Y1-Y50)  boyut: C
  // ══════════════════════════════════════════════════════════════

  // ── Liderlik ve Yönetim (Y1-Y6) ──────────────────────────────
  {
    kod: 'Y1', bolum: 'KAPASİTE', boyut: 'C', agirlik: 5, kritik: true, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 22301:2019 Madde 5 (Liderlik)', 'ISO 45001:2023 Madde 5', 'BS ISO 22316:2017'],
    soru: 'Üst yönetim afet/acil durum ve iş sürekliliği yönetimine liderlik ediyor, kaynak ve bütçe sağlıyor mu?',
    rehber: [
      'Liderlik ilgisiz, bütçe ve destek yok',
      'Kağıt üzerinde destek var, kaynak minimal',
      'Kısmen ilgili, bütçe ayrılmış ama yetersiz',
      'Tam liderlik, risk komitesi aktif, yeterli bütçe tahsis edilmiş',
    ],
  },
  {
    kod: 'Y2', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['BS ISO 31000:2018', 'BS 31100:2021', 'ISO 22301:2019 Madde 6.1'],
    soru: 'Entegre risk yönetim politikası ve risk iştahı belgesi kurumsal düzeyde onaylanmış ve uygulanıyor mu?',
    rehber: [
      'Politika yok',
      'Taslak hazırlandı, onaylanmadı',
      'Onaylandı, kısmi uygulama',
      'Onaylandı, düzenli gözden geçiriliyor, tüm birimlere yayıldı',
    ],
  },
  {
    kod: 'Y3', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 9001:2015+A1:2024', 'ISO 14001:2015+A1:2024', 'ISO 22301:2019', 'ISO 45001:2023'],
    soru: 'ISO 9001, 14001, 22301, 45001 gibi ilgili yönetim sistemi sertifikasyonları güncel mi?',
    rehber: [
      'Hiç sertifikasyon yok',
      'Yalnızca ISO 9001 var',
      'Birden fazla sertifikasyon, 22301 yok',
      'ISO 22301 dahil kapsamlı sertifikasyon, güncel denetimler tamam',
    ],
  },
  {
    kod: 'Y4', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 45001:2023 Madde 10.2', 'ISO 22301:2019 Madde 10'],
    soru: 'Yasal ve düzenleyici denetimlerden elde edilen bulgular sistematik olarak takip ediliyor mu?',
    rehber: [
      'Takip mekanizması yok',
      'Bulgular kaydediliyor, kapatma süreci yok',
      'Bulgular kaydediliyor, kısmi kapatma',
      'Tüm bulgular kaydedildi, kapandı, yeniden denetlendi',
    ],
  },
  {
    kod: 'Y5', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    siniflar: [1, 2],
    mevzuat: ['ISO 22301:2019 Madde 8.3 (darboğaz analizi)', 'BS ISO 22316:2017'],
    soru: 'TOC mantığıyla kısıt/darboğaz analizi yapılıp üretim süreklilik planı hazırlandı mı?',
    rehber: [
      'Darboğaz analizi yapılmamış',
      'Kısıtlar belirlendi, plan yok',
      'Kısıtlar ve yedek kapasite planı var',
      'TOC döngüsü aktif, darboğaz izleme ve müdahale SOP mevcut',
    ],
  },
  {
    kod: 'Y6', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: true, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 37001:2025 (Anti-Rüşvet)', 'ISO 22301:2019 Madde 5.3', 'BS ISO 21001:2025'],
    soru: 'Kurumsal yönetişim: etik kurallar, iç kontrol ve ihbarcı koruma mekanizması mevcut mu?',
    rehber: [
      'Etik kurallar ve kontrol mekanizması yok',
      'Yazılı etik kurallar var, uygulama kısmi',
      'Etik komite veya etik hattı mevcut',
      'ISO 37001 sertifikalı veya eşdeğer, ihbarcı koruması aktif',
    ],
  },

  // ── Acil Durum Planlaması (Y7-Y14) ────────────────────────────
  {
    kod: 'Y7', bolum: 'KAPASİTE', boyut: 'C', agirlik: 5, kritik: true, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['Afet ve Acil Durum Müdahale Hizmetleri Yönetmeliği', 'İşyerlerinde Acil Durumlar Yönetmeliği', 'AFAD AADY 2025'],
    soru: 'Afet ve Acil Durum Yönetim Planı (AADYP) güncel, test edilmiş ve tüm personele duyurulmuş mu?',
    rehber: [
      'Plan yok',
      'Var ama hiç güncellenmemiş ve tatbikat yapılmamış',
      'Plan var, kısmen güncel, tatbikat bekliyor',
      'Güncel, yılda bir test edilmiş, tüm personel biliyor ve erişebiliyor',
    ],
  },
  {
    kod: 'Y8', bolum: 'KAPASİTE', boyut: 'C', agirlik: 5, kritik: true, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 22301:2019+A1:2024 Madde 8.4', 'BS EN ISO 22301:2019', 'ISO 22313:2020'],
    soru: 'İş Sürekliliği Planları (BCP): kritik üretim duruşu, tedarik zinciri ve kilit personel senaryoları için hazırlanmış mı?',
    rehber: [
      'BCP yok',
      'Genel BCP var, senaryo bazlı değil',
      'Bazı kritik senaryolar için BCP mevcut',
      'Tüm kritik senaryolar için özelleşmiş BCP, en az yılda bir test edilmiş',
    ],
  },
  {
    kod: 'Y9', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: true, ters: false,
    siniflar: [1, 2],
    mevzuat: ['ISO 22301:2019 Madde 8.4', 'PD ISO-TS 22317:2021 (BIA)', 'ISO 22313:2020'],
    soru: 'Alternatif üretim yeri (yedek tesis) veya fason üretim anlaşması belirlenmiş ve aktif mi?',
    rehber: [
      'Alternatif tesis veya anlaşma yok',
      'Fikir aşamasında, somut adım atılmamış',
      'Alternatif tesis belirlendi, hazırlanmamış',
      'Alternatif tesis hazır, MoU imzalı ve test edilmiş',
    ],
  },
  {
    kod: 'Y10', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['BS ISO-IEC 27031:2025 (ICT DR)', 'BS ISO-IEC 24762:2008', 'ISO 22301:2019 Madde 8.7'],
    soru: 'IT Felaket Kurtarma Planı (DRP) ve OT/SCADA kurtarma prosedürü mevcut ve test edilmiş mi? (RTO/RPO tanımlı)',
    rehber: [
      'DRP yok',
      'Plan var, hiç test edilmedi',
      'Masa başı tatbikatı yapıldı',
      'Gerçek ortamda test edildi, RTO/RPO hedefleri karşılandı',
    ],
  },
  {
    kod: 'Y11', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['PD ISO-TS 22318:2021 (Tedarik Zinciri Sürekliliği)', 'ISO 28000:2022+A1:2024'],
    soru: 'Kritik tedarikçi arızasına karşı onaylı alternatif tedarikçi ve emniyet stoğu stratejisi hazır mı?',
    rehber: [
      'Alternatif tedarikçi veya stok stratejisi yok',
      'Araştırılıyor, henüz somutlaşmadı',
      'Alternatif tedarikçi belirlendi, stok kısmen yeterli',
      'Onaylı 2+ alternatif tedarikçi, sözleşmeli, stok tamlığı izleniyor',
    ],
  },
  {
    kod: 'Y12', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: true, ters: false,
    siniflar: [1, 2],
    mevzuat: ['Büyük Endüstriyel Kazalar Yönetmeliği', 'Dahili Acil Durum Planları Tebliği', 'ISO 22301:2019'],
    soru: 'Büyük endüstriyel kaza senaryoları (Seveso) için dahili ve harici acil durum planları hazırlanmış mı?',
    rehber: [
      'Senaryo planlaması yok',
      'Genel acil durum planı var, Seveso senaryoları kapsanmıyor',
      'Temel Seveso senaryoları planlanmış, test edilmemiş',
      'Tüm senaryolar dahili ve harici koordinasyonla test edilmiş, belgelenmiş',
    ],
  },
  {
    kod: 'Y13', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 22398:2013 (Tatbikat Kılavuzu)', 'AFAD Tatbikatlar Yönetmeliği'],
    soru: 'Acil durum senaryoları için masa başı (TTX) ve saha tatbikatları düzenli olarak yapılıyor mu?',
    rehber: [
      'Hiç tatbikat yapılmıyor',
      'Yılda bir masa başı tatbikatı',
      'Yılda bir saha tatbikatı',
      'Yılda 2+ farklı senaryo, AAR (tatbikat sonrası değerlendirme) kayıtlı',
    ],
  },
  {
    kod: 'Y14', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 22301:2019 Madde 8.5', 'PD ISO-TS 22331:2018'],
    soru: 'İş sürekliliği tatbikatlarından elde edilen bulgular ve iyileştirme önerileri sistematik olarak uygulanıyor mu?',
    rehber: [
      'Bulgular kayıt altına alınmıyor',
      'Kayıt altına alınıyor ama takip edilmiyor',
      'Bulgular kaydedilip bir kısmı uygulanıyor',
      'Tüm bulgular PDCA döngüsüyle kapatılıyor, plan güncelleniyor',
    ],
  },

  // ── Fiziksel Güvenlik Sistemleri (Y15-Y24) ───────────────────
  {
    kod: 'Y15', bolum: 'KAPASİTE', boyut: 'C', agirlik: 5, kritik: true, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['Binaların Yangından Korunması Yönetmeliği', 'TS 11827', 'Seyyar Yangın Söndürücüler Tebliği'],
    soru: 'Yangın algılama, ihbar, sprinkler ve söndürme sistemleri mevcut ve periyodik kontrollü mu?',
    rehber: [
      'Hiç yok',
      'Yalnızca taşınabilir söndürücü var',
      'Algılama + kısmi söndürme sistemi, periyodik kontrol eksik',
      'Tam otomatik sistem (algılama+ihbar+sprinkler), yılda 1+ bakım yapılıyor',
    ],
  },
  {
    kod: 'Y16', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: true, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 50001:2018', 'Binaların Yangından Korunması Yönetmeliği', 'İSG Kanunu 6331'],
    soru: 'Enerji güvenliği: çift besleme, topraklama, kaçak akım koruması, yedek jeneratör ve UPS mevcut mu?',
    rehber: [
      'Hiçbiri yok',
      'Yalnızca jeneratör var',
      'Jeneratör + UPS + kaçak akım koruması var',
      'Çift besleme hattı dahil tüm sistem mevcut, periyodik bakımlı',
    ],
  },
  {
    kod: 'Y17', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['AFAD AADY 2025', 'Büyükşehir Belediyeleri Afet Yatırımları Yönetmeliği'],
    soru: 'Sel/taşkın önlemleri: su geçirmez bariyer, tahliye pompası, algılama sistemi var mı?',
    rehber: [
      'Hiç yok',
      'Yalnızca pompa var',
      'Pompa + su geçirmez kapı mevcut',
      'Tam sistem: algılama + bariyer + pompa, periyodik test',
    ],
  },
  {
    kod: 'Y18', bolum: 'KAPASİTE', boyut: 'C', agirlik: 5, kritik: true, ters: false,
    siniflar: [1, 2], natech_flag: true,
    mevzuat: ['Büyük Endüstriyel Kazalar Yönetmeliği', 'Dahili Acil Durum Planları Tebliği', 'ISO 22301:2019'],
    soru: 'NATECH önlem sistemi: kimyasal sızıntı detektörü, otomatik kesme vanası ve güvenli tahliye havalandırması var mı?',
    rehber: [
      'Hiç yok',
      'Yalnızca manuel kesme vanası var',
      'Algılama + manuel kesme mevcut',
      'Otomatik kesme + sızıntı algılama + entegre havalandırma, test edilmiş',
    ],
  },
  {
    kod: 'Y19', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: true, ters: false,
    siniflar: [1, 2],
    mevzuat: ['BS EN ISO 13849-1:2023 (Makine Güvenliği)', 'İSG Kanunu 6331', 'ISO 45001:2023'],
    soru: 'Makine koruma: emniyetli durdurma (ESD), aşırı ısınma koruması ve basınç tahliye valfi mevcut mu?',
    rehber: [
      'Hiç yok',
      'Yalnızca manuel durdurma',
      'Otomatik ESD var, diğerleri eksik',
      'Tam koruma sistemi: ESD + basınç tahliye + sıcaklık koruma, periyodik bakımlı',
    ],
  },
  {
    kod: 'Y20', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['TBDY 2018', 'ISO 55001:2024', 'AFAD AADY 2025'],
    soru: 'Deprem dayanıklılık önlemleri: geoteknik rapor, deprem izolasyon sistemi, raf ve ekipman ankrajları var mı?',
    rehber: [
      'Hiçbiri yok',
      'Yalnızca geoteknik rapor var',
      'Geoteknik + yapısal değerlendirme + kısmi ankraj var',
      'Tümü mevcut: geoteknik + izolasyon + ekipman ankrajları, güncel',
    ],
  },
  {
    kod: 'Y21', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['Binaların Yangından Korunması Yönetmeliği', 'ISO 21542:2021', 'İşyerlerinde Acil Durumlar Yönetmeliği'],
    soru: 'Acil durum yönlendirme, kaçış yolu aydınlatması ve push-bar acil çıkış kapıları periyodik test ediliyor mu?',
    rehber: [
      'Hiç yok',
      'Yalnızca tabelalar var',
      'Yönlendirme + acil aydınlatma var, test eksik',
      'Tam sistem, yılda 1+ saha tatbikatıyla test ediliyor',
    ],
  },
  {
    kod: 'Y22', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['AFAD AADY 2025', 'Afet ve Acil Durum Yönetim Merkezleri Yönetmeliği'],
    soru: 'Erken uyarı sistemleri (deprem, kimyasal sızıntı, yangın, sel) merkez sistemle entegre mi?',
    rehber: [
      'Hiç yok',
      'Yalnızca lokal alarm',
      'Merkeze bildirim yapılıyor, otomasyon yok',
      'Tam entegre, otomatik alarm ve kapatma devreye giriyor',
    ],
  },
  {
    kod: 'Y23', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: true, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['Güvenlik ve Acil Durumlar Koordinasyon Merkezi Yönetmeliği', 'ISO 22301:2019'],
    soru: 'Tesis Acil Durum Yönetim Merkezi (ADYM) fiziksel/sanal kurulumu ve iletişim altyapısı hazır mı?',
    rehber: [
      'ADYM yok',
      'Geçici toplantı alanı var, teknik altyapı yok',
      'Tanımlanmış alan ve temel iletişim araçları mevcut',
      'Tam donanımlı ADYM, yedek iletişim, görüntülü koordinasyon sistemi aktif',
    ],
  },
  {
    kod: 'Y24', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['Binaların Yangından Korunması Yönetmeliği', 'İşyerlerinde Acil Durumlar Yönetmeliği'],
    soru: 'Tesisin güvenlik kamera sistemi, alarm sistemi ve perimeter güvenliği afet sonrası da çalışabiliyor mu?',
    rehber: [
      'Bağımsız enerji kaynağı yok, ana şebeke kesilince devre dışı',
      'Kısa süreli UPS desteği var (< 4 saat)',
      'Jeneratör desteğiyle çalışabiliyor',
      'Bağımsız enerji + yedek iletişim hattı, 72+ saat otonom çalışma',
    ],
  },

  // ── Personel, Eğitim ve Ekipler (Y25-Y32) ────────────────────
  {
    kod: 'Y25', bolum: 'KAPASİTE', boyut: 'C', agirlik: 5, kritik: true, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['AFAD Arama ve Kurtarma Yönetmeliği', 'İşyerlerinde Acil Durumlar Yönetmeliği', 'ISO 22301:2019'],
    soru: 'Afet operasyon personeli: ilkyardım, hafif USAR (arama-kurtarma) ve yangın müdahale ekipleri aktif mi?',
    rehber: [
      'Hiç yok',
      'Yalnızca temel ilkyardım sertifikalı personel var',
      'İlkyardım + yangın müdahale ekibi var',
      'Tam ekip: ilkyardım + USAR + yangın + telsiz/sertifikalı, tatbikat yapılmış',
    ],
  },
  {
    kod: 'Y26', bolum: 'KAPASİTE', boyut: 'C', agirlik: 5, kritik: true, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 22301:2019 Madde 7.2', 'BS ISO 45002:2023', 'CBCP/MBCI sertifikasyonu'],
    soru: 'Planlama personeli: ISO 22301 uzmanı, afet yöneticisi veya risk analizi sertifikalı uzman görevlendirilmiş mi?',
    rehber: [
      'Hiç yok',
      'Görevlendirilen yönetici var, eğitim almamış',
      'Eğitimli uzman var, sertifika yok',
      'ISO 22301 / CBCP sertifikalı uzman ve iç denetçi mevcut',
    ],
  },
  {
    kod: 'Y27', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['Çalışanların İSG Eğitimleri Yönetmeliği', 'ISO 45001:2023 Madde 7.2', 'AFAD Tatbikatlar Yönetmeliği'],
    soru: 'Yönetici ve personele yönelik düzenli afet yönetimi eğitimi ve farkındalık programı uygulanıyor mu?',
    rehber: [
      'Hiç yapılmıyor',
      'İşe girişte tek seferlik yapılıyor',
      'Yılda bir kez kapsamlı eğitim',
      'Yılda 2+ kez farklı senaryo, kayıt altında, katılım takip ediliyor',
    ],
  },
  {
    kod: 'Y28', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: true, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 22398:2013', 'AFAD Tatbikatlar Yönetmeliği', 'ISO 22301:2019 Madde 8.5'],
    soru: 'Düzenli tatbikat: masa başı ve tam saha tatbikatları yapılıyor, öğrenilen dersler kayıt altına alınıyor mu?',
    rehber: [
      'Hiç tatbikat yapılmıyor',
      'Yılda bir masa başı tatbikatı',
      'Yılda bir saha tatbikatı',
      'Yılda 2+ farklı senaryo, AAR (tatbikat sonrası değerlendirme) kayıtlı',
    ],
  },
  {
    kod: 'Y29', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['İşyerlerinde Acil Durumlar Yönetmeliği', 'AFAD Arama ve Kurtarma Yönetmeliği'],
    soru: 'Aktif Acil Durum Ekipleri (ADE): görev tanımı, iletişim hiyerarşisi ve 7/24 ulaşılabilirlik sağlanmış mı?',
    rehber: [
      'ADE yok',
      'ADE var, görev tanımı belirsiz',
      'ADE ve görev tanımı var, tatbikat yapılmamış',
      'ADE aktif, tatbikat yapılmış, iletişim hiyerarşisi 7/24 geçerli',
    ],
  },
  {
    kod: 'Y30', bolum: 'KAPASİTE', boyut: 'C', agirlik: 2, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['İşyerlerinde Acil Durumlar Yönetmeliği', 'ISO 45001:2023 Madde 7.4'],
    soru: 'Dezavantajlı çalışanları kapsayan özel tahliye prosedürü (engelli, hamile, yabancı uyruklu) var mı?',
    rehber: [
      'Hiç yok',
      'Yalnızca sözlü taahhüt',
      'Yazılı prosedür var, uygulanmamış',
      'Uygulamalı tatbikat yapılmış, aktif politika',
    ],
  },
  {
    kod: 'Y31', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['PD ISO-TS 22330:2018 (İnsan Unsuru)', 'ISO 45003:2021 (Psikolojik Güvenlik)'],
    soru: 'Afet sonrası çalışan psikolojik iyileşme ve refah programı mevcut mu?',
    rehber: [
      'Program yok',
      'Sadece EAP (çalışan yardım programı) var',
      'Kriz psikolojik destek protokolü tanımlanmış',
      'Uzman psikolog desteği, yeniden işe dönüş programı aktif',
    ],
  },
  {
    kod: 'Y32', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 10002:2018 (Müşteri Şikâyeti)', 'ISO 22301:2019 Madde 7.4 (iletişim)'],
    soru: 'Tedarikçi ve taşeron firmalarla ortak acil durum tatbikatları ve bilgi paylaşım platformu var mı?',
    rehber: [
      'Hiç yok',
      'Tedarikçilerle acil durum iletişim listesi paylaşılmış',
      'Yılda bir ortak masa başı tatbikatı yapılıyor',
      'Çeyreklik ortak tatbikat + paylaşılan acil durum prosedürleri mevcut',
    ],
  },

  // ── BT ve Veri Güvenliği (Y33-Y37) ────────────────────────────
  {
    kod: 'Y33', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: true, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['BS ISO-IEC 27035-1:2023 (Olay Müdahale)', 'BS EN ISO-IEC 27005:2024', 'BS ISO-IEC 27031:2025'],
    soru: 'OT/BT siber güvenlik: ağ segmentasyonu, yama yönetimi, sızma testi ve olay müdahale planı mevcut mu?',
    rehber: [
      'Hiçbiri yok',
      'Temel firewall, yama yönetimi eksik',
      'Segmentasyon + yama yönetimi var, sızma testi yok',
      'Tüm önlemler + ICS/SCADA özel güvenlik, yılda 1+ sızma testi',
    ],
  },
  {
    kod: 'Y34', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['BS ISO-IEC 27031:2025 (ICT DR)', 'ISO 22301:2019 Madde 8.7'],
    soru: 'Üretim ve operasyon verilerinin yedekleme sıklığı, saklama konumu (offsite/bulut) ve kurtarma testi durumu?',
    rehber: [
      'Yedekleme yok',
      'Yedekleme var, test edilmemiş, aynı lokasyonda',
      'Yedekleme var, offsite/bulut, kurtarma testi yapılmadı',
      'Günlük yedekleme, offsite + bulut, RTO test edildi ve karşılandı',
    ],
  },
  {
    kod: 'Y35', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 22301:2019 Madde 8.4 (manuel süreklilik)', 'BS ISO-IEC 24762:2008'],
    soru: 'Dijital sistemler arızasında üretimin manuel olarak belirli bir kapasitede sürdürülmesi için prosedür var mı?',
    rehber: [
      'Manuel üretim imkânsız, prosedür yok',
      'Teorik olarak mümkün ama nasıl yapılacağı bilinmiyor',
      'Prosedür var, personel eğitilmemiş',
      'Prosedür var, personel eğitilmiş ve tatbikat yapılmış',
    ],
  },
  {
    kod: 'Y36', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['BS EN ISO-IEC 27701:2025 (Gizlilik)', 'BS EN ISO-IEC 27017:2021 (Bulut Güvenliği)'],
    soru: 'Bulut ve SaaS hizmetlerinin iş sürekliliği senaryolarına entegrasyonu ve SLA yönetimi nasıldır?',
    rehber: [
      'Bulut bağımlılığı fark edilmemiş, SLA takibi yok',
      'Temel SLA takibi var, sürekliliğe entegrasyon yok',
      'SLA izleniyor, alternatif hizmet sağlayıcı araştırılmış',
      'Çoklu bulut/hibrit yapı, sürekliliğe entegre SLA yönetimi aktif',
    ],
  },
  {
    kod: 'Y37', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: true, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['BS ISO-IEC 27036-1:2021 (Tedarikçi Güvenliği)', 'BS ISO-IEC 27036-3:2023'],
    soru: 'Kritik yazılım/donanım tedarikçilerinin güvenlik ve süreklilik koşullarını karşılamaktaki durumu nasıl?',
    rehber: [
      'Tedarikçi güvenlik değerlendirmesi hiç yapılmıyor',
      'Temel anket bazlı değerlendirme yapılıyor',
      'Sözleşme bazlı güvenlik şartları belirlenmiş',
      'Bağımsız denetim veya sertifika şartı uygulanıyor, izleme aktif',
    ],
  },

  // ── İletişim ve Koordinasyon (Y38-Y42) ────────────────────────
  {
    kod: 'Y38', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 22301:2019 Madde 7.4', 'PD ISO-TS 22331:2018 (Kriz İletişimi)'],
    soru: 'Kriz iletişim stratejisi, medya sözcüsü ve paydaş bilgilendirme şablonları hazır mı?',
    rehber: [
      'Hiç yok',
      'Sözcü belirsiz, strateji yok',
      'Strateji var, sözcü atanmamış',
      'Strateji + sözcü + hazır şablon mesajlar, tatbikat yapılmış',
    ],
  },
  {
    kod: 'Y39', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['Afet ve Acil Durum Müdahale Hizmetleri Yönetmeliği', 'AFAD AADY 2025', 'Afet ve Acil Durum Yönetim Merkezleri Yönetmeliği'],
    soru: 'AFAD, OSB Yönetimi, belediye ve sağlık kuruluşlarıyla aktif koordinasyon ve karşılıklı yardım protokolleri var mı?',
    rehber: [
      'Hiç koordinasyon yok',
      'Koordinasyon bilinci var, resmi protokol yok',
      'Bazı kurumlarla iletişim kurulmuş',
      'Resmi MoU/protokoller imzalanmış, ortak tatbikat yapılmış',
    ],
  },
  {
    kod: 'Y40', bolum: 'KAPASİTE', boyut: 'C', agirlik: 2, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['AFAD AADY 2025', 'Büyükşehir Belediyeleri Afet Yatırımları Yönetmeliği'],
    soru: 'Tesisin topluma sağlayabileceği afet sonrası destek kapasitesi (alan, ekipman, araç) tanımlanmış mı?',
    rehber: [
      'Hiç belirlenmemiş',
      'Fikir aşamasında',
      'Kayıt altına alınmış, resmi protokol yok',
      'AFAD/Kızılay ile resmi koordinasyon anlaşması imzalanmış',
    ],
  },
  {
    kod: 'Y41', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 22301:2019 Madde 8.4', 'ISO 22313:2020'],
    soru: 'Afet için finansal koruma: kapsamlı sigorta, iş durması sigortası ve acil nakit fon rezervi var mı?',
    rehber: [
      'Hiç yok',
      'Yalnızca temel bina sigortası',
      'Kapsamlı sigorta var, iş durması dahil değil',
      'Sigorta + iş durması + nakit fon rezervi, aktif izleme',
    ],
  },
  {
    kod: 'Y42', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 20400:2017 (Sürdürülebilir Tedarik)', 'BS ISO 20400:2017'],
    soru: 'Tedarikçi ve taşeron firmaların afet/acil durum hazırlık düzeyi değerlendiriliyor ve izleniyor mu?',
    rehber: [
      'Hiç değerlendirilmiyor',
      'Farkındalık var, resmi değerlendirme yok',
      'Anket veya öz bildirim bazlı değerlendirme yapılıyor',
      'Bağımsız denetim veya sertifika şartı uygulanıyor',
    ],
  },

  // ── Öğrenen Organizasyon ve Sürekli İyileştirme (Y43-Y50) ─────
  {
    kod: 'Y43', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 22301:2019 Madde 10 (iyileştirme)', 'ISO 9001:2015+A1:2024 Madde 10.3'],
    soru: 'Geçmiş olaylar, tatbikat bulguları ve dış denetim önerilerinden sistematik ders çıkarma süreci aktif mi?',
    rehber: [
      'Hiç yapılmıyor',
      'Nadiren yapılıyor, takip yok',
      'Raporlanıyor, düzeltici aksiyon süreci başlatılıyor',
      'Kurumsal hafıza sistemi aktif, PDCA döngüsü kapanıyor',
    ],
  },
  {
    kod: 'Y44', bolum: 'KAPASİTE', boyut: 'C', agirlik: 2, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['BS ISO 22316:2017 (Örgütsel Dayanıklılık)', 'ISO 22301:2019 Madde 10'],
    soru: 'Risk yönetiminde PDCA döngüsü ve sürekli iyileştirme kültürü yerleşmiş mi?',
    rehber: [
      'PDCA kavramı bilinmiyor',
      'Kısmen uygulanıyor, döngü tamamlanmıyor',
      'Çoğunlukla uygulanıyor',
      'Tam döngü, KPI izleme ve yönetim gözden geçirmesiyle sürekli iyileştirme',
    ],
  },
  {
    kod: 'Y45', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 45001:2023 Madde 10.2 (near-miss)', 'BS ISO 45002:2023', 'BS ISO 45003:2021'],
    soru: 'Çalışanlar "neredeyse kaza/near-miss" olaylarını raporlamaktan çekinmeden bildiriyor mu?',
    rehber: [
      'Raporlama yok, kültür suçlama odaklı',
      'Nadiren bildiriliyor, sistem var ama işlemiyor',
      'Raporlama var, kısmi geri bildirim sağlanıyor',
      'Aktif near-miss kültürü, her olay analiz ediliyor, geri bildirim hızlı',
    ],
  },
  {
    kod: 'Y46', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    siniflar: [1, 2],
    mevzuat: ['ISO 19443:2022+A1:2024', 'ISO 28000:2022+A1:2024', 'BS ISO-IEC 20243-1:2023'],
    soru: 'Tedarik zinciri güvenliği ve bütünlüğü: tedarikçi davranış kuralları, etik tedarik ve izleme mekanizması var mı?',
    rehber: [
      'Hiç yok',
      'Temel davranış kuralları sözleşmelere eklendi',
      'Yıllık tedarikçi değerlendirmesi yapılıyor',
      'Sürekli izleme, bağımsız denetim ve sertifika şartı uygulanıyor',
    ],
  },
  {
    kod: 'Y47', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: true, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['BS EN IEC 31010:2019 (Risk Değerlendirme Teknikleri)', 'BS ISO 31000:2018'],
    soru: 'Yılda en az bir kez kapsamlı risk değerlendirmesi güncelleniyor ve yönetim onayından geçiyor mu?',
    rehber: [
      'Risk değerlendirmesi hiç yapılmamış',
      'Bir kez yapılmış, güncellenmedi',
      'Güncelleme yapılıyor ancak yönetim onayı yok',
      'Yılda 1+ kapsamlı güncelleme, yönetim onayı ve eylem planı hazır',
    ],
  },
  {
    kod: 'Y48', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 22316:2017', 'PD ISO-TS 22317:2021 (İş Etki Analizi)'],
    soru: 'İş Etki Analizi (BIA) tamamlanmış ve kritik ürün/hizmet ile maksimum tolere edilebilir kesinti (MTPD) tanımlanmış mı?',
    rehber: [
      'BIA hiç yapılmamış',
      'Kısmi BIA yapılmış, MTPD belirsiz',
      'BIA tamamlanmış, MTPD tanımlı ancak test edilmemiş',
      'BIA tamamlanmış, MTPD test edilmiş, RTO/RPO hedefleri BCP ile uyumlu',
    ],
  },
  {
    kod: 'Y49', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 14001:2015+A1:2024', 'ISO 22301:2019 Madde 4.1 (bağlam)'],
    soru: 'Çevresel ve sosyal sürdürülebilirlik hedefleri acil durum ve iş sürekliliği planlarına entegre edilmiş mi?',
    rehber: [
      'Sürdürülebilirlik planı yok',
      'Sürdürülebilirlik raporlaması var, sürekliliğe entegre değil',
      'Bazı çevre önlemleri BCP ile koordineli',
      'ESG hedefleri BCP ve acil durum planlarına tam entegre',
    ],
  },
  {
    kod: 'Y50', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: true, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['İSG Kurulları Hakkında Yönetmelik', 'İSG Hizmetleri Yönetmeliği', 'ISO 45001:2023 Madde 5.4'],
    soru: 'İSG Kurulu aktif ve etkin çalışıyor mu? Gündemde risk, acil durum ve süreklilik konuları yer alıyor mu?',
    rehber: [
      'İSG Kurulu yok veya hiç toplanmıyor',
      'Yılda 2-3 kez toplanıyor, gündem yüzeysel',
      'Aylık toplantı, gündem var ancak takip yetersiz',
      'Aylık toplantı, kapsamlı gündem, kararlar takip ediliyor ve kapatılıyor',
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // HRO BÖLÜMÜ (HRO1-HRO12)  boyut: HRO
  // ══════════════════════════════════════════════════════════════

  {
    kod: 'HRO1', bolum: 'KAPASİTE', boyut: 'HRO', agirlik: 5, kritik: true, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['BS ISO 22316:2017 (Örgütsel Dayanıklılık)', 'ISO 45001:2023 Madde 5.1'],
    soru: 'Başarısızlığa takıntı: personel "sistemimiz güvenli, sorun olmaz" varsayımından kaçınıyor mu?',
    rehber: [
      'Aşırı güven yaygın, uyarı sinyalleri görmezden geliniyor',
      'Kısmi farkındalık, bazı ekiplerde iyilik',
      'Çoğunlukla dikkatli, kör nokta analizi yapılıyor',
      'Tam farkındalık, zayıf sinyaller aktif olarak aranıyor ve raporlanıyor',
    ],
  },
  {
    kod: 'HRO2', bolum: 'KAPASİTE', boyut: 'HRO', agirlik: 4, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['BS EN IEC 31010:2019 (kök neden analizi teknikleri)', 'ISO 9001:2015+A1:2024 Madde 10.2'],
    soru: 'Basitleştirmeye direnç: tesis, karmaşık sorunları tek bir nedene indirgemekten kaçınıyor mu?',
    rehber: [
      'Kök neden analizi yapılmıyor, tek nedene bağlanıyor',
      'Bazen çok nedenli analiz yapılıyor',
      'Çoğunlukla kök neden analizi uygulanıyor',
      'Sistematik RCA/5-Why uygulanıyor, bulgular organizasyonla paylaşılıyor',
    ],
  },
  {
    kod: 'HRO3', bolum: 'KAPASİTE', boyut: 'HRO', agirlik: 4, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 45001:2023 Madde 5.4 (katılım)', 'BS ISO 45002:2023'],
    soru: 'Operasyona duyarlılık: saha çalışanları anormallik gördüklerinde üretimi durdurma yetkisine sahip mi?',
    rehber: [
      'Saha yetkisi yok, üretim her şeyin önünde',
      'Teorik yetki var, uygulanmıyor',
      'Kısmi yetki, bazı koşullarda kullanılabiliyor',
      'Tam yetki, saha durdurma kararları destekleniyor ve ödüllendiriliyor',
    ],
  },
  {
    kod: 'HRO4', bolum: 'KAPASİTE', boyut: 'HRO', agirlik: 4, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['BS ISO 22316:2017', 'ISO 22301:2019 Madde 10'],
    soru: 'Dayanıklılığa bağlılık: tesis beklenmedik olaylardan hızlı toparlanma kapasitesi geliştiriyor mu?',
    rehber: [
      'Toparlanma planı yok, reaktif yaklaşım',
      'Kısmi toparlanma planı',
      'Toparlanma planı var, test edilmemiş',
      'Toparlanma planı test edilmiş, çabuk toparlanma tatbikatları yapılıyor',
    ],
  },
  {
    kod: 'HRO5', bolum: 'KAPASİTE', boyut: 'HRO', agirlik: 4, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['BS ISO 22316:2017', 'ISO 45003:2021 (Liderlik ve Psikolojik Güvenlik)'],
    soru: 'Uzmanlığa saygı: kriz anında karar en üst kademeden değil en bilgili kişiden mi alınıyor?',
    rehber: [
      'Her zaman hiyerarşi, uzman görüşü görmezden geliniyor',
      'Bazen uzman görüşüne başvuruluyor',
      'Genellikle uzman öncülüğünde karar',
      'Kriz anında karar her zaman en yetkili uzmana devrediliyor, kültür yerleşmiş',
    ],
  },
  {
    kod: 'HRO6', bolum: 'KAPASİTE', boyut: 'HRO', agirlik: 4, kritik: false, ters: false,
    siniflar: [1, 2],
    mevzuat: ['ISO 9001:2015+A1:2024 (Kaizen)', 'BS ISO 45002:2023'],
    soru: 'Yalın düşünce (Lean): tesis, afet hazırlığında israfı (waste) tanımlıyor ve sistematik olarak elimine ediyor mu?',
    rehber: [
      'İsraf analizi yok, kaynaklar verimsiz kullanılıyor',
      'Bazı süreçlerde iyileştirme var, sistematik değil',
      'Periyodik value stream mapping yapılıyor',
      'Sürekli iyileştirme (Kaizen) kültürü var, afet planları da dahil',
    ],
  },
  {
    kod: 'HRO7', bolum: 'KAPASİTE', boyut: 'HRO', agirlik: 4, kritik: false, ters: false,
    siniflar: [1, 2],
    mevzuat: ['ISO 9001:2015+A1:2024 (DMAIC)', 'BS EN IEC 31010:2019'],
    soru: 'Six Sigma kalite: kritik güvenlik proseslerinde değişkenlik (varyasyon) ölçülüyor ve kontrol altında tutuluyor mu?',
    rehber: [
      'Güvenlik proseslerinde kalite ölçümü yok',
      'Temel ölçümler var, analiz yapılmıyor',
      'SPC (istatistiksel proses kontrol) kısmi uygulanıyor',
      'DMAIC döngüsü aktif, Cpk değerleri takip ediliyor',
    ],
  },
  {
    kod: 'HRO8', bolum: 'KAPASİTE', boyut: 'HRO', agirlik: 5, kritik: true, ters: false,
    siniflar: [1, 2],
    mevzuat: ['ISO 22301:2019 Madde 8.3 (TOC)', 'BS ISO 22316:2017'],
    soru: 'Kısıt yönetimi (TOC): tesisin afet müdahale kapasitesindeki en kritik darboğaz (constraint) tanımlanmış mı?',
    rehber: [
      'Darboğaz analizi hiç yapılmamış',
      'Sezgisel olarak biliniyor, belgelenmemiş',
      'Kısıt tanımlanmış, iyileştirme planı yok',
      'Kısıt tanımlanmış, subordinate edilmiş ve sürekli izleniyor (TOC 5 adım)',
    ],
  },
  {
    kod: 'HRO9', bolum: 'KAPASİTE', boyut: 'HRO', agirlik: 4, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['BS ISO 45003:2021 (Blame-Free Kültür)', 'ISO 45001:2023 Madde 10.2'],
    soru: 'Sistem düşüncesi: tesis, olayları bireysel hatalar yerine sistem zayıflıkları olarak mı değerlendiriyor?',
    rehber: [
      'Her kaza bir kişinin suçu, sistem sorgulanmıyor',
      'Bazen sistem faktörleri de değerlendiriliyor',
      'Çoğunlukla Swiss Cheese / sistem modeli kullanılıyor',
      'Blame-free kültür yerleşmiş, sistemik kök neden analizi standart',
    ],
  },
  {
    kod: 'HRO10', bolum: 'KAPASİTE', boyut: 'HRO', agirlik: 4, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['ISO 22301:2019 Madde 10 (Agile Review)', 'BS ISO 22316:2017'],
    soru: 'Çevik toparlanma (Agile Resilience): tesis, büyük planlar yerine kısa döngülerle (sprint) iyileşme yapıyor mu?',
    rehber: [
      'Yıllık plan var, hiç güncellenmüyor',
      'Yılda bir güncelleme yapılıyor',
      'Çeyreklik gözden geçirme ve güncelleme',
      'Aylık sprint döngüsü: plan → uygula → ölç → güncelle, retrospektif yapılıyor',
    ],
  },
  {
    kod: 'HRO11', bolum: 'KAPASİTE', boyut: 'HRO', agirlik: 4, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['BS ISO 22316:2017 Madde 7 (Öğrenme)', 'ISO 22301:2019 Madde 9.1'],
    soru: 'Öğrenen organizasyon: sektördeki kazalar ve olaylar (benchmarking) sistematik olarak takip edilip ders çıkarılıyor mu?',
    rehber: [
      'Dış olay takibi yok',
      'Sektör haberlerini takip ediyoruz, sistematik değil',
      'Sektör olay veri tabanı veya bülten takibi yapılıyor',
      'Sektör olayları kök neden analiziyle değerlendiriliyor, iç uygulamalara yansıtılıyor',
    ],
  },
  {
    kod: 'HRO12', bolum: 'KAPASİTE', boyut: 'HRO', agirlik: 3, kritik: false, ters: false,
    siniflar: [1, 2, 3],
    mevzuat: ['BS ISO 45003:2021', 'PD ISO-TS 22330:2018 (İnsan ve Kültür)'],
    soru: 'Güvenlik kültürü ölçümü: güvenlik iklimi anketleri düzenli yapılıyor ve sonuçlar iyileştirme planına dönüşüyor mu?',
    rehber: [
      'Güvenlik kültürü ölçülmüyor',
      'Yılda bir genel memnuniyet anketi var, güvenlik boyutu yok',
      'Güvenlik iklimi anketi yapılıyor, bulgular paylaşılıyor',
      'Düzenli güvenlik kültürü anketi, sonuçlar yönetim tarafından gözden geçiriliyor ve eylem planına dönüşüyor',
    ],
  },
]

// ── Bölüm filtreleri ──────────────────────────────────────────
export const SORULAR_SANAYI_H    = SORULAR_SANAYI.filter(s => s.bolum === 'TEHLİKE')
export const SORULAR_SANAYI_F    = SORULAR_SANAYI.filter(s => s.bolum === 'KIRILGANLIK')
export const SORULAR_SANAYI_C    = SORULAR_SANAYI.filter(s => s.bolum === 'KAPASİTE' && s.boyut !== 'HRO')
export const SORULAR_SANAYI_HRO  = SORULAR_SANAYI.filter(s => s.boyut === 'HRO')

// ── Sınıf bazlı filtre yardımcısı ────────────────────────────
export function sorularBySinif(sinif: 1 | 2 | 3): SoruSanayi[] {
  return SORULAR_SANAYI.filter(s => s.siniflar.includes(sinif))
}

// ── Tesis Kimlik Envanter ─────────────────────────────────────
export const TESIS_ENVANTER: TesisEnvanterAlani[] = [
  { kod: 'E01', label: 'Firma Adı ve Ünvanı', tip: 'text', zorunlu: true },
  { kod: 'E02', label: 'Ticaret Sicil No', tip: 'text', zorunlu: false },
  { kod: 'E03', label: 'NACE Kodu', tip: 'text', zorunlu: true, aciklama: 'Örn: 20.13 — sistem otomatik tehlike sınıfını belirler' },
  { kod: 'E04', label: 'ISG Tehlike Sınıfı', tip: 'select', zorunlu: true, secenek: ['1 — Çok Tehlikeli', '2 — Tehlikeli', '3 — Az Tehlikeli'] },
  { kod: 'E05', label: 'Faaliyet Tanımı', tip: 'text', zorunlu: false },
  { kod: 'E06', label: 'Üretilen Ürünlerin Stratejik Önemi', tip: 'select', zorunlu: false, secenek: ['Ticari (yerel)', 'Bölgesel', 'Ulusal', 'Global / İhracat'] },
  { kod: 'E07', label: 'Yıllık İhracat Cirosu (USD)', tip: 'select', zorunlu: false, secenek: ['İhracat yok', '< 500K', '500K – 5M', '5M – 50M', '> 50M'] },
  { kod: 'E08', label: 'Organize Sanayi Bölgesi İçinde mi?', tip: 'checkbox', zorunlu: false },
  { kod: 'E09', label: 'Beyaz Yaka Çalışan Sayısı', tip: 'number', zorunlu: false },
  { kod: 'E10', label: 'Mavi Yaka Çalışan Sayısı', tip: 'number', zorunlu: true },
  { kod: 'E11', label: 'Vardiya Sayısı', tip: 'select', zorunlu: false, secenek: ['1 vardiya', '2 vardiya', '3 vardiya (7/24)'] },
  { kod: 'E12', label: 'Konum (Enlem / Boylam)', tip: 'koordinat', zorunlu: true },
  { kod: 'E13', label: 'İlçe', tip: 'text', zorunlu: true },
  { kod: 'E14', label: 'Binanın Kullanım Amacı', tip: 'multiselect', zorunlu: false, secenek: ['Üretim', 'Depo', 'Ofis / İdari', 'Mağaza / Showroom'] },
  { kod: 'E15', label: 'İnşa Tipi', tip: 'select', zorunlu: true, secenek: ['Betonarme', 'Çelik', 'Prefabrik', 'Kârgir', 'Ahşap'] },
  { kod: 'E16', label: 'İnşa Tarihi (Yıl)', tip: 'number', zorunlu: true },
  { kod: 'E17', label: 'Yapı Kullanım Belgesi (İskan)', tip: 'select', zorunlu: false, secenek: ['Var', 'Yok', 'Başvuruda'] },
  { kod: 'E18', label: 'Sahiplik Durumu', tip: 'select', zorunlu: false, secenek: ['Mülk Sahibi', 'Kiracı'] },
  { kod: 'E19', label: 'Kapalı Alan (m²)', tip: 'number', zorunlu: false },
  { kod: 'E20', label: 'Açık Alan (m²)', tip: 'number', zorunlu: false },
  { kod: 'E21', label: 'Mimari Proje', tip: 'belge', zorunlu: false },
  { kod: 'E22', label: 'Taşıyıcı Sistem Proje Çizimleri', tip: 'belge', zorunlu: false },
  { kod: 'E23', label: 'Taşıyıcı Sistem Proje Hesap Dosyası', tip: 'belge', zorunlu: false },
  { kod: 'E24', label: 'Onaylı Projeden Sonra Eklenti Yapılmış mı?', tip: 'select', zorunlu: false, secenek: ['Hayır', 'Evet — kayıt altında', 'Evet — kayıtsız'] },
  { kod: 'E25', label: 'Onarım ve/veya Güçlendirme Çalışması', tip: 'belge', zorunlu: false },
  { kod: 'E26', label: 'Zemin Sınıflaması (TBDY)', tip: 'select', zorunlu: false, secenek: ['ZA', 'ZB', 'ZC', 'ZD', 'ZE', 'ZF', 'Bilinmiyor'] },
  { kod: 'E27', label: 'Zemin Etüt Çalışması', tip: 'belge', zorunlu: false },
  { kod: 'E28', label: 'Binanın Yapısal Durumu (genel kanı)', tip: 'select', zorunlu: false, secenek: ['1 — Çok Kötü', '2 — Kötü', '3 — İyi', '4 — Çok İyi'] },
  { kod: 'E29', label: 'Riskli Girdi (hammadde)', tip: 'text', zorunlu: false },
  { kod: 'E30', label: 'Riskli Proses / Süreç', tip: 'text', zorunlu: false },
  { kod: 'E31', label: 'Riskli Ürün', tip: 'text', zorunlu: false },
  { kod: 'E32', label: 'Riskli Depolama', tip: 'text', zorunlu: false },
  { kod: 'E33', label: 'Riskli Atık', tip: 'text', zorunlu: false },
  { kod: 'E34', label: 'Riskli Makine-Ekipman', tip: 'text', zorunlu: false },
  { kod: 'E35', label: 'Riskli Lojistik (tedarik/nakliye)', tip: 'text', zorunlu: false },
  { kod: 'E36', label: 'İşyeri Sigortası', tip: 'select', zorunlu: false, secenek: ['Yok', 'Temel (bina)', 'Kapsamlı', 'Kapsamlı + İş Durması'] },
]

export const DESTEK_KAPASITESI: DestekKapasite[] = [
  { kod: 'D01', label: 'Tesis Alanı Afet Sonrası Destek Tesisi Olarak Kullanılabilir mi?', tip: 'checkbox' },
  { kod: 'D02', label: 'Barındırma Kapasitesi (kişi)', tip: 'number', birim: 'kişi' },
  { kod: 'D03', label: 'Kullanım Amaçları', tip: 'select', secenek: ['İncinebilir nüfus', 'Kritik altyapı destek tesisi', 'Lojistik üs'] },
  { kod: 'D04', label: 'Seyyar Jeneratör', tip: 'number', birim: 'adet' },
  { kod: 'D05', label: 'Forklift', tip: 'number', birim: 'adet' },
  { kod: 'D06', label: 'Seyyar Vinç', tip: 'number', birim: 'adet' },
  { kod: 'D07', label: 'Kamyon', tip: 'number', birim: 'adet' },
  { kod: 'D08', label: 'Soğuk Zincir Taşımacılığı Aracı', tip: 'number', birim: 'adet' },
  { kod: 'D09', label: 'Konteyner', tip: 'number', birim: 'adet' },
  { kod: 'D10', label: 'Çadır', tip: 'number', birim: 'adet' },
  { kod: 'D11', label: 'Prefabrik Yapı', tip: 'number', birim: 'adet' },
  { kod: 'D12', label: 'Transpalet', tip: 'number', birim: 'adet' },
  { kod: 'D13', label: 'Beton Kırıcı', tip: 'number', birim: 'adet' },
  { kod: 'D14', label: 'Medikal Ekipman / Cihaz', tip: 'checkbox' },
  { kod: 'D15', label: 'Hazır Yemek Üretim Kapasitesi', tip: 'number', birim: 'öğün/gün' },
  { kod: 'D16', label: 'Gıda Malzemesi (Un/Şeker/Yağ)', tip: 'checkbox' },
  { kod: 'D17', label: 'İçme Suyu Depolama', tip: 'number', birim: 'litre' },
  { kod: 'D18', label: 'İlkyardım Sertifikalı Personel', tip: 'number', birim: 'kişi' },
  { kod: 'D19', label: 'Yangın Söndürme Eğitimli Personel', tip: 'number', birim: 'kişi' },
  { kod: 'D20', label: 'USAR (Arama-Kurtarma) Eğitimli Personel', tip: 'number', birim: 'kişi' },
  { kod: 'D21', label: 'ISO 22301 Sertifikalı Uzman', tip: 'number', birim: 'kişi' },
  { kod: 'D22', label: 'Siber Güvenlik / OT Uzmanı', tip: 'number', birim: 'kişi' },
]

export const SANAYI_SORU_META = {
  toplam: 104,
  t: 20, s: 22, y: 50, hro: 12,
  envanter_alani: 36, destek_kalemi: 22,
  sinif_1_toplam: SORULAR_SANAYI.filter(s => s.siniflar.includes(1)).length,
  sinif_2_toplam: SORULAR_SANAYI.filter(s => s.siniflar.includes(2)).length,
  sinif_3_toplam: SORULAR_SANAYI.filter(s => s.siniflar.includes(3)).length,
  kaynaklar: [
    'HIFYEA Metodolojisi v4.0', 'ISO 22301:2019+A1:2024', 'ISO 45001:2023',
    'ISO 31000:2018', 'BS EN IEC 31010:2019', 'İSG Kanunu 6331',
    'Büyük Endüstriyel Kazalar Yönetmeliği (Seveso III)', 'AFAD AADY 2025',
    'Binaların Yangından Korunması Yönetmeliği', 'ISO 50001:2018', 'ISO 28000:2022',
    'BS ISO-IEC 27031:2025', 'BS ISO 22316:2017', 'BS ISO 45003:2021',
    'TOC / HRO / Lean Six Sigma Sentezi', 'TBDY 2018',
  ],
  sektor: 'uretim', versiyon: '4.0', tarih: '2026-04-01',
}
