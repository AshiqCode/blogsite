import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { AuthorManager } from "@/components/admin/AuthorManager";
import type { Author } from "@/lib/types";

export const metadata: Metadata = { title: "Authors" };

export default async function AuthorsPage() {
  const supabase = await createClient();

  const { data: authors } = await supabase
    .from("authors")
    .select("*")
    .order("name");

  // Post counts per author.
  const { data: posts } = await supabase.from("posts").select("author_id");
  const counts = new Map<string, number>();
  for (const p of posts ?? []) {
    if (p.author_id) counts.set(p.author_id, (counts.get(p.author_id) ?? 0) + 1);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Authors</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Manage the people who write your posts. Assign an author when creating
          or editing a post.
        </p>
      </div>
      <AuthorManager
        authors={(authors as Author[]) ?? []}
        counts={Object.fromEntries(counts)}
      />
    </div>
  );
}
