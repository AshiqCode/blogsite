"use server";

import { createClient } from "@/lib/supabase/server";

export interface CommentFormState {
  ok: boolean;
  error?: string;
}

/** Public comment submission. New comments are stored as 'pending'. */
export async function submitComment(
  _prev: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  const postId = String(formData.get("post_id") ?? "");
  const parentId = String(formData.get("parent_id") ?? "") || null;
  const name = String(formData.get("author_name") ?? "").trim();
  const email = String(formData.get("author_email") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  // Honeypot field — bots fill this, humans don't see it.
  const honey = String(formData.get("website") ?? "");

  if (honey) return { ok: true }; // silently drop spam
  if (!postId) return { ok: false, error: "Missing post reference." };
  if (name.length < 2) return { ok: false, error: "Please enter your name." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return { ok: false, error: "Please enter a valid email address." };
  if (content.length < 3)
    return { ok: false, error: "Comment is too short." };
  if (content.length > 5000)
    return { ok: false, error: "Comment is too long." };

  const supabase = await createClient();
  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    parent_id: parentId,
    author_name: name,
    author_email: email,
    content,
    status: "pending",
  });

  if (error) return { ok: false, error: "Could not submit comment." };
  return { ok: true };
}
