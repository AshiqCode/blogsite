import { getSettings } from "@/lib/queries";

export const revalidate = 3600;

/**
 * Serves /ads.txt for Google AdSense. Once you set your AdSense Publisher ID in
 * Settings, this returns the authorized-sellers line Google requires.
 */
export async function GET() {
  const settings = await getSettings();
  const pubId = settings.adsense_publisher_id?.trim();

  if (!pubId) {
    return new Response("# No AdSense publisher ID configured yet.\n", {
      headers: { "content-type": "text/plain" },
    });
  }

  // ads.txt expects the "pub-..." form (strip a leading "ca-" if present).
  const seller = pubId.replace(/^ca-/, "");
  const body = `google.com, ${seller}, DIRECT, f08c47fec0942fa0\n`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain",
      "cache-control": "public, max-age=3600",
    },
  });
}
