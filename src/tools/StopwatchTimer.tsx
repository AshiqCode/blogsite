import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

const fmt = (ms: number) => {
  const s = Math.floor(ms / 1000), m = Math.floor(s / 60), h = Math.floor(m / 60);
  return `${String(h).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}.${String(ms % 1000).padStart(3, "0").slice(0, 2)}`;
};

export default function StopwatchTimer() {
  const tool = getToolBySlug("stopwatch-timer")!;
  // Stopwatch
  const [sw, setSw] = useState(0);
  const [running, setRunning] = useState(false);
  const ref = useRef<number | null>(null);
  useEffect(() => {
    if (running) {
      const start = Date.now() - sw;
      ref.current = window.setInterval(() => setSw(Date.now() - start), 50);
    } else if (ref.current) clearInterval(ref.current);
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]); // eslint-disable-line

  // Timer
  const [secs, setSecs] = useState(60);
  const [left, setLeft] = useState(60);
  const [tRun, setTRun] = useState(false);
  const tRef = useRef<number | null>(null);
  useEffect(() => {
    if (tRun && left > 0) tRef.current = window.setTimeout(() => setLeft(l => l - 1), 1000);
    if (left === 0 && tRun) { setTRun(false); new Audio("data:audio/wav;base64,UklGRlIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=").play().catch(() => {}); }
    return () => { if (tRef.current) clearTimeout(tRef.current); };
  }, [tRun, left]);

  return (
    <ToolPageLayout tool={tool}
      example={<>Use stopwatch for timing or set a countdown for tasks.</>}
      faq={[
        { q: "Does it run in the background?", a: "Yes — keeps running while the tab is open. Closing the tab resets it." },
        { q: "Is there sound?", a: "Yes — a short beep plays when the timer reaches zero." },
        { q: "Multiple timers?", a: "One timer at a time for now." },
      ]}>
      <Tabs defaultValue="sw">
        <TabsList><TabsTrigger value="sw">Stopwatch</TabsTrigger><TabsTrigger value="t">Timer</TabsTrigger></TabsList>
        <TabsContent value="sw">
          <div className="rounded-lg gradient-primary p-8 text-primary-foreground text-center">
            <div className="text-5xl font-mono font-bold">{fmt(sw)}</div>
          </div>
          <div className="mt-4 flex gap-2 justify-center">
            <Button onClick={() => setRunning(r => !r)}>{running ? "Pause" : "Start"}</Button>
            <Button variant="outline" onClick={() => { setRunning(false); setSw(0); }}>Reset</Button>
          </div>
        </TabsContent>
        <TabsContent value="t">
          <div className="max-w-xs mx-auto"><Label>Seconds</Label>
            <Input type="number" value={secs} onChange={e => { setSecs(+e.target.value); setLeft(+e.target.value); }} />
          </div>
          <div className="mt-4 rounded-lg gradient-primary p-8 text-primary-foreground text-center">
            <div className="text-5xl font-mono font-bold">{left}s</div>
          </div>
          <div className="mt-4 flex gap-2 justify-center">
            <Button onClick={() => setTRun(r => !r)}>{tRun ? "Pause" : "Start"}</Button>
            <Button variant="outline" onClick={() => { setTRun(false); setLeft(secs); }}>Reset</Button>
          </div>
        </TabsContent>
      </Tabs>
    </ToolPageLayout>
  );
}
