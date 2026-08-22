import type { Metadata } from "next";
import { CategoryCard } from "@/components/course";
import { PageHeader } from "@/components/shared";
import { Container } from "@/components/ui";
import { getCategories } from "@/lib/services";

export const metadata: Metadata = {
  title: "دسته‌بندی‌ها",
  description:
    "مسیرهای یادگیری کاوِنتادور بر اساس فناوری: جاوا، جاوااسکریپت، جاوا‌اف‌ایکس، اسپرینگ، ری‌اکت و نکست‌جی‌اس.",
  alternates: { canonical: "/categories" },
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <>
      <PageHeader
        title="مسیرهای یادگیری"
        description="هر مسیر یک فناوری را از پایه تا سطح قابل استخدام پوشش می‌دهد."
        breadcrumb={[{ label: "دسته‌بندی‌ها" }]}
      />

      <Container className="py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              headingLevel="h2"
            />
          ))}
        </div>
      </Container>
    </>
  );
}
