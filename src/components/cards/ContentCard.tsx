import { FileText, Play, BookOpen, Bookmark, BookmarkCheck } from "lucide-react";
import { useState } from "react";
import { GradientThumb } from "@/components/ui/gradient-thumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/LanguageProvider";
import type { Article } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";

const typeIcon = { article: BookOpen, video: Play, pdf: FileText };

export function ContentCard({ item, compact = false }: { item: Article; compact?: boolean }) {
  const { t, lang } = useI18n();
  const [saved, setSaved] = useState(false);
  const Icon = typeIcon[item.type];
  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card text-card-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-soft",
        compact ? "min-w-[240px]" : "",
      )}
    >
      <GradientThumb hue={item.hue} className={compact ? "aspect-[4/3]" : "aspect-[16/10]"}>
        <Badge className="bg-white/25 text-white backdrop-blur">
          <Icon className="me-1 h-3.5 w-3.5" />
          <span className="capitalize">{item.type}</span>
        </Badge>
      </GradientThumb>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-base font-semibold">{item.title[lang]}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{item.excerpt[lang]}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">
            {item.minutes} {t.common.minutes}
          </span>
          <Button
            variant="ghost"
            size="icon"
            aria-label={saved ? t.common.saved : t.common.save}
            onClick={() => setSaved((v) => !v)}
            className="rounded-full transition-transform active:scale-90"
          >
            {saved ? (
              <BookmarkCheck className="h-5 w-5 text-primary" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}
