"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/config/site";
import { cn } from "@/lib/utils";

/** آیا این مسیر، مسیر فعلی یا والدِ آن است؟ */
function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export interface NavLinksProps {
  /** چیدمان افقی هدر یا عمودی کشوی موبایل. */
  orientation?: "horizontal" | "vertical";
  onNavigate?: () => void;
  className?: string;
}

export function NavLinks({
  orientation = "horizontal",
  onNavigate,
  className,
}: NavLinksProps) {
  const pathname = usePathname();
  const isVertical = orientation === "vertical";

  return (
    <ul
      className={cn(
        "flex",
        isVertical ? "flex-col gap-1" : "items-center gap-1",
        className,
      )}
    >
      {mainNav.map((item) => {
        const active = isActive(pathname, item.href);

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "focus-visible:outline-ring relative block rounded-xl text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
                isVertical ? "px-4 py-3" : "px-3.5 py-2",
                active
                  ? "text-primary bg-primary-soft"
                  : "text-muted hover:text-foreground hover:bg-surface-2",
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
