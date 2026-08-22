import {
  ChevronDown,
  FileText,
  FolderGit2,
  HelpCircle,
  Lock,
  PlayCircle,
} from "lucide-react";
import { LessonPlayer } from "@/components/course/lesson-player";
import { Badge } from "@/components/ui";
import { formatCompactDuration, formatNumber } from "@/lib/utils";
import { LESSON_TYPE_LABELS, type Chapter, type LessonType } from "@/types";

/** آیکون هر نوع درس — با switch تا کامپوننت در زمان رندر ساخته نشود. */
function LessonIcon({ type }: { type: LessonType }) {
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
 * سرفصل دوره.
 *
 * روی `<details>` بومی ساخته شده: باز و بسته شدن، دسترسی با کیبورد و
 * پیدا شدن متن بسته با Ctrl+F را مرورگر رایگان می‌دهد — بدون هیچ
 * جاوااسکریپتی و بدون تبدیل صفحه به کامپوننت کلاینتی.
 */
export function Curriculum({ chapters }: { chapters: Chapter[] }) {
  return (
    <div className="space-y-3">
      {chapters.map((chapter, index) => {
        const totalMinutes = chapter.lessons.reduce(
          (sum, lesson) => sum + lesson.durationMinutes,
          0,
        );

        return (
          <details
            key={chapter.id}
            open={index === 0}
            className="border-border bg-surface group rounded-2xl border"
          >
            <summary className="focus-visible:outline-ring flex cursor-pointer list-none items-center gap-3 rounded-2xl p-4 focus-visible:outline-2 focus-visible:outline-offset-2 [&::-webkit-details-marker]:hidden">
              <ChevronDown
                className="text-muted size-5 shrink-0 transition-transform duration-200 group-open:rotate-180"
                aria-hidden="true"
              />
              <span className="flex-1">
                <span className="block font-bold">
                  فصل {formatNumber(chapter.order)}: {chapter.title}
                </span>
                <span className="text-muted mt-0.5 block text-xs">
                  {formatNumber(chapter.lessons.length)} درس ·{" "}
                  {formatCompactDuration(totalMinutes)}
                </span>
              </span>
            </summary>

            <ul className="border-border border-t">
              {chapter.lessons.map((lesson) => (
                <li
                  key={lesson.id}
                  className="border-border text-muted flex items-center gap-3 border-b px-4 py-3 text-sm last:border-b-0"
                >
                  <LessonIcon type={lesson.type} />
                  <span className="text-foreground flex-1">{lesson.title}</span>

                  {lesson.isFree ? (
                    <>
                      {/* فقط درس رایگانِ ویدیودار قابل پخش است. */}
                      {lesson.videoUrl && (
                        <LessonPlayer
                          title={lesson.title}
                          videoUrl={lesson.videoUrl}
                        />
                      )}
                      <Badge variant="success">پیش‌نمایش رایگان</Badge>
                    </>
                  ) : (
                    <Lock className="text-subtle size-3.5" aria-hidden="true" />
                  )}

                  <span className="sr-only">
                    نوع درس: {LESSON_TYPE_LABELS[lesson.type]}
                  </span>
                  <span className="text-subtle w-14 text-end text-xs" dir="ltr">
                    {formatNumber(lesson.durationMinutes)} دقیقه
                  </span>
                </li>
              ))}
            </ul>
          </details>
        );
      })}
    </div>
  );
}
