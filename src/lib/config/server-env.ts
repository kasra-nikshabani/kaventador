import "server-only";
import { z } from "zod";

/**
 * متغیرهای محیطی سمت سرور.
 *
 * `import "server-only"` تضمین می‌کند اگر کسی اشتباهی این فایل را در یک
 * کامپوننت کلاینتی ایمپورت کند، build شکست بخورد — نه اینکه راز به
 * باندل مرورگر نشت کند.
 */
const serverEnvSchema = z.object({
  /** منبع داده فعال. مقدار `prisma` نیازمند DATABASE_URL است. */
  DATA_SOURCE: z.enum(["mock", "prisma"]).default("mock"),
  DATABASE_URL: z.string().optional(),

  /** کلید امضای کوکی نشست. در تولید اجباری است. */
  AUTH_SECRET: z.string().min(32).optional(),

  /**
   * حساب مدیر اولیه — فقط اسکریپت `prisma/seed.ts` می‌خواندشان.
   * عمداً پیش‌فرض ندارند: رمز پیش‌فرضِ شناخته‌شده بدترین نوع رمز است.
   */
  ADMIN_USERNAME: z.string().min(3).optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),

  /** ریشه ذخیره فایل‌های آپلودی. */
  UPLOAD_DIR: z.string().optional(),
});

const parsed = serverEnvSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(
    `پیکربندی محیط سرور نامعتبر است:\n${parsed.error.issues
      .map((issue) => `  • ${issue.path.join(".")}: ${issue.message}`)
      .join("\n")}`,
  );
}

/* گرفتن مقدار در یک ثابت: باریک‌سازی نوعِ حاصل از بررسی بالا داخل
   بدنه تابع‌ها حفظ نمی‌شود. */
const env = parsed.data;

/* وابستگی شرطی: انتخاب prisma بدون نشانی دیتابیس بی‌معناست. */
if (env.DATA_SOURCE === "prisma" && !env.DATABASE_URL) {
  throw new Error(
    "DATA_SOURCE روی prisma تنظیم شده ولی DATABASE_URL خالی است.",
  );
}

/**
 * کلید امضای نشست.
 *
 * در تولید اجباری است و پیش‌فرض ندارد — کلید پیش‌فرضِ عمومی یعنی هر کسی
 * می‌تواند کوکی نشست جعل کند و به‌جای هر کاربری وارد شود. در توسعه یک
 * مقدار ثابت و صریحاً ناامن استفاده می‌شود تا راه‌اندازی محلی ساده بماند.
 */
const DEV_ONLY_SECRET = "kaventador-development-secret-not-for-production";

/**
 * بررسی عمداً هنگام *استفاده* انجام می‌شود، نه هنگام بارگذاری ماژول.
 *
 * دلیلش: `next build` با NODE_ENV=production اجرا می‌شود ولی معمولاً
 * رازهای زمان اجرا را ندارد. اگر اینجا eager شکست می‌داد، ساختن پروژه
 * بدون کلید غیرممکن می‌شد — در حالی که خطر واقعی، *اجرا* بدون کلید است،
 * نه ساختن. پس همان لحظه که چیزی می‌خواهد امضا شود، شکست می‌خورد.
 */
function resolveAuthSecret(): string {
  if (env.AUTH_SECRET) return env.AUTH_SECRET;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "AUTH_SECRET تنظیم نشده است. در محیط تولید این کلید اجباری است؛ " +
        "با `openssl rand -base64 32` بسازید.",
    );
  }

  return DEV_ONLY_SECRET;
}

export const serverEnv = {
  ...env,
  get AUTH_SECRET(): string {
    return resolveAuthSecret();
  },
};
