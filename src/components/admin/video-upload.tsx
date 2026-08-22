"use client";

import { CircleAlert, CircleCheck, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui";
import { formatNumber } from "@/lib/utils";

/** حجم بایت به متن فارسی خوانا. */
function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${formatNumber(Math.round(bytes / 1024))} کیلوبایت`;
  }
  const megabytes = bytes / (1024 * 1024);
  return `${formatNumber(Math.round(megabytes * 10) / 10)} مگابایت`;
}

export interface VideoUploadProps {
  /** نام فیلدهای پنهانی که مقدار را به فرم درس می‌دهند. */
  namePrefix?: string;
  initialUrl?: string;
  initialSize?: number;
}

/**
 * آپلود ویدیو روی سرور خودمان.
 *
 * از `XMLHttpRequest` استفاده می‌شود نه `fetch`، چون فقط XHR رویداد
 * پیشرفت آپلود می‌دهد — برای فایل چندصدمگابایتی، نوار پیشرفت لازم است.
 *
 * نتیجه در دو فیلد پنهان می‌نشیند تا با ارسال فرم درس ذخیره شود.
 */
export function VideoUpload({
  namePrefix = "video",
  initialUrl,
  initialSize,
}: VideoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl ?? "");
  const [size, setSize] = useState(initialSize ?? 0);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function upload(file: File) {
    setError(null);
    setProgress(0);

    const body = new FormData();
    body.append("file", file);

    const request = new XMLHttpRequest();
    request.open("POST", "/api/admin/upload");

    request.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 100));
      }
    });

    request.addEventListener("load", () => {
      setProgress(null);

      try {
        const payload = JSON.parse(request.responseText);
        if (request.status === 201) {
          setUrl(payload.url);
          setSize(payload.sizeBytes);
        } else {
          setError(payload.error ?? "آپلود ناموفق بود.");
        }
      } catch {
        setError("پاسخ سرور قابل خواندن نبود.");
      }
    });

    request.addEventListener("error", () => {
      setProgress(null);
      setError("ارتباط با سرور قطع شد.");
    });

    request.send(body);
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={`${namePrefix}Url`} value={url} />
      <input type="hidden" name={`${namePrefix}SizeBytes`} value={size} />

      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) upload(file);
          /* تا انتخاب دوباره همان فایل هم رویداد بدهد. */
          event.target.value = "";
        }}
      />

      {url ? (
        <div className="border-border bg-surface-2 flex flex-wrap items-center gap-3 rounded-xl border p-3">
          <CircleCheck className="text-success size-5 shrink-0" aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium">ویدیو آپلود شده</span>
            <span className="text-subtle block text-xs">
              {formatBytes(size)}
            </span>
          </span>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            <Upload aria-hidden="true" />
            جایگزینی
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="حذف ویدیو از این درس"
            onClick={() => {
              setUrl("");
              setSize(0);
            }}
          >
            <Trash2 aria-hidden="true" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          fullWidth
          disabled={progress !== null}
          onClick={() => inputRef.current?.click()}
        >
          <Upload aria-hidden="true" />
          {progress !== null ? "در حال آپلود…" : "انتخاب فایل ویدیو"}
        </Button>
      )}

      {progress !== null && (
        <div className="space-y-1.5">
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="پیشرفت آپلود ویدیو"
            className="bg-surface-2 h-2 overflow-hidden rounded-full"
          >
            <div
              className="bg-primary h-full rounded-e-full transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-muted text-xs" aria-live="polite">
            {formatNumber(progress)}٪ آپلود شد
          </p>
        </div>
      )}

      {error && (
        <p role="alert" className="text-danger flex items-center gap-2 text-xs">
          <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      <p className="text-subtle text-xs">
        فرمت MP4 یا WebM، حداکثر {formatNumber(500)} مگابایت.
      </p>
    </div>
  );
}
