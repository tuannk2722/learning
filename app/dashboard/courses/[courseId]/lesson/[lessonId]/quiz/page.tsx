import QuizContainer from "@/app/ui/courses/course-detail/lesson-detail/quiz-detail/quiz-container";
import { getQuizByLessonId } from "@/app/lib/data/quiz";
import { submitQuiz } from "@/app/lib/actions/quiz";
import { notFound } from "next/navigation";

export default async function QuizPage(props: { params: Promise<{ courseId: string, lessonId: string }> }) {
  const params = await props.params;
  const { courseId, lessonId } = params;

  const quizData = await getQuizByLessonId(Number(lessonId));

  if (!quizData) {
    return notFound();
  }

  const handleSubmitQuiz = async (answers: { [key: number]: string | number }) => {
    "use server";
    return await submitQuiz(lessonId, answers);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-violet-50 to-white pt-10 pb-20 px-6 mt-20">
      <QuizContainer
        quiz={quizData}
        courseId={courseId}
        lessonId={lessonId}
        onSubmit={handleSubmitQuiz}
      />
    </main>
  );
}