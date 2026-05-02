import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { getToolBySlug } from "@/lib/tools-registry";

// Lightweight markdown -> HTML (basic)
const md = (s: string) => s
  .replace(/^### (.*)$/gm, "<h3>$1</h3>")
  .replace(/^## (.*)$/gm, "<h2>$1</h2>")
  .replace(/^# (.*)$/gm, "<h1>$1</h1>")
  .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  .replace(/\*(.+?)\*/g, "<em>$1</em>")
  .replace(/`(.+?)`/g, "<code>$1</code>")
  .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
  .replace(/\n\n/g, "</p><p>")
  .replace(/\n/g, "<br/>");

export default function MarkdownPreviewer() {
  const tool = getToolBySlug("markdown-previewer")!;
  const [t, setT] = useState("# Hello\n\nThis is **markdown** with `code` and a [link](https://example.com).");
  return (
    <ToolPageLayout tool={tool}
      example={<>Type markdown on the left, see HTML preview on the right.</>}
      faq={[
        { q: "Which features are supported?", a: "Headings, bold, italic, inline code, links and paragraphs." },
        { q: "Is GitHub-flavored markdown supported?", a: "Tables and code blocks are simplified; for full GFM, use a dedicated editor." },
        { q: "Is the output safe?", a: "Use only trusted markdown — HTML is rendered as-is for previewing." },
      ]}>
      <div className="grid md:grid-cols-2 gap-4">
        <Textarea rows={14} value={t} onChange={e => setT(e.target.value)} className="font-mono" />
        <div className="rounded-lg border border-border bg-card p-4 prose prose-sm max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: "<p>" + md(t) + "</p>" }} />
      </div>
    </ToolPageLayout>
  );
}
