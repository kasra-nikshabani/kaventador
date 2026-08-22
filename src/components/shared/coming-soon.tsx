import { Hammer } from "lucide-react";
import Link from "next/link";
import { buttonStyles, Container, EmptyState } from "@/components/ui";

/**
 * ⚠️ کامپوننت موقت داربستی.
 * صفحاتی که هنوز ساخته نشده‌اند از این استفاده می‌کنند تا لینک‌های
 * ناوبری به ۴۰۴ نخورند. با تکمیل هر صفحه حذف می‌شود.
 */
export function ComingSoon({ section }: { section: string }) {
  return (
    <Container className="py-16">
      <EmptyState
        icon={Hammer}
        as="h2"
        title={`${section} در حال ساخت است`}
        description="این بخش در مراحل بعدی توسعه تکمیل می‌شود. فعلاً می‌توانید به صفحه اصلی برگردید."
        action={
          <Link href="/" className={buttonStyles({ variant: "outline" })}>
            بازگشت به صفحه اصلی
          </Link>
        }
      />
    </Container>
  );
}
