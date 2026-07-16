"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import type { CommentStatus } from "@/lib/types";

export async function setCommentStatus(
  id: string,
  status: CommentStatus,
): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("comments").update({ status }).eq("id", id);
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
