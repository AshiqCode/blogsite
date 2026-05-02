import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

export default function FractionToDecimal() {
  const tool = getToolBySlug("fraction-to-decimal")!;
  const [n, setN] = useState("3");
  const [d, setD] = useState("4");
  const result = +d === 0 ? "—" : (+n / +d).toFixed(6).replace(/\.?0+$/, "");
  return (
    <ToolPageLayout tool={tool}
      example={<>3/4 = 0.75</>}
      faq={[
        { q: "How is it computed?", a: "Numerator divided by denominator with up to 6 decimal places." },
        { q: "Can the denominator be zero?", a: "No — division by zero is undefined." },
        { q: "Negative fractions?", a: "Yes — enter a negative numerator or denominator." },
      ]}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><Label>Numerator</Label><Input type="number" value={n} onChange={e => setN(e.target.value)} /></div>
        <div><Label>Denominator</Label><Input type="number" value={d} onChange={e => setD(e.target.value)} /></div>
      </div>
      <div className="mt-6 rounded-lg gradient-primary p-6 text-primary-foreground">
        <div className="text-sm opacity-90">{n}/{d} =</div>
        <div className="text-4xl font-bold">{result}</div>
      </div>
    </ToolPageLayout>
  );
}
