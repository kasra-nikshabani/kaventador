import type { ReactNode } from "react";
import { Breadcrumb, type Crumb } from "@/components/shared/breadcrumb";
import { Container } from "@/components/ui";

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumb?: Crumb[];
  children?: ReactNode;
}

/**
 * سربرگ صفحات داخلی: مسیر ناوبری + عنوان h1 + توضیح.
 * پس‌زمینه شطرنجی ظریف، حس تکنولوژیک برند را تکرار می‌کند.
 */
export function PageHeader({
  title,
  description,
  breadcrumb,
  children,
}: PageHeaderProps) {
  return (
    <section className="border-border bg-surface relative overflow-hidden border-b">
      <div
        aria-hidden="true"
        className="bg-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
      />
      <Container className="relative py-12 sm:py-16">
        {breadcrumb && <Breadcrumb items={breadcrumb} className="mb-5" />}
        <h1 className="text-3xl font-black sm:text-4xl">{title}</h1>
        {description && (
          <p className="text-muted mt-3 max-w-2xl">{description}</p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </Container>
    </section>
  );
}
