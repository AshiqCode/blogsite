import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getPublishedPosts } from "@/lib/queries";
import { PostCard } from "@/components/PostCard";
import { Pagination } from "@/components/Pagination";

const PAGE_SIZE = 9;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function getTag(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tags")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTag(slug);
  if (!tag) return { title: "Tag not found", robots: { index: false } };
  return {
    title: `#${tag.name}`,
    description: `Articles tagged ${tag.name}`,
    alternates: { canonical: `/tag/${slug}` },
  };
}

export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const tag = await getTag(slug);
  if (!tag) notFound();

  const { posts, count } = await getPublishedPosts({
    tagSlug: slug,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-12 border-b border-border pb-10 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">
          Tagged
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          #{tag.name}
        </h1>
      </header>

      {posts.length === 0 ? (
        <p className="py-16 text-center text-muted">
          No articles with this tag yet.
        </p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={count}
            basePath={`/tag/${slug}`}
          />
        </>
      )}
    </div>
  );
}
