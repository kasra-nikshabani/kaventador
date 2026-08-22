import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ArticleCard } from "@/components/blog";
import { CategoryCard, CourseCard } from "@/components/course";
import { Hero, HomeCta, Stats, WhyProjects } from "@/components/home";
import { JsonLd, SectionHeading } from "@/components/shared";
import { buttonStyles, Container } from "@/components/ui";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
import {
  getCategories,
  getFeaturedCourses,
  getLatestArticles,
  getOngoingCourses,
  getPlatformStats,
} from "@/lib/services";

export default async function HomePage() {
  /* همه دریافت‌ها مستقل‌اند، پس موازی اجرا می‌شوند. */
  const [stats, categories, featuredCourses, ongoingCourses, latestArticles] =
    await Promise.all([
      getPlatformStats(),
      getCategories(),
      getFeaturedCourses(3),
      getOngoingCourses(3),
      getLatestArticles(3),
    ]);

  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />

      <Hero />
      <Stats {...stats} />

      {/* مسیرهای یادگیری */}
      <section aria-labelledby="categories-heading" className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            headingId="categories-heading"
            eyebrow="مسیرهای یادگیری"
            title="از کجا شروع کنیم؟"
            description="هر مسیر یک فناوری را از پایه تا سطح قابل استخدام پوشش می‌دهد."
            action={
              <Link
                href="/categories"
                className={buttonStyles({ variant: "outline", size: "sm" })}
              >
                همه مسیرها
                <ArrowLeft aria-hidden="true" />
              </Link>
            }
            className="mb-10"
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </Container>
      </section>

      {/* در حال برگزاری — فقط وقتی دوره‌ای در این وضعیت هست */}
      {ongoingCourses.length > 0 && (
        <section aria-labelledby="ongoing-heading" className="pt-16 sm:pt-20">
          <Container>
            <SectionHeading
              headingId="ongoing-heading"
              eyebrow="همین حالا در جریان است"
              title="دوره‌های در حال برگزاری"
              description="این دوره‌ها هنوز کامل نشده‌اند و هر هفته درس تازه‌ای به آن‌ها اضافه می‌شود."
              action={
                <Link
                  href="/courses?progress=ongoing"
                  className={buttonStyles({ variant: "outline", size: "sm" })}
                >
                  همه‌شان
                  <ArrowLeft aria-hidden="true" />
                </Link>
              }
              className="mb-10"
            />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ongoingCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* دوره‌های شاخص */}
      <section
        aria-labelledby="featured-heading"
        className="border-border bg-surface border-y py-16 sm:py-20"
      >
        <Container>
          <SectionHeading
            headingId="featured-heading"
            eyebrow="پیشنهاد ما"
            title="دوره‌های شاخص"
            description="سه دوره‌ای که بیشترین بازخورد را از دانشجویان گرفته‌اند."
            action={
              <Link
                href="/courses"
                className={buttonStyles({ variant: "outline", size: "sm" })}
              >
                همه دوره‌ها
                <ArrowLeft aria-hidden="true" />
              </Link>
            }
            className="mb-10"
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </Container>
      </section>

      <WhyProjects />

      {/* تازه‌ترین مقالات */}
      <section
        aria-labelledby="articles-heading"
        className="border-border bg-surface border-y py-16 sm:py-20"
      >
        <Container>
          <SectionHeading
            headingId="articles-heading"
            eyebrow="وبلاگ"
            title="تازه‌ترین مقالات"
            description="نکته‌های عملی که در دوره‌ها جا نمی‌شوند."
            action={
              <Link
                href="/blog"
                className={buttonStyles({ variant: "outline", size: "sm" })}
              >
                همه مقالات
                <ArrowLeft aria-hidden="true" />
              </Link>
            }
            className="mb-10"
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </Container>
      </section>

      <div className="py-16 sm:py-20">
        <HomeCta />
      </div>
    </>
  );
}
