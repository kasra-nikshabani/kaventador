import { BookOpen, Plus, Video } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable } from "@/components/admin/data-table";
import { CoursePrice, CourseProgressBadge } from "@/components/course";
import { Badge, buttonStyles, Card, EmptyState } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth/session";
import { findAllUsers } from "@/lib/repositories";
import { getCoursesOfInstructor, getStudentsOfInstructor } from "@/lib/services";
import { formatDate, formatNumber } from "@/lib/utils";
import {
  CONTENT_STATUS_LABELS,
  type ContentStatus,
  type Course,
} from "@/types";

/* `absolute` لازم است: قالب عنوانِ لِی‌اوت به صفحه‌ی *همان* بخش اعمال
   نمی‌شود، پس بدون این، قالب پنل ادمین می‌نشست. */
export const metadata: Metadata = {
  title: { absolute: "دوره‌های من | پنل مدرس کاوِنتادور" },
};

const STATUS_VARIANT: Record<ContentStatus, "success" | "warning" | "neutral"> = {
  published: "success",
  draft: "warning",
  archived: "neutral",
};

export default async function InstructorCoursesPage() {
  const user = await getCurrentUser();
  if (!user?.personId) redirect("/dashboard");

  const [courses, allUsers] = await Promise.all([
    getCoursesOfInstructor(user.personId),
    findAllUsers(),
  ]);
  const students = await getStudentsOfInstructor(user.personId, allUsers);

  const stats = [
    { label: "دوره", value: courses.length },
    { label: "دانشجو", value: students.length },
    {
      label: "درس",
      value: courses.reduce((sum, course) => sum + course.lessonCount, 0),
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader
        title="دوره‌های من"
        description="فقط دوره‌هایی که شما مدرس آن هستید."
        action={
          <Link href="/instructor/courses/new" className={buttonStyles()}>
            <Plus aria-hidden="true" />
            دوره جدید
          </Link>
        }
      />

      <dl className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <dt className="text-muted text-xs">{stat.label}</dt>
            <dd className="mt-1 text-2xl font-black">{formatNumber(stat.value)}</dd>
          </Card>
        ))}
      </dl>

      <DataTable<Course>
        caption="فهرست دوره‌های من"
        rows={courses}
        rowKey={(row) => row.id}
        empty={
          <EmptyState
            as="h2"
            icon={BookOpen}
            title="هنوز دوره‌ای ندارید"
            description="اولین دوره خود را بسازید و سرفصل و ویدیوهایش را اضافه کنید."
            action={
              <Link href="/instructor/courses/new" className={buttonStyles()}>
                ساخت دوره
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
                <span className="block font-medium">{row.title}</span>
                <span className="code-chip mt-1">{row.slug}</span>
              </span>
            ),
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
            key: "lessons",
            header: "درس",
            hideBelow: "lg",
            cell: (row) => (
              <span className="text-muted tabular-nums">
                {formatNumber(row.lessonCount)}
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
                  href={`/instructor/courses/${row.id}/curriculum`}
                  className={buttonStyles({ variant: "ghost", size: "sm" })}
                >
                  <Video aria-hidden="true" />
                  سرفصل و ویدیو
                </Link>
                <Link
                  href={`/instructor/courses/${row.id}/edit`}
                  className={buttonStyles({ variant: "ghost", size: "sm" })}
                >
                  ویرایش
                </Link>
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
