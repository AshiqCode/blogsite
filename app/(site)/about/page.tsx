import type { Metadata } from "next";
import { getSettings } from "@/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: "About",
    description: `About ${settings.site_title}`,
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <header className="mb-10 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">
          Hello there
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          About {settings.site_title}
        </h1>
      </header>

      {settings.about ? (
        <div className="prose-content whitespace-pre-wrap">{settings.about}</div>
      ) : (
        <p className="text-center text-muted">
          The site owner hasn’t written an about section yet.
        </p>
      )}

      {(settings.contact_email || settings.contact_phone) && (
        <div className="card-soft mt-12 p-6 text-center text-sm">
          <p className="font-display text-lg font-semibold">Get in touch</p>
          {settings.contact_email && (
            <p className="mt-2 text-muted">
              <a
                href={`mailto:${settings.contact_email}`}
                className="font-semibold text-accent hover:underline"
              >
                {settings.contact_email}
              </a>
            </p>
          )}
          {settings.contact_phone && (
            <p className="mt-1 text-muted">{settings.contact_phone}</p>
          )}
        </div>
      )}
    </div>
  );
}
