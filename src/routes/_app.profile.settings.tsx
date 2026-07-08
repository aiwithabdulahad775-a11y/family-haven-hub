import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Info, Languages, Lock, Moon, LifeBuoy } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/i18n/LanguageProvider";
import { useTheme } from "@/components/theme-provider";

export const Route = createFileRoute("/_app/profile/settings")({
  head: () => ({ meta: [{ title: "Settings — Sakinah" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { t, lang, setLang } = useI18n();
  const { theme, toggle } = useTheme();
  return (
    <div className="animate-fade-in space-y-6">
      <Link to="/profile" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t.common.back}
      </Link>
      <h1 className="text-2xl font-bold">{t.settings.title}</h1>

      <section className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
        <Row Icon={Languages} label={t.profile.language}>
          <div className="flex gap-1 rounded-full bg-muted p-1">
            {(["en", "ur"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={
                  "rounded-full px-3 py-1 text-xs font-semibold uppercase transition-colors " +
                  (lang === l ? "bg-background text-foreground shadow" : "text-muted-foreground")
                }
              >
                {l}
              </button>
            ))}
          </div>
        </Row>
        <Row Icon={Moon} label={t.profile.darkMode}>
          <Switch checked={theme === "dark"} onCheckedChange={toggle} aria-label={t.profile.darkMode} />
        </Row>
        <LinkRow Icon={Lock} label={t.profile.privacy} />
        <LinkRow Icon={LifeBuoy} label={t.profile.help} />
        <LinkRow Icon={Info} label={t.profile.about} last />
      </section>
    </div>
  );
}

function Row({
  Icon,
  label,
  children,
  last,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  children?: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={"flex items-center gap-3 px-4 py-4 " + (last ? "" : "border-b border-border/60")}>
      <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex-1 text-sm font-medium">{label}</span>
      {children}
    </div>
  );
}

function LinkRow(props: { Icon: React.ComponentType<{ className?: string }>; label: string; last?: boolean }) {
  return (
    <Row {...props}>
      <ChevronRight className="h-4 w-4 text-muted-foreground rtl:rotate-180" />
    </Row>
  );
}
