import type { ID, Slug } from "./common";

/**
 * دسته‌بندی فناوری (جاوا، ری‌اکت و ...).
 * هم دوره‌ها و هم مقالات به دسته‌بندی وصل می‌شوند.
 */
export interface Category {
  id: ID;
  slug: Slug;
  /** عنوان فارسی برای نمایش. */
  title: string;
  /** نام انگلیسی فناوری — در بج‌ها و لوگوها استفاده می‌شود. */
  titleEn: string;
  description: string;
  /** کلید آیکون؛ به نگاشت آیکون‌ها در لایه UI ترجمه می‌شود. */
  icon: string;
  /** رنگ شاخص دسته به فرمت hex — فقط برای لهجه بصری کارت‌ها. */
  color: string;
  order: number;
}

/** دسته‌بندی همراه با آمار محاسبه‌شده — خروجی لایه سرویس. */
export interface CategoryWithStats extends Category {
  courseCount: number;
  articleCount: number;
}
