import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts, getSettings } from "@/lib/queries";
import { PostCard } from "@/components/PostCard";
import { formatDate, readingTime } from "@/lib/utils";
import { Pagination } from "@/components/Pagination";

const PAGE_SIZE = 9;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const settings = await getSettings();

  const { posts, count } = await getPublishedPosts({
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });

  const featured = page === 1 ? posts[0] : null;
  const rest = featured ? posts.slice(1) : posts;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Hero */}
      <section className="relative mb-14 text-center">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-amber" />
          The Journal
        </span>
        <h1 className="mx-auto max-w-3xl font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          {settings.site_title}
        </h1>
        {settings.tagline && (
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted">
            {settings.tagline}
          </p>
        )}
      </section>

      {posts.length === 0 ? (
        <div className="card-soft mx-auto max-w-md px-8 py-16 text-center">
          <p className="font-display text-2xl font-semibold">Nothing here yet</p>
          <p className="mt-2 text-muted">
            The first story is on its way. Check back soon.
          </p>
        </div>
      ) : (
        <>
          {featured && (
            <Link
              href={`/post/${featured.slug}`}
              className="group mb-16 grid overflow-hidden rounded-[1.5rem] border border-border bg-surface shadow-soft transition-all duration-300 hover:shadow-lift md:grid-cols-2"
            >
              <div className="relative aspect-[16/11] bg-surface-2 md:aspect-auto">
                {featured.featured_image ? (
                  <Image
                    src={featured.featured_image}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="flex h-full min-h-64 items-center justify-center bg-gradient-to-br from-accent-soft to-surface-2 font-display text-7xl font-semibold text-accent/40">
                    {featured.title.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center gap-4 p-7 md:p-10">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
                  <span className="h-px w-6 bg-accent" />
                  {featured.category ? featured.category.name : "Featured"}
                </span>
                <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight transition-colors group-hover:text-accent md:text-4xl">
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p className="leading-relaxed text-muted">{featured.excerpt}</p>
                )}
                <p className="mt-1 flex items-center gap-3 text-sm font-semibold text-muted">
                  <span>{formatDate(featured.published_at)}</span>
                  <span className="h-1 w-1 rounded-full bg-border-strong" />
                  <span>{readingTime(featured.content)}</span>
                </p>
              </div>
            </Link>
          )}

          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              Latest stories
            </h2>
            <span className="text-sm font-semibold text-muted">
              {count} article{count === 1 ? "" : "s"}
            </span>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={count}
            basePath="/"
          />
        </>
      )}
    </div>
  );
}
