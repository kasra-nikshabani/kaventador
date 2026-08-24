import "server-only";

/**
 * محدودکننده نرخ تلاش ورود.
 *
 * بدون این، حمله حدس رمز فقط به سرعت شبکه محدود است. scrypt خودش
 * هر تلاش را گران می‌کند، ولی محدودیت صریح لازم است.
 *
 * ⚠️ حافظه‌ای و تک‌نمونه‌ای است: با ری‌استارت سرور پاک می‌شود و بین چند
 * نمونه سرور مشترک نیست. برای استقرار چندسروری باید به Redis برود.
 */

type Attempt = { count: number; firstAt: number; blockedUntil?: number };

const globalLimiter = globalThis as unknown as {
  __kaventadorLoginAttempts?: Map<string, Attempt>;
};

const attempts = (globalLimiter.__kaventadorLoginAttempts ??= new Map());

/** پنجره شمارش: ۱۵ دقیقه. */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;
/** مدت قفل پس از عبور از سقف: ۱۵ دقیقه. */
const BLOCK_MS = 15 * 60 * 1000;

export type RateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

/** بررسی می‌کند این کلید (نام کاربری) اجازه تلاش تازه دارد یا نه. */
export function checkLoginRate(key: string): RateLimitResult {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record) return { allowed: true };

  if (record.blockedUntil && record.blockedUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((record.blockedUntil - now) / 1000),
    };
  }

  /* پنجره تمام شده — شمارش از نو. */
  if (now - record.firstAt > WINDOW_MS) {
    attempts.delete(key);
  }

  return { allowed: true };
}

/** ثبت یک تلاش ناموفق. */
export function recordFailedLogin(key: string): void {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now - record.firstAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAt: now });
    return;
  }

  record.count += 1;
  if (record.count >= MAX_ATTEMPTS) {
    record.blockedUntil = now + BLOCK_MS;
  }
}

/** ورود موفق، شمارنده را پاک می‌کند. */
export function clearLoginAttempts(key: string): void {
  attempts.delete(key);
}
