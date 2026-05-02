import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

export default function WaterIntakeCalculator() {
  const tool = getToolBySlug("water-intake-calculator")!;
  const [w, setW] = useState("70");
  const liters = (+w * 0.033).toFixed(2);
  return (
    <ToolPageLayout tool={tool}
      example={<>A 70 kg person should drink about 2.31 L of water daily.</>}
      faq={[
        { q: "How is water intake calculated?", a: "A common rule is 33 ml of water per kg of body weight per day." },
        { q: "Does this include all drinks?", a: "Yes — water, tea, coffee, milk and water-rich foods all contribute." },
        { q: "Should athletes drink more?", a: "Yes, add 500–1000 ml for every hour of intense activity." },
      ]}>
      <div><Label>Weight (kg)</Label><Input type="number" value={w} onChange={e => setW(e.target.value)} /></div>
      <div className="mt-6 rounded-lg gradient-primary p-6 text-primary-foreground">
        <div className="text-sm opacity-90">Recommended daily intake</div>
        <div className="text-4xl font-bold">{liters} L</div>
      </div>
    </ToolPageLayout>
  );
}
