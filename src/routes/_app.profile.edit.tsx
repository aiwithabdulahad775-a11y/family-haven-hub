import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Camera } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/i18n/LanguageProvider";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_app/profile/edit")({
  head: () => ({ meta: [{ title: "Edit profile — Sakinah" }] }),
  component: EditProfile,
});

function EditProfile() {
  const { t } = useI18n();
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: profile } = useProfile(user?.id);
  const [form, setForm] = useState({
    full_name: "", username: "", phone: "", gender: "", country: "", city: "",
    date_of_birth: "", avatar_url: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? "",
        username: profile.username ?? "",
        phone: profile.phone ?? "",
        gender: profile.gender ?? "",
        country: profile.country ?? "",
        city: profile.city ?? "",
        date_of_birth: profile.date_of_birth ?? "",
        avatar_url: profile.avatar_url ?? "",
      });
    }
  }, [profile]);

  const initials = (form.full_name || user?.email || "?").split(" ").map((s) => s[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="animate-fade-in space-y-6">
      <Link to="/profile" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t.common.back}
      </Link>
      <h1 className="text-2xl font-bold">{t.profile.editProfile}</h1>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-20 w-20">
            {form.avatar_url ? <AvatarImage src={form.avatar_url} /> : null}
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">{initials}</AvatarFallback>
          </Avatar>
          <Button size="icon" className="absolute -end-1 -bottom-1 h-8 w-8 rounded-full" aria-label="Change avatar" disabled>
            <Camera className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <form
        className="grid gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!user) return;
          setSaving(true);
          const { error } = await supabase.from("profiles").update({
            full_name: form.full_name || null,
            username: form.username || null,
            phone: form.phone || null,
            gender: (form.gender || null) as "male" | "female" | "other" | null,
            country: form.country || null,
            city: form.city || null,
            date_of_birth: form.date_of_birth || null,
          }).eq("id", user.id);
          setSaving(false);
          if (error) return toast.error(error.message);
          qc.invalidateQueries({ queryKey: ["profile", user.id] });
          toast.success("Profile saved");
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name"><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} /></Field>
          <Field label="Username"><Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} /></Field>
          <Field label="Phone"><Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field label="Date of birth"><Input type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} /></Field>
          <Field label="Country"><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} /></Field>
          <Field label="City"><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></Field>
        </div>
        <Button type="submit" size="lg" className="rounded-full" disabled={saving}>
          {saving ? "…" : t.common.submit}
        </Button>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
