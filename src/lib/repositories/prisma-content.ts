import "server-only";
import { prisma } from "@/lib/db/prisma";
import type { ContentRepository } from "@/lib/repositories/contracts";
import {
  connectTags,
  fromIsoDate,
  fromPricing,
  fromSocials,
  toArticle,
  toCategory,
  toCourse,
  toPerson,
  toUser,
} from "@/lib/repositories/prisma-mappers";
import { nextId } from "@/lib/repositories/store";
import type { Article, Category, Course, Person, User } from "@/types";

/**
 * پیاده‌سازی Prisma لایه ریپازیتوری.
 *
 * قراردادش دقیقاً همان `ContentRepository` است که پیاده‌سازی حافظه‌ای
 * برآورده می‌کند؛ `satisfies` در انتهای فایل این را اجبار می‌کند.
 *
 * ⚠️ محدودیت آگاهانه: `findAll*` واقعاً همه ردیف‌ها را می‌آورد و
 * فیلتر و صفحه‌بندی در لایه سرویس روی حافظه انجام می‌شود — همان رفتار
 * پیاده‌سازی قبلی. در این اندازه (ده‌ها دوره) درست کار می‌کند، ولی
 * وقتی کاتالوگ بزرگ شد باید فیلترها به خود SQL منتقل شوند.
 */

/* دوره همیشه با روابطش و با ترتیب درست خوانده می‌شود؛ سرفصلِ بی‌ترتیب
   یعنی «فصل ۳» بالای «فصل ۱». */
const courseInclude = {
  tags: { select: { name: true } },
  projects: true,
  chapters: {
    orderBy: { order: "asc" },
    include: { lessons: { orderBy: { order: "asc" } } },
  },
} as const;

const articleInclude = { tags: { select: { name: true } } } as const;

const userInclude = {
  enrollments: { orderBy: { enrolledAt: "desc" } },
} as const;

/* ---------------------------------------------------------------
   خواندن
--------------------------------------------------------------- */

export async function findAllCourses(): Promise<Course[]> {
  const rows = await prisma.course.findMany({
    include: courseInclude,
    orderBy: { publishedAt: "desc" },
  });
  return rows.map(toCourse);
}

export async function findCourseBySlug(slug: string): Promise<Course | null> {
  const row = await prisma.course.findUnique({
    where: { slug },
    include: courseInclude,
  });
  return row ? toCourse(row) : null;
}

export async function findCourseById(id: string): Promise<Course | null> {
  const row = await prisma.course.findUnique({
    where: { id },
    include: courseInclude,
  });
  return row ? toCourse(row) : null;
}

export async function findAllArticles(): Promise<Article[]> {
  const rows = await prisma.article.findMany({
    include: articleInclude,
    orderBy: { publishedAt: "desc" },
  });
  return rows.map(toArticle);
}

export async function findArticleBySlug(slug: string): Promise<Article | null> {
  const row = await prisma.article.findUnique({
    where: { slug },
    include: articleInclude,
  });
  return row ? toArticle(row) : null;
}

export async function findArticleById(id: string): Promise<Article | null> {
  const row = await prisma.article.findUnique({
    where: { id },
    include: articleInclude,
  });
  return row ? toArticle(row) : null;
}

export async function findAllCategories(): Promise<Category[]> {
  const rows = await prisma.category.findMany({ orderBy: { order: "asc" } });
  return rows.map(toCategory);
}

export async function findCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const row = await prisma.category.findUnique({ where: { slug } });
  return row ? toCategory(row) : null;
}

export async function findCategoryById(id: string): Promise<Category | null> {
  const row = await prisma.category.findUnique({ where: { id } });
  return row ? toCategory(row) : null;
}

export async function findAllPeople(): Promise<Person[]> {
  const rows = await prisma.person.findMany({ orderBy: { name: "asc" } });
  return rows.map(toPerson);
}

export async function findPersonById(id: string): Promise<Person | null> {
  const row = await prisma.person.findUnique({ where: { id } });
  return row ? toPerson(row) : null;
}

export async function findAllUsers(): Promise<User[]> {
  const rows = await prisma.user.findMany({
    include: userInclude,
    orderBy: { joinedAt: "desc" },
  });
  return rows.map(toUser);
}

export async function findUserById(id: string): Promise<User | null> {
  const row = await prisma.user.findUnique({
    where: { id },
    include: userInclude,
  });
  return row ? toUser(row) : null;
}

