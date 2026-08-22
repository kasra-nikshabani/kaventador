"use client";

import { CircleAlert, Save } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import {
  Button,
  buttonStyles,
  Card,
  Field,
  Input,
  Select,
} from "@/components/ui";
import { saveUserAction } from "@/lib/actions/content";
import { FORM_INITIAL_STATE } from "@/lib/actions/content.schema";
import {
  USER_ROLE_LABELS,
  USER_STATUS_LABELS,
  type User,
  type UserRole,
  type UserStatus,
} from "@/types";

const ROLES: UserRole[] = ["admin", "instructor", "student"];
const STATUSES: UserStatus[] = ["active", "inactive", "banned"];

export function UserForm({ user }: { user: User }) {
  const [state, formAction, isPending] = useActionState(
    saveUserAction,
    FORM_INITIAL_STATE,
  );

  const text = (field: string, fallback?: string) =>
    state.values?.[field] ?? fallback ?? "";

  return (
    <Card className="p-6">
      <form action={formAction} className="space-y-5" noValidate>
        <input type="hidden" name="id" value={user.id} />

        {state.status === "error" && state.message && (
          <p
            role="alert"
            className="text-danger bg-danger-soft flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
          >
            <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
            {state.message}
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="نام" htmlFor="user-name" required error={state.errors?.name}>
            <Input
              id="user-name"
              name="name"
              defaultValue={text("name", user.name)}
              invalid={Boolean(state.errors?.name)}
            />
          </Field>

          <Field label="ایمیل" htmlFor="user-email" required error={state.errors?.email}>
            <Input
              id="user-email"
              name="email"
              type="email"
              dir="ltr"
              defaultValue={text("email", user.email)}
              invalid={Boolean(state.errors?.email)}
            />
          </Field>

          <Field label="نقش" htmlFor="user-role" required error={state.errors?.role}>
            <Select id="user-role" name="role" defaultValue={text("role", user.role)}>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {USER_ROLE_LABELS[role]}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="وضعیت" htmlFor="user-status" required error={state.errors?.status}>
            <Select
              id="user-status"
              name="status"
              defaultValue={text("status", user.status)}
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {USER_STATUS_LABELS[status]}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="border-border flex flex-wrap justify-end gap-3 border-t pt-5">
          <Link href="/admin/users" className={buttonStyles({ variant: "secondary" })}>
            انصراف
          </Link>
          <Button type="submit" disabled={isPending}>
            <Save aria-hidden="true" />
            {isPending ? "در حال ذخیره…" : "ذخیره"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
