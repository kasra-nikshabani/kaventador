import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";

export interface ProgressBarProps {
  /** درصد صحیح بین ۰ تا ۱۰۰. */
  percent: number;
  /** برچسبی که صفحه‌خوان می‌خواند — باید بگوید پیشرفتِ چه چیزی. */
  label: string;
  showValue?: boolean;
  className?: string;
}

/**
 * نوار پیشرفت.
 *
 * `role="progressbar"` با مقدارهای aria، تا صفحه‌خوان عدد را بخواند —
 * نه فقط یک نوار رنگی ببیند. عدد به‌صورت متنی هم کنارش می‌آید چون رنگ
 * و طول به‌تنهایی برای کاربر کم‌بینا کافی نیست.
 */
export function ProgressBar({
  percent,
  label,
  showValue = true,
  className,
}: ProgressBarProps) {
  const safe = Math.min(100, Math.max(0, Math.round(percent)));

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={safe}
        aria-valuemin={0}
        aria-valuemax={100}
        className="bg-surface-2 h-2 flex-1 overflow-hidden rounded-full"
      >
        <div
          className={cn(
            "h-full rounded-e-full transition-[width] duration-500",
            safe === 100 ? "bg-success" : "bg-primary",
          )}
          style={{ width: `${safe}%` }}
        />
      </div>
      {showValue && (
        <span className="text-muted w-10 shrink-0 text-xs tabular-nums">
          {formatNumber(safe)}٪
        </span>
      )}
    </div>
  );
}
