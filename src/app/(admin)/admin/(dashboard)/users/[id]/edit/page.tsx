import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { UserForm } from "@/components/admin/user-form";
import { findUserById } from "@/lib/repositories";

export const metadata: Metadata = { title: "ویرایش کاربر" };

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await findUserById(id);

  if (!user) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader title="ویرایش کاربر" description={user.name} />
      <UserForm user={user} />
    </div>
  );
}
