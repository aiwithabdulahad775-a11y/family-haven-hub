import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/i18n/LanguageProvider";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/forgot")({
  head: () => ({ meta: [{ title: "Forgot password — Sakinah" }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  return (
    <div className="animate-scale-in rounded-3xl border border-border/60 bg-card p-6 shadow-soft sm:p-8">
      <h1 className="text-2xl font-bold">{t.auth.forgot}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t.auth.forgotBody}</p>
      <form
        className="mt-6 grid gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const email = String(fd.get("email"));
          setLoading(true);
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset`,
          });
          setLoading(false);
          if (error) toast.error(error.message);
          else toast.success("Reset link sent");
        }}
      >
        <div className="grid gap-1.5">
          <Label>{t.auth.email}</Label>
          <Input name="email" type="email" required placeholder="you@example.com" />
        </div>
        <Button type="submit" size="lg" className="rounded-full" disabled={loading}>
          {loading ? "…" : t.auth.forgotCta}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm">
        <Link to="/auth/login" className="text-primary hover:underline">
          {t.common.back} → {t.auth.login}
        </Link>
      </p>
    </div>
  );
}
