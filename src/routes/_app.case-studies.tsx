import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CaseCard } from "@/components/cards/CaseCard";
import { useI18n } from "@/i18n/LanguageProvider";
import { useCases } from "@/lib/queries";

export const Route = createFileRoute("/_app/case-studies")({
  head: () => ({
    meta: [
      { title: "Case Studies — Sakinah" },
      { name: "description", content: "Real family stories with gentle, practical lessons." },
    ],
  }),
  component: CaseStudiesPage,
});

function CaseStudiesPage() {
  const { t, lang } = useI18n();
  const { data: caseStudies = [] } = useCases();
  const cats = Array.from(new Set(caseStudies.map((c) => c.category[lang])));
  const [active, setActive] = useState<string>("all");
  const filtered = active === "all" ? caseStudies : caseStudies.filter((c) => c.category[lang] === active);
  return (
    <div className="animate-fade-in space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">{t.cases.title}</h1>
        <p className="text-sm text-muted-foreground">{t.cases.subtitle}</p>
      </header>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t.cases.featured}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {caseStudies.slice(0, 2).map((c) => <CaseCard key={c.id} study={c} />)}
        </div>
      </section>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4">
        <Button size="sm" className="rounded-full" variant={active === "all" ? "default" : "outline"} onClick={() => setActive("all")}>
          {t.knowledge.filters.all}
        </Button>
        {cats.map((c) => (
          <Button key={c} size="sm" className="rounded-full" variant={active === c ? "default" : "outline"} onClick={() => setActive(c)}>
            {c}
          </Button>
        ))}
      </div>
      <section className="grid gap-4 sm:grid-cols-2">
        {filtered.map((c) => <CaseCard key={c.id} study={c} />)}
      </section>
    </div>
  );
}
