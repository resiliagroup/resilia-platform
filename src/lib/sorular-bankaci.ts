// ═══════════════════════════════════════════════════════════════
//  OMNI Platform — Bankacılık Sektörü HIFYEA Soru Seti  v2.0
//  HIFYEA: H·F×E·Y·A (Tehlike · Savunmasızlık · Yönetilebilirlik)
//  BDDK İSP Rehberi · Basel III Op Risk · ISO 22301 · FEMA Core Cap.
//  Toplam: 73 soru — H:8, F×E:15, C:45, HRO:5
// ═══════════════════════════════════════════════════════════════

import type { Soru } from './sorular'

export type SoruBankaci = Omit<Soru, 'rehber'> & {
  boyut: 'H' | 'F' | 'E' | 'C' | 'HRO'
  secenekler: { label: string; puan: number }[]
  fema_alan?: string
  rehber?: [string, string, string, string]
}

// 3 seçenek kümeleri
const SEÇ_H: SoruBankaci['secenekler'] = [
  { label: '20+ yıl — Çok Nadir', puan: 1 },
  { label: '5-10 yıl — Orta Sıklık', puan: 5 },
  { label: '5 yıldan sık — Yüksek', puan: 10 },
]
const SEÇ_FE: SoruBankaci['secenekler'] = [
  { label: 'Düşük Savunmasızlık', puan: 1 },
  { label: 'Orta Savunmasızlık', puan: 5 },
  { label: 'Çok Yüksek Savunmasızlık', puan: 10 },
]
const SEÇ_C: SoruBankaci['secenekler'] = [
  { label: 'Hayır — Yok', puan: 1 },
  { label: 'Kısmen — Gelişmekte', puan: 5 },
  { label: 'Evet — Tam Uygulama', puan: 10 },
]

