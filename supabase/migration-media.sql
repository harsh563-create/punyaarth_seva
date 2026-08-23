-- Shared media library: add an image/video once, reuse it in any module.
-- Safe to re-run.

create table if not exists public.media_assets (
  id         text primary key,
  url        text not null,
  kind       text not null default 'image'
             check (kind in ('image', 'video')),
  title      text not null default '',
  source     text not null default 'link'
             check (source in ('upload', 'youtube', 'link')),
  created_at timestamptz not null default now()
);

alter table public.media_assets enable row level security;

-- Intentionally NO anon policy: the library is admin-only and served through
-- the Next.js API with the service-role key.
