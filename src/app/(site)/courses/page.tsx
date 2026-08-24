import type { Metadata } from "next";
import Link from "next/link";
import { CourseCard } from "@/components/course";
import { ContentFilters, PageHeader } from "@/components/shared";
import {
  buttonStyles,
  Container,
  EmptyState,
  Pagination,
} from "@/components/ui";
import { getCategories, getCourses } from "@/lib/services";
import { formatNumber } from "@/lib/utils";
import { parseQueryParams, type RawSearchParams } from "@/lib/utils/query";

export const metadata: Metadata = {
  title: "دوره‌ها",
  description:
    "فهرست کامل دوره‌های پروژه‌محور کاوِنتادور در جاوا، اسپرینگ، جاوااسکریپت، ری‌اکت و نکست‌جی‌اس؛ رایگان و پولی، با سرفصل و قیمت شفاف.",
  alternates: { canonical: "/courses" },
};

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const resolvedParams = await searchParams;
  const query = parseQueryParams(resolvedParams, { pageSize: 9 });

  const [result, categories] = await Promise.all([
    getCourses(query),
    getCategories(),
  ]);

  return (
    <>
      <PageHeader
        title="دوره‌ها"
        description="هر دوره با یک پروژه واقعی تمام می‌شود. مسیر خود را انتخاب کنید و از اولین درس شروع کنید."
        breadcrumb={[{ label: "دوره‌ها" }]}
      />

      <Container className="py-10">
        <ContentFilters
          categories={categories}
          resultLabel={`${formatNumber(result.total)} دوره`}
          showLevel
          showProgress
          showPricing
          sortOptions={["newest", "popular", "rating", "title"]}
          searchPlaceholder="جستجو در دوره‌ها…"
          searchLabel="جستجو در دوره‌ها"
        />

        {result.items.length > 0 ? (
          <>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((course) => (
                <CourseCard key={course.id} course={course} headingLevel="h2" />
              ))}
            </div>

            <Pagination
              page={result.page}
              totalPages={result.totalPages}
              pathname="/courses"
              searchParams={resolvedParams}
            />
          </>
        ) : (
          <EmptyState
            as="h2"
            className="mt-8"
            title="دوره‌ای پیدا نشد"
            description="با فیلترهای انتخاب‌شده نتیجه‌ای وجود ندارد. فیلترها را تغییر دهید یا همه دوره‌ها را ببینید."
            action={
              <Link href="/courses" className={buttonStyles({ variant: "outline" })}>
                حذف فیلترها
              </Link>
            }
          />
        )}
      </Container>
    </>
  );
}
