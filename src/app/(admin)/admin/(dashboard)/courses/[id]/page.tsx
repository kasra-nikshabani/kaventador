import {
  BookOpen,
  Clock,
  Pencil,
  TrendingUp,
  Users,
  Video,
  Wallet,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable } from "@/components/admin/data-table";
import { CoursePrice, CourseProgressBadge } from "@/components/course";
import { Breadcrumb } from "@/components/shared";
import {
  Avatar,
  Badge,
  buttonStyles,
  Card,
  EmptyState,
  ProgressBar,
} from "@/components/ui";
import {
  findAllUsers,
  findCourseById,
  findCategoryById,
  findPersonById,
} from "@/lib/repositories";
import { getCourseEnrollees, type CourseEnrollee } from "@/lib/services";
import { formatDate, formatDuration, formatNumber } from "@/lib/utils";
import {
  CONTENT_STATUS_LABELS,
  ENROLLMENT_STATUS_LABELS,
  LEVEL_LABELS,
  USER_STATUS_LABELS,
  type ContentStatus,
  type EnrollmentStatus,
} from "@/types";

export const metadata: Metadata = { title: "جزئیات دوره" };

const STATUS_VARIANT: Record<ContentStatus, "success" | "warning" | "neutral"> = {
  published: "success",
  draft: "warning",
  archived: "neutral",
};

const ENROLLMENT_VARIANT: Record<
  EnrollmentStatus,
  "success" | "warning" | "neutral"
> = {
  active: "success",
  awaiting_payment: "warning",
  cancelled: "neutral",
};

