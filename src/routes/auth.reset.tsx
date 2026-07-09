import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/reset")({
  head: () => ({ meta: [{ title: "Reset password — Sakinah" }] }),
  component: ResetPage,
});

function ResetPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  return (
    <div className="animate-scale-in rounded-3xl border border-border/60 bg-card p-6 shadow-soft sm:p-8">
      <h1 className="text-2xl font-bold">Set a new password</h1>
      <form
        className="mt-6 grid gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const password = String(fd.get("password"));
          setLoading(true);
          const { error } = await supabase.auth.updateUser({ password });
          setLoading(false);
          if (error) return toast.error(error.message);
          toast.success("Password updated");
          navigate({ to: "/profile" });
        }}
      >
        <div className="grid gap-1.5">
          <Label>New password</Label>
          <Input name="password" type="password" required minLength={6} placeholder="••••••••" />
        </div>
        <Button type="submit" size="lg" className="rounded-full" disabled={loading}>
          {loading ? "…" : "Update password"}
        </Button>
      </form>
    </div>
  );
}
