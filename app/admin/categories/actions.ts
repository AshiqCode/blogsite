"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export interface CategoryFormState {
  ok?: boolean;
  error?: string;
}

export async function saveCategory(
  _prev: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  await requireAdmin();
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "") || null;
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required." };

  const slug = slugify(String(formData.get("slug") ?? "") || name);
  if (!slug) return { error: "Could not generate a valid slug." };

  const record = {
    name,
    slug,
    description: String(formData.get("description") ?? "").trim() || null,
    featured_image: String(formData.get("featured_image") ?? "").trim() || null,
  };

  const { error } = id
    ? await supabase.from("categories").update(record).eq("id", id)
    : await supabase.from("categories").insert(record);

  if (error) {
    if (error.code === "23505")
      return { error: "A category with that slug already exists." };
    return { error: "Failed to save category." };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteCategory(id: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
}
