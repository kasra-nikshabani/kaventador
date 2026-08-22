"use client";

import {
  BookOpen,
  ExternalLink,
  FileText,
  LayoutDashboard,
  Tags,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const ADMIN_NAV: AdminNavItem[] = [
  { label: "داشبورد", href: "/admin", icon: LayoutDashboard },
  { label: "دوره‌ها", href: "/admin/courses", icon: BookOpen },
  { label: "مقالات", href: "/admin/articles", icon: FileText },
  { label: "دسته‌بندی‌ها", href: "/admin/categories", icon: Tags },
  { label: "کاربران", href: "/admin/users", icon: Users },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <ul className="space-y-1">
      {ADMIN_NAV.map((item) => {
        const active = isActive(pathname, item.href);

        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "focus-visible:outline-ring flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted hover:bg-surface-2 hover:text-foreground",
              )}
            >
              <item.icon className="size-[1.15rem] shrink-0" aria-hidden="true" />
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** سایدبار ثابت پنل — روی دسکتاپ همیشه دیده می‌شود. */
export function AdminSidebar() {
  return (
    <aside className="border-border bg-surface hidden w-64 shrink-0 border-e lg:flex lg:flex-col">
      <div className="border-border flex h-16 items-center gap-2.5 border-b px-5">
        <LogoMark className="size-8" />
        <span className="flex flex-col leading-none">
          <span className="text-sm font-black">پنل مدیریت</span>
          <span
            className="text-subtle mt-0.5 text-[0.625rem] tracking-widest"
            dir="ltr"
          >
            KAVENTADOR
          </span>
        </span>
      </div>

      <nav aria-label="ناوبری پنل مدیریت" className="flex-1 overflow-y-auto p-3">
        <AdminNavLinks />
      </nav>

      <div className="border-border border-t p-3">
        <Link
          href="/"
          className="text-muted hover:bg-surface-2 hover:text-foreground focus-visible:outline-ring flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <ExternalLink className="size-[1.15rem]" aria-hidden="true" />
          مشاهده سایت
        </Link>
      </div>
    </aside>
  );
}
