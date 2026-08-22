import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CourseForm } from "@/components/admin/course-form";
import { buttonStyles } from "@/components/ui";
import {
  findAllCategories,
  findAllPeople,
  findCourseById,
} from "@/lib/repositories";

export const metadata: Metadata = { title: "ویرایش دوره" };

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [course, categories, people] = await Promise.all([
    findCourseById(id),
    findAllCategories(),
    findAllPeople(),
  ]);

  if (!course) notFound();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <AdminPageHeader
        title="ویرایش دوره"
        description={course.title}
        action={
          <Link
            href={`/admin/courses/${course.id}/curriculum`}
            className={buttonStyles({ variant: "outline" })}
          >
            ویرایش سرفصل و ویدیوها
          </Link>
        }
      />
      <CourseForm categories={categories} people={people} course={course} />
    </div>
  );
}
