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
import { saveCourseAction } from "@/lib/actions/content";
import {
  FORM_INITIAL_STATE,
  type FormState,
} from "@/lib/actions/content.schema";
import {
  CONTENT_STATUS_LABELS,
  COURSE_PROGRESS_LABELS,
  LEVEL_LABELS,
  type Category,
  type Course,
  type Person,
} from "@/types";

export interface CourseFormProps {
  categories: Category[];
  /** فهرست مدرس‌ها برای انتخاب. در حالت «مدرس قفل» نادیده گرفته می‌شود. */
  people?: Person[];
  course?: Course;
  /**
   * وقتی مدرس خودش فرم را پر می‌کند: نامش نمایش داده می‌شود ولی قابل
   * تغییر نیست. سرور هم مستقل از این، مقدار را از نشست می‌گیرد؛ این
   * فقط رابط کاربری است، نه محافظ.
   */
  lockedInstructor?: Person;
  /** اکشن ذخیره — ادمین و مدرس هرکدام مال خودشان را می‌فرستند. */
  action?: (state: FormState, formData: FormData) => Promise<FormState>;
  cancelHref?: string;
}

export function CourseForm({
  categories,
  people = [],
  course,
  lockedInstructor,
  action = saveCourseAction,
  cancelHref = "/admin/courses",
}: CourseFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    FORM_INITIAL_STATE,
  );

  const text = (field: string, fallback?: string) =>
    state.values?.[field] ?? fallback ?? "";

  /* آرایه‌ها در فرم به صورت یک آیتم در هر خط ویرایش می‌شوند. */
  const lines = (field: string, list?: string[]) =>
    state.values?.[field] ?? (list ?? []).join("\n");

  return (
    <Card className="p-6">
      <form action={formAction} className="space-y-5" noValidate>
        {course && <input type="hidden" name="id" value={course.id} />}

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
          <Field label="عنوان" htmlFor="course-title" required error={state.errors?.title}>
            <Input
              id="course-title"
              name="title"
              defaultValue={text("title", course?.title)}
              invalid={Boolean(state.errors?.title)}
            />
          </Field>

          <Field
            label="نام انگلیسی"
            htmlFor="course-titleEn"
            required
            error={state.errors?.titleEn}
          >
            <Input
              id="course-titleEn"
              name="titleEn"
              dir="ltr"
              defaultValue={text("titleEn", course?.titleEn)}
              invalid={Boolean(state.errors?.titleEn)}
            />
          </Field>
        </div>

        <Field
          label="اسلاگ"
          htmlFor="course-slug"
          required
          hint="فقط حروف کوچک لاتین، عدد و خط تیره."
          error={state.errors?.slug}
        >
          <Input
            id="course-slug"
            name="slug"
            dir="ltr"
            defaultValue={text("slug", course?.slug)}
            invalid={Boolean(state.errors?.slug)}
          />
        </Field>

        <Field label="خلاصه" htmlFor="course-excerpt" required error={state.errors?.excerpt}>
          <Textarea
            id="course-excerpt"
            name="excerpt"
            rows={2}
            defaultValue={text("excerpt", course?.excerpt)}
            invalid={Boolean(state.errors?.excerpt)}
          />
        </Field>

        <Field
          label="توضیح کامل"
          htmlFor="course-description"
          required
          error={state.errors?.description}
        >
          <Textarea
            id="course-description"
            name="description"
            rows={6}
            defaultValue={text("description", course?.description)}
            invalid={Boolean(state.errors?.description)}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Field
            label="دسته‌بندی"
            htmlFor="course-category"
            required
            error={state.errors?.categoryId}
          >
            <Select
              id="course-category"
              name="categoryId"
              defaultValue={text("categoryId", course?.categoryId)}
            >
              <option value="">انتخاب کنید…</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.title}
                </option>
              ))}
            </Select>
          </Field>

          {lockedInstructor ? (
            <Field label="مدرس" htmlFor="course-instructor" hint="دوره به نام شما ثبت می‌شود.">
              <Input
                id="course-instructor"
                value={lockedInstructor.name}
                readOnly
                disabled
              />
            </Field>
          ) : (
            <Field
              label="مدرس"
              htmlFor="course-instructor"
              required
              error={state.errors?.instructorId}
            >
              <Select
                id="course-instructor"
                name="instructorId"
                defaultValue={text("instructorId", course?.instructorId)}
              >
                <option value="">انتخاب کنید…</option>
                {people.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </Select>
            </Field>
          )}

          <Field label="سطح" htmlFor="course-level" required error={state.errors?.level}>
            <Select
              id="course-level"
              name="level"
              defaultValue={text("level", course?.level ?? "beginner")}
            >
              {(["beginner", "intermediate", "advanced"] as const).map((level) => (
                <option key={level} value={level}>
                  {LEVEL_LABELS[level]}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="وضعیت" htmlFor="course-status" required error={state.errors?.status}>
            <Select
              id="course-status"
              name="status"
              defaultValue={text("status", course?.status ?? "draft")}
            >
              {(["draft", "published", "archived"] as const).map((status) => (
                <option key={status} value={status}>
                  {CONTENT_STATUS_LABELS[status]}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        {/* قیمت‌گذاری */}
        <fieldset className="border-border space-y-5 rounded-xl border p-5">
          <legend className="px-2 text-sm font-bold">قیمت‌گذاری</legend>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field
              label="نوع"
              htmlFor="course-pricing-type"
              required
              error={state.errors?.pricingType}
            >
              <Select
                id="course-pricing-type"
                name="pricingType"
                defaultValue={text("pricingType", course?.pricing.type ?? "free")}
              >
                <option value="free">رایگان</option>
                <option value="paid">پولی</option>
              </Select>
            </Field>

            <Field
              label="مبلغ (تومان)"
              htmlFor="course-price-amount"
              hint="فقط برای دوره پولی."
              error={state.errors?.priceAmount}
            >
              <Input
                id="course-price-amount"
                name="priceAmount"
                type="number"
                min={0}
                step={1000}
                dir="ltr"
                placeholder="490000"
                defaultValue={
                  state.values?.priceAmount ??
                  (course?.pricing.type === "paid"
                    ? String(course.pricing.amount)
                    : "")
                }
                invalid={Boolean(state.errors?.priceAmount)}
              />
            </Field>

            <Field
              label="مبلغ پیش از تخفیف"
              htmlFor="course-price-original"
              hint="اختیاری؛ خط‌خورده کنار قیمت می‌آید."
              error={state.errors?.priceOriginal}
            >
              <Input
                id="course-price-original"
                name="priceOriginal"
                type="number"
                min={0}
                step={1000}
                dir="ltr"
                placeholder="690000"
                defaultValue={
                  state.values?.priceOriginal ??
                  (course?.pricing.type === "paid" && course.pricing.originalAmount
                    ? String(course.pricing.originalAmount)
                    : "")
                }
                invalid={Boolean(state.errors?.priceOriginal)}
              />
            </Field>
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="وضعیت برگزاری"
            htmlFor="course-progress"
            required
            hint="مستقل از وضعیت انتشار است؛ دوره منتشرشده می‌تواند در حال برگزاری باشد."
            error={state.errors?.progress}
          >
            <Select
              id="course-progress"
              name="progress"
              defaultValue={text("progress", course?.progress ?? "completed")}
            >
              {(["upcoming", "ongoing", "completed"] as const).map((value) => (
                <option key={value} value={value}>
                  {COURSE_PROGRESS_LABELS[value]}
                </option>
              ))}
            </Select>
          </Field>

          <Field
            label="تاریخ انتشار درس بعدی"
            htmlFor="course-next-release"
            hint="فقط برای دوره در حال برگزاری یا به‌زودی. خالی بگذارید تا نمایش داده نشود."
            error={state.errors?.nextReleaseAt}
          >
            <Input
              id="course-next-release"
              name="nextReleaseAt"
              type="date"
              dir="ltr"
              defaultValue={text("nextReleaseAt", course?.nextReleaseAt)}
              invalid={Boolean(state.errors?.nextReleaseAt)}
            />
          </Field>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <Field
            label="پیش‌نیازها"
            htmlFor="course-prerequisites"
            hint="هر مورد در یک خط."
          >
            <Textarea
              id="course-prerequisites"
              name="prerequisites"
              rows={4}
              defaultValue={lines("prerequisites", course?.prerequisites)}
            />
          </Field>

          <Field label="دستاوردها" htmlFor="course-outcomes" hint="هر مورد در یک خط.">
            <Textarea
              id="course-outcomes"
              name="outcomes"
              rows={4}
              defaultValue={lines("outcomes", course?.outcomes)}
            />
          </Field>

          <Field label="برچسب‌ها" htmlFor="course-tags" hint="هر برچسب در یک خط.">
            <Textarea
              id="course-tags"
              name="tags"
              rows={4}
              defaultValue={lines("tags", course?.tags)}
            />
          </Field>
        </div>

        <label className="flex items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={course?.isFeatured}
            className="accent-primary size-4"
          />
          نمایش در بخش «دوره‌های شاخص» صفحه اصلی
        </label>

        {!course && (
          <p className="text-muted bg-surface-2 rounded-xl px-4 py-3 text-sm">
            دوره تازه بدون فصل و درس ساخته می‌شود. پس از ذخیره، از دکمه
            «سرفصل و ویدیو» فصل‌ها و درس‌ها را اضافه کنید.
          </p>
        )}

        <div className="border-border flex flex-wrap justify-end gap-3 border-t pt-5">
          <Link href={cancelHref} className={buttonStyles({ variant: "secondary" })}>
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
