import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { ResultActions } from "@/components/ResultActions";

export default function EmiCalculator() {
  const tool = getToolBySlug("loan-emi-calculator")!;
  const [p, setP] = useState("100000");
  const [r, setR] = useState("8");
  const [y, setY] = useState("5");
  const monthlyRate = +r / 12 / 100;
  const n = +y * 12;
  const emi = monthlyRate === 0 ? +p / n : (+p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  const total = emi * n;
  const interest = total - +p;

  return (
    <ToolPageLayout tool={tool}
      example={<>$100,000 loan at 8% for 5 years → EMI ≈ $2,028.</>}
      faq={[
        { q: "What is EMI?", a: "Equated Monthly Installment — the fixed monthly payment combining principal and interest." },
        { q: "How is EMI calculated?", a: "EMI = P × r × (1+r)^n / ((1+r)^n - 1), where r is the monthly rate and n the number of months." },
        { q: "Can I prepay my loan?", a: "Most lenders allow prepayment to reduce total interest. Check your loan terms." },
      ]}>
      <div className="grid sm:grid-cols-3 gap-4">
        <div><Label>Principal</Label><Input type="number" value={p} onChange={e => setP(e.target.value)} /></div>
        <div><Label>Rate (% / yr)</Label><Input type="number" value={r} onChange={e => setR(e.target.value)} /></div>
        <div><Label>Tenure (years)</Label><Input type="number" value={y} onChange={e => setY(e.target.value)} /></div>
      </div>
      <div className="mt-6 grid sm:grid-cols-3 gap-3">
        <div className="rounded-lg gradient-primary p-5 text-primary-foreground"><div className="text-xs opacity-90">Monthly EMI</div><div className="text-2xl font-bold">${emi.toFixed(2)}</div></div>
        <div className="rounded-lg bg-secondary p-5"><div className="text-xs text-muted-foreground">Total Interest</div><div className="text-2xl font-bold">${interest.toFixed(0)}</div></div>
        <div className="rounded-lg bg-secondary p-5"><div className="text-xs text-muted-foreground">Total Payment</div><div className="text-2xl font-bold">${total.toFixed(0)}</div></div>
      </div>
      <div className="mt-4"><ResultActions value={`EMI: $${emi.toFixed(2)}, Total: $${total.toFixed(0)}`} /></div>
    </ToolPageLayout>
  );
}
