-- =============================================================================
-- Migration: Authors module.
-- Adds an `authors` table and links posts to an author.
-- Run ONCE in the Supabase SQL Editor (safe to re-run).
-- =============================================================================

create table if not exists public.authors (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  role       text,
  bio        text,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.posts
  add column if not exists author_id uuid references public.authors(id) on delete set null;

create index if not exists posts_author_idx on public.posts(author_id);

-- Row Level Security
alter table public.authors enable row level security;

drop policy if exists "authors_public_read" on public.authors;
create policy "authors_public_read" on public.authors
  for select using (true);

drop policy if exists "authors_admin_write" on public.authors;
create policy "authors_admin_write" on public.authors
  for all to authenticated using (true) with check (true);
