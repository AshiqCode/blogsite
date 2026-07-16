import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/lib/queries";
import { PostEditor } from "@/components/admin/PostEditor";
import type { PostWithRelations } from "@/lib/types";

export const metadata: Metadata = { title: "Edit Post" };

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: post }, categories] = await Promise.all([
    supabase
      .from("posts")
      .select("*, category:categories(*), tags:tags(*)")
      .eq("id", id)
      .single(),
    getCategories(),
  ]);

  if (!post) notFound();

  return (
    <PostEditor
      categories={categories}
      post={post as unknown as PostWithRelations}
    />
  );
}
