-- Migration: Our Team / team_members
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).
-- Safe to re-run; everything is idempotent.

create table if not exists public.team_members (
  id               text primary key,
  name             text not null,
  designation      jsonb not null default '{"en":"","hi":""}',
  category         text not null default 'volunteer'
                   check (category in ('leadership', 'core', 'volunteer')),
  bio              jsonb not null default '{"en":"","hi":""}',
  photo            text not null default '',
  socials          jsonb not null default '[]',
  phone            text not null default '',
  "showPhone"      boolean not null default false,
  active           boolean not null default true,
  "publicProfile"  boolean not null default true,
  "orderIndex"     integer not null default 0,
  created_at       timestamptz not null default now()
);

-- Intentionally NO anon read policy: members can store private contact
-- details here. The website reads via the server (service role) and the
-- admin panel uses the session-guarded /api/team endpoints.

-- Seed: founder profile (edit any time from Admin → Team).
insert into public.team_members
  (id, name, designation, category, bio, photo, socials, phone,
   "showPhone", active, "publicProfile", "orderIndex")
values (
  'mbr-founder',
  'Drx Devashish Shukla',
  '{"en":"Founder & President","hi":"संस्थापक एवं अध्यक्ष"}',
  'leadership',
  '{"en":"Founded Punyaarth Seva Samiti with the belief that ordinary people, coming together, can create extraordinary change. Leads the organization''s vision, seva drives and community programs.","hi":"पुण्यार्थ सेवा समिति की स्थापना इस विश्वास के साथ की कि साधारण लोग मिलकर असाधारण परिवर्तन ला सकते हैं। संस्था के दृष्टिकोण, सेवा अभियानों और सामुदायिक कार्यक्रमों का नेतृत्व करते हैं।"}',
  '',
  '[]',
  '',
  false,
  true,
  true,
  0
)
on conflict (id) do nothing;
