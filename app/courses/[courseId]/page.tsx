import type { Metadata } from "next";
import { CourseInfo } from "@/app/ui/course-detail/course-info";
import { EnrollmentCard } from "@/app/ui/course-detail/enrollment-card";
import { CurriculumSection } from "@/app/ui/course-detail/course-curriculum";
import { auth } from "@/auth";
import { getCourseById, getUserCourseRating } from "@/app/lib/data/courses";
import { getCourseCurriculum } from "@/app/lib/data/lessons";
import { WillLearned } from "@/app/ui/course-detail/will-learned";
import { Suspense } from "react";
import { CourseHeroSectionSkeleton, CurriculumSectionSkeleton } from "@/app/ui/skeleton/course-detail";
import { NotFound } from "@/app/ui/course-detail/not-found";

export async function generateMetadata(
  props: { params: Promise<{ courseId: string }> }
): Promise<Metadata> {
  const { courseId } = await props.params;
  const course = await getCourseById(Number(courseId));

  if (!course || course.status !== 'published') {
    return {
      title: "Course Not Found",
      description: "This course could not be found on Learning.",
      robots: { index: false, follow: false },
    };
  }

  const keywords = Array.isArray(course.categories) ? course.categories : [];

  return {
    title: course.name,
    description:
      course.description ??
      `Learn ${course.name} on Learning – ${course.total_lessons} lessons, ${course.total_duration} minutes of content.`,
    keywords,
    openGraph: {
      title: `${course.name} | Learning`,
      description:
        course.description ??
        `Learn ${course.name} on Learning – ${course.total_lessons} lessons, ${course.total_duration} minutes of content.`,
      images: [{ url: "/OG.png", width: 1200, height: 630, alt: course.name }],
    },
  };
}

export default async function PreviewCourseDetailPage(props: { params: Promise<{ courseId: string }> }) {
  // const session = await auth();
  // const userId = session?.user?.id;
  // const userRole = (session?.user as any)?.role;

  const params = await props.params;
  const courseId = params.courseId.toString();
  const course = await getCourseById(Number(courseId));

  if (!course) {
    return <NotFound />
  }

  if (course.status !== 'published') {
    return <NotFound />
  }

  const curriculum = await getCourseCurriculum(Number(courseId));
  const listedLessons = curriculum.flatMap(section => section.lessons);
  const initialRating = null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">

      {/* Course Hero */}
      <Suspense fallback={<CourseHeroSectionSkeleton />}>
        <section className="pt-5 pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Course Info */}
              <CourseInfo course={course} initialRating={initialRating} isGuest={true} />

              {/* Enrollment Card */}
              <EnrollmentCard course={course} isGuest={true} />

            </div>
          </div>
        </section>
      </Suspense>

      <Suspense fallback={<CurriculumSectionSkeleton />}>
        <section className="pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Curriculum */}
                <CurriculumSection curriculum={curriculum} courseId={courseId} isGuest={true} />
              </div>

              {/* What You'll Learn */}
              <WillLearned listedLessons={listedLessons} />

            </div>
          </div>
        </section>
      </Suspense>

    </div >
  );
}
