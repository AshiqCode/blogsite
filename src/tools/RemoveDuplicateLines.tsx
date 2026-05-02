import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { ResultActions } from "@/components/ResultActions";

export default function RemoveDuplicateLines() {
  const tool = getToolBySlug("remove-duplicate-lines")!;
  const [t, setT] = useState("apple\nbanana\napple\ncherry\nbanana");
  const lines = t.split("\n");
  const unique = Array.from(new Set(lines));
  const out = unique.join("\n");
  return (
    <ToolPageLayout tool={tool}
      example={<>Removes repeated lines while keeping the original order.</>}
      faq={[
        { q: "Is the order preserved?", a: "Yes — the first occurrence of each line is kept." },
        { q: "Is it case-sensitive?", a: "Yes — 'Apple' and 'apple' are treated as different." },
        { q: "Are blank lines removed?", a: "Only duplicates of blank lines are removed; one stays." },
      ]}>
      <Textarea rows={8} value={t} onChange={e => setT(e.target.value)} />
      <div className="text-xs text-muted-foreground mt-2">{lines.length} → {unique.length} lines</div>
      <pre className="mt-4 rounded-lg bg-secondary p-4 text-sm whitespace-pre-wrap">{out}</pre>
      <div className="mt-3"><ResultActions value={out} /></div>
    </ToolPageLayout>
  );
}
