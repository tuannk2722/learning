import { LessonContent } from "@/app/ui/courses/course-detail/lesson-detail/lesson-content";
import { LessonDetailHeader } from "@/app/ui/courses/course-detail/lesson-detail/lesson-header";
import { LessonNote } from "@/app/ui/courses/course-detail/lesson-detail/lesson-note";
import { getCourseCurriculum, getLessonDetail } from "@/app/lib/data/lessons";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { CurriculumSection } from "@/app/ui/courses/course-detail/course-curriculum";

export default async function LessonDetailPage(props: { params: Promise<{ courseId: string, lessonId: string }> }) {
  const session = await auth();
  const userId = session?.user?.id;
  const { courseId, lessonId } = await props.params;

  const lesson = await getLessonDetail(Number(lessonId), userId);
  console.log(lesson);

  if (!lesson) {
    return notFound();
  }

  const curriculum = await getCourseCurriculum(Number(courseId), userId);
  // console.log(curriculum);

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <div className="pt-24">
        {/* Lesson Header */}
        <LessonDetailHeader lesson={lesson} />

        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2">
                {/* Lesson Content */}
                <LessonContent lesson={lesson} courseId={courseId} lessonId={lessonId} />
              </div>

              {/* Curriculum */}
              <div className="lg:col-span-1 sticky top-32">
                <CurriculumSection curriculum={curriculum} courseId={courseId} activeLessonId={lessonId} />
              </div>

            </div>
          </div>
        </section>

        {/* Lesson Note */}
        <LessonNote />
      </div>
    </div>
  );
}

