import { createClient } from '@supabase/supabase-js'

// Service role key — sadece server-side / admin işlemlerinde kullan.
// Bu fonksiyon API route'lardan veya Supabase Edge Function'lardan çağrılmalı.
// İstemci tarafında çağrılması durumunda güvenlik riski oluşur.
const supabaseAdmin = createClient(
  'https://gqguwgbopgnpwzjwcexl.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// ─── Tipler ───────────────────────────────────────────────────────────────────

export interface TenantOlusturSonuc {
  tenant_id: string
  admin_profile_id: string | null
  hata: string | null
}

export interface TenantOlusturParams {
  /** Kurum tam adı — örn: "Akbank A.Ş." */
  name: string
  /** URL-safe slug — örn: "akbank" */
  slug: string
  /** Opsiyonel: tenant'a bağlanacak ilk admin kullanıcısının auth.users UUID'si */
  admin_user_id?: string
  /** Opsiyonel: admin kullanıcısının tam adı */
  admin_full_name?: string
}

// ─── Ana Fonksiyon ────────────────────────────────────────────────────────────

/**
 * Yeni bir tenant oluşturur ve opsiyonel olarak admin profili ekler.
 *
 * Adımlar:
 * 1. `public.tenants` tablosuna yeni satır ekle
 * 2. admin_user_id verilmişse `public.profiles` tablosuna admin rolüyle ekle
 *
 * @example
 * const sonuc = await createTenant({
 *   name: 'Garanti BBVA',
 *   slug: 'garanti-bbva',
 *   admin_user_id: 'uuid-from-auth-users',
 *   admin_full_name: 'Platform Admin',
 * })
 */
export async function createTenant(
  params: TenantOlusturParams
): Promise<TenantOlusturSonuc> {
  const { name, slug, admin_user_id, admin_full_name } = params

  // 1. Tenants tablosunu oluştur (yoksa)
  //    Bu migration'da yapılır; burada sadece insert.
  const { data: tenant, error: tenantError } = await supabaseAdmin
    .from('tenants')
    .insert({
      name,
      slug,
      created_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (tenantError || !tenant) {
    return {
      tenant_id: '',
      admin_profile_id: null,
      hata: `Tenant oluşturma hatası: ${tenantError?.message ?? 'Bilinmeyen hata'}`,
    }
  }

  const tenantId: string = tenant.id

  // 2. Admin kullanıcısı verilmişse profil ekle
  if (!admin_user_id) {
    return { tenant_id: tenantId, admin_profile_id: null, hata: null }
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert({
      id:         admin_user_id,
      tenant_id:  tenantId,
      role:       'admin',
      full_name:  admin_full_name ?? 'Admin',
      created_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (profileError || !profile) {
    // Tenant oluşturuldu ama profil eklenemedi — kısmi başarı
    return {
      tenant_id: tenantId,
      admin_profile_id: null,
      hata: `Tenant oluşturuldu (${tenantId}) ancak admin profili eklenemedi: ${profileError?.message ?? 'Bilinmeyen hata'}`,
    }
  }

  return {
    tenant_id:        tenantId,
    admin_profile_id: profile.id,
    hata:             null,
  }
}

// ─── Tenants tablosu migration SQL'i (referans) ───────────────────────────────
// Supabase SQL Editor'da çalıştır:
//
// CREATE TABLE IF NOT EXISTS public.tenants (
//   id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   name       TEXT NOT NULL,
//   slug       TEXT UNIQUE NOT NULL,
//   plan       TEXT DEFAULT 'trial',
//   created_at TIMESTAMPTZ DEFAULT now()
// );
//
// ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
//
// -- Sadece kendi tenant kaydını görebilir
// CREATE POLICY "tenants_select_own"
//   ON public.tenants FOR SELECT
//   USING (
//     id = (SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1)
//   );
//
// -- Admin tüm tenant'ları görebilir (service role bypass zaten var)
