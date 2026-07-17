"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import {
  saveCategory,
  deleteCategory,
  type CategoryFormState,
} from "@/app/admin/categories/actions";
import { useConfirm } from "@/components/admin/ConfirmProvider";
import type { Category } from "@/lib/types";

const initial: CategoryFormState = {};

export function CategoryManager({
  categories,
  counts,
}: {
  categories: Category[];
  counts: Record<string, number>;
}) {
  const [editing, setEditing] = useState<Category | null>(null);
  const [state, formAction, pending] = useActionState(saveCategory, initial);
  const [, startTransition] = useTransition();
  const confirm = useConfirm();

  // key forces the form to reset when switching between add/edit.
  const formKey = editing?.id ?? "new";

  useEffect(() => {
    if (state.ok) setEditing(null);
  }, [state.ok]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Form */}
      <div className="lg:col-span-1">
        <form
          key={formKey}
          action={formAction}
          className="space-y-4 rounded-xl border border-border bg-white p-5"
        >
          <h2 className="font-semibold">
            {editing ? "Edit Category" : "Add Category"}
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
              Slug <span className="text-zinc-400">(optional)</span>
            </label>
            <input
              name="slug"
              defaultValue={editing?.slug ?? ""}
              placeholder="auto-generated"
              className="w-full rounded-lg border border-border px-3 py-2 font-mono text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={editing?.description ?? ""}
              className="w-full resize-y rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Featured Image URL <span className="text-zinc-400">(optional)</span>
            </label>
            <input
              name="featured_image"
              type="url"
              defaultValue={editing?.featured_image ?? ""}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-accent"
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
        <div className="overflow-x-auto rounded-xl border border-border bg-white">
          <table className="w-full min-w-[480px] text-sm">
            <thead className="border-b border-border bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Posts</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                    No categories yet.
                  </td>
                </tr>
              )}
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                    {c.slug}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">{counts[c.id] ?? 0}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setEditing(c)}
                        className="text-accent hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (
                            await confirm({
                              title: "Delete category",
                              message: `Delete the category “${c.name}”? Posts in it will become uncategorized.`,
                              confirmText: "Delete",
                              danger: true,
                            })
                          )
                            startTransition(() => deleteCategory(c.id));
                        }}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
