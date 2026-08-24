import { createWriteStream } from "node:fs";
import { mkdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { serverEnv } from "@/lib/config/server-env";

/**
 * ذخیره‌سازی فایل روی سرور خودمان.
 *
 * فایل‌ها عمداً بیرون از `public/` می‌نشینند:
 *  • `public/` دارایی build است، نه داده زمان اجرا.
 *  • با سرو کردن از مسیر اختصاصی، بعداً می‌توان کنترل دسترسی گذاشت
 *    (مثلاً «فقط دانشجوی ثبت‌نام‌کرده»). فایل داخل public همیشه عمومی است.
 *
 * ⚠️ محدودیت: این راهکار برای یک سرور تک‌نمونه‌ای است. اگر روزی سایت
 * روی چند سرور یا محیط بدون دیسک ماندگار (مثل Vercel) مستقر شود، باید
 * به فضای ابری مهاجرت کند — فقط همین فایل عوض می‌شود.
 */

export const UPLOAD_ROOT =
  serverEnv.UPLOAD_DIR ?? path.join(process.cwd(), "storage", "uploads");

/** حداکثر حجم ویدیو: ۵۰۰ مگابایت. */
export const MAX_VIDEO_BYTES = 500 * 1024 * 1024;

export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"] as const;

const EXTENSION_BY_TYPE: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
};

export type StoredFile = {
  /** نشانی عمومی فایل، برای ذخیره در داده درس. */
  url: string;
  sizeBytes: number;
};

/**
 * نام فایل امن می‌سازد.
 *
 * نام اصلی کاربر هرگز استفاده نمی‌شود: می‌تواند شامل `../`، نویسه‌های
 * کنترلی یا نام‌های تکراری باشد. فقط پسوند از نوع MIME تأییدشده می‌آید.
 */
function safeFileName(mimeType: string): string {
  const extension = EXTENSION_BY_TYPE[mimeType] ?? "bin";
  const unique = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `${unique}.${extension}`;
}

export async function saveVideo(file: File): Promise<StoredFile> {
  const directory = path.join(UPLOAD_ROOT, "videos");
  await mkdir(directory, { recursive: true });

  const fileName = safeFileName(file.type);
  const absolutePath = path.join(directory, fileName);

  /* استریم می‌نویسیم تا کل فایل همزمان در حافظه نماند. */
  await pipeline(
    Readable.fromWeb(file.stream() as Parameters<typeof Readable.fromWeb>[0]),
    createWriteStream(absolutePath),
  );

  const written = await stat(absolutePath);

  return {
    url: `/api/media/videos/${fileName}`,
    sizeBytes: written.size,
  };
}

/** حذف فایل قبلی هنگام جایگزینی یا حذف درس. */
export async function deleteStoredFile(url: string | undefined): Promise<void> {
  if (!url?.startsWith("/api/media/")) return;

  const relative = url.replace("/api/media/", "");
  const absolutePath = resolveWithinUploads(relative);
  if (!absolutePath) return;

  try {
    await unlink(absolutePath);
  } catch {
    /* فایل از قبل نبوده — مشکلی نیست. */
  }
}

/**
 * مسیر نسبی را به مسیر مطلق داخل پوشه آپلود تبدیل می‌کند.
 *
 * اگر مسیر از پوشه آپلود بیرون بزند (حمله path traversal با `../`)،
 * null برمی‌گردد. این تنها دروازه دسترسی به فایل‌سیستم است.
 */
export function resolveWithinUploads(relativePath: string): string | null {
  const absolutePath = path.resolve(UPLOAD_ROOT, relativePath);
  const root = path.resolve(UPLOAD_ROOT);

  if (absolutePath !== root && !absolutePath.startsWith(root + path.sep)) {
    return null;
  }

  return absolutePath;
}
