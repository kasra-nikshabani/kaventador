import localFont from "next/font/local";

/**
 * وزیرمتن (نسخه variable) — به صورت محلی سرو می‌شود تا هیچ درخواستی
 * به سرویس خارجی زده نشود و CLS صفر بماند.
 */
export const vazirmatn = localFont({
  src: "../assets/fonts/Vazirmatn-Variable.woff2",
  variable: "--font-vazirmatn",
  weight: "100 900",
  style: "normal",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "Segoe UI", "Tahoma", "sans-serif"],
  adjustFontFallback: false,
});
