import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

const decodePart = (s: string) => {
  try { return JSON.stringify(JSON.parse(atob(s.replace(/-/g, "+").replace(/_/g, "/"))), null, 2); }
  catch { return "Invalid"; }
};

export default function JwtDecoder() {
  const tool = getToolBySlug("jwt-decoder")!;
  const [t, setT] = useState("eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiVG9vbHNIdWIifQ.signature");
  const parts = t.split(".");
  const header = parts[0] ? decodePart(parts[0]) : "—";
  const payload = parts[1] ? decodePart(parts[1]) : "—";
  return (
    <ToolPageLayout tool={tool}
      example={<>Paste a JWT to inspect its header and payload — signature is not verified.</>}
      faq={[
        { q: "Does it verify the signature?", a: "No — verification requires the secret/key. This tool only decodes." },
        { q: "Is the token sent anywhere?", a: "No — decoding happens in your browser." },
        { q: "What's a JWT?", a: "JSON Web Token — a compact, self-contained way to transmit signed claims." },
      ]}>
      <Textarea rows={4} value={t} onChange={e => setT(e.target.value)} className="font-mono text-xs" />
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div><div className="text-xs font-semibold mb-1">Header</div><pre className="rounded-lg bg-secondary p-4 text-xs">{header}</pre></div>
        <div><div className="text-xs font-semibold mb-1">Payload</div><pre className="rounded-lg bg-secondary p-4 text-xs">{payload}</pre></div>
      </div>
    </ToolPageLayout>
  );
}
