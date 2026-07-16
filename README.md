# Personal Blog

A personal blogging platform built with **Next.js 16** (App Router), **Supabase**
(Postgres + Auth + Storage), **Tailwind CSS v4**, and a **Tiptap** rich-text editor.

A single administrator manages all content from a secure dashboard; visitors read
articles, browse by category/tag, search, comment, and share.

## Features

- **Public site** — homepage with featured post + paginated grid, single post pages
  with reading time & views, category / tag archives, full-text search, about page,
  social share buttons, and a moderated comment system.
- **Admin dashboard** (`/admin`) — overview stats, and full CRUD for:
  - Posts (rich-text editor, slug, featured image, category, tags, SEO fields,
    draft/publish/archive, scheduled publish date)
  - Categories & Tags
  - Media Library (drag-and-drop uploads to Supabase Storage, alt text/captions)
  - Comments (approve / unapprove / reply / edit / spam / delete)
  - Website Settings (title, logo, favicon, about, contact, socials, footer, SEO,
    Google Analytics)
- **Auth** — Supabase email/password, session refresh + `/admin` guard via proxy.
- **Security** — Row Level Security on every table; comment HTML is sanitized;
  a honeypot blocks basic comment spam.

## Setup

### 1. Create a Supabase project

At [supabase.com](https://supabase.com), create a project. Then in
**Project Settings → API**, copy the values into `.env.local` (see
`.env.local.example`):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_ADMIN_EMAIL=you@example.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Run the database schema

Open **SQL Editor → New query**, paste the contents of
[`supabase/schema.sql`](supabase/schema.sql), and run it. This creates all tables,
indexes, triggers, Row Level Security policies, and the public `media` storage bucket.

### 3. Create the administrator account

In **Authentication → Users → Add user**, create a user with the email/password you
will log in with. Then, under **Authentication → Providers → Email**, **disable
sign-ups** ("Allow new users to sign up") so this stays a single-admin site — any
authenticated user is treated as the admin.

### 4. Install & run

```bash
pnpm install
pnpm dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin login: [http://localhost:3000/login](http://localhost:3000/login)

## Project structure

```
app/
  (site)/            Public site (header/footer layout)
    page.tsx         Homepage
    post/[slug]/     Article page + comment server action
    category/[slug]/ Category archive
    tag/[slug]/      Tag archive
    search/          Search results
    about/           About page
  admin/             Protected dashboard (sidebar layout)
    posts/ categories/ tags/ media/ comments/ settings/
  login/             Admin login
components/           Shared + admin UI components
lib/
  supabase/          Browser / server / proxy clients
  queries.ts         Public data fetchers
  utils.ts           slug, sanitize, dates, excerpts
  upload.ts          Storage upload helper
proxy.ts             Session refresh + /admin guard
supabase/schema.sql  Database schema + RLS + storage
```

## Notes

- The project folder is named `restaurant`, but the app is a blog — rename freely.
- `better-sqlite3` from the original scaffold is unused and can be removed.
