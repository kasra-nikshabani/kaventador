"use client";

import { CircleAlert, LogIn } from "lucide-react";
import { useActionState } from "react";
import { Button, Field, Input } from "@/components/ui";
import { loginAction } from "@/lib/actions/auth";
import { LOGIN_INITIAL_STATE } from "@/lib/actions/auth.schema";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    LOGIN_INITIAL_STATE,
  );

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.message && (
        <p
          role="alert"
          className="text-danger bg-danger-soft flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
        >
          <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
          {state.message}
        </p>
      )}

      <Field
        label="ایمیل"
        htmlFor="login-email"
        required
        error={state.errors?.email}
      >
        <Input
          id="login-email"
          name="email"
          type="email"
          autoComplete="username"
          dir="ltr"
          placeholder="admin@kaventador.ir"
          defaultValue={state.values?.email}
          invalid={Boolean(state.errors?.email)}
          aria-describedby={state.errors?.email ? "login-email-error" : undefined}
        />
      </Field>

      <Field
        label="رمز عبور"
        htmlFor="login-password"
        required
        error={state.errors?.password}
      >
        <Input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          dir="ltr"
          placeholder="••••••••"
          invalid={Boolean(state.errors?.password)}
          aria-describedby={
            state.errors?.password ? "login-password-error" : undefined
          }
        />
      </Field>

      <Button type="submit" size="lg" fullWidth disabled={isPending}>
        <LogIn aria-hidden="true" />
        {isPending ? "در حال ورود…" : "ورود به پنل"}
      </Button>
    </form>
  );
}
