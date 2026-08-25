/**
 * لایه ریپازیتوری — تنها نقطه‌ای که «منبع داده» را می‌شناسد.
 *
 * امروز روی یک مخزن درون‌حافظه‌ای کار می‌کند. فردا که Prisma یا یک API
 * واقعی اضافه شود، فقط بدنه همین توابع تغییر می‌کند و هیچ کامپوننت یا
 * سرویسی دست نمی‌خورد. به همین دلیل همه توابع از الان async هستند.
 *
 * خروجی‌ها همیشه کپی‌اند تا هیچ مصرف‌کننده‌ای نتواند مخزن را
 * ناخواسته تغییر دهد — همان رفتاری که با دیتابیس واقعی خواهیم داشت.
 */

import { nextId, store } from "@/lib/repositories/store";
import type { Article, Category, Course, Person, User } from "@/types";

export { nextId };

/* ---------------------------------------------------------------
   خواندن
--------------------------------------------------------------- */

export async function findAllCourses(): Promise<Course[]> {
  return structuredClone(store.courses);
}

export async function findCourseBySlug(slug: string): Promise<Course | null> {
  const course = store.courses.find((item) => item.slug === slug);
  return course ? structuredClone(course) : null;
}

export async function findCourseById(id: string): Promise<Course | null> {
  const course = store.courses.find((item) => item.id === id);
  return course ? structuredClone(course) : null;
}

export async function findAllArticles(): Promise<Article[]> {
  return structuredClone(store.articles);
}

export async function findArticleBySlug(slug: string): Promise<Article | null> {
  const article = store.articles.find((item) => item.slug === slug);
  return article ? structuredClone(article) : null;
}

export async function findArticleById(id: string): Promise<Article | null> {
  const article = store.articles.find((item) => item.id === id);
  return article ? structuredClone(article) : null;
}

export async function findAllCategories(): Promise<Category[]> {
  return structuredClone(store.categories);
}

export async function findCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const category = store.categories.find((item) => item.slug === slug);
  return category ? structuredClone(category) : null;
}

export async function findCategoryById(id: string): Promise<Category | null> {
  const category = store.categories.find((item) => item.id === id);
  return category ? structuredClone(category) : null;
}

export async function findAllPeople(): Promise<Person[]> {
  return structuredClone(store.people);
}

export async function findPersonById(id: string): Promise<Person | null> {
  const person = store.people.find((item) => item.id === id);
  return person ? structuredClone(person) : null;
}

export async function findAllUsers(): Promise<User[]> {
  return structuredClone(store.users);
}

export async function findUserById(id: string): Promise<User | null> {
  const user = store.users.find((item) => item.id === id);
  return user ? structuredClone(user) : null;
}

/** جستجوی نام کاربری — بدون حساسیت به حروف بزرگ و کوچک. */
export async function findUserByUsername(
  username: string,
): Promise<User | null> {
  const needle = username.trim().toLowerCase();
  const user = store.users.find(
    (item) => item.username.toLowerCase() === needle,
  );
  return user ? structuredClone(user) : null;
}

/** بررسی یکتایی ایمیل هنگام ثبت‌نام. */
export async function findUserByEmail(email: string): Promise<User | null> {
  const needle = email.trim().toLowerCase();
  const user = store.users.find((item) => item.email.toLowerCase() === needle);
  return user ? structuredClone(user) : null;
}

/* ---------------------------------------------------------------
   نوشتن
--------------------------------------------------------------- */

export async function insertCourse(course: Course): Promise<Course> {
  store.courses.unshift(structuredClone(course));
  return structuredClone(course);
}

export async function patchCourse(
  id: string,
  changes: Partial<Course>,
): Promise<Course | null> {
  const index = store.courses.findIndex((item) => item.id === id);
  if (index === -1) return null;

  store.courses[index] = { ...store.courses[index], ...changes, id };
  return structuredClone(store.courses[index]);
}

