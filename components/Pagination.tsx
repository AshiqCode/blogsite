import Link from "next/link";

export function Pagination({
  page,
  pageSize,
  total,
  basePath,
}: {
  page: number;
  pageSize: number;
  total: number;
  basePath: string;
}) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const sep = basePath.includes("?") ? "&" : "?";
  const href = (p: number) => (p === 1 ? basePath : `${basePath}${sep}page=${p}`);

  return (
    <nav className="mt-14 flex items-center justify-center gap-3 text-sm font-semibold">
      {page > 1 && (
        <Link
          href={href(page - 1)}
          className="rounded-full border border-border bg-surface px-5 py-2.5 shadow-sm transition-colors hover:border-accent hover:text-accent"
        >
          ← Previous
        </Link>
      )}
      <span className="rounded-full bg-surface-2 px-4 py-2.5 text-muted">
        {page} / {totalPages}
      </span>
      {page < totalPages && (
        <Link
          href={href(page + 1)}
          className="rounded-full border border-border bg-surface px-5 py-2.5 shadow-sm transition-colors hover:border-accent hover:text-accent"
        >
          Next →
        </Link>
      )}
    </nav>
  );
}
