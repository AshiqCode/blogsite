import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { ResultActions } from "@/components/ResultActions";

export default function TextReverser() {
  const tool = getToolBySlug("text-reverser")!;
  const [t, setT] = useState("Hello World");
  const chars = t.split("").reverse().join("");
  const words = t.split(/\s+/).reverse().join(" ");
  return (
    <ToolPageLayout tool={tool}
      example={<>"Hello World" → "dlroW olleH" or "World Hello".</>}
      faq={[
        { q: "What's the difference?", a: "Character reversal flips every character; word reversal keeps words intact but reverses their order." },
        { q: "Does it support emoji?", a: "Mostly — some compound emoji may render differently after reversal." },
        { q: "Can I reverse paragraphs?", a: "Yes — multi-line input is supported." },
      ]}>
      <Textarea rows={5} value={t} onChange={e => setT(e.target.value)} />
      <Tabs defaultValue="chars" className="mt-6">
        <TabsList><TabsTrigger value="chars">Reverse characters</TabsTrigger><TabsTrigger value="words">Reverse words</TabsTrigger></TabsList>
        <TabsContent value="chars">
          <div className="rounded-lg bg-secondary p-4 font-mono break-all">{chars}</div>
          <div className="mt-3"><ResultActions value={chars} /></div>
        </TabsContent>
        <TabsContent value="words">
          <div className="rounded-lg bg-secondary p-4 font-mono break-all">{words}</div>
          <div className="mt-3"><ResultActions value={words} /></div>
        </TabsContent>
      </Tabs>
    </ToolPageLayout>
  );
}
