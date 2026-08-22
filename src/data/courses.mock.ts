import type { Chapter, Course, Lesson, LessonType } from "@/types";

/* ---------------------------------------------------------------
   کمک‌کننده‌های ساخت داده

   هدف: تعداد درس و مدت دوره هرگز دستی نوشته نشوند تا با فصل‌ها
   ناسازگار نشوند. هر دو از روی خود درس‌ها محاسبه می‌شوند.
--------------------------------------------------------------- */

type LessonInput = [title: string, type: LessonType, minutes: number, free?: boolean];

function buildChapter(
  courseSlug: string,
  order: number,
  title: string,
  lessonInputs: LessonInput[],
): Chapter {
  const lessons: Lesson[] = lessonInputs.map(
    ([lessonTitle, type, durationMinutes, isFree = false], index) => ({
      id: `${courseSlug}-c${order}-l${index + 1}`,
      slug: `${courseSlug}-${order}-${index + 1}`,
      title: lessonTitle,
      type,
      durationMinutes,
      isFree,
      order: index + 1,
    }),
  );

  return {
    id: `${courseSlug}-c${order}`,
    title,
    order,
    lessons,
  };
}

type CourseInput = Omit<Course, "lessonCount" | "durationMinutes">;

function defineCourse(input: CourseInput): Course {
  const lessons = input.chapters.flatMap((chapter) => chapter.lessons);

  return {
    ...input,
    lessonCount: lessons.length,
    durationMinutes: lessons.reduce(
      (total, lesson) => total + lesson.durationMinutes,
      0,
    ),
  };
}

/* --------------------------------------------------------------- */

