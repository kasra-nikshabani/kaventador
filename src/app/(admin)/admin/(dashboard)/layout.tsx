import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { getAdminSession, getCurrentUser } from "@/lib/auth/session";

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
  /* فقط نقش admin؛ کاربر عادیِ واردشده هم اینجا راه ندارد. */
  const session = await getAdminSession();
  if (!session) redirect("/login?next=%2Fadmin");

  const user = await getCurrentUser();

  return (
    <div className="flex min-h-dvh">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar session={session} avatar={user?.avatar} />
        <main className="flex-1 px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
