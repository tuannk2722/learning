import { motion } from 'motion/react';
import { BookOpen, Lock } from 'lucide-react';
import { coursesData } from '@/app/lib/courses';
import { CourseCardEnrolled } from '@/app/ui/courses/enrolled-course-card';
import { CourseCardAvailable } from '@/app/ui/courses/available-course-card';
import { CourseTitle } from '@/app/ui/courses/title';
import AllCoursesPage from '@/app/courses/page';
import { Suspense } from 'react';
import { CourseCardSkeleton } from '@/app/ui/skeletons';

export default function Courses() {
  const isNewUser = false;

  return (
    isNewUser ? (
      <AllCoursesPage />
    ) : (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <CourseTitle />

          {/* Enrolled Courses */}
          <div className="mb-12">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coursesData.filter(c => c.enrolled).map((course, index) => {
                  return <CourseCardEnrolled key={course.id} course={course} index={index} />;
                })}
              </div>
            </Suspense>
          </div>

          {/* Available Courses */}
          <div>
            <h2 className="text-xl mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Available Courses
            </h2>

            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CourseCardSkeleton />
                <CourseCardSkeleton />
                <CourseCardSkeleton />
              </div>
            }>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coursesData.filter(c => !c.enrolled).map((course, index) => {
                  return <CourseCardAvailable key={course.id} course={course} index={index} />;
                })}
              </div>
            </Suspense>
          </div>
        </div>
      </div>)
  );
}
