import { ExternalLink, LayoutDashboard, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { LogoMark } from "@/components/layout/logo";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: { default: "پنل مدرس", template: "%s | پنل مدرس کاوِنتادور" },
  robots: { index: false, follow: false, nocache: true },
};

const NAV = [
  { label: "دوره‌های من", href: "/instructor", icon: LayoutDashboard },
  { label: "دانشجویان", href: "/instructor/students", icon: Users },
];

/**
 * پوسته پنل مدرس.
 *
 * دسترسی: نقش `instructor` یا `admin`. حساب بدون `personId` هم راه ندارد
 * — چون دوره‌ها به `Person` وصل‌اند و بدون آن پل، «دوره‌های من» بی‌معناست.
 */
export default async function InstructorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/login?next=%2Finstructor");
  if (user.role !== "instructor" && user.role !== "admin") redirect("/dashboard");
  if (!user.personId) redirect("/dashboard");

  return (
    <div className="flex min-h-dvh">
      <aside className="border-border bg-surface hidden w-64 shrink-0 border-e lg:flex lg:flex-col">
        <div className="border-border flex h-16 items-center gap-2.5 border-b px-5">
          <LogoMark className="size-8" />
          <span className="flex flex-col leading-none">
            <span className="text-sm font-black">پنل مدرس</span>
            <span className="text-subtle mt-0.5 text-[0.625rem] tracking-widest" dir="ltr">
              KAVENTADOR
            </span>
          </span>
        </div>

        <nav aria-label="ناوبری پنل مدرس" className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted hover:bg-surface-2 hover:text-foreground focus-visible:outline-ring flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <item.icon className="size-[1.15rem] shrink-0" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
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

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar
          session={{
            userId: user.id,
            username: user.username,
            name: user.name,
            role: user.role,
          }}
          avatar={user.avatar}
        />
        <main className="flex-1 px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
