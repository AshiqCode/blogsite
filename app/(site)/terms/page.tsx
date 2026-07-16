import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/queries";

const LAST_UPDATED = "July 17, 2026";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: "Terms & Disclaimer",
    description: `Terms of use and disclaimer for ${settings.site_title}.`,
    alternates: { canonical: "/terms" },
  };
}

export default async function TermsPage() {
  const settings = await getSettings();
  const site = settings.site_title;

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <header className="mb-10 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">
          Legal
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Terms &amp; Disclaimer
        </h1>
        <p className="mt-3 text-sm text-muted">Last updated: {LAST_UPDATED}</p>
      </header>

      <div className="prose-content">
        <p>
          Welcome to <strong>{site}</strong>. By accessing or using this website,
          you agree to be bound by these Terms of Use. If you do not agree,
          please do not use the site.
        </p>

        <h2>Use of the site</h2>
        <p>
          You may read, share, and link to our content for personal,
          non-commercial purposes. You agree not to misuse the site, attempt to
          disrupt it, or use it for any unlawful purpose.
        </p>

        <h2>Intellectual property</h2>
        <p>
          Unless otherwise stated, all content on this site — including articles,
          images, and graphics — is the property of {site} and is protected by
          applicable copyright laws. You may not reproduce or republish
          substantial portions without permission.
        </p>

        <h2>Comments &amp; user contributions</h2>
        <p>
          When you post a comment, you are responsible for its content. We
          reserve the right to edit or remove comments that are spam, offensive,
          unlawful, or otherwise inappropriate, at our discretion.
        </p>

        <h2>Disclaimer</h2>
        <p>
          The content on this site is provided for general informational purposes
          only and is offered “as is” without warranties of any kind, express or
          implied. While we strive for accuracy, we make no guarantees about the
          completeness, reliability, or timeliness of any information. Any action
          you take based on the information here is strictly at your own risk.
        </p>

        <h2>External links</h2>
        <p>
          This site may contain links to third-party websites. We have no control
          over, and are not responsible for, the content, policies, or practices
          of any third-party sites.
        </p>

        <h2>Advertising</h2>
        <p>
          This site may display advertising, including ads served by Google
          AdSense and its partners. Advertisers do not endorse, and are not
          responsible for, the site’s content. See our{" "}
          <Link href="/privacy">Privacy Policy</Link> for details on advertising
          cookies.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, {site} shall not be liable for
          any damages arising from your use of, or inability to use, this website.
        </p>

        <h2>Changes to these terms</h2>
        <p>
          We may update these Terms from time to time. Continued use of the site
          after changes are posted constitutes acceptance of the revised Terms.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these Terms? Please{" "}
          <Link href="/contact">contact us</Link>.
        </p>
      </div>
    </div>
  );
}
