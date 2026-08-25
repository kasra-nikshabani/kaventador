"use client";

import { CircleCheck, LogIn, PlayCircle, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { Button, buttonStyles } from "@/components/ui";
import { enrollAction } from "@/lib/actions/learning";
import { LEARNING_INITIAL_STATE } from "@/lib/actions/learning.schema";
import type { CoursePricing, EnrollmentStatus } from "@/types";

export interface EnrollButtonProps {
  courseId: string;
  courseSlug: string;
  pricing: CoursePricing;
  /** اگر کاربر وارد نشده باشد undefined است. */
  enrollmentStatus?: EnrollmentStatus;
  isLoggedIn: boolean;
}

/**
 * دکمه ثبت‌نام در دوره.
 *
 * چهار حالت دارد و هر کدام کار متفاوتی می‌کند:
 *  • وارد نشده     → به صفحه ورود با بازگشت به همین دوره
 *  • ثبت‌نام نکرده  → ثبت‌نام (رایگان یا پولی)
 *  • در انتظار پرداخت → پیام وضعیت، بدون دسترسی به درس‌ها
 *  • فعال          → رفتن به صفحه یادگیری
 */
export function EnrollButton({
  courseId,
  courseSlug,
  pricing,
  enrollmentStatus,
  isLoggedIn,
}: EnrollButtonProps) {
  const [state, formAction, isPending] = useActionState(
    enrollAction,
    LEARNING_INITIAL_STATE,
  );

  if (!isLoggedIn) {
    return (
      <Link
        href={`/login?next=${encodeURIComponent(`/courses/${courseSlug}`)}`}
        className={buttonStyles({ size: "lg" })}
      >
        <LogIn aria-hidden="true" />
        برای ثبت‌نام وارد شوید
      </Link>
    );
  }

  if (enrollmentStatus === "active") {
    return (
      <Link
        href={`/dashboard/courses/${courseId}`}
        className={buttonStyles({ size: "lg" })}
      >
        <PlayCircle aria-hidden="true" />
        ادامه یادگیری
      </Link>
    );
  }

  if (enrollmentStatus === "awaiting_payment") {
    return (
      <div className="flex flex-col items-start gap-2">
        <span className="text-warning bg-warning-soft rounded-xl px-4 py-2.5 text-sm">
          ثبت‌نام شما ثبت شده و در انتظار تأیید پرداخت است.
        </span>
        <Link
          href={`/courses/${courseSlug}/enroll`}
          className={buttonStyles({ variant: "outline", size: "sm" })}
        >
          راهنمای پرداخت
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <form action={formAction}>
        <input type="hidden" name="courseId" value={courseId} />
        <Button type="submit" size="lg" disabled={isPending}>
          {pricing.type === "free" ? (
            <PlayCircle aria-hidden="true" />
          ) : (
            <ShoppingCart aria-hidden="true" />
          )}
          {isPending
            ? "در حال ثبت‌نام…"
            : pricing.type === "free"
              ? "ثبت‌نام رایگان"
              : "ثبت‌نام در دوره"}
        </Button>
      </form>

      {state.status !== "idle" && state.message && (
        <p
          role="status"
          className={
            state.status === "success"
              ? "text-success flex items-center gap-1.5 text-sm"
              : "text-danger text-sm"
          }
        >
          {state.status === "success" && (
            <CircleCheck className="size-4 shrink-0" aria-hidden="true" />
          )}
          {state.message}
        </p>
      )}
    </div>
  );
}
