import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ArticleForm } from "@/components/admin/article-form";
import { findAllCategories, findArticleById } from "@/lib/repositories";

export const metadata: Metadata = { title: "ویرایش مقاله" };

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [article, categories] = await Promise.all([
    findArticleById(id),
    findAllCategories(),
  ]);

  if (!article) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader title="ویرایش مقاله" description={article.title} />
      <ArticleForm categories={categories} article={article} />
    </div>
  );
}
