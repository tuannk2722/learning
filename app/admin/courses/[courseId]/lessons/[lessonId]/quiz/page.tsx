import QuizBuilderClient from '@/app/ui/admin/quiz-builder/quiz-builder-client';

interface Props {
  params: { courseId: string; lessonId: string };
}

export default async function QuizBuilderPage({ params }: Props) {
  const { courseId, lessonId } = params;

  // TODO: Thay bằng fetch thật khi có DB
  // const quiz = await getQuizByLessonId(lessonId);

  return (
    <QuizBuilderClient
      courseId={courseId}
      lessonId={lessonId}
      // initialQuizData={quiz.data}
      // initialQuestions={quiz.questions}
    />
  );
}
