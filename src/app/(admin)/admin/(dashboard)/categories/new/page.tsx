import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CategoryForm } from "@/components/admin/category-form";

export const metadata: Metadata = { title: "دسته‌بندی جدید" };

export default function NewCategoryPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <AdminPageHeader
        title="دسته‌بندی جدید"
        description="یک مسیر یادگیری تازه به کاوِنتادور اضافه کنید."
      />
      <CategoryForm />
    </div>
  );
}
