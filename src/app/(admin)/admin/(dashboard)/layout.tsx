import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { getSession } from "@/lib/auth/session";

/**
 * لِی‌اوت بخش محافظت‌شده پنل.
 *
 * میان‌افزار هم مسیر را می‌بندد، ولی بررسی اینجا هم انجام می‌شود:
 * میان‌افزار فقط وجود کوکی را می‌بیند و نباید تنها خط دفاع باشد.
 */
export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-dvh">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar session={session} />
        <main className="flex-1 px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
