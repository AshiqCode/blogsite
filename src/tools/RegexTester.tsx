import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

export default function RegexTester() {
  const tool = getToolBySlug("regex-tester")!;
  const [pattern, setPattern] = useState("\\b\\w+\\b");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("Hello World 123");
  const matches = useMemo(() => {
    try {
      const re = new RegExp(pattern, flags);
      const m = text.match(re);
      return { ok: true, items: m || [] };
    } catch (e) { return { ok: false, error: (e as Error).message, items: [] as string[] }; }
  }, [pattern, flags, text]);
  return (
    <ToolPageLayout tool={tool}
      example={<>Pattern \b\w+\b with flag g matches every word.</>}
      faq={[
        { q: "Which flavor?", a: "JavaScript regex — same as used in browsers and Node.js." },
        { q: "Common flags?", a: "g (global), i (case-insensitive), m (multiline), s (dotAll), u (unicode)." },
        { q: "Why error?", a: "Invalid regex syntax — check escaping and groups." },
      ]}>
      <div className="grid sm:grid-cols-[1fr_120px] gap-3">
        <div><Label>Pattern</Label><Input value={pattern} onChange={e => setPattern(e.target.value)} className="font-mono" /></div>
        <div><Label>Flags</Label><Input value={flags} onChange={e => setFlags(e.target.value)} className="font-mono" /></div>
      </div>
      <div className="mt-4"><Label>Test text</Label><Textarea rows={6} value={text} onChange={e => setText(e.target.value)} /></div>
      <div className="mt-6 rounded-lg bg-secondary p-4">
        {matches.ok
          ? <><div className="text-xs text-muted-foreground mb-2">{matches.items.length} match(es)</div>
            <div className="flex flex-wrap gap-2">{matches.items.map((m, i) => <span key={i} className="px-2 py-1 rounded bg-accent text-accent-foreground text-xs font-mono">{m}</span>)}</div></>
          : <div className="text-sm text-destructive">{matches.error}</div>}
      </div>
    </ToolPageLayout>
  );
}
