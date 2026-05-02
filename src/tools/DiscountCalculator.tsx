import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

export default function DiscountCalculator() {
  const tool = getToolBySlug("discount-calculator")!;
  const [price, setPrice] = useState("100");
  const [d, setD] = useState("20");
  const saved = +price * (+d / 100);
  const final = +price - saved;
  return (
    <ToolPageLayout tool={tool}
      example={<>$100 with 20% off → $80 (saved $20).</>}
      faq={[
        { q: "Formula?", a: "Final price = original × (1 − discount/100)." },
        { q: "Can I stack discounts?", a: "Apply each discount sequentially: e.g., 20% then 10% off equals 28% total." },
        { q: "Does this include taxes?", a: "No — discounts apply to the listed price; taxes are separate." },
      ]}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><Label>Original price</Label><Input type="number" value={price} onChange={e => setPrice(e.target.value)} /></div>
        <div><Label>Discount (%)</Label><Input type="number" value={d} onChange={e => setD(e.target.value)} /></div>
      </div>
      <div className="mt-6 rounded-lg gradient-primary p-6 text-primary-foreground">
        <div className="text-sm opacity-90">You pay</div>
        <div className="text-4xl font-bold">${final.toFixed(2)}</div>
        <div className="text-sm opacity-90 mt-1">You save: ${saved.toFixed(2)}</div>
      </div>
    </ToolPageLayout>
  );
}
