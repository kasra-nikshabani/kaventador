import {
  ArrowLeft,
  Building2,
  Code2,
  GitBranch,
  Layers,
  Rocket,
  Target,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GithubIcon } from "@/components/shared/brand-icons";
import { JsonLd, PageHeader, SectionHeading } from "@/components/shared";
import { Avatar, Badge, buttonStyles, Card, Container } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { organizationJsonLd } from "@/lib/seo/json-ld";
import { getFounder, getPlatformStats } from "@/lib/services";
import { formatCompactNumber, formatNumber, formatRating } from "@/lib/utils";

export const metadata: Metadata = {
  title: "درباره ما",
  description:
    "کاوِنتادور را کسری نیک‌شعبانی ساخته است؛ توسعه‌دهنده فول‌استک با هفت سال تجربه ساخت سامانه‌های پرترافیک. هدف: انتقال تجربه پروژه واقعی به فارسی‌زبان‌ها.",
  alternates: { canonical: "/about" },
};

/** پشته فناوری‌ای که پلتفرم و دوره‌ها بر پایه آن ساخته شده‌اند. */
const TECH_STACK = [
  { group: "بک‌اند", items: ["Java", "Spring Boot", "Python", "Django", "FastAPI", "Node.js"] },
  { group: "فرانت‌اند", items: ["React", "Next.js", "React Native", "TypeScript", "Tailwind CSS"] },
  { group: "داده و زیرساخت", items: ["PostgreSQL", "Redis", "Elasticsearch", "RabbitMQ", "Docker", "Linux"] },
];

const PRINCIPLES = [
  {
    icon: Target,
    title: "آموزش از دل پروژه واقعی",
    description:
      "هر چیزی که در کاوِنتادور تدریس می‌شود، قبلاً در یک سامانه واقعی و زیر بار کاربر واقعی استفاده شده است.",
  },
  {
    icon: Layers,
    title: "عمق به‌جای پوشش سطحی",
    description:
      "به‌جای مرور شتاب‌زده ده فناوری، یک فناوری را تا جایی پیش می‌بریم که بتوانید با آن تصمیم معماری بگیرید.",
  },
  {
    icon: GitBranch,
    title: "کد قابل ارائه، نه کد کلاسی",
    description:
      "پروژه‌ها با ساختار حرفه‌ای، تست و مستندسازی ساخته می‌شوند تا مستقیم به نمونه‌کار شما اضافه شوند.",
  },
  {
    icon: Rocket,
    title: "رایگان و بدون قفل",
    description:
      "هیچ دوره‌ای پولی نیست و هیچ محتوایی پشت ثبت‌نام اجباری قفل نمی‌شود.",
  },
];

/** پروژه‌های شاخصی که تجربه پشت دوره‌ها را ساخته‌اند. */
const BACKGROUND_PROJECTS = [
  {
    icon: Building2,
    title: "سپ‌اپ — سوپر اپلیکیشن باشگاه سپاهان",
    description:
      "معماری و توسعه اپلیکیشنی که هشت حوزه سرویس — بانکداری، بیمه، سفر، بلیت، خرده‌فروشی، کیف پول، فروشگاه و پخش ویدیو — را پشت یک احراز هویت یکپارچه جمع کرد.",
    stack: ["Spring Boot", "React Native", "SSO"],
  },
  {
    icon: Users,
    title: "سامانه فروش بلیت مسابقات",
    description:
      "پلتفرم فروش بلیت با تحمل حدود ۲٬۰۰۰ درخواست در دقیقه در اوج فروش و بدون درخواست ناموفق، برای پایگاه کاربری حدود ۳۰٬۰۰۰ هوادار ثبت‌نام‌شده.",
    stack: ["Django", "RabbitMQ", "Redis"],
  },
  {
    icon: Code2,
    title: "پلتفرم‌های تجارت الکترونیک و موزه دیجیتال",
    description:
      "ساخت فروشگاه‌های اینترنتی کامل با پنل مدیریت، کنترل دسترسی سه‌سطحی، درگاه‌های پرداخت ایرانی و مدیریت محتوا.",
    stack: ["Next.js", "TypeScript", "PostgreSQL"],
  },
];

