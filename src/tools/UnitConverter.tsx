import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

const units: Record<string, Record<string, number>> = {
  Length: { Meter: 1, Kilometer: 1000, Centimeter: 0.01, Mile: 1609.34, Foot: 0.3048, Inch: 0.0254 },
  Weight: { Kilogram: 1, Gram: 0.001, Pound: 0.453592, Ounce: 0.0283495 },
  Temperature: { Celsius: 1, Fahrenheit: 1, Kelvin: 1 }, // special
};

const convertTemp = (v: number, f: string, t: string) => {
  let c = f === "Celsius" ? v : f === "Fahrenheit" ? (v - 32) * 5 / 9 : v - 273.15;
  return t === "Celsius" ? c : t === "Fahrenheit" ? c * 9 / 5 + 32 : c + 273.15;
};

export default function UnitConverter() {
  const tool = getToolBySlug("unit-converter")!;
  const [cat, setCat] = useState<keyof typeof units>("Length");
  const [v, setV] = useState("1");
  const ks = Object.keys(units[cat]);
  const [from, setFrom] = useState(ks[0]);
  const [to, setTo] = useState(ks[1]);
  const result = cat === "Temperature"
    ? convertTemp(+v, from, to)
    : (+v * units[cat][from]) / units[cat][to];
  return (
    <ToolPageLayout tool={tool}
      example={<>1 mile = 1.609 km. Switch categories for weight or temperature.</>}
      faq={[
        { q: "Which categories are supported?", a: "Length, weight and temperature. More categories coming soon." },
        { q: "Why temperature is special?", a: "Temperature scales aren't linearly proportional and require offset formulas." },
        { q: "Is precision adjustable?", a: "Output uses 6 decimals; trim trailing zeros yourself if needed." },
      ]}>
      <Tabs value={cat} onValueChange={(v) => { setCat(v as keyof typeof units); const k = Object.keys(units[v as keyof typeof units]); setFrom(k[0]); setTo(k[1]); }}>
        <TabsList>{Object.keys(units).map(k => <TabsTrigger key={k} value={k}>{k}</TabsTrigger>)}</TabsList>
        <TabsContent value={cat}>
          <div className="grid sm:grid-cols-3 gap-4 mt-2">
            <div><Label>Value</Label><Input type="number" value={v} onChange={e => setV(e.target.value)} /></div>
            <div><Label>From</Label>
              <Select value={from} onValueChange={setFrom}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{ks.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>To</Label>
              <Select value={to} onValueChange={setTo}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{ks.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-6 rounded-lg gradient-primary p-6 text-primary-foreground">
            <div className="text-sm opacity-90">{v} {from} =</div>
            <div className="text-3xl font-bold">{result.toFixed(6).replace(/\.?0+$/, "")} {to}</div>
          </div>
        </TabsContent>
      </Tabs>
    </ToolPageLayout>
  );
}
