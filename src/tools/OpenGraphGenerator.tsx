import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { ResultActions } from "@/components/ResultActions";

export default function OpenGraphGenerator() {
  const tool = getToolBySlug("open-graph-generator")!;
  const [title, setTitle] = useState("My Page");
  const [desc, setDesc] = useState("A great page");
  const [url, setUrl] = useState("https://example.com");
  const [img, setImg] = useState("https://example.com/og.png");
  const out = `<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${img}" />
<meta property="og:type" content="website" />`;
  return (
    <ToolPageLayout tool={tool}
      example={<>Generates Facebook/LinkedIn-friendly OG tags.</>}
      faq={[
        { q: "What is Open Graph?", a: "A protocol developed by Facebook to control how URLs display when shared on social media." },
        { q: "Image size?", a: "1200×630 px is recommended for the best preview." },
        { q: "Where do these go?", a: "Inside the <head> of your HTML." },
      ]}>
      <div className="space-y-3">
        <div><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} /></div>
        <div><Label>Description</Label><Textarea value={desc} onChange={e => setDesc(e.target.value)} /></div>
        <div><Label>URL</Label><Input value={url} onChange={e => setUrl(e.target.value)} /></div>
        <div><Label>Image URL</Label><Input value={img} onChange={e => setImg(e.target.value)} /></div>
      </div>
      <pre className="mt-6 rounded-lg bg-secondary p-4 text-xs overflow-auto">{out}</pre>
      <div className="mt-3"><ResultActions value={out} /></div>
    </ToolPageLayout>
  );
}
