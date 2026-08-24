import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/account/login-form";
import { LogoMark } from "@/components/layout/logo";
import { Card, Container } from "@/components/ui";
import { getSession } from "@/lib/auth/session";
import type { RawSearchParams } from "@/lib/utils/query";

export const metadata: Metadata = {
  title: "ورود",
  description: "ورود به حساب کاربری کاوِنتادور با نام کاربری و رمز عبور.",
  robots: { index: false, follow: true },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  /* کاربر واردشده نباید صفحه ورود را ببیند. */
  if (await getSession()) redirect("/");

  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : undefined;

  return (
    <Container width="sm" className="py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <LogoMark className="size-12" />
          <h1 className="mt-4 text-2xl font-black">ورود به حساب</h1>
          <p className="text-muted mt-2 text-sm">
            با نام کاربری و رمز عبور خود وارد شوید.
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          <LoginForm next={next} />
        </Card>

        <p className="text-muted mt-6 text-center text-sm">
          هنوز حساب ندارید؟{" "}
          <Link
            href="/signup"
            className="text-primary focus-visible:outline-ring rounded font-medium hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            ثبت‌نام کنید
          </Link>
        </p>
      </div>
    </Container>
  );
}
