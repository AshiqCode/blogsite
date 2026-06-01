import type { Metadata } from "next";
import { Disclaimer } from "@/views/StaticPages";

export const metadata: Metadata = {
  title: "Disclaimer - ToolsHub",
  description: "Important information about ToolsHub calculators.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return <Disclaimer />;
}
