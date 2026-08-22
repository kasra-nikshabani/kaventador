import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buttonStyles, Container } from "@/components/ui";

export function HomeCta() {
  return (
    <section aria-labelledby="cta-heading" className="pb-4">
      <Container>
        <div className="border-border bg-surface relative overflow-hidden rounded-3xl border px-6 py-14 text-center sm:px-12">
          <div
            aria-hidden="true"
            className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
          />

          <div className="relative">
            <h2 id="cta-heading" className="text-2xl font-black sm:text-3xl">
              اولین پروژه‌تان را همین امروز شروع کنید
            </h2>
            <p className="text-muted mx-auto mt-3 max-w-xl">
              نیازی به ثبت‌نام یا پرداخت نیست. یک مسیر انتخاب کنید و از اولین درس
              شروع کنید.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/courses" className={buttonStyles({ size: "lg" })}>
                مشاهده دوره‌ها
                <ArrowLeft aria-hidden="true" />
              </Link>
              <Link
                href="/about"
                className={buttonStyles({ variant: "outline", size: "lg" })}
              >
                درباره کاوِنتادور
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
