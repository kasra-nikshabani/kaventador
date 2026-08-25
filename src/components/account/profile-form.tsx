"use client";

import { CircleAlert, CircleCheck, Save } from "lucide-react";
import { useActionState } from "react";
import { Button, Field, Input } from "@/components/ui";
import { updateProfileAction } from "@/lib/actions/profile";
import { PROFILE_INITIAL_STATE } from "@/lib/actions/profile.schema";

export function ProfileForm({
  name,
  email,
  username,
}: {
  name: string;
  email: string;
  username: string;
}) {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    PROFILE_INITIAL_STATE,
  );

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {state.status === "error" && state.message && (
        <p
          role="alert"
          className="text-danger bg-danger-soft flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
        >
          <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
          {state.message}
        </p>
      )}
      {state.status === "success" && state.message && (
        <p
          role="status"
          className="text-success bg-success-soft flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
        >
          <CircleCheck className="size-4 shrink-0" aria-hidden="true" />
          {state.message}
        </p>
      )}

      <Field label="نام و نام خانوادگی" htmlFor="profile-name" required error={state.errors?.name}>
        <Input
          id="profile-name"
          name="name"
          defaultValue={name}
          autoComplete="name"
          invalid={Boolean(state.errors?.name)}
        />
      </Field>

      <Field label="ایمیل" htmlFor="profile-email" required error={state.errors?.email}>
        <Input
          id="profile-email"
          name="email"
          type="email"
          dir="ltr"
          defaultValue={email}
          autoComplete="email"
          invalid={Boolean(state.errors?.email)}
        />
      </Field>

      <Field
        label="نام کاربری"
        htmlFor="profile-username"
        hint="نام کاربری هویت ورود شماست و قابل تغییر نیست."
      >
        <Input id="profile-username" dir="ltr" defaultValue={username} disabled />
      </Field>

      <Button type="submit" disabled={isPending}>
        <Save aria-hidden="true" />
        {isPending ? "در حال ذخیره…" : "ذخیره تغییرات"}
      </Button>
    </form>
  );
}
