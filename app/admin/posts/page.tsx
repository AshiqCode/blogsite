import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import type { PostStatus } from "@/lib/types";
import { PostRowActions } from "@/components/admin/PostRowActions";

const STATUS_FILTERS: { value: PostStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
  { value: "archived", label: "Archived" },
];

const statusBadge: Record<string, string> = {
  published: "bg-green-100 text-green-700",
  draft: "bg-amber-100 text-amber-700",
  archived: "bg-zinc-100 text-zinc-600",
};

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("posts")
    .select("id, title, slug, status, views, created_at, published_at, category:categories(name)")
    .order("created_at", { ascending: false });

  if (status && status !== "all") query = query.eq("status", status);

  const { data: posts } = await query;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          + New Post
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => {
          const active = (status ?? "all") === f.value;
          return (
            <Link
              key={f.value}
              href={f.value === "all" ? "/admin/posts" : `/admin/posts?status=${f.value}`}
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                active ? "bg-accent text-white" : "border border-border bg-white text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {!posts || posts.length === 0 ? (
        <div className="rounded-xl border border-border bg-white px-4 py-12 text-center text-zinc-500">
          No posts found.{" "}
          <Link href="/admin/posts/new" className="text-accent hover:underline">
            Create your first post
          </Link>
          .
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-border bg-white md:block">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Views</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {posts.map((p) => {
                  const category = p.category as unknown as { name: string } | null;
                  return (
                    <tr key={p.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/posts/${p.id}/edit`}
                          className="font-medium hover:text-accent"
                        >
                          {p.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-zinc-500">
                        {category?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusBadge[p.status]}`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-500">{p.views}</td>
                      <td className="px-4 py-3 text-zinc-500">
                        {formatDate(p.published_at ?? p.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <PostRowActions
                          id={p.id}
                          slug={p.slug}
                          status={p.status as PostStatus}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {posts.map((p) => {
              const category = p.category as unknown as { name: string } | null;
              return (
                <div
                  key={p.id}
                  className="rounded-xl border border-border bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/admin/posts/${p.id}/edit`}
                      className="font-semibold leading-snug hover:text-accent"
                    >
                      {p.title}
                    </Link>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusBadge[p.status]}`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                    <span>{category?.name ?? "Uncategorized"}</span>
                    <span aria-hidden>·</span>
                    <span>{p.views} views</span>
                    <span aria-hidden>·</span>
                    <span>{formatDate(p.published_at ?? p.created_at)}</span>
                  </div>
                  <div className="mt-3 border-t border-border pt-3">
                    <PostRowActions
                      id={p.id}
                      slug={p.slug}
                      status={p.status as PostStatus}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
