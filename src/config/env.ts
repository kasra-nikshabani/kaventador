import { z } from "zod";

/**
 * متغیرهای محیطی عمومی.
 *
 * فقط چیزهایی که بی‌خطرند در مرورگر دیده شوند. مقدارشان در زمان build
 * داخل باندل کلاینت جاسازی می‌شود، پس هرگز راز اینجا نگذارید —
 * برای آن `lib/config/server-env.ts` هست.
 *
 * توجه: `process.env.NEXT_PUBLIC_*` باید کامل و بدون متغیر نوشته شود؛
 * Next آن را به صورت متنی جایگزین می‌کند و `process.env[key]` کار نمی‌کند.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url("NEXT_PUBLIC_SITE_URL باید یک نشانی کامل باشد.")
    .default("http://localhost:3000"),
  NEXT_PUBLIC_CONTACT_EMAIL: z
    .string()
    .email("NEXT_PUBLIC_CONTACT_EMAIL باید ایمیل معتبر باشد.")
    .default("kasranikshabani@yahoo.com"),
});

const parsed = publicEnvSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
});

if (!parsed.success) {
  /* پیکربندی غلط باید همان اول ساخت شکست بخورد، نه وسط کار کاربر. */
  throw new Error(
    `پیکربندی محیط نامعتبر است:\n${parsed.error.issues
      .map((issue) => `  • ${issue.path.join(".")}: ${issue.message}`)
      .join("\n")}`,
  );
}

export const publicEnv = parsed.data;
