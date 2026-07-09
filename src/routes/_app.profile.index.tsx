import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bell, Bookmark, LogOut, Pencil, Settings, ShieldCheck, Stethoscope, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/LanguageProvider";
import { useAuth } from "@/hooks/use-auth";
import { useProfile, useCounselingRequests, useNotifications } from "@/lib/queries";

export const Route = createFileRoute("/_app/profile/")({
  head: () => ({ meta: [{ title: "Profile — Sakinah" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { t } = useI18n();
  const { user, roles, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: profile } = useProfile(user?.id);
  const { data: requests = [] } = useCounselingRequests(user?.id);
  const { data: notifications = [] } = useNotifications(user?.id);
  const unread = notifications.filter((n) => !n.is_read).length;

  const initials = (profile?.full_name ?? user?.email ?? "?")
    .split(" ")
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="animate-fade-in space-y-8">
      <section className="bg-hero-gradient flex items-center gap-4 rounded-3xl border border-border/60 p-5 shadow-soft">
        <Avatar className="h-14 w-14 shrink-0">
          {profile?.avatar_url ? <AvatarImage src={profile.avatar_url} /> : null}
          <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">{t.profile.welcome}</p>
          <p className="truncate text-lg font-semibold">{profile?.full_name ?? user?.email}</p>
          {roles.length > 0 && (
            <p className="mt-0.5 text-xs uppercase tracking-wide text-primary">{roles.join(" · ")}</p>
          )}
        </div>
        <Button asChild variant="outline" size="sm" className="rounded-full">
          <Link to="/profile/edit"><Pencil className="me-1 h-4 w-4" /> {t.profile.editProfile}</Link>
        </Button>
      </section>

      {(roles.includes("admin") || roles.includes("counselor") || roles.includes("content_manager")) && (
        <section className="grid gap-3 sm:grid-cols-3">
          {roles.includes("admin") && <RoleTile to="/admin" Icon={ShieldCheck} label="Admin dashboard" />}
          {roles.includes("counselor") && <RoleTile to="/counselor" Icon={Stethoscope} label="Counselor dashboard" />}
          {roles.includes("content_manager") && <RoleTile to="/content" Icon={LayoutDashboard} label="Content dashboard" />}
        </section>
      )}

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <QuickAction to="/profile/saved" Icon={Bookmark} label={t.profile.savedContent} />
        <QuickAction to="/profile/notifications" Icon={Bell} label={`${t.profile.notifications}${unread ? ` (${unread})` : ""}`} />
        <QuickAction to="/profile/settings" Icon={Settings} label={t.profile.settings} />
        <button
          onClick={async () => {
            await signOut();
            toast.success("Signed out");
            navigate({ to: "/" });
          }}
          className="flex flex-col items-start gap-2 rounded-2xl border border-border/60 bg-card p-4 text-start shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-soft"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary">
            <LogOut className="h-4 w-4" />
          </span>
          <span className="text-sm font-medium">{t.profile.logout}</span>
        </button>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">My counseling requests</h2>
        {requests.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {t.common.empty}
          </div>
        ) : (
          <ul className="space-y-2">
            {requests.slice(0, 5).map((r) => (
              <li key={r.id} className="flex items-start justify-between gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium capitalize">{r.topic}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary capitalize">
                  {r.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function QuickAction({ to, Icon, label }: { to: string; Icon: React.ComponentType<{ className?: string }>; label: string }) {
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

function RoleTile({ to, Icon, label }: { to: string; Icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <Link to={to} className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 shadow-sm transition-all hover:shadow-soft">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-sm font-semibold">{label}</span>
    </Link>
  );
}
