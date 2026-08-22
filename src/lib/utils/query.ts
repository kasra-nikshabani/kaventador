import type { ContentStatus, Level, QueryOptions, SortOption } from "@/types";

/** شکل خام searchParams در App Router. */
export type RawSearchParams = Record<string, string | string[] | undefined>;

const LEVELS: Level[] = ["beginner", "intermediate", "advanced"];
const SORTS: SortOption[] = ["newest", "oldest", "popular", "rating", "title"];
const STATUSES: ContentStatus[] = ["draft", "published", "archived"];
const PROGRESS: QueryOptions["progress"][] = ["upcoming", "ongoing", "completed"];

function first(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() || undefined;
}

/**
 * تبدیل searchParams به گزینه‌های کوئری.
 *
 * هر مقدار نامعتبر بی‌سروصدا نادیده گرفته می‌شود؛ دستکاری URL
 * توسط کاربر نباید صفحه را بشکند یا خطا بدهد.
 */
export function parseQueryParams(
  searchParams: RawSearchParams,
  defaults: Pick<QueryOptions, "pageSize"> = {},
): QueryOptions {
  const level = first(searchParams.level);
  const sort = first(searchParams.sort);
  const status = first(searchParams.status);
  const progress = first(searchParams.progress);
  const page = Number.parseInt(first(searchParams.page) ?? "1", 10);

  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: defaults.pageSize,
    search: first(searchParams.q),
    categorySlug: first(searchParams.category),
    tag: first(searchParams.tag),
    level: LEVELS.includes(level as Level) ? (level as Level) : undefined,
    progress: PROGRESS.includes(progress as QueryOptions["progress"])
      ? (progress as QueryOptions["progress"])
      : undefined,
    sort: SORTS.includes(sort as SortOption) ? (sort as SortOption) : "newest",
    status: STATUSES.includes(status as ContentStatus)
      ? (status as ContentStatus)
      : undefined,
  };
}

/** ساخت رشته کوئری از روی پارامترهای فعلی، با تغییر یک کلید. */
export function buildQueryString(
  current: RawSearchParams,
  overrides: Record<string, string | number | undefined>,
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(current)) {
    const single = first(value);
    if (single) params.set(key, single);
  }

  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined || value === "") params.delete(key);
    else params.set(key, String(value));
  }

  const result = params.toString();
  return result ? `?${result}` : "";
}
