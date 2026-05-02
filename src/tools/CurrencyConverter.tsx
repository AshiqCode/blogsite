import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

// Static reference rates (relative to USD). For production, swap to a live API.
const rates: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.2, JPY: 156.5, AUD: 1.51, CAD: 1.36, CHF: 0.89, CNY: 7.25, BRL: 5.05,
};

export default function CurrencyConverter() {
  const tool = getToolBySlug("currency-converter")!;
  const [amt, setAmt] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const result = (+amt / rates[from]) * rates[to];
  return (
    <ToolPageLayout tool={tool}
      example={<>100 USD ≈ 92 EUR using static reference rates.</>}
      faq={[
        { q: "Are the rates live?", a: "We use cached reference rates for simplicity. For trading, consult your bank." },
        { q: "Which currencies are supported?", a: "10 major currencies including USD, EUR, GBP, INR, JPY and more." },
        { q: "Is conversion free?", a: "Yes — all conversions happen in your browser at no cost." },
      ]}>
      <div className="grid sm:grid-cols-3 gap-4">
        <div><Label>Amount</Label><Input type="number" value={amt} onChange={e => setAmt(e.target.value)} /></div>
        <div><Label>From</Label>
          <Select value={from} onValueChange={setFrom}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{Object.keys(rates).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>To</Label>
          <Select value={to} onValueChange={setTo}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{Object.keys(rates).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-6 rounded-lg gradient-primary p-6 text-primary-foreground">
        <div className="text-sm opacity-90">Converted amount</div>
        <div className="text-4xl font-bold">{result.toFixed(2)} {to}</div>
      </div>
    </ToolPageLayout>
  );
}
