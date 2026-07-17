"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Cat = { id: string; slug: string; name: string };

const linkClass =
  "rounded-full px-3 py-1.5 transition-colors hover:bg-surface-2 hover:text-foreground";

export function SiteNav({ categories }: { categories: Cat[] }) {
  const [catsOpen, setCatsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const catsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (catsRef.current && !catsRef.current.contains(e.target as Node))
        setCatsOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setCatsOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden items-center gap-1 text-sm font-semibold text-muted sm:flex">
        <Link href="/" className={linkClass}>
          Home
        </Link>

        {categories.length > 0 && (
          <div ref={catsRef} className="relative">
            <button
              type="button"
              onClick={() => setCatsOpen((o) => !o)}
              aria-expanded={catsOpen}
              className={`flex items-center gap-1 ${linkClass}`}
            >
              Categories
              <svg
                className={`h-3.5 w-3.5 transition-transform ${catsOpen ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            <div
              className={`absolute left-0 top-full z-50 mt-1.5 max-h-[70vh] w-60 overflow-auto rounded-xl border border-border bg-surface p-1.5 shadow-lift ${
                catsOpen ? "" : "hidden"
              }`}
            >
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  onClick={() => setCatsOpen(false)}
                  className="block truncate rounded-lg px-3 py-2 transition-colors hover:bg-surface-2 hover:text-foreground"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <Link href="/about" className={linkClass}>
          About
        </Link>
      </nav>

      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Toggle menu"
        aria-expanded={mobileOpen}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-foreground sm:hidden"
      >
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          {mobileOpen ? (
            <path d="M18 6 6 18M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile dropdown panel */}
      {mobileOpen && (
        <div className="absolute inset-x-0 top-full z-40 border-b border-border bg-surface shadow-lift sm:hidden">
          <nav className="mx-auto flex max-w-5xl flex-col gap-0.5 px-4 py-3 text-sm font-semibold text-muted">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-surface-2 hover:text-foreground"
            >
              Home
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 hover:bg-surface-2 hover:text-foreground"
              >
                {c.name}
              </Link>
            ))}
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-surface-2 hover:text-foreground"
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2 hover:bg-surface-2 hover:text-foreground"
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
