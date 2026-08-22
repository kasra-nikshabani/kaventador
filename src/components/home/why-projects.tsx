import { GitBranch, Layers, Rocket, Target } from "lucide-react";
import { SectionHeading } from "@/components/shared";
import { Card, Container } from "@/components/ui";

const PILLARS = [
  {
    icon: Target,
    title: "هر دوره یک هدف مشخص دارد",
    description:
      "قبل از شروع دقیقاً می‌دانید در پایان چه چیزی می‌توانید بسازید. بدون سرفصل‌های تزئینی.",
  },
  {
    icon: Layers,
    title: "مفهوم، بلافاصله بعد از تمرین",
    description:
      "هر مفهوم تازه در همان فصل روی کد واقعی پیاده می‌شود؛ یادگیری در حافظه می‌ماند چون به کار رفته.",
  },
  {
    icon: GitBranch,
    title: "کد نهایی، قابل ارائه",
    description:
      "پروژه‌ها با ساختار حرفه‌ای، تست و مستندسازی ساخته می‌شوند تا مستقیم به نمونه‌کار شما اضافه شوند.",
  },
  {
    icon: Rocket,
    title: "مسیر پیوسته، نه دوره‌های پراکنده",
    description:
      "دوره‌ها به هم وصل‌اند: از مبانی زبان تا استقرار محصول، بدون شکاف و بدون تکرار اضافه.",
  },
];

export function WhyProjects() {
  return (
    <section aria-labelledby="why-projects-heading" className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          align="center"
          headingId="why-projects-heading"
          eyebrow="روش کاوِنتادور"
          title="چرا یادگیری پروژه‌محور؟"
          description="تفاوت کسی که صد ساعت ویدیو دیده با کسی که سه پروژه ساخته، در دانش نیست؛ در توانایی است."
          className="mb-12"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => (
            <Card key={pillar.title} className="p-6">
              <span className="bg-primary-soft text-primary mb-4 flex size-12 items-center justify-center rounded-xl">
                <pillar.icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="font-bold">{pillar.title}</h3>
              <p className="text-muted mt-2 text-sm">{pillar.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
