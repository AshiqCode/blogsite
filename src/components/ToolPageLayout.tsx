import { type ReactNode } from "react";
import { Seo } from "@/components/Seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdSlot } from "@/components/AdSlot";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { ToolCard } from "@/components/ToolCard";
import { getRelatedTools, type Tool } from "@/lib/tools-registry";

interface ToolPageLayoutProps {
  tool: Tool;
  example?: ReactNode;
  faq: FaqItem[];
  children: ReactNode;
}

export const ToolPageLayout = ({ tool, example, faq, children }: ToolPageLayoutProps) => {
  const related = getRelatedTools(tool);
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    description: tool.description,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any (web-based)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    mainEntity: {
      "@type": "FAQPage",
      mainEntity: faq.map(f => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a }
      }))
    }
  };

  return (
    <>
      <Seo
        title={`${tool.title} – Free Online Tool | ToolsHub`}
        description={tool.description}
        path={`/tools/${tool.slug}`}
        schema={schema}
      />
      <div className="container py-8 max-w-5xl">
        <Breadcrumbs items={[
          { label: tool.category, to: `/category/${tool.category.toLowerCase().replace(/\s+/g, "-")}` },
          { label: tool.title }
        ]} />

        <header className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary text-primary-foreground text-xl shadow-glow">
              {tool.icon}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold">{tool.title}</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">{tool.description}</p>
        </header>

        <AdSlot label="Ad space — top banner" className="mb-6" />

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <main className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              {children}
            </div>

            {example && (
              <section className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-xl font-semibold mb-3">Example Usage</h2>
                <div className="text-sm text-muted-foreground">{example}</div>
              </section>
            )}

            <AdSlot label="Ad space — in-content" />

            <FaqSection items={faq} />
          </main>

          <aside className="space-y-6">
            <AdSlot label="Sidebar ad" />
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold mb-3 text-sm">Related Tools</h3>
              <ul className="space-y-2 text-sm">
                {related.map(t => (
                  <li key={t.slug}>
                    <a href={`/tools/${t.slug}`} className="text-muted-foreground hover:text-primary transition-base flex items-center gap-2">
                      <span>{t.icon}</span> {t.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-4">More {tool.category} Tools</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map(t => <ToolCard key={t.slug} tool={t} />)}
            </div>
          </section>
        )}
      </div>
    </>
  );
};
