"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { savePost, type PostFormState } from "@/app/admin/posts/actions";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageField } from "@/components/admin/ImageField";
import { slugify } from "@/lib/utils";
import type { Author, Category, PostWithRelations } from "@/lib/types";

const initial: PostFormState = {};

function toLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function PostEditor({
  categories,
  authors,
  post,
}: {
  categories: Category[];
  authors: Author[];
  post?: PostWithRelations;
}) {
  const [state, formAction, pending] = useActionState(savePost, initial);
  const [content, setContent] = useState(post?.content ?? "");
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(post?.slug));

  return (
    <form action={formAction} className="space-y-6">
      {post && <input type="hidden" name="id" value={post.id} />}
      <input type="hidden" name="content" value={content} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">
          {post ? "Edit Post" : "New Post"}
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/posts"
            className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-100"
          >
            Cancel
          </Link>
          {post && (
            <Link
              href={`/admin/posts/${post.id}/preview`}
              target="_blank"
              className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-100"
            >
              Preview
            </Link>
          )}
          <button
            type="submit"
            name="status"
            value="draft"
            disabled={pending}
            className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold hover:bg-zinc-100 disabled:opacity-60"
          >
            Save Draft
          </button>
          <button
            type="submit"
            name="status"
            value="published"
            disabled={pending}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
          >
            {pending ? "Saving…" : "Publish"}
          </button>
        </div>
      </div>

      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-5 lg:col-span-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input
              name="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugEdited) setSlug(slugify(e.target.value));
              }}
              required
              placeholder="Post title"
              className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-lg font-semibold outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">URL Slug</label>
            <input
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugEdited(true);
              }}
              placeholder="post-url-slug"
              className="w-full rounded-lg border border-border bg-white px-4 py-2 font-mono text-sm outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Content</label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Excerpt</label>
            <textarea
              name="excerpt"
              defaultValue={post?.excerpt ?? ""}
              rows={2}
              placeholder="Short summary (auto-generated if left blank)"
              className="w-full resize-y rounded-lg border border-border bg-white px-4 py-2.5 text-sm outline-none focus:border-accent"
            />
          </div>

          {/* SEO */}
          <fieldset className="space-y-4 rounded-xl border border-border bg-white p-4">
            <legend className="px-1 text-sm font-semibold">SEO</legend>
            <div>
              <label className="mb-1 block text-sm font-medium">Meta Title</label>
              <input
                name="meta_title"
                defaultValue={post?.meta_title ?? ""}
                className="w-full rounded-lg border border-border px-4 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Meta Description
              </label>
              <textarea
                name="meta_description"
                defaultValue={post?.meta_description ?? ""}
                rows={2}
                className="w-full resize-y rounded-lg border border-border px-4 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
          </fieldset>
        </div>

        {/* Sidebar column */}
        <div className="space-y-5">
          <div className="rounded-xl border border-border bg-white p-4">
            <label className="mb-2 block text-sm font-medium">
              Featured Image
            </label>
            <ImageField name="featured_image" defaultValue={post?.featured_image} />
          </div>

          <div className="rounded-xl border border-border bg-white p-4">
            <label className="mb-1 block text-sm font-medium">Category</label>
            <select
              name="category_id"
              defaultValue={post?.category_id ?? ""}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-accent"
            >
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <p className="mt-2 text-xs text-zinc-500">
                No categories yet.{" "}
                <Link href="/admin/categories" className="text-accent hover:underline">
                  Create one
                </Link>
                .
              </p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-white p-4">
            <label className="mb-1 block text-sm font-medium">Author</label>
            <select
              name="author_id"
              defaultValue={post?.author_id ?? ""}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-accent"
            >
              <option value="">— Default (site author) —</option>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                  {a.role ? ` · ${a.role}` : ""}
                </option>
              ))}
            </select>
            {authors.length === 0 && (
              <p className="mt-2 text-xs text-zinc-500">
                No authors yet.{" "}
                <Link href="/admin/authors" className="text-accent hover:underline">
                  Add one
                </Link>
                .
              </p>
            )}
          </div>

          <div className="rounded-xl border border-border bg-white p-4">
            <label className="mb-1 block text-sm font-medium">Tags</label>
            <input
              name="tags"
              defaultValue={post?.tags.map((t) => t.name).join(", ") ?? ""}
              placeholder="tech, life, tutorial"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <p className="mt-1 text-xs text-zinc-500">
              Comma-separated. New tags are created automatically.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-white p-4">
            <label className="mb-1 block text-sm font-medium">
              Publish Date
            </label>
            <input
              type="datetime-local"
              name="published_at"
              defaultValue={toLocalInput(post?.published_at ?? null)}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <p className="mt-1 text-xs text-zinc-500">
              Leave blank to use the current time on publish.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
