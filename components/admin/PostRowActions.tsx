"use client";

import Link from "next/link";
import { useTransition } from "react";
import { deletePost, setPostStatus } from "@/app/admin/posts/actions";
import { useConfirm } from "@/components/admin/ConfirmProvider";
import type { PostStatus } from "@/lib/types";

export function PostRowActions({
  id,
  slug,
  status,
}: {
  id: string;
  slug: string;
  status: PostStatus;
}) {
  const [pending, startTransition] = useTransition();
  const confirm = useConfirm();

  return (
    <div className="flex items-center justify-end gap-2 text-sm">
      {status === "published" && (
        <Link
          href={`/post/${slug}`}
          target="_blank"
          className="text-zinc-500 hover:text-accent"
        >
          View
        </Link>
      )}
      <Link
        href={`/admin/posts/${id}/preview`}
        target="_blank"
        className="text-zinc-500 hover:text-accent"
      >
        Preview
      </Link>
      <Link href={`/admin/posts/${id}/edit`} className="text-accent hover:underline">
        Edit
      </Link>
      {status !== "published" ? (
        <button
          disabled={pending}
          onClick={() => startTransition(() => setPostStatus(id, "published"))}
          className="text-green-600 hover:underline disabled:opacity-50"
        >
          Publish
        </button>
      ) : (
        <button
          disabled={pending}
          onClick={() => startTransition(() => setPostStatus(id, "draft"))}
          className="text-amber-600 hover:underline disabled:opacity-50"
        >
          Unpublish
        </button>
      )}
      <button
        disabled={pending}
        onClick={async () => {
          if (
            await confirm({
              title: "Delete post",
              message: "Permanently delete this post? This cannot be undone.",
              confirmText: "Delete",
              danger: true,
            })
          )
            startTransition(() => deletePost(id));
        }}
        className="text-red-600 hover:underline disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
