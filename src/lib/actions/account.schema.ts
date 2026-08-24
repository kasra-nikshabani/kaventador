import { z } from "zod";
import { toPersianDigits } from "@/lib/utils/format";

/**
 * اسکیمای ثبت‌نام و ورود.
 * جدا از فایل `"use server"` نگه داشته می‌شود.
 */

/** نام کاربری فقط لاتین کوچک، عدد و زیرخط. */
const usernamePattern = /^[a-z0-9_]+$/;

/**
 * رمزهایی که آن‌قدر رایج‌اند که عملاً بی‌اثرند.
 * فهرست عمداً کوتاه است؛ بررسی جدی باید به سرویسی مثل
 * Have I Been Pwned سپرده شود، نه فهرست دستی.
 */
const OBVIOUS_PASSWORDS = new Set([
  "password",
  "12345678",
  "123456789",
  "qwertyui",
  "11111111",
  "kaventador",
]);

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, `نام کاربری باید دست‌کم ${toPersianDigits(3)} نویسه باشد.`)
  .max(20, `نام کاربری نباید بیش از ${toPersianDigits(20)} نویسه باشد.`)
  .regex(
    usernamePattern,
    "نام کاربری فقط می‌تواند حروف کوچک لاتین، عدد و زیرخط باشد.",
  );

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, `نام باید دست‌کم ${toPersianDigits(3)} نویسه باشد.`)
      .max(80, `نام نباید بیش از ${toPersianDigits(80)} نویسه باشد.`),
    username: usernameSchema,
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "ایمیل را وارد کنید.")
      .email("فرمت ایمیل معتبر نیست."),
    password: z
      .string()
      .min(8, `رمز عبور باید دست‌کم ${toPersianDigits(8)} نویسه باشد.`)
      .max(128, `رمز عبور نباید بیش از ${toPersianDigits(128)} نویسه باشد.`)
      .refine(
        (value) => !OBVIOUS_PASSWORDS.has(value.toLowerCase()),
        "این رمز عبور بیش از حد رایج است؛ رمز دیگری انتخاب کنید.",
      ),
    passwordConfirm: z.string(),
    /* تله ربات */
    website: z.string().max(0).optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "تکرار رمز عبور با خودش یکسان نیست.",
  });

export const loginSchema = z.object({
  username: z.string().trim().min(1, "نام کاربری را وارد کنید."),
  password: z.string().min(1, "رمز عبور را وارد کنید."),
});

export type AccountFormState = {
  status: "idle" | "error";
  message?: string;
  errors?: Record<string, string>;
  /** مقادیر واردشده تا پس از خطا پاک نشوند — رمز عبور هرگز برنمی‌گردد. */
  values?: Record<string, string>;
};

export const ACCOUNT_INITIAL_STATE: AccountFormState = { status: "idle" };
