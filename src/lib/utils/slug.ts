/**
 * ساخت اسلاگ امن برای URL از متن فارسی یا انگلیسی.
 * حروف فارسی حفظ می‌شوند چون مرورگرها آن‌ها را درست encode می‌کنند.
 */
export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    /* نیم‌فاصله و فاصله‌های متوالی → خط تیره */
    .replace(/[\s‌]+/g, "-")
    /* حذف هر چیزی جز حروف فارسی، لاتین، عدد و خط تیره */
    .replace(/[^؀-ۿݐ-ݿa-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
