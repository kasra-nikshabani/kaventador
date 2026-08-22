import { CircleCheck, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui";
import { COURSE_PROGRESS_LABELS, type CourseProgress } from "@/types";

/**
 * نشان وضعیت برگزاری دوره.
 *
 * «در حال برگزاری» یک نقطه تپنده می‌گیرد تا در میان بقیه بج‌ها فوراً
 * دیده شود. تنظیم «کاهش حرکت» کاربر در `globals.css` احترام گذاشته
 * می‌شود، پس این تپش برای کسی که آن را خاموش کرده اجرا نمی‌شود.
 * رنگ تنها حامل معنا نیست: متن و آیکون هم وضعیت را می‌گویند.
 */
export function CourseProgressBadge({
  progress,
  className,
}: {
  progress: CourseProgress;
  className?: string;
}) {
  const label = COURSE_PROGRESS_LABELS[progress];

  if (progress === "ongoing") {
    return (
      <Badge variant="accent" className={className}>
        <span
          aria-hidden="true"
          className="relative flex size-2 shrink-0 items-center justify-center"
        >
          <span className="absolute size-2 animate-ping rounded-full bg-current opacity-60" />
          <span className="size-1.5 rounded-full bg-current" />
        </span>
        {label}
      </Badge>
    );
  }

  if (progress === "upcoming") {
    return (
      <Badge variant="warning" className={className}>
        <Clock3 aria-hidden="true" />
        {label}
      </Badge>
    );
  }

  return (
    <Badge variant="neutral" className={className}>
      <CircleCheck aria-hidden="true" />
      {label}
    </Badge>
  );
}
