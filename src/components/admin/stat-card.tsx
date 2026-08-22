import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui";

export interface StatCardProps {
  label: string;
  value: string;
  /** خط توضیح زیر عدد — مثلاً تفکیک منتشرشده/پیش‌نویس. */
  hint?: string;
  icon: LucideIcon;
}

/**
 * کارت آمار داشبورد.
 *
 * عدد با ارقام متناسب (نه tabular) رندر می‌شود؛ ارقام هم‌عرض فقط برای
 * ستون‌های عددی جدول لازم است و در اندازه بزرگ، شل به نظر می‌رسد.
 */
export function StatCard({ label, value, hint, icon: Icon }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-muted text-sm">{label}</p>
          <p className="mt-1 text-3xl font-black">{value}</p>
          {hint && <p className="text-subtle mt-1 text-xs">{hint}</p>}
        </div>
        <span className="bg-primary-soft text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
    </Card>
  );
}
