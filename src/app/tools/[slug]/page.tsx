import type { Metadata } from "next";
import ToolPage from "@/views/ToolPage";

const titleFromSlug = (slug: string) =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

type RouteProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const title = titleFromSlug(slug);
  const description = `Use the free ${title} from ToolsHub. Fast, private, and runs in your browser.`;

  return {
    title: `${title} - Free Online Tool | ToolsHub`,
    description,
    alternates: { canonical: `/tools/${slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${title} - Free Online Tool | ToolsHub`,
      description,
      url: `/tools/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - Free Online Tool | ToolsHub`,
      description,
    },
  };
}

export default async function ToolRoute({ params }: RouteProps) {
  const { slug } = await params;
  return <ToolPage slug={slug} />;
}
