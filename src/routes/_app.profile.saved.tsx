import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentCard } from "@/components/cards/ContentCard";
import { CaseCard } from "@/components/cards/CaseCard";
import { useI18n } from "@/i18n/LanguageProvider";
import { articles, caseStudies } from "@/lib/dummy-data";

export const Route = createFileRoute("/_app/profile/saved")({
  head: () => ({ meta: [{ title: "Saved — Sakinah" }] }),
  component: SavedPage,
});

function SavedPage() {
  const { t } = useI18n();
  const arts = articles.filter((a) => a.type === "article");
  const vids = articles.filter((a) => a.type === "video");
  const pdfs = articles.filter((a) => a.type === "pdf");
  return (
    <div className="animate-fade-in space-y-6">
      <Link to="/profile" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t.common.back}
      </Link>
      <h1 className="text-2xl font-bold">{t.profile.savedContent}</h1>
      <Tabs defaultValue="articles">
        <TabsList className="grid w-full grid-cols-4 rounded-full">
          <TabsTrigger value="articles" className="rounded-full">{t.knowledge.filters.articles}</TabsTrigger>
          <TabsTrigger value="videos" className="rounded-full">{t.knowledge.filters.videos}</TabsTrigger>
          <TabsTrigger value="pdfs" className="rounded-full">{t.knowledge.filters.pdfs}</TabsTrigger>
          <TabsTrigger value="cases" className="rounded-full">{t.nav.cases}</TabsTrigger>
        </TabsList>
        <TabsContent value="articles" className="mt-4 grid gap-4 sm:grid-cols-2">
          {arts.map((a) => <ContentCard key={a.id} item={a} />)}
        </TabsContent>
        <TabsContent value="videos" className="mt-4 grid gap-4 sm:grid-cols-2">
          {vids.map((a) => <ContentCard key={a.id} item={a} />)}
        </TabsContent>
        <TabsContent value="pdfs" className="mt-4 grid gap-4 sm:grid-cols-2">
          {pdfs.map((a) => <ContentCard key={a.id} item={a} />)}
        </TabsContent>
        <TabsContent value="cases" className="mt-4 grid gap-4 sm:grid-cols-2">
          {caseStudies.map((c) => <CaseCard key={c.id} study={c} />)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
