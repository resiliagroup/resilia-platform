#!/usr/bin/env python3
"""
Beylikdüzü 1000+ Tesis Seed Script
Kaynak: Beylikdüzü İlçe Haritası + CBS Katman Analizi + Prosedürel Üretim
HFER-720 parametreleri dahil
"""
import uuid, json, random, math, httpx, sys
from datetime import datetime

SUPABASE_URL = "https://gqguwgbopgnpwzjwcexl.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxZ3V3Z2JvcGducHd6andjZXhsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5OTgzMywiZXhwIjoyMDg4OTc1ODMzfQ.Ku-JRx8JFH5a3SIj7sGP_Dy_nM89NMMW34gPyxVO_qI"
TENANT_ID = "11111111-0000-0000-0000-000000000001"

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

# Mahalle koordinat sınırları (gerçek Beylikdüzü topografyası)
NEIGHBORHOODS = {
    "Yakuplu":       {"lat": (40.985, 41.010), "lng": (28.680, 28.725), "flood_risk": 2, "industry_density": 5},
    "Kavaklı":       {"lat": (40.975, 41.000), "lng": (28.640, 28.670), "flood_risk": 3, "industry_density": 2},
    "Sahil":         {"lat": (40.970, 40.985), "lng": (28.635, 28.665), "flood_risk": 5, "industry_density": 1},
    "Marmara":       {"lat": (40.968, 40.982), "lng": (28.685, 28.720), "flood_risk": 4, "industry_density": 3},
    "Gürpınar":      {"lat": (40.970, 40.992), "lng": (28.618, 28.645), "flood_risk": 4, "industry_density": 1},
    "Dereağzı":      {"lat": (40.978, 41.000), "lng": (28.625, 28.655), "flood_risk": 3, "industry_density": 2},
    "Adnan Kahveci": {"lat": (40.988, 41.010), "lng": (28.645, 28.675), "flood_risk": 2, "industry_density": 3},
    "Büyükşehir":    {"lat": (40.990, 41.012), "lng": (28.658, 28.685), "flood_risk": 2, "industry_density": 2},
    "Barış":         {"lat": (40.992, 41.015), "lng": (28.668, 28.695), "flood_risk": 2, "industry_density": 2},
    "Cumhuriyet":    {"lat": (40.998, 41.018), "lng": (28.650, 28.678), "flood_risk": 1, "industry_density": 1},
}

def rand_coord(neighborhood):
    nb = NEIGHBORHOODS[neighborhood]
    lat = round(random.uniform(*nb["lat"]), 6)
    lng = round(random.uniform(*nb["lng"]), 6)
    return lat, lng

def jitter(base_lat, base_lng, radius_m=200):
    dlat = random.uniform(-radius_m, radius_m) / 111320
    dlng = random.uniform(-radius_m, radius_m) / (111320 * math.cos(math.radians(base_lat)))
    return round(base_lat + dlat, 6), round(base_lng + dlng, 6)

def risk_scores(sector, neighborhood, building_year, is_coastal=False):
    nb = NEIGHBORHOODS[neighborhood]
    age = 2025 - building_year
    
    # F (kırılganlık) - bina yaşına göre
    f = min(5.0, 1.0 + age / 15)
    
    # Deprem riski - zemin sınıfına göre (Yakuplu/kıyı = kötü zemin)
    seismic_base = {"Yakuplu": 4.2, "Sahil": 4.0, "Marmara": 4.1, "Gürpınar": 3.8,
                    "Dereağzı": 3.5, "Kavaklı": 3.3, "Adnan Kahveci": 3.0,
                    "Büyükşehir": 2.8, "Barış": 2.7, "Cumhuriyet": 2.5}
    r_deprem = round(min(5.0, seismic_base.get(neighborhood, 3.0) + random.uniform(-0.3, 0.3)), 1)
    
    # Sel riski
    r_sel = round(min(5.0, nb["flood_risk"] + random.uniform(-0.5, 0.5)), 1)
    
    # Sektöre özel
    if sector == "INDUSTRIAL":
        H = round(random.uniform(3.5, 5.0), 1)
        X = round(random.uniform(3.0, 4.5), 1)
        C = round(random.uniform(1.5, 3.0), 1)
        natech = round(random.uniform(3.5, 5.0), 1)
        hazmat = True
        r_toplumsal = round(random.uniform(1.0, 2.5), 1)
    elif sector == "HOSPITAL":
        H = round(random.uniform(2.5, 4.0), 1)
        X = round(random.uniform(3.5, 5.0), 1)
        C = round(random.uniform(2.0, 3.5), 1)
        natech = round(random.uniform(1.5, 2.5), 1)
        hazmat = False
        r_toplumsal = round(random.uniform(1.5, 3.0), 1)
    elif sector == "EDUCATION":
        H = round(random.uniform(2.0, 3.5), 1)
        X = round(random.uniform(4.0, 5.0), 1)  # yüksek gündüz nüfus
        C = round(random.uniform(1.5, 3.0), 1)
        natech = round(random.uniform(1.0, 2.0), 1)
        hazmat = False
        r_toplumsal = round(random.uniform(2.0, 3.5), 1)
    elif sector == "BANK":
        H = round(random.uniform(2.0, 3.5), 1)
        X = round(random.uniform(2.5, 4.0), 1)
        C = round(random.uniform(2.5, 4.0), 1)
        natech = round(random.uniform(1.0, 1.8), 1)
        hazmat = False
        r_toplumsal = round(random.uniform(2.5, 4.0), 1)
    elif sector == "MUNICIPALITY":
        H = round(random.uniform(2.0, 3.5), 1)
        X = round(random.uniform(3.0, 4.5), 1)
        C = round(random.uniform(3.0, 4.5), 1)  # kamu kapasite genelde yüksek
        natech = round(random.uniform(1.0, 2.0), 1)
        hazmat = False
        r_toplumsal = round(random.uniform(2.0, 3.5), 1)
    else:  # OTHER
        H = round(random.uniform(1.5, 3.5), 1)
        X = round(random.uniform(2.0, 4.0), 1)
        C = round(random.uniform(2.0, 3.5), 1)
        natech = round(random.uniform(1.0, 2.0), 1)
        hazmat = False
        r_toplumsal = round(random.uniform(1.5, 3.0), 1)

    return {
        "H_score": H, "F_score": round(f, 1), "X_score": X, "C_score": C,
        "risk_deprem": r_deprem, "risk_sel": r_sel,
        "risk_sicaklik": round(random.uniform(1.5, 3.5), 1),
        "risk_firtina": round(random.uniform(1.5, 3.0), 1),
        "risk_toplumsal": r_toplumsal,
        "natech_risk": natech,
        "hazmat_flag": hazmat,
    }

