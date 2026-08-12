import type { Metadata } from "next";
import CourseHeader from '@/app/ui/admin/course/course-header';
import CourseList from '@/app/ui/admin/course/course-list';
import { fetchAllCourses } from '@/app/lib/data/courses';

export const metadata: Metadata = {
  title: "Manage Courses",
  description: "Create, edit, and manage all courses on the Learning platform.",
  robots: { index: false, follow: false },
};

export default async function CourseManagementPage() {
  const courses = await fetchAllCourses();

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <div className="pt-5 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <CourseHeader />

          <CourseList
            initialCourses={courses}
          />
        </div>
      </div>
    </div>
  );
}
