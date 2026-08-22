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
  Textarea,
} from "@/components/ui";
import { saveCategoryAction } from "@/lib/actions/content";
import { FORM_INITIAL_STATE } from "@/lib/actions/content.schema";
import type { Category } from "@/types";

/** کلیدهای آیکونی که `CategoryIcon` می‌شناسد. */
const ICON_KEYS = ["coffee", "braces", "app-window", "leaf", "atom", "triangle"];

export function CategoryForm({ category }: { category?: Category }) {
  const [state, formAction, isPending] = useActionState(
    saveCategoryAction,
    FORM_INITIAL_STATE,
  );

  /* پس از خطا، مقدار برگشتی از سرور برنده است تا ورودی کاربر پاک نشود. */
  const value = (field: keyof Category) =>
    state.values?.[field] ?? (category?.[field] as string | undefined) ?? "";

  return (
    <Card className="p-6">
      <form action={formAction} className="space-y-5" noValidate>
        {category && <input type="hidden" name="id" value={category.id} />}

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
          <Field
            label="عنوان فارسی"
            htmlFor="category-title"
            required
            error={state.errors?.title}
          >
            <Input
              id="category-title"
              name="title"
              defaultValue={value("title")}
              invalid={Boolean(state.errors?.title)}
              placeholder="مثلاً: جاوا"
            />
          </Field>

          <Field
            label="نام انگلیسی"
            htmlFor="category-titleEn"
            required
            error={state.errors?.titleEn}
          >
            <Input
              id="category-titleEn"
              name="titleEn"
              dir="ltr"
              defaultValue={value("titleEn")}
              invalid={Boolean(state.errors?.titleEn)}
              placeholder="Java"
            />
          </Field>
        </div>

        <Field
          label="اسلاگ"
          htmlFor="category-slug"
          required
          hint="در نشانی صفحه استفاده می‌شود؛ فقط حروف کوچک لاتین، عدد و خط تیره."
          error={state.errors?.slug}
        >
          <Input
            id="category-slug"
            name="slug"
            dir="ltr"
            defaultValue={value("slug")}
            invalid={Boolean(state.errors?.slug)}
            placeholder="java"
          />
        </Field>

        <Field
          label="توضیح"
          htmlFor="category-description"
          required
          error={state.errors?.description}
        >
          <Textarea
            id="category-description"
            name="description"
            rows={3}
            defaultValue={value("description")}
            invalid={Boolean(state.errors?.description)}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field
            label="آیکون"
            htmlFor="category-icon"
            required
            hint={`گزینه‌ها: ${ICON_KEYS.join("، ")}`}
            error={state.errors?.icon}
          >
            <Input
              id="category-icon"
              name="icon"
              dir="ltr"
              list="icon-keys"
              defaultValue={value("icon")}
              invalid={Boolean(state.errors?.icon)}
            />
            <datalist id="icon-keys">
              {ICON_KEYS.map((key) => (
                <option key={key} value={key} />
              ))}
            </datalist>
          </Field>

          <Field
            label="رنگ شاخص"
            htmlFor="category-color"
            required
            error={state.errors?.color}
          >
            <Input
              id="category-color"
              name="color"
              dir="ltr"
              defaultValue={value("color") || "#6DB33F"}
              invalid={Boolean(state.errors?.color)}
              placeholder="#6DB33F"
            />
          </Field>

          <Field
            label="ترتیب نمایش"
            htmlFor="category-order"
            required
            error={state.errors?.order}
          >
            <Input
              id="category-order"
              name="order"
              type="number"
              min={1}
              dir="ltr"
              defaultValue={
                state.values?.order ?? String(category?.order ?? 1)
              }
              invalid={Boolean(state.errors?.order)}
            />
          </Field>
        </div>

        <div className="border-border flex flex-wrap justify-end gap-3 border-t pt-5">
          <Link
            href="/admin/categories"
            className={buttonStyles({ variant: "secondary" })}
          >
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
