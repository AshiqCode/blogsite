"use client";

import { Suspense } from "react";
import { getToolBySlug } from "@/lib/tools-registry";
import NotFound from "./NotFound";

export default function ToolPage({ slug = "" }: { slug?: string }) {
  const tool = getToolBySlug(slug);
  if (!tool) return <NotFound />;
  const C = tool.Component;
  return (
    <Suspense fallback={<div className="container py-16 text-center text-muted-foreground">Loading {tool.title}...</div>}>
      <C />
    </Suspense>
  );
}
