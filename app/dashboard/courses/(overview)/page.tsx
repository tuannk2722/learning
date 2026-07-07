import { BookOpen } from 'lucide-react';
import { CourseTitle } from '@/app/ui/courses/title';
import AllCoursesPage from '@/app/courses/page';
import { auth } from '@/auth';
import { getEnrolledCourses, getNotEnrolledCourses, getTopCategory } from '@/app/lib/data/courses';
import { CourseListContainer } from '@/app/ui/courses/list-container';
import CourseCardEnrolled from '@/app/ui/courses/enrolled-course-card';

export default async function Courses() {
  const session = await auth();

  const userId = session?.user?.id;

  const enrolledCourses = await getEnrolledCourses(userId!);
  const notEnrolledCourses = await getNotEnrolledCourses(userId!);
  const categories = await getTopCategory();

  return (
    enrolledCourses.length == 0 ? (
      <AllCoursesPage />
    ) : (
      <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
        <div className="pt-5 pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            <CourseTitle />

            {/* Enrolled Courses */}
            <div>
              <h2 className="text-xl mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Enrolled Courses
              </h2>
              <CourseCardEnrolled enrolledCourses={enrolledCourses} />
            </div>

            {/* Available Courses */}
            <CourseListContainer initialCourses={notEnrolledCourses} categories={categories} />

          </div>
        </div>
      </div>
    )
  );
}
