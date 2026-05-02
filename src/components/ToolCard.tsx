import { Link } from "react-router-dom";
import type { Tool } from "@/lib/tools-registry";

export const ToolCard = ({ tool }: { tool: Tool }) => (
  <Link
    to={`/tools/${tool.slug}`}
    className="group relative flex flex-col gap-2 rounded-xl border border-border bg-card p-5 transition-base hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elegant"
  >
    <div className="flex items-center justify-between">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground text-lg font-semibold">
        {tool.icon}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{tool.category}</span>
    </div>
    <h3 className="font-semibold text-base group-hover:text-primary transition-base">{tool.title}</h3>
    <p className="text-sm text-muted-foreground line-clamp-2">{tool.description}</p>
  </Link>
);
