import type { Paginated } from "@/types";

/** ساخت خروجی استاندارد صفحه‌بندی از یک آرایه کامل. */
export function paginate<T>(
  items: T[],
  page = 1,
  pageSize = 9,
): Paginated<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
    hasPrev: safePage > 1,
    hasNext: safePage < totalPages,
  };
}

/** جستجوی ساده و بدون حساسیت به حروف روی چند فیلد متنی. */
export function matchesSearch(term: string | undefined, ...fields: string[]) {
  if (!term?.trim()) return true;
  const needle = term.trim().toLowerCase();
  return fields.some((field) => field.toLowerCase().includes(needle));
}

/** مرتب‌سازی نزولی بر اساس تاریخ ISO. */
export function byNewest(a: { publishedAt: string }, b: { publishedAt: string }) {
  return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
}
