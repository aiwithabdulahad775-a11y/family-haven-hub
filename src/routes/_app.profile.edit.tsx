import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Camera } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/i18n/LanguageProvider";

export const Route = createFileRoute("/_app/profile/edit")({
  head: () => ({ meta: [{ title: "Edit profile — Sakinah" }] }),
  component: EditProfile,
});

function EditProfile() {
  const { t } = useI18n();
  return (
    <div className="animate-fade-in space-y-6">
      <Link to="/profile" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t.common.back}
      </Link>
      <h1 className="text-2xl font-bold">{t.profile.editProfile}</h1>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">FA</AvatarFallback>
          </Avatar>
          <Button size="icon" className="absolute -end-1 -bottom-1 h-8 w-8 rounded-full" aria-label="Change avatar">
            <Camera className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <form
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Saved (visual)");
        }}
      >
        <Field label="Full name">
          <Input defaultValue="Fatima A." />
        </Field>
        <Field label="Email">
          <Input type="email" defaultValue="fatima@example.com" />
        </Field>
        <Field label="Phone">
          <Input type="tel" defaultValue="+92 300 0000000" />
        </Field>
        <Field label="Bio">
          <Textarea rows={3} defaultValue="Learning to build a calmer home, one day at a time." />
        </Field>
        <Button type="submit" size="lg" className="rounded-full">
          {t.common.submit}
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
