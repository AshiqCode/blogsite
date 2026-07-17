import { PostCard } from "@/components/PostCard";
import type { PostWithRelations } from "@/lib/types";

export function RelatedPosts({ posts }: { posts: PostWithRelations[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border pt-10">
      <h2 className="mb-6 font-display text-2xl font-semibold tracking-tight">
        You might also like
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
