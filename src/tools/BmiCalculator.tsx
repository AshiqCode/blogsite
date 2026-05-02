import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { ResultActions } from "@/components/ResultActions";

export default function BmiCalculator() {
  const tool = getToolBySlug("bmi-calculator")!;
  const [h, setH] = useState("170");
  const [w, setW] = useState("70");
  const heightM = Number(h) / 100;
  const bmi = heightM > 0 ? Number(w) / (heightM * heightM) : 0;
  const cat = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";

  return (
    <ToolPageLayout
      tool={tool}
      example={<>For 170 cm and 70 kg, BMI ≈ 24.2 (Normal).</>}
      faq={[
        { q: "What is BMI?", a: "Body Mass Index is a value derived from height and weight used to categorize underweight, normal, overweight or obese ranges." },
        { q: "Is BMI accurate for athletes?", a: "BMI may overestimate body fat for muscular individuals; consider body-fat measures alongside it." },
        { q: "What is a healthy BMI range?", a: "The WHO considers 18.5–24.9 a healthy BMI for most adults." },
      ]}
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="h">Height (cm)</Label>
          <Input id="h" type="number" value={h} onChange={(e) => setH(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="w">Weight (kg)</Label>
          <Input id="w" type="number" value={w} onChange={(e) => setW(e.target.value)} />
        </div>
      </div>
      <div className="mt-6 rounded-lg gradient-primary p-6 text-primary-foreground">
        <div className="text-sm opacity-90">Your BMI</div>
        <div className="text-4xl font-bold">{bmi.toFixed(1)}</div>
        <div className="text-sm opacity-90 mt-1">Category: {cat}</div>
      </div>
      <div className="mt-4"><ResultActions value={`BMI: ${bmi.toFixed(1)} (${cat})`} /></div>
    </ToolPageLayout>
  );
}
