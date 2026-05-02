import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { ResultActions } from "@/components/ResultActions";

export default function CalorieCalculator() {
  const tool = getToolBySlug("calorie-calculator")!;
  const [age, setAge] = useState("30");
  const [sex, setSex] = useState("male");
  const [h, setH] = useState("170");
  const [w, setW] = useState("70");
  const [act, setAct] = useState("1.55");
  const bmr = sex === "male"
    ? 10 * +w + 6.25 * +h - 5 * +age + 5
    : 10 * +w + 6.25 * +h - 5 * +age - 161;
  const tdee = Math.round(bmr * +act);

  return (
    <ToolPageLayout tool={tool}
      example={<>30-year-old male, 170 cm, 70 kg, moderately active ≈ 2,540 kcal/day.</>}
      faq={[
        { q: "What is TDEE?", a: "Total Daily Energy Expenditure is the calories your body burns each day including activity." },
        { q: "Which formula is used?", a: "We use the Mifflin–St Jeor equation, considered the most accurate for healthy adults." },
        { q: "How do I lose weight?", a: "Eat 300–500 kcal below your TDEE for steady, sustainable weight loss." },
      ]}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><Label>Age</Label><Input type="number" value={age} onChange={e => setAge(e.target.value)} /></div>
        <div><Label>Sex</Label>
          <Select value={sex} onValueChange={setSex}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label>Height (cm)</Label><Input type="number" value={h} onChange={e => setH(e.target.value)} /></div>
        <div><Label>Weight (kg)</Label><Input type="number" value={w} onChange={e => setW(e.target.value)} /></div>
        <div className="sm:col-span-2"><Label>Activity Level</Label>
          <Select value={act} onValueChange={setAct}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1.2">Sedentary</SelectItem>
              <SelectItem value="1.375">Lightly active</SelectItem>
              <SelectItem value="1.55">Moderately active</SelectItem>
              <SelectItem value="1.725">Very active</SelectItem>
              <SelectItem value="1.9">Extra active</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-6 rounded-lg gradient-primary p-6 text-primary-foreground">
        <div className="text-sm opacity-90">Estimated daily calories</div>
        <div className="text-4xl font-bold">{tdee.toLocaleString()} kcal</div>
        <div className="text-sm opacity-90 mt-1">BMR: {Math.round(bmr)} kcal</div>
      </div>
      <div className="mt-4"><ResultActions value={`TDEE: ${tdee} kcal/day`} /></div>
    </ToolPageLayout>
  );
}
