import { Clock, Eye } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody, ArticleCard, ShareButtons } from "@/components/blog";
import { CourseCover } from "@/components/course";
import {
  Breadcrumb,
  JsonLd,
  PersonCard,
  SectionHeading,
} from "@/components/shared";
import { Badge, Container } from "@/components/ui";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import {
  getAllArticleSlugs,
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/services";
import { formatCompactNumber, formatDate, formatReadingTime } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
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
  const article = await getArticleBySlug(slug);

  if (!article) return { title: "مقاله پیدا نشد", robots: { index: false } };

  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.tags,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
      tags: article.tags,
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const related = await getRelatedArticles(slug, 3);

  return (
    <>
      <JsonLd data={articleJsonLd(article)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { label: "مقالات", href: "/blog" },
          { label: article.title, href: `/blog/${article.slug}` },
        ])}
      />

      <article>
        {/* سربرگ مقاله */}
        <header className="border-border bg-surface relative overflow-hidden border-b">
          <div
            aria-hidden="true"
            className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]"
          />

          <Container width="md" className="relative py-10 sm:py-14">
            <Breadcrumb
              items={[
                { label: "مقالات", href: "/blog" },
                { label: article.title },
              ]}
              className="mb-6"
            />

            <Link
              href={`/categories/${article.category.slug}`}
              className="focus-visible:outline-ring inline-block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <Badge variant="primary">{article.category.title}</Badge>
            </Link>

            <h1 className="mt-4 text-3xl font-black sm:text-4xl">
              {article.title}
            </h1>
            <p className="text-muted mt-4 text-lg">{article.excerpt}</p>

            <div className="text-muted mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <span className="text-foreground font-medium">
                {article.author.name}
              </span>
              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt)}
              </time>
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" aria-hidden="true" />
                {formatReadingTime(article.readingMinutes)}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="size-4" aria-hidden="true" />
                {formatCompactNumber(article.viewCount)} بازدید
              </span>
            </div>
          </Container>
        </header>

        <Container width="md" className="py-12">
          <CourseCover
            category={article.category}
            titleEn={article.category.titleEn}
            src={article.cover || undefined}
            className="mb-10 rounded-2xl"
          />

          <ArticleBody content={article.content} />

          {/* برچسب‌ها و اشتراک‌گذاری */}
          <div className="border-border mt-10 flex flex-wrap items-center justify-between gap-5 border-t pt-6">
            <ul className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <li key={tag}>
                  <Link
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="focus-visible:outline-ring inline-block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    <Badge variant="outline">#{tag}</Badge>
                  </Link>
                </li>
              ))}
            </ul>

            <ShareButtons
              path={`/blog/${article.slug}`}
              title={article.title}
            />
          </div>

          {/* نویسنده */}
          <section aria-labelledby="author-heading" className="mt-12">
            <h2 id="author-heading" className="mb-4 text-lg font-black">
              نویسنده
            </h2>
            <PersonCard person={article.author} />
          </section>
        </Container>
      </article>

      {/* مقالات مرتبط */}
      {related.length > 0 && (
        <section
          aria-labelledby="related-articles-heading"
          className="border-border bg-surface border-t py-14"
        >
          <Container>
            <SectionHeading
              headingId="related-articles-heading"
              title="مقالات مرتبط"
              description="اگر این مقاله برایتان مفید بود، این‌ها را هم بخوانید."
              className="mb-8"
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ArticleCard key={item.id} article={item} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
