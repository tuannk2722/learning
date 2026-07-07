import { getQuizForBuilder } from '@/app/lib/data/quiz';
import QuizBuilderClient from '@/app/ui/admin/quiz-builder/quiz-builder-client';

interface Props {
  params: Promise<{ courseId: string; lessonId: string }>;
}

export default async function QuizBuilderPage({ params }: Props) {
  const { courseId, lessonId } = await params;

  const quizForBuilder = await getQuizForBuilder(Number(lessonId));

  return (
    <QuizBuilderClient
      courseId={courseId}
      lessonId={lessonId}
      quizId={quizForBuilder?.quizId}
      initialTitle={quizForBuilder?.title || 'New Quiz'}
      initialPassingScore={quizForBuilder?.passingScore || 70}
      initialQuestions={quizForBuilder?.questions || []}
    />
  );
}
