import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { siteConfig } from "@/config/site";

/**
 * قالب مشترک تصاویر Open Graph.
 *
 * سه صفحه از این استفاده می‌کنند (سایت، دوره، مقاله)، پس چیدمان یک‌بار
 * اینجا تعریف می‌شود. تکرارش در هر مسیر یعنی سه جا برای از هم پاشیدن.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const INK = "#f2f6f6";
const MUTED = "#9fb3b3";
const ACCENT = "#5eead4";

/**
 * فونت تصاویر OG.
 *
 * عمداً TTF است نه woff2: تولیدکننده تصویر `next/og` فقط TTF، OTF و
 * WOFF را می‌فهمد و با woff2 خطای «Unsupported OpenType signature»
 * می‌دهد. این فایل فقط روی سرور خوانده می‌شود و به مرورگر نمی‌رود،
 * پس حجم بیشترش هزینه‌ای برای کاربر ندارد.
 */
async function loadFont() {
  return readFile(
    path.join(process.cwd(), "src/assets/fonts/Vazirmatn-Bold.ttf"),
  );
}

export interface OgCardOptions {
  /** برچسب کوچک بالای عنوان — مثلاً نام دسته‌بندی. */
  eyebrow?: string;
  title: string;
  /** خط پایین کارت — مدرس، مدت، یا هر فراداده کوتاه. */
  meta?: string;
}

export async function renderOgCard({ eyebrow, title, meta }: OgCardOptions) {
  const font = await loadFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#12191c",
          backgroundImage:
            "radial-gradient(circle at 85% 0%, #1d3b3a 0%, #12191c 55%)",
          color: INK,
          direction: "rtl",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="52" height="52" viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r="20.4"
              fill="none"
              stroke={INK}
              strokeWidth="3.2"
            />
            <path d="M16.2 13.2h4.6v21.6h-4.6z" fill={INK} />
            <path d="M33.9 13.2h-6.1l-9.4 9.9 3.1 3.2z" fill={ACCENT} />
            <path d="M33.9 34.8h-6.1l-9.4-9.9 3.1-3.2z" fill={INK} />
            <rect x="35.4" y="29.6" width="4.2" height="5.2" fill={ACCENT} />
          </svg>
          <span style={{ fontSize: 30, fontWeight: 700 }}>
            {siteConfig.name}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {eyebrow && (
            <span style={{ fontSize: 26, color: ACCENT }}>{eyebrow}</span>
          )}
          {/* عنوان بلند بریده می‌شود تا از کادر بیرون نزند. */}
          <span style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.35 }}>
            {title.length > 70 ? `${title.slice(0, 70)}…` : title}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: MUTED,
          }}
        >
          <span>{meta ?? "یادگیری پروژه‌محور برنامه‌نویسی"}</span>
          <span style={{ direction: "ltr" }}>kaventador</span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [{ name: "Vazirmatn", data: font, style: "normal", weight: 700 }],
    },
  );
}
