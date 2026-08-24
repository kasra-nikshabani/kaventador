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
const globalStore = globalThis as unknown as {
  __kaventadorStore?: Store;
  __kaventadorShape?: string;
};

function seed(): Store {
  return {
    courses: structuredClone(coursesMock),
    articles: structuredClone(articlesMock),
    categories: structuredClone(categoriesMock),
    people: structuredClone(peopleMock),
    users: structuredClone(usersMock),
  };
}

/**
 * امضای محتوای داده اولیه.
 *
 * چون مخزن روی `globalThis` می‌ماند، تغییر فایل‌های mock روی مخزن زنده
 * اثر نمی‌کرد. نسخه اول این تابع فقط *نام فیلدها* را می‌سنجید، که تغییر
 * مقدار (مثلاً عوض‌کردن نام کاربری یا هش رمز) را نمی‌گرفت و باعث شد
 * اعتبارنامه قدیمی همچنان کار کند.
 *
 * حالا کل محتوا سنجیده می‌شود. معامله‌اش این است: با هر ویرایش فایل‌های
 * `data/`، تغییرهایی که در پنل ادمین ساخته‌اید پاک می‌شوند. این پذیرفتنی
 * است چون هر دو داده آزمایشی‌اند و «داده mock منبع حقیقت است» رفتار
 * قابل پیش‌بینی‌تری است تا مخزنی که بی‌سروصدا کهنه می‌ماند.
 */
function contentSignature(candidate: Store): string {
  /* FNV-1a — سریع و برای تشخیص تغییر کافی است؛ اینجا نیاز امنیتی نیست. */
  const text = JSON.stringify(candidate);
  let hash = 0x811c9dc5;

  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }

  return (hash >>> 0).toString(36);
}

const freshSeed = seed();
const currentSignature = contentSignature(freshSeed);

if (
  !globalStore.__kaventadorStore ||
  globalStore.__kaventadorShape !== currentSignature
) {
  globalStore.__kaventadorStore = freshSeed;
  globalStore.__kaventadorShape = currentSignature;
}

export const store: Store = globalStore.__kaventadorStore;

/** شناسه یکتای ساده — جای UUID دیتابیس. */
export function nextId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
