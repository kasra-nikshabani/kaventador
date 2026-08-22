import type { ReactNode } from "react";

export interface AdminPageHeaderProps {
  title: string;
  description?: string;
  /** دکمه اقدام اصلی، مثلاً «دوره جدید». */
  action?: ReactNode;
}

export function AdminPageHeader({
  title,
  description,
  action,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-black">{title}</h1>
        {description && (
          <p className="text-muted mt-1.5 text-sm">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
