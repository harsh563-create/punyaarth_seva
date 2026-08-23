-- Migration: About page editable content
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).
-- Safe to re-run.

create table if not exists public.about_content (
  id         text primary key default 'default',
  content    jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- No anon read policy needed: the row holds only marketing copy, and the
-- website reads it through the server-side data layer (service role).
insert into public.about_content (id) values ('default')
on conflict (id) do nothing;
