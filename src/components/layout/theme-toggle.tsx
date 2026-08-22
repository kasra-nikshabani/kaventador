"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/**
 * سوییچ تم روشن/تاریک.
 *
 * هر دو آیکون رندر می‌شوند و نمایششان با واریانت `dark:` کنترل می‌شود؛
 * بنابراین نه state لازم است، نه ناهماهنگی hydration رخ می‌دهد و نه
 * هنگام بارگذاری اولیه آیکون اشتباه دیده می‌شود.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="تغییر حالت نمایش روشن یا تاریک"
      title="تغییر حالت نمایش"
      className={cn(
        "border-border text-muted hover:border-border-strong hover:bg-surface-2 hover:text-foreground focus-visible:outline-ring inline-flex size-10 cursor-pointer items-center justify-center rounded-xl border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
        className,
      )}
    >
      <Moon className="size-[1.15rem] dark:hidden" aria-hidden="true" />
      <Sun className="hidden size-[1.15rem] dark:block" aria-hidden="true" />
    </button>
  );
}
