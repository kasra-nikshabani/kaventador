"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { collectErrors } from "@/lib/actions/content.schema";
import { profileSchema, type ProfileState } from "@/lib/actions/profile.schema";
import { getSession } from "@/lib/auth/session";
import { findUserByEmail, patchUser } from "@/lib/repositories";

/**
 * ویرایش پروفایل کاربر.
 *
 * نام کاربری و نقش عمداً قابل ویرایش نیستند: نام کاربری هویت ورود است و
 * نقش فقط از پنل مدیریت عوض می‌شود — وگرنه هر کاربری می‌توانست خودش را
 * مدیر کند.
 */
export async function updateProfileAction(
  _previous: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const session = await getSession();
  if (!session) redirect("/login");

  const parsed = profileSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "لطفاً خطاهای زیر را برطرف کنید.",
      errors: collectErrors(parsed.error.issues),
    };
  }

  /* ایمیل باید یکتا بماند، ولی ایمیل فعلی خودِ کاربر تداخل نیست. */
  const owner = await findUserByEmail(parsed.data.email);
  if (owner && owner.id !== session.userId) {
    return {
      status: "error",
      message: "این ایمیل قبلاً برای حساب دیگری ثبت شده است.",
      errors: { email: "ایمیل در دسترس نیست." },
    };
  }

  await patchUser(session.userId, parsed.data);

  revalidatePath("/dashboard", "layout");
  revalidatePath("/", "layout");

  return { status: "success", message: "پروفایل به‌روز شد." };
}
