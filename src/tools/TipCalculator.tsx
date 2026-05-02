import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

export default function TipCalculator() {
  const tool = getToolBySlug("tip-calculator")!;
  const [bill, setBill] = useState("50");
  const [tip, setTip] = useState("15");
  const [people, setPeople] = useState("2");
  const tipAmt = +bill * (+tip / 100);
  const total = +bill + tipAmt;
  const perPerson = total / Math.max(1, +people);
  return (
    <ToolPageLayout tool={tool}
      example={<>$50 bill, 15% tip, split 2 ways → $28.75 each.</>}
      faq={[
        { q: "What is a standard tip?", a: "15–20% is common in the US for restaurants. Other countries vary." },
        { q: "Should I tip on tax?", a: "Most diners tip on the pre-tax subtotal, but it's a personal choice." },
        { q: "How is per-person calculated?", a: "Total (bill + tip) divided by number of people." },
      ]}>
      <div className="grid sm:grid-cols-3 gap-4">
        <div><Label>Bill</Label><Input type="number" value={bill} onChange={e => setBill(e.target.value)} /></div>
        <div><Label>Tip (%)</Label><Input type="number" value={tip} onChange={e => setTip(e.target.value)} /></div>
        <div><Label>People</Label><Input type="number" value={people} onChange={e => setPeople(e.target.value)} /></div>
      </div>
      <div className="mt-6 grid sm:grid-cols-3 gap-3">
        <div className="rounded-lg bg-secondary p-5"><div className="text-xs text-muted-foreground">Tip</div><div className="text-2xl font-bold">${tipAmt.toFixed(2)}</div></div>
        <div className="rounded-lg bg-secondary p-5"><div className="text-xs text-muted-foreground">Total</div><div className="text-2xl font-bold">${total.toFixed(2)}</div></div>
        <div className="rounded-lg gradient-primary p-5 text-primary-foreground"><div className="text-xs opacity-90">Per Person</div><div className="text-2xl font-bold">${perPerson.toFixed(2)}</div></div>
      </div>
    </ToolPageLayout>
  );
}
