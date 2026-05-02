import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { ResultActions } from "@/components/ResultActions";

export default function UuidGenerator() {
  const tool = getToolBySlug("uuid-generator")!;
  const [list, setList] = useState<string[]>([crypto.randomUUID()]);
  const gen = (n: number) => setList(Array.from({ length: n }, () => crypto.randomUUID()));
  return (
    <ToolPageLayout tool={tool}
      example={<>e.g. 3f50b3a1-91b5-4d3a-9b66-2c9b5b1df82e</>}
      faq={[
        { q: "What's a UUID v4?", a: "A 128-bit randomly generated identifier with extremely low collision probability." },
        { q: "Are they cryptographically random?", a: "Yes — generated with crypto.randomUUID()." },
        { q: "How many can I generate?", a: "Up to 100 at a time here." },
      ]}>
      <div className="flex gap-2">
        <Button onClick={() => gen(1)}>1</Button>
        <Button onClick={() => gen(10)} variant="outline">10</Button>
        <Button onClick={() => gen(100)} variant="outline">100</Button>
      </div>
      <pre className="mt-4 rounded-lg bg-secondary p-4 text-sm font-mono max-h-72 overflow-auto">{list.join("\n")}</pre>
      <div className="mt-3"><ResultActions value={list.join("\n")} /></div>
    </ToolPageLayout>
  );
}
