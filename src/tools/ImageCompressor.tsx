import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

export default function ImageCompressor() {
  const tool = getToolBySlug("image-compressor")!;
  const [quality, setQuality] = useState(0.7);
  const [original, setOriginal] = useState<{ url: string; size: number; name: string } | null>(null);
  const [compressed, setCompressed] = useState<{ url: string; size: number } | null>(null);

  const onFile = async (f: File) => {
    const url = URL.createObjectURL(f);
    setOriginal({ url, size: f.size, name: f.name });
    const img = new Image();
    img.src = url;
    await new Promise(r => img.onload = r);
    const canvas = document.createElement("canvas");
    canvas.width = img.width; canvas.height = img.height;
    canvas.getContext("2d")!.drawImage(img, 0, 0);
    canvas.toBlob(b => {
      if (b) setCompressed({ url: URL.createObjectURL(b), size: b.size });
    }, "image/jpeg", quality);
  };

  const reCompress = async () => {
    if (!original) return;
    const img = new Image();
    img.src = original.url;
    await new Promise(r => img.onload = r);
    const canvas = document.createElement("canvas");
    canvas.width = img.width; canvas.height = img.height;
    canvas.getContext("2d")!.drawImage(img, 0, 0);
    canvas.toBlob(b => { if (b) setCompressed({ url: URL.createObjectURL(b), size: b.size }); }, "image/jpeg", quality);
  };

  return (
    <ToolPageLayout tool={tool}
      example={<>Upload a JPG/PNG and adjust quality to shrink file size while keeping it sharp.</>}
      faq={[
        { q: "Is my image uploaded?", a: "No — compression happens entirely in your browser." },
        { q: "Output format?", a: "Compressed image is JPEG, ideal for photos." },
        { q: "Lossless option?", a: "JPEG is lossy. For lossless, keep PNG and use a desktop tool." },
      ]}>
      <div><Label>Image file</Label><Input type="file" accept="image/*" onChange={e => e.target.files?.[0] && onFile(e.target.files[0])} /></div>
      <div className="mt-4"><Label>Quality: {Math.round(quality * 100)}%</Label>
        <Slider value={[quality * 100]} onValueChange={([v]) => setQuality(v / 100)} min={10} max={100} />
      </div>
      {original && <Button className="mt-3" onClick={reCompress}>Re-compress with current quality</Button>}
      {original && compressed && (
        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <div className="rounded-lg border border-border p-3">
            <div className="text-xs text-muted-foreground mb-1">Original — {(original.size / 1024).toFixed(1)} KB</div>
            <img src={original.url} alt="original" className="w-full rounded" />
          </div>
          <div className="rounded-lg border border-border p-3">
            <div className="text-xs text-muted-foreground mb-1">Compressed — {(compressed.size / 1024).toFixed(1)} KB ({((1 - compressed.size / original.size) * 100).toFixed(0)}% smaller)</div>
            <img src={compressed.url} alt="compressed" className="w-full rounded" />
            <a href={compressed.url} download={`compressed-${original.name}.jpg`}><Button className="w-full mt-3" size="sm">Download</Button></a>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
