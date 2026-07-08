import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Bookmark, LogOut, Pencil, PlayCircle, Settings } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ContentCard } from "@/components/cards/ContentCard";
import { useI18n } from "@/i18n/LanguageProvider";
import { articles } from "@/lib/dummy-data";

export const Route = createFileRoute("/_app/profile/")({
  head: () => ({ meta: [{ title: "Profile — Sakinah" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { t, lang } = useI18n();
  return (
    <div className="animate-fade-in space-y-8">
      <section className="bg-hero-gradient flex items-center gap-4 rounded-3xl border border-border/60 p-5 shadow-soft">
        <Avatar className="h-14 w-14 shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground">FA</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">{t.profile.welcome}</p>
          <p className="truncate text-lg font-semibold">Fatima A.</p>
        </div>
        <Button asChild variant="outline" size="sm" className="rounded-full">
          <Link to="/profile/edit">
            <Pencil className="me-1 h-4 w-4" /> {t.profile.editProfile}
          </Link>
        </Button>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <QuickAction to="/profile/saved" Icon={Bookmark} label={t.profile.savedContent} />
        <QuickAction to="/profile/notifications" Icon={Bell} label={t.profile.notifications} />
        <QuickAction to="/profile/settings" Icon={Settings} label={t.profile.settings} />
        <QuickAction to="/auth/login" Icon={LogOut} label={t.profile.logout} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t.profile.continueReading}</h2>
        <div className="rounded-3xl border border-border/60 bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">{articles[0].title[lang]}</p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-2/5 rounded-full bg-primary" />
          </div>
          <div className="mt-3 flex justify-end">
            <Button size="sm" className="rounded-full">
              <PlayCircle className="me-1 h-4 w-4" /> {t.common.continue}
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t.profile.recent}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {articles.slice(1, 3).map((a) => (
            <ContentCard key={a.id} item={a} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t.profile.saved}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {articles.slice(3, 5).map((a) => (
            <ContentCard key={a.id} item={a} />
          ))}
        </div>
      </section>
    </div>
  );
}

function QuickAction({
  to,
  Icon,
  label,
}: {
  to: string;
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex flex-col items-start gap-2 rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-soft"
    >
      <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
