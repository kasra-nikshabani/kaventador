import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "ایمیل را وارد کنید.")
    .email("فرمت ایمیل معتبر نیست."),
  password: z.string().min(1, "رمز عبور را وارد کنید."),
});

export type LoginState = {
  status: "idle" | "error";
  message?: string;
  errors?: Partial<Record<"email" | "password", string>>;
  values?: { email?: string };
};

export const LOGIN_INITIAL_STATE: LoginState = { status: "idle" };
