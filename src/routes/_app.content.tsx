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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/_app/content")({
  head: () => ({ meta: [{ title: "Content dashboard — Sakinah" }] }),
  component: ContentPage,
});

function ContentPage() {
  const { user, roles, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth/login" });
    else if (!roles.includes("content_manager") && !roles.includes("admin")) navigate({ to: "/profile" });
  }, [loading, user, roles, navigate]);

  if (loading || !user) return <Skeleton className="h-40 w-full rounded-3xl" />;

  return (
    <div className="animate-fade-in space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Content dashboard</h1>
        <p className="text-sm text-muted-foreground">Create, publish and manage the knowledge base</p>
      </header>

      <Tabs defaultValue="content">
        <TabsList className="grid w-full grid-cols-3 rounded-full">
          <TabsTrigger value="content" className="rounded-full">Content</TabsTrigger>
          <TabsTrigger value="cases" className="rounded-full">Case studies</TabsTrigger>
          <TabsTrigger value="counselors" className="rounded-full">Counselors</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="mt-4"><ContentSection userId={user.id} /></TabsContent>
        <TabsContent value="cases" className="mt-4"><CaseSection userId={user.id} /></TabsContent>
        <TabsContent value="counselors" className="mt-4"><CounselorSection /></TabsContent>
      </Tabs>
    </div>
  );
}

