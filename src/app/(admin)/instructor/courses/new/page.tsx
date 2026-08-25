import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CourseForm } from "@/components/admin/course-form";
import { saveInstructorCourseAction } from "@/lib/actions/instructor";
import { requireInstructor } from "@/lib/auth/authorize";
import { findAllCategories, findPersonById } from "@/lib/repositories";

export const metadata: Metadata = { title: "دوره جدید" };

export default async function NewInstructorCoursePage() {
  const identity = await requireInstructor();
  const [categories, person] = await Promise.all([
    findAllCategories(),
    findPersonById(identity.personId),
  ]);

  if (!person) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <AdminPageHeader
        title="دوره جدید"
        description="دوره به نام شما ثبت می‌شود؛ پس از ذخیره سرفصل و ویدیو را اضافه کنید."
      />
      <CourseForm
        categories={categories}
        lockedInstructor={person}
        action={saveInstructorCourseAction}
        cancelHref="/instructor"
      />
    </div>
  );
}
