import { LessonContent } from "@/app/ui/courses/course-detail/lesson-detail/lesson-content";
import { LessonDetailHeader } from "@/app/ui/courses/course-detail/lesson-detail/lesson-header";
import { LessonNote } from "@/app/ui/courses/course-detail/lesson-detail/lesson-note";
import { getCourseCurriculum, getLessonDetail, getLessonNote } from "@/app/lib/data/lessons";
import { getUserCourseRating } from "@/app/lib/data/courses";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { CurriculumSection } from "@/app/ui/courses/course-detail/course-curriculum";
import { completeLesson } from "@/app/lib/actions/lesson";
import { Suspense } from "react";
import { LessonContentSkeleton, LessonDetailHeaderSkeleton, LessonNoteSkeleton } from "@/app/ui/skeleton/lesson";
import { CurriculumSkeleton } from "@/app/ui/skeleton/course-detail";

export default async function LessonDetailPage(props: { params: Promise<{ courseId: string, lessonId: string }> }) {
  const session = await auth();
  const userId = session?.user?.id;
  const { courseId, lessonId } = await props.params;

  if (!userId) {
    return notFound();
  }

  const lesson = await getLessonDetail(Number(lessonId), userId);

  if (!lesson) {
    return notFound();
  }

  const curriculum = await getCourseCurriculum(Number(courseId), userId);
  const initialNoteContent = await getLessonNote(Number(lessonId), userId);
  const initialRating = await getUserCourseRating(Number(courseId), userId);

  const handleCompleteLesson = async () => {
    "use server";
    return await completeLesson(lessonId, userId);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <div className="pt-24">
        {/* Lesson Header */}
        <Suspense fallback={<LessonDetailHeaderSkeleton />}>
          <LessonDetailHeader lesson={lesson} initialRating={initialRating} />
        </Suspense>

        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2">
                {/* Lesson Content */}
                <Suspense fallback={<LessonContentSkeleton />}>
                  <LessonContent lesson={lesson} courseId={courseId} lessonId={lessonId} onComplete={handleCompleteLesson} isAlreadyCompleted={lesson.isCompleted} />
                </Suspense>
              </div>

              {/* Curriculum */}
              <div className="lg:col-span-1 sticky top-32">
                <Suspense fallback={<CurriculumSkeleton />}>
                  <CurriculumSection curriculum={curriculum} courseId={courseId} activeLessonId={lessonId} />
                </Suspense>
              </div>

            </div>
          </div>
        </section>

        {/* Lesson Note */}
        <Suspense fallback={<LessonNoteSkeleton />}>
          <LessonNote lessonId={lessonId} initialContent={initialNoteContent} />
        </Suspense>
      </div>
    </div>
  );
}
