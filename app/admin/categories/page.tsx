import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CategoryManager } from "@/components/admin/CategoryManager";
import type { Category } from "@/lib/types";

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  // Post counts per category.
  const { data: posts } = await supabase.from("posts").select("category_id");
  const counts = new Map<string, number>();
  for (const p of posts ?? []) {
    if (p.category_id)
      counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Categories</h1>
      <CategoryManager
        categories={(categories as Category[]) ?? []}
        counts={Object.fromEntries(counts)}
      />
    </div>
  );
}
