import Image from "next/image";
import { cn } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg" | "xl";

const SIZE_STYLES: Record<AvatarSize, string> = {
  sm: "size-9 text-xs",
  md: "size-12 text-sm",
  lg: "size-16 text-lg",
  xl: "size-24 text-2xl",
};

/** اندازه بر حسب پیکسل — برای تولید تصویر با ابعاد درست. */
const SIZE_PIXELS: Record<AvatarSize, number> = {
  sm: 36,
  md: 48,
  lg: 64,
  xl: 96,
};

/** دو حرف اول نام، برای حالت بدون تصویر. */
function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export interface AvatarProps {
  name: string;
  src?: string;
  size?: AvatarSize;
  className?: string;
}

/** آواتار با جانمای حروف اول — تا نبودِ تصویر، کادر خالی نسازد. */
export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  if (src) {
    const pixels = SIZE_PIXELS[size];

    return (
      <Image
        src={src}
        alt={name}
        width={pixels}
        height={pixels}
        /* برای صفحه‌های با تراکم بالا، تصویر دوبرابر درخواست می‌شود. */
        quality={90}
        className={cn(
          "shrink-0 rounded-full object-cover",
          SIZE_STYLES[size],
          className,
        )}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "bg-primary-soft text-primary flex shrink-0 items-center justify-center rounded-full font-bold",
        SIZE_STYLES[size],
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
