import { BookOpen, Clock, Mail, MessageSquare } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/contact-form";
import { GithubIcon, TelegramIcon } from "@/components/shared/brand-icons";
import { PageHeader } from "@/components/shared";
import { Card, Container } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { getFounder } from "@/lib/services";

export const metadata: Metadata = {
  title: "تماس با ما",
  description:
    "برای سؤال درباره دوره‌ها، پیشنهاد موضوع، همکاری یا گزارش مشکل فنی با تیم کاوِنتادور در تماس باشید.",
  alternates: { canonical: "/contact" },
};

const FAQ = [
  {
    icon: BookOpen,
    question: "دوره‌ها رایگان‌اند یا پولی؟",
    answer:
      "هر دو. بخشی از دوره‌ها رایگان است و بقیه پولی. قیمت هر دوره در صفحه خودش نوشته شده و درس‌های پیش‌نمایش همیشه رایگان‌اند.",
  },
  {
    icon: MessageSquare,
    question: "می‌توانم موضوع دوره پیشنهاد بدهم؟",
    answer:
      "حتماً. در فرم روبه‌رو موضوع «پیشنهاد موضوع دوره» را انتخاب کنید و بنویسید چه چیزی لازم دارید.",
  },
  {
    icon: Clock,
    question: "چقدر طول می‌کشد پاسخ بگیرم؟",
    answer: "پیام‌ها معمولاً حداکثر تا ۴۸ ساعت کاری بررسی و پاسخ داده می‌شوند.",
  },
];

export default async function ContactPage() {
  const founder = await getFounder();

  return (
    <>
      <PageHeader
        title="تماس با ما"
        description="سؤال، پیشنهاد یا گزارش مشکل دارید؟ بنویسید — همه پیام‌ها خوانده می‌شوند."
        breadcrumb={[{ label: "تماس با ما" }]}
      />

      <Container className="py-14">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* فرم */}
          <div className="lg:col-span-7">
            <h2 className="mb-5 text-xl font-black">ارسال پیام</h2>
            <ContactForm />
          </div>

          {/* راه‌های ارتباطی و پرسش‌های پرتکرار */}
          <aside className="space-y-8 lg:col-span-5">
            <section aria-labelledby="channels-heading">
              <h2 id="channels-heading" className="mb-5 text-xl font-black">
                راه‌های دیگر ارتباط
              </h2>

              <Card className="divide-border divide-y">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:bg-surface-2 focus-visible:outline-ring flex items-center gap-4 p-5 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2"
                >
                  <span className="bg-primary-soft text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
                    <Mail className="size-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-bold">ایمیل</span>
                    <span className="text-muted block text-sm" dir="ltr">
                      {siteConfig.email}
                    </span>
                  </span>
                </a>

                {founder?.socials.github && (
                  <a
                    href={founder.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:bg-surface-2 focus-visible:outline-ring flex items-center gap-4 p-5 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2"
                  >
                    <span className="bg-primary-soft text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
                      <GithubIcon className="size-5" />
                    </span>
                    <span>
                      <span className="block font-bold">گیت‌هاب</span>
                      <span className="text-muted block text-sm" dir="ltr">
                        kasra-nikshabani
                      </span>
                    </span>
                  </a>
                )}

                <a
                  href="https://t.me/kaventador"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:bg-surface-2 focus-visible:outline-ring flex items-center gap-4 p-5 transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2"
                >
                  <span className="bg-primary-soft text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
                    <TelegramIcon className="size-5" />
                  </span>
                  <span>
                    <span className="block font-bold">تلگرام</span>
                    <span className="text-muted block text-sm" dir="ltr">
                      @kaventador
                    </span>
                  </span>
                </a>
              </Card>
            </section>

            <section aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="mb-5 text-xl font-black">
                پرسش‌های پرتکرار
              </h2>

              <div className="space-y-3">
                {FAQ.map((item) => (
                  <Card key={item.question} className="p-5">
                    <div className="flex items-start gap-3">
                      <item.icon
                        className="text-primary mt-0.5 size-5 shrink-0"
                        aria-hidden="true"
                      />
                      <div>
                        <h3 className="text-sm font-bold">{item.question}</h3>
                        <p className="text-muted mt-1.5 text-sm">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <p className="text-muted mt-5 text-sm">
                پاسخ سؤالتان را پیدا نکردید؟{" "}
                <Link
                  href="/about"
                  className="text-primary focus-visible:outline-ring rounded font-medium hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  درباره کاوِنتادور بخوانید
                </Link>
                .
              </p>
            </section>
          </aside>
        </div>
      </Container>
    </>
  );
}