export default async function AdminCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [course, allUsers] = await Promise.all([
    findCourseById(id),
    findAllUsers(),
  ]);

  if (!course) notFound();

  const [enrollees, category, instructor] = await Promise.all([
    getCourseEnrollees(course.id, allUsers),
    findCategoryById(course.categoryId),
    findPersonById(course.instructorId),
  ]);

  const active = enrollees.filter((e) => e.enrollment.status === "active");
  const awaiting = enrollees.filter(
    (e) => e.enrollment.status === "awaiting_payment",
  );

  /* میانگین فقط روی ثبت‌نام فعال معنا دارد: کسی که هنوز پرداخت نکرده
     به درس‌ها دسترسی ندارد، پس صفرِ او میانگین را گمراه‌کننده می‌کند. */
  const averageProgress =
    active.length === 0
      ? 0
      : Math.round(
          active.reduce((sum, e) => sum + e.progressPercent, 0) / active.length,
        );

  const finished = active.filter((e) => e.progressPercent === 100).length;

  const stats = [
    { icon: Users, label: "ثبت‌نام", value: formatNumber(enrollees.length) },
    { icon: Wallet, label: "در انتظار پرداخت", value: formatNumber(awaiting.length) },
    { icon: TrendingUp, label: "میانگین پیشرفت", value: `${formatNumber(averageProgress)}٪` },
    { icon: BookOpen, label: "تمام‌کرده", value: formatNumber(finished) },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Breadcrumb
        items={[
          { label: "دوره‌ها", href: "/admin/courses" },
          { label: course.title },
        ]}
      />

      <AdminPageHeader
        title={course.title}
        description={course.excerpt}
        action={
          <span className="flex flex-wrap items-center gap-2">
            <Link
              href={`/admin/courses/${course.id}/curriculum`}
              className={buttonStyles({ variant: "secondary" })}
            >
              <Video aria-hidden="true" />
              سرفصل
            </Link>
            <Link href={`/admin/courses/${course.id}/edit`} className={buttonStyles()}>
              <Pencil aria-hidden="true" />
              ویرایش
            </Link>
          </span>
        }
      />

      {/* شناسنامه دوره */}
      <Card className="p-5">
        <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-muted text-xs">قیمت</dt>
            <dd className="mt-1.5">
              <CoursePrice pricing={course.pricing} size="detail" />
            </dd>
          </div>
          <div>
            <dt className="text-muted text-xs">وضعیت انتشار</dt>
            <dd className="mt-1.5">
              <Badge variant={STATUS_VARIANT[course.status]}>
                {CONTENT_STATUS_LABELS[course.status]}
              </Badge>
            </dd>
          </div>
          <div>
            <dt className="text-muted text-xs">برگزاری</dt>
            <dd className="mt-1.5">
              <CourseProgressBadge progress={course.progress} />
            </dd>
          </div>
          <div>
            <dt className="text-muted text-xs">سطح</dt>
            <dd className="mt-1.5">
              <Badge variant="outline">{LEVEL_LABELS[course.level]}</Badge>
            </dd>
          </div>

          <div>
            <dt className="text-muted text-xs">مدرس</dt>
            <dd className="mt-1.5 text-sm font-medium">
              {instructor?.name ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted text-xs">دسته‌بندی</dt>
            <dd className="mt-1.5 text-sm font-medium">{category?.title ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted text-xs">محتوا</dt>
            <dd className="mt-1.5 flex items-center gap-1.5 text-sm font-medium">
              <Clock className="text-muted size-4" aria-hidden="true" />
              {formatNumber(course.lessonCount)} درس ·{" "}
              {formatDuration(course.durationMinutes)}
            </dd>
          </div>
          <div>
            <dt className="text-muted text-xs">اسلاگ</dt>
            <dd className="mt-1.5">
              <span className="code-chip">{course.slug}</span>
            </dd>
          </div>
        </dl>
      </Card>

      {/* خلاصه ثبت‌نام */}
      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="flex flex-col gap-1.5 p-4">
            <dt className="text-muted flex items-center gap-2 text-xs">
              <span className="bg-primary-soft text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
                <stat.icon className="size-4" aria-hidden="true" />
              </span>
              {stat.label}
            </dt>
            <dd className="text-2xl font-black tabular-nums">{stat.value}</dd>
          </Card>
        ))}
      </dl>

      <section className="space-y-4">
        <h2 className="text-lg font-bold">ثبت‌نام‌کنندگان</h2>

        <DataTable<CourseEnrollee>
          caption={`فهرست ثبت‌نام‌کنندگان دوره ${course.title}`}
          rows={enrollees}
          rowKey={(row) => row.user.id}
          empty={
            <EmptyState
              as="h3"
              icon={Users}
              title="هنوز کسی ثبت‌نام نکرده"
              description="وقتی کاربری در این دوره ثبت‌نام کند، اینجا با میزان پیشرفتش دیده می‌شود."
            />
          }
          columns={[
            {
              key: "user",
              header: "کاربر",
              cell: (row) => (
                <span className="flex items-center gap-3">
                  <Avatar name={row.user.name} src={row.user.avatar} size="sm" />
                  <span>
                    <span className="block font-medium">{row.user.name}</span>
                    <span className="text-subtle block text-xs" dir="ltr">
                      {row.user.email}
                    </span>
                  </span>
                </span>
              ),
            },
            {
              key: "enrollmentStatus",
              header: "ثبت‌نام",
              cell: (row) => (
                <Badge variant={ENROLLMENT_VARIANT[row.enrollment.status]}>
                  {ENROLLMENT_STATUS_LABELS[row.enrollment.status]}
                </Badge>
              ),
            },
            {
              key: "accountStatus",
              header: "حساب",
              hideBelow: "lg",
              cell: (row) => (
                <span className="text-muted text-sm">
                  {USER_STATUS_LABELS[row.user.status]}
                </span>
              ),
            },
            {
              key: "progress",
              header: "پیشرفت",
              hideBelow: "md",
              cell: (row) =>
                row.enrollment.status === "active" ? (
                  <span className="block min-w-32">
                    <ProgressBar
                      percent={row.progressPercent}
                      label={`پیشرفت ${row.user.name} در این دوره`}
                    />
                    <span className="text-subtle mt-1 block text-xs">
                      {formatNumber(row.completedCount)} از{" "}
                      {formatNumber(row.totalLessons)} درس
                    </span>
                  </span>
                ) : (
                  <span className="text-subtle text-sm">—</span>
                ),
            },
            {
              key: "enrolledAt",
              header: "تاریخ ثبت‌نام",
              hideBelow: "sm",
              cell: (row) => (
                <span className="text-muted whitespace-nowrap">
                  {formatDate(row.enrollment.enrolledAt)}
                </span>
              ),
            },
            {
              key: "actions",
              header: "عملیات",
              align: "end",
              cell: (row) => (
                <Link
                  href={`/admin/users/${row.user.id}/edit`}
                  className={buttonStyles({ variant: "ghost", size: "sm" })}
                >
                  مدیریت کاربر
                </Link>
              ),
            },
          ]}
        />
      </section>
    </div>
  );
}
