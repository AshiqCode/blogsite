import { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Seo } from "@/components/Seo";
import { ToolCard } from "@/components/ToolCard";
import { AdSlot } from "@/components/AdSlot";
import { categories, tools } from "@/lib/tools-registry";

const Index = () => {
  const [params] = useSearchParams();
  const initial = params.get("q") || "";
  const [q, setQ] = useState(initial);

  const filtered = useMemo(() => {
    if (!q.trim()) return tools;
    const needle = q.toLowerCase();
    return tools.filter(t =>
      t.title.toLowerCase().includes(needle) ||
      t.description.toLowerCase().includes(needle) ||
      t.keywords.some(k => k.includes(needle))
    );
  }, [q]);

  const popular = tools.filter(t => t.popular);

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ToolsHub",
    url: "https://trendscope.site",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://trendscope.site/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <Seo
        title="ToolsHub – 50+ Free Online Tools & Calculators"
        description="Free, fast and private online tools: BMI, EMI, JSON formatter, QR code generator, password generator, unit converter and 45+ more."
        path="/"
        schema={schema}
      />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" aria-hidden />
        <div className="container relative py-20 md:py-28 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-4 py-1.5 text-xs font-medium text-muted-foreground">
            ✨ 50+ free tools — no signup required
          </span>
          <h1 className="mt-5 text-4xl md:text-6xl font-bold tracking-tight">
            Every tool you need, <span className="gradient-text">in one place</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Free online calculators, converters and utilities for finance, health, SEO, developers and everyday life. Fast, private and works offline-friendly.
          </p>
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search 50+ tools..."
              className="h-14 pl-12 text-base shadow-elegant"
            />
          </div>
        </div>
      </section>

      <div className="container">
        <AdSlot label="Ad space — homepage banner" className="mb-12" />

        {!q && (
          <section className="mb-16">
            <div className="flex items-end justify-between mb-5">
              <h2 className="text-2xl font-bold">⭐ Popular tools</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {popular.map(t => <ToolCard key={t.slug} tool={t} />)}
            </div>
          </section>
        )}

        {q ? (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-5">{filtered.length} result{filtered.length !== 1 && "s"} for "{q}"</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map(t => <ToolCard key={t.slug} tool={t} />)}
            </div>
          </section>
        ) : (
          categories.map(cat => {
            const items = tools.filter(t => t.category === cat.name);
            if (!items.length) return null;
            return (
              <section key={cat.name} className="mb-16">
                <div className="flex items-end justify-between mb-5">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <span>{cat.icon}</span> {cat.name}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
                  </div>
                  <Link to={`/category/${cat.name.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm text-primary hover:underline">View all →</Link>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {items.slice(0, 4).map(t => <ToolCard key={t.slug} tool={t} />)}
                </div>
              </section>
            );
          })
        )}
      </div>
    </>
  );
};

export default Index;
