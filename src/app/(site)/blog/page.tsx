import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/blog";
import { ContentFilters, PageHeader } from "@/components/shared";
import {
  buttonStyles,
  Container,
  EmptyState,
  Pagination,
} from "@/components/ui";
import { getArticles, getCategories } from "@/lib/services";
import { formatNumber } from "@/lib/utils";
import { parseQueryParams, type RawSearchParams } from "@/lib/utils/query";

export const metadata: Metadata = {
  title: "مقالات",
  description:
    "مقالات آموزشی کاوِنتادور درباره جاوا، اسپرینگ، جاوااسکریپت، ری‌اکت و نکست‌جی‌اس؛ نکته‌های عملی از دل پروژه‌های واقعی.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const resolvedParams = await searchParams;
  const query = parseQueryParams(resolvedParams, { pageSize: 9 });

  const [result, categories] = await Promise.all([
    getArticles(query),
    getCategories(),
  ]);

  return (
    <>
      <PageHeader
        title="مقالات"
        description="نکته‌هایی که در دوره‌ها جا نمی‌شوند: تجربه‌های واقعی، تله‌های رایج و تصمیم‌های معماری."
        breadcrumb={[{ label: "مقالات" }]}
      />

      <Container className="py-10">
        <ContentFilters
          categories={categories}
          resultLabel={`${formatNumber(result.total)} مقاله`}
          sortOptions={["newest", "popular", "oldest", "title"]}
          searchPlaceholder="جستجو در مقالات…"
          searchLabel="جستجو در مقالات"
        />

        {result.items.length > 0 ? (
          <>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  headingLevel="h2"
                />
              ))}
            </div>

            <Pagination
              page={result.page}
              totalPages={result.totalPages}
              pathname="/blog"
              searchParams={resolvedParams}
            />
          </>
        ) : (
          <EmptyState
            as="h2"
            className="mt-8"
            title="مقاله‌ای پیدا نشد"
            description="با فیلترهای انتخاب‌شده نتیجه‌ای وجود ندارد. فیلترها را تغییر دهید یا همه مقالات را ببینید."
            action={
              <Link href="/blog" className={buttonStyles({ variant: "outline" })}>
                حذف فیلترها
              </Link>
            }
          />
        )}
      </Container>
    </>
  );
}
