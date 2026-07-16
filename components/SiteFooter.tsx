import Link from "next/link";
import { getSettings } from "@/lib/queries";

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-semibold text-muted shadow-sm transition-colors hover:border-accent hover:text-accent"
    >
      {label}
    </a>
  );
}

export async function SiteFooter() {
  const settings = await getSettings();
  const year = new Date().getFullYear();

  const socials = [
    { href: settings.social_twitter, label: "Twitter" },
    { href: settings.social_facebook, label: "Facebook" },
    { href: settings.social_instagram, label: "Instagram" },
    { href: settings.social_github, label: "GitHub" },
    { href: settings.social_linkedin, label: "LinkedIn" },
  ].filter((s): s is { href: string; label: string } => Boolean(s.href));

  return (
    <footer className="mt-16 border-t border-border/70">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="flex items-center gap-2 font-display text-xl font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm text-white">
                {settings.site_title.charAt(0)}
              </span>
              {settings.site_title}
            </p>
            {settings.tagline && (
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {settings.tagline}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {socials.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {socials.map((s) => (
                  <SocialLink key={s.label} href={s.href} label={s.label} />
                ))}
              </div>
            )}
            <nav className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold text-muted sm:justify-end">
              <Link href="/" className="hover:text-accent">
                Home
              </Link>
              <Link href="/about" className="hover:text-accent">
                About
              </Link>
              <Link href="/contact" className="hover:text-accent">
                Contact
              </Link>
              <Link href="/privacy" className="hover:text-accent">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-accent">
                Terms
              </Link>
              <a href="/feed.xml" className="hover:text-accent">
                RSS
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-10 border-t border-border/70 pt-6 text-sm text-muted">
          {settings.footer_text ||
            `© ${year} ${settings.site_title}. Crafted with care.`}
        </div>
      </div>
    </footer>
  );
}
