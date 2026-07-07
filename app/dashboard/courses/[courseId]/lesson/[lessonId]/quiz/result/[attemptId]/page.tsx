import QuizResultsContainer from "@/app/ui/courses/course-detail/lesson-detail/quiz-detail/result-detail/result-container";
import { getNextLessonId } from "@/app/lib/data/lessons";
import { notFound } from "next/navigation";
import { getAttemptById } from "@/app/lib/data/quiz";

type Params = Promise<{ courseId: string; lessonId: string; attemptId: string }>;

export default async function QuizResultsPage(props: { params: Params }) {
  const params = await props.params;

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
