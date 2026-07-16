import type { Comment } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { CommentForm } from "@/components/CommentForm";

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");
}

export function CommentSection({
  postId,
  comments,
}: {
  postId: string;
  comments: Comment[];
}) {
  // Build a simple two-level thread (top-level + replies).
  const topLevel = comments.filter((c) => !c.parent_id);
  const repliesOf = (id: string) =>
    comments.filter((c) => c.parent_id === id);

  return (
    <section className="mt-16 border-t border-border pt-10">
      <h2 className="font-display text-2xl font-semibold tracking-tight">
        Comments{" "}
        <span className="text-lg font-normal text-muted">
          ({comments.length})
        </span>
      </h2>

      <div className="mt-6 space-y-6">
        {topLevel.length === 0 && (
          <p className="text-muted">Be the first to comment.</p>
        )}
        {topLevel.map((c) => (
          <div key={c.id}>
            <CommentItem comment={c} />
            {repliesOf(c.id).length > 0 && (
              <div className="ml-6 mt-4 space-y-4 border-l border-border pl-5">
                {repliesOf(c.id).map((r) => (
                  <CommentItem key={r.id} comment={r} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12">
        <h3 className="mb-4 font-display text-xl font-semibold tracking-tight">
          Leave a comment
        </h3>
        <CommentForm postId={postId} />
        <p className="mt-2 text-xs text-muted">
          Comments are reviewed before they appear.
        </p>
      </div>
    </section>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
        {initials(comment.author_name)}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{comment.author_name}</span>
          <span className="text-xs text-muted">
            {formatDate(comment.created_at)}
          </span>
        </div>
        <p className="mt-1 whitespace-pre-wrap text-[0.95rem] text-foreground/90">
          {comment.content}
        </p>
      </div>
    </div>
  );
}
