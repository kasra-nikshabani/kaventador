import { defineConfig } from "prisma/config";

/**
 * پیکربندی Prisma.
 *
 * از نسخه ۷، نشانی اتصال دیگر داخل `schema.prisma` نوشته نمی‌شود و
 * اینجا می‌آید. اسکیما فقط شکل داده را توصیف می‌کند و از محیط اجرا
 * بی‌خبر است — که تفکیک درستی است.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",

  datasource: {
    /* فقط برای دستورهای migrate و introspect لازم است.
       خودِ کلاینت در زمان اجرا adapter می‌گیرد. */
    url: process.env.DATABASE_URL,
  },

  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
});
