"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import {
  setCommentStatus,
  deleteComment,
  updateCommentContent,
  replyToComment,
} from "@/app/admin/comments/actions";
import { formatDate } from "@/lib/utils";
import type { Comment } from "@/lib/types";

const statusBadge: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  spam: "bg-red-100 text-red-700",
};

export function CommentRow({
  comment,
  postTitle,
  postSlug,
}: {
  comment: Comment;
  postTitle: string;
  postSlug: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [mode, setMode] = useState<"view" | "edit" | "reply">("view");
  const [editValue, setEditValue] = useState(comment.content);
  const [replyValue, setReplyValue] = useState("");

  return (
    <div className="rounded-xl border border-border bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold">{comment.author_name}</span>
        <span className="text-xs text-zinc-400">{comment.author_email}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusBadge[comment.status]}`}
        >
          {comment.status}
        </span>
        <span className="ml-auto text-xs text-zinc-400">
          {formatDate(comment.created_at)}
        </span>
      </div>

      <p className="mt-1 text-xs text-zinc-500">
        on{" "}
        {postSlug ? (
          <Link href={`/post/${postSlug}`} target="_blank" className="text-accent hover:underline">
            {postTitle}
          </Link>
        ) : (
          postTitle
        )}
      </p>

      {mode === "edit" ? (
        <div className="mt-3 space-y-2">
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            rows={3}
            className="w-full resize-y rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <div className="flex gap-2">
            <button
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await updateCommentContent(comment.id, editValue);
                  setMode("view");
                })
              }
              className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-60"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditValue(comment.content);
                setMode("view");
              }}
              className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-zinc-100"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/90">
          {comment.content}
        </p>
      )}

      {mode === "reply" && (
        <div className="mt-3 space-y-2 rounded-lg bg-zinc-50 p-3">
          <textarea
            value={replyValue}
            onChange={(e) => setReplyValue(e.target.value)}
            rows={2}
            placeholder="Write a reply (posted as Admin, auto-approved)…"
            className="w-full resize-y rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <div className="flex gap-2">
            <button
              disabled={pending || !replyValue.trim()}
              onClick={() =>
                startTransition(async () => {
                  await replyToComment(
                    comment.post_id,
                    comment.parent_id ?? comment.id,
                    "Admin",
                    replyValue,
                  );
                  setReplyValue("");
                  setMode("view");
                })
              }
              className="rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-60"
            >
              Post reply
            </button>
            <button
              onClick={() => setMode("view")}
              className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-zinc-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {mode === "view" && (
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          {comment.status !== "approved" && (
            <button
              disabled={pending}
              onClick={() =>
                startTransition(() => setCommentStatus(comment.id, "approved"))
              }
              className="font-medium text-green-600 hover:underline disabled:opacity-50"
            >
              Approve
            </button>
          )}
          {comment.status === "approved" && (
            <button
              disabled={pending}
              onClick={() =>
                startTransition(() => setCommentStatus(comment.id, "pending"))
              }
              className="font-medium text-amber-600 hover:underline disabled:opacity-50"
            >
              Unapprove
            </button>
          )}
          <button
            onClick={() => setMode("reply")}
            className="font-medium text-accent hover:underline"
          >
            Reply
          </button>
          <button
            onClick={() => setMode("edit")}
            className="font-medium text-zinc-600 hover:underline"
          >
            Edit
          </button>
          {comment.status !== "spam" && (
            <button
              disabled={pending}
              onClick={() =>
                startTransition(() => setCommentStatus(comment.id, "spam"))
              }
              className="font-medium text-orange-600 hover:underline disabled:opacity-50"
            >
              Spam
            </button>
          )}
          <button
            disabled={pending}
            onClick={() => {
              if (confirm("Permanently delete this comment?"))
                startTransition(() => deleteComment(comment.id));
            }}
            className="font-medium text-red-600 hover:underline disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
