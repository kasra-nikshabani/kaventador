import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  /** آخرین آیتم مسیر نباید href داشته باشد. */
  href?: string;
}

export interface BreadcrumbProps {
  items: Crumb[];
  className?: string;
}

/**
 * مسیر ناوبری.
 * جداکننده عمداً `ChevronLeft` است چون در چیدمان راست‌به‌چپ،
 * جهت پیشروی خواندن به سمت چپ است.
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="مسیر ناوبری" className={className}>
      <ol className="text-muted flex flex-wrap items-center gap-1.5 text-sm">
        <li>
          <Link
            href="/"
            className="hover:text-primary focus-visible:outline-ring rounded transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            خانه
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={`${item.label}-${index}`}>
              <li aria-hidden="true" className="text-subtle flex items-center">
                <ChevronLeft className="size-4" />
              </li>
              <li>
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="hover:text-primary focus-visible:outline-ring rounded transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current="page"
                    className={cn("text-foreground font-medium")}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
