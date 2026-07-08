import { GradientThumb } from "@/components/ui/gradient-thumb";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/LanguageProvider";
import type { CaseStudy } from "@/lib/dummy-data";

export function CaseCard({ study }: { study: CaseStudy }) {
  const { t, lang } = useI18n();
  return (
    <Dialog>
      <article className="group flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-soft">
        <GradientThumb hue={study.hue} className="aspect-[16/9]">
          <Badge className="bg-white/25 text-white backdrop-blur">{study.category[lang]}</Badge>
        </GradientThumb>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="line-clamp-2 text-base font-semibold">{study.title[lang]}</h3>
          <p className="line-clamp-3 text-sm text-muted-foreground">{study.excerpt[lang]}</p>
          <DialogTrigger asChild>
            <Button variant="link" className="mt-auto w-fit px-0 text-primary">
              {t.common.readMore} →
            </Button>
          </DialogTrigger>
        </div>
      </article>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{study.title[lang]}</DialogTitle>
          <DialogDescription>{study.category[lang]}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm leading-relaxed text-foreground">
          <GradientThumb hue={study.hue} className="aspect-[16/9]" />
          <p>{study.body[lang]}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
