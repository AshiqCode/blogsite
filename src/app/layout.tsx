import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Providers } from "./providers";
import "@/index.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://trendscope.site"),
  title: {
    default: "ToolsHub - 50+ Free Online Tools & Calculators",
    template: "%s",
  },
  description:
    "Free, fast and private online tools: BMI, EMI, JSON formatter, QR code generator, password generator, unit converter and 45+ more.",
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "ca-pub-2174158128943381",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "ToolsHub",
    title: "ToolsHub - 50+ Free Online Tools & Calculators",
    description:
      "Free, fast and private online tools: BMI, EMI, JSON formatter, QR code generator, password generator, unit converter and 45+ more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolsHub - 50+ Free Online Tools & Calculators",
    description:
      "Free, fast and private online tools: BMI, EMI, JSON formatter, QR code generator, password generator, unit converter and 45+ more.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
