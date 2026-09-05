import { existsSync } from "node:fs";
import { defineConfig } from "prisma/config";

/**
 * پیکربندی Prisma.
 *
 * از نسخه ۷، نشانی اتصال دیگر داخل `schema.prisma` نوشته نمی‌شود و
 * اینجا می‌آید. اسکیما فقط شکل داده را توصیف می‌کند و از محیط اجرا
 * بی‌خبر است — که تفکیک درستی است.
 *
 * ⚠️ نسخه ۷ دیگر `.env` را خودش نمی‌خواند. بدون این چند خط،
 * `prisma migrate` با خطای «datasource.url لازم است» می‌ایستد در حالی
 * که فایل `.env` سر جایش هست. از قابلیت داخلی Node استفاده می‌کنیم تا
 * وابستگی تازه‌ای اضافه نشود.
 */
if (!process.env.DATABASE_URL && existsSync(".env")) {
  process.loadEnvFile(".env");
}

export default defineConfig({
  schema: "prisma/schema.prisma",

  datasource: {
    /* فقط برای دستورهای migrate و introspect لازم است.
       خودِ کلاینت در زمان اجرا adapter می‌گیرد. */
    url: process.env.DATABASE_URL,
  },

  migrations: {
    /* `--conditions=react-server` لازم است: اسکریپت به `hashPassword`
       نیاز دارد و آن فایل `import "server-only"` دارد. این شرط، همان
       ماژول را به نسخه خالیِ خودِ بسته وصل می‌کند — یعنی نگهبان از
       کد برداشته نمی‌شود، فقط بیرون از Next بی‌اثر می‌شود. */
    seed: "npx tsx --conditions=react-server prisma/seed.ts",
  },
});
