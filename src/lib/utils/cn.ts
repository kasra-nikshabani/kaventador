import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * ترکیب کلاس‌های شرطی + حل تعارض کلاس‌های Tailwind.
 * تنها راه مجاز برای ساخت رشته کلاس در کامپوننت‌هاست.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
