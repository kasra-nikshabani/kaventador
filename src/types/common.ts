/** تایپ‌های مشترک بین همه موجودیت‌ها. */

export type ID = string;
export type Slug = string;
/** تاریخ همیشه به صورت رشته ISO ذخیره می‌شود تا سریال‌سازی بین سرور و کلاینت امن باشد. */
export type ISODateString = string;

/** سطح دشواری محتوای آموزشی. */
export type Level = "beginner" | "intermediate" | "advanced";

export const LEVEL_LABELS: Record<Level, string> = {
  beginner: "مقدماتی",
  intermediate: "متوسط",
  advanced: "پیشرفته",
};

/** وضعیت انتشار محتوا — در پنل ادمین استفاده می‌شود. */
export type ContentStatus = "draft" | "published" | "archived";

export const CONTENT_STATUS_LABELS: Record<ContentStatus, string> = {
  draft: "پیش‌نویس",
  published: "منتشر شده",
  archived: "بایگانی شده",
};

/** ترتیب مرتب‌سازی لیست‌ها. */
export type SortOption = "newest" | "oldest" | "popular" | "rating" | "title";

export const SORT_LABELS: Record<SortOption, string> = {
  newest: "جدیدترین",
  oldest: "قدیمی‌ترین",
  popular: "محبوب‌ترین",
  rating: "بیشترین امتیاز",
  title: "بر اساس عنوان",
};

/** پارامترهای استاندارد کوئری برای همه سرویس‌های لیست. */
export interface QueryOptions {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: SortOption;
  categorySlug?: Slug;
  level?: Level;
  status?: ContentStatus;
  progress?: "upcoming" | "ongoing" | "completed";
  pricing?: "free" | "paid";
  tag?: string;
  featuredOnly?: boolean;
}

/** خروجی استاندارد لیست‌های صفحه‌بندی‌شده. */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
}

/** لینک‌های اجتماعی افراد (مدرس/نویسنده). */
export interface SocialProfile {
  github?: string;
  linkedin?: string;
  x?: string;
  telegram?: string;
  website?: string;
}
