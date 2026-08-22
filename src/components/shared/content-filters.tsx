"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Button, Input, Select } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  COURSE_PROGRESS_LABELS,
  LEVEL_LABELS,
  SORT_LABELS,
  type Category,
  type CourseProgress,
  type SortOption,
} from "@/types";

const LEVEL_OPTIONS = ["beginner", "intermediate", "advanced"] as const;
const PROGRESS_OPTIONS: CourseProgress[] = ["ongoing", "upcoming", "completed"];

export interface ContentFiltersProps {
  categories: Category[];
  /** برچسب تعداد نتیجه؛ روی سرور ساخته می‌شود. */
  resultLabel: string;
  /** فیلتر سطح فقط برای دوره‌ها معنا دارد. */
  showLevel?: boolean;
  /** فیلتر وضعیت برگزاری — فقط برای دوره‌ها. */
  showProgress?: boolean;
  sortOptions: readonly SortOption[];
  searchPlaceholder: string;
  searchLabel: string;
}

/**
 * نوار فیلتر مشترک فهرست دوره‌ها و مقالات.
 *
 * وضعیت فیلتر در URL نگه داشته می‌شود، نه در state کامپوننت:
 * لینک نتیجه قابل اشتراک است، دکمه بازگشت درست کار می‌کند و
 * صفحه همچنان روی سرور رندر می‌شود.
 */
export function ContentFilters({
  categories,
  resultLabel,
  showLevel = false,
  showProgress = false,
  sortOptions,
  searchPlaceholder,
  searchLabel,
}: ContentFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get("category") ?? "";
  const currentLevel = searchParams.get("level") ?? "";
  const currentProgress = searchParams.get("progress") ?? "";
  const currentSort = searchParams.get("sort") ?? sortOptions[0];
  const currentSearch = searchParams.get("q") ?? "";
  const currentTag = searchParams.get("tag") ?? "";

  const hasFilters = Boolean(
    currentCategory ||
      currentLevel ||
      currentProgress ||
      currentSearch ||
      currentTag ||
      searchParams.get("sort"),
  );

  function apply(changes: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(changes)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }

    /* هر تغییر فیلتر، صفحه‌بندی را به صفحه اول برمی‌گرداند. */
    params.delete("page");

    const query = params.toString();
    startTransition(() => {
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  }

  return (
    <div className={cn("space-y-4", isPending && "opacity-70 transition-opacity")}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          const value = new FormData(event.currentTarget).get("q");
          apply({ q: typeof value === "string" ? value.trim() : "" });
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Search
            className="text-subtle pointer-events-none absolute inset-y-0 start-3.5 my-auto size-4"
            aria-hidden="true"
          />
          <Input
            /* با تغییر پارامتر URL، مقدار پیش‌فرض ورودی باید بازنشانی شود. */
            key={currentSearch}
            name="q"
            type="search"
            defaultValue={currentSearch}
            placeholder={searchPlaceholder}
            aria-label={searchLabel}
            className="ps-10"
          />
        </div>
        <Button type="submit">جستجو</Button>
      </form>

      <div className="flex flex-wrap items-center gap-3">
        <label className="sr-only" htmlFor="filter-category">
          فیلتر دسته‌بندی
        </label>
        <Select
          id="filter-category"
          value={currentCategory}
          onChange={(event) => apply({ category: event.target.value })}
          className="w-auto min-w-40"
        >
          <option value="">همه دسته‌بندی‌ها</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.title}
            </option>
          ))}
        </Select>

        {showLevel && (
          <>
            <label className="sr-only" htmlFor="filter-level">
              فیلتر سطح
            </label>
            <Select
              id="filter-level"
              value={currentLevel}
              onChange={(event) => apply({ level: event.target.value })}
              className="w-auto min-w-32"
            >
              <option value="">همه سطح‌ها</option>
              {LEVEL_OPTIONS.map((level) => (
                <option key={level} value={level}>
                  {LEVEL_LABELS[level]}
                </option>
              ))}
            </Select>
          </>
        )}

        {showProgress && (
          <>
            <label className="sr-only" htmlFor="filter-progress">
              فیلتر وضعیت برگزاری
            </label>
            <Select
              id="filter-progress"
              value={currentProgress}
              onChange={(event) => apply({ progress: event.target.value })}
              className="w-auto min-w-40"
            >
              <option value="">همه وضعیت‌ها</option>
              {PROGRESS_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {COURSE_PROGRESS_LABELS[value]}
                </option>
              ))}
            </Select>
          </>
        )}

        <label className="sr-only" htmlFor="filter-sort">
          ترتیب نمایش
        </label>
        <Select
          id="filter-sort"
          value={currentSort}
          onChange={(event) => apply({ sort: event.target.value })}
          className="w-auto min-w-36"
        >
          {sortOptions.map((sort) => (
            <option key={sort} value={sort}>
              {SORT_LABELS[sort]}
            </option>
          ))}
        </Select>

        {currentTag && (
          <Button variant="secondary" size="sm" onClick={() => apply({ tag: "" })}>
            برچسب: {currentTag}
            <X aria-hidden="true" />
          </Button>
        )}

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              startTransition(() => router.push(pathname, { scroll: false }))
            }
          >
            <X aria-hidden="true" />
            حذف فیلترها
          </Button>
        )}

        <p aria-live="polite" className="text-muted ms-auto text-sm">
          {resultLabel}
        </p>
      </div>
    </div>
  );
}
