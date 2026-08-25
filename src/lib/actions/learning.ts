"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { LearningState } from "@/lib/actions/learning.schema";
import { getSession } from "@/lib/auth/session";
import { findCourseById, findUserById, patchUser } from "@/lib/repositories";
import type { Enrollment } from "@/types";

/**
 * اکشن‌های یادگیری: ثبت‌نام در دوره و علامت‌زدن درس.
 *
 * همه اکشن‌ها شناسه کاربر را از **نشست** می‌گیرند، نه از فرم. اگر از فرم
 * می‌گرفتند، هر کسی می‌توانست به‌جای کاربر دیگری ثبت‌نام کند یا پیشرفتش
 * را دستکاری کند.
 */

async function requireUserId(): Promise<string> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session.userId;
}

export async function enrollAction(
  _previous: LearningState,
  formData: FormData,
): Promise<LearningState> {
  const userId = await requireUserId();
  const courseId = String(formData.get("courseId") ?? "");

  const [user, course] = await Promise.all([
    findUserById(userId),
    findCourseById(courseId),
  ]);

  if (!user || !course || course.status !== "published") {
    return { status: "error", message: "دوره پیدا نشد." };
  }

  if (user.enrollments.some((item) => item.courseId === courseId)) {
    return { status: "error", message: "قبلاً در این دوره ثبت‌نام کرده‌اید." };
  }

  /**
   * دوره رایگان بلافاصله فعال می‌شود.
   * دوره پولی «در انتظار پرداخت» می‌ماند و درس‌هایش قفل است — چون درگاه
   * پرداخت وصل نیست و بدون این تفکیک، ثبت‌نام یعنی رایگان‌کردن دوره پولی.
   */
  const enrollment: Enrollment = {
    courseId,
    status: course.pricing.type === "free" ? "active" : "awaiting_payment",
    enrolledAt: new Date().toISOString().slice(0, 10),
    completedLessonIds: [],
  };

  await patchUser(userId, { enrollments: [...user.enrollments, enrollment] });

  revalidatePath("/dashboard");
  revalidatePath(`/courses/${course.slug}`);

  return {
    status: "success",
    message:
      enrollment.status === "active"
        ? "ثبت‌نام انجام شد. دوره به پنل شما اضافه شد."
        : "ثبت‌نام ثبت شد. پس از تأیید پرداخت، درس‌ها باز می‌شوند.",
  };
}

/** علامت‌زدن یا برداشتن علامت یک درس. */
export async function toggleLessonAction(formData: FormData): Promise<void> {
  const userId = await requireUserId();
  const courseId = String(formData.get("courseId") ?? "");
  const lessonId = String(formData.get("lessonId") ?? "");

  const user = await findUserById(userId);
  if (!user) return;

  const enrollment = user.enrollments.find(
    (item) => item.courseId === courseId,
  );

  /* فقط ثبت‌نام فعال می‌تواند پیشرفت ثبت کند. */
  if (!enrollment || enrollment.status !== "active") return;

  const done = new Set(enrollment.completedLessonIds);
  if (done.has(lessonId)) done.delete(lessonId);
  else done.add(lessonId);

  const updated = user.enrollments.map((item) =>
    item.courseId === courseId
      ? {
          ...item,
          completedLessonIds: [...done],
          lastAccessedAt: new Date().toISOString().slice(0, 10),
        }
      : item,
  );

  await patchUser(userId, { enrollments: updated });
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/courses/${courseId}`);
}
