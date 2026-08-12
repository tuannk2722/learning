import type { Metadata } from "next";
import CourseBuilderClient from '@/app/ui/admin/course/course-builder/course-builder-client';

export const metadata: Metadata = {
  title: "Create Course | Admin",
  description: "Create a new course on Learning.",
  robots: { index: false, follow: false },
};

export default async function CreateCoursePage() {
  return <CourseBuilderClient />;
}
