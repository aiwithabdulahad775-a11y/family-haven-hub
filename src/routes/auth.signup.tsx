import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({ meta: [{ title: "Create account — Sakinah" }] }),
  component: SignupPage,
});

function SignupPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  return (
    <div className="animate-scale-in rounded-3xl border border-border/60 bg-card p-6 shadow-soft sm:p-8">
      <h1 className="text-2xl font-bold">{t.auth.signup}</h1>
      <form
        className="mt-6 grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Account created (visual)");
          navigate({ to: "/auth/otp" });
        }}
      >
        <Field label={t.auth.fullName}><Input required placeholder="Fatima A." /></Field>
        <Field label={t.auth.email}><Input type="email" required placeholder="you@example.com" /></Field>
        <Field label={t.auth.password}><Input type="password" required placeholder="••••••••" /></Field>
        <Field label={t.auth.confirmPassword}><Input type="password" required placeholder="••••••••" /></Field>
        <Button type="submit" size="lg" className="rounded-full">{t.auth.signupCta}</Button>
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
