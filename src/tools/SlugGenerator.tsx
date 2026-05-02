import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { ResultActions } from "@/components/ResultActions";

export default function SlugGenerator() {
  const tool = getToolBySlug("slug-generator")!;
  const [t, setT] = useState("Hello World — My First Post!");
  const slug = t.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return (
    <ToolPageLayout tool={tool}
      example={<>"Hello World!" → hello-world</>}
      faq={[
        { q: "What is a URL slug?", a: "The human-readable part of a URL after the domain, like /my-post-title." },
        { q: "Are accents handled?", a: "Yes — accented characters are normalized to ASCII." },
        { q: "Can I use uppercase?", a: "Slugs should be lowercase for SEO consistency." },
      ]}>
      <Input value={t} onChange={e => setT(e.target.value)} />
      <div className="mt-6 rounded-lg gradient-primary p-6 text-primary-foreground font-mono text-xl break-all">{slug}</div>
      <div className="mt-3"><ResultActions value={slug} /></div>
    </ToolPageLayout>
  );
}
