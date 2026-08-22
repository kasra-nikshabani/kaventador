import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLinks } from "@/components/layout/nav-links";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { buttonStyles, Container } from "@/components/ui";

/**
 * هدر اصلی سایت.
 *
 * چسبان و همیشه با پس‌زمینه نیمه‌شفاف و بلور است؛ عمداً هیچ
 * منطق اسکرولی در جاوااسکریپت ندارد تا روی هر رندر هزینه‌ای تحمیل نشود.
 */
export function Header() {
  return (
    <header className="border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur-xl">
      <Container className="flex h-16 items-center gap-4 lg:h-18">
        <Logo />

        <nav aria-label="ناوبری اصلی" className="hidden lg:block">
          <NavLinks />
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/courses"
            className={buttonStyles({ size: "sm", className: "hidden sm:inline-flex" })}
          >
            شروع یادگیری
          </Link>
          <MobileNav className="lg:hidden" />
        </div>
      </Container>
    </header>
  );
}
