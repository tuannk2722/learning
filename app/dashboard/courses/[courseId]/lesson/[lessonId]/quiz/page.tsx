import QuizContainer from "@/app/ui/quiz/quiz-container";
import { getQuizByLessonId } from "@/app/lib/data/quiz";
import { submitQuiz } from "@/app/lib/actions/quiz";
import { getNextLessonId } from "@/app/lib/data/lessons";
import { NotFound } from "@/app/ui/result/not-found";
import { auth } from "@/auth";
import { getCourseStatus } from "@/app/lib/data/courses";

export default async function QuizPage(props: { params: Promise<{ courseId: string, lessonId: string }> }) {
  const params = await props.params;
  const { courseId, lessonId } = params;

  const session = await auth();
  const userRole = (session?.user as any)?.role;

  // Chặn user thường truy cập quiz của course chưa published
  const courseStatus = await getCourseStatus(Number(courseId));
  if (courseStatus !== 'published' && userRole !== 'admin') {
    const nextLessonId = await getNextLessonId(Number(courseId), Number(lessonId));
    return <NotFound courseId={courseId} nextLessonId={nextLessonId} />;
  }

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