import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CourseForm } from "@/components/admin/course-form";
import { findAllCategories, findAllPeople } from "@/lib/repositories";

export const metadata: Metadata = { title: "دوره جدید" };

export default async function NewCoursePage() {
  const [categories, people] = await Promise.all([
    findAllCategories(),
    findAllPeople(),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <AdminPageHeader title="دوره جدید" description="اطلاعات پایه دوره را وارد کنید." />
      <CourseForm categories={categories} people={people} />
    </div>
  );
}