# ═══════════════════════════════════════════════════════════════
# GERÇEK TESİSLER (Harita'dan çıkarılan)
# ═══════════════════════════════════════════════════════════════
REAL_FACILITIES = [
    # KAMU / BELEDİYE
    {"name": "Beylikdüzü Belediye Başkanlığı", "sector": "MUNICIPALITY", "sub": "belediye_sarayi", "neighborhood": "Büyükşehir", "lat": 41.0028, "lng": 28.6714, "year": 2005, "emp": 850, "24h": False},
    {"name": "Beylikdüzü Belediyesi ADM (Afet Yönetim)", "sector": "MUNICIPALITY", "sub": "afet_yonetim", "neighborhood": "Büyükşehir", "lat": 41.0032, "lng": 28.6720, "year": 2010, "emp": 45, "24h": True},
    {"name": "Beylikdüzü Belediyesi Fen İşleri Altyapı", "sector": "MUNICIPALITY", "sub": "fen_isleri", "neighborhood": "Kavaklı", "lat": 40.9920, "lng": 28.6521, "year": 2008, "emp": 120, "24h": False},
    {"name": "Beylikdüzü Belediyesi Gıda Bankası", "sector": "MUNICIPALITY", "sub": "sosyal_hizmet", "neighborhood": "Adnan Kahveci", "lat": 40.9985, "lng": 28.6602, "year": 2012, "emp": 25, "24h": False},
    {"name": "Beylikdüzü Belediyesi Zabıta Kontrol Noktası", "sector": "MUNICIPALITY", "sub": "zabita", "neighborhood": "Büyükşehir", "lat": 41.0015, "lng": 28.6698, "year": 2015, "emp": 80, "24h": True},
    {"name": "Beylikdüzü Belediyesi Spor Salonu", "sector": "MUNICIPALITY", "sub": "spor", "neighborhood": "Adnan Kahveci", "lat": 40.9978, "lng": 28.6625, "year": 2011, "emp": 35, "24h": False},
    {"name": "Beylikdüzü Belediyesi Kapalı Havuz ve Spor Merkezi", "sector": "MUNICIPALITY", "sub": "spor", "neighborhood": "Büyükşehir", "lat": 41.0041, "lng": 28.6731, "year": 2014, "emp": 55, "24h": False},
    {"name": "Barış Mahallesi Muhtarlığı ve Belediye Çözüm Merkezi", "sector": "MUNICIPALITY", "sub": "muhtarlik", "neighborhood": "Barış", "lat": 41.0035, "lng": 28.6812, "year": 2009, "emp": 12, "24h": False},
    {"name": "Bariş Manço Kültür Merkezi", "sector": "MUNICIPALITY", "sub": "kultur", "neighborhood": "Büyükşehir", "lat": 41.0022, "lng": 28.6745, "year": 2016, "emp": 40, "24h": False},
    {"name": "Beylikdüzü Afet Ani Lojistik ve Depolama Merkezi", "sector": "MUNICIPALITY", "sub": "afet_lojistik", "neighborhood": "Yakuplu", "lat": 40.9968, "lng": 28.6990, "year": 2018, "emp": 30, "24h": True},
    {"name": "Beylikdüzü Polis Merkez Amirliği", "sector": "MUNICIPALITY", "sub": "emniyet", "neighborhood": "Büyükşehir", "lat": 41.0008, "lng": 28.6688, "year": 2006, "emp": 280, "24h": True},
    {"name": "Beylikdüzü Sağlık Grup Başkanlığı", "sector": "MUNICIPALITY", "sub": "saglik_yonetim", "neighborhood": "Büyükşehir", "lat": 41.0019, "lng": 28.6705, "year": 2007, "emp": 45, "24h": False},
    {"name": "Afet Yönetim ve Koordinasyon Bürosu (AADYM)", "sector": "MUNICIPALITY", "sub": "eoc", "neighborhood": "Büyükşehir", "lat": 41.0025, "lng": 28.6718, "year": 2019, "emp": 25, "24h": True},
    {"name": "Beylikdüzü İlçe Müftülüğü", "sector": "MUNICIPALITY", "sub": "muftuluk", "neighborhood": "Büyükşehir", "lat": 41.0011, "lng": 28.6692, "year": 2004, "emp": 18, "24h": False},
    {"name": "Beylikdüzü Sivil Savunma Arama Kurtarma", "sector": "MUNICIPALITY", "sub": "sivil_savunma", "neighborhood": "Yakuplu", "lat": 40.9975, "lng": 28.7010, "year": 2015, "emp": 65, "24h": True},
    # SAĞLIK
    {"name": "Özel Kolan Hastanesi", "sector": "HOSPITAL", "sub": "ozel_hastane", "neighborhood": "Büyükşehir", "lat": 41.0045, "lng": 28.6758, "year": 2012, "emp": 450, "24h": True},
    {"name": "Göz Hastanesi Beylikdüzü", "sector": "HOSPITAL", "sub": "ozel_hastane", "neighborhood": "Büyükşehir", "lat": 41.0038, "lng": 28.6742, "year": 2014, "emp": 85, "24h": False},
    {"name": "Beylikdüzü Devlet Hastanesi", "sector": "HOSPITAL", "sub": "devlet_hastane", "neighborhood": "Kavaklı", "lat": 40.9935, "lng": 28.6558, "year": 1998, "emp": 680, "24h": True},
    {"name": "Hastahanesi Vespia Sağlık Merkezi", "sector": "HOSPITAL", "sub": "ozel_hastane", "neighborhood": "Adnan Kahveci", "lat": 40.9988, "lng": 28.6648, "year": 2016, "emp": 220, "24h": True},
    {"name": "Beykent Tıp Merkezi", "sector": "HOSPITAL", "sub": "tip_merkezi", "neighborhood": "Büyükşehir", "lat": 41.0052, "lng": 28.6768, "year": 2018, "emp": 95, "24h": False},
    {"name": "Fizyomed Polikliniği", "sector": "HOSPITAL", "sub": "poliklinik", "neighborhood": "Kavaklı", "lat": 40.9915, "lng": 28.6542, "year": 2020, "emp": 28, "24h": False},
    {"name": "Yakuplu Sağlık Merkezi (TEVD)", "sector": "HOSPITAL", "sub": "saglik_ocagi", "neighborhood": "Yakuplu", "lat": 40.9942, "lng": 28.7025, "year": 2015, "emp": 42, "24h": False},
    {"name": "Park Eczanesi", "sector": "HOSPITAL", "sub": "eczane", "neighborhood": "Adnan Kahveci", "lat": 40.9981, "lng": 28.6618, "year": 2008, "emp": 5, "24h": False},
    {"name": "Bilge Eczanesi", "sector": "HOSPITAL", "sub": "eczane", "neighborhood": "Büyükşehir", "lat": 41.0028, "lng": 28.6722, "year": 2010, "emp": 4, "24h": False},
    {"name": "Didem Eczanesi", "sector": "HOSPITAL", "sub": "eczane", "neighborhood": "Kavaklı", "lat": 40.9908, "lng": 28.6535, "year": 2012, "emp": 4, "24h": False},
    {"name": "Asmali Hayat Eczanesi", "sector": "HOSPITAL", "sub": "eczane", "neighborhood": "Sahil", "lat": 40.9752, "lng": 28.6488, "year": 2015, "emp": 3, "24h": False},
    {"name": "Marina Eczanesi", "sector": "HOSPITAL", "sub": "eczane", "neighborhood": "Sahil", "lat": 40.9742, "lng": 28.6495, "year": 2018, "emp": 3, "24h": False},
    {"name": "Yaşlı Bakımevi Beylikdüzü", "sector": "HOSPITAL", "sub": "bakim_evi", "neighborhood": "Gürpınar", "lat": 40.9812, "lng": 28.6288, "year": 2009, "emp": 65, "24h": True},
    {"name": "Çocuk Bakımevi Güli Akkuş", "sector": "HOSPITAL", "sub": "cocuk_bakimevi", "neighborhood": "Büyükşehir", "lat": 41.0038, "lng": 28.6738, "year": 2011, "emp": 32, "24h": False},
    # EĞİTİM
    {"name": "Bizimkent İlkokulu", "sector": "EDUCATION", "sub": "ilkokul", "neighborhood": "Büyükşehir", "lat": 41.0015, "lng": 28.6702, "year": 2002, "emp": 45, "24h": False},
    {"name": "Baki Gündüz İlkokulu", "sector": "EDUCATION", "sub": "ilkokul", "neighborhood": "Kavaklı", "lat": 40.9928, "lng": 28.6548, "year": 1995, "emp": 38, "24h": False},
    {"name": "Dr. Ayla Savaş Ortaokulu", "sector": "EDUCATION", "sub": "ortaokul", "neighborhood": "Büyükşehir", "lat": 41.0022, "lng": 28.6715, "year": 2005, "emp": 55, "24h": False},
    {"name": "Büyükşehir Ortaokulu", "sector": "EDUCATION", "sub": "ortaokul", "neighborhood": "Büyükşehir", "lat": 41.0035, "lng": 28.6728, "year": 2000, "emp": 52, "24h": False},
    {"name": "Koç Ortaokulu", "sector": "EDUCATION", "sub": "ortaokul", "neighborhood": "Adnan Kahveci", "lat": 40.9992, "lng": 28.6655, "year": 2008, "emp": 48, "24h": False},
    {"name": "Anadolu Lisesi Beylikdüzü", "sector": "EDUCATION", "sub": "lise", "neighborhood": "Barış", "lat": 41.0018, "lng": 28.6825, "year": 1998, "emp": 85, "24h": False},
    {"name": "Aşık Veysel Güzel Sanatlar Lisesi", "sector": "EDUCATION", "sub": "lise", "neighborhood": "Büyükşehir", "lat": 41.0042, "lng": 28.6752, "year": 2010, "emp": 62, "24h": False},
    {"name": "Yaşar Acar Fen Lisesi", "sector": "EDUCATION", "sub": "lise", "neighborhood": "Cumhuriyet", "lat": 41.0088, "lng": 28.6658, "year": 2015, "emp": 72, "24h": False},
    {"name": "İmam Hatip Ortaokulu Beylikdüzü", "sector": "EDUCATION", "sub": "imam_hatip", "neighborhood": "Kavaklı", "lat": 40.9922, "lng": 28.6555, "year": 2012, "emp": 45, "24h": False},
    {"name": "Aybüke Yalçın Anaokulu", "sector": "EDUCATION", "sub": "anaokul", "neighborhood": "Adnan Kahveci", "lat": 40.9975, "lng": 28.6622, "year": 2017, "emp": 22, "24h": False},
    {"name": "Özel Gülannem Anaokulu", "sector": "EDUCATION", "sub": "anaokul", "neighborhood": "Büyükşehir", "lat": 41.0032, "lng": 28.6725, "year": 2013, "emp": 18, "24h": False},
    {"name": "Özel Şebnem Anaokulu", "sector": "EDUCATION", "sub": "anaokul", "neighborhood": "Kavaklı", "lat": 40.9912, "lng": 28.6540, "year": 2015, "emp": 15, "24h": False},
    {"name": "Borsai İstanbul Kavakli Mesleki ve Teknik", "sector": "EDUCATION", "sub": "meslek_lisesi", "neighborhood": "Kavaklı", "lat": 40.9898, "lng": 28.6528, "year": 2007, "emp": 78, "24h": False},
    {"name": "İSMEK Gürpınar Kurs Merkezi", "sector": "EDUCATION", "sub": "kurs", "neighborhood": "Gürpınar", "lat": 40.9828, "lng": 28.6302, "year": 2011, "emp": 28, "24h": False},
    {"name": "Neşe Sever İlkokulu", "sector": "EDUCATION", "sub": "ilkokul", "neighborhood": "Barış", "lat": 41.0008, "lng": 28.6798, "year": 2003, "emp": 42, "24h": False},
    {"name": "Fatma Şensoy İlkokulu", "sector": "EDUCATION", "sub": "ilkokul", "neighborhood": "Cumhuriyet", "lat": 41.0075, "lng": 28.6648, "year": 2006, "emp": 40, "24h": False},
    {"name": "Şehit Büyükelçi Galip Balkar Ortaokulu", "sector": "EDUCATION", "sub": "ortaokul", "neighborhood": "Barış", "lat": 41.0025, "lng": 28.6845, "year": 2014, "emp": 55, "24h": False},
    {"name": "Özel Beylikdüzü Bahçeşehir Ortaokulu", "sector": "EDUCATION", "sub": "ortaokul", "neighborhood": "Büyükşehir", "lat": 41.0048, "lng": 28.6762, "year": 2009, "emp": 65, "24h": False},
    # SANAYİ / NATECH
    {"name": "Akçansa Çimento Fabrikası", "sector": "INDUSTRIAL", "sub": "cimento_fabrika", "neighborhood": "Yakuplu", "lat": 40.9782, "lng": 28.7185, "year": 1985, "emp": 320, "24h": True},
    {"name": "BOTAŞ Doğalgaz İletim", "sector": "INDUSTRIAL", "sub": "dogalgaz_terminal", "neighborhood": "Yakuplu", "lat": 40.9822, "lng": 28.7145, "year": 1990, "emp": 85, "24h": True},
    {"name": "Ambarli Doğalgaz Üretim Santrali", "sector": "INDUSTRIAL", "sub": "enerji_santral", "neighborhood": "Yakuplu", "lat": 40.9758, "lng": 28.7198, "year": 1992, "emp": 145, "24h": True},
    {"name": "Ambarli Limanı", "sector": "INDUSTRIAL", "sub": "liman", "neighborhood": "Yakuplu", "lat": 40.9712, "lng": 28.7225, "year": 1985, "emp": 580, "24h": True},
    {"name": "Limak Ambarli Çimento Fabrikası", "sector": "INDUSTRIAL", "sub": "cimento_fabrika", "neighborhood": "Yakuplu", "lat": 40.9742, "lng": 28.7210, "year": 1988, "emp": 275, "24h": True},
    {"name": "Birlik Sanayi Sitesi 1", "sector": "INDUSTRIAL", "sub": "sanayi_sitesi", "neighborhood": "Adnan Kahveci", "lat": 40.9965, "lng": 28.6682, "year": 1992, "emp": 850, "24h": False},
    {"name": "Birlik Sanayi Sitesi 2", "sector": "INDUSTRIAL", "sub": "sanayi_sitesi", "neighborhood": "Adnan Kahveci", "lat": 40.9958, "lng": 28.6675, "year": 1993, "emp": 780, "24h": False},
    {"name": "Birlik Sanayi Sitesi 3", "sector": "INDUSTRIAL", "sub": "sanayi_sitesi", "neighborhood": "Adnan Kahveci", "lat": 40.9952, "lng": 28.6668, "year": 1994, "emp": 720, "24h": False},
    {"name": "Birlik Sanayi Sitesi 4", "sector": "INDUSTRIAL", "sub": "sanayi_sitesi", "neighborhood": "Adnan Kahveci", "lat": 40.9945, "lng": 28.6661, "year": 1995, "emp": 690, "24h": False},
    {"name": "Birlik Sanayi Sitesi 5", "sector": "INDUSTRIAL", "sub": "sanayi_sitesi", "neighborhood": "Adnan Kahveci", "lat": 40.9938, "lng": 28.6654, "year": 1996, "emp": 650, "24h": False},
    {"name": "Birlik Sanayi Sitesi 6", "sector": "INDUSTRIAL", "sub": "sanayi_sitesi", "neighborhood": "Adnan Kahveci", "lat": 40.9931, "lng": 28.6647, "year": 1997, "emp": 610, "24h": False},
    {"name": "Bakırcılar Sanayi Sitesi", "sector": "INDUSTRIAL", "sub": "sanayi_sitesi", "neighborhood": "Adnan Kahveci", "lat": 40.9975, "lng": 28.6698, "year": 1988, "emp": 1200, "24h": False},
    {"name": "Beysan Sanayi Sitesi", "sector": "INDUSTRIAL", "sub": "sanayi_sitesi", "neighborhood": "Yakuplu", "lat": 40.9888, "lng": 28.7048, "year": 1991, "emp": 920, "24h": False},
    {"name": "Haramidere Sanayi Sitesi", "sector": "INDUSTRIAL", "sub": "sanayi_sitesi", "neighborhood": "Yakuplu", "lat": 40.9852, "lng": 28.7088, "year": 1989, "emp": 1450, "24h": False},
    {"name": "Mermerciler Sanayi Sitesi", "sector": "INDUSTRIAL", "sub": "mermer_sanayi", "neighborhood": "Yakuplu", "lat": 40.9912, "lng": 28.7118, "year": 1990, "emp": 680, "24h": False},
    {"name": "Kumport Lojistik Depo", "sector": "INDUSTRIAL", "sub": "lojistik_depo", "neighborhood": "Yakuplu", "lat": 40.9728, "lng": 28.7195, "year": 2005, "emp": 185, "24h": True},
    {"name": "Ara Depolama Merkezi Beylikdüzü", "sector": "INDUSTRIAL", "sub": "depo", "neighborhood": "Adnan Kahveci", "lat": 40.9988, "lng": 28.6712, "year": 2008, "emp": 65, "24h": False},
    # BANKA / FİNANS
    {"name": "Akbank Beylikdüzü Şubesi", "sector": "BANK", "sub": "banka_subesi", "neighborhood": "Büyükşehir", "lat": 41.0025, "lng": 28.6718, "year": 2008, "emp": 22, "24h": False},
    {"name": "Türkiye İş Bankası Beylikdüzü Şubesi", "sector": "BANK", "sub": "banka_subesi", "neighborhood": "Büyükşehir", "lat": 41.0018, "lng": 28.6708, "year": 2005, "emp": 18, "24h": False},
    {"name": "Ziraat Bankası Beylikdüzü Şubesi", "sector": "BANK", "sub": "banka_subesi", "neighborhood": "Kavaklı", "lat": 40.9925, "lng": 28.6552, "year": 2002, "emp": 15, "24h": False},
    {"name": "Yapı Kredi Beylikdüzü Şubesi", "sector": "BANK", "sub": "banka_subesi", "neighborhood": "Adnan Kahveci", "lat": 40.9982, "lng": 28.6635, "year": 2010, "emp": 20, "24h": False},
    {"name": "Halkbank Beylikdüzü Şubesi", "sector": "BANK", "sub": "banka_subesi", "neighborhood": "Büyükşehir", "lat": 41.0032, "lng": 28.6728, "year": 2006, "emp": 16, "24h": False},
    {"name": "Brand İstanbul AVM", "sector": "BANK", "sub": "avm", "neighborhood": "Büyükşehir", "lat": 41.0055, "lng": 28.6775, "year": 2015, "emp": 1850, "24h": False},
    {"name": "Beylik Pazarı Ticaret Merkezi", "sector": "BANK", "sub": "ticaret_merkezi", "neighborhood": "Büyükşehir", "lat": 41.0048, "lng": 28.6765, "year": 2012, "emp": 420, "24h": False},
    {"name": "Balık Hali Beylikdüzü", "sector": "BANK", "sub": "pazar", "neighborhood": "Sahil", "lat": 40.9725, "lng": 28.6478, "year": 1995, "emp": 85, "24h": False},
]

