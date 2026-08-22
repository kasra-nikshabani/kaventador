import {
  findAllCategories,
  findAllCourses,
  findAllPeople,
  findCourseBySlug,
} from "@/lib/repositories";
import { byNewest, matchesSearch, paginate } from "@/lib/services/shared";
import type {
  Course,
  CourseWithRelations,
  Paginated,
  QueryOptions,
} from "@/types";

/** اتصال دوره به دسته‌بندی و مدرسش. */
async function attachRelations(
  courses: Course[],
): Promise<CourseWithRelations[]> {
  const [categories, people] = await Promise.all([
    findAllCategories(),
    findAllPeople(),
  ]);

  return courses.flatMap((course) => {
    const category = categories.find((item) => item.id === course.categoryId);
    const instructor = people.find((item) => item.id === course.instructorId);

    /* داده‌ای که رابطه‌اش گم شده باشد، اصلاً نمایش داده نمی‌شود
       تا صفحه با مقدار undefined نشکند. */
    if (!category || !instructor) return [];

    return [{ ...course, category, instructor }];
  });
}

function sortCourses(courses: CourseWithRelations[], sort: QueryOptions["sort"]) {
  const sorted = [...courses];

  switch (sort) {
    case "oldest":
      return sorted.sort((a, b) => byNewest(b, a));
    case "popular":
      return sorted.sort((a, b) => b.studentCount - a.studentCount);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "title":
      return sorted.sort((a, b) => a.title.localeCompare(b.title, "fa"));
    default:
      return sorted.sort(byNewest);
  }
}

/** فهرست دوره‌های منتشرشده با فیلتر، جستجو و صفحه‌بندی. */
export async function getCourses(
  options: QueryOptions = {},
): Promise<Paginated<CourseWithRelations>> {
  const all = await attachRelations(await findAllCourses());

  const filtered = all.filter((course) => {
    if (course.status !== "published") return false;
    if (options.categorySlug && course.category.slug !== options.categorySlug)
      return false;
    if (options.level && course.level !== options.level) return false;
    if (options.progress && course.progress !== options.progress) return false;
    if (options.featuredOnly && !course.isFeatured) return false;

    return matchesSearch(
      options.search,
      course.title,
      course.titleEn,
      course.excerpt,
      ...course.tags,
    );
  });

  return paginate(
    sortCourses(filtered, options.sort),
    options.page,
    options.pageSize,
  );
}

/** دوره‌هایی که همین حالا در حال انتشار درس‌های تازه‌اند. */
export async function getOngoingCourses(limit = 3) {
  const result = await getCourses({ progress: "ongoing", pageSize: limit });
  return result.items;
}

/** دوره‌های شاخص صفحه اصلی. */
export async function getFeaturedCourses(limit = 3) {
  const result = await getCourses({ featuredOnly: true, pageSize: limit });
  return result.items;
}

/** یک دوره با تمام روابطش؛ اگر نبود یا منتشر نشده بود، null. */
export async function getCourseBySlug(
  slug: string,
): Promise<CourseWithRelations | null> {
  const course = await findCourseBySlug(slug);
  if (!course || course.status !== "published") return null;

  const [withRelations] = await attachRelations([course]);
  return withRelations ?? null;
}

/**
 * دوره‌های مرتبط: هم‌دسته با دوره فعلی.
 * اگر هم‌دسته کافی نبود، با محبوب‌ترین دوره‌های دیگر پر می‌شود
 * تا این بخش هیچ‌وقت خالی نماند.
 */
export async function getRelatedCourses(
  slug: string,
  limit = 3,
): Promise<CourseWithRelations[]> {
  const current = await getCourseBySlug(slug);
  if (!current) return [];

  const all = await attachRelations(await findAllCourses());
  const candidates = all.filter(
    (course) => course.status === "published" && course.slug !== slug,
  );

  const sameCategory = candidates.filter(
    (course) => course.categoryId === current.categoryId,
  );
  const others = candidates
    .filter((course) => course.categoryId !== current.categoryId)
    .sort((a, b) => b.studentCount - a.studentCount);

  return [...sameCategory, ...others].slice(0, limit);
}

/** اسلاگ همه دوره‌ها — برای generateStaticParams. */
export async function getAllCourseSlugs(): Promise<string[]> {
  const courses = await findAllCourses();
  return courses
    .filter((course) => course.status === "published")
    .map((course) => course.slug);
}

/** آمار کلی پلتفرم برای صفحه اصلی. */
export async function getPlatformStats() {
  const courses = (await findAllCourses()).filter(
    (course) => course.status === "published",
  );

  const totalStudents = courses.reduce(
    (sum, course) => sum + course.studentCount,
    0,
  );
  const totalMinutes = courses.reduce(
    (sum, course) => sum + course.durationMinutes,
    0,
  );
  const ratingCount = courses.reduce(
    (sum, course) => sum + course.ratingCount,
    0,
  );
  const weightedRating = courses.reduce(
    (sum, course) => sum + course.rating * course.ratingCount,
    0,
  );

  return {
    courseCount: courses.length,
    studentCount: totalStudents,
    totalHours: Math.round(totalMinutes / 60),
    averageRating: ratingCount > 0 ? weightedRating / ratingCount : 0,
  };
}
