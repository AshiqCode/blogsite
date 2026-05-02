import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

export default function DateDifferenceCalculator() {
  const tool = getToolBySlug("date-difference-calculator")!;
  const [a, setA] = useState("2026-01-01");
  const [b, setB] = useState("2026-12-31");
  const ms = Math.abs(new Date(b).getTime() - new Date(a).getTime());
  const days = Math.floor(ms / 86400000);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30.44);
  return (
    <ToolPageLayout tool={tool}
      example={<>1 Jan 2026 → 31 Dec 2026 = 364 days (52 weeks).</>}
      faq={[
        { q: "Is the result inclusive?", a: "No — it's the exact gap; add 1 if you want to include both endpoints." },
        { q: "Are leap years handled?", a: "Yes — date math is precise." },
        { q: "Can I cross years?", a: "Yes — any two dates work, past or future." },
      ]}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><Label>From</Label><Input type="date" value={a} onChange={e => setA(e.target.value)} /></div>
        <div><Label>To</Label><Input type="date" value={b} onChange={e => setB(e.target.value)} /></div>
      </div>
      <div className="mt-6 grid sm:grid-cols-3 gap-3">
        <div className="rounded-lg gradient-primary p-5 text-primary-foreground"><div className="text-xs opacity-90">Days</div><div className="text-2xl font-bold">{days}</div></div>
        <div className="rounded-lg bg-secondary p-5"><div className="text-xs text-muted-foreground">Weeks</div><div className="text-2xl font-bold">{weeks}</div></div>
        <div className="rounded-lg bg-secondary p-5"><div className="text-xs text-muted-foreground">~Months</div><div className="text-2xl font-bold">{months}</div></div>
      </div>
    </ToolPageLayout>
  );
}
