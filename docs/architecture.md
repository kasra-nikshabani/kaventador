# معماری پروژه کاوِنتادور

سند مرجع تصمیم‌های فنی. قبل از افزودن هر قابلیت جدید، این سند را بخوانید.

## استک

| لایه | انتخاب |
| --- | --- |
| فریم‌ورک | Next.js 16 (App Router) + React 19 |
| زبان | TypeScript (strict) |
| استایل | Tailwind CSS v4 (پیکربندی CSS-first در `globals.css`) |
| فونت | Vazirmatn variable، محلی از `src/assets/fonts` |
| آیکون | lucide-react |
| تم | next-themes با استراتژی کلاس |

## لایه‌بندی داده

```
کامپوننت‌ها  →  lib/services  →  lib/repositories  →  data/*.mock.ts
```

قواعد الزامی:

1. کامپوننت‌ها **هرگز** مستقیم از `data/` import نمی‌کنند.
2. همه توابع لایه سرویس **`async`** هستند، حتی وقتی داده mock همگام است.
   نتیجه: مهاجرت به دیتابیس واقعی فقط `lib/repositories` را تغییر می‌دهد.
3. تایپ‌های دامنه در `src/types` تعریف می‌شوند و منبع حقیقت‌اند.
4. شکل لایه داده در `lib/repositories/contracts.ts` قرارداد شده و
   پیاده‌سازی با `satisfies` به آن گره خورده است؛ انحراف امضا خطای
   کامپایل می‌دهد نه خطای زمان اجرا.

مسیر عملی مهاجرت: [`docs/database-migration.md`](./database-migration.md)

## پیکربندی محیط

- `src/config/env.ts` — متغیرهای عمومی (در باندل مرورگر دیده می‌شوند).
- `src/lib/config/server-env.ts` — متغیرهای سروری، با `import "server-only"`
  که مانع نشت تصادفی به کلاینت می‌شود.

هر دو با zod اعتبارسنجی می‌شوند و مقدار نامعتبر **همان ابتدا** شکست
می‌دهد، نه وسط کار کاربر. نمونه کامل: [`.env.example`](../.env.example)

## قواعد RTL

- `<html lang="fa" dir="rtl">` در `src/app/layout.tsx`.
- کلاس‌های جهت‌دار فیزیکی **ممنوع**: `ml-` `mr-` `pl-` `pr-` `left-` `right-`
  `text-left` `text-right` `border-l` `border-r`.
- معادل منطقی **الزامی**: `ms-` `me-` `ps-` `pe-` `start-` `end-`
  `text-start` `text-end` `border-s` `border-e`.
- اعداد و تاریخ‌ها همیشه از `lib/utils/format.ts` عبور می‌کنند.
- بلوک‌های کد و مقادیر انگلیسی با `dir="ltr"` علامت‌گذاری می‌شوند.

## سیستم طراحی

توکن‌ها در `src/app/globals.css` تعریف شده‌اند و دو نسخه دارند (`:root` و `.dark`).

**قاعده:** هیچ کامپوننتی رنگ خام Tailwind (مثل `bg-gray-900`) نمی‌گیرد.
فقط توکن‌های معنایی: `background` `surface` `surface-2` `surface-3`
`foreground` `muted` `subtle` `border` `border-strong`
`primary` `accent` `success` `warning` `danger`.

ابزارهای اختصاصی: `text-gradient`، `bg-grid`، `skip-link`.

## ساختار پوشه‌ها

```
src/
├─ app/
│  ├─ (site)/     صفحات عمومی — لِی‌اوت با هدر و فوتر
│  ├─ (admin)/    پنل ادمین در مسیر /admin — لِی‌اوت سایدبار
│  └─ layout.tsx  ریشه: lang/dir/font/theme/metadata
├─ components/
│  ├─ ui/         پرایمیتیوهای بی‌طرف و بدون منطق دامنه
│  ├─ layout/     هدر، فوتر، ناوبری، سوییچ تم
│  ├─ shared/     اجزای مشترک بین بخش‌ها
│  ├─ home|course|blog|admin/   کامپوننت‌های مخصوص هر حوزه
│  └─ providers/  کانتکست‌های کلاینتی
├─ lib/
│  ├─ services/     API مصرفی UI
│  ├─ repositories/ نقطه تعویض mock ↔ دیتابیس
│  ├─ utils/        cn، فرمت فارسی، slugify
│  ├─ seo/          سازنده متادیتا و JSON-LD
│  └─ constants/    ثابت‌های سراسری
├─ data/     داده‌های mock تایپ‌شده
├─ types/    تایپ‌های دامنه
├─ config/   پیکربندی برند و منوها
└─ assets/   فونت‌ها
```

## قواعد کدنویسی

1. **Server Component پیش‌فرض**؛ `"use client"` فقط برای تعامل واقعی.
2. HTML معنایی و سلسله‌مراتب درست عنوان‌ها (`h1` یکتا در هر صفحه).
3. هر صفحه `generateMetadata` مخصوص خودش دارد.
4. دسترس‌پذیری: skip-link، `focus-visible` واضح، `aria-label` فارسی، کنتراست AA.
5. نام فایل‌ها kebab-case؛ نام کامپوننت‌ها PascalCase.
