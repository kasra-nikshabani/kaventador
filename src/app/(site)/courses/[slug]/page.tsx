import {
  BookOpen,
  CalendarClock,
  CircleCheck,
  Clock,
  FolderGit2,
  PlayCircle,
  ShoppingCart,
  Signal,
  Star,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CourseCard,
  CourseCover,
  CoursePrice,
  CourseProgressBadge,
  Curriculum,
} from "@/components/course";
import {
  Breadcrumb,
  JsonLd,
  PersonCard,
  SectionHeading,
} from "@/components/shared";
import Link from "next/link";
import { Badge, buttonStyles, Card, Container } from "@/components/ui";
import { breadcrumbJsonLd, courseJsonLd } from "@/lib/seo/json-ld";
import {
  getAllCourseSlugs,
  getCourseBySlug,
  getRelatedCourses,
} from "@/lib/services";
import {
  formatDate,
  formatDuration,
  formatNumber,
  formatRating,
} from "@/lib/utils";
import { LEVEL_LABELS } from "@/types";

type PageProps = { params: Promise<{ slug: string }> };

/** همه دوره‌ها در زمان build به HTML استاتیک تبدیل می‌شوند. */
export async function generateStaticParams() {
  const slugs = await getAllCourseSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * محتوا از پنل مدیریت ساخته می‌شود، پس اسلاگ‌های تازه باید بدون build
 * جدید در دسترس باشند.
 *
 * پیامدش این است که اسلاگ ناموجود وضعیت ۲۰۰ می‌گیرد نه ۴۰۴ — این رفتار
 * مستندشده Next است: چون پاسخ استریم می‌شود، هدر قبل از رسیدن به
 * `notFound()` ارسال شده و دیگر قابل تغییر نیست. در عوض خود Next تگ
 * `<meta name="robots" content="noindex">` را تزریق می‌کند، پس صفحه
 * ایندکس نمی‌شود. اگر روزی وضعیت ۴۰۴ واقعی لازم شد، بررسی وجود اسلاگ
 * باید در `proxy.ts` و قبل از شروع استریم انجام شود.
 */
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  /* متادیتا قبل از notFound() اجرا می‌شود، پس این حالت هم باید صریحاً
     غیرقابل‌ایندکس باشد. */
  if (!course) return { title: "دوره پیدا نشد", robots: { index: false } };

  return {
    title: course.title,
    description: course.excerpt,
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: {
      type: "article",
      title: course.title,
      description: course.excerpt,
      publishedTime: course.publishedAt,
      modifiedTime: course.updatedAt,
      authors: [course.instructor.name],
    },
  };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) notFound();

  const related = await getRelatedCourses(slug, 3);

  const stats = [
    { icon: Clock, label: "مدت دوره", value: formatDuration(course.durationMinutes) },
    { icon: BookOpen, label: "تعداد درس", value: `${formatNumber(course.lessonCount)} درس` },
    { icon: Signal, label: "سطح", value: LEVEL_LABELS[course.level] },
    { icon: Users, label: "دانشجو", value: formatNumber(course.studentCount) },
  ];

  return (
    <>
      <JsonLd data={courseJsonLd(course)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "دوره‌ها", href: "/courses" },
          { label: course.title, href: `/courses/${course.slug}` },
        ])}
      />

      {/* سربرگ دوره */}
      <section className="border-border bg-surface relative overflow-hidden border-b">
        <div
          aria-hidden="true"
          className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]"
        />

        <Container className="relative py-10 sm:py-14">
          <Breadcrumb
            items={[
              { label: "دوره‌ها", href: "/courses" },
              { label: course.title },
            ]}
            className="mb-6"
          />

          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge variant="primary">{course.category.title}</Badge>
                <Badge variant="outline">{LEVEL_LABELS[course.level]}</Badge>
                <CourseProgressBadge progress={course.progress} />
              </div>

              <h1 className="text-3xl font-black sm:text-4xl">{course.title}</h1>
              <p className="text-muted mt-4 text-lg">{course.excerpt}</p>

              {course.nextReleaseAt && course.progress !== "completed" && (
                <p className="bg-accent-soft text-accent-foreground mt-5 flex items-center gap-2 rounded-xl px-4 py-3 text-sm">
                  <CalendarClock className="size-4 shrink-0" aria-hidden="true" />
                  {course.progress === "ongoing"
                    ? "درس بعدی این دوره منتشر می‌شود: "
                    : "شروع انتشار این دوره: "}
                  <time dateTime={course.nextReleaseAt} className="font-bold">
                    {formatDate(course.nextReleaseAt)}
                  </time>
                </p>
              )}

              <div className="text-muted mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <span className="text-foreground flex items-center gap-1.5 font-bold">
                  <Star
                    className="text-warning size-4 fill-current"
                    aria-hidden="true"
                  />
                  {formatRating(course.rating)}
                  <span className="text-muted font-normal">
                    ({formatNumber(course.ratingCount)} رأی)
                  </span>
                </span>
                <span>مدرس: {course.instructor.name}</span>
                <span>
                  آخرین به‌روزرسانی:{" "}
                  <time dateTime={course.updatedAt}>
                    {formatDate(course.updatedAt)}
                  </time>
                </span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <CourseCover
                category={course.category}
                titleEn={course.titleEn}
                src={course.cover || undefined}
                className="rounded-2xl"
              />
            </div>
          </div>

          {/* قیمت و دکمه اقدام */}
          <div className="border-border bg-background mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-5">
            <div>
              <p className="text-muted mb-1.5 text-sm">
                {course.pricing.type === "free"
                  ? "این دوره کاملاً رایگان است"
                  : "دسترسی مادام‌العمر به همه درس‌ها"}
              </p>
              <CoursePrice pricing={course.pricing} size="detail" />
            </div>

            <Link
              href={
                course.pricing.type === "free"
                  ? `#curriculum-heading`
                  : `/courses/${course.slug}/enroll`
              }
              className={buttonStyles({ size: "lg" })}
            >
              {course.pricing.type === "free" ? (
                <>
                  <PlayCircle aria-hidden="true" />
                  شروع رایگان دوره
                </>
              ) : (
                <>
                  <ShoppingCart aria-hidden="true" />
                  ثبت‌نام در دوره
                </>
              )}
            </Link>
          </div>

          {/* آمار دوره.

              قاعده HTML: هر <div> داخل <dl> فقط اجازه دارد <dt> و <dd>
              داشته باشد. پس آیکون داخل خودِ <dt> می‌نشیند، نه کنارش —
              وگرنه رابطه برچسب و مقدار برای صفحه‌خوان می‌شکند. */}
          <dl className="border-border mt-10 grid grid-cols-2 gap-5 border-t pt-8 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1.5">
                <dt className="text-muted flex items-center gap-2 text-xs">
                  <span className="bg-primary-soft text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
                    <stat.icon className="size-4" aria-hidden="true" />
                  </span>
                  {stat.label}
                </dt>
                <dd className="font-bold">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-8">
            {/* درباره دوره */}
            <section aria-labelledby="about-heading">
              <h2 id="about-heading" className="mb-4 text-2xl font-black">
                درباره این دوره
              </h2>
              <p className="text-muted leading-9">{course.description}</p>
            </section>

            {/* دستاوردها */}
            <section aria-labelledby="outcomes-heading">
              <h2 id="outcomes-heading" className="mb-5 text-2xl font-black">
                بعد از این دوره چه می‌توانید بسازید؟
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {course.outcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-2.5">
                    <CircleCheck
                      className="text-success mt-1 size-5 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-muted text-sm">{outcome}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* سرفصل */}
            <section aria-labelledby="curriculum-heading">
              <h2 id="curriculum-heading" className="mb-2 text-2xl font-black">
                سرفصل دوره
              </h2>
              <p className="text-muted mb-5 text-sm">
                {formatNumber(course.chapters.length)} فصل ·{" "}
                {formatNumber(course.lessonCount)} درس ·{" "}
                {formatDuration(course.durationMinutes)}
              </p>
              <Curriculum chapters={course.chapters} />
            </section>

            {/* پروژه‌ها */}
            <section aria-labelledby="projects-heading">
              <h2 id="projects-heading" className="mb-5 text-2xl font-black">
                پروژه‌های عملی دوره
              </h2>
              <div className="space-y-4">
                {course.projects.map((project) => (
                  <Card key={project.id} className="p-5">
                    <div className="flex items-start gap-4">
                      <span className="bg-primary-soft text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
                        <FolderGit2 className="size-5" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="font-bold">{project.title}</h3>
                        <p className="text-muted mt-1.5 text-sm">
                          {project.description}
                        </p>
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {project.skills.map((skill) => (
                            <li key={skill}>
                              <Badge variant="neutral">{skill}</Badge>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* ستون کناری */}
          <aside className="space-y-6 lg:col-span-4">
            <section aria-labelledby="prerequisites-heading">
              <h2
                id="prerequisites-heading"
                className="mb-4 text-lg font-black"
              >
                پیش‌نیازها
              </h2>
              <Card className="p-5">
                <ul className="space-y-3">
                  {course.prerequisites.map((item) => (
                    <li
                      key={item}
                      className="text-muted flex items-start gap-2.5 text-sm"
                    >
                      <CircleCheck
                        className="text-primary mt-0.5 size-4 shrink-0"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </section>

            <section aria-labelledby="instructor-heading">
              <h2 id="instructor-heading" className="mb-4 text-lg font-black">
                مدرس دوره
              </h2>
              <PersonCard person={course.instructor} />
            </section>

            {course.tags.length > 0 && (
              <section aria-labelledby="tags-heading">
                <h2 id="tags-heading" className="mb-4 text-lg font-black">
                  برچسب‌ها
                </h2>
                <ul className="flex flex-wrap gap-2">
                  {course.tags.map((tag) => (
                    <li key={tag}>
                      <Badge variant="outline">{tag}</Badge>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </aside>
        </div>
      </Container>

      {/* دوره‌های مرتبط */}
      {related.length > 0 && (
        <section
          aria-labelledby="related-heading"
          className="border-border bg-surface border-t py-14"
        >
          <Container>
            <SectionHeading
              headingId="related-heading"
              title="دوره‌های مرتبط"
              description="مسیر یادگیری خود را با این دوره‌ها ادامه دهید."
              className="mb-8"
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <CourseCard key={item.id} course={item} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
