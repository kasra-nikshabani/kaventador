"use client";

import { Trash2, TriangleAlert } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui";
import {
  DELETE_INITIAL_STATE,
  type DeleteState,
} from "@/lib/actions/content.schema";

export interface DeleteButtonProps {
  /** اکشن حذف؛ شناسه را از فیلد پنهان فرم می‌خواند. */
  action: (state: DeleteState, formData: FormData) => Promise<DeleteState>;
  id: string;
  /** نام موردی که حذف می‌شود — در متن تأیید نمایش داده می‌شود. */
  name: string;
  entityLabel: string;
}

/**
 * حذف با تأیید.
 *
 * روی `<dialog>` بومی سوار است تا محبوس‌سازی فوکوس و بستن با Esc را
 * مرورگر بدهد. دکمه تأیید داخل یک فرم واقعی است، پس حذف با POST
 * انجام می‌شود نه با کلیک روی لینک.
 */
export function DeleteButton({
  action,
  id,
  name,
  entityLabel,
}: DeleteButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, formAction, isPending] = useActionState(
    action,
    DELETE_INITIAL_STATE,
  );

  /* پس از حذف موفق، گفتگو بسته می‌شود. */
  useEffect(() => {
    if (state.status === "success") dialogRef.current?.close();
  }, [state.status]);

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
        aria-labelledby={`delete-title-${id}`}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
        className="bg-surface border-border shadow-lift m-auto w-[min(28rem,92vw)] rounded-2xl border p-0 backdrop:bg-overlay backdrop:backdrop-blur-sm"
      >
        <div className="p-6">
          <span className="bg-danger-soft text-danger mb-4 flex size-12 items-center justify-center rounded-2xl">
            <TriangleAlert className="size-6" aria-hidden="true" />
          </span>

          <h2 id={`delete-title-${id}`} className="text-lg font-bold">
            حذف {entityLabel}
          </h2>
          <p className="text-muted mt-2 text-sm">
            «{name}» برای همیشه حذف می‌شود. این کار قابل بازگشت نیست.
          </p>

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
              <input type="hidden" name="id" value={id} />
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
