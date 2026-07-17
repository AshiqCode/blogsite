import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/queries";
import { PostCard } from "@/components/PostCard";
import { Pagination } from "@/components/Pagination";

const PAGE_SIZE = 9;

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = "", page: pageParam } = await searchParams;
  const query = q.trim();
  const page = Math.max(1, Number(pageParam) || 1);

  const { posts, count } = query
    ? await getPublishedPosts({
        search: query,
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      })
    : { posts: [], count: 0 };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">
          Search
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight">
          {query ? <>Results for “{query}”</> : "Find a story"}
        </h1>
        {query && (
          <p className="mt-2 font-semibold text-muted">
            {count} result{count === 1 ? "" : "s"}
          </p>
        )}
      </header>

      {!query ? (
        <p className="text-muted">Type a search term in the box above.</p>
      ) : posts.length === 0 ? (
        <p className="py-16 text-center text-muted">
          No articles matched your search.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={count}
            basePath={`/search?q=${encodeURIComponent(query)}`}
          />
        </>
      )}
    </div>
  );
}
