import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { formatNumber } from "@/lib/utils";
import { buildQueryString, type RawSearchParams } from "@/lib/utils/query";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  page: number;
  totalPages: number;
  /** مسیر پایه، مثلاً `/courses`. */
  pathname: string;
  /** پارامترهای فعلی تا هنگام جابه‌جایی صفحه حفظ شوند. */
  searchParams: RawSearchParams;
}

/** تعداد شماره‌های میانی که همیشه دور صفحه فعلی نشان داده می‌شوند. */
function buildPageList(page: number, totalPages: number): (number | "gap")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, page]);
  if (page > 1) pages.add(page - 1);
  if (page < totalPages) pages.add(page + 1);

  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | "gap")[] = [];

  sorted.forEach((value, index) => {
    if (index > 0 && value - sorted[index - 1] > 1) result.push("gap");
    result.push(value);
  });

  return result;
}

/**
 * صفحه‌بندی مبتنی بر لینک.
 *
 * عمداً کلاینتی نیست: لینک واقعی یعنی بدون جاوااسکریپت هم کار می‌کند،
 * قابل باز کردن در تب جدید است و موتور جستجو صفحات بعدی را می‌بیند.
 */
export function Pagination({
  page,
  totalPages,
  pathname,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const href = (target: number) =>
    `${pathname}${buildQueryString(searchParams, {
      page: target === 1 ? undefined : target,
    })}`;

  const itemStyles =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

  return (
    <nav aria-label="صفحه‌بندی" className="mt-12 flex justify-center">
      <ul className="flex flex-wrap items-center gap-2">
        <li>
          {page > 1 ? (
            <Link
              href={href(page - 1)}
              rel="prev"
              aria-label="صفحه قبلی"
              className={cn(
                itemStyles,
                "border-border text-muted hover:border-border-strong hover:text-foreground",
              )}
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className={cn(itemStyles, "border-border text-subtle opacity-50")}
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </span>
          )}
        </li>

        {buildPageList(page, totalPages).map((item, index) =>
          item === "gap" ? (
            <li key={`gap-${index}`} className="text-subtle px-1" aria-hidden="true">
              …
            </li>
          ) : (
            <li key={item}>
              <Link
                href={href(item)}
                aria-label={`صفحه ${formatNumber(item)}`}
                aria-current={item === page ? "page" : undefined}
                className={cn(
                  itemStyles,
                  item === page
                    ? "border-primary bg-primary text-primary-foreground font-bold"
                    : "border-border text-muted hover:border-border-strong hover:text-foreground",
                )}
              >
                {formatNumber(item)}
              </Link>
            </li>
          ),
        )}

        <li>
          {page < totalPages ? (
            <Link
              href={href(page + 1)}
              rel="next"
              aria-label="صفحه بعدی"
              className={cn(
                itemStyles,
                "border-border text-muted hover:border-border-strong hover:text-foreground",
              )}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className={cn(itemStyles, "border-border text-subtle opacity-50")}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
