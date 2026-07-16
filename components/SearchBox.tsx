"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchBox() {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("q") ?? "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
      }}
      className="group relative flex items-center"
    >
      <svg
        className="pointer-events-none absolute left-3 h-4 w-4 text-muted"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search…"
        aria-label="Search articles"
        className="w-32 rounded-full border border-border bg-surface py-2 pl-9 pr-4 text-sm text-foreground shadow-sm outline-none transition-[width,box-shadow] placeholder:text-muted focus:w-52 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)]"
      />
    </form>
  );
}