# ═══════════════════════════════════════════════════════════════
# PROSEDÜREL ÜRETİM FONKSİYONLARI
# ═══════════════════════════════════════════════════════════════

def gen_schools(count=155):
    types = [
        ("İlkokulu", "ilkokul", 35, 550), ("Ortaokulu", "ortaokul", 48, 650),
        ("Anadolu Lisesi", "lise", 72, 1200), ("Mesleki ve Teknik Lisesi", "meslek_lisesi", 65, 900),
        ("Anaokulu", "anaokul", 12, 120), ("Kreş ve Gündüz Bakımevi", "kres", 8, 80),
        ("Özel İlkokulu", "ozel_ilkokul", 30, 400), ("Özel Lisesi", "ozel_lise", 55, 700),
        ("Özel Anaokulu", "ozel_anaokul", 10, 100), ("Kurs Merkezi", "kurs", 18, 200),
        ("Kuran Kursu", "kuran_kursu", 8, 150), ("Özel Öğrenci Yurdu", "yurt", 45, 400),
    ]
    names = ["Atatürk", "Cumhuriyet", "Fatih Sultan Mehmet", "Gazi Mustafa Kemal", "Ziya Gökalp",
             "Mehmet Akif Ersoy", "Namık Kemal", "Yunus Emre", "Mimar Sinan", "Piri Reis",
             "Barbaros Hayrettin", "Kanuni Sultan Süleyman", "Yavuz Sultan Selim", "Alparslan",
             "Malazgirt", "Çanakkale", "İstiklal", "Özgürlük", "Barış", "Dostluk",
             "Kardeşlik", "Güven", "Umut", "Başarı", "Çalışkan", "Bilge"]
    results = []
    nbs = list(NEIGHBORHOODS.keys())
    for i in range(count):
        t_name, t_sub, t_emp_base, t_cap = random.choice(types)
        name_prefix = random.choice(names)
        nb = random.choice(nbs)
        lat, lng = rand_coord(nb)
        year = random.randint(1985, 2022)
        results.append({
            "name": f"{name_prefix} {t_name}", "sector": "EDUCATION", "sub": t_sub,
            "neighborhood": nb, "lat": lat, "lng": lng, "year": year,
            "emp": t_emp_base + random.randint(-10, 20), "24h": False,
            "capacity": t_cap + random.randint(-50, 100)
        })
    return results

