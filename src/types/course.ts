import type { Category } from "./category";
import type { ContentStatus, ID, ISODateString, Level, Slug } from "./common";
import type { Person } from "./person";

/**
 * وضعیت برگزاری دوره.
 *
 * عمداً از `ContentStatus` جداست: آن یکی می‌گوید محتوا منتشر شده یا نه،
 * این یکی می‌گوید تولید دوره تمام شده یا هنوز درس اضافه می‌شود.
 * یک دوره می‌تواند همزمان «منتشر شده» و «در حال برگزاری» باشد.
 */
export type CourseProgress = "upcoming" | "ongoing" | "completed";

export const COURSE_PROGRESS_LABELS: Record<CourseProgress, string> = {
  upcoming: "به‌زودی",
  ongoing: "در حال برگزاری",
  completed: "تکمیل‌شده",
};

/** نوع محتوای یک درس. */
export type LessonType = "video" | "article" | "quiz" | "project";

export const LESSON_TYPE_LABELS: Record<LessonType, string> = {
  video: "ویدیو",
  article: "متن",
  quiz: "آزمون",
  project: "پروژه",
};

/** کوچک‌ترین واحد محتوا داخل یک دوره. */
export interface Lesson {
  id: ID;
  slug: Slug;
  title: string;
  type: LessonType;
  durationMinutes: number;
  /** درس‌های رایگان قبل از ثبت‌نام هم قابل مشاهده‌اند. */
  isFree: boolean;
  order: number;

  /**
   * نشانی ویدیو روی سرور خودمان — از مسیر `/api/media/...` سرو می‌شود،
   * نه مستقیم از `public/`، تا بتوان بعداً کنترل دسترسی اضافه کرد.
   */
  videoUrl?: string;
  /** حجم فایل به بایت — برای نمایش در پنل. */
  videoSizeBytes?: number;
}

/** گروه‌بندی درس‌ها؛ همان «فصل» در سرفصل دوره. */
export interface Chapter {
  id: ID;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}

/**
 * پروژه عملی خروجی دوره.
 * این همان چیزی است که کاوِنتادور را «پروژه‌محور» می‌کند.
 */
export interface CourseProject {
  id: ID;
  title: string;
  description: string;
  /** فناوری‌هایی که در این پروژه تمرین می‌شوند. */
  skills: string[];
  image?: string;
  repoUrl?: string;
  demoUrl?: string;
}

export interface Course {
  id: ID;
  slug: Slug;
  title: string;
  titleEn: string;
  /** خلاصه یک‌خطی برای کارت‌ها و متادیتا. */
  excerpt: string;
  /** توضیح کامل برای صفحه جزئیات. */
  description: string;
  cover: string;
  categoryId: ID;
  instructorId: ID;
  level: Level;
  status: ContentStatus;
  progress: CourseProgress;
  /** تاریخ انتشار درس بعدی — فقط برای دوره‌های در حال برگزاری معنا دارد. */
  nextReleaseAt?: ISODateString;

  /** آمار — در لایه سرویس از روی فصل‌ها هم قابل محاسبه است. */
  durationMinutes: number;
  lessonCount: number;
  studentCount: number;
  rating: number;
  ratingCount: number;

  /** پیش‌نیازهای دوره. */
  prerequisites: string[];
  /** «پس از این دوره چه می‌توانی بسازی» — محور اصلی صفحه دوره. */
  outcomes: string[];
  tags: string[];

  chapters: Chapter[];
  projects: CourseProject[];

  isFeatured: boolean;
  publishedAt: ISODateString;
  updatedAt: ISODateString;
}

/** دوره به همراه روابطش — چیزی که کامپوننت‌ها واقعاً مصرف می‌کنند. */
export interface CourseWithRelations extends Course {
  category: Category;
  instructor: Person;
}
