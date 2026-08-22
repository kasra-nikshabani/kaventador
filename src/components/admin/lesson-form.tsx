"use client";

import { CircleAlert, Plus, Save, X } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { VideoUpload } from "@/components/admin/video-upload";
import { Button, Field, Input, Select } from "@/components/ui";
import { saveLessonAction } from "@/lib/actions/curriculum";
import { CURRICULUM_INITIAL_STATE } from "@/lib/actions/curriculum.schema";
import { LESSON_TYPE_LABELS, type Lesson, type LessonType } from "@/types";

const LESSON_TYPES: LessonType[] = ["video", "article", "quiz", "project"];

export interface LessonFormProps {
  courseId: string;
  chapterId: string;
  /** اگر باشد، فرم در حالت ویرایش است. */
  lesson?: Lesson;
  /** متن دکمه‌ای که گفتگو را باز می‌کند. */
  triggerLabel: string;
  triggerVariant?: "outline" | "ghost";
}

/**
 * فرم افزودن یا ویرایش درس، داخل یک `<dialog>` بومی.
 *
 * فرم کامل روی صفحه فهرست باعث شلوغی می‌شود؛ گفتگو تمرکز را حفظ می‌کند
 * و محبوس‌سازی فوکوس و بستن با Esc را مرورگر می‌دهد.
 */
export function LessonForm({
  courseId,
  chapterId,
  lesson,
  triggerLabel,
  triggerVariant = "outline",
}: LessonFormProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, formAction, isPending] = useActionState(
    saveLessonAction,
    CURRICULUM_INITIAL_STATE,
  );

  /* بعد از ذخیره موفق، گفتگو بسته می‌شود. بستن یک عارضه جانبی است،
     پس در effect انجام می‌شود نه در حین رندر. */
  useEffect(() => {
    if (state.status === "success") dialogRef.current?.close();
  }, [state.status]);

  const titleId = `lesson-dialog-${lesson?.id ?? chapterId}`;

  return (
    <>
      <Button
        type="button"
        variant={triggerVariant}
        size="sm"
        onClick={() => dialogRef.current?.showModal()}
      >
        {lesson ? <Save aria-hidden="true" /> : <Plus aria-hidden="true" />}
        {triggerLabel}
      </Button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
        className="bg-surface border-border shadow-lift backdrop:bg-overlay m-auto w-[min(34rem,92vw)] rounded-2xl border p-0 backdrop:backdrop-blur-sm"
      >
        <form action={formAction} className="space-y-5 p-6" noValidate>
          <input type="hidden" name="courseId" value={courseId} />
          <input type="hidden" name="chapterId" value={chapterId} />
          {lesson && <input type="hidden" name="lessonId" value={lesson.id} />}

          <div className="flex items-start justify-between gap-4">
            <h2 id={titleId} className="text-lg font-bold">
              {lesson ? "ویرایش درس" : "درس جدید"}
            </h2>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="بستن"
              className="text-muted hover:bg-surface-2 hover:text-foreground focus-visible:outline-ring inline-flex size-9 cursor-pointer items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          {state.status === "error" && state.message && (
            <p
              role="alert"
              className="text-danger bg-danger-soft flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
            >
              <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
              {state.message}
            </p>
          )}

          <Field
            label="عنوان درس"
            htmlFor={`${titleId}-title`}
            required
            error={state.errors?.title}
          >
            <Input
              id={`${titleId}-title`}
              name="title"
              defaultValue={lesson?.title}
              invalid={Boolean(state.errors?.title)}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="نوع درس"
              htmlFor={`${titleId}-type`}
              required
              error={state.errors?.type}
            >
              <Select
                id={`${titleId}-type`}
                name="type"
                defaultValue={lesson?.type ?? "video"}
              >
                {LESSON_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {LESSON_TYPE_LABELS[type]}
                  </option>
                ))}
              </Select>
            </Field>

            <Field
              label="مدت (دقیقه)"
              htmlFor={`${titleId}-duration`}
              required
              error={state.errors?.durationMinutes}
            >
              <Input
                id={`${titleId}-duration`}
                name="durationMinutes"
                type="number"
                min={1}
                max={600}
                dir="ltr"
                defaultValue={lesson?.durationMinutes ?? 10}
                invalid={Boolean(state.errors?.durationMinutes)}
              />
            </Field>
          </div>

          <div className="space-y-2">
            <span className="text-foreground block text-sm font-medium">
              فایل ویدیو
            </span>
            <VideoUpload
              initialUrl={lesson?.videoUrl}
              initialSize={lesson?.videoSizeBytes}
            />
            {state.errors?.videoUrl && (
              <p role="alert" className="text-danger text-xs">
                {state.errors.videoUrl}
              </p>
            )}
          </div>

          <label className="flex items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              name="isFree"
              defaultChecked={lesson?.isFree}
              className="accent-primary size-4"
            />
            پیش‌نمایش رایگان (بدون ثبت‌نام قابل مشاهده باشد)
          </label>

          <div className="border-border flex flex-wrap justify-end gap-3 border-t pt-5">
            <Button
              type="button"
              variant="secondary"
              onClick={() => dialogRef.current?.close()}
            >
              انصراف
            </Button>
            <Button type="submit" disabled={isPending}>
              <Save aria-hidden="true" />
              {isPending ? "در حال ذخیره…" : "ذخیره درس"}
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
}
