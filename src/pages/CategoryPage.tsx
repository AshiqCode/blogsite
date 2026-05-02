import { useParams } from "react-router-dom";
import { categories, getToolsByCategory, type Category } from "@/lib/tools-registry";
import { ToolCard } from "@/components/ToolCard";
import { Seo } from "@/components/Seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import NotFound from "./NotFound";

export default function CategoryPage() {
  const { slug = "" } = useParams();
  const cat = categories.find(c => c.name.toLowerCase().replace(/\s+/g, "-") === slug);
  if (!cat) return <NotFound />;
  const items = getToolsByCategory(cat.name as Category);
  return (
    <>
      <Seo title={`${cat.name} Tools – ToolsHub`} description={cat.description} path={`/category/${slug}`} />
      <div className="container py-8">
        <Breadcrumbs items={[{ label: cat.name }]} />
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3"><span>{cat.icon}</span> {cat.name}</h1>
          <p className="text-muted-foreground mt-2">{cat.description}</p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map(t => <ToolCard key={t.slug} tool={t} />)}
        </div>
      </div>
    </>
  );
}
