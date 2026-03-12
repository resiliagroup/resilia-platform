import pandas as pd
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

def create_omni_checklist():
    # 4 Aşamalı Master Planın Tüm Adımları
    data = [
        # AŞAMA 1
        {"Aşama": "Aşama 1: Veritabanı ve Güvenlik", "Görev Kodu": "1.1", "Görev": "Supabase Tenant, Profile ve Assessment tablolarının kurulması", "Durum": "Tamamlandı", "Sektörel Hedef": "Tüm Sektörler"},
        {"Aşama": "Aşama 1: Veritabanı ve Güvenlik", "Görev Kodu": "1.2", "Görev": "Row Level Security (RLS) ile veri izolasyonunun sağlanması", "Durum": "Tamamlandı", "Sektörel Hedef": "Bankacılık (Akbank)"},
        {"Aşama": "Aşama 1: Veritabanı ve Güvenlik", "Görev Kodu": "1.3", "Görev": "JSONB formatında esnek regülasyon veri altyapısının kurulması", "Durum": "Bekliyor", "Sektörel Hedef": "DORA, NIS2"},
        
        # AŞAMA 2
        {"Aşama": "Aşama 2: Tasarım Sistemi (UI/UX)", "Görev Kodu": "2.1", "Görev": "Next.js ve Tailwind CSS ile modern klasör yapısının oluşturulması", "Durum": "Tamamlandı", "Sektörel Hedef": "Genel Arayüz"},
        {"Aşama": "Aşama 2: Tasarım Sistemi (UI/UX)", "Görev Kodu": "2.2", "Görev": "HFE-360 Radar Grafik ve Kart tabanlı Dashboard inşası", "Durum": "Tamamlandı", "Sektörel Hedef": "Yönetim Kurulu (Board)"},
        {"Aşama": "Aşama 2: Tasarım Sistemi (UI/UX)", "Görev Kodu": "2.3", "Görev": "Master Layout (Sidebar ve Navigasyon) mimarisinin oturtulması", "Durum": "Devam Ediyor", "Sektörel Hedef": "Kullanıcı Deneyimi"},
        {"Aşama": "Aşama 2: Tasarım Sistemi (UI/UX)", "Görev Kodu": "2.4", "Görev": "Uzun BIA formlarının Adım Adım (Wizard) ekranlara dönüştürülmesi", "Durum": "Bekliyor", "Sektörel Hedef": "Tesis Uzmanları"},
        
        # AŞAMA 3
        {"Aşama": "Aşama 3: Yapay Zeka (Ollama) Entegrasyonu", "Görev Kodu": "3.1", "Görev": "Yerel Ollama Llama 3 API köprüsünün kurulması", "Durum": "Tamamlandı", "Sektörel Hedef": "Sıfır Veri Sızıntısı"},
        {"Aşama": "Aşama 3: Yapay Zeka (Ollama) Entegrasyonu", "Görev Kodu": "3.2", "Görev": "Yönetim Kurulu'na özel Türkçe kurumsal prompt mühendisliği", "Durum": "Tamamlandı", "Sektörel Hedef": "Stratejik Raporlama"},
        {"Aşama": "Aşama 3: Yapay Zeka (Ollama) Entegrasyonu", "Görev Kodu": "3.3", "Görev": "Üretilen AI raporlarının Supabase 'Arşiv' tablosuna kaydedilmesi", "Durum": "Devam Ediyor", "Sektörel Hedef": "Kurumsal Hafıza"},
        {"Aşama": "Aşama 3: Yapay Zeka (Ollama) Entegrasyonu", "Görev Kodu": "3.4", "Görev": "RAG Mimarisi: AFAD, BDDK, SATAKOL mevzuatlarının Vektör DB'ye yüklenmesi", "Durum": "Bekliyor", "Sektörel Hedef": "Regülatif Uyum"},
        
        # AŞAMA 4
        {"Aşama": "Aşama 4: Denetim ve Kurumsal Çıktı", "Görev Kodu": "4.1", "Görev": "Analizlerin logolu ve zaman damgalı PDF formatında dışa aktarılması", "Durum": "Bekliyor", "Sektörel Hedef": "TSE / İSO Denetimi"},
        {"Aşama": "Aşama 4: Denetim ve Kurumsal Çıktı", "Görev Kodu": "4.2", "Görev": "Kullanıcı eylem günlüklerinin (Audit Logs) veritabanında tutulması", "Durum": "Bekliyor", "Sektörel Hedef": "Sistem Güvenliği"},
        {"Aşama": "Aşama 4: Denetim ve Kurumsal Çıktı", "Görev Kodu": "4.3", "Görev": "Çoklu Şube / Tesis performanslarını kıyaslayan Isı Haritası (Heatmap) ekranı", "Durum": "Bekliyor", "Sektörel Hedef": "Sanayi Odaları / MEB"}
    ]

    # DataFrame oluşturma
    df = pd.DataFrame(data)
    
    # Excel dosyasına yazma
    excel_adi = "OMNI_HFE360_Master_Plan.xlsx"
    writer = pd.ExcelWriter(excel_adi, engine='openpyxl')
    df.to_excel(writer, index=False, sheet_name='Yol_Haritasi')
    
    # Görsel düzenlemeler (Sütun genişlikleri ve başlık renkleri)
    worksheet = writer.sheets['Yol_Haritasi']
    
    # Başlık stili
    header_fill = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid") # Lacivert
    header_font = Font(color="FFFFFF", bold=True)
    
    for col_num, value in enumerate(df.columns.values):
        cell = worksheet.cell(row=1, column=col_num + 1)
        cell.fill = header_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal='center', vertical='center')
        
    # Sütun genişliklerini ayarlama
    column_widths = {'A': 35, 'B': 12, 'C': 70, 'D': 15, 'E': 25}
    for col, width in column_widths.items():
        worksheet.column_dimensions[col].width = width

    writer.close()
    print(f"✅ Harika! {excel_adi} dosyası başarıyla oluşturuldu.")

if __name__ == "__main__":
    create_omni_checklist()