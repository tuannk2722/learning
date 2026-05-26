import QuizContainer from "@/app/ui/courses/course-detail/lesson-detail/quiz-detail/quiz-container";
import { getQuizByLessonId } from "@/app/lib/data/quiz";
import { submitQuiz } from "@/app/lib/actions/quiz";
import { getNextLessonId } from "@/app/lib/data/lessons";
import { NotFound } from "@/app/ui/courses/course-detail/lesson-detail/quiz-detail/result-detail/not-found";

export default async function QuizPage(props: { params: Promise<{ courseId: string, lessonId: string }> }) {
  const params = await props.params;
  const { courseId, lessonId } = params;

  const quizData = await getQuizByLessonId(Number(lessonId));

  if (!quizData) {
    const nextLessonId = await getNextLessonId(Number(courseId), Number(lessonId));

    return (
      <NotFound courseId={courseId} nextLessonId={nextLessonId} />
    );
  }

  const handleSubmitQuiz = async (answers: { [key: number]: string | number }) => {
    "use server";
    return await submitQuiz(lessonId, answers);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white pt-10 pb-20 px-6 mt-20">
      <QuizContainer
        quiz={quizData}
        courseId={courseId}
        lessonId={lessonId}
        onSubmit={handleSubmitQuiz}
      />
    </div>
  );
}