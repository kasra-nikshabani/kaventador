import { BookOpen, FileText, Tags, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { StatCard } from "@/components/admin/stat-card";
import { StudentsChart } from "@/components/admin/students-chart";
import { Badge, Card } from "@/components/ui";
import {
  getDashboardStats,
  getRecentContent,
  getStudentsPerCourse,
} from "@/lib/services";
import { formatCompactNumber, formatDate, formatNumber } from "@/lib/utils";
import { CONTENT_STATUS_LABELS, type ContentStatus } from "@/types";

export const metadata: Metadata = { title: "داشبورد" };

const STATUS_VARIANT: Record<ContentStatus, "success" | "warning" | "neutral"> = {
  published: "success",
  draft: "warning",
  archived: "neutral",
};

export default async function AdminDashboardPage() {
  const [stats, chartData, recent] = await Promise.all([
    getDashboardStats(),
    getStudentsPerCourse(),
    getRecentContent(6),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-2xl font-black">داشبورد</h1>
        <p className="text-muted mt-1.5 text-sm">
          نمای کلی محتوا و کاربران کاوِنتادور.
        </p>
      </div>

      {/* ردیف آمار */}
      <section aria-label="آمار کلی">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={BookOpen}
            label="دوره‌ها"
            value={formatNumber(stats.courses.total)}
            hint={`${formatNumber(stats.courses.published)} منتشرشده · ${formatNumber(stats.courses.draft)} پیش‌نویس`}
          />
          <StatCard
            icon={FileText}
            label="مقالات"
            value={formatNumber(stats.articles.total)}
            hint={`${formatCompactNumber(stats.articles.totalViews)} بازدید`}
          />
          <StatCard
            icon={Users}
            label="کاربران"
            value={formatNumber(stats.users.total)}
            hint={`${formatNumber(stats.users.active)} فعال · ${formatNumber(stats.users.students)} دانشجو`}
          />
          <StatCard
            icon={Tags}
            label="دسته‌بندی‌ها"
            value={formatNumber(stats.categories.total)}
            hint={`${formatCompactNumber(stats.students)} ثبت‌نام در دوره‌ها`}
          />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* نمودار */}
        <section aria-label="نمودار دانشجویان" className="lg:col-span-7">
          <StudentsChart data={chartData} />
        </section>

        {/* آخرین تغییرات */}
        <section aria-labelledby="recent-heading" className="lg:col-span-5">
          <Card className="p-5">
            <h2 id="recent-heading" className="font-bold">
              آخرین تغییرات محتوا
            </h2>
            <p className="text-muted mt-1 text-sm">
              مرتب‌شده بر اساس تاریخ به‌روزرسانی.
            </p>

            <ul className="divide-border mt-4 divide-y">
              {recent.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-3">
                  <span className="bg-surface-2 text-muted flex size-9 shrink-0 items-center justify-center rounded-lg">
                    {item.kind === "course" ? (
                      <BookOpen className="size-4" aria-hidden="true" />
                    ) : (
                      <FileText className="size-4" aria-hidden="true" />
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <Link
                      href={item.href}
                      className="hover:text-primary focus-visible:outline-ring block truncate text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      {item.title}
                    </Link>
                    <span className="text-subtle text-xs">
                      {formatDate(item.updatedAt)}
                    </span>
                  </span>

                  <Badge variant={STATUS_VARIANT[item.status]}>
                    {CONTENT_STATUS_LABELS[item.status]}
                  </Badge>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      </div>
    </div>
  );
}
