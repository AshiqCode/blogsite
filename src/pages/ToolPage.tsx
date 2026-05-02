import { Suspense } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getToolBySlug } from "@/lib/tools-registry";
import NotFound from "./NotFound";

export default function ToolPage() {
  const { slug = "" } = useParams();
  const tool = getToolBySlug(slug);
  if (!tool) return <NotFound />;
  const C = tool.Component;
  return (
    <Suspense fallback={<div className="container py-16 text-center text-muted-foreground">Loading {tool.title}...</div>}>
      <Helmet><meta name="robots" content="index,follow" /></Helmet>
      <C />
    </Suspense>
  );
}
