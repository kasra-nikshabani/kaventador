import type { Article, Category, Chapter, Course, Lesson, Person, User } from "@/types";

/**
 * قرارداد لایه داده.
 *
 * این فایل «مرز» معماری است. هر پیاده‌سازی — mock فعلی، Prisma، یا یک
 * API خارجی — باید دقیقاً این شکل را برآورده کند. چون پیاده‌سازی mock
 * با `satisfies` به این تایپ گره خورده، اگر روزی امضایی عوض شود،
 * TypeScript همان لحظه خطا می‌دهد؛ نه اینکه در زمان اجرا کشف شود.
 *
 * قاعده‌ای که هر پیاده‌سازی باید حفظ کند:
 *  • خروجی‌ها کپی مستقل‌اند؛ تغییر آن‌ها نباید منبع داده را دستکاری کند.
 *  • «پیدا نشد» با `null` برمی‌گردد، نه استثنا.
 *  • `lessonCount` و `durationMinutes` دوره همیشه از روی درس‌ها
 *    محاسبه می‌شوند، نه ذخیره دستی.
 */

type LessonInput = Omit<Lesson, "id" | "slug" | "order">;

export interface ContentRepository {
  /* ---- خواندن ---- */
  findAllCourses(): Promise<Course[]>;
  findCourseBySlug(slug: string): Promise<Course | null>;
  findCourseById(id: string): Promise<Course | null>;

  findAllArticles(): Promise<Article[]>;
  findArticleBySlug(slug: string): Promise<Article | null>;
  findArticleById(id: string): Promise<Article | null>;

  findAllCategories(): Promise<Category[]>;
  findCategoryBySlug(slug: string): Promise<Category | null>;
  findCategoryById(id: string): Promise<Category | null>;

  findAllPeople(): Promise<Person[]>;
  findPersonById(id: string): Promise<Person | null>;
  insertPerson(person: Person): Promise<Person>;

  findAllUsers(): Promise<User[]>;
  findUserById(id: string): Promise<User | null>;
  findUserByUsername(username: string): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;

  /* ---- نوشتن ---- */
  insertCourse(course: Course): Promise<Course>;
  patchCourse(id: string, changes: Partial<Course>): Promise<Course | null>;
  removeCourse(id: string): Promise<boolean>;

  insertArticle(article: Article): Promise<Article>;
  patchArticle(id: string, changes: Partial<Article>): Promise<Article | null>;
  removeArticle(id: string): Promise<boolean>;

  insertCategory(category: Category): Promise<Category>;
  patchCategory(
    id: string,
    changes: Partial<Category>,
  ): Promise<Category | null>;
  removeCategory(id: string): Promise<boolean>;

  insertUser(user: User): Promise<User>;
  patchUser(id: string, changes: Partial<User>): Promise<User | null>;
  removeUser(id: string): Promise<boolean>;

  /* ---- قواعد دامنه ---- */
  countCategoryUsage(categoryId: string): Promise<number>;
  nextId(prefix: string): string;
}

/** عملیات سرفصل — عمداً جدا، چون واحد کاری متفاوتی است. */
export interface CurriculumRepository {
  insertChapter(
    courseId: string,
    input: { title: string; description?: string },
  ): Promise<Chapter | null>;
  patchChapter(
    courseId: string,
    chapterId: string,
    changes: { title?: string; description?: string },
  ): Promise<Chapter | null>;
  removeChapter(courseId: string, chapterId: string): Promise<boolean>;
  moveChapter(
    courseId: string,
    chapterId: string,
    direction: "up" | "down",
  ): Promise<boolean>;

  insertLesson(
    courseId: string,
    chapterId: string,
    input: LessonInput,
  ): Promise<Lesson | null>;
  patchLesson(
    courseId: string,
    chapterId: string,
    lessonId: string,
    changes: Partial<LessonInput>,
  ): Promise<Lesson | null>;
  removeLesson(
    courseId: string,
    chapterId: string,
    lessonId: string,
  ): Promise<boolean>;
  moveLesson(
    courseId: string,
    chapterId: string,
    lessonId: string,
    direction: "up" | "down",
  ): Promise<boolean>;

  findLessonVideo(
    courseId: string,
    chapterId: string,
    lessonId: string,
  ): Promise<string | undefined>;
}
