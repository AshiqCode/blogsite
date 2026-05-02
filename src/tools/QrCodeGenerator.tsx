import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

export default function QrCodeGenerator() {
  const tool = getToolBySlug("qr-code-generator")!;
  const [t, setT] = useState("https://trendscope.site");
  const [url, setUrl] = useState("");
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    QRCode.toDataURL(t || " ", { width: 320, margin: 2 }).then(setUrl).catch(() => setUrl(""));
  }, [t]);

  return (
    <ToolPageLayout tool={tool}
      example={<>Enter a URL or text — instantly get a downloadable QR code.</>}
      faq={[
        { q: "What can I encode?", a: "URLs, plain text, contact info (vCard), Wi-Fi credentials and more." },
        { q: "Is the image free to use?", a: "Yes — QR codes are not copyrighted." },
        { q: "How big is the image?", a: "320×320 PNG, perfect for print or web." },
      ]}>
      <div><Label>Text or URL</Label><Input value={t} onChange={e => setT(e.target.value)} /></div>
      {url && (
        <div className="mt-6 flex flex-col items-center gap-4">
          <img src={url} alt="QR code" width={256} height={256} className="rounded-lg border border-border bg-white p-2" />
          <a ref={ref} href={url} download="qrcode.png" className="hidden">download</a>
          <Button onClick={() => ref.current?.click()}>Download PNG</Button>
        </div>
      )}
    </ToolPageLayout>
  );
}
