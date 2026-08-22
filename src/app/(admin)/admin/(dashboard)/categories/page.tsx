import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { CategoryIcon } from "@/components/shared";
import { Badge, buttonStyles } from "@/components/ui";
import { deleteCategoryAction } from "@/lib/actions/content";
import { getCategories } from "@/lib/services";
import { formatNumber } from "@/lib/utils";
import type { CategoryWithStats } from "@/types";

export const metadata: Metadata = { title: "مدیریت دسته‌بندی‌ها" };

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeader
        title="دسته‌بندی‌ها"
        description={`${formatNumber(categories.length)} دسته‌بندی فعال`}
        action={
          <Link href="/admin/categories/new" className={buttonStyles()}>
            <Plus aria-hidden="true" />
            دسته‌بندی جدید
          </Link>
        }
      />

      <DataTable<CategoryWithStats>
        caption="فهرست دسته‌بندی‌ها"
        rows={categories}
        rowKey={(row) => row.id}
        columns={[
          {
            key: "title",
            header: "عنوان",
            cell: (row) => (
              <span className="flex items-center gap-3">
                <span className="bg-surface-2 flex size-9 shrink-0 items-center justify-center rounded-lg">
                  <CategoryIcon
                    icon={row.icon}
                    className="size-4"
                    style={{ color: row.color }}
                  />
                </span>
                <span>
                  <span className="block font-medium">{row.title}</span>
                  <span className="text-subtle block text-xs" dir="ltr">
                    {row.slug}
                  </span>
                </span>
              </span>
            ),
          },
          {
            key: "titleEn",
            header: "نام انگلیسی",
            hideBelow: "md",
            cell: (row) => (
              <span className="text-muted" dir="ltr">
                {row.titleEn}
              </span>
            ),
          },
          {
            key: "counts",
            header: "محتوا",
            hideBelow: "sm",
            cell: (row) => (
              <span className="text-muted whitespace-nowrap">
                {formatNumber(row.courseCount)} دوره ·{" "}
                {formatNumber(row.articleCount)} مقاله
              </span>
            ),
          },
          {
            key: "order",
            header: "ترتیب",
            hideBelow: "lg",
            cell: (row) => <Badge variant="neutral">{formatNumber(row.order)}</Badge>,
          },
          {
            key: "actions",
            header: "عملیات",
            align: "end",
            cell: (row) => (
              <span className="flex items-center justify-end gap-1">
                <Link
                  href={`/admin/categories/${row.id}/edit`}
                  className={buttonStyles({ variant: "ghost", size: "sm" })}
                >
                  ویرایش
                </Link>
                <DeleteButton
                  action={deleteCategoryAction}
                  id={row.id}
                  name={row.title}
                  entityLabel="دسته‌بندی"
                />
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
