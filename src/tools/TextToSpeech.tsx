import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

export default function TextToSpeech() {
  const tool = getToolBySlug("text-to-speech")!;
  const [t, setT] = useState("Hello, welcome to ToolsHub.");
  const speak = () => {
    const u = new SpeechSynthesisUtterance(t);
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  };
  return (
    <ToolPageLayout tool={tool}
      example={<>Type text and click Speak — uses your device's voices.</>}
      faq={[
        { q: "Which voices are available?", a: "It uses your operating system's installed voices via Web Speech API." },
        { q: "Does it work offline?", a: "Most browsers support offline TTS, depending on installed voices." },
        { q: "Can I download the audio?", a: "Browser TTS doesn't expose audio directly; use a desktop tool to record output." },
      ]}>
      <Textarea rows={6} value={t} onChange={e => setT(e.target.value)} />
      <div className="mt-4 flex gap-2">
        <Button onClick={speak}>Speak</Button>
        <Button variant="outline" onClick={() => speechSynthesis.cancel()}>Stop</Button>
      </div>
    </ToolPageLayout>
  );
}
