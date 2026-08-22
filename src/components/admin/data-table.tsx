import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  /** رندر سلول؛ اگر نباشد مقدار خام رشته‌ای استفاده می‌شود. */
  cell: (row: T) => ReactNode;
  /** ستون‌هایی که روی صفحه کوچک پنهان می‌شوند. */
  hideBelow?: "sm" | "md" | "lg";
  align?: "start" | "end";
}

const HIDE_STYLES = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
} as const;

export interface DataTableProps<T> {
  caption: string;
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** وقتی هیچ ردیفی نیست. */
  empty?: ReactNode;
}

/**
 * جدول داده پنل مدیریت.
 *
 * `<table>` واقعی است، نه شبکه‌ای از div: صفحه‌خوان تعداد سطر و ستون و
 * سرستون هر سلول را می‌شناسد. جدول در ظرف اسکرول افقی می‌نشیند تا در
 * صفحه کوچک، کل صفحه به هم نریزد.
 */
export function DataTable<T>({
  caption,
  columns,
  rows,
  rowKey,
  empty,
}: DataTableProps<T>) {
  if (rows.length === 0 && empty) {
    return <>{empty}</>;
  }

  return (
    <div className="border-border bg-surface overflow-x-auto rounded-2xl border">
      <table className="w-full min-w-[40rem] border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>

        <thead>
          <tr className="border-border border-b">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  "text-muted px-4 py-3.5 font-medium whitespace-nowrap",
                  column.align === "end" ? "text-end" : "text-start",
                  column.hideBelow && HIDE_STYLES[column.hideBelow],
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className="border-border hover:bg-surface-2 border-b transition-colors last:border-b-0"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    "px-4 py-3.5",
                    column.align === "end" ? "text-end" : "text-start",
                    column.hideBelow && HIDE_STYLES[column.hideBelow],
                  )}
                >
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
