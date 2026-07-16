import type { Metadata } from "next";
import Link from "next/link";
import { getSettings } from "@/lib/queries";

// Bump this when you materially change the policy.
const LAST_UPDATED = "July 17, 2026";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: "Privacy Policy",
    description: `How ${settings.site_title} collects, uses, and protects your data.`,
    alternates: { canonical: "/privacy" },
  };
}

export default async function PrivacyPage() {
  const settings = await getSettings();
  const site = settings.site_title;
  const email = settings.contact_email;

  return (
    <div className="mx-auto max-w-2xl px-4 py-14">
      <header className="mb-10 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-accent">
          Legal
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-muted">Last updated: {LAST_UPDATED}</p>
      </header>

      <div className="prose-content">
        <p>
          This Privacy Policy explains how <strong>{site}</strong> (“we”, “us”,
          or “our”) collects, uses, and safeguards information when you visit and
          interact with this website. By using the site, you agree to the
          practices described below.
        </p>

        <h2>Information we collect</h2>
        <ul>
          <li>
            <strong>Comments.</strong> When you leave a comment, we collect the
            name and email address you provide, along with your comment. Your
            email is never published and is used only to manage comments.
          </li>
          <li>
            <strong>Contact messages.</strong> If you contact us, we receive the
            information you choose to send (such as your name, email, and
            message).
          </li>
          <li>
            <strong>Log &amp; usage data.</strong> Like most websites, our
            hosting provider may automatically record basic technical data such
            as your IP address, browser type, referring pages, and timestamps.
          </li>
        </ul>

        <h2>Cookies</h2>
        <p>We use a small number of cookies:</p>
        <ul>
          <li>
            <strong>Essential cookies</strong> keep the site working (for
            example, keeping the administrator signed in). These are always on.
          </li>
          <li>
            <strong>Analytics &amp; advertising cookies</strong> are only set
            after you consent via our cookie banner. You can change your choice
            at any time by clearing your browser’s site data.
          </li>
        </ul>

        <h2>Analytics</h2>
        <p>
          We may use <strong>Google Analytics</strong> to understand how
          visitors use the site in aggregate. Google Analytics uses cookies to
          collect anonymized usage data. You can learn more from{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google’s Privacy Policy
          </a>{" "}
          and opt out with the{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Analytics Opt-out Browser Add-on
          </a>
          .
        </p>

        <h2>Advertising</h2>
        <p>
          We may display ads served by <strong>Google AdSense</strong>. Third-
          party vendors, including Google, use cookies to serve ads based on
          your prior visits to this and other websites.
        </p>
        <ul>
          <li>
            Google’s use of advertising cookies enables it and its partners to
            serve ads to you based on your visits to this and/or other sites.
          </li>
          <li>
            You may opt out of personalized advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Ads Settings
            </a>
            , or opt out of third-party vendors’ cookies at{" "}
            <a
              href="https://www.aboutads.info/choices/"
              target="_blank"
              rel="noopener noreferrer"
            >
              aboutads.info
            </a>
            .
          </li>
        </ul>

        <h2>How we use information</h2>
        <p>
          We use the information we collect to publish and moderate comments,
          respond to your messages, maintain and improve the site, and comply
          with legal obligations. We do not sell your personal information.
        </p>

        <h2>Data retention</h2>
        <p>
          Comments and contact messages are retained for as long as they remain
          relevant to the site, or until you request their removal.
        </p>

        <h2>Your rights</h2>
        <p>
          Depending on where you live (for example, under the EU’s GDPR or
          California’s CCPA), you may have the right to access, correct, or
          delete your personal data. To make a request, contact us using the
          details below.
        </p>

        <h2>Children’s privacy</h2>
        <p>
          This site is not directed to children under 13, and we do not
          knowingly collect personal information from them.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes take
          effect once posted on this page, with the “Last updated” date revised
          accordingly.
        </p>

        <h2>Contact us</h2>
        <p>
          If you have any questions about this Privacy Policy, please{" "}
          <Link href="/contact">get in touch</Link>
          {email ? (
            <>
              {" "}
              or email us at{" "}
              <a href={`mailto:${email}`}>{email}</a>
            </>
          ) : null}
          .
        </p>
      </div>
    </div>
  );
}
