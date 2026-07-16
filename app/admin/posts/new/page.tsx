import type { Metadata } from "next";
import { getCategories, getAuthors } from "@/lib/queries";
import { PostEditor } from "@/components/admin/PostEditor";

export const metadata: Metadata = { title: "New Post" };

export default async function NewPostPage() {
  const [categories, authors] = await Promise.all([
    getCategories(),
    getAuthors(),
  ]);
  return <PostEditor categories={categories} authors={authors} />;
}
