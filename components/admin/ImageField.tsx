"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { uploadMedia } from "@/lib/upload";

export function ImageField({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string | null;
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    try {
      const media = await uploadMedia(file);
      setUrl(media.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-border bg-zinc-50">
          <Image src={url} alt="" fill className="object-cover" sizes="400px" />
          <button
            type="button"
            onClick={() => setUrl("")}
            className="absolute right-2 top-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white hover:bg-black/80"
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border bg-zinc-50 text-sm text-zinc-500 hover:border-accent hover:text-accent disabled:opacity-60"
        >
          {busy ? "Uploading…" : "Click to upload an image"}
        </button>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />

      <div className="flex items-center gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="…or paste an image URL"
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
