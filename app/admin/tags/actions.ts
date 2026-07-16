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
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required." };
  const slug = slugify(String(formData.get("slug") ?? "") || name);
  if (!slug) return { error: "Could not generate a valid slug." };

  const { error } = id
    ? await supabase.from("tags").update({ name, slug }).eq("id", id)
    : await supabase.from("tags").insert({ name, slug });

  if (error) {
    if (error.code === "23505")
      return { error: "A tag with that slug already exists." };
    return { error: "Failed to save tag." };
  }

  revalidatePath("/admin/tags");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteTag(id: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("tags").delete().eq("id", id);
  revalidatePath("/admin/tags");
  revalidatePath("/", "layout");
}
