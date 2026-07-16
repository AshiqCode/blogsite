"use client";

import Image from "next/image";
import { useActionState, useEffect, useState, useTransition } from "react";
import {
  saveAuthor,
  deleteAuthor,
  type AuthorFormState,
} from "@/app/admin/authors/actions";
import type { Author } from "@/lib/types";

const initial: AuthorFormState = {};

export function AuthorManager({
  authors,
  counts,
}: {
  authors: Author[];
  counts: Record<string, number>;
}) {
  const [editing, setEditing] = useState<Author | null>(null);
  const [state, formAction, pending] = useActionState(saveAuthor, initial);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (state.ok) setEditing(null);
  }, [state.ok]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Form */}
      <div className="lg:col-span-1">
        <form
          key={editing?.id ?? "new"}
          action={formAction}
          className="space-y-4 rounded-xl border border-border bg-white p-5"
        >
          <h2 className="font-semibold">
            {editing ? "Edit Author" : "Add Author"}
          </h2>
          {editing && <input type="hidden" name="id" value={editing.id} />}

          {state.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error}
            </p>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input
              name="name"
              required
              defaultValue={editing?.name ?? ""}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Role <span className="text-zinc-400">(optional)</span>
            </label>
            <input
              name="role"
              defaultValue={editing?.role ?? ""}
              placeholder="e.g. Editor, Writer"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Avatar URL <span className="text-zinc-400">(optional)</span>
            </label>
            <input
              name="avatar_url"
              type="url"
              defaultValue={editing?.avatar_url ?? ""}
              placeholder="https://…"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Bio</label>
            <textarea
              name="bio"
              rows={4}
              defaultValue={editing?.bio ?? ""}
              placeholder="Short bio shown under the author's articles."
              className="w-full resize-y rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
            >
              {pending ? "Saving…" : editing ? "Update" : "Add"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-zinc-100"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="lg:col-span-2">
        <div className="space-y-3">
          {authors.length === 0 && (
            <div className="rounded-xl border border-border bg-white px-4 py-8 text-center text-zinc-500">
              No authors yet. Add your first author on the left.
            </div>
          )}
          {authors.map((a) => (
            <div
              key={a.id}
              className="flex items-start gap-4 rounded-xl border border-border bg-white p-4"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-accent/10">
                {a.avatar_url ? (
                  <Image
                    src={a.avatar_url}
                    alt={a.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-sm font-semibold text-accent">
                    {a.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{a.name}</span>
                  {a.role && (
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                      {a.role}
                    </span>
                  )}
                  <span className="ml-auto text-xs text-zinc-400">
                    {counts[a.id] ?? 0} post{(counts[a.id] ?? 0) === 1 ? "" : "s"}
                  </span>
                </div>
                {a.bio && (
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-500">{a.bio}</p>
                )}
                <div className="mt-2 flex gap-3 text-sm">
                  <button
                    onClick={() => setEditing(a)}
                    className="font-medium text-accent hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          `Delete author “${a.name}”? Their posts will remain but become unassigned.`,
                        )
                      )
                        startTransition(() => deleteAuthor(a.id));
                    }}
                    className="font-medium text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
