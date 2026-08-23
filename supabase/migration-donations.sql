-- Punyaarth Seva — Donations feature migration
-- Run this once in the Supabase SQL editor
-- (Dashboard → SQL Editor → New query → paste → Run).
-- Idempotent: safe to run multiple times.

-- ------------------------------------------------------------- tables --

-- Donation page configuration (single row, id = 'default').
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

-- Donor-submitted payment confirmations. No anon policies on purpose:
-- reads/writes go through the Next.js API with the service-role key so
-- donor data stays private.
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

alter table public.donation_settings enable row level security;
alter table public.donations         enable row level security;

-- Settings are public info (org/UPI details) — safe to expose read-only.
drop policy if exists "public read donation_settings" on public.donation_settings;
create policy "public read donation_settings"
  on public.donation_settings for select
  to anon, authenticated
  using (true);

-- ---------------------------------------------------------------- storage --

-- Private bucket for donor payment screenshots. Only the service-role key
-- (i.e. the authenticated Next.js API) can read/write these.
insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', false)
on conflict (id) do update set public = false where id = 'payment-proofs';
