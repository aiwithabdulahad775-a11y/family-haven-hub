import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, Play, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ContentCard } from "@/components/cards/ContentCard";
import { CaseCard } from "@/components/cards/CaseCard";
import { GradientThumb } from "@/components/ui/gradient-thumb";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/i18n/LanguageProvider";
import { sectionOrder } from "@/lib/dummy-data";
import { useContent, useCases } from "@/lib/queries";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Sakinah — Home" },
      { name: "description", content: "A calm, bilingual home for family knowledge, stories, and counseling." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { t, lang } = useI18n();
  const articlesQ = useContent();
  const casesQ = useCases();
  const articles = articlesQ.data ?? [];
  const videos = articles.filter((a) => a.type === "video");
  const pdfs = articles.filter((a) => a.type === "pdf");
  const featuredCases = (casesQ.data ?? []).slice(0, 2);
  return (
    <div className="animate-fade-in space-y-10">
      <section className="bg-hero-gradient relative overflow-hidden rounded-3xl border border-border/60 p-6 shadow-soft sm:p-10">
        <Badge variant="secondary" className="mb-4 bg-white/60 text-primary backdrop-blur">
          <Sparkles className="me-1 h-3.5 w-3.5" /> {t.tagline}
        </Badge>
        <h1 className="max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {t.home.heroTitle}
        </h1>
        <p className="mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
          {t.home.heroSubtitle}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full">
            <Link to="/knowledge">
              {t.home.heroCta} <ArrowRight className="ms-1 h-4 w-4 rtl:rotate-180" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full">
            <Link to="/counseling">{t.nav.counseling}</Link>
          </Button>
        </div>
      </section>

      <section>
        <label htmlFor="home-search" className="sr-only">{t.common.search}</label>
        <div className="relative">
          <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="home-search" placeholder={t.common.search} className="h-12 rounded-full ps-11" />
        </div>
      </section>

      <Section title={t.home.categories}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {sectionOrder.map((key, i) => (
            <Link
              key={key}
              to="/knowledge/$section"
              params={{ section: key }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-soft"
            >
              <GradientThumb hue={200 + i * 30} className="absolute inset-0 opacity-20" />
              <span className="relative text-xs font-medium text-muted-foreground">0{i + 1}</span>
              <span className="relative mt-6 text-sm font-semibold">{t.knowledge.sections[key]}</span>
            </Link>
          ))}
        </div>
      </Section>

      <Section title={t.home.featured} action={{ to: "/knowledge", label: t.common.seeAll }}>
        {articlesQ.isLoading ? (
          <SkelRow />
        ) : (
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
            {articles.slice(0, 5).map((a) => (
              <div key={a.id} className="snap-start">
                <ContentCard item={a} compact />
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title={t.home.videos} action={{ to: "/knowledge", label: t.common.seeAll }}>
        <div className="grid gap-4 sm:grid-cols-2">
          {videos.map((v) => <ContentCard key={v.id} item={v} />)}
        </div>
      </Section>

      <Section title={t.home.cases} action={{ to: "/case-studies", label: t.common.seeAll }}>
        <div className="grid gap-4 sm:grid-cols-2">
          {featuredCases.map((c) => <CaseCard key={c.id} study={c} />)}
        </div>
      </Section>

      <Section title={t.home.pdfs}>
        <div className="grid gap-3 sm:grid-cols-2">
          {pdfs.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-sm transition-all hover:shadow-soft">
              <GradientThumb hue={p.hue} className="h-14 w-14 shrink-0">
                <FileText className="absolute inset-0 m-auto h-6 w-6 text-white" />
              </GradientThumb>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.title[lang]}</p>
                <p className="truncate text-xs text-muted-foreground">PDF · {p.minutes} {t.common.minutes}</p>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full">
                <Play className="me-1 h-4 w-4" /> Open
              </Button>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t.home.recent}>
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2">
          {articles.slice().reverse().map((a) => (
            <div key={a.id} className="snap-start">
              <ContentCard item={a} compact />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function SkelRow() {
  return (
    <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
      {[0, 1, 2].map((i) => <Skeleton key={i} className="h-56 w-60 shrink-0 rounded-3xl" />)}
    </div>
  );
}

function Section({ title, action, children }: { title: string; action?: { to: string; label: string }; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action && <Link to={action.to} className="text-sm font-medium text-primary hover:underline">{action.label}</Link>}
      </div>
      {children}
    </section>
  );
}
