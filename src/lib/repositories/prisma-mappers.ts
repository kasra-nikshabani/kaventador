import "server-only";
import type {
  Article,
  Category,
  Chapter,
  Course,
  CoursePricing,
  CourseProject,
  Enrollment,
  Lesson,
  Person,
  SocialProfile,
  User,
} from "@/types";

/**
 * ترجمه بین ردیف دیتابیس و تایپ دامنه.
 *
 * این فایل عمداً وجود دارد. شکل رابطه‌ای و شکل دامنه یکی نیستند و
 * نباید یکی شوند: جدول `Course` سه ستون تخت برای قیمت دارد، دامنه یک
 * شیء `CoursePricing` دارد که «رایگان» و «پولی» را از هم تفکیک می‌کند.
 * اگر این ترجمه را حذف کنیم، شکل دیتابیس به همه کامپوننت‌ها نشت می‌کند.
 *
 * دو قاعده که همه‌جا رعایت می‌شوند:
 *  • تاریخ در دامنه رشته `YYYY-MM-DD` است، نه `Date` — تا سریال‌سازی
 *    بین سرور و کلاینت امن بماند.
 *  • `null` دیتابیس به `undefined` دامنه تبدیل می‌شود، چون تایپ‌های
 *    اختیاری ما با `?` تعریف شده‌اند نه با `| null`.
 */

/* ---------------------------------------------------------------
   تاریخ
--------------------------------------------------------------- */

export function toIsoDate(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export function toIsoDateOrUndefined(value: Date | null): string | undefined {
  return value ? toIsoDate(value) : undefined;
}

/** رشته `YYYY-MM-DD` به `Date`. رشته خالی یعنی «مقدار ندارد». */
export function fromIsoDate(value: string | undefined): Date | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/* ---------------------------------------------------------------
   شکل ردیف‌ها — از خروجی کوئری‌های این پروژه استنتاج می‌شوند
--------------------------------------------------------------- */

type CategoryRow = {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  icon: string;
  color: string;
  order: number;
};

type PersonRow = {
  id: string;
  slug: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  githubUrl: string | null;
  linkedinUrl: string | null;
  xUrl: string | null;
  telegramUrl: string | null;
  websiteUrl: string | null;
};

type LessonRow = {
  id: string;
  slug: string;
  title: string;
  type: Lesson["type"];
  durationMinutes: number;
  isFree: boolean;
  order: number;
  videoUrl: string | null;
  videoSizeBytes: number | null;
};

type ChapterRow = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  lessons: LessonRow[];
};

type ProjectRow = {
  id: string;
  title: string;
  description: string;
  skills: string[];
  image: string | null;
  repoUrl: string | null;
  demoUrl: string | null;
};

type CourseRow = {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  excerpt: string;
  description: string;
  cover: string;
  categoryId: string;
  instructorId: string;
  level: Course["level"];
  status: Course["status"];
  progress: Course["progress"];
  pricingType: "free" | "paid";
  priceAmount: number | null;
  priceOriginalAmount: number | null;
  nextReleaseAt: Date | null;
  durationMinutes: number;
  lessonCount: number;
  studentCount: number;
  rating: number;
  ratingCount: number;
  prerequisites: string[];
  outcomes: string[];
  isFeatured: boolean;
  publishedAt: Date;
  updatedAt: Date;
  tags: { name: string }[];
  chapters: ChapterRow[];
  projects: ProjectRow[];
};

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  categoryId: string;
  authorId: string;
  status: Article["status"];
  readingMinutes: number;
  viewCount: number;
  isFeatured: boolean;
  publishedAt: Date;
  updatedAt: Date;
  tags: { name: string }[];
};

type EnrollmentRow = {
  courseId: string;
  status: Enrollment["status"];
  enrolledAt: Date;
  completedLessonIds: string[];
  lastAccessedAt: Date | null;
};

type UserRow = {
  id: string;
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  avatar: string | null;
  role: User["role"];
  status: User["status"];
  joinedAt: Date;
  lastActiveAt: Date | null;
  personId: string | null;
  enrollments: EnrollmentRow[];
};

/* ---------------------------------------------------------------
   ردیف ← دامنه
--------------------------------------------------------------- */

export function toCategory(row: CategoryRow): Category {
  return { ...row };
}

export function toPerson(row: PersonRow): Person {
  const socials: SocialProfile = {};
  if (row.githubUrl) socials.github = row.githubUrl;
  if (row.linkedinUrl) socials.linkedin = row.linkedinUrl;
  if (row.xUrl) socials.x = row.xUrl;
  if (row.telegramUrl) socials.telegram = row.telegramUrl;
  if (row.websiteUrl) socials.website = row.websiteUrl;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    role: row.role,
    bio: row.bio,
    avatar: row.avatar,
    socials,
  };
}

