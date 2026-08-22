import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { default: "پنل مدیریت", template: "%s | پنل مدیریت کاوِنتادور" },
  /* پنل هرگز نباید ایندکس شود. */
  robots: { index: false, follow: false, nocache: true },
};

/** پوسته پنل ادمین — عمداً بدون هدر و فوتر سایت اصلی. */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return children;
}
