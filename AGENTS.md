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
- قبل از پایان کار: `npx eslint src --max-warnings=0` و `npm run build`.
