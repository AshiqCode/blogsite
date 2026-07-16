import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { TagManager } from "@/components/admin/TagManager";
import type { Tag } from "@/lib/types";

export const metadata: Metadata = { title: "Tags" };

export default async function TagsPage() {
  const supabase = await createClient();

  const { data: tags } = await supabase.from("tags").select("*").order("name");
  const { data: links } = await supabase.from("post_tags").select("tag_id");

  const counts = new Map<string, number>();
  for (const l of links ?? [])
    counts.set(l.tag_id, (counts.get(l.tag_id) ?? 0) + 1);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Tags</h1>
      <TagManager
        tags={(tags as Tag[]) ?? []}
        counts={Object.fromEntries(counts)}
      />
    </div>
  );
}
