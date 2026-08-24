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

/**
 * JetBrains Mono — فقط برای بافت‌های فنی: بلوک کد، نام فناوری‌ها،
 * اسلاگ و شناسه. عمداً یک وزن دانلود می‌شود (۹۱ کیلوبایت) چون مونو
 * در این سایت پرکاربرد نیست و وزن دوم ارزش هزینه‌اش را ندارد.
 */
export const jetbrainsMono = localFont({
  src: "../assets/fonts/JetBrainsMono-Regular.woff2",
  variable: "--font-jetbrains",
  weight: "400",
  style: "normal",
  display: "swap",
  /* بارگذاری از پیش لازم نیست؛ مونو در نخستین نقاشی صفحه نقشی ندارد. */
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
  adjustFontFallback: false,
});
