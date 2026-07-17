import Link from "next/link";
import Image from "next/image";
import { getCategories, getSettings } from "@/lib/queries";
import { SearchBox } from "@/components/SearchBox";
import { SiteNav } from "@/components/SiteNav";

export async function SiteHeader() {
  const [settings, categories] = await Promise.all([
    getSettings(),
    getCategories(),
  ]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface shadow-[0_1px_16px_rgba(74,46,30,0.05)]">
      <div className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          {settings.logo_url ? (
            <Image
              src={settings.logo_url}
              alt={settings.site_title}
              width={140}
              height={36}
              className="h-9 w-auto object-contain"
            />
          ) : (
            <span className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent font-display text-lg font-semibold text-white shadow-[0_2px_8px_rgba(194,90,55,0.35)]">
                {settings.site_title.charAt(0)}
              </span>
              <span className="font-display text-xl font-semibold tracking-tight">
                {settings.site_title}
              </span>
            </span>
          )}
        </Link>

        <SiteNav
          categories={categories.map((c) => ({
            id: c.id,
            slug: c.slug,
            name: c.name,
          }))}
        />

        <div className="ml-auto">
          <SearchBox />
        </div>
      </div>
    </header>
  );
}
