import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CommentRow } from "@/components/admin/CommentRow";
import type { CommentStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Comments" };

const FILTERS: { value: CommentStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "spam", label: "Spam" },
];

export default async function CommentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("comments")
    .select("*, post:posts(id, title, slug)")
    .order("created_at", { ascending: false });

  if (status && status !== "all") query = query.eq("status", status);

  const { data: comments } = await query;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Comments</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = (status ?? "all") === f.value;
          return (
            <Link
              key={f.value}
              href={
                f.value === "all"
                  ? "/admin/comments"
                  : `/admin/comments?status=${f.value}`
              }
              className={`rounded-full px-3 py-1.5 text-sm font-medium ${
                active
                  ? "bg-accent text-white"
                  : "border border-border bg-white text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      <div className="space-y-3">
        {(!comments || comments.length === 0) && (
          <div className="rounded-xl border border-border bg-white px-4 py-10 text-center text-zinc-500">
            No comments found.
          </div>
        )}
        {comments?.map((c) => {
          const post = c.post as { id: string; title: string; slug: string } | null;
          return (
            <CommentRow
              key={c.id}
              comment={{
                id: c.id,
                post_id: c.post_id,
                author_name: c.author_name,
                author_email: c.author_email,
                content: c.content,
                status: c.status,
                parent_id: c.parent_id,
                created_at: c.created_at,
              }}
              postTitle={post?.title ?? "(deleted post)"}
              postSlug={post?.slug ?? null}
            />
          );
        })}
      </div>
    </div>
  );
}
