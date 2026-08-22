import { articlesMock } from "@/data/articles.mock";
import { categoriesMock } from "@/data/categories.mock";
import { coursesMock } from "@/data/courses.mock";
import { peopleMock } from "@/data/people.mock";
import { usersMock } from "@/data/users.mock";
import type { Article, Category, Course, Person, User } from "@/types";

/**
 * مخزن درون‌حافظه‌ای.
 *
 * ⚠️ این جای دیتابیس است، نه جایگزین آن. داده با هر ری‌استارت سرور به
 * حالت اولیه برمی‌گردد و بین چند نمونه سرور مشترک نیست. هدفش این است
 * که جریان کامل ساخت/ویرایش/حذف پنل ادمین واقعاً کار کند تا هنگام
 * اتصال دیتابیس، فقط همین فایل عوض شود.
 */
type Store = {
  courses: Course[];
  articles: Article[];
  categories: Category[];
  people: Person[];
  users: User[];
};

/* در محیط توسعه، Next ماژول‌ها را داغ بارگذاری می‌کند و بدون این نگهدارنده
   سراسری، مخزن با هر ویرایش فایل بازنشانی می‌شد. */
const globalStore = globalThis as unknown as { __kaventadorStore?: Store };

function seed(): Store {
  return {
    courses: structuredClone(coursesMock),
    articles: structuredClone(articlesMock),
    categories: structuredClone(categoriesMock),
    people: structuredClone(peopleMock),
    users: structuredClone(usersMock),
  };
}

export const store: Store = (globalStore.__kaventadorStore ??= seed());

/** شناسه یکتای ساده — جای UUID دیتابیس. */
export function nextId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
