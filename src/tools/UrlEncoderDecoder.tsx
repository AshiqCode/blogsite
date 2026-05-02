import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { ResultActions } from "@/components/ResultActions";

export default function UrlEncoderDecoder() {
  const tool = getToolBySlug("url-encoder-decoder")!;
  const [t, setT] = useState("hello world & friends");
  let enc = "", dec = "";
  try { enc = encodeURIComponent(t); } catch { enc = "Error"; }
  try { dec = decodeURIComponent(t); } catch { dec = "Invalid input"; }
  return (
    <ToolPageLayout tool={tool}
      example={<>"hello world" → "hello%20world".</>}
      faq={[
        { q: "When do I encode URLs?", a: "When passing user input as query parameters or paths." },
        { q: "Difference vs encodeURI?", a: "encodeURIComponent escapes more characters, suitable for query values." },
        { q: "Why decode failure?", a: "The string contains invalid percent sequences." },
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
