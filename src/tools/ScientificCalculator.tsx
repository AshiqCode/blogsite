import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

export default function ScientificCalculator() {
  const tool = getToolBySlug("scientific-calculator")!;
  const [expr, setExpr] = useState("Math.sqrt(2) * 10");
  const [out, setOut] = useState<string>("");
  const evalExpr = () => {
    try { // eslint-disable-next-line no-new-func
      const v = Function(`"use strict"; return (${expr})`)();
      setOut(String(v));
    } catch { setOut("Error"); }
  };
  return (
    <ToolPageLayout tool={tool}
      example={<>Math.sqrt(2) * 10 → 14.142...</>}
      faq={[
        { q: "Which functions are supported?", a: "Any JavaScript Math expression: sin, cos, tan, log, sqrt, pow, PI, E and more." },
        { q: "Is my input sent anywhere?", a: "No — calculation runs entirely in your browser." },
        { q: "Can I use variables?", a: "Not currently — but you can chain expressions on one line." },
      ]}>
      <Input value={expr} onChange={e => setExpr(e.target.value)} className="font-mono" />
      <Button onClick={evalExpr} className="mt-3">Calculate</Button>
      {out && (
        <div className="mt-6 rounded-lg gradient-primary p-6 text-primary-foreground">
          <div className="text-sm opacity-90">Result</div>
          <div className="text-3xl font-bold font-mono">{out}</div>
        </div>
      )}
      <p className="text-xs text-muted-foreground mt-3">Tip: use Math.* functions, e.g. Math.sin(Math.PI/2).</p>
    </ToolPageLayout>
  );
}
