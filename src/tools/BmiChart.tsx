import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

const ranges = [
  { label: "Underweight", range: "< 18.5", color: "bg-blue-500" },
  { label: "Normal", range: "18.5 – 24.9", color: "bg-success" },
  { label: "Overweight", range: "25 – 29.9", color: "bg-yellow-500" },
  { label: "Obese (Class I)", range: "30 – 34.9", color: "bg-orange-500" },
  { label: "Obese (Class II)", range: "35 – 39.9", color: "bg-red-500" },
  { label: "Obese (Class III)", range: "≥ 40", color: "bg-red-700" },
];

export default function BmiChart() {
  const tool = getToolBySlug("bmi-chart")!;
  return (
    <ToolPageLayout tool={tool}
      example={<>BMI 22 falls in the "Normal" range per WHO.</>}
      faq={[
        { q: "Source of these ranges?", a: "World Health Organization (WHO) classification for adults." },
        { q: "Do they apply to children?", a: "No — children use age- and sex-specific percentile charts." },
        { q: "Are they accurate for all ethnicities?", a: "WHO has additional cut-offs for some Asian populations." },
      ]}>
      <div className="space-y-2">
        {ranges.map(r => (
          <div key={r.label} className="flex items-center gap-3 rounded-lg bg-secondary p-4">
            <div className={`h-3 w-3 rounded-full ${r.color}`} />
            <div className="flex-1 font-medium">{r.label}</div>
            <div className="text-muted-foreground font-mono text-sm">{r.range}</div>
          </div>
        ))}
      </div>
    </ToolPageLayout>
  );
}
