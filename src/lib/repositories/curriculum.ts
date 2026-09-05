import "server-only";
import { serverEnv } from "@/lib/config/server-env";
import type { CurriculumRepository } from "@/lib/repositories/contracts";
import { mockCurriculumRepository } from "@/lib/repositories/mock-curriculum";
import { prismaCurriculumRepository } from "@/lib/repositories/prisma-curriculum";

/**
 * عملیات سرفصل — انتخاب پیاده‌سازی، دقیقاً مثل `index.ts`.
 *
 * سرفصل عمداً قرارداد جداگانه‌ای دارد: واحد کاری متفاوتی است و
 * قاعده‌های ثابت خودش را دارد (بازمحاسبه آمار، پیوسته‌بودن شماره ترتیب).
 */
const repository: CurriculumRepository =
  serverEnv.DATA_SOURCE === "prisma"
    ? prismaCurriculumRepository
    : mockCurriculumRepository;

export const insertChapter = repository.insertChapter;
export const patchChapter = repository.patchChapter;
export const removeChapter = repository.removeChapter;
export const moveChapter = repository.moveChapter;

export const insertLesson = repository.insertLesson;
export const patchLesson = repository.patchLesson;
export const removeLesson = repository.removeLesson;
export const moveLesson = repository.moveLesson;

export const findLessonVideo = repository.findLessonVideo;
