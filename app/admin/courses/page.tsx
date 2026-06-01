import CourseHeader from '@/app/ui/admin/course/course-header';
import CourseStats from '@/app/ui/admin/course/course-stats';
import CourseList from '@/app/ui/admin/course/course-list';
import { fetchAllCourses } from '@/app/lib/data/courses';

export default async function CourseManagementPage() {
  const courses = await fetchAllCourses();

  const publishedCourses = courses.filter((course) => course.status === 'published');
  const draftCourses = courses.filter((course) => course.status === 'draft');
  const totalEnrollments = courses.reduce((sum, course) => sum + (course.enrolled_count || 0), 0);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <CourseHeader />

        <CourseStats
          totalCourses={courses.length}
          published={publishedCourses.length}
          draft={draftCourses.length}
          totalEnrollments={totalEnrollments}
        />

        <CourseList
          initialCourses={courses}
        />
      </div>
    </div>
  );
}