export default async function AboutPage() {
  const [stats, founder] = await Promise.all([
    getPlatformStats(),
    getFounder(),
  ]);

  const platformStats = [
    { value: formatNumber(stats.courseCount), label: "دوره منتشرشده" },
    { value: formatCompactNumber(stats.studentCount), label: "دانشجو" },
    { value: formatNumber(stats.totalHours), label: "ساعت آموزش" },
    { value: formatRating(stats.averageRating), label: "میانگین امتیاز" },
  ];

  return (
    <>
      <JsonLd data={organizationJsonLd()} />

      <PageHeader
        title="درباره کاوِنتادور"
        description="یک پلتفرم آموزشی که از دل هفت سال ساختن نرم‌افزار واقعی بیرون آمده، نه از دل خواندن کتاب."
        breadcrumb={[{ label: "درباره ما" }]}
      />

      <Container width="md" className="py-14">
        {/* داستان */}
        <section aria-labelledby="story-heading">
          <h2 id="story-heading" className="text-2xl font-black">
            چرا کاوِنتادور ساخته شد
          </h2>
          <div className="text-muted mt-5 space-y-5 leading-9">
            <p>
              بیشتر محتوای فارسی برنامه‌نویسی یکی از دو مشکل را دارد: یا ترجمه
              مستقیم و بی‌روح منابع انگلیسی است، یا آن‌قدر سطحی است که بعد از
              تمام‌شدن دوره، هنوز نمی‌دانید چطور یک پروژه واقعی را از صفر شروع
              کنید.
            </p>
            <p>
              کاوِنتادور از یک مشاهده ساده شروع شد: فاصله بین «بلد بودن سینتکس»
              و «توانستن ساختن محصول» خیلی بیشتر از چیزی است که دوره‌ها نشان
              می‌دهند. آن فاصله را فقط ساختن پر می‌کند — ساختن چیزی که خراب
              می‌شود، دیباگ می‌خواهد و باید تصمیم معماری برایش گرفت.
            </p>
            <p>
              پس هر دوره اینجا با یک پروژه تمام می‌شود. نه پروژه تمرینی، بلکه
              چیزی که بشود در نمونه‌کار گذاشت و درباره تصمیم‌هایش در مصاحبه
              حرف زد.
            </p>
          </div>
        </section>

        {/* آمار */}
        <section aria-label="آمار پلتفرم" className="mt-12">
          <Card className="grid grid-cols-2 gap-6 p-6 lg:grid-cols-4">
            {platformStats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-black">{stat.value}</p>
                <p className="text-muted text-sm">{stat.label}</p>
              </div>
            ))}
          </Card>
        </section>

        {/* بنیان‌گذار */}
        {founder && (
          <section aria-labelledby="founder-heading" className="mt-16">
            <h2 id="founder-heading" className="mb-5 text-2xl font-black">
              بنیان‌گذار
            </h2>

            <Card className="overflow-hidden">
              {/* پرتره استودیویی به‌عنوان بنر کارت */}
              <div className="relative aspect-[1000/671] w-full">
                <Image
                  src="/images/founder/portrait.jpg"
                  alt={`پرتره ${founder.name}`}
                  fill
                  sizes="(min-width: 1024px) 42rem, 100vw"
                  priority
                  className="object-cover object-top"
                />
              </div>

              <div className="p-6">
              <div className="flex flex-wrap items-center gap-5">
                <Avatar
                  name={founder.name}
                  src={founder.avatar || undefined}
                  size="lg"
                />
                <div className="flex-1">
                  <p className="text-lg font-bold">{founder.name}</p>
                  <p className="text-muted text-sm">{founder.role}</p>
                </div>
                {founder.socials.github && (
                  <a
                    href={founder.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${founder.name} در گیت‌هاب`}
                    className="border-border text-muted hover:border-primary hover:text-primary focus-visible:outline-ring flex size-10 items-center justify-center rounded-xl border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    <GithubIcon className="size-[1.15rem]" />
                  </a>
                )}
              </div>

              <p className="text-muted mt-5 leading-9">{founder.bio}</p>

              <div className="border-border mt-6 space-y-4 border-t pt-5">
                {TECH_STACK.map((group) => (
                  <div key={group.group} className="flex flex-wrap items-center gap-2">
                    <span className="text-subtle w-32 shrink-0 text-xs font-bold">
                      {group.group}
                    </span>
                    <ul className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <li key={item}>
                          <Badge variant="neutral" className="font-mono" dir="ltr">
                            {item}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              </div>
            </Card>
          </section>
        )}

        {/* پیشینه */}
        <section aria-labelledby="background-heading" className="mt-16">
          <h2 id="background-heading" className="text-2xl font-black">
            تجربه‌ای که پشت دوره‌هاست
          </h2>
          <p className="text-muted mt-3">
            محتوای کاوِنتادور از این پروژه‌ها بیرون آمده، نه از خلاصه‌برداری
            مستندات.
          </p>

          <div className="mt-6 grid gap-5 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              {BACKGROUND_PROJECTS.map((project) => (
                <Card key={project.title} className="p-5">
                  <div className="flex items-start gap-4">
                    <span className="bg-primary-soft text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
                      <project.icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-bold">{project.title}</h3>
                      <p className="text-muted mt-1.5 text-sm leading-7">
                        {project.description}
                      </p>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {project.stack.map((tech) => (
                          <li key={tech}>
                            <Badge variant="outline" dir="ltr">
                              {tech}
                            </Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* عکس سخنرانی — نشان می‌دهد این تجربه، تجربه ارائه‌شده است */}
            <figure className="lg:col-span-4">
              <div className="border-border relative aspect-[3/4] overflow-hidden rounded-2xl border">
                <Image
                  src="/images/founder/speaking.jpg"
                  alt={`${founder?.name ?? "بنیان‌گذار کاوِنتادور"} در حال ارائه`}
                  fill
                  sizes="(min-width: 1024px) 14rem, 100vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="text-subtle mt-3 text-xs">
                ارائه در رویداد فناوری — تجربه‌ای که پشت روش آموزشی کاوِنتادور
                است.
              </figcaption>
            </figure>
          </div>
        </section>
      </Container>

      {/* اصول */}
      <section
        aria-labelledby="principles-heading"
        className="border-border bg-surface border-y py-16"
      >
        <Container>
          <SectionHeading
            align="center"
            headingId="principles-heading"
            eyebrow="روش کار"
            title="چهار اصلی که تغییر نمی‌کنند"
            className="mb-10"
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((principle) => (
              <Card key={principle.title} className="p-6">
                <span className="bg-primary-soft text-primary mb-4 flex size-12 items-center justify-center rounded-xl">
                  <principle.icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="font-bold">{principle.title}</h3>
                <p className="text-muted mt-2 text-sm">{principle.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* دعوت به اقدام */}
      <Container className="py-16 text-center">
        <h2 className="text-2xl font-black">سؤالی دارید؟</h2>
        <p className="text-muted mx-auto mt-3 max-w-lg">
          برای همکاری، پیشنهاد موضوع دوره یا هر سؤال دیگری، پیام بدهید.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link href="/contact" className={buttonStyles({ size: "lg" })}>
            تماس با ما
            <ArrowLeft aria-hidden="true" />
          </Link>
          <Link
            href="/courses"
            className={buttonStyles({ variant: "outline", size: "lg" })}
          >
            مشاهده دوره‌ها
          </Link>
        </div>
        <p className="text-subtle mt-6 text-sm" dir="ltr">
          {siteConfig.email}
        </p>
      </Container>
    </>
  );
}
