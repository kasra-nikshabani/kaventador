import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CurriculumEditor } from "@/components/admin/curriculum-editor";
import { findCourseById } from "@/lib/repositories";

export const metadata: Metadata = { title: "ویرایش سرفصل" };

export default async function CurriculumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await findCourseById(id);

  if (!course) notFound();

  return <CurriculumEditor course={course} basePath="/admin/courses" />;
}
