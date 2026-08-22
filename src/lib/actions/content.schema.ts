import { z } from "zod";
import { toPersianDigits } from "@/lib/utils/format";

/**
 * اسکیماهای فرم‌های پنل مدیریت.
 *
 * جدا از فایل‌های `"use server"` نگه داشته می‌شوند چون آن فایل‌ها فقط
 * اجازه صدور تابع async دارند.
 */

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const statusEnum = z.enum(["draft", "published", "archived"], {
  message: "وضعیت معتبر نیست.",
});

/* اعداد داخل پیام خطا هم باید فارسی باشند؛ درج مستقیم عدد
   جاوااسکریپت رقم لاتین تولید می‌کند. */
const requiredText = (label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, `${label} باید دست‌کم ${toPersianDigits(min)} نویسه باشد.`)
    .max(max, `${label} نباید بیش از ${toPersianDigits(max)} نویسه باشد.`);

/** فهرست جداشده با ویرگول یا خط جدید → آرایه. */
export const listFromText = z
  .string()
  .optional()
  .transform((value) =>
    (value ?? "")
      .split(/[\n،,]/)
      .map((item) => item.trim())
      .filter(Boolean),
  );

export const categoryFormSchema = z.object({
  title: requiredText("عنوان", 2, 60),
  titleEn: z
    .string()
    .trim()
    .min(2, "نام انگلیسی باید دست‌کم ۲ نویسه باشد.")
    .max(40, "نام انگلیسی نباید بیش از ۴۰ نویسه باشد."),
  slug: z
    .string()
    .trim()
    .min(2, "اسلاگ باید دست‌کم ۲ نویسه باشد.")
    .regex(slugPattern, "اسلاگ فقط می‌تواند حروف کوچک لاتین، عدد و خط تیره باشد."),
  description: requiredText("توضیح", 10, 300),
  icon: z.string().trim().min(1, "کلید آیکون را وارد کنید."),
  color: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "رنگ باید به فرمت hex شش‌رقمی باشد."),
  order: z.coerce
    .number({ message: "ترتیب باید عدد باشد." })
    .int("ترتیب باید عدد صحیح باشد.")
    .min(1, "ترتیب باید دست‌کم ۱ باشد."),
});

export const articleFormSchema = z.object({
  title: requiredText("عنوان", 5, 120),
  slug: z
    .string()
    .trim()
    .min(2, "اسلاگ باید دست‌کم ۲ نویسه باشد.")
    .regex(slugPattern, "اسلاگ فقط می‌تواند حروف کوچک لاتین، عدد و خط تیره باشد."),
  excerpt: requiredText("خلاصه", 20, 300),
  content: requiredText("متن مقاله", 100, 20000),
  categoryId: z.string().trim().min(1, "دسته‌بندی را انتخاب کنید."),
  status: statusEnum,
  readingMinutes: z.coerce
    .number({ message: "زمان مطالعه باید عدد باشد." })
    .int()
    .min(1, "زمان مطالعه باید دست‌کم ۱ دقیقه باشد.")
    .max(120, "زمان مطالعه نباید بیش از ۱۲۰ دقیقه باشد."),
  isFeatured: z.coerce.boolean().optional(),
  tags: listFromText,
});

export const courseFormSchema = z.object({
  title: requiredText("عنوان", 5, 120),
  titleEn: z.string().trim().min(2, "نام انگلیسی را وارد کنید.").max(60),
  slug: z
    .string()
    .trim()
    .min(2, "اسلاگ باید دست‌کم ۲ نویسه باشد.")
    .regex(slugPattern, "اسلاگ فقط می‌تواند حروف کوچک لاتین، عدد و خط تیره باشد."),
  excerpt: requiredText("خلاصه", 20, 300),
  description: requiredText("توضیح کامل", 50, 3000),
  categoryId: z.string().trim().min(1, "دسته‌بندی را انتخاب کنید."),
  instructorId: z.string().trim().min(1, "مدرس را انتخاب کنید."),
  level: z.enum(["beginner", "intermediate", "advanced"], {
    message: "سطح معتبر نیست.",
  }),
  status: statusEnum,
  progress: z.enum(["upcoming", "ongoing", "completed"], {
    message: "وضعیت برگزاری معتبر نیست.",
  }),
  /* فقط برای دوره در حال برگزاری یا به‌زودی معنا دارد؛ خالی مجاز است. */
  nextReleaseAt: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "تاریخ باید به فرمت YYYY-MM-DD باشد.")
    .optional()
    .or(z.literal("")),
  isFeatured: z.coerce.boolean().optional(),
  prerequisites: listFromText,
  outcomes: listFromText,
  tags: listFromText,
});

export const userFormSchema = z.object({
  name: requiredText("نام", 3, 80),
  email: z.string().trim().email("فرمت ایمیل معتبر نیست."),
  role: z.enum(["admin", "instructor", "student"], {
    message: "نقش معتبر نیست.",
  }),
  status: z.enum(["active", "inactive", "banned"], {
    message: "وضعیت معتبر نیست.",
  }),
});

/* ---------------------------------------------------------------
   وضعیت مشترک فرم‌ها
--------------------------------------------------------------- */

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

export const FORM_INITIAL_STATE: FormState = { status: "idle" };

export type DeleteState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export const DELETE_INITIAL_STATE: DeleteState = { status: "idle" };

/** تبدیل خطاهای zod به نگاشت ساده فیلد → پیام. */
export function collectErrors(issues: z.core.$ZodIssue[]): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const issue of issues) {
    const field = issue.path[0];
    if (typeof field === "string" && !(field in errors)) {
      errors[field] = issue.message;
    }
  }

  return errors;
}
