-- ═══════════════════════════════════════════════════════════════
--  RESILIA Platform — Supabase Veritabanı Şeması
--  İTÜ AYM iş birliğiyle geliştirilmiştir
--  Proje: https://jvmvhzvozegjaonggahq.supabase.co
-- ═══════════════════════════════════════════════════════════════
-- Kurulum: Supabase Dashboard > SQL Editor > buraya yapıştırın

-- ── Temizle (yeniden kurulum için) ───────────────────────────
drop table if exists form_cevaplari cascade;
drop table if exists birimler       cascade;
drop table if exists kullanicilar   cascade;
drop table if exists tenantlar      cascade;
drop type  if exists sektor_tipi;
drop type  if exists rol_tipi;

-- ── Enum tipler ───────────────────────────────────────────────
create type sektor_tipi as enum (
  'bankacilik', 'saglik', 'konaklama',
  'uretim', 'hizmet', 'odalar',
  'belediye', 'meb'
);

create type rol_tipi as enum (
  'birim', 'uzman', 'board', 'admin'
);

-- ── Tenantlar (müşteri kurumlar) ─────────────────────────────
create table tenantlar (
  id          uuid primary key default gen_random_uuid(),
  ad          text not null,
  sektor      sektor_tipi not null,
  logo_url    text,
  aktif       boolean default true,
  olusturulma timestamptz default now()
);

-- ── Kullanıcılar ─────────────────────────────────────────────
create table kullanicilar (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid references tenantlar(id) on delete cascade,
  email       text unique not null,
  ad_soyad    text not null,
  rol         rol_tipi not null default 'birim',
  birim_kodu  text,
  aktif       boolean default true,
  olusturulma timestamptz default now()
);

-- ── Birimler ─────────────────────────────────────────────────
-- Şube / Tesis / Okul / Belediye Birimi / OSB Firması vb.
create table birimler (
  id               uuid primary key default gen_random_uuid(),
  tenant_id        uuid references tenantlar(id) on delete cascade,
  kod              text not null,
  ad               text not null,
  sektor           sektor_tipi not null,
  il               text not null,
  ilce             text,
  adres            text,
  koordinat_lat    numeric(9,6),
  koordinat_lng    numeric(9,6),
  deprem_bolgesi   smallint check (deprem_bolgesi between 1 and 5),
  personel_sayisi  integer,
  aktif            boolean default true,
  olusturulma      timestamptz default now(),
  unique(tenant_id, kod)
);

-- ── Form Cevapları (ana veri tablosu) ────────────────────────
create table form_cevaplari (
  id                  uuid primary key default gen_random_uuid(),
  tenant_id           uuid references tenantlar(id) on delete cascade,
  birim_kodu          text not null,
  senaryo             text not null,
  puanlar             jsonb not null default '{}',
  dayaniklilik_skoru  integer not null default 0 check (dayaniklilik_skoru between 0 and 100),
  h_skoru             integer check (h_skoru between 0 and 100),
  f_skoru             integer check (f_skoru between 0 and 100),
  e_skoru             integer check (e_skoru between 0 and 100),
  durum               text not null default 'taslak'
                      check (durum in ('taslak', 'gonderildi', 'incelendi')),
  dolduran_email      text,
  inceleme_notu       text,
  olusturulma         timestamptz default now(),
  gonderilme          timestamptz,
  incelenme           timestamptz
);

-- ── İndeksler ────────────────────────────────────────────────
create index idx_formlar_tenant    on form_cevaplari(tenant_id);
create index idx_formlar_birim     on form_cevaplari(birim_kodu);
create index idx_formlar_senaryo   on form_cevaplari(senaryo);
create index idx_formlar_durum     on form_cevaplari(durum);
create index idx_formlar_skor      on form_cevaplari(dayaniklilik_skoru);
create index idx_formlar_tarih     on form_cevaplari(olusturulma desc);
create index idx_birimler_tenant   on birimler(tenant_id);
create index idx_birimler_il       on birimler(il);

-- ── Row Level Security ────────────────────────────────────────
alter table form_cevaplari enable row level security;
alter table birimler       enable row level security;

-- Şimdilik tüm işlemlere izin ver (demo için)
-- Üretimde tenant bazlı kısıtlama eklenecek
create policy "demo_tum_erisim" on form_cevaplari
  for all using (true) with check (true);

create policy "demo_tum_erisim" on birimler
  for all using (true) with check (true);

-- ── Demo Verisi ───────────────────────────────────────────────

