"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { AdminNavLinks } from "@/components/admin/admin-sidebar";
import { LogoMark } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

/** همان الگوی کشوی سایت اصلی: `<dialog>` بومی، بدون state. */
export function AdminMobileNav({ className }: { className?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-label="باز کردن منوی مدیریت"
        className={cn(
          "border-border text-muted hover:border-border-strong hover:bg-surface-2 hover:text-foreground focus-visible:outline-ring inline-flex size-10 cursor-pointer items-center justify-center rounded-xl border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
          className,
        )}
      >
        <Menu className="size-[1.15rem]" aria-hidden="true" />
      </button>

      <dialog
        ref={dialogRef}
        aria-label="منوی مدیریت"
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
        className="drawer-panel bg-surface border-border shadow-lift ms-auto me-0 my-0 h-dvh max-h-none w-[min(17rem,85vw)] max-w-none border-s p-0"
      >
        <div className="flex h-full flex-col">
          <div className="border-border flex items-center justify-between border-b p-4">
            <span className="flex items-center gap-2.5">
              <LogoMark className="size-8" />
              <span className="text-sm font-black">پنل مدیریت</span>
            </span>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="بستن منو"
              className="text-muted hover:bg-surface-2 hover:text-foreground focus-visible:outline-ring inline-flex size-10 cursor-pointer items-center justify-center rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="ناوبری موبایل مدیریت" className="flex-1 overflow-y-auto p-3">
            <AdminNavLinks />
          </nav>

          <div className="border-border border-t p-3">
            <Link
              href="/"
              className="text-muted hover:bg-surface-2 hover:text-foreground block rounded-xl px-3.5 py-2.5 text-sm transition-colors"
            >
              مشاهده سایت
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
