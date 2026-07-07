import { BookOpen } from 'lucide-react';
import { CourseTitle } from '@/app/ui/courses/title';
import AllCoursesPage from '@/app/courses/page';
import { Suspense } from 'react';
import { CourseCardSkeleton } from '@/app/ui/skeletons';
import { auth } from '@/auth';
import { getEnrolledCourses, getNotEnrolledCourses } from '@/app/lib/data/courses';
import { CourseListContainer } from '@/app/ui/courses/list-container';
import CourseCardEnrolled from '@/app/ui/courses/enrolled-course-card';

export default async function Courses() {
  const session = await auth();

  const userId = session?.user?.id;

  const enrolledCourses = await getEnrolledCourses(userId!);
  const notEnrolledCourses = await getNotEnrolledCourses(userId!);

  return (
    enrolledCourses.length == 0 ? (
      <AllCoursesPage />
    ) : (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <CourseTitle />

          {/* Enrolled Courses */}
          <div className="-mb-20">
            <h2 className="text-xl mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Enrolled Courses
            </h2>

            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CourseCardSkeleton />
                <CourseCardSkeleton />
              </div>
            }>
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrolledCourses.map((course, index) => {
                  return <CourseCardEnrolled key={course.id} course={course} index={index} />;
                })}
              </div> */}
              <CourseCardEnrolled enrolledCourses={enrolledCourses} />
            </Suspense>
          </div>

          {/* Available Courses */}
          <CourseListContainer initialCourses={notEnrolledCourses} />
        </div>
      </div>
    )
  );
}
