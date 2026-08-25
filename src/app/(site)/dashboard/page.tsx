import { BookOpen, CircleCheck, Clock, GraduationCap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CourseCover } from "@/components/course";
import {
  Badge,
  buttonStyles,
  Card,
  EmptyState,
  ProgressBar,
} from "@/components/ui";
import { getSession } from "@/lib/auth/session";
import { getLearningSummary, getUserEnrollments } from "@/lib/services";
import { formatDate, formatNumber } from "@/lib/utils";
import { ENROLLMENT_STATUS_LABELS } from "@/types";

export const metadata: Metadata = {
  title: "دوره‌های من",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=%2Fdashboard");

  const [enrollments, summary] = await Promise.all([
    getUserEnrollments(session.userId),
    getLearningSummary(session.userId),
  ]);

  const stats = [
    { icon: BookOpen, label: "دوره فعال", value: summary.active },
    { icon: CircleCheck, label: "دوره تمام‌شده", value: summary.completed },
    { icon: GraduationCap, label: "درس گذرانده", value: summary.lessonsCompleted },
    { icon: Clock, label: "در انتظار پرداخت", value: summary.awaitingPayment },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black">دوره‌های من</h2>
        <p className="text-muted mt-1.5 text-sm">
          خوش آمدید، {session.name}.
        </p>
      </div>

      {/* خلاصه یادگیری */}
      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="flex flex-col gap-1.5 p-4">
            <dt className="text-muted flex items-center gap-2 text-xs">
              <span className="bg-primary-soft text-primary flex size-8 shrink-0 items-center justify-center rounded-lg">
                <stat.icon className="size-4" aria-hidden="true" />
              </span>
              {stat.label}
            </dt>
            <dd className="text-2xl font-black">{formatNumber(stat.value)}</dd>
          </Card>
        ))}
      </dl>

      {/* فهرست دوره‌ها */}
      {enrollments.length === 0 ? (
        <EmptyState
          as="h3"
          icon={BookOpen}
          title="هنوز در دوره‌ای ثبت‌نام نکرده‌اید"
          description="از فهرست دوره‌ها یکی را انتخاب کنید و ثبت‌نام کنید تا اینجا ظاهر شود."
          action={
            <Link href="/courses" className={buttonStyles()}>
              مشاهده دوره‌ها
            </Link>
          }
        />
      ) : (
        <ul className="space-y-4">
          {enrollments.map((item) => {
            const locked = item.status !== "active";

            return (
              <li key={item.courseId}>
                <Card className="overflow-hidden sm:flex">
                  <div className="sm:w-56 sm:shrink-0">
                    <CourseCover
                      category={item.course.category}
                      titleEn={item.course.titleEn}
                      src={item.course.cover || undefined}
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="primary">
                        {item.course.category.title}
                      </Badge>
                      {locked && (
                        <Badge variant="warning">
                          {ENROLLMENT_STATUS_LABELS[item.status]}
                        </Badge>
                      )}
                      {item.progressPercent === 100 && (
                        <Badge variant="success">تمام شد</Badge>
                      )}
                    </div>

                    <h3 className="font-bold">
                      <Link
                        href={`/courses/${item.course.slug}`}
                        className="hover:text-primary focus-visible:outline-ring rounded transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                      >
                        {item.course.title}
                      </Link>
                    </h3>

                    {locked ? (
                      <p className="text-muted text-sm">
                        پس از تأیید پرداخت، درس‌های این دوره باز می‌شوند.
                      </p>
                    ) : (
                      <>
                        <ProgressBar
                          percent={item.progressPercent}
                          label={`پیشرفت دوره ${item.course.title}`}
                        />
                        <p className="text-subtle text-xs">
                          {formatNumber(item.completedCount)} از{" "}
                          {formatNumber(item.totalLessons)} درس · ثبت‌نام در{" "}
                          {formatDate(item.enrolledAt)}
                        </p>
                      </>
                    )}

                    <div className="mt-auto pt-2">
                      {locked ? (
                        <Link
                          href={`/courses/${item.course.slug}/enroll`}
                          className={buttonStyles({
                            variant: "outline",
                            size: "sm",
                          })}
                        >
                          راهنمای پرداخت
                        </Link>
                      ) : (
                        <Link
                          href={`/dashboard/courses/${item.courseId}`}
                          className={buttonStyles({ size: "sm" })}
                        >
                          {item.progressPercent === 0
                            ? "شروع دوره"
                            : "ادامه یادگیری"}
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
