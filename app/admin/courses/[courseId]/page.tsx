import CourseBuilderClient from '@/app/ui/admin/course/course-builder/course-builder-client';

interface Props {
  params: { courseId: string };
}

export default async function EditCoursePage({ params }: Props) {
  const { courseId } = params;

  // TODO: Fetch from DB using courseId
  // const course = await getCourseById(courseId);

  return <CourseBuilderClient isNew={false} courseId={courseId} />;
}
