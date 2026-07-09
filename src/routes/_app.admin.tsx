import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Users, FileText } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_app/admin")({
  head: () => ({ meta: [{ title: "Admin dashboard — Sakinah" }] }),
  component: AdminPage,
});

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
