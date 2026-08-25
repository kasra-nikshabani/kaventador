import { findAllCourses, findUserById } from "@/lib/repositories";
import { getCourseBySlug, getCourses } from "@/lib/services/courses.service";
import type {
  Enrollment,
  EnrollmentWithCourse,
  ID,
  User,
} from "@/types";

/**
 * درصد پیشرفت.
 *
 * همیشه محاسبه می‌شود، هرگز ذخیره نمی‌شود — وگرنه با افزودن یا حذف درس
 * از سرفصل، عدد ذخیره‌شده کهنه و گمراه‌کننده می‌ماند.
 *
 * درس‌هایی که دیگر در دوره نیستند شمرده نمی‌شوند، پس حذف یک درس از
 * سرفصل نمی‌تواند پیشرفت را بالای صد ببرد.
 */
export function calculateProgress(
  completedLessonIds: string[],
  validLessonIds: Set<string>,
): { percent: number; completed: number; total: number } {
  const total = validLessonIds.size;
  const completed = completedLessonIds.filter((id) =>
    validLessonIds.has(id),
  ).length;

  return {
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
    completed,
    total,
  };
}

/** همه شناسه‌های درس یک دوره. */
function lessonIdsOf(course: { chapters: { lessons: { id: string }[] }[] }) {
  return new Set(
    course.chapters.flatMap((chapter) => chapter.lessons.map((l) => l.id)),
  );
}

/** ثبت‌نام‌های کاربر، همراه دوره و پیشرفت. */
export async function getUserEnrollments(
  userId: ID,
): Promise<EnrollmentWithCourse[]> {
  const user = await findUserById(userId);
  if (!user) return [];

  const published = await getCourses({ pageSize: 1000 });

  return user.enrollments.flatMap((enrollment) => {
    const course = published.items.find(
      (item) => item.id === enrollment.courseId,
    );
    /* دوره حذف‌شده یا منتشرنشده نمایش داده نمی‌شود. */
    if (!course) return [];

    const progress = calculateProgress(
      enrollment.completedLessonIds,
      lessonIdsOf(course),
    );

    return [
      {
        ...enrollment,
        course,
        progressPercent: progress.percent,
        completedCount: progress.completed,
        totalLessons: progress.total,
      },
    ];
  });
}

/** ثبت‌نام کاربر در یک دوره خاص، یا null اگر ثبت‌نام نکرده. */
export async function getEnrollment(
  userId: ID,
  courseId: ID,
): Promise<Enrollment | null> {
  const user = await findUserById(userId);
  return (
    user?.enrollments.find((item) => item.courseId === courseId) ?? null
  );
}

/**
 * آیا کاربر به محتوای دوره دسترسی دارد؟
 *
 * فقط ثبت‌نام `active` دسترسی می‌دهد. ثبت‌نام «در انتظار پرداخت» در پنل
 * دیده می‌شود ولی درس‌ها قفل‌اند — بدون این تفکیک، ثبت‌نام در دوره پولی
 * یعنی رایگان‌کردن آن.
 */
export async function hasAccess(
  userId: ID | undefined,
  courseId: ID,
): Promise<boolean> {
  if (!userId) return false;
  const enrollment = await getEnrollment(userId, courseId);
  return enrollment?.status === "active";
}

/** خلاصه پیشرفت برای نمایش در پنل کاربر. */
export async function getLearningSummary(userId: ID) {
  const enrollments = await getUserEnrollments(userId);

  const active = enrollments.filter((item) => item.status === "active");
  const completed = active.filter((item) => item.progressPercent === 100);
  const totalLessonsDone = active.reduce(
    (sum, item) => sum + item.completedCount,
    0,
  );

  return {
    total: enrollments.length,
    active: active.length,
    awaitingPayment: enrollments.filter(
      (item) => item.status === "awaiting_payment",
    ).length,
    completed: completed.length,
    lessonsCompleted: totalLessonsDone,
  };
}

/**
 * دانشجویان ثبت‌نام‌کرده در دوره‌های یک مدرس.
 *
 * مدرس فقط دانشجویان دوره‌های خودش را می‌بیند، نه همه کاربران سایت.
 */
export async function getStudentsOfInstructor(
  personId: ID,
  allUsers: User[],
): Promise<
  {
    user: Pick<User, "id" | "name" | "username" | "email" | "avatar">;
    courseTitle: string;
    enrollment: Enrollment;
    progressPercent: number;
  }[]
> {
  const courses = (await findAllCourses()).filter(
    (course) => course.instructorId === personId,
  );
  const courseById = new Map(courses.map((course) => [course.id, course]));

  return allUsers.flatMap((user) =>
    user.enrollments.flatMap((enrollment) => {
      const course = courseById.get(enrollment.courseId);
      if (!course) return [];

      const progress = calculateProgress(
        enrollment.completedLessonIds,
        lessonIdsOf(course),
      );

      return [
        {
          user: {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
          },
          courseTitle: course.title,
          enrollment,
          progressPercent: progress.percent,
        },
      ];
    }),
  );
}

/** دوره‌های یک مدرس — برای پنل مدرس. */
export async function getCoursesOfInstructor(personId: ID) {
  const all = await findAllCourses();
  return all.filter((course) => course.instructorId === personId);
}

/** دوره‌ای که کاربر ثبت‌نام کرده، با اسلاگ. */
export async function getEnrollmentBySlug(userId: ID, slug: string) {
  const course = await getCourseBySlug(slug);
  if (!course) return null;

  const enrollment = await getEnrollment(userId, course.id);
  return enrollment ? { course, enrollment } : null;
}
