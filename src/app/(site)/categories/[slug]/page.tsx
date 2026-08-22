import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/blog";
import { CourseCard } from "@/components/course";
import { JsonLd, SectionHeading } from "@/components/shared";
import { PageHeader } from "@/components/shared";
import { buttonStyles, Container, EmptyState } from "@/components/ui";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import {
  getAllCategorySlugs,
  getArticles,
  getCategoryBySlug,
  getCourses,
} from "@/lib/services";
import { formatNumber } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
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
  const category = await getCategoryBySlug(slug);

  if (!category) return { title: "دسته‌بندی پیدا نشد", robots: { index: false } };

  return {
    title: `آموزش ${category.title}`,
    description: category.description,
    alternates: { canonical: `/categories/${category.slug}` },
  };
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) notFound();

  const [courses, articles] = await Promise.all([
    getCourses({ categorySlug: slug, pageSize: 12 }),
    getArticles({ categorySlug: slug, pageSize: 3 }),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "دسته‌بندی‌ها", href: "/categories" },
          { label: category.title, href: `/categories/${category.slug}` },
        ])}
      />

      <PageHeader
        title={`آموزش ${category.title}`}
        description={category.description}
        breadcrumb={[
          { label: "دسته‌بندی‌ها", href: "/categories" },
          { label: category.title },
        ]}
      >
        <p className="text-muted text-sm">
          {formatNumber(category.courseCount)} دوره ·{" "}
          {formatNumber(category.articleCount)} مقاله
        </p>
      </PageHeader>

      <Container className="py-12">
        <section aria-labelledby="category-courses-heading">
          <SectionHeading
            headingId="category-courses-heading"
            title="دوره‌ها"
            description={`${formatNumber(courses.total)} دوره در این مسیر`}
            className="mb-8"
          />

          {courses.items.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {courses.items.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="هنوز دوره‌ای در این مسیر منتشر نشده"
              description="در حال آماده‌سازی محتوای این بخش هستیم. سایر مسیرها را ببینید."
              action={
                <Link
                  href="/courses"
                  className={buttonStyles({ variant: "outline" })}
                >
                  همه دوره‌ها
                </Link>
              }
            />
          )}
        </section>

        {articles.items.length > 0 && (
          <section
            aria-labelledby="category-articles-heading"
            className="mt-16"
          >
            <SectionHeading
              headingId="category-articles-heading"
              title="مقالات مرتبط"
              className="mb-8"
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {articles.items.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
