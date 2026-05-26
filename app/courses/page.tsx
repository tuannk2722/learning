import { fetchAllCourses } from "../lib/data/courses";
import { CourseListContainer } from "../ui/courses/list-container";

export default async function AllCoursesPage() {
  const courses = await fetchAllCourses();

  const publishedCourses = courses.filter(course => course.status == 'published');

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <CourseListContainer initialCourses={publishedCourses} />
    </div>
  );
}