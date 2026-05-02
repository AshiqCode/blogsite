import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { ResultActions } from "@/components/ResultActions";

export default function RandomNumberGenerator() {
  const tool = getToolBySlug("random-number-generator")!;
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [n, setN] = useState<number | null>(null);
  const gen = () => setN(Math.floor(Math.random() * (+max - +min + 1)) + +min);
  return (
    <ToolPageLayout tool={tool}
      example={<>Range 1–100 → e.g. 42.</>}
      faq={[
        { q: "Is it cryptographically secure?", a: "It uses Math.random which is fine for casual use; not for security or cryptography." },
        { q: "Can min equal max?", a: "Yes — you'll always get that single value." },
        { q: "Are decimals supported?", a: "Currently integers only; future updates will add decimal support." },
      ]}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><Label>Min</Label><Input type="number" value={min} onChange={e => setMin(e.target.value)} /></div>
        <div><Label>Max</Label><Input type="number" value={max} onChange={e => setMax(e.target.value)} /></div>
      </div>
      <Button onClick={gen} className="mt-4">Generate</Button>
      {n !== null && (
        <>
          <div className="mt-6 rounded-lg gradient-primary p-6 text-primary-foreground text-center">
            <div className="text-5xl font-bold">{n}</div>
          </div>
          <div className="mt-4"><ResultActions value={String(n)} /></div>
        </>
      )}
    </ToolPageLayout>
  );
}
