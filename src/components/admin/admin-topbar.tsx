import { LogOut } from "lucide-react";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Avatar, Button } from "@/components/ui";
import { logoutAction } from "@/lib/actions/account";
import type { Session } from "@/lib/auth/session";

export function AdminTopbar({
  session,
  avatar,
}: {
  session: Session;
  avatar?: string;
}) {
  return (
    <header className="border-border bg-background/80 sticky top-0 z-40 flex h-16 items-center gap-3 border-b px-4 backdrop-blur-xl sm:px-6">
      <AdminMobileNav className="lg:hidden" />

      <div className="ms-auto flex items-center gap-3">
        <ThemeToggle />

        <div className="border-border hidden items-center gap-2.5 border-e pe-3 sm:flex">
          <Avatar name={session.name} src={avatar} size="sm" />
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-medium">{session.name}</span>
            <span className="text-subtle font-mono text-xs" dir="ltr">
              {session.username}
            </span>
          </span>
        </div>

        {/* خروج یک تغییر وضعیت است، پس با فرم و POST انجام می‌شود نه لینک. */}
        <form action={logoutAction}>
          <Button type="submit" variant="ghost" size="sm">
            <LogOut aria-hidden="true" />
            <span className="hidden sm:inline">خروج</span>
          </Button>
        </form>
      </div>
    </header>
  );
}
