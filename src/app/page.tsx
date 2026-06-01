import type { Metadata } from "next";
import { Suspense } from "react";
import Index from "@/views/Index";

export const metadata: Metadata = {
  title: "ToolsHub - 50+ Free Online Tools & Calculators",
  description:
    "Free, fast and private online tools: BMI, EMI, JSON formatter, QR code generator, password generator, unit converter and 45+ more.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <Index />
    </Suspense>
  );
}
