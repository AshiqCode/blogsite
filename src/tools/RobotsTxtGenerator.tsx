import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { ResultActions } from "@/components/ResultActions";

export default function RobotsTxtGenerator() {
  const tool = getToolBySlug("robots-txt-generator")!;
  const [agent, setAgent] = useState("*");
  const [disallow, setDisallow] = useState("/admin\n/private");
  const [sitemap, setSitemap] = useState("https://example.com/sitemap.xml");
  const lines = disallow.split("\n").filter(Boolean).map(l => `Disallow: ${l.trim()}`).join("\n");
  const out = `User-agent: ${agent}\n${lines}\n\nSitemap: ${sitemap}`;
  return (
    <ToolPageLayout tool={tool}
      example={<>Block /admin and reference your sitemap URL.</>}
      faq={[
        { q: "What is robots.txt?", a: "A file telling search engine crawlers which paths they can access on your site." },
        { q: "Where do I put it?", a: "At the root of your domain: https://yoursite.com/robots.txt." },
        { q: "Does it guarantee privacy?", a: "No — it's only a hint to crawlers. Use auth for sensitive data." },
      ]}>
      <div className="space-y-4">
        <div><Label>User-agent</Label><Input value={agent} onChange={e => setAgent(e.target.value)} /></div>
        <div><Label>Disallow paths (one per line)</Label><Textarea rows={4} value={disallow} onChange={e => setDisallow(e.target.value)} /></div>
        <div><Label>Sitemap URL</Label><Input value={sitemap} onChange={e => setSitemap(e.target.value)} /></div>
      </div>
      <pre className="mt-6 rounded-lg bg-secondary p-4 text-sm">{out}</pre>
      <div className="mt-3"><ResultActions value={out} /></div>
    </ToolPageLayout>
  );
}
