import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { serverEnv } from "@/lib/config/server-env";
import { findUserById } from "@/lib/repositories";
import type { User, UserRole } from "@/types";

/**
 * نشست کاربر، با کوکی امضاشده.
 *
 * محتوای کوکی: `userId.expiry.امضا`
 * امضا HMAC-SHA256 روی «userId.expiry» با کلید `AUTH_SECRET` است. یعنی
 * کاربر می‌تواند محتوا را ببیند ولی نمی‌تواند عوضش کند — تغییر یک بایت،
 * امضا را باطل می‌کند.
 *
 * ⚠️ آنچه این راهکار *ندارد*: امکان ابطال نشست از سمت سرور. تا انقضای
 * کوکی، همان توکن معتبر می‌ماند. برای «خروج از همه دستگاه‌ها» یا مسدود
 * کردن فوری یک حساب، به جدول نشست در دیتابیس نیاز است.
 */

export const SESSION_COOKIE = "kaventador_session";

/** هشت ساعت. */
const SESSION_TTL_SECONDS = 60 * 60 * 8;

export type Session = {
  userId: string;
  username: string;
  name: string;
  role: UserRole;
};

function sign(payload: string): string {
  return createHmac("sha256", serverEnv.AUTH_SECRET)
    .update(payload)
    .digest("base64url");
}

/** مقایسه امضا با زمان ثابت. */
function signatureMatches(payload: string, candidate: string): boolean {
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(candidate);

  return expected.length === given.length && timingSafeEqual(expected, given);
}

export async function createSession(userId: string): Promise<void> {
  const expiry = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = `${userId}.${expiry}`;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/** نشست فعلی، یا null اگر نبود، امضا باطل بود یا منقضی شده بود. */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  const lastDot = raw.lastIndexOf(".");
  if (lastDot === -1) return null;

  const payload = raw.slice(0, lastDot);
  const signature = raw.slice(lastDot + 1);

  if (!signatureMatches(payload, signature)) return null;

  const [userId, expiryText] = payload.split(".");
  const expiry = Number.parseInt(expiryText ?? "", 10);

  if (!userId || !Number.isFinite(expiry) || expiry < Date.now()) return null;

  const user = await findUserById(userId);
  /* حساب مسدود یا حذف‌شده نباید با کوکی معتبر هم وارد شود. */
  if (!user || user.status !== "active") return null;

  return {
    userId: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
  };
}

/** نشست فعلی به‌همراه رکورد کامل کاربر. */
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  return session ? findUserById(session.userId) : null;
}

/** فقط مدیر — در لِی‌اوت پنل و اکشن‌های نوشتن استفاده می‌شود. */
export async function getAdminSession(): Promise<Session | null> {
  const session = await getSession();
  return session?.role === "admin" ? session : null;
}
