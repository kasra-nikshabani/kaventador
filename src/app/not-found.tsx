import { BookOpen, Home } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { buttonStyles, Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "صفحه پیدا نشد",
  robots: { index: false, follow: false },
};

/**
 * صفحه ۴۰۴ سراسری.
 *
 * چون در ریشه `app/` قرار دارد، لِی‌اوت گروه `(site)` را نمی‌گیرد؛
 * بنابراین هدر و فوتر مستقیم اینجا رندر می‌شوند تا کاربر گم نشود.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />

      <main className="flex flex-1 items-center">
        <Container className="relative overflow-hidden py-20 text-center">
          <div
            aria-hidden="true"
            className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
          />

          <div className="relative">
            <p
              className="text-gradient text-7xl font-black sm:text-8xl"
              aria-hidden="true"
            >
              ۴۰۴
            </p>

            <h1 className="mt-6 text-2xl font-black sm:text-3xl">
              این صفحه پیدا نشد
            </h1>

            <p className="text-muted mx-auto mt-3 max-w-md">
              ممکن است نشانی را اشتباه وارد کرده باشید یا این صفحه جابه‌جا شده
              باشد. از مسیرهای زیر ادامه دهید.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/" className={buttonStyles()}>
                <Home aria-hidden="true" />
                صفحه اصلی
              </Link>
              <Link href="/courses" className={buttonStyles({ variant: "outline" })}>
                <BookOpen aria-hidden="true" />
                مشاهده دوره‌ها
              </Link>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
