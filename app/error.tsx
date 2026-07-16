"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error in logs for debugging.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-[6rem] font-semibold leading-none text-accent/25 sm:text-[8rem]">
        oops
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Something went wrong
      </h1>
      <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted">
        An unexpected error occurred while loading this page. Please try again —
        if it keeps happening, come back a little later.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-accent-hover"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border border-border bg-surface px-6 py-2.5 text-sm font-semibold text-muted shadow-sm transition-colors hover:border-accent hover:text-accent"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
