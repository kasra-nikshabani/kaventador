"use client";

import { CircleAlert, Plus, Save, X } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { Button, Field, Input, Textarea } from "@/components/ui";
import { saveChapterAction } from "@/lib/actions/curriculum";
import { CURRICULUM_INITIAL_STATE } from "@/lib/actions/curriculum.schema";
import type { Chapter } from "@/types";

export interface ChapterFormProps {
  courseId: string;
  chapter?: Chapter;
  triggerLabel: string;
  triggerVariant?: "primary" | "ghost";
}

/** فرم افزودن یا ویرایش فصل، در `<dialog>` بومی. */
export function ChapterForm({
  courseId,
  chapter,
  triggerLabel,
  triggerVariant = "primary",
}: ChapterFormProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, formAction, isPending] = useActionState(
    saveChapterAction,
    CURRICULUM_INITIAL_STATE,
  );

  useEffect(() => {
    if (state.status === "success") dialogRef.current?.close();
  }, [state.status]);

  const titleId = `chapter-dialog-${chapter?.id ?? "new"}`;

  return (
    <>
      <Button
        type="button"
        variant={triggerVariant}
        size="sm"
        onClick={() => dialogRef.current?.showModal()}
      >
        {chapter ? <Save aria-hidden="true" /> : <Plus aria-hidden="true" />}
        {triggerLabel}
      </Button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
        className="bg-surface border-border shadow-lift backdrop:bg-overlay m-auto w-[min(32rem,92vw)] rounded-2xl border p-0 backdrop:backdrop-blur-sm"
      >
        <form action={formAction} className="space-y-5 p-6" noValidate>
          <input type="hidden" name="courseId" value={courseId} />
          {chapter && <input type="hidden" name="chapterId" value={chapter.id} />}

          <div className="flex items-start justify-between gap-4">
            <h2 id={titleId} className="text-lg font-bold">
              {chapter ? "ویرایش فصل" : "فصل جدید"}
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
            label="عنوان فصل"
            htmlFor={`${titleId}-title`}
            required
            error={state.errors?.title}
          >
            <Input
              id={`${titleId}-title`}
              name="title"
              defaultValue={chapter?.title}
              invalid={Boolean(state.errors?.title)}
              placeholder="مثلاً: شیءگرایی در عمل"
            />
          </Field>

          <Field
            label="توضیح فصل"
            htmlFor={`${titleId}-description`}
            hint="اختیاری."
            error={state.errors?.description}
          >
            <Textarea
              id={`${titleId}-description`}
              name="description"
              rows={3}
              defaultValue={chapter?.description}
            />
          </Field>

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
              {isPending ? "در حال ذخیره…" : "ذخیره فصل"}
            </Button>
          </div>
        </form>
      </dialog>
    </>
  );
}
