"use client";

import { PlayCircle, X } from "lucide-react";
import { useEffect, useRef } from "react";

export interface LessonPlayerProps {
  title: string;
  videoUrl: string;
}

/**
 * پخش‌کننده پیش‌نمایش درس.
 *
 * از `<video controls>` بومی استفاده می‌شود: کنترل‌های آشنا، پشتیبانی از
 * زیرنویس، تمام‌صفحه و picture-in-picture را مرورگر می‌دهد — بدون یک
 * کیلوبایت کتابخانه اضافه. جابه‌جایی روی نوار زمان هم کار می‌کند چون
 * مسیر `/api/media` هدر Range را پشتیبانی می‌کند.
 *
 * `preload="none"` یعنی تا وقتی کاربر پخش را نزده، هیچ بایتی دانلود
 * نمی‌شود.
 */
export function LessonPlayer({ title, videoUrl }: LessonPlayerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  /* با بستن گفتگو، پخش هم متوقف شود تا صدا در پس‌زمینه ادامه پیدا نکند. */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const stop = () => {
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    };

    dialog.addEventListener("close", stop);
    return () => dialog.removeEventListener("close", stop);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-label={`پخش پیش‌نمایش: ${title}`}
        className="text-primary hover:bg-primary-soft focus-visible:outline-ring inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <PlayCircle className="size-4" aria-hidden="true" />
        پخش
      </button>

      <dialog
        ref={dialogRef}
        aria-label={`پیش‌نمایش درس: ${title}`}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
        className="bg-surface border-border shadow-lift backdrop:bg-overlay m-auto w-[min(56rem,94vw)] rounded-2xl border p-0 backdrop:backdrop-blur-sm"
      >
        <div className="border-border flex items-center justify-between gap-4 border-b p-4">
          <h2 className="truncate text-sm font-bold">{title}</h2>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="بستن پخش‌کننده"
            className="text-muted hover:bg-surface-2 hover:text-foreground focus-visible:outline-ring inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <video
          ref={videoRef}
          controls
          preload="none"
          playsInline
          controlsList="nodownload"
          className="aspect-video w-full bg-black"
        >
          <source src={videoUrl} />
          مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
        </video>
      </dialog>
    </>
  );
}
