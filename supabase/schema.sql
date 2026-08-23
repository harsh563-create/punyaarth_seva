-- Punyaarth Seva — Supabase schema
-- Run in the Supabase SQL editor (or via `supabase db push`).
--
-- Conventions:
-- - Localized text is stored as jsonb: { "en": string, "hi": string }
-- - Columns use camelCase to mirror the TypeScript types, so rows map 1:1.
-- - The Next.js API uses the service-role key, which bypasses RLS.
--   Anon users get read-only access so the public site can query directly.

-- ---------------------------------------------------------------- tables --

create table if not exists public.events (
  id                  text primary key,
  title               jsonb not null,
  description         jsonb not null default '{"en":"","hi":""}',
  date                text not null,
  location            jsonb not null default '{"en":"","hi":""}',
  image               text not null default '',
  status              text not null default 'upcoming'
                      check (status in ('upcoming', 'past')),
  "volunteersNeeded"  integer,
  "volunteersJoined"  integer,
  created_at          timestamptz not null default now()
);

create table if not exists public.activities (
  id                    text primary key,
  title                 jsonb not null,
  description           jsonb not null default '{"en":"","hi":""}',
  date                  text not null,
  location              jsonb not null default '{"en":"","hi":""}',
  category              text not null check (category in (
                          'all', 'food-seva', 'nature', 'animals',
                          'community', 'events', 'awareness')),
  images                jsonb not null default '[]',
  "volunteersInvolved"  integer,
  featured              boolean not null default false,
  created_at            timestamptz not null default now()
);

create table if not exists public.seva_categories (
  id               text primary key,
  title            jsonb not null,
  description      jsonb not null default '{"en":"","hi":""}',
  "longDescription" jsonb not null default '{"en":"","hi":""}',
  icon             text not null default '',
  image            text not null default '',
  activities       jsonb not null default '[]',
  created_at       timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id         text primary key,
  src        text not null,
  alt        jsonb not null default '{"en":"","hi":""}',
  category   text not null check (category in (
               'all', 'food-seva', 'nature', 'animals',
               'community', 'events', 'awareness')),
  date       text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.impact_stats (
  id         text primary key,
  label      jsonb not null,
  value      integer not null default 0,
  suffix     text not null default '',
  icon       text not null default '',
  created_at timestamptz not null default now()
);

-- Donation page configuration (single row, id = 'default').
-- UPI ID / QR code are intentionally empty until the organization sets
-- real values from the admin panel — no demo payment details ship.
create table if not exists public.donation_settings (
  id                      text primary key default 'default',
  "upiId"                 text not null default '',
  "payeeName"             text not null default 'Punyaarth Seva Samiti',
  "qrImage"               text not null default '',
  "orgName"               text not null default 'Punyaarth Seva Samiti',
  "registrationDetails"   text not null default '',
  "taxExemptionDetails"   text not null default '',
  "contactEmail"          text not null default '',
  "contactPhone"          text not null default '',
  created_at              timestamptz not null default now()
);

-- Donor-submitted payment confirmations. No anon policies: reads/writes go
-- through the Next.js API with the service-role key, so donor data stays private.
create table if not exists public.donations (
  id           text primary key,
  "donorName"  text not null,
  mobile       text not null,
  amount       integer not null check (amount > 0),
  utr          text not null,
  screenshot   text not null default '',
  status       text not null default 'pending'
               check (status in ('pending', 'verified')),
  created_at   timestamptz not null default now()
);

-- ------------------------------------------------------------------- rls --

alter table public.events           enable row level security;
alter table public.activities       enable row level security;
alter table public.seva_categories  enable row level security;
alter table public.gallery_images   enable row level security;
alter table public.impact_stats     enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array[
    'events', 'activities', 'seva_categories', 'gallery_images', 'impact_stats'
  ] loop
    execute format(
      'drop policy if exists "public read %1$s" on public.%1$I;', t
    );
    execute format(
      'create policy "public read %1$s" on public.%1$I for select to anon, authenticated using (true);',
      t
    );
  end loop;
end $$;

-- --------------------------------------------------------------- storage --

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Private bucket for donor payment screenshots. Only the service-role key
-- (i.e. the Next.js API after admin auth) can read these.
insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', false)
on conflict (id) do update set public = false where id = 'payment-proofs';

-- Public read access to uploaded media.
drop policy if exists "public read media" on storage.objects;
create policy "public read media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

-- Writes go through the Next.js API using the service role key, which
-- bypasses RLS, so no insert/update/delete policies are created here.
