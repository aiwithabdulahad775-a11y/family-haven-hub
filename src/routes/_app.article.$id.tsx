import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, FileText, Play, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { mapContent } from "@/lib/mappers";
import { GradientThumb } from "@/components/ui/gradient-thumb";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookmarkButton } from "@/components/BookmarkButton";
import { useI18n } from "@/i18n/LanguageProvider";

const typeIcon = { article: BookOpen, video: Play, pdf: FileText };

export const Route = createFileRoute("/_app/article/$id")({
  head: () => ({ meta: [{ title: "Article — Sakinah" }] }),
  component: ArticlePage,
});

function ArticlePage() {
  const { id } = Route.useParams();
  const { t, lang } = useI18n();
  const { data, isLoading, error } = useQuery({
    queryKey: ["content-item", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("content_items")
        .select("*")
        .eq("id", id)
        .eq("is_published", true)
        .is("deleted_at", null)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return mapContent(data);
    },
  });

  if (isLoading) return <Skeleton className="h-96 w-full rounded-3xl" />;
  if (error || !data) {
    return (
      <div className="animate-fade-in space-y-4">
        <Link to="/knowledge" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t.common.back}
        </Link>
        <div className="rounded-3xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          {t.common.empty}
        </div>
      </div>
    );
  }

  const Icon = typeIcon[data.type];

  return (
    <article className="animate-fade-in space-y-6">
      <Link to="/knowledge" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t.common.back}
      </Link>

      <GradientThumb hue={data.hue} className="aspect-[16/9] rounded-3xl">
        <Badge className="bg-white/25 text-white backdrop-blur">
          <Icon className="me-1 h-3.5 w-3.5" />
          <span className="capitalize">{data.type}</span>
        </Badge>
      </GradientThumb>

      <header className="space-y-2">
        <h1 className="text-2xl font-bold sm:text-3xl">{data.title[lang]}</h1>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {data.minutes} {t.common.minutes}
          </p>
          <BookmarkButton itemId={data.id} kind="content" />
        </div>
        {data.excerpt[lang] && (
          <p className="text-base text-muted-foreground">{data.excerpt[lang]}</p>
        )}
      </header>

      {data.media_url && data.type === "video" && (
        <div className="aspect-video overflow-hidden rounded-3xl border border-border/60">
          <video src={data.media_url} controls className="h-full w-full" />
        </div>
      )}
      {data.media_url && data.type === "pdf" && (
        <a href={data.media_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2 text-sm font-medium hover:shadow-soft">
          <FileText className="h-4 w-4" /> Open PDF
        </a>
      )}

      {data.body[lang] && (
        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground sm:prose-base">
          {data.body[lang]}
        </div>
      )}
    </article>
  );
}
