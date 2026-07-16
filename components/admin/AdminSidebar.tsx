"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/app/login/actions";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/tags", label: "Tags" },
  { href: "/admin/media", label: "Media Library" },
  { href: "/admin/comments", label: "Comments" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Mobile top bar (fixed 64px tall; layout offsets content with pt-16) */}
      <div className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-white px-4 lg:hidden">
        <span className="font-bold">Blog Admin</span>
        <button
          onClick={() => setOpen((o) => !o)}
          className="rounded-md border border-border px-3 py-1.5 text-sm"
          aria-label="Toggle menu"
        >
          Menu
        </button>
      </div>

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-white transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-4">
          <Link
            href="/admin"
            className="mb-6 mt-2 px-2 text-lg font-bold tracking-tight"
            onClick={() => setOpen(false)}
          >
            Blog Admin
          </Link>

          <nav className="flex-1 space-y-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href, item.exact)
                    ? "bg-accent text-white"
                    : "text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 border-t border-border pt-4">
            <Link
              href="/"
              target="_blank"
              className="block rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100"
            >
              View site ↗
            </Link>
            <p className="truncate px-3 pt-3 text-xs text-zinc-400">{userEmail}</p>
            <form action={logout}>
              <button
                type="submit"
                className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
