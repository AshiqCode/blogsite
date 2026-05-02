import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

export default function WordCounter() {
  const tool = getToolBySlug("word-counter")!;
  const [t, setT] = useState("");
  const stats = useMemo(() => {
    const words = (t.match(/\b\w+\b/g) || []).length;
    const chars = t.length;
    const charsNoSpace = t.replace(/\s/g, "").length;
    const sentences = (t.match(/[.!?]+/g) || []).length;
    const paragraphs = t.split(/\n+/).filter(p => p.trim()).length;
    const readMin = Math.max(1, Math.ceil(words / 200));
    return { words, chars, charsNoSpace, sentences, paragraphs, readMin };
  }, [t]);
  return (
    <ToolPageLayout tool={tool}
      example={<>Live count for words, characters, sentences and reading time.</>}
      faq={[
        { q: "How is reading time estimated?", a: "Based on an average reading speed of 200 words per minute." },
        { q: "Are URLs counted as words?", a: "Yes — every contiguous word/number sequence counts as one word." },
        { q: "Is my text private?", a: "Yes — counting happens entirely in your browser." },
      ]}>
      <Textarea rows={10} placeholder="Start typing or paste your text..." value={t} onChange={e => setT(e.target.value)} />
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          ["Words", stats.words], ["Characters", stats.chars], ["No spaces", stats.charsNoSpace],
          ["Sentences", stats.sentences], ["Paragraphs", stats.paragraphs], ["Read time", `${stats.readMin} min`],
        ].map(([k, v]) => (
          <div key={k as string} className="rounded-lg bg-secondary p-4">
            <div className="text-xs text-muted-foreground">{k}</div>
            <div className="text-2xl font-bold">{v}</div>
          </div>
        ))}
      </div>
    </ToolPageLayout>
  );
}
