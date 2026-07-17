-- =============================================================================
-- Migration: web push notifications + comment moderation mode.
-- Run ONCE in the Supabase SQL Editor (safe to re-run).
-- =============================================================================

-- Comment moderation: 'manual' (approve each) or 'auto' (approve on submit)
alter table public.settings
  add column if not exists comment_moderation text not null default 'manual';

-- Link a comment to the subscriber who wrote it, for approve/reject pushes
alter table public.comments
  add column if not exists subscriber_endpoint text;

-- Web push subscriptions
create table if not exists public.push_subscriptions (
  id         uuid primary key default gen_random_uuid(),
  endpoint   text not null unique,
  p256dh     text not null,
  auth       text not null,
  created_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;

drop policy if exists "push_public_insert" on public.push_subscriptions;
create policy "push_public_insert" on public.push_subscriptions
  for insert with check (true);

drop policy if exists "push_public_delete" on public.push_subscriptions;
create policy "push_public_delete" on public.push_subscriptions
  for delete using (true);

drop policy if exists "push_admin_all" on public.push_subscriptions;
create policy "push_admin_all" on public.push_subscriptions
  for all to authenticated using (true) with check (true);
