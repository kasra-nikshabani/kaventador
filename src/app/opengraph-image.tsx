import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { siteConfig } from "@/config/site";

/**
 * تصویر Open Graph پیش‌فرض سایت.
 *
 * روی سرور و در زمان build ساخته می‌شود، نه با ابزار طراحی — پس با هر
 * تغییر نام یا شعار برند خودکار به‌روز می‌شود و هیچ‌وقت کهنه نمی‌ماند.
 *
 * فونت باید صریح بارگذاری شود؛ محیط رندر تصویر به فونت‌های سایت
 * دسترسی ندارد و بدون آن، متن فارسی به مربع تبدیل می‌شود.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;

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

export default async function OpengraphImage() {
  const font = await loadFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          background: "#12191c",
          backgroundImage:
            "radial-gradient(circle at 50% 0%, #1d3b3a 0%, #12191c 60%)",
          color: "#f2f6f6",
          direction: "rtl",
        }}
      >
        {/* نشان برند */}
        <svg width="96" height="96" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r="20.4"
            fill="none"
            stroke="#f2f6f6"
            strokeWidth="3.2"
          />
          <path d="M16.2 13.2h4.6v21.6h-4.6z" fill="#f2f6f6" />
          <path d="M33.9 13.2h-6.1l-9.4 9.9 3.1 3.2z" fill="#5eead4" />
          <path d="M33.9 34.8h-6.1l-9.4-9.9 3.1-3.2z" fill="#f2f6f6" />
          <rect x="35.4" y="29.6" width="4.2" height="5.2" fill="#5eead4" />
        </svg>

        <div style={{ fontSize: 66, fontWeight: 700, letterSpacing: -1 }}>
          {siteConfig.name}
        </div>

        {/* عمداً هیچ عبارت فارسی چندکلمه‌ای اینجا نیست.
            Satori (موتور تصویر next/og) ترتیب کلمات راست‌به‌چپ را قابل
            اتکا نمی‌چیند و گاهی معکوس یا نشانه‌گذاری را جابه‌جا می‌کند؛
            سه راه‌حل CSS آزموده شد و هیچ‌کدام جواب نداد. نام برند
            تک‌کلمه است و درست رندر می‌شود، فهرست لاتین هم مشکلی ندارد. */}
        <div style={{ fontSize: 26, color: "#9fb3b3", direction: "ltr" }}>
          kaventador.ir
        </div>

        <div
          style={{
            marginTop: 12,
            display: "flex",
            gap: 14,
            fontSize: 22,
            color: "#5eead4",
            direction: "ltr",
          }}
        >
          <span>Java</span>
          <span>·</span>
          <span>Spring</span>
          <span>·</span>
          <span>JavaScript</span>
          <span>·</span>
          <span>React</span>
          <span>·</span>
          <span>Next.js</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Vazirmatn", data: font, style: "normal", weight: 700 }],
    },
  );
}
