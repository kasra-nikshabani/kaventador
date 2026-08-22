import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminSearch } from "@/components/admin/admin-search";
import { DataTable } from "@/components/admin/data-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { Avatar, Badge, buttonStyles, EmptyState, Pagination } from "@/components/ui";
import { deleteUserAction } from "@/lib/actions/content";
import { getUsers } from "@/lib/services";
import { formatDate, formatNumber } from "@/lib/utils";
import type { RawSearchParams } from "@/lib/utils/query";
import {
  USER_ROLE_LABELS,
  USER_STATUS_LABELS,
  type User,
  type UserRole,
  type UserStatus,
} from "@/types";

export const metadata: Metadata = { title: "مدیریت کاربران" };

const ROLE_VARIANT: Record<UserRole, "primary" | "accent" | "neutral"> = {
  admin: "primary",
  instructor: "accent",
  student: "neutral",
};

const STATUS_VARIANT: Record<UserStatus, "success" | "warning" | "danger"> = {
  active: "success",
  inactive: "warning",
  banned: "danger",
};

const ROLES: UserRole[] = ["admin", "instructor", "student"];
const STATUSES: UserStatus[] = ["active", "inactive", "banned"];

function first(value: string | string[] | undefined): string | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw?.trim() || undefined;
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const resolved = await searchParams;

  const role = first(resolved.role);
  const status = first(resolved.status);
  const page = Number.parseInt(first(resolved.page) ?? "1", 10);

  const result = await getUsers({
    page: Number.isFinite(page) && page > 0 ? page : 1,
    pageSize: 10,
    search: first(resolved.q),
    role: ROLES.includes(role as UserRole) ? (role as UserRole) : undefined,
    status: STATUSES.includes(status as UserStatus)
      ? (status as UserStatus)
      : undefined,
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <AdminPageHeader
        title="کاربران"
        description="مدیریت نقش و وضعیت کاربران پلتفرم."
      />

      <AdminSearch
        placeholder="جستجو بر اساس نام یا ایمیل…"
        resultLabel={`${formatNumber(result.total)} کاربر`}
        filters={[
          {
            name: "role",
            label: "فیلتر نقش",
            placeholder: "همه نقش‌ها",
            options: ROLES.map((r) => ({ value: r, label: USER_ROLE_LABELS[r] })),
          },
          {
            name: "status",
            label: "فیلتر وضعیت",
            placeholder: "همه وضعیت‌ها",
            options: STATUSES.map((s) => ({
              value: s,
              label: USER_STATUS_LABELS[s],
            })),
          },
        ]}
      />

      <DataTable<User>
        caption="فهرست کاربران"
        rows={result.items}
        rowKey={(row) => row.id}
        empty={
          <EmptyState
            as="h2"
            title="کاربری پیدا نشد"
            description="با فیلترهای فعلی نتیجه‌ای وجود ندارد."
            action={
              <Link href="/admin/users" className={buttonStyles({ variant: "outline" })}>
                حذف فیلترها
              </Link>
            }
          />
        }
        columns={[
          {
            key: "name",
            header: "کاربر",
            cell: (row) => (
              <span className="flex items-center gap-3">
                <Avatar name={row.name} src={row.avatar} size="sm" />
                <span>
                  <span className="block font-medium">{row.name}</span>
                  <span className="text-subtle block text-xs" dir="ltr">
                    {row.email}
                  </span>
                </span>
              </span>
            ),
          },
          {
            key: "role",
            header: "نقش",
            cell: (row) => (
              <Badge variant={ROLE_VARIANT[row.role]}>{USER_ROLE_LABELS[row.role]}</Badge>
            ),
          },
          {
            key: "status",
            header: "وضعیت",
            cell: (row) => (
              <Badge variant={STATUS_VARIANT[row.status]}>
                {USER_STATUS_LABELS[row.status]}
              </Badge>
            ),
          },
          {
            key: "courses",
            header: "دوره‌ها",
            hideBelow: "md",
            cell: (row) => (
              <span className="text-muted tabular-nums">
                {formatNumber(row.enrolledCourseIds.length)}
              </span>
            ),
          },
          {
            key: "joined",
            header: "تاریخ عضویت",
            hideBelow: "lg",
            cell: (row) => (
              <span className="text-muted whitespace-nowrap">
                {formatDate(row.joinedAt)}
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
                  href={`/admin/users/${row.id}/edit`}
                  className={buttonStyles({ variant: "ghost", size: "sm" })}
                >
                  ویرایش
                </Link>
                <DeleteButton
                  action={deleteUserAction}
                  id={row.id}
                  name={row.name}
                  entityLabel="کاربر"
                />
              </span>
            ),
          },
        ]}
      />

      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        pathname="/admin/users"
        searchParams={resolved}
      />
    </div>
  );
}
