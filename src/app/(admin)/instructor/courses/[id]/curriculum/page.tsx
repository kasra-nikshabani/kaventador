import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CurriculumEditor } from "@/components/admin/curriculum-editor";
import { requireCourseAccess } from "@/lib/auth/authorize";
import { findCourseById } from "@/lib/repositories";

export const metadata: Metadata = { title: "سرفصل و ویدیو" };

export default async function InstructorCurriculumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireCourseAccess(id);

  const course = await findCourseById(id);
  if (!course) notFound();

  return <CurriculumEditor course={course} basePath="/instructor/courses" />;
}
