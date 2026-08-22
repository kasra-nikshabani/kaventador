import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ArticleForm } from "@/components/admin/article-form";
import { findAllCategories } from "@/lib/repositories";

export const metadata: Metadata = { title: "مقاله جدید" };

export default async function NewArticlePage() {
  const categories = await findAllCategories();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader title="مقاله جدید" description="مقاله تازه بنویسید و منتشر کنید." />
      <ArticleForm categories={categories} />
    </div>
  );
}
