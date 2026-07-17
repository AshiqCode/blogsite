import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { Comment, Post } from "@/lib/types";

async function getDashboardData() {
  const supabase = await createClient();

  const [
    published,
    drafts,
    categories,
    pendingComments,
    recentPosts,
    recentComments,
    viewsAgg,
  ] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("comments").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("posts").select("id, title, slug, status, created_at, published_at, views").order("created_at", { ascending: false }).limit(5),
    supabase.from("comments").select("id, author_name, content, status, created_at, post_id").order("created_at", { ascending: false }).limit(5),
    supabase.from("posts").select("views"),
  ]);

  const totalViews =
    (viewsAgg.data ?? []).reduce((sum, p) => sum + (p.views ?? 0), 0) ?? 0;

  return {
    publishedCount: published.count ?? 0,
    draftCount: drafts.count ?? 0,
    categoryCount: categories.count ?? 0,
    pendingCount: pendingComments.count ?? 0,
    totalViews,
    recentPosts: (recentPosts.data ?? []) as Pick<
      Post,
      "id" | "title" | "slug" | "status" | "created_at" | "published_at" | "views"
    >[],
    recentComments: (recentComments.data ?? []) as Pick<
      Comment,
      "id" | "author_name" | "content" | "status" | "created_at" | "post_id"
    >[],
  };
}

function StatCard({
  label,
  value,
  href,
  accent,
}: {
  label: string;
  value: number | string;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-xl border p-4 transition-shadow hover:shadow-md sm:p-5 ${
        accent ? "border-accent/40 bg-accent/5" : "border-border bg-white"
      }`}
    >
      <p className="text-xs text-zinc-500 sm:text-sm">{label}</p>
      <p className="mt-1 text-2xl font-bold sm:text-3xl">{value}</p>
    </Link>
  );
}

const statusBadge: Record<string, string> = {
  published: "bg-green-100 text-green-700",
  draft: "bg-amber-100 text-amber-700",
  archived: "bg-zinc-100 text-zinc-600",
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  spam: "bg-red-100 text-red-700",
};

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          + New Post
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        <StatCard label="Published" value={data.publishedCount} href="/admin/posts?status=published" />
        <StatCard label="Drafts" value={data.draftCount} href="/admin/posts?status=draft" />
        <StatCard label="Categories" value={data.categoryCount} href="/admin/categories" />
        <StatCard label="Pending comments" value={data.pendingCount} href="/admin/comments?status=pending" accent={data.pendingCount > 0} />
        <StatCard label="Total views" value={data.totalViews.toLocaleString()} href="/admin/posts" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent posts */}
        <section className="rounded-xl border border-border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Recent articles</h2>
            <Link href="/admin/posts" className="text-sm text-accent hover:underline">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {data.recentPosts.length === 0 && (
              <li className="py-3 text-sm text-zinc-500">No posts yet.</li>
            )}
            {data.recentPosts.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                <Link
                  href={`/admin/posts/${p.id}/edit`}
                  className="min-w-0 truncate text-sm font-medium hover:text-accent"
                >
                  {p.title}
                </Link>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusBadge[p.status]}`}
                >
                  {p.status}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Recent comments */}
        <section className="rounded-xl border border-border bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Recent comments</h2>
            <Link href="/admin/comments" className="text-sm text-accent hover:underline">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {data.recentComments.length === 0 && (
              <li className="py-3 text-sm text-zinc-500">No comments yet.</li>
            )}
            {data.recentComments.map((c) => (
              <li key={c.id} className="py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="min-w-0 truncate text-sm font-medium">
                    {c.author_name}
                  </span>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusBadge[c.status]}`}
                  >
                    {c.status}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                  {c.content}
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  {formatDate(c.created_at)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
