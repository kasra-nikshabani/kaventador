import "server-only";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  collectErrors,
  courseFormSchema,
  type FormState,
} from "@/lib/actions/content.schema";
import {
  findCourseById,
  insertCourse,
  nextId,
  patchCourse,
} from "@/lib/repositories";
import type { CoursePricing } from "@/types";

/**
 * نوشتن دوره — مشترک میان پنل ادمین و پنل مدرس.
 *
 * عمداً فایل `"use server"` نیست: اینجا فقط یک تابع کمکی است، و
 * اکشن‌های واقعی (که مرورگر به آن‌ها درخواست می‌فرستد) در `content.ts`
 * و `instructor.ts` می‌مانند. اگر این فایل اکشن می‌شد، هر کسی می‌توانست
 * مستقیم صدایش بزند و از نگهبان دسترسی رد شود.
 */

const nowIso = () => new Date().toISOString().slice(0, 10);

export interface PersistCourseOptions {
  /**
   * مدرسی که به‌زور روی دوره می‌نشیند. وقتی مدرس خودش فرم را پر می‌کند
   * این مقدار از نشست می‌آید و مقدار فرم نادیده گرفته می‌شود — وگرنه
   * می‌شد با دست‌کاری فرم، دوره را به نام کس دیگری زد.
   */
  forcedInstructorId?: string;
  /** مسیر بازگشت پس از ذخیره موفق. */
  redirectTo: string;
}

export async function persistCourse(
  formData: FormData,
  { forcedInstructorId, redirectTo }: PersistCourseOptions,
): Promise<FormState> {
  const id = String(formData.get("id") ?? "");

  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") values[key] = value;
  }

  const parsed = courseFormSchema.safeParse({
    ...values,
    ...(forcedInstructorId ? { instructorId: forcedInstructorId } : {}),
    isFeatured: formData.get("isFeatured") === "on",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "لطفاً خطاهای زیر را برطرف کنید.",
      errors: collectErrors(parsed.error.issues),
      values,
    };
  }

  /* رشته خالی نباید به عنوان تاریخ ذخیره شود. */
  const { nextReleaseAt, pricingType, priceAmount, priceOriginal, ...rest } =
    parsed.data;

  /* سه فیلد تخت فرم به یک شیء قیمت‌گذاری تبدیل می‌شوند؛
     مدل دامنه نباید شکل فرم HTML را بازتاب دهد. */
  const pricing: CoursePricing =
    pricingType === "paid"
      ? {
          type: "paid",
          amount: Number(priceAmount),
          originalAmount: priceOriginal ? Number(priceOriginal) : undefined,
        }
      : { type: "free" };

  const data = { ...rest, pricing, nextReleaseAt: nextReleaseAt || undefined };

  if (id) {
    const existing = await findCourseById(id);
    if (!existing) return { status: "error", message: "دوره پیدا نشد." };

    await patchCourse(id, {
      ...data,
      isFeatured: Boolean(data.isFeatured),
      updatedAt: nowIso(),
    });
  } else {
    /* دوره تازه بدون فصل ساخته می‌شود؛ سرفصل جای دیگری ویرایش می‌شود. */
    await insertCourse({
      id: nextId("course"),
      ...data,
      isFeatured: Boolean(data.isFeatured),
      cover: "",
      durationMinutes: 0,
      lessonCount: 0,
      studentCount: 0,
      rating: 0,
      ratingCount: 0,
      chapters: [],
      projects: [],
      publishedAt: nowIso(),
      updatedAt: nowIso(),
    });
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}
