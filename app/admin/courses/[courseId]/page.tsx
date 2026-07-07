import { notFound } from 'next/navigation';
import { getCourseForBuilder } from '@/app/lib/data/courses';
import CourseBuilderClient from '@/app/ui/admin/course/course-builder/course-builder-client';
import { iconOptions } from '@/app/ui/admin/course/course-builder/course-types';
import { CourseBuilderResult } from '@/app/lib/definitions/lessons';

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function EditCoursePage({ params }: Props) {
  const { courseId } = await params;
  const course = await getCourseForBuilder(courseId);

  if (!course) return notFound();

  const initialData: CourseBuilderResult = {
    id: course.id,
    name: course.name,
    description: course.description || '',
    category_name: course.category_name || '',
    level: course.level || 'Beginner',
    icon: course.icon || iconOptions[0].name,
    theme_color: course.theme_color || 'blue',
    status: course.status,
    sections: course.sections,
  };

  return <CourseBuilderClient initialData={initialData} />;
}
