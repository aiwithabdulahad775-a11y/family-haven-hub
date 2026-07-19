import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, Users, FileText, Video, FileType, Folder, MessageSquare, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth, type AppRole } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/admin")({
  head: () => ({ meta: [{ title: "Admin dashboard — Sakinah" }] }),
  component: AdminPage,
});

const ALL_ROLES: AppRole[] = ["user", "counselor", "content_manager", "admin"];

function AdminPage() {
  const { user, roles, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth/login" });
    else if (!roles.includes("admin")) navigate({ to: "/profile" });
  }, [loading, user, roles, navigate]);

  const stats = useQuery({
    queryKey: ["admin-stats"],
    enabled: !!user && roles.includes("admin"),
    queryFn: async () => {
      const headOpts = { count: "exact" as const, head: true };
      const [profiles, requests, articles, videos, pdfs, categories] = await Promise.all([
        supabase.from("profiles").select("*", headOpts),
        supabase.from("counseling_requests").select("*", headOpts),
        supabase.from("content_items").select("*", headOpts).eq("type", "article").is("deleted_at", null),
        supabase.from("content_items").select("*", headOpts).eq("type", "video").is("deleted_at", null),
        supabase.from("content_items").select("*", headOpts).eq("type", "pdf").is("deleted_at", null),
        supabase.from("categories").select("*", headOpts),
      ]);
      return {
        users: profiles.count ?? 0,
        requests: requests.count ?? 0,
        articles: articles.count ?? 0,
        videos: videos.count ?? 0,
        pdfs: pdfs.count ?? 0,
        categories: categories.count ?? 0,
      };
    },
  });

  const recent = useQuery({
    queryKey: ["admin-recent"],
    enabled: !!user && roles.includes("admin"),
    queryFn: async () => {
      const [content, reqs, users] = await Promise.all([
        supabase.from("content_items").select("id, title_en, type, created_at").is("deleted_at", null).order("created_at", { ascending: false }).limit(5),
        supabase.from("counseling_requests").select("id, status, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("profiles").select("id, full_name, email, created_at").order("created_at", { ascending: false }).limit(5),
      ]);
      type Item = { id: string; label: string; sub: string; at: string };
      const items: Item[] = [];
      (content.data ?? []).forEach((c) => items.push({ id: `c-${c.id}`, label: `New ${c.type}: ${c.title_en}`, sub: "Content", at: c.created_at }));
      (reqs.data ?? []).forEach((r) => items.push({ id: `r-${r.id}`, label: `Counseling request (${r.status})`, sub: "Counseling", at: r.created_at }));
      (users.data ?? []).forEach((u) => items.push({ id: `u-${u.id}`, label: `New user: ${u.full_name || u.email}`, sub: "Users", at: u.created_at }));
      return items.sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, 10);
    },
  });

  if (loading || !user || !roles.includes("admin")) return <Skeleton className="h-40 w-full rounded-3xl" />;

  const s = stats.data;
  return (
    <div className="animate-fade-in space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Admin dashboard</h1>
        <p className="text-sm text-muted-foreground">Full system overview</p>
      </header>
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard Icon={Users} label="Total Users" value={s?.users ?? "—"} />
        <StatCard Icon={FileText} label="Total Articles" value={s?.articles ?? "—"} />
        <StatCard Icon={Folder} label="Total Categories" value={s?.categories ?? "—"} />
        <StatCard Icon={Video} label="Total Videos" value={s?.videos ?? "—"} />
        <StatCard Icon={FileType} label="Total PDFs" value={s?.pdfs ?? "—"} />
        <StatCard Icon={ShieldCheck} label="Counseling Requests" value={s?.requests ?? "—"} />
      </section>

      <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <QuickAction to="/content" Icon={FileText} label="Manage Articles" />
          <QuickAction to="/content" Icon={Folder} label="Manage Categories" />
          <QuickAction to="/content" Icon={Video} label="Manage Videos" />
          <QuickAction to="/content" Icon={FileType} label="Manage PDFs" />
          <QuickAction to="/counselor" Icon={MessageSquare} label="Manage Counseling Requests" />
        </div>
      </section>

      <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>
        <div className="mt-4 space-y-2">
          {recent.isLoading && <Skeleton className="h-24 w-full rounded-2xl" />}
          {!recent.isLoading && (recent.data ?? []).length === 0 && (
            <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No recent activity.</p>
          )}
          {(recent.data ?? []).map((it) => (
            <div key={it.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{it.label}</p>
                <p className="text-xs text-muted-foreground">{it.sub}</p>
              </div>
              <p className="shrink-0 text-xs text-muted-foreground">{new Date(it.at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>

      <UserRoleManager />
    </div>
  );
}

function QuickAction({ to, Icon, label }: { to: string; Icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <Link to={to} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background p-4 hover:shadow-soft transition-shadow">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}

function StatCard({ Icon, label, value }: { Icon: React.ComponentType<{ className?: string }>; label: string; value: number | string }) {
  return (
    <div className="flex items-center gap-3 rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function UserRoleManager() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");

  const users = useQuery({
    queryKey: ["admin-users", q],
    queryFn: async () => {
      let query = supabase.from("profiles").select("id, full_name, email, username").order("created_at", { ascending: false }).limit(100);
      if (q.trim()) {
        const like = `%${q.trim().replace(/[%_]/g, "")}%`;
        query = query.or(`email.ilike.${like},full_name.ilike.${like},username.ilike.${like}`);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });

  const allRoles = useQuery({
    queryKey: ["admin-all-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("user_id, role");
      if (error) throw error;
      return data ?? [];
    },
  });

  const rolesByUser = new Map<string, AppRole[]>();
  (allRoles.data ?? []).forEach((r) => {
    const list = rolesByUser.get(r.user_id) ?? [];
    list.push(r.role as AppRole);
    rolesByUser.set(r.user_id, list);
  });

  const toggle = async (userId: string, role: AppRole, has: boolean) => {
    if (has) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) return toast.error(error.message);
    }
    toast.success("Roles updated");
    qc.invalidateQueries({ queryKey: ["admin-all-roles"] });
  };

  return (
    <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Users & roles</h2>
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search email or name…" className="max-w-xs rounded-full" />
      </div>
      <div className="mt-4 space-y-2">
        {(users.data ?? []).map((u) => {
          const has = rolesByUser.get(u.id) ?? [];
          return (
            <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background p-3">
              <div className="min-w-0">
                <p className="truncate font-medium">{u.full_name || u.username || u.email}</p>
                <p className="truncate text-xs text-muted-foreground">{u.email}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ALL_ROLES.map((r) => {
                  const active = has.includes(r);
                  return (
                    <Button
                      key={r}
                      size="sm"
                      variant={active ? "default" : "outline"}
                      className="h-7 rounded-full text-xs"
                      onClick={() => toggle(u.id, r, active)}
                    >
                      {r}
                    </Button>
                  );
                })}
              </div>
            </div>
          );
        })}
        {(users.data ?? []).length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No users found.</p>
        )}
      </div>
    </section>
  );
}
