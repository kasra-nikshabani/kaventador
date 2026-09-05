import "server-only";
import { prisma } from "@/lib/db/prisma";
import type { CurriculumRepository } from "@/lib/repositories/contracts";
import { toChapter, toLesson } from "@/lib/repositories/prisma-mappers";
import { nextId } from "@/lib/repositories/store";
import type { Chapter, Lesson } from "@/types";

/**
 * عملیات سرفصل روی PostgreSQL.
 *
 * همان قاعده ثابتِ پیاده‌سازی حافظه‌ای اینجا هم برقرار است: بعد از هر
 * تغییر، `lessonCount` و `durationMinutes` دوره از روی خود درس‌ها
 * بازمحاسبه می‌شوند و هرگز دستی نوشته نمی‌شوند.
 *
 * نکته‌ای که در نسخه حافظه‌ای مسئله نبود و اینجا هست: ستون `order` با
 * `@@unique([courseId, order])` محدود شده. یعنی جابه‌جایی دو فصل را
 * نمی‌توان با دو UPDATE ساده انجام داد — وسط کار، دو ردیف `order`
 * یکسان می‌گیرند و دیتابیس درست عمل می‌کند و خطا می‌دهد. راه‌حل:
 * مرحله موقت با شماره‌های منفی، داخل یک تراکنش.
 */

type LessonInput = Omit<Lesson, "id" | "slug" | "order">;

const chapterInclude = { lessons: { orderBy: { order: "asc" } } } as const;

/** بازمحاسبه آمار دوره از روی درس‌های واقعی. */
async function recalculateTotals(courseId: string): Promise<void> {
  const lessons = await prisma.lesson.findMany({
    where: { chapter: { courseId } },
    select: { durationMinutes: true },
  });

  await prisma.course.update({
    where: { id: courseId },
    data: {
      lessonCount: lessons.length,
      durationMinutes: lessons.reduce(
        (total, lesson) => total + lesson.durationMinutes,
        0,
      ),
    },
  });
}

/**
 * شماره‌های ترتیب را پشت سر هم می‌کند تا بعد از حذف حفره نماند.
 *
 * دو مرحله‌ای است، به همان دلیل قید یکتایی: اول همه به منفی می‌روند
 * (فضایی که هیچ ردیف معتبری اشغال نکرده)، بعد به شماره نهایی.
 */
async function renumberChapters(courseId: string): Promise<void> {
  const chapters = await prisma.chapter.findMany({
    where: { courseId },
    orderBy: { order: "asc" },
    select: { id: true },
  });

  await prisma.$transaction([
    ...chapters.map((chapter, index) =>
      prisma.chapter.update({
        where: { id: chapter.id },
        data: { order: -(index + 1) },
      }),
    ),
    ...chapters.map((chapter, index) =>
      prisma.chapter.update({
        where: { id: chapter.id },
        data: { order: index + 1 },
      }),
    ),
  ]);
}

async function renumberLessons(chapterId: string): Promise<void> {
  const lessons = await prisma.lesson.findMany({
    where: { chapterId },
    orderBy: { order: "asc" },
    select: { id: true },
  });

  await prisma.$transaction([
    ...lessons.map((lesson, index) =>
      prisma.lesson.update({
        where: { id: lesson.id },
        data: { order: -(index + 1) },
      }),
    ),
    ...lessons.map((lesson, index) =>
      prisma.lesson.update({
        where: { id: lesson.id },
        data: { order: index + 1 },
      }),
    ),
  ]);
}

/* ---------------------------------------------------------------
   فصل
--------------------------------------------------------------- */

export async function insertChapter(
  courseId: string,
  input: { title: string; description?: string },
): Promise<Chapter | null> {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: { id: true },
  });
  if (!course) return null;

  const count = await prisma.chapter.count({ where: { courseId } });

  const row = await prisma.chapter.create({
    data: {
      id: nextId("chapter"),
      courseId,
      title: input.title,
      description: input.description ?? null,
      order: count + 1,
    },
    include: chapterInclude,
  });

  await recalculateTotals(courseId);
  return toChapter(row);
}

export async function patchChapter(
  courseId: string,
  chapterId: string,
  changes: { title?: string; description?: string },
): Promise<Chapter | null> {
  const existing = await prisma.chapter.findFirst({
    where: { id: chapterId, courseId },
    select: { id: true },
  });
  if (!existing) return null;

  const row = await prisma.chapter.update({
    where: { id: chapterId },
    data: {
      ...("title" in changes && { title: changes.title }),
      ...("description" in changes && {
        description: changes.description ?? null,
      }),
    },
    include: chapterInclude,
  });

  await recalculateTotals(courseId);
  return toChapter(row);
}

export async function removeChapter(
  courseId: string,
  chapterId: string,
): Promise<boolean> {
  const deleted = await prisma.chapter.deleteMany({
    where: { id: chapterId, courseId },
  });
  if (deleted.count === 0) return false;

  await renumberChapters(courseId);
  await recalculateTotals(courseId);
  return true;
}

