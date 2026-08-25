import { GraduationCap, LayoutDashboard, LogOut, Presentation } from "lucide-react";
import Link from "next/link";
import { Avatar, Button, buttonStyles } from "@/components/ui";
import { logoutAction } from "@/lib/actions/account";
import type { Session } from "@/lib/auth/session";
import type { User } from "@/types";

export interface UserMenuProps {
  session: Session | null;
  avatar?: User["avatar"];
}

/**
 * ناحیه حساب کاربری در هدر.
 *
 * وقتی کاربر وارد نشده: دکمه ورود و ثبت‌نام.
 * وقتی وارد شده: آواتار، میان‌بر به «دوره‌های من»، و بسته به نقش،
 * میان‌بر به پنل مدیریت یا پنل مدرس.
 *
 * خروج با فرم و POST انجام می‌شود نه لینک — چون تغییر وضعیت است و
 * نباید با یک پیش‌واکشی مرورگر اتفاق بیفتد.
 */
export function UserMenu({ session, avatar }: UserMenuProps) {
  if (!session) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className={buttonStyles({ variant: "ghost", size: "sm" })}
        >
          ورود
        </Link>
        <Link
          href="/signup"
          className={buttonStyles({ size: "sm", className: "hidden sm:inline-flex" })}
        >
          ثبت‌نام
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/dashboard"
        title="دوره‌های من"
        aria-label="دوره‌های من"
        className={buttonStyles({ variant: "ghost", size: "icon" })}
      >
        <GraduationCap aria-hidden="true" />
      </Link>

      {session.role === "instructor" && (
        <Link
          href="/instructor"
          title="پنل مدرس"
          aria-label="پنل مدرس"
          className={buttonStyles({ variant: "ghost", size: "icon" })}
        >
          <Presentation aria-hidden="true" />
        </Link>
      )}

      {session.role === "admin" && (
        <Link
          href="/admin"
          title="پنل مدیریت"
          aria-label="پنل مدیریت"
          className={buttonStyles({ variant: "ghost", size: "icon" })}
        >
          <LayoutDashboard aria-hidden="true" />
        </Link>
      )}

      <span className="flex items-center gap-2">
        <Avatar name={session.name} src={avatar} size="sm" />
        <span className="hidden flex-col leading-tight sm:flex">
          <span className="text-sm font-medium">{session.name}</span>
          <span className="text-subtle font-mono text-xs" dir="ltr">
            {session.username}
          </span>
        </span>
      </span>

      <form action={logoutAction}>
        <Button type="submit" variant="ghost" size="icon" aria-label="خروج از حساب">
          <LogOut aria-hidden="true" />
        </Button>
      </form>
    </div>
  );
}
