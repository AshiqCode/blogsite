import type { Metadata } from "next";
import { Privacy } from "@/views/StaticPages";

export const metadata: Metadata = {
  title: "Privacy Policy - ToolsHub",
  description: "How ToolsHub handles your privacy.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <Privacy />;
}