def gen_health(count=95):
    types = [
        ("Aile Sağlığı Merkezi", "asm", 12, False),
        ("Sağlık Ocağı", "saglik_ocagi", 8, False),
        ("Eczane", "eczane", 4, False),
        ("Özel Klinik", "ozel_klinik", 18, False),
        ("Diş Hekimi", "dis_hekimi", 5, False),
        ("Diyaliz Merkezi", "diyaliz", 35, True),
        ("Veteriner Kliniği", "veteriner", 6, False),
        ("Fizik Tedavi Merkezi", "fizik_tedavi", 15, False),
        ("Acil Sağlık İstasyonu (112)", "acil_112", 25, True),
        ("Psikiyatri Kliniği", "psikiyatri", 12, False),
    ]
    names = ["Sağlık", "Yaşam", "Şifa", "Can", "Sena", "Anadolu", "Güven", "Umut",
             "Güneş", "Beylikdüzü", "Mavi", "Yeşil", "Altın", "Deniz", "Ece"]
    results = []
    nbs = list(NEIGHBORHOODS.keys())
    for i in range(count):
        t_name, t_sub, t_emp, t_24h = random.choice(types)
        name_prefix = random.choice(names)
        nb = random.choice(nbs)
        lat, lng = rand_coord(nb)
        year = random.randint(1990, 2023)
        results.append({
            "name": f"{name_prefix} {t_name}", "sector": "HOSPITAL", "sub": t_sub,
            "neighborhood": nb, "lat": lat, "lng": lng, "year": year,
            "emp": t_emp, "24h": t_24h
        })
    return results

