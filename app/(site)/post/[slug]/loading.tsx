export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse px-4 py-10">
      {/* breadcrumb */}
      <div className="mx-auto mb-8 h-3 w-64 max-w-full rounded bg-surface-2" />
      {/* category pill */}
      <div className="mx-auto mb-5 h-6 w-28 rounded-full bg-surface-2" />
      {/* title */}
      <div className="mx-auto mb-3 h-9 w-4/5 rounded-lg bg-surface-2" />
      <div className="mx-auto mb-6 h-9 w-3/5 rounded-lg bg-surface-2" />
      {/* deck */}
      <div className="mx-auto mb-8 h-4 w-2/3 rounded bg-surface-2" />
      {/* byline */}
      <div className="mx-auto mb-10 flex items-center justify-center gap-3">
        <div className="h-11 w-11 rounded-full bg-surface-2" />
        <div className="space-y-2">
          <div className="h-3 w-32 rounded bg-surface-2" />
          <div className="h-3 w-48 rounded bg-surface-2" />
        </div>
      </div>
      {/* featured image */}
      <div className="mb-10 aspect-[16/9] w-full rounded-[1.25rem] bg-surface-2" />
      {/* body text */}
      <div className="space-y-3.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className={`h-4 rounded bg-surface-2 ${
              i % 4 === 3 ? "w-2/3" : "w-full"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
