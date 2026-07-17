"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { pushToEndpoint } from "@/lib/push";
import { absoluteUrl } from "@/lib/site";
import type { CommentStatus } from "@/lib/types";

export async function setCommentStatus(
  id: string,
  status: CommentStatus,
): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  // Load the comment so we can notify the author of the outcome.
  const { data: comment } = await supabase
    .from("comments")
    .select("subscriber_endpoint, status, post:posts(slug, title)")
    .eq("id", id)
    .single();

  await supabase.from("comments").update({ status }).eq("id", id);

  // Notify the commenter when their comment is approved or rejected.
  const endpoint = comment?.subscriber_endpoint as string | null | undefined;
  const post = comment?.post as unknown as {
    slug: string;
    title: string;
  } | null;
  if (endpoint && comment?.status !== status) {
    if (status === "approved") {
      await pushToEndpoint(endpoint, {
        title: "Your comment was approved 🎉",
        body: post ? `It's now live on “${post.title}”.` : "It's now live.",
        url: post ? absoluteUrl(`/post/${post.slug}`) : "/",
        tag: `comment-${id}`,
      });
    } else if (status === "spam") {
      await pushToEndpoint(endpoint, {
        title: "Your comment wasn't approved",
        body: "Thanks for participating — this comment wasn't published.",
        url: post ? absoluteUrl(`/post/${post.slug}`) : "/",
        tag: `comment-${id}`,
      });
    }
  }

  revalidatePath("/admin/comments");
  revalidatePath("/", "layout");
}

export async function deleteComment(id: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("comments").delete().eq("id", id);
  revalidatePath("/admin/comments");
  revalidatePath("/", "layout");
}

export async function updateCommentContent(
  id: string,
  content: string,
): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  const clean = content.trim();
  if (!clean) return;
  await supabase.from("comments").update({ content: clean }).eq("id", id);
  revalidatePath("/admin/comments");
  revalidatePath("/", "layout");
}

/** Admin reply — added as an approved child comment. */
export async function replyToComment(
  postId: string,
  parentId: string,
  authorName: string,
  content: string,
): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  const clean = content.trim();
  if (!clean) return;
  await supabase.from("comments").insert({
    post_id: postId,
    parent_id: parentId,
    author_name: authorName || "Admin",
    author_email: "admin@site",
    content: clean,
    status: "approved",
  });
  revalidatePath("/admin/comments");
  revalidatePath("/", "layout");
}
