export default async function handler(req, res) {
  try {
    const r = await fetch(
      "https://network-cecda-default-rtdb.firebaseio.com/posts.json"
    );
    const data = await r.json();

    const base = "https://trendscope.site";

    const urls = [
      {
        loc: `${base}/`,
        changefreq: "daily",
        priority: "1.0",
        lastmod: new Date().toISOString(),
      },
    ];

    if (data && typeof data === "object") {
      for (const key of Object.keys(data)) {
        const p = data[key] || {};
        const slug = String(p.slug || "").trim();
        if (!slug) continue;

        const lastmod = p.updatedAt || p.createdAt || new Date().toISOString();

        urls.push({
          loc: `${base}/post/${encodeURIComponent(slug)}`,
          changefreq: "weekly",
          priority: "0.8",
          lastmod: new Date(lastmod).toISOString(),
        });
      }
    }

    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      urls
        .map(
          (u) =>
            `  <url>\n` +
            `    <loc>${u.loc}</loc>\n` +
            `    <lastmod>${u.lastmod}</lastmod>\n` +
            `    <changefreq>${u.changefreq}</changefreq>\n` +
            `    <priority>${u.priority}</priority>\n` +
            `  </url>`
        )
        .join("\n") +
      `\n</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );
    res.status(200).send(xml);
  } catch (e) {
    res.status(500).send("Failed to generate sitemap");
  }
}
