import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/counselor")({
  head: () => ({ meta: [{ title: "Counselor dashboard — Sakinah" }] }),
  component: CounselorPage,
});

function CounselorPage() {
  const { user, roles, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth/login" });
    else if (!roles.includes("counselor") && !roles.includes("admin")) navigate({ to: "/profile" });
  }, [loading, user, roles, navigate]);

  const requests = useQuery({
    queryKey: ["counselor-requests", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("counseling_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  if (loading || !user) return <Skeleton className="h-40 w-full rounded-3xl" />;

  const items = requests.data ?? [];

  return (
    <div className="animate-fade-in space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Counselor dashboard</h1>
        <p className="text-sm text-muted-foreground">Requests assigned to you</p>
      </header>
      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No requests assigned to you yet.
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((r) => (
            <li key={r.id} className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium capitalize">{r.topic}</p>
                  <p className="text-xs text-muted-foreground">
                    Created {new Date(r.created_at).toLocaleString()}
                  </p>
                  {r.description && <p className="mt-2 text-sm">{r.description}</p>}
                </div>
                <select
                  className="rounded-full border border-input bg-background px-3 py-1 text-xs"
                  defaultValue={r.status}
                  onChange={async (e) => {
                    const status = e.target.value as typeof r.status;
                    const { error } = await supabase.from("counseling_requests").update({ status }).eq("id", r.id);
                    if (error) toast.error(error.message);
                    else toast.success("Updated");
                  }}
                >
                  {["pending", "assigned", "scheduled", "in_progress", "completed", "cancelled"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
