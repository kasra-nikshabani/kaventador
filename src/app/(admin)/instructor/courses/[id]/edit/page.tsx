import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CourseForm } from "@/components/admin/course-form";
import { saveInstructorCourseAction } from "@/lib/actions/instructor";
import { requireCourseAccess, requireInstructor } from "@/lib/auth/authorize";
import {
  findAllCategories,
  findCourseById,
  findPersonById,
} from "@/lib/repositories";

export const metadata: Metadata = { title: "ویرایش دوره" };

export default async function EditInstructorCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const identity = await requireInstructor();
  await requireCourseAccess(id);

  const [course, categories, person] = await Promise.all([
    findCourseById(id),
    findAllCategories(),
    findPersonById(identity.personId),
  ]);

  if (!course || !person) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader title="ویرایش دوره" description={course.title} />
      <CourseForm
        categories={categories}
        course={course}
        lockedInstructor={person}
        action={saveInstructorCourseAction}
        cancelHref="/instructor"
      />
    </div>
  );
}
