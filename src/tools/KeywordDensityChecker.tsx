import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

export default function KeywordDensityChecker() {
  const tool = getToolBySlug("keyword-density-checker")!;
  const [text, setText] = useState("");
  const stats = useMemo(() => {
    const words = text.toLowerCase().match(/\b[a-z']+\b/g) || [];
    const counts: Record<string, number> = {};
    words.forEach(w => { counts[w] = (counts[w] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([w, c]) => ({ w, c, d: ((c / words.length) * 100).toFixed(2) }));
  }, [text]);
  return (
    <ToolPageLayout tool={tool}
      example={<>Paste an article — see top 15 keywords by frequency and density (%).</>}
      faq={[
        { q: "What is keyword density?", a: "The percentage of times a keyword appears relative to total words." },
        { q: "What's a good density?", a: "1–3% for primary keywords is generally safe; over 5% may look spammy." },
        { q: "Are stop words filtered?", a: "Currently no — all words are counted; you can ignore common ones manually." },
      ]}>
      <Textarea rows={8} placeholder="Paste your content here..." value={text} onChange={e => setText(e.target.value)} />
      <div className="mt-6 rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary"><tr><th className="text-left p-3">Keyword</th><th className="text-right p-3">Count</th><th className="text-right p-3">Density</th></tr></thead>
          <tbody>{stats.map(s => <tr key={s.w} className="border-t border-border"><td className="p-3">{s.w}</td><td className="p-3 text-right">{s.c}</td><td className="p-3 text-right">{s.d}%</td></tr>)}</tbody>
        </table>
      </div>
    </ToolPageLayout>
  );
}
