import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { GradientThumb } from "@/components/ui/gradient-thumb";
import { ContentCard } from "@/components/cards/ContentCard";
import { useI18n } from "@/i18n/LanguageProvider";
import { sectionOrder } from "@/lib/app-types";
import { useContent } from "@/lib/queries";

export const Route = createFileRoute("/_app/knowledge/")({
  head: () => ({
    meta: [
      { title: "Knowledge Base — Sakinah" },
      { name: "description", content: "Curated family guidance across five living sections." },
    ],
  }),
  component: KnowledgeIndex,
});

function KnowledgeIndex() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const { data: articles = [] } = useContent(undefined, undefined, search);
  return (
    <div className="animate-fade-in space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">{t.knowledge.title}</h1>
        <p className="text-sm text-muted-foreground">{t.knowledge.subtitle}</p>
      </header>

      <div className="relative">
        <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t.common.search} className="h-12 rounded-full ps-11" />
      </div>

      <section className="grid gap-3 sm:grid-cols-2">
        {sectionOrder.map((key, i) => {
          const count = articles.filter((a) => a.section === key).length;
          return (
            <Link
              key={key}
              to="/knowledge/$section"
              params={{ section: key }}
              className="group relative flex items-center gap-4 overflow-hidden rounded-3xl border border-border/60 bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-soft"
            >
              <GradientThumb hue={200 + i * 30} className="h-16 w-16 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{t.knowledge.sections[key]}</p>
                <p className="text-xs text-muted-foreground">{count} {t.knowledge.filters.all.toLowerCase()}</p>
              </div>
              <span aria-hidden className="text-lg text-muted-foreground rtl:rotate-180">→</span>
            </Link>
          );
        })}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t.home.featured}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {articles.slice(0, 4).map((a) => <ContentCard key={a.id} item={a} />)}
        </div>
      </section>
    </div>
  );
}
