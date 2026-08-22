import {
  findAllArticles,
  findAllCategories,
  findAllCourses,
  findAllUsers,
} from "@/lib/repositories";
import { matchesSearch, paginate } from "@/lib/services/shared";
import type { Paginated, User, UserRole, UserStatus } from "@/types";

/**
 * سرویس‌های پنل ادمین.
 *
 * برخلاف سرویس‌های عمومی، اینجا محتوای پیش‌نویس و بایگانی هم دیده می‌شود؛
 * فیلتر `status === "published"` عمداً اعمال نمی‌شود.
 */

/** آمار داشبورد. */
export async function getDashboardStats() {
  const [courses, articles, categories, users] = await Promise.all([
    findAllCourses(),
    findAllArticles(),
    findAllCategories(),
    findAllUsers(),
  ]);

  const published = courses.filter((item) => item.status === "published");
  const totalStudents = published.reduce(
    (sum, course) => sum + course.studentCount,
    0,
  );

  return {
    courses: {
      total: courses.length,
      published: published.length,
      draft: courses.filter((item) => item.status === "draft").length,
    },
    articles: {
      total: articles.length,
      published: articles.filter((item) => item.status === "published").length,
      draft: articles.filter((item) => item.status === "draft").length,
      totalViews: articles.reduce((sum, item) => sum + item.viewCount, 0),
    },
    categories: { total: categories.length },
    users: {
      total: users.length,
      active: users.filter((item) => item.status === "active").length,
      students: users.filter((item) => item.role === "student").length,
    },
    students: totalStudents,
  };
}

/** داده نمودار: دانشجویان هر دوره، مرتب‌شده نزولی. */
export async function getStudentsPerCourse() {
  const courses = await findAllCourses();

  return courses
    .filter((course) => course.status === "published")
    .map((course) => ({
      id: course.id,
      label: course.title,
      shortLabel: course.titleEn,
      value: course.studentCount,
    }))
    .sort((a, b) => b.value - a.value);
}

/** آخرین محتوای ویرایش‌شده — برای فهرست فعالیت داشبورد. */
export async function getRecentContent(limit = 6) {
  const [courses, articles] = await Promise.all([
    findAllCourses(),
    findAllArticles(),
  ]);

  const entries = [
    ...courses.map((item) => ({
      id: item.id,
      kind: "course" as const,
      title: item.title,
      status: item.status,
      updatedAt: item.updatedAt,
      href: `/admin/courses/${item.id}/edit`,
    })),
    ...articles.map((item) => ({
      id: item.id,
      kind: "article" as const,
      title: item.title,
      status: item.status,
      updatedAt: item.updatedAt,
      href: `/admin/articles/${item.id}/edit`,
    })),
  ];

  return entries
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, limit);
}

export interface UserQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: UserRole;
  status?: UserStatus;
}

/** فهرست کاربران با جستجو، فیلتر و صفحه‌بندی. */
export async function getUsers(
  options: UserQuery = {},
): Promise<Paginated<User>> {
  const users = await findAllUsers();

  const filtered = users.filter((user) => {
    if (options.role && user.role !== options.role) return false;
    if (options.status && user.status !== options.status) return false;
    return matchesSearch(options.search, user.name, user.email);
  });

  const sorted = filtered.sort(
    (a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime(),
  );

  return paginate(sorted, options.page, options.pageSize ?? 10);
}
