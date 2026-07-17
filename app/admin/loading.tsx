export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-border border-t-accent" />
      <p className="text-sm font-medium text-zinc-500">Loading…</p>
    </div>
  );
}