def gen_industry(count=115):
    types = [
        ("Metal İşleme Fabrikası", "metal_fabrika", True, 180),
        ("Plastik Üretim Tesisi", "plastik_fabrika", True, 120),
        ("Kimya Deposu", "kimya_depo", True, 45),
        ("Akaryakıt İstasyonu", "akaryakit", True, 8),
        ("LPG Dolum Tesisi", "lpg_dolum", True, 22),
        ("Tekstil Atölyesi", "tekstil", False, 95),
        ("Ahşap İşleme Tesisi", "ahsap", False, 65),
        ("Gıda Üretim Tesisi", "gida_uretim", False, 145),
        ("Soğuk Hava Deposu", "soguk_depo", False, 35),
        ("Lojistik Depo", "lojistik", False, 55),
        ("Otomotiv Servisi", "oto_servis", False, 25),
        ("İnşaat Malzemeleri Deposu", "insaat_depo", False, 42),
        ("Elektrik Dağıtım Merkezi", "elektrik_dagitim", True, 18),
        ("Atık İşleme Tesisi", "atik_isleme", True, 38),
    ]
    results = []
    # Sanayi mahalleleri ağırlıklı
    nb_weights = {
        "Yakuplu": 40, "Adnan Kahveci": 30, "Kavaklı": 10,
        "Marmara": 8, "Barış": 5, "Büyükşehir": 4, "Cumhuriyet": 3
    }
    nbs = []
    for nb, w in nb_weights.items():
        nbs.extend([nb] * w)
    for i in range(count):
        t_name, t_sub, t_hazmat, t_emp = random.choice(types)
        nb = random.choice(nbs)
        lat, lng = rand_coord(nb)
        year = random.randint(1980, 2020)
        results.append({
            "name": f"{t_name} No.{i+1:03d}", "sector": "INDUSTRIAL", "sub": t_sub,
            "neighborhood": nb, "lat": lat, "lng": lng, "year": year,
            "emp": t_emp + random.randint(-20, 50), "24h": t_hazmat,
            "hazmat": t_hazmat
        })
    return results

