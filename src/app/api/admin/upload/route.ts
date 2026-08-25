import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import {
  ALLOWED_VIDEO_TYPES,
  MAX_VIDEO_BYTES,
  saveVideo,
} from "@/lib/media/storage";

/**
 * آپلود ویدیو.
 *
 * عمداً Route Handler است نه Server Action: اکشن‌ها محدودیت حجم بدنه
 * دارند و برای فایل چندصدمگابایتی مناسب نیستند.
 *
 * نشست اینجا هم بررسی می‌شود؛ `proxy.ts` فقط مسیرهای `/admin` را
 * می‌بیند و این مسیر زیر `/api` است.
 *
 * مدرس هم اجازه آپلود دارد. فایل در این مرحله به هیچ درسی وصل نیست —
 * فقط روی دیسک می‌نشیند و نشانی‌اش برمی‌گردد. اتصال واقعی موقع ذخیره
 * درس انجام می‌شود و آنجا مالکیت دوره بررسی می‌شود.
 */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== "admin" && session.role !== "instructor")) {
    return NextResponse.json({ error: "دسترسی ندارید." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "فایلی انتخاب نشده." }, { status: 400 });
  }

  if (!ALLOWED_VIDEO_TYPES.includes(file.type as (typeof ALLOWED_VIDEO_TYPES)[number])) {
    return NextResponse.json(
      { error: "فقط فایل MP4 یا WebM پذیرفته می‌شود." },
      { status: 415 },
    );
  }

  if (file.size > MAX_VIDEO_BYTES) {
    return NextResponse.json(
      { error: "حجم فایل بیش از ۵۰۰ مگابایت است." },
      { status: 413 },
    );
  }

  try {
    const stored = await saveVideo(file);
    return NextResponse.json(stored, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "ذخیره فایل روی سرور ناموفق بود." },
      { status: 500 },
    );
  }
}
