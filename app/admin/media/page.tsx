import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import type { MediaItem } from "@/lib/types";

export const metadata: Metadata = { title: "Media Library" };

export default async function MediaPage() {
  const supabase = await createClient();
  const { data: media } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Media Library</h1>
      <MediaLibrary initialItems={(media as MediaItem[]) ?? []} />
    </div>
  );
}
