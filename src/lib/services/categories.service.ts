import {
  findAllArticles,
  findAllCategories,
  findAllCourses,
  findCategoryBySlug,
} from "@/lib/repositories";
import type { CategoryWithStats } from "@/types";

/** همه دسته‌بندی‌ها به همراه شمار دوره و مقاله منتشرشده. */
export async function getCategories(): Promise<CategoryWithStats[]> {
  const [categories, courses, articles] = await Promise.all([
    findAllCategories(),
    findAllCourses(),
    findAllArticles(),
  ]);

  return categories
    .map((category) => ({
      ...category,
      courseCount: courses.filter(
        (course) =>
          course.categoryId === category.id && course.status === "published",
      ).length,
      articleCount: articles.filter(
        (article) =>
          article.categoryId === category.id && article.status === "published",
      ).length,
    }))
    .sort((a, b) => a.order - b.order);
}

export async function getCategoryBySlug(
  slug: string,
): Promise<CategoryWithStats | null> {
  const category = await findCategoryBySlug(slug);
  if (!category) return null;

  const all = await getCategories();
  return all.find((item) => item.id === category.id) ?? null;
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const categories = await findAllCategories();
  return categories.map((category) => category.slug);
}
