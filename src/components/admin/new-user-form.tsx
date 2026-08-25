"use client";

import { CircleAlert, UserPlus } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import {
  Button,
  buttonStyles,
  Card,
  Field,
  Input,
  Select,
  Textarea,
} from "@/components/ui";
import { createUserAction } from "@/lib/actions/content";
import { FORM_INITIAL_STATE } from "@/lib/actions/content.schema";
import { USER_ROLE_LABELS, type UserRole } from "@/types";

const ROLES: UserRole[] = ["student", "instructor", "admin"];

/**
 * ساخت حساب تازه از پنل مدیریت.
 *
 * تنها راه ساخت حساب مدرس همین‌جاست — فرم ثبت‌نام عمومی سایت همیشه
 * نقش «دانشجو» می‌سازد و نقش را از ورودی نمی‌خواند.
 *
 * فیلدهای «عنوان» و «معرفی» فقط وقتی معنا دارند که نقش، مدرس یا مدیر
 * باشد: در آن حالت یک `Person` هم ساخته می‌شود که در صفحه دوره دیده
 * می‌شود. برای دانشجو ساخته نمی‌شود، چون دانشجو در سایت چهره عمومی ندارد.
 */
export function NewUserForm() {
  const [state, formAction, isPending] = useActionState(
    createUserAction,
    FORM_INITIAL_STATE,
  );

  const [role, setRole] = useState<string>(state.values?.role ?? "student");
  const isPublicPerson = role === "instructor" || role === "admin";

  const text = (field: string, fallback = "") =>
    state.values?.[field] ?? fallback;

  return (
    <Card className="p-6">
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

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="نام" htmlFor="new-user-name" required error={state.errors?.name}>
            <Input
              id="new-user-name"
              name="name"
              defaultValue={text("name")}
              invalid={Boolean(state.errors?.name)}
            />
          </Field>

          <Field
            label="نام کاربری"
            htmlFor="new-user-username"
            required
            hint="حروف کوچک لاتین، عدد و زیرخط. کاربر با همین وارد می‌شود."
            error={state.errors?.username}
          >
            <Input
              id="new-user-username"
              name="username"
              dir="ltr"
              autoComplete="off"
              defaultValue={text("username")}
              invalid={Boolean(state.errors?.username)}
            />
          </Field>

          <Field label="ایمیل" htmlFor="new-user-email" required error={state.errors?.email}>
            <Input
              id="new-user-email"
              name="email"
              type="email"
              dir="ltr"
              defaultValue={text("email")}
              invalid={Boolean(state.errors?.email)}
            />
          </Field>

          <Field
            label="رمز عبور"
            htmlFor="new-user-password"
            required
            hint="دست‌کم ۸ نویسه. پس از ذخیره دیگر قابل دیدن نیست."
            error={state.errors?.password}
          >
            <Input
              id="new-user-password"
              name="password"
              type="password"
              dir="ltr"
              autoComplete="new-password"
              invalid={Boolean(state.errors?.password)}
            />
          </Field>
        </div>

        <Field label="نقش" htmlFor="new-user-role" required error={state.errors?.role}>
          <Select
            id="new-user-role"
            name="role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            {ROLES.map((value) => (
              <option key={value} value={value}>
                {USER_ROLE_LABELS[value]}
              </option>
            ))}
          </Select>
        </Field>

        {isPublicPerson && (
          <fieldset className="border-border space-y-5 rounded-xl border p-5">
            <legend className="px-2 text-sm font-bold">پروفایل عمومی</legend>
            <p className="text-muted text-sm">
              این حساب در صفحه دوره‌هایش به‌عنوان مدرس دیده می‌شود.
            </p>

            <Field label="عنوان" htmlFor="new-user-person-role" hint="مثلاً: مدرس جاوا و اسپرینگ">
              <Input
                id="new-user-person-role"
                name="personRole"
                defaultValue={text("personRole")}
              />
            </Field>

            <Field label="معرفی کوتاه" htmlFor="new-user-person-bio">
              <Textarea
                id="new-user-person-bio"
                name="personBio"
                rows={3}
                defaultValue={text("personBio")}
              />
            </Field>
          </fieldset>
        )}

        <div className="border-border flex flex-wrap justify-end gap-3 border-t pt-5">
          <Link href="/admin/users" className={buttonStyles({ variant: "secondary" })}>
            انصراف
          </Link>
          <Button type="submit" disabled={isPending}>
            <UserPlus aria-hidden="true" />
            {isPending ? "در حال ساخت…" : "ساخت حساب"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
