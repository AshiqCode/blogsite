-- =============================================================================
-- Migration: add author (E-E-A-T) fields to the settings table.
-- Run this ONCE in the Supabase SQL Editor if you already created your
-- database from an earlier version of schema.sql.
-- (Fresh installs from schema.sql already include these columns.)
-- =============================================================================

alter table public.settings
  add column if not exists author_name   text,
  add column if not exists author_bio    text,
  add column if not exists author_avatar text;
