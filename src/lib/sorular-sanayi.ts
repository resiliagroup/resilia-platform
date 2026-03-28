// ═══════════════════════════════════════════════════════════════
//  OMNI Platform — Sanayi Tesisleri HIFYEA Soru Seti
//  HIFYEA Metodolojisi: H·F×E·Y·A (Tehlike·Savunmasızlık·Yönetilebilirlik)
//  ISO 22301 · AFAD AADY 2025 · TOC · HRO Sentezi
//  Toplam: 63 soru — H:8, F×E:15, C:35, HRO:5
// ═══════════════════════════════════════════════════════════════

import type { Soru } from './sorular'
export type { Soru }

// Genişletilmiş tip — formun Soru[] uyumluluğunu korur
export type SoruSanayi = Soru & {
  boyut: 'H' | 'F' | 'E' | 'C' | 'HRO'
  natech_flag?: boolean
}

// Tesis Kimlik & Yapısal Envanter (URI hesabına dahil değil — kalıcı tesis verisi)
export type TesisEnvanterAlani = {
  kod: string
  label: string
  tip: 'text' | 'number' | 'select' | 'checkbox' | 'belge' | 'koordinat' | 'multiselect'
  zorunlu: boolean
  secenek?: string[]
  aciklama?: string
}

// Destek Kapasitesi (URI hesabına dahil değil — İSO kaynak havuzu)
export type DestekKapasite = {
  kod: string
  label: string
  tip: 'number' | 'checkbox' | 'select'
  birim?: string
  aciklama?: string
  secenek?: string[]
}

