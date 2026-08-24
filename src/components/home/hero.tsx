import { ArrowLeft, CircleCheck, Terminal } from "lucide-react";
import Link from "next/link";
import { buttonStyles, Container } from "@/components/ui";

const HIGHLIGHTS = [
  "دوره‌های رایگان و حرفه‌ای",
  "خروجی هر دوره یک پروژه واقعی",
  "به زبان فارسی و بدون ترجمه ماشینی",
];

/** پشته‌ای که در نوار ترمینال هیرو نشان داده می‌شود. */
const STACK = ["java", "spring", "javascript", "react", "next.js"];

export function Hero() {
  return (
    <section className="border-border relative overflow-hidden border-b">
      <div
        aria-hidden="true"
        className="bg-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"
      />
      <div
        aria-hidden="true"
        className="bg-primary/10 pointer-events-none absolute -top-40 start-1/4 size-96 rounded-full blur-3xl"
      />
      {/* بافت CRT بسیار ظریف — فقط روی لایه تزئینی، نه روی متن */}
      <div
        aria-hidden="true"
        className="scanlines pointer-events-none absolute inset-0 opacity-40"
      />

      <Container className="relative py-20 text-center sm:py-28">
        <p className="border-border bg-surface text-muted mx-auto inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm">
          <Terminal className="text-primary size-4" aria-hidden="true" />
          آموزش پروژه‌محور برنامه‌نویسی
        </p>

        <h1 className="mx-auto mt-6 max-w-3xl text-4xl leading-tight font-black sm:text-5xl lg:text-6xl">
          برنامه‌نویسی را با <span className="text-gradient">ساختن</span> یاد
          بگیرید، نه با تماشا کردن
        </h1>

        <p className="text-muted mx-auto mt-6 max-w-2xl text-lg">
          کاوِنتادور مسیرهای یادگیری جاوا، اسپرینگ، جاوااسکریپت، ری‌اکت و
          نکست‌جی‌اس را طوری چیده که خروجی هر دوره، یک پروژه واقعی و قابل ارائه
          باشد.
        </p>

        {/* نوار ترمینال — لهجه فنی بدون افتادن به کلیشه */}
        <div
          className="border-border bg-surface shadow-card mx-auto mt-9 max-w-lg overflow-hidden rounded-xl border text-start"
          aria-hidden="true"
        >
          <div className="border-border bg-surface-2 flex items-center gap-1.5 border-b px-3 py-2">
            <span className="bg-danger size-2.5 rounded-full" />
            <span className="bg-warning size-2.5 rounded-full" />
            <span className="bg-success size-2.5 rounded-full" />
            <span className="text-subtle ms-2 font-mono text-xs" dir="ltr">
              kaventador — learn
            </span>
          </div>
          <p
            dir="ltr"
            className="terminal-prompt text-muted overflow-x-auto px-4 py-3 font-mono text-sm whitespace-nowrap"
          >
            <span className="text-foreground">learn</span>{" "}
            {STACK.join(" ")}
            <span className="terminal-cursor motion-reduce:animate-none ms-1" />
          </p>
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link href="/courses" className={buttonStyles({ size: "lg" })}>
            شروع یادگیری
            <ArrowLeft aria-hidden="true" />
          </Link>
          <Link
            href="/categories"
            className={buttonStyles({ variant: "outline", size: "lg" })}
          >
            مرور مسیرها
          </Link>
        </div>

        <ul className="text-muted mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          {HIGHLIGHTS.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <CircleCheck className="text-success size-4" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
