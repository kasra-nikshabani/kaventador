"use client";

import { CircleAlert, LogIn } from "lucide-react";
import { useActionState } from "react";
import { Button, Field, Input } from "@/components/ui";
import { loginAction } from "@/lib/actions/account";
import { ACCOUNT_INITIAL_STATE } from "@/lib/actions/account.schema";

/** ورود فقط با نام کاربری و رمز عبور. */
export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    ACCOUNT_INITIAL_STATE,
  );

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {next && <input type="hidden" name="next" value={next} />}

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
        label="نام کاربری"
        htmlFor="login-username"
        required
        error={state.errors?.username}
      >
        <Input
          id="login-username"
          name="username"
          dir="ltr"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="username"
          defaultValue={state.values?.username}
          invalid={Boolean(state.errors?.username)}
          aria-describedby={
            state.errors?.username ? "login-username-error" : undefined
          }
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
          dir="ltr"
          autoComplete="current-password"
          placeholder="••••••••"
          invalid={Boolean(state.errors?.password)}
          aria-describedby={
            state.errors?.password ? "login-password-error" : undefined
          }
        />
      </Field>

      <Button type="submit" size="lg" fullWidth disabled={isPending}>
        <LogIn aria-hidden="true" />
        {isPending ? "در حال ورود…" : "ورود"}
      </Button>
    </form>
  );
}
