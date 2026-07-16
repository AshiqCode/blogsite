import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  getPostBySlug,
  getRelatedPosts,
  getSettings,
  trackView,
} from "@/lib/queries";
import { formatDate, readingTime } from "@/lib/utils";
import { absoluteUrl } from "@/lib/site";
import { CommentSection } from "@/components/CommentSection";
import { ShareButtons } from "@/components/ShareButtons";
import { AuthorBio } from "@/components/AuthorBio";
import { RelatedPosts } from "@/components/RelatedPosts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPostBySlug(slug);
  if (!result) return { title: "Not found", robots: { index: false } };
  const { post } = result;
  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt || undefined;
  const url = absoluteUrl(`/post/${post.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      modifiedTime: post.updated_at ?? undefined,
      tags: post.tags.map((t) => t.name),
      images: post.featured_image ? [post.featured_image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.featured_image ? [post.featured_image] : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const [result, settings] = await Promise.all([
    getPostBySlug(slug),
    getSettings(),
  ]);

  if (!result) notFound();
  const { post, comments } = result;

  const relatedPosts = await getRelatedPosts(post.id, post.category_id);
  const authorName = settings.author_name || settings.site_title;

  // Best-effort view tracking.
  void trackView(slug);

  const shareUrl = absoluteUrl(`/post/${post.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.meta_description || post.excerpt || undefined,
    image: post.featured_image ? [post.featured_image] : undefined,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at ?? undefined,
    author: { "@type": "Person", name: authorName },
    publisher: {
      "@type": "Organization",
      name: settings.site_title,
      logo: settings.logo_url
        ? { "@type": "ImageObject", url: settings.logo_url }
        : undefined,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": shareUrl },
    keywords: post.tags.map((t) => t.name).join(", ") || undefined,
    articleSection: post.category?.name,
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mb-8 text-center">
        {post.category ? (
          <Link
            href={`/category/${post.category.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-accent transition-colors hover:bg-accent hover:text-white"
          >
            {post.category.name}
          </Link>
        ) : (
          <span className="text-xs font-bold uppercase tracking-widest text-accent">
            Story
          </span>
        )}
        <h1 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl">
          {post.title}
        </h1>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm font-semibold text-muted">
          <span className="text-foreground">By {authorName}</span>
          <span className="h-1 w-1 rounded-full bg-border-strong" aria-hidden />
          <span>{formatDate(post.published_at)}</span>
          <span className="h-1 w-1 rounded-full bg-border-strong" aria-hidden />
          <span>{readingTime(post.content)}</span>
          <span className="h-1 w-1 rounded-full bg-border-strong" aria-hidden />
          <span>{post.views} views</span>
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
            priority
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
            <Link
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-semibold text-muted shadow-sm transition-colors hover:border-accent hover:text-accent"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-10 border-t border-border pt-6">
        <ShareButtons url={shareUrl} title={post.title} />
      </div>

      <AuthorBio settings={settings} />

      <RelatedPosts posts={relatedPosts} />

      <CommentSection postId={post.id} comments={comments} />
    </article>
  );
}
