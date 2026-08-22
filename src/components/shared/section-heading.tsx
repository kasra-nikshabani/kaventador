import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  /** برچسب کوچک بالای عنوان. */
  eyebrow?: string;
  title: string;
  description?: string;
  /** دکمه یا لینک کنار عنوان — فقط در حالت چیدمان شروع دیده می‌شود. */
  action?: ReactNode;
  align?: "start" | "center";
  /** سطح عنوان؛ برای حفظ سلسله‌مراتب درست در هر صفحه. */
  as?: "h1" | "h2" | "h3";
  /** شناسه عنوان — برای اتصال `aria-labelledby` بخش میزبان. */
  headingId?: string;
  className?: string;
}

/** عنوان استاندارد بخش‌های صفحه — در کل سایت یکدست است. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "start",
  as: Heading = "h2",
  headingId,
  className,
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "gap-4",
        isCenter
          ? "flex flex-col items-center text-center"
          : "flex flex-col justify-between gap-6 sm:flex-row sm:items-end",
        className,
      )}
    >
      <div className={cn("space-y-2", isCenter && "max-w-2xl")}>
        {eyebrow && (
          <p className="text-primary text-sm font-bold">{eyebrow}</p>
        )}
        <Heading id={headingId} className="text-2xl font-black sm:text-3xl">
          {title}
        </Heading>
        {description && <p className="text-muted">{description}</p>}
      </div>

      {action && !isCenter && <div className="shrink-0">{action}</div>}
    </div>
  );
}
