import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerWidth = "sm" | "md" | "lg" | "full";

const WIDTH_STYLES: Record<ContainerWidth, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  full: "max-w-none",
};

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  /** تگ خروجی — برای حفظ HTML معنایی (section, main, header, ...). */
  as?: ElementType;
  width?: ContainerWidth;
  children?: ReactNode;
}

/** پوشش عرض‌محدود و پدینگ افقی یکسان در کل سایت. */
export function Container({
  as: Tag = "div",
  width = "lg",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", WIDTH_STYLES[width], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
