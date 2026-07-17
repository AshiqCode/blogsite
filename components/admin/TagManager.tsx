"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { saveTag, deleteTag, type TagFormState } from "@/app/admin/tags/actions";
import { useConfirm } from "@/components/admin/ConfirmProvider";
import type { Tag } from "@/lib/types";

const initial: TagFormState = {};

export function TagManager({
  tags,
  counts,
}: {
  tags: Tag[];
  counts: Record<string, number>;
}) {
  const [editing, setEditing] = useState<Tag | null>(null);
  const [state, formAction, pending] = useActionState(saveTag, initial);
  const [, startTransition] = useTransition();
  const confirm = useConfirm();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      setEditing(null);
      formRef.current?.reset();
    }
  }, [state.ok]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <form
          key={editing?.id ?? "new"}
          ref={formRef}
          action={formAction}
          className="space-y-4 rounded-xl border border-border bg-white p-5"
        >
          <h2 className="font-semibold">{editing ? "Edit Tag" : "Add Tag"}</h2>
          {editing && <input type="hidden" name="id" value={editing.id} />}
          {state.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error}
            </p>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium">
              {editing ? "Name" : "Name(s)"}
            </label>
            <input
              name="name"
              required
              defaultValue={editing?.name ?? ""}
              placeholder={editing ? "" : "tag1, tag2, tag3"}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-accent"
            />
            {!editing && (
              <p className="mt-1 text-xs text-zinc-500">
                Add several at once — separate them with commas.
              </p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Slug <span className="text-zinc-400">(optional)</span>
            </label>
            <input
              name="slug"
              defaultValue={editing?.slug ?? ""}
              placeholder="auto-generated"
              className="w-full rounded-lg border border-border px-3 py-2 font-mono text-sm outline-none focus:border-accent"
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

      <div className="lg:col-span-2">
        {tags.length === 0 ? (
          <div className="rounded-xl border border-border bg-white px-4 py-8 text-center text-zinc-500">
            No tags yet.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <div
                key={t.id}
                className="group flex items-center gap-2 rounded-full border border-border bg-white py-1.5 pl-4 pr-2 text-sm"
              >
                <button
                  onClick={() => setEditing(t)}
                  className="font-medium hover:text-accent"
                >
                  #{t.name}
                </button>
                <span className="text-xs text-zinc-400">{counts[t.id] ?? 0}</span>
                <button
                  onClick={async () => {
                    if (
                      await confirm({
                        title: "Delete tag",
                        message: `Delete the tag “${t.name}”?`,
                        confirmText: "Delete",
                        danger: true,
                      })
                    )
                      startTransition(() => deleteTag(t.id));
                  }}
                  className="rounded-full px-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-600"
                  aria-label={`Delete ${t.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
