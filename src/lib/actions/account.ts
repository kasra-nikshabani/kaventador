"use server";

import { redirect } from "next/navigation";
import {
  loginSchema,
  signupSchema,
  type AccountFormState,
} from "@/lib/actions/account.schema";
import { collectErrors } from "@/lib/actions/content.schema";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  checkLoginRate,
  clearLoginAttempts,
  recordFailedLogin,
} from "@/lib/auth/rate-limit";
import { createSession, destroySession } from "@/lib/auth/session";
import {
  findUserByEmail,
  findUserByUsername,
  insertUser,
  nextId,
  patchUser,
} from "@/lib/repositories";
import { formatNumber } from "@/lib/utils/format";

/**
 * فقط مسیرهای داخلی برای بازگشت پس از ورود پذیرفته می‌شوند.
 *
 * بدون این بررسی، `?next=https://evil.example` کاربر را پس از ورود به
 * سایت مهاجم می‌فرستد — حمله open redirect.
 */
function safeRedirectTarget(next: string | undefined): string {
  if (!next) return "/";
  if (!next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

export async function signupAction(
  _previous: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    username: String(formData.get("username") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    passwordConfirm: String(formData.get("passwordConfirm") ?? ""),
    website: String(formData.get("website") ?? ""),
  };

  const parsed = signupSchema.safeParse(raw);

  /* مقادیر برگشتی عمداً رمز عبور را شامل نمی‌شوند. */
  const echo = { name: raw.name, username: raw.username, email: raw.email };

  if (!parsed.success) {
    return {
      status: "error",
      message: "لطفاً خطاهای زیر را برطرف کنید.",
      errors: collectErrors(parsed.error.issues),
      values: echo,
    };
  }

  /* تله ربات پر شده — وانمود می‌کنیم موفق بوده ولی چیزی ساخته نمی‌شود. */
  if (parsed.data.website) redirect("/");

  const { name, username, email, password } = parsed.data;

  if (await findUserByUsername(username)) {
    return {
      status: "error",
      message: "این نام کاربری قبلاً گرفته شده است.",
      errors: { username: "این نام کاربری در دسترس نیست." },
      values: echo,
    };
  }

  if (await findUserByEmail(email)) {
    return {
      status: "error",
      message: "این ایمیل قبلاً ثبت شده است.",
      errors: { email: "با این ایمیل حسابی وجود دارد." },
      values: echo,
    };
  }

  const today = new Date().toISOString().slice(0, 10);

  const user = await insertUser({
    id: nextId("user"),
    name,
    username,
    email,
    passwordHash: await hashPassword(password),
    /* نقش تازه‌واردها همیشه دانشجوست؛ ارتقا فقط از پنل مدیریت. */
    role: "student",
    status: "active",
    joinedAt: today,
    lastActiveAt: today,
    enrolledCourseIds: [],
  });

  await createSession(user.id);
  redirect("/");
}

export async function loginAction(
  _previous: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const raw = {
    username: String(formData.get("username") ?? ""),
    password: String(formData.get("password") ?? ""),
  };
  const next = safeRedirectTarget(
    formData.get("next") ? String(formData.get("next")) : undefined,
  );

  const parsed = loginSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: "error",
      errors: collectErrors(parsed.error.issues),
      values: { username: raw.username },
    };
  }

  const key = parsed.data.username.toLowerCase();
  const rate = checkLoginRate(key);

  if (!rate.allowed) {
    const minutes = Math.max(1, Math.ceil(rate.retryAfterSeconds / 60));
    return {
      status: "error",
      message: `تلاش‌های ناموفق زیاد بوده است. ${formatNumber(minutes)} دقیقه دیگر دوباره تلاش کنید.`,
      values: { username: raw.username },
    };
  }

  const user = await findUserByUsername(parsed.data.username);

  /**
   * حتی وقتی کاربر وجود ندارد هم یک راستی‌آزمایی انجام می‌شود.
   * بدون آن، پاسخِ سریع برای نام کاربری ناموجود و پاسخِ کند برای موجود،
   * از روی زمان لو می‌دهد کدام حساب واقعی است.
   */
  const hash =
    user?.passwordHash ??
    "scrypt$16384$00000000000000000000000000000000$00000000";
  const passwordOk = await verifyPassword(parsed.data.password, hash);

  if (!user || !passwordOk) {
    recordFailedLogin(key);
    /* پیام عمداً مبهم است تا مشخص نشود کدام فیلد اشتباه بوده. */
    return {
      status: "error",
      message: "نام کاربری یا رمز عبور نادرست است.",
      values: { username: raw.username },
    };
  }

  if (user.status !== "active") {
    recordFailedLogin(key);
    return {
      status: "error",
      message:
        user.status === "banned"
          ? "این حساب مسدود شده است."
          : "این حساب غیرفعال است. با پشتیبانی تماس بگیرید.",
      values: { username: raw.username },
    };
  }

  clearLoginAttempts(key);
  await patchUser(user.id, {
    lastActiveAt: new Date().toISOString().slice(0, 10),
  });

  await createSession(user.id);
  redirect(next);
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/");
}
