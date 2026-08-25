import { BookOpen, UserCog } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { Container } from "@/components/ui";
import { getSession } from "@/lib/auth/session";

/**
 * پوسته پنل کاربر.
 *
 * برخلاف پنل مدیریت که لِی‌اوت مستقل دارد، پنل کاربر داخل همان پوسته
 * سایت می‌ماند — کاربر بین دوره‌ها و پنلش رفت‌وبرگشت می‌کند و هدر و فوتر
 * مشترک این حرکت را روان نگه می‌دارد.
 */
export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login?next=%2Fdashboard");

  return (
    <Container className="py-10">
      <div className="grid gap-8 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <h1 className="mb-4 text-xl font-black">پنل من</h1>
          <nav aria-label="ناوبری پنل کاربر">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/dashboard"
                  className="text-muted hover:bg-surface-2 hover:text-foreground focus-visible:outline-ring flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <BookOpen className="size-[1.15rem]" aria-hidden="true" />
                  دوره‌های من
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/profile"
                  className="text-muted hover:bg-surface-2 hover:text-foreground focus-visible:outline-ring flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <UserCog className="size-[1.15rem]" aria-hidden="true" />
                  پروفایل
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        <div className="lg:col-span-9">{children}</div>
      </div>
    </Container>
  );
}
