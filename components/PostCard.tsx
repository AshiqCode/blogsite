import Link from "next/link";
import Image from "next/image";
import type { PostWithRelations } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function PostCard({ post }: { post: PostWithRelations }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link href={`/post/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
          {post.featured_image ? (
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-accent-soft to-surface-2 font-display text-5xl font-semibold text-accent/50">
              {post.title.charAt(0)}
            </div>
          )}
          {post.category && (
            <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent shadow-sm backdrop-blur">
              {post.category.name}
            </span>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <h3 className="font-display text-xl font-semibold leading-snug tracking-tight">
          <Link
            href={`/post/${post.slug}`}
            className="transition-colors hover:text-accent"
          >
            {post.title}
          </Link>
        </h3>
        {post.excerpt && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted">
            {post.excerpt}
          </p>
        )}
        <p className="mt-auto flex items-center gap-2 pt-2 text-xs font-semibold text-muted">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber" />
          {formatDate(post.published_at)}
        </p>
      </div>
    </article>
  );
}