/**
 * جستجوی نام کاربری — بدون حساسیت به حروف بزرگ و کوچک.
 *
 * `mode: "insensitive"` لازم است چون ستون `citext` نیست. بدون آن،
 * کسی که با `Admin` ثبت‌نام کرده با `admin` وارد نمی‌شود.
 */
export async function findUserByUsername(
  username: string,
): Promise<User | null> {
  const row = await prisma.user.findFirst({
    where: { username: { equals: username.trim(), mode: "insensitive" } },
    include: userInclude,
  });
  return row ? toUser(row) : null;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const row = await prisma.user.findFirst({
    where: { email: { equals: email.trim(), mode: "insensitive" } },
    include: userInclude,
  });
  return row ? toUser(row) : null;
}

/* ---------------------------------------------------------------
   نوشتن
--------------------------------------------------------------- */

export async function insertCourse(course: Course): Promise<Course> {
  const row = await prisma.course.create({
    data: {
      id: course.id,
      slug: course.slug,
      title: course.title,
      titleEn: course.titleEn,
      excerpt: course.excerpt,
      description: course.description,
      cover: course.cover,
      categoryId: course.categoryId,
      instructorId: course.instructorId,
      level: course.level,
      status: course.status,
      progress: course.progress,
      ...fromPricing(course.pricing),
      nextReleaseAt: fromIsoDate(course.nextReleaseAt),
      durationMinutes: course.durationMinutes,
      lessonCount: course.lessonCount,
      studentCount: course.studentCount,
      rating: course.rating,
      ratingCount: course.ratingCount,
      prerequisites: course.prerequisites,
      outcomes: course.outcomes,
      isFeatured: course.isFeatured,
      publishedAt: fromIsoDate(course.publishedAt) ?? new Date(),
      tags: connectTags(course.tags),
      chapters: {
        create: course.chapters.map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
          description: chapter.description ?? null,
          order: chapter.order,
          lessons: {
            create: chapter.lessons.map((lesson) => ({
              id: lesson.id,
              slug: lesson.slug,
              title: lesson.title,
              type: lesson.type,
              durationMinutes: lesson.durationMinutes,
              isFree: lesson.isFree,
              order: lesson.order,
              videoUrl: lesson.videoUrl ?? null,
              videoSizeBytes: lesson.videoSizeBytes ?? null,
            })),
          },
        })),
      },
      projects: {
        create: course.projects.map((project) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          skills: project.skills,
          image: project.image ?? null,
          repoUrl: project.repoUrl ?? null,
          demoUrl: project.demoUrl ?? null,
        })),
      },
    },
    include: courseInclude,
  });

  return toCourse(row);
}

/**
 * به‌روزرسانی جزئی دوره.
 *
 * فقط کلیدهایی که واقعاً در `changes` آمده‌اند نوشته می‌شوند — نه
 * `undefined`هایی که Prisma به‌عنوان «تغییر نده» می‌فهمد ولی خواندنشان
 * از شیء ورودی گمراه‌کننده است. `chapters` و `projects` عمداً اینجا
 * دست‌کاری نمی‌شوند؛ سرفصل واحد کاری جداگانه‌ای دارد.
 */
export async function patchCourse(
  id: string,
  changes: Partial<Course>,
): Promise<Course | null> {
  const exists = await prisma.course.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!exists) return null;

  const has = <K extends keyof Course>(key: K) => key in changes;

  const row = await prisma.course.update({
    where: { id },
    data: {
      ...(has("slug") && { slug: changes.slug }),
      ...(has("title") && { title: changes.title }),
      ...(has("titleEn") && { titleEn: changes.titleEn }),
      ...(has("excerpt") && { excerpt: changes.excerpt }),
      ...(has("description") && { description: changes.description }),
      ...(has("cover") && { cover: changes.cover }),
      ...(has("categoryId") && { categoryId: changes.categoryId }),
      ...(has("instructorId") && { instructorId: changes.instructorId }),
      ...(has("level") && { level: changes.level }),
      ...(has("status") && { status: changes.status }),
      ...(has("progress") && { progress: changes.progress }),
      ...(changes.pricing ? fromPricing(changes.pricing) : {}),
      ...(has("nextReleaseAt") && {
        nextReleaseAt: fromIsoDate(changes.nextReleaseAt),
      }),
      ...(has("durationMinutes") && {
        durationMinutes: changes.durationMinutes,
      }),
      ...(has("lessonCount") && { lessonCount: changes.lessonCount }),
      ...(has("studentCount") && { studentCount: changes.studentCount }),
      ...(has("rating") && { rating: changes.rating }),
      ...(has("ratingCount") && { ratingCount: changes.ratingCount }),
      ...(has("prerequisites") && { prerequisites: changes.prerequisites }),
      ...(has("outcomes") && { outcomes: changes.outcomes }),
      ...(has("isFeatured") && { isFeatured: changes.isFeatured }),
      ...(has("publishedAt") && {
        publishedAt: fromIsoDate(changes.publishedAt) ?? undefined,
      }),
      /* برچسب‌ها جایگزین می‌شوند نه اضافه: فرم همیشه فهرست کامل را
         می‌فرستد، پس `set: []` قبل از اتصال یعنی حذف‌شده‌ها هم بروند. */
      ...(changes.tags && {
        tags: { set: [], ...connectTags(changes.tags) },
      }),
    },
    include: courseInclude,
  });

  return toCourse(row);
}

