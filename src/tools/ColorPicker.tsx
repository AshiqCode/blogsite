import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { ResultActions } from "@/components/ResultActions";

const hexToHsl = (hex: string) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let H = 0, S = 0; const L = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    S = L > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: H = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: H = ((b - r) / d + 2); break;
      case b: H = ((r - g) / d + 4); break;
    }
    H *= 60;
  }
  return { H: Math.round(H), S: Math.round(S * 100), L: Math.round(L * 100) };
};

export default function ColorPicker() {
  const tool = getToolBySlug("color-picker")!;
  const [c, setC] = useState("#6366f1");
  const r = parseInt(c.slice(1, 3), 16), g = parseInt(c.slice(3, 5), 16), b = parseInt(c.slice(5, 7), 16);
  const { H, S, L } = hexToHsl(c);
  return (
    <ToolPageLayout tool={tool}
      example={<>Pick any color and copy HEX, RGB, or HSL values.</>}
      faq={[
        { q: "Difference between RGB and HSL?", a: "RGB uses red/green/blue channels; HSL uses hue/saturation/lightness — easier for human reasoning." },
        { q: "Can I save palettes?", a: "Use copy/share for now; palette saving is coming soon." },
        { q: "Is the picker accessible?", a: "Yes — uses the native browser color picker." },
      ]}>
      <div className="flex items-center gap-4">
        <Input type="color" value={c} onChange={e => setC(e.target.value)} className="h-16 w-24 cursor-pointer p-1" />
        <div className="flex-1">
          <Label>HEX</Label>
          <Input value={c} onChange={e => setC(e.target.value)} className="font-mono uppercase" />
        </div>
      </div>
      <div className="mt-6 grid sm:grid-cols-3 gap-3">
        <div className="rounded-lg bg-secondary p-4"><div className="text-xs text-muted-foreground">RGB</div><div className="font-mono">rgb({r}, {g}, {b})</div></div>
        <div className="rounded-lg bg-secondary p-4"><div className="text-xs text-muted-foreground">HSL</div><div className="font-mono">hsl({H}, {S}%, {L}%)</div></div>
        <div className="rounded-lg p-4 text-white font-bold flex items-center justify-center" style={{ background: c }}>Preview</div>
      </div>
      <div className="mt-3"><ResultActions value={`HEX: ${c}, RGB: rgb(${r}, ${g}, ${b}), HSL: hsl(${H}, ${S}%, ${L}%)`} /></div>
    </ToolPageLayout>
  );
}
