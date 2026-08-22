"use server";

import { redirect } from "next/navigation";
import { loginSchema, type LoginState } from "@/lib/actions/auth.schema";
import {
  createSession,
  destroySession,
  DEMO_CREDENTIALS,
} from "@/lib/auth/session";

export async function loginAction(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const raw = {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = loginSchema.safeParse(raw);

  if (!parsed.success) {
    const errors: LoginState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !(field in errors)) {
        errors[field as keyof typeof errors] = issue.message;
      }
    }
    return { status: "error", errors, values: { email: raw.email } };
  }

  const isValid =
    parsed.data.email.toLowerCase() === DEMO_CREDENTIALS.email.toLowerCase() &&
    parsed.data.password === DEMO_CREDENTIALS.password;

  if (!isValid) {
    /* پیام عمداً مبهم است تا مشخص نشود کدام فیلد اشتباه بوده. */
    return {
      status: "error",
      message: "ایمیل یا رمز عبور نادرست است.",
      values: { email: raw.email },
    };
  }

  await createSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
