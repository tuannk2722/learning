import type { Metadata } from "next";
import { BookOpen } from 'lucide-react';
import { CourseTitle } from '@/app/ui/courses/title';
import { auth } from '@/auth';
import {
  getEnrolledCourses,
  getNotEnrolledCourses,
  getTopCategory,
  getUserInterestTags,
  getRecommendedCourses,
} from '@/app/lib/data/courses';
import { CourseListContainer } from '@/app/ui/courses/list-container';
import CourseCardEnrolled from '@/app/ui/courses/enrolled-course-card';

export const metadata: Metadata = {
  title: "My Courses",
  description: "Browse your enrolled courses and discover new ones tailored to your interests on Learning.",
  robots: { index: false, follow: false },
};

export default async function Courses() {
  const session = await auth();
  const userId = session?.user?.id;

  const [enrolledCourses, notEnrolledCourses, categories, interestTags] = await Promise.all([
    getEnrolledCourses(userId!),
    getNotEnrolledCourses(userId!),
    getTopCategory(),
    getUserInterestTags(userId!),
  ]);

  const recommendedCourses = await getRecommendedCourses(userId!, interestTags, 6);

  // Combine recommended courses first, then remaining notEnrolled courses
  const recIds = new Set(recommendedCourses.map((c) => c.id));
  const isPersonalized = interestTags.length > 0;

  const recommendedList = recommendedCourses.map((c) => ({
    ...c,
    is_recommended: isPersonalized,
  }));

  const remainingNotEnrolled = notEnrolledCourses
    .filter((c) => !recIds.has(c.id))
    .map((c) => ({
      ...c,
      is_recommended: false,
    }));

  const availableCourses = [...recommendedList, ...remainingNotEnrolled];

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <div className="pt-5 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {enrolledCourses.length > 0 && (
            <>
              <CourseTitle />

              {/* Enrolled Courses */}
              <div>
                <h2 className="text-xl mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Enrolled Courses
                </h2>
                <CourseCardEnrolled enrolledCourses={enrolledCourses} />
              </div>
            </>
          )}

          {/* Available Courses (Recommended + Not Enrolled merged) */}
          {availableCourses.length > 0 && (
            <CourseListContainer initialCourses={availableCourses} categories={categories} />
          )}

        </div>
      </div>
    </div>
  );
}
