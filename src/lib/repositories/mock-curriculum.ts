import type { CurriculumRepository } from "@/lib/repositories/contracts";
import { nextId, store } from "@/lib/repositories/store";
import type { Chapter, Course, Lesson } from "@/types";

/**
 * عملیات سرفصل دوره (فصل و درس) — پیاده‌سازی درون‌حافظه‌ای.
 *
 * قاعده ثابت: بعد از هر تغییر، `lessonCount` و `durationMinutes` دوره
 * از روی خود درس‌ها بازمحاسبه می‌شوند. همان قاعده‌ای که در داده mock
 * برقرار بود — این دو عدد هرگز دستی نوشته نمی‌شوند.
 */
function recalculateTotals(course: Course): void {
  const lessons = course.chapters.flatMap((chapter) => chapter.lessons);

  course.lessonCount = lessons.length;
  course.durationMinutes = lessons.reduce(
    (total, lesson) => total + lesson.durationMinutes,
    0,
  );
  course.updatedAt = new Date().toISOString().slice(0, 10);
}

/** شماره ترتیب را پشت سر هم می‌کند تا بعد از حذف یا جابه‌جایی حفره نماند. */
function renumber(items: { order: number }[]): void {
  items.forEach((item, index) => {
    item.order = index + 1;
  });
}

function findCourse(courseId: string): Course | undefined {
  return store.courses.find((item) => item.id === courseId);
}

/* ---------------------------------------------------------------
   فصل
--------------------------------------------------------------- */

export async function insertChapter(
  courseId: string,
  input: { title: string; description?: string },
): Promise<Chapter | null> {
  const course = findCourse(courseId);
  if (!course) return null;

  const chapter: Chapter = {
    id: nextId("chapter"),
    title: input.title,
    description: input.description,
    order: course.chapters.length + 1,
    lessons: [],
  };

  course.chapters.push(chapter);
  recalculateTotals(course);

  return structuredClone(chapter);
}

export async function patchChapter(
  courseId: string,
  chapterId: string,
  changes: { title?: string; description?: string },
): Promise<Chapter | null> {
  const course = findCourse(courseId);
  const chapter = course?.chapters.find((item) => item.id === chapterId);
  if (!course || !chapter) return null;

  Object.assign(chapter, changes);
  recalculateTotals(course);

  return structuredClone(chapter);
}

export async function removeChapter(
  courseId: string,
  chapterId: string,
): Promise<boolean> {
  const course = findCourse(courseId);
  if (!course) return false;

  const index = course.chapters.findIndex((item) => item.id === chapterId);
  if (index === -1) return false;

  course.chapters.splice(index, 1);
  renumber(course.chapters);
  recalculateTotals(course);

  return true;
}

export async function moveChapter(
  courseId: string,
  chapterId: string,
  direction: "up" | "down",
): Promise<boolean> {
  const course = findCourse(courseId);
  if (!course) return false;

  const index = course.chapters.findIndex((item) => item.id === chapterId);
  const target = direction === "up" ? index - 1 : index + 1;

  /* حرکت از لبه فهرست، بی‌سروصدا نادیده گرفته می‌شود. */
  if (index === -1 || target < 0 || target >= course.chapters.length) {
    return false;
  }

  [course.chapters[index], course.chapters[target]] = [
    course.chapters[target],
    course.chapters[index],
  ];
  renumber(course.chapters);
  recalculateTotals(course);

  return true;
}

/* ---------------------------------------------------------------
   درس
--------------------------------------------------------------- */

type LessonInput = Omit<Lesson, "id" | "slug" | "order">;

export async function insertLesson(
  courseId: string,
  chapterId: string,
  input: LessonInput,
): Promise<Lesson | null> {
  const course = findCourse(courseId);
  const chapter = course?.chapters.find((item) => item.id === chapterId);
  if (!course || !chapter) return null;

  const id = nextId("lesson");
  const lesson: Lesson = {
    ...input,
    id,
    slug: id,
    order: chapter.lessons.length + 1,
  };

  chapter.lessons.push(lesson);
  recalculateTotals(course);

  return structuredClone(lesson);
}

export async function patchLesson(
  courseId: string,
  chapterId: string,
  lessonId: string,
  changes: Partial<LessonInput>,
): Promise<Lesson | null> {
  const course = findCourse(courseId);
  const chapter = course?.chapters.find((item) => item.id === chapterId);
  const lesson = chapter?.lessons.find((item) => item.id === lessonId);
  if (!course || !lesson) return null;

  Object.assign(lesson, changes);
  recalculateTotals(course);

  return structuredClone(lesson);
}

export async function removeLesson(
  courseId: string,
  chapterId: string,
  lessonId: string,
): Promise<boolean> {
  const course = findCourse(courseId);
  const chapter = course?.chapters.find((item) => item.id === chapterId);
  if (!course || !chapter) return false;

  const index = chapter.lessons.findIndex((item) => item.id === lessonId);
  if (index === -1) return false;

  chapter.lessons.splice(index, 1);
  renumber(chapter.lessons);
  recalculateTotals(course);

  return true;
}

export async function moveLesson(
  courseId: string,
  chapterId: string,
  lessonId: string,
  direction: "up" | "down",
): Promise<boolean> {
  const course = findCourse(courseId);
  const chapter = course?.chapters.find((item) => item.id === chapterId);
  if (!course || !chapter) return false;

  const index = chapter.lessons.findIndex((item) => item.id === lessonId);
  const target = direction === "up" ? index - 1 : index + 1;

  if (index === -1 || target < 0 || target >= chapter.lessons.length) {
    return false;
  }

  [chapter.lessons[index], chapter.lessons[target]] = [
    chapter.lessons[target],
    chapter.lessons[index],
  ];
  renumber(chapter.lessons);
  recalculateTotals(course);

  return true;
}

/** درسی که یک فایل ویدیو به آن وصل است — برای حذف فایل هنگام جایگزینی. */
export async function findLessonVideo(
  courseId: string,
  chapterId: string,
  lessonId: string,
): Promise<string | undefined> {
  const course = findCourse(courseId);
  const chapter = course?.chapters.find((item) => item.id === chapterId);
  return chapter?.lessons.find((item) => item.id === lessonId)?.videoUrl;
}

/** گره‌زدن به قرارداد سرفصل — انحراف امضا خطای کامپایل می‌دهد. */
export const mockCurriculumRepository = {
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
