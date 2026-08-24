import { publicEnv } from "@/config/env";

/**
 * پیکربندی مرکزی برند و سایت.
 * هر متنی که در چند جای سایت تکرار می‌شود باید از اینجا بیاید.
 */

export const siteConfig = {
  name: "کاوِنتادور",
  nameEn: "Kaventador",
  tagline: "یادگیری برنامه‌نویسی، پروژه‌محور",
  description:
    "کاوِنتادور پلتفرم آموزش پروژه‌محور برنامه‌نویسی به زبان فارسی است؛ آموزش حرفه‌ای جاوا، جاوااسکریپت، JavaFX، اسپرینگ، ری‌اکت و نکست‌جی‌اس با تمرکز بر ساخت پروژه‌های واقعی.",
  /* از متغیر محیطی می‌آید تا در هر محیط درست باشد؛
     مقدار پیش‌فرض فقط برای توسعه محلی است. */
  url: publicEnv.NEXT_PUBLIC_SITE_URL,
  locale: "fa_IR",
  direction: "rtl",
  email: publicEnv.NEXT_PUBLIC_CONTACT_EMAIL,
  keywords: [
    "آموزش برنامه نویسی",
    "آموزش جاوا",
    "آموزش جاوااسکریپت",
    "آموزش اسپرینگ",
    "آموزش ری اکت",
    "آموزش نکست جی اس",
    "دوره پروژه محور",
    "دوره رایگان برنامه نویسی",
  ],
} as const;

/** لینک‌های شبکه‌های اجتماعی — در فوتر و صفحه تماس استفاده می‌شود. */
export const socialLinks = [
  { id: "github", label: "گیت‌هاب", href: "https://github.com/kaventador" },
  { id: "telegram", label: "تلگرام", href: "https://t.me/kaventador" },
  { id: "youtube", label: "یوتیوب", href: "https://youtube.com/@kaventador" },
  { id: "linkedin", label: "لینکدین", href: "https://linkedin.com/company/kaventador" },
] as const;

/** منوی اصلی سایت. */
export const mainNav = [
  { label: "خانه", href: "/" },
  { label: "دوره‌ها", href: "/courses" },
  { label: "دسته‌بندی‌ها", href: "/categories" },
  { label: "مقالات", href: "/blog" },
  { label: "درباره ما", href: "/about" },
  { label: "تماس با ما", href: "/contact" },
] as const;

/** لینک‌های فوتر، گروه‌بندی‌شده. */
export const footerNav = [
  {
    title: "یادگیری",
    links: [
      { label: "همه دوره‌ها", href: "/courses" },
      { label: "دسته‌بندی‌ها", href: "/categories" },
      { label: "مقالات آموزشی", href: "/blog" },
    ],
  },
  {
    title: "کاوِنتادور",
    links: [
      { label: "درباره ما", href: "/about" },
      { label: "تماس با ما", href: "/contact" },
    ],
  },
] as const;

export type NavItem = (typeof mainNav)[number];
