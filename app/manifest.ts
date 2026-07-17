import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/queries";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSettings();
  const icon = settings.favicon_url || settings.logo_url;

  return {
    name: settings.site_title,
    short_name: settings.site_title,
    description: settings.seo_description || settings.tagline || undefined,
    start_url: "/",
    display: "standalone",
    background_color: "#faf5ee",
    theme_color: "#c25a37",
    icons: icon
      ? [
          { src: icon, sizes: "192x192", type: "image/png" },
          { src: icon, sizes: "512x512", type: "image/png" },
        ]
      : [],
  };
}
