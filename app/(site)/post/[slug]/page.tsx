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
  const author = {
    name: post.author?.name || settings.author_name || settings.site_title,
    bio: post.author?.bio ?? settings.author_bio,
    avatar: post.author?.avatar_url ?? settings.author_avatar,
    role: post.author?.role ?? null,
  };
  const authorName = author.name;

  // Best-effort view tracking.
  void trackView(slug);

  const shareUrl = absoluteUrl(`/post/${post.slug}`);
  const wordCount = post.content
    .replace(/<[^>]*>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

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
    wordCount,
    inLanguage: "en",
    url: shareUrl,
  };

  // Breadcrumb structured data (Home › Category › Post).
  const breadcrumbItems = [
    { name: "Home", url: absoluteUrl("/") },
    ...(post.category
      ? [
          {
            name: post.category.name,
            url: absoluteUrl(`/category/${post.category.slug}`),
          },
        ]
      : []),
    { name: post.title, url: shareUrl },
  ];
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 text-xs font-medium text-muted"
      >
        <Link href="/" className="transition-colors hover:text-accent">
          Home
        </Link>
        {post.category && (
          <>
            <ChevronSep />
            <Link
              href={`/category/${post.category.slug}`}
              className="transition-colors hover:text-accent"
            >
              {post.category.name}
            </Link>
          </>
        )}
        <ChevronSep />
        <span className="max-w-[24ch] truncate text-foreground/45 sm:max-w-[45ch]">
          {post.title}
        </span>
      </nav>

      <header className="mb-10 text-center">
        {post.category ? (
          <Link
            href={`/category/${post.category.slug}`}
            className="inline-flex items-center rounded-full bg-accent-soft px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-accent transition-colors hover:bg-accent hover:text-white"
          >
            {post.category.name}
          </Link>
        ) : (
          <span className="text-xs font-bold uppercase tracking-widest text-accent">
            Story
          </span>
        )}

        <h1 className="mx-auto mt-5 max-w-2xl font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted">
            {post.excerpt}
          </p>
        )}

        {/* Author byline + meta */}
        <div className="mt-7 flex items-center justify-center gap-3">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-accent-soft ring-2 ring-surface">
            {author.avatar ? (
              <Image
                src={author.avatar}
                alt={authorName}
                fill
                sizes="44px"
                className="object-cover"
              />
            ) : (
              <span className="flex h-full items-center justify-center font-display text-base font-semibold text-accent">
                {authorName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold leading-tight text-foreground">
              {authorName}
              {author.role ? (
                <span className="font-normal text-muted"> · {author.role}</span>
              ) : null}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs font-medium text-muted">
              <span className="inline-flex items-center gap-1">
                <CalendarIcon />
                {formatDate(post.published_at)}
              </span>
              <span className="inline-flex items-center gap-1">
                <ClockIcon />
                {readingTime(post.content)}
              </span>
              <span className="inline-flex items-center gap-1">
                <EyeIcon />
                {post.views.toLocaleString()}{" "}
                {post.views === 1 ? "view" : "views"}
              </span>
            </div>
          </div>
        </div>
      </header>

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

      <AuthorBio
        name={author.name}
        bio={author.bio}
        avatar={author.avatar}
        role={author.role}
      />

      <RelatedPosts posts={relatedPosts} />

      <CommentSection postId={post.id} comments={comments} />
    </article>
  );
}

/* --- small inline icons for the byline / breadcrumb --- */

function ChevronSep() {
  return (
    <svg
      className="h-3 w-3 text-border-strong"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
