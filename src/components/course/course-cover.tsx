import type { CSSProperties } from "react";
import { CategoryIcon } from "@/components/shared/category-icon";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

export interface CourseCoverProps {
  category: Category;
  titleEn: string;
  /** تصویر واقعی؛ اگر خالی باشد، جانمای برندشده رندر می‌شود. */
  src?: string;
  className?: string;
}

/**
 * بنر دوره.
 *
 * تا وقتی تصویر واقعی وجود ندارد، به‌جای تصویر شکسته یک جانمای
 * برندشده بر پایه رنگ و آیکون دسته‌بندی ساخته می‌شود.
 * رنگ از داده می‌آید (نه از Tailwind)، پس inline style اینجا درست است.
 */
export function CourseCover({
  category,
  titleEn,
  src,
  className,
}: CourseCoverProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        className={cn("aspect-video w-full object-cover", className)}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      style={{ "--category-color": category.color } as CSSProperties}
      className={cn(
        "bg-surface-2 relative flex aspect-video items-center justify-center overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,var(--category-color),transparent_62%)] opacity-25" />
      <div className="bg-grid absolute inset-0 opacity-30" />
      <CategoryIcon
        icon={category.icon}
        className="relative size-14 opacity-90"
        style={{ color: "var(--category-color)" }}
      />
      <span
        dir="ltr"
        /* اینجا پس‌زمینه surface-2 است، پس muted لازم است نه subtle. */
        className="text-muted absolute bottom-3 end-4 font-mono text-xs tracking-widest uppercase"
      >
        {titleEn}
      </span>
    </div>
  );
}
