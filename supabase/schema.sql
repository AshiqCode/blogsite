-- =============================================================================
-- Personal Blog — Supabase schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- =============================================================================

-- Extensions --------------------------------------------------------------
create extension if not exists "pgcrypto";

-- =============================================================================
-- Tables
-- =============================================================================

create table if not exists public.categories (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  slug           text not null unique,
  description    text,
  featured_image text,
  created_at     timestamptz not null default now()
);

create table if not exists public.tags (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  slug             text not null unique,
  excerpt          text,
  content          text not null default '',
  featured_image   text,
  category_id      uuid references public.categories(id) on delete set null,
  status           text not null default 'draft'
                     check (status in ('draft','published','archived')),
  meta_title       text,
  meta_description text,
  views            integer not null default 0,
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table if not exists public.post_tags (
  post_id uuid not null references public.posts(id) on delete cascade,
  tag_id  uuid not null references public.tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

create table if not exists public.comments (
  id           uuid primary key default gen_random_uuid(),
  post_id      uuid not null references public.posts(id) on delete cascade,
  author_name  text not null,
  author_email text not null,
  content      text not null,
  status       text not null default 'pending'
                 check (status in ('pending','approved','spam')),
  parent_id    uuid references public.comments(id) on delete cascade,
  created_at   timestamptz not null default now()
);

create table if not exists public.media (
  id           uuid primary key default gen_random_uuid(),
  file_name    text not null,
  storage_path text not null,
  url          text not null,
  alt_text     text,
  caption      text,
  file_size    bigint,
  mime_type    text,
  created_at   timestamptz not null default now()
);

-- Single-row settings table (id is always 1).
create table if not exists public.settings (
  id                  int primary key default 1 check (id = 1),
  site_title          text not null default 'My Blog',
  tagline             text,
  logo_url            text,
  favicon_url         text,
  about               text,
  contact_email       text,
  contact_phone       text,
  social_twitter      text,
  social_facebook     text,
  social_instagram    text,
  social_github       text,
  social_linkedin     text,
  footer_text          text,
  seo_title            text,
  seo_description      text,
  seo_keywords         text,
  google_analytics_id  text,
  google_verification  text,
  adsense_publisher_id text,
  updated_at           timestamptz not null default now()
);

insert into public.settings (id, site_title, tagline)
values (1, 'My Blog', 'Thoughts, stories and ideas.')
on conflict (id) do nothing;

-- Indexes -----------------------------------------------------------------
create index if not exists posts_status_idx       on public.posts(status);
create index if not exists posts_published_at_idx  on public.posts(published_at desc);
create index if not exists posts_category_idx      on public.posts(category_id);
create index if not exists comments_post_idx       on public.comments(post_id);
create index if not exists comments_status_idx     on public.comments(status);

-- =============================================================================
-- Triggers & functions
-- =============================================================================

-- Keep posts.updated_at current.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- Atomically increment a published post's view counter (called from the site).
create or replace function public.increment_post_views(post_slug text)
returns void language sql security definer as $$
  update public.posts
     set views = views + 1
   where slug = post_slug and status = 'published';
$$;

-- =============================================================================
-- Row Level Security
-- Public visitors use the anon key. The admin uses an authenticated session.
-- "Single administrator" model: any authenticated user is treated as admin,
-- so keep sign-ups DISABLED in Supabase Auth settings.
-- =============================================================================

alter table public.categories enable row level security;
alter table public.tags       enable row level security;
alter table public.posts      enable row level security;
alter table public.post_tags  enable row level security;
alter table public.comments   enable row level security;
alter table public.media      enable row level security;
alter table public.settings   enable row level security;

-- Categories: public read, admin write.
create policy "categories_public_read" on public.categories
  for select using (true);
create policy "categories_admin_write" on public.categories
  for all to authenticated using (true) with check (true);

-- Tags: public read, admin write.
create policy "tags_public_read" on public.tags
  for select using (true);
create policy "tags_admin_write" on public.tags
  for all to authenticated using (true) with check (true);

-- Posts: public reads published only; admin reads/writes everything.
create policy "posts_public_read_published" on public.posts
  for select using (status = 'published');
create policy "posts_admin_all" on public.posts
  for all to authenticated using (true) with check (true);

-- Post/tag links: public read, admin write.
create policy "post_tags_public_read" on public.post_tags
  for select using (true);
create policy "post_tags_admin_write" on public.post_tags
  for all to authenticated using (true) with check (true);

-- Comments: public can read approved and submit new (pending) ones.
create policy "comments_public_read_approved" on public.comments
  for select using (status = 'approved');
create policy "comments_public_insert" on public.comments
  for insert with check (status = 'pending');
create policy "comments_admin_all" on public.comments
  for all to authenticated using (true) with check (true);

-- Media: public read, admin write.
create policy "media_public_read" on public.media
  for select using (true);
create policy "media_admin_write" on public.media
  for all to authenticated using (true) with check (true);

-- Settings: public read, admin write.
create policy "settings_public_read" on public.settings
  for select using (true);
create policy "settings_admin_write" on public.settings
  for all to authenticated using (true) with check (true);

-- =============================================================================
-- Storage bucket for the media library
-- =============================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media_bucket_public_read" on storage.objects
  for select using (bucket_id = 'media');
create policy "media_bucket_admin_write" on storage.objects
  for all to authenticated using (bucket_id = 'media') with check (bucket_id = 'media');
