import { CircleAlert, Mail } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CoursePrice } from "@/components/course";
import { Breadcrumb } from "@/components/shared";
import { buttonStyles, Card, Container } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { getCourseBySlug } from "@/lib/services";

export const metadata: Metadata = {
  title: "ثبت‌نام در دوره",
  robots: { index: false, follow: false },
};

/**
 * صفحه ثبت‌نام دوره پولی.
 *
 * ⚠️ درگاه پرداخت هنوز وصل نشده. این صفحه عمداً ساخته شده تا دکمه
 * «ثبت‌نام» به ۴۰۴ نخورد و کاربر راه ارتباطی داشته باشد. با اتصال
 * درگاه، همین صفحه به جریان پرداخت تبدیل می‌شود.
 */
export default async function EnrollPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) notFound();

  /* دوره رایگان ثبت‌نام نمی‌خواهد؛ کاربر مستقیم به صفحه دوره برمی‌گردد. */
  if (course.pricing.type === "free") {
    return (
      <Container width="sm" className="py-16 text-center">
        <h1 className="text-2xl font-black">این دوره رایگان است</h1>
        <p className="text-muted mt-3">
          برای شروع نیازی به ثبت‌نام نیست؛ مستقیم به سرفصل دوره بروید.
        </p>
        <Link
          href={`/courses/${course.slug}`}
          className={buttonStyles({ className: "mt-7" })}
        >
          بازگشت به دوره
        </Link>
      </Container>
    );
  }

  return (
    <Container width="sm" className="py-14">
      <Breadcrumb
        items={[
          { label: "دوره‌ها", href: "/courses" },
          { label: course.title, href: `/courses/${course.slug}` },
          { label: "ثبت‌نام" },
        ]}
        className="mb-6"
      />

      <h1 className="text-2xl font-black sm:text-3xl">ثبت‌نام در دوره</h1>
      <p className="text-muted mt-2">{course.title}</p>

      <Card className="mt-8 p-6">
        <div className="border-border flex flex-wrap items-center justify-between gap-4 border-b pb-5">
          <span className="text-muted text-sm">مبلغ دوره</span>
          <CoursePrice pricing={course.pricing} size="detail" />
        </div>

        <p className="text-warning bg-warning-soft mt-5 flex items-start gap-2 rounded-xl px-4 py-3 text-sm">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          درگاه پرداخت آنلاین هنوز فعال نشده است. برای ثبت‌نام در این دوره
          فعلاً از راه ایمیل اقدام کنید؛ به‌زودی پرداخت مستقیم اضافه می‌شود.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(`ثبت‌نام در دوره: ${course.title}`)}`}
            className={buttonStyles({ size: "lg" })}
          >
            <Mail aria-hidden="true" />
            ارسال ایمیل ثبت‌نام
          </a>
          <Link
            href={`/courses/${course.slug}`}
            className={buttonStyles({ variant: "outline", size: "lg" })}
          >
            بازگشت به دوره
          </Link>
        </div>
      </Card>
    </Container>
  );
}
