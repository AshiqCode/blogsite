import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import type { MediaItem } from "@/lib/types";

/**
 * Upload a file to the public `media` storage bucket and record it in the
 * `media` table. Runs in the browser using the authenticated session.
 */
export async function uploadMedia(file: File): Promise<MediaItem> {
  const supabase = createClient();

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "file";
  // Deterministic-ish unique path without Date.now on the server.
  const unique = `${base}-${Math.round(performance.now())}-${Math.floor(
    Math.random() * 1e6,
  )}`;
  const path = `${new Date().getFullYear()}/${unique}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (uploadError) throw new Error(uploadError.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("media").getPublicUrl(path);

  const { data, error } = await supabase
    .from("media")
    .insert({
      file_name: file.name,
      storage_path: path,
      url: publicUrl,
      file_size: file.size,
      mime_type: file.type,
    })
    .select("*")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Failed to record media");
  return data as MediaItem;
}
