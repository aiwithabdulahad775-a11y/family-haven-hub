import { Link } from "@tanstack/react-router";
import { BookOpen, Heart, Home, MessageCircle, User } from "lucide-react";
import { useI18n } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

type NavItem = { to: string; key: "home" | "knowledge" | "cases" | "counseling" | "profile"; Icon: typeof Home; exact?: boolean };
const items: NavItem[] = [
  { to: "/", key: "home", Icon: Home, exact: true },
  { to: "/knowledge", key: "knowledge", Icon: BookOpen },
  { to: "/case-studies", key: "cases", Icon: Heart },
  { to: "/counseling", key: "counseling", Icon: MessageCircle },
  { to: "/profile", key: "profile", Icon: User },
];

export function BottomNav() {
  const { t } = useI18n();
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/85 backdrop-blur-lg supports-[backdrop-filter]:bg-background/70"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto grid max-w-3xl grid-cols-5">
        {items.map(({ to, key, Icon, exact }) => (
          <li key={key}>
            <Link
              to={to}
              activeOptions={{ exact: Boolean(exact) }}
              className="group flex min-h-14 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium text-muted-foreground transition-colors data-[status=active]:text-primary"
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full transition-all",
                      isActive
                        ? "bg-primary/12 text-primary scale-105"
                        : "text-muted-foreground group-hover:text-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="truncate">{t.nav[key as keyof typeof t.nav]}</span>
                </>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
