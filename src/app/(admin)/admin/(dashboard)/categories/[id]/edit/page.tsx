import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CategoryForm } from "@/components/admin/category-form";
import { findCategoryById } from "@/lib/repositories";

export const metadata: Metadata = { title: "ویرایش دسته‌بندی" };

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await findCategoryById(id);

  if (!category) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        title="ویرایش دسته‌بندی"
        description={category.title}
      />
      <CategoryForm category={category} />
    </div>
  );
}
