import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { ResultActions } from "@/components/ResultActions";

export default function Base64EncoderDecoder() {
  const tool = getToolBySlug("base64-encoder-decoder")!;
  const [t, setT] = useState("Hello ToolsHub");
  let enc = "", dec = "";
  try { enc = btoa(unescape(encodeURIComponent(t))); } catch { enc = "Error"; }
  try { dec = decodeURIComponent(escape(atob(t))); } catch { dec = "Invalid Base64"; }
  return (
    <ToolPageLayout tool={tool}
      example={<>"Hello" → "SGVsbG8="</>}
      faq={[
        { q: "What is Base64?", a: "An encoding that represents binary data using 64 ASCII characters." },
        { q: "Is it encryption?", a: "No — it's encoding, easily reversed. Don't use for secrets." },
        { q: "Does it support Unicode?", a: "Yes — we encode UTF-8 first to support all characters." },
      ]}>
      <Textarea rows={4} value={t} onChange={e => setT(e.target.value)} />
      <Tabs defaultValue="enc" className="mt-4">
        <TabsList><TabsTrigger value="enc">Encode</TabsTrigger><TabsTrigger value="dec">Decode</TabsTrigger></TabsList>
        <TabsContent value="enc"><div className="rounded-lg bg-secondary p-4 font-mono text-sm break-all">{enc}</div><div className="mt-3"><ResultActions value={enc} /></div></TabsContent>
        <TabsContent value="dec"><div className="rounded-lg bg-secondary p-4 font-mono text-sm break-all">{dec}</div><div className="mt-3"><ResultActions value={dec} /></div></TabsContent>
      </Tabs>
    </ToolPageLayout>
  );
}