export function toLesson(row: LessonRow): Lesson {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    type: row.type,
    durationMinutes: row.durationMinutes,
    isFree: row.isFree,
    order: row.order,
    videoUrl: row.videoUrl ?? undefined,
    videoSizeBytes: row.videoSizeBytes ?? undefined,
  };
}

export function toChapter(row: ChapterRow): Chapter {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    order: row.order,
    lessons: row.lessons.map(toLesson),
  };
}

function toProject(row: ProjectRow): CourseProject {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    skills: row.skills,
    image: row.image ?? undefined,
    repoUrl: row.repoUrl ?? undefined,
    demoUrl: row.demoUrl ?? undefined,
  };
}

/**
 * سه ستون تخت به یک شیء قیمت‌گذاری.
 *
 * اگر ردیف بگوید «پولی» ولی مبلغ خالی باشد، به‌جای ساختن یک دوره پولیِ
 * بی‌قیمت، رایگان برمی‌گردانیم — حالت ناسازگار نباید به دامنه راه پیدا
 * کند. اعتبارسنجی هنگام نوشتن جلوی این حالت را می‌گیرد؛ این فقط تور
 * ایمنی است.
 */
export function toPricing(row: {
  pricingType: "free" | "paid";
  priceAmount: number | null;
  priceOriginalAmount: number | null;
}): CoursePricing {
  if (row.pricingType !== "paid" || row.priceAmount === null) {
    return { type: "free" };
  }

  return {
    type: "paid",
    amount: row.priceAmount,
    originalAmount: row.priceOriginalAmount ?? undefined,
  };
}

export function toCourse(row: CourseRow): Course {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    titleEn: row.titleEn,
    excerpt: row.excerpt,
    description: row.description,
    cover: row.cover,
    categoryId: row.categoryId,
    instructorId: row.instructorId,
    level: row.level,
    status: row.status,
    progress: row.progress,
    pricing: toPricing(row),
    nextReleaseAt: toIsoDateOrUndefined(row.nextReleaseAt),
    durationMinutes: row.durationMinutes,
    lessonCount: row.lessonCount,
    studentCount: row.studentCount,
    rating: row.rating,
    ratingCount: row.ratingCount,
    prerequisites: row.prerequisites,
    outcomes: row.outcomes,
    tags: row.tags.map((tag) => tag.name),
    chapters: row.chapters.map(toChapter),
    projects: row.projects.map(toProject),
    isFeatured: row.isFeatured,
    publishedAt: toIsoDate(row.publishedAt),
    updatedAt: toIsoDate(row.updatedAt),
  };
}

export function toArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    cover: row.cover,
    categoryId: row.categoryId,
    authorId: row.authorId,
    tags: row.tags.map((tag) => tag.name),
    status: row.status,
    readingMinutes: row.readingMinutes,
    viewCount: row.viewCount,
    isFeatured: row.isFeatured,
    publishedAt: toIsoDate(row.publishedAt),
    updatedAt: toIsoDate(row.updatedAt),
  };
}

export function toEnrollment(row: EnrollmentRow): Enrollment {
  return {
    courseId: row.courseId,
    status: row.status,
    enrolledAt: toIsoDate(row.enrolledAt),
    completedLessonIds: row.completedLessonIds,
    lastAccessedAt: toIsoDateOrUndefined(row.lastAccessedAt),
  };
}

export function toUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    username: row.username,
    email: row.email,
    passwordHash: row.passwordHash,
    avatar: row.avatar ?? undefined,
    role: row.role,
    status: row.status,
    joinedAt: toIsoDate(row.joinedAt),
    lastActiveAt: toIsoDateOrUndefined(row.lastActiveAt),
    personId: row.personId ?? undefined,
    enrollments: row.enrollments.map(toEnrollment),
  };
}

/* ---------------------------------------------------------------
   دامنه ← ردیف
--------------------------------------------------------------- */

/** شیء قیمت‌گذاری به سه ستون تخت. */
export function fromPricing(pricing: CoursePricing) {
  return pricing.type === "paid"
    ? {
        pricingType: "paid" as const,
        priceAmount: pricing.amount,
        priceOriginalAmount: pricing.originalAmount ?? null,
      }
    : {
        pricingType: "free" as const,
        priceAmount: null,
        priceOriginalAmount: null,
      };
}

export function fromSocials(socials: SocialProfile) {
  return {
    githubUrl: socials.github ?? null,
    linkedinUrl: socials.linkedin ?? null,
    xUrl: socials.x ?? null,
    telegramUrl: socials.telegram ?? null,
    websiteUrl: socials.website ?? null,
  };
}

/**
 * برچسب‌ها را به شکلی که Prisma برای رابطه چندبه‌چند می‌خواهد درمی‌آورد.
 * `connectOrCreate` یعنی برچسب تکراری ساخته نمی‌شود.
 */
export function connectTags(tags: string[]) {
  const unique = [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))];

  return {
    connectOrCreate: unique.map((name) => ({
      where: { name },
      create: { name },
    })),
  };
}
