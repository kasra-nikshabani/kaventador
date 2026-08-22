"use server";

import {
  contactSchema,
  type ContactFormState,
} from "@/lib/actions/contact.schema";

/**
 * ثبت پیام تماس.
 *
 * اعتبارسنجی مرورگر فقط برای راحتی کاربر است و قابل دور زدن؛
 * این تابع مرز واقعی اعتماد است و ورودی را دوباره اعتبارسنجی می‌کند.
 *
 * توجه: این فایل `"use server"` است، پس فقط اجازه دارد تابع async
 * صادر کند. اسکیما، تایپ‌ها و مقدار اولیه در `contact.schema.ts` هستند.
 */
export async function submitContactForm(
  _previous: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
    website: String(formData.get("website") ?? ""),
  };

  const parsed = contactSchema.safeParse(raw);

  if (!parsed.success) {
    const errors: ContactFormState["errors"] = {};

    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      /* فقط اولین خطای هر فیلد نگه داشته می‌شود. */
      if (typeof field === "string" && !(field in errors)) {
        errors[field as keyof typeof errors] = issue.message;
      }
    }

    return {
      status: "error",
      message: "لطفاً خطاهای زیر را برطرف کنید.",
      errors,
      values: raw,
    };
  }

  /* اگر تله ربات پر شده بود، وانمود می‌کنیم موفق بوده تا ربات متوجه
     فیلتر شدن نشود، ولی چیزی ثبت نمی‌شود. */
  if (parsed.data.website) {
    return { status: "success", message: "پیام شما ثبت شد." };
  }

  /* TODO(مرحله اتصال داده): ذخیره در پایگاه داده و ارسال ایمیل اطلاع‌رسانی. */

  return {
    status: "success",
    message:
      "پیام شما با موفقیت ثبت شد. حداکثر تا ۴۸ ساعت آینده پاسخ می‌دهیم.",
  };
}
