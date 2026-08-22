import { z } from "zod";

/**
 * اسکیمای فرم تماس.
 *
 * عمداً از فایل اکشن جداست: یک فایل `"use server"` فقط اجازه دارد
 * تابع async صادر کند، پس اسکیما، تایپ‌ها و مقدار اولیه باید اینجا
 * زندگی کنند تا هم سرور و هم کلاینت بتوانند از آن‌ها استفاده کنند.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "نام باید دست‌کم ۳ نویسه باشد.")
    .max(80, "نام نباید بیش از ۸۰ نویسه باشد."),
  email: z
    .string()
    .trim()
    .min(1, "ایمیل را وارد کنید.")
    .email("فرمت ایمیل معتبر نیست."),
  subject: z.enum(["question", "cooperation", "suggestion", "bug", "other"], {
    message: "یک موضوع معتبر انتخاب کنید.",
  }),
  message: z
    .string()
    .trim()
    .min(20, "پیام باید دست‌کم ۲۰ نویسه باشد.")
    .max(2000, "پیام نباید بیش از ۲٬۰۰۰ نویسه باشد."),
  /* تله ربات: کاربر واقعی این فیلد پنهان را پر نمی‌کند. */
  website: z.string().max(0).optional(),
});

export type ContactFields = z.infer<typeof contactSchema>;

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  /** خطای هر فیلد، برای نمایش زیر همان ورودی. */
  errors?: Partial<Record<keyof ContactFields, string>>;
  /** مقادیر واردشده تا پس از خطا پاک نشوند. */
  values?: Record<string, string>;
};

export const CONTACT_INITIAL_STATE: ContactFormState = { status: "idle" };
