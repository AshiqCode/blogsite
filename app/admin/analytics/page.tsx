import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/queries";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/lib/types";

export const metadata: Metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const settings = await getSettings();

  const [published, comments, viewsRows, topPosts] = await Promise.all([
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase.from("comments").select("id", { count: "exact", head: true }),
    supabase.from("posts").select("views"),
    supabase
      .from("posts")
      .select("id, title, slug, status, views, published_at")
      .order("views", { ascending: false })
      .limit(10),
  ]);

  const totalViews =
    (viewsRows.data ?? []).reduce((sum, p) => sum + (p.views ?? 0), 0) ?? 0;
  const publishedCount = published.count ?? 0;
  const commentCount = comments.count ?? 0;
  const avgViews =
    publishedCount > 0 ? Math.round(totalViews / publishedCount) : 0;

  const gaId = settings.google_analytics_id?.trim();
  const top = (topPosts.data ?? []) as Pick<
    Post,
    "id" | "title" | "slug" | "status" | "views" | "published_at"
  >[];

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Analytics</h1>
      <p className="mb-6 text-sm text-zinc-500">
        On-site engagement from your own view tracking, plus your Google
        Analytics connection.
      </p>

      {/* Google Analytics connection */}
      <div className="mb-6 rounded-xl border border-border bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
                gaId ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
              }`}
            >
              {gaId ? "✓" : "!"}
            </span>
            <div className="min-w-0">
              <p className="font-semibold">Google Analytics</p>
              {gaId ? (
                <p className="text-sm text-zinc-500">
                  Connected · <span className="break-all font-mono">{gaId}</span>
                </p>
              ) : (
                <p className="text-sm text-zinc-500">
                  Not connected — add your Measurement ID in Settings.
                </p>
              )}
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            {gaId && (
              <a
                href="https://analytics.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-accent px-4 py-2 text-center text-sm font-semibold text-white hover:bg-accent-hover"
              >
                Open Google Analytics ↗
              </a>
            )}
            <Link
              href="/admin/settings"
              className="rounded-lg border border-border px-4 py-2 text-center text-sm font-medium hover:bg-zinc-100"
            >
              Settings
            </Link>
          </div>
        </div>
        <p className="mt-4 border-t border-border pt-4 text-xs text-zinc-500">
          Detailed visitor analytics (real-time users, traffic sources,
          demographics, etc.) live in your Google Analytics dashboard. The stats
          below come from this site&apos;s own per-article view counter.
        </p>
      </div>

      {/* On-site stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total views" value={totalViews.toLocaleString()} />
        <StatCard label="Published posts" value={publishedCount} />
        <StatCard label="Avg views / post" value={avgViews.toLocaleString()} />
        <StatCard label="Comments" value={commentCount} />
      </div>

      {/* Top content */}
      <section className="rounded-xl border border-border bg-white p-5">
        <h2 className="mb-4 font-semibold">Top posts by views</h2>
        {top.length === 0 ? (
          <p className="py-6 text-center text-sm text-zinc-500">
            No posts yet. Once you publish and readers arrive, your most-viewed
            posts will appear here.
          </p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-2 py-2">#</th>
                <th className="px-2 py-2">Title</th>
                <th className="hidden px-2 py-2 sm:table-cell">Published</th>
                <th className="px-2 py-2 text-right">Views</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {top.map((p, i) => (
                <tr key={p.id} className="hover:bg-zinc-50">
                  <td className="px-2 py-2.5 text-zinc-400">{i + 1}</td>
                  <td className="px-2 py-2.5">
                    <Link
                      href={`/admin/posts/${p.id}/edit`}
                      className="font-medium hover:text-accent"
                    >
                      {p.title}
                    </Link>
                  </td>
                  <td className="hidden px-2 py-2.5 text-zinc-500 sm:table-cell">
                    {p.published_at ? formatDate(p.published_at) : "—"}
                  </td>
                  <td className="px-2 py-2.5 text-right font-semibold">
                    {p.views.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-border bg-white p-4 sm:p-5">
      <p className="text-xs text-zinc-500 sm:text-sm">{label}</p>
      <p className="mt-1 text-xl font-bold sm:text-2xl">{value}</p>
    </div>
  );
}
