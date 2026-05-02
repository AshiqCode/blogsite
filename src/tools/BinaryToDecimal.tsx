import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

export default function BinaryToDecimal() {
  const tool = getToolBySlug("binary-to-decimal")!;
  const [bin, setBin] = useState("1010");
  const [dec, setDec] = useState("10");
  const fromBin = /^[01]+$/.test(bin) ? parseInt(bin, 2) : NaN;
  const fromDec = !isNaN(+dec) ? Number(dec).toString(2) : "—";
  return (
    <ToolPageLayout tool={tool}
      example={<>1010 ↔ 10. Convert in either direction.</>}
      faq={[
        { q: "What is binary?", a: "A base-2 number system using only 0 and 1." },
        { q: "Why is binary used?", a: "Computers represent everything as on/off states (bits)." },
        { q: "What about negatives?", a: "This tool handles unsigned positive numbers only." },
      ]}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><Label>Binary → Decimal</Label><Input value={bin} onChange={e => setBin(e.target.value)} className="font-mono" />
          <div className="mt-3 rounded-lg gradient-primary p-4 text-primary-foreground font-mono">{isNaN(fromBin) ? "Invalid" : fromBin}</div>
        </div>
        <div><Label>Decimal → Binary</Label><Input value={dec} onChange={e => setDec(e.target.value)} type="number" />
          <div className="mt-3 rounded-lg gradient-primary p-4 text-primary-foreground font-mono break-all">{fromDec}</div>
        </div>
      </div>
    </ToolPageLayout>
  );
}
