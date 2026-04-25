import Link from "next/link";
import { CourseInfo } from "@/app/ui/courses/course-detail/course-info";
import { EnrollmentCard } from "@/app/ui/courses/course-detail/enrollment-card";
import { CurriculumSection } from "@/app/ui/courses/course-detail/course-curriculum";
import { auth } from "@/auth";
import { getCourseById } from "@/app/lib/data/courses";
import { getCourseCurriculum } from "@/app/lib/data/lessons";
import { WillLearned } from "@/app/ui/courses/course-detail/will-learned";

export default async function CourseDetailPage(props: { params: Promise<{ courseId: string }> }) {
  const session = await auth();
  const userId = session?.user?.id;

  const params = await props.params;
  const courseId = params.courseId.toString();
  const course = await getCourseById(courseId, userId);
  // console.log(course);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <Link href="/dashboard/courses" className="text-violet-600 hover:text-violet-700">
            Return to Courses
          </Link>
        </div>
      </div>
    );
  }

  const curriculum = await getCourseCurriculum(Number(courseId), userId);
  // console.log(curriculum);

  const listedLessons = curriculum.flatMap(section => section.lessons);
  // console.log(listedLessons);

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">

      {/* Course Hero */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <CourseInfo course={course} />

            {/* Enrollment Card */}
            <EnrollmentCard course={course} />

          </div>
        </div>
      </section>

      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Curriculum */}
              <CurriculumSection curriculum={curriculum} courseId={courseId} />
            </div>

            {/* What You'll Learn */}
            <WillLearned listedLessons={listedLessons} />

          </div>
        </div>
      </section>
    </div>
  );
}