function ContentSection({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const items = useQuery({
    queryKey: ["all-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("content_items").select("*").is("deleted_at", null).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const empty = { type: "article", section: "zaujain", title_en: "", title_ur: "", excerpt_en: "", excerpt_ur: "", body_en: "", body_ur: "", minutes: 5, media_url: "", hue: 220 };
  const [form, setForm] = useState(empty);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">New content</h2>
        <form
          className="mt-4 grid gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const { error } = await supabase.from("content_items").insert({
              ...form,
              media_url: form.media_url || null,
              type: form.type as "article" | "video" | "pdf",
              created_by: userId,
              updated_by: userId,
            });
            if (error) return toast.error(error.message);
            toast.success("Published");
            setForm(empty);
            qc.invalidateQueries({ queryKey: ["all-content"] });
            qc.invalidateQueries({ queryKey: ["content"] });
          }}
        >
          <div className="grid gap-3 sm:grid-cols-4">
            <div><Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Section</Label>
              <Select value={form.section} onValueChange={(v) => setForm({ ...form, section: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["zaujain", "aulad", "parenting", "marriage", "family"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Minutes</Label><Input type="number" value={form.minutes} onChange={(e) => setForm({ ...form, minutes: Number(e.target.value) })} /></div>
            <div><Label>Hue (0–360)</Label><Input type="number" min={0} max={360} value={form.hue} onChange={(e) => setForm({ ...form, hue: Number(e.target.value) })} /></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>Title (EN)</Label><Input required value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} /></div>
            <div><Label>Title (UR)</Label><Input required value={form.title_ur} onChange={(e) => setForm({ ...form, title_ur: e.target.value })} /></div>
            <div><Label>Excerpt (EN)</Label><Textarea rows={2} value={form.excerpt_en} onChange={(e) => setForm({ ...form, excerpt_en: e.target.value })} /></div>
            <div><Label>Excerpt (UR)</Label><Textarea rows={2} value={form.excerpt_ur} onChange={(e) => setForm({ ...form, excerpt_ur: e.target.value })} /></div>
            <div><Label>Body (EN)</Label><Textarea rows={4} value={form.body_en} onChange={(e) => setForm({ ...form, body_en: e.target.value })} /></div>
            <div><Label>Body (UR)</Label><Textarea rows={4} value={form.body_ur} onChange={(e) => setForm({ ...form, body_ur: e.target.value })} /></div>
            <div className="sm:col-span-2"><Label>Media URL (video/PDF)</Label><Input value={form.media_url} onChange={(e) => setForm({ ...form, media_url: e.target.value })} placeholder="https://…" /></div>
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
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="rounded-full" onClick={async () => {
                  const { error } = await supabase.from("content_items").update({ is_published: !c.is_published }).eq("id", c.id);
                  if (error) toast.error(error.message);
                  else { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["all-content"] }); qc.invalidateQueries({ queryKey: ["content"] }); }
                }}>{c.is_published ? "Unpublish" : "Publish"}</Button>
                <Button variant="ghost" size="icon" className="rounded-full text-destructive" aria-label="Delete" onClick={async () => {
                  if (!confirm("Delete this item?")) return;
                  const { error } = await supabase.from("content_items").update({ deleted_at: new Date().toISOString() }).eq("id", c.id);
                  if (error) toast.error(error.message);
                  else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["all-content"] }); qc.invalidateQueries({ queryKey: ["content"] }); }
                }}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function CaseSection({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const list = useQuery({
    queryKey: ["all-cases"],
    queryFn: async () => {
      const { data, error } = await supabase.from("case_studies").select("*").is("deleted_at", null).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  const empty = { title_en: "", title_ur: "", excerpt_en: "", excerpt_ur: "", body_en: "", body_ur: "", category_en: "", category_ur: "", hue: 220 };
  const [form, setForm] = useState(empty);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">New case study</h2>
        <form className="mt-4 grid gap-3" onSubmit={async (e) => {
          e.preventDefault();
          const { error } = await supabase.from("case_studies").insert({ ...form, created_by: userId, updated_by: userId });
          if (error) return toast.error(error.message);
          toast.success("Published");
          setForm(empty);
          qc.invalidateQueries({ queryKey: ["all-cases"] });
          qc.invalidateQueries({ queryKey: ["cases"] });
        }}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>Title (EN)</Label><Input required value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} /></div>
            <div><Label>Title (UR)</Label><Input required value={form.title_ur} onChange={(e) => setForm({ ...form, title_ur: e.target.value })} /></div>
            <div><Label>Category (EN)</Label><Input value={form.category_en} onChange={(e) => setForm({ ...form, category_en: e.target.value })} /></div>
            <div><Label>Category (UR)</Label><Input value={form.category_ur} onChange={(e) => setForm({ ...form, category_ur: e.target.value })} /></div>
            <div><Label>Excerpt (EN)</Label><Textarea rows={2} value={form.excerpt_en} onChange={(e) => setForm({ ...form, excerpt_en: e.target.value })} /></div>
            <div><Label>Excerpt (UR)</Label><Textarea rows={2} value={form.excerpt_ur} onChange={(e) => setForm({ ...form, excerpt_ur: e.target.value })} /></div>
            <div><Label>Body (EN)</Label><Textarea rows={4} value={form.body_en} onChange={(e) => setForm({ ...form, body_en: e.target.value })} /></div>
            <div><Label>Body (UR)</Label><Textarea rows={4} value={form.body_ur} onChange={(e) => setForm({ ...form, body_ur: e.target.value })} /></div>
            <div><Label>Hue (0–360)</Label><Input type="number" min={0} max={360} value={form.hue} onChange={(e) => setForm({ ...form, hue: Number(e.target.value) })} /></div>
          </div>
          <Button type="submit" size="lg" className="rounded-full w-fit">Publish</Button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">All case studies ({list.data?.length ?? 0})</h2>
        <ul className="space-y-2">
          {(list.data ?? []).map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
              <div className="min-w-0">
                <p className="truncate font-medium">{c.title_en}</p>
                <p className="text-xs text-muted-foreground">{c.category_en} · {c.is_published ? "published" : "draft"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="rounded-full" onClick={async () => {
                  const { error } = await supabase.from("case_studies").update({ is_published: !c.is_published }).eq("id", c.id);
                  if (error) toast.error(error.message);
                  else { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["all-cases"] }); qc.invalidateQueries({ queryKey: ["cases"] }); }
                }}>{c.is_published ? "Unpublish" : "Publish"}</Button>
                <Button variant="ghost" size="icon" className="rounded-full text-destructive" aria-label="Delete" onClick={async () => {
                  if (!confirm("Delete this case study?")) return;
                  const { error } = await supabase.from("case_studies").update({ deleted_at: new Date().toISOString() }).eq("id", c.id);
                  if (error) toast.error(error.message);
                  else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["all-cases"] }); qc.invalidateQueries({ queryKey: ["cases"] }); }
                }}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function CounselorSection() {
  const qc = useQueryClient();
  const list = useQuery({
    queryKey: ["all-counselors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("counselors").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  const empty = { name: "", role_en: "", role_ur: "", focus_en: "", focus_ur: "", years: 0, initials: "", hue: 220 };
  const [form, setForm] = useState(empty);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">New counselor</h2>
        <form className="mt-4 grid gap-3" onSubmit={async (e) => {
          e.preventDefault();
          const initials = (form.initials || form.name.split(" ").map((s) => s[0]).join("")).slice(0, 3).toUpperCase();
          const { error } = await supabase.from("counselors").insert({ ...form, initials });
          if (error) return toast.error(error.message);
          toast.success("Added");
          setForm(empty);
          qc.invalidateQueries({ queryKey: ["all-counselors"] });
          qc.invalidateQueries({ queryKey: ["counselors"] });
        }}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>Name</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Years</Label><Input type="number" min={0} value={form.years} onChange={(e) => setForm({ ...form, years: Number(e.target.value) })} /></div>
            <div><Label>Role (EN)</Label><Input value={form.role_en} onChange={(e) => setForm({ ...form, role_en: e.target.value })} /></div>
            <div><Label>Role (UR)</Label><Input value={form.role_ur} onChange={(e) => setForm({ ...form, role_ur: e.target.value })} /></div>
            <div><Label>Focus (EN)</Label><Input value={form.focus_en} onChange={(e) => setForm({ ...form, focus_en: e.target.value })} /></div>
            <div><Label>Focus (UR)</Label><Input value={form.focus_ur} onChange={(e) => setForm({ ...form, focus_ur: e.target.value })} /></div>
            <div><Label>Initials</Label><Input value={form.initials} onChange={(e) => setForm({ ...form, initials: e.target.value })} placeholder="Auto from name" /></div>
            <div><Label>Hue (0–360)</Label><Input type="number" min={0} max={360} value={form.hue} onChange={(e) => setForm({ ...form, hue: Number(e.target.value) })} /></div>
          </div>
          <Button type="submit" size="lg" className="rounded-full w-fit">Add</Button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">All counselors ({list.data?.length ?? 0})</h2>
        <ul className="space-y-2">
          {(list.data ?? []).map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
              <div className="min-w-0">
                <p className="truncate font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.role_en} · {c.years}y · {c.is_active ? "active" : "inactive"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="rounded-full" onClick={async () => {
                  const { error } = await supabase.from("counselors").update({ is_active: !c.is_active }).eq("id", c.id);
                  if (error) toast.error(error.message);
                  else { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["all-counselors"] }); qc.invalidateQueries({ queryKey: ["counselors"] }); }
                }}>{c.is_active ? "Deactivate" : "Activate"}</Button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