def gen_banks(count=135):
    bank_names = ["Akbank", "Ziraat Bankası", "Türkiye İş Bankası", "Yapı Kredi",
                  "Halkbank", "Vakıfbank", "Garanti BBVA", "QNB Finansbank",
                  "Denizbank", "TEB", "HSBC", "ING Bank", "Odeabank"]
    market_names = ["BİM", "A101", "ŞOK", "Migros", "CarrefourSA", "Hakmar",
                    "Özdilek", "Kipa", "Makromarket", "File Market"]
    types = [
        ("Banka Şubesi", "banka_subesi", 16, False),
        ("Market", "market", 35, False),
        ("Zincir Market Şubesi", "zincir_market", 45, False),
        ("Alışveriş Merkezi", "avm", 850, False),
        ("Restoran Zinciri", "restoran", 25, False),
        ("Otel", "otel", 120, True),
        ("Büro Binası", "ofis", 180, False),
        ("Depo-Mağaza", "depo_magaza", 55, False),
        ("Akaryakıt İstasyonu Market", "akaryakit_market", 12, True),
    ]
    results = []
    nbs = list(NEIGHBORHOODS.keys())
    for i in range(count):
        t_name, t_sub, t_emp, t_24h = random.choice(types)
        if t_sub == "banka_subesi":
            prefix = random.choice(bank_names)
            name = f"{prefix} {random.choice(list(NEIGHBORHOODS.keys()))} Şubesi"
        elif "market" in t_sub:
            prefix = random.choice(market_names)
            name = f"{prefix} Beylikdüzü {i+1}"
        else:
            name = f"{t_name} {i+1:03d}"
        nb = random.choice(nbs)
        lat, lng = rand_coord(nb)
        year = random.randint(1995, 2023)
        results.append({
            "name": name, "sector": "BANK", "sub": t_sub,
            "neighborhood": nb, "lat": lat, "lng": lng, "year": year,
            "emp": t_emp + random.randint(-5, 20), "24h": t_24h
        })
    return results

