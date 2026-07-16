import Image from "next/image";
import type { SiteSettings } from "@/lib/types";

/** Author byline + bio box (E-E-A-T). Falls back to the site title if no
 *  dedicated author name is configured. */
export function AuthorBio({ settings }: { settings: SiteSettings }) {
  const name = settings.author_name || settings.site_title;
  const bio = settings.author_bio;
  if (!name && !bio) return null;

  const initial = name.charAt(0).toUpperCase();

  return (
    <aside className="mt-12 flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 shadow-soft">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-accent-soft">
        {settings.author_avatar ? (
          <Image
            src={settings.author_avatar}
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
        <p className="font-display text-lg font-semibold">{name}</p>
        {bio && <p className="mt-1 text-sm leading-relaxed text-muted">{bio}</p>}
      </div>
    </aside>
  );
}
