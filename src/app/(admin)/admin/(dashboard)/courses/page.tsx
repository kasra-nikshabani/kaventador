import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminSearch } from "@/components/admin/admin-search";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { CoursePrice, CourseProgressBadge } from "@/components/course";
import { Badge, buttonStyles, EmptyState, Pagination } from "@/components/ui";
import { deleteCourseAction } from "@/lib/actions/content";
import {
  findAllCategories,
  findAllCourses,
  findAllUsers,
} from "@/lib/repositories";
import { countEnrollmentsByCourse } from "@/lib/services";
import { matchesSearch, paginate } from "@/lib/services/shared";
import { formatDate, formatNumber } from "@/lib/utils";
import { parseQueryParams, type RawSearchParams } from "@/lib/utils/query";
import {
  CONTENT_STATUS_LABELS,
  COURSE_PROGRESS_LABELS,
  LEVEL_LABELS,
  type Course,
  type ContentStatus,
  type CourseProgress,
} from "@/types";

export const metadata: Metadata = { title: "مدیریت دوره‌ها" };

const STATUS_VARIANT: Record<ContentStatus, "success" | "warning" | "neutral"> = {
  published: "success",
  draft: "warning",
  archived: "neutral",
};

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const resolved = await searchParams;
  const query = parseQueryParams(resolved, { pageSize: 10 });

  const [all, categories, users] = await Promise.all([
    findAllCourses(),
    findAllCategories(),
    findAllUsers(),
  ]);

  /* شمار واقعی ثبت‌نام، نه `course.studentCount` که عدد ثابت داده اولیه
     است و با ثبت‌نام‌های واقعی به‌روز نمی‌شود. */
  const enrollmentCount = countEnrollmentsByCourse(users);

  const categoryTitle = (id: string) =>
    categories.find((item) => item.id === id)?.title ?? "—";

  const filtered = all.filter((course) => {
    if (query.status && course.status !== query.status) return false;
    if (query.level && course.level !== query.level) return false;
    if (query.progress && course.progress !== query.progress) return false;
    if (query.pricing && course.pricing.type !== query.pricing) return false;
    return matchesSearch(query.search, course.title, course.titleEn, course.slug);
  });

  const result = paginate(filtered, query.page, 10);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeader
        title="دوره‌ها"
        description="مدیریت همه دوره‌ها، شامل پیش‌نویس‌ها و بایگانی."
        action={
          <Link href="/admin/courses/new" className={buttonStyles()}>
            <Plus aria-hidden="true" />
            دوره جدید
          </Link>
        }
      />

      <AdminSearch
        placeholder="جستجو در دوره‌ها…"
        resultLabel={`${formatNumber(result.total)} دوره`}
        filters={[
          {
            name: "status",
            label: "فیلتر وضعیت",
            placeholder: "همه وضعیت‌ها",
            options: (["published", "draft", "archived"] as const).map((s) => ({
              value: s,
              label: CONTENT_STATUS_LABELS[s],
            })),
          },
          {
            name: "pricing",
            label: "فیلتر قیمت",
            placeholder: "رایگان و پولی",
            options: [
              { value: "free", label: "رایگان" },
              { value: "paid", label: "پولی" },
            ],
          },
          {
            name: "progress",
            label: "فیلتر وضعیت برگزاری",
            placeholder: "همه وضعیت برگزاری",
            options: (["ongoing", "upcoming", "completed"] as CourseProgress[]).map(
              (p) => ({ value: p, label: COURSE_PROGRESS_LABELS[p] }),
            ),
          },
          {
            name: "level",
            label: "فیلتر سطح",
            placeholder: "همه سطح‌ها",
            options: (["beginner", "intermediate", "advanced"] as const).map((l) => ({
              value: l,
              label: LEVEL_LABELS[l],
            })),
          },
        ]}
      />

      <DataTable<Course>
        caption="فهرست دوره‌ها"
        rows={result.items}
        rowKey={(row) => row.id}
        empty={
          <EmptyState
            as="h2"
            title="دوره‌ای پیدا نشد"
            description="با فیلترهای فعلی نتیجه‌ای وجود ندارد."
            action={
              <Link href="/admin/courses" className={buttonStyles({ variant: "outline" })}>
                حذف فیلترها
              </Link>
            }
          />
        }
        columns={[
          {
            key: "title",
            header: "عنوان",
            cell: (row) => (
              <span>
                <Link
                  href={`/admin/courses/${row.id}`}
                  className="hover:text-primary focus-visible:outline-ring block rounded font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {row.title}
                </Link>
                <span className="code-chip mt-1">
                  {row.slug}
                </span>
              </span>
            ),
          },
          {
            key: "category",
            header: "دسته‌بندی",
            hideBelow: "md",
            cell: (row) => <span className="text-muted">{categoryTitle(row.categoryId)}</span>,
          },
          {
            key: "level",
            header: "سطح",
            hideBelow: "lg",
            cell: (row) => <Badge variant="outline">{LEVEL_LABELS[row.level]}</Badge>,
          },
          {
            key: "status",
            header: "وضعیت",
            cell: (row) => (
              <Badge variant={STATUS_VARIANT[row.status]}>
                {CONTENT_STATUS_LABELS[row.status]}
              </Badge>
            ),
          },
          {
            key: "progress",
            header: "برگزاری",
            hideBelow: "md",
            cell: (row) => <CourseProgressBadge progress={row.progress} />,
          },
          {
            key: "pricing",
            header: "قیمت",
            hideBelow: "sm",
            cell: (row) => <CoursePrice pricing={row.pricing} />,
          },
          {
            key: "students",
            header: "ثبت‌نام",
            hideBelow: "sm",
            cell: (row) => (
              <span className="text-muted tabular-nums">
                {formatNumber(enrollmentCount.get(row.id) ?? 0)}
              </span>
            ),
          },
          {
            key: "updated",
            header: "به‌روزرسانی",
            hideBelow: "lg",
            cell: (row) => (
              <span className="text-muted whitespace-nowrap">
                {formatDate(row.updatedAt)}
              </span>
            ),
          },
          {
            key: "actions",
            header: "عملیات",
            align: "end",
            cell: (row) => (
              <span className="flex items-center justify-end gap-1">
                <Link
                  href={`/admin/courses/${row.id}`}
                  className={buttonStyles({ variant: "ghost", size: "sm" })}
                >
                  جزئیات
                </Link>
                <Link
                  href={`/admin/courses/${row.id}/curriculum`}
                  className={buttonStyles({ variant: "ghost", size: "sm" })}
                >
                  سرفصل
                </Link>
                <Link
                  href={`/admin/courses/${row.id}/edit`}
                  className={buttonStyles({ variant: "ghost", size: "sm" })}
                >
                  ویرایش
                </Link>
                <DeleteButton
                  action={deleteCourseAction}
                  id={row.id}
                  name={row.title}
                  entityLabel="دوره"
                />
              </span>
            ),
          },
        ]}
      />

      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        pathname="/admin/courses"
        searchParams={resolved}
      />
    </div>
  );
}
