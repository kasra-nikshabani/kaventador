import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/lib/seo/og-template";
import { getCourseBySlug } from "@/lib/services";
import { formatCompactDuration, formatNumber } from "@/lib/utils";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "تصویر دوره کاوِنتادور";

export default async function CourseOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  /* اگر دوره نبود، کارت عمومی ساخته می‌شود تا هرگز تصویر شکسته نماند. */
  if (!course) {
    return renderOgCard({ title: "دوره پیدا نشد" });
  }

  return renderOgCard({
    eyebrow: course.category.title,
    title: course.title,
    meta: `${formatNumber(course.lessonCount)} درس · ${formatCompactDuration(course.durationMinutes)} · ${course.instructor.name}`,
  });
}
