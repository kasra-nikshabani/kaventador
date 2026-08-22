import { ArrowLeft, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";
import { LogoMark } from "@/components/layout/logo";
import { Card } from "@/components/ui";
import { DEMO_CREDENTIALS } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "ورود",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-12">
      <div
        aria-hidden="true"
        className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
      />

      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <LogoMark className="size-12" />
          <h1 className="mt-4 text-2xl font-black">ورود به پنل مدیریت</h1>
          <p className="text-muted mt-2 text-sm">
            برای مدیریت محتوای کاوِنتادور وارد شوید.
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          <LoginForm />
        </Card>

        {/* اعتبارنامه نمایشی — قبل از استفاده واقعی باید حذف شود. */}
        <div className="border-warning/40 bg-warning-soft mt-5 rounded-xl border p-4">
          <p className="text-warning flex items-center gap-2 text-sm font-bold">
            <TriangleAlert className="size-4 shrink-0" aria-hidden="true" />
            حساب نمایشی
          </p>
          <dl className="text-muted mt-2 space-y-1 text-sm">
            <div className="flex gap-2">
              <dt>ایمیل:</dt>
              <dd dir="ltr" className="font-mono">
                {DEMO_CREDENTIALS.email}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt>رمز عبور:</dt>
              <dd dir="ltr" className="font-mono">
                {DEMO_CREDENTIALS.password}
              </dd>
            </div>
          </dl>
          <p className="text-subtle mt-3 text-xs">
            این احراز هویت ماک‌شده است و امنیت واقعی ندارد. قبل از انتشار باید
            با راهکار واقعی جایگزین شود.
          </p>
        </div>

        <Link
          href="/"
          className="text-muted hover:text-primary focus-visible:outline-ring mt-6 flex items-center justify-center gap-2 rounded text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          بازگشت به سایت
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
