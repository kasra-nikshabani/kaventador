import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { NewsletterForm } from "@/components/layout/newsletter-form";
import {
  type BrandIcon,
  GithubIcon,
  LinkedinIcon,
  TelegramIcon,
  YoutubeIcon,
} from "@/components/shared/brand-icons";
import { Container } from "@/components/ui";
import { footerNav, siteConfig, socialLinks } from "@/config/site";
import { formatJalaliYear } from "@/lib/utils";

const SOCIAL_ICONS: Record<string, BrandIcon> = {
  github: GithubIcon,
  telegram: TelegramIcon,
  youtube: YoutubeIcon,
  linkedin: LinkedinIcon,
};

export function Footer() {
  /* خروجی این فرمت‌کننده از قبل با ارقام فارسی است؛
     پاک‌سازی با \d ممنوع است چون ارقام فارسی را غیرعدد می‌شمارد. */
  const year = formatJalaliYear(new Date());

  return (
    <footer className="border-border bg-surface mt-24 border-t">
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* معرفی برند */}
          <div className="space-y-4 lg:col-span-4">
            <Logo />
            <p className="text-muted max-w-sm text-sm">{siteConfig.description}</p>
            <ul className="flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = SOCIAL_ICONS[social.id];

                return (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      title={social.label}
                      className="border-border text-muted hover:border-primary hover:text-primary focus-visible:outline-ring flex size-10 items-center justify-center rounded-xl border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      <Icon />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ستون‌های لینک */}
          {footerNav.map((group) => (
            <nav key={group.title} aria-label={group.title} className="lg:col-span-2">
              <h2 className="text-foreground mb-4 text-sm font-bold">{group.title}</h2>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-muted hover:text-primary focus-visible:outline-ring rounded text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {/* خبرنامه */}
          <div className="lg:col-span-4">
            <h2 className="text-foreground mb-4 text-sm font-bold">خبرنامه</h2>
            <NewsletterForm />
          </div>
        </div>

        <div className="border-border mt-12 flex flex-col items-center justify-between gap-3 border-t pt-6 sm:flex-row">
          <p className="text-subtle text-xs">
            © {year} {siteConfig.name} — تمامی حقوق محفوظ است.
          </p>
          <p className="text-subtle text-xs">
            ساخته شده با ❤️ برای جامعه برنامه‌نویسان فارسی‌زبان
          </p>
        </div>
      </Container>
    </footer>
  );
}
