import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/i18n/LanguageProvider";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({ meta: [{ title: "Create account — Sakinah" }] }),
  component: SignupPage,
});

function SignupPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <div className="animate-scale-in rounded-3xl border border-border/60 bg-card p-6 shadow-soft sm:p-8">
      <h1 className="text-2xl font-bold">{t.auth.signup}</h1>
      <form
        className="mt-6 grid gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const email = String(fd.get("email"));
          const password = String(fd.get("password"));
          const confirm = String(fd.get("confirm"));
          const fullName = String(fd.get("fullName"));
          if (password !== confirm) {
            toast.error("Passwords do not match");
            return;
          }
          setLoading(true);
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/profile`,
              data: { full_name: fullName },
            },
          });
          setLoading(false);
          if (error) {
            toast.error(error.message);
            return;
          }
          toast.success("Account created — check your email to verify");
          navigate({ to: "/auth/login" });
        }}
      >
        <Field label={t.auth.fullName}><Input name="fullName" required placeholder="Fatima A." /></Field>
        <Field label={t.auth.email}><Input name="email" type="email" required placeholder="you@example.com" /></Field>
        <Field label={t.auth.password}><Input name="password" type="password" required minLength={6} placeholder="••••••••" /></Field>
        <Field label={t.auth.confirmPassword}><Input name="confirm" type="password" required minLength={6} placeholder="••••••••" /></Field>
        <Button type="submit" size="lg" className="rounded-full" disabled={loading}>
          {loading ? "…" : t.auth.signupCta}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {t.auth.haveAccount}{" "}
        <Link to="/auth/login" className="font-medium text-primary hover:underline">
          {t.auth.login}
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
