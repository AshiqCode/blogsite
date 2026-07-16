import { getRecentPublished, getSettings } from "@/lib/queries";
import { siteUrl, absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const [settings, posts] = await Promise.all([
    getSettings(),
    getRecentPublished(20),
  ]);

  const base = siteUrl();
  const title = xmlEscape(settings.site_title);
  const description = xmlEscape(settings.tagline || settings.site_title);

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/post/${post.slug}`);
      const date = post.published_at
        ? new Date(post.published_at).toUTCString()
        : new Date(post.created_at).toUTCString();
      return `    <item>
      <title>${xmlEscape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${date}</pubDate>
      ${post.category ? `<category>${xmlEscape(post.category.name)}</category>` : ""}
      <description><![CDATA[${post.excerpt ?? ""}]]></description>
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${title}</title>
    <link>${base}</link>
    <description>${description}</description>
    <language>en</language>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
