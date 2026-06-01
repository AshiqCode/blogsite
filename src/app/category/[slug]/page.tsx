import type { Metadata } from "next";
import CategoryPage from "@/views/CategoryPage";

const titleFromSlug = (slug: string) =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

type RouteProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const { slug } = await params;
  const title = titleFromSlug(slug);
  const description = `Free ${title} tools from ToolsHub. Fast online calculators, converters, and utilities.`;

  return {
    title: `${title} Tools - ToolsHub`,
    description,
    alternates: { canonical: `/category/${slug}` },
    openGraph: {
      title: `${title} Tools - ToolsHub`,
      description,
      url: `/category/${slug}`,
      type: "website",
    },
  };
}

export default async function CategoryRoute({ params }: RouteProps) {
  const { slug } = await params;
  return <CategoryPage slug={slug} />;
}
