import { Logo } from "@/components/layout/logo";
import { MobileNav } from "@/components/layout/mobile-nav";
import { NavLinks } from "@/components/layout/nav-links";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { Container } from "@/components/ui";
import { getCurrentUser, getSession } from "@/lib/auth/session";

/**
 * هدر اصلی سایت.
 *
 * چسبان و همیشه با پس‌زمینه نیمه‌شفاف و بلور است؛ عمداً هیچ
 * منطق اسکرولی در جاوااسکریپت ندارد تا روی هر رندر هزینه‌ای تحمیل نشود.
 */
export async function Header() {
  const [session, user] = await Promise.all([getSession(), getCurrentUser()]);

  return (
    <header className="border-border bg-background/80 sticky top-0 z-50 border-b backdrop-blur-xl">
      <Container className="flex h-16 items-center gap-4 lg:h-18">
        <Logo />

        <nav aria-label="ناوبری اصلی" className="hidden lg:block">
          <NavLinks />
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <ThemeToggle />
          <UserMenu session={session} avatar={user?.avatar} />
          <MobileNav className="lg:hidden" />
        </div>
      </Container>
    </header>
  );
}
