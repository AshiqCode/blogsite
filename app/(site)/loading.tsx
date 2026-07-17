export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse px-4 py-12">
      {/* heading */}
      <div className="mx-auto mb-12 h-9 w-64 max-w-full rounded-lg bg-surface-2" />
      {/* card grid */}
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-border bg-surface"
          >
            <div className="aspect-[16/10] bg-surface-2" />
            <div className="space-y-3 p-5">
              <div className="h-5 w-3/4 rounded bg-surface-2" />
              <div className="h-4 w-full rounded bg-surface-2" />
              <div className="h-4 w-2/3 rounded bg-surface-2" />
              <div className="h-3 w-24 rounded bg-surface-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
