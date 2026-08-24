import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * نشان برند: دایره + «K» دورنگ.
 *
 * بازسازی برداری از لوگوی رسمی است تا در هر اندازه تیز بماند و
 * در تم تاریک هم دیده شود (رنگ‌ها از توکن‌های `--logo-*` می‌آیند).
 * اگر فایل برداری اصلی را دارید، همین مسیر جای تعویضش است.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-hidden="true"
      focusable="false"
      className={cn("size-9 shrink-0", className)}
    >
      <circle
        cx="24"
        cy="24"
        r="20.4"
        fill="none"
        stroke="var(--logo-ink)"
        strokeWidth="3.2"
      />
      {/* ستون K */}
      <path d="M16.2 13.2h4.6v21.6h-4.6z" fill="var(--logo-ink)" />
      {/* بازوی بالا — رنگ ثانویه برند */}
      <path
        d="M33.9 13.2h-6.1l-9.4 9.9 3.1 3.2z"
        fill="var(--logo-accent)"
      />
      {/* بازوی پایین */}
      <path d="M33.9 34.8h-6.1l-9.4-9.9 3.1-3.2z" fill="var(--logo-ink)" />
      {/* نشانگر ترمینال — لهجه هکری نشان برند */}
      <rect
        x="35.4"
        y="29.6"
        width="4.2"
        height="5.2"
        fill="var(--logo-accent)"
        className="motion-safe:animate-[terminal-blink_1.1s_steps(2,start)_infinite]"
      />
    </svg>
  );
}

export interface LogoProps {
  /** فقط نشان، بدون نشان‌واژه — مناسب فضاهای تنگ. */
  markOnly?: boolean;
  className?: string;
}

export function Logo({ markOnly = false, className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} — صفحه اصلی`}
      className={cn(
        "focus-visible:outline-ring group inline-flex items-center gap-2.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4",
        className,
      )}
    >
      <LogoMark className="transition-transform duration-300 group-hover:scale-105" />
      {!markOnly && (
        /* نشان‌واژه رسمی برند لاتین و با حروف کوچک است. */
        <span
          dir="ltr"
          className="text-foreground font-mono text-xl leading-none font-bold tracking-tight lowercase"
        >
          {siteConfig.nameEn}
        </span>
      )}
    </Link>
  );
}
