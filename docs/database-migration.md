# مهاجرت از داده mock به دیتابیس واقعی

این سند مسیر عملی تعویض منبع داده را می‌گوید. کل کار به یک لایه محدود
است — هیچ کامپوننت، صفحه یا سرویسی نباید تغییر کند.

## چرا فقط یک لایه؟

```
کامپوننت‌ها  →  lib/services  →  lib/repositories  →  data/*.mock.ts
                                       ↑
                              فقط این لایه عوض می‌شود
```

`lib/repositories/contracts.ts` شکل دقیق این لایه را تعریف می‌کند. هر
پیاده‌سازی تازه باید همان قرارداد را برآورده کند؛ چون پیاده‌سازی mock با
`satisfies` به قرارداد گره خورده، انحراف امضا خطای کامپایل می‌دهد.

## پیش‌نیاز: یک دیتابیس PostgreSQL

اسکیما PostgreSQL را هدف گرفته چون به آرایه بومی نیاز دارد
(`prerequisites`، `outcomes`، `skills`). برای SQLite این سه باید به
جدول جدا یا رشته JSON تبدیل شوند.

```bash
# نمونه محلی با داکر
docker run --name kaventador-db -e POSTGRES_PASSWORD=devpass \
  -e POSTGRES_DB=kaventador -p 5432:5432 -d postgres:17
```

## گام‌ها

### ۱. تنظیم محیط

`.env.example` را به `.env.local` کپی کنید و پر کنید:

```bash
DATA_SOURCE=prisma
DATABASE_URL=postgresql://postgres:devpass@localhost:5432/kaventador
```

اگر `DATA_SOURCE=prisma` بگذارید ولی `DATABASE_URL` خالی بماند، برنامه
همان ابتدا با پیام واضح شکست می‌خورد — نه اینکه وسط کار کاربر خطا بدهد.

### ۲. ساخت جدول‌ها

```bash
npm run db:migrate
```

### ۳. انتقال داده فعلی

```bash
npm run db:seed
```

اسکریپت [`prisma/seed.ts`](../prisma/seed.ts) همان داده‌ای که امروز سایت
با آن کار می‌کند را منتقل می‌کند و **شناسه‌ها را عیناً حفظ می‌کند**، تا
ارجاع‌های ثابت در کد (مثل `person-kasra`) نشکنند.

### ۴. نوشتن پیاده‌سازی Prisma

فایل تازه‌ای مثل `src/lib/repositories/prisma.ts` بسازید که
`ContentRepository` و `CurriculumRepository` را برآورده کند:

```ts
export const prismaContentRepository = {
  async findAllCourses() { /* … */ },
  // …
} satisfies ContentRepository;
```

سه قاعده‌ای که پیاده‌سازی mock رعایت می‌کند و Prisma هم باید رعایت کند:

1. **خروجی کپی مستقل است.** تغییر آن نباید منبع داده را دستکاری کند.
   (Prisma به‌طور طبیعی این را می‌دهد.)
2. **«پیدا نشد» یعنی `null`، نه استثنا.** پس به‌جای `findUniqueOrThrow`
   از `findUnique` استفاده کنید.
3. **`lessonCount` و `durationMinutes` هرگز دستی نوشته نمی‌شوند.** بعد از
   هر تغییر سرفصل باید از روی درس‌ها بازمحاسبه شوند — دقیقاً کاری که
   `recalculateTotals` در نسخه mock می‌کند.

### ۵. اتصال

در `src/lib/repositories/index.ts` بر اساس `serverEnv.DATA_SOURCE`
پیاده‌سازی درست را انتخاب کنید و همان را صادر کنید. سرویس‌ها بدون تغییر
کار می‌کنند.

### ۶. برگرداندن رفتار SSG

بعد از مهاجرت، محتوا در زمان اجرا عوض می‌شود. گزینه‌ها:

- `export const revalidate = 60` روی صفحات محتوایی (ISR)، یا
- استفاده از `revalidatePath` در اکشن‌های پنل — که همین حالا هم انجام
  می‌شود و کافی است.

## نکته‌های تفاوت مدل

| در کد (TypeScript) | در دیتابیس | چرا |
| --- | --- | --- |
| `tags: string[]` | جدول `Tag` با رابطه چندبه‌چند | روی برچسب فیلتر می‌زنیم؛ جدول ایندکس‌پذیر است |
| `enrolledCourseIds: string[]` | جدول `Enrollment` | رابطه داده اضافه دارد (تاریخ، درصد پیشرفت) |
| `socials: {...}` | ستون‌های جدا در `Person` | شیء تودرتو در SQL ایندکس‌پذیر نیست |
| تاریخ به صورت رشته `YYYY-MM-DD` | `DateTime` | مقایسه و مرتب‌سازی درست |

هنگام خواندن از Prisma، لایه repository باید این‌ها را به شکل تایپ‌های
`src/types` برگرداند — یعنی تاریخ‌ها دوباره به رشته ISO تبدیل شوند و
`tags` به آرایه رشته صاف شود. سرویس‌ها و کامپوننت‌ها نباید بفهمند چه
اتفاقی افتاده.

## کارهایی که این مهاجرت حل نمی‌کند

- **احراز هویت** هنوز ماک است. ستون `passwordHash` در اسکیما آماده است
  ولی پرشدنش و راستی‌آزمایی‌اش کار جداگانه‌ای است.
- **فایل‌های آپلودی** روی دیسک محلی می‌مانند. برای استقرار چندسروری،
  [`src/lib/media/storage.ts`](../src/lib/media/storage.ts) باید به فضای
  ابری برود.