export async function removeCourse(id: string): Promise<boolean> {
  const index = store.courses.findIndex((item) => item.id === id);
  if (index === -1) return false;

  store.courses.splice(index, 1);
  return true;
}

export async function insertArticle(article: Article): Promise<Article> {
  store.articles.unshift(structuredClone(article));
  return structuredClone(article);
}

export async function patchArticle(
  id: string,
  changes: Partial<Article>,
): Promise<Article | null> {
  const index = store.articles.findIndex((item) => item.id === id);
  if (index === -1) return null;

  store.articles[index] = { ...store.articles[index], ...changes, id };
  return structuredClone(store.articles[index]);
}

export async function removeArticle(id: string): Promise<boolean> {
  const index = store.articles.findIndex((item) => item.id === id);
  if (index === -1) return false;

  store.articles.splice(index, 1);
  return true;
}

export async function insertCategory(category: Category): Promise<Category> {
  store.categories.push(structuredClone(category));
  return structuredClone(category);
}

export async function patchCategory(
  id: string,
  changes: Partial<Category>,
): Promise<Category | null> {
  const index = store.categories.findIndex((item) => item.id === id);
  if (index === -1) return null;

  store.categories[index] = { ...store.categories[index], ...changes, id };
  return structuredClone(store.categories[index]);
}

export async function removeCategory(id: string): Promise<boolean> {
  const index = store.categories.findIndex((item) => item.id === id);
  if (index === -1) return false;

  store.categories.splice(index, 1);
  return true;
}

export async function insertPerson(person: Person): Promise<Person> {
  store.people.push(structuredClone(person));
  return structuredClone(person);
}

export async function insertUser(user: User): Promise<User> {
  store.users.push(structuredClone(user));
  return structuredClone(user);
}

export async function patchUser(
  id: string,
  changes: Partial<User>,
): Promise<User | null> {
  const index = store.users.findIndex((item) => item.id === id);
  if (index === -1) return null;

  store.users[index] = { ...store.users[index], ...changes, id };
  return structuredClone(store.users[index]);
}

export async function removeUser(id: string): Promise<boolean> {
  const index = store.users.findIndex((item) => item.id === id);
  if (index === -1) return false;

  store.users.splice(index, 1);
  return true;
}

/** شمار دوره‌ها و مقالاتی که به یک دسته‌بندی وصل‌اند — قبل از حذف لازم است. */
export async function countCategoryUsage(categoryId: string): Promise<number> {
  return (
    store.courses.filter((item) => item.categoryId === categoryId).length +
    store.articles.filter((item) => item.categoryId === categoryId).length
  );
}

/* ---------------------------------------------------------------
   گره‌زدن به قرارداد

   این شیء صرفاً برای بررسی نوع نیست؛ نقطه تزریق هم هست. اگر روزی
   پیاده‌سازی Prisma اضافه شود، سرویس‌ها می‌توانند به‌جای ایمپورت
   مستقیم توابع، همین شیء را از یک کارخانه بگیرند.

   `satisfies` باعث می‌شود هر امضای جاافتاده یا ناسازگار، همان لحظه
   خطای کامپایل بدهد.
--------------------------------------------------------------- */

import type { ContentRepository } from "@/lib/repositories/contracts";

export const mockContentRepository = {
  findAllCourses,
  findCourseBySlug,
  findCourseById,
  findAllArticles,
  findArticleBySlug,
  findArticleById,
  findAllCategories,
  findCategoryBySlug,
  findCategoryById,
  findAllPeople,
  findPersonById,
  insertPerson,
  findAllUsers,
  findUserById,
  findUserByUsername,
  findUserByEmail,
  insertUser,
  insertCourse,
  patchCourse,
  removeCourse,
  insertArticle,
  patchArticle,
  removeArticle,
  insertCategory,
  patchCategory,
  removeCategory,
  patchUser,
  removeUser,
  countCategoryUsage,
  nextId,
} satisfies ContentRepository;
