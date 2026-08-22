import type { LucideIcon } from "lucide-react";
import { SearchX } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** دکمه یا لینک اقدام پیشنهادی. */
  action?: ReactNode;
  /** سطح عنوان — تا سلسله‌مراتب عنوان‌های صفحه شکسته نشود. */
  as?: "h2" | "h3";
  className?: string;
}

/** حالت «چیزی پیدا نشد» برای لیست‌ها و نتایج جستجو. */
export function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  action,
  as: Heading = "h3",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border-border flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-16 text-center",
        className,
      )}
    >
      <div className="bg-surface-2 text-muted mb-4 flex size-14 items-center justify-center rounded-2xl">
        <Icon className="size-6" aria-hidden="true" />
      </div>
      <Heading className="text-foreground text-base font-bold">{title}</Heading>
      {description && (
        <p className="text-muted mt-1.5 max-w-sm text-sm">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
