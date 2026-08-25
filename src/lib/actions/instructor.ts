"use server";

import { persistCourse } from "@/lib/actions/course-write";
import type { FormState } from "@/lib/actions/content.schema";
import { requireCourseAccess, requireInstructor } from "@/lib/auth/authorize";

/**
 * اکشن‌های نوشتن پنل مدرس.
 *
 * تفاوت بنیادی با اکشن‌های ادمین در یک جمله: مدرس هرگز تعیین نمی‌کند
 * دوره مال کیست. `instructorId` از نشست می‌آید، نه از فرم.
 */

export async function saveInstructorCourseAction(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const identity = await requireInstructor();

  /* ویرایش فقط روی دوره‌ای که مال خود مدرس است. */
  const id = String(formData.get("id") ?? "");
  if (id) await requireCourseAccess(id);

  return persistCourse(formData, {
    forcedInstructorId: identity.personId,
    redirectTo: "/instructor?saved=1",
  });
}