-- Tenant: Akbank
insert into tenantlar (id, ad, sektor) values
  ('11111111-1111-1111-1111-111111111111', 'Akbank A.Ş.',          'bankacilik'),
  ('22222222-2222-2222-2222-222222222222', 'Medical Park Hastaneler','saglik'),
  ('33333333-3333-3333-3333-333333333333', 'Rixos Hotels Turkey',   'konaklama'),
  ('44444444-4444-4444-4444-444444444444', 'Gebze OSB',             'uretim'),
  ('55555555-5555-5555-5555-555555555555', 'İstanbul Ticaret Odası','odalar'),
  ('66666666-6666-6666-6666-666666666666', 'İBB Afet Koordinasyon','belediye'),
  ('77777777-7777-7777-7777-777777777777', 'MEB İstanbul İl MEM',  'meb');

-- Birimler: Akbank şubeleri
insert into birimler (tenant_id, kod, ad, sektor, il, ilce, deprem_bolgesi) values
  ('11111111-1111-1111-1111-111111111111', '0042', 'Kadıköy Şubesi',       'bankacilik', 'İstanbul', 'Kadıköy',   2),
  ('11111111-1111-1111-1111-111111111111', '0091', 'Çankaya Şubesi',       'bankacilik', 'Ankara',   'Çankaya',   3),
  ('11111111-1111-1111-1111-111111111111', '0137', 'Bornova Şubesi',       'bankacilik', 'İzmir',    'Bornova',   2),
  ('11111111-1111-1111-1111-111111111111', '0214', 'Antakya Şubesi',       'bankacilik', 'Hatay',    'Antakya',   5),
  ('11111111-1111-1111-1111-111111111111', '0078', 'Osmangazi Şubesi',     'bankacilik', 'Bursa',    'Osmangazi', 3),
  ('11111111-1111-1111-1111-111111111111', '0183', 'Konak Şubesi',         'bankacilik', 'İzmir',    'Konak',     2);

-- Birimler: Belediye
insert into birimler (tenant_id, kod, ad, sektor, il, ilce) values
  ('66666666-6666-6666-6666-666666666666', 'IBB-AFAD-01', 'AFAD Koordinasyon Merkezi', 'belediye', 'İstanbul', 'Fatih'),
  ('66666666-6666-6666-6666-666666666666', 'IBB-ILK-01',  'İlk Yardım İstasyonu',      'belediye', 'İstanbul', 'Kadıköy'),
  ('66666666-6666-6666-6666-666666666666', 'IBB-SU-01',   'Su ve Kanalizasyon Birimi', 'belediye', 'İstanbul', 'Ümraniye');

-- Birimler: MEB Okulları
insert into birimler (tenant_id, kod, ad, sektor, il, ilce) values
  ('77777777-7777-7777-7777-777777777777', 'MEB-IST-0042', 'Kadıköy Anadolu Lisesi',      'meb', 'İstanbul', 'Kadıköy'),
  ('77777777-7777-7777-7777-777777777777', 'MEB-IST-0187', 'Beşiktaş İlköğretim Okulu',   'meb', 'İstanbul', 'Beşiktaş'),
  ('77777777-7777-7777-7777-777777777777', 'MEB-HAT-0011', 'Antakya Merkez Ortaokulu',    'meb', 'Hatay',    'Antakya');

-- ── View: Dashboard özeti ─────────────────────────────────────
create or replace view v_dashboard_ozet as
select
  tenant_id,
  count(*)                                      as toplam_form,
  round(avg(dayaniklilik_skoru))               as ortalama_skor,
  count(*) filter (where dayaniklilik_skoru < 40)  as kritik,
  count(*) filter (where dayaniklilik_skoru between 40 and 69) as orta,
  count(*) filter (where dayaniklilik_skoru >= 70)  as guclu,
  max(olusturulma)                              as son_guncelleme
from form_cevaplari
where durum = 'gonderildi'
group by tenant_id;

-- ── View: Kritik birimler ──────────────────────────────────────
create or replace view v_kritik_birimler as
select
  f.tenant_id,
  f.birim_kodu,
  f.senaryo,
  f.dayaniklilik_skoru,
  f.h_skoru,
  f.f_skoru,
  f.e_skoru,
  f.olusturulma,
  b.ad        as birim_ad,
  b.il,
  b.ilce
from form_cevaplari f
left join birimler b on b.tenant_id = f.tenant_id and b.kod = f.birim_kodu
where f.dayaniklilik_skoru < 40
  and f.durum = 'gonderildi'
order by f.dayaniklilik_skoru asc;
