"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  articleFormSchema,
  categoryFormSchema,
  collectErrors,
  courseFormSchema,
  userFormSchema,
  type DeleteState,
  type FormState,
} from "@/lib/actions/content.schema";
import { getAdminSession } from "@/lib/auth/session";
import {
  countCategoryUsage,
  findArticleById,
  findCourseById,
  insertArticle,
  insertCategory,
  insertCourse,
  nextId,
  patchArticle,
  patchCategory,
  patchCourse,
  patchUser,
  removeArticle,
  removeCategory,
  removeCourse,
  removeUser,
} from "@/lib/repositories";
import { formatNumber } from "@/lib/utils/format";
import type { CoursePricing } from "@/types";

/**
 * اکشن‌های نوشتن پنل مدیریت.
 *
 * هر اکشن قبل از هر کاری نشست را بررسی می‌کند: میان‌افزار فقط ناوبری را
 * می‌بندد و اکشن‌ها را نمی‌بیند، پس بدون این بررسی هر کسی می‌توانست
 * مستقیم به اکشن درخواست بفرستد.
 */
async function requireSession(): Promise<void> {
  const session = await getAdminSession();
  if (!session) redirect("/login?next=%2Fadmin");
}

/** همه مسیرهایی که با تغییر محتوا کهنه می‌شوند. */
function revalidateContent() {
  revalidatePath("/", "layout");
}

function readForm(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") values[key] = value;
  }
  return values;
}

const nowIso = () => new Date().toISOString().slice(0, 10);

/* ---------------------------------------------------------------
   دسته‌بندی
--------------------------------------------------------------- */

export async function saveCategoryAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();

  const id = String(formData.get("id") ?? "");
  const values = readForm(formData);
  const parsed = categoryFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      status: "error",
      message: "لطفاً خطاهای زیر را برطرف کنید.",
      errors: collectErrors(parsed.error.issues),
      values,
    };
  }

  if (id) {
    await patchCategory(id, parsed.data);
  } else {
    await insertCategory({ id: nextId("cat"), ...parsed.data });
  }

  revalidateContent();
  redirect("/admin/categories?saved=1");
}

export async function deleteCategoryAction(
  _previous: DeleteState,
  formData: FormData,
): Promise<DeleteState> {
  await requireSession();

  const id = String(formData.get("id") ?? "");
  const usage = await countCategoryUsage(id);

  /* حذف دسته‌بندی پرکاربرد، دوره و مقاله را بی‌سرپرست می‌کند. */
  if (usage > 0) {
    return {
      status: "error",
      message: `این دسته‌بندی به ${formatNumber(usage)} دوره یا مقاله وصل است. اول آن‌ها را جابه‌جا کنید.`,
    };
  }

  const removed = await removeCategory(id);
  if (!removed) return { status: "error", message: "دسته‌بندی پیدا نشد." };

  revalidateContent();
  return { status: "success" };
}

/* ---------------------------------------------------------------
   مقاله
--------------------------------------------------------------- */

export async function saveArticleAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();

  const id = String(formData.get("id") ?? "");
  const values = readForm(formData);
  const parsed = articleFormSchema.safeParse({
    ...values,
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

  const data = parsed.data;

  if (id) {
    const existing = await findArticleById(id);
    if (!existing) return { status: "error", message: "مقاله پیدا نشد." };

    await patchArticle(id, {
      ...data,
      isFeatured: Boolean(data.isFeatured),
      updatedAt: nowIso(),
    });
  } else {
    await insertArticle({
      id: nextId("article"),
      ...data,
      isFeatured: Boolean(data.isFeatured),
      cover: "",
      authorId: "person-kasra",
      viewCount: 0,
      publishedAt: nowIso(),
      updatedAt: nowIso(),
    });
  }

  revalidateContent();
  redirect("/admin/articles?saved=1");
}

export async function deleteArticleAction(
  _previous: DeleteState,
  formData: FormData,
): Promise<DeleteState> {
  await requireSession();

  const removed = await removeArticle(String(formData.get("id") ?? ""));
  if (!removed) return { status: "error", message: "مقاله پیدا نشد." };

  revalidateContent();
  return { status: "success" };
}

/* ---------------------------------------------------------------
   دوره
--------------------------------------------------------------- */

export async function saveCourseAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();

  const id = String(formData.get("id") ?? "");
  const values = readForm(formData);
  const parsed = courseFormSchema.safeParse({
    ...values,
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
    /* دوره تازه بدون فصل ساخته می‌شود؛ ویرایش سرفصل قابلیت جداگانه‌ای است. */
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

  revalidateContent();
  redirect("/admin/courses?saved=1");
}

export async function deleteCourseAction(
  _previous: DeleteState,
  formData: FormData,
): Promise<DeleteState> {
  await requireSession();

  const removed = await removeCourse(String(formData.get("id") ?? ""));
  if (!removed) return { status: "error", message: "دوره پیدا نشد." };

  revalidateContent();
  return { status: "success" };
}

/* ---------------------------------------------------------------
   کاربر
--------------------------------------------------------------- */

export async function saveUserAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  await requireSession();

  const id = String(formData.get("id") ?? "");
  const values = readForm(formData);
  const parsed = userFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      status: "error",
      message: "لطفاً خطاهای زیر را برطرف کنید.",
      errors: collectErrors(parsed.error.issues),
      values,
    };
  }

  const updated = await patchUser(id, parsed.data);
  if (!updated) return { status: "error", message: "کاربر پیدا نشد." };

  revalidatePath("/admin/users");
  redirect("/admin/users?saved=1");
}

export async function deleteUserAction(
  _previous: DeleteState,
  formData: FormData,
): Promise<DeleteState> {
  await requireSession();

  const removed = await removeUser(String(formData.get("id") ?? ""));
  if (!removed) return { status: "error", message: "کاربر پیدا نشد." };

  revalidatePath("/admin/users");
  return { status: "success" };
}
