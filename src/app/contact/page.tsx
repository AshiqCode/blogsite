import type { Metadata } from "next";
import { Contact } from "@/views/StaticPages";

export const metadata: Metadata = {
  title: "Contact - ToolsHub",
  description: "Get in touch with the ToolsHub team.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <Contact />;
}
