import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { ResultActions } from "@/components/ResultActions";

const SEED = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
export default function LoremIpsumGenerator() {
  const tool = getToolBySlug("lorem-ipsum-generator")!;
  const [n, setN] = useState("3");
  const out = Array.from({ length: Math.max(1, +n) }, () => SEED).join("\n\n");
  return (
    <ToolPageLayout tool={tool}
      example={<>Generate any number of placeholder paragraphs.</>}
      faq={[
        { q: "What is Lorem Ipsum?", a: "A pseudo-Latin filler text used since the 1500s for typesetting and design mockups." },
        { q: "Why use it?", a: "It lets designers focus on layout and visuals without distraction from real copy." },
        { q: "Is it actual Latin?", a: "It's scrambled Latin — no real meaning." },
      ]}>
      <div className="max-w-xs"><Label>Paragraphs</Label><Input type="number" min={1} value={n} onChange={e => setN(e.target.value)} /></div>
      <pre className="mt-6 rounded-lg bg-secondary p-4 text-sm whitespace-pre-wrap">{out}</pre>
      <div className="mt-3"><ResultActions value={out} /></div>
    </ToolPageLayout>
  );
}
