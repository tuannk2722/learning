import { getCategory } from '@/app/lib/data/courses';
import CourseBuilderClient from '@/app/ui/admin/course/course-builder/course-builder-client';

export default async function CreateCoursePage() {
  const categories = await getCategory();

  return <CourseBuilderClient isNew={true} categories={categories} />;
}
