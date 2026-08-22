import {
  ChevronDown,
  ChevronUp,
  FileText,
  FolderGit2,
  HelpCircle,
  PlayCircle,
  Video,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ChapterForm } from "@/components/admin/chapter-form";
import { CurriculumDelete } from "@/components/admin/curriculum-delete";
import { LessonForm } from "@/components/admin/lesson-form";
import { Badge, buttonStyles, Card, EmptyState } from "@/components/ui";
import {
  deleteChapterAction,
  deleteLessonAction,
  moveChapterAction,
  moveLessonAction,
} from "@/lib/actions/curriculum";
import { findCourseById } from "@/lib/repositories";
import { formatCompactDuration, formatDuration, formatNumber } from "@/lib/utils";
import { LESSON_TYPE_LABELS, type LessonType } from "@/types";

export const metadata: Metadata = { title: "ویرایش سرفصل" };

/** آیکون نوع درس — با switch تا کامپوننت در زمان رندر ساخته نشود. */
function LessonTypeIcon({ type }: { type: LessonType }) {
  const className = "size-4 shrink-0";

  switch (type) {
    case "video":
      return <PlayCircle className={className} aria-hidden="true" />;
    case "article":
      return <FileText className={className} aria-hidden="true" />;
    case "quiz":
      return <HelpCircle className={className} aria-hidden="true" />;
    case "project":
      return <FolderGit2 className={className} aria-hidden="true" />;
  }
}

/**
 * دکمه جابه‌جایی.
 *
 * فرم واقعی است نه لینک، چون ترتیب را تغییر می‌دهد. جابه‌جایی با دکمه
 * انجام می‌شود نه کشیدن‌ورها‌کردن: با کیبورد و صفحه‌خوان کار می‌کند و
 * روی لمس هم قابل اتکاست.
 */
