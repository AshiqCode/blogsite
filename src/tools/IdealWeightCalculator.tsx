import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

export default function IdealWeightCalculator() {
  const tool = getToolBySlug("ideal-weight-calculator")!;
  const [h, setH] = useState("170");
  const [sex, setSex] = useState("male");
  const inches = +h / 2.54;
  const over5 = Math.max(0, inches - 60);
  const ideal = sex === "male" ? 50 + 2.3 * over5 : 45.5 + 2.3 * over5;
  return (
    <ToolPageLayout tool={tool}
      example={<>A 170 cm male has an ideal weight of about 65.7 kg (Devine formula).</>}
      faq={[
        { q: "Which formula is used?", a: "We use the Devine formula, a widely accepted clinical estimator." },
        { q: "Is ideal weight the same as healthy weight?", a: "No — ideal weight is a clinical reference; healthy ranges depend on body composition and BMI." },
        { q: "Should I aim for the exact number?", a: "Use it as a guide; consult a professional for personal goals." },
      ]}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><Label>Height (cm)</Label><Input type="number" value={h} onChange={e => setH(e.target.value)} /></div>
        <div><Label>Sex</Label>
          <Select value={sex} onValueChange={setSex}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-6 rounded-lg gradient-primary p-6 text-primary-foreground">
        <div className="text-sm opacity-90">Ideal weight</div>
        <div className="text-4xl font-bold">{ideal.toFixed(1)} kg</div>
      </div>
    </ToolPageLayout>
  );
}
