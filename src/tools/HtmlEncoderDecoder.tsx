import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { ResultActions } from "@/components/ResultActions";

export default function HtmlEncoderDecoder() {
  const tool = getToolBySlug("html-encoder-decoder")!;
  const [t, setT] = useState('<div class="hi">Hello & welcome</div>');
  const enc = t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const dec = (() => { const d = document.createElement("textarea"); d.innerHTML = t; return d.value; })();
  return (
    <ToolPageLayout tool={tool}
      example={<>{`<div> → &lt;div&gt;`}</>}
      faq={[
        { q: "When do I need HTML encoding?", a: "When displaying user content as text inside HTML to prevent XSS." },
        { q: "Which entities are encoded?", a: "& < > \" and ' — the standard set." },
        { q: "Does it decode named entities?", a: "Yes — uses the browser to decode any valid HTML entity." },
      ]}>
      <Textarea rows={4} value={t} onChange={e => setT(e.target.value)} className="font-mono text-sm" />
      <Tabs defaultValue="enc" className="mt-4">
        <TabsList><TabsTrigger value="enc">Encode</TabsTrigger><TabsTrigger value="dec">Decode</TabsTrigger></TabsList>
        <TabsContent value="enc"><pre className="rounded-lg bg-secondary p-4 text-sm whitespace-pre-wrap break-all">{enc}</pre><div className="mt-3"><ResultActions value={enc} /></div></TabsContent>
        <TabsContent value="dec"><pre className="rounded-lg bg-secondary p-4 text-sm whitespace-pre-wrap break-all">{dec}</pre><div className="mt-3"><ResultActions value={dec} /></div></TabsContent>
      </Tabs>
    </ToolPageLayout>
  );
}
