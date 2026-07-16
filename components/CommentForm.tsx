"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitComment, type CommentFormState } from "@/app/(site)/post/[slug]/actions";

const initial: CommentFormState = { ok: false };

export function CommentForm({ postId }: { postId: string }) {
  const [state, formAction, pending] = useActionState(submitComment, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="post_id" value={postId} />
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {state.ok && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Thanks! Your comment was submitted and is awaiting approval.
        </p>
      )}
      {state.error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="author_name"
          required
          placeholder="Your name"
          className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
        />
        <input
          name="author_email"
          type="email"
          required
          placeholder="Your email (not published)"
          className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
        />
      </div>
      <textarea
        name="content"
        required
        rows={4}
        placeholder="Write your comment…"
        className="w-full resize-y rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-accent"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Post comment"}
      </button>
    </form>
  );
}
