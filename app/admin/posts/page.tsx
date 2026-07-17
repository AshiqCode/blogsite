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

      <div className="overflow-x-auto rounded-xl border border-border bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-border bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="hidden px-4 py-3 sm:table-cell">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="hidden px-4 py-3 md:table-cell">Views</th>
              <th className="hidden px-4 py-3 md:table-cell">Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(!posts || posts.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-zinc-500">
                  No posts found.{" "}
                  <Link href="/admin/posts/new" className="text-accent hover:underline">
                    Create your first post
                  </Link>
                  .
                </td>
              </tr>
            )}
            {posts?.map((p) => {
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
                  <td className="hidden px-4 py-3 text-zinc-500 sm:table-cell">
                    {category?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusBadge[p.status]}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-zinc-500 md:table-cell">
                    {p.views}
                  </td>
                  <td className="hidden px-4 py-3 text-zinc-500 md:table-cell">
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
    </div>
  );
}
