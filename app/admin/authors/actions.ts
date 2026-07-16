"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export interface AuthorFormState {
  ok?: boolean;
  error?: string;
}

export async function saveAuthor(
  _prev: AuthorFormState,
  formData: FormData,
): Promise<AuthorFormState> {
  await requireAdmin();
  const supabase = await createClient();

  const id = String(formData.get("id") ?? "") || null;
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Name is required." };

  const record = {
    name,
    role: String(formData.get("role") ?? "").trim() || null,
    bio: String(formData.get("bio") ?? "").trim() || null,
    avatar_url: String(formData.get("avatar_url") ?? "").trim() || null,
  };

  const { error } = id
    ? await supabase.from("authors").update(record).eq("id", id)
    : await supabase.from("authors").insert(record);

  if (error) {
    if (/relation .*authors.* does not exist/i.test(error.message ?? ""))
      return {
        error:
          "The authors table doesn't exist yet — run supabase/migrations/002_authors.sql first.",
      };
    return { error: "Failed to save author." };
  }

  revalidatePath("/admin/authors");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteAuthor(id: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("authors").delete().eq("id", id);
  revalidatePath("/admin/authors");
  revalidatePath("/", "layout");
}
