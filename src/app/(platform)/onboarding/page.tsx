'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MESLEK_GRUPLARI, MESLEK_GRUPLARI_SIRALI, getTehlikeRenk, type MeslekGrubu } from '@/lib/nace-gruplari'

const SUPA_URL = 'https://gqguwgbopgnpwzjwcexl.supabase.co'
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5OTgzMywiZXhwIjoyMDg4OTc1ODMzfQ.Ku-JRx8JFH5a3SIj7sGP_Dy_nM89NMMW34gPyxVO_qI'

const NAVY  = '#0A1628'
const TEAL  = '#009B8D'
const BORDER = '#E2E8F0'

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

const IL_ILCE: Record<string, string[]> = {
  'Adana': ['Aladağ','Ceyhan','Çukurova','Feke','İmamoğlu','Karaisalı','Karataş','Kozan','Pozantı','Saimbeyli','Sarıçam','Seyhan','Tufanbeyli','Yumurtalık','Yüreğir'],
  'Adıyaman': ['Adıyaman Merkez','Besni','Çelikhan','Gerger','Gölbaşı','Kahta','Samsat','Sincik','Tut'],
  'Afyonkarahisar': ['Afyon Merkez','Başmakçı','Bayat','Bolvadin','Çay','Çobanlar','Dazkırı','Dinar','Emirdağ','Evciler','Hocalar','İhsaniye','İscehisar','Kızılören','Sandıklı','Sinanpaşa','Sultandağı','Şuhut'],
  'Ağrı': ['Ağrı Merkez','Diyadin','Doğubayazıt','Eleşkirt','Hamur','Patnos','Taşlıçay','Tutak'],
  'Aksaray': ['Ağaçören','Aksaray Merkez','Eskil','Gülağaç','Güzelyurt','Ortaköy','Sarıyahşi'],
  'Amasya': ['Amasya Merkez','Göynücek','Gümüşhacıköy','Hamamözü','Merzifon','Suluova','Taşova'],
  'Ankara': ['Akyurt','Altındağ','Ayaş','Bala','Beypazarı','Çamlıdere','Çankaya','Çubuk','Elmadağ','Etimesgut','Evren','Gölbaşı','Güdül','Haymana','Kalecik','Kazan','Keçiören','Kızılcahamam','Mamak','Nallıhan','Polatlı','Pursaklar','Sincan','Şereflikoçhisar','Yenimahalle'],
  'Antalya': ['Akseki','Aksu','Alanya','Döşemealtı','Elmalı','Finike','Gazipaşa','Gündoğmuş','İbradı','Kaş','Kemer','Kepez','Konyaaltı','Korkuteli','Kumluca','Manavgat','Muratpaşa','Serik'],
  'Ardahan': ['Ardahan Merkez','Çıldır','Damal','Göle','Hanak','Posof'],
  'Artvin': ['Ardanuç','Arhavi','Artvin Merkez','Borçka','Hopa','Kemalpaşa','Murgul','Şavşat','Yusufeli'],
  'Aydın': ['Bozdoğan','Buharkent','Çine','Didim','Efeler','Germencik','İncirliova','Karacasu','Karpuzlu','Koçarlı','Köşk','Kuşadası','Kuyucak','Nazilli','Söke','Sultanhisar','Yenipazar'],
  'Balıkesir': ['Altıeylül','Ayvalık','Balya','Bandırma','Bigadiç','Burhaniye','Dursunbey','Edremit','Erdek','Gömeç','Gönen','Havran','İvrindi','Karesi','Kepsut','Manyas','Marmara','Savaştepe','Sındırgı','Susurluk'],
  'Bartın': ['Arit','Bartın Merkez','Kurucaşile','Ulus'],
  'Batman': ['Batman Merkez','Beşiri','Gercüş','Hasankeyf','Kozluk','Sason'],
  'Bayburt': ['Aydıntepe','Bayburt Merkez','Demirözü'],
  'Bilecik': ['Bozüyük','Gölpazarı','İnhisar','Merkez','Osmaneli','Pazaryeri','Söğüt','Yenipazar'],
  'Bingöl': ['Adaklı','Bingöl Merkez','Genç','Karlıova','Kiğı','Solhan','Yayladere','Yedisu'],
  'Bitlis': ['Adilcevaz','Ahlat','Bitlis Merkez','Güroymak','Hizan','Mutki','Tatvan'],
  'Bolu': ['Bolu Merkez','Dörtdivan','Gerede','Göynük','Kıbrıscık','Mengen','Mudurnu','Seben','Yeniçağa'],
  'Burdur': ['Altınyayla','Bucak','Burdur Merkez','Çavdır','Çeltikçi','Gölhisar','Karamanlı','Kemer','Tefenni','Yeşilova'],
  'Bursa': ['Büyükorhan','Gemlik','Gürsu','Harmancık','İnegöl','İznik','Karacabey','Keles','Kestel','Mudanya','Mustafakemalpaşa','Nilüfer','Orhaneli','Orhangazi','Osmangazi','Yenişehir','Yıldırım'],
  'Çanakkale': ['Ayvacık','Bayramiç','Biga','Bozcaada','Çan','Çanakkale Merkez','Eceabat','Ezine','Gelibolu','Gökçeada','Lapseki','Yenice'],
  'Çankırı': ['Atkaracalar','Bayramören','Çankırı Merkez','Eldivan','Ilgaz','Kızılırmak','Korgun','Kurşunlu','Orta','Şabanözü','Yapraklı'],
  'Çorum': ['Alaca','Bayat','Boğazkale','Dodurga','İskilip','Kargı','Laçin','Mecitözü','Oğuzlar','Ortaköy','Osmancık','Sungurlu','Uğurludağ','Merkez'],
  'Denizli': ['Acıpayam','Babadağ','Baklan','Bekilli','Beyağaç','Bozkurt','Buldan','Çal','Çameli','Çardak','Çivril','Güney','Honaz','Kale','Merkezefendi','Pamukkale','Sarayköy','Serinhisar','Tavas'],
  'Diyarbakır': ['Bağlar','Bismil','Çermik','Çınar','Çüngüş','Dicle','Eğil','Ergani','Hani','Hazro','Kayapınar','Kocaköy','Kulp','Lice','Silvan','Sur','Yenişehir'],
  'Düzce': ['Akçakoca','Cumayeri','Çilimli','Düzce Merkez','Gölyaka','Gümüşova','Kaynaşlı','Yığılca'],
  'Edirne': ['Edirne Merkez','Enez','Havsa','İpsala','Keşan','Lalapaşa','Meriç','Süloğlu','Uzunköprü'],
  'Elazığ': ['Ağın','Alacakaya','Arıcak','Baskil','Elazığ Merkez','Karakoçan','Keban','Kovancılar','Maden','Palu','Sivrice'],
  'Erzincan': ['Çayırlı','Erzincan Merkez','İliç','Kemah','Kemaliye','Otlukbeli','Refahiye','Tercan','Üzümlü'],
  'Erzurum': ['Aşkale','Aziziye','Çat','Hınıs','Horasan','İspir','Karaçoban','Karayazı','Köprüköy','Narman','Oltu','Olur','Palandöken','Pasinler','Pazaryolu','Şenkaya','Tekman','Tortum','Uzundere','Yakutiye'],
  'Eskişehir': ['Alpu','Beylikova','Çifteler','Günyüzü','Han','İnönü','Mahmudiye','Mihalgazi','Mihalıççık','Odunpazarı','Sarıcakaya','Seyitgazi','Sivrihisar','Tepebaşı'],
  'Gaziantep': ['Araban','İslahiye','Karkamış','Nizip','Nurdağı','Oğuzeli','Şahinbey','Şehitkamil','Yavuzeli'],
  'Giresun': ['Alucra','Bulancak','Çamoluk','Çanakçı','Dereli','Doğankent','Espiye','Eynesil','Giresun Merkez','Görele','Güce','Keşap','Piraziz','Şebinkarahisar','Tirebolu','Yağlıdere'],
  'Gümüşhane': ['Kelkit','Köse','Kürtün','Merkez','Şiran','Torul'],
  'Hakkari': ['Çukurca','Hakkari Merkez','Şemdinli','Yüksekova'],
  'Hatay': ['Altınözü','Antakya','Arsuz','Belen','Defne','Dörtyol','Erzin','Hassa','İskenderun','Kırıkhan','Kumlu','Payas','Reyhanlı','Samandağ','Yayladağı'],
  'Iğdır': ['Aralık','Iğdır Merkez','Karakoyunlu','Tuzluca'],
  'Isparta': ['Aksu','Atabey','Eğirdir','Gelendost','Gönen','Keçiborlu','Merkez','Senirkent','Sütçüler','Şarkikaraağaç','Uluborlu','Yalvaç','Yenişarbademli'],
  'İstanbul': ['Adalar','Arnavutköy','Ataşehir','Avcılar','Bağcılar','Bahçelievler','Bakırköy','Başakşehir','Bayrampaşa','Beşiktaş','Beykoz','Beylikdüzü','Beyoğlu','Büyükçekmece','Çatalca','Çekmeköy','Esenler','Esenyurt','Eyüpsultan','Fatih','Gaziosmanpaşa','Güngören','Kadıköy','Kağıthane','Kartal','Küçükçekmece','Maltepe','Pendik','Sancaktepe','Sarıyer','Şile','Silivri','Şişli','Sultanbeyli','Sultangazi','Tuzla','Ümraniye','Üsküdar','Zeytinburnu'],
  'İzmir': ['Aliağa','Balçova','Bayındır','Bayraklı','Bergama','Beydağ','Bornova','Buca','Çeşme','Çiğli','Dikili','Foça','Gaziemir','Güzelbahçe','Karabağlar','Karaburun','Karşıyaka','Kemalpaşa','Kınık','Kiraz','Konak','Menderes','Menemen','Narlıdere','Ödemiş','Seferihisar','Selçuk','Tire','Torbalı','Urla'],
  'Kahramanmaraş': ['Afşin','Andırın','Çağlayancerit','Dulkadiroğlu','Ekinözü','Elbistan','Göksun','Nurhak','Onikişubat','Pazarcık','Türkoğlu'],
  'Karabük': ['Eflani','Eskipazar','Karabük Merkez','Ovacık','Safranbolu','Yenice'],
  'Karaman': ['Ayrancı','Başyayla','Ermenek','Karaman Merkez','Kazımkarabekir','Sarıveliler'],
  'Kars': ['Akyaka','Arpaçay','Digor','Kağızman','Kars Merkez','Sarıkamış','Selim','Susuz'],
  'Kastamonu': ['Abana','Ağlı','Araç','Azdavay','Bozkurt','Cide','Çatalzeytin','Daday','Devrekani','Doğanyurt','Hanönü','İhsangazi','İnebolu','Kastamonu Merkez','Küre','Pınarbaşı','Şenpazar','Taşköprü','Tosya'],
  'Kayseri': ['Akkışla','Bünyan','Develi','Felahiye','Hacılar','İncesu','Kocasinan','Melikgazi','Özvatan','Pınarbaşı','Sarıoğlan','Sarız','Talas','Tomarza','Yahyalı','Yeşilhisar'],
  'Kilis': ['Elbeyli','Kilis Merkez','Musabeyli','Polateli'],
  'Kırıkkale': ['Bahşili','Balışeyh','Çelebi','Delice','Karakeçili','Keskin','Kırıkkale Merkez','Sulakyurt','Yahşihan'],
  'Kırklareli': ['Babaeski','Demirköy','Kırklareli Merkez','Kofçaz','Lüleburgaz','Pehlivanköy','Pınarhisar','Vize'],
  'Kırşehir': ['Akçakent','Akpınar','Boztepe','Çiçekdağı','Kaman','Kırşehir Merkez','Mucur'],
  'Kocaeli': ['Başiskele','Çayırova','Darıca','Dilovası','Gebze','Gölcük','İzmit','Kandıra','Karamürsel','Kartepe','Körfez'],
  'Konya': ['Ahırlı','Akören','Akşehir','Altınekin','Beyşehir','Bozkır','Cihanbeyli','Çeltik','Çumra','Derbent','Derebucak','Doğanhisar','Emirgazi','Ereğli','Güneysınır','Hadim','Halkapınar','Hüyük','Ilgın','Kadınhanı','Karapınar','Karatay','Kulu','Meram','Sarayönü','Selçuklu','Seydişehir','Taşkent','Tuzlukçu','Yalıhüyük','Yunak'],
  'Kütahya': ['Altıntaş','Aslanapa','Çavdarhisar','Domaniç','Dumlupınar','Emet','Gediz','Hisarcık','Kütahya Merkez','Pazarlar','Simav','Şaphane','Tavşanlı'],
  'Malatya': ['Akçadağ','Arapgir','Arguvan','Battalgazi','Darende','Doğanşehir','Doğanyol','Hekimhan','Kale','Kuluncak','Pütürge','Yazıhan','Yeşilyurt'],
  'Manisa': ['Ahmetli','Akhisar','Alaşehir','Demirci','Gölmarmara','Gördes','Kırkağaç','Köprübaşı','Kula','Salihli','Sarıgöl','Saruhanlı','Selendi','Soma','Şehzadeler','Turgutlu','Yunusemre'],
  'Mardin': ['Artuklu','Dargeçit','Derik','Kızıltepe','Mazıdağı','Midyat','Nusaybin','Ömerli','Savur','Yeşilli'],
  'Mersin': ['Akdeniz','Anamur','Aydıncık','Bozyazı','Çamlıyayla','Erdemli','Gülnar','Mezitli','Mut','Silifke','Tarsus','Toroslar','Yenişehir'],
  'Muğla': ['Bodrum','Dalaman','Datça','Fethiye','Kavaklıdere','Köyceğiz','Marmaris','Menteşe','Milas','Ortaca','Seydikemer','Ula','Yatağan'],
  'Muş': ['Bulanık','Hasköy','Korkut','Malazgirt','Muş Merkez','Varto'],
  'Nevşehir': ['Acıgöl','Avanos','Derinkuyu','Gülşehir','Hacıbektaş','Kozaklı','Merkez','Ürgüp'],
  'Niğde': ['Altunhisar','Bor','Çamardı','Çiftlik','Merkez','Ulukışla'],
  'Ordu': ['Akkuş','Altınordu','Aybastı','Çamaş','Çatalpınar','Çaybaşı','Fatsa','Gölköy','Gülyalı','Gürgentepe','İkizce','Kabadüz','Kabataş','Korgan','Kumru','Mesudiye','Perşembe','Ulubey','Ünye'],
  'Osmaniye': ['Bahçe','Düziçi','Hasanbeyli','Kadirli','Merkez','Sumbas','Toprakkale'],
  'Rize': ['Ardeşen','Çamlıhemşin','Çayeli','Derepazarı','Fındıklı','Güneysu','Hemşin','İkizdere','İyidere','Kalkandere','Merkez','Pazar'],
  'Sakarya': ['Adapazarı','Akyazı','Arifiye','Erenler','Ferizli','Geyve','Hendek','Karapürçek','Karasu','Kaynarca','Kocaali','Mithatpaşa','Pamukova','Sapanca','Serdivan','Söğütlü','Taraklı'],
  'Samsun': ['Alaçam','Asarcık','Atakum','Ayvacık','Bafra','Canik','Çarşamba','İlkadım','Kavak','Ladik','Salıpazarı','Tekkeköy','Terme','Vezirköprü','Yakakent'],
  'Siirt': ['Baykan','Eruh','Kurtalan','Merkez','Pervari','Şirvan','Tillo'],
  'Sinop': ['Ayancık','Boyabat','Dikmen','Durağan','Erfelek','Gerze','Merkez','Saraydüzü','Türkeli'],
  'Sivas': ['Akıncılar','Altınyayla','Divriği','Doğanşar','Gemerek','Gölova','Hafik','İmranlı','Kangal','Koyulhisar','Merkez','Suşehri','Şarkışla','Ulaş','Yıldızeli','Zara'],
  'Şanlıurfa': ['Akçakale','Birecik','Bozova','Ceylanpınar','Eyyübiye','Halfeti','Haliliye','Harran','Hilvan','Karaköprü','Siverek','Suruç','Viranşehir'],
  'Şırnak': ['Beytüşşebap','Cizre','Güçlükonak','İdil','Merkez','Silopi','Uludere'],
  'Tekirdağ': ['Çerkezköy','Çorlu','Ergene','Hayrabolu','Kapaklı','Malkara','Marmaraereğlisi','Muratlı','Saray','Süleymanpaşa','Şarköy'],
  'Tokat': ['Almus','Artova','Başçiftlik','Erbaa','Merkez','Niksar','Pazar','Reşadiye','Sulusaray','Turhal','Yeşilyurt','Zile'],
  'Trabzon': ['Akçaabat','Araklı','Arsin','Beşikdüzü','Çarşıbaşı','Çaykara','Dernekpazarı','Düzköy','Hayrat','Köprübaşı','Maçka','Of','Ortahisar','Sürmene','Şalpazarı','Tonya','Vakfıkebir','Yomra'],
  'Tunceli': ['Çemişgezek','Hozat','Mazgirt','Merkez','Nazımiye','Ovacık','Pertek','Pülümür'],
  'Uşak': ['Banaz','Eşme','Karahallı','Merkez','Sivaslı','Ulubey'],
  'Van': ['Bahçesaray','Başkale','Çaldıran','Çatak','Edremit','Erciş','Gevaş','Gürpınar','İpekyolu','Muradiye','Özalp','Saray','Tuşba'],
  'Yalova': ['Altınova','Armutlu','Çınarcık','Çiftlikköy','Merkez','Termal'],
  'Yozgat': ['Akdağmadeni','Aydıncık','Boğazlıyan','Çandır','Çayıralan','Çekerek','Kadışehri','Merkez','Saraykent','Sarıkaya','Şefaatli','Sorgun','Yenifakılı','Yerköy'],
  'Zonguldak': ['Alaplı','Çaycuma','Devrek','Ereğli','Gökçebey','Kilimli','Kozlu','Merkez'],
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

  const [tesisAdi, setTesisAdi]           = useState('')
  const [meslekGrubu, setMeslekGrubu]     = useState<MeslekGrubu | null>(null)
  const [aramaMetni, setAramaMetni]       = useState('')
  const [dropdownAcik, setDropdownAcik]   = useState(false)
  const [secilenNace, setSecilenNace]     = useState('')
  const [itoNaceListesi, setItoNaceListesi] = useState<{nace_kodu: string, faaliyet_adi: string}[]>([])
  const [naceYukleniyor, setNaceYukleniyor] = useState(false)
  const [calisan, setCalisan]             = useState('')
  const [il, setIl]                       = useState('')
  const [ilce, setIlce]                   = useState('')
  const [konumYukleniyor, setKonumYukleniyor] = useState(false)
  const [kaydediliyor, setKaydediliyor]   = useState(false)
  const [hata, setHata]                   = useState('')
  const aramaRef = useRef<HTMLInputElement>(null)

  const filtreliGruplar = aramaMetni.trim()
    ? MESLEK_GRUPLARI_SIRALI.filter(g =>
        g.ad.toLowerCase().includes(aramaMetni.toLowerCase()) ||
        g.id.toString() === aramaMetni.trim()
      )
    : MESLEK_GRUPLARI_SIRALI

  const tehlike = meslekGrubu ? getTehlikeRenk(meslekGrubu.tehlikeSinifi) : null

  const kaydet = async () => {
    if (!tesisAdi)    { setHata('Tesis adı zorunludur.'); return }
    if (!meslekGrubu) { setHata('Meslek grubu seçimi zorunludur.'); return }
    if (!il)          { setHata('İl seçimi zorunludur.'); return }

    setKaydediliyor(true); setHata('')
    try {
      // Token oluştur ve tesis formuna yönlendir
      const token = `onb-${Date.now()}-${Math.random().toString(36).slice(2,8)}`
      await fetch(`${SUPA_URL}/rest/v1/iso_tokenlar`, {
        method: 'POST',
        headers: {
          apikey: SUPA_KEY,
          Authorization: `Bearer ${SUPA_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          token,
          tesis_adi: tesisAdi,
          nace_kodu: secilenNace || null,
          ilce: ilce || null,
          dolduruldu: false,
          olusturma_tarihi: new Date().toISOString(),
        }),
      })
      router.push(`/tesis-formu/${token}`)
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
        .meslek-item:hover { background: #F1F5F9 !important; }
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

          {/* Meslek Grubu — Arama Destekli Dropdown */}
          <div style={{ marginBottom: 20, position: 'relative' }}>
            <label style={lbl}>Meslek Grubu <span style={{ color: '#EF4444' }}>*</span></label>
            <div style={{ position: 'relative' }}>
              <input
                ref={aramaRef}
                value={aramaMetni}
                onChange={e => { setAramaMetni(e.target.value); setDropdownAcik(true) }}
                onFocus={() => setDropdownAcik(true)}
                onBlur={() => setTimeout(() => setDropdownAcik(false), 160)}
                placeholder={meslekGrubu ? `${meslekGrubu.id} — ${meslekGrubu.ad}` : '— Meslek grubu ara veya seçin (81 grup) —'}
                style={{
                  ...inp,
                  color: meslekGrubu && !aramaMetni ? '#64748B' : NAVY,
                  paddingRight: 36,
                }}
              />
              {/* Chevron */}
              <span style={{
                position: 'absolute', right: 12, top: '50%', transform: `translateY(-50%) rotate(${dropdownAcik ? 180 : 0}deg)`,
                transition: 'transform .2s', pointerEvents: 'none', color: '#94A3B8', fontSize: 16,
              }}>▾</span>
            </div>

            {/* Dropdown listesi */}
            {dropdownAcik && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 200,
                background: '#FFFFFF', border: `1px solid ${BORDER}`, borderRadius: 10,
                maxHeight: 260, overflowY: 'auto',
                boxShadow: '0 8px 32px rgba(10,22,40,0.12)',
              }}>
                {filtreliGruplar.length === 0 ? (
                  <div style={{ padding: '14px 16px', fontSize: 13, color: '#94A3B8' }}>Sonuç bulunamadı.</div>
                ) : (
                  filtreliGruplar.map(g => {
                    const sinifRenk = g.tehlikeSinifi === 1 ? '#DC2626' : g.tehlikeSinifi === 2 ? '#EA580C' : '#16A34A'
                    const aktif = meslekGrubu?.id === g.id
                    return (
                      <div
                        key={g.id}
                        className="meslek-item"
                        onMouseDown={() => {
                          setMeslekGrubu(g)
                          setAramaMetni('')
                          setSecilenNace('')
                          setDropdownAcik(false)
                        }}
                        style={{
                          padding: '9px 14px',
                          cursor: 'pointer',
                          fontSize: 13,
                          borderBottom: `1px solid #F1F5F9`,
                          background: aktif ? '#F0F9FF' : '#FFFFFF',
                          display: 'flex', alignItems: 'center', gap: 10,
                        }}
                      >
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', minWidth: 22 }}>{g.id}</span>
                        <span style={{ flex: 1, color: NAVY, fontWeight: aktif ? 600 : 400 }}>{g.ad}</span>
                        <span style={{
                          fontSize: 10, fontWeight: 800, color: sinifRenk,
                          background: sinifRenk + '15', border: `1px solid ${sinifRenk}30`,
                          borderRadius: 20, padding: '2px 8px', whiteSpace: 'nowrap',
                        }}>
                          S{g.tehlikeSinifi}
                        </span>
                      </div>
                    )
                  })
                )}
              </div>
            )}
          </div>

          {/* Seçilen meslek grubu bilgisi */}
          {meslekGrubu && !dropdownAcik && (
            <div style={{ marginBottom: 16, padding: '10px 14px', borderRadius: 8, background: '#F8FAFC', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              <span style={{ color: '#64748B' }}>Seçilen grup:</span>
              <span style={{ fontWeight: 700, color: NAVY }}>{meslekGrubu.id} — {meslekGrubu.ad}</span>
              <button
                onClick={() => { setMeslekGrubu(null); setSecilenNace(''); setAramaMetni('') }}
                style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: 16, lineHeight: 1, padding: 0 }}
              >×</button>
            </div>
          )}

          {/* NACE Kodu — Seçilen gruba göre dinamik */}
          {meslekGrubu && (
            <div style={{ marginBottom: 20 }}>
              <label style={lbl}>NACE Kodu <span style={{ color: '#94A3B8', fontWeight: 400 }}>(opsiyonel)</span></label>
              <select value={secilenNace} onChange={async e => {
                const nace = e.target.value
                setSecilenNace(nace)
                if (nace && meslekGrubu) {
                  try {
                    const temiz = nace.replace('.','')
                    const r = await fetch(
                      `${SUPA_URL}/rest/v1/nace_tehlike?nace_alti_kod=like.${encodeURIComponent(temiz)}*&select=tehlike_sinifi&order=nace_alti_kod.asc&limit=1`,
                      { headers: { apikey: SUPA_KEY } }
                    )
                    const d = await r.json()
                    if (d?.[0]?.tehlike_sinifi) {
                      setMeslekGrubu({ ...meslekGrubu, tehlikeSinifi: d[0].tehlike_sinifi as 1|2|3 })
                    }
                  } catch { /* sessiz hata */ }
                }
              }} style={{ ...inp, cursor: 'pointer' }}>
                <option value="">— NACE kodu seçin —</option>
                {meslekGrubu.naceKodlari.map(n => (
                  <option key={n.kod} value={n.kod}>{n.kod} — {n.aciklama}</option>
                ))}
              </select>
            </div>
          )}

          {/* Tehlike sınıfı badge */}
          {tehlike && meslekGrubu && (
            <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 10, background: tehlike.bg, border: `1px solid ${tehlike.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: tehlike.renk, background: tehlike.renk + '18', border: `1px solid ${tehlike.renk}33`, borderRadius: 20, padding: '3px 12px' }}>
                {tehlike.label}
              </span>
              <span style={{ fontSize: 12, color: '#374151' }}>
                {meslekGrubu.tehlikeSinifi === 1 && 'Detaylı form doldurmanız gerekmektedir.'}
                {meslekGrubu.tehlikeSinifi === 2 && 'Standart form doldurmanız önerilmektedir.'}
                {meslekGrubu.tehlikeSinifi === 3 && 'Kısa formu hızlıca tamamlayabilirsiniz.'}
              </span>
            </div>
          )}

          {/* 2 kolon: Çalışan + İl/İlçe */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <label style={lbl}>Çalışan Sayısı</label>
              <select value={calisan} onChange={e => setCalisan(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                <option value="">— Seçin —</option>
                {CALISAN_GRUPLAR.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>İl <span style={{ color: '#EF4444' }}>*</span></label>
              <select value={il} onChange={e => { setIl(e.target.value); setIlce('') }} style={{ ...inp, cursor: 'pointer' }}>
                <option value="">— İl seçin —</option>
                {TÜRKİYE_İLLERİ.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>

          {/* İlçe — il'e bağlı dropdown veya serbest giriş */}
          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>İlçe</label>
            {il && IL_ILCE[il] ? (
              <select value={ilce} onChange={e => setIlce(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
                <option value="">— İlçe seçin —</option>
                {IL_ILCE[il].map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            ) : (
              <input value={ilce} onChange={e => setIlce(e.target.value)} placeholder="İlçe adı" style={inp} />
            )}
          </div>

          {/* Konumumu Otomatik Bul */}
          <div style={{ marginBottom: 28 }}>
            <button
              type="button"
              disabled={konumYukleniyor}
              onClick={() => {
                if (!navigator.geolocation) return
                setKonumYukleniyor(true)
                navigator.geolocation.getCurrentPosition(
                  async (pos) => {
                    try {
                      const r = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&accept-language=tr`
                      )
                      const d = await r.json()
                      const adres = d.address || {}
                      // Nominatim TR: il için state, ilçe için county/district/suburb
                      const il2raw = adres.province || adres.state || adres.city || ''
                      const ilce2  = adres.county || adres.district || adres.suburb || adres.city_district || adres.town || ''
                      // İstanbul gibi şehirlerde state = "İstanbul" gelir
                      const il2 = il2raw.replace(' İli','').replace(' Province','').trim()
                      const ilKey = Object.keys(IL_ILCE).find(k => il2.includes(k) || k.includes(il2))
                      if (ilKey) { setIl(ilKey); setIlce('') }
                      if (ilce2) setTimeout(() => setIlce(ilce2), 100)
                    } catch { setHata('Konum alınamadı.') }
                    setKonumYukleniyor(false)
                  },
                  () => { setHata('Konum izni reddedildi.'); setKonumYukleniyor(false) }
                )
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 16px', fontSize: 13, fontWeight: 600,
                border: `1px solid ${konumYukleniyor ? '#CBD5E1' : TEAL}`,
                color: konumYukleniyor ? '#94A3B8' : TEAL,
                background: '#FFFFFF', borderRadius: 8, cursor: konumYukleniyor ? 'not-allowed' : 'pointer',
                transition: 'all .15s',
              }}
            >
              <span style={{ fontSize: 15 }}>{konumYukleniyor ? '📡' : '📍'}</span>
              {konumYukleniyor ? 'Konum alınıyor…' : 'Konumumu Otomatik Bul'}
            </button>
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
