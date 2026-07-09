import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BellOff, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/i18n/LanguageProvider";
import { useAuth } from "@/hooks/use-auth";
import { useNotifications } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/profile/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Sakinah" }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const { data: items = [], isLoading, refetch } = useNotifications(user?.id);

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", user.id).eq("is_read", false);
    refetch();
  };

  const clearAll = async () => {
    if (!user) return;
    await supabase.from("notifications").delete().eq("user_id", user.id);
    refetch();
  };

  return (
    <div className="animate-fade-in space-y-6">
      <Link to="/profile" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t.common.back}
      </Link>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{t.profile.notifications}</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-full" onClick={markAllRead}>
            <Check className="me-1 h-4 w-4" /> Mark read
          </Button>
          <Button variant="outline" size="sm" className="rounded-full" onClick={clearAll}>Clear</Button>
        </div>
      </div>
      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border p-10 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-muted text-muted-foreground">
            <BellOff className="h-6 w-6" />
          </span>
          <p className="font-medium">{t.common.empty}</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((n) => {
            const title = lang === "ur" ? n.title_ur ?? n.title_en : n.title_en;
            const body = lang === "ur" ? n.body_ur ?? n.body_en : n.body_en;
            const unread = !n.is_read;
            return (
              <li
                key={n.id}
                className={cn(
                  "flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm",
                  unread && "border-primary/30 bg-primary/5",
                )}
              >
                <span className={cn("mt-1 h-2 w-2 shrink-0 rounded-full", unread ? "bg-primary" : "bg-muted-foreground/40")} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{title}</p>
                  {body && <p className="text-sm text-muted-foreground">{body}</p>}
                  <p className="mt-1 text-xs text-muted-foreground">{new Date(n.created_at).toLocaleString()}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
