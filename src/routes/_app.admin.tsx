import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, Users, FileText } from "lucide-react";
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
      const [profiles, requests, content] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("counseling_requests").select("*", { count: "exact", head: true }),
        supabase.from("content_items").select("*", { count: "exact", head: true }),
      ]);
      return { users: profiles.count ?? 0, requests: requests.count ?? 0, content: content.count ?? 0 };
    },
  });

  if (loading || !user || !roles.includes("admin")) return <Skeleton className="h-40 w-full rounded-3xl" />;

  return (
    <div className="animate-fade-in space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Admin dashboard</h1>
        <p className="text-sm text-muted-foreground">Full system overview</p>
      </header>
      <section className="grid gap-3 sm:grid-cols-3">
        <StatCard Icon={Users} label="Users" value={stats.data?.users ?? "—"} />
        <StatCard Icon={ShieldCheck} label="Counseling requests" value={stats.data?.requests ?? "—"} />
        <StatCard Icon={FileText} label="Content items" value={stats.data?.content ?? "—"} />
      </section>
      <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Quick links</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <Link to="/content" className="rounded-2xl border border-border/60 bg-background p-4 hover:shadow-soft">Manage content</Link>
          <Link to="/counselor" className="rounded-2xl border border-border/60 bg-background p-4 hover:shadow-soft">Counseling workspace</Link>
        </div>
      </section>
      <UserRoleManager />
    </div>
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
