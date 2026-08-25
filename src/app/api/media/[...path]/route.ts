import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { NextResponse, type NextRequest } from "next/server";
import { resolveWithinUploads } from "@/lib/media/storage";

/**
 * سرو فایل‌های آپلودشده.
 *
 * چرا مسیر اختصاصی به‌جای گذاشتن فایل در `public/`؟
 *  • پشتیبانی از هدر Range: بدون آن، جابه‌جایی روی نوار زمان ویدیو کار
 *    نمی‌کند و مرورگر مجبور است کل فایل را دانلود کند.
 *  • جای واحد برای افزودن کنترل دسترسی در آینده.
 */

const CONTENT_TYPES: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await context.params;

  const absolutePath = resolveWithinUploads(segments.join("/"));
  if (!absolutePath) {
    /* تلاش برای بیرون رفتن از پوشه آپلود. */
    return new NextResponse("Forbidden", { status: 403 });
  }

  let fileStat;
  try {
    fileStat = await stat(absolutePath);
  } catch {
    return new NextResponse("Not Found", { status: 404 });
  }

  if (!fileStat.isFile()) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const contentType =
    CONTENT_TYPES[path.extname(absolutePath).toLowerCase()] ??
    "application/octet-stream";

  const total = fileStat.size;
  const range = request.headers.get("range");

  const baseHeaders = {
    "Content-Type": contentType,
    "Accept-Ranges": "bytes",
    "Cache-Control": "private, max-age=3600",
  };

  /* بدون Range: کل فایل. */
  if (!range) {
    const stream = createReadStream(absolutePath);
    return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
      status: 200,
      headers: { ...baseHeaders, "Content-Length": String(total) },
    });
  }

  const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  if (!match) {
    return new NextResponse("Range Not Satisfiable", {
      status: 416,
      headers: { "Content-Range": `bytes */${total}` },
    });
  }

  const [, rawStart, rawEnd] = match;
  const start = rawStart ? Number.parseInt(rawStart, 10) : 0;
  const end = rawEnd ? Number.parseInt(rawEnd, 10) : total - 1;

  if (
    Number.isNaN(start) ||
    Number.isNaN(end) ||
    start > end ||
    start >= total
  ) {
    return new NextResponse("Range Not Satisfiable", {
      status: 416,
      headers: { "Content-Range": `bytes */${total}` },
    });
  }

  const safeEnd = Math.min(end, total - 1);
  const stream = createReadStream(absolutePath, { start, end: safeEnd });

  return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
    status: 206,
    headers: {
      ...baseHeaders,
      "Content-Range": `bytes ${start}-${safeEnd}/${total}`,
      "Content-Length": String(safeEnd - start + 1),
    },
  });
}
