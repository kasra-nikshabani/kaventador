import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

const BASE_STYLES =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium leading-none whitespace-nowrap transition-all duration-200 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[1.15em] [&_svg]:shrink-0";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-soft hover:bg-primary-hover hover:shadow-card active:scale-[0.985]",
  secondary:
    "bg-surface-2 text-foreground border border-border hover:bg-surface-3 hover:border-border-strong active:scale-[0.985]",
  outline:
    "border border-border-strong text-foreground hover:bg-surface-2 hover:border-primary hover:text-primary active:scale-[0.985]",
  ghost: "text-muted hover:bg-surface-2 hover:text-foreground",
  danger:
    "bg-danger text-white shadow-soft hover:brightness-110 active:scale-[0.985]",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
  icon: "size-10",
};

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

/**
 * تولید کلاس‌های دکمه بدون رندر کردن `<button>`.
 * برای وقتی که یک `<Link>` باید ظاهر دکمه داشته باشد.
 */
export function buttonStyles({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: ButtonStyleOptions = {}): string {
  return cn(
    BASE_STYLES,
    VARIANT_STYLES[variant],
    SIZE_STYLES[size],
    fullWidth && "w-full",
    className,
  );
}

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonStyleOptions {
  ref?: Ref<HTMLButtonElement>;
  children?: ReactNode;
}

export function Button({
  variant,
  size,
  fullWidth,
  className,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, fullWidth, className })}
      {...props}
    >
      {children}
    </button>
  );
}