export const SORULAR_BANKACI: SoruBankaci[] = [

  // ══════════════════════════════════════════════════════════════
  // BÖLÜM 1 — TEHLİKE (T1-T8)  ·  boyut: H  ·  ters: true
  // ISO 31000 · ISO 22327 — Tehlike Analizi
  // ══════════════════════════════════════════════════════════════

  {
    kod: 'T1', bolum: 'TEHLİKE', boyut: 'H', agirlik: 5, kritik: true, ters: true,
    soru: 'Şubenin/merkez binanın bulunduğu bölgenin deprem tehlike sınıfı ve tarihsel tekerrür sıklığı nedir?',
    secenekler: SEÇ_H,
  },
  {
    kod: 'T2', bolum: 'TEHLİKE', boyut: 'H', agirlik: 4, kritik: false, ters: true,
    soru: 'Şube yakın çevresinde sel, su baskını, altyapı çöküşü veya kentsel taşkın riski ne düzeydedir?',
    secenekler: SEÇ_H,
  },
  {
    kod: 'T3', bolum: 'TEHLİKE', boyut: 'H', agirlik: 5, kritik: true, ters: true,
    soru: 'Kuruma yönelik siber saldırı, veri ihlali, DDoS ve oltalama olaylarının sektörel tekerrür sıklığı nedir? (BDDK Siber Olay İstatistikleri)',
    secenekler: SEÇ_H,
  },
  {
    kod: 'T4', bolum: 'TEHLİKE', boyut: 'H', agirlik: 5, kritik: true, ters: true,
    soru: 'Operasyonel hata, iç kontrol başarısızlığı veya dolandırıcılık kaynaklı kayıp olaylarının tekerrür sıklığı? (Basel III Operasyonel Risk)',
    secenekler: SEÇ_H,
  },
  {
    kod: 'T5', bolum: 'TEHLİKE', boyut: 'H', agirlik: 4, kritik: false, ters: true,
    soru: 'Kritik IT altyapısı, elektrik şebekesi, telekom veya bulut hizmet sağlayıcısı kaynaklı kesinti tekerrür sıklığı nedir?',
    secenekler: SEÇ_H,
  },
  {
    kod: 'T6', bolum: 'TEHLİKE', boyut: 'H', agirlik: 3, kritik: false, ters: true,
    soru: 'Şube binasında veya komşu yapılarda yangın, patlama ya da yapısal çöküş riski ne düzeydedir?',
    secenekler: SEÇ_H,
  },
  {
    kod: 'T7', bolum: 'TEHLİKE', boyut: 'H', agirlik: 3, kritik: false, ters: true,
    soru: 'Salgın hastalık veya kamu sağlığı krizi nedeniyle personel ve müşteri erişim kaybı riski ne düzeydedir?',
    secenekler: SEÇ_H,
  },
  {
    kod: 'T8', bolum: 'TEHLİKE', boyut: 'H', agirlik: 4, kritik: true, ters: true,
    soru: 'BDDK/SPK/TCMB regülatör müdahalesi, lisans kısıtlaması veya zorunlu operasyonel durdurma riski ne sıklıkla gerçekleşebilir?',
    secenekler: SEÇ_H,
  },

  // ══════════════════════════════════════════════════════════════
  // BÖLÜM 2 — SAVUNMASIZLIK (S1-S15)  ·  boyut: F/E  ·  ters: true
  // BDDK Basel III · İnsan · Mekan · Ekonomik
  // ══════════════════════════════════════════════════════════════

  // — İnsan Boyutu (S1-S5) — boyut: F
  {
    kod: 'S1', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 4, kritik: true, ters: true,
    soru: 'Kritik görevlerdeki personelin yerine koyma kapasitesi ne düzeydedir? (Tek nokta bağımlılığı — Key Person Risk)',
    secenekler: SEÇ_FE,
  },
  {
    kod: 'S2', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 3, kritik: false, ters: true,
    soru: 'Personelin afet farkındalığı ve iş sürekliliği eğitim düzeyi ne düzeydedir?',
    secenekler: SEÇ_FE,
  },
  {
    kod: 'S3', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 3, kritik: false, ters: true,
    soru: 'Uzaktan çalışma altyapısı ve personel adaptasyon kapasitesi ne düzeydedir?',
    secenekler: SEÇ_FE,
  },
  {
    kod: 'S4', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 3, kritik: false, ters: true,
    soru: 'Sağlık, güvenlik veya yüksek risk bölgesinde çalışan personel oranı ne kadar fazladır?',
    secenekler: SEÇ_FE,
  },
  {
    kod: 'S5', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 3, kritik: false, ters: true,
    soru: 'Kriz dönemlerinde yedek personel ve görev rotasyonu planlaması ne kadar yetersizdir?',
    secenekler: SEÇ_FE,
  },

  // — Mekan / Fiziksel Boyut (S6-S10) — boyut: F
  {
    kod: 'S6', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 4, kritik: true, ters: true,
    soru: 'Şube binasının yapısal dayanıklılığı ne düzeyde yetersizdir? (Yapı yaşı, zemin sınıfı, sismik uyum)',
    secenekler: SEÇ_FE,
  },
  {
    kod: 'S7', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 4, kritik: true, ters: true,
    soru: 'Kritik sistemlerin (sunucu odası, ATM, kasa) fiziksel koruma ve yetkisiz erişime karşı savunmasızlığı ne düzeydedir?',
    secenekler: SEÇ_FE,
  },
  {
    kod: 'S8', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 4, kritik: false, ters: true,
    soru: 'Alternatif çalışma alanı (BCP hot/warm site) ve iş sürekliliği altyapısı ne kadar hazırlıksızdır?',
    secenekler: SEÇ_FE,
  },
  {
    kod: 'S9', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 3, kritik: false, ters: true,
    soru: 'Jeneratör ve UPS altyapısı yeterliliği ne düzeyde yetersizdir? (Kesintisiz güç kaynağı kapasitesi)',
    secenekler: SEÇ_FE,
  },
  {
    kod: 'S10', bolum: 'KIRILGANLIK', boyut: 'F', agirlik: 4, kritik: false, ters: true,
    soru: 'Veri merkezi ve IT altyapısının coğrafi dağılımı ve yedekleme kapasitesi ne kadar yetersizdir?',
    secenekler: SEÇ_FE,
  },

  // — Ekonomik / Finansal Boyut (S11-S15) — boyut: E
  {
    kod: 'S11', bolum: 'KIRILGANLIK', boyut: 'E', agirlik: 5, kritik: true, ters: true,
    soru: 'Likidite tamponu ve nakit akışı çöküşüne karşı yeterlilik ne kadar düşüktür? (LCR / NSFR — Basel III)',
    secenekler: SEÇ_FE,
  },
  {
    kod: 'S12', bolum: 'KIRILGANLIK', boyut: 'E', agirlik: 4, kritik: true, ters: true,
    soru: 'Kritik tedarikçilere ve tek noktaya bağımlılık düzeyi ne kadar yüksektir? (Konsantrasyon riski)',
    secenekler: SEÇ_FE,
  },
  {
    kod: 'S13', bolum: 'KIRILGANLIK', boyut: 'E', agirlik: 3, kritik: false, ters: true,
    soru: 'Operasyonel aksaklık için sigorta teminatı (iş kesintisi, siber, sorumluluk) ne kadar yetersizdir?',
    secenekler: SEÇ_FE,
  },
  {
    kod: 'S14', bolum: 'KIRILGANLIK', boyut: 'E', agirlik: 3, kritik: false, ters: true,
    soru: 'Müşteri güveni ve kurumsal itibar kaybının operasyonel sürekliliğe etkisi ne kadar büyüktür?',
    secenekler: SEÇ_FE,
  },
  {
    kod: 'S15', bolum: 'KIRILGANLIK', boyut: 'E', agirlik: 4, kritik: false, ters: true,
    soru: 'Regülatör cezaları, uyum ihlalleri veya yasal yaptırımların kümülatif mali yük potansiyeli ne kadar yüksektir?',
    secenekler: SEÇ_FE,
  },

  // ══════════════════════════════════════════════════════════════
  // BÖLÜM 3 — YÖNETİLEBİLİRLİK (Y1-Y45)  ·  boyut: C  ·  ters: true
  // BDDK İSP Rehberi · ISO 22301 · Basel III · FEMA Core Capabilities
  // ══════════════════════════════════════════════════════════════

  // ── FEMA: Prevention (Y1-Y6)
  {
    kod: 'Y1', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: true, ters: true,
    fema_alan: 'Prevention',
    soru: 'Risk iştahı politikası ve Basel III Operasyonel Risk yönetim çerçevesi yürürlükte ve uygulanıyor mu?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y2', bolum: 'KAPASİTE', boyut: 'C', agirlik: 5, kritik: true, ters: true,
    fema_alan: 'Prevention',
    soru: 'BDDK\u2019ya uygun İş Sürekliliği Planı (İSP/BCP), prosedürleri ve risk envanteri hazır mı?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y3', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: false, ters: true,
    fema_alan: 'Prevention',
    soru: 'Kritik süreçler, BIA (İş Etki Analizi) ve tek nokta bağımlılıkları tespit edilip belgelenmiş mi?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y4', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: false, ters: true,
    fema_alan: 'Prevention',
    soru: 'Stres testleri ve senaryo analizleri (ICAAP/ILAAP kapsamında) düzenli olarak yapılıyor mu?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y5', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: true, ters: true,
    fema_alan: 'Prevention',
    soru: 'Siber güvenlik politikası, tehdit istihbaratı programı ve güvenlik açığı yönetimi uygulanıyor mu?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y6', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: true,
    fema_alan: 'Prevention',
    soru: 'Tedarikçi risk değerlendirmesi, 3. taraf güvencesi ve tedarik zinciri denetimi mekanizması var mı?',
    secenekler: SEÇ_C,
  },

  // ── FEMA: Protection (Y7-Y13)
  {
    kod: 'Y7', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: true, ters: true,
    fema_alan: 'Protection',
    soru: 'ISO 27001 / BGYS sertifikasyonu veya eşdeğer bilgi güvenliği yönetim çerçevesi uygulanıyor mu?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y8', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: true, ters: true,
    fema_alan: 'Protection',
    soru: 'Çok faktörlü kimlik doğrulama (MFA) ve ayrıcalıklı erişim yönetimi (PAM) kritik sistemlerde aktif mi?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y9', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: false, ters: true,
    fema_alan: 'Protection',
    soru: 'Ağ segmentasyonu, güvenlik duvarları ve saldırı tespit/önleme sistemleri (IDS/IPS) kurulu mu?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y10', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: true,
    fema_alan: 'Protection',
    soru: 'Kritik belgeler ve veri varlıkları düzenli olarak yedekleniyor ve şifrelenerek korunuyor mu?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y11', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: true,
    fema_alan: 'Protection',
    soru: 'Fiziksel güvenlik sistemleri (CCTV, biyometrik giriş, kasa güvenliği) yeterli ve işlevsel mi?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y12', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: true,
    fema_alan: 'Protection',
    soru: 'ATM güvenliği ve skimming/kart kopyalama/dolandırıcılık önleme tedbirleri uygulanıyor mu?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y13', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: true,
    fema_alan: 'Protection',
    soru: 'Çalışan davranış izleme ve iç tehdit yönetimi programı (Insider Threat) mevcut mu?',
    secenekler: SEÇ_C,
  },

  // ── FEMA: Mitigation (Y14-Y23)
  {
    kod: 'Y14', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: true, ters: true,
    fema_alan: 'Mitigation',
    soru: 'Sismik yönetmeliklere uygun yapısal güçlendirme ve bina risk değerlendirmesi yapılmış mı?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y15', bolum: 'KAPASİTE', boyut: 'C', agirlik: 5, kritik: true, ters: true,
    fema_alan: 'Mitigation',
    soru: 'Kritik IT sistemleri için felaket kurtarma (DR) planı ve sıcak/soğuk yedek site hazır ve test edilmiş mi?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y16', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: false, ters: true,
    fema_alan: 'Mitigation',
    soru: 'KVKK ve GDPR kapsamında veri koruma etki değerlendirmesi (DPIA) tamamlanmış mı?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y17', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: true,
    fema_alan: 'Mitigation',
    soru: 'Sigorta portföyü (iş kesintisi, siber, sorumluluk, D&O) kurumun risk profiline uygun mu?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y18', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: true,
    fema_alan: 'Mitigation',
    soru: 'Kritik süreçler bulut veya hibrit altyapıya taşınarak tek merkez riski azaltılmış mı?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y19', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: false, ters: true,
    fema_alan: 'Mitigation',
    soru: 'Operasyonel kayıp veritabanı (OKT) tutularak Basel III Op Risk raporlaması yapılıyor mu?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y20', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: false, ters: true,
    fema_alan: 'Mitigation',
    soru: 'BCBS 239 kapsamında risk veri toplaştırma ve yönetim raporlama altyapısı hazır mı?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y21', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: true,
    fema_alan: 'Mitigation',
    soru: 'Kilit personel için yedekleme ve çapraz eğitim (cross-training) programı uygulanıyor mu?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y22', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: true,
    fema_alan: 'Mitigation',
    soru: 'Tedarik zinciri alternatif kanal planlaması ve acil tedarikçi/yedek hizmet anlaşmaları var mı?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y23', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: true,
    fema_alan: 'Mitigation',
    soru: 'Şube konumlandırma ve taşıma planlaması için bölgesel risk haritası ve coğrafi analiz kullanılıyor mu?',
    secenekler: SEÇ_C,
  },

  // ── FEMA: Response (Y24-Y36)
  {
    kod: 'Y24', bolum: 'KAPASİTE', boyut: 'C', agirlik: 5, kritik: true, ters: true,
    fema_alan: 'Response',
    soru: 'Kriz Yönetim Komitesi (KYK) / Crisis Management Team oluşturulmuş, rolleri tanımlanmış ve aktif mi?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y25', bolum: 'KAPASİTE', boyut: 'C', agirlik: 5, kritik: true, ters: true,
    fema_alan: 'Response',
    soru: 'İş Sürekliliği Planı son 12 ayda tatbikat/masaüstü egzersiz ile test edildi mi?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y26', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: false, ters: true,
    fema_alan: 'Response',
    soru: 'Müşteri iletişim planı ve kriz anı itibar yönetimi (PR) protokolü hazır mı?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y27', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: true, ters: true,
    fema_alan: 'Response',
    soru: 'Uzaktan/alternatif çalışma moduna geçiş için RTO ve RPO süreleri tanımlanmış ve doğrulanmış mı?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y28', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: false, ters: true,
    fema_alan: 'Response',
    soru: 'Kritik işlemlerin manuel/kağıt-temelli yedek prosedürleri hazır ve personel tarafından biliniyor mu?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y29', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: true, ters: true,
    fema_alan: 'Response',
    soru: 'Düzenleyici otoriteler (BDDK, TCMB) için olay bildirim protokolü ve eskalasyon zinciri uygulanıyor mu?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y30', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: true,
    fema_alan: 'Response',
    soru: 'ATM ve şube hizmet kesintisinde müşteri yönlendirme ve dijital kanal alternatif planı var mı?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y31', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: true,
    fema_alan: 'Response',
    soru: 'Anlık ödeme sistemleri ve kritik muhasebe süreçlerinde manuel işlem kapasitesi ve prosedürleri mevcut mu?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y32', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: true,
    fema_alan: 'Response',
    soru: 'Personel güvenlik protokolleri, tahliye prosedürleri ve acil toplanma noktaları güncel ve test edilmiş mi?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y33', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: true, ters: true,
    fema_alan: 'Response',
    soru: 'Siber olay müdahale planı (CSIRP/IR Plan) test edilmiş ve yetkin CIRT ekibi mevcut mu?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y34', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: true,
    fema_alan: 'Response',
    soru: 'Ortak acil durum tatbikatları diğer finans kuruluşları, BDDK ve BKM ile koordineli yürütülüyor mu?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y35', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: true,
    fema_alan: 'Response',
    soru: 'Kritik tedarikçi kesintilerinde SLA takibi, eskalasyon prosedürleri ve yedek kanal devreye alma süreci etkin mi?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y36', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: true,
    fema_alan: 'Response',
    soru: 'Faaliyet kesintisinde müşteri mağduriyeti giderim, tazminat ve çözüm süreci tanımlı ve hızlı işleyebilir mi?',
    secenekler: SEÇ_C,
  },

  // ── FEMA: Recovery (Y37-Y45)
  {
    kod: 'Y37', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: false, ters: true,
    fema_alan: 'Recovery',
    soru: 'Olay sonrası raporlama ve kök neden analizi (5WHY / RCA) mekanizması kurumsal standart olarak uygulanıyor mu?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y38', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: false, ters: true,
    fema_alan: 'Recovery',
    soru: 'BCP/DR testleri sonrası aksiyon takibi ve plan güncellemesi sistematik biçimde yapılıyor mu?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y39', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: true,
    fema_alan: 'Recovery',
    soru: 'Operasyonel kayıplar ve near-miss olayları Basel III uyumlu kayıp veritabanında sistematik kaydediliyor mu?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y40', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: true,
    fema_alan: 'Recovery',
    soru: 'Kurumsal risk kültürü ve iş sürekliliği farkındalığı periyodik anket veya olgunluk değerlendirmesiyle ölçülüyor mu?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y41', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: false, ters: true,
    fema_alan: 'Recovery',
    soru: 'BDDK yerinde inceleme bulgularına yönelik düzeltici aksiyon planları (DAP) zamanında tamamlanıyor mu?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y42', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: true,
    fema_alan: 'Recovery',
    soru: 'Teknoloji altyapısı ve siber güvenlik yetkinlikleri için sürekli iyileştirme ve kapasite geliştirme programı var mı?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y43', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: true,
    fema_alan: 'Recovery',
    soru: 'Pandemi veya uzun süreli kriz sonrası müşteri ilişkileri ve operasyonel normalleşme planı hazır mı?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y44', bolum: 'KAPASİTE', boyut: 'C', agirlik: 3, kritik: false, ters: true,
    fema_alan: 'Recovery',
    soru: 'Küresel bankacılık krizlerinden (SVB, Lehman, Credit Suisse) çıkarılan dersler kurumun İSP ve risk çerçevesine entegre edildi mi?',
    secenekler: SEÇ_C,
  },
  {
    kod: 'Y45', bolum: 'KAPASİTE', boyut: 'C', agirlik: 4, kritik: true, ters: true,
    fema_alan: 'Recovery',
    soru: 'ISO 22301 veya BDDK İSP Rehberine uygunluk için bağımsız dış denetim ve sertifikasyon süreci yürütülüyor mu?',
    secenekler: SEÇ_C,
  },

  // ══════════════════════════════════════════════════════════════
  // HRO — Yüksek Güvenilirlik Organizasyonu (HRO1-HRO5)  ·  boyut: HRO
  // ══════════════════════════════════════════════════════════════

  {
    kod: 'HRO1', bolum: 'KAPASİTE', boyut: 'HRO', agirlik: 3, kritik: false, ters: true,
    soru: 'Şube/birim yönetimi başarısızlık sinyallerine ve near-miss raporlamasına açık mı? Personel cezasız bildirim yapabiliyor mu? (Hatalara Duyarlılık)',
    secenekler: SEÇ_C,
  },
  {
    kod: 'HRO2', bolum: 'KAPASİTE', boyut: 'HRO', agirlik: 3, kritik: false, ters: true,
    soru: 'Olağandışı müşteri talepleri, operasyonel anormallikler veya risk sinyalleri tek bir kolay açıklamayla geçiştirilmiyor mu? (Basitleştirmeye Direnç)',
    secenekler: SEÇ_C,
  },
  {
    kod: 'HRO3', bolum: 'KAPASİTE', boyut: 'HRO', agirlik: 3, kritik: false, ters: true,
    soru: 'Yüksek riskli işlemler ve kritik kararlar birden fazla kişi tarafından onaylanıyor mu? Operasyonel süreçler anlık odaklanmayı destekliyor mu? (Operasyonlara Odaklanma)',
    secenekler: SEÇ_C,
  },
  {
    kod: 'HRO4', bolum: 'KAPASİTE', boyut: 'HRO', agirlik: 3, kritik: false, ters: true,
    soru: 'Kriz dönemlerinde hiyerarşi esnetilerek konusunda uzman personele karar yetkisi devrediliyor mu? (Esnekliğe Bağlılık)',
    secenekler: SEÇ_C,
  },
  {
    kod: 'HRO5', bolum: 'KAPASİTE', boyut: 'HRO', agirlik: 3, kritik: false, ters: true,
    soru: 'İş sürekliliği, kriz yönetimi ve operasyonel risk konuları üst yönetim ve Yönetim Kurulu gündemine düzenli olarak giriyor mu? (Uzmanlığa Saygı)',
    secenekler: SEÇ_C,
  },
]

export const BANKACILIK_SORU_META = {
  toplam: 73,
  h: 8,
  fe: 15,
  c: 45,
  hro: 5,
  versiyon: '2.0',
  referanslar: 'BDDK İSP Rehberi · Basel III Op Risk · ISO 22301 · FEMA Core Capabilities · BCBS 239',
}
