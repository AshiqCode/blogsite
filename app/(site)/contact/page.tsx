import type { Metadata } from "next";
import { getSettings } from "@/lib/queries";
import { ContactForm } from "@/components/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: "Contact",
    description: `Get in touch with ${settings.site_title}.`,
    alternates: { canonical: "/contact" },
  };
}

export default async function ContactPage() {
  const settings = await getSettings();

  const socials = [
    { href: settings.social_twitter, label: "Twitter" },
    { href: settings.social_facebook, label: "Facebook" },
    { href: settings.social_instagram, label: "Instagram" },
    { href: settings.social_github, label: "GitHub" },
    { href: settings.social_linkedin, label: "LinkedIn" },
  ].filter((s): s is { href: string; label: string } => Boolean(s.href));

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <header className="mb-10 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">
          Say hello
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Contact
        </h1>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted">
          Have a question, suggestion, or just want to say hi? Send a message and
          we’ll get back to you.
        </p>
      </header>

      {/* Direct details */}
      {(settings.contact_email || settings.contact_phone || socials.length > 0) && (
        <div className="card-soft mb-8 grid gap-4 p-6 sm:grid-cols-2">
          {settings.contact_email && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted">
                Email
              </p>
              <a
                href={`mailto:${settings.contact_email}`}
                className="font-semibold text-accent hover:underline"
              >
                {settings.contact_email}
              </a>
            </div>
          )}
          {settings.contact_phone && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted">
                Phone
              </p>
              <p className="font-semibold">{settings.contact_phone}</p>
            </div>
          )}
          {socials.length > 0 && (
            <div className="sm:col-span-2">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">
                Elsewhere
              </p>
              <div className="flex flex-wrap gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-semibold text-muted shadow-sm transition-colors hover:border-accent hover:text-accent"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <ContactForm toEmail={settings.contact_email} siteTitle={settings.site_title} />
    </div>
  );
}
