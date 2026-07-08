import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarCheck, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useI18n } from "@/i18n/LanguageProvider";
import { counselors } from "@/lib/dummy-data";

export const Route = createFileRoute("/_app/counseling")({
  head: () => ({
    meta: [
      { title: "Counseling — Sakinah" },
      { name: "description", content: "Speak with a trained family counselor in confidence." },
    ],
  }),
  component: CounselingPage,
});

function CounselingPage() {
  const { t, lang } = useI18n();
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="animate-fade-in space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">{t.counseling.title}</h1>
        <p className="text-sm text-muted-foreground">{t.counseling.subtitle}</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { Icon: ShieldCheck, en: "Confidential", ur: "رازدار" },
          { Icon: Clock, en: "Within 24h", ur: "24 گھنٹے میں" },
          { Icon: CalendarCheck, en: "Flexible times", ur: "لچکدار اوقات" },
        ].map(({ Icon, en, ur }) => (
          <div key={en} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <span className="text-sm font-medium">{lang === "ur" ? ur : en}</span>
          </div>
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t.counseling.counselors}</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {counselors.map((c) => (
            <article
              key={c.id}
              className="flex items-center gap-3 rounded-3xl border border-border/60 bg-card p-4 shadow-sm transition-all hover:shadow-soft"
            >
              <Avatar className="h-12 w-12">
                <AvatarFallback
                  style={{ backgroundColor: `hsl(${c.hue} 60% 85%)`, color: `hsl(${c.hue} 50% 25%)` }}
                >
                  {c.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{c.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {c.role[lang]} · {c.years}y
                </p>
                <Badge variant="secondary" className="mt-1">{c.focus[lang]}</Badge>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-semibold">{t.counseling.request}</h2>
        {confirmed ? (
          <div className="mt-4 space-y-3 rounded-2xl bg-primary/8 p-5 text-center">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground">
              <CalendarCheck className="h-6 w-6" />
            </div>
            <p className="font-semibold">{t.counseling.confirmTitle}</p>
            <p className="text-sm text-muted-foreground">{t.counseling.confirmBody}</p>
            <Button variant="outline" onClick={() => setConfirmed(false)}>
              {t.common.back}
            </Button>
          </div>
        ) : (
          <form
            className="mt-4 grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              setConfirmed(true);
              toast.success(t.counseling.confirmTitle);
            }}
          >
            <Field label={t.counseling.form.name}>
              <Input required placeholder="Fatima A." />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t.counseling.form.email}>
                <Input required type="email" placeholder="you@example.com" />
              </Field>
              <Field label={t.counseling.form.phone}>
                <Input required type="tel" placeholder="+92 300 0000000" />
              </Field>
            </div>
            <Field label={t.counseling.form.topic}>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="—" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marriage">{t.knowledge.sections.marriage}</SelectItem>
                  <SelectItem value="parenting">{t.knowledge.sections.parenting}</SelectItem>
                  <SelectItem value="family">{t.knowledge.sections.family}</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label={t.counseling.form.preferred}>
              <Input type="datetime-local" />
            </Field>
            <Field label={t.counseling.form.message}>
              <Textarea rows={4} required placeholder="…" />
            </Field>
            <Button type="submit" size="lg" className="rounded-full">
              {t.counseling.form.submit}
            </Button>
          </form>
        )}
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
