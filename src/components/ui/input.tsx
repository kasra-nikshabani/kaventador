import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  Ref,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

const FIELD_STYLES =
  "w-full rounded-xl border border-border bg-surface px-4 text-sm text-foreground transition-colors placeholder:text-subtle hover:border-border-strong focus:border-primary focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-60";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>;
  invalid?: boolean;
}

export function Input({ className, invalid, ...props }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(FIELD_STYLES, "h-11", invalid && "border-danger", className)}
      {...props}
    />
  );
}

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: Ref<HTMLTextAreaElement>;
  invalid?: boolean;
}

export function Textarea({ className, invalid, ...props }: TextareaProps) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(
        FIELD_STYLES,
        "min-h-28 resize-y py-3 leading-relaxed",
        invalid && "border-danger",
        className,
      )}
      {...props}
    />
  );
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  ref?: Ref<HTMLSelectElement>;
  children?: ReactNode;
}

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(FIELD_STYLES, "h-11 cursor-pointer pe-9 appearance-none", className)}
      {...props}
    >
      {children}
    </select>
  );
}

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children?: ReactNode;
}

export function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <label
      className={cn("text-foreground block text-sm font-medium", className)}
      {...props}
    >
      {children}
      {required && (
        <span className="text-danger ms-1" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

export interface FieldProps {
  label: string;
  htmlFor: string;
  /** پیام خطای اعتبارسنجی — با aria-describedby به فیلد وصل می‌شود. */
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}

/** چیدمان استاندارد یک فیلد فرم: برچسب + ورودی + راهنما/خطا. */
export function Field({
  label,
  htmlFor,
  error,
  hint,
  required,
  children,
}: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {children}
      {hint && !error && (
        <p id={`${htmlFor}-hint`} className="text-subtle text-xs">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} className="text-danger text-xs" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
