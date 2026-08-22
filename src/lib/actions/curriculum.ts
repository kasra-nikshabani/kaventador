"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  chapterFormSchema,
  lessonFormSchema,
  type CurriculumState,
} from "@/lib/actions/curriculum.schema";
import { collectErrors } from "@/lib/actions/content.schema";
import { getSession } from "@/lib/auth/session";
import { deleteStoredFile } from "@/lib/media/storage";
import {
  findLessonVideo,
  insertChapter,
  insertLesson,
  moveChapter,
  moveLesson,
  patchChapter,
  patchLesson,
  removeChapter,
  removeLesson,
} from "@/lib/repositories/curriculum";

/** هر اکشن نشست را خودش بررسی می‌کند؛ proxy اکشن‌ها را نمی‌بیند. */
async function requireSession(): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
}

function revalidateCourse(courseId: string) {
  revalidatePath(`/admin/courses/${courseId}/curriculum`);
  revalidatePath("/", "layout");
}

/* ---------------------------------------------------------------
   فصل
--------------------------------------------------------------- */

export async function saveChapterAction(
  _previous: CurriculumState,
  formData: FormData,
): Promise<CurriculumState> {
  await requireSession();

  const courseId = String(formData.get("courseId") ?? "");
  const chapterId = String(formData.get("chapterId") ?? "");

  const parsed = chapterFormSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "عنوان فصل را درست وارد کنید.",
      errors: collectErrors(parsed.error.issues),
      scopeId: chapterId || "new-chapter",
    };
  }

  const data = {
    title: parsed.data.title,
    description: parsed.data.description || undefined,
  };

  const result = chapterId
    ? await patchChapter(courseId, chapterId, data)
    : await insertChapter(courseId, data);

  if (!result) return { status: "error", message: "دوره یا فصل پیدا نشد." };

  revalidateCourse(courseId);
  return { status: "success" };
}

export async function deleteChapterAction(
  _previous: CurriculumState,
  formData: FormData,
): Promise<CurriculumState> {
  await requireSession();

  const courseId = String(formData.get("courseId") ?? "");
  const chapterId = String(formData.get("chapterId") ?? "");

  const removed = await removeChapter(courseId, chapterId);
  if (!removed) return { status: "error", message: "فصل پیدا نشد." };

  revalidateCourse(courseId);
  return { status: "success" };
}

export async function moveChapterAction(formData: FormData): Promise<void> {
  await requireSession();

  const courseId = String(formData.get("courseId") ?? "");
  await moveChapter(
    courseId,
    String(formData.get("chapterId") ?? ""),
    formData.get("direction") === "up" ? "up" : "down",
  );

  revalidateCourse(courseId);
}

/* ---------------------------------------------------------------
   درس
--------------------------------------------------------------- */

export async function saveLessonAction(
  _previous: CurriculumState,
  formData: FormData,
): Promise<CurriculumState> {
  await requireSession();

  const courseId = String(formData.get("courseId") ?? "");
  const chapterId = String(formData.get("chapterId") ?? "");
  const lessonId = String(formData.get("lessonId") ?? "");

  const parsed = lessonFormSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    type: String(formData.get("type") ?? ""),
    durationMinutes: String(formData.get("durationMinutes") ?? ""),
    isFree: formData.get("isFree") === "on",
    videoUrl: String(formData.get("videoUrl") ?? ""),
    videoSizeBytes: String(formData.get("videoSizeBytes") ?? "0"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "لطفاً خطاهای فرم درس را برطرف کنید.",
      errors: collectErrors(parsed.error.issues),
      scopeId: lessonId || `new-lesson-${chapterId}`,
    };
  }

  const { videoUrl, videoSizeBytes, isFree, ...rest } = parsed.data;

  const data = {
    ...rest,
    isFree: Boolean(isFree),
    videoUrl: videoUrl || undefined,
    videoSizeBytes: videoUrl ? videoSizeBytes : undefined,
  };

  if (lessonId) {
    /* اگر ویدیو عوض شده، فایل قبلی روی دیسک باقی نماند. */
    const previousVideo = await findLessonVideo(courseId, chapterId, lessonId);
    if (previousVideo && previousVideo !== data.videoUrl) {
      await deleteStoredFile(previousVideo);
    }

    const updated = await patchLesson(courseId, chapterId, lessonId, data);
    if (!updated) return { status: "error", message: "درس پیدا نشد." };
  } else {
    const created = await insertLesson(courseId, chapterId, data);
    if (!created) return { status: "error", message: "فصل پیدا نشد." };
  }

  revalidateCourse(courseId);
  return { status: "success" };
}

export async function deleteLessonAction(
  _previous: CurriculumState,
  formData: FormData,
): Promise<CurriculumState> {
  await requireSession();

  const courseId = String(formData.get("courseId") ?? "");
  const chapterId = String(formData.get("chapterId") ?? "");
  const lessonId = String(formData.get("lessonId") ?? "");

  /* فایل ویدیو هم پاک می‌شود تا دیسک پر از فایل بی‌صاحب نشود. */
  const video = await findLessonVideo(courseId, chapterId, lessonId);

  const removed = await removeLesson(courseId, chapterId, lessonId);
  if (!removed) return { status: "error", message: "درس پیدا نشد." };

  await deleteStoredFile(video);

  revalidateCourse(courseId);
  return { status: "success" };
}

export async function moveLessonAction(formData: FormData): Promise<void> {
  await requireSession();

  const courseId = String(formData.get("courseId") ?? "");
  await moveLesson(
    courseId,
    String(formData.get("chapterId") ?? ""),
    String(formData.get("lessonId") ?? ""),
    formData.get("direction") === "up" ? "up" : "down",
  );

  revalidateCourse(courseId);
}
