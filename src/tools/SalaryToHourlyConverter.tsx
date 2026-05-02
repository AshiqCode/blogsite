import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

export default function SalaryToHourlyConverter() {
  const tool = getToolBySlug("salary-to-hourly-converter")!;
  const [salary, setSalary] = useState("60000");
  const [hpw, setHpw] = useState("40");
  const [wpy, setWpy] = useState("52");
  const hourly = +salary / (+hpw * +wpy);
  return (
    <ToolPageLayout tool={tool}
      example={<>$60,000 / year @ 40 h/wk = ~$28.85 / hour.</>}
      faq={[
        { q: "Does this account for vacation?", a: "Adjust weeks per year (e.g., 50) to model paid time off." },
        { q: "How are weekly/monthly pay calculated?", a: "Hourly × hours/week, and × 52 / 12 for monthly." },
        { q: "Is this gross or net?", a: "Gross — taxes and deductions are not included." },
      ]}>
      <div className="grid sm:grid-cols-3 gap-4">
        <div><Label>Annual salary</Label><Input type="number" value={salary} onChange={e => setSalary(e.target.value)} /></div>
        <div><Label>Hours / week</Label><Input type="number" value={hpw} onChange={e => setHpw(e.target.value)} /></div>
        <div><Label>Weeks / year</Label><Input type="number" value={wpy} onChange={e => setWpy(e.target.value)} /></div>
      </div>
      <div className="mt-6 grid sm:grid-cols-3 gap-3">
        <div className="rounded-lg gradient-primary p-5 text-primary-foreground"><div className="text-xs opacity-90">Hourly</div><div className="text-2xl font-bold">${hourly.toFixed(2)}</div></div>
        <div className="rounded-lg bg-secondary p-5"><div className="text-xs text-muted-foreground">Weekly</div><div className="text-2xl font-bold">${(hourly * +hpw).toFixed(2)}</div></div>
        <div className="rounded-lg bg-secondary p-5"><div className="text-xs text-muted-foreground">Monthly</div><div className="text-2xl font-bold">${(+salary / 12).toFixed(2)}</div></div>
      </div>
    </ToolPageLayout>
  );
}
