import CourseHeader from '@/app/ui/admin/course/course-header';
import CourseStats from '@/app/ui/admin/course/course-stats';
import CourseList from '@/app/ui/admin/course/course-list';
import { coursesData } from '@/app/lib/data/mock-data';

export default async function CourseManagementPage() {

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <CourseHeader />

        <CourseStats
          totalCourses="156"
          published="142"
          draft="12"
          totalEnrollments="45,234"
        />

        <CourseList initialCourses={coursesData} />
      </div>
    </div>
  );
}
