import { z } from "zod";
import { toPersianDigits } from "@/lib/utils/format";

/** اسکیماهای ویرایشگر سرفصل. جدا از فایل `"use server"`. */

export const chapterFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, `عنوان فصل باید دست‌کم ${toPersianDigits(3)} نویسه باشد.`)
    .max(120, `عنوان فصل نباید بیش از ${toPersianDigits(120)} نویسه باشد.`),
  description: z
    .string()
    .trim()
    .max(300, `توضیح فصل نباید بیش از ${toPersianDigits(300)} نویسه باشد.`)
    .optional(),
});

export const lessonFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, `عنوان درس باید دست‌کم ${toPersianDigits(3)} نویسه باشد.`)
    .max(160, `عنوان درس نباید بیش از ${toPersianDigits(160)} نویسه باشد.`),
  type: z.enum(["video", "article", "quiz", "project"], {
    message: "نوع درس معتبر نیست.",
  }),
  durationMinutes: z.coerce
    .number({ message: "مدت باید عدد باشد." })
    .int("مدت باید عدد صحیح باشد.")
    .min(1, `مدت باید دست‌کم ${toPersianDigits(1)} دقیقه باشد.`)
    .max(600, `مدت نباید بیش از ${toPersianDigits(600)} دقیقه باشد.`),
  isFree: z.coerce.boolean().optional(),
  /* نشانی ویدیو از مسیر آپلود می‌آید، نه ورودی آزاد کاربر. */
  videoUrl: z
    .string()
    .trim()
    .regex(
      /^\/api\/media\/videos\/[A-Za-z0-9._-]+$/,
      "نشانی ویدیو معتبر نیست.",
    )
    .optional()
    .or(z.literal("")),
  videoSizeBytes: z.coerce.number().int().min(0).optional(),
});

export type CurriculumState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
  /** شناسه موردی که خطا داشته، تا فرم درست باز بماند. */
  scopeId?: string;
};

export const CURRICULUM_INITIAL_STATE: CurriculumState = { status: "idle" };
