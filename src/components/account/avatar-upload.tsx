"use client";

import { CircleAlert, Camera } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Avatar, Button } from "@/components/ui";

export interface AvatarUploadProps {
  name: string;
  currentUrl?: string;
}

/**
 * آپلود تصویر پروفایل.
 *
 * برخلاف آپلود ویدیو، اینجا فایل بلافاصله ذخیره و به حساب وصل می‌شود —
 * فرم جداگانه‌ای برای «ذخیره» ندارد. دلیلش این است که تصویر تنها فیلد
 * این بخش است و مرحله اضافه فقط اصطکاک می‌سازد.
 *
 * پس از موفقیت `router.refresh()` صدا زده می‌شود تا هدر و بقیه صفحه هم
 * تصویر تازه را ببینند، نه فقط این کامپوننت.
 */
export function AvatarUpload({ name, currentUrl }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [url, setUrl] = useState(currentUrl);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setError(null);
    setBusy(true);

    try {
      const body = new FormData();
      body.append("file", file);

      const response = await fetch("/api/account/avatar", {
        method: "POST",
        body,
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error ?? "آپلود ناموفق بود.");
        return;
      }

      setUrl(payload.url);
      router.refresh();
    } catch {
      setError("ارتباط با سرور برقرار نشد.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-5">
      <Avatar name={name} src={url} size="xl" />

      <div className="space-y-2">
        {/* ورودی فایل پنهان است و دکمه زیر آن را باز می‌کند. `tabIndex={-1}`
            دارد تا کاربر کیبورد دو بار به یک کار نرسد، و `aria-label` دارد
            تا اگر صفحه‌خوان مستقیم به آن رسید، بی‌نام نباشد. */}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          tabIndex={-1}
          aria-label="انتخاب فایل تصویر پروفایل"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) upload(file);
            event.target.value = "";
          }}
        />

        <Button
          type="button"
          variant="secondary"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          <Camera aria-hidden="true" />
          {busy ? "در حال آپلود…" : url ? "تغییر تصویر" : "انتخاب تصویر"}
        </Button>

        <p className="text-subtle text-xs">
          JPG، PNG یا WebP — حداکثر ۳ مگابایت.
        </p>

        {error && (
          <p role="alert" className="text-danger flex items-center gap-1.5 text-xs">
            <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}

        <span aria-live="polite" className="sr-only">
          {busy ? "در حال آپلود تصویر" : url ? "تصویر پروفایل به‌روز شد" : ""}
        </span>
      </div>
    </div>
  );
}
