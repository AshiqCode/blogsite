import Image from "next/image";

/** Author byline + bio box (E-E-A-T). */
export function AuthorBio({
  name,
  bio,
  avatar,
  role,
}: {
  name: string;
  bio?: string | null;
  avatar?: string | null;
  role?: string | null;
}) {
  if (!name && !bio) return null;
  const initial = name.charAt(0).toUpperCase();

  return (
    <aside className="mt-12 flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 shadow-soft">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-accent-soft">
        {avatar ? (
          <Image
            src={avatar}
            alt={name}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <span className="flex h-full items-center justify-center font-display text-xl font-semibold text-accent">
            {initial}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-accent">
          Written by
        </p>
        <p className="font-display text-lg font-semibold">
          {name}
          {role ? (
            <span className="ml-2 text-sm font-normal text-muted">· {role}</span>
          ) : null}
        </p>
        {bio && <p className="mt-1 text-sm leading-relaxed text-muted">{bio}</p>}
      </div>
    </aside>
  );
}
