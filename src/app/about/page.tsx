import type { Metadata } from "next";
import { About } from "@/views/StaticPages";

export const metadata: Metadata = {
  title: "About Us - ToolsHub",
  description: "Learn about ToolsHub - 50+ free, private online tools.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <About />;
}
