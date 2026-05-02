import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface Crumb { label: string; to?: string; }
export const Breadcrumbs = ({ items }: { items: Crumb[] }) => (
  <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
    <Link to="/" className="flex items-center gap-1 hover:text-primary transition-base">
      <Home className="h-3.5 w-3.5" />
    </Link>
    {items.map((c, i) => (
      <span key={i} className="flex items-center gap-1.5">
        <ChevronRight className="h-3.5 w-3.5" />
        {c.to ? <Link to={c.to} className="hover:text-primary transition-base">{c.label}</Link> : <span className="text-foreground">{c.label}</span>}
      </span>
    ))}
  </nav>
);
