import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/i18n/LanguageProvider";
import { supabase } from "@/integrations/supabase/client";
import { landingPathForRoles, type AppRole } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth/login")({
  head: () => ({ meta: [{ title: "Log in — Sakinah" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <div className="animate-scale-in rounded-3xl border border-border/60 bg-card p-6 shadow-soft sm:p-8">
      <h1 className="text-2xl font-bold">{t.auth.login}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t.tagline}</p>
      <form
        className="mt-6 grid gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const email = String(fd.get("email"));
          const password = String(fd.get("password"));
          setLoading(true);
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          setLoading(false);
          if (error) {
            toast.error(error.message);
            return;
          }
          toast.success("Welcome back");
          const { data: rolesData } = await supabase.from("user_roles").select("role").eq("user_id", data.user!.id);
          const roles = (rolesData ?? []).map((r) => r.role) as AppRole[];
          navigate({ to: landingPathForRoles(roles) });
        }}
      >
        <Field label={t.auth.email}>
          <Input name="email" type="email" required placeholder="you@example.com" />
        </Field>
        <Field label={t.auth.password}>
          <Input name="password" type="password" required placeholder="••••••••" />
        </Field>
        <div className="flex justify-end -mt-2">
          <Link to="/auth/forgot" className="text-xs text-primary hover:underline">
            {t.auth.forgot}?
          </Link>
        </div>
        <Button type="submit" size="lg" className="rounded-full" disabled={loading}>
          {loading ? "…" : t.auth.loginCta}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t.auth.noAccount}{" "}
        <Link to="/auth/signup" className="font-medium text-primary hover:underline">
          {t.auth.signup}
        </Link>
      </p>
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
