<div dir="rtl">

# کاوِنتادور

پلتفرم آموزش پروژه‌محور برنامه‌نویسی به زبان فارسی — جاوا، اسپرینگ،
جاوااسکریپت، جاوا‌اف‌ایکس، ری‌اکت و نکست‌جی‌اس.

سایت کامل RTL است، تم تیره و روشن دارد، و یک پنل مدیریت برای اداره
دوره‌ها، سرفصل‌ها، ویدیوها، مقالات و کاربران.

## راه‌اندازی

```bash
npm install
cp .env.example .env
docker-compose up -d      # PostgreSQL روی پورت ۵۴۳۴
npm run db:migrate        # ساخت جدول‌ها
npm run db:seed           # پرکردن از داده نمونه
npm run dev
```

سایت روی <http://localhost:3001> بالا می‌آید (پورت در
`.claude/launch.json` تنظیم شده).

### بدون دیتابیس

اگر فقط می‌خواهید سایت را ببینید، `DATA_SOURCE=mock` بگذارید و مستقیم
`npm run dev` بزنید. داده از حافظه خوانده می‌شود و با هر ری‌استارت به
حالت اولیه برمی‌گردد — برای دمو خوب است، برای کار واقعی نه.

### حساب مدیر نمونه

نام کاربری `admin`. رمز عبور در مخزن نیست — هش‌شده ذخیره شده است. برای
محیط خودتان با `ADMIN_PASSWORD` یک رمز تازه بدهید و `npm run db:seed`
بزنید، یا هش را با اسکریپت خودتان جایگزین کنید.

## دستورها

| دستور | کار |
| --- | --- |
| `npm run dev` | سرور توسعه |
| `npm run build` | ساخت نسخه تولیدی |
| `npm run lint:strict` | ESLint بدون تحمل هیچ اخطار |
| `npm run typecheck` | بررسی نوع بدون تولید خروجی |
| `npm run db:generate` | تولید کلاینت Prisma |
| `npm run db:migrate` | اجرای مهاجرت دیتابیس |
| `npm run db:seed` | پرکردن دیتابیس از داده نمونه (اول همه‌چیز را پاک می‌کند) |
| `npm run db:studio` | مرورگر گرافیکی داده |
| `docker-compose up -d` | بالا آوردن PostgreSQL |
| `docker-compose down -v` | خاموش‌کردن و پاک‌کردن کامل داده |

## معماری در یک نگاه

```
کامپوننت‌ها  →  lib/services  →  lib/repositories  →  data/*.mock.ts
                                        ↑
                           تنها لایه‌ای که منبع داده را می‌شناسد
```

`lib/repositories/contracts.ts` شکل این لایه را قرارداد کرده و
پیاده‌سازی با `satisfies` به آن گره خورده؛ پس انحراف امضا خطای کامپایل
می‌دهد نه خطای زمان اجرا.

سند کامل: [`docs/architecture.md`](docs/architecture.md)
مسیر مهاجرت به دیتابیس: [`docs/database-migration.md`](docs/database-migration.md)
وضعیت و کارهای باقی‌مانده: [`docs/status.md`](docs/status.md)

## پشته فناوری

Next.js ۱۶ (App Router) · React ۱۹ · TypeScript · Tailwind CSS v4 ·
zod · Prisma (آماده، هنوز وصل نشده)

## قواعد پروژه

این‌ها سلیقه نیستند؛ رعایت نکردنشان چیزی را خراب می‌کند:

- **هیچ کلاس جهت‌دار فیزیکی**: `ml-` `mr-` `pl-` `pr-` `left-` `right-`
  `text-left` `text-right` ممنوع. فقط معادل منطقی (`ms-` `me-` `ps-`
  `pe-` `start-` `end-` `text-start` `text-end`).
- **هیچ رنگ خام Tailwind**: فقط توکن‌های معنایی `globals.css`.
- **هر عدد و تاریخ از `lib/utils/format.ts` عبور می‌کند** — وگرنه ارقام
  لاتین در متن فارسی ظاهر می‌شود.
- **کامپوننت‌ها هرگز مستقیم از `data/` ایمپورت نمی‌کنند.**
- **Server Component پیش‌فرض**؛ `"use client"` فقط برای تعامل واقعی.
- قبل از پایان هر کار: `npm run lint:strict` و `npm run build`.

</div>