export async function removeCourse(id: string): Promise<boolean> {
  const deleted = await prisma.course.deleteMany({ where: { id } });
  return deleted.count > 0;
}

export async function insertArticle(article: Article): Promise<Article> {
  const row = await prisma.article.create({
    data: {
      id: article.id,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      cover: article.cover,
      categoryId: article.categoryId,
      authorId: article.authorId,
      status: article.status,
      readingMinutes: article.readingMinutes,
      viewCount: article.viewCount,
      isFeatured: article.isFeatured,
      publishedAt: fromIsoDate(article.publishedAt) ?? new Date(),
      tags: connectTags(article.tags),
    },
    include: articleInclude,
  });

  return toArticle(row);
}

export async function patchArticle(
  id: string,
  changes: Partial<Article>,
): Promise<Article | null> {
  const exists = await prisma.article.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!exists) return null;

  const has = <K extends keyof Article>(key: K) => key in changes;

  const row = await prisma.article.update({
    where: { id },
    data: {
      ...(has("slug") && { slug: changes.slug }),
      ...(has("title") && { title: changes.title }),
      ...(has("excerpt") && { excerpt: changes.excerpt }),
      ...(has("content") && { content: changes.content }),
      ...(has("cover") && { cover: changes.cover }),
      ...(has("categoryId") && { categoryId: changes.categoryId }),
      ...(has("authorId") && { authorId: changes.authorId }),
      ...(has("status") && { status: changes.status }),
      ...(has("readingMinutes") && { readingMinutes: changes.readingMinutes }),
      ...(has("viewCount") && { viewCount: changes.viewCount }),
      ...(has("isFeatured") && { isFeatured: changes.isFeatured }),
      ...(has("publishedAt") && {
        publishedAt: fromIsoDate(changes.publishedAt) ?? undefined,
      }),
      ...(changes.tags && {
        tags: { set: [], ...connectTags(changes.tags) },
      }),
    },
    include: articleInclude,
  });

  return toArticle(row);
}

export async function removeArticle(id: string): Promise<boolean> {
  const deleted = await prisma.article.deleteMany({ where: { id } });
  return deleted.count > 0;
}

export async function insertCategory(category: Category): Promise<Category> {
  const row = await prisma.category.create({ data: { ...category } });
  return toCategory(row);
}

export async function patchCategory(
  id: string,
  changes: Partial<Category>,
): Promise<Category | null> {
  const exists = await prisma.category.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!exists) return null;

  /* شناسه هرگز از بیرون عوض نمی‌شود. */
  const rest = { ...changes };
  delete rest.id;

  const row = await prisma.category.update({ where: { id }, data: rest });

  return toCategory(row);
}

export async function removeCategory(id: string): Promise<boolean> {
  const deleted = await prisma.category.deleteMany({ where: { id } });
  return deleted.count > 0;
}

export async function insertPerson(person: Person): Promise<Person> {
  const row = await prisma.person.create({
    data: {
      id: person.id,
      slug: person.slug,
      name: person.name,
      role: person.role,
      bio: person.bio,
      avatar: person.avatar,
      ...fromSocials(person.socials),
    },
  });

  return toPerson(row);
}

