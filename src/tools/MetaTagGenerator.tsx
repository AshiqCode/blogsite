import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { ResultActions } from "@/components/ResultActions";

export default function MetaTagGenerator() {
  const tool = getToolBySlug("meta-tag-generator")!;
  const [title, setTitle] = useState("My Awesome Page");
  const [desc, setDesc] = useState("A short description (under 160 characters).");
  const [keys, setKeys] = useState("seo, tools, calculators");
  const tags = `<title>${title}</title>
<meta name="description" content="${desc}" />
<meta name="keywords" content="${keys}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta name="twitter:card" content="summary_large_image" />`;
  return (
    <ToolPageLayout tool={tool}
      example={<>Fill in title and description to generate ready-to-paste meta tags.</>}
      faq={[
        { q: "How long should the title be?", a: "Aim for under 60 characters so it's not truncated in search results." },
        { q: "Description length?", a: "Under 160 characters is the standard recommendation." },
        { q: "Are keywords still useful?", a: "Google ignores keywords meta, but other engines may use them." },
      ]}>
      <div className="space-y-4">
        <div><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} /></div>
        <div><Label>Description</Label><Textarea value={desc} onChange={e => setDesc(e.target.value)} /></div>
        <div><Label>Keywords</Label><Input value={keys} onChange={e => setKeys(e.target.value)} /></div>
      </div>
      <pre className="mt-6 rounded-lg bg-secondary p-4 text-xs overflow-auto">{tags}</pre>
      <div className="mt-3"><ResultActions value={tags} /></div>
    </ToolPageLayout>
  );
}
