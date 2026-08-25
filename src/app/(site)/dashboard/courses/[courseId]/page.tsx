import { Check, Lock, PlayCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { LessonPlayer } from "@/components/course";
import { Breadcrumb } from "@/components/shared";
import { Badge, buttonStyles, Card, ProgressBar } from "@/components/ui";
import { toggleLessonAction } from "@/lib/actions/learning";
import { getSession } from "@/lib/auth/session";
import { findCourseById } from "@/lib/repositories";
import { calculateProgress, getEnrollment } from "@/lib/services";
import { formatCompactDuration, formatNumber } from "@/lib/utils";
import { LESSON_TYPE_LABELS } from "@/types";

export const metadata: Metadata = {
  title: "یادگیری دوره",
  robots: { index: false, follow: false },
};

export default async function LearnCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login?next=%2Fdashboard");

  const { courseId } = await params;
  const [course, enrollment] = await Promise.all([
    findCourseById(courseId),
    getEnrollment(session.userId, courseId),
  ]);

  if (!course) notFound();

  /* ثبت‌نام‌نکرده یا در انتظار پرداخت، به صفحه عمومی دوره برمی‌گردد.
     این تنها دروازه دسترسی به محتواست، پس اینجا سخت‌گیر است. */
  if (!enrollment || enrollment.status !== "active") {
    redirect(`/courses/${course.slug}`);
  }

  const allLessonIds = new Set(
    course.chapters.flatMap((chapter) => chapter.lessons.map((l) => l.id)),
  );
  const progress = calculateProgress(
    enrollment.completedLessonIds,
    allLessonIds,
  );
  const done = new Set(enrollment.completedLessonIds);

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "پنل من", href: "/dashboard" },
          { label: course.title },
        ]}
      />

      <div>
        <h2 className="text-2xl font-black">{course.title}</h2>
        <Link
          href={`/courses/${course.slug}`}
          className="text-primary mt-1.5 inline-block text-sm hover:underline"
        >
          مشاهده صفحه عمومی دوره
        </Link>
      </div>

      <Card className="space-y-2 p-5">
        <ProgressBar
          percent={progress.percent}
          label={`پیشرفت شما در دوره ${course.title}`}
        />
        <p className="text-muted text-sm">
          {formatNumber(progress.completed)} از {formatNumber(progress.total)}{" "}
          درس تمام شده
        </p>
      </Card>

      {course.chapters.length === 0 ? (
        <p className="text-muted">
          سرفصل این دوره هنوز منتشر نشده است.
        </p>
      ) : (
        <ol className="space-y-4">
          {course.chapters.map((chapter) => (
            <li key={chapter.id}>
              <Card>
                <div className="border-border border-b p-4">
                  <h3 className="font-bold">
                    فصل {formatNumber(chapter.order)}: {chapter.title}
                  </h3>
                  <p className="text-muted mt-0.5 text-xs">
                    {formatNumber(chapter.lessons.length)} درس ·{" "}
                    {formatCompactDuration(
                      chapter.lessons.reduce(
                        (sum, l) => sum + l.durationMinutes,
                        0,
                      ),
                    )}
                  </p>
                </div>

                <ul className="divide-border divide-y">
                  {chapter.lessons.map((lesson) => {
                    const completed = done.has(lesson.id);

                    return (
                      <li
                        key={lesson.id}
                        className="flex flex-wrap items-center gap-3 px-4 py-3"
                      >
                        {/* علامت‌زدن یک تغییر وضعیت است، پس فرم و POST —
                            نه لینک، که مرورگر ممکن است پیش‌واکشی‌اش کند. */}
                        <form action={toggleLessonAction}>
                          <input type="hidden" name="courseId" value={course.id} />
                          <input type="hidden" name="lessonId" value={lesson.id} />
                          <button
                            type="submit"
                            aria-label={
                              completed
                                ? `برداشتن علامت تمام‌شده از ${lesson.title}`
                                : `علامت‌زدن ${lesson.title} به‌عنوان تمام‌شده`
                            }
                            aria-pressed={completed}
                            className={
                              completed
                                ? "border-success bg-success text-primary-foreground focus-visible:outline-ring inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                                : "border-border-strong text-transparent hover:border-primary focus-visible:outline-ring inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                            }
                          >
                            <Check className="size-4" aria-hidden="true" />
                          </button>
                        </form>

                        <span className="min-w-0 flex-1">
                          <span
                            className={
                              completed
                                ? "text-muted block text-sm line-through"
                                : "block text-sm"
                            }
                          >
                            {lesson.title}
                          </span>
                          <span className="text-subtle block text-xs">
                            {LESSON_TYPE_LABELS[lesson.type]} ·{" "}
                            {formatNumber(lesson.durationMinutes)} دقیقه
                          </span>
                        </span>

                        {lesson.videoUrl ? (
                          <LessonPlayer
                            title={lesson.title}
                            videoUrl={lesson.videoUrl}
                          />
                        ) : lesson.type === "video" ? (
                          <Badge variant="neutral">
                            <Lock aria-hidden="true" />
                            به‌زودی
                          </Badge>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </Card>
            </li>
          ))}
        </ol>
      )}

      <Link href="/dashboard" className={buttonStyles({ variant: "outline" })}>
        <PlayCircle aria-hidden="true" />
        بازگشت به پنل
      </Link>
    </div>
  );
}
