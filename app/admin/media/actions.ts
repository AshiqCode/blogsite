"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

export async function deleteMedia(
  id: string,
  storagePath: string,
): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  // Remove the file from storage, then the DB record.
  await supabase.storage.from("media").remove([storagePath]);
  await supabase.from("media").delete().eq("id", id);
  revalidatePath("/admin/media");
}

export async function updateMedia(
  id: string,
  altText: string,
  caption: string,
): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();
  await supabase
    .from("media")
    .update({
      alt_text: altText.trim() || null,
      caption: caption.trim() || null,
    })
    .eq("id", id);
  revalidatePath("/admin/media");
}
