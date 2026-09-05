import { existsSync } from "node:fs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { articlesMock } from "../src/data/articles.mock";
import { categoriesMock } from "../src/data/categories.mock";
import { coursesMock } from "../src/data/courses.mock";
import { peopleMock } from "../src/data/people.mock";
import { usersMock } from "../src/data/users.mock";
import { hashPassword } from "../src/lib/auth/password";

/**
 * پرکردن دیتابیس از داده mock.
 *
 * همان داده‌ای که امروز سایت با آن کار می‌کند، بدون بازنویسی دستی به
 * دیتابیس منتقل می‌شود. شناسه‌ها هم عیناً حفظ می‌شوند تا ارجاع‌های
 * موجود (مثل `person-kasra` در اکشن ساخت مقاله) نشکنند.
 *
 * اسکریپت idempotent است: اول همه‌چیز پاک می‌شود و بعد از نو نوشته،
 * پس اجرای دوباره داده تکراری نمی‌سازد.
 *
 * ⚠️ یعنی هر اجرا، تغییرهای ساخته‌شده در پنل را هم پاک می‌کند. این
 * اسکریپت برای راه‌اندازی اولیه است، نه برای به‌روزرسانی.
 */

/* نه Prisma 7 و نه tsx فایل `.env` را خودشان نمی‌خوانند. */
if (!process.env.DATABASE_URL && existsSync(".env")) {
  process.loadEnvFile(".env");
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL تنظیم نشده است.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

/** برچسب‌های یکتای همه دوره‌ها و مقالات. */
function collectTagNames(): string[] {
  const names = new Set<string>();
  for (const course of coursesMock) course.tags.forEach((tag) => names.add(tag));
  for (const article of articlesMock)
    article.tags.forEach((tag) => names.add(tag));
  return [...names];
}

async function main() {
  console.log("پاک‌سازی داده قبلی…");
  /* ترتیب مهم است: از وابسته به مستقل. */
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.courseProject.deleteMany();
  await prisma.article.deleteMany();
  await prisma.course.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.person.deleteMany();
  await prisma.user.deleteMany();

  console.log("افراد…");
  for (const person of peopleMock) {
    await prisma.person.create({
      data: {
        id: person.id,
        slug: person.slug,
        name: person.name,
        role: person.role,
        bio: person.bio,
        avatar: person.avatar,
        githubUrl: person.socials.github,
        linkedinUrl: person.socials.linkedin,
        xUrl: person.socials.x,
        telegramUrl: person.socials.telegram,
        websiteUrl: person.socials.website,
      },
    });
  }

  console.log("دسته‌بندی‌ها…");
  for (const category of categoriesMock) {
    await prisma.category.create({ data: category });
  }

  console.log("برچسب‌ها…");
  for (const name of collectTagNames()) {
    await prisma.tag.create({ data: { name } });
  }

  console.log("دوره‌ها، فصل‌ها و درس‌ها…");
  for (const course of coursesMock) {
    await prisma.course.create({
      data: {
        id: course.id,
        slug: course.slug,
        title: course.title,
        titleEn: course.titleEn,
        excerpt: course.excerpt,
        description: course.description,
        cover: course.cover,
        categoryId: course.categoryId,
        instructorId: course.instructorId,
        level: course.level,
        status: course.status,
        progress: course.progress,
        pricingType: course.pricing.type,
        priceAmount:
          course.pricing.type === "paid" ? course.pricing.amount : null,
        priceOriginalAmount:
          course.pricing.type === "paid"
            ? course.pricing.originalAmount ?? null
            : null,
        nextReleaseAt: course.nextReleaseAt
          ? new Date(course.nextReleaseAt)
          : null,
        durationMinutes: course.durationMinutes,
        lessonCount: course.lessonCount,
        studentCount: course.studentCount,
        rating: course.rating,
        ratingCount: course.ratingCount,
        prerequisites: course.prerequisites,
        outcomes: course.outcomes,
        isFeatured: course.isFeatured,
        publishedAt: new Date(course.publishedAt),
        tags: {
          connect: course.tags.map((name) => ({ name })),
        },
        projects: {
          create: course.projects.map((project) => ({
            id: project.id,
            title: project.title,
            description: project.description,
            skills: project.skills,
            image: project.image,
            repoUrl: project.repoUrl,
            demoUrl: project.demoUrl,
          })),
        },
        chapters: {
          create: course.chapters.map((chapter) => ({
            id: chapter.id,
            title: chapter.title,
            description: chapter.description,
            order: chapter.order,
            lessons: {
              create: chapter.lessons.map((lesson) => ({
                id: lesson.id,
                slug: lesson.slug,
                title: lesson.title,
                type: lesson.type,
                durationMinutes: lesson.durationMinutes,
                isFree: lesson.isFree,
                order: lesson.order,
                videoUrl: lesson.videoUrl,
                videoSizeBytes: lesson.videoSizeBytes,
              })),
            },
          })),
        },
      },
    });
  }

  console.log("مقالات…");
  for (const article of articlesMock) {
    await prisma.article.create({
      data: {
        id: article.id,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        cover: article.cover,
        categoryId: article.categoryId,
        authorId: article.authorId,
        status: article.status,
        readingMinutes: article.readingMinutes,
        viewCount: article.viewCount,
        isFeatured: article.isFeatured,
        publishedAt: new Date(article.publishedAt),
        tags: { connect: article.tags.map((name) => ({ name })) },
      },
    });
  }

  console.log("کاربران…");

  /* اگر ADMIN_PASSWORD تنظیم شده باشد، رمز حساب مدیر با آن جایگزین
     می‌شود — تا هشِ داخل مخزن، اعتبارنامه واقعی تولید نباشد. */
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const adminOverride = adminPassword
    ? await hashPassword(adminPassword)
    : null;

  for (const user of usersMock) {
    const isAdmin = user.role === "admin";
    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        username: isAdmin && adminUsername ? adminUsername : user.username,
        email: user.email,
        passwordHash:
          isAdmin && adminOverride ? adminOverride : user.passwordHash,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        joinedAt: new Date(user.joinedAt),
        lastActiveAt: user.lastActiveAt ? new Date(user.lastActiveAt) : null,
        personId: user.personId ?? null,
        enrollments: {
          create: user.enrollments.map((enrollment) => ({
            courseId: enrollment.courseId,
            status: enrollment.status,
            enrolledAt: new Date(enrollment.enrolledAt),
            completedLessonIds: enrollment.completedLessonIds,
            lastAccessedAt: enrollment.lastAccessedAt
              ? new Date(enrollment.lastAccessedAt)
              : null,
          })),
        },
      },
    });
  }

  const counts = {
    دسته‌بندی: await prisma.category.count(),
    دوره: await prisma.course.count(),
    فصل: await prisma.chapter.count(),
    درس: await prisma.lesson.count(),
    مقاله: await prisma.article.count(),
    کاربر: await prisma.user.count(),
    ثبت‌نام: await prisma.enrollment.count(),
  };

  console.log("\n✓ داده اولیه نوشته شد:", counts);
}

main()
  .catch((error) => {
    console.error("خطا در پرکردن دیتابیس:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
