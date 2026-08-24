import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/account/signup-form";
import { LogoMark } from "@/components/layout/logo";
import { Card, Container } from "@/components/ui";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "ثبت‌نام",
  description:
    "ساخت حساب کاربری رایگان در کاوِنتادور برای دسترسی به دوره‌های پروژه‌محور برنامه‌نویسی.",
  alternates: { canonical: "/signup" },
};

export default async function SignupPage() {
  if (await getSession()) redirect("/");

  return (
    <Container width="sm" className="py-16">
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-8 flex flex-col items-center text-center">
          <LogoMark className="size-12" />
          <h1 className="mt-4 text-2xl font-black">ساخت حساب کاربری</h1>
          <p className="text-muted mt-2 text-sm">
            ثبت‌نام رایگان است و برای دسترسی به دوره‌ها لازم است.
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          <SignupForm />
        </Card>

        <p className="text-muted mt-6 text-center text-sm">
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link
            href="/login"
            className="text-primary focus-visible:outline-ring rounded font-medium hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            وارد شوید
          </Link>
        </p>
      </div>
    </Container>
  );
}
