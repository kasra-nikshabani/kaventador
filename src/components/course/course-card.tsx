import { BookOpen, Clock, Star, Users } from "lucide-react";
import Link from "next/link";
import { CourseCover } from "@/components/course/course-cover";
import { CoursePrice } from "@/components/course/course-price";
import { CourseProgressBadge } from "@/components/course/course-progress-badge";
import { Badge, Card } from "@/components/ui";
import {
  formatCompactDuration,
  formatCompactNumber,
  formatNumber,
  formatRating,
} from "@/lib/utils";
import { LEVEL_LABELS, type CourseWithRelations } from "@/types";

export interface CourseCardProps {
  course: CourseWithRelations;
  /** سطح عنوان کارت، تا سلسله‌مراتب صفحه میزبان شکسته نشود. */
  headingLevel?: "h2" | "h3";
}

export function CourseCard({ course, headingLevel: Heading = "h3" }: CourseCardProps) {
  return (
    /* `relative` لازم است تا لینکِ پوشاننده کارت (after) درست بنشیند. */
    <Card interactive className="group relative flex flex-col overflow-hidden">
      <CourseCover
        category={course.category}
        titleEn={course.titleEn}
        src={course.cover || undefined}
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge variant="primary">{course.category.title}</Badge>
          <Badge variant="outline">{LEVEL_LABELS[course.level]}</Badge>
          {course.progress !== "completed" && (
            <CourseProgressBadge progress={course.progress} />
          )}
        </div>

        <Heading className="text-base leading-7 font-bold">
          {/* لینک کل کارت را پوشش می‌دهد تا ناحیه کلیک بزرگ باشد،
              ولی متن لینک همچنان معنادار بماند. */}
          <Link
            href={`/courses/${course.slug}`}
            className="focus-visible:outline-ring rounded after:absolute after:inset-0 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {course.title}
          </Link>
        </Heading>

        <p className="text-muted mt-2 line-clamp-2 text-sm">{course.excerpt}</p>

        <div className="text-muted mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden="true" />
            {formatCompactDuration(course.durationMinutes)}
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="size-3.5" aria-hidden="true" />
            {formatNumber(course.lessonCount)} درس
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="size-3.5" aria-hidden="true" />
            {formatCompactNumber(course.studentCount)}
          </span>
        </div>

        <div className="border-border mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-4">
          <CoursePrice pricing={course.pricing} />
          <span className="text-foreground flex items-center gap-1 text-xs font-bold">
            <Star
              className="text-warning size-3.5 fill-current"
              aria-hidden="true"
            />
            {formatRating(course.rating)}
            <span className="text-subtle font-normal">
              ({formatNumber(course.ratingCount)})
            </span>
          </span>
        </div>
      </div>
    </Card>
  );
}
