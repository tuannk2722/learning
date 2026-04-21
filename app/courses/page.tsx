import { fetchAllCourses } from "../lib/data/courses";
import { CourseListContainer } from "../ui/courses/list-container";

export default async function AllCoursesPage() {
  const courses = await fetchAllCourses();
  console.log(courses);

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <CourseListContainer initialCourses={courses} />
    </div>
  );
}