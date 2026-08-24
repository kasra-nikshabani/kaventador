import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/session";

/**
 * محافظت از پنل ادمین.
 *
 * از Next 16 این قرارداد «proxy» نام دارد (قبلاً middleware بود).
 *
 * ⚠️ این فقط یک بررسی خوش‌بینانه است: وجود کوکی را می‌بیند ولی نه امضای
 * آن را راستی‌آزمایی می‌کند و نه نقش کاربر را می‌داند. خط دفاع واقعی،
 * بررسی نشست در لِی‌اوت و در ابتدای هر Server Action است — چون proxy
 * اصلاً اکشن‌ها را نمی‌بیند و برای کار سنگین هم مناسب نیست.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.get(SESSION_COOKIE)?.value;

  if (!hasSession) {
    const loginUrl = new URL("/login", request.url);
    /* مسیر مقصد نگه داشته می‌شود تا پس از ورود، کاربر به همان‌جا برگردد. */
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
