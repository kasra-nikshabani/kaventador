import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import {
  ALLOWED_IMAGE_TYPES,
  deleteStoredFile,
  MAX_IMAGE_BYTES,
  saveAvatar,
} from "@/lib/media/storage";
import { findUserById, patchUser } from "@/lib/repositories";

/**
 * آپلود تصویر پروفایل.
 *
 * برخلاف مسیر آپلود ویدیو، این یکی برای هر کاربر واردشده باز است — ولی
 * کاربر فقط می‌تواند تصویر *حساب خودش* را عوض کند: شناسه از نشست خوانده
 * می‌شود، نه از بدنه درخواست. وگرنه هر کسی می‌توانست آواتار دیگری را
 * تغییر دهد.
 */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "وارد نشده‌اید." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "فایلی انتخاب نشده." }, { status: 400 });
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return NextResponse.json(
      { error: "فقط تصویر JPG، PNG یا WebP پذیرفته می‌شود." },
      { status: 415 },
    );
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: "حجم تصویر بیش از ۳ مگابایت است." },
      { status: 413 },
    );
  }

  try {
    const stored = await saveAvatar(file);

    /* تصویر قبلی از دیسک پاک می‌شود تا فایل بی‌صاحب نماند.
       تصویرهای داخل public/ (مثل آواتار اولیه بنیان‌گذار) دست نمی‌خورند
       چون deleteStoredFile فقط مسیرهای /api/media را می‌شناسد. */
    const current = await findUserById(session.userId);
    await deleteStoredFile(current?.avatar);

    await patchUser(session.userId, { avatar: stored.url });

    return NextResponse.json(stored, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "ذخیره تصویر ناموفق بود." },
      { status: 500 },
    );
  }
}
