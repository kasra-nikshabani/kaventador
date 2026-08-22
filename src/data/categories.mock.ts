import type { Category } from "@/types";

/**
 * دسته‌بندی‌های فناوری.
 *
 * `icon` یک کلید است، نه کامپوننت — لایه داده نباید به React وابسته شود.
 * نگاشت کلید به آیکون در `lib/constants/icons.ts` انجام می‌شود.
 */
export const categoriesMock: Category[] = [
  {
    id: "cat-java",
    slug: "java",
    title: "جاوا",
    titleEn: "Java",
    description:
      "زبان اصلی نرم‌افزارهای سازمانی و اندروید؛ نقطه شروع محکم برای یادگیری شیءگرایی و ساختار داده.",
    icon: "coffee",
    color: "#E76F00",
    order: 1,
  },
  {
    id: "cat-javascript",
    slug: "javascript",
    title: "جاوااسکریپت",
    titleEn: "JavaScript",
    description:
      "زبان وب. از مفاهیم پایه تا ناهمگامی، ماژول‌ها و ابزارهای مدرن توسعه.",
    icon: "braces",
    color: "#F7DF1E",
    order: 2,
  },
  {
    id: "cat-javafx",
    slug: "javafx",
    title: "جاوا‌اف‌ایکس",
    titleEn: "JavaFX",
    description:
      "ساخت نرم‌افزار دسکتاپ حرفه‌ای با جاوا؛ رابط کاربری، انیمیشن و معماری MVVM.",
    icon: "app-window",
    color: "#5382A1",
    order: 3,
  },
  {
    id: "cat-spring",
    slug: "spring",
    title: "اسپرینگ",
    titleEn: "Spring",
    description:
      "پرکاربردترین فریم‌ورک بک‌اند جاوا؛ ساخت API، امنیت، دیتابیس و میکروسرویس.",
    icon: "leaf",
    color: "#6DB33F",
    order: 4,
  },
  {
    id: "cat-react",
    slug: "react",
    title: "ری‌اکت",
    titleEn: "React",
    description:
      "کتابخانه ساخت رابط کاربری؛ کامپوننت، state، هوک‌ها و الگوهای واقعی پروژه.",
    icon: "atom",
    color: "#61DAFB",
    order: 5,
  },
  {
    id: "cat-nextjs",
    slug: "nextjs",
    title: "نکست‌جی‌اس",
    titleEn: "Next.js",
    description:
      "فریم‌ورک فول‌استک ری‌اکت؛ رندر سمت سرور، مسیریابی، SEO و استقرار محصول.",
    icon: "triangle",
    color: "#8B93A7",
    order: 6,
  },
];
