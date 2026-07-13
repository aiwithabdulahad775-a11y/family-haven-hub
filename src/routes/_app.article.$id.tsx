import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, FileText, Play, BookOpen, Download } from "lucide-react";
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
      return data ? mapContent(data) : null;
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
  const title = data.title[lang] || data.title.en;
  const excerpt = data.excerpt[lang] || data.excerpt.en;
  const body = data.body[lang] || data.body.en;

  return (
    <article className="animate-fade-in space-y-6">
      <Link to="/knowledge" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t.common.back}
      </Link>

      {data.type === "video" && data.media_url ? (
        <div className="aspect-video overflow-hidden rounded-3xl border border-border/60 bg-black">
          <video src={data.media_url} controls playsInline className="h-full w-full" />
        </div>
      ) : data.type === "pdf" && data.media_url ? (
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-muted">
          <object data={data.media_url} type="application/pdf" className="h-[70vh] w-full">
            <div className="p-6 text-center text-sm text-muted-foreground">
              <p className="mb-3">PDF preview not supported in this browser.</p>
              <a href={data.media_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2 text-sm font-medium hover:shadow-soft">
                <Download className="h-4 w-4" /> Open PDF
              </a>
            </div>
          </object>
        </div>
      ) : (
        <GradientThumb hue={data.hue} className="aspect-[16/9] rounded-3xl">
          <Badge className="bg-white/25 text-white backdrop-blur">
            <Icon className="me-1 h-3.5 w-3.5" />
            <span className="capitalize">{data.type}</span>
          </Badge>
        </GradientThumb>
      )}

      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="capitalize">
            <Icon className="me-1 h-3.5 w-3.5" />
            {data.type}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {data.minutes} {t.common.minutes}
          </span>
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        <div className="flex items-center justify-between">
          {excerpt ? (
            <p className="text-base text-muted-foreground">{excerpt}</p>
          ) : <span />}
          <BookmarkButton itemId={data.id} kind="content" />
        </div>
      </header>

      {data.type === "pdf" && data.media_url && (
        <a href={data.media_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2 text-sm font-medium hover:shadow-soft">
          <Download className="h-4 w-4" /> Open PDF in new tab
        </a>
      )}

      {body ? (
        <div className="prose prose-sm max-w-none whitespace-pre-wrap text-foreground sm:prose-base">
          {body}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          {t.common.empty}
        </div>
      )}
    </article>
  );
}
