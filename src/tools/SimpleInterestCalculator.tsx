import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

export default function SimpleInterestCalculator() {
  const tool = getToolBySlug("simple-interest-calculator")!;
  const [p, setP] = useState("10000");
  const [r, setR] = useState("8");
  const [y, setY] = useState("5");
  const interest = (+p * +r * +y) / 100;
  return (
    <ToolPageLayout tool={tool}
      example={<>$10,000 at 8% simple for 5 years → $4,000 interest.</>}
      faq={[
        { q: "Formula?", a: "I = P × R × T / 100, where P is principal, R is rate %, T is time in years." },
        { q: "Difference vs compound?", a: "Simple interest is calculated only on the original principal each year." },
        { q: "When is it used?", a: "Auto loans, short-term personal loans and many bonds use simple interest." },
      ]}>
      <div className="grid sm:grid-cols-3 gap-4">
        <div><Label>Principal</Label><Input type="number" value={p} onChange={e => setP(e.target.value)} /></div>
        <div><Label>Rate (% / yr)</Label><Input type="number" value={r} onChange={e => setR(e.target.value)} /></div>
        <div><Label>Time (years)</Label><Input type="number" value={y} onChange={e => setY(e.target.value)} /></div>
      </div>
      <div className="mt-6 rounded-lg gradient-primary p-6 text-primary-foreground">
        <div className="text-sm opacity-90">Interest</div>
        <div className="text-4xl font-bold">${interest.toFixed(2)}</div>
        <div className="text-sm opacity-90 mt-1">Total: ${(+p + interest).toFixed(2)}</div>
      </div>
    </ToolPageLayout>
  );
}
