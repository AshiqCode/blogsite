import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { ResultActions } from "@/components/ResultActions";

export default function HexToRgb() {
  const tool = getToolBySlug("hex-to-rgb")!;
  const [hex, setHex] = useState("#3b82f6");
  const m = hex.replace("#", "").match(/^([0-9a-f]{6}|[0-9a-f]{3})$/i);
  let r=0, g=0, b=0, ok = false;
  if (m) {
    let h = m[1]; if (h.length === 3) h = h.split("").map(c => c + c).join("");
    r = parseInt(h.slice(0,2),16); g = parseInt(h.slice(2,4),16); b = parseInt(h.slice(4,6),16); ok = true;
  }
  const rgb = ok ? `rgb(${r}, ${g}, ${b})` : "Invalid";
  return (
    <ToolPageLayout tool={tool}
      example={<>#3b82f6 → rgb(59, 130, 246)</>}
      faq={[
        { q: "Are 3-digit hex codes supported?", a: "Yes — short forms like #f0a expand to #ff00aa." },
        { q: "Does it support alpha?", a: "Not yet — RGB only. RGBA support coming soon." },
        { q: "Case sensitive?", a: "No — uppercase or lowercase hex both work." },
      ]}>
      <div className="grid sm:grid-cols-2 gap-4 items-end">
        <div><Label>HEX</Label><Input value={hex} onChange={e => setHex(e.target.value)} className="font-mono" /></div>
        <div className="h-12 rounded-lg border border-border" style={{ background: ok ? hex : "transparent" }} />
      </div>
      <div className="mt-6 rounded-lg gradient-primary p-6 text-primary-foreground">
        <div className="text-sm opacity-90">RGB</div>
        <div className="text-2xl font-bold font-mono">{rgb}</div>
      </div>
      <div className="mt-3"><ResultActions value={rgb} /></div>
    </ToolPageLayout>
  );
}
