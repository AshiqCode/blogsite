import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/queries";
import { formatDate, readingTime } from "@/lib/utils";
import { AuthorBio } from "@/components/AuthorBio";
import type { Author, PostWithRelations } from "@/lib/types";

export const metadata: Metadata = { title: "Preview", robots: { index: false } };

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data }, settings] = await Promise.all([
    supabase
      .from("posts")
      .select("*, category:categories(*), tags:tags(*)")
      .eq("id", id)
      .single(),
    getSettings(),
  ]);

  if (!data) notFound();
  const post = data as unknown as PostWithRelations;

  // Fetch the assigned author (if any) safely.
  let postAuthor: Author | null = null;
  if (post.author_id) {
    const { data: a } = await supabase
      .from("authors")
      .select("*")
      .eq("id", post.author_id)
      .single();
    postAuthor = (a as Author) ?? null;
  }

  const author = {
    name: postAuthor?.name || settings.author_name || settings.site_title,
    bio: postAuthor?.bio ?? settings.author_bio,
    avatar: postAuthor?.avatar_url ?? settings.author_avatar,
    role: postAuthor?.role ?? null,
  };
  const authorName = author.name;

  return (
    <div>
      {/* Preview banner */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber/40 bg-amber/10 px-4 py-3 text-sm">
        <span className="font-semibold">
          👁 Preview —{" "}
          <span className="capitalize text-accent">{post.status}</span>. Only you
          can see this.
        </span>
        <div className="flex gap-2">
          <Link
            href={`/admin/posts/${post.id}/edit`}
            className="rounded-lg border border-border bg-white px-3 py-1.5 font-medium hover:bg-zinc-100"
          >
            ← Back to editor
          </Link>
          {post.status === "published" && (
            <Link
              href={`/post/${post.slug}`}
              target="_blank"
              className="rounded-lg bg-accent px-3 py-1.5 font-medium text-white hover:bg-accent-hover"
            >
              View live ↗
            </Link>
          )}
        </div>
      </div>

      <article className="mx-auto max-w-3xl rounded-2xl border border-border bg-background px-5 py-10 sm:px-8">
        <div className="mb-8 text-center">
          {post.category ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-accent">
              {post.category.name}
            </span>
          ) : (
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              Story
            </span>
          )}
          <h1 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl">
            {post.title || "Untitled"}
          </h1>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm font-semibold text-muted">
            <span className="text-foreground">By {authorName}</span>
            <span className="h-1 w-1 rounded-full bg-border-strong" aria-hidden />
            <span>{formatDate(post.published_at ?? post.created_at)}</span>
            <span className="h-1 w-1 rounded-full bg-border-strong" aria-hidden />
            <span>{readingTime(post.content)}</span>
          </div>
        </div>

        {post.featured_image && (
          <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-[1.25rem] bg-surface-2 shadow-soft">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        <div
          className="prose-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.tags.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-semibold text-muted"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        <AuthorBio
          name={author.name}
          bio={author.bio}
          avatar={author.avatar}
          role={author.role}
        />
      </article>
    </div>
  );
}
