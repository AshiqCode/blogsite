import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export interface FaqItem { q: string; a: string; }
export const FaqSection = ({ items }: { items: FaqItem[] }) => (
  <section className="mt-12">
    <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
    <Accordion type="single" collapsible className="rounded-xl border border-border bg-card px-4">
      {items.map((it, i) => (
        <AccordionItem key={i} value={`item-${i}`} className="border-border">
          <AccordionTrigger className="text-left font-medium">{it.q}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">{it.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </section>
);
