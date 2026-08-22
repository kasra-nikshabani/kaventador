import {
  AppWindow,
  Atom,
  Braces,
  Code2,
  Coffee,
  Leaf,
  Triangle,
} from "lucide-react";
import type { CSSProperties } from "react";

export interface CategoryIconProps {
  /** کلید آیکون که در لایه داده ذخیره شده است. */
  icon: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * ترجمه کلید آیکونِ دسته‌بندی به آیکون واقعی.
 *
 * عمداً به‌جای نگاشت `Record<string, LucideIcon>` از switch استفاده شده:
 * نگاشت باعث می‌شود کامپوننت در زمان رندر از یک متغیر ساخته شود و
 * React Compiler به‌درستی به آن ایراد می‌گیرد.
 */
export function CategoryIcon({ icon, className, style }: CategoryIconProps) {
  const props = { className, style, "aria-hidden": true } as const;

  switch (icon) {
    case "coffee":
      return <Coffee {...props} />;
    case "braces":
      return <Braces {...props} />;
    case "app-window":
      return <AppWindow {...props} />;
    case "leaf":
      return <Leaf {...props} />;
    case "atom":
      return <Atom {...props} />;
    case "triangle":
      return <Triangle {...props} />;
    default:
      return <Code2 {...props} />;
  }
}
