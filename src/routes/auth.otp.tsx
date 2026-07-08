import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useI18n } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/auth/otp")({
  head: () => ({ meta: [{ title: "Verify code — Sakinah" }] }),
  component: OtpPage,
});

function OtpPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  return (
    <div className="animate-scale-in rounded-3xl border border-border/60 bg-card p-6 shadow-soft sm:p-8">
      <h1 className="text-2xl font-bold">{t.auth.otp}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t.auth.otpBody}</p>
      <form
        className="mt-6 grid gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Verified (visual)");
          navigate({ to: "/profile" });
        }}
      >
        <div className="flex justify-center" dir="ltr">
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button type="submit" size="lg" className="rounded-full">{t.auth.otpCta}</Button>
      </form>
    </div>
  );
}
