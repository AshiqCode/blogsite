"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { makeExcerpt, sanitizeHtml, slugify } from "@/lib/utils";
import type { PostStatus } from "@/lib/types";

export interface PostFormState {
  error?: string;
}

/** Ensure tags exist (by name) and return their ids. */
async function resolveTagIds(
  supabase: Awaited<ReturnType<typeof createClient>>,
  names: string[],
): Promise<string[]> {
  const clean = [...new Set(names.map((n) => n.trim()).filter(Boolean))];
  const ids: string[] = [];
  for (const name of clean) {
    const slug = slugify(name);
    if (!slug) continue;
    const { data: existing } = await supabase
      .from("tags")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (existing) {
      ids.push(existing.id);
    } else {
      const { data: created } = await supabase
        .from("tags")
        .insert({ name, slug })
        .select("id")
        .single();
      if (created) ids.push(created.id);
    }
  }
  return ids;
}

export async function savePost(
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  await requireAdmin();
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "") || null;
  const title = String(formData.get("title") ?? "").trim();
  const content = sanitizeHtml(String(formData.get("content") ?? ""));
  const status = String(formData.get("status") ?? "draft") as PostStatus;

  if (!title) return { error: "Title is required." };

  let slug = slugify(String(formData.get("slug") ?? "") || title);
  if (!slug) return { error: "Could not generate a valid slug." };

  // Ensure slug uniqueness (ignoring the current post).
  const { data: clash } = await supabase
    .from("posts")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (clash && clash.id !== id) slug = `${slug}-${Date.now().toString(36)}`;

  const excerptInput = String(formData.get("excerpt") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "") || null;
  const publishDateInput = String(formData.get("published_at") ?? "").trim();

  const record = {
    title,
    slug,
    content,
    excerpt: excerptInput || makeExcerpt(content),
    featured_image: String(formData.get("featured_image") ?? "").trim() || null,
    category_id: categoryId,
    status,
    meta_title: String(formData.get("meta_title") ?? "").trim() || null,
    meta_description:
      String(formData.get("meta_description") ?? "").trim() || null,
    published_at:
      status === "published"
        ? publishDateInput
          ? new Date(publishDateInput).toISOString()
          : new Date().toISOString()
        : publishDateInput
          ? new Date(publishDateInput).toISOString()
          : null,
  };

  let postId = id;
  if (id) {
    const { error } = await supabase.from("posts").update(record).eq("id", id);
    if (error) return { error: "Failed to update post." };
  } else {
    const { data, error } = await supabase
      .from("posts")
      .insert(record)
      .select("id")
      .single();
    if (error || !data) return { error: "Failed to create post." };
    postId = data.id;
  }

  // Sync tags.
  const tagNames = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const tagIds = await resolveTagIds(supabase, tagNames);
  await supabase.from("post_tags").delete().eq("post_id", postId!);
  if (tagIds.length > 0) {
    await supabase
      .from("post_tags")
      .insert(tagIds.map((tag_id) => ({ post_id: postId!, tag_id })));
  }

  revalidatePath("/", "layout");
  redirect("/admin/posts");
}

export async function deletePost(id: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/posts");
}

export async function setPostStatus(
  id: string,
  status: PostStatus,
): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  const patch: { status: PostStatus; published_at?: string } = { status };
  if (status === "published") patch.published_at = new Date().toISOString();
  await supabase.from("posts").update(patch).eq("id", id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/posts");
}
