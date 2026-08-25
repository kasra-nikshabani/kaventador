import { Users } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable } from "@/components/admin/data-table";
import { Avatar, Badge, EmptyState, ProgressBar } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth/session";
import { findAllUsers } from "@/lib/repositories";
import { getStudentsOfInstructor } from "@/lib/services";
import { formatDate, formatNumber } from "@/lib/utils";
import { ENROLLMENT_STATUS_LABELS, type EnrollmentStatus } from "@/types";

export const metadata: Metadata = { title: "دانشجویان" };

const STATUS_VARIANT: Record<EnrollmentStatus, "success" | "warning" | "neutral"> = {
  active: "success",
  awaiting_payment: "warning",
  cancelled: "neutral",
};

type Row = Awaited<ReturnType<typeof getStudentsOfInstructor>>[number];

export default async function InstructorStudentsPage() {
  const user = await getCurrentUser();
  if (!user?.personId) redirect("/dashboard");

  const allUsers = await findAllUsers();
  const students = await getStudentsOfInstructor(user.personId, allUsers);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <AdminPageHeader
        title="دانشجویان"
        description={`${formatNumber(students.length)} ثبت‌نام در دوره‌های شما`}
      />

      <DataTable<Row>
        caption="فهرست دانشجویان دوره‌های من"
        rows={students}
        rowKey={(row) => `${row.user.id}-${row.enrollment.courseId}`}
        empty={
          <EmptyState
            as="h2"
            icon={Users}
            title="هنوز کسی ثبت‌نام نکرده"
            description="وقتی دانشجویی در یکی از دوره‌های شما ثبت‌نام کند، اینجا دیده می‌شود."
          />
        }
        columns={[
          {
            key: "student",
            header: "دانشجو",
            cell: (row) => (
              <span className="flex items-center gap-3">
                <Avatar name={row.user.name} src={row.user.avatar} size="sm" />
                <span>
                  <span className="block font-medium">{row.user.name}</span>
                  <span className="code-chip mt-1">{row.user.username}</span>
                </span>
              </span>
            ),
          },
          {
            key: "course",
            header: "دوره",
            cell: (row) => <span className="text-muted">{row.courseTitle}</span>,
          },
          {
            key: "status",
            header: "وضعیت",
            cell: (row) => (
              <Badge variant={STATUS_VARIANT[row.enrollment.status]}>
                {ENROLLMENT_STATUS_LABELS[row.enrollment.status]}
              </Badge>
            ),
          },
          {
            key: "progress",
            header: "پیشرفت",
            hideBelow: "md",
            cell: (row) => (
              <ProgressBar
                percent={row.progressPercent}
                label={`پیشرفت ${row.user.name} در ${row.courseTitle}`}
                className="min-w-32"
              />
            ),
          },
          {
            key: "enrolledAt",
            header: "تاریخ ثبت‌نام",
            hideBelow: "lg",
            cell: (row) => (
              <span className="text-muted whitespace-nowrap">
                {formatDate(row.enrollment.enrolledAt)}
              </span>
            ),
          },
        ]}
      />

      {/* ایمیل دانشجو عمداً نمایش داده نمی‌شود: مدرس برای دیدن پیشرفت
          به آن نیازی ندارد و کمترین دسترسی، امن‌ترین دسترسی است. */}
    </div>
  );
}
