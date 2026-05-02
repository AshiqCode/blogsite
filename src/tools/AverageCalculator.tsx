import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

export default function AverageCalculator() {
  const tool = getToolBySlug("average-calculator")!;
  const [v, setV] = useState("10, 20, 30, 40, 50");
  const nums = v.split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
  const sum = nums.reduce((a, b) => a + b, 0);
  const mean = nums.length ? sum / nums.length : 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const median = sorted.length ? (sorted.length % 2 ? sorted[(sorted.length - 1) / 2] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2) : 0;
  const counts = nums.reduce<Record<number, number>>((a, n) => (a[n] = (a[n] || 0) + 1, a), {});
  const mode = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  return (
    <ToolPageLayout tool={tool}
      example={<>10, 20, 30, 40, 50 → mean 30, median 30.</>}
      faq={[
        { q: "Difference between mean and median?", a: "Mean is the average; median is the middle value when sorted." },
        { q: "What is mode?", a: "The most frequently occurring value in the dataset." },
        { q: "Input format?", a: "Separate numbers with commas, spaces or newlines." },
      ]}>
      <Label>Numbers</Label>
      <Textarea value={v} onChange={e => setV(e.target.value)} rows={4} />
      <div className="mt-6 grid sm:grid-cols-3 gap-3">
        <div className="rounded-lg gradient-primary p-5 text-primary-foreground"><div className="text-xs opacity-90">Mean</div><div className="text-2xl font-bold">{mean.toFixed(2)}</div></div>
        <div className="rounded-lg bg-secondary p-5"><div className="text-xs text-muted-foreground">Median</div><div className="text-2xl font-bold">{median}</div></div>
        <div className="rounded-lg bg-secondary p-5"><div className="text-xs text-muted-foreground">Mode</div><div className="text-2xl font-bold">{mode}</div></div>
      </div>
    </ToolPageLayout>
  );
}
