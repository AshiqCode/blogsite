import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const ResultActions = ({ value, label = "Copy" }: { value: string; label?: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Copy failed");
    }
  };
  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ text: value }); } catch {}
    } else copy();
  };
  return (
    <div className="flex gap-2">
      <Button type="button" variant="outline" size="sm" onClick={copy}>
        {copied ? <Check className="h-4 w-4 mr-1.5" /> : <Copy className="h-4 w-4 mr-1.5" />}
        {label}
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={share}>
        <Share2 className="h-4 w-4 mr-1.5" /> Share
      </Button>
    </div>
  );
};
