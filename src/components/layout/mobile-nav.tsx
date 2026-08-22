"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Logo } from "@/components/layout/logo";
import { NavLinks } from "@/components/layout/nav-links";
import { buttonStyles } from "@/components/ui";
import { cn } from "@/lib/utils";

/**
 * کشوی ناوبری موبایل.
 *
 * روی `<dialog>` بومی ساخته شده تا سه چیز را مرورگر تضمین کند:
 * محبوس‌سازی فوکوس، بستن با Esc، و غیرفعال‌شدن پس‌زمینه.
 * چون به state نیازی نیست، هیچ رندر اضافه‌ای هم رخ نمی‌دهد.
 */
export function MobileNav({ className }: { className?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  /* با هر تغییر مسیر، کشو بسته شود. */
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-label="باز کردن منو"
        className={cn(
          "border-border text-muted hover:border-border-strong hover:bg-surface-2 hover:text-foreground focus-visible:outline-ring inline-flex size-10 cursor-pointer items-center justify-center rounded-xl border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
          className,
        )}
      >
        <Menu className="size-[1.15rem]" aria-hidden="true" />
      </button>

      <dialog
        ref={dialogRef}
        aria-label="منوی اصلی"
        /* کلیک روی ناحیه بیرون پنل (خود dialog) کشو را می‌بندد. */
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
        /* `ms-auto` پنل را به انتهای محور (چپ در RTL) می‌چسباند،
           پس لبه دیدنی‌اش سمت start است. */
        className="drawer-panel bg-surface border-border shadow-lift ms-auto me-0 my-0 h-dvh max-h-none w-[min(20rem,85vw)] max-w-none border-s p-0"
      >
        <div className="flex h-full flex-col">
          <div className="border-border flex items-center justify-between border-b p-4">
            <Logo />
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="بستن منو"
              className="text-muted hover:bg-surface-2 hover:text-foreground focus-visible:outline-ring inline-flex size-10 cursor-pointer items-center justify-center rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="ناوبری موبایل" className="flex-1 overflow-y-auto p-4">
            <NavLinks orientation="vertical" />
          </nav>

          <div className="border-border border-t p-4">
            <Link href="/courses" className={buttonStyles({ fullWidth: true })}>
              شروع یادگیری
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
