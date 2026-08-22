"use client";

import { Check, Send } from "lucide-react";
import { useState } from "react";
import { Button, Input } from "@/components/ui";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * فرم عضویت در خبرنامه.
 *
 * فعلاً فقط اعتبارسنجی سمت کلاینت انجام می‌شود؛
 * ارسال واقعی در مرحله اتصال داده به Server Action وصل می‌شود.
 */
export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p
        role="status"
        className="text-success bg-success-soft flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
      >
        <Check className="size-4 shrink-0" aria-hidden="true" />
        عضویت شما ثبت شد. به‌زودی تازه‌ترین آموزش‌ها برایتان ارسال می‌شود.
      </p>
    );
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();

        if (!EMAIL_PATTERN.test(email.trim())) {
          setError("لطفاً یک ایمیل معتبر وارد کنید.");
          return;
        }

        setError(null);
        setSubmitted(true);
      }}
      className="space-y-2"
    >
      <label htmlFor="newsletter-email" className="text-muted block text-sm">
        تازه‌ترین دوره‌ها و مقالات را در ایمیلتان دریافت کنید.
      </label>

      <div className="flex gap-2">
        <Input
          id="newsletter-email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="ایمیل شما"
          value={email}
          invalid={Boolean(error)}
          aria-describedby={error ? "newsletter-error" : undefined}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) setError(null);
          }}
        />
        <Button type="submit" size="md" aria-label="عضویت در خبرنامه">
          <Send aria-hidden="true" />
          <span className="hidden sm:inline">عضویت</span>
        </Button>
      </div>

      {error && (
        <p id="newsletter-error" role="alert" className="text-danger text-xs">
          {error}
        </p>
      )}
    </form>
  );
}
