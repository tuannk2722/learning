import QuizResultsContainer from "@/app/ui/result/result-container";
import { getNextLessonId } from "@/app/lib/data/lessons";
import { notFound } from "next/navigation";
import { getAttemptById } from "@/app/lib/data/quiz";
import { auth } from "@/auth";
import { getCourseStatus } from "@/app/lib/data/courses";

type Params = Promise<{ courseId: string; lessonId: string; attemptId: string }>;

export default async function QuizResultsPage(props: { params: Params }) {
  const params = await props.params;

  const session = await auth();
  const userRole = (session?.user as any)?.role;

  // Chặn user thường truy cập kết quả quiz của course chưa published
  const courseStatus = await getCourseStatus(Number(params.courseId));
  if (courseStatus !== 'published' && userRole !== 'admin') {
    return notFound();
  }

  const attempt = await getAttemptById(Number(params.attemptId));

  if (!attempt) {
    return notFound();
  }

  const nextLessonId = await getNextLessonId(
    Number(params.courseId),
    Number(params.lessonId)
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 to-white pt-20 pb-20 px-6">
      <QuizResultsContainer
        courseId={params.courseId}
        lessonId={params.lessonId}
        nextLessonId={nextLessonId}
        score={attempt.score}
        total={attempt.total}
        xpEarned={attempt.xpEarned}
        passed={attempt.passed}
        passingScore={attempt.passingScore}
        results={attempt.answers}
      />
    </main>
  );
}
