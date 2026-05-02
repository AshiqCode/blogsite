import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { ResultActions } from "@/components/ResultActions";

export default function JsonFormatter() {
  const tool = getToolBySlug("json-formatter")!;
  const [t, setT] = useState('{"name":"ToolsHub","tools":50,"free":true}');
  const [out, setOut] = useState("");
  const [err, setErr] = useState("");
  const format = (indent = 2) => {
    try { setOut(JSON.stringify(JSON.parse(t), null, indent)); setErr(""); }
    catch (e) { setErr((e as Error).message); setOut(""); }
  };
  const minify = () => format(0);
  return (
    <ToolPageLayout tool={tool}
      example={<>Pretty-print JSON, validate it, or minify for production.</>}
      faq={[
        { q: "Is invalid JSON detected?", a: "Yes — you'll see the parser error message." },
        { q: "Are comments allowed?", a: "Standard JSON doesn't allow comments. Remove them first." },
        { q: "How large can input be?", a: "Limited only by your browser memory." },
      ]}>
      <Textarea rows={8} value={t} onChange={e => setT(e.target.value)} className="font-mono text-sm" />
      <div className="mt-3 flex gap-2">
        <Button onClick={() => format(2)}>Format</Button>
        <Button variant="outline" onClick={minify}>Minify</Button>
      </div>
      {err && <div className="mt-3 text-sm text-destructive">{err}</div>}
      {out && <>
        <pre className="mt-4 rounded-lg bg-secondary p-4 text-sm overflow-auto">{out}</pre>
        <div className="mt-3"><ResultActions value={out} /></div>
      </>}
    </ToolPageLayout>
  );
}
