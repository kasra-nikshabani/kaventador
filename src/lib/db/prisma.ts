import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { serverEnv } from "@/lib/config/server-env";

/**
 * کلاینت Prisma — یک نمونه برای کل فرایند.
 *
 * چرا روی `globalThis`؟ در حالت توسعه، هر بار که Next ماژولی را دوباره
 * بارگذاری می‌کند این فایل از نو اجرا می‌شود. بدون این نگهدارنده، هر
 * ذخیره‌ی فایل یک استخر اتصال تازه می‌سازد و بعد از چند دقیقه کار،
 * PostgreSQL با «too many connections» درخواست‌ها را رد می‌کند.
 *
 * در تولید فقط یک بار ساخته می‌شود و این شرط بی‌اثر است.
 *
 * از نسخه ۷، کلاینت به‌جای موتور داخلی یک driver adapter می‌گیرد؛
 * `PrismaPg` همان درایور رسمی PostgreSQL است.
 */

const globalForPrisma = globalThis as unknown as {
  kaventadorPrisma?: PrismaClient;
};

function createClient(): PrismaClient {
  const connectionString = serverEnv.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL تنظیم نشده است. برای استفاده از Prisma لازم است — " +
        "یا `DATA_SOURCE=mock` بگذارید تا داده از حافظه خوانده شود.",
    );
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
    /* در توسعه فقط خطاها و هشدارها؛ لاگ هر کوئری ترمینال را غرق می‌کند. */
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });
}

export const prisma: PrismaClient =
  globalForPrisma.kaventadorPrisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.kaventadorPrisma = prisma;
}
