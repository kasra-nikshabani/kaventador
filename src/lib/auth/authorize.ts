import "server-only";
import { redirect } from "next/navigation";
import { getCurrentUser, getSession, type Session } from "@/lib/auth/session";
import { findCourseById } from "@/lib/repositories";

/**
 * نگهبان‌های مشترک دسترسی.
 *
 * چرا اینجا و نه داخل هر اکشن؟ چون یک قاعده در چند جا تکرار می‌شد و
 * قاعده تکرارشده، دیر یا زود در یکی از جاها فراموش می‌شود. `proxy.ts`
 * فقط وجود کوکی را می‌بیند، پس خط دفاع واقعی همین توابع‌اند.
 */

/** فقط مدیر. */
export async function requireAdmin(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login?next=%2Fadmin");
  if (session.role !== "admin") redirect("/dashboard");
  return session;
}

export type InstructorIdentity = Session & { personId: string };

/**
 * مدرس یا مدیر، به‌همراه `personId` — پلی که دوره‌ها با آن به حساب
 * وصل می‌شوند. حساب بدون `personId` به پنل مدرس راه ندارد.
 */
export async function requireInstructor(): Promise<InstructorIdentity> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=%2Finstructor");
  if (user.role !== "instructor" && user.role !== "admin") redirect("/dashboard");
  if (!user.personId) redirect("/dashboard");

  return {
    userId: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    personId: user.personId,
  };
}

/**
 * دسترسی نوشتن روی یک دوره: مدیر به همه، مدرس فقط به دوره‌های خودش.
 *
 * این تابع در اکشن‌های سرفصل هم استفاده می‌شود؛ آنجا `courseId` از فرم
 * می‌آید و فرم را کاربر می‌فرستد، پس مالکیت باید سمت سرور دوباره
 * بررسی شود — نه اینکه به مخفی‌بودن دکمه اعتماد کنیم.
 */
export async function requireCourseAccess(courseId: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login?next=%2Fadmin");
  if (session.role === "admin") return;

  const identity = await requireInstructor();
  const course = await findCourseById(courseId);

  if (!course || course.instructorId !== identity.personId) {
    redirect("/instructor");
  }
}
