"use client";

import { Check, Link2, Share2 } from "lucide-react";
import { useState } from "react";
import { TelegramIcon } from "@/components/shared/brand-icons";
import { cn } from "@/lib/utils";

const BUTTON_STYLES =
  "border-border text-muted hover:border-primary hover:text-primary focus-visible:outline-ring inline-flex size-10 cursor-pointer items-center justify-center rounded-xl border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2";

export interface ShareButtonsProps {
  /** مسیر نسبی مقاله؛ نشانی کامل در مرورگر ساخته می‌شود. */
  path: string;
  title: string;
  className?: string;
}

/** اشتراک‌گذاری مقاله: اشتراک بومی مرورگر، تلگرام و کپی نشانی. */
export function ShareButtons({ path, title, className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  /* نشانی فقط هنگام کلیک خوانده می‌شود تا رندر سرور و کلاینت یکی بماند. */
  const absoluteUrl = () => new URL(path, window.location.origin).toString();

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(absoluteUrl());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* اگر دسترسی کلیپ‌بورد نبود، بی‌سروصدا رد می‌شویم. */
    }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-muted text-sm">اشتراک‌گذاری:</span>

      <button
        type="button"
        aria-label="اشتراک‌گذاری در تلگرام"
        title="تلگرام"
        onClick={() =>
          window.open(
            `https://t.me/share/url?url=${encodeURIComponent(absoluteUrl())}&text=${encodeURIComponent(title)}`,
            "_blank",
            "noopener,noreferrer",
          )
        }
        className={BUTTON_STYLES}
      >
        <TelegramIcon className="size-4" />
      </button>

      <button
        type="button"
        aria-label="اشتراک‌گذاری با برنامه‌های دستگاه"
        title="اشتراک‌گذاری"
        onClick={() => {
          if (navigator.share) {
            navigator.share({ title, url: absoluteUrl() }).catch(() => {});
          } else {
            copyLink();
          }
        }}
        className={BUTTON_STYLES}
      >
        <Share2 className="size-4" aria-hidden="true" />
      </button>

      <button
        type="button"
        aria-label="کپی نشانی مقاله"
        title={copied ? "کپی شد" : "کپی نشانی"}
        onClick={copyLink}
        className={cn(BUTTON_STYLES, copied && "border-success text-success")}
      >
        {copied ? (
          <Check className="size-4" aria-hidden="true" />
        ) : (
          <Link2 className="size-4" aria-hidden="true" />
        )}
      </button>

      <span aria-live="polite" className="sr-only">
        {copied ? "نشانی مقاله کپی شد" : ""}
      </span>
    </div>
  );
}
