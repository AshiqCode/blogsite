/**
 * Canonical base URL of the site, used for metadata, canonical links,
 * sitemap and Open Graph tags. Configure NEXT_PUBLIC_SITE_URL in production.
 */
export function siteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000";
  return url.replace(/\/$/, "");
}

/** Build an absolute URL from a path (e.g. "/post/hello"). */
export function absoluteUrl(path = "/"): string {
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}
