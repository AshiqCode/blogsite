import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-[7rem] font-semibold leading-none text-accent/25 sm:text-[9rem]">
        404
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        This page wandered off
      </h1>
      <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted">
        The page you’re looking for doesn’t exist, may have been moved, or the
        link was mistyped. Let’s get you back on track.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-accent-hover"
        >
          ← Back home
        </Link>
        <Link
          href="/search"
          className="rounded-full border border-border bg-surface px-6 py-2.5 text-sm font-semibold text-muted shadow-sm transition-colors hover:border-accent hover:text-accent"
        >
          Search articles
        </Link>
      </div>
    </div>
  );
}
