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
  Textarea,
} from "@/components/ui";
import { saveArticleAction } from "@/lib/actions/content";
import { FORM_INITIAL_STATE } from "@/lib/actions/content.schema";
import {
  CONTENT_STATUS_LABELS,
  type Article,
  type Category,
} from "@/types";

export interface ArticleFormProps {
  categories: Category[];
  article?: Article;
}

export function ArticleForm({ categories, article }: ArticleFormProps) {
  const [state, formAction, isPending] = useActionState(
    saveArticleAction,
    FORM_INITIAL_STATE,
  );

  const text = (field: string, fallback?: string) =>
    state.values?.[field] ?? fallback ?? "";

  return (
    <Card className="p-6">
      <form action={formAction} className="space-y-5" noValidate>
        {article && <input type="hidden" name="id" value={article.id} />}

        {state.status === "error" && state.message && (
          <p
            role="alert"
            className="text-danger bg-danger-soft flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
          >
            <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
            {state.message}
          </p>
        )}

        <Field label="عنوان" htmlFor="article-title" required error={state.errors?.title}>
          <Input
            id="article-title"
            name="title"
            defaultValue={text("title", article?.title)}
            invalid={Boolean(state.errors?.title)}
          />
        </Field>

        <Field
          label="اسلاگ"
          htmlFor="article-slug"
          required
          hint="فقط حروف کوچک لاتین، عدد و خط تیره."
          error={state.errors?.slug}
        >
          <Input
            id="article-slug"
            name="slug"
            dir="ltr"
            defaultValue={text("slug", article?.slug)}
            invalid={Boolean(state.errors?.slug)}
          />
        </Field>

        <Field label="خلاصه" htmlFor="article-excerpt" required error={state.errors?.excerpt}>
          <Textarea
            id="article-excerpt"
            name="excerpt"
            rows={2}
            defaultValue={text("excerpt", article?.excerpt)}
            invalid={Boolean(state.errors?.excerpt)}
          />
        </Field>

        <Field
          label="متن مقاله"
          htmlFor="article-content"
          required
          hint="برای پاراگراف جدید، یک خط خالی بگذارید."
          error={state.errors?.content}
        >
          <Textarea
            id="article-content"
            name="content"
            rows={14}
            defaultValue={text("content", article?.content)}
            invalid={Boolean(state.errors?.content)}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field
            label="دسته‌بندی"
            htmlFor="article-category"
            required
            error={state.errors?.categoryId}
          >
            <Select
              id="article-category"
              name="categoryId"
              defaultValue={text("categoryId", article?.categoryId)}
            >
              <option value="">انتخاب کنید…</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="وضعیت" htmlFor="article-status" required error={state.errors?.status}>
            <Select
              id="article-status"
              name="status"
              defaultValue={text("status", article?.status ?? "draft")}
            >
              {(["draft", "published", "archived"] as const).map((status) => (
                <option key={status} value={status}>
                  {CONTENT_STATUS_LABELS[status]}
                </option>
              ))}
            </Select>
          </Field>

          <Field
            label="زمان مطالعه (دقیقه)"
            htmlFor="article-reading"
            required
            error={state.errors?.readingMinutes}
          >
            <Input
              id="article-reading"
              name="readingMinutes"
              type="number"
              min={1}
              max={120}
              dir="ltr"
              defaultValue={
                state.values?.readingMinutes ??
                String(article?.readingMinutes ?? 5)
              }
              invalid={Boolean(state.errors?.readingMinutes)}
            />
          </Field>
        </div>

        <Field label="برچسب‌ها" htmlFor="article-tags" hint="هر برچسب در یک خط.">
          <Textarea
            id="article-tags"
            name="tags"
            rows={3}
            defaultValue={
              state.values?.tags ?? (article?.tags ?? []).join("\n")
            }
          />
        </Field>

        <label className="flex items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={article?.isFeatured}
            className="accent-primary size-4"
          />
          مقاله شاخص
        </label>

        <div className="border-border flex flex-wrap justify-end gap-3 border-t pt-5">
          <Link href="/admin/articles" className={buttonStyles({ variant: "secondary" })}>
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
