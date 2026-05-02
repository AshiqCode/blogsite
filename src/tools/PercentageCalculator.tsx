import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

export default function PercentageCalculator() {
  const tool = getToolBySlug("percentage-calculator")!;
  const [a, setA] = useState("25");
  const [b, setB] = useState("200");
  const result = (+a / 100) * +b;
  const ratio = +b === 0 ? 0 : (+a / +b) * 100;
  return (
    <ToolPageLayout tool={tool}
      example={<>25% of 200 = 50. 25 is 12.5% of 200.</>}
      faq={[
        { q: "How do I calculate X% of Y?", a: "Multiply: (X / 100) × Y. E.g. 20% of 50 = 10." },
        { q: "What is X as a percent of Y?", a: "(X / Y) × 100. E.g. 25/200 = 12.5%." },
        { q: "How do I find percentage change?", a: "((New − Old) / Old) × 100." },
      ]}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><Label>Percentage (%)</Label><Input type="number" value={a} onChange={e => setA(e.target.value)} /></div>
        <div><Label>Of value</Label><Input type="number" value={b} onChange={e => setB(e.target.value)} /></div>
      </div>
      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        <div className="rounded-lg gradient-primary p-5 text-primary-foreground"><div className="text-xs opacity-90">{a}% of {b}</div><div className="text-2xl font-bold">{result}</div></div>
        <div className="rounded-lg bg-secondary p-5"><div className="text-xs text-muted-foreground">{a} is what % of {b}</div><div className="text-2xl font-bold">{ratio.toFixed(2)}%</div></div>
      </div>
    </ToolPageLayout>
  );
}
