"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { uploadMedia } from "@/lib/upload";
import { deleteMedia, updateMedia } from "@/app/admin/media/actions";
import { formatBytes, formatDate } from "@/lib/utils";
import { useConfirm } from "@/components/admin/ConfirmProvider";
import type { MediaItem } from "@/lib/types";

export function MediaLibrary({ initialItems }: { initialItems: MediaItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    setBusy(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const media = await uploadMedia(file);
        setItems((prev) => [media, ...prev]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      {/* Upload zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
        }}
        className="mb-6 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-white p-8 text-center"
      >
        <p className="text-sm text-zinc-500">
          Drag &amp; drop files here, or
        </p>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
        >
          {busy ? "Uploading…" : "Choose files"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>

      {items.length === 0 ? (
        <p className="py-10 text-center text-zinc-500">No media uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {items.map((m) => (
            <MediaCard
              key={m.id}
              item={m}
              onOpen={() => setSelected(m)}
              onDeleted={(id) =>
                setItems((prev) => prev.filter((i) => i.id !== id))
              }
            />
          ))}
        </div>
      )}

      {selected && (
        <MediaDetail
          item={selected}
          onClose={() => setSelected(null)}
          onDeleted={(id) => {
            setItems((prev) => prev.filter((i) => i.id !== id));
            setSelected(null);
          }}
          onUpdated={(updated) => {
            setItems((prev) =>
              prev.map((i) => (i.id === updated.id ? updated : i)),
            );
            setSelected(updated);
          }}
        />
      )}
    </div>
  );
}

function MediaCard({
  item,
  onOpen,
  onDeleted,
}: {
  item: MediaItem;
  onOpen: () => void;
  onDeleted: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();
  const confirm = useConfirm();

  return (
    <div className="group overflow-hidden rounded-lg border border-border bg-white">
      <button
        type="button"
        onClick={onOpen}
        className="block w-full"
        title="Open details"
      >
        <div className="relative aspect-square bg-zinc-50">
          {item.mime_type?.startsWith("image/") ? (
            <Image
              src={item.url}
              alt={item.alt_text ?? item.file_name}
              fill
              sizes="200px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-zinc-400">
              {item.file_name.split(".").pop()?.toUpperCase()}
            </div>
          )}
        </div>
      </button>
      <p className="truncate px-2 pt-1.5 text-xs text-zinc-600" title={item.file_name}>
        {item.file_name}
      </p>
      <div className="flex items-center gap-1 px-1.5 pb-1.5 pt-1">
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(item.url);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            } catch {
              /* clipboard unavailable */
            }
          }}
          className="flex-1 rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-200"
        >
          {copied ? "Copied!" : "Copy URL"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={async () => {
            if (
              await confirm({
                title: "Delete file",
                message: `Delete “${item.file_name}”? This removes it from storage permanently.`,
                confirmText: "Delete",
                danger: true,
              })
            )
              startTransition(async () => {
                await deleteMedia(item.id, item.storage_path);
                onDeleted(item.id);
              });
          }}
          className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          title="Delete"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function MediaDetail({
  item,
  onClose,
  onDeleted,
  onUpdated,
}: {
  item: MediaItem;
  onClose: () => void;
  onDeleted: (id: string) => void;
  onUpdated: (item: MediaItem) => void;
}) {
  const [alt, setAlt] = useState(item.alt_text ?? "");
  const [caption, setCaption] = useState(item.caption ?? "");
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();
  const confirm = useConfirm();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-xl bg-white p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <h3 className="font-semibold">Media details</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700">
            ✕
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-zinc-50">
            {item.mime_type?.startsWith("image/") && (
              <Image
                src={item.url}
                alt={item.alt_text ?? item.file_name}
                fill
                sizes="300px"
                className="object-contain"
              />
            )}
          </div>

          <div className="space-y-3 text-sm">
            <p className="break-all font-medium">{item.file_name}</p>
            <p className="text-zinc-500">
              {formatBytes(item.file_size)} · {formatDate(item.created_at)}
            </p>

            <div>
              <label className="mb-1 block text-xs font-medium">Alt text</label>
              <input
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Caption</label>
              <input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                readOnly
                value={item.url}
                className="w-full rounded-lg border border-border bg-zinc-50 px-3 py-2 text-xs outline-none"
              />
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(item.url);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
                className="shrink-0 rounded-lg border border-border px-3 py-2 text-xs hover:bg-zinc-100"
              >
                {copied ? "Copied" : "Copy URL"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-between border-t border-border pt-4">
          <button
            disabled={pending}
            onClick={async () => {
              if (
                await confirm({
                  title: "Delete file",
                  message: "Delete this file permanently? This cannot be undone.",
                  confirmText: "Delete",
                  danger: true,
                })
              )
                startTransition(async () => {
                  await deleteMedia(item.id, item.storage_path);
                  onDeleted(item.id);
                });
            }}
            className="rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            Delete
          </button>
          <button
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                await updateMedia(item.id, alt, caption);
                onUpdated({
                  ...item,
                  alt_text: alt.trim() || null,
                  caption: caption.trim() || null,
                });
              })
            }
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
