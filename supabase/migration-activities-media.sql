-- Activities: video links + long story text
-- Adds columns missing on older remote tables. Safe to re-run.

alter table public.activities
  add column if not exists videos jsonb not null default '[]';

alter table public.activities
  add column if not exists "longDescription" jsonb not null default '{"en":"","hi":""}';

-- Existing rows keep working; new fields simply start empty.
update public.activities
set videos = '[]'
where videos is null;
