import { fetchAllCourses } from "../lib/data/courses";
import { CourseListContainer } from "../ui/courses/list-container";
import { getTopCategory } from "../lib/data/courses";

export default async function AllCoursesPage() {
  const courses = await fetchAllCourses({ status: 'published' });
  const categories = await getTopCategory();

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <CourseListContainer initialCourses={courses} categories={categories} />
    </div>
  );
}