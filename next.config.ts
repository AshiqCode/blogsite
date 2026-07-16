import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