def gen_infrastructure(count=85):
    types = [
        ("BEDAŞ Trafo Merkezi", "trafo", True, 8),
        ("İGDAŞ Doğalgaz Regülatörü", "dogalgaz_regulator", True, 5),
        ("İSKİ Su Deposu", "su_deposu", True, 6),
        ("İSKİ Pompa İstasyonu", "pompa_istasyon", True, 4),
        ("Türk Telekom Santrali", "telekom", True, 12),
        ("Baz İstasyonu", "baz_istasyon", False, 2),
        ("Atıksu Arıtma Tesisi", "aritma", True, 28),
        ("İETT Otobüs Garajı", "otobus_garaji", False, 85),
        ("Metrobüs İstasyonu", "metrobus", False, 15),
        ("Karayolları Bakım Yolu", "karayolu_bakim", False, 22),
    ]
    results = []
    nbs = list(NEIGHBORHOODS.keys())
    for i in range(count):
        t_name, t_sub, t_critical, t_emp = random.choice(types)
        nb = random.choice(nbs)
        lat, lng = rand_coord(nb)
        year = random.randint(1975, 2020)
        results.append({
            "name": f"{t_name} - {nb[:3].upper()}{i+1:02d}", "sector": "MUNICIPALITY",
            "sub": t_sub, "neighborhood": nb, "lat": lat, "lng": lng, "year": year,
            "emp": t_emp, "24h": t_critical
        })
    return results

