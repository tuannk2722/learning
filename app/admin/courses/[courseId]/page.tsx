import { notFound } from 'next/navigation';
import { getCategory, getCourseForBuilder } from '@/app/lib/data/courses';
import CourseBuilderClient from '@/app/ui/admin/course/course-builder/course-builder-client';
import { colorOptions, iconOptions } from '@/app/ui/admin/course/course-builder/course-types';
import { CourseBuilderResult } from '@/app/lib/definitions/lessons';

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function EditCoursePage({ params }: Props) {
  const { courseId } = await params;
  const course = await getCourseForBuilder(courseId);
  const categories = await getCategory();

  if (!course) return notFound();

  const matchedColor = colorOptions.find(c => c.bg === course.theme_color);

  const initialData: CourseBuilderResult = {
    id: course.id,
    name: course.name,
    description: course.description || '',
    category_id: course.category_id,
    category_name: course.category_name || categories[0].name,
    level: course.level || 'Beginner',
    icon: course.icon || iconOptions[0].name,
    theme_color: matchedColor?.bg || colorOptions[0].bg,
    status: course.status,
    sections: course.sections,
  };

  return <CourseBuilderClient initialData={initialData} categories={categories} />;
}
