import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

export default function CompoundInterestCalculator() {
  const tool = getToolBySlug("compound-interest-calculator")!;
  const [p, setP] = useState("10000");
  const [r, setR] = useState("8");
  const [y, setY] = useState("10");
  const [n, setN] = useState("12");
  const final = +p * Math.pow(1 + (+r/100)/+n, +n * +y);
  return (
    <ToolPageLayout tool={tool}
      example={<>$10,000 at 8% compounded monthly for 10 years → ~$22,196.</>}
      faq={[
        { q: "What is compound interest?", a: "Interest calculated on the initial principal and on the accumulated interest from previous periods." },
        { q: "What is compounding frequency?", a: "How often interest is added — monthly, quarterly, annually, etc." },
        { q: "Why does it grow so fast?", a: "Earnings are reinvested, so each period you earn interest on a larger balance." },
      ]}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><Label>Principal</Label><Input type="number" value={p} onChange={e => setP(e.target.value)} /></div>
        <div><Label>Annual rate (%)</Label><Input type="number" value={r} onChange={e => setR(e.target.value)} /></div>
        <div><Label>Years</Label><Input type="number" value={y} onChange={e => setY(e.target.value)} /></div>
        <div><Label>Compounds per year</Label><Input type="number" value={n} onChange={e => setN(e.target.value)} /></div>
      </div>
      <div className="mt-6 rounded-lg gradient-primary p-6 text-primary-foreground">
        <div className="text-sm opacity-90">Final amount</div>
        <div className="text-4xl font-bold">${final.toFixed(2)}</div>
        <div className="text-sm opacity-90 mt-1">Interest earned: ${(final - +p).toFixed(2)}</div>
      </div>
    </ToolPageLayout>
  );
}