export async function insertUser(user: User): Promise<User> {
  const row = await prisma.user.create({
    data: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      passwordHash: user.passwordHash,
      avatar: user.avatar ?? null,
      role: user.role,
      status: user.status,
      joinedAt: fromIsoDate(user.joinedAt) ?? new Date(),
      lastActiveAt: fromIsoDate(user.lastActiveAt),
      personId: user.personId ?? null,
      enrollments: {
        create: user.enrollments.map((enrollment) => ({
          courseId: enrollment.courseId,
          status: enrollment.status,
          enrolledAt: fromIsoDate(enrollment.enrolledAt) ?? new Date(),
          completedLessonIds: enrollment.completedLessonIds,
          lastAccessedAt: fromIsoDate(enrollment.lastAccessedAt),
        })),
      },
    },
    include: userInclude,
  });

  return toUser(row);
}

/**
 * به‌روزرسانی کاربر.
 *
 * `enrollments` حالت خاص است: در دامنه یک آرایه است که اکشن‌های
 * یادگیری کاملش را می‌فرستند، ولی در دیتابیس جدول جداگانه است. پس
 * به‌جای جایگزینی کورکورانه، هر ثبت‌نام `upsert` می‌شود و آن‌هایی که
 * دیگر در آرایه نیستند حذف می‌شوند — وگرنه حذف و ساخت دوباره، شناسه
 * ثبت‌نام‌ها را بی‌دلیل عوض می‌کرد.
 */
export async function patchUser(
  id: string,
  changes: Partial<User>,
): Promise<User | null> {
  const exists = await prisma.user.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!exists) return null;

  const has = <K extends keyof User>(key: K) => key in changes;

  await prisma.user.update({
    where: { id },
    data: {
      ...(has("name") && { name: changes.name }),
      ...(has("username") && { username: changes.username }),
      ...(has("email") && { email: changes.email }),
      ...(has("passwordHash") && { passwordHash: changes.passwordHash }),
      ...(has("avatar") && { avatar: changes.avatar ?? null }),
      ...(has("role") && { role: changes.role }),
      ...(has("status") && { status: changes.status }),
      ...(has("personId") && { personId: changes.personId ?? null }),
      ...(has("lastActiveAt") && {
        lastActiveAt: fromIsoDate(changes.lastActiveAt),
      }),
    },
  });

  if (changes.enrollments) {
    const incoming = changes.enrollments;

    await prisma.$transaction([
      prisma.enrollment.deleteMany({
        where: {
          userId: id,
          courseId: { notIn: incoming.map((item) => item.courseId) },
        },
      }),
      ...incoming.map((enrollment) =>
        prisma.enrollment.upsert({
          where: {
            userId_courseId: { userId: id, courseId: enrollment.courseId },
          },
          create: {
            userId: id,
            courseId: enrollment.courseId,
            status: enrollment.status,
            enrolledAt: fromIsoDate(enrollment.enrolledAt) ?? new Date(),
            completedLessonIds: enrollment.completedLessonIds,
            lastAccessedAt: fromIsoDate(enrollment.lastAccessedAt),
          },
          update: {
            status: enrollment.status,
            completedLessonIds: enrollment.completedLessonIds,
            lastAccessedAt: fromIsoDate(enrollment.lastAccessedAt),
          },
        }),
      ),
    ]);
  }

  return findUserById(id);
}

export async function removeUser(id: string): Promise<boolean> {
  const deleted = await prisma.user.deleteMany({ where: { id } });
  return deleted.count > 0;
}

/** شمار دوره‌ها و مقالاتی که به یک دسته‌بندی وصل‌اند — قبل از حذف لازم است. */
export async function countCategoryUsage(categoryId: string): Promise<number> {
  const [courses, articles] = await Promise.all([
    prisma.course.count({ where: { categoryId } }),
    prisma.article.count({ where: { categoryId } }),
  ]);

  return courses + articles;
}

/* انحراف امضا از قرارداد، همان لحظه خطای کامپایل می‌دهد. */
export const prismaContentRepository = {
  findAllCourses,
  findCourseBySlug,
  findCourseById,
  findAllArticles,
  findArticleBySlug,
  findArticleById,
  findAllCategories,
  findCategoryBySlug,
  findCategoryById,
  findAllPeople,
  findPersonById,
  insertPerson,
  findAllUsers,
  findUserById,
  findUserByUsername,
  findUserByEmail,
  insertUser,
  insertCourse,
  patchCourse,
  removeCourse,
  insertArticle,
  patchArticle,
  removeArticle,
  insertCategory,
  patchCategory,
  removeCategory,
  patchUser,
  removeUser,
  countCategoryUsage,
  nextId,
} satisfies ContentRepository;
