"use client";

import { CircleAlert, UserPlus } from "lucide-react";
import { useActionState } from "react";
import { Button, Field, Input } from "@/components/ui";
import { signupAction } from "@/lib/actions/account";
import { ACCOUNT_INITIAL_STATE } from "@/lib/actions/account.schema";

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(
    signupAction,
    ACCOUNT_INITIAL_STATE,
  );

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.message && (
        <p
          role="alert"
          className="text-danger bg-danger-soft flex items-start gap-2 rounded-xl px-4 py-3 text-sm"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {state.message}
        </p>
      )}

      <Field
        label="نام و نام خانوادگی"
        htmlFor="signup-name"
        required
        error={state.errors?.name}
      >
        <Input
          id="signup-name"
          name="name"
          autoComplete="name"
          placeholder="مثلاً: سارا محمدی"
          defaultValue={state.values?.name}
          invalid={Boolean(state.errors?.name)}
          aria-describedby={state.errors?.name ? "signup-name-error" : undefined}
        />
      </Field>

      <Field
        label="نام کاربری"
        htmlFor="signup-username"
        required
        hint="فقط حروف کوچک لاتین، عدد و زیرخط. با همین وارد می‌شوید."
        error={state.errors?.username}
      >
        <Input
          id="signup-username"
          name="username"
          dir="ltr"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="sara_m"
          defaultValue={state.values?.username}
          invalid={Boolean(state.errors?.username)}
          aria-describedby={
            state.errors?.username ? "signup-username-error" : "signup-username-hint"
          }
        />
      </Field>

      <Field
        label="ایمیل"
        htmlFor="signup-email"
        required
        hint="برای بازیابی حساب و اطلاع‌رسانی دوره‌ها."
        error={state.errors?.email}
      >
        <Input
          id="signup-email"
          name="email"
          type="email"
          dir="ltr"
          autoComplete="email"
          placeholder="you@example.com"
          defaultValue={state.values?.email}
          invalid={Boolean(state.errors?.email)}
          aria-describedby={
            state.errors?.email ? "signup-email-error" : "signup-email-hint"
          }
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="رمز عبور"
          htmlFor="signup-password"
          required
          hint="دست‌کم ۸ نویسه."
          error={state.errors?.password}
        >
          <Input
            id="signup-password"
            name="password"
            type="password"
            dir="ltr"
            autoComplete="new-password"
            placeholder="••••••••"
            invalid={Boolean(state.errors?.password)}
            aria-describedby={
              state.errors?.password ? "signup-password-error" : "signup-password-hint"
            }
          />
        </Field>

        <Field
          label="تکرار رمز عبور"
          htmlFor="signup-password-confirm"
          required
          error={state.errors?.passwordConfirm}
        >
          <Input
            id="signup-password-confirm"
            name="passwordConfirm"
            type="password"
            dir="ltr"
            autoComplete="new-password"
            placeholder="••••••••"
            invalid={Boolean(state.errors?.passwordConfirm)}
            aria-describedby={
              state.errors?.passwordConfirm
                ? "signup-password-confirm-error"
                : undefined
            }
          />
        </Field>
      </div>

      {/* تله ربات — از دید کاربر و صفحه‌خوان پنهان است. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="signup-website">این فیلد را خالی بگذارید</label>
        <input
          id="signup-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Button type="submit" size="lg" fullWidth disabled={isPending}>
        <UserPlus aria-hidden="true" />
        {isPending ? "در حال ساخت حساب…" : "ساخت حساب"}
      </Button>
    </form>
  );
}
