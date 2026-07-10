import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/counselor")({
  head: () => ({ meta: [{ title: "Counselor dashboard — Sakinah" }] }),
  component: CounselorPage,
});

function CounselorPage() {
  const { user, roles, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
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

  useEffect(() => {
    if (!user) return;
    const ch = supabase
      .channel("counselor-requests")
      .on("postgres_changes", { event: "*", schema: "public", table: "counseling_requests" }, () => {
        qc.invalidateQueries({ queryKey: ["counselor-requests", user.id] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, qc]);

  if (loading || !user) return <Skeleton className="h-40 w-full rounded-3xl" />;

  const items = requests.data ?? [];

  return (
    <div className="animate-fade-in space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Counselor dashboard</h1>
        <p className="text-sm text-muted-foreground">Live queue of counseling requests</p>
      </header>
      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No requests yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((r) => <RequestCard key={r.id} request={r} authorId={user.id} />)}
        </ul>
      )}
    </div>
  );
}

type RequestRow = {
  id: string;
  user_id: string;
  counselor_id: string | null;
  topic: string;
  description: string | null;
  status: "pending" | "assigned" | "scheduled" | "in_progress" | "completed" | "cancelled";
  created_at: string;
  scheduled_at: string | null;
};

function RequestCard({ request: r, authorId }: { request: RequestRow; authorId: string }) {
  const qc = useQueryClient();
  const [note, setNote] = useState("");
  const notes = useQuery({
    queryKey: ["counseling-notes", r.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("counseling_notes")
        .select("*")
        .eq("request_id", r.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <li className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium capitalize">{r.topic}</p>
          <p className="text-xs text-muted-foreground">Created {new Date(r.created_at).toLocaleString()}</p>
          {r.description && <p className="mt-2 text-sm">{r.description}</p>}
        </div>
        <select
          className="rounded-full border border-input bg-background px-3 py-1 text-xs"
          defaultValue={r.status}
          onChange={async (e) => {
            const status = e.target.value as RequestRow["status"];
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

      <div className="mt-4 space-y-2 border-t border-border/60 pt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notes</p>
        {(notes.data ?? []).map((n) => (
          <div key={n.id} className="rounded-lg bg-muted p-2 text-xs">
            <p className="text-muted-foreground">{new Date(n.created_at).toLocaleString()}</p>
            <p className="mt-0.5">{n.note}</p>
          </div>
        ))}
        <div className="flex gap-2">
          <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Add private counselor note…" className="flex-1" />
          <Button size="sm" className="rounded-full" onClick={async () => {
            if (!note.trim()) return;
            const { error } = await supabase.from("counseling_notes").insert({ request_id: r.id, author_id: authorId, note: note.trim() });
            if (error) return toast.error(error.message);
            setNote("");
            toast.success("Note added");
            qc.invalidateQueries({ queryKey: ["counseling-notes", r.id] });
          }}>Add</Button>
        </div>
      </div>
    </li>
  );
}
