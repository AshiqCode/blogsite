import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

export default function CharacterCounter() {
  const tool = getToolBySlug("character-counter")!;
  const [t, setT] = useState("");
  const all = t.length;
  const noSpace = t.replace(/\s/g, "").length;
  const words = (t.match(/\b\w+\b/g) || []).length;
  return (
    <ToolPageLayout tool={tool}
      example={<>Real-time character count for tweets, SMS, and meta tags.</>}
      faq={[
        { q: "Why count characters?", a: "Tweets, SMS, and meta descriptions all have character limits." },
        { q: "Are emojis counted?", a: "Yes — by JavaScript code units, which is what most platforms count." },
        { q: "Is whitespace included?", a: "We show counts both with and without spaces." },
      ]}>
      <Textarea rows={8} value={t} onChange={e => setT(e.target.value)} placeholder="Type or paste..." />
      <div className="mt-6 grid sm:grid-cols-3 gap-3">
        <div className="rounded-lg gradient-primary p-5 text-primary-foreground"><div className="text-xs opacity-90">Characters</div><div className="text-2xl font-bold">{all}</div></div>
        <div className="rounded-lg bg-secondary p-5"><div className="text-xs text-muted-foreground">No spaces</div><div className="text-2xl font-bold">{noSpace}</div></div>
        <div className="rounded-lg bg-secondary p-5"><div className="text-xs text-muted-foreground">Words</div><div className="text-2xl font-bold">{words}</div></div>
      </div>
    </ToolPageLayout>
  );
}
