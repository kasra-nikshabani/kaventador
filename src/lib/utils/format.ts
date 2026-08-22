/**
 * فرمت‌کننده‌های فارسی.
 *
 * قاعده پروژه: هیچ عدد یا تاریخی نباید مستقیم در JSX رندر شود؛
 * همیشه از این توابع عبور کند تا ارقام فارسی و تقویم شمسی یکدست بماند.
 */

const NUMBER_FORMATTER = new Intl.NumberFormat("fa-IR");

const COMPACT_NUMBER_FORMATTER = new Intl.NumberFormat("fa-IR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const DATE_FORMATTER = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const YEAR_FORMATTER = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
});

/** تبدیل ارقام لاتین یک رشته به ارقام فارسی. */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}

/** عدد با جداکننده هزارگان فارسی. مثال: ۱۲٬۴۵۰ */
export function formatNumber(value: number): string {
  return NUMBER_FORMATTER.format(value);
}

/** عدد فشرده برای آمار. مثال: ۱۲٫۵ هزار */
export function formatCompactNumber(value: number): string {
  return COMPACT_NUMBER_FORMATTER.format(value);
}

/** تاریخ شمسی کامل. مثال: ۱۸ مرداد ۱۴۰۵ */
export function formatDate(date: string | Date): string {
  return DATE_FORMATTER.format(new Date(date));
}

/** تاریخ شمسی کوتاه. مثال: ۱۴۰۵/۰۵/۱۸ */
export function formatShortDate(date: string | Date): string {
  return SHORT_DATE_FORMATTER.format(new Date(date));
}

/**
 * فقط سال شمسی. مثال: ۱۴۰۵
 *
 * توجه: خروجی از قبل با ارقام فارسی است. هرگز آن را با `\d` یا `\D`
 * پاک‌سازی نکنید؛ این کلاس‌ها فقط ارقام لاتین را عدد می‌شمارند و
 * ارقام فارسی را کامل حذف می‌کنند.
 */
export function formatJalaliYear(date: string | Date): string {
  return YEAR_FORMATTER.format(new Date(date));
}

/**
 * مدت زمان بر حسب دقیقه به متن خوانا.
 * مثال: ۹۰ → «۱ ساعت و ۳۰ دقیقه»
 */
export function formatDuration(minutes: number): string {
  if (minutes <= 0) return "۰ دقیقه";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${formatNumber(remainingMinutes)} دقیقه`;
  if (remainingMinutes === 0) return `${formatNumber(hours)} ساعت`;

  return `${formatNumber(hours)} ساعت و ${formatNumber(remainingMinutes)} دقیقه`;
}

/** مدت زمان فشرده برای کارت‌ها. مثال: «۱۲ ساعت» */
export function formatCompactDuration(minutes: number): string {
  const hours = Math.round(minutes / 60);
  return hours > 0 ? `${formatNumber(hours)} ساعت` : `${formatNumber(minutes)} دقیقه`;
}

/** امتیاز با یک رقم اعشار فارسی. مثال: ۴٫۸ */
export function formatRating(rating: number): string {
  return toPersianDigits(rating.toFixed(1)).replace(".", "٫");
}

/** زمان مطالعه مقاله. مثال: «۷ دقیقه مطالعه» */
export function formatReadingTime(minutes: number): string {
  return `${formatNumber(minutes)} دقیقه مطالعه`;
}

/** کوتاه کردن متن با حفظ مرز کلمات. */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const sliced = text.slice(0, maxLength);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${lastSpace > 0 ? sliced.slice(0, lastSpace) : sliced}…`;
}
