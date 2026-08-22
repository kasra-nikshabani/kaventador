"use client";

import { CircleAlert, CircleCheck, Send } from "lucide-react";
import { useActionState } from "react";
import {
  Button,
  Card,
  Field,
  Input,
  Select,
  Textarea,
} from "@/components/ui";
import { submitContactForm } from "@/lib/actions/contact";
import { CONTACT_INITIAL_STATE } from "@/lib/actions/contact.schema";

const SUBJECTS = [
  { value: "question", label: "سؤال درباره دوره‌ها" },
  { value: "cooperation", label: "همکاری و تدریس" },
  { value: "suggestion", label: "پیشنهاد موضوع دوره" },
  { value: "bug", label: "گزارش مشکل فنی" },
  { value: "other", label: "سایر" },
];

/**
 * فرم تماس.
 *
 * اعتبارسنجی روی سرور انجام می‌شود (Server Action + zod) تا حتی با
 * جاوااسکریپت غیرفعال یا درخواست دستکاری‌شده هم معتبر بماند.
 */
export function ContactForm() {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    CONTACT_INITIAL_STATE,
  );

  if (state.status === "success") {
    return (
      <Card className="p-8 text-center">
        <span className="bg-success-soft text-success mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl">
          <CircleCheck className="size-7" aria-hidden="true" />
        </span>
        <h2 className="text-lg font-bold">پیام شما ارسال شد</h2>
        <p className="text-muted mt-2 text-sm" role="status">
          {state.message}
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-8">
      <form action={formAction} className="space-y-5" noValidate>
        {state.status === "error" && state.message && (
          <p
            role="alert"
            className="text-danger bg-danger-soft flex items-center gap-2 rounded-xl px-4 py-3 text-sm"
          >
            <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
            {state.message}
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="نام و نام خانوادگی"
            htmlFor="contact-name"
            required
            error={state.errors?.name}
          >
            <Input
              id="contact-name"
              name="name"
              autoComplete="name"
              placeholder="مثلاً: سارا محمدی"
              defaultValue={state.values?.name}
              invalid={Boolean(state.errors?.name)}
              aria-describedby={
                state.errors?.name ? "contact-name-error" : undefined
              }
            />
          </Field>

          <Field
            label="ایمیل"
            htmlFor="contact-email"
            required
            error={state.errors?.email}
          >
            <Input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              defaultValue={state.values?.email}
              invalid={Boolean(state.errors?.email)}
              aria-describedby={
                state.errors?.email ? "contact-email-error" : undefined
              }
            />
          </Field>
        </div>

        <Field
          label="موضوع"
          htmlFor="contact-subject"
          required
          error={state.errors?.subject}
        >
          <Select
            id="contact-subject"
            name="subject"
            defaultValue={state.values?.subject ?? ""}
            aria-describedby={
              state.errors?.subject ? "contact-subject-error" : undefined
            }
          >
            <option value="" disabled>
              انتخاب کنید…
            </option>
            {SUBJECTS.map((subject) => (
              <option key={subject.value} value={subject.value}>
                {subject.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label="پیام"
          htmlFor="contact-message"
          required
          hint="دست‌کم ۲۰ نویسه بنویسید تا بتوانیم دقیق پاسخ دهیم."
          error={state.errors?.message}
        >
          <Textarea
            id="contact-message"
            name="message"
            rows={6}
            placeholder="پیام خود را بنویسید…"
            defaultValue={state.values?.message}
            invalid={Boolean(state.errors?.message)}
            aria-describedby={
              state.errors?.message
                ? "contact-message-error"
                : "contact-message-hint"
            }
          />
        </Field>

        {/* تله ربات — از دید کاربر و صفحه‌خوان پنهان است. */}
        <div aria-hidden="true" className="hidden">
          <label htmlFor="contact-website">این فیلد را خالی بگذارید</label>
          <input
            id="contact-website"
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <Button type="submit" size="lg" fullWidth disabled={isPending}>
          <Send aria-hidden="true" />
          {isPending ? "در حال ارسال…" : "ارسال پیام"}
        </Button>
      </form>
    </Card>
  );
}
