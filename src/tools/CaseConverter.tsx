import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { ResultActions } from "@/components/ResultActions";

export default function CaseConverter() {
  const tool = getToolBySlug("case-converter")!;
  const [t, setT] = useState("Hello World from ToolsHub");
  const cases = {
    "UPPER": t.toUpperCase(),
    "lower": t.toLowerCase(),
    "Title Case": t.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()),
    "Sentence case": t.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()),
    "camelCase": t.toLowerCase().replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase()),
    "snake_case": t.toLowerCase().replace(/\s+/g, "_"),
  };
  return (
    <ToolPageLayout tool={tool}
      example={<>"Hello World" → HELLO WORLD, hello world, Hello World, hello_world.</>}
      faq={[
        { q: "What's title case?", a: "Capitalizes the first letter of every word." },
        { q: "Sentence case?", a: "Capitalizes only the first letter of each sentence." },
        { q: "Are special characters preserved?", a: "Yes — only letter casing changes for most modes." },
      ]}>
      <Textarea rows={4} value={t} onChange={e => setT(e.target.value)} />
      <div className="mt-6 space-y-3">
        {Object.entries(cases).map(([k, v]) => (
          <div key={k} className="rounded-lg bg-secondary p-4 flex items-start justify-between gap-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">{k}</div>
              <div className="font-mono text-sm break-all">{v}</div>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(v)}>Copy</Button>
          </div>
        ))}
      </div>
    </ToolPageLayout>
  );
}
