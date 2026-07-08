import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Decorative gradient placeholder used in place of stock imagery. Keeps the
 * prototype content light and consistent while avoiding missing-image issues.
 */
export function GradientThumb({
  hue,
  className,
  children,
  label,
}: {
  hue: number;
  className?: string;
  children?: ReactNode;
  label?: string;
}) {
  const bg = `linear-gradient(135deg, hsl(${hue} 70% 78%), hsl(${(hue + 40) % 360} 65% 62%))`;
  return (
    <div
      aria-label={label}
      role={label ? "img" : "presentation"}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-muted",
        className,
      )}
      style={{ backgroundImage: bg }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_50%)]" />
      <div className="absolute inset-0 flex items-end p-4 text-sm font-medium text-white/90">
        {children}
      </div>
    </div>
  );
}
