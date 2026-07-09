import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/content")({
  head: () => ({ meta: [{ title: "Content dashboard — Sakinah" }] }),
  component: ContentPage,
});

function ContentPage() {
  const { user, roles, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth/login" });
    else if (!roles.includes("content_manager") && !roles.includes("admin")) navigate({ to: "/profile" });
  }, [loading, user, roles, navigate]);

  const items = useQuery({
    queryKey: ["all-content"],
    enabled: !!user && (roles.includes("content_manager") || roles.includes("admin")),
    queryFn: async () => {
      const { data, error } = await supabase.from("content_items").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const [form, setForm] = useState({ type: "article", section: "zaujain", title_en: "", title_ur: "", excerpt_en: "", excerpt_ur: "", body_en: "", body_ur: "", minutes: 5 });

  if (loading || !user) return <Skeleton className="h-40 w-full rounded-3xl" />;

  return (
    <div className="animate-fade-in space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Content dashboard</h1>
        <p className="text-sm text-muted-foreground">Create and manage published knowledge</p>
      </header>

      <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">New content</h2>
        <form
          className="mt-4 grid gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const { error } = await supabase.from("content_items").insert({
              ...form,
              type: form.type as "article" | "video" | "pdf",
              created_by: user.id,
              updated_by: user.id,
            });
            if (error) return toast.error(error.message);
            toast.success("Published");
            setForm({ ...form, title_en: "", title_ur: "", excerpt_en: "", excerpt_ur: "", body_en: "", body_ur: "" });
            qc.invalidateQueries({ queryKey: ["all-content"] });
            qc.invalidateQueries({ queryKey: ["content"] });
          }}
        >
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Section</Label>
              <Select value={form.section} onValueChange={(v) => setForm({ ...form, section: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["zaujain", "aulad", "parenting", "marriage", "family"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Minutes</Label>
              <Input type="number" value={form.minutes} onChange={(e) => setForm({ ...form, minutes: Number(e.target.value) })} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>Title (EN)</Label><Input required value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} /></div>
            <div><Label>Title (UR)</Label><Input required value={form.title_ur} onChange={(e) => setForm({ ...form, title_ur: e.target.value })} /></div>
            <div><Label>Excerpt (EN)</Label><Textarea rows={2} value={form.excerpt_en} onChange={(e) => setForm({ ...form, excerpt_en: e.target.value })} /></div>
            <div><Label>Excerpt (UR)</Label><Textarea rows={2} value={form.excerpt_ur} onChange={(e) => setForm({ ...form, excerpt_ur: e.target.value })} /></div>
            <div><Label>Body (EN)</Label><Textarea rows={4} value={form.body_en} onChange={(e) => setForm({ ...form, body_en: e.target.value })} /></div>
            <div><Label>Body (UR)</Label><Textarea rows={4} value={form.body_ur} onChange={(e) => setForm({ ...form, body_ur: e.target.value })} /></div>
          </div>
          <Button type="submit" size="lg" className="rounded-full w-fit">Publish</Button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">All content ({items.data?.length ?? 0})</h2>
        <ul className="space-y-2">
          {(items.data ?? []).map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
              <div className="min-w-0">
                <p className="truncate font-medium">{c.title_en}</p>
                <p className="text-xs text-muted-foreground">{c.type} · {c.section} · {c.is_published ? "published" : "draft"}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={async () => {
                  const { error } = await supabase.from("content_items").update({ is_published: !c.is_published }).eq("id", c.id);
                  if (error) toast.error(error.message);
                  else {
                    toast.success("Updated");
                    qc.invalidateQueries({ queryKey: ["all-content"] });
                    qc.invalidateQueries({ queryKey: ["content"] });
                  }
                }}
              >
                {c.is_published ? "Unpublish" : "Publish"}
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
