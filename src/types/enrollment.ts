import type { ID, ISODateString } from "./common";
import type { CourseWithRelations } from "./course";

/**
 * وضعیت ثبت‌نام.
 *
 * دوره رایگان مستقیم `active` می‌شود. دوره پولی `awaiting_payment`
 * می‌گیرد و درس‌هایش قفل می‌ماند — چون درگاه پرداخت هنوز وصل نیست و
 * بدون این تفکیک، ثبت‌نام یعنی رایگان‌کردن دوره پولی.
 */
export type EnrollmentStatus = "active" | "awaiting_payment" | "cancelled";

export const ENROLLMENT_STATUS_LABELS: Record<EnrollmentStatus, string> = {
  active: "فعال",
  awaiting_payment: "در انتظار پرداخت",
  cancelled: "لغو شده",
};

export interface Enrollment {
  courseId: ID;
  status: EnrollmentStatus;
  enrolledAt: ISODateString;
  /**
   * شناسه درس‌هایی که کاربر تمام کرده.
   * درصد پیشرفت از روی همین محاسبه می‌شود، نه ذخیره دستی —
   * وگرنه با تغییر سرفصل دوره، عدد کهنه می‌ماند.
   */
  completedLessonIds: ID[];
  lastAccessedAt?: ISODateString;
}

/** ثبت‌نام به‌همراه دوره و پیشرفت محاسبه‌شده — چیزی که UI مصرف می‌کند. */
export interface EnrollmentWithCourse extends Enrollment {
  course: CourseWithRelations;
  /** درصد صحیح بین ۰ تا ۱۰۰. */
  progressPercent: number;
  completedCount: number;
  totalLessons: number;
}
