import { getLessonById } from '@/app/lib/data/lessons';
import { parseLessonBlocks } from '@/app/lib/definitions/lessons';
import LessonBuilderClient from '@/app/ui/admin/lesson-builder/lesson-builder-client';

interface Props {
  params: Promise<{ courseId: string; lessonId: string }>;
}

export default async function LessonBuilderPage({ params }: Props) {
  const { courseId, lessonId } = await params;

  const lesson = await getLessonById(Number(lessonId));

  if (!lesson) {
    return <div>Lesson not found</div>;
  }

  const initialLesson = {
    title: lesson.title,
    xp: lesson.xp_reward || 0,
    estimate_time: lesson.duration_minutes || 0,
  };

  const dbBlocks = parseLessonBlocks(lesson.blocks);
  const initialBlocks = dbBlocks.length > 0 ? dbBlocks : [];

  return (
    <LessonBuilderClient
      courseId={courseId}
      lessonId={lessonId}
      initialLesson={initialLesson}
      initialBlocks={initialBlocks}
    />
  );
}
