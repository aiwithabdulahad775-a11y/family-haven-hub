import { Link } from "@tanstack/react-router";
import { Bell, Languages, Moon, Search, Sun } from "lucide-react";
import { useI18n } from "@/i18n/LanguageProvider";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

export function TopAppBar({ title }: { title?: string }) {
  const { t, lang, toggle } = useI18n();
  const { theme, toggle: toggleTheme } = useTheme();
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
            <span className="font-bold">س</span>
          </span>
          <span className="truncate text-base font-semibold">{title ?? t.appName}</span>
        </Link>
        <div className="ms-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            asChild
            className="rounded-full"
          >
            <Link to="/knowledge">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Switch language (${lang === "en" ? "English" : "Urdu"})`}
            onClick={toggle}
            className="rounded-full"
          >
            <Languages className="h-5 w-5" />
            <span className="ms-1 text-xs font-semibold uppercase">{lang}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" aria-label="Notifications" asChild className="rounded-full">
            <Link to="/profile/notifications">
              <Bell className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
