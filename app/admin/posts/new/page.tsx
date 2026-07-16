import type { Metadata } from "next";
import { getCategories } from "@/lib/queries";
import { PostEditor } from "@/components/admin/PostEditor";

export const metadata: Metadata = { title: "New Post" };

export default async function NewPostPage() {
  const categories = await getCategories();
  return <PostEditor categories={categories} />;
}
