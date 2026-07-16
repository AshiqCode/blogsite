import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the jsdom-based sanitizer out of the bundle; load it at runtime.
  serverExternalPackages: ["isomorphic-dompurify"],
  images: {
    remotePatterns: [
      // Supabase Storage public objects
      { protocol: "https", hostname: "**.supabase.co" },
      // Allow other https image hosts (e.g. pasted URLs).
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
