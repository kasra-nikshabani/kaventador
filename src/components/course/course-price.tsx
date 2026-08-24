import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { formatDiscount, formatPrice } from "@/lib/utils";
import type { CoursePricing } from "@/types";

export interface CoursePriceProps {
  pricing: CoursePricing;
  /** `card` فشرده برای کارت، `detail` بزرگ برای صفحه دوره. */
  size?: "card" | "detail";
  className?: string;
}

/**
 * نمایش قیمت دوره.
 *
 * وقتی تخفیف هست، مبلغ قبلی با `<s>` می‌آید نه فقط با خط CSS: صفحه‌خوان
 * هم باید بفهمد این عدد دیگر معتبر نیست. مبلغ اصلی همیشه اول خوانده
 * می‌شود و مبلغ قدیمی با برچسب صریح دنبالش می‌آید.
 */
export function CoursePrice({
  pricing,
  size = "card",
  className,
}: CoursePriceProps) {
  if (pricing.type === "free") {
    return (
      <span className={className}>
        <Badge variant="success" className={size === "detail" ? "text-sm" : undefined}>
          رایگان
        </Badge>
      </span>
    );
  }

  const hasDiscount =
    pricing.originalAmount !== undefined &&
    pricing.originalAmount > pricing.amount;

  return (
    <span className={cn("flex flex-wrap items-center gap-2", className)}>
      <span
        className={cn(
          "text-foreground font-black",
          size === "detail" ? "text-2xl" : "text-sm",
        )}
      >
        {formatPrice(pricing.amount)}
      </span>

      {hasDiscount && (
        <>
          <s className={cn("text-subtle", size === "detail" ? "text-base" : "text-xs")}>
            <span className="sr-only">قیمت پیش از تخفیف: </span>
            {formatPrice(pricing.originalAmount!)}
          </s>
          <Badge variant="danger">
            {formatDiscount(pricing.originalAmount!, pricing.amount)} تخفیف
          </Badge>
        </>
      )}
    </span>
  );
}
