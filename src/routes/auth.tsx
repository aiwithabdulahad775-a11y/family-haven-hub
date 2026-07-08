import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthLayout,
});

function AuthLayout() {
  const { t, lang, toggle } = useI18n();
  return (
    <div className="bg-hero-gradient relative flex min-h-dvh flex-col items-center justify-center px-4 py-10">
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
            <span className="font-bold">س</span>
          </span>
          <span className="font-semibold">{t.appName}</span>
        </Link>
        <Button variant="ghost" size="sm" onClick={toggle} className="rounded-full">
          <Languages className="me-1 h-4 w-4" /> {lang.toUpperCase()}
        </Button>
      </div>
      <main id="main-content" className="w-full max-w-md">
        <Outlet />
      </main>
    </div>
  );
}
