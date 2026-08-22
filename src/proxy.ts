import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/session";

/**
 * محافظت از پنل ادمین.
 *
 * از Next 16 این قرارداد «proxy» نام دارد (قبلاً middleware بود).
 *
 * ⚠️ این فقط یک بررسی خوش‌بینانه است و صرفاً وجود کوکی را می‌بیند، نه
 * اعتبار امضای آن. خط دفاع واقعی، بررسی نشست در لِی‌اوت و در ابتدای هر
 * Server Action است — چون proxy اصلاً اکشن‌ها را نمی‌بیند.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.get(SESSION_COOKIE)?.value;

  const isLoginPage = pathname === "/admin/login";

  if (!hasSession && !isLoginPage) {
    const loginUrl = new URL("/admin/login", request.url);
    /* مسیر مقصد نگه داشته می‌شود تا پس از ورود، کاربر به همان‌جا برگردد. */
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  /* کاربر واردشده نباید دوباره صفحه ورود را ببیند. */
  if (hasSession && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