export async function moveChapter(
  courseId: string,
  chapterId: string,
  direction: "up" | "down",
): Promise<boolean> {
  const chapters = await prisma.chapter.findMany({
    where: { courseId },
    orderBy: { order: "asc" },
    select: { id: true, order: true },
  });

  const index = chapters.findIndex((item) => item.id === chapterId);
  const target = direction === "up" ? index - 1 : index + 1;

  /* حرکت از لبه فهرست، بی‌سروصدا نادیده گرفته می‌شود. */
  if (index === -1 || target < 0 || target >= chapters.length) return false;

  const a = chapters[index];
  const b = chapters[target];

  await prisma.$transaction([
    prisma.chapter.update({ where: { id: a.id }, data: { order: -1 } }),
    prisma.chapter.update({ where: { id: b.id }, data: { order: a.order } }),
    prisma.chapter.update({ where: { id: a.id }, data: { order: b.order } }),
  ]);

  await recalculateTotals(courseId);
  return true;
}

/* ---------------------------------------------------------------
   درس
--------------------------------------------------------------- */

export async function insertLesson(
  courseId: string,
  chapterId: string,
  input: LessonInput,
): Promise<Lesson | null> {
  const chapter = await prisma.chapter.findFirst({
    where: { id: chapterId, courseId },
    select: { id: true },
  });
  if (!chapter) return null;

  const count = await prisma.lesson.count({ where: { chapterId } });
  const id = nextId("lesson");

  const row = await prisma.lesson.create({
    data: {
      id,
      slug: id,
      chapterId,
      title: input.title,
      type: input.type,
      durationMinutes: input.durationMinutes,
      isFree: input.isFree,
      order: count + 1,
      videoUrl: input.videoUrl ?? null,
      videoSizeBytes: input.videoSizeBytes ?? null,
    },
  });

  await recalculateTotals(courseId);
  return toLesson(row);
}

export async function patchLesson(
  courseId: string,
  chapterId: string,
  lessonId: string,
  changes: Partial<LessonInput>,
): Promise<Lesson | null> {
  const existing = await prisma.lesson.findFirst({
    where: { id: lessonId, chapterId, chapter: { courseId } },
    select: { id: true },
  });
  if (!existing) return null;

  const row = await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      ...("title" in changes && { title: changes.title }),
      ...("type" in changes && { type: changes.type }),
      ...("durationMinutes" in changes && {
        durationMinutes: changes.durationMinutes,
      }),
      ...("isFree" in changes && { isFree: changes.isFree }),
      ...("videoUrl" in changes && { videoUrl: changes.videoUrl ?? null }),
      ...("videoSizeBytes" in changes && {
        videoSizeBytes: changes.videoSizeBytes ?? null,
      }),
    },
  });

  await recalculateTotals(courseId);
  return toLesson(row);
}

export async function removeLesson(
  courseId: string,
  chapterId: string,
  lessonId: string,
): Promise<boolean> {
  const deleted = await prisma.lesson.deleteMany({
    where: { id: lessonId, chapterId, chapter: { courseId } },
  });
  if (deleted.count === 0) return false;

  await renumberLessons(chapterId);
  await recalculateTotals(courseId);
  return true;
}

export async function moveLesson(
  courseId: string,
  chapterId: string,
  lessonId: string,
  direction: "up" | "down",
): Promise<boolean> {
  const chapter = await prisma.chapter.findFirst({
    where: { id: chapterId, courseId },
    select: { id: true },
  });
  if (!chapter) return false;

  const lessons = await prisma.lesson.findMany({
    where: { chapterId },
    orderBy: { order: "asc" },
    select: { id: true, order: true },
  });

  const index = lessons.findIndex((item) => item.id === lessonId);
  const target = direction === "up" ? index - 1 : index + 1;

  if (index === -1 || target < 0 || target >= lessons.length) return false;

  const a = lessons[index];
  const b = lessons[target];

  await prisma.$transaction([
    prisma.lesson.update({ where: { id: a.id }, data: { order: -1 } }),
    prisma.lesson.update({ where: { id: b.id }, data: { order: a.order } }),
    prisma.lesson.update({ where: { id: a.id }, data: { order: b.order } }),
  ]);

  await recalculateTotals(courseId);
  return true;
}

/** درسی که یک فایل ویدیو به آن وصل است — برای حذف فایل هنگام جایگزینی. */
export async function findLessonVideo(
  courseId: string,
  chapterId: string,
  lessonId: string,
): Promise<string | undefined> {
  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, chapterId, chapter: { courseId } },
    select: { videoUrl: true },
  });

  return lesson?.videoUrl ?? undefined;
}

export const prismaCurriculumRepository = {
  insertChapter,
  patchChapter,
  removeChapter,
  moveChapter,
  insertLesson,
  patchLesson,
  removeLesson,
  moveLesson,
  findLessonVideo,
} satisfies CurriculumRepository;
