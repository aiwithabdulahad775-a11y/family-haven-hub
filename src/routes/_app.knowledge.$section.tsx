import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ContentCard } from "@/components/cards/ContentCard";
import { useI18n } from "@/i18n/LanguageProvider";
import { sectionOrder, type SectionKey } from "@/lib/app-types";
import { useContent } from "@/lib/queries";

export const Route = createFileRoute("/_app/knowledge/$section")({
  parseParams: (p) => {
    const section = p.section as SectionKey;
    if (!sectionOrder.includes(section)) throw notFound();
    return { section };
  },
  head: () => ({ meta: [{ title: "Knowledge — Sakinah" }] }),
  component: SectionPage,
});

const filters = ["all", "articles", "videos", "pdfs"] as const;

function SectionPage() {
  const { section } = Route.useParams() as { section: SectionKey };
  const { t } = useI18n();
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");
  const { data: all = [] } = useContent(section);
  const items = all.filter((a) => {
    if (filter === "all") return true;
    if (filter === "articles") return a.type === "article";
    if (filter === "videos") return a.type === "video";
    if (filter === "pdfs") return a.type === "pdf";
    return true;
  });

  return (
    <div className="animate-fade-in space-y-6">
      <Link to="/knowledge" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t.common.back}
      </Link>
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">{t.knowledge.sections[section]}</h1>
        <p className="text-sm text-muted-foreground">{t.knowledge.subtitle}</p>
      </header>

      <div className="relative">
        <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={t.common.search} className="h-11 rounded-full ps-11" />
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4">
        {filters.map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" className="rounded-full" onClick={() => setFilter(f)}>
            {t.knowledge.filters[f]}
          </Button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">{t.common.empty}</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((a) => <ContentCard key={a.id} item={a} />)}
        </div>
      )}
    </div>
  );
}
