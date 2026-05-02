import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

const zones = ["UTC", "America/New_York", "America/Los_Angeles", "Europe/London", "Europe/Berlin", "Asia/Kolkata", "Asia/Tokyo", "Australia/Sydney"];

export default function TimeZoneConverter() {
  const tool = getToolBySlug("time-zone-converter")!;
  const [t, setT] = useState(new Date().toISOString().slice(0, 16));
  const [from, setFrom] = useState("UTC");
  const [to, setTo] = useState("Asia/Tokyo");
  const date = new Date(t + "Z");
  const fromStr = date.toLocaleString("en-US", { timeZone: from });
  const toStr = date.toLocaleString("en-US", { timeZone: to });
  return (
    <ToolPageLayout tool={tool}
      example={<>10:00 UTC → 19:00 Tokyo time.</>}
      faq={[
        { q: "How many time zones are supported?", a: "8 major regions; we'll add more on request." },
        { q: "Daylight saving handled?", a: "Yes — uses your browser's IANA time zone database." },
        { q: "Is the time stored?", a: "No — conversions are local to your browser." },
      ]}>
      <div className="grid sm:grid-cols-3 gap-4">
        <div><Label>Date & time (UTC entered)</Label><Input type="datetime-local" value={t} onChange={e => setT(e.target.value)} /></div>
        <div><Label>From</Label>
          <Select value={from} onValueChange={setFrom}><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{zones.map(z => <SelectItem key={z} value={z}>{z}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div><Label>To</Label>
          <Select value={to} onValueChange={setTo}><SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{zones.map(z => <SelectItem key={z} value={z}>{z}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        <div className="rounded-lg bg-secondary p-5"><div className="text-xs text-muted-foreground">{from}</div><div className="text-lg font-semibold">{fromStr}</div></div>
        <div className="rounded-lg gradient-primary p-5 text-primary-foreground"><div className="text-xs opacity-90">{to}</div><div className="text-lg font-semibold">{toStr}</div></div>
      </div>
    </ToolPageLayout>
  );
}
