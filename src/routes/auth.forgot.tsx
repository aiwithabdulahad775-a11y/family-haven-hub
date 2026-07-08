import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/auth/forgot")({
  head: () => ({ meta: [{ title: "Forgot password — Sakinah" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const { t } = useI18n();
  return (
    <div className="animate-scale-in rounded-3xl border border-border/60 bg-card p-6 shadow-soft sm:p-8">
      <h1 className="text-2xl font-bold">{t.auth.forgot}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t.auth.forgotBody}</p>
      <form
        className="mt-6 grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Reset link sent (visual)");
        }}
      >
        <div className="grid gap-1.5">
          <Label>{t.auth.email}</Label>
          <Input type="email" required placeholder="you@example.com" />
        </div>
        <Button type="submit" size="lg" className="rounded-full">{t.auth.forgotCta}</Button>
      </form>
      <p className="mt-6 text-center text-sm">
        <Link to="/auth/login" className="text-primary hover:underline">
          {t.common.back} → {t.auth.login}
        </Link>
      </p>
    </div>
  );
}