def gen_public(count=120):
    types = [
        ("Mahalle Muhtarlığı", "muhtarlik", 5, False),
        ("Camii", "cami", 3, False),
        ("Belediye Çözüm Merkezi", "cozum_merkezi", 12, False),
        ("Park ve Yeşil Alan", "park", 4, False),
        ("Kütüphane", "kutuphane", 18, False),
        ("Spor Sahası", "spor_sahasi", 6, False),
        ("İtfaiye İstasyonu", "itfaiye", 45, True),
        ("Jandarma Karakolu", "jandarma", 25, True),
        ("PTT Şubesi", "ptt", 10, False),
        ("SYDV Sosyal Yardım", "sosyal_yardim", 15, False),
        ("Cemevi", "cemevi", 8, False),
        ("Kültür Merkezi", "kultur_merkezi", 28, False),
        ("Toplanma Alanı (AFAD)", "toplanma_alani", 2, False),
    ]
    results = []
    nbs = list(NEIGHBORHOODS.keys())
    for i in range(count):
        t_name, t_sub, t_emp, t_24h = random.choice(types)
        nb = random.choice(nbs)
        lat, lng = rand_coord(nb)
        year = random.randint(1980, 2022)
        results.append({
            "name": f"{t_name} - {nb}", "sector": "MUNICIPALITY", "sub": t_sub,
            "neighborhood": nb, "lat": lat, "lng": lng, "year": year,
            "emp": t_emp, "24h": t_24h
        })
    return results

def build_facility(f, code_counter):
    sector = f["sector"]
    nb = f["neighborhood"]
    year = f.get("year", 2000)
    lat = f["lat"]
    lng = f["lng"]
    
    # Sektör kodu
    sector_code = {"MUNICIPALITY": "MUN", "HOSPITAL": "SAG", "EDUCATION": "EGT",
                   "INDUSTRIAL": "IND", "BANK": "FIN", "HOTEL": "HOT", "OTHER": "OTH"}.get(sector, "OTH")
    code = f"BDZ-{sector_code}-{code_counter:04d}"
    
    scores = risk_scores(sector, nb, year)
    extra = {
        "sub_sector": f.get("sub", "genel"),
        "neighborhood": nb,
        **scores
    }
    if f.get("hazmat"): extra["hazmat_flag"] = True
    if f.get("capacity"): extra["capacity"] = f["capacity"]
    
    return {
        "id": str(uuid.uuid4()),
        "tenant_id": TENANT_ID,
        "code": code,
        "name": f["name"],
        "sector": sector,
        "is_active": True,
        "geom": f"POINT({lng} {lat})",
        "il_kodu": "34",
        "ilce_kodu": "3407",
        "building_age": 2025 - year,
        "employee_count": f.get("emp", 20),
        "operates_24h": f.get("24h", False),
        "asset_value_usd": round(random.uniform(500000, 50000000), 0),
        "extra_data": extra,
    }

def upsert_batch(facilities, client):
    resp = client.post(
        f"{SUPABASE_URL}/rest/v1/facilities",
        headers={**HEADERS, "Prefer": "resolution=merge-duplicates,return=minimal"},
        json=facilities,
        timeout=30
    )
    return resp.status_code in (200, 201)

def main():
    print("=" * 65)
    print("  Beylikdüzü 1000+ Tesis Seed Script")
    print("  HFER-720 Parametreleri Dahil")
    print("=" * 65)
    
    # Tüm tesisleri topla
    all_raw = (
        REAL_FACILITIES +
        gen_schools(155) +
        gen_health(95) +
        gen_industry(115) +
        gen_banks(135) +
        gen_infrastructure(85) +
        gen_public(120)
    )
    
    print(f"\nToplam tesis: {len(all_raw)}")
    
    # Facility objelerine dönüştür
    facilities = []
    for i, f in enumerate(all_raw):
        facilities.append(build_facility(f, i + 1))
    
    print(f"Build tamamlandı: {len(facilities)} tesis hazır\n")
    
    # Sektör dağılımı
    from collections import Counter
    dist = Counter(f["sector"] for f in facilities)
    for s, c in sorted(dist.items()):
        print(f"  {s:15s}: {c}")
    print()
    
    # Batch upload
    BATCH = 100
    ok, fail = 0, 0
    with httpx.Client() as client:
        for i in range(0, len(facilities), BATCH):
            batch = facilities[i:i+BATCH]
            batch_num = i // BATCH + 1
            total_batches = math.ceil(len(facilities) / BATCH)
            success = upsert_batch(batch, client)
            if success:
                ok += len(batch)
                print(f"  ✓ Batch {batch_num:2d}/{total_batches} — {ok} tesis yüklendi")
            else:
                fail += len(batch)
                print(f"  ✗ Batch {batch_num:2d}/{total_batches} — BAŞARISIZ")
    
    print("\n" + "=" * 65)
    print(f"  Başarılı : {ok}")
    print(f"  Başarısız: {fail}")
    print(f"  Toplam   : {len(facilities)}")
    if fail == 0:
        print("  ✅ Tüm tesisler Supabase'e yüklendi!")
    print("=" * 65)

if __name__ == "__main__":
    main()
