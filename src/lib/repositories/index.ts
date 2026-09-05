import "server-only";
import { serverEnv } from "@/lib/config/server-env";
import type { ContentRepository } from "@/lib/repositories/contracts";
import { mockContentRepository } from "@/lib/repositories/mock-content";
import { prismaContentRepository } from "@/lib/repositories/prisma-content";
import { nextId } from "@/lib/repositories/store";

/**
 * لایه ریپازیتوری — تنها نقطه‌ای که «منبع داده» را می‌شناسد.
 *
 * دو پیاده‌سازی وجود دارد و `DATA_SOURCE` انتخاب می‌کند کدام:
 *
 *   DATA_SOURCE=prisma  → PostgreSQL (ماندگار، حالت واقعی)
 *   DATA_SOURCE=mock    → حافظه (پیش‌فرض؛ برای اجرا بدون دیتابیس)
 *
 * سرویس‌ها و کامپوننت‌ها از این انتخاب بی‌خبرند: همان توابعی را
 * ایمپورت می‌کنند که همیشه می‌کردند. به همین دلیل اضافه‌شدن Prisma
 * حتی یک خط از لایه‌های بالاتر را تغییر نداد.
 *
 * انتخاب یک بار هنگام بارگذاری ماژول انجام می‌شود، نه در هر فراخوانی —
 * تغییر `DATA_SOURCE` نیازمند ری‌استارت است، که برای متغیر محیطی
 * رفتار درستی است.
 */
const repository: ContentRepository =
  serverEnv.DATA_SOURCE === "prisma"
    ? prismaContentRepository
    : mockContentRepository;

/** کدام پیاده‌سازی فعال است — برای نمایش در پنل و پیام‌های خطا. */
export const activeDataSource = serverEnv.DATA_SOURCE;

export { nextId };

/* ---------------------------------------------------------------
   خواندن
--------------------------------------------------------------- */

export const findAllCourses = repository.findAllCourses;
export const findCourseBySlug = repository.findCourseBySlug;
export const findCourseById = repository.findCourseById;

export const findAllArticles = repository.findAllArticles;
export const findArticleBySlug = repository.findArticleBySlug;
export const findArticleById = repository.findArticleById;

export const findAllCategories = repository.findAllCategories;
export const findCategoryBySlug = repository.findCategoryBySlug;
export const findCategoryById = repository.findCategoryById;

export const findAllPeople = repository.findAllPeople;
export const findPersonById = repository.findPersonById;

export const findAllUsers = repository.findAllUsers;
export const findUserById = repository.findUserById;
export const findUserByUsername = repository.findUserByUsername;
export const findUserByEmail = repository.findUserByEmail;

/* ---------------------------------------------------------------
   نوشتن
--------------------------------------------------------------- */

export const insertCourse = repository.insertCourse;
export const patchCourse = repository.patchCourse;
export const removeCourse = repository.removeCourse;

export const insertArticle = repository.insertArticle;
export const patchArticle = repository.patchArticle;
export const removeArticle = repository.removeArticle;

export const insertCategory = repository.insertCategory;
export const patchCategory = repository.patchCategory;
export const removeCategory = repository.removeCategory;

export const insertPerson = repository.insertPerson;

export const insertUser = repository.insertUser;
export const patchUser = repository.patchUser;
export const removeUser = repository.removeUser;

/* ---------------------------------------------------------------
   قواعد دامنه
--------------------------------------------------------------- */

export const countCategoryUsage = repository.countCategoryUsage;
