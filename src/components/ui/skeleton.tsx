import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** پلیس‌هولدر بارگذاری — در loading.tsx صفحات استفاده می‌شود. */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("bg-surface-2 animate-pulse rounded-lg", className)}
      {...props}
    />
  );
}
