"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export interface TagFormState {
  ok?: boolean;
  error?: string;
}

export async function saveTag(
  _prev: TagFormState,
  formData: FormData,
): Promise<TagFormState> {
  await requireAdmin();
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "") || null;
  const rawName = String(formData.get("name") ?? "").trim();
  if (!rawName) return { error: "Name is required." };

  // Editing a single tag.
  if (id) {
    const slug = slugify(String(formData.get("slug") ?? "") || rawName);
    if (!slug) return { error: "Could not generate a valid slug." };
    const { error } = await supabase
      .from("tags")
      .update({ name: rawName, slug })
      .eq("id", id);
    if (error) {
      if (error.code === "23505")
        return { error: "A tag with that slug already exists." };
      return { error: "Failed to save tag." };
    }
    revalidatePath("/admin/tags");
    revalidatePath("/", "layout");
    return { ok: true };
  }

  // Creating — accept a comma-separated list (e.g. "tag1, tag2, tag3") and
  // add each as a separate tag, skipping duplicates.
  const names = [
    ...new Set(
      rawName
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean),
    ),
  ];
  if (names.length === 0) return { error: "Name is required." };

  let added = 0;
  for (const name of names) {
    const slug = slugify(name);
    if (!slug) continue;
    // Skip if a tag with this slug already exists.
    const { data: existing } = await supabase
      .from("tags")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (existing) continue;
    const { error } = await supabase.from("tags").insert({ name, slug });
    if (!error) added++;
  }

  revalidatePath("/admin/tags");
  revalidatePath("/", "layout");
  if (added === 0)
    return { error: "Those tags already exist (nothing new added)." };
  return { ok: true };
}

export async function deleteTag(id: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("tags").delete().eq("id", id);
  revalidatePath("/admin/tags");
  revalidatePath("/", "layout");
}
