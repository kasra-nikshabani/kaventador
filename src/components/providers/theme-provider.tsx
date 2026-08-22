"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

/**
 * مدیریت تم روشن/تاریک با استراتژی کلاس روی <html>.
 * `disableTransitionOnChange` از پرش رنگ‌ها هنگام سوییچ جلوگیری می‌کند.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
