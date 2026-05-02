import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";
import { ResultActions } from "@/components/ResultActions";

const sets = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  num: "0123456789",
  sym: "!@#$%^&*()-_=+[]{};:,.<>?",
};

export default function PasswordGenerator() {
  const tool = getToolBySlug("password-generator")!;
  const [len, setLen] = useState(16);
  const [u, setU] = useState(true), [l, setL] = useState(true), [n, setN] = useState(true), [s, setS] = useState(true);
  const [out, setOut] = useState("");
  const gen = () => {
    const pool = (u ? sets.upper : "") + (l ? sets.lower : "") + (n ? sets.num : "") + (s ? sets.sym : "");
    if (!pool) return setOut("");
    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    setOut(Array.from(arr, x => pool[x % pool.length]).join(""));
  };
  return (
    <ToolPageLayout tool={tool}
      example={<>16 chars with upper, lower, numbers and symbols — strong passwords for any account.</>}
      faq={[
        { q: "Is it secure?", a: "Yes — uses the browser's secure crypto.getRandomValues for randomness." },
        { q: "Length recommendation?", a: "16+ characters with mixed types is recommended for strong passwords." },
        { q: "Do you store passwords?", a: "No — generation happens locally and nothing is sent anywhere." },
      ]}>
      <div className="space-y-4">
        <div><Label>Length: {len}</Label><Slider value={[len]} onValueChange={([v]) => setLen(v)} min={6} max={64} /></div>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center justify-between rounded-lg border border-border p-3"><span>Uppercase</span><Switch checked={u} onCheckedChange={setU} /></label>
          <label className="flex items-center justify-between rounded-lg border border-border p-3"><span>Lowercase</span><Switch checked={l} onCheckedChange={setL} /></label>
          <label className="flex items-center justify-between rounded-lg border border-border p-3"><span>Numbers</span><Switch checked={n} onCheckedChange={setN} /></label>
          <label className="flex items-center justify-between rounded-lg border border-border p-3"><span>Symbols</span><Switch checked={s} onCheckedChange={setS} /></label>
        </div>
        <Button onClick={gen} className="w-full">Generate Password</Button>
      </div>
      {out && <>
        <div className="mt-6 rounded-lg gradient-primary p-6 text-primary-foreground font-mono text-lg break-all">{out}</div>
        <div className="mt-3"><ResultActions value={out} /></div>
      </>}
    </ToolPageLayout>
  );
}
