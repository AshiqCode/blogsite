import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600; // regenerate hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  try {
    const supabase = await createClient();
    const [{ data: posts }, { data: categories }, { data: tags }] =
      await Promise.all([
        supabase
          .from("posts")
          .select("slug, updated_at, published_at")
          .eq("status", "published")
          .order("published_at", { ascending: false }),
        supabase.from("categories").select("slug"),
        supabase.from("tags").select("slug"),
      ]);

    const postRoutes: MetadataRoute.Sitemap = (posts ?? []).map((p) => ({
      url: `${base}/post/${p.slug}`,
      lastModified: new Date(p.updated_at ?? p.published_at ?? Date.now()),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const categoryRoutes: MetadataRoute.Sitemap = (categories ?? []).map((c) => ({
      url: `${base}/category/${c.slug}`,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    const tagRoutes: MetadataRoute.Sitemap = (tags ?? []).map((t) => ({
      url: `${base}/tag/${t.slug}`,
      changeFrequency: "weekly",
      priority: 0.4,
    }));

    return [...staticRoutes, ...postRoutes, ...categoryRoutes, ...tagRoutes];
  } catch {
    return staticRoutes;
  }
}