export const SORULAR_SANAYI: SoruSanayi[] = [

  // ══════════════════════════════════════════════════════════════
  // BÖLÜM 1 — TEHLİKE (T1-T8)  ·  boyut: H
  // Dış tehlike kaynakları ve tesisin maruz kaldığı risk yoğunluğu
  // ══════════════════════════════════════════════════════════════

  {
    kod: 'T1', bolum: 'TEHLİKE', boyut: 'H', agirlik: 5, kritik: true, ters: true,
    natech_flag: true,
    soru: 'Tesisin bulunduğu bölgenin deprem tehlike haritasındaki ivme değeri ve tarihsel deprem tekerrür sıklığı nedir?',
    rehber: [
      'DD-2 ivmesi < 0.1g, son 50 yılda hiç M5+ deprem yok',
      'DD-2 ivmesi 0.1–0.3g, seyrek M5+ deprem geçmişi',
      'DD-2 ivmesi 0.3–0.5g, bölgede M6+ deprem deneyimi var',
      'DD-2 ivmesi > 0.5g, aktif fay hattı yakınında, M7+ deprem riski yüksek',
    ],
  },
  {
    kod: 'T2', bolum: 'TEHLİKE', boyut: 'H', agirlik: 4, kritik: false, ters: true,
    soru: 'Tesisin bulunduğu havzanın taşkın/sel tehlike derecesi ve tekerrür periyodu nedir?',
    rehber: [
      'Taşkın alanı dışında, Q500 sınırının ötesinde',
      'Q100 dışında ama Q500 içinde',
      'Q100 taşkın alanı içinde',
      'Q50 veya daha sık tekerrürlü taşkın alanında',
    ],
  },
  {
    kod: 'T3', bolum: 'TEHLİKE', boyut: 'H', agirlik: 5, kritik: true, ters: true,
    natech_flag: true,
    soru: 'Tesiste üretilen, kullanılan veya depolanan tehlikeli maddelerin NATECH (Doğal Afet Kaynaklı Teknolojik Kaza) potansiyeli nedir?',
    rehber: [
      'Tehlikeli madde yok, NATECH riski minimal',
      'Küçük miktarda tehlikeli madde var, Seveso eşiği altında',
      'Önemli miktarda tehlikeli madde, alt eşik Seveso',
      'Büyük miktarda tehlikeli madde, üst eşik Seveso / COMAH kapsamında',
    ],
  },
  {
    kod: 'T4', bolum: 'TEHLİKE', boyut: 'H', agirlik: 5, kritik: true, ters: true,
    natech_flag: true,
    soru: 'Tesis içi yangın ve patlama tehlikesi yoğunluğu nasıldır? (NACE kodu, proses sıcaklığı, basınçlı ekipman)',
    rehber: [
      'Yangın/patlama tehlikesi yok veya ihmal edilebilir düzeyde',
      'Sınırlı yanıcı madde, düşük basınçlı proses',
      'Önemli yangın/patlama potansiyeli, orta basınçlı sistem',
      'Yüksek tehlikeli proses, parlayıcı/patlayıcı madde depolaması, yüksek basınç',
    ],
  },
  {
    kod: 'T5', bolum: 'TEHLİKE', boyut: 'H', agirlik: 3, kritik: false, ters: true,
    soru: 'Komşu tesisler veya çevreden kaynaklanabilecek baskı, kaza ve kirlilik tehdidi var mı?',
    rehber: [
      'İzole konum, çevresel tehdit yok',
      'Düşük riskli komşular, etki minimal',
      'OSB içinde riskli komşu tesis mevcut',
      'Seveso tesisi veya yüksek riskli proses komşuluğu, domino etkisi var',
    ],
  },
  {
    kod: 'T6', bolum: 'TEHLİKE', boyut: 'H', agirlik: 3, kritik: false, ters: true,
    soru: 'Kritik hammadde, enerji veya lojistik tedarikçisinin kesintiye uğrama sıklığı ve olası etki büyüklüğü?',
    rehber: [
      'Çoklu tedarikçi, kesinti hiç yaşanmadı',
      'Ara sıra kısa süreli aksama',
      'Yılda birkaç kez, üretimi etkiliyor',
      'Tek tedarikçi bağımlılığı, kesinti üretimi tamamen durduruyor',
    ],
  },
  {
    kod: 'T7', bolum: 'TEHLİKE', boyut: 'H', agirlik: 4, kritik: true, ters: true,
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
    soru: 'Üretim kesintisinin tedarik zinciri ve stratejik müşterilere zincirleme etkisi ne düzeyde?',
    rehber: [
      'Tesis yerel tedarikçi, ikame kolayca bulunabilir',
      'Bölgesel önemi var, alternatif temin süresi 1-4 hafta',
      'Ulusal tedarik zincirinde kritik, ikamesi zor',
      'Stratejik / ihracat ürünü, global tedarik zinciri etkisi',
    ],
  },
  {
    kod: 'T9', bolum: 'TEHLİKE', boyut: 'H', agirlik: 4, kritik: true, ters: true,
    soru: 'Tesisin bulunduğu bölgede sel, taşkın veya aşırı yağış riski ve son 10 yıldaki tekerrür sıklığı nedir?',
    rehber: [
      'Taşkın alanı dışında, Q500 sınırı ötesinde, hiç su baskını yaşanmadı',
      'Q100 dışında, bölgede seyrek su baskını geçmişi var',
      'Q100 taşkın alanı içinde veya son 10 yılda 1-2 kez su baskını yaşandı',
      'Q50 veya daha sık tekerrürlü taşkın alanı, rutin su baskını problemi var',
    ],
  },
  {
    kod: 'T10', bolum: 'TEHLİKE', boyut: 'H', agirlik: 3, kritik: false, ters: true,
    soru: 'Aşırı sıcak veya soğuk hava dalgaları tesisin üretim kapasitesini ve enerji maliyetlerini nasıl etkiliyor?',
    rehber: [
      'İklim kontrolü tam, aşırı sıcak/soğuk üretimi etkilemiyor',
      'Kısmi etki var, üretim yavaşlıyor ancak durmuyor',
      'Yılda birkaç kez üretim durması veya ciddi enerji maliyeti artışı',
      'Aşırı hava olayları üretimi düzenli olarak durduruyor, soğutma/ısıtma altyapısı yetersiz',
    ],
  },
  {
    kod: 'T11', bolum: 'TEHLİKE', boyut: 'H', agirlik: 3, kritik: false, ters: true,
    soru: 'Tesisin enerji tüketim profili iklim kaynaklı şebeke yükü artışlarına (yaz zirvesi, kış zirvesi) ne kadar duyarlı?',
    rehber: [
      'Yenilenebilir enerji + kendi üretim kapasitesi var, şebekeye bağımlılık düşük',
      'Yedek jeneratör mevcut, kısa süreli kesintiler tolere edilebilir',
      'Şebekeye tam bağımlı, zirve dönemlerinde kesinti yaşandı',
      'Tek hat, yedek yok, enerji kesintisi üretimi hemen durduruyor',
    ],
  },
  {
    kod: 'T12', bolum: 'TEHLİKE', boyut: 'H', agirlik: 4, kritik: true, ters: true,
    soru: 'Tesisin bulunduğu bölgede toplumsal olaylar, grev, sabotaj veya terör saldırısı riski nasıl değerlendiriliyor?',
    rehber: [
      'Düşük risk bölgesi, geçmişte hiç olay yaşanmadı, güvenli sanayi bölgesi',
      'Düşük-orta risk, bölgede nadiren küçük çaplı olaylar yaşanıyor',
      'Orta risk, tesis sektörü veya konumu nedeniyle hedef olabilir, güvenlik önlemleri kısmi',
      'Yüksek risk, kritik altyapı veya stratejik tesis, daha önce güvenlik olayı yaşandı',
    ],
  },
  {
    kod: 'T13', bolum: 'TEHLİKE', boyut: 'H', agirlik: 5, kritik: true, ters: true,
    soru: 'Tesisin tedarik zinciri, üretim ortağı veya ihracat pazarları jeopolitik çatışma veya savaş bölgelerine yakınlık açısından nasıl değerlendiriliyor?',
    rehber: [
      'Tedarik zinciri tamamen iç piyasaya yönelik, jeopolitik etki minimal',
      'Bazı tedarikçi veya pazarlar risk bölgelerine yakın, alternatif mevcut',
      'Kritik hammadde veya ihracat pazarlarının önemli kısmı risk bölgelerinde, ikame zor',
      'Tedarik zinciri veya pazar yapısı doğrudan çatışma bölgesine bağımlı, ciddi kırılganlık',
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // BÖLÜM 2 — SAVUNMASIZLIK / MARUZİYET (S1-S15)  ·  boyut: F/E
  // İç yapısal kırılganlıklar ve tehlikeye maruz kalma düzeyi
  // ══════════════════════════════════════════════════════════════

  {
    kod: 'S1', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 5, kritik: true, ters: true,
    soru: 'Binanın inşa yılı, deprem yönetmeliği uyumu ve yapısal hasar riski nasıl değerlendirilir?',
    rehber: [
      '2019 sonrası, TBDY uyumlu, yapısal değerlendirme tamam',
      '2007-2018 arası, deprem yönetmeliğine uygun',
      '1999-2007 arası, güçlendirme planı var',
      '1999 öncesi, hasarlı veya güçlendirme yapılmamış, yüksek yıkılma riski',
    ],
  },
  {
    kod: 'S2', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 4, kritik: true, ters: true,
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
    soru: 'Afet veya kaza anında çalışanların fiziksel zarar görme riski ve olası can kaybı ihtimali nedir?',
    rehber: [
      'Personel afet anında tesis dışında, risk minimal',
      'Hafif yaralanma olasılığı var, tahliyelerde yetişilebilir',
      'Ağır yaralanma riski mevcut, geç kalınırsa kritik',
      'Can kaybı riski yüksek, 7/24 çalışan var ve kaçış yolu yetersiz',
    ],
  },
  {
    kod: 'S4', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 4, kritik: false, ters: true,
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
    natech_flag: true,
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
    soru: 'OT/BT sistemleri (SCADA, PLC, MES) eski nesil cihaz oranı ve güvenlik açığı seviyesi?',
    rehber: [
      'Sistemler < 5 yıl, güncel yamalar, segmentasyon uygulanmış',
      'Sistemlerin büyük çoğunluğu modern, az sayıda eski cihaz',
      'Önemli oranda eski sistem, yama desteği sona ermiş',
      'Legacy SCADA/PLC yaygın, internet bağlantılı, güvenlik açığı kritik',
    ],
  },
  {
    kod: 'S8', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 3, kritik: false, ters: true,
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
    soru: 'Operasyonun tek bir makine, sistem, process veya kilit kişiye bağımlılık düzeyi?',
    rehber: [
      'Tam paralel kapasite, hiçbir SPOF tespit edilmedi',
      'Kısmi bağımlılık, yedek plan mevcut',
      'Kritik SPOF var, yedek plan hazırlanıyor',
      'Birden fazla kritik SPOF, üretimi tek hata durdurabilir',
    ],
  },
  {
    kod: 'S11', bolum: 'KIRILGANLIK', boyut: 'E', agirlik: 3, kritik: false, ters: true,
    soru: 'Kilit teknik personelin (operatör, usta, mühendis) ani yokluğunda üretim sürekliliği riski?',
    rehber: [
      'Çapraz eğitim tam, tüm pozisyonlar 2+ kişi tarafından yapılabiliyor',
      'Çoğu kritik pozisyon yedekli, birkaç boşluk var',
      'Kritik becerilerde tek kişi bağımlılığı yaygın',
      'Çoğu kritik bilgi tek kişide, işten ayrılma/kaza durumunda üretim durur',
    ],
  },
  {
    kod: 'S12', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 3, kritik: false, ters: true,
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
    soru: 'Olası bir afet veya kaza sonrası tesisin itibar kaybı, müşteri/ortak güven erozyonu riski?',
    rehber: [
      'Güçlü itibar, müşteriler çeşitlendirilmiş, etki minimal',
      'Geçici güven kaybı, 3 ay içinde telafi edilebilir',
      'Ciddi itibar hasarı, uzun süreli müşteri kaybı riski',
      'Kalıcı marka hasarı, kritik kontrat iptali, piyasadan çekilme riski',
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // BÖLÜM 3 — YÖNETİLEBİLİRLİK / KAPASİTE (Y1-Y35)  ·  boyut: C
  // Tesisin hazırlık, müdahale ve süreklilik kapasitesi
  // ══════════════════════════════════════════════════════════════

  // ── Liderlik ve Yönetim (Y1-Y5) ──────────────────────────
  {
    kod: 'Y1', bolum: 'KAPASİTE', boyut: 'C', agirlik: 5, kritik: true, ters: false,
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
    soru: 'TOC mantığıyla kısıt/darboğaz analizi yapılıp üretim süreklilik planı hazırlandı mı?',
    rehber: [
      'Darboğaz analizi yapılmamış',
      'Kısıtlar belirlendi, plan yok',
      'Kısıtlar ve yedek kapasite planı var',
      'TOC döngüsü aktif, darboğaz izleme ve müdahale SOP mevcut',
    ],
  },

  // ── Acil Durum Planlaması (Y6-Y10) ────────────────────────
  {
    kod: 'Y6', bolum: 'KAPASİTE', boyut: 'C', agirlik: 5, kritik: true, ters: false,
    soru: 'Afet ve Acil Durum Yönetim Planı (AADYP) güncel, test edilmiş ve tüm personele duyurulmuş mu?',
    rehber: [
      'Plan yok',
      'Var ama hiç güncellenmemiş ve tatbikat yapılmamış',
      'Plan var, kısmen güncel, tatbikat bekliyor',
      'Güncel, yılda bir test edilmiş, tüm personel biliyor ve erişebiliyor',
    ],
  },
  {
    kod: 'Y7', bolum: 'KAPASİTE', boyut: 'C', agirlik: 5, kritik: true, ters: false,
    soru: 'İş Sürekliliği Planları (BCP): kritik üretim duruşu, tedarik zinciri ve kilit personel senaryoları için hazırlanmış mı?',
    rehber: [
      'BCP yok',
      'Genel BCP var, senaryo bazlı değil',
      'Bazı kritik senaryolar için BCP mevcut',
      'Tüm kritik senaryolar için özelleşmiş BCP, en az yılda bir test edilmiş',
    ],
  },
  {
    kod: 'Y8', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: true, ters: false,
    soru: 'Alternatif üretim yeri (yedek tesis) veya fason üretim anlaşması belirlenmiş ve aktif mi?',
    rehber: [
      'Alternatif tesis veya anlaşma yok',
      'Fikir aşamasında, somut adım atılmamış',
      'Alternatif tesis belirlendi, hazırlanmamış',
      'Alternatif tesis hazır, MoU imzalı ve test edilmiş',
    ],
  },
  {
    kod: 'Y9', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: false, ters: false,
    soru: 'IT Felaket Kurtarma Planı (DRP) ve OT/SCADA kurtarma prosedürü mevcut ve test edilmiş mi? (RTO/RPO tanımlı)',
    rehber: [
      'DRP yok',
      'Plan var, hiç test edilmedi',
      'Masa başı tatbikatı yapıldı',
      'Gerçek ortamda test edildi, RTO/RPO hedefleri karşılandı',
    ],
  },
  {
    kod: 'Y10', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: false, ters: false,
    soru: 'Kritik tedarikçi arızasına karşı onaylı alternatif tedarikçi ve emniyet stoğu stratejisi hazır mı?',
    rehber: [
      'Alternatif tedarikçi veya stok stratejisi yok',
      'Araştırılıyor, henüz somutlaşmadı',
      'Alternatif tedarikçi belirlendi, stok kısmen yeterli',
      'Onaylı 2+ alternatif tedarikçi, sözleşmeli, stok tamlığı izleniyor',
    ],
  },

  // ── Fiziksel Güvenlik Sistemleri (Y11-Y18) ─────────────────
  {
    kod: 'Y11', bolum: 'KAPASİTE', boyut: 'C', agirlik: 5, kritik: true, ters: false,
    soru: 'Yangın algılama, ihbar, sprinkler ve söndürme sistemleri mevcut ve periyodik kontrollü mu?',
    rehber: [
      'Hiç yok',
      'Yalnızca taşınabilir söndürücü var',
      'Algılama + kısmi söndürme sistemi, periyodik kontrol eksik',
      'Tam otomatik sistem (algılama+ihbar+sprinkler), yılda 1+ bakım yapılıyor',
    ],
  },
  {
    kod: 'Y12', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: true, ters: false,
    soru: 'Enerji güvenliği: çift besleme, topraklama, kaçak akım koruması, yedek jeneratör ve UPS mevcut mu?',
    rehber: [
      'Hiçbiri yok',
      'Yalnızca jeneratör var',
      'Jeneratör + UPS + kaçak akım koruması var',
      'Çift besleme hattı dahil tüm sistem mevcut, periyodik bakımlı',
    ],
  },
  {
    kod: 'Y13', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: false, ters: false,
    soru: 'Sel/taşkın önlemleri: su geçirmez bariyer, tahliye pompası, algılama sistemi var mı?',
    rehber: [
      'Hiç yok',
      'Yalnızca pompa var',
      'Pompa + su geçirmez kapı mevcut',
      'Tam sistem: algılama + bariyer + pompa, periyodik test',
    ],
  },
  {
    kod: 'Y14', bolum: 'KAPASİTE', boyut: 'C', agirlik: 5, kritik: true, ters: false,
    natech_flag: true,
    soru: 'NATECH önlem sistemi: kimyasal sızıntı detektörü, otomatik kesme vanası ve güvenli tahliye havalandırması var mı?',
    rehber: [
      'Hiç yok',
      'Yalnızca manuel kesme vanası var',
      'Algılama + manuel kesme mevcut',
      'Otomatik kesme + sızıntı algılama + entegre havalandırma, test edilmiş',
    ],
  },
  {
    kod: 'Y15', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: true, ters: false,
    soru: 'Makine koruma: emniyetli durdurma (ESD), aşırı ısınma koruması ve basınç tahliye valfi mevcut mu?',
    rehber: [
      'Hiç yok',
      'Yalnızca manuel durdurma',
      'Otomatik ESD var, diğerleri eksik',
      'Tam koruma sistemi: ESD + basınç tahliye + sıcaklık koruma, periyodik bakımlı',
    ],
  },
  {
    kod: 'Y16', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    soru: 'Deprem dayanıklılık önlemleri: geoteknik rapor, deprem izolasyon sistemi, raf ve ekipman ankrajları var mı?',
    rehber: [
      'Hiçbiri yok',
      'Yalnızca geoteknik rapor var',
      'Geoteknik + yapısal değerlendirme + kısmi ankraj var',
      'Tümü mevcut: geoteknik + izolasyon + ekipman ankrajları, güncel',
    ],
  },
  {
    kod: 'Y17', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    soru: 'Acil durum yönlendirme, kaçış yolu aydınlatması ve push-bar acil çıkış kapıları periyodik test ediliyor mu?',
    rehber: [
      'Hiç yok',
      'Yalnızca tabelalar var',
      'Yönlendirme + acil aydınlatma var, test eksik',
      'Tam sistem, yılda 1+ saha tatbikatıyla test ediliyor',
    ],
  },
  {
    kod: 'Y18', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    soru: 'Erken uyarı sistemleri (deprem erken uyarı, kimyasal sızıntı, yangın, sel) merkez sistemle entegre mi?',
    rehber: [
      'Hiç yok',
      'Yalnızca lokal alarm',
      'Merkeze bildirim yapılıyor, otomasyon yok',
      'Tam entegre, otomatik alarm ve kapatma devreye giriyor',
    ],
  },

  // ── Personel ve Eğitim (Y19-Y24) ──────────────────────────
  {
    kod: 'Y19', bolum: 'KAPASİTE', boyut: 'C', agirlik: 5, kritik: true, ters: false,
    soru: 'Afet operasyon personeli: ilkyardım, hafif USAR (arama-kurtarma) ve yangın müdahale ekipleri aktif mi?',
    rehber: [
      'Hiç yok',
      'Yalnızca temel ilkyardım sertifikalı personel var',
      'İlkyardım + yangın müdahale ekibi var',
      'Tam ekip: ilkyardım + USAR + yangın + telsiz/sertifikalı, tatbikat yapılmış',
    ],
  },
  {
    kod: 'Y20', bolum: 'KAPASİTE', boyut: 'C', agirlik: 5, kritik: true, ters: false,
    soru: 'Planlama personeli: ISO 22301 uzmanı, afet yöneticisi veya risk analizi sertifikalı uzman görevlendirilmiş mi?',
    rehber: [
      'Hiç yok',
      'Görevlendirilen yönetici var, eğitim almamış',
      'Eğitimli uzman var, sertifika yok',
      'ISO 22301 / CBCP sertifikalı uzman ve iç denetçi mevcut',
    ],
  },
  {
    kod: 'Y21', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    soru: 'Yönetici ve personele yönelik düzenli afet yönetimi eğitimi ve farkındalık programı uygulanıyor mu?',
    rehber: [
      'Hiç yapılmıyor',
      'İşe girişte tek seferlik yapılıyor',
      'Yılda bir kez kapsamlı eğitim',
      'Yılda 2+ kez farklı senaryo, kayıt altında, katılım takip ediliyor',
    ],
  },
  {
    kod: 'Y22', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: true, ters: false,
    soru: 'Düzenli tatbikat: masa başı ve tam saha tatbikatları yapılıyor, öğrenilen dersler kayıt altına alınıyor mu?',
    rehber: [
      'Hiç tatbikat yapılmıyor',
      'Yılda bir masa başı tatbikatı',
      'Yılda bir saha tatbikatı',
      'Yılda 2+ farklı senaryo, AAR (tatbikat sonrası değerlendirme) kayıtlı',
    ],
  },
  {
    kod: 'Y23', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: false, ters: false,
    soru: 'Aktif Acil Durum Ekipleri (ADE): görev tanımı, iletişim hiyerarşisi ve 7/24 ulaşılabilirlik sağlanmış mı?',
    rehber: [
      'ADE yok',
      'ADE var, görev tanımı belirsiz',
      'ADE ve görev tanımı var, tatbikat yapılmamış',
      'ADE aktif, tatbikat yapılmış, iletişim hiyerarşisi 7/24 geçerli',
    ],
  },
  {
    kod: 'Y24', bolum: 'KAPASİTE', boyut: 'C', agirlik: 2, kritik: false, ters: false,
    soru: 'Dezavantajlı çalışanları kapsayan özel tahliye prosedürü (engelli, hamile, yabancı uyruklu) var mı?',
    rehber: [
      'Hiç yok',
      'Yalnızca sözlü taahhüt',
      'Yazılı prosedür var, uygulanmamış',
      'Uygulamalı tatbikat yapılmış, aktif politika',
    ],
  },

  // ── BT ve Veri Güvenliği (Y25-Y27) ────────────────────────
  {
    kod: 'Y25', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: true, ters: false,
    soru: 'OT/BT siber güvenlik: ağ segmentasyonu, yama yönetimi, sızma testi ve olay müdahale planı mevcut mu?',
    rehber: [
      'Hiçbiri yok',
      'Temel firewall, yama yönetimi eksik',
      'Segmentasyon + yama yönetimi var, sızma testi yok',
      'Tüm önlemler + ICS/SCADA özel güvenlik, yılda 1+ sızma testi',
    ],
  },
  {
    kod: 'Y26', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: false, ters: false,
    soru: 'Üretim ve operasyon verilerinin yedekleme sıklığı, saklama konumu (offsite/bulut) ve kurtarma testi durumu?',
    rehber: [
      'Yedekleme yok',
      'Yedekleme var, test edilmemiş, aynı lokasyonda',
      'Yedekleme var, offsite/bulut, kurtarma testi yapılmadı',
      'Günlük yedekleme, offsite + bulut, RTO test edildi ve karşılandı',
    ],
  },
  {
    kod: 'Y27', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    soru: 'Dijital sistemler arızasında üretimin manuel olarak belirli bir kapasitede sürdürülmesi için prosedür var mı?',
    rehber: [
      'Manuel üretim imkânsız, prosedür yok',
      'Teorik olarak mümkün ama nasıl yapılacağı bilinmiyor',
      'Prosedür var, personel eğitilmemiş',
      'Prosedür var, personel eğitilmiş ve tatbikat yapılmış',
    ],
  },

  // ── İletişim ve Koordinasyon (Y28-Y31) ────────────────────
  {
    kod: 'Y28', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    soru: 'Kriz iletişim stratejisi, medya sözcüsü ve paydaş bilgilendirme şablonları hazır mı?',
    rehber: [
      'Hiç yok',
      'Sözcü belirsiz, strateji yok',
      'Strateji var, sözcü atanmamış',
      'Strateji + sözcü + hazır şablon mesajlar, tatbikat yapılmış',
    ],
  },
  {
    kod: 'Y29', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    soru: 'AFAD, OSB Yönetimi, belediye ve sağlık kuruluşlarıyla aktif koordinasyon ve karşılıklı yardım protokolleri var mı?',
    rehber: [
      'Hiç koordinasyon yok',
      'Koordinasyon bilinci var, resmi protokol yok',
      'Bazı kurumlarla iletişim kurulmuş',
      'Resmi MoU/protokoller imzalanmış, ortak tatbikat yapılmış',
    ],
  },
  {
    kod: 'Y30', bolum: 'KAPASİTE', boyut: 'C', agirlik: 2, kritik: false, ters: false,
    soru: 'Tesisin topluma sağlayabileceği afet sonrası destek kapasitesi (alan, ekipman, araç) tanımlanmış mı?',
    rehber: [
      'Hiç belirlenmemiş',
      'Fikir aşamasında',
      'Kayıt altına alınmış, resmi protokol yok',
      'AFAD/Kızılay ile resmi koordinasyon anlaşması imzalanmış',
    ],
  },
  {
    kod: 'Y31', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    soru: 'Afet için finansal koruma mekanizmaları: kapsamlı sigorta, iş durması sigortası ve acil nakit fon rezervi var mı?',
    rehber: [
      'Hiç yok',
      'Yalnızca temel bina sigortası',
      'Kapsamlı sigorta var, iş durması dahil değil',
      'Sigorta + iş durması + nakit fon rezervi, aktif izleme',
    ],
  },

  // ── Öğrenen Organizasyon ve Sürekli İyileştirme (Y32-Y35) ─
  {
    kod: 'Y32', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    soru: 'Geçmiş olaylar, tatbikat bulguları ve dış denetim önerilerinden sistematik ders çıkarma süreci aktif mi?',
    rehber: [
      'Hiç yapılmıyor',
      'Nadiren yapılıyor, takip yok',
      'Raporlanıyor, düzeltici aksiyon süreci başlatılıyor',
      'Kurumsal hafıza sistemi aktif, PDCA döngüsü kapanıyor',
    ],
  },
  {
    kod: 'Y33', bolum: 'KAPASİTE', boyut: 'C', agirlik: 2, kritik: false, ters: false,
    soru: 'Risk yönetiminde PDCA (Planla-Uygula-Kontrol Et-Önlem Al) döngüsü ve sürekli iyileştirme kültürü yerleşmiş mi?',
    rehber: [
      'PDCA kavramı bilinmiyor',
      'Kısmen uygulanıyor, döngü tamamlanmıyor',
      'Çoğunlukla uygulanıyor',
      'Tam döngü, KPI izleme ve yönetim gözden geçirmesiyle sürekli iyileştirme',
    ],
  },
  {
    kod: 'Y34', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: false,
    soru: 'Çalışanlar "neredeyse kaza/near-miss" olaylarını raporlamaktan çekinmeden bildiriyor mu? (Suçlamayan kültür)',
    rehber: [
      'Raporlama yok, kültür suçlama odaklı',
      'Nadiren bildiriliyor, sistem var ama işlemiyor',
      'Raporlama var, kısmi geri bildirim sağlanıyor',
      'Aktif near-miss kültürü, her olay analiz ediliyor, geri bildirim hızlı',
    ],
  },
  {
    kod: 'Y35', bolum: 'KAPASİTE', boyut: 'C', agirlik: 2, kritik: false, ters: false,
    soru: 'Tedarikçi ve taşeron firmaların afet/acil durum hazırlık düzeyi değerlendiriliyor ve izleniyor mu?',
    rehber: [
      'Hiç değerlendirilmiyor',
      'Farkındalık var, resmi değerlendirme yok',
      'Anket veya öz bildirim bazlı değerlendirme yapılıyor',
      'Bağımsız denetim veya sertifika şartı uygulanıyor',
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // HRO BÖLÜMÜ — Yüksek Güvenilirlik (H1-H5)  ·  boyut: HRO
  // Tesis içi HRO olgunluk düzeyi — ayrı bölüm olarak render edilir
  // ══════════════════════════════════════════════════════════════

  {
    kod: 'HRO1', bolum: 'KAPASİTE', boyut: 'HRO', agirlik: 5, kritik: true, ters: false,
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
    soru: 'Basitleştirmeye direnç: tesis, karmaşık sorunları tek bir nedene indirgemekten kaçınıyor mu?',
    rehber: [
      'Kök neden analizi yapılmıyor, tek nedene bağlanıyor',
      'Bazen çok nedenli analiz yapılıyor',
      'Çoğunlukla kök neden analizi uygulanıyor',
      'Sistematik RCA/5-Why uygulanıyor, bulgular paylaşılıyor',
    ],
  },
  {
    kod: 'HRO3', bolum: 'KAPASİTE', boyut: 'HRO', agirlik: 4, kritik: false, ters: false,
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
    soru: 'Uzmanlığa saygı: kriz anında karar en üst kademeden değil en bilgili kişiden mi alınıyor?',
    rehber: [
      'Her zaman hiyerarşi, uzman görüşü görmezden geliniyor',
      'Bazen uzman görüşüne başvuruluyor',
      'Genellikle uzman öncülüğünde karar',
      'Kriz anında karar her zaman en yetkili uzmana devrediliyor, kültür yerleşmiş',
    ],
  },
]

// Bölüm filtreleri (form rendering için)
export const SORULAR_SANAYI_H    = SORULAR_SANAYI.filter(s => s.bolum === 'TEHLİKE')
export const SORULAR_SANAYI_F    = SORULAR_SANAYI.filter(s => s.bolum === 'KIRILGANLIK')
export const SORULAR_SANAYI_C    = SORULAR_SANAYI.filter(s => s.bolum === 'KAPASİTE' && s.boyut !== 'HRO')
export const SORULAR_SANAYI_HRO  = SORULAR_SANAYI.filter(s => s.boyut === 'HRO')

// ══════════════════════════════════════════════════════════════
// BÖLÜM 0 — TESİS KİMLİK & YAPISAL ENVANTER
// URI hesabına dahil değil — kalıcı tesis verisi, İSO Check-Up
// Kaynak: Hikmet Hoca AADY Kontrol Listesi 2025 + SATAKOL/MARAP
// ══════════════════════════════════════════════════════════════
export const TESIS_ENVANTER: TesisEnvanterAlani[] = [

  // ── Kimlik Bilgileri ──────────────────────────────────────
  { kod: 'E01', label: 'Firma Adı ve Ünvanı', tip: 'text', zorunlu: true },
  { kod: 'E02', label: 'Ticaret Sicil No', tip: 'text', zorunlu: false },
  { kod: 'E03', label: 'NACE Kodu', tip: 'text', zorunlu: true, aciklama: 'Örn: 20.13 — sistem otomatik tehlike sınıfını belirler' },
  { kod: 'E04', label: 'ISG Tehlike Sınıfı', tip: 'select', zorunlu: true, secenek: ['1 — Çok Tehlikeli', '2 — Tehlikeli', '3 — Az Tehlikeli'] },
  { kod: 'E05', label: 'Faaliyet Tanımı', tip: 'text', zorunlu: false },
  { kod: 'E06', label: 'Üretilen Ürünlerin Stratejik Önemi', tip: 'select', zorunlu: false, secenek: ['Ticari (yerel)', 'Bölgesel', 'Ulusal', 'Global / İhracat'] },
  { kod: 'E07', label: 'Yıllık İhracat Cirosu (USD)', tip: 'select', zorunlu: false, secenek: ['İhracat yok', '< 500K', '500K – 5M', '5M – 50M', '> 50M'] },
  { kod: 'E08', label: 'Organize Sanayi Bölgesi İçinde mi?', tip: 'checkbox', zorunlu: false },

  // ── Çalışan Bilgileri ─────────────────────────────────────
  { kod: 'E09', label: 'Beyaz Yaka Çalışan Sayısı', tip: 'number', zorunlu: false },
  { kod: 'E10', label: 'Mavi Yaka Çalışan Sayısı', tip: 'number', zorunlu: true },
  { kod: 'E11', label: 'Vardiya Sayısı', tip: 'select', zorunlu: false, secenek: ['1 vardiya', '2 vardiya', '3 vardiya (7/24)'] },

  // ── Konum & Yapısal ───────────────────────────────────────
  { kod: 'E12', label: 'Konum (Enlem / Boylam)', tip: 'koordinat', zorunlu: true, aciklama: 'GPS veya haritadan pin ile doğrulayın' },
  { kod: 'E13', label: 'İlçe', tip: 'text', zorunlu: true },
  { kod: 'E14', label: 'Binanın Kullanım Amacı', tip: 'multiselect', zorunlu: false, secenek: ['Üretim', 'Depo', 'Ofis / İdari', 'Mağaza / Showroom'] },
  { kod: 'E15', label: 'İnşa Tipi', tip: 'select', zorunlu: true, secenek: ['Betonarme', 'Çelik', 'Prefabrik', 'Kârgir', 'Ahşap'] },
  { kod: 'E16', label: 'İnşa Tarihi (Yıl)', tip: 'number', zorunlu: true, aciklama: 'Bilinmiyorsa yaklaşık yıl girin' },
  { kod: 'E17', label: 'Yapı Kullanım Belgesi (İskan)', tip: 'select', zorunlu: false, secenek: ['Var', 'Yok', 'Başvuruda'] },
  { kod: 'E18', label: 'Sahiplik Durumu', tip: 'select', zorunlu: false, secenek: ['Mülk Sahibi', 'Kiracı'] },
  { kod: 'E19', label: 'Kapalı Alan (m²)', tip: 'number', zorunlu: false },
  { kod: 'E20', label: 'Açık Alan (m²)', tip: 'number', zorunlu: false },

  // ── Yapısal Belgeler ──────────────────────────────────────
  { kod: 'E21', label: 'Mimari Proje', tip: 'belge', zorunlu: false },
  { kod: 'E22', label: 'Taşıyıcı Sistem Proje Çizimleri', tip: 'belge', zorunlu: false },
  { kod: 'E23', label: 'Taşıyıcı Sistem Proje Hesap Dosyası', tip: 'belge', zorunlu: false },
  { kod: 'E24', label: 'Onaylı Projeden Sonra Eklenti Yapılmış mı?', tip: 'select', zorunlu: false, secenek: ['Hayır', 'Evet — kayıt altında', 'Evet — kayıtsız'] },
  { kod: 'E25', label: 'Onarım ve/veya Güçlendirme Çalışması', tip: 'belge', zorunlu: false, aciklama: 'Varsa tarihi ile birlikte' },
  { kod: 'E26', label: 'Zemin Sınıflaması (TBDY)', tip: 'select', zorunlu: false, secenek: ['ZA', 'ZB', 'ZC', 'ZD', 'ZE', 'ZF', 'Bilinmiyor'] },
  { kod: 'E27', label: 'Zemin Etüt Çalışması', tip: 'belge', zorunlu: false },
  { kod: 'E28', label: 'Binanın Yapısal Durumu (genel kanı)', tip: 'select', zorunlu: false, secenek: ['1 — Çok Kötü', '2 — Kötü', '3 — İyi', '4 — Çok İyi'] },

  // ── Süreç & Tehlikeli Madde ───────────────────────────────
  { kod: 'E29', label: 'Riskli Girdi (hammadde)', tip: 'text', zorunlu: false, aciklama: 'Parlayıcı, patlayıcı, yanıcı, yakıcı vb.' },
  { kod: 'E30', label: 'Riskli Proses / Süreç', tip: 'text', zorunlu: false },
  { kod: 'E31', label: 'Riskli Ürün', tip: 'text', zorunlu: false },
  { kod: 'E32', label: 'Riskli Depolama', tip: 'text', zorunlu: false },
  { kod: 'E33', label: 'Riskli Atık', tip: 'text', zorunlu: false },
  { kod: 'E34', label: 'Riskli Makine-Ekipman', tip: 'text', zorunlu: false },
  { kod: 'E35', label: 'Riskli Lojistik (tedarik/nakliye)', tip: 'text', zorunlu: false },

  // ── Sigorta ───────────────────────────────────────────────
  { kod: 'E36', label: 'İşyeri Sigortası', tip: 'select', zorunlu: false, secenek: ['Yok', 'Temel (bina)', 'Kapsamlı', 'Kapsamlı + İş Durması'] },
]

// ══════════════════════════════════════════════════════════════
// BÖLÜM 4 — DESTEK KAPASİTESİ ENVANTERİ
// URI hesabına dahil değil — İSO Kaynak Havuzu & Müdahale Planlaması
// Kaynak: Hikmet Hoca AADY Kontrol Listesi 2025 — Afet Sonrası Destek
// ══════════════════════════════════════════════════════════════
export const DESTEK_KAPASITESI: DestekKapasite[] = [

  // ── Alan & Lokasyon ───────────────────────────────────────
  { kod: 'D01', label: 'Tesis Alanı Afet Sonrası Destek Tesisi Olarak Kullanılabilir mi?', tip: 'checkbox' },
  { kod: 'D02', label: 'Barındırma Kapasitesi (kişi)', tip: 'number', birim: 'kişi', aciklama: 'Afet sonrası geçici barınma için tesis kapasitesi' },
  { kod: 'D03', label: 'Kullanım Amaçları', tip: 'select', birim: '', secenek: ['İncinebilir nüfus (yaşlı/engelli/çocuk)', 'Kritik altyapı destek tesisi', 'Okul/hastane/spor tesisi benzeri özel tesis', 'Lojistik üs'] },

  // ── Ekipman ───────────────────────────────────────────────
  { kod: 'D04', label: 'Seyyar Jeneratör', tip: 'number', birim: 'adet (KW kapasitesiyle)' },
  { kod: 'D05', label: 'Forklift', tip: 'number', birim: 'adet (ton)' },
  { kod: 'D06', label: 'Seyyar Vinç', tip: 'number', birim: 'adet (HP)' },
  { kod: 'D07', label: 'Kamyon', tip: 'number', birim: 'adet (ton)' },
  { kod: 'D08', label: 'Soğuk Zincir Taşımacılığı Aracı', tip: 'number', birim: 'adet (ton)' },
  { kod: 'D09', label: 'Konteyner', tip: 'number', birim: 'adet' },
  { kod: 'D10', label: 'Çadır', tip: 'number', birim: 'adet' },
  { kod: 'D11', label: 'Prefabrik Yapı', tip: 'number', birim: 'adet' },
  { kod: 'D12', label: 'Transpalet', tip: 'number', birim: 'adet (ton)' },
  { kod: 'D13', label: 'Beton Kırıcı', tip: 'number', birim: 'adet' },
  { kod: 'D14', label: 'Medikal Ekipman / Cihaz', tip: 'checkbox', aciklama: 'Varsa türünü belirtin' },

  // ── Sarf Malzeme ──────────────────────────────────────────
  { kod: 'D15', label: 'Hazır Yemek Üretim Kapasitesi', tip: 'number', birim: 'öğün/gün' },
  { kod: 'D16', label: 'Gıda Malzemesi (Un/Şeker/Yağ)', tip: 'checkbox', aciklama: 'Varsa stok miktarını belirtin' },
  { kod: 'D17', label: 'İçme Suyu Depolama', tip: 'number', birim: 'litre' },

  // ── Uzman Personel ────────────────────────────────────────
  { kod: 'D18', label: 'İlkyardım Sertifikalı Personel', tip: 'number', birim: 'kişi' },
  { kod: 'D19', label: 'Yangın Söndürme Eğitimli Personel', tip: 'number', birim: 'kişi' },
  { kod: 'D20', label: 'USAR (Arama-Kurtarma) Eğitimli Personel', tip: 'number', birim: 'kişi' },
  { kod: 'D21', label: 'ISO 22301 Sertifikalı Uzman', tip: 'number', birim: 'kişi' },
  { kod: 'D22', label: 'Siber Güvenlik / OT Uzmanı', tip: 'number', birim: 'kişi' },
]

// Meta bilgi
export const SANAYI_SORU_META = {
  toplam: 68,
  h:  13,
  fe: 15,
  c:  35,
  hro: 5,
  envanter_alani: 36,
  destek_kalemi: 22,
  kaynaklar: ['HIFYEA Metodolojisi', 'ISO 22301:2019', 'AFAD AADY 2025', 'TOC / HRO Sentezi', 'Hikmet Hoca AADY Kontrol Listesi 2025', 'SATAKOL/MARAP'],
  sektor: 'uretim',
  versiyon: '3.1',
  tarih: '2026-03-27',
}
