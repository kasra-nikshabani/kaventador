import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminSearch } from "@/components/admin/admin-search";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge, buttonStyles, EmptyState, Pagination } from "@/components/ui";
import { deleteArticleAction } from "@/lib/actions/content";
import { findAllArticles, findAllCategories } from "@/lib/repositories";
import { matchesSearch, paginate } from "@/lib/services/shared";
import { formatCompactNumber, formatDate, formatNumber } from "@/lib/utils";
import { parseQueryParams, type RawSearchParams } from "@/lib/utils/query";
import {
  CONTENT_STATUS_LABELS,
  type Article,
  type ContentStatus,
} from "@/types";

export const metadata: Metadata = { title: "مدیریت مقالات" };

const STATUS_VARIANT: Record<ContentStatus, "success" | "warning" | "neutral"> = {
  published: "success",
  draft: "warning",
  archived: "neutral",
};

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const resolved = await searchParams;
  const query = parseQueryParams(resolved, { pageSize: 10 });

  const [all, categories] = await Promise.all([
    findAllArticles(),
    findAllCategories(),
  ]);

  const categoryTitle = (id: string) =>
    categories.find((item) => item.id === id)?.title ?? "—";

  const filtered = all.filter((article) => {
    if (query.status && article.status !== query.status) return false;
    if (query.categorySlug) {
      const category = categories.find((c) => c.slug === query.categorySlug);
      if (article.categoryId !== category?.id) return false;
    }
    return matchesSearch(query.search, article.title, article.slug, article.excerpt);
  });

  const result = paginate(filtered, query.page, 10);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeader
        title="مقالات"
        description="مدیریت همه مقالات، شامل پیش‌نویس‌ها."
        action={
          <Link href="/admin/articles/new" className={buttonStyles()}>
            <Plus aria-hidden="true" />
            مقاله جدید
          </Link>
        }
      />

      <AdminSearch
        placeholder="جستجو در مقالات…"
        resultLabel={`${formatNumber(result.total)} مقاله`}
        filters={[
          {
            name: "status",
            label: "فیلتر وضعیت",
            placeholder: "همه وضعیت‌ها",
            options: (["published", "draft", "archived"] as const).map((s) => ({
              value: s,
              label: CONTENT_STATUS_LABELS[s],
            })),
          },
          {
            name: "category",
            label: "فیلتر دسته‌بندی",
            placeholder: "همه دسته‌بندی‌ها",
            options: categories.map((c) => ({ value: c.slug, label: c.title })),
          },
        ]}
      />

      <DataTable<Article>
        caption="فهرست مقالات"
        rows={result.items}
        rowKey={(row) => row.id}
        empty={
          <EmptyState
            as="h2"
            title="مقاله‌ای پیدا نشد"
            description="با فیلترهای فعلی نتیجه‌ای وجود ندارد."
            action={
              <Link href="/admin/articles" className={buttonStyles({ variant: "outline" })}>
                حذف فیلترها
              </Link>
            }
          />
        }
        columns={[
          {
            key: "title",
            header: "عنوان",
            cell: (row) => (
              <span>
                <span className="block font-medium">{row.title}</span>
                <span className="text-subtle block text-xs" dir="ltr">
                  {row.slug}
                </span>
              </span>
            ),
          },
          {
            key: "category",
            header: "دسته‌بندی",
            hideBelow: "md",
            cell: (row) => <span className="text-muted">{categoryTitle(row.categoryId)}</span>,
          },
          {
            key: "status",
            header: "وضعیت",
            cell: (row) => (
              <Badge variant={STATUS_VARIANT[row.status]}>
                {CONTENT_STATUS_LABELS[row.status]}
              </Badge>
            ),
          },
          {
            key: "views",
            header: "بازدید",
            hideBelow: "sm",
            cell: (row) => (
              <span className="text-muted tabular-nums">
                {formatCompactNumber(row.viewCount)}
              </span>
            ),
          },
          {
            key: "updated",
            header: "به‌روزرسانی",
            hideBelow: "lg",
            cell: (row) => (
              <span className="text-muted whitespace-nowrap">
                {formatDate(row.updatedAt)}
              </span>
            ),
          },
          {
            key: "actions",
            header: "عملیات",
            align: "end",
            cell: (row) => (
              <span className="flex items-center justify-end gap-1">
                <Link
                  href={`/admin/articles/${row.id}/edit`}
                  className={buttonStyles({ variant: "ghost", size: "sm" })}
                >
                  ویرایش
                </Link>
                <DeleteButton
                  action={deleteArticleAction}
                  id={row.id}
                  name={row.title}
                  entityLabel="مقاله"
                />
              </span>
            ),
          },
        ]}
      />

      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        pathname="/admin/articles"
        searchParams={resolved}
      />
    </div>
  );
}
