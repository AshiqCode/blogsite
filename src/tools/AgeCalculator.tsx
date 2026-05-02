import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

export default function AgeCalculator() {
  const tool = getToolBySlug("age-calculator")!;
  const [dob, setDob] = useState("2000-01-01");
  const calc = () => {
    const b = new Date(dob);
    const now = new Date();
    let years = now.getFullYear() - b.getFullYear();
    let months = now.getMonth() - b.getMonth();
    let days = now.getDate() - b.getDate();
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    const totalDays = Math.floor((now.getTime() - b.getTime()) / 86400000);
    return { years, months, days, totalDays };
  };
  const r = calc();
  return (
    <ToolPageLayout tool={tool}
      example={<>Born 1 Jan 2000 — at 1 May 2026 you're 26 years, 4 months, 0 days old.</>}
      faq={[
        { q: "How is age calculated?", a: "We compute years, months and days between your birthdate and today, accounting for varying month lengths." },
        { q: "Does it account for leap years?", a: "Yes — JavaScript date math handles leap years correctly." },
        { q: "Can I share the result?", a: "Yes — copy the result text and share anywhere." },
      ]}>
      <div className="max-w-sm"><Label>Date of birth</Label><Input type="date" value={dob} onChange={e => setDob(e.target.value)} /></div>
      <div className="mt-6 rounded-lg gradient-primary p-6 text-primary-foreground">
        <div className="text-sm opacity-90">You are</div>
        <div className="text-3xl font-bold">{r.years}y {r.months}m {r.days}d</div>
        <div className="text-sm opacity-90 mt-1">{r.totalDays.toLocaleString()} days total</div>
      </div>
    </ToolPageLayout>
  );
}
