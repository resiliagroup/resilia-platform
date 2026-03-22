-- ============================================================
-- Migration 004: facility-photos bucket → private + signed URL politikaları
-- Supabase SQL Editor'da çalıştır
-- ============================================================

-- 1. Bucket'ı private yap (public: false)
UPDATE storage.buckets
SET    public = false
WHERE  id = 'facility-photos';

-- 2. Eski açık okuma politikasını kaldır
DROP POLICY IF EXISTS "Herkes okuyabilir"              ON storage.objects;
DROP POLICY IF EXISTS "Kimliği doğrulanmış yükleyebilir" ON storage.objects;
DROP POLICY IF EXISTS "Kimliği doğrulanmış güncelleyebilir" ON storage.objects;

-- 3. Yeni politikalar:
--    SELECT  → sadece kimliği doğrulanmış kullanıcılar (signed URL için gerekli)
--    INSERT  → sadece kimliği doğrulanmış kullanıcılar, kendi tenant klasörlerine
--    UPDATE  → sadece kimliği doğrulanmış kullanıcılar, kendi tenant klasörlerine
--    DELETE  → sadece kimliği doğrulanmış kullanıcılar, kendi tenant klasörlerine

CREATE POLICY "facility_photos_select_auth"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'facility-photos'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "facility_photos_insert_auth"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'facility-photos'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "facility_photos_update_auth"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'facility-photos'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "facility_photos_delete_auth"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'facility-photos'
    AND auth.role() = 'authenticated'
  );

-- ============================================================
-- UYGULAMA TARAFI DEĞİŞİKLİKLERİ (Bu dosya ile birlikte)
-- ============================================================
-- 1. fotoYukle() artık storage path döndürmeli (tam URL değil)
--    Örnek path: "abc123-facility-id/cover.jpg"
--    DB'de photo_url = storage path olarak sakla.
--
-- 2. Fotoğraf gösterirken:
--    const { data } = await supabase.storage
--      .from('facility-photos')
--      .createSignedUrl(facility.photo_url, 3600)  -- 1 saat = 3600 saniye
--    <img src={data.signedUrl} />
--
-- 3. Mevcut satırlarda tam URL saklanıyorsa path'e dönüştür:
--    UPDATE public.facilities
--    SET photo_url = regexp_replace(
--      photo_url,
--      '.*/facility-photos/',
--      ''
--    )
--    WHERE photo_url LIKE '%facility-photos%';
-- ============================================================
