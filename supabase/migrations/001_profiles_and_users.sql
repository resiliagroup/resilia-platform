-- ============================================================
-- Sprint 1: Profiles tablosu + rol sistemi
-- Supabase SQL Editor'da çalıştır
-- ============================================================

-- 1. Profiles tablosu
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id   UUID NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('admin', 'uzman', 'izleme')),
  full_name   TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 2. RLS aç
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Kullanıcı kendi profilini görebilir
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Kullanıcı kendi profilini güncelleyebilir
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admin tüm profilleri görebilir
CREATE POLICY "profiles_select_admin"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- 3. Yeni auth kullanıcısı oluşturulduğunda otomatik profil oluştur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, tenant_id, role, full_name)
  VALUES (
    NEW.id,
    COALESCE((NEW.raw_user_meta_data->>'tenant_id')::UUID, '11111111-0000-0000-0000-000000000001'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'izleme'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- KULLANICI OLUŞTURMA TALİMATI
-- Supabase Dashboard > Authentication > Users > Add User
--
-- demo@omniversel.com / Demo2026!
-- uzman@omniversel.com / Uzman2026!
-- izleme@omniversel.com / Izleme2026!
--
-- Kullanıcıları oluşturduktan sonra aşağıdaki SQL ile
-- profilleri güncelle (auth.users tablosundan UUID'leri al):
-- ============================================================

-- Örnek: kullanıcıları oluşturduktan sonra profilleri manuel set et
-- UPDATE public.profiles SET role = 'admin'  WHERE id = '<demo@omniversel.com UUID>';
-- UPDATE public.profiles SET role = 'uzman'  WHERE id = '<uzman@omniversel.com UUID>';
-- UPDATE public.profiles SET role = 'izleme' WHERE id = '<izleme@omniversel.com UUID>';

-- Veya direkt insert (trigger'dan önce kullanıcı oluşturulduysa):
-- INSERT INTO public.profiles (id, tenant_id, role, full_name) VALUES
--   ('<UUID_demo>',   '11111111-0000-0000-0000-000000000001', 'admin',  'Demo Admin'),
--   ('<UUID_uzman>',  '11111111-0000-0000-0000-000000000001', 'uzman',  'Uzman Kullanıcı'),
--   ('<UUID_izleme>', '11111111-0000-0000-0000-000000000001', 'izleme', 'İzleme Kullanıcı');
