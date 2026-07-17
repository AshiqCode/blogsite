import type { Metadata, Viewport } from "next";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { getSettings } from "@/lib/queries";
import { siteUrl, absoluteUrl } from "@/lib/site";
import { CookieConsent } from "@/components/CookieConsent";

export const viewport: Viewport = {
  themeColor: "#c25a37",
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings.seo_title || settings.site_title;
  const description =
    settings.seo_description || settings.tagline || `${settings.site_title}`;

  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: title,
      template: `%s · ${settings.site_title}`,
    },
    description,
    applicationName: settings.site_title,
    keywords: settings.seo_keywords
      ? settings.seo_keywords.split(",").map((k) => k.trim()).filter(Boolean)
      : undefined,
    alternates: {
      canonical: "/",
      types: { "application/rss+xml": `${siteUrl()}/feed.xml` },
    },
    icons: settings.favicon_url
      ? {
          icon: settings.favicon_url,
          shortcut: settings.favicon_url,
          apple: settings.favicon_url,
        }
      : undefined,
    openGraph: {
      type: "website",
      siteName: settings.site_title,
      title,
      description,
      url: siteUrl(),
      images: settings.logo_url ? [{ url: settings.logo_url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: settings.logo_url ? [settings.logo_url] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    verification: settings.google_verification
      ? { google: settings.google_verification }
      : undefined,
    other: settings.adsense_publisher_id
      ? { "google-adsense-account": settings.adsense_publisher_id }
      : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  // Social profile URLs strengthen the brand's knowledge-graph entity.
  const sameAs = [
    settings.social_twitter,
    settings.social_facebook,
    settings.social_instagram,
    settings.social_github,
    settings.social_linkedin,
  ].filter((u): u is string => Boolean(u));

  // Site-wide structured data helps Google understand the site.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl()}/#website`,
        url: siteUrl(),
        name: settings.site_title,
        description: settings.tagline ?? undefined,
        inLanguage: "en",
        publisher: { "@id": `${siteUrl()}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${absoluteUrl("/search")}?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl()}/#organization`,
        name: settings.site_title,
        url: siteUrl(),
        ...(settings.logo_url
          ? { logo: { "@type": "ImageObject", url: settings.logo_url } }
          : {}),
        ...(sameAs.length ? { sameAs } : {}),
      },
    ],
  };

  const adsensePub = settings.adsense_publisher_id?.trim();
  const consentNeeded = Boolean(settings.google_analytics_id || adsensePub);

  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..600&family=Nunito+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <NextTopLoader
          color="#c25a37"
          height={3}
          showSpinner={false}
          shadow="0 0 8px #c25a37, 0 0 4px #c25a37"
          easing="ease"
          speed={300}
        />
        {children}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Consent Mode v2 — default everything to denied until the visitor
            accepts via the cookie banner. Runs before GA/AdSense load. */}
        {consentNeeded && (
          <Script id="consent-default" strategy="beforeInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500
});`}
          </Script>
        )}

        {/* Google Analytics */}
        {settings.google_analytics_id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`}
              strategy="afterInteractive"
            />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${settings.google_analytics_id}');`}
            </Script>
          </>
        )}

        {/* Google AdSense verification / auto-ads script */}
        {adsensePub && (
          <Script
            id="adsense"
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsensePub}`}
            crossOrigin="anonymous"
          />
        )}

        <CookieConsent enabled={consentNeeded} />
      </body>
    </html>
  );
}
