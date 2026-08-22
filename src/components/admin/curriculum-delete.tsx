"use client";

import { Trash2, TriangleAlert } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui";
import {
  CURRICULUM_INITIAL_STATE,
  type CurriculumState,
} from "@/lib/actions/curriculum.schema";

export interface CurriculumDeleteProps {
  action: (
    state: CurriculumState,
    formData: FormData,
  ) => Promise<CurriculumState>;
  courseId: string;
  chapterId: string;
  lessonId?: string;
  name: string;
  entityLabel: string;
  /** هشدار اضافه — مثلاً «همه درس‌های داخلش هم حذف می‌شوند». */
  warning?: string;
}

/** حذف فصل یا درس، با تأیید در `<dialog>` بومی. */
export function CurriculumDelete({
  action,
  courseId,
  chapterId,
  lessonId,
  name,
  entityLabel,
  warning,
}: CurriculumDeleteProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, formAction, isPending] = useActionState(
    action,
    CURRICULUM_INITIAL_STATE,
  );

  useEffect(() => {
    if (state.status === "success") dialogRef.current?.close();
  }, [state.status]);

  const id = lessonId ?? chapterId;

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-label={`حذف ${name}`}
        title="حذف"
        className="text-muted hover:bg-danger-soft hover:text-danger focus-visible:outline-ring inline-flex size-9 cursor-pointer items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={`curriculum-delete-${id}`}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
        className="bg-surface border-border shadow-lift backdrop:bg-overlay m-auto w-[min(28rem,92vw)] rounded-2xl border p-0 backdrop:backdrop-blur-sm"
      >
        <div className="p-6">
          <span className="bg-danger-soft text-danger mb-4 flex size-12 items-center justify-center rounded-2xl">
            <TriangleAlert className="size-6" aria-hidden="true" />
          </span>

          <h2 id={`curriculum-delete-${id}`} className="text-lg font-bold">
            حذف {entityLabel}
          </h2>
          <p className="text-muted mt-2 text-sm">
            «{name}» برای همیشه حذف می‌شود. این کار قابل بازگشت نیست.
          </p>
          {warning && (
            <p className="text-warning bg-warning-soft mt-3 rounded-xl px-4 py-3 text-sm">
              {warning}
            </p>
          )}

          {state.status === "error" && state.message && (
            <p
              role="alert"
              className="text-danger bg-danger-soft mt-4 rounded-xl px-4 py-3 text-sm"
            >
              {state.message}
            </p>
          )}

          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => dialogRef.current?.close()}
            >
              انصراف
            </Button>

            <form action={formAction}>
              <input type="hidden" name="courseId" value={courseId} />
              <input type="hidden" name="chapterId" value={chapterId} />
              {lessonId && (
                <input type="hidden" name="lessonId" value={lessonId} />
              )}
              <Button type="submit" variant="danger" disabled={isPending}>
                <Trash2 aria-hidden="true" />
                {isPending ? "در حال حذف…" : "حذف کن"}
              </Button>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
