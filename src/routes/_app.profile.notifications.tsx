import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BellOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/LanguageProvider";
import { notifications as seed } from "@/lib/dummy-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/profile/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Sakinah" }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { t, lang } = useI18n();
  const [items, setItems] = useState(seed);
  return (
    <div className="animate-fade-in space-y-6">
      <Link to="/profile" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t.common.back}
      </Link>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{t.profile.notifications}</h1>
        <Button variant="outline" size="sm" className="rounded-full" onClick={() => setItems([])}>
          Clear
        </Button>
      </div>
      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border p-10 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-muted text-muted-foreground">
            <BellOff className="h-6 w-6" />
          </span>
          <p className="font-medium">{t.common.empty}</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((n) => (
            <li
              key={n.id}
              className={cn(
                "flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm",
                n.unread && "border-primary/30 bg-primary/5",
              )}
            >
              <span className={cn("mt-1 h-2 w-2 shrink-0 rounded-full", n.unread ? "bg-primary" : "bg-muted-foreground/40")} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{n.title[lang]}</p>
                <p className="text-sm text-muted-foreground">{n.body[lang]}</p>
                <p className="mt-1 text-xs text-muted-foreground">{n.when[lang]}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
