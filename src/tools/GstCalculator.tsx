import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

export default function GstCalculator() {
  const tool = getToolBySlug("gst-calculator")!;
  const [amt, setAmt] = useState("1000");
  const [rate, setRate] = useState("18");
  const a = +amt; const r = +rate / 100;
  const addGst = a * r;
  const removeBase = a / (1 + r);
  const removeGst = a - removeBase;
  return (
    <ToolPageLayout tool={tool}
      example={<>$1,000 + 18% GST = $1,180. Removing 18% from $1,180 → base $1,000.</>}
      faq={[
        { q: "What is GST?", a: "Goods and Services Tax — a value-added tax applied on goods and services in many countries." },
        { q: "How do I add GST?", a: "Multiply the base amount by (1 + GST rate). E.g. $100 × 1.18 = $118." },
        { q: "How do I remove GST from a total?", a: "Divide by (1 + GST rate). E.g. $118 / 1.18 = $100." },
      ]}>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div><Label>Amount</Label><Input type="number" value={amt} onChange={e => setAmt(e.target.value)} /></div>
        <div><Label>GST rate (%)</Label><Input type="number" value={rate} onChange={e => setRate(e.target.value)} /></div>
      </div>
      <Tabs defaultValue="add">
        <TabsList><TabsTrigger value="add">Add GST</TabsTrigger><TabsTrigger value="remove">Remove GST</TabsTrigger></TabsList>
        <TabsContent value="add" className="rounded-lg gradient-primary p-6 text-primary-foreground mt-2">
          <div className="text-sm opacity-90">Total (incl. GST)</div>
          <div className="text-3xl font-bold">${(a + addGst).toFixed(2)}</div>
          <div className="text-sm opacity-90 mt-1">GST amount: ${addGst.toFixed(2)}</div>
        </TabsContent>
        <TabsContent value="remove" className="rounded-lg gradient-primary p-6 text-primary-foreground mt-2">
          <div className="text-sm opacity-90">Base (excl. GST)</div>
          <div className="text-3xl font-bold">${removeBase.toFixed(2)}</div>
          <div className="text-sm opacity-90 mt-1">GST amount: ${removeGst.toFixed(2)}</div>
        </TabsContent>
      </Tabs>
    </ToolPageLayout>
  );
}
