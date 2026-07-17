"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/queries";

export interface CommentFormState {
  ok: boolean;
  error?: string;
  autoApproved?: boolean;
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
  const subscriberEndpoint =
    String(formData.get("subscriber_endpoint") ?? "") || null;
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

  const settings = await getSettings();
  const autoApprove = settings.comment_moderation === "auto";

  // Insert with the service-role client so the server controls the status
  // (public RLS only allows 'pending'; auto-approve is decided here securely).
  const supabase = createAdminClient();
  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    parent_id: parentId,
    author_name: name,
    author_email: email,
    content,
    status: autoApprove ? "approved" : "pending",
    subscriber_endpoint: subscriberEndpoint,
  });

  if (error) return { ok: false, error: "Could not submit comment." };
  return { ok: true, autoApproved: autoApprove };
}
