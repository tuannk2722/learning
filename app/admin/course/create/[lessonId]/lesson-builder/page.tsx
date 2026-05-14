import LessonBuilderClient from '@/app/ui/admin/lesson-builder/lesson-builder-client';

export default async function LessonBuilderPage() {
  // GIẢ LẬP FETCH DATA TỪ DATABASE
  // const lesson = await getLesson(lessonId);

  const initialLesson = {
    title: 'Introduction to Derivatives',
    description: 'Learn the fundamental concepts of derivatives in calculus.',
    xp: 150,
    estimate_time: 20
  };

  const initialBlocks = [
    { id: '1', type: 'text' as const, content: '# What is a Derivative?\nIn calculus, a derivative represents the rate of change of a function with respect to a variable.' },
    { id: '2', type: 'video' as const, content: 'https://www.youtube.com/watch?v=9vKqVkMQHKk' }
  ];

  return (
    <LessonBuilderClient
      initialLesson={initialLesson}
      initialBlocks={initialBlocks}
    />
  );
}
