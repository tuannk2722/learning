import { LessonContent } from "@/app/ui/lesson/lesson-content";
import { LessonNote } from "@/app/ui/lesson/lesson-note";
import { getCourseCurriculum, getLessonDetail, getLessonNote } from "@/app/lib/data/lessons";
import { getCourseStatus } from "@/app/lib/data/courses";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { CurriculumSection } from "@/app/ui/course-detail/course-curriculum";
import { completeLesson } from "@/app/lib/actions/lesson";
import { Suspense } from "react";
import { LessonContentSkeleton, LessonNoteSkeleton } from "@/app/ui/skeleton/lesson";
import { CurriculumSkeleton } from "@/app/ui/skeleton/course-detail";
import { NotFound } from "@/app/ui/lesson/not-found";
import Link from "next/link";
import { ScrollToTop } from "@/app/ui/scroll-to-top";


export default async function LessonDetailPage(props: { params: Promise<{ courseId: string, lessonId: string }> }) {
  const session = await auth();
  const userId = session?.user?.id;
  const userRole = (session?.user as any)?.role;
  const { courseId, lessonId } = await props.params;

  if (!userId) {
    return notFound();
  }

  const lesson = await getLessonDetail(Number(lessonId), userId);

  if (!lesson) {
    return <NotFound courseId={courseId} />
  }

  // Chặn user thường truy cập lesson của course chưa published
  const courseStatus = await getCourseStatus(Number(courseId));
  if (courseStatus !== 'published' && userRole !== 'admin') {
    return <NotFound courseId={courseId} />
  }

  // Chặn user thường truy cập lesson chưa published
  if (lesson.status !== 'published' && userRole !== 'admin') {
    return <NotFound courseId={courseId} />;
  }

  const curriculum = await getCourseCurriculum(Number(courseId), userId);
  const initialNoteContent = await getLessonNote(Number(lessonId), userId);

  const handleCompleteLesson = async () => {
    "use server";
    return await completeLesson(lessonId, userId);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      {/* Lesson Header */}
      <div className="max-w-7xl mx-auto px-6 pt-5 flex items-center gap-3">
        <Link href={`/dashboard/courses/${lesson.course_id}`} className="text-violet-600 hover:text-violet-700 flex items-center gap-1 mb-4 text-sm font-medium">
          ← Return to {lesson.courseTitle}
        </Link>
      </div>

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

      {/* Scroll to Top button */}
      <ScrollToTop />
    </div>
  );
}