export const coursesMock: Course[] = [
  defineCourse({
    id: "course-java-core",
    slug: "java-core",
    title: "جاوا از صفر تا شیءگرایی پیشرفته",
    titleEn: "Java Core",
    excerpt:
      "پایه‌های زبان جاوا را طوری یاد بگیرید که بتوانید روی آن معماری بسازید، نه فقط کد بنویسید.",
    description:
      "این دوره نقطه شروع مسیر بک‌اند در کاوِنتادور است. از نصب JDK و اولین برنامه شروع می‌کنیم و تا مفاهیمی مثل ارث‌بری، رابط‌ها، جنریک‌ها و مدیریت خطا پیش می‌رویم. تمرکز دوره روی «چرا» است، نه فقط «چطور»؛ در پایان یک سامانه مدیریت کتابخانه کامل می‌سازید که تمام مفاهیم دوره را کنار هم می‌گذارد.",
    cover: "",
    categoryId: "cat-java",
    instructorId: "person-kasra",
    level: "beginner",
    status: "published",
    progress: "completed",
    studentCount: 4820,
    rating: 4.8,
    ratingCount: 612,
    prerequisites: ["آشنایی مقدماتی با کار با کامپیوتر", "بدون نیاز به دانش برنامه‌نویسی قبلی"],
    outcomes: [
      "نوشتن برنامه‌های جاوا با ساختار تمیز و قابل نگهداری",
      "درک عمیق شیءگرایی: کپسوله‌سازی، ارث‌بری و چندریختی",
      "کار با کالکشن‌ها، جنریک‌ها و استریم‌ها",
      "مدیریت درست خطا و نوشتن کد مقاوم",
    ],
    tags: ["جاوا", "شیءگرایی", "مبانی برنامه‌نویسی"],
    chapters: [
      buildChapter("java-core", 1, "شروع کار با جاوا", [
        ["نصب JDK و راه‌اندازی محیط توسعه", "video", 18, true],
        ["اولین برنامه و ساختار یک کلاس", "video", 22, true],
        ["متغیرها، انواع داده و تبدیل نوع", "video", 34],
        ["عملگرها و ساختارهای شرطی", "video", 28],
        ["حلقه‌ها و تمرین‌های عملی", "video", 31],
      ]),
      buildChapter("java-core", 2, "شیءگرایی در عمل", [
        ["کلاس، شیء و سازنده", "video", 36],
        ["کپسوله‌سازی و چرایی آن", "video", 29],
        ["ارث‌بری و بازنویسی متد", "video", 41],
        ["رابط‌ها و کلاس‌های انتزاعی", "video", 38],
        ["چندریختی با مثال واقعی", "video", 33],
        ["آزمون میان‌دوره شیءگرایی", "quiz", 15],
      ]),
      buildChapter("java-core", 3, "ساختارهای داده و مدیریت خطا", [
        ["آرایه‌ها و کار با آن‌ها", "video", 26],
        ["کالکشن‌ها: List، Set و Map", "video", 44],
        ["جنریک‌ها و ایمنی نوع", "video", 37],
        ["استثناها و مدیریت خطا", "video", 32],
        ["Stream API و برنامه‌نویسی تابعی", "video", 39],
      ]),
      buildChapter("java-core", 4, "پروژه پایانی", [
        ["تحلیل نیازمندی‌های سامانه کتابخانه", "article", 20],
        ["طراحی کلاس‌ها و روابط", "video", 35],
        ["پیاده‌سازی لایه دامنه", "project", 55],
        ["پیاده‌سازی منطق امانت و بازگشت", "project", 48],
        ["بازآرایی و جمع‌بندی", "video", 27],
      ]),
    ],
    projects: [
      {
        id: "proj-library",
        title: "سامانه مدیریت کتابخانه",
        description:
          "یک برنامه کنسولی کامل برای ثبت کتاب، مدیریت اعضا و پیگیری امانت‌ها؛ با معماری لایه‌ای و پوشش تست.",
        skills: ["شیءگرایی", "کالکشن‌ها", "مدیریت خطا"],
      },
    ],
    isFeatured: true,
    publishedAt: "2026-02-14",
    updatedAt: "2026-07-02",
  }),

  defineCourse({
    id: "course-spring-api",
    slug: "spring-boot-api",
    title: "ساخت API فروشگاهی با Spring Boot",
    titleEn: "Spring Boot API",
    excerpt:
      "یک سرویس واقعی بسازید: احراز هویت، دیتابیس، تست و استقرار — همان چیزی که در شغل واقعی می‌خواهند.",
    description:
      "در این دوره از صفر یک API فروشگاهی می‌سازیم که واقعاً قابل استفاده است. با ساختار پروژه و تزریق وابستگی شروع می‌کنیم، سپس لایه داده را با JPA می‌سازیم، احراز هویت مبتنی بر JWT اضافه می‌کنیم و در پایان سرویس را با Docker مستقر می‌کنیم. هر بخش با تست همراه است، چون کدی که تست ندارد آماده تولید نیست.",
    cover: "",
    categoryId: "cat-spring",
    instructorId: "person-kasra",
    level: "intermediate",
    status: "published",
    progress: "ongoing",
    nextReleaseAt: "2026-09-05",
    studentCount: 3140,
    rating: 4.9,
    ratingCount: 428,
    prerequisites: [
      "تسلط بر مبانی جاوا و شیءگرایی",
      "آشنایی مقدماتی با پایگاه داده رابطه‌ای",
    ],
    outcomes: [
      "طراحی و پیاده‌سازی REST API با ساختار حرفه‌ای",
      "کار با JPA و Hibernate برای لایه داده",
      "پیاده‌سازی احراز هویت و کنترل دسترسی با JWT",
      "نوشتن تست واحد و یکپارچه برای سرویس‌ها",
      "استقرار سرویس با Docker",
    ],
    tags: ["اسپرینگ", "API", "بک‌اند", "JWT"],
    chapters: [
      buildChapter("spring-boot-api", 1, "شروع با Spring Boot", [
        ["معماری اسپرینگ و تزریق وابستگی", "video", 32, true],
        ["ساخت پروژه و ساختار پوشه‌ها", "video", 24, true],
        ["کنترلرها و اولین اندپوینت", "video", 29],
        ["اعتبارسنجی ورودی و مدیریت خطا", "video", 35],
      ]),
      buildChapter("spring-boot-api", 2, "لایه داده", [
        ["مدل‌سازی موجودیت‌ها با JPA", "video", 41],
        ["ریپازیتوری‌ها و کوئری‌های سفارشی", "video", 38],
        ["روابط یک‌به‌چند و چند‌به‌چند", "video", 44],
        ["مهاجرت پایگاه داده با Flyway", "video", 26],
        ["صفحه‌بندی و مرتب‌سازی", "video", 31],
      ]),
      buildChapter("spring-boot-api", 3, "امنیت و تست", [
        ["Spring Security از پایه", "video", 46],
        ["احراز هویت با JWT", "video", 52],
        ["نقش‌ها و کنترل دسترسی", "video", 34],
        ["تست واحد سرویس‌ها", "video", 37],
        ["تست یکپارچه با Testcontainers", "video", 43],
      ]),
      buildChapter("spring-boot-api", 4, "استقرار", [
        ["کانتینری‌سازی با Docker", "video", 39],
        ["پیکربندی محیط‌های مختلف", "video", 28],
        ["پروژه پایانی: تکمیل سرویس سفارش", "project", 62],
      ]),
    ],
    projects: [
      {
        id: "proj-shop-api",
        title: "API فروشگاه اینترنتی",
        description:
          "سرویس کامل مدیریت محصول، سبد خرید و سفارش با احراز هویت، تست و استقرار کانتینری.",
        skills: ["Spring Boot", "JPA", "JWT", "Docker"],
      },
    ],
    isFeatured: true,
    publishedAt: "2026-03-21",
    updatedAt: "2026-07-19",
  }),

  defineCourse({
    id: "course-react-project",
    slug: "react-from-scratch",
    title: "ری‌اکت از پایه تا پروژه واقعی",
    titleEn: "React From Scratch",
    excerpt:
      "کامپوننت، state و هوک‌ها را نه به‌صورت تئوری، بلکه با ساختن یک داشبورد کامل یاد بگیرید.",
    description:
      "این دوره ری‌اکت را از مفهوم کامپوننت شروع می‌کند و تا الگوهای پیشرفته مدیریت state پیش می‌رود. به‌جای مثال‌های ساختگی، در طول دوره یک داشبورد مدیریت وظایف می‌سازیم که فرم، فیلتر، مسیریابی و ارتباط با API دارد. در انتها می‌دانید کِی از هوک استفاده کنید و مهم‌تر، کِی استفاده نکنید.",
    cover: "",
    categoryId: "cat-react",
    instructorId: "person-kasra",
    level: "intermediate",
    status: "published",
    progress: "completed",
    studentCount: 5610,
    rating: 4.7,
    ratingCount: 733,
    prerequisites: [
      "تسلط بر جاوااسکریپت مدرن (ES6+)",
      "آشنایی با HTML و CSS",
    ],
    outcomes: [
      "طراحی کامپوننت‌های قابل استفاده مجدد",
      "مدیریت state محلی و سراسری بدون پیچیدگی اضافه",
      "کار با فرم‌ها، اعتبارسنجی و ارتباط با API",
      "بهینه‌سازی رندر و جلوگیری از رندرهای اضافی",
    ],
    tags: ["ری‌اکت", "فرانت‌اند", "هوک"],
    chapters: [
      buildChapter("react-from-scratch", 1, "مفاهیم پایه", [
        ["ری‌اکت چه مشکلی را حل می‌کند", "video", 21, true],
        ["JSX و اولین کامپوننت", "video", 27, true],
        ["props و ترکیب کامپوننت‌ها", "video", 33],
        ["state و رویدادها", "video", 36],
      ]),
      buildChapter("react-from-scratch", 2, "هوک‌ها", [
        ["useState در عمق", "video", 32],
        ["useEffect و تله‌های رایج آن", "video", 45],
        ["useMemo و useCallback: کِی و چرا", "video", 38],
        ["ساخت هوک سفارشی", "video", 34],
        ["آزمون هوک‌ها", "quiz", 12],
      ]),
      buildChapter("react-from-scratch", 3, "پروژه داشبورد", [
        ["طراحی ساختار پروژه", "article", 18],
        ["مسیریابی و چیدمان صفحات", "video", 40],
        ["فرم‌ها و اعتبارسنجی", "video", 43],
        ["ارتباط با API و مدیریت حالت بارگذاری", "project", 51],
        ["بهینه‌سازی و جمع‌بندی", "video", 29],
      ]),
    ],
    projects: [
      {
        id: "proj-task-dashboard",
        title: "داشبورد مدیریت وظایف",
        description:
          "برنامه‌ای با احراز هویت، فیلتر پیشرفته، فرم‌های اعتبارسنجی‌شده و حالت تاریک.",
        skills: ["React", "هوک‌ها", "مسیریابی", "مدیریت state"],
      },
    ],
    isFeatured: true,
    publishedAt: "2026-01-30",
    updatedAt: "2026-06-11",
  }),

  defineCourse({
    id: "course-js-modern",
    slug: "modern-javascript",
    title: "جاوااسکریپت مدرن",
    titleEn: "Modern JavaScript",
    excerpt:
      "از مبانی تا ناهمگامی و ماژول‌ها؛ همان چیزی که قبل از هر فریم‌ورکی باید بدانید.",
    description:
      "بیشتر مشکلاتی که توسعه‌دهندگان در ری‌اکت و نکست‌جی‌اس دارند، ریشه در نفهمیدن خود جاوااسکریپت دارد. این دوره دقیقاً همان شکاف را پر می‌کند: دامنه و بستار، prototype، Promise و async/await، ماژول‌ها و ابزارهای مدرن. در پایان یک برنامه هواشناسی می‌سازید که تمام این مفاهیم را به کار می‌گیرد.",
    cover: "",
    categoryId: "cat-javascript",
    instructorId: "person-kasra",
    level: "beginner",
    status: "published",
    progress: "completed",
    studentCount: 6280,
    rating: 4.6,
    ratingCount: 891,
    prerequisites: ["آشنایی با HTML و CSS"],
    outcomes: [
      "درک دقیق دامنه، بستار و this",
      "کار حرفه‌ای با آرایه‌ها و اشیاء",
      "تسلط بر ناهمگامی: Promise و async/await",
      "کار با ماژول‌ها و ابزارهای ساخت",
    ],
    tags: ["جاوااسکریپت", "ES6", "ناهمگامی"],
    chapters: [
      buildChapter("modern-javascript", 1, "مبانی زبان", [
        ["متغیرها، دامنه و بالا‌بری", "video", 30, true],
        ["توابع و بستار", "video", 38, true],
        ["اشیاء و prototype", "video", 42],
        ["آرایه‌ها و متدهای کاربردی", "video", 35],
      ]),
      buildChapter("modern-javascript", 2, "جاوااسکریپت ناهمگام", [
        ["حلقه رویداد و صف وظایف", "video", 33],
        ["Promise از پایه", "video", 40],
        ["async/await و مدیریت خطا", "video", 37],
        ["کار با fetch و API‌های واقعی", "video", 34],
      ]),
      buildChapter("modern-javascript", 3, "ابزارها و پروژه", [
        ["ماژول‌ها و مدیریت وابستگی", "video", 28],
        ["ابزارهای ساخت و باندلر", "video", 25],
        ["پروژه: برنامه هواشناسی", "project", 47],
      ]),
    ],
    projects: [
      {
        id: "proj-weather",
        title: "برنامه هواشناسی",
        description:
          "برنامه‌ای که با API واقعی کار می‌کند، حالت خطا و بارگذاری دارد و داده را محلی ذخیره می‌کند.",
        skills: ["ناهمگامی", "fetch", "DOM"],
      },
    ],
    isFeatured: false,
    publishedAt: "2025-11-08",
    updatedAt: "2026-05-24",
  }),

  defineCourse({
    id: "course-javafx-desktop",
    slug: "javafx-desktop-apps",
    title: "ساخت اپلیکیشن دسکتاپ با JavaFX",
    titleEn: "JavaFX Desktop Apps",
    excerpt:
      "نرم‌افزار دسکتاپ حرفه‌ای با جاوا بسازید؛ از رابط کاربری تا معماری و بسته‌بندی نهایی.",
    description:
      "جاوا‌اف‌ایکس هنوز یکی از بهترین راه‌ها برای ساخت نرم‌افزار دسکتاپ چندسکویی است. در این دوره با FXML و Scene Builder رابط کاربری می‌سازیم، معماری MVVM را پیاده می‌کنیم، داده را در پایگاه داده محلی ذخیره می‌کنیم و در پایان برنامه را به فایل نصب قابل توزیع تبدیل می‌کنیم.",
    cover: "",
    categoryId: "cat-javafx",
    instructorId: "person-kasra",
    level: "intermediate",
    status: "published",
    progress: "ongoing",
    nextReleaseAt: "2026-08-29",
    studentCount: 1470,
    rating: 4.5,
    ratingCount: 196,
    prerequisites: ["تسلط بر مبانی جاوا و شیءگرایی"],
    outcomes: [
      "ساخت رابط کاربری با FXML و Scene Builder",
      "پیاده‌سازی معماری MVVM در دسکتاپ",
      "اتصال به پایگاه داده محلی",
      "بسته‌بندی و توزیع نرم‌افزار نهایی",
    ],
    tags: ["JavaFX", "دسکتاپ", "MVVM"],
    chapters: [
      buildChapter("javafx-desktop-apps", 1, "شروع کار", [
        ["راه‌اندازی JavaFX و اولین پنجره", "video", 26, true],
        ["Scene Graph و ساختار رابط", "video", 31],
        ["چیدمان‌ها و کنترل‌های پایه", "video", 38],
        ["استایل‌دهی با CSS", "video", 29],
      ]),
      buildChapter("javafx-desktop-apps", 2, "معماری برنامه", [
        ["FXML و جداسازی رابط از منطق", "video", 35],
        ["الگوی MVVM و اتصال داده", "video", 44],
        ["مدیریت رویدادها و اعتبارسنجی فرم", "video", 33],
      ]),
      buildChapter("javafx-desktop-apps", 3, "داده و توزیع", [
        ["ذخیره‌سازی با SQLite", "video", 40],
        ["چندنخی و به‌روزرسانی رابط", "video", 36],
        ["بسته‌بندی با jpackage", "video", 27],
        ["پروژه: نرم‌افزار مدیریت هزینه", "project", 58],
      ]),
    ],
    projects: [
      {
        id: "proj-expense-desktop",
        title: "نرم‌افزار مدیریت هزینه",
        description:
          "برنامه دسکتاپ با نمودار، فیلتر تاریخ، پایگاه داده محلی و فایل نصب آماده توزیع.",
        skills: ["JavaFX", "MVVM", "SQLite"],
      },
    ],
    isFeatured: false,
    publishedAt: "2026-04-05",
    updatedAt: "2026-06-28",
  }),

  defineCourse({
    id: "course-nextjs-fullstack",
    slug: "nextjs-fullstack",
    title: "نکست‌جی‌اس: از رندر سمت سرور تا محصول نهایی",
    titleEn: "Next.js Fullstack",
    excerpt:
      "یک محصول فول‌استک واقعی بسازید و منتشر کنید؛ با تمرکز بر کارایی، SEO و تجربه کاربری.",
    description:
      "این دوره پیشرفته‌ترین مسیر کاوِنتادور است. با App Router و کامپوننت‌های سرور شروع می‌کنیم، لایه داده را با ORM می‌سازیم، احراز هویت اضافه می‌کنیم و روی کارایی و SEO کار می‌کنیم. خروجی دوره یک پلتفرم وبلاگ چندکاربره است که واقعاً مستقر می‌شود.",
    cover: "",
    categoryId: "cat-nextjs",
    instructorId: "person-kasra",
    level: "advanced",
    status: "published",
    progress: "upcoming",
    nextReleaseAt: "2026-09-20",
    studentCount: 2380,
    rating: 4.9,
    ratingCount: 314,
    prerequisites: [
      "تسلط بر ری‌اکت و هوک‌ها",
      "آشنایی با TypeScript",
      "درک مفاهیم پایه HTTP",
    ],
    outcomes: [
      "درک تفاوت کامپوننت سرور و کلاینت و انتخاب درست",
      "ساخت لایه داده و Server Action",
      "پیاده‌سازی احراز هویت و کنترل دسترسی",
      "بهینه‌سازی کارایی و SEO تا سطح تولید",
      "استقرار محصول روی محیط واقعی",
    ],
    tags: ["نکست‌جی‌اس", "فول‌استک", "SEO", "TypeScript"],
    chapters: [
      buildChapter("nextjs-fullstack", 1, "معماری App Router", [
        ["کامپوننت سرور در برابر کلاینت", "video", 38, true],
        ["مسیریابی، چیدمان و گروه مسیر", "video", 34, true],
        ["دریافت داده و راهبردهای کش", "video", 46],
        ["حالت بارگذاری و مرز خطا", "video", 31],
      ]),
      buildChapter("nextjs-fullstack", 2, "لایه داده و فرم", [
        ["طراحی مدل داده با ORM", "video", 42],
        ["Server Action و جهش داده", "video", 45],
        ["اعتبارسنجی سمت سرور", "video", 33],
        ["آپلود فایل و مدیریت رسانه", "video", 37],
      ]),
      buildChapter("nextjs-fullstack", 3, "احراز هویت و امنیت", [
        ["نشست، کوکی و میان‌افزار", "video", 41],
        ["کنترل دسترسی مبتنی بر نقش", "video", 36],
      ]),
      buildChapter("nextjs-fullstack", 4, "کارایی، SEO و استقرار", [
        ["بهینه‌سازی تصویر و فونت", "video", 32],
        ["متادیتا، sitemap و داده ساختاریافته", "video", 39],
        ["اندازه‌گیری Core Web Vitals", "video", 28],
        ["پروژه پایانی: انتشار پلتفرم وبلاگ", "project", 66],
      ]),
    ],
    projects: [
      {
        id: "proj-blog-platform",
        title: "پلتفرم وبلاگ چندکاربره",
        description:
          "محصولی کامل با پنل نویسنده، ویرایشگر متن، آپلود تصویر، احراز هویت و استقرار واقعی.",
        skills: ["Next.js", "TypeScript", "ORM", "SEO"],
      },
    ],
    isFeatured: true,
    publishedAt: "2026-05-17",
    updatedAt: "2026-08-01",
  }),
];
