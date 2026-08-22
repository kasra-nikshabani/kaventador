import { cookies } from "next/headers";

/**
 * ⚠️ احراز هویت ماک‌شده — برای نمایش جریان پنل است، نه امنیت واقعی.
 *
 * محدودیت‌هایی که باید قبل از استفاده واقعی برطرف شوند:
 *  • رمز عبور با متن ساده مقایسه می‌شود (باید هش با bcrypt/argon2 شود).
 *  • کوکی امضا نشده و قابل جعل است (باید JWT امضاشده یا نشست سمت سرور شود).
 *  • هیچ محدودیت نرخ یا قفل حساب وجود ندارد.
 *  • فقط یک کاربر ثابت پشتیبانی می‌شود.
 *
 * در مرحله اتصال داده، این فایل با یک راهکار واقعی جایگزین می‌شود.
 */

export const SESSION_COOKIE = "kaventador_admin_session";

/** اعتبارنامه نمایشی؛ در محیط واقعی از متغیر محیطی خوانده می‌شود. */
export const DEMO_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL ?? "admin@kaventador.ir",
  password: process.env.ADMIN_PASSWORD ?? "kaventador",
} as const;

export type AdminSession = {
  email: string;
  name: string;
};

const SESSION_VALUE = "authenticated";

export async function createSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/** نشست فعلی، یا null اگر وارد نشده باشد. */
export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE)?.value;

  if (value !== SESSION_VALUE) return null;

  return { email: DEMO_CREDENTIALS.email, name: "کسری نیک‌شعبانی" };
}