function MoveButton({
  action,
  direction,
  disabled,
  label,
  fields,
}: {
  action: (formData: FormData) => Promise<void>;
  direction: "up" | "down";
  disabled: boolean;
  label: string;
  fields: Record<string, string>;
}) {
  const Icon = direction === "up" ? ChevronUp : ChevronDown;

  return (
    <form action={action}>
      {Object.entries(fields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      <input type="hidden" name="direction" value={direction} />
      <button
        type="submit"
        disabled={disabled}
        aria-label={label}
        title={label}
        className="text-muted hover:bg-surface-2 hover:text-foreground focus-visible:outline-ring inline-flex size-8 cursor-pointer items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-30"
      >
        <Icon className="size-4" aria-hidden="true" />
      </button>
    </form>
  );
}

export default async function CurriculumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await findCourseById(id);

  if (!course) notFound();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <AdminPageHeader
        title="ویرایش سرفصل"
        description={course.title}
        action={<ChapterForm courseId={course.id} triggerLabel="فصل جدید" />}
      />

      {/* خلاصه محاسبه‌شده — هرگز دستی نوشته نمی‌شود */}
      <Card className="flex flex-wrap items-center gap-x-6 gap-y-2 p-4 text-sm">
        <span className="text-muted">
          {formatNumber(course.chapters.length)} فصل
        </span>
        <span className="text-muted">
          {formatNumber(course.lessonCount)} درس
        </span>
        <span className="text-muted">
          {formatDuration(course.durationMinutes)}
        </span>
        <Link
          href={`/admin/courses/${course.id}/edit`}
          className={buttonStyles({ variant: "ghost", size: "sm", className: "ms-auto" })}
        >
          ویرایش اطلاعات دوره
        </Link>
        <Link
          href={`/courses/${course.slug}`}
          target="_blank"
          className={buttonStyles({ variant: "outline", size: "sm" })}
        >
          مشاهده در سایت
        </Link>
      </Card>

      {course.chapters.length === 0 ? (
        <EmptyState
          as="h2"
          icon={Video}
          title="این دوره هنوز فصلی ندارد"
          description="برای شروع، اولین فصل را بسازید و بعد درس‌ها را داخلش اضافه کنید."
          action={<ChapterForm courseId={course.id} triggerLabel="ساخت اولین فصل" />}
        />
      ) : (
        <ol className="space-y-4">
          {course.chapters.map((chapter, chapterIndex) => {
            const chapterMinutes = chapter.lessons.reduce(
              (sum, lesson) => sum + lesson.durationMinutes,
              0,
            );

            return (
              <li key={chapter.id}>
                <Card>
                  {/* سربرگ فصل */}
                  <div className="border-border flex flex-wrap items-center gap-3 border-b p-4">
                    <div className="flex flex-col">
                      <MoveButton
                        action={moveChapterAction}
                        direction="up"
                        disabled={chapterIndex === 0}
                        label={`انتقال فصل ${chapter.title} به بالا`}
                        fields={{ courseId: course.id, chapterId: chapter.id }}
                      />
                      <MoveButton
                        action={moveChapterAction}
                        direction="down"
                        disabled={chapterIndex === course.chapters.length - 1}
                        label={`انتقال فصل ${chapter.title} به پایین`}
                        fields={{ courseId: course.id, chapterId: chapter.id }}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="font-bold">
                        فصل {formatNumber(chapter.order)}: {chapter.title}
                      </h2>
                      <p className="text-muted mt-0.5 text-xs">
                        {formatNumber(chapter.lessons.length)} درس ·{" "}
                        {formatCompactDuration(chapterMinutes)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <ChapterForm
                        courseId={course.id}
                        chapter={chapter}
                        triggerLabel="ویرایش"
                        triggerVariant="ghost"
                      />
                      <CurriculumDelete
                        action={deleteChapterAction}
                        courseId={course.id}
                        chapterId={chapter.id}
                        name={chapter.title}
                        entityLabel="فصل"
                        warning={
                          chapter.lessons.length > 0
                            ? `${formatNumber(chapter.lessons.length)} درس داخل این فصل و ویدیوهایشان هم حذف می‌شوند.`
                            : undefined
                        }
                      />
                    </div>
                  </div>

                  {/* درس‌ها */}
                  {chapter.lessons.length > 0 && (
                    <ol className="divide-border divide-y">
                      {chapter.lessons.map((lesson, lessonIndex) => (
                        <li
                          key={lesson.id}
                          className="flex flex-wrap items-center gap-3 px-4 py-3"
                        >
                          <div className="flex flex-col">
                            <MoveButton
                              action={moveLessonAction}
                              direction="up"
                              disabled={lessonIndex === 0}
                              label={`انتقال درس ${lesson.title} به بالا`}
                              fields={{
                                courseId: course.id,
                                chapterId: chapter.id,
                                lessonId: lesson.id,
                              }}
                            />
                            <MoveButton
                              action={moveLessonAction}
                              direction="down"
                              disabled={lessonIndex === chapter.lessons.length - 1}
                              label={`انتقال درس ${lesson.title} به پایین`}
                              fields={{
                                courseId: course.id,
                                chapterId: chapter.id,
                                lessonId: lesson.id,
                              }}
                            />
                          </div>

                          <LessonTypeIcon type={lesson.type} />

                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">
                              {lesson.title}
                            </span>
                            <span className="text-subtle block text-xs">
                              {LESSON_TYPE_LABELS[lesson.type]} ·{" "}
                              {formatNumber(lesson.durationMinutes)} دقیقه
                            </span>
                          </span>

                          {lesson.videoUrl ? (
                            <Badge variant="success">
                              <Video aria-hidden="true" />
                              ویدیو دارد
                            </Badge>
                          ) : (
                            lesson.type === "video" && (
                              <Badge variant="warning">بدون ویدیو</Badge>
                            )
                          )}

                          {lesson.isFree && (
                            <Badge variant="outline">رایگان</Badge>
                          )}

                          <span className="flex items-center gap-1">
                            <LessonForm
                              courseId={course.id}
                              chapterId={chapter.id}
                              lesson={lesson}
                              triggerLabel="ویرایش"
                              triggerVariant="ghost"
                            />
                            <CurriculumDelete
                              action={deleteLessonAction}
                              courseId={course.id}
                              chapterId={chapter.id}
                              lessonId={lesson.id}
                              name={lesson.title}
                              entityLabel="درس"
                              warning={
                                lesson.videoUrl
                                  ? "فایل ویدیوی این درس هم از سرور پاک می‌شود."
                                  : undefined
                              }
                            />
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}

                  <div className="border-border border-t p-3">
                    <LessonForm
                      courseId={course.id}
                      chapterId={chapter.id}
                      triggerLabel="افزودن درس به این فصل"
                    />
                  </div>
                </Card>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
