<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# قواعد پروژه کاوِنتادور

سند کامل معماری: `docs/architecture.md`

- کامپوننت‌ها هرگز مستقیم از `src/data/` ایمپورت نمی‌کنند؛ فقط از `src/lib/services`.
- کلاس‌های جهت‌دار فیزیکی ممنوع (`ml-` `mr-` `pl-` `pr-` `left-` `right-`
  `text-left` `text-right` `border-l` `border-r`). فقط معادل منطقی
  (`ms-` `me-` `ps-` `pe-` `start-` `end-` `text-start` `text-end` `border-s` `border-e`).
- رنگ خام Tailwind (مثل `bg-gray-900`) ممنوع؛ فقط توکن‌های معنایی `globals.css`.
- اعداد و تاریخ‌ها همیشه از `src/lib/utils/format.ts` عبور می‌کنند.
- Server Component پیش‌فرض؛ `"use client"` فقط برای تعامل واقعی.
- همه متن‌های UI فارسی‌اند.
- قبل از پایان کار: `npm run lint:strict` و `npm run build`.

## تله‌هایی که قبلاً خورده‌ایم

این‌ها نظر نیستند؛ هر کدام یک‌بار وقت گرفته‌اند.

- **`\d` و `\D` ارقام فارسی را عدد نمی‌شمارند.** `"۱۴۰۵".replace(/\D/g,"")`
  رشته را خالی می‌کند. هر عدد باید از `lib/utils/format.ts` بیاید.
- **فایل `"use server"` فقط تابع async صادر می‌کند.** ثابت و تایپ را در
  فایل `*.schema.ts` جدا بگذارید، وگرنه صفحه در زمان اجرا ۵۰۰ می‌دهد
  در حالی که `tsc` و `build` هر دو پاس می‌شوند.
- **نگاشت `Record<string, LucideIcon>` را در زمان رندر صدا نزنید.**
  React Compiler به‌درستی ایراد می‌گیرد؛ به‌جایش کامپوننت با `switch`
  بنویسید (نمونه: `components/shared/category-icon.tsx`).
- **Tailwind v4 از ویژگی `rotate` استفاده می‌کند نه `transform`.** اگر
  چرخش را با `getComputedStyle(el).transform` بسنجید، «none» می‌گیرید.
- **مخزن حافظه‌ای روی `globalThis` می‌ماند.** تغییر فایل‌های `data/` تا
  وقتی امضای محتوا عوض نشود روی مخزن زنده اثر ندارد.
- **`next/og` فرمت woff2 نمی‌پذیرد** — فونت TTF لازم دارد. ضمناً ترتیب
  کلمات فارسی چندکلمه‌ای را قابل اتکا نمی‌چیند.
- **در محیط بدون پنل مرورگر، `requestAnimationFrame` اجرا نمی‌شود** و
  React مرزهای Suspense را آشکار نمی‌کند. اگر صفحه‌ای «فقط اسکلت» دیدید،
  اول `document.hidden` را بررسی کنید نه کد را. همین موضوع **انتقال‌های
  CSS را هم وسط راه یخ می‌زند**: اگر بعد از زدن دکمه تغییر تم، `axe`
  خطای کنتراست داد، تم را با بارگذاری تازه بسنجید نه با کلیک.
- **تم روشن کلاس `light` دارد، نه «نبودِ `dark`».** برداشتن `dark` از
  `<html>` حالتی می‌سازد که اپ هرگز تولیدش نمی‌کند و سنجش رنگ را بی‌معنا
  می‌کند.
- **ورودی `type="file"` پنهان، نام دسترس‌پذیر می‌خواهد.** الگوی «input
  با `sr-only` + دکمه‌ای که `.click()` می‌زند» تخلف `label` می‌دهد؛
  `tabIndex={-1}` و `aria-label` لازم است. اگر داخل `dialog` بسته باشد،
  `axe` نمی‌بیندش و تخلف پنهان می‌ماند.
